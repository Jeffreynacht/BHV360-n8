interface ErrorEvent {
  id: string
  message: string
  stack?: string
  timestamp: string
  level: "error" | "warning" | "info"
  userId?: string
  customerId?: string
  url?: string
  userAgent?: string
  tags?: Record<string, string>
}

interface ErrorGroup {
  id: string
  message: string
  count: number
  firstSeen: string
  lastSeen: string
  level: "error" | "warning" | "info"
  events: ErrorEvent[]
}

export class ErrorTracker {
  private errors: ErrorEvent[] = []
  private groups: Map<string, ErrorGroup> = new Map()

  constructor() {
    if (typeof window !== "undefined") {
      this.setupGlobalErrorHandlers()
    }
  }

  private setupGlobalErrorHandlers() {
    // Catch unhandled errors
    window.addEventListener("error", (event) => {
      this.recordError({
        message: event.message,
        stack: event.error?.stack,
        level: "error",
        url: event.filename,
      })
    })

    // Catch unhandled promise rejections
    window.addEventListener("unhandledrejection", (event) => {
      this.recordError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        level: "error",
      })
    })
  }

  recordError(error: Partial<ErrorEvent>): string {
    const errorEvent: ErrorEvent = {
      id: this.generateId(),
      message: error.message || "Unknown error",
      stack: error.stack,
      timestamp: new Date().toISOString(),
      level: error.level || "error",
      userId: error.userId,
      customerId: error.customerId,
      url: error.url || (typeof window !== "undefined" ? window.location.href : undefined),
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
      tags: error.tags,
    }

    this.errors.push(errorEvent)
    this.groupError(errorEvent)

    // Keep only last 1000 errors
    if (this.errors.length > 1000) {
      this.errors = this.errors.slice(-1000)
    }

    // Send alert for critical errors
    if (errorEvent.level === "error") {
      this.sendErrorAlert(errorEvent)
    }

    return errorEvent.id
  }

  private groupError(error: ErrorEvent) {
    const groupKey = this.getGroupKey(error)
    const existing = this.groups.get(groupKey)

    if (existing) {
      existing.count++
      existing.lastSeen = error.timestamp
      existing.events.push(error)

      // Keep only last 10 events per group
      if (existing.events.length > 10) {
        existing.events = existing.events.slice(-10)
      }
    } else {
      this.groups.set(groupKey, {
        id: groupKey,
        message: error.message,
        count: 1,
        firstSeen: error.timestamp,
        lastSeen: error.timestamp,
        level: error.level,
        events: [error],
      })
    }
  }

  private getGroupKey(error: ErrorEvent): string {
    // Group by message and first line of stack trace
    const stackLine = error.stack?.split("\n")[1] || ""
    return `${error.message}-${stackLine}`.replace(/[^a-zA-Z0-9]/g, "-").substring(0, 50)
  }

  private generateId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private async sendErrorAlert(error: ErrorEvent) {
    try {
      if (typeof window !== "undefined") {
        const { browserAlerts } = await import("./browser-alerts")
        await browserAlerts.sendAlert(`Error: ${error.message.substring(0, 100)}`, "critical")
      }
    } catch (alertError) {
      console.warn("Failed to send error alert:", alertError)
    }
  }

  getRecentErrors(limit = 50): ErrorEvent[] {
    return this.errors.slice(-limit).reverse()
  }

  getErrorGroups(): ErrorGroup[] {
    return Array.from(this.groups.values()).sort(
      (a, b) => new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime(),
    )
  }

  getErrorStats() {
    const now = Date.now()
    const oneHourAgo = now - 60 * 60 * 1000
    const oneDayAgo = now - 24 * 60 * 60 * 1000

    const recentErrors = this.errors.filter((e) => new Date(e.timestamp).getTime() > oneHourAgo)
    const dailyErrors = this.errors.filter((e) => new Date(e.timestamp).getTime() > oneDayAgo)

    return {
      total: this.errors.length,
      lastHour: recentErrors.length,
      lastDay: dailyErrors.length,
      groups: this.groups.size,
      criticalLastHour: recentErrors.filter((e) => e.level === "error").length,
    }
  }
}

// Export singleton instance
export const errorTracker = new ErrorTracker()
