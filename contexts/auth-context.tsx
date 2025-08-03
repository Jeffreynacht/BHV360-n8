"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

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
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem("bhv360_user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
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

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    setError(null)

    try {
      // Hardcoded credentials for Jeffrey
      if (email === "jef.nachtegaal@gmail.com" && password === "Jefnacht01") {
        const userData: User = {
          id: "1",
          email: "jef.nachtegaal@gmail.com",
          name: "Jeffrey Nachtegaal",
          role: "super-admin",
        }

        setUser(userData)
        localStorage.setItem("bhv360_user", JSON.stringify(userData))

        // Redirect to main dashboard, not AED page
        router.push("/dashboard")
        return true
      } else {
        setError("Ongeldige inloggegevens")
        return false
      }
    } catch (err) {
      setError("Er is een fout opgetreden bij het inloggen")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("bhv360_user")
    localStorage.removeItem("bhv360_selected_customer")
    router.push("/")
  }

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
    error,
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
