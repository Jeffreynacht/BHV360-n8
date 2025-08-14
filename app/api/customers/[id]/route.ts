import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const customerId = Number.parseInt(params.id)

    if (isNaN(customerId)) {
      return NextResponse.json({ success: false, error: "Invalid customer ID" }, { status: 400 })
    }

    const customers = await sql`
      SELECT * FROM customers WHERE id = ${customerId}
    `

    if (customers.length === 0) {
      return NextResponse.json({ success: false, error: "Customer not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      customer: customers[0],
    })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch customer",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const customerId = Number.parseInt(params.id)

    if (isNaN(customerId)) {
      return NextResponse.json({ success: false, error: "Invalid customer ID" }, { status: 400 })
    }

    const body = await request.json()
    const { name, contact_person, email, phone, address, subscription_type, status } = body

    if (!name) {
      return NextResponse.json({ success: false, error: "Name is required" }, { status: 400 })
    }

    const result = await sql`
      UPDATE customers 
      SET 
        name = ${name},
        contact_person = ${contact_person || null},
        email = ${email || null},
        phone = ${phone || null},
        address = ${address || null},
        subscription_type = ${subscription_type || "basic"},
        status = ${status || "active"},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${customerId}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ success: false, error: "Customer not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      customer: result[0],
      message: "Customer updated successfully",
    })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update customer",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const customerId = Number.parseInt(params.id)

    if (isNaN(customerId)) {
      return NextResponse.json({ success: false, error: "Invalid customer ID" }, { status: 400 })
    }

    // Soft delete - set status to inactive instead of actually deleting
    const result = await sql`
      UPDATE customers 
      SET status = 'deleted', updated_at = CURRENT_TIMESTAMP
      WHERE id = ${customerId}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ success: false, error: "Customer not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Customer deleted successfully",
    })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete customer",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
