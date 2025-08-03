import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET(request: NextRequest) {
  const startTime = Date.now()

  try {
    // Environment check
    const environment = {
      DATABASE_URL: !!process.env.DATABASE_URL,
      POSTGRES_URL: !!process.env.POSTGRES_URL,
      POSTGRES_PRISMA_URL: !!process.env.POSTGRES_PRISMA_URL,
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV,
    }

    let connectionResult = { success: false, message: "", responseTime: 0 }
    let sslResult = { enabled: false, details: "" }
    let poolResult = { configured: false, details: "" }
    let performanceResult = { responseTime: 0 }
    let schemaResult = { accessible: false, details: "" }

    // Database connection test
    if (process.env.DATABASE_URL) {
      try {
        const sql = neon(process.env.DATABASE_URL)
        const connectionStart = Date.now()

        // Simple connection test
        const result = await sql`SELECT 1 as test`
        const connectionTime = Date.now() - connectionStart

        connectionResult = {
          success: true,
          message: "Database connection successful",
          responseTime: connectionTime,
        }

        performanceResult = { responseTime: connectionTime }

        // SSL check
        sslResult = {
          enabled:
            process.env.DATABASE_URL.includes("sslmode=require") || process.env.DATABASE_URL.includes("ssl=true"),
          details: "SSL configuration detected in connection string",
        }

        // Pool check (Neon has built-in pooling)
        poolResult = {
          configured: true,
          details: "Neon serverless driver with built-in connection pooling",
        }

        // Schema access test
        try {
          const schemaTest = await sql`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            LIMIT 1
          `
          schemaResult = {
            accessible: true,
            details: "Schema access verified",
          }
        } catch (schemaError) {
          schemaResult = {
            accessible: false,
            details: "Limited schema access or no tables found",
          }
        }
      } catch (dbError) {
        connectionResult = {
          success: false,
          message: dbError instanceof Error ? dbError.message : "Unknown database error",
          responseTime: 0,
        }
      }
    } else {
      connectionResult = {
        success: false,
        message: "No DATABASE_URL environment variable found",
        responseTime: 0,
      }
    }

    const totalTestTime = Date.now() - startTime

    // Generate recommendations
    const recommendations = []
    if (!connectionResult.success) {
      recommendations.push("Fix database connection issues before proceeding")
    }
    if (!sslResult.enabled) {
      recommendations.push("Enable SSL for secure database connections")
    }
    if (performanceResult.responseTime > 1000) {
      recommendations.push("Database response time is slow, consider optimization")
    }
    if (!environment.DATABASE_URL) {
      recommendations.push("Set up DATABASE_URL environment variable")
    }
    if (recommendations.length === 0) {
      recommendations.push("Database configuration looks good!")
      recommendations.push("Consider setting up monitoring for production")
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
        ],
        timestamp: new Date().toISOString(),
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    )
  }
}

export async function POST(request: NextRequest) {
  return GET(request)
}
