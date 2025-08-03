import { neon } from "@neondatabase/serverless"

// Neon database connection
const sql = neon(process.env.DATABASE_URL!)

export { sql }

// Test database connection
export async function testConnection() {
  try {
    const result = await sql`SELECT NOW() as current_time, version() as version`
    console.log("✅ Neon database connected:", result[0].current_time)
    return true
  } catch (error) {
    console.error("❌ Neon database connection failed:", error)
    return false
  }
}

// Database helper functions
export async function getCustomers() {
  try {
    const customers = await sql`
      SELECT * FROM customers 
      WHERE active = true 
      ORDER BY name
    `
    return customers
  } catch (error) {
    console.error("Error fetching customers:", error)
    // Fallback to mock data
    return [
      {
        id: "1",
        name: "Demo Bedrijf BV",
        contact_person: "Jan de Vries",
        email: "jan@demobedrijf.nl",
        active: true,
        buildings: 3,
        users: 25,
        status: "active",
        created_at: new Date().toISOString(),
      },
      {
        id: "2",
        name: "Provincie Noord-Brabant",
        contact_person: "Marie van den Berg",
        email: "marie@brabant.nl",
        active: true,
        buildings: 5,
        users: 50,
        status: "active",
        created_at: new Date().toISOString(),
      },
    ]
  }
}

export async function getUsersByCustomer(customerId: string) {
  try {
    const users = await sql`
      SELECT * FROM users 
      WHERE customer_id = ${customerId} AND active = true
      ORDER BY name
    `
    return users
  } catch (error) {
    console.error("Error fetching users:", error)
    return []
  }
}

export async function getFacilitiesByCustomer(customerId: string) {
  try {
    const facilities = await sql`
      SELECT * FROM facilities 
      WHERE customer_id = ${customerId}
      ORDER BY name
    `
    return facilities
  } catch (error) {
    console.error("Error fetching facilities:", error)
    return []
  }
}

export async function getNfcTagsByCustomer(customerId: string) {
  try {
    const tags = await sql`
      SELECT * FROM nfc_tags 
      WHERE customer_id = ${customerId}
      ORDER BY name
    `
    return tags
  } catch (error) {
    console.error("Error fetching NFC tags:", error)
    return []
  }
}

export async function getPlotkaartByCustomer(customerId: string) {
  try {
    const result = await sql`
      SELECT * FROM plotkaart_data 
      WHERE customer_id = ${customerId}
      ORDER BY created_at DESC
      LIMIT 1
    `
    return result[0] || null
  } catch (error) {
    console.error("Error fetching plotkaart:", error)
    return null
  }
}
