interface PerformanceMetrics {
  timestamp: string
  cpu: {
    usage: number
    loadAverage: number[]
  }
  memory: {
    used: number
    total: number
    percentage: number
  }
  disk: {
    used: number
    total: number
    percentage: number
  }
  network: {
    bytesIn: number
    bytesOut: number
  }
  responseTime: {
    average: number
    p95: number
    p99: number
  }
  activeUsers: number
  requestsPerMinute: number
}

interface AlertConfig {
  cpuThreshold: number
  memoryThreshold: number
  diskThreshold: number
  responseTimeThreshold: number
  slackWebhook?: string
  emailRecipients?: string[]
}

export class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = []
  private alertConfig: AlertConfig
  private lastAlertTime: { [key: string]: number } = {}
  private alertCooldown = 5 * 60 * 1000 // 5 minuten

  constructor(alertConfig: AlertConfig) {
    this.alertConfig = alertConfig
  }

  async collectMetrics(): Promise<PerformanceMetrics> {
    const timestamp = new Date().toISOString()

    // Simuleer realistische system metrics
    const baseLoad = Math.sin(Date.now() / 300000) * 20 + 40 // Oscilleert tussen 20-60%
    const randomVariation = (Math.random() - 0.5) * 20

    const metrics: PerformanceMetrics = {
      timestamp,
      cpu: {
        usage: Math.max(0, Math.min(100, baseLoad + randomVariation)),
        loadAverage: [Math.random() * 2 + 0.5, Math.random() * 2 + 0.5, Math.random() * 2 + 0.5],
      },
      memory: {
        used: Math.random() * 6000000000 + 2000000000, // 2-8GB
        total: 8000000000,
        percentage: Math.max(0, Math.min(100, baseLoad * 0.8 + randomVariation * 0.5)),
      },
      disk: {
        used: Math.random() * 400000000000 + 100000000000, // 100-500GB
        total: 500000000000,
        percentage: Math.max(0, Math.min(100, baseLoad * 0.6 + randomVariation * 0.3)),
      },
      network: {
        bytesIn: Math.random() * 1000000 + 100000,
        bytesOut: Math.random() * 800000 + 80000,
      },
      responseTime: {
        average: Math.max(50, baseLoad * 10 + randomVariation * 5),
        p95: Math.max(100, baseLoad * 15 + randomVariation * 8),
        p99: Math.max(200, baseLoad * 25 + randomVariation * 12),
      },
      activeUsers: Math.floor(Math.random() * 80) + 20,
      requestsPerMinute: Math.floor(Math.random() * 800) + 200,
    }

    // Bewaar metrics
    this.metrics.push(metrics)

    // Houd alleen laatste 24 uur
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000
    this.metrics = this.metrics.filter((m) => new Date(m.timestamp).getTime() > oneDayAgo)

    // Check voor alerts
    await this.checkAlerts(metrics)

    return metrics
  }

  private async checkAlerts(metrics: PerformanceMetrics): Promise<void> {
    const alerts: string[] = []

    // CPU Alert
    if (metrics.cpu.usage > this.alertConfig.cpuThreshold) {
      alerts.push(`🔥 High CPU Usage: ${metrics.cpu.usage.toFixed(1)}%`)
    }

    // Memory Alert
    if (metrics.memory.percentage > this.alertConfig.memoryThreshold) {
      alerts.push(`💾 High Memory Usage: ${metrics.memory.percentage.toFixed(1)}%`)
    }

    // Disk Alert
    if (metrics.disk.percentage > this.alertConfig.diskThreshold) {
      alerts.push(`💿 High Disk Usage: ${metrics.disk.percentage.toFixed(1)}%`)
    }

    // Response Time Alert
    if (metrics.responseTime.average > this.alertConfig.responseTimeThreshold) {
      alerts.push(`⏱️ Slow Response Time: ${metrics.responseTime.average.toFixed(0)}ms`)
    }

    // Verstuur alerts
    for (const alert of alerts) {
      await this.sendAlert(alert, metrics)
    }
  }

  private async sendAlert(message: string, metrics: PerformanceMetrics): Promise<void> {
    const alertKey = message.split(":")[0]
    const now = Date.now()

    // Check cooldown
    if (this.lastAlertTime[alertKey] && now - this.lastAlertTime[alertKey] < this.alertCooldown) {
      return
    }

    this.lastAlertTime[alertKey] = now

    // Browser notifications (client-side only)
    if (typeof window !== "undefined") {
      try {
        const { browserAlerts } = await import("./browser-alerts")
        const severity = message.includes("High") ? "warning" : "info"
        await browserAlerts.sendAlert(message, severity)
      } catch (error) {
        console.warn("Browser alerts not available:", error)
      }
    }

    // Console log
    console.warn(`🚨 PERFORMANCE ALERT: ${message} at ${metrics.timestamp}`)
  }

  getMetricsHistory(hours = 1): PerformanceMetrics[] {
    const cutoff = Date.now() - hours * 60 * 60 * 1000
    return this.metrics.filter((m) => new Date(m.timestamp).getTime() > cutoff)
  }

  getAverageMetrics(hours = 1): Partial<PerformanceMetrics> {
    const history = this.getMetricsHistory(hours)
    if (history.length === 0) return {}

    return {
      cpu: {
        usage: history.reduce((sum, m) => sum + m.cpu.usage, 0) / history.length,
        loadAverage: [0, 0, 0],
      },
      memory: {
        percentage: history.reduce((sum, m) => sum + m.memory.percentage, 0) / history.length,
        used: 0,
        total: 0,
      },
      responseTime: {
        average: history.reduce((sum, m) => sum + m.responseTime.average, 0) / history.length,
        p95: 0,
        p99: 0,
      },
    }
  }

  async recordCustomMetric(name: string, value: number, tags?: Record<string, string>): Promise<void> {
    console.log(`Custom metric recorded: ${name} = ${value}`, tags)
  }

  async getSystemInfo(): Promise<{
    platform: string
    arch: string
    nodeVersion: string
    uptime: number
  }> {
    return {
      platform: process.platform,
      arch: process.arch,
      nodeVersion: process.version,
      uptime: process.uptime(),
    }
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor({
  cpuThreshold: 80,
  memoryThreshold: 85,
  diskThreshold: 90,
  responseTimeThreshold: 1000,
  slackWebhook: process.env.SLACK_WEBHOOK_URL,
  emailRecipients: process.env.BACKUP_NOTIFICATION_EMAIL ? [process.env.BACKUP_NOTIFICATION_EMAIL] : [],
})

// Export types
export type { PerformanceMetrics, AlertConfig }
