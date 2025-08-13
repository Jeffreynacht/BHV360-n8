"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Shield, Users, UserCheck, User } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const success = await login(email, password)
      if (success) {
        router.push("/dashboard")
      } else {
        setError("Ongeldige inloggegevens. Controleer je email en wachtwoord.")
      }
    } catch (err) {
      setError("Er is een fout opgetreden. Probeer het opnieuw.")
    } finally {
      setIsLoading(false)
    }
  }

  const demoAccounts = [
    {
      email: "jeffrey@bhv360.nl",
      password: "jeffrey123",
      role: "Super Admin",
      icon: Shield,
      description: "Volledige toegang tot alle functies",
    },
    {
      email: "admin",
      password: "bhv360secure",
      role: "Partner Admin",
      icon: Users,
      description: "Beheer van meerdere klanten",
    },
    {
      email: "jan@demobedrijf.nl",
      password: "demo123",
      role: "Klant Admin",
      icon: UserCheck,
      description: "Beheer van eigen organisatie",
    },
    {
      email: "demo",
      password: "demo123",
      role: "Demo User",
      icon: User,
      description: "Basis demo toegang",
    },
  ]

  const fillDemoAccount = (email: string, password: string) => {
    setEmail(email)
    setPassword(password)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8">
        {/* Login Form */}
        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">BHV360 Inloggen</CardTitle>
            <CardDescription>Voer je inloggegevens in om toegang te krijgen</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="je@email.nl of gebruikersnaam"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Wachtwoord</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Voer je wachtwoord in"
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={isLoading}>
                {isLoading ? "Bezig met inloggen..." : "Inloggen"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Accounts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">Demo Accounts</CardTitle>
            <CardDescription>Klik op een account om automatisch in te vullen</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {demoAccounts.map((account, index) => {
              const IconComponent = account.icon
              return (
                <div
                  key={index}
                  className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => fillDemoAccount(account.email, account.password)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <IconComponent className="w-5 h-5 text-orange-500 mt-0.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">{account.role}</p>
                        <span className="text-xs text-gray-500 font-mono">{account.password}</span>
                      </div>
                      <p className="text-xs text-gray-600 font-mono">{account.email}</p>
                      <p className="text-xs text-gray-500 mt-1">{account.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}

            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-800">
                💡 <strong>Tip:</strong> Klik op een account hierboven om de inloggegevens automatisch in te vullen.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
