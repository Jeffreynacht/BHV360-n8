"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Building, ArrowLeft, AlertCircle, CheckCircle } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { resetPassword } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    if (!email) {
      setError("Vul uw e-mailadres in")
      setIsSubmitting(false)
      return
    }

    try {
      const result = await resetPassword(email)

      if (result.success) {
        setSuccess(true)
      } else {
        setError(result.error || "Er is een fout opgetreden")
      }
    } catch (error) {
      setError("Er is een onverwachte fout opgetreden")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Email Verzonden!</h2>
              <p className="text-gray-600 mb-4">
                We hebben een wachtwoord reset link naar {email} gestuurd. Controleer uw inbox en klik op de link om uw
                wachtwoord te resetten.
              </p>
              <div className="space-y-2">
                <Link href="/login">
                  <Button className="w-full">Terug naar inloggen</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Building className="h-8 w-8 text-blue-600 mr-2" />
            <span className="text-2xl font-bold text-blue-600">BHV360</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Wachtwoord Vergeten</h1>
          <p className="text-gray-600 mt-2">Voer uw e-mailadres in om uw wachtwoord te resetten</p>
        </div>

        {/* Reset Form */}
        <Card>
          <CardHeader>
            <CardTitle>Wachtwoord Resetten</CardTitle>
            <CardDescription>We sturen u een link om uw wachtwoord te resetten</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mailadres</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="naam@bedrijf.nl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verzenden...
                  </>
                ) : (
                  "Reset Link Verzenden"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Weet u uw wachtwoord weer?{" "}
                <Link href="/login" className="text-blue-600 hover:text-blue-500">
                  Log hier in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home */}
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
