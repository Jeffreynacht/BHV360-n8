import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const startTime = Date.now()

    // Test basic connection
    const result = await sql`SELECT NOW() as current_time, version() as database_version`
    const responseTime = Date.now() - startTime

    // Test customers table
    let customersCount = 0
    try {
      const customerResult = await sql`SELECT COUNT(*) as count FROM customers WHERE status != 'deleted'`
      customersCount = Number.parseInt(customerResult[0]?.count || "0")
    } catch (error) {
      console.log("Customers table doesn't exist yet, will be created on first access")
    }

    // Test users table
    let usersCount = 0
    try {
      const userResult = await sql`SELECT COUNT(*) as count FROM users WHERE active = true`
      usersCount = Number.parseInt(userResult[0]?.count || "0")
    } catch (error) {
      console.log("Users table doesn't exist yet")
    }

    return NextResponse.json({
      success: true,
      status: "connected",
      message: "Database connection successful",
      timestamp: result[0].current_time,
      database_version: result[0].database_version,
      response_time_ms: responseTime,
      statistics: {
        customers_count: customersCount,
        users_count: usersCount,
        tables_accessible: customersCount > 0 ? 1 : 0,
      },
      environment: {
        database_url_configured: !!process.env.DATABASE_URL,
        connection_pooling: process.env.DATABASE_URL?.includes("pooler") || false,
      },
    })
  } catch (error) {
    console.error("Database connection error:", error)

    return NextResponse.json(
      {
        success: false,
        status: "error",
        message: "Database connection failed",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
        environment: {
          database_url_configured: !!process.env.DATABASE_URL,
          database_url_preview: process.env.DATABASE_URL
            ? `${process.env.DATABASE_URL.substring(0, 20)}...`
            : "Not configured",
        },
      },
      { status: 500 },
    )
  }
}
