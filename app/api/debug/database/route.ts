import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET(request: NextRequest) {
  const startTime = Date.now()

  try {
    console.log("🔍 Starting database debug test...")

    // Environment check
    const environment = {
      DATABASE_URL: !!process.env.DATABASE_URL,
      POSTGRES_URL: !!process.env.POSTGRES_URL,
      POSTGRES_PRISMA_URL: !!process.env.POSTGRES_PRISMA_URL,
      DATABASE_URL_UNPOOLED: !!process.env.DATABASE_URL_UNPOOLED,
      POSTGRES_URL_NON_POOLING: !!process.env.POSTGRES_URL_NON_POOLING,
      NODE_ENV: process.env.NODE_ENV || "unknown",
      VERCEL_ENV: process.env.VERCEL_ENV || "unknown",
      NEON_PROJECT_ID: !!process.env.NEON_PROJECT_ID,
    }

    console.log("📊 Environment check:", environment)

    // Database connection test
    let connection = {
      success: false,
      message: "Not tested",
      responseTime: 0,
    }

    let ssl = {
      enabled: false,
      details: "SSL configuration not checked",
    }

    let pool = {
      configured: false,
      details: "Connection pooling not detected",
    }

    let schema = {
      accessible: false,
      details: "Schema access not tested",
    }

    const performance = {
      responseTime: 0,
    }

    // Test database connection if DATABASE_URL is available
    if (process.env.DATABASE_URL) {
      try {
        console.log("🔗 Testing database connection...")
        const connectionStart = Date.now()

        const sql = neon(process.env.DATABASE_URL)

        // Simple connection test
        const result = await sql`SELECT 1 as test, NOW() as current_time`

        const connectionTime = Date.now() - connectionStart

        connection = {
          success: true,
          message: `Connected successfully. Query returned: ${result[0]?.test}`,
          responseTime: connectionTime,
        }

        performance.responseTime = connectionTime

        // SSL check
        ssl = {
          enabled:
            process.env.DATABASE_URL.includes("sslmode=require") ||
            process.env.DATABASE_URL.includes("ssl=true") ||
            process.env.DATABASE_URL.includes("neon.tech"),
          details: process.env.DATABASE_URL.includes("neon.tech")
            ? "SSL enabled (Neon database detected)"
            : "SSL configuration detected in connection string",
        }

        // Connection pooling check
        pool = {
          configured: !!process.env.POSTGRES_PRISMA_URL || !!process.env.DATABASE_URL_UNPOOLED,
          details: process.env.POSTGRES_PRISMA_URL
            ? "Prisma connection pooling detected"
            : process.env.DATABASE_URL_UNPOOLED
              ? "Unpooled connection available"
              : "No specific pooling configuration detected",
        }

        // Schema access test
        try {
          const schemaTest = await sql`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            LIMIT 5
          `

          schema = {
            accessible: true,
            details: `Schema accessible. Found ${schemaTest.length} tables in public schema`,
          }
        } catch (schemaError) {
          schema = {
            accessible: false,
            details: `Schema access limited: ${schemaError instanceof Error ? schemaError.message : "Unknown error"}`,
          }
        }

        console.log("✅ Database connection successful")
      } catch (dbError) {
        console.error("❌ Database connection failed:", dbError)

        connection = {
          success: false,
          message: `Connection failed: ${dbError instanceof Error ? dbError.message : "Unknown database error"}`,
          responseTime: Date.now() - startTime,
        }
      }
    } else {
      connection = {
        success: false,
        message: "DATABASE_URL environment variable not found",
        responseTime: 0,
      }
    }

    const totalTestTime = Date.now() - startTime

    // Generate recommendations
    const recommendations = []

    if (!environment.DATABASE_URL) {
      recommendations.push("Set up DATABASE_URL environment variable for database connectivity")
    }

    if (!ssl.enabled) {
      recommendations.push("Enable SSL for secure database connections in production")
    }

    if (!pool.configured) {
      recommendations.push("Consider setting up connection pooling for better performance")
    }

    if (performance.responseTime > 1000) {
      recommendations.push("Database response time is high. Consider optimizing queries or upgrading database plan")
    }

    if (!schema.accessible) {
      recommendations.push("Ensure proper database permissions for schema access")
    }

    if (recommendations.length === 0) {
      recommendations.push("Database configuration looks good! Consider monitoring performance regularly")
    }

    const response = {
      success: connection.success,
      timestamp: new Date().toISOString(),
      environment,
      connection,
      ssl,
      pool,
      performance,
      schema,
      totalTestTime,
      recommendations,
    }

    console.log("📋 Test completed:", response)

    return NextResponse.json(response, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    })
  } catch (error) {
    console.error("💥 Database debug test failed:", error)

    const errorResponse = {
      success: false,
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Unknown error occurred",
      environment: {
        DATABASE_URL: !!process.env.DATABASE_URL,
        POSTGRES_URL: !!process.env.POSTGRES_URL,
        POSTGRES_PRISMA_URL: !!process.env.POSTGRES_PRISMA_URL,
        NODE_ENV: process.env.NODE_ENV || "unknown",
        VERCEL_ENV: process.env.VERCEL_ENV || "unknown",
      },
      connection: {
        success: false,
        message: "Test failed due to error",
        responseTime: 0,
      },
      ssl: {
        enabled: false,
        details: "Could not check SSL configuration",
      },
      pool: {
        configured: false,
        details: "Could not check pooling configuration",
      },
      performance: {
        responseTime: 0,
      },
      schema: {
        accessible: false,
        details: "Could not check schema access",
      },
      totalTestTime: Date.now() - startTime,
      recommendations: [
        "Check server logs for detailed error information",
        "Verify environment variables are properly set",
        "Ensure database service is running and accessible",
        "Check network connectivity to database server",
      ],
    }

    return NextResponse.json(errorResponse, {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    })
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}
