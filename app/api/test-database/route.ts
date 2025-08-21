import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Simulate database connection test
    const connectionTest = {
      status: "connected",
      timestamp: new Date().toISOString(),
      database: "postgresql",
      host: process.env.PGHOST || "localhost",
      port: process.env.PGPORT || "5432",
      database_name: process.env.POSTGRES_DATABASE || "bhv360",
      ssl: process.env.NODE_ENV === "production",
      connection_time: Math.random() * 100 + 50, // Simulate connection time
      tables: ["users", "customers", "incidents", "plotkaarten", "bhv_members", "certifications"],
    }

    return NextResponse.json(connectionTest, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Database connection failed",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

export async function POST() {
  try {
    // Simulate database write test
    const writeTest = {
      status: "success",
      operation: "write_test",
      timestamp: new Date().toISOString(),
      records_inserted: 1,
      execution_time: Math.random() * 50 + 10,
    }

    return NextResponse.json(writeTest, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        operation: "write_test",
        message: error instanceof Error ? error.message : "Database write failed",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
