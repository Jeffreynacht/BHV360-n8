import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET() {
  try {
    // Check database connection
    const sql = neon(process.env.DATABASE_URL!)

    // Simple health check query
    const result = await sql`SELECT 
      NOW() as timestamp,
      version() as postgres_version,
      current_database() as database_name
    `

    // Check if core tables exist
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('customers', 'user_profiles', 'subscription_plans')
      ORDER BY table_name
    `

    // Count records in key tables
    let customerCount = 0
    let userCount = 0

    try {
      const customerResult = await sql`SELECT COUNT(*) as count FROM customers`
      customerCount = Number.parseInt(customerResult[0].count)
    } catch (error) {
      console.log("Customers table not accessible")
    }

    try {
      const userResult = await sql`SELECT COUNT(*) as count FROM user_profiles`
      userCount = Number.parseInt(userResult[0].count)
    } catch (error) {
      console.log("User profiles table not accessible")
    }

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        info: result[0],
        tables: tables.map((t) => t.table_name),
        counts: {
          customers: customerCount,
          users: userCount,
        },
      },
      application: {
        name: "BHV360",
        version: process.env.npm_package_version || "2.1.0",
        environment: process.env.NODE_ENV || "development",
        uptime: process.uptime(),
      },
    })
  } catch (error) {
    console.error("Health check failed:", error)

    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
        database: {
          connected: false,
        },
        application: {
          name: "BHV360",
          version: process.env.npm_package_version || "2.1.0",
          environment: process.env.NODE_ENV || "development",
          uptime: process.uptime(),
        },
      },
      { status: 503 },
    )
  }
}

export async function POST() {
  return NextResponse.json(
    {
      message: "Health check endpoint only supports GET requests",
    },
    { status: 405 },
  )
}
