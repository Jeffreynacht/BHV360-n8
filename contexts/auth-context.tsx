"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "employee" | "security" | "super_admin" | "bhv_coordinator" | "partner_admin"
  customerId?: string
  partnerId?: string
}

export interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  loading: boolean
  canAccess: (requiredRole: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    // Return default values instead of throwing error during SSR
    return {
      user: null,
      login: async () => false,
      logout: () => {},
      loading: false,
      canAccess: () => false,
    }
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initialize with demo user
    const demoUser: User = {
      id: "1",
      email: "demo@bhv360.nl",
      name: "Demo Gebruiker",
      role: "admin",
      customerId: "1",
    }
    setUser(demoUser)
    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Demo login logic
    if (email === "demo@bhv360.nl" && password === "demo") {
      const demoUser: User = {
        id: "1",
        email: "demo@bhv360.nl",
        name: "Demo Gebruiker",
        role: "admin",
        customerId: "1",
      }
      setUser(demoUser)
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
  }

  const canAccess = (requiredRole: string): boolean => {
    if (!user) return false

    const roleHierarchy = {
      super_admin: 5,
      partner_admin: 4,
      admin: 3,
      bhv_coordinator: 2,
      security: 1,
      employee: 0,
    }

    const userLevel = roleHierarchy[user.role as keyof typeof roleHierarchy] || 0
    const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0

    return userLevel >= requiredLevel
  }

  const value: AuthContextType = {
    user,
    login,
    logout,
    loading,
    canAccess,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
