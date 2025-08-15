import { neon } from "@neondatabase/serverless"

export interface DebugCheck {
  name: string
  status: "success" | "error" | "warning"
  message: string
  details?: any
  timestamp: Date
}

export interface EnvironmentResult {
  checks: DebugCheck[]
  recommendations: string[]
}

export interface DatabaseResult {
  status: "healthy" | "warning" | "critical"
  connectionInfo: any
  checks: DebugCheck[]
}

export class DatabaseDebugService {
  async checkEnvironmentVariables(): Promise<EnvironmentResult> {
    const checks: DebugCheck[] = []
    const recommendations: string[] = []

    // Check for required environment variables
    const requiredVars = [
      "DATABASE_URL",
      "POSTGRES_URL",
      "POSTGRES_PRISMA_URL",
      "POSTGRES_URL_NON_POOLING",
      "POSTGRES_USER",
      "POSTGRES_PASSWORD",
      "POSTGRES_DATABASE",
      "POSTGRES_HOST",
    ]

    const presentVars = requiredVars.filter((varName) => process.env[varName])
    const missingVars = requiredVars.filter((varName) => !process.env[varName])

    checks.push({
      name: "Environment Variables Check",
      status: missingVars.length === 0 ? "success" : "warning",
      message: `${presentVars.length}/${requiredVars.length} required variables present`,
      details: {
        present: presentVars,
        missing: missingVars,
        total: requiredVars.length,
      },
      timestamp: new Date(),
    })

    if (missingVars.length > 0) {
      recommendations.push(`Missing environment variables: ${missingVars.join(", ")}`)
    }

    // Check DATABASE_URL format
    const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL
    if (dbUrl) {
      try {
        const url = new URL(dbUrl)
        checks.push({
          name: "Database URL Format",
          status: "success",
          message: "Database URL is properly formatted",
          details: {
            protocol: url.protocol,
            hostname: url.hostname,
            port: url.port || "5432",
            database: url.pathname.slice(1),
          },
          timestamp: new Date(),
        })
      } catch (error) {
        checks.push({
          name: "Database URL Format",
          status: "error",
          message: "Invalid database URL format",
          details: { error: error.message },
          timestamp: new Date(),
        })
        recommendations.push("Fix the DATABASE_URL format")
      }
    } else {
      checks.push({
        name: "Database URL Format",
        status: "error",
        message: "No database URL found",
        details: {},
        timestamp: new Date(),
      })
      recommendations.push("Set DATABASE_URL or POSTGRES_URL environment variable")
    }

    return { checks, recommendations }
  }

  async testDatabaseConnection(): Promise<DatabaseResult> {
    const checks: DebugCheck[] = []
    let status: "healthy" | "warning" | "critical" = "healthy"
    let connectionInfo = {}

    const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL

    if (!dbUrl) {
      checks.push({
        name: "Database Connection",
        status: "error",
        message: "No database connection available",
        details: { error: "Missing database URL" },
        timestamp: new Date(),
      })
      return { status: "critical", connectionInfo: {}, checks }
    }

    // Test basic connection
    try {
      const sql = neon(dbUrl)
      const startTime = Date.now()
      const result = await sql`SELECT 1 as test, NOW() as current_time, version() as db_version`
      const endTime = Date.now()
      const responseTime = endTime - startTime

      connectionInfo = {
        responseTime: `${responseTime}ms`,
        currentTime: result[0]?.current_time,
        version: result[0]?.db_version,
        testQuery: "SELECT 1 as test, NOW() as current_time, version() as db_version",
      }

      checks.push({
        name: "Basic Connection Test",
        status: responseTime < 1000 ? "success" : "warning",
        message: `Connection successful in ${responseTime}ms`,
        details: {
          responseTime,
          dbVersion: result[0]?.db_version,
          currentTime: result[0]?.current_time,
        },
        timestamp: new Date(),
      })

      if (responseTime > 1000) {
        status = "warning"
      }
    } catch (error) {
      checks.push({
        name: "Basic Connection Test",
        status: "error",
        message: `Connection failed: ${error.message}`,
        details: { error: error.message },
        timestamp: new Date(),
      })
      status = "critical"
    }

    // Test table access
    if (status !== "critical") {
      try {
        const sql = neon(dbUrl)
        const tables = await sql`
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = 'public' 
          LIMIT 5
        `

        checks.push({
          name: "Table Access Test",
          status: "success",
          message: `Found ${tables.length} tables in public schema`,
          details: {
            tableCount: tables.length,
            sampleTables: tables.map((t) => t.table_name),
          },
          timestamp: new Date(),
        })
      } catch (error) {
        checks.push({
          name: "Table Access Test",
          status: "warning",
          message: `Table access limited: ${error.message}`,
          details: { error: error.message },
          timestamp: new Date(),
        })
        if (status === "healthy") status = "warning"
      }
    }

    return { status, connectionInfo, checks }
  }
}

export const databaseDebugService = new DatabaseDebugService()

// Named exports for compatibility
export async function debugEnvironmentVariables(): Promise<EnvironmentResult> {
  return databaseDebugService.checkEnvironmentVariables()
}

export async function debugDatabaseConnection(): Promise<DatabaseResult> {
  return databaseDebugService.testDatabaseConnection()
}
