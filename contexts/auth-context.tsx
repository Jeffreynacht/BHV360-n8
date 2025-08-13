"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface User {
  id: string
  email: string
  name: string
  role: "super-admin" | "partner-admin" | "customer-admin" | "bhv-coordinator" | "employee"
  customerId?: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo gebruikers voor ontwikkeling en productie
const DEMO_USERS: User[] = [
  {
    id: "1",
    email: "jeffrey@bhv360.nl",
    name: "Jeffrey Nacht",
    role: "super-admin",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: "2",
    email: "admin",
    name: "Admin User",
    role: "partner-admin",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: "3",
    email: "jan@demobedrijf.nl",
    name: "Jan Janssen",
    role: "customer-admin",
    customerId: "demo-bedrijf-bv",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: "4",
    email: "piet@demobedrijf.nl",
    name: "Piet Pietersen",
    role: "bhv-coordinator",
    customerId: "demo-bedrijf-bv",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: "5",
    email: "marie@demobedrijf.nl",
    name: "Marie de Vries",
    role: "employee",
    customerId: "demo-bedrijf-bv",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: "6",
    email: "demo",
    name: "Demo User",
    role: "customer-admin",
    customerId: "demo-bedrijf-bv",
    avatar: "/placeholder-user.jpg",
  },
]

// Demo wachtwoorden
const DEMO_PASSWORDS: Record<string, string> = {
  "jeffrey@bhv360.nl": "jeffrey123",
  admin: "bhv360secure",
  "jan@demobedrijf.nl": "demo123",
  "piet@demobedrijf.nl": "piet123",
  "marie@demobedrijf.nl": "marie123",
  demo: "demo123",
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Laad gebruiker uit localStorage bij opstarten
  useEffect(() => {
    const loadUser = () => {
      try {
        if (typeof window !== "undefined") {
          const savedUser = localStorage.getItem("bhv360-user")
          if (savedUser) {
            const parsedUser = JSON.parse(savedUser)
            setUser(parsedUser)
          }
        }
      } catch (error) {
        console.error("Error loading user from localStorage:", error)
        // Clear corrupted data
        if (typeof window !== "undefined") {
          localStorage.removeItem("bhv360-user")
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      // Probeer eerst server-side authenticatie
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.user) {
          setUser(data.user)
          if (typeof window !== "undefined") {
            localStorage.setItem("bhv360-user", JSON.stringify(data.user))
          }
          setIsLoading(false)
          return true
        }
      }
    } catch (error) {
      console.warn("Server authentication failed, falling back to demo mode:", error)
    }

    // Fallback naar demo authenticatie
    const demoUser = DEMO_USERS.find((u) => u.email === email)
    const expectedPassword = DEMO_PASSWORDS[email]

    if (demoUser && expectedPassword === password) {
      setUser(demoUser)
      if (typeof window !== "undefined") {
        localStorage.setItem("bhv360-user", JSON.stringify(demoUser))
      }
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const logout = async () => {
    try {
      // Probeer server-side logout
      await fetch("/api/auth/logout", {
        method: "POST",
      })
    } catch (error) {
      console.warn("Server logout failed:", error)
    }

    // Altijd client-side cleanup
    setUser(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem("bhv360-user")
      localStorage.removeItem("bhv360-selected-customer")
    }
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
