"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  name: string
  email: string
  role: string
  organization?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("bhv360_user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Demo authentication logic
    const demoUsers = [
      {
        id: "1",
        email: "admin@bhv360.nl",
        password: "admin123",
        name: "Jeffrey Nachtegaal",
        role: "super-admin",
        organization: "BHV360",
      },
      {
        id: "2",
        email: "jan@demobedrijf.nl",
        password: "demo123",
        name: "Jan de Vries",
        role: "organization-admin",
        organization: "Demo Bedrijf B.V.",
      },
      {
        id: "3",
        email: "marie@demobedrijf.nl",
        password: "demo123",
        name: "Marie Janssen",
        role: "bhv-coordinator",
        organization: "Demo Bedrijf B.V.",
      },
    ]

    const foundUser = demoUsers.find((u) => u.email === email && u.password === password)

    if (foundUser) {
      const userData = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
        organization: foundUser.organization,
      }
      setUser(userData)
      localStorage.setItem("bhv360_user", JSON.stringify(userData))
      return true
    }

    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("bhv360_user")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
