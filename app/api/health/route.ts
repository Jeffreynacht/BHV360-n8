import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    // Test database connection
    const dbTest = await sql`SELECT NOW() as timestamp, version() as version`

    // Check tables
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `

    // Count customers
    let customerCount = 0
    try {
      const result = await sql`SELECT COUNT(*) as count FROM customers`
      customerCount = Number.parseInt(result[0].count)
    } catch (e) {
      // Table might not exist yet
    }

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        timestamp: dbTest[0].timestamp,
        version: dbTest[0].version,
        tables: tables.length,
        customers: customerCount,
      },
      application: {
        name: "BHV360",
        version: "2.1.0",
        environment: process.env.NODE_ENV || "production",
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
          version: "2.1.0",
          environment: process.env.NODE_ENV || "production",
          uptime: process.uptime(),
        },
      },
      { status: 503 },
    )
  }
}
