import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET() {
  try {
    console.log("🔍 Fetching customers...")

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const sql = neon(process.env.DATABASE_URL)

    // Check if customers table exists
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'customers'
      )
    `

    if (!tableCheck[0]?.exists) {
      console.log("⚠️ Customers table does not exist")
      return NextResponse.json({
        customers: [],
        total: 0,
        message: "Customers table not found - database setup required",
      })
    }

    // Fetch customers
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
      ORDER BY name ASC
    `

    console.log(`✅ Found ${customers.length} customers`)

    return NextResponse.json({
      customers: customers.map((customer) => ({
        id: customer.id,
        name: customer.name,
        contactPerson: customer.contact_person,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        createdAt: customer.created_at,
        updatedAt: customer.updated_at,
      })),
      total: customers.length,
      message: `Found ${customers.length} customers`,
    })
  } catch (error) {
    console.error("❌ Error fetching customers:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch customers",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("📝 Creating new customer...")

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

    // Check if customers table exists, create if not
    await sql`
      CREATE TABLE IF NOT EXISTS customers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        contact_person VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Insert new customer
    const result = await sql`
      INSERT INTO customers (name, contact_person, email, phone, address)
      VALUES (${name}, ${contactPerson}, ${email}, ${phone || null}, ${address || null})
      RETURNING *
    `

    const newCustomer = result[0]
    console.log("✅ Customer created:", newCustomer.name)

    return NextResponse.json(
      {
        customer: {
          id: newCustomer.id,
          name: newCustomer.name,
          contactPerson: newCustomer.contact_person,
          email: newCustomer.email,
          phone: newCustomer.phone,
          address: newCustomer.address,
          createdAt: newCustomer.created_at,
          updatedAt: newCustomer.updated_at,
        },
        message: "Customer created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("❌ Error creating customer:", error)
    return NextResponse.json(
      {
        error: "Failed to create customer",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
