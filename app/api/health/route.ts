import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    const startTime = Date.now()

    // Test database connection
    const { data: dbTest, error: dbError } = await supabase.from("customers").select("count").limit(1)

    const dbStatus = dbError ? "error" : "healthy"
    const dbLatency = Date.now() - startTime

    // Check environment variables
    const envCheck = {
      database: !!process.env.DATABASE_URL,
      supabase: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      nextauth: !!process.env.NEXTAUTH_SECRET,
    }

    const allEnvPresent = Object.values(envCheck).every(Boolean)

    // Overall health status
    const isHealthy = dbStatus === "healthy" && allEnvPresent

    const healthData = {
      status: isHealthy ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: "1.0.0",
      environment: process.env.NODE_ENV || "development",
      checks: {
        database: {
          status: dbStatus,
          latency: `${dbLatency}ms`,
          error: dbError?.message || null,
        },
        environment: {
          status: allEnvPresent ? "healthy" : "missing_vars",
          variables: envCheck,
        },
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
          unit: "MB",
        },
      },
    }

    return NextResponse.json(healthData, {
      status: isHealthy ? 200 : 503,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Health check error:", error)

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
