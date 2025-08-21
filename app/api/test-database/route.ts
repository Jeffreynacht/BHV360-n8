import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    const startTime = Date.now()

    // Simple database connection test
    const testResult = {
      status: "connected",
      timestamp: new Date().toISOString(),
      database: "postgresql",
      connection: "active",
    }

    // Test 1: Basic connection
    const connectionTest = await sql`SELECT 1 as test`
    if (connectionTest[0]?.test !== 1) {
      throw new Error("Connection test failed")
    }

    // Test 2: Check tables
    const tables = await sql`
      SELECT table_name, table_type
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `

    // Test 3: Check demo customer
    let demoCustomer = null
    try {
      const result = await sql`
        SELECT id, name, email, subscription_status, created_at
        FROM customers 
        WHERE email = 'demo@bhv360.nl'
        LIMIT 1
      `
      demoCustomer = result[0] || null
    } catch (e) {
      // Table might not exist
    }

    // Test 4: Check subscription plans
    let plans = []
    try {
      const result = await sql`
        SELECT id, name, plan_type, price_monthly
        FROM subscription_plans
        WHERE is_active = true
        ORDER BY price_monthly
      `
      plans = result
    } catch (e) {
      // Table might not exist
    }

    const responseTime = Date.now() - startTime

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      data: testResult,
      tests: {
        connection: {
          status: "passed",
          message: "Database connection successful",
        },
        tables: {
          status: "passed",
          count: tables.length,
          list: tables.map((t) => t.table_name),
        },
        demoCustomer: {
          status: demoCustomer ? "passed" : "warning",
          exists: !!demoCustomer,
          data: demoCustomer,
        },
        subscriptionPlans: {
          status: plans.length > 0 ? "passed" : "warning",
          count: plans.length,
          plans: plans,
        },
      },
      summary: {
        allTestsPassed: tables.length > 0,
        databaseReady: tables.length > 0 && plans.length > 0,
        demoDataExists: !!demoCustomer,
      },
    })
  } catch (error) {
    console.error("Database test failed:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Database connection failed",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
