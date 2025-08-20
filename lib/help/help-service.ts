import type { ModuleGuide } from "./module-guides"

export class HelpService {
  private static readonly STORAGE_KEY = "bhv360_help_progress"
  private static readonly CACHE_KEY = "bhv360_help_cache"

  // Save user progress
  static saveProgress(userId: string, moduleId: string, stepIndex: number, completed = false) {
    const progress = this.getProgress(userId)

    if (!progress[moduleId]) {
      progress[moduleId] = {
        currentStep: 0,
        completedSteps: [],
        completed: false,
        lastAccessed: new Date().toISOString(),
      }
    }

    progress[moduleId].currentStep = stepIndex
    progress[moduleId].lastAccessed = new Date().toISOString()

    if (completed) {
      progress[moduleId].completed = true
      progress[moduleId].completedSteps = Array.from({ length: stepIndex + 1 }, (_, i) => i)
    } else if (!progress[moduleId].completedSteps.includes(stepIndex)) {
      progress[moduleId].completedSteps.push(stepIndex)
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress))
  }

  // Get user progress
  static getProgress(userId: string): Record<string, any> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      return stored ? JSON.parse(stored)[userId] || {} : {}
    } catch {
      return {}
    }
  }

  // Get module progress
  static getModuleProgress(userId: string, moduleId: string) {
    const progress = this.getProgress(userId)
    return (
      progress[moduleId] || {
        currentStep: 0,
        completedSteps: [],
        completed: false,
        lastAccessed: null,
      }
    )
  }

  // Cache guides for offline use
  static cacheGuides(guides: ModuleGuide[]) {
    const cache = {
      guides,
      timestamp: new Date().toISOString(),
      version: "1.0",
    }
    localStorage.setItem(this.CACHE_KEY, JSON.stringify(cache))
  }

  // Get cached guides
  static getCachedGuides(): ModuleGuide[] | null {
    try {
      const cached = localStorage.getItem(this.CACHE_KEY)
      if (cached) {
        const cache = JSON.parse(cached)
        // Check if cache is less than 24 hours old
        const cacheAge = Date.now() - new Date(cache.timestamp).getTime()
        if (cacheAge < 24 * 60 * 60 * 1000) {
          return cache.guides
        }
      }
    } catch {
      // Ignore cache errors
    }
    return null
  }

  // Track help usage analytics
  static trackUsage(event: string, data: Record<string, any> = {}) {
    const analytics = {
      event,
      data,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    }

    // In production, send to analytics service
    console.log("Help Analytics:", analytics)

    // Store locally for offline analysis
    const stored = localStorage.getItem("bhv360_help_analytics") || "[]"
    const events = JSON.parse(stored)
    events.push(analytics)

    // Keep only last 100 events
    if (events.length > 100) {
      events.splice(0, events.length - 100)
    }

    localStorage.setItem("bhv360_help_analytics", JSON.stringify(events))
  }

  // Export user progress for backup
  static exportProgress(userId: string) {
    const progress = this.getProgress(userId)
    const exportData = {
      userId,
      progress,
      exportDate: new Date().toISOString(),
      version: "1.0",
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    })

    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `bhv360-help-progress-${userId}-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Import user progress from backup
  static async importProgress(file: File): Promise<boolean> {
    try {
      const text = await file.text()
      const data = JSON.parse(text)

      if (data.version === "1.0" && data.userId && data.progress) {
        const currentProgress = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || "{}")
        currentProgress[data.userId] = data.progress
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(currentProgress))
        return true
      }
    } catch (error) {
      console.error("Failed to import progress:", error)
    }
    return false
  }
}
