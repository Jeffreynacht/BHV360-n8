import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseServiceKey || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables")
}

// Server-side client with service role key for admin operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// Client-side client with anon key
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)

console.log("✅ Supabase clients initialized successfully")
console.log("📍 Supabase URL:", supabaseUrl)
console.log("🔑 Service key provided:", supabaseServiceKey ? "Yes" : "No")
console.log("🔑 Anon key provided:", supabaseAnonKey ? "Yes" : "No")

export interface Customer {
  id: number
  name: string
  contact_person: string
  email: string
  phone?: string
  address?: string
  city?: string
  postal_code?: string
  users: number
  buildings: number
  status: string
  active: boolean
  modules?: any
  settings?: any
  created_at: string
  updated_at: string
}

export interface Facility {
  id: number
  customer_id: number
  name: string
  type: string
  status: string
  building?: string
  floor?: string
  zone?: string
  manufacturer?: string
  model?: string
  serial_number?: string
  installation_date?: string
  last_inspection?: string
  next_inspection?: string
  last_maintenance?: string
  next_maintenance?: string
  nfc_tag_id?: string
  coordinates?: any
  specifications?: any
  notes?: string
  created_at: string
  updated_at: string
}

export interface User {
  id: number
  customer_id: number
  name: string
  email: string
  password_hash?: string
  phone?: string
  role: string
  department?: string
  active: boolean
  bhv_roles?: any
  certificates?: any
  work_schedule?: any
  emergency_contact?: any
  accessibility?: any
  photo_url?: string
  last_login?: string
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
  location?: string
  building?: string
  floor?: string
  coordinates?: any
  reported_by?: number
  assigned_to?: number
  resolved_by?: number
  resolved_at?: string
  attachments?: any
  metadata?: any
  created_at: string
  updated_at: string
}

export interface NFCTag {
  id: number
  customer_id: number
  uid: string
  name: string
  type: string
  tag_type?: string
  status: string
  location?: string
  building?: string
  floor?: string
  zone?: string
  assigned_to?: string
  battery_level?: number
  last_seen?: string
  last_scanned?: string
  scan_count?: number
  data?: any
  notes?: string
  created_at: string
  updated_at: string
}

export interface PlotkaartData {
  id: number
  customer_id: number
  floors: any
  metadata?: any
  updated_by?: string
  last_updated: string
  created_at: string
}

// Helper functions
export function isSupabaseConfigured(): boolean {
  return supabaseAdmin !== null && supabaseClient !== null
}

// Helper function to handle Supabase errors
function handleSupabaseError(error: any, operation: string): never {
  console.error(`Supabase ${operation} error:`, error)

  if (error.code === "PGRST301") {
    throw new Error(`Database connection failed: Invalid API key or insufficient permissions`)
  }

  if (error.code === "PGRST116") {
    throw new Error(`No data found for ${operation}`)
  }

  if (error.message?.includes("JWT")) {
    throw new Error(`Authentication failed: Invalid or expired API key`)
  }

  if (error.message?.includes("Invalid API key")) {
    throw new Error(`Invalid API key: Please check your SUPABASE_SERVICE_ROLE_KEY`)
  }

  throw new Error(`${operation} failed: ${error.message || "Unknown database error"}`)
}

