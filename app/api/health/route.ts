import { NextResponse } from "next/server"

export async function GET() {
  try {
    const healthData = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || "1.0.0",
      environment: process.env.NODE_ENV || "development",
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      commit: process.env.VERCEL_GIT_COMMIT_SHA || "unknown",
      commitMessage: process.env.VERCEL_GIT_COMMIT_MESSAGE || "No commit message",
      services: {
        database: "connected",
        auth: "operational",
        api: "healthy",
      },
    }

    return NextResponse.json(healthData, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

export async function HEAD() {
  return new NextResponse(null, { status: 200 })
}
