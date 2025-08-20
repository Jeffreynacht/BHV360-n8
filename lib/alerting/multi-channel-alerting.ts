export interface AlertChannel {
  type: "push" | "sms" | "voice" | "email" | "desktop" | "webhook"
  enabled: boolean
  priority: number // 1 = highest priority
  config: Record<string, any>
}

export interface AlertRecipient {
  id: string
  name: string
  phone?: string
  email?: string
  pushToken?: string
  channels: AlertChannel[]
  escalationDelay: number // seconds
  bypassSilentMode: boolean
}

export interface AlertMessage {
  id: string
  title: string
  body: string
  priority: "low" | "normal" | "high" | "critical" | "emergency"
  scenario?: string
  location?: {
    building: string
    floor: string
    zone: string
    coordinates?: { lat: number; lng: number }
  }
  media?: {
    photos: string[]
    videos: string[]
    audio: string[]
  }
  metadata: Record<string, any>
  timestamp: string
  expiresAt?: string
}

export interface AlertDelivery {
  messageId: string
  recipientId: string
  channel: string
  status: "pending" | "sent" | "delivered" | "failed" | "acknowledged"
  sentAt?: string
  deliveredAt?: string
  acknowledgedAt?: string
  failureReason?: string
  retryCount: number
}

export class MultiChannelAlertingService {
  private deliveries: Map<string, AlertDelivery[]> = new Map()
  private escalationTimers: Map<string, NodeJS.Timeout> = new Map()

  // Send alert via all configured channels
  async sendAlert(message: AlertMessage, recipients: AlertRecipient[]): Promise<string[]> {
    const deliveryIds: string[] = []

    for (const recipient of recipients) {
      // Sort channels by priority
      const sortedChannels = recipient.channels.filter((c) => c.enabled).sort((a, b) => a.priority - b.priority)

      for (const channel of sortedChannels) {
        const deliveryId = await this.sendViaChannel(message, recipient, channel)
        deliveryIds.push(deliveryId)

        // Set up escalation timer if not acknowledged
        if (recipient.escalationDelay > 0) {
          this.setupEscalationTimer(message, recipient, deliveryId)
        }
      }
    }

    return deliveryIds
  }

