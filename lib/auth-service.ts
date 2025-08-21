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
  active?: boolean
  created_at?: string
  updated_at?: string
}

export class AuthService {
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

  static async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      if (data.user) {
        const { success, user } = await this.getUserProfile(data.user.id)
        if (success && user) {
          return { success: true, user }
        }
      }

      return { success: false, error: "Failed to get user profile" }
    } catch (error) {
      return { success: false, error: "An unexpected error occurred" }
    }
  }

  static async signUp(email: string, password: string, userData: Partial<User>) {
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
          },
        },
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, user: data.user }
    } catch (error) {
      return { success: false, error: "An unexpected error occurred" }
    }
  }

  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      return { success: !error, error: error?.message }
    } catch (error) {
      return { success: false, error: "An unexpected error occurred" }
    }
  }

  static async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email)
      return { success: !error, error: error?.message }
    } catch (error) {
      return { success: false, error: "An unexpected error occurred" }
    }
  }

  static async changePassword(newPassword: string) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })
      return { success: !error, error: error?.message }
    } catch (error) {
      return { success: false, error: "An unexpected error occurred" }
    }
  }

  static async getUserProfile(userId: string) {
    try {
      const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, user: data as User }
    } catch (error) {
      return { success: false, error: "An unexpected error occurred" }
    }
  }

  static async updateUserProfile(userId: string, updates: Partial<User>) {
    try {
      const { data, error } = await supabase.from("users").update(updates).eq("id", userId).select().single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, user: data as User }
    } catch (error) {
      return { success: false, error: "An unexpected error occurred" }
    }
  }
}
