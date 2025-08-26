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
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS",
  "S3_BUCKET",
  "S3_REGION",
  "S3_ACCESS_KEY",
  "S3_SECRET_KEY",
]

export async function GET() {
  try {
    const missing = requiredEnvVars.filter((key) => !process.env[key])
    const present = requiredEnvVars.filter((key) => !!process.env[key])
    const optionalPresent = optionalEnvVars.filter((key) => !!process.env[key])

    const status = missing.length === 0 ? "OK" : "ERROR"
    const statusCode = missing.length === 0 ? 200 : 500

    // Check if DATABASE_URL can be constructed from Neon variables
    let databaseUrlStatus = "OK"
    let databaseUrlMessage = "DATABASE_URL is set"

    if (!process.env.DATABASE_URL) {
      const pgUser = process.env.PGUSER
      const pgPassword = process.env.PGPASSWORD
      const pgHost = process.env.POSTGRES_HOST || process.env.PGHOST
      const pgDatabase = process.env.PGDATABASE

      if (pgUser && pgPassword && pgHost && pgDatabase) {
        databaseUrlStatus = "CONSTRUCTABLE"
        databaseUrlMessage = "DATABASE_URL can be constructed from Neon variables"
      } else {
        databaseUrlStatus = "MISSING"
        databaseUrlMessage = "DATABASE_URL missing and cannot be constructed from Neon variables"
      }
    }

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
      database: {
        status: databaseUrlStatus,
        message: databaseUrlMessage,
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
