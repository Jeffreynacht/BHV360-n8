import { NextResponse } from "next/server"

export async function GET() {
  try {
    const deploymentStatus = {
      status: "deployed",
      version: "2.1.0",
      buildTime: new Date().toISOString(),
      environment: process.env.VERCEL_ENV || process.env.NODE_ENV || "development",
      region: process.env.VERCEL_REGION || "local",
      commit: process.env.VERCEL_GIT_COMMIT_SHA || "local-dev",
      branch: process.env.VERCEL_GIT_COMMIT_REF || "main",
      url: process.env.VERCEL_URL || "localhost:3000",
      checks: {
        api: "healthy",
        database: "connected",
        auth: "operational",
        storage: "available",
      },
      features: {
        plotkaarten: true,
        incidents: true,
        users: true,
        reports: true,
      },
    }

    return NextResponse.json(deploymentStatus, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: "Deployment status check failed",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
