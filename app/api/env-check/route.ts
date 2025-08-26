import { NextResponse } from "next/server"

const requiredEnvVars = [
  "DATABASE_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "NEXTAUTH_SECRET",
  "VAPID_PUBLIC_KEY",
  "VAPID_PRIVATE_KEY",
]

const optionalEnvVars = [
  "SUPABASE_SERVICE_ROLE_KEY",
  "NEXT_PUBLIC_APP_URL",
  "GROQ_API_KEY",
  "POSTGRES_URL",
  "NEON_PROJECT_ID",
]

export async function GET() {
  try {
    const missing = requiredEnvVars.filter((key) => !process.env[key])
    const present = requiredEnvVars.filter((key) => !!process.env[key])
    const optionalPresent = optionalEnvVars.filter((key) => !!process.env[key])

    const status = missing.length === 0 ? "OK" : "ERROR"
    const statusCode = missing.length === 0 ? 200 : 500

    const envCheckData = {
      status,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
      required: {
        total: requiredEnvVars.length,
        present: present.length,
        missing: missing.length,
        missingVars: missing,
      },
      optional: {
        total: optionalEnvVars.length,
        present: optionalPresent.length,
        presentVars: optionalPresent,
      },
      summary:
        missing.length === 0
          ? "All required environment variables are present"
          : `Missing ${missing.length} required environment variables`,
    }

    return NextResponse.json(envCheckData, {
      status: statusCode,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Environment check error:", error)

    return NextResponse.json(
      {
        status: "ERROR",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
        summary: "Environment check failed",
      },
      { status: 500 },
    )
  }
}
