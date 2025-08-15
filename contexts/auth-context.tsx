"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getDashboardRoute } from "@/lib/dashboard-router"

interface User {
  id: string
  email: string
  name: string
  role: string
  customerId?: string
  customerName?: string
  loginTime?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      console.log("🔍 Checking auth status...")
      const response = await fetch("/api/auth/status")
      const data = await response.json()

      if (data.user) {
        console.log("✅ User found in session:", data.user.name, "with role:", data.user.role)
        setUser(data.user)
      } else {
        console.log("❌ No user in session")
        setUser(null)
      }
    } catch (error) {
      console.error("❌ Auth status check failed:", error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      console.log("🔐 Attempting login for:", email)
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.success && data.user) {
        console.log("✅ Login successful for:", data.user.name, "with role:", data.user.role)
        setUser(data.user)

        // Get dashboard route and redirect
        const dashboardRoute = getDashboardRoute(data.user.role)
        console.log("🚀 Redirecting to:", dashboardRoute)

        router.push(dashboardRoute)
        return { success: true }
      } else {
        console.log("❌ Login failed:", data.error)
        return { success: false, error: data.error || "Login failed" }
      }
    } catch (error) {
      console.error("❌ Login error:", error)
      return { success: false, error: "Network error" }
    }
  }

  const logout = async () => {
    try {
      console.log("🚪 Logging out...")
      await fetch("/api/auth/logout", { method: "POST" })
      setUser(null)
      router.push("/login")
    } catch (error) {
      console.error("❌ Logout error:", error)
      setUser(null)
      router.push("/login")
    }
  }

  return <AuthContext.Provider value={{ user, login, logout, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
