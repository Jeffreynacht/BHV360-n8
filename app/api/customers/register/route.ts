import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { hash } from "bcryptjs"
import { randomUUID } from "crypto"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { companyName, contactPerson, email, phone, address, city, postalCode, password, planType = "starter" } = body

    // Validate required fields
    if (!companyName || !contactPerson || !email || !password) {
      return NextResponse.json({ success: false, error: "Verplichte velden ontbreken" }, { status: 400 })
    }

    // Check if customer already exists
    const existingCustomer = await sql`
      SELECT id FROM customers WHERE email = ${email}
    `

    if (existingCustomer.length > 0) {
      return NextResponse.json({ success: false, error: "Een klant met dit e-mailadres bestaat al" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await hash(password, 12)

    // Generate customer ID
    const customerId = randomUUID()

    // Create customer
    const customer = await sql`
      INSERT INTO customers (
        id, name, contact_person, email, phone, address, city, postal_code,
        subscription_type, status, users_count, buildings_count, 
        trial_ends_at, created_at, updated_at
      ) VALUES (
        ${customerId}, ${companyName}, ${contactPerson}, ${email}, ${phone || null}, 
        ${address || null}, ${city || null}, ${postalCode || null},
        ${planType}, 'trial', 1, 1,
        ${new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()},
        ${new Date().toISOString()}, ${new Date().toISOString()}
      )
      RETURNING *
    `

    // Create admin user for the customer
    const adminUser = await sql`
      INSERT INTO user_profiles (
        id, customer_id, email, name, role, status, password_hash, created_at, updated_at
      ) VALUES (
        ${randomUUID()}, ${customerId}, ${email}, ${contactPerson}, 'customer_admin', 'active',
        ${hashedPassword}, ${new Date().toISOString()}, ${new Date().toISOString()}
      )
      RETURNING id, email, name, role
    `

    // Send welcome email (mock for now)
    console.log(`Welcome email would be sent to: ${email}`)

    return NextResponse.json({
      success: true,
      message: "Klant succesvol geregistreerd! U kunt nu inloggen.",
      customer: {
        id: customer[0].id,
        name: customer[0].name,
        email: customer[0].email,
        trialEndsAt: customer[0].trial_ends_at,
      },
      user: adminUser[0],
    })
  } catch (error) {
    console.error("Customer registration error:", error)
    return NextResponse.json({ success: false, error: "Er is een fout opgetreden bij de registratie" }, { status: 500 })
  }
}
