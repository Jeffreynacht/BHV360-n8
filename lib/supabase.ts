import { createClient } from "@supabase/supabase-js"

// Jeffrey's BHV360 Production Configuration
const supabaseUrl = "https://ybxmvuzgqevqpusimgmm.supabase.co"
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlieG12dXpncWV2cXB1c2ltZ21tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NDk4NDEsImV4cCI6MjA2NjMyNTg0MX0.MFB7ytqPId2c3HEm5KyK2RFZCO-cBrpmiO-FwHJXSv4"

// Veiligheidscheck
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Missing Supabase environment variables")
}

// Client-side Supabase client (singleton pattern)
let supabaseClient: any = null

export const supabase = (() => {
  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
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
          "X-Client-Info": "bhv360-jeffrey-production-v1.0",
        },
      },
    })
  }
  return supabaseClient
})()

// Server-side admin client
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlieG12dXpncWV2cXB1c2ltZ21tIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDc0OTg0MSwiZXhwIjoyMDY2MzI1ODQxfQ.9sDOiFEbnx4hn69ay6P9J-YTaC_2DTBWiFSGRDul7dI"

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
  db: {
    schema: "public",
  },
})

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
