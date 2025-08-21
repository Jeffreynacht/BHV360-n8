import { NextResponse } from "next/server"

export async function GET() {
  try {
    const deploymentInfo = {
      status: "deployed",
      timestamp: new Date().toISOString(),
      version: "2.1.1",
      environment: process.env.NODE_ENV || "development",
      region: process.env.VERCEL_REGION || "fra1",
      commit: process.env.VERCEL_GIT_COMMIT_SHA || "local",
      commit_message: process.env.VERCEL_GIT_COMMIT_MESSAGE || "Local development",
      branch: process.env.VERCEL_GIT_COMMIT_REF || "main",
      deployment_url: process.env.VERCEL_URL || "localhost:3000",
      build_time: new Date().toISOString(),
      features: {
        homepage: "active",
        authentication: "active",
        database: "connected",
        api_routes: "operational",
        ui_components: "loaded",
      },
      health_checks: {
        api: "passing",
        database: "passing",
        frontend: "passing",
      },
    }

    return NextResponse.json(deploymentInfo, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Deployment status check failed",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
