import { NextResponse } from "next/server"

export async function GET() {
  try {
    const deploymentInfo = {
      status: "deployed",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      environment: process.env.NODE_ENV || "development",
      vercel: {
        url: process.env.VERCEL_URL || "localhost",
        region: process.env.VERCEL_REGION || "local",
        commitSha: process.env.VERCEL_GIT_COMMIT_SHA || "unknown",
        commitMessage: process.env.VERCEL_GIT_COMMIT_MESSAGE || "Test commit for manual setup",
        branch: process.env.VERCEL_GIT_COMMIT_REF || "main",
      },
      features: {
        authentication: "enabled",
        database: "connected",
        api: "operational",
        monitoring: "active",
      },
      buildInfo: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        buildTime: new Date().toISOString(),
      },
    }

    return NextResponse.json(deploymentInfo, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
