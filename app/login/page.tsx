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
import { Loader2, Building2, Crown, Users, Shield, User, AlertCircle } from "lucide-react"
import { toast } from "@/hooks/use-toast"

const demoAccounts = [
  {
    email: "jeffrey@bhv360.nl",
    password: "jeffrey123",
    name: "Jeffrey van der Meer",
    role: "Super Admin",
    icon: Crown,
    description: "Volledige toegang tot alle functies",
    color: "text-purple-600",
  },
  {
    email: "jan@demobedrijf.nl",
    password: "demo123",
    name: "Jan Janssen",
    role: "Admin",
    icon: Users,
    description: "Bedrijfsbeheer en gebruikersbeheer",
    color: "text-blue-600",
  },
  {
    email: "piet@demobedrijf.nl",
    password: "piet123",
    name: "Piet Pietersen",
    role: "BHV Coördinator",
    icon: Shield,
    description: "BHV teams en incidenten beheren",
    color: "text-green-600",
  },
  {
    email: "marie@demobedrijf.nl",
    password: "marie123",
    name: "Marie de Vries",
    role: "Medewerker",
    icon: User,
    description: "Basis toegang tot BHV informatie",
    color: "text-gray-600",
  },
]

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const { login, isLoading, error } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast({
        title: "Velden ontbreken",
        description: "Vul alle velden in om in te loggen",
        variant: "destructive",
      })
      return
    }

    const success = await login(email, password)
    if (success) {
      toast({
        title: "Succesvol ingelogd",
        description: "Welkom bij BHV360!",
      })
      router.push("/dashboard")
    }
  }

  const handleDemoLogin = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail)
    setPassword(demoPassword)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8">
        {/* Login Form */}
        <Card className="w-full shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-blue-600 p-3 rounded-xl">
                <Building2 className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900">BHV360</CardTitle>
            <CardDescription className="text-lg text-gray-600">Professioneel BHV management systeem</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email adres
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="je@bedrijf.nl"
                  disabled={isLoading}
                  className="h-12 text-base"
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Wachtwoord
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={isLoading}
                    className="h-12 text-base pr-10"
                    autoComplete="current-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-12 px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full h-12 text-base font-medium" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Inloggen...
                  </>
                ) : (
                  "Inloggen"
                )}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm text-gray-500">
                Problemen met inloggen?{" "}
                <a href="mailto:support@bhv360.nl" className="text-blue-600 hover:underline">
                  Neem contact op
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Demo Accounts */}
        <Card className="w-full shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-bold text-gray-900">Demo Accounts</CardTitle>
            <CardDescription className="text-base text-gray-600">
              Klik op een account om automatisch in te loggen en de functionaliteiten te verkennen
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {demoAccounts.map((account) => {
              const IconComponent = account.icon
              return (
                <Button
                  key={account.email}
                  variant="outline"
                  className="w-full h-auto p-6 justify-start bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300 transition-all duration-200"
                  onClick={() => handleDemoLogin(account.email, account.password)}
                  disabled={isLoading}
                >
                  <div className="flex items-center space-x-4 w-full">
                    <div className="flex-shrink-0">
                      <IconComponent className={`h-6 w-6 ${account.color}`} />
                    </div>
                    <div className="text-left flex-grow">
                      <div className="font-semibold text-gray-900">{account.name}</div>
                      <div className={`text-sm font-medium ${account.color}`}>{account.role}</div>
                      <div className="text-xs text-gray-500 mt-1">{account.description}</div>
                    </div>
                    <div className="text-xs text-gray-400 font-mono bg-gray-100 px-2 py-1 rounded">
                      {account.password}
                    </div>
                  </div>
                </Button>
              )
            })}

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Demo Omgeving</p>
                  <p>
                    Dit is een volledig functionele demo. Alle data wordt lokaal opgeslagen en verdwijnt bij het wissen
                    van browser data.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
