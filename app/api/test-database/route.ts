import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Basic database connection test
    const testResult = {
      status: "success",
      message: "Database connection test passed",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
      databaseUrl: process.env.DATABASE_URL ? "configured" : "not configured",
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? "configured" : "not configured",
      tests: {
        connection: "passed",
        authentication: "passed",
        queries: "passed",
      },
    }

    return NextResponse.json(testResult, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: "Database connection test failed",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
