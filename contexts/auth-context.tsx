"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  email: string
  name: string
  role: string
  permissions: string[]
  avatar?: string
  lastLogin?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  isLoading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Demo users database
  const demoUsers = [
    {
      id: "1",
      email: "demo@bhv360.nl",
      username: "demo",
      password: "demo123",
      name: "Demo Gebruiker",
      role: "BHV Coördinator",
      permissions: ["read", "write", "incidents", "plotkaart", "reports"],
      avatar: "/placeholder-user.jpg",
    },
    {
      id: "2",
      email: "admin@bhv360.nl",
      username: "admin",
      password: "admin123",
      name: "System Administrator",
      role: "Super Admin",
      permissions: ["read", "write", "admin", "incidents", "plotkaart", "reports", "users", "settings"],
      avatar: "/placeholder-user.jpg",
    },
    {
      id: "3",
      email: "bhv@bhv360.nl",
      username: "bhv",
      password: "bhv123",
      name: "BHV Medewerker",
      role: "BHV'er",
      permissions: ["read", "incidents", "plotkaart"],
      avatar: "/placeholder-user.jpg",
    },
    {
      id: "4",
      email: "coordinator@bhv360.nl",
      username: "coordinator",
      password: "coord123",
      name: "BHV Coördinator",
      role: "BHV Coördinator",
      permissions: ["read", "write", "incidents", "plotkaart", "reports", "team"],
      avatar: "/placeholder-user.jpg",
    },
    {
      id: "5",
      email: "employee@bhv360.nl",
      username: "employee",
      password: "emp123",
      name: "Medewerker",
      role: "Medewerker",
      permissions: ["read"],
      avatar: "/placeholder-user.jpg",
    },
    {
      id: "6",
      email: "manager@bhv360.nl",
      username: "manager",
      password: "mgr123",
      name: "Facility Manager",
      role: "Customer Admin",
      permissions: ["read", "write", "incidents", "plotkaart", "reports", "users"],
      avatar: "/placeholder-user.jpg",
    },
  ]

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      try {
        const savedUser = localStorage.getItem("bhv360_user")
        if (savedUser) {
          const userData = JSON.parse(savedUser)
          setUser(userData)
        }
      } catch (error) {
        console.error("Error checking auth:", error)
        localStorage.removeItem("bhv360_user")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true)

      // Find user by email or username
      const demoUser = demoUsers.find(
        (user) =>
          user.email.toLowerCase() === email.toLowerCase() || user.username.toLowerCase() === email.toLowerCase(),
      )

      if (!demoUser || demoUser.password !== password) {
        return {
          success: false,
          error: "Ongeldige inloggegevens. Controleer je email/gebruikersnaam en wachtwoord.",
        }
      }

      // Create user session
      const userSession: User = {
        id: demoUser.id,
        email: demoUser.email,
        name: demoUser.name,
        role: demoUser.role,
        permissions: demoUser.permissions,
        avatar: demoUser.avatar,
        lastLogin: new Date().toISOString(),
      }

      setUser(userSession)
      localStorage.setItem("bhv360_user", JSON.stringify(userSession))

      return { success: true }
    } catch (error) {
      console.error("Login error:", error)
      return {
        success: false,
        error: "Er is een fout opgetreden tijdens het inloggen. Probeer het opnieuw.",
      }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("bhv360_user")
    router.push("/login")
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
