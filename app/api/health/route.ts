import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET() {
  const startTime = Date.now()

  try {
    // Basic health check
    const healthData = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: "2.1.1",
      environment: process.env.NODE_ENV || "production",
      region: process.env.VERCEL_REGION || "unknown",
      commit: process.env.VERCEL_GIT_COMMIT_SHA || "unknown",
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      services: {
        database: "checking...",
        supabase: "checking...",
        filesystem: "checking...",
      },
      endpoints: {
        health: "/api/health",
        database: "/api/test-database",
        status: "/api/deployment-status",
      },
      responseTime: 0,
    }

    // Test database connection
    try {
      if (process.env.DATABASE_URL) {
        const sql = neon(process.env.DATABASE_URL)
        await sql`SELECT 1 as test`
        healthData.services.database = "✅ connected"
      } else {
        healthData.services.database = "⚠️ no url"
      }
    } catch (error) {
      healthData.services.database = "❌ error"
    }

    // Test Supabase connection
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`, {
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""}`,
          },
        })
        healthData.services.supabase = response.ok ? "✅ connected" : "⚠️ error"
      } else {
        healthData.services.supabase = "⚠️ no url"
      }
    } catch (error) {
      healthData.services.supabase = "❌ error"
    }

    // Test filesystem
    try {
      const fs = await import("fs")
      fs.readFileSync("package.json", "utf8")
      healthData.services.filesystem = "✅ accessible"
    } catch (error) {
      healthData.services.filesystem = "❌ error"
    }

    // Calculate response time
    healthData.responseTime = Date.now() - startTime

    return NextResponse.json(healthData, {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
        responseTime: Date.now() - startTime,
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      },
    )
  }
}

export async function HEAD() {
  return new Response(null, { status: 200 })
}
