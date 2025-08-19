"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { SupabaseAuthService, type UserProfile, supabase } from "@/lib/supabase-auth"
import type { User } from "@supabase/supabase-js"

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  signUp: (email: string, password: string, userData: any) => Promise<{ success: boolean; error?: string }>
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>
  updatePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { session } = await SupabaseAuthService.getCurrentSession()

        if (session?.user) {
          setUser(session.user)

          // Get user profile
          const { success, data } = await SupabaseAuthService.getUserProfile(session.user.id)
          if (success && data) {
            setProfile(data)
          }
        }
      } catch (error) {
        console.error("Error getting initial session:", error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email)

      if (event === "SIGNED_IN" && session?.user) {
        setUser(session.user)

        // Get user profile
        const { success, data } = await SupabaseAuthService.getUserProfile(session.user.id)
        if (success && data) {
          setProfile(data)
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null)
        setProfile(null)
      } else if (event === "TOKEN_REFRESHED" && session?.user) {
        setUser(session.user)
      }

      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, userData: any) => {
    setLoading(true)
    try {
      const result = await SupabaseAuthService.signUp(email, password, userData)
      return { success: result.success, error: result.error }
    } catch (error) {
      return { success: false, error: "An unexpected error occurred" }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      const result = await SupabaseAuthService.signIn(email, password)

      if (result.success && result.user) {
        setUser(result.user)
        if (result.profile) {
          setProfile(result.profile)
        }
        return { success: true }
      }

      return { success: false, error: result.error }
    } catch (error) {
      return { success: false, error: "An unexpected error occurred" }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      await SupabaseAuthService.signOut()
      setUser(null)
      setProfile(null)
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    return await SupabaseAuthService.resetPassword(email)
  }

  const updatePassword = async (newPassword: string) => {
    return await SupabaseAuthService.updatePassword(newPassword)
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) {
      return { success: false, error: "No user logged in" }
    }

    setLoading(true)
    try {
      const result = await SupabaseAuthService.updateUserProfile(user.id, updates)

      if (result.success && result.data) {
        setProfile(result.data)
        return { success: true }
      }

      return { success: false, error: result.error }
    } catch (error) {
      return { success: false, error: "An unexpected error occurred" }
    } finally {
      setLoading(false)
    }
  }

  const value: AuthContextType = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
