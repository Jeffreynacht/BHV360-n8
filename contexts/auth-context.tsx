"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  name: string
  email: string
  role: "super-admin" | "admin" | "bhv-coordinator" | "employee"
  customerId?: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo gebruikers database
const demoUsers: User[] = [
  {
    id: "1",
    name: "Jeffrey van der Meer",
    email: "jeffrey@bhv360.nl",
    role: "super-admin",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: "2",
    name: "Jan Janssen",
    email: "jan@demobedrijf.nl",
    role: "admin",
    customerId: "1",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: "3",
    name: "Piet Pietersen",
    email: "piet@demobedrijf.nl",
    role: "bhv-coordinator",
    customerId: "1",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: "4",
    name: "Marie de Vries",
    email: "marie@demobedrijf.nl",
    role: "employee",
    customerId: "1",
    avatar: "/placeholder-user.jpg",
  },
]

// Demo wachtwoorden
const demoPasswords: { [email: string]: string } = {
  "jeffrey@bhv360.nl": "jeffrey123",
  "jan@demobedrijf.nl": "demo123",
  "piet@demobedrijf.nl": "piet123",
  "marie@demobedrijf.nl": "marie123",
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Controleer opgeslagen gebruikerssessie
    const storedUser = localStorage.getItem("bhv360-user")
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
      } catch (error) {
        console.error("Fout bij het parsen van opgeslagen gebruiker:", error)
        localStorage.removeItem("bhv360-user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    setError(null)

    // Simuleer API vertraging
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Controleer inloggegevens
    const foundUser = demoUsers.find((u) => u.email === email)
    const correctPassword = demoPasswords[email]

    if (foundUser && correctPassword === password) {
      setUser(foundUser)
      localStorage.setItem("bhv360-user", JSON.stringify(foundUser))
      setIsLoading(false)
      return true
    }

    setError("Ongeldige inloggegevens")
    setIsLoading(false)
    return false
  }

  const logout = () => {
    setUser(null)
    setError(null)
    localStorage.removeItem("bhv360-user")
    localStorage.removeItem("bhv360-selected-customer")
    router.push("/")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading, error }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth moet gebruikt worden binnen een AuthProvider")
  }
  return context
}
