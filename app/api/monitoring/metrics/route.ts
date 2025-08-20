import { type NextRequest, NextResponse } from "next/server"
import { performanceMonitor } from "@/lib/monitoring/performance-monitor"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get("action") || "current"

    switch (action) {
      case "current": {
        const metrics = await performanceMonitor.collectMetrics()
        return NextResponse.json({
          success: true,
          data: metrics,
        })
      }

      case "history": {
        const hours = Number.parseInt(searchParams.get("hours") || "1")
        const history = performanceMonitor.getMetricsHistory(hours)
        return NextResponse.json({
          success: true,
          data: history,
        })
      }

      case "average": {
        const hours = Number.parseInt(searchParams.get("hours") || "1")
        const average = performanceMonitor.getAverageMetrics(hours)
        return NextResponse.json({
          success: true,
          data: average,
        })
      }

      case "system": {
        const systemInfo = await performanceMonitor.getSystemInfo()
        return NextResponse.json({
          success: true,
          data: systemInfo,
        })
      }

      default:
        return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Metrics API error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, value, tags } = body

    if (!name || typeof value !== "number") {
      return NextResponse.json({ success: false, error: "Invalid metric data" }, { status: 400 })
    }

    await performanceMonitor.recordCustomMetric(name, value, tags)

    return NextResponse.json({
      success: true,
      message: "Metric recorded successfully",
    })
  } catch (error) {
    console.error("Metrics POST error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
