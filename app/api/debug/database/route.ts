import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET(request: NextRequest) {
  const startTime = Date.now()

  try {
    const environment = {
      DATABASE_URL: !!process.env.DATABASE_URL,
      POSTGRES_URL: !!process.env.POSTGRES_URL,
      POSTGRES_PRISMA_URL: !!process.env.POSTGRES_PRISMA_URL,
      POSTGRES_URL_NON_POOLING: !!process.env.POSTGRES_URL_NON_POOLING,
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV,
    }

    let connectionResult = { success: false, message: "", responseTime: 0 }
    let sslResult = { enabled: false, details: "" }
    let poolResult = { configured: false, details: "" }
    let performanceResult = { responseTime: 0 }
    let schemaResult = { accessible: false, details: "" }

    if (process.env.DATABASE_URL) {
      try {
        const sql = neon(process.env.DATABASE_URL)
        const connectionStart = Date.now()

        const result = await sql`SELECT 1 as test, NOW() as current_time, version() as db_version`
        const connectionTime = Date.now() - connectionStart

        connectionResult = {
          success: true,
          message: "Database connection successful",
          responseTime: connectionTime,
        }

        performanceResult = { responseTime: connectionTime }

        const dbUrl = new URL(process.env.DATABASE_URL)
        const sslMode = dbUrl.searchParams.get("sslmode") || "prefer"
        sslResult = {
          enabled: sslMode !== "disable",
          details: `SSL mode: ${sslMode}`,
        }

        poolResult = {
          configured: !!process.env.POSTGRES_PRISMA_URL,
          details: process.env.POSTGRES_PRISMA_URL
            ? "Prisma pooling detected"
            : "Neon serverless driver with built-in connection pooling",
        }

        try {
          const schemaTest = await sql`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            LIMIT 5
          `
          schemaResult = {
            accessible: true,
            details: `Found ${schemaTest.length} tables in public schema`,
          }
        } catch (schemaError) {
          schemaResult = {
            accessible: false,
            details: schemaError instanceof Error ? schemaError.message : "Schema access error",
          }
        }
      } catch (dbError) {
        connectionResult = {
          success: false,
          message: dbError instanceof Error ? dbError.message : "Unknown database error",
          responseTime: Date.now() - startTime,
        }
      }
    } else {
      connectionResult = {
        success: false,
        message: "DATABASE_URL environment variable not found",
        responseTime: 0,
      }
    }

    const totalTestTime = Date.now() - startTime

    const recommendations = []
    if (!environment.DATABASE_URL) {
      recommendations.push("Set DATABASE_URL environment variable for database connectivity")
    }
    if (!sslResult.enabled) {
      recommendations.push("Enable SSL for secure database connections in production")
    }
    if (!poolResult.configured && !process.env.DATABASE_URL?.includes("neon")) {
      recommendations.push("Consider setting up connection pooling for better performance")
    }
    if (performanceResult.responseTime > 1000) {
      recommendations.push("Database response time is high, consider optimizing queries or upgrading database plan")
    }
    if (!schemaResult.accessible) {
      recommendations.push("Verify database permissions and schema access")
    }
    if (recommendations.length === 0) {
      recommendations.push("Database configuration looks good!")
      recommendations.push("Consider setting up monitoring for production environments")
      recommendations.push("Regular backups are recommended for data safety")
    }

    const response = {
      success: true,
      environment,
      connection: connectionResult,
      ssl: sslResult,
      pool: poolResult,
      performance: performanceResult,
      schema: schemaResult,
      totalTestTime,
      recommendations,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    })
  } catch (error) {
    console.error("Database debug error:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
        environment: {
          DATABASE_URL: !!process.env.DATABASE_URL,
          POSTGRES_URL: !!process.env.POSTGRES_URL,
          NODE_ENV: process.env.NODE_ENV,
          VERCEL_ENV: process.env.VERCEL_ENV,
        },
        recommendations: [
          "Check server logs for detailed error information",
          "Verify environment variables are properly set",
          "Ensure database service is running and accessible",
          "Check network connectivity to database server",
        ],
        timestamp: new Date().toISOString(),
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      },
    )
  }
}

export async function POST(request: NextRequest) {
  return GET(request)
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
