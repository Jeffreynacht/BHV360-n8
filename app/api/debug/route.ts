import { NextResponse } from "next/server"
import { debugDatabaseConnection, debugEnvironmentVariables } from "@/lib/debug-database"

export async function GET() {
  try {
    console.log("🚀 Starting debug check...")

    // Check environment variables
    const envResult = debugEnvironmentVariables()

    // Test database connection
    const dbResult = await debugDatabaseConnection()

    const response = {
      success: dbResult.success,
      timestamp: new Date().toISOString(),
      database: dbResult,
      environment: {
        hasDatabase: !!process.env.DATABASE_URL,
        nodeEnv: process.env.NODE_ENV,
        appUrl: process.env.NEXT_PUBLIC_APP_URL,
        details: envResult,
      },
    }

    console.log("✅ Debug check completed:", response)

    return NextResponse.json(response)
  } catch (error) {
    console.error("❌ Debug API error:", error)

    const errorResponse = {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    }

    return NextResponse.json(errorResponse, { status: 500 })
  }
}
