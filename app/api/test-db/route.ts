import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET() {
  try {
    console.log("🔍 Testing database connection...")

    // Check if DATABASE_URL exists
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        success: false,
        error: "DATABASE_URL environment variable not found",
        env: {
          NODE_ENV: process.env.NODE_ENV,
          hasDbUrl: !!process.env.DATABASE_URL,
        },
      })
    }

    const sql = neon(process.env.DATABASE_URL)

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
      customers = await sql`SELECT * FROM customers ORDER BY name`
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
        customers: customers,
      },
    })
  } catch (error) {
    console.error("❌ Database test failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
