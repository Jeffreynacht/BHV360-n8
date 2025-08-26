import { createClient } from "@supabase/supabase-js"

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!url || !anon) {
  throw new Error("Missing Supabase env vars (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY)")
}

export const supabase = createClient(url, anon, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  db: {
    schema: "public",
  },
  global: {
    headers: {
      "X-Client-Info": "bhv360",
    },
  },
})

// Server-side client for admin operations
export const createServerClient = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!serviceRoleKey) {
    console.warn("SUPABASE_SERVICE_ROLE_KEY not found, using anon key")
    return supabase
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    db: {
      schema: "public",
    },
    global: {
      headers: { "X-Client-Info": "bhv360-server" },
    },
  })
}

// Export createClient for direct use in other modules
export { createClient }

// Helper functions
export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase.from("customers").select("count").limit(1)

    if (error) {
      console.error("Supabase connection error:", error)
      return { success: false, message: `Connection failed: ${error.message}` }
    }

    return { success: true, message: "Supabase connection successful!" }
  } catch (error) {
    console.error("Supabase test error:", error)
    return { success: false, message: `Connection failed: ${error}` }
  }
}

// Database types matching our schema
export interface Customer {
  id: number
  name: string
  contact_person?: string
  email?: string
  phone?: string
  address?: string
  active: boolean
  created_at: string
  updated_at: string
}

export interface User {
  id: number
  customer_id: number
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
  certificates?: any
  accessibility?: any
  work_schedule?: any
  created_at: string
  updated_at: string
}

export interface Facility {
  id: number
  customer_id: number
  name: string
  type: string
  building?: string
  floor?: string
  zone?: string
  nfc_tag_id?: string
  status: string
  last_inspection?: string
  next_inspection?: string
  last_maintenance?: string
  next_maintenance?: string
  serial_number?: string
  manufacturer?: string
  model?: string
  installation_date?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface NFCTag {
  id: number
  customer_id: number
  name: string
  uid: string
  type?: string
  location?: string
  building?: string
  floor?: string
  zone?: string
  status: string
  battery_level: number
  last_seen?: string
  last_scanned?: string
  assigned_to?: string
  notes?: string
  tag_type?: string
  created_at: string
  updated_at: string
}

export interface PlotkaartData {
  id: number
  customer_id: number
  floors: any[]
  last_updated: string
  updated_by?: string
  created_at: string
}

// Live testing helpers
export async function createTestCustomer(customerData: Partial<Customer>) {
  const { data, error } = await supabase
    .from("customers")
    .insert([
      {
        name: customerData.name || "Test Klant",
        contact_person: customerData.contact_person || "Test Persoon",
        email: customerData.email || "test@example.com",
        phone: customerData.phone || "06-12345678",
        address: customerData.address || "Teststraat 1, 1234 AB Teststad",
        active: true,
      },
    ])
    .select()
    .single()

  return { data, error }
}

export async function createTestUser(userData: Partial<User>) {
  const { data, error } = await supabase
    .from("users")
    .insert([
      {
        customer_id: userData.customer_id || 1,
        name: userData.name || "Test Gebruiker",
        email: userData.email || "gebruiker@test.com",
        role: userData.role || "employee",
        department: userData.department || "Test Afdeling",
        active: true,
      },
    ])
    .select()
    .single()

  return { data, error }
}
