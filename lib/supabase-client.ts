import { createClient } from "@supabase/supabase-js"

// Jeffrey's BHV360 Production Configuration
const supabaseUrl = "https://ybxmvuzgqevqpusimgmm.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlieG12dXpncWV2cXB1c2ltZ21tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NDk4NDEsImV4cCI6MjA2NjMyNTg0MX0.MFB7ytqPId2c3HEm5KyK2RFZCO-cBrpmiO-FwHJXSv4"

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables")
}

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
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

// Test connection function
export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase.from("customers").select("count").single()
    if (error) throw error
    return { success: true, message: "Supabase connection successful!" }
  } catch (error) {
    return { success: false, message: `Connection failed: ${error}` }
  }
}
