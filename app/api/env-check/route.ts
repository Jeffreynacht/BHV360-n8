import { NextResponse } from "next/server"

const required = [
  "DATABASE_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "NEXTAUTH_SECRET",
  "VAPID_PUBLIC_KEY",
  "VAPID_PRIVATE_KEY",
]

const optional = [
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_APP_NAME",
  "NEXT_PUBLIC_VAPID_PUBLIC_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "NEXTAUTH_URL",
  "GROQ_API_KEY",
  "POSTGRES_URL",
  "NEON_PROJECT_ID",
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS",
  "S3_BACKUP_ENABLED",
  "VERCEL_GIT_COMMIT_MESSAGE",
]

export async function GET() {
  try {
    const missing = required.filter((k) => !process.env[k])
    const present = required.filter((k) => !!process.env[k])
    const optionalPresent = optional.filter((k) => !!process.env[k])

    const status = missing.length ? "ERROR" : "OK"
    const statusCode = missing.length ? 500 : 200

    const envCheckData = {
      status,
      missing,
      present,
      optional_present: optionalPresent,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
      app_name: process.env.NEXT_PUBLIC_APP_NAME || "BHV360",
      site_url: process.env.NEXT_PUBLIC_SITE_URL || "Not configured",
      database_url_source: process.env.DATABASE_URL
        ? "DATABASE_URL"
        : process.env.POSTGRES_URL
          ? "POSTGRES_URL (fallback)"
          : "MISSING",
      summary: missing.length
        ? `Missing ${missing.length} required environment variables`
        : "All required environment variables are present",
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
