import { neon } from "@neondatabase/serverless"

// Initialize Neon connection with error handling
let sql: any = null

try {
  if (process.env.DATABASE_URL) {
    sql = neon(process.env.DATABASE_URL)
  }
} catch (error) {
  console.error("Failed to initialize database connection:", error)
}

// Test database connection
export async function testConnection() {
  if (!sql) {
    console.log("❌ Database not initialized")
    return false
  }

  try {
    const result = await sql`SELECT NOW() as current_time`
    console.log("✅ Database connected successfully:", result[0].current_time)
    return true
  } catch (error) {
    console.error("❌ Database connection failed:", error)
    return false
  }
}

// Mock data as fallback
const mockCustomers = [
  {
    id: 1,
    name: "Demo Bedrijf BV",
    contact_person: "Jan de Vries",
    email: "jan@demobedrijf.nl",
    active: true,
    buildings: 3,
    users: 25,
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Test Organisatie",
    contact_person: "Marie van den Berg",
    email: "marie@testorg.nl",
    active: true,
    buildings: 1,
    users: 10,
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Provincie Noord-Brabant",
    contact_person: "Piet Janssen",
    email: "piet@brabant.nl",
    active: true,
    buildings: 5,
    users: 50,
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

// Database helper functions with robust error handling
export async function getCustomers() {
  // Always return mock data for now to ensure reliability
  console.log("Using mock data for customers (reliable fallback)")
  return mockCustomers

  // Commented out database code until connection is stable
  /*
  if (!sql) {
    console.log("Database not available, using mock data")
    return mockCustomers
  }

  try {
    const customers = await sql`
      SELECT * FROM customers 
      WHERE active = true 
      ORDER BY name
    `
    return customers.length > 0 ? customers : mockCustomers
  } catch (error) {
    console.error("Error fetching customers from database:", error)
    return mockCustomers
  }
  */
}

export async function getUsersByCustomer(customerId: string) {
  // Mock users data
  const mockUsers = [
    {
      id: 1,
      customer_id: customerId,
      name: "Jan Jansen",
      email: "jan.jansen@demobedrijf.nl",
      role: "BHV Coördinator",
      department: "Facilitair",
      active: true,
      bhv_roles: ["EHBO", "Ontruiming"],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 2,
      customer_id: customerId,
      name: "Petra de Vries",
      email: "petra.devries@demobedrijf.nl",
      role: "BHV'er",
      department: "HR",
      active: true,
      bhv_roles: ["Brandbestrijding"],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]

  return mockUsers

  /*
  if (!sql) {
    return mockUsers
  }

  try {
    const users = await sql`
      SELECT * FROM users 
      WHERE customer_id = ${customerId} AND active = true
      ORDER BY name
    `
    return users.length > 0 ? users : mockUsers
  } catch (error) {
    console.error("Error fetching users:", error)
    return mockUsers
  }
  */
}

export async function getFacilitiesByCustomer(customerId: string) {
  // Mock facilities data
  const mockFacilities = [
    {
      id: 1,
      customer_id: customerId,
      name: "Brandblusser Gang A",
      type: "Brandblusser",
      building: "Hoofdgebouw",
      floor: "Begane grond",
      zone: "Gang A",
      status: "OK",
      last_inspection: "2023-06-01",
      next_inspection: "2024-06-01",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]

  return mockFacilities
}

export async function getIncidentsByCustomer(customerId: string) {
  // Mock incidents data
  const mockIncidents = [
    {
      id: 1,
      customer_id: customerId,
      title: "Brandmelding",
      description: "Rookmelder afgegaan in kantine",
      type: "Brand",
      severity: "medium",
      status: "open",
      location: "Kantine",
      building: "Hoofdgebouw",
      floor: "Begane grond",
      reported_by: 1,
      reported_by_name: "Jan Jansen",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]

  return mockIncidents
}

export { sql }
