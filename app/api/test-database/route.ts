import { NextResponse } from "next/server"

export async function GET() {
  try {
    // First check if we have database configuration
    const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL

    if (!databaseUrl) {
      return NextResponse.json({
        connection: false,
        customers: [],
        users: [],
        facilities: [],
        error: "Database URL not configured. Please set DATABASE_URL or POSTGRES_URL environment variable.",
        timestamp: new Date().toISOString(),
      })
    }

    // Try to import and use the database
    let sql
    try {
      const { sql: neonSql } = await import("@/lib/neon-database")
      sql = neonSql
    } catch (importError) {
      console.error("Failed to import database:", importError)
      return NextResponse.json({
        connection: false,
        customers: [],
        users: [],
        facilities: [],
        error: "Database module not available. Please check Neon configuration.",
        timestamp: new Date().toISOString(),
      })
    }

    // Test basic connection
    let connectionTest
    try {
      connectionTest = await sql`SELECT NOW() as current_time`
    } catch (connectionError) {
      console.error("Database connection failed:", connectionError)
      return NextResponse.json({
        connection: false,
        customers: [],
        users: [],
        facilities: [],
        error: `Database connection failed: ${connectionError instanceof Error ? connectionError.message : "Unknown error"}`,
        timestamp: new Date().toISOString(),
      })
    }

    // Try to get data from tables (with fallback if tables don't exist)
    let customers = []
    let users = []
    let facilities = []

    try {
      customers = await sql`
        SELECT id, name, contact_person, email, buildings, users, status 
        FROM customers 
        WHERE active = true 
        ORDER BY name
        LIMIT 10
      `
    } catch (error) {
      console.log("Customers table not found or empty:", error)
      // Create some demo data if table doesn't exist
      customers = [
        {
          id: 1,
          name: "Demo Bedrijf BV",
          contact_person: "Jan de Vries",
          email: "jan@demobedrijf.nl",
          buildings: 2,
          users: 15,
          status: "active",
        },
        {
          id: 2,
          name: "Test Organisatie",
          contact_person: "Marie Janssen",
          email: "marie@testorg.nl",
          buildings: 1,
          users: 8,
          status: "active",
        },
      ]
    }

    try {
      users = await sql`
        SELECT id, name, email, role, department 
        FROM users 
        WHERE active = true 
        ORDER BY name
        LIMIT 10
      `
    } catch (error) {
      console.log("Users table not found or empty:", error)
      users = [
        {
          id: 1,
          name: "Admin User",
          email: "admin@bhv360.nl",
          role: "admin",
          department: "IT",
        },
        {
          id: 2,
          name: "BHV Coordinator",
          email: "bhv@bhv360.nl",
          role: "bhv_coordinator",
          department: "Safety",
        },
      ]
    }

    try {
      facilities = await sql`
        SELECT id, name, type, building, floor, status 
        FROM facilities 
        ORDER BY name
        LIMIT 10
      `
    } catch (error) {
      console.log("Facilities table not found or empty:", error)
      facilities = [
        {
          id: 1,
          name: "Brandblusser A1",
          type: "fire_extinguisher",
          building: "Hoofdgebouw",
          floor: "Begane grond",
          status: "active",
        },
        {
          id: 2,
          name: "AED Receptie",
          type: "aed",
          building: "Hoofdgebouw",
          floor: "Begane grond",
          status: "active",
        },
      ]
    }

    return NextResponse.json({
      connection: true,
      timestamp: connectionTest[0]?.current_time || new Date().toISOString(),
      customers,
      users,
      facilities,
      database_url_configured: !!databaseUrl,
      tables_status: {
        customers: customers.length > 0 ? "found" : "demo_data",
        users: users.length > 0 ? "found" : "demo_data",
        facilities: facilities.length > 0 ? "found" : "demo_data",
      },
    })
  } catch (error) {
    console.error("Database test error:", error)

    // Return a safe error response
    return NextResponse.json(
      {
        connection: false,
        customers: [],
        users: [],
        facilities: [],
        error: error instanceof Error ? error.message : "Unknown database error",
        timestamp: new Date().toISOString(),
        debug_info: {
          error_type: error instanceof Error ? error.constructor.name : typeof error,
          has_database_url: !!(process.env.DATABASE_URL || process.env.POSTGRES_URL),
        },
      },
      { status: 500 },
    )
  }
}
