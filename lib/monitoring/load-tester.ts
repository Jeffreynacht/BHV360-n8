interface LoadTestConfig {
  concurrentUsers: number
  testDuration: number
  rampUpTime: number
  targetUrl?: string
}

interface LoadTestScenario {
  name: string
  weight: number
  requests: Array<{
    method: string
    path: string
    headers?: Record<string, string>
    body?: any
  }>
}

interface LoadTestResult {
  success: boolean
  totalRequests: number
  successfulRequests: number
  failedRequests: number
  averageResponseTime: number
  maxResponseTime: number
  minResponseTime: number
  requestsPerSecond: number
  scenarios: Array<{
    name: string
    requests: number
    avgResponseTime: number
    successRate: number
  }>
}

export class LoadTester {
  private baseUrl: string
  private scenarios: LoadTestScenario[]

  constructor(baseUrl = "http://localhost:3000") {
    this.baseUrl = baseUrl
    this.scenarios = [
      {
        name: "Dashboard Load",
        weight: 30,
        requests: [
          { method: "GET", path: "/dashboard" },
          { method: "GET", path: "/api/monitoring/metrics?action=current" },
        ],
      },
      {
        name: "BHV Plotkaart",
        weight: 25,
        requests: [
          { method: "GET", path: "/bhv/plotkaart" },
          { method: "GET", path: "/api/plotkaart/data" },
        ],
      },
      {
        name: "Incidenten Overview",
        weight: 20,
        requests: [
          { method: "GET", path: "/incidenten" },
          { method: "GET", path: "/api/incidenten/list" },
        ],
      },
      {
        name: "Gebruikers Management",
        weight: 15,
        requests: [
          { method: "GET", path: "/gebruikers" },
          { method: "GET", path: "/api/gebruikers/list" },
        ],
      },
      {
        name: "API Health Check",
        weight: 10,
        requests: [
          { method: "GET", path: "/api/health" },
          { method: "GET", path: "/api/monitoring/metrics?action=current" },
        ],
      },
    ]
  }

  async runLoadTest(config: LoadTestConfig): Promise<LoadTestResult> {
    const results: Array<{
      scenario: string
      responseTime: number
      success: boolean
      timestamp: number
    }> = []

    const startTime = Date.now()
    const endTime = startTime + config.testDuration * 1000
    const rampUpEnd = startTime + config.rampUpTime * 1000

    console.log(`Starting load test: ${config.concurrentUsers} users for ${config.testDuration}s`)

    // Create user sessions
    const userPromises: Promise<void>[] = []

    for (let i = 0; i < config.concurrentUsers; i++) {
      const userDelay = (config.rampUpTime * 1000 * i) / config.concurrentUsers

      userPromises.push(this.simulateUser(i, startTime + userDelay, endTime, results))
    }

    // Wait for all users to complete
    await Promise.all(userPromises)

    // Calculate results
    return this.calculateResults(results)
  }

  private async simulateUser(
    userId: number,
    startTime: number,
    endTime: number,
    results: Array<{
      scenario: string
      responseTime: number
      success: boolean
      timestamp: number
    }>,
  ): Promise<void> {
    // Wait for user's start time
    const now = Date.now()
    if (startTime > now) {
      await new Promise((resolve) => setTimeout(resolve, startTime - now))
    }

    while (Date.now() < endTime) {
      // Select random scenario based on weights
      const scenario = this.selectScenario()

      for (const request of scenario.requests) {
        if (Date.now() >= endTime) break

        const requestStart = Date.now()
        let success = false

        try {
          const response = await fetch(`${this.baseUrl}${request.path}`, {
            method: request.method,
            headers: {
              "Content-Type": "application/json",
              ...request.headers,
            },
            body: request.body ? JSON.stringify(request.body) : undefined,
          })

          success = response.ok
        } catch (error) {
          success = false
        }

        const responseTime = Date.now() - requestStart

        results.push({
          scenario: scenario.name,
          responseTime,
          success,
          timestamp: Date.now(),
        })

        // Random delay between requests (100-500ms)
        await new Promise((resolve) => setTimeout(resolve, Math.random() * 400 + 100))
      }

      // Delay between scenario iterations
      await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000 + 500))
    }
  }

  private selectScenario(): LoadTestScenario {
    const totalWeight = this.scenarios.reduce((sum, s) => sum + s.weight, 0)
    let random = Math.random() * totalWeight

    for (const scenario of this.scenarios) {
      random -= scenario.weight
      if (random <= 0) {
        return scenario
      }
    }

    return this.scenarios[0] // Fallback
  }

  private calculateResults(
    results: Array<{
      scenario: string
      responseTime: number
      success: boolean
      timestamp: number
    }>,
  ): LoadTestResult {
    const totalRequests = results.length
    const successfulRequests = results.filter((r) => r.success).length
    const failedRequests = totalRequests - successfulRequests

    const responseTimes = results.map((r) => r.responseTime)
    const averageResponseTime = responseTimes.reduce((sum, rt) => sum + rt, 0) / responseTimes.length
    const maxResponseTime = Math.max(...responseTimes)
    const minResponseTime = Math.min(...responseTimes)

    // Calculate duration
    const timestamps = results.map((r) => r.timestamp)
    const testDuration = (Math.max(...timestamps) - Math.min(...timestamps)) / 1000
    const requestsPerSecond = totalRequests / testDuration

    // Calculate scenario stats
    const scenarioStats = this.scenarios.map((scenario) => {
      const scenarioResults = results.filter((r) => r.scenario === scenario.name)
      const scenarioRequests = scenarioResults.length
      const scenarioSuccessful = scenarioResults.filter((r) => r.success).length
      const scenarioResponseTimes = scenarioResults.map((r) => r.responseTime)

      return {
        name: scenario.name,
        requests: scenarioRequests,
        avgResponseTime:
          scenarioResponseTimes.length > 0
            ? scenarioResponseTimes.reduce((sum, rt) => sum + rt, 0) / scenarioResponseTimes.length
            : 0,
        successRate: scenarioRequests > 0 ? (scenarioSuccessful / scenarioRequests) * 100 : 0,
      }
    })

    return {
      success: true,
      totalRequests,
      successfulRequests,
      failedRequests,
      averageResponseTime,
      maxResponseTime,
      minResponseTime,
      requestsPerSecond,
      scenarios: scenarioStats,
    }
  }
}

// Export singleton instance
export const loadTester = new LoadTester()
