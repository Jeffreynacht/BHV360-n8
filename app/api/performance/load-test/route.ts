import { type NextRequest, NextResponse } from "next/server"
import { loadTester } from "@/lib/monitoring/load-tester"

interface LoadTestConfig {
  concurrentUsers: number
  testDuration: number // seconds
  rampUpTime: number // seconds
}

interface LoadTestScenario {
  name: string
  url: string
  method: "GET" | "POST"
  weight: number // percentage of requests
  headers?: Record<string, string>
  body?: any
}

interface LoadTestResult {
  timestamp: string
  config: LoadTestConfig
  report: {
    summary: {
      totalRequests: number
      successfulRequests: number
      failedRequests: number
      averageResponseTime: number
      requestsPerSecond: number
      testDuration: number
    }
    scenarios: Array<{
      name: string
      requests: number
      successRate: number
      averageResponseTime: number
    }>
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { concurrentUsers = 10, testDuration = 60, rampUpTime = 10 } = body

    // Validate input
    if (concurrentUsers < 1 || concurrentUsers > 100) {
      return NextResponse.json({ success: false, error: "Concurrent users must be between 1 and 100" }, { status: 400 })
    }

    if (testDuration < 10 || testDuration > 600) {
      return NextResponse.json(
        { success: false, error: "Test duration must be between 10 and 600 seconds" },
        { status: 400 },
      )
    }

    if (rampUpTime < 1 || rampUpTime > 60) {
      return NextResponse.json(
        { success: false, error: "Ramp-up time must be between 1 and 60 seconds" },
        { status: 400 },
      )
    }

    // Run load test
    const result = await loadTester.runLoadTest({
      concurrentUsers,
      testDuration,
      rampUpTime,
    })

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error("Load test error:", error)
    return NextResponse.json({ success: false, error: "Load test failed" }, { status: 500 })
  }
}
