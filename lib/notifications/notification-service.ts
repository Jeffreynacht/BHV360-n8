import { supabase } from "@/lib/supabase"

interface NotificationPayload {
  title: string
  body: string
  icon?: string
  badge?: string
  tag?: string
  data?: any
  actions?: Array<{
    action: string
    title: string
    icon?: string
  }>
}

interface PushSubscription {
  endpoint: string
  keys: {
    p256dh: string
    auth: string
  }
}

export class NotificationService {
  private vapidKeys = {
    publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || process.env.VAPID_PUBLIC_KEY!,
    privateKey: process.env.VAPID_PRIVATE_KEY!,
  }

  constructor() {
    if (!this.vapidKeys.publicKey || !this.vapidKeys.privateKey) {
      throw new Error("Missing VAPID keys (VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY)")
    }
  }

  // Register service worker for push notifications
  async registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
    if (!("serviceWorker" in navigator)) {
      console.warn("Service workers are not supported")
      return null
    }

    try {
      const registration = await navigator.serviceWorker.register("/service-worker.js")
      console.log("Service worker registered:", registration)
      return registration
    } catch (error) {
      console.error("Service worker registration failed:", error)
      return null
    }
  }

  // Request notification permission
  async requestPermission(): Promise<NotificationPermission> {
    if (!("Notification" in window)) {
      console.warn("Notifications are not supported")
      return "denied"
    }

    if (Notification.permission === "granted") {
      return "granted"
    }

    if (Notification.permission === "denied") {
      return "denied"
    }

    const permission = await Notification.requestPermission()
    return permission
  }

  // Subscribe to push notifications
  async subscribeToPush(registration: ServiceWorkerRegistration): Promise<PushSubscription | null> {
    try {
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.vapidKeys.publicKey),
      })

      // Convert to our format
      const pushSubscription: PushSubscription = {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: this.arrayBufferToBase64(subscription.getKey("p256dh")!),
          auth: this.arrayBufferToBase64(subscription.getKey("auth")!),
        },
      }

      // Store subscription in database
      await this.storeSubscription(pushSubscription)

      return pushSubscription
    } catch (error) {
      console.error("Push subscription failed:", error)
      return null
    }
  }

  // Store push subscription in database
  private async storeSubscription(subscription: PushSubscription): Promise<void> {
    try {
      const { error } = await supabase.from("push_subscriptions").upsert({
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        user_agent: navigator.userAgent,
        created_at: new Date().toISOString(),
      })

      if (error) {
        console.error("Failed to store push subscription:", error)
      }
    } catch (error) {
      console.error("Database error storing subscription:", error)
    }
  }

  // Send local notification
  async sendLocalNotification(payload: NotificationPayload): Promise<void> {
    const permission = await this.requestPermission()

    if (permission !== "granted") {
      console.warn("Notification permission not granted")
      return
    }

    try {
      const notification = new Notification(payload.title, {
        body: payload.body,
        icon: payload.icon || "/images/bhv360-logo.png",
        badge: payload.badge || "/images/bhv360-logo.png",
        tag: payload.tag,
        data: payload.data,
        actions: payload.actions,
        requireInteraction: true,
        silent: false,
      })

      notification.onclick = (event) => {
        event.preventDefault()
        window.focus()
        if (payload.data?.url) {
          window.open(payload.data.url, "_blank")
        }
        notification.close()
      }
    } catch (error) {
      console.error("Failed to send local notification:", error)
    }
  }

  // Send push notification via API
  async sendPushNotification(
    userIds: string[],
    payload: NotificationPayload,
    options?: {
      urgent?: boolean
      ttl?: number
      topic?: string
    },
  ): Promise<void> {
    try {
      const response = await fetch("/api/notifications/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userIds,
          payload,
          options,
        }),
      })

      if (!response.ok) {
        throw new Error(`Push notification failed: ${response.statusText}`)
      }

      console.log("Push notification sent successfully")
    } catch (error) {
      console.error("Failed to send push notification:", error)
    }
  }

  // Send bulk notifications
  async sendBulkNotifications(
    notifications: Array<{
      userIds: string[]
      payload: NotificationPayload
      options?: any
    }>,
  ): Promise<void> {
    try {
      const response = await fetch("/api/notifications/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notifications }),
      })

      if (!response.ok) {
        throw new Error(`Bulk notification failed: ${response.statusText}`)
      }

      console.log("Bulk notifications sent successfully")
    } catch (error) {
      console.error("Failed to send bulk notifications:", error)
    }
  }

  // Emergency alert
  async sendEmergencyAlert(message: string, location?: string, customerId?: number): Promise<void> {
    const payload: NotificationPayload = {
      title: "🚨 NOODSITUATIE",
      body: message + (location ? ` - Locatie: ${location}` : ""),
      icon: "/images/emergency-alert.png",
      badge: "/images/emergency-badge.png",
      tag: "emergency",
      data: {
        type: "emergency",
        location,
        customerId,
        timestamp: new Date().toISOString(),
        url: "/incidenten",
      },
      actions: [
        {
          action: "view",
          title: "Bekijk Details",
          icon: "/images/view-icon.png",
        },
        {
          action: "acknowledge",
          title: "Bevestig Ontvangst",
          icon: "/images/check-icon.png",
        },
      ],
    }

    // Send to all users if no customerId specified
    const userIds = customerId ? [`customer_${customerId}`] : ["all"]

    await Promise.all([
      this.sendLocalNotification(payload),
      this.sendPushNotification(userIds, payload, {
        urgent: true,
        ttl: 3600, // 1 hour
        topic: "emergency",
      }),
    ])
  }

  // BHV team notification
  async notifyBHVTeam(message: string, incidentId?: string, customerId?: number): Promise<void> {
    const payload: NotificationPayload = {
      title: "BHV Melding",
      body: message,
      icon: "/images/bhv-helmet.png",
      tag: "bhv-notification",
      data: {
        type: "bhv",
        incidentId,
        customerId,
        url: incidentId ? `/incidenten/${incidentId}` : "/bhv",
      },
    }

    const userIds = customerId ? [`bhv_team_${customerId}`] : ["bhv_team"]

    await this.sendPushNotification(userIds, payload, {
      urgent: false,
      ttl: 7200, // 2 hours
      topic: "bhv",
    })
  }

  // Inspection reminder
  async sendInspectionReminder(facilityName: string, dueDate: string, userId: string): Promise<void> {
    const payload: NotificationPayload = {
      title: "Inspectie Herinnering",
      body: `${facilityName} moet geïnspecteerd worden voor ${dueDate}`,
      icon: "/images/inspection-icon.png",
      tag: "inspection-reminder",
      data: {
        type: "inspection",
        facilityName,
        dueDate,
        url: "/beheer/inspectierapporten",
      },
    }

    await this.sendPushNotification([userId], payload, {
      urgent: false,
      ttl: 86400, // 24 hours
      topic: "inspections",
    })
  }

  // Utility functions
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer)
    let binary = ""
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return window.btoa(binary)
  }
}

// Export singleton instance
export const notificationService = new NotificationService()

// Export types
export type { NotificationPayload, PushSubscription }
