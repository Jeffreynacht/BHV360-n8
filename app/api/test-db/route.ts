import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET() {
  try {
    console.log("🔍 Testing database connection...")

    // Check if DATABASE_URL exists or use POSTGRES_URL as fallback
    const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL

    if (!databaseUrl) {
      return NextResponse.json({
        success: false,
        error: "Neither DATABASE_URL nor POSTGRES_URL environment variable found",
        env: {
          NODE_ENV: process.env.NODE_ENV,
          hasDbUrl: !!process.env.DATABASE_URL,
          hasPostgresUrl: !!process.env.POSTGRES_URL,
        },
      })
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
      customers = await sql`SELECT id, name, contact_person, active FROM customers ORDER BY name LIMIT 10`
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
        url_source: process.env.DATABASE_URL ? "DATABASE_URL" : "POSTGRES_URL",
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
