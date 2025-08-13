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
import { Loader2, Building2, Crown, Users, Shield, User } from "lucide-react"
import { toast } from "@/hooks/use-toast"

const demoAccounts = [
  {
    email: "jeffrey@bhv360.nl",
    password: "jeffrey123",
    name: "Jeffrey van der Meer",
    role: "Super Admin",
    icon: Crown,
    description: "Volledige toegang tot alle functies",
  },
  {
    email: "jan@demobedrijf.nl",
    password: "demo123",
    name: "Jan Janssen",
    role: "Admin",
    icon: Users,
    description: "Bedrijfsbeheer en gebruikersbeheer",
  },
  {
    email: "piet@demobedrijf.nl",
    password: "piet123",
    name: "Piet Pietersen",
    role: "BHV Coördinator",
    icon: Shield,
    description: "BHV teams en incidenten beheren",
  },
  {
    email: "marie@demobedrijf.nl",
    password: "marie123",
    name: "Marie de Vries",
    role: "Medewerker",
    icon: User,
    description: "Basis toegang tot BHV informatie",
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

    if (!email || !password) {
      setError("Vul alle velden in")
      return
    }

    const success = await login(email, password)
    if (success) {
      toast({
        title: "Succesvol ingelogd",
        description: "Welkom bij BHV360!",
      })
      router.push("/dashboard")
    } else {
      setError("Ongeldige inloggegevens")
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
              <Building2 className="h-8 w-8 text-blue-600 mr-2" />
              <span className="text-2xl font-bold text-gray-900">BHV360</span>
            </div>
            <CardTitle className="text-2xl">Inloggen</CardTitle>
            <CardDescription>Voer je inloggegevens in of gebruik een demo account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="je@bedrijf.nl"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Wachtwoord</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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
                  "Inloggen"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Accounts */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl">Demo Accounts</CardTitle>
            <CardDescription>Klik op een account om automatisch in te loggen</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {demoAccounts.map((account) => {
              const IconComponent = account.icon
              return (
                <Button
                  key={account.email}
                  variant="outline"
                  className="w-full h-auto p-4 justify-start bg-transparent"
                  onClick={() => handleDemoLogin(account.email, account.password)}
                  disabled={isLoading}
                >
                  <div className="flex items-center space-x-3">
                    <IconComponent className="h-5 w-5 text-blue-600" />
                    <div className="text-left">
                      <div className="font-medium">{account.name}</div>
                      <div className="text-sm text-gray-500">{account.role}</div>
                      <div className="text-xs text-gray-400">{account.description}</div>
                    </div>
                  </div>
                </Button>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