// Check if database schema exists
export async function checkDatabaseSchema(): Promise<{
  success: boolean
  existingTables: string[]
  missingTables: string[]
  schemaComplete: boolean
  error?: string
}> {
  try {
    // Check if key tables exist by trying to query them
    const requiredTables = ["customers", "users", "facilities", "nfc_tags", "incidents"]
    const existingTables: string[] = []
    const missingTables: string[] = []

    for (const tableName of requiredTables) {
      try {
        const { error } = await supabaseAdmin.from(tableName).select("*", { count: "exact", head: true })

        if (error && error.code === "42P01") {
          // Table doesn't exist
          missingTables.push(tableName)
        } else {
          existingTables.push(tableName)
        }
      } catch (err) {
        missingTables.push(tableName)
      }
    }

    return {
      success: missingTables.length === 0,
      existingTables,
      missingTables,
      schemaComplete: missingTables.length === 0,
    }
  } catch (error) {
    return {
      success: false,
      existingTables: [],
      missingTables: ["customers", "users", "facilities", "nfc_tags", "incidents"],
      schemaComplete: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// Database health check - simplified version
export async function testDatabaseConnection(): Promise<{
  success: boolean
  message: string
  method: string
  version?: any
  errors?: any[]
}> {
  try {
    // Test 1: Try to use Supabase auth admin API
    const { data: users, error: authError } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1,
    })

    if (!authError) {
      return {
        success: true,
        message: "Database connection successful via Auth API",
        method: "auth",
      }
    }

    // Test 2: Fallback to RPC call
    const { data: version, error: rpcError } = await supabaseAdmin.rpc("version")

    if (!rpcError) {
      return {
        success: true,
        message: "Database connection successful via RPC",
        method: "rpc",
        version,
      }
    }

    // Test 3: Simple table existence check
    const { error: tableError } = await supabaseAdmin.from("auth.users").select("count", { count: "exact", head: true })

    if (!tableError) {
      return {
        success: true,
        message: "Database connection successful via table query",
        method: "table",
      }
    }

    return {
      success: false,
      message: `Connection failed: ${authError?.message || rpcError?.message || tableError?.message}`,
      errors: [authError, rpcError, tableError].filter(Boolean),
    }
  } catch (error) {
    return {
      success: false,
      message: `Database connection test failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      error,
    }
  }
}

// Get database statistics (with error handling for missing tables)
export async function getDatabaseStats(): Promise<{
  success: boolean
  stats: {
    customers: number
    users: number
    facilities: number
    incidents: number
    nfc_tags: number
  }
  errors: any[]
  tablesExist: boolean
}> {
  try {
    const stats = {
      customers: 0,
      users: 0,
      facilities: 0,
      nfc_tags: 0,
      incidents: 0,
    }

    const errors: any[] = []

    // Test each table individually and collect stats
    const tables = [
      { name: "customers", key: "customers" },
      { name: "users", key: "users" },
      { name: "facilities", key: "facilities" },
      { name: "nfc_tags", key: "nfc_tags" },
      { name: "incidents", key: "incidents" },
    ]

    for (const table of tables) {
      try {
        const { count, error } = await supabaseAdmin.from(table.name).select("*", { count: "exact", head: true })

        if (error) {
          errors.push({
            table: table.name,
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint,
          })
        } else {
          stats[table.key as keyof typeof stats] = count || 0
        }
      } catch (err) {
        errors.push({
          table: table.name,
          error: err instanceof Error ? err.message : "Unknown error",
        })
      }
    }

    return {
      success: errors.length === 0,
      stats,
      errors,
      tablesExist: errors.length < tables.length,
    }
  } catch (error) {
    return {
      success: false,
      stats: { customers: 0, users: 0, facilities: 0, nfc_tags: 0, incidents: 0 },
      errors: [
        {
          general: error instanceof Error ? error.message : "Unknown error",
        },
      ],
      tablesExist: false,
    }
  }
}

// Customer functions
export async function getCustomers(): Promise<Customer[]> {
  try {
    const { data, error } = await supabaseAdmin.from("customers").select("*").eq("active", true).order("name")

    if (error) {
      handleSupabaseError(error, "fetch customers")
    }

    return data as Customer[]
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Failed to fetch customers: Unknown error")
  }
}

export async function getCustomerById(id: number): Promise<Customer | null> {
  try {
    const { data, error } = await supabaseAdmin.from("customers").select("*").eq("id", id).eq("active", true).single()

    if (error) {
      if (error.code === "PGRST116") {
        return null // No rows found
      }
      handleSupabaseError(error, "fetch customer")
    }

    return data as Customer
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Failed to fetch customer: Unknown error")
  }
}

export async function createCustomer(customer: Omit<Customer, "id" | "created_at" | "updated_at">): Promise<Customer> {
  try {
    const { data, error } = await supabaseAdmin
      .from("customers")
      .insert({
        ...customer,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      handleSupabaseError(error, "create customer")
    }

    return data as Customer
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Failed to create customer: Unknown error")
  }
}

export async function updateCustomer(id: number, updates: Partial<Customer>): Promise<Customer> {
  try {
    const { data, error } = await supabaseAdmin
      .from("customers")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      handleSupabaseError(error, "update customer")
    }

    return data as Customer
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Failed to update customer: Unknown error")
  }
}

// User functions
export async function getUsers(customerId?: number): Promise<User[]> {
  try {
    let query = supabaseAdmin.from("users").select("*")

    if (customerId) {
      query = query.eq("customer_id", customerId)
    }

    const { data, error } = await query.eq("active", true).order("name")

    if (error) {
      handleSupabaseError(error, "fetch users")
    }

    return data as User[]
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Failed to fetch users: Unknown error")
  }
}

export async function getUserById(id: number): Promise<User | null> {
  try {
    const { data, error } = await supabaseAdmin.from("users").select("*").eq("id", id).eq("active", true).single()

    if (error) {
      if (error.code === "PGRST116") {
        return null
      }
      handleSupabaseError(error, "fetch user")
    }

    return data as User
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Failed to fetch user: Unknown error")
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const { data, error } = await supabaseAdmin.from("users").select("*").eq("email", email).eq("active", true).single()

    if (error) {
      if (error.code === "PGRST116") {
        return null
      }
      handleSupabaseError(error, "fetch user by email")
    }

    return data as User
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Failed to fetch user by email: Unknown error")
  }
}

// Facility functions
export async function getFacilities(customerId?: number): Promise<Facility[]> {
  try {
    let query = supabaseAdmin.from("facilities").select("*")

    if (customerId) {
      query = query.eq("customer_id", customerId)
    }

    const { data, error } = await query.order("name")

    if (error) {
      handleSupabaseError(error, "fetch facilities")
    }

    return data as Facility[]
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Failed to fetch facilities: Unknown error")
  }
}

// Incident functions
export async function getIncidents(customerId?: number): Promise<Incident[]> {
  try {
    let query = supabaseAdmin.from("incidents").select("*")

    if (customerId) {
      query = query.eq("customer_id", customerId)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) {
      handleSupabaseError(error, "fetch incidents")
    }

    return data as Incident[]
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Failed to fetch incidents: Unknown error")
  }
}

// NFC Tag functions
export async function getNFCTags(customerId?: number): Promise<NFCTag[]> {
  try {
    let query = supabaseAdmin.from("nfc_tags").select("*")

    if (customerId) {
      query = query.eq("customer_id", customerId)
    }

    const { data, error } = await query.order("name")

    if (error) {
      handleSupabaseError(error, "fetch NFC tags")
    }

    return data as NFCTag[]
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Failed to fetch NFC tags: Unknown error")
  }
}
