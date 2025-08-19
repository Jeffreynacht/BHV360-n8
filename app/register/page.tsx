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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    company: "",
    role: "employee",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const { signUp, user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && !isLoading) {
      router.push("/dashboard")
    }
  }, [user, isLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Wachtwoorden komen niet overeen")
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("Wachtwoord moet minimaal 6 karakters lang zijn")
      setLoading(false)
      return
    }

    try {
      const { error } = await signUp(formData.email, formData.password, {
        name: formData.name,
        company: formData.company,
        role: formData.role,
      })

      if (error) {
        setError(error.message || "Er is een fout opgetreden bij het registreren")
      } else {
        setSuccess("Account succesvol aangemaakt! Controleer uw email voor verificatie.")
        // Optionally redirect after a delay
        setTimeout(() => {
          router.push("/login")
        }, 3000)
      }
    } catch (err) {
      setError("Er is een onverwachte fout opgetreden")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
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
            <Shield className="h-8 w-8 text-blue-600 mr-2" />
            <span className="text-2xl font-bold">BHV360</span>
          </div>
          <CardTitle>Account Aanmaken</CardTitle>
          <CardDescription>Maak uw BHV360 account aan om te beginnen</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Volledige naam</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Jan de Vries"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mailadres</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="jan@bedrijf.nl"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Bedrijfsnaam</Label>
              <Input
                id="company"
                type="text"
                value={formData.company}
                onChange={(e) => handleInputChange("company", e.target.value)}
                placeholder="Uw Bedrijf B.V."
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Rol</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleInputChange("role", value)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecteer uw rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee">Medewerker</SelectItem>
                  <SelectItem value="bhv-coordinator">BHV Coördinator</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Wachtwoord</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder="Minimaal 6 karakters"
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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Bevestig wachtwoord</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  placeholder="Herhaal uw wachtwoord"
                  required
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Account aanmaken..." : "Account Aanmaken"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <div className="text-sm text-gray-600">
              Al een account?{" "}
              <Link href="/login" className="text-blue-600 hover:underline">
                Log hier in
              </Link>
            </div>
          </div>

          <div className="mt-4 text-xs text-gray-500 text-center">
            Door een account aan te maken gaat u akkoord met onze{" "}
            <Link href="/terms" className="text-blue-600 hover:underline">
              Algemene Voorwaarden
            </Link>{" "}
            en{" "}
            <Link href="/privacy" className="text-blue-600 hover:underline">
              Privacybeleid
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
