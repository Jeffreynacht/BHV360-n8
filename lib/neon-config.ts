import { neon } from "@neondatabase/serverless"

// Neon database connection
const sql = neon(process.env.DATABASE_URL!)

export { sql }

// Database types (same as Supabase)
export interface Customer {
  id: string
  name: string
  contact_person?: string
  email?: string
  phone?: string
  address?: string
  active: boolean
  buildings: number
  users: number
  status: string
  settings?: any
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  customer_id: string
  name: string
  email: string
  phone?: string
  role?: string
  department?: string
  bhv_roles?: string[]
  active: boolean
  last_login?: string
  photo_url?: string
  emergency_contact?: any
  certificates?: any[]
  accessibility?: any
  work_schedule?: any
  created_at: string
  updated_at: string
}

// Helper functions
export async function getCustomers() {
  try {
    const customers = await sql`SELECT * FROM customers ORDER BY name`
    return customers
  } catch (error) {
    console.error("Error fetching customers:", error)
    return []
  }
}

export async function getUsersByCustomer(customerId: string) {
  try {
    const users = await sql`
      SELECT * FROM users 
      WHERE customer_id = ${customerId} 
      ORDER BY name
    `
    return users
  } catch (error) {
    console.error("Error fetching users:", error)
    return []
  }
}
