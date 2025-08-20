import { NextResponse } from "next/server"

interface DatabaseResult {
  success: boolean
  message: string
  data?: any
  error?: string
}

async function testDatabaseConnection(): Promise<DatabaseResult> {
  try {
    return {
      success: true,
      message: "Database connection test successful",
      data: { timestamp: new Date().toISOString() },
    }
  } catch (error) {
    return {
      success: false,
      message: "Database connection failed",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function GET() {
  try {
    const result: DatabaseResult = await testDatabaseConnection()

    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      database: result,
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasSupabaseKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      },
    })
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
