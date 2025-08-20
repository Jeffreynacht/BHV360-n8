import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface User {
  id: string
  email: string
  name: string
  role: "super_admin" | "admin" | "bhv_coordinator" | "employee" | "security" | "partner_admin"
  company?: string
  department?: string
  active: boolean
  created_at: string
  updated_at: string
}

export interface AuthResponse {
  success: boolean
  user?: User
  error?: string
}

export class AuthService {
  // Sign up new user
  static async signUp(email: string, password: string, userData: Partial<User>): Promise<AuthResponse> {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (authError) {
        return { success: false, error: authError.message }
      }

      if (!authData.user) {
        return { success: false, error: "Failed to create user" }
      }

      // Create user profile
      const { data: profileData, error: profileError } = await supabase
        .from("users")
        .insert({
          id: authData.user.id,
          email,
          name: userData.name || "",
          role: userData.role || "employee",
          company: userData.company || "",
          department: userData.department || "",
          active: true,
        })
        .select()
        .single()

      if (profileError) {
        return { success: false, error: profileError.message }
      }

      return { success: true, user: profileData }
    } catch (error) {
      return { success: false, error: "An unexpected error occurred" }
    }
  }

  // Sign in user
  static async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        return { success: false, error: authError.message }
      }

      if (!authData.user) {
        return { success: false, error: "Invalid credentials" }
      }

      // Get user profile
      const { data: profileData, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("id", authData.user.id)
        .eq("active", true)
        .single()

      if (profileError || !profileData) {
        return { success: false, error: "User profile not found or inactive" }
      }

      return { success: true, user: profileData }
    } catch (error) {
      return { success: false, error: "An unexpected error occurred" }
    }
  }

  // Sign out user
  static async signOut(): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        return { success: false, error: error.message }
      }
      return { success: true }
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
      if (error) {
        return { success: false, error: error.message }
      }
      return { success: true, session }
    } catch (error) {
      return { success: false, error: "An unexpected error occurred" }
    }
  }

  // Get user profile by ID
  static async getUserProfile(userId: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.from("users").select("*").eq("id", userId).eq("active", true).single()

      if (error || !data) {
        return { success: false, error: "User not found" }
      }

      return { success: true, user: data }
    } catch (error) {
      return { success: false, error: "An unexpected error occurred" }
    }
  }

  // Update user profile
  static async updateUserProfile(userId: string, updates: Partial<User>): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase
        .from("users")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)
        .select()
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, user: data }
    } catch (error) {
      return { success: false, error: "An unexpected error occurred" }
    }
  }

  // Reset password
  static async resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: "An unexpected error occurred" }
    }
  }

  // Change password
  static async changePassword(newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: "An unexpected error occurred" }
    }
  }
}
