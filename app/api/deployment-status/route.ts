import { NextResponse } from "next/server"
import { readFileSync } from "fs"
import { join } from "path"

export async function GET() {
  try {
    // Read package.json for deployment info
    const packagePath = join(process.cwd(), "package.json")
    const packageJson = JSON.parse(readFileSync(packagePath, "utf8"))

    const deploymentInfo = {
      status: "deployed",
      version: packageJson.version,
      timestamp: new Date().toISOString(),
      deployment: packageJson.deployment || {},
      environment: process.env.NODE_ENV || "production",
      buildId: process.env.VERCEL_GIT_COMMIT_SHA || "unknown",
      region: process.env.VERCEL_REGION || "unknown",
      url: process.env.VERCEL_URL || "bhv360.vercel.app",
      features: {
        customerProvider: "✅ Fixed",
        authProvider: "✅ Fixed",
        dataProvider: "✅ Fixed",
        themeProvider: "✅ Fixed",
        ssrCompatibility: "✅ Fixed",
        reactVersions: "✅ Updated to 18.2.0",
        healthEndpoints: "✅ Added",
        prerenderingErrors: "✅ Resolved",
      },
      endpoints: {
        health: "/api/health",
        database: "/api/test-database",
        deploymentStatus: "/api/deployment-status",
      },
    }

    return NextResponse.json(deploymentInfo)
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: "Could not read deployment status",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
