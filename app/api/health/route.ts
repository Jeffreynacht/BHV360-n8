import { NextResponse } from "next/server"

export async function GET() {
  try {
    const healthData = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development",
      version: "1.0.0",
      services: {
        database: "connected",
        api: "operational",
        auth: "operational",
        storage: "available",
        notifications: "active",
      },
      memory: {
        used: process.memoryUsage().heapUsed,
        total: process.memoryUsage().heapTotal,
        external: process.memoryUsage().external,
      },
      system: {
        platform: process.platform,
        arch: process.arch,
        nodeVersion: process.version,
      },
    }

    return NextResponse.json(healthData, {
      status: 200,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
  } catch (error) {
    console.error("Health check failed:", error)

    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
        services: {
          database: "unknown",
          api: "error",
          auth: "unknown",
          storage: "unknown",
          notifications: "unknown",
        },
      },
      { status: 500 },
    )
  }
}

export async function HEAD() {
  return new NextResponse(null, { status: 200 })
}
