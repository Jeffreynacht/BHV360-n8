import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET() {
  try {
    console.log("🔍 Testing database connection...")

    // Check if DATABASE_URL exists or can be constructed
    let databaseUrl = process.env.DATABASE_URL

    if (!databaseUrl) {
      // Try to construct from Neon variables
      const pgUser = process.env.PGUSER
      const pgPassword = process.env.PGPASSWORD
      const pgHost = process.env.POSTGRES_HOST || process.env.PGHOST
      const pgDatabase = process.env.PGDATABASE

      if (pgUser && pgPassword && pgHost && pgDatabase) {
        databaseUrl = `postgres://${pgUser}:${pgPassword}@${pgHost}/${pgDatabase}?sslmode=require`
        console.log("📝 Constructed DATABASE_URL from Neon variables")
      } else {
        return NextResponse.json({
          success: false,
          error: "DATABASE_URL not found and cannot be constructed from Neon variables",
          env: {
            NODE_ENV: process.env.NODE_ENV,
            hasDbUrl: !!process.env.DATABASE_URL,
            hasPostgresUrl: !!process.env.POSTGRES_URL,
            hasPgUser: !!process.env.PGUSER,
            hasPgPassword: !!process.env.PGPASSWORD,
            hasPgHost: !!(process.env.POSTGRES_HOST || process.env.PGHOST),
            hasPgDatabase: !!process.env.PGDATABASE,
          },
        })
      }
    }

    const sql = neon(databaseUrl)

    // Test basic connection
    const timeResult = await sql`SELECT NOW() as current_time`
    console.log("✅ Database connected:", timeResult[0].current_time)

    // Check if customers table exists
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'customers'
      ) as table_exists
    `

    let customers = []
    if (tableCheck[0].table_exists) {
      customers = await sql`SELECT * FROM customers ORDER BY name LIMIT 10`
      console.log("📊 Found customers:", customers.length)
    } else {
      console.log("⚠️ Customers table does not exist")
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        current_time: timeResult[0].current_time,
        customers_table_exists: tableCheck[0].table_exists,
        customers_count: customers.length,
        customers: customers.slice(0, 5), // Only return first 5 for brevity
        url_source: process.env.DATABASE_URL ? "DATABASE_URL" : "constructed_from_neon_vars",
      },
    })
  } catch (error) {
    console.error("❌ Database test failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
