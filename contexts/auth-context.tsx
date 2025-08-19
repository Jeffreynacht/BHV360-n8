"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  email: string
  name: string
  role: "super_admin" | "admin" | "bhv_coordinator" | "employee" | "security" | "partner_admin"
  company?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  isLoading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo accounts for testing
const DEMO_ACCOUNTS = [
  {
    id: "1",
    email: "admin@demobedrijf.nl",
    password: "admin123",
    name: "Admin Demo",
    role: "super_admin" as const,
    company: "Demo Bedrijf BV",
  },
  {
    id: "2",
    email: "bhv@demobedrijf.nl",
    password: "bhv123",
    name: "BHV Coordinator",
    role: "bhv_coordinator" as const,
    company: "Demo Bedrijf BV",
  },
  {
    id: "3",
    email: "security@demobedrijf.nl",
    password: "security123",
    name: "Security Receptionist",
    role: "security" as const,
    company: "Demo Bedrijf BV",
  },
  {
    id: "4",
    email: "medewerker@demobedrijf.nl",
    password: "medewerker123",
    name: "Medewerker Demo",
    role: "employee" as const,
    company: "Demo Bedrijf BV",
  },
  {
    id: "5",
    email: "partner@demobedrijf.nl",
    password: "partner123",
    name: "Partner Admin",
    role: "partner_admin" as const,
    company: "Partner Bedrijf BV",
  },
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
    const savedUser = localStorage.getItem("bhv360_user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error("Error parsing saved user:", error)
        localStorage.removeItem("bhv360_user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Find matching demo account
      const account = DEMO_ACCOUNTS.find((acc) => acc.email === email && acc.password === password)

      if (!account) {
        setIsLoading(false)
        return { success: false, error: "Ongeldige inloggegevens" }
      }

      const user: User = {
        id: account.id,
        email: account.email,
        name: account.name,
        role: account.role,
        company: account.company,
      }

      setUser(user)
      localStorage.setItem("bhv360_user", JSON.stringify(user))
      setIsLoading(false)

      return { success: true }
    } catch (error) {
      setIsLoading(false)
      return { success: false, error: "Er is een fout opgetreden bij het inloggen" }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("bhv360_user")
  }

  const value: AuthContextType = {
    user,
    login,
    logout,
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
