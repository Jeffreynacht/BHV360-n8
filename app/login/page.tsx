"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Eye, EyeOff, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { login } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirect") || "/dashboard"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const success = await login(email, password)
      if (success) {
        router.push(redirectTo)
      } else {
        setError("Ongeldige inloggegevens. Controleer uw email en wachtwoord.")
      }
    } catch (err) {
      setError("Er is een fout opgetreden. Probeer het opnieuw.")
    } finally {
      setIsLoading(false)
    }
  }

  const demoAccounts = [
    {
      email: "admin@bhv360.nl",
      password: "admin123",
      role: "Super Admin",
      description: "Volledige toegang tot alle functies",
    },
    {
      email: "jan@demobedrijf.nl",
      password: "demo123",
      role: "Organisatie Admin",
      description: "Beheer van organisatie en gebruikers",
    },
    {
      email: "marie@demobedrijf.nl",
      password: "demo123",
      role: "BHV Coördinator",
      description: "BHV management en incidenten",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Terug naar homepage
          </Link>
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Image
              src="/images/bhv360-logo.png"
              alt="BHV360 Logo"
              width={48}
              height={48}
              className="rounded-lg shadow-sm"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">BHV360</h1>
              <p className="text-sm text-gray-600">Professional Safety Management</p>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welkom terug</CardTitle>
            <CardDescription>Log in om toegang te krijgen tot uw BHV360 dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email adres</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="uw.email@bedrijf.nl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Wachtwoord</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Uw wachtwoord"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-11 px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
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

              <Button type="submit" className="w-full h-11" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
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

            <div className="mt-6 text-center">
              <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">
                Wachtwoord vergeten?
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Demo Accounts */}
        <Card className="mt-6 shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-lg">Demo Accounts</CardTitle>
            <CardDescription>Probeer BHV360 met deze demo accounts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {demoAccounts.map((account, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium text-sm">{account.role}</div>
                    <div className="text-xs text-gray-600">{account.description}</div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEmail(account.email)
                      setPassword(account.password)
                    }}
                  >
                    Gebruik
                  </Button>
                </div>
                <div className="text-xs font-mono text-gray-500">
                  {account.email} / {account.password}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Nog geen account?{" "}
            <Link href="/contact" className="text-blue-600 hover:text-blue-700">
              Neem contact op
            </Link>
          </p>
          <p className="mt-2">© 2024 BHV360. Alle rechten voorbehouden.</p>
        </div>
      </div>
    </div>
  )
}
