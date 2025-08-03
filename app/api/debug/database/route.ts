import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET(request: NextRequest) {
  try {
    const startTime = Date.now()

    // Check environment variables
    const environment = {
      DATABASE_URL: !!process.env.DATABASE_URL,
      POSTGRES_URL: !!process.env.POSTGRES_URL,
      POSTGRES_PRISMA_URL: !!process.env.POSTGRES_PRISMA_URL,
      POSTGRES_URL_NON_POOLING: !!process.env.POSTGRES_URL_NON_POOLING,
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV,
    }

    let connection = { success: false, message: "", responseTime: 0 }
    let ssl = { enabled: false, details: "" }
    let pool = { configured: false, details: "" }
    let performance = { responseTime: 0 }
    let schema = { accessible: false, details: "" }

    // Test database connection
    if (process.env.DATABASE_URL) {
      try {
        const sql = neon(process.env.DATABASE_URL)
        const connectionStart = Date.now()

        // Simple connection test
        const result = await sql`SELECT 1 as test`
        const connectionTime = Date.now() - connectionStart

        connection = {
          success: true,
          message: "Successfully connected to database",
          responseTime: connectionTime,
        }

        performance = { responseTime: connectionTime }

        // Test schema access
        try {
          await sql`SELECT table_name FROM information_schema.tables LIMIT 1`
          schema = {
            accessible: true,
            details: "Schema access confirmed",
          }
        } catch (schemaError) {
          schema = {
            accessible: false,
            details: `Schema access error: ${schemaError instanceof Error ? schemaError.message : "Unknown error"}`,
          }
        }

        // Check SSL configuration
        const dbUrl = new URL(process.env.DATABASE_URL)
        ssl = {
          enabled: dbUrl.searchParams.get("sslmode") !== "disable",
          details: `SSL mode: ${dbUrl.searchParams.get("sslmode") || "default"}`,
        }

        // Check connection pooling
        pool = {
          configured: process.env.POSTGRES_PRISMA_URL !== undefined,
          details: process.env.POSTGRES_PRISMA_URL ? "Prisma pooling detected" : "No pooling configuration found",
        }
      } catch (dbError) {
        connection = {
          success: false,
          message: `Database connection failed: ${dbError instanceof Error ? dbError.message : "Unknown error"}`,
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

    // Generate recommendations
    const recommendations = []

    if (!environment.DATABASE_URL) {
      recommendations.push("Set DATABASE_URL environment variable for database connectivity")
    }

    if (!ssl.enabled) {
      recommendations.push("Enable SSL for secure database connections in production")
    }

    if (!pool.configured) {
      recommendations.push("Consider setting up connection pooling for better performance")
    }

    if (performance.responseTime > 1000) {
      recommendations.push("Database response time is high, consider optimizing queries or upgrading database plan")
    }

    if (!schema.accessible) {
      recommendations.push("Verify database permissions and schema access")
    }

    const totalTime = Date.now() - startTime

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      totalTestTime: totalTime,
      environment,
      connection,
      ssl,
      pool,
      performance,
      schema,
      recommendations,
    })
  } catch (error) {
    console.error("Database debug error:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
        timestamp: new Date().toISOString(),
        environment: {
          DATABASE_URL: !!process.env.DATABASE_URL,
          NODE_ENV: process.env.NODE_ENV,
          VERCEL_ENV: process.env.VERCEL_ENV,
        },
        recommendations: [
          "Check database connection string",
          "Verify environment variables are set correctly",
          "Ensure database is accessible from current environment",
          "Review error logs for more details",
        ],
      },
      { status: 500 },
    )
  }
}
