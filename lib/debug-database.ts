import { neon } from "@neondatabase/serverless"

interface DatabaseCheck {
  step: string
  success: boolean
  message: string
  details?: any
  error?: string
}

interface DatabaseDebugResult {
  success: boolean
  checks: DatabaseCheck[]
  summary: string
  connectionTime?: number
}

export async function debugDatabaseConnection(): Promise<DatabaseDebugResult> {
  const checks: DatabaseCheck[] = []
  const startTime = Date.now()

  try {
    // Step 1: Check environment variable
    checks.push({
      step: "Environment Variable Check",
      success: !!process.env.DATABASE_URL,
      message: process.env.DATABASE_URL ? "DATABASE_URL is configured" : "DATABASE_URL is missing",
      details: {
        hasUrl: !!process.env.DATABASE_URL,
        urlLength: process.env.DATABASE_URL?.length || 0,
      },
    })

    if (!process.env.DATABASE_URL) {
      return {
        success: false,
        checks,
        summary: "Database URL not configured",
      }
    }

    // Step 2: Initialize connection
    let sql
    try {
      sql = neon(process.env.DATABASE_URL)
      checks.push({
        step: "Connection Initialization",
        success: true,
        message: "Database connection initialized successfully",
      })
    } catch (error) {
      checks.push({
        step: "Connection Initialization",
        success: false,
        message: "Failed to initialize database connection",
        error: error instanceof Error ? error.message : "Unknown error",
      })
      return {
        success: false,
        checks,
        summary: "Failed to initialize database connection",
      }
    }

    // Step 3: Test basic query
    try {
      const result = await sql`SELECT 1 as test`
      checks.push({
        step: "Basic Query Test",
        success: true,
        message: "Basic query executed successfully",
        details: { result: result[0] },
      })
    } catch (error) {
      checks.push({
        step: "Basic Query Test",
        success: false,
        message: "Basic query failed",
        error: error instanceof Error ? error.message : "Unknown error",
      })
      return {
        success: false,
        checks,
        summary: "Basic database query failed",
        connectionTime: Date.now() - startTime,
      }
    }

    // Step 4: Check database version
    try {
      const versionResult = await sql`SELECT version()`
      checks.push({
        step: "Database Version Check",
        success: true,
        message: "Database version retrieved successfully",
        details: { version: versionResult[0]?.version },
      })
    } catch (error) {
      checks.push({
        step: "Database Version Check",
        success: false,
        message: "Failed to get database version",
        error: error instanceof Error ? error.message : "Unknown error",
      })
    }

    // Step 5: Check for existing tables
    try {
      const tablesResult = await sql`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name
      `

      checks.push({
        step: "Tables Check",
        success: true,
        message: `Found ${tablesResult.length} tables in database`,
        details: {
          tableCount: tablesResult.length,
          tables: tablesResult.map((t) => t.table_name),
        },
      })
    } catch (error) {
      checks.push({
        step: "Tables Check",
        success: false,
        message: "Failed to check database tables",
        error: error instanceof Error ? error.message : "Unknown error",
      })
    }

    // Step 6: Test customers table specifically
    try {
      const customersResult = await sql`
        SELECT COUNT(*) as count 
        FROM customers 
        LIMIT 1
      `

      checks.push({
        step: "Customers Table Check",
        success: true,
        message: `Customers table exists with ${customersResult[0]?.count || 0} records`,
        details: { recordCount: customersResult[0]?.count || 0 },
      })
    } catch (error) {
      // Try to create the customers table if it doesn't exist
      try {
        await sql`
          CREATE TABLE IF NOT EXISTS customers (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `

        checks.push({
          step: "Customers Table Check",
          success: true,
          message: "Customers table created successfully",
          details: { action: "table_created" },
        })
      } catch (createError) {
        checks.push({
          step: "Customers Table Check",
          success: false,
          message: "Failed to access or create customers table",
          error: createError instanceof Error ? createError.message : "Unknown error",
        })
      }
    }

    const connectionTime = Date.now() - startTime
    const allSuccessful = checks.every((check) => check.success)

    return {
      success: allSuccessful,
      checks,
      summary: allSuccessful ? `Database connection successful (${connectionTime}ms)` : "Some database checks failed",
      connectionTime,
    }
  } catch (error) {
    checks.push({
      step: "Unexpected Error",
      success: false,
      message: "An unexpected error occurred during database debugging",
      error: error instanceof Error ? error.message : "Unknown error",
    })

    return {
      success: false,
      checks,
      summary: "Database debugging failed with unexpected error",
      connectionTime: Date.now() - startTime,
    }
  }
}

export function debugEnvironmentVariables() {
  console.log("🔍 Environment Variables Check:")
  console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL)
  console.log("DATABASE_URL starts with postgresql:", process.env.DATABASE_URL?.startsWith("postgresql://"))
  console.log("NEXT_PUBLIC_APP_URL:", process.env.NEXT_PUBLIC_APP_URL)
  console.log("NODE_ENV:", process.env.NODE_ENV)
  console.log("VERCEL_ENV:", process.env.VERCEL_ENV)
  console.log("VERCEL_URL:", process.env.VERCEL_URL)

  return {
    DATABASE_URL_exists: !!process.env.DATABASE_URL,
    DATABASE_URL_valid: process.env.DATABASE_URL?.startsWith("postgresql://"),
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV,
    VERCEL_URL: process.env.VERCEL_URL,
  }
}

export async function testDatabaseOperations() {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL not configured")
    }

    const sql = neon(process.env.DATABASE_URL)

    // Test INSERT
    const insertResult = await sql`
      INSERT INTO customers (name, email) 
      VALUES ('Test Customer', 'test@example.com')
      ON CONFLICT (email) DO UPDATE SET 
        name = EXCLUDED.name,
        updated_at = CURRENT_TIMESTAMP
      RETURNING id, name, email
    `

    // Test SELECT
    const selectResult = await sql`
      SELECT id, name, email, created_at 
      FROM customers 
      WHERE email = 'test@example.com'
      LIMIT 1
    `

    // Test UPDATE
    const updateResult = await sql`
      UPDATE customers 
      SET name = 'Updated Test Customer', updated_at = CURRENT_TIMESTAMP
      WHERE email = 'test@example.com'
      RETURNING id, name
    `

    // Test DELETE (cleanup)
    const deleteResult = await sql`
      DELETE FROM customers 
      WHERE email = 'test@example.com'
      RETURNING id
    `

    return {
      success: true,
      operations: {
        insert: { success: true, result: insertResult[0] },
        select: { success: true, result: selectResult[0] },
        update: { success: true, result: updateResult[0] },
        delete: { success: true, result: deleteResult[0] },
      },
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      operations: {},
    }
  }
}
