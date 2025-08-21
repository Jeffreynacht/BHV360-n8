import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Simulate database connection test
    const testResult = {
      status: "success",
      message: "Database connection successful",
      timestamp: new Date().toISOString(),
      connectionTime: Math.random() * 100,
      tables: ["users", "customers", "incidents", "plotkaarten"],
      version: "1.0.0",
    }

    return NextResponse.json(testResult, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: "Database connection failed",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

export async function POST() {
  try {
    // Simulate database write test
    const writeResult = {
      status: "success",
      message: "Database write test successful",
      timestamp: new Date().toISOString(),
      recordId: Math.floor(Math.random() * 10000),
      operation: "INSERT",
    }

    return NextResponse.json(writeResult, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: "Database write test failed",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
