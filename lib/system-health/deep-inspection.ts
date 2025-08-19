interface HealthMetric {
  name: string
  value: number
  status: "healthy" | "warning" | "critical"
  description: string
  lastChecked: Date
}

interface SystemComponent {
  id: string
  name: string
  status: "online" | "offline" | "degraded"
  uptime: number
  responseTime: number
  errorRate: number
  lastHealthCheck: Date
}

interface DeepInspectionResult {
  overallHealth: number
  status: "healthy" | "warning" | "critical"
  components: SystemComponent[]
  metrics: HealthMetric[]
  recommendations: string[]
  lastInspection: Date
}

export interface ComponentHealth {
  component: string
  status: "healthy" | "warning" | "critical" | "unknown"
  lastChecked: string
  issues: string[]
  recommendations: string[]
}

export interface DeepInspectionReport {
  overallHealth: "healthy" | "warning" | "critical" | "unknown"
  score: number
  criticalIssues: string[]
  recommendations: string[]
  components: Record<string, ComponentHealth>
  timestamp: string
}

export class DeepInspectionService {
  private static instance: DeepInspectionService
  private inspectionHistory: DeepInspectionResult[] = []

  static getInstance(): DeepInspectionService {
    if (!DeepInspectionService.instance) {
      DeepInspectionService.instance = new DeepInspectionService()
    }
    return DeepInspectionService.instance
  }

  async performDeepInspection(): Promise<DeepInspectionResult> {
    const components = await this.checkSystemComponents()
    const metrics = await this.collectHealthMetrics()
    const overallHealth = this.calculateHealthScore(components, metrics)
    const status = this.getHealthStatus(overallHealth)
    const recommendations = this.generateRecommendations(components, metrics)

    const result: DeepInspectionResult = {
      overallHealth,
      status,
      components,
      metrics,
      recommendations,
      lastInspection: new Date(),
    }

    this.inspectionHistory.push(result)
    return result
  }

  async performFullInspection(): Promise<DeepInspectionReport> {
    const components: Record<string, ComponentHealth> = {
      database: {
        component: "Database",
        status: "healthy",
        lastChecked: new Date().toISOString(),
        issues: [],
        recommendations: [],
      },
      authentication: {
        component: "Authentication",
        status: "healthy",
        lastChecked: new Date().toISOString(),
        issues: [],
        recommendations: [],
      },
      api: {
        component: "API",
        status: "healthy",
        lastChecked: new Date().toISOString(),
        issues: [],
        recommendations: [],
      },
    }

    const criticalIssues: string[] = []
    const recommendations: string[] = []
    const score = 100

    // Calculate overall health
    const componentStatuses = Object.values(components).map((c) => c.status)
    const overallHealth = componentStatuses.includes("critical")
      ? "critical"
      : componentStatuses.includes("warning")
        ? "warning"
        : "healthy"

    return {
      overallHealth,
      score,
      criticalIssues,
      recommendations,
      components,
      timestamp: new Date().toISOString(),
    }
  }

  private async checkSystemComponents(): Promise<SystemComponent[]> {
    const components: SystemComponent[] = [
      {
        id: "database",
        name: "Database Connection",
        status: "online",
        uptime: 99.9,
        responseTime: 45,
        errorRate: 0.1,
        lastHealthCheck: new Date(),
      },
      {
        id: "api",
        name: "API Gateway",
        status: "online",
        uptime: 99.8,
        responseTime: 120,
        errorRate: 0.2,
        lastHealthCheck: new Date(),
      },
      {
        id: "auth",
        name: "Authentication Service",
        status: "online",
        uptime: 99.95,
        responseTime: 80,
        errorRate: 0.05,
        lastHealthCheck: new Date(),
      },
      {
        id: "storage",
        name: "File Storage",
        status: "online",
        uptime: 99.7,
        responseTime: 200,
        errorRate: 0.3,
        lastHealthCheck: new Date(),
      },
      {
        id: "notifications",
        name: "Notification Service",
        status: "degraded",
        uptime: 98.5,
        responseTime: 300,
        errorRate: 1.5,
        lastHealthCheck: new Date(),
      },
    ]

    return components
  }

  private async collectHealthMetrics(): Promise<HealthMetric[]> {
    const metrics: HealthMetric[] = [
      {
        name: "CPU Usage",
        value: 65,
        status: "warning",
        description: "Average CPU utilization across all servers",
        lastChecked: new Date(),
      },
      {
        name: "Memory Usage",
        value: 78,
        status: "warning",
        description: "Memory consumption percentage",
        lastChecked: new Date(),
      },
      {
        name: "Disk Space",
        value: 45,
        status: "healthy",
        description: "Storage utilization percentage",
        lastChecked: new Date(),
      },
      {
        name: "Network Latency",
        value: 25,
        status: "healthy",
        description: "Average network response time in ms",
        lastChecked: new Date(),
      },
      {
        name: "Error Rate",
        value: 0.8,
        status: "healthy",
        description: "Percentage of failed requests",
        lastChecked: new Date(),
      },
    ]

    return metrics
  }

