"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { supabase, type AuthUser, type AuthSession } from "@/lib/supabase-auth"

export interface User {
  id: string
  email: string
  name?: string
  role?: string
  customerId?: string
  partnerId?: string
}

interface AuthContextType {
  user: User | null
  session: AuthSession | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any }>
  signOut: () => Promise<void>
  canAccess: (requiredRole: string) => boolean
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<AuthSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (mounted) {
          setSession(session as AuthSession)
          if (session?.user) {
            setUser(transformUser(session.user as AuthUser))
          }
          setIsLoading(false)
        }
      } catch (error) {
        console.error("Error getting initial session:", error)
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (mounted) {
        setSession(session as AuthSession)
        if (session?.user) {
          setUser(transformUser(session.user as AuthUser))
        } else {
          setUser(null)
        }
        setIsLoading(false)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const transformUser = (authUser: AuthUser): User => {
    return {
      id: authUser.id,
      email: authUser.email || "",
      name: authUser.user_metadata?.name || authUser.email?.split("@")[0] || "User",
      role: authUser.user_metadata?.role || "employee",
      customerId: authUser.user_metadata?.customer_id || "1",
      partnerId: authUser.user_metadata?.partner_id,
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      return { error }
    } catch (error) {
      return { error }
    }
  }

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      })
      return { error }
    } catch (error) {
      return { error }
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setSession(null)
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  const logout = async () => {
    await signOut()
  }

  const canAccess = (requiredRole: string): boolean => {
    if (!user) return false

    const roleHierarchy = {
      "super-admin": 4,
      "partner-admin": 3,
      "customer-admin": 2,
      "bhv-coordinator": 2,
      employee: 1,
    }

    const userLevel = roleHierarchy[user.role as keyof typeof roleHierarchy] || 0
    const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0

    return userLevel >= requiredLevel
  }

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
    canAccess,
    logout,
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
