"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, Shield, Users, UserCheck, Building } from "lucide-react"

const DEMO_ACCOUNTS = [
  {
    email: "admin@demobedrijf.nl",
    password: "admin123",
    name: "Super Admin",
    role: "Super Administrator",
    icon: Shield,
    color: "bg-red-500",
    description: "Volledige toegang tot alle functies",
  },
  {
    email: "bhv@demobedrijf.nl",
    password: "bhv123",
    name: "BHV Coordinator",
    role: "BHV Coördinator",
    icon: UserCheck,
    color: "bg-blue-500",
    description: "BHV team management en planning",
  },
  {
    email: "security@demobedrijf.nl",
    password: "security123",
    name: "Security",
    role: "Beveiliging/Receptie",
    icon: Shield,
    color: "bg-green-500",
    description: "Bezoekers en aannemers beheer",
  },
  {
    email: "medewerker@demobedrijf.nl",
    password: "medewerker123",
    name: "Medewerker",
    role: "Medewerker",
    icon: Users,
    color: "bg-gray-500",
    description: "Basis toegang voor medewerkers",
  },
]

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login, isLoading } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const result = await login(email, password)

    if (result.success) {
      // Redirect based on role
      if (email === "security@demobedrijf.nl") {
        router.push("/dashboards/security-receptionist")
      } else if (email === "admin@demobedrijf.nl") {
        router.push("/dashboards/super-admin")
      } else if (email === "bhv@demobedrijf.nl") {
        router.push("/dashboards/bhv-coordinator")
      } else {
        router.push("/dashboard")
      }
    } else {
      setError(result.error || "Inloggen mislukt")
    }
  }

  const handleDemoLogin = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail)
    setPassword(demoPassword)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8">
        {/* Login Form */}
        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Building className="h-8 w-8 text-blue-600 mr-2" />
              <span className="text-2xl font-bold text-blue-600">BHV360</span>
            </div>
            <CardTitle className="text-2xl">Welkom terug</CardTitle>
            <CardDescription>Log in om toegang te krijgen tot uw BHV dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mailadres</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="naam@bedrijf.nl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Wachtwoord</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Inloggen...
                  </>
                ) : (
                  "Inloggen"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Accounts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Demo Accounts</CardTitle>
            <CardDescription>Klik op een account om automatisch in te loggen</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {DEMO_ACCOUNTS.map((account) => {
              const IconComponent = account.icon
              return (
                <div
                  key={account.email}
                  className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleDemoLogin(account.email, account.password)}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full ${account.color} text-white`}>
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-medium text-sm">{account.name}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {account.role}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{account.description}</p>
                      <div className="text-xs text-gray-500">
                        <div>{account.email}</div>
                        <div>Wachtwoord: {account.password}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
