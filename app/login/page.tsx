"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff } from "lucide-react"
import { BHV360Logo } from "@/components/bhv360-logo"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { signIn, user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && !isLoading) {
      router.push("/platform")
    }
  }, [user, isLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const { error } = await signIn(email, password)

      if (error) {
        setError(error.message || "Er is een fout opgetreden bij het inloggen")
      } else {
        router.push("/platform")
      }
    } catch (err) {
      setError("Er is een onverwachte fout opgetreden")
    } finally {
      setLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (user) {
    return null // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <BHV360Logo size="lg" showText={false} />
          </div>
          <CardTitle>Welkom terug</CardTitle>
          <CardDescription>Log in op uw BHV360 account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">E-mailadres</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="uw.email@bedrijf.nl"
                required
                disabled={loading}
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
                  placeholder="Uw wachtwoord"
                  required
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Bezig met inloggen..." : "Inloggen"}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
              Wachtwoord vergeten?
            </Link>
            <div className="text-sm text-gray-600">
              Nog geen account?{" "}
              <Link href="/register" className="text-blue-600 hover:underline">
                Registreer hier
              </Link>
            </div>
          </div>

          {/* Demo Login */}
          <div className="mt-6 pt-6 border-t">
            <div className="text-center text-sm text-gray-600 mb-4">Demo Account</div>
            <div className="space-y-2 text-xs text-gray-500">
              <div>Email: demo@bhv360.nl</div>
              <div>Wachtwoord: demo123</div>
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full mt-2 bg-transparent"
              onClick={() => {
                setEmail("demo@bhv360.nl")
                setPassword("demo123")
              }}
              disabled={loading}
            >
              Demo Inloggegevens Gebruiken
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
