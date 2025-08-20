interface LoadTestConfig {
  concurrentUsers: number
  testDuration: number // seconds
  rampUpTime: number // seconds
  targetUrl: string
}

interface LoadTestResult {
  timestamp: string
  responseTime: number
  statusCode: number
  success: boolean
  endpoint: string
  userId: number
}

interface LoadTestReport {
  summary: {
    totalRequests: number
    successfulRequests: number
    failedRequests: number
    averageResponseTime: number
    maxResponseTime: number
    minResponseTime: number
    requestsPerSecond: number
    errorRate: number
  }
  results: LoadTestResult[]
  config: LoadTestConfig
}

export class LoadTester {
  private results: LoadTestResult[] = []
  private startTime = 0

  async runLoadTest(config: LoadTestConfig): Promise<LoadTestReport> {
    console.log(`🚀 Starting load test with ${config.concurrentUsers} users for ${config.testDuration}s`)

    this.results = []
    this.startTime = Date.now()

    // Test scenarios - realistische BHV360 gebruikspatronen
    const scenarios = [
      { endpoint: "/dashboard", weight: 30 },
      { endpoint: "/bhv/plotkaart", weight: 25 },
      { endpoint: "/incidenten", weight: 20 },
      { endpoint: "/bhv-aanwezigheid", weight: 15 },
      { endpoint: "/api/monitoring/metrics", weight: 10 },
    ]

    // Start concurrent users met ramp-up
    const userPromises: Promise<void>[] = []
    const rampUpDelay = (config.rampUpTime * 1000) / config.concurrentUsers

    for (let userId = 1; userId <= config.concurrentUsers; userId++) {
      const delay = (userId - 1) * rampUpDelay
      userPromises.push(this.simulateUser(userId, config, scenarios, delay))
    }

    // Wacht tot alle users klaar zijn
    await Promise.all(userPromises)

    return this.generateReport(config)
  }

  private async simulateUser(
    userId: number,
    config: LoadTestConfig,
    scenarios: Array<{ endpoint: string; weight: number }>,
    initialDelay: number,
  ): Promise<void> {
    // Wacht voor ramp-up
    await this.sleep(initialDelay)

    const endTime = this.startTime + config.testDuration * 1000

    while (Date.now() < endTime) {
      // Selecteer random scenario gebaseerd op weight
      const scenario = this.selectWeightedScenario(scenarios)

      try {
        const startRequest = Date.now()
        const response = await fetch(`${config.targetUrl}${scenario.endpoint}`, {
          method: "GET",
          headers: {
            "User-Agent": `LoadTester-User-${userId}`,
            Accept: "text/html,application/json",
          },
        })

        const responseTime = Date.now() - startRequest

        this.results.push({
          timestamp: new Date().toISOString(),
          responseTime,
          statusCode: response.status,
          success: response.ok,
          endpoint: scenario.endpoint,
          userId,
        })
      } catch (error) {
        this.results.push({
          timestamp: new Date().toISOString(),
          responseTime: -1,
          statusCode: 0,
          success: false,
          endpoint: scenario.endpoint,
          userId,
        })
      }

      // Simuleer gebruiker denktijd (1-3 seconden)
      await this.sleep(1000 + Math.random() * 2000)
    }
  }

  private selectWeightedScenario(scenarios: Array<{ endpoint: string; weight: number }>) {
    const totalWeight = scenarios.reduce((sum, s) => sum + s.weight, 0)
    let random = Math.random() * totalWeight

    for (const scenario of scenarios) {
      random -= scenario.weight
      if (random <= 0) return scenario
    }

    return scenarios[0] // fallback
  }

  private generateReport(config: LoadTestConfig): LoadTestReport {
    const successfulResults = this.results.filter((r) => r.success)
    const responseTimes = successfulResults.map((r) => r.responseTime)

    const summary = {
      totalRequests: this.results.length,
      successfulRequests: successfulResults.length,
      failedRequests: this.results.length - successfulResults.length,
      averageResponseTime:
        responseTimes.length > 0 ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length) : 0,
      maxResponseTime: responseTimes.length > 0 ? Math.max(...responseTimes) : 0,
      minResponseTime: responseTimes.length > 0 ? Math.min(...responseTimes) : 0,
      requestsPerSecond: Math.round(this.results.length / config.testDuration),
      errorRate: Math.round(((this.results.length - successfulResults.length) / this.results.length) * 100),
    }

    return {
      summary,
      results: this.results,
      config,
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}
