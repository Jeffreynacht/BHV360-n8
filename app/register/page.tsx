"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Eye, EyeOff, CheckCircle } from "lucide-react"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    company: "",
    department: "",
    phone: "",
    role: "employee",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { signUp } = useAuth()
  const router = useRouter()

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Wachtwoorden komen niet overeen")
      return false
    }
    if (formData.password.length < 6) {
      setError("Wachtwoord moet minimaal 6 karakters lang zijn")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!validateForm()) return

    setIsLoading(true)

    try {
      const { success, error } = await signUp(formData.email, formData.password, {
        name: formData.name,
        company: formData.company,
        department: formData.department,
        phone: formData.phone,
        role: formData.role,
      })

      if (success) {
        setSuccess(true)
        setTimeout(() => {
          router.push("/login?message=check-email")
        }, 3000)
      } else {
        setError(error || "Registratie mislukt")
      }
    } catch (error) {
      setError("Er is een onverwachte fout opgetreden")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
              <h2 className="mt-4 text-xl font-semibold text-gray-900">Registratie succesvol!</h2>
              <p className="mt-2 text-sm text-gray-600">
                We hebben een bevestigingsmail gestuurd naar <strong>{formData.email}</strong>. Klik op de link in de
                mail om je account te activeren.
              </p>
              <Button className="mt-4" onClick={() => router.push("/login")}>
                Ga naar inlogpagina
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Account aanmaken</h2>
          <p className="mt-2 text-sm text-gray-600">
            Of{" "}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              log in met je bestaande account
            </Link>
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welkom bij BHV360</CardTitle>
            <CardDescription>Vul je gegevens in om een account aan te maken</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Volledige naam *</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Jan de Vries"
                  />
                </div>
                <div>
                  <Label htmlFor="role">Rol</Label>
                  <Select value={formData.role} onValueChange={(value) => handleChange("role", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="employee">Medewerker</SelectItem>
                      <SelectItem value="bhv_coordinator">BHV Coördinator</SelectItem>
                      <SelectItem value="admin">Beheerder</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="email">E-mailadres *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="jan@bedrijf.nl"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company">Bedrijf</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => handleChange("company", e.target.value)}
                    placeholder="Bedrijfsnaam BV"
                  />
                </div>
                <div>
                  <Label htmlFor="department">Afdeling</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => handleChange("department", e.target.value)}
                    placeholder="HR, IT, etc."
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Telefoonnummer</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="+31 6 12345678"
                />
              </div>

              <div>
                <Label htmlFor="password">Wachtwoord *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    placeholder="••••••••"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="confirmPassword">Bevestig wachtwoord *</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
                    placeholder="••••••••"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Account aanmaken...
                  </>
                ) : (
                  "Account aanmaken"
                )}
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

              <div className="mt-6">
                <Link href="/demo">
                  <Button variant="outline" className="w-full bg-transparent">
                    Probeer eerst de demo
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
