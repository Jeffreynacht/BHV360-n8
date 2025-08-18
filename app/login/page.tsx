"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BHV360Logo } from "@/components/bhv360-logo"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, loading } = useAuth()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  // Check for trial parameters
  const isTrial = searchParams.get("trial") === "true"
  const selectedPlan = searchParams.get("plan")

  useEffect(() => {
    if (isTrial && selectedPlan) {
      toast({
        title: "Gratis Trial Gestart",
        description: `U heeft het ${selectedPlan} plan geselecteerd. Log in om te beginnen.`,
      })
    }
  }, [isTrial, selectedPlan, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.email || !formData.password) {
      setError("Vul alle velden in")
      return
    }

    const result = await login(formData.email, formData.password)

    if (!result.success) {
      setError(result.error || "Inloggen mislukt")
    }
  }

  const handleDemoLogin = async () => {
    setError("")
    const result = await login("demo@bhv360.nl", "demo123")

    if (!result.success) {
      setError("Demo login mislukt")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <BHV360Logo size="xl" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-4">
            {isTrial ? "Start Uw Gratis Trial" : "Welkom Terug"}
          </h1>
          <p className="text-gray-600 mt-2">
            {isTrial ? `Log in om uw ${selectedPlan} trial te starten` : "Log in op uw BHV360 account"}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Inloggen</CardTitle>
            <CardDescription>Voer uw inloggegevens in om toegang te krijgen tot het platform</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  E-mailadres
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="uw@email.nl"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Wachtwoord
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Uw wachtwoord"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300" />
                  <span className="ml-2 text-sm text-gray-600">Onthoud mij</span>
                </label>
                <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                  Wachtwoord vergeten?
                </Link>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Inloggen..." : "Inloggen"}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Of</span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full mt-4 bg-transparent"
                onClick={handleDemoLogin}
                disabled={loading}
              >
                Demo Account Proberen
              </Button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Nog geen account?{" "}
                <Link href="/register" className="text-blue-600 hover:underline">
                  Registreer hier
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Link href="/" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Terug naar homepage
          </Link>
        </div>
      </div>
    </div>
  )
}
