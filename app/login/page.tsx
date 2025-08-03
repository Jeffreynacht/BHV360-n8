"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, Lock, Mail, User, Shield, AlertCircle, CheckCircle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const { login } = useAuth()
  const router = useRouter()

  const demoAccounts = [
    {
      username: "demo",
      password: "demo123",
      email: "demo@bhv360.nl",
      role: "BHV Coördinator",
      description: "Algemene demo account met toegang tot alle basis functies",
      icon: <User className="h-4 w-4" />,
      color: "bg-blue-100 text-blue-800 border-blue-200",
    },
    {
      username: "admin",
      password: "admin123",
      email: "admin@bhv360.nl",
      role: "Super Admin",
      description: "Volledige toegang tot alle beheer functies en instellingen",
      icon: <Shield className="h-4 w-4" />,
      color: "bg-red-100 text-red-800 border-red-200",
    },
    {
      username: "bhv",
      password: "bhv123",
      email: "bhv@bhv360.nl",
      role: "BHV'er",
      description: "BHV'er account voor incident meldingen en controles",
      icon: <User className="h-4 w-4" />,
      color: "bg-green-100 text-green-800 border-green-200",
    },
    {
      username: "coordinator",
      password: "coord123",
      email: "coordinator@bhv360.nl",
      role: "BHV Coördinator",
      description: "Coördinator account voor team beheer en rapportages",
      icon: <User className="h-4 w-4" />,
      color: "bg-purple-100 text-purple-800 border-purple-200",
    },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      // Check if input is email or username
      const isEmail = email.includes("@")
      const loginCredentials = { email, password }

      // If it's a username, find the corresponding email
      if (!isEmail) {
        const demoAccount = demoAccounts.find((account) => account.username.toLowerCase() === email.toLowerCase())
        if (demoAccount) {
          loginCredentials.email = demoAccount.email
        }
      }

      const result = await login(loginCredentials.email, password)

      if (result.success) {
        setSuccess("Succesvol ingelogd! Je wordt doorgestuurd...")
        setTimeout(() => {
          router.push("/dashboard")
        }, 1500)
      } else {
        setError(result.error || "Inloggen mislukt. Controleer je gegevens.")
      }
    } catch (err) {
      setError("Er is een fout opgetreden. Probeer het opnieuw.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = async (account: (typeof demoAccounts)[0]) => {
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const result = await login(account.email, account.password)

      if (result.success) {
        setSuccess(`Ingelogd als ${account.role}! Je wordt doorgestuurd...`)
        setTimeout(() => {
          router.push("/dashboard")
        }, 1500)
      } else {
        setError("Demo login mislukt. Probeer het opnieuw.")
      }
    } catch (err) {
      setError("Er is een fout opgetreden bij het demo login.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Login Form */}
        <Card className="w-full max-w-md mx-auto shadow-xl border-0">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">Welkom bij BHV360</CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                Log in om toegang te krijgen tot je BHV dashboard
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">{success}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email of Gebruikersnaam
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="text"
                    placeholder="je@email.nl of gebruikersnaam"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Wachtwoord
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Je wachtwoord"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                {isLoading ? "Bezig met inloggen..." : "Inloggen"}
              </Button>
            </form>

            <div className="text-center">
              <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
                Wachtwoord vergeten?
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Demo Accounts */}
        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
              <User className="h-5 w-5 mr-2 text-blue-600" />
              Demo Accounts
            </CardTitle>
            <CardDescription>
              Probeer BHV360 met een van deze demo accounts. Elke account heeft verschillende rechten en functies.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {demoAccounts.map((account, index) => (
              <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-full">{account.icon}</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{account.username}</h3>
                      <Badge className={`text-xs ${account.color}`}>{account.role}</Badge>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDemoLogin(account)}
                    disabled={isLoading}
                    className="border-blue-200 text-blue-700 hover:bg-blue-50"
                  >
                    Direct Inloggen
                  </Button>
                </div>

                <p className="text-sm text-gray-600 mb-3">{account.description}</p>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="font-medium text-gray-700">Gebruikersnaam:</span>
                    <code className="ml-1 px-1 bg-gray-100 rounded">{account.username}</code>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Wachtwoord:</span>
                    <code className="ml-1 px-1 bg-gray-100 rounded">{account.password}</code>
                  </div>
                </div>
              </div>
            ))}

            <Separator className="my-4" />

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                Demo Informatie
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Alle demo data wordt dagelijks gereset</li>
                <li>• Video's zijn niet beschikbaar in de demo omgeving</li>
                <li>• Sommige externe integraties zijn uitgeschakeld</li>
                <li>• Voor productie toegang, neem contact op met support</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
