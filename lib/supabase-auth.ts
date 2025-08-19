import { createClient } from "@supabase/supabase-js"

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables")
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
  }
  return supabaseClient
})()

// Server-side admin client
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
  db: {
    schema: "public",
  },
})

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
          data: {
            name: userData.name,
            role: userData.role || "employee",
            company: userData.company,
            department: userData.department,
            phone: userData.phone,
            customer_id: userData.customer_id,
          },
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
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      return { success: !error, error: error?.message }
    } catch (error) {
      return { success: false, error: "An unexpected error occurred" }
    }
  }

  // Update password
  static async updatePassword(newPassword: string) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      return { success: !error, error: error?.message }
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
