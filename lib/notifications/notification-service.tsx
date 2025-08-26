export interface NotificationChannel {
  type: "push" | "email" | "sms" | "webhook"
  enabled: boolean
  config: Record<string, any>
}

export interface NotificationPreferences {
  userId: string
  channels: NotificationChannel[]
  emergencyBypass: boolean // Bypass Do Not Disturb for emergencies
  quietHours: {
    enabled: boolean
    start: string // HH:MM format
    end: string
  }
  categories: {
    emergency: boolean
    incidents: boolean
    training: boolean
    maintenance: boolean
    system: boolean
  }
}

export interface NotificationTemplate {
  id: string
  name: string
  category: "emergency" | "incident" | "training" | "maintenance" | "system"
  channels: string[]
  subject: string
  body: string
  priority: "low" | "normal" | "high" | "critical"
  variables: string[] // Template variables like {{userName}}, {{location}}
}

export interface NotificationPayload {
  id: string
  templateId?: string
  userId: string
  title: string
  body: string
  category: string
  priority: "low" | "normal" | "high" | "critical"
  data?: Record<string, any>
  scheduledFor?: Date
  expiresAt?: Date
  channels?: string[]
}

export class NotificationService {
  private static instance: NotificationService
  private vapidKeys = {
    publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || process.env.VAPID_PUBLIC_KEY!,
    privateKey: process.env.VAPID_PRIVATE_KEY!,
  }

