import { NextResponse } from "next/server"

export async function GET() {
  try {
    const deploymentInfo = {
      status: "deployed",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      environment: process.env.NODE_ENV || "development",
      deployment: {
        id: process.env.VERCEL_GIT_COMMIT_SHA || "local",
        url: process.env.VERCEL_URL || process.env.NEXT_PUBLIC_APP_URL || "localhost:3000",
        branch: process.env.VERCEL_GIT_COMMIT_REF || "main",
        region: process.env.VERCEL_REGION || "local",
      },
      features: {
        websocket: !!process.env.WEBSOCKET_PORT,
        push_notifications: !!process.env.VAPID_PUBLIC_KEY,
        email: !!process.env.SMTP_HOST,
        sms: !!process.env.SMS_API_KEY,
        database: !!process.env.DATABASE_URL,
        supabase: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      },
      apis: {
        total: 50,
        categories: [
          "Authentication",
          "User Management",
          "Customer Management",
          "Incident Management",
          "Emergency Response",
          "WebSocket & Messaging",
          "Push Notifications",
          "Inspections & Reports",
          "Communication",
          "Admin & Monitoring",
          "System Health",
          "Backup & Performance",
        ],
      },
      uptime: process.uptime(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        unit: "MB",
      },
    }

    return NextResponse.json(deploymentInfo, {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    })
  } catch (error) {
    console.error("Deployment status error:", error)

    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
