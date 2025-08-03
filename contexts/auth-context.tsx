"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  email: string
  name: string
  role: string
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
    const savedUser = localStorage.getItem("bhv360-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Demo login credentials
    const demoUsers = [
      { id: "1", email: "jan@demobedrijf.nl", password: "demo123", name: "Jan Jansen", role: "admin" },
      { id: "2", email: "marie@demobedrijf.nl", password: "demo123", name: "Marie Bakker", role: "employee" },
      { id: "3", email: "admin@bhv360.nl", password: "admin123", name: "BHV360 Admin", role: "super-admin" },
    ]

    const foundUser = demoUsers.find((u) => u.email === email && u.password === password)

    if (foundUser) {
      const user = { id: foundUser.id, email: foundUser.email, name: foundUser.name, role: foundUser.role }
      setUser(user)
      localStorage.setItem("bhv360-user", JSON.stringify(user))
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("bhv360-user")
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
