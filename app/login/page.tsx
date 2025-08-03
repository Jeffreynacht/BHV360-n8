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
import { Loader2, LogIn, User } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login, isLoading } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      const success = await login(email, password)
      if (success) {
        router.push("/dashboard")
      } else {
        setError("Ongeldige inloggegevens. Controleer je email en wachtwoord.")
      }
    } catch (err) {
      setError("Er is een fout opgetreden bij het inloggen. Probeer het opnieuw.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleQuickLogin = async () => {
    setEmail("jef.nachtegaal@gmail.com")
    setPassword("Jefnacht01")
    setError("")
    setIsSubmitting(true)

    try {
      const success = await login("jef.nachtegaal@gmail.com", "Jefnacht01")
      if (success) {
        router.push("/dashboard")
      } else {
        setError("Quick login failed")
      }
    } catch (err) {
      setError("Er is een fout opgetreden bij het inloggen.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">BHV360</h1>
          <p className="mt-2 text-gray-600">Professional Safety Management</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Inloggen</CardTitle>
            <CardDescription className="text-center">Voer je inloggegevens in om toegang te krijgen</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jef.nachtegaal@gmail.com"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <Label htmlFor="password">Wachtwoord</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Jefnacht01"
                  required
                  disabled={isSubmitting}
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Inloggen...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Inloggen
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t">
              <div className="text-center mb-4">
                <p className="text-sm text-gray-600">Quick Login voor Testing</p>
              </div>

              <Button
                onClick={handleQuickLogin}
                variant="outline"
                className="w-full bg-transparent"
                disabled={isSubmitting}
              >
                <User className="mr-2 h-4 w-4" />
                Jeffrey Nachtegaal (Super Admin)
              </Button>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-800 font-medium">Login Gegevens:</p>
                <p className="text-xs text-blue-700">Email: jef.nachtegaal@gmail.com</p>
                <p className="text-xs text-blue-700">Wachtwoord: Jefnacht01</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
