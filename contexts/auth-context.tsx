"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { AuthService, type User } from "@/lib/auth-service"
import { supabase } from "@/lib/auth-service"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  register: (email: string, password: string, userData: Partial<User>) => Promise<{ success: boolean; error?: string }>
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>
  changePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; error?: string }>
  isLoading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { session } = await AuthService.getCurrentSession()

      if (session?.user) {
        const { success, user: profileData } = await AuthService.getUserProfile(session.user.id)
        if (success && profileData) {
          setUser(profileData)
        }
      }

      setIsLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        const { success, user: profileData } = await AuthService.getUserProfile(session.user.id)
        if (success && profileData) {
          setUser(profileData)
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)

    try {
      const result = await AuthService.signIn(email, password)

      if (result.success && result.user) {
        setUser(result.user)
        return { success: true }
      }

      return { success: false, error: result.error }
    } catch (error) {
      return { success: false, error: "An unexpected error occurred" }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)

    try {
      await AuthService.signOut()
      setUser(null)
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (email: string, password: string, userData: Partial<User>) => {
    setIsLoading(true)

    try {
      const result = await AuthService.signUp(email, password, userData)

      if (result.success && result.user) {
        // Note: User will need to verify email before they can sign in
        return { success: true }
      }

      return { success: false, error: result.error }
    } catch (error) {
      return { success: false, error: "An unexpected error occurred" }
    } finally {
      setIsLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    return await AuthService.resetPassword(email)
  }

  const changePassword = async (newPassword: string) => {
    return await AuthService.changePassword(newPassword)
  }

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) {
      return { success: false, error: "No user logged in" }
    }

    setIsLoading(true)

    try {
      const result = await AuthService.updateUserProfile(user.id, updates)

      if (result.success && result.user) {
        setUser(result.user)
        return { success: true }
      }

      return { success: false, error: result.error }
    } catch (error) {
      return { success: false, error: "An unexpected error occurred" }
    } finally {
      setIsLoading(false)
    }
  }

  const value: AuthContextType = {
    user,
    login,
    logout,
    register,
    resetPassword,
    changePassword,
    updateProfile,
    isLoading,
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
