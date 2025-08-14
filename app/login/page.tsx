"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BHV360Logo } from "@/components/bhv360-logo"
import { Loader2, Shield } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await login(email, password)
      if (!result.success) {
        setError(result.error || "Login failed")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const demoCredentials = [
    {
      role: "Security/Receptionist",
      email: "security@demobedrijf.nl",
      password: "demo123",
      description: "Bezoeker & monteur registratie, incident melden",
    },
    {
      role: "BHV Coördinator (Admin)",
      email: "jan@demobedrijf.nl",
      password: "demo123",
      description: "Volledige BHV beheer, plotkaart, medewerkers, modules",
    },
    {
      role: "Medewerker",
      email: "marie@demobedrijf.nl",
      password: "demo123",
      description: "Basis toegang, incidenten bekijken",
    },
    {
      role: "Customer Admin",
      email: "admin@demobedrijf.nl",
      password: "demo123",
      description: "Klant beheer en configuratie",
    },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Login Form */}
        <Card className="w-full">
          <CardHeader className="space-y-4">
            <div className="flex justify-center">
              <BHV360Logo size="lg" />
            </div>
            <div className="text-center">
              <CardTitle className="text-2xl">Welkom bij BHV360</CardTitle>
              <CardDescription>Log in om toegang te krijgen tot uw dashboard</CardDescription>
            </div>
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
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Wachtwoord</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Voer uw wachtwoord in"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
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
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Inloggen
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl">Demo Accounts</CardTitle>
            <CardDescription>Gebruik deze accounts om de verschillende rollen te testen</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {demoCredentials.map((cred, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm">{cred.role}</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEmail(cred.email)
                      setPassword(cred.password)
                    }}
                  >
                    Gebruik
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>
                    <strong>Email:</strong> {cred.email}
                  </p>
                  <p>
                    <strong>Wachtwoord:</strong> {cred.password}
                  </p>
                  <p className="text-blue-600">{cred.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
