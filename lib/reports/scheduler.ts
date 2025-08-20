interface ScheduledReport {
  id: string
  name: string
  reportType: string
  customerId: string
  schedule: {
    frequency: "daily" | "weekly" | "monthly" | "quarterly"
    dayOfWeek?: number // 0-6 for weekly
    dayOfMonth?: number // 1-31 for monthly
    time: string // HH:MM format
  }
  recipients: string[]
  isActive: boolean
  lastRun?: string
  nextRun: string
  config: {
    includeCharts: boolean
    includeRawData: boolean
    includeRecommendations: boolean
  }
}

export class ReportScheduler {
  private scheduledReports: ScheduledReport[] = []

  addScheduledReport(report: Omit<ScheduledReport, "id" | "nextRun">): string {
    const id = `scheduled_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const nextRun = this.calculateNextRun(report.schedule)

    const scheduledReport: ScheduledReport = {
      ...report,
      id,
      nextRun,
    }

    this.scheduledReports.push(scheduledReport)
    this.saveToStorage()

    return id
  }

  removeScheduledReport(id: string): boolean {
    const index = this.scheduledReports.findIndex((report) => report.id === id)
    if (index > -1) {
      this.scheduledReports.splice(index, 1)
      this.saveToStorage()
      return true
    }
    return false
  }

  updateScheduledReport(id: string, updates: Partial<ScheduledReport>): boolean {
    const report = this.scheduledReports.find((r) => r.id === id)
    if (report) {
      Object.assign(report, updates)
      if (updates.schedule) {
        report.nextRun = this.calculateNextRun(updates.schedule)
      }
      this.saveToStorage()
      return true
    }
    return false
  }

  getScheduledReports(): ScheduledReport[] {
    return [...this.scheduledReports]
  }

  getScheduledReportsByCustomer(customerId: string): ScheduledReport[] {
    return this.scheduledReports.filter((report) => report.customerId === customerId)
  }

  private calculateNextRun(schedule: ScheduledReport["schedule"]): string {
    const now = new Date()
    const [hours, minutes] = schedule.time.split(":").map(Number)

    const nextRun = new Date()
    nextRun.setHours(hours, minutes, 0, 0)

    switch (schedule.frequency) {
      case "daily":
        if (nextRun <= now) {
          nextRun.setDate(nextRun.getDate() + 1)
        }
        break

      case "weekly":
        const targetDay = schedule.dayOfWeek ?? 1 // Default to Monday
        const currentDay = nextRun.getDay()
        let daysUntilTarget = targetDay - currentDay

        if (daysUntilTarget <= 0 || (daysUntilTarget === 0 && nextRun <= now)) {
          daysUntilTarget += 7
        }

        nextRun.setDate(nextRun.getDate() + daysUntilTarget)
        break

      case "monthly":
        const targetDate = schedule.dayOfMonth ?? 1
        nextRun.setDate(targetDate)

        if (nextRun <= now) {
          nextRun.setMonth(nextRun.getMonth() + 1)
        }
        break

      case "quarterly":
        const currentMonth = nextRun.getMonth()
        const quarterStartMonth = Math.floor(currentMonth / 3) * 3
        nextRun.setMonth(quarterStartMonth + 3)
        nextRun.setDate(1)
        break
    }

    return nextRun.toISOString()
  }

  private saveToStorage() {
    if (typeof window !== "undefined") {
      localStorage.setItem("scheduledReports", JSON.stringify(this.scheduledReports))
    }
  }

  loadFromStorage() {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("scheduledReports")
      if (stored) {
        this.scheduledReports = JSON.parse(stored)
      }
    }
  }

  // Check for reports that need to be run
  checkPendingReports(): ScheduledReport[] {
    const now = new Date().toISOString()
    return this.scheduledReports.filter((report) => report.isActive && report.nextRun <= now)
  }

  markReportAsRun(id: string) {
    const report = this.scheduledReports.find((r) => r.id === id)
    if (report) {
      report.lastRun = new Date().toISOString()
      report.nextRun = this.calculateNextRun(report.schedule)
      this.saveToStorage()
    }
  }
}

export const reportScheduler = new ReportScheduler()
