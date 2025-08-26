import { NextResponse } from "next/server"

export async function GET() {
  try {
    const healthData = {
      ok: true,
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: "2.1.2",
      environment: process.env.NODE_ENV || "development",
      app_name: process.env.NEXT_PUBLIC_APP_NAME || "BHV360",
      site_url: process.env.NEXT_PUBLIC_SITE_URL || "Not configured",
      node_version: process.version,
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      },
    }

    return NextResponse.json(healthData, {
      status: 200,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Health check error:", error)

    return NextResponse.json(
      {
        ok: false,
        status: "error",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
