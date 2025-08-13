import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET() {
  try {
    console.log("🔍 Starting database test...")

    // Initialize response structure
    const response = {
      connection: {
        success: false,
        message: "",
        timestamp: new Date().toISOString(),
      },
      schema: {
        exists: false,
        tables: [] as string[],
        message: "",
      },
      data: {
        customers: 0,
        users: 0,
        message: "",
      },
    }

    // Check if DATABASE_URL exists
    if (!process.env.DATABASE_URL) {
      console.log("❌ No DATABASE_URL found")
      response.connection.message = "DATABASE_URL environment variable not set"
      return NextResponse.json(response, { status: 500 })
    }

    console.log("🔗 DATABASE_URL found, attempting connection...")

    // Test database connection
    const sql = neon(process.env.DATABASE_URL)

    try {
      // Simple connection test
      const connectionTest = await sql`SELECT 1 as test`
      console.log("✅ Database connection successful")

      response.connection.success = true
      response.connection.message = "Connected successfully"

      // Check for tables
      try {
        const tables = await sql`
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = 'public'
          ORDER BY table_name
        `

        response.schema.tables = tables.map((row: any) => row.table_name)
        response.schema.exists = response.schema.tables.length > 0
        response.schema.message = response.schema.exists
          ? `Found ${response.schema.tables.length} tables`
          : "No tables found - run schema setup"

        console.log(`📊 Found ${response.schema.tables.length} tables:`, response.schema.tables)

        // Try to get data counts if tables exist
        if (response.schema.exists) {
          try {
            // Check for customers table
            if (response.schema.tables.includes("customers")) {
              const customerCount = await sql`SELECT COUNT(*) as count FROM customers`
              response.data.customers = Number.parseInt(customerCount[0]?.count || "0")
            }

            // Check for users table
            if (response.schema.tables.includes("users")) {
              const userCount = await sql`SELECT COUNT(*) as count FROM users`
              response.data.users = Number.parseInt(userCount[0]?.count || "0")
            }

            response.data.message = `${response.data.customers} customers, ${response.data.users} users`
            console.log("📈 Data counts retrieved successfully")
          } catch (dataError) {
            console.log("⚠️ Could not retrieve data counts:", dataError)
            response.data.message = "Tables exist but data query failed"
          }
        } else {
          response.data.message = "No data - tables not created yet"
        }
      } catch (schemaError) {
        console.log("⚠️ Could not check schema:", schemaError)
        response.schema.message = "Could not check database schema"
      }
    } catch (connectionError) {
      console.log("❌ Database connection failed:", connectionError)
      response.connection.message = `Connection failed: ${connectionError instanceof Error ? connectionError.message : "Unknown error"}`
    }

    console.log("📋 Final response:", response)
    return NextResponse.json(response)
  } catch (error) {
    console.error("💥 Unexpected error in database test:", error)

    return NextResponse.json(
      {
        connection: {
          success: false,
          message: `Unexpected error: ${error instanceof Error ? error.message : "Unknown error"}`,
          timestamp: new Date().toISOString(),
        },
        schema: {
          exists: false,
          tables: [],
          message: "Could not check schema due to connection error",
        },
        data: {
          customers: 0,
          users: 0,
          message: "No data available",
        },
      },
      { status: 500 },
    )
  }
}
