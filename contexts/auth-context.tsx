"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface User {
  id: string
  email: string
  name: string
  role: string
  customerId: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  loading: boolean
  canAccess: (role: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Check for user in local storage on initial load
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock user data
      const mockUser = {
        id: "1",
        email: email,
        name: "Test User",
        role: "customer-admin",
        customerId: "123",
      }

      // Store user in local storage
      localStorage.setItem("user", JSON.stringify(mockUser))
      setUser(mockUser)

      toast({
        title: "Ingelogd",
        description: `Welkom terug, ${mockUser.name}!`,
      })

      router.push("/dashboard")
      return { success: true }
    } catch (error: any) {
      console.error("Login error:", error)
      toast({
        title: "Inloggen mislukt",
        description: "Controleer uw e-mailadres en wachtwoord.",
        variant: "destructive",
      })
      return { success: false, error: "Invalid credentials" }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("user")
    setUser(null)
    router.push("/login")
    toast({
      title: "Uitgelogd",
      description: "U bent succesvol uitgelogd.",
    })
  }

  const canAccess = (role: string) => {
    return user?.role === role
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

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
