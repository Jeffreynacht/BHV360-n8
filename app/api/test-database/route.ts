import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET() {
  const startTime = Date.now()

  try {
    const databaseUrl = process.env.DATABASE_URL

    if (!databaseUrl) {
      return NextResponse.json(
        {
          status: "error",
          message: "DATABASE_URL environment variable not configured",
          timestamp: new Date().toISOString(),
          responseTime: Date.now() - startTime,
        },
        { status: 500 },
      )
    }

    const sql = neon(databaseUrl)

    // Test basic connection
    const connectionTest = await sql`SELECT 1 as test, NOW() as timestamp`

    // Test table existence
    const tableCheck = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `

    // Test demo data
    let demoDataStatus = "not_checked"
    try {
      const demoCheck = await sql`
        SELECT COUNT(*) as count 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'customers'
      `

      if (demoCheck[0]?.count > 0) {
        const customerCount = await sql`SELECT COUNT(*) as count FROM customers`
        demoDataStatus = `${customerCount[0]?.count || 0} customers found`
      } else {
        demoDataStatus = "customers table not found"
      }
    } catch (error) {
      demoDataStatus = "demo data check failed"
    }

    // Database performance test
    const perfStart = Date.now()
    await sql`SELECT pg_sleep(0.001)` // 1ms sleep test
    const perfTime = Date.now() - perfStart

    const result = {
      status: "success",
      message: "Database connection successful",
      timestamp: new Date().toISOString(),
      connection: {
        status: "✅ connected",
        host: process.env.PGHOST || "unknown",
        database: process.env.POSTGRES_DATABASE || "unknown",
        user: process.env.POSTGRES_USER || "unknown",
        ssl: databaseUrl.includes("sslmode=require") ? "✅ enabled" : "⚠️ disabled",
      },
      tests: {
        basicQuery: connectionTest.length > 0 ? "✅ passed" : "❌ failed",
        tableAccess: tableCheck.length >= 0 ? "✅ passed" : "❌ failed",
        demoData: demoDataStatus,
        performance: `${perfTime}ms`,
      },
      tables: tableCheck.map((t) => t.table_name),
      metadata: {
        serverTime: connectionTest[0]?.timestamp,
        tablesFound: tableCheck.length,
        responseTime: Date.now() - startTime,
      },
    }

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Database connection failed",
        timestamp: new Date().toISOString(),
        responseTime: Date.now() - startTime,
        details: {
          databaseUrl: process.env.DATABASE_URL ? "configured" : "missing",
          error: error instanceof Error ? error.stack : "Unknown error",
        },
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      },
    )
  }
}
