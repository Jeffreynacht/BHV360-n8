import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET() {
  try {
    // Get database URL from environment
    const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL

    if (!databaseUrl) {
      return NextResponse.json(
        {
          ok: false,
          status: "error",
          message: "No database URL configured",
          timestamp: new Date().toISOString(),
        },
        { status: 500 },
      )
    }

    // Create SQL client
    const sql = neon(databaseUrl)

    // Test basic connection
    const result = await sql`SELECT NOW() as current_time, version() as postgres_version`
    const currentTime = result[0]?.current_time
    const postgresVersion = result[0]?.postgres_version

    // Test if our main tables exist
    const tableCheck = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'customers', 'incidents', 'facilities')
      ORDER BY table_name
    `

    const existingTables = tableCheck.map((row) => row.table_name)

    // Test a simple query on users table if it exists
    let userCount = 0
    if (existingTables.includes("users")) {
      try {
        const userResult = await sql`SELECT COUNT(*) as count FROM users`
        userCount = Number.parseInt(userResult[0]?.count || "0")
      } catch (error) {
        console.warn("Could not count users:", error)
      }
    }

    return NextResponse.json(
      {
        ok: true,
        status: "connected",
        message: "Database connection successful",
        timestamp: new Date().toISOString(),
        database: {
          current_time: currentTime,
          postgres_version: postgresVersion?.split(" ")[0] || "Unknown",
          connection_url: databaseUrl.split("@")[1]?.split("?")[0] || "Hidden",
        },
        tables: {
          existing: existingTables,
          total_count: existingTables.length,
          user_count: userCount,
        },
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Content-Type": "application/json",
        },
      },
    )
  } catch (error) {
    console.error("Database test error:", error)

    return NextResponse.json(
      {
        ok: false,
        status: "error",
        message: error instanceof Error ? error.message : "Database connection failed",
        timestamp: new Date().toISOString(),
        error_details: {
          name: error instanceof Error ? error.name : "Unknown",
          message: error instanceof Error ? error.message : "Unknown error",
        },
      },
      { status: 500 },
    )
  }
}
