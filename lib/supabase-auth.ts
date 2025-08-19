import { createClient } from "@supabase/supabase-js"
import type { User, Session } from "@supabase/supabase-js"

// Supabase configuration with fallbacks for development
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ybxmvuzgqevqpusimgmm.supabase.co"
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlieG12dXpncWV2cXB1c2ltZ21tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NDk4NDEsImV4cCI6MjA2NjMyNTg0MX0.MFB7ytqPId2c3HEm5KyK2RFZCO-cBrpmiO-FwHJXSv4"
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlieG12dXpncWV2cXB1c2ltZ21tIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDc0OTg0MSwiZXhwIjoyMDY2MzI1ODQxfQ.9sDOiFEbnx4hn69ay6P9J-YTaC_2DTBWiFSGRDul7dI"

// Validate required environment variables
if (!supabaseUrl) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable")
}

if (!supabaseAnonKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable")
}

// Client-side Supabase client (singleton pattern)
let supabaseClient: any = null

export const supabase = (() => {
  if (!supabaseClient && supabaseUrl && supabaseAnonKey) {
    try {
      supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          flowType: "pkce",
        },
        db: {
          schema: "public",
        },
        global: {
          headers: {
            "X-Client-Info": "bhv360-production-v2.0",
          },
        },
      })
    } catch (error) {
      console.error("Failed to initialize Supabase client:", error)
      // Return a mock client for development
      return createMockSupabaseClient()
    }
  }

  return supabaseClient || createMockSupabaseClient()
})()

// Server-side admin client
export const supabaseAdmin = (() => {
  if (supabaseUrl && supabaseServiceKey) {
    try {
      return createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
        db: {
          schema: "public",
        },
      })
    } catch (error) {
      console.error("Failed to initialize Supabase admin client:", error)
      return createMockSupabaseClient()
    }
  }
  return createMockSupabaseClient()
})()

// Mock Supabase client for development/fallback
function createMockSupabaseClient() {
  return {
    auth: {
      signUp: async () => ({ data: null, error: { message: "Supabase not configured" } }),
      signInWithPassword: async () => ({ data: null, error: { message: "Supabase not configured" } }),
      signOut: async () => ({ error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      resetPasswordForEmail: async () => ({ data: null, error: { message: "Supabase not configured" } }),
      updateUser: async () => ({ data: null, error: { message: "Supabase not configured" } }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: null, error: { message: "Supabase not configured" } }),
          order: async () => ({ data: [], error: null }),
        }),
        limit: async () => ({ data: [], error: null }),
        order: async () => ({ data: [], error: null }),
      }),
      insert: () => ({
        select: () => ({
          single: async () => ({ data: null, error: { message: "Supabase not configured" } }),
        }),
      }),
      update: () => ({
        eq: () => ({
          select: () => ({
            single: async () => ({ data: null, error: { message: "Supabase not configured" } }),
          }),
        }),
      }),
    }),
  }
}

export type AuthUser = User & {
  user_metadata?: {
    name?: string
    role?: string
    customer_id?: string
  }
}

export interface AuthSession extends Session {
  user: AuthUser
}

// Database types
export interface UserProfile {
  id: string
  customer_id: string
  email: string
  name: string
  role: "super_admin" | "admin" | "bhv_coordinator" | "employee" | "security" | "partner_admin"
  status: "active" | "inactive" | "pending" | "suspended"
  company?: string
  department?: string
  phone?: string
  bhv_roles?: string[]
  certificates?: any[]
  work_schedule?: any
  emergency_contact?: any
  accessibility?: any
  photo_url?: string
  last_login?: string
  created_at: string
  updated_at: string
}

export interface Customer {
  id: string
  name: string
  contact_person: string
  email: string
  phone?: string
  address?: string
  city?: string
  postal_code?: string
  users_count: number
  buildings_count: number
  status: string
  active: boolean
  modules: any
  settings: any
  created_at: string
  updated_at: string
}

