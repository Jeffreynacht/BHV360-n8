export class BrowserAlerts {
  private permission: NotificationPermission = "default"
  private isSupported = false

  constructor() {
    if (typeof window !== "undefined") {
      this.isSupported = "Notification" in window
      this.permission = this.isSupported ? Notification.permission : "denied"
    }
  }

  async requestPermission(): Promise<boolean> {
    if (!this.isSupported) {
      console.warn("Browser notifications are not supported")
      return false
    }

    if (this.permission === "granted") {
      return true
    }

    try {
      const permission = await Notification.requestPermission()
      this.permission = permission
      return permission === "granted"
    } catch (error) {
      console.error("Failed to request notification permission:", error)
      return false
    }
  }

  async sendAlert(message: string, severity: "info" | "warning" | "critical" = "info"): Promise<void> {
    // Always log to console
    const logMethod = severity === "critical" ? "error" : severity === "warning" ? "warn" : "log"
    console[logMethod](`[${severity.toUpperCase()}] ${message}`)

    // Try browser notification if supported and permitted
    if (this.isSupported && this.permission === "granted") {
      try {
        const title =
          severity === "critical"
            ? "🚨 BHV360 Critical Alert"
            : severity === "warning"
              ? "⚠️ BHV360 Warning"
              : "ℹ️ BHV360 Info"

        new Notification(title, {
          body: message,
          icon: "/favicon.ico",
          tag: `bhv360-${severity}`,
          requireInteraction: severity === "critical",
          silent: severity === "info",
        })
      } catch (error) {
        console.error("Failed to send browser notification:", error)
      }
    }
  }

  async sendTestAlert(): Promise<void> {
    await this.sendAlert("Test notification - BHV360 monitoring is working! 🎉", "info")
  }

  getPermissionStatus(): NotificationPermission {
    return this.permission
  }

  isNotificationSupported(): boolean {
    return this.isSupported
  }
}

// Export singleton instance
export const browserAlerts = new BrowserAlerts()
