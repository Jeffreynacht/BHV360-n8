// Gratis alerting systeem
export class FreeAlertManager {
  private static instance: FreeAlertManager

  static getInstance() {
    if (!FreeAlertManager.instance) {
      FreeAlertManager.instance = new FreeAlertManager()
    }
    return FreeAlertManager.instance
  }

  async sendAlert(message: string, severity: "info" | "warning" | "critical" = "warning") {
    const timestamp = new Date().toLocaleString()
    const alertData = {
      message,
      severity,
      timestamp,
      url: window.location.href,
    }

    // 1. Console logging (altijd beschikbaar)
    const emoji = severity === "critical" ? "🚨" : severity === "warning" ? "⚠️" : "ℹ️"
    console.log(`${emoji} BHV360 Alert [${severity.toUpperCase()}]: ${message}`)

    // 2. Browser notifications (als enabled)
    if (process.env.NEXT_PUBLIC_ENABLE_BROWSER_NOTIFICATIONS === "true") {
      await this.sendBrowserNotification(alertData)
    }

    // 3. Discord webhook (als configured)
    if (process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL) {
      await this.sendDiscordAlert(alertData)
    }

    // 4. Email alert (als configured)
    if (process.env.SMTP_HOST) {
      await this.sendEmailAlert(alertData)
    }
  }

  private async sendBrowserNotification(alert: any) {
    if (!("Notification" in window)) return

    if (Notification.permission === "default") {
      await Notification.requestPermission()
    }

    if (Notification.permission === "granted") {
      new Notification(`BHV360 ${alert.severity.toUpperCase()}`, {
        body: alert.message,
        icon: "/favicon.ico",
        tag: "bhv360-alert",
      })
    }
  }

  private async sendDiscordAlert(alert: any) {
    const webhookUrl = process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL
    if (!webhookUrl) return

    const color = alert.severity === "critical" ? 15158332 : alert.severity === "warning" ? 16776960 : 3447003

    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          embeds: [
            {
              title: `🔔 BHV360 Performance Alert`,
              description: alert.message,
              color,
              fields: [
                { name: "Severity", value: alert.severity.toUpperCase(), inline: true },
                { name: "Time", value: alert.timestamp, inline: true },
                { name: "URL", value: alert.url, inline: false },
              ],
              timestamp: new Date().toISOString(),
            },
          ],
        }),
      })
    } catch (error) {
      console.error("Failed to send Discord alert:", error)
    }
  }

  private async sendEmailAlert(alert: any) {
    try {
      await fetch("/api/alerts/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(alert),
      })
    } catch (error) {
      console.error("Failed to send email alert:", error)
    }
  }
}

// Export singleton
export const freeAlerts = FreeAlertManager.getInstance()