// Authentication service class
export class SupabaseAuthService {
  // Sign up new user
  static async signUp(
    email: string,
    password: string,
    userData: {
      name: string
      role?: string
      company?: string
      department?: string
      phone?: string
      customer_id?: string
    },
  ) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      })

      if (error) {
        return { success: false, error: error.message, data: null }
      }

      return { success: true, error: null, data }
    } catch (error) {
      return { success: false, error: "An unexpected error occurred", data: null }
    }
  }

  // Sign in user
  static async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { success: false, error: error.message, user: null }
      }

      // Get user profile
      if (data.user) {
        const profile = await this.getUserProfile(data.user.id)
        return { success: true, error: null, user: data.user, profile: profile.data }
      }

      return { success: false, error: "Failed to get user data", user: null }
    } catch (error) {
      return { success: false, error: "An unexpected error occurred", user: null }
    }
  }

  // Sign out user
  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      return { success: !error, error: error?.message }
    } catch (error) {
      return { success: false, error: "An unexpected error occurred" }
    }
  }

  // Get current session
  static async getCurrentSession() {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()
      return { session, error }
    } catch (error) {
      return { session: null, error }
    }
  }

  // Get user profile
  static async getUserProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select(`
          *,
          customers (
            id,
            name,
            status,
            modules,
            settings
          )
        `)
        .eq("id", userId)
        .single()

      if (error) {
        return { success: false, error: error.message, data: null }
      }

      return { success: true, error: null, data }
    } catch (error) {
      return { success: false, error: "An unexpected error occurred", data: null }
    }
  }

  // Update user profile
  static async updateUserProfile(userId: string, updates: Partial<UserProfile>) {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)
        .select()
        .single()

      if (error) {
        return { success: false, error: error.message, data: null }
      }

      return { success: true, error: null, data }
    } catch (error) {
      return { success: false, error: "An unexpected error occurred", data: null }
    }
  }

  // Reset password
  static async resetPassword(email: string) {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${typeof window !== "undefined" ? window.location.origin : process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
      })

      return { data, error }
    } catch (error) {
      return { success: false, error: "An unexpected error occurred" }
    }
  }

  // Update password
  static async updatePassword(newPassword: string) {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      return { data, error }
    } catch (error) {
      return { success: false, error: "An unexpected error occurred" }
    }
  }

  // Get customers (admin only)
  static async getCustomers() {
    try {
      const { data, error } = await supabase.from("customers").select("*").order("name")

      if (error) {
        return { success: false, error: error.message, data: [] }
      }

      return { success: true, error: null, data }
    } catch (error) {
      return { success: false, error: "An unexpected error occurred", data: [] }
    }
  }

  // Get users for a customer (admin only)
  static async getCustomerUsers(customerId: string) {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("customer_id", customerId)
        .order("name")

      if (error) {
        return { success: false, error: error.message, data: [] }
      }

      return { success: true, error: null, data }
    } catch (error) {
      return { success: false, error: "An unexpected error occurred", data: [] }
    }
  }

  // Create customer (super admin only)
  static async createCustomer(customerData: Partial<Customer>) {
    try {
      const { data, error } = await supabase.from("customers").insert([customerData]).select().single()

      if (error) {
        return { success: false, error: error.message, data: null }
      }

      return { success: true, error: null, data }
    } catch (error) {
      return { success: false, error: "An unexpected error occurred", data: null }
    }
  }

  // Invite user to customer
  static async inviteUser(
    email: string,
    customerData: {
      customer_id: string
      role: string
      name: string
      department?: string
    },
  ) {
    try {
      const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
        data: {
          name: customerData.name,
          role: customerData.role,
          customer_id: customerData.customer_id,
          department: customerData.department,
        },
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/accept-invite`,
      })

      if (error) {
        return { success: false, error: error.message, data: null }
      }

      return { success: true, error: null, data }
    } catch (error) {
      return { success: false, error: "An unexpected error occurred", data: null }
    }
  }
}

// Helper functions for authentication state
export const useSupabaseAuth = () => {
  return {
    supabase,
    signUp: SupabaseAuthService.signUp,
    signIn: SupabaseAuthService.signIn,
    signOut: SupabaseAuthService.signOut,
    getCurrentSession: SupabaseAuthService.getCurrentSession,
    getUserProfile: SupabaseAuthService.getUserProfile,
    updateUserProfile: SupabaseAuthService.updateUserProfile,
    resetPassword: SupabaseAuthService.resetPassword,
    updatePassword: SupabaseAuthService.updatePassword,
  }
}

// Test connection function
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
