import { toast } from "@/hooks/use-toast"

export interface NotificationOptions {
  title: string
  body: string
  icon?: string
  badge?: string
  tag?: string
  requireInteraction?: boolean
  actions?: NotificationAction[]
  data?: any
  silent?: boolean
  vibrate?: number[]
}

export interface NotificationAction {
  action: string
  title: string
  icon?: string
}

export class NotificationService {
  private static instance: NotificationService
  private registration: ServiceWorkerRegistration | null = null
  private vapidPublicKey: string

  private constructor() {
    this.vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ""
    if (!this.vapidPublicKey) {
      console.warn("VAPID public key not found. Push notifications will not work.")
    }
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService()
    }
    return NotificationService.instance
  }

  public async initialize(): Promise<boolean> {
    if (!("serviceWorker" in navigator) || !("Notification" in window)) {
      console.warn("Service Worker or Notifications not supported")
      return false
    }

    try {
      this.registration = await navigator.serviceWorker.register("/service-worker.js")
      console.log("Service Worker registered successfully")
      return true
    } catch (error) {
      console.error("Service Worker registration failed:", error)
      return false
    }
  }

  public async requestPermission(): Promise<NotificationPermission> {
    if (!("Notification" in window)) {
      console.warn("Notifications not supported")
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

  public async subscribeToPush(): Promise<PushSubscription | null> {
    if (!this.registration || !this.vapidPublicKey) {
      console.error("Service Worker not registered or VAPID key missing")
      return null
    }

    try {
      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey),
      })

      // Send subscription to server
      await fetch("/api/push/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subscription),
      })

      return subscription
    } catch (error) {
      console.error("Push subscription failed:", error)
      return null
    }
  }

  public async showNotification(options: NotificationOptions): Promise<void> {
    const permission = await this.requestPermission()

    if (permission !== "granted") {
      // Fallback to toast notification
      toast({
        title: options.title,
        description: options.body,
        duration: 5000,
      })
      return
    }

    if (!this.registration) {
      // Fallback to browser notification
      new Notification(options.title, {
        body: options.body,
        icon: options.icon || "/images/bhv360-logo.png",
        badge: options.badge || "/images/bhv360-logo.png",
        tag: options.tag,
        requireInteraction: options.requireInteraction || false,
        silent: options.silent || false,
        vibrate: options.vibrate || [200, 100, 200],
        data: options.data,
      })
      return
    }

    // Use Service Worker notification
    await this.registration.showNotification(options.title, {
      body: options.body,
      icon: options.icon || "/images/bhv360-logo.png",
      badge: options.badge || "/images/bhv360-logo.png",
      tag: options.tag,
      requireInteraction: options.requireInteraction || false,
      actions: options.actions || [],
      data: options.data,
      silent: options.silent || false,
      vibrate: options.vibrate || [200, 100, 200],
    })
  }

  public async sendEmergencyAlert(message: string, location?: string): Promise<void> {
    const emergencyOptions: NotificationOptions = {
      title: "🚨 NOODMELDING - BHV360",
      body: `${message}${location ? ` - Locatie: ${location}` : ""}`,
      icon: "/images/emergency-alert.png",
      badge: "/images/bhv360-logo.png",
      tag: "emergency-alert",
      requireInteraction: true,
      vibrate: [300, 100, 300, 100, 300],
      actions: [
        {
          action: "acknowledge",
          title: "Bevestigen",
          icon: "/images/check-icon.png",
        },
        {
          action: "respond",
          title: "Reageren",
          icon: "/images/respond-icon.png",
        },
      ],
      data: {
        type: "emergency",
        timestamp: new Date().toISOString(),
        location: location,
      },
    }

    await this.showNotification(emergencyOptions)

    // Also send to server for logging
    try {
      await fetch("/api/emergency/alert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          location,
          timestamp: new Date().toISOString(),
        }),
      })
    } catch (error) {
      console.error("Failed to log emergency alert:", error)
    }
  }

  public async sendBHVAlert(bhvMember: string, incident: string, location: string): Promise<void> {
    const bhvOptions: NotificationOptions = {
      title: `🚨 BHV Oproep - ${bhvMember}`,
      body: `Incident: ${incident} - Locatie: ${location}`,
      icon: "/images/bhv-helmet.png",
      badge: "/images/bhv360-logo.png",
      tag: "bhv-alert",
      requireInteraction: true,
      vibrate: [200, 100, 200, 100, 200],
      actions: [
        {
          action: "accept",
          title: "Accepteren",
          icon: "/images/accept-icon.png",
        },
        {
          action: "decline",
          title: "Afwijzen",
          icon: "/images/decline-icon.png",
        },
      ],
      data: {
        type: "bhv-alert",
        bhvMember,
        incident,
        location,
        timestamp: new Date().toISOString(),
      },
    }

    await this.showNotification(bhvOptions)
  }

  public async sendEvacuationAlert(building: string, exitRoutes: string[]): Promise<void> {
    const evacuationOptions: NotificationOptions = {
      title: "🚨 EVACUATIE ALARM",
      body: `Evacueer ${building} onmiddellijk. Gebruik uitgangen: ${exitRoutes.join(", ")}`,
      icon: "/images/evacuation-arrow-green.png",
      badge: "/images/bhv360-logo.png",
      tag: "evacuation-alert",
      requireInteraction: true,
      vibrate: [500, 200, 500, 200, 500],
      actions: [
        {
          action: "evacuating",
          title: "Aan het evacueren",
          icon: "/images/evacuating-icon.png",
        },
        {
          action: "safe",
          title: "Veilig buiten",
          icon: "/images/safe-icon.png",
        },
      ],
      data: {
        type: "evacuation",
        building,
        exitRoutes,
        timestamp: new Date().toISOString(),
      },
    }

    await this.showNotification(evacuationOptions)
  }

  public async sendMaintenanceReminder(equipment: string, dueDate: string): Promise<void> {
    const maintenanceOptions: NotificationOptions = {
      title: "🔧 Onderhoud Herinnering",
      body: `${equipment} heeft onderhoud nodig voor ${dueDate}`,
      icon: "/images/maintenance-icon.png",
      badge: "/images/bhv360-logo.png",
      tag: "maintenance-reminder",
      requireInteraction: false,
      actions: [
        {
          action: "schedule",
          title: "Inplannen",
          icon: "/images/calendar-icon.png",
        },
        {
          action: "completed",
          title: "Voltooid",
          icon: "/images/check-icon.png",
        },
      ],
      data: {
        type: "maintenance",
        equipment,
        dueDate,
        timestamp: new Date().toISOString(),
      },
    }

    await this.showNotification(maintenanceOptions)
  }

  public async sendTrainingReminder(training: string, date: string): Promise<void> {
    const trainingOptions: NotificationOptions = {
      title: "📚 Training Herinnering",
      body: `BHV Training "${training}" op ${date}`,
      icon: "/images/training-icon.png",
      badge: "/images/bhv360-logo.png",
      tag: "training-reminder",
      requireInteraction: false,
      actions: [
        {
          action: "confirm",
          title: "Bevestigen",
          icon: "/images/confirm-icon.png",
        },
        {
          action: "reschedule",
          title: "Herplannen",
          icon: "/images/reschedule-icon.png",
        },
      ],
      data: {
        type: "training",
        training,
        date,
        timestamp: new Date().toISOString(),
      },
    }

    await this.showNotification(trainingOptions)
  }

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

  public async clearAllNotifications(): Promise<void> {
    if (!this.registration) return

    const notifications = await this.registration.getNotifications()
    notifications.forEach((notification) => notification.close())
  }

  public async clearNotificationsByTag(tag: string): Promise<void> {
    if (!this.registration) return

    const notifications = await this.registration.getNotifications({ tag })
    notifications.forEach((notification) => notification.close())
  }

  public isSupported(): boolean {
    return "serviceWorker" in navigator && "Notification" in window && "PushManager" in window
  }

  public getPermissionStatus(): NotificationPermission {
    return Notification.permission
  }
}

// Export singleton instance
export const notificationService = NotificationService.getInstance()

// Export utility functions
export const showToast = (title: string, description: string, duration = 5000) => {
  toast({
    title,
    description,
    duration,
  })
}

export const showErrorToast = (message: string) => {
  toast({
    title: "Fout",
    description: message,
    variant: "destructive",
    duration: 5000,
  })
}

export const showSuccessToast = (message: string) => {
  toast({
    title: "Gelukt",
    description: message,
    duration: 3000,
  })
}
