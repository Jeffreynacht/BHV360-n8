import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    // Create customers table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS customers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        contact_person VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(50),
        address TEXT,
        subscription_type VARCHAR(100) DEFAULT 'basic',
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Check if we have any customers, if not, insert demo data
    const existingCustomers = await sql`SELECT COUNT(*) as count FROM customers`

    if (existingCustomers[0].count === "0") {
      await sql`
        INSERT INTO customers (name, contact_person, email, phone, address, subscription_type, status) VALUES
        ('Acme Corporation', 'John Smith', 'john@acme.com', '+31 20 123 4567', 'Hoofdstraat 1, 1000 AA Amsterdam', 'premium', 'active'),
        ('TechStart BV', 'Sarah Johnson', 'sarah@techstart.nl', '+31 30 987 6543', 'Innovatielaan 25, 3500 BB Utrecht', 'basic', 'active'),
        ('Global Industries', 'Mike Wilson', 'mike@global.com', '+31 10 555 0123', 'Zakenkwartier 100, 3000 CC Rotterdam', 'enterprise', 'active'),
        ('Local Services', 'Emma Brown', 'emma@local.nl', '+31 40 444 5678', 'Dorpsstraat 15, 5600 DD Eindhoven', 'basic', 'inactive')
      `
    }

    // Fetch all customers
    const customers = await sql`
      SELECT * FROM customers 
      ORDER BY created_at DESC
    `

    return NextResponse.json({
      success: true,
      customers: customers,
      count: customers.length,
    })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch customers",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, contact_person, email, phone, address, subscription_type } = body

    if (!name) {
      return NextResponse.json({ success: false, error: "Name is required" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO customers (name, contact_person, email, phone, address, subscription_type)
      VALUES (${name}, ${contact_person || null}, ${email || null}, ${phone || null}, ${address || null}, ${subscription_type || "basic"})
      RETURNING *
    `

    return NextResponse.json({
      success: true,
      customer: result[0],
      message: "Customer created successfully",
    })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create customer",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