  constructor() {
    if (!this.vapidKeys.publicKey || !this.vapidKeys.privateKey) {
      throw new Error("Missing VAPID keys (VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY)")
    }
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService()
    }
    return NotificationService.instance
  }

  // Send notification via all enabled channels
  async sendNotification(payload: NotificationPayload): Promise<{
    success: boolean
    results: { channel: string; success: boolean; error?: string }[]
  }> {
    const preferences = await this.getUserPreferences(payload.userId)
    const results: { channel: string; success: boolean; error?: string }[] = []

    // Check if notification should be sent based on preferences
    if (!this.shouldSendNotification(payload, preferences)) {
      return { success: false, results: [{ channel: "all", success: false, error: "Blocked by user preferences" }] }
    }

    // Determine channels to use
    const channels = payload.channels || preferences.channels.filter((c) => c.enabled).map((c) => c.type)

    // Send via each channel
    for (const channelType of channels) {
      try {
        switch (channelType) {
          case "push":
            await this.sendPushNotification(payload, preferences)
            results.push({ channel: "push", success: true })
            break
          case "email":
            await this.sendEmailNotification(payload, preferences)
            results.push({ channel: "email", success: true })
            break
          case "sms":
            await this.sendSMSNotification(payload, preferences)
            results.push({ channel: "sms", success: true })
            break
          case "webhook":
            await this.sendWebhookNotification(payload, preferences)
            results.push({ channel: "webhook", success: true })
            break
        }
      } catch (error) {
        results.push({
          channel: channelType,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        })
      }
    }

    // Log notification
    await this.logNotification(payload, results)

    return {
      success: results.some((r) => r.success),
      results,
    }
  }

  // Send push notification
  private async sendPushNotification(
    payload: NotificationPayload,
    preferences: NotificationPreferences,
  ): Promise<void> {
    const subscription = await this.getUserPushSubscription(payload.userId)
    if (!subscription) {
      throw new Error("No push subscription found for user")
    }

    const notificationPayload = {
      title: payload.title,
      body: payload.body,
      icon: "/images/bhv360-logo.png",
      badge: "/images/bhv360-logo.png",
      data: {
        id: payload.id,
        category: payload.category,
        priority: payload.priority,
        url: this.getNotificationUrl(payload),
        timestamp: new Date().toISOString(),
        ...payload.data,
      },
      actions: this.getNotificationActions(payload),
      requireInteraction: payload.priority === "critical",
      silent: false,
      tag: payload.category,
      renotify: payload.priority === "critical",
      vibrate: this.getVibrationPattern(payload.priority),
    }

    // Use Web Push library
    const webpush = await import("web-push")
    webpush.setVapidDetails("mailto:info@bhv360.nl", this.vapidKeys.publicKey, this.vapidKeys.privateKey)

    await webpush.sendNotification(subscription, JSON.stringify(notificationPayload))
  }

  // Send email notification
  private async sendEmailNotification(
    payload: NotificationPayload,
    preferences: NotificationPreferences,
  ): Promise<void> {
    const user = await this.getUser(payload.userId)
    if (!user?.email) {
      throw new Error("No email address found for user")
    }

    const template = await this.getEmailTemplate(payload)
    const emailContent = this.processTemplate(template, payload, user)

    const emailPayload = {
      to: user.email,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
      priority: payload.priority,
      headers: {
        "X-BHV360-Notification-ID": payload.id,
        "X-BHV360-Category": payload.category,
        "X-BHV360-Priority": payload.priority,
      },
    }

    await fetch("/api/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(emailPayload),
    })
  }

  // Send SMS notification
  private async sendSMSNotification(payload: NotificationPayload, preferences: NotificationPreferences): Promise<void> {
    const user = await this.getUser(payload.userId)
    if (!user?.phone) {
      throw new Error("No phone number found for user")
    }

    const smsContent = this.formatSMSContent(payload)

    const smsPayload = {
      to: user.phone,
      message: smsContent,
      priority: payload.priority,
    }

    await fetch("/api/sms/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(smsPayload),
    })
  }

  // Send webhook notification
  private async sendWebhookNotification(
    payload: NotificationPayload,
    preferences: NotificationPreferences,
  ): Promise<void> {
    const webhookConfig = preferences.channels.find((c) => c.type === "webhook")?.config
    if (!webhookConfig?.url) {
      throw new Error("No webhook URL configured")
    }

    const webhookPayload = {
      event: "notification",
      notification: payload,
      timestamp: new Date().toISOString(),
      signature: this.generateWebhookSignature(payload),
    }

    await fetch(webhookConfig.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-BHV360-Signature": webhookPayload.signature,
      },
      body: JSON.stringify(webhookPayload),
    })
  }

  // Check if notification should be sent
  private shouldSendNotification(payload: NotificationPayload, preferences: NotificationPreferences): boolean {
    // Check category preferences
    if (!preferences.categories[payload.category as keyof typeof preferences.categories]) {
      return false
    }

    // Check quiet hours (unless emergency bypass is enabled)
    if (preferences.quietHours.enabled && !preferences.emergencyBypass) {
      const now = new Date()
      const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`

      if (currentTime >= preferences.quietHours.start && currentTime <= preferences.quietHours.end) {
        // Allow critical notifications during quiet hours
        return payload.priority === "critical"
      }
    }

    return true
  }

  // Get notification actions based on category
  private getNotificationActions(payload: NotificationPayload): any[] {
    switch (payload.category) {
      case "emergency":
        return [
          { action: "acknowledge", title: "✅ Bevestigen", icon: "/icons/check.png" },
          { action: "respond", title: "🚨 Reageren", icon: "/icons/emergency.png" },
        ]
      case "incident":
        return [
          { action: "view", title: "👁️ Bekijken", icon: "/icons/view.png" },
          { action: "assign", title: "👤 Toewijzen", icon: "/icons/assign.png" },
        ]
      case "training":
        return [
          { action: "enroll", title: "📚 Inschrijven", icon: "/icons/training.png" },
          { action: "schedule", title: "📅 Plannen", icon: "/icons/calendar.png" },
        ]
      default:
        return [{ action: "view", title: "👁️ Bekijken", icon: "/icons/view.png" }]
    }
  }

  // Get vibration pattern based on priority
  private getVibrationPattern(priority: string): number[] {
    switch (priority) {
      case "critical":
        return [200, 100, 200, 100, 200, 100, 200] // Urgent pattern
      case "high":
        return [100, 50, 100, 50, 100] // Important pattern
      case "normal":
        return [100, 50, 100] // Standard pattern
      default:
        return [100] // Simple buzz
    }
  }

  // Get notification URL for deep linking
  private getNotificationUrl(payload: NotificationPayload): string {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.bhv360.nl"

    switch (payload.category) {
      case "emergency":
        return `${baseUrl}/incidents/${payload.data?.incidentId || "emergency"}`
      case "incident":
        return `${baseUrl}/incidents/${payload.data?.incidentId}`
      case "training":
        return `${baseUrl}/training/${payload.data?.trainingId}`
      default:
        return `${baseUrl}/notifications/${payload.id}`
    }
  }

  // Process email template with variables
  private processTemplate(
    template: any,
    payload: NotificationPayload,
    user: any,
  ): { subject: string; html: string; text: string } {
    const variables = {
      userName: user.name,
      userEmail: user.email,
      title: payload.title,
      body: payload.body,
      category: payload.category,
      priority: payload.priority,
      timestamp: new Date().toLocaleString("nl-NL"),
      appUrl: process.env.NEXT_PUBLIC_APP_URL || "https://www.bhv360.nl",
      ...payload.data,
    }

    let subject = template.subject
    let html = template.html
    let text = template.text

    // Replace variables
    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`
      subject = subject.replace(new RegExp(placeholder, "g"), value)
      html = html.replace(new RegExp(placeholder, "g"), value)
      text = text.replace(new RegExp(placeholder, "g"), value)
    })

    return { subject, html, text }
  }

  // Format SMS content
  private formatSMSContent(payload: NotificationPayload): string {
    const prefix = payload.priority === "critical" ? "🚨 URGENT" : "📢 BHV360"
    return `${prefix}: ${payload.title}\n\n${payload.body}\n\nTijd: ${new Date().toLocaleString("nl-NL")}`
  }

  // Generate webhook signature
  private generateWebhookSignature(payload: NotificationPayload): string {
    // In production, use proper HMAC signature
    return `sha256=${Buffer.from(JSON.stringify(payload)).toString("base64")}`
  }

  // Get user preferences (mock implementation)
  private async getUserPreferences(userId: string): Promise<NotificationPreferences> {
    // In production, fetch from database
    return {
      userId,
      channels: [
        { type: "push", enabled: true, config: {} },
        { type: "email", enabled: true, config: {} },
      ],
      emergencyBypass: true,
      quietHours: {
        enabled: true,
        start: "22:00",
        end: "07:00",
      },
      categories: {
        emergency: true,
        incidents: true,
        training: true,
        maintenance: true,
        system: false,
      },
    }
  }

  // Get user push subscription (mock implementation)
  private async getUserPushSubscription(userId: string): Promise<any> {
    // In production, fetch from database
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(`push_subscription_${userId}`)
      return stored ? JSON.parse(stored) : null
    }
    return null
  }

  // Get user data (mock implementation)
  private async getUser(userId: string): Promise<any> {
    // In production, fetch from database
    return {
      id: userId,
      name: "Test Gebruiker",
      email: "test@bhv360.nl",
      phone: "+31612345678",
    }
  }

  // Get email template (mock implementation)
  private async getEmailTemplate(payload: NotificationPayload): Promise<any> {
    return {
      subject: "🚨 BHV360: {{title}}",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #dc2626; color: white; padding: 20px; text-align: center;">
            <h1>🚨 BHV360 Notificatie</h1>
          </div>
          <div style="padding: 20px;">
            <h2>{{title}}</h2>
            <p>{{body}}</p>
            <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <p><strong>Categorie:</strong> {{category}}</p>
              <p><strong>Prioriteit:</strong> {{priority}}</p>
              <p><strong>Tijd:</strong> {{timestamp}}</p>
            </div>
            <div style="text-align: center; margin: 20px 0;">
              <a href="{{appUrl}}" style="background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                Open BHV360 App
              </a>
            </div>
          </div>
        </div>
      `,
      text: "BHV360 Notificatie: {{title}}\n\n{{body}}\n\nCategorie: {{category}}\nPrioriteit: {{priority}}\nTijd: {{timestamp}}",
    }
  }

  // Log notification for audit trail
  private async logNotification(payload: NotificationPayload, results: any[]): Promise<void> {
    const log = {
      id: payload.id,
      userId: payload.userId,
      category: payload.category,
      priority: payload.priority,
      channels: results.map((r) => r.channel),
      success: results.some((r) => r.success),
      timestamp: new Date().toISOString(),
      results,
    }

    // In production, save to database
    console.log("Notification sent:", log)
  }

  // Bulk send notifications
  async sendBulkNotifications(payloads: NotificationPayload[]): Promise<void> {
    const promises = payloads.map((payload) => this.sendNotification(payload))
    await Promise.allSettled(promises)
  }

  // Schedule notification
  async scheduleNotification(payload: NotificationPayload, scheduledFor: Date): Promise<void> {
    const delay = scheduledFor.getTime() - Date.now()

    if (delay <= 0) {
      await this.sendNotification(payload)
    } else {
      setTimeout(async () => {
        await this.sendNotification(payload)
      }, delay)
    }
  }
}

export const notificationService = NotificationService.getInstance()
