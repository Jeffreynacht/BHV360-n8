// Database adapter - Neon serverless only
import { sql } from "./neon-config"

export class DatabaseAdapter {
  // Customers
  async getCustomers() {
    try {
      return await sql`SELECT * FROM customers ORDER BY name`
    } catch (error) {
      console.error("Database error:", error)
      // Return mock data as fallback
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

  async getCustomerById(id: string) {
    try {
      const result = await sql`SELECT * FROM customers WHERE id = ${id}`
      return result[0] || null
    } catch (error) {
      console.error("Database error:", error)
      return null
    }
  }

  async createCustomer(data: any) {
    try {
      const result = await sql`
        INSERT INTO customers (name, contact_person, email, phone, address, active, buildings, users, status)
        VALUES (${data.name}, ${data.contact_person}, ${data.email}, ${data.phone}, ${data.address}, ${data.active}, ${data.buildings}, ${data.users}, ${data.status})
        RETURNING *
      `
      return result[0]
    } catch (error) {
      console.error("Database error:", error)
      return null
    }
  }

  // Users
  async getUsersByCustomer(customerId: string) {
    try {
      return await sql`
        SELECT * FROM users 
        WHERE customer_id = ${customerId} 
        ORDER BY name
      `
    } catch (error) {
      console.error("Database error:", error)
      return []
    }
  }

  async createUser(data: any) {
    try {
      const result = await sql`
        INSERT INTO users (customer_id, name, email, phone, role, department, bhv_roles, active)
        VALUES (${data.customer_id}, ${data.name}, ${data.email}, ${data.phone}, ${data.role}, ${data.department}, ${JSON.stringify(data.bhv_roles)}, ${data.active})
        RETURNING *
      `
      return result[0]
    } catch (error) {
      console.error("Database error:", error)
      return null
    }
  }

  // Facilities
  async getFacilitiesByCustomer(customerId: string) {
    try {
      return await sql`
        SELECT * FROM facilities 
        WHERE customer_id = ${customerId} 
        ORDER BY name
      `
    } catch (error) {
      console.error("Database error:", error)
      return []
    }
  }

  // NFC Tags
  async getNfcTagsByCustomer(customerId: string) {
    try {
      return await sql`
        SELECT * FROM nfc_tags 
        WHERE customer_id = ${customerId} 
        ORDER BY name
      `
    } catch (error) {
      console.error("Database error:", error)
      return []
    }
  }

  // Plotkaart
  async getPlotkaartByCustomer(customerId: string) {
    try {
      const result = await sql`
        SELECT * FROM plotkaart_data 
        WHERE customer_id = ${customerId}
        ORDER BY created_at DESC
        LIMIT 1
      `
      return result[0] || null
    } catch (error) {
      console.error("Database error:", error)
      return null
    }
  }

  // Incidents
  async getIncidentsByCustomer(customerId: string) {
    try {
      return await sql`
        SELECT i.*, u.name as reported_by_name, a.name as assigned_to_name
        FROM incidents i
        LEFT JOIN users u ON i.reported_by = u.id
        LEFT JOIN users a ON i.assigned_to = a.id
        WHERE i.customer_id = ${customerId}
        ORDER BY i.created_at DESC
      `
    } catch (error) {
      console.error("Database error:", error)
      return []
    }
  }
}

export const db = new DatabaseAdapter()
