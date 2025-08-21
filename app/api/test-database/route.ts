import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    // Test basic connection
    const connectionTest = await sql`SELECT 1 as test`

    if (!connectionTest || connectionTest[0]?.test !== 1) {
      throw new Error("Database connection test failed")
    }

    // Test table existence
    const tables = await sql`
      SELECT 
        table_name,
        table_type
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `

    // Test demo customer
    const demoCustomer = await sql`
      SELECT 
        id,
        name,
        email,
        subscription_status,
        created_at
      FROM customers 
      WHERE email = 'demo@bhv360.nl'
      LIMIT 1
    `

    // Test subscription plans
    const plans = await sql`
      SELECT 
        id,
        name,
        plan_type,
        price_monthly
      FROM subscription_plans
      WHERE is_active = true
      ORDER BY price_monthly
    `

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      tests: {
        connection: {
          status: "passed",
          message: "Database connection successful",
        },
        tables: {
          status: "passed",
          count: tables.length,
          tables: tables.map((t) => ({
            name: t.table_name,
            type: t.table_type,
          })),
        },
        demoData: {
          status: demoCustomer.length > 0 ? "passed" : "warning",
          customer: demoCustomer[0] || null,
          message: demoCustomer.length > 0 ? "Demo customer exists" : "Demo customer not found",
        },
        subscriptionPlans: {
          status: plans.length > 0 ? "passed" : "failed",
          count: plans.length,
          plans: plans.map((p) => ({
            id: p.id,
            name: p.name,
            type: p.plan_type,
            price: p.price_monthly,
          })),
        },
      },
      summary: {
        allTestsPassed: tables.length > 0 && plans.length > 0,
        totalTables: tables.length,
        hasDemo: demoCustomer.length > 0,
        planCount: plans.length,
      },
    })
  } catch (error) {
    console.error("Database test failed:", error)

    return NextResponse.json(
      {
        success: false,
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown database error",
        tests: {
          connection: {
            status: "failed",
            message: error instanceof Error ? error.message : "Connection failed",
          },
        },
      },
      { status: 500 },
    )
  }
}
