import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    console.log(`🔍 Fetching customer ${id}...`)

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const sql = neon(process.env.DATABASE_URL)

    const customers = await sql`
      SELECT 
        id,
        name,
        contact_person,
        email,
        phone,
        address,
        created_at,
        updated_at
      FROM customers 
      WHERE id = ${Number.parseInt(id)}
    `

    if (customers.length === 0) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }

    const customer = customers[0]
    console.log("✅ Customer found:", customer.name)

    return NextResponse.json({
      customer: {
        id: customer.id,
        name: customer.name,
        contactPerson: customer.contact_person,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        createdAt: customer.created_at,
        updatedAt: customer.updated_at,
      },
    })
  } catch (error) {
    console.error("❌ Error fetching customer:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch customer",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    console.log(`📝 Updating customer ${id}...`)

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const body = await request.json()
    const { name, contactPerson, email, phone, address } = body

    // Validation
    if (!name || !contactPerson || !email) {
      return NextResponse.json({ error: "Name, contact person, and email are required" }, { status: 400 })
    }

    const sql = neon(process.env.DATABASE_URL)

    const result = await sql`
      UPDATE customers 
      SET 
        name = ${name},
        contact_person = ${contactPerson},
        email = ${email},
        phone = ${phone || null},
        address = ${address || null},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${Number.parseInt(id)}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }

    const updatedCustomer = result[0]
    console.log("✅ Customer updated:", updatedCustomer.name)

    return NextResponse.json({
      customer: {
        id: updatedCustomer.id,
        name: updatedCustomer.name,
        contactPerson: updatedCustomer.contact_person,
        email: updatedCustomer.email,
        phone: updatedCustomer.phone,
        address: updatedCustomer.address,
        createdAt: updatedCustomer.created_at,
        updatedAt: updatedCustomer.updated_at,
      },
      message: "Customer updated successfully",
    })
  } catch (error) {
    console.error("❌ Error updating customer:", error)
    return NextResponse.json(
      {
        error: "Failed to update customer",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    console.log(`🗑️ Deleting customer ${id}...`)

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const sql = neon(process.env.DATABASE_URL)

    const result = await sql`
      DELETE FROM customers 
      WHERE id = ${Number.parseInt(id)}
      RETURNING name
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }

    console.log("✅ Customer deleted:", result[0].name)

    return NextResponse.json({
      message: "Customer deleted successfully",
    })
  } catch (error) {
    console.error("❌ Error deleting customer:", error)
    return NextResponse.json(
      {
        error: "Failed to delete customer",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
