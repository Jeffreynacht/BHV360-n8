import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export interface Customer {
  id: number
  name: string
  contact_person: string
  users: number
  buildings: number
  status: string
  active: boolean
  created_at: string
  updated_at: string
}

export interface Facility {
  id: number
  customer_id: number
  name: string
  type: string
  status: string
  building: string
  floor: string
  zone: string
  manufacturer: string
  model: string
  serial_number: string
  installation_date: string
  last_inspection: string
  next_inspection: string
  last_maintenance: string
  next_maintenance: string
  nfc_tag_id: string
  notes: string
  created_at: string
  updated_at: string
}

export interface User {
  id: number
  customer_id: number
  name: string
  email: string
  phone: string
  role: string
  department: string
  active: boolean
  bhv_roles: any
  certificates: any
  work_schedule: any
  emergency_contact: any
  accessibility: any
  photo_url: string
  last_login: string
  created_at: string
  updated_at: string
}

export interface Incident {
  id: number
  customer_id: number
  title: string
  description: string
  type: string
  severity: string
  status: string
  location: string
  building: string
  floor: string
  reported_by: number
  assigned_to: number
  created_at: string
  updated_at: string
  resolved_at: string
}

export interface NFCTag {
  id: number
  customer_id: number
  uid: string
  name: string
  type: string
  tag_type: string
  status: string
  location: string
  building: string
  floor: string
  zone: string
  assigned_to: string
  battery_level: number
  last_seen: string
  last_scanned: string
  notes: string
  created_at: string
  updated_at: string
}

export interface PlotkaartData {
  id: number
  customer_id: number
  floors: any
  updated_by: string
  last_updated: string
  created_at: string
}

// Customer functions
export async function getCustomers(): Promise<Customer[]> {
  try {
    const result = await sql`SELECT * FROM customers ORDER BY name`
    return result as Customer[]
  } catch (error) {
    console.error("Error fetching customers:", error)
    return []
  }
}

export async function getCustomerById(id: number): Promise<Customer | null> {
  try {
    const result = await sql`SELECT * FROM customers WHERE id = ${id}`
    return (result[0] as Customer) || null
  } catch (error) {
    console.error("Error fetching customer:", error)
    return null
  }
}

// Facility functions
export async function getFacilities(customerId?: number): Promise<Facility[]> {
  try {
    if (customerId) {
      const result = await sql`SELECT * FROM facilities WHERE customer_id = ${customerId} ORDER BY name`
      return result as Facility[]
    } else {
      const result = await sql`SELECT * FROM facilities ORDER BY name`
      return result as Facility[]
    }
  } catch (error) {
    console.error("Error fetching facilities:", error)
    return []
  }
}

export async function getFacilityById(id: number): Promise<Facility | null> {
  try {
    const result = await sql`SELECT * FROM facilities WHERE id = ${id}`
    return (result[0] as Facility) || null
  } catch (error) {
    console.error("Error fetching facility:", error)
    return null
  }
}

// User functions
export async function getUsers(customerId?: number): Promise<User[]> {
  try {
    if (customerId) {
      const result = await sql`SELECT * FROM users WHERE customer_id = ${customerId} ORDER BY name`
      return result as User[]
    } else {
      const result = await sql`SELECT * FROM users ORDER BY name`
      return result as User[]
    }
  } catch (error) {
    console.error("Error fetching users:", error)
    return []
  }
}

export async function getUserById(id: number): Promise<User | null> {
  try {
    const result = await sql`SELECT * FROM users WHERE id = ${id}`
    return (result[0] as User) || null
  } catch (error) {
    console.error("Error fetching user:", error)
    return null
  }
}

// Incident functions
export async function getIncidents(customerId?: number): Promise<Incident[]> {
  try {
    if (customerId) {
      const result = await sql`SELECT * FROM incidents WHERE customer_id = ${customerId} ORDER BY created_at DESC`
      return result as Incident[]
    } else {
      const result = await sql`SELECT * FROM incidents ORDER BY created_at DESC`
      return result as Incident[]
    }
  } catch (error) {
    console.error("Error fetching incidents:", error)
    return []
  }
}

// NFC Tag functions
export async function getNFCTags(customerId?: number): Promise<NFCTag[]> {
  try {
    if (customerId) {
      const result = await sql`SELECT * FROM nfc_tags WHERE customer_id = ${customerId} ORDER BY name`
      return result as NFCTag[]
    } else {
      const result = await sql`SELECT * FROM nfc_tags ORDER BY name`
      return result as NFCTag[]
    }
  } catch (error) {
    console.error("Error fetching NFC tags:", error)
    return []
  }
}

// Plotkaart functions
export async function getPlotkaartData(customerId: number): Promise<PlotkaartData | null> {
  try {
    const result =
      await sql`SELECT * FROM plotkaart_data WHERE customer_id = ${customerId} ORDER BY last_updated DESC LIMIT 1`
    return (result[0] as PlotkaartData) || null
  } catch (error) {
    console.error("Error fetching plotkaart data:", error)
    return null
  }
}

export async function savePlotkaartData(customerId: number, floors: any, updatedBy: string): Promise<boolean> {
  try {
    await sql`
      INSERT INTO plotkaart_data (customer_id, floors, updated_by, last_updated, created_at)
      VALUES (${customerId}, ${JSON.stringify(floors)}, ${updatedBy}, NOW(), NOW())
      ON CONFLICT (customer_id) 
      DO UPDATE SET 
        floors = ${JSON.stringify(floors)},
        updated_by = ${updatedBy},
        last_updated = NOW()
    `
    return true
  } catch (error) {
    console.error("Error saving plotkaart data:", error)
    return false
  }
}

// Database health check
export async function testDatabaseConnection(): Promise<boolean> {
  try {
    await sql`SELECT 1`
    return true
  } catch (error) {
    console.error("Database connection failed:", error)
    return false
  }
}