  // Send via specific channel
  private async sendViaChannel(
    message: AlertMessage,
    recipient: AlertRecipient,
    channel: AlertChannel,
  ): Promise<string> {
    const deliveryId = `delivery-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const delivery: AlertDelivery = {
      messageId: message.id,
      recipientId: recipient.id,
      channel: channel.type,
      status: "pending",
      retryCount: 0,
    }

    try {
      switch (channel.type) {
        case "push":
          await this.sendPushNotification(message, recipient, channel)
          break
        case "sms":
          await this.sendSMS(message, recipient, channel)
          break
        case "voice":
          await this.makeVoiceCall(message, recipient, channel)
          break
        case "email":
          await this.sendEmail(message, recipient, channel)
          break
        case "desktop":
          await this.sendDesktopNotification(message, recipient, channel)
          break
        case "webhook":
          await this.sendWebhook(message, recipient, channel)
          break
      }

      delivery.status = "sent"
      delivery.sentAt = new Date().toISOString()
    } catch (error) {
      delivery.status = "failed"
      delivery.failureReason = error instanceof Error ? error.message : "Unknown error"
    }

    // Store delivery record
    const messageDeliveries = this.deliveries.get(message.id) || []
    messageDeliveries.push(delivery)
    this.deliveries.set(message.id, messageDeliveries)

    return deliveryId
  }

  // Push notification with silent mode bypass
  private async sendPushNotification(
    message: AlertMessage,
    recipient: AlertRecipient,
    channel: AlertChannel,
  ): Promise<void> {
    if (!recipient.pushToken) throw new Error("No push token available")

    const payload = {
      to: recipient.pushToken,
      title: message.title,
      body: message.body,
      data: {
        messageId: message.id,
        scenario: message.scenario,
        location: message.location,
        priority: message.priority,
        timestamp: message.timestamp,
      },
      android: {
        priority: "high",
        notification: {
          priority: "high",
          defaultSound: true,
          defaultVibrateTimings: true,
          // Bypass Do Not Disturb for critical alerts
          ...(message.priority === "critical" || message.priority === "emergency"
            ? {
                channelId: "emergency",
                importance: "high",
                visibility: "public",
              }
            : {}),
        },
      },
      ios: {
        payload: {
          aps: {
            alert: {
              title: message.title,
              body: message.body,
            },
            sound: "default",
            badge: 1,
            // Critical alerts bypass silent mode
            ...(message.priority === "critical" || message.priority === "emergency"
              ? {
                  "interruption-level": "critical",
                  critical: 1,
                  sound: {
                    critical: 1,
                    name: "emergency.wav",
                    volume: 1.0,
                  },
                }
              : {}),
          },
        },
      },
    }

    await fetch("/api/push-notification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
  }

  // SMS with emergency priority
  private async sendSMS(message: AlertMessage, recipient: AlertRecipient, channel: AlertChannel): Promise<void> {
    if (!recipient.phone) throw new Error("No phone number available")

    const smsBody = `🚨 BHV ALARM 🚨\n${message.title}\n${message.body}\n\nLocatie: ${message.location?.building} - ${message.location?.floor}\nTijd: ${new Date(message.timestamp).toLocaleString("nl-NL")}\n\nReageer via app of bel 112`

    await fetch("/api/sms/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: recipient.phone,
        message: smsBody,
        priority: message.priority,
        messageId: message.id,
      }),
    })
  }

  // Voice call with text-to-speech
  private async makeVoiceCall(message: AlertMessage, recipient: AlertRecipient, channel: AlertChannel): Promise<void> {
    if (!recipient.phone) throw new Error("No phone number available")

    const voiceMessage = `Dit is een automatisch BHV alarm van ${message.location?.building}. ${message.title}. ${message.body}. Druk op 1 om te bevestigen dat u dit bericht heeft ontvangen.`

    await fetch("/api/voice/call", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: recipient.phone,
        message: voiceMessage,
        priority: message.priority,
        messageId: message.id,
        requireConfirmation: true,
      }),
    })
  }

  // Email with rich content
  private async sendEmail(message: AlertMessage, recipient: AlertRecipient, channel: AlertChannel): Promise<void> {
    if (!recipient.email) throw new Error("No email address available")

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px;">
        <div style="background: #dc2626; color: white; padding: 20px; text-align: center;">
          <h1>🚨 BHV ALARM</h1>
        </div>
        <div style="padding: 20px;">
          <h2>${message.title}</h2>
          <p>${message.body}</p>
          
          ${
            message.location
              ? `
          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h3>Locatie:</h3>
            <p><strong>Gebouw:</strong> ${message.location.building}</p>
            <p><strong>Verdieping:</strong> ${message.location.floor}</p>
            <p><strong>Zone:</strong> ${message.location.zone}</p>
          </div>
          `
              : ""
          }
          
          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Tijd:</strong> ${new Date(message.timestamp).toLocaleString("nl-NL")}</p>
            <p><strong>Prioriteit:</strong> ${message.priority.toUpperCase()}</p>
          </div>
          
          ${
            message.media?.photos?.length
              ? `
          <div style="margin: 15px 0;">
            <h3>Bijgevoegde foto's:</h3>
            ${message.media.photos.map((photo) => `<img src="${photo}" style="max-width: 100%; margin: 5px 0;" />`).join("")}
          </div>
          `
              : ""
          }
          
          <div style="text-align: center; margin: 20px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/incidents/${message.id}" 
               style="background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
              Open in BHV360 App
            </a>
          </div>
        </div>
      </div>
    `

    await fetch("/api/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: recipient.email,
        subject: `🚨 BHV ALARM: ${message.title}`,
        html: emailHtml,
        priority: message.priority,
        messageId: message.id,
      }),
    })
  }

  // Desktop notification
  private async sendDesktopNotification(
    message: AlertMessage,
    recipient: AlertRecipient,
    channel: AlertChannel,
  ): Promise<void> {
    // Send via WebSocket or Server-Sent Events to desktop app
    await fetch("/api/desktop/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipientId: recipient.id,
        title: message.title,
        body: message.body,
        priority: message.priority,
        messageId: message.id,
        requireInteraction: message.priority === "critical" || message.priority === "emergency",
      }),
    })
  }

  // Webhook for external integrations
  private async sendWebhook(message: AlertMessage, recipient: AlertRecipient, channel: AlertChannel): Promise<void> {
    const webhookUrl = channel.config.url
    if (!webhookUrl) throw new Error("No webhook URL configured")

    await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-BHV360-Signature": this.generateWebhookSignature(message),
      },
      body: JSON.stringify({
        event: "alert",
        message,
        recipient: {
          id: recipient.id,
          name: recipient.name,
        },
        timestamp: new Date().toISOString(),
      }),
    })
  }

  // Setup escalation timer
  private setupEscalationTimer(message: AlertMessage, recipient: AlertRecipient, deliveryId: string): void {
    const timer = setTimeout(async () => {
      const delivery = this.getDelivery(deliveryId)
      if (delivery && delivery.status !== "acknowledged") {
        // Escalate to next level or repeat alert
        await this.escalateAlert(message, recipient)
      }
    }, recipient.escalationDelay * 1000)

    this.escalationTimers.set(deliveryId, timer)
  }

  // Escalate alert to supervisor or repeat
  private async escalateAlert(message: AlertMessage, recipient: AlertRecipient): Promise<void> {
    // Implementation for escalation logic
    console.log(`Escalating alert ${message.id} for recipient ${recipient.id}`)
  }

  // Acknowledge alert
  async acknowledgeAlert(messageId: string, recipientId: string, deliveryId: string): Promise<void> {
    const delivery = this.getDelivery(deliveryId)
    if (delivery) {
      delivery.status = "acknowledged"
      delivery.acknowledgedAt = new Date().toISOString()

      // Clear escalation timer
      const timer = this.escalationTimers.get(deliveryId)
      if (timer) {
        clearTimeout(timer)
        this.escalationTimers.delete(deliveryId)
      }
    }
  }

  // Get delivery status
  private getDelivery(deliveryId: string): AlertDelivery | undefined {
    for (const deliveries of this.deliveries.values()) {
      const delivery = deliveries.find((d) => d.messageId === deliveryId)
      if (delivery) return delivery
    }
    return undefined
  }

  // Generate webhook signature for security
  private generateWebhookSignature(message: AlertMessage): string {
    // Implementation for HMAC signature
    return "sha256=signature"
  }

  // Get alert statistics
  getAlertStats(messageId: string): {
    totalRecipients: number
    sent: number
    delivered: number
    acknowledged: number
    failed: number
  } {
    const deliveries = this.deliveries.get(messageId) || []

    return {
      totalRecipients: new Set(deliveries.map((d) => d.recipientId)).size,
      sent: deliveries.filter((d) => d.status === "sent" || d.status === "delivered").length,
      delivered: deliveries.filter((d) => d.status === "delivered").length,
      acknowledged: deliveries.filter((d) => d.status === "acknowledged").length,
      failed: deliveries.filter((d) => d.status === "failed").length,
    }
  }
}
