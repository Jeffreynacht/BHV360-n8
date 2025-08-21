"use client"

import type React from "react"

import { useState } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, LogIn, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Ongeldige inloggegevens. Probeer opnieuw.")
      } else {
        // Get session to determine redirect
        const session = await getSession()
        if (session?.user?.role === "super_admin") {
          router.push("/super-admin")
        } else if (session?.user?.role === "customer_admin") {
          router.push("/dashboard")
        } else {
          router.push("/bhv")
        }
      }
    } catch (error) {
      setError("Er is een fout opgetreden. Probeer opnieuw.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Image
              src="/images/bhv360-logo-full.png"
              alt="BHV360 Logo"
              width={200}
              height={60}
              className="h-12 w-auto mx-auto mb-4"
            />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Welkom terug</h1>
          <p className="text-gray-600">Log in op uw BHV360 account</p>
        </div>

        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-center">Inloggen</CardTitle>
            <CardDescription className="text-center">Voer uw inloggegevens in om toegang te krijgen</CardDescription>
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
                  placeholder="uw.email@bedrijf.nl"
                  required
                  disabled={loading}
                />
              </div>

              <div>
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
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
                disabled={loading}
              >
                {loading ? (
                  "Inloggen..."
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Inloggen
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 space-y-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Demo accounts voor testing:</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                <div>
                  <strong>Super Admin:</strong> admin@bhv360.nl / admin123
                </div>
                <div>
                  <strong>Customer Admin:</strong> demo@bhv360.nl / demo123
                </div>
                <div>
                  <strong>User:</strong> test@bhv360.nl / test123
                </div>
              </div>

              <div className="text-center">
                <Link href="/register" className="text-green-600 hover:text-green-700 text-sm">
                  Nog geen account? Registreer hier
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-800">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Terug naar homepage
          </Link>
        </div>
      </div>
    </div>
  )
}
