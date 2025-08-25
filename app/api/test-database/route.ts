import { NextResponse } from "next/server"
import { supabase, testSupabaseConnection } from "@/lib/supabase"

export async function GET() {
  try {
    const startTime = Date.now()

    // Test basic connection
    const connectionTest = await testSupabaseConnection()

    // Test table access
    const { data: customers, error: customersError } = await supabase.from("customers").select("id, name").limit(5)

    const { data: users, error: usersError } = await supabase.from("users").select("id, name, role").limit(5)

    const endTime = Date.now()
    const totalLatency = endTime - startTime

    const testResults = {
      success: connectionTest.success && !customersError && !usersError,
      timestamp: new Date().toISOString(),
      latency: `${totalLatency}ms`,
      connection: connectionTest,
      tables: {
        customers: {
          accessible: !customersError,
          count: customers?.length || 0,
          error: customersError?.message || null,
        },
        users: {
          accessible: !usersError,
          count: users?.length || 0,
          error: usersError?.message || null,
        },
      },
      environment: {
        supabase_url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        supabase_anon_key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        supabase_service_key: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        database_url: !!process.env.DATABASE_URL,
      },
    }

    return NextResponse.json(testResults, {
      status: testResults.success ? 200 : 500,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    })
  } catch (error) {
    console.error("Database test error:", error)

    return NextResponse.json(
      {
        success: false,
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
        message: "Database test failed",
      },
      { status: 500 },
    )
  }
}

export async function POST() {
  try {
    // Create test data
    const testCustomer = {
      name: "Test Customer",
      contact_person: "Test Person",
      email: "test@example.com",
      phone: "06-12345678",
      active: true,
    }

    const { data: customer, error: customerError } = await supabase
      .from("customers")
      .insert([testCustomer])
      .select()
      .single()

    if (customerError) {
      return NextResponse.json(
        {
          success: false,
          error: customerError.message,
          message: "Failed to create test customer",
        },
        { status: 500 },
      )
    }

    // Clean up test data
    await supabase.from("customers").delete().eq("id", customer.id)

    return NextResponse.json({
      success: true,
      message: "Database write/read test successful",
      testData: {
        created: customer,
        cleaned: true,
      },
    })
  } catch (error) {
    console.error("Database write test error:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        message: "Database write test failed",
      },
      { status: 500 },
    )
  }
}
