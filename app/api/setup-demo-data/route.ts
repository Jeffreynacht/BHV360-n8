import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function POST() {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: "DATABASE_URL not configured" }, { status: 500 })
    }

    const sql = neon(process.env.DATABASE_URL)

    // Create tables if they don't exist
    await sql`
      CREATE TABLE IF NOT EXISTS customers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        contact_person VARCHAR(255),
        email VARCHAR(255),
        active BOOLEAN DEFAULT true,
        buildings INTEGER DEFAULT 0,
        users INTEGER DEFAULT 0,
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        customer_id INTEGER REFERENCES customers(id),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(50),
        role VARCHAR(100),
        department VARCHAR(100),
        bhv_roles JSONB DEFAULT '[]',
        active BOOLEAN DEFAULT true,
        last_login TIMESTAMP WITH TIME ZONE,
        photo_url TEXT,
        emergency_contact JSONB,
        certificates JSONB,
        accessibility JSONB,
        work_schedule JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `

    // Insert demo customers
    const customers = await sql`
      INSERT INTO customers (name, contact_person, email, active, buildings, users, status) 
      VALUES 
        ('Demo Bedrijf BV', 'Jan de Vries', 'jan@demobedrijf.nl', true, 3, 25, 'active'),
        ('Provincie Noord-Brabant', 'Marie van den Berg', 'marie@brabant.nl', true, 5, 50, 'active'),
        ('Test Organisatie', 'Piet Janssen', 'piet@testorg.nl', true, 1, 10, 'active')
      ON CONFLICT DO NOTHING
      RETURNING *
    `

    // Insert demo users for first customer
    if (customers.length > 0) {
      const customerId = customers[0].id
      await sql`
        INSERT INTO users (customer_id, name, email, phone, role, department, bhv_roles, active, emergency_contact, certificates, work_schedule)
        VALUES 
          (${customerId}, 'Jan Jansen', 'j.jansen@demobedrijf.nl', '06-12345678', 'BHV Coordinator', 'IT', '["EHBO", "BHV", "Coordinator BHV"]', true, 
           '{"name": "Marie Jansen", "phone": "06-87654321", "relation": "Echtgenote"}',
           '{"bhv": {"valid": true, "expiryDate": "2024-12-15", "level": "Basis", "certificateNumber": "BHV-2023-001"}}',
           '{"monday": {"start": "08:00", "end": "17:00", "present": true}, "tuesday": {"start": "08:00", "end": "17:00", "present": true}}'),
          (${customerId}, 'Petra de Vries', 'p.devries@demobedrijf.nl', '06-23456789', 'Ploegleider', 'HR', '["Ploegleider", "EHBO"]', true,
           '{"name": "Piet de Vries", "phone": "06-11223344", "relation": "Echtgenoot"}',
           '{"bhv": {"valid": true, "expiryDate": "2025-03-10", "level": "Ploegleider", "certificateNumber": "BHV-2023-002"}}',
           '{"monday": {"start": "09:00", "end": "18:00", "present": true}, "tuesday": {"start": "09:00", "end": "18:00", "present": true}}')
        ON CONFLICT (email) DO NOTHING
      `
    }

    // Get final counts
    const customerCount = await sql`SELECT COUNT(*) as count FROM customers`
    const userCount = await sql`SELECT COUNT(*) as count FROM users`

    return NextResponse.json({
      success: true,
      message: "Demo data created successfully",
      data: {
        customers: customerCount[0].count,
        users: userCount[0].count,
      },
    })
  } catch (error) {
    console.error("Setup demo data error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: "DATABASE_URL not configured" }, { status: 500 })
    }

    const sql = neon(process.env.DATABASE_URL)

    const customers = await sql`SELECT * FROM customers ORDER BY name`
    const users = await sql`SELECT * FROM users ORDER BY name`

    return NextResponse.json({
      success: true,
      data: {
        customers,
        users,
      },
    })
  } catch (error) {
    console.error("Get demo data error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