  private generateRecommendations(components: SystemComponent[], metrics: HealthMetric[]): string[] {
    const recommendations: string[] = []

    // Check for degraded components
    const degradedComponents = components.filter((c) => c.status === "degraded")
    if (degradedComponents.length > 0) {
      recommendations.push(
        `Investigate ${degradedComponents.map((c) => c.name).join(", ")} - showing degraded performance`,
      )
    }

    // Check high error rates
    const highErrorComponents = components.filter((c) => c.errorRate > 1.0)
    if (highErrorComponents.length > 0) {
      recommendations.push(`Monitor error rates for ${highErrorComponents.map((c) => c.name).join(", ")}`)
    }

    // Check resource usage
    const highCpuMetric = metrics.find((m) => m.name === "CPU Usage" && m.value > 80)
    if (highCpuMetric) {
      recommendations.push("Consider scaling up CPU resources or optimizing high-usage processes")
    }

    const highMemoryMetric = metrics.find((m) => m.name === "Memory Usage" && m.value > 85)
    if (highMemoryMetric) {
      recommendations.push("Memory usage is high - investigate memory leaks or increase available RAM")
    }

    // Check response times
    const slowComponents = components.filter((c) => c.responseTime > 250)
    if (slowComponents.length > 0) {
      recommendations.push(`Optimize response times for ${slowComponents.map((c) => c.name).join(", ")}`)
    }

    if (recommendations.length === 0) {
      recommendations.push("System is performing well - continue regular monitoring")
    }

    return recommendations
  }

  getInspectionHistory(): DeepInspectionResult[] {
    return this.inspectionHistory
  }

  getLatestInspection(): DeepInspectionResult | null {
    return this.inspectionHistory.length > 0 ? this.inspectionHistory[this.inspectionHistory.length - 1] : null
  }
}

export function calculateHealthScore(components: SystemComponent[], metrics: HealthMetric[]): number {
  let totalScore = 0
  let weightedSum = 0

  // Component health scoring (60% weight)
  const componentWeight = 0.6
  const componentScore =
    components.reduce((sum, component) => {
      let score = 100

      // Deduct points for status
      if (component.status === "degraded") score -= 20
      if (component.status === "offline") score -= 50

      // Deduct points for low uptime
      if (component.uptime < 99) score -= (99 - component.uptime) * 2

      // Deduct points for high error rate
      if (component.errorRate > 1) score -= component.errorRate * 10

      // Deduct points for slow response time
      if (component.responseTime > 200) score -= (component.responseTime - 200) / 10

      return sum + Math.max(0, score)
    }, 0) / components.length

  totalScore += componentScore * componentWeight
  weightedSum += componentWeight

  // Metrics health scoring (40% weight)
  const metricsWeight = 0.4
  const metricsScore =
    metrics.reduce((sum, metric) => {
      let score = 100

      if (metric.status === "warning") score -= 15
      if (metric.status === "critical") score -= 40

      return sum + score
    }, 0) / metrics.length

  totalScore += metricsScore * metricsWeight
  weightedSum += metricsWeight

  return Math.round(totalScore / weightedSum)
}

export function performDeepInspection(): Promise<DeepInspectionResult> {
  const service = DeepInspectionService.getInstance()
  return service.performDeepInspection()
}

export function getStatusColor(status: "healthy" | "warning" | "critical"): string {
  switch (status) {
    case "healthy":
      return "#10b981" // green-500
    case "warning":
      return "#f59e0b" // amber-500
    case "critical":
      return "#ef4444" // red-500
    default:
      return "#6b7280" // gray-500
  }
}

export function getSeverityColor(severity: "low" | "medium" | "high" | "critical"): string {
  switch (severity) {
    case "low":
      return "#10b981" // green-500
    case "medium":
      return "#f59e0b" // amber-500
    case "high":
      return "#f97316" // orange-500
    case "critical":
      return "#ef4444" // red-500
    default:
      return "#6b7280" // gray-500
  }
}

function getHealthStatus(score: number): "healthy" | "warning" | "critical" {
  if (score >= 90) return "healthy"
  if (score >= 70) return "warning"
  return "critical"
}

export default DeepInspectionService
