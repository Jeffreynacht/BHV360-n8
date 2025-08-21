"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BHV360Logo } from "@/components/bhv360-logo"
import { toast } from "@/hooks/use-toast"
import { Building2, Users, Shield, CheckCircle, ArrowRight, Mail, Phone, MapPin, Lock, AlertCircle } from "lucide-react"
import Link from "next/link"

interface RegistrationData {
  companyName: string
  contactPerson: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
  password: string
  confirmPassword: string
  planType: string
  acceptTerms: boolean
  acceptPrivacy: boolean
}

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<RegistrationData>({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    password: "",
    confirmPassword: "",
    planType: "starter",
    acceptTerms: false,
    acceptPrivacy: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.companyName.trim()) {
      newErrors.companyName = "Bedrijfsnaam is verplicht"
    }

    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = "Contactpersoon is verplicht"
    }

    if (!formData.email.trim()) {
      newErrors.email = "E-mailadres is verplicht"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Ongeldig e-mailadres"
    }

    if (!formData.password) {
      newErrors.password = "Wachtwoord is verplicht"
    } else if (formData.password.length < 8) {
      newErrors.password = "Wachtwoord moet minimaal 8 karakters zijn"
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Wachtwoorden komen niet overeen"
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "U moet akkoord gaan met de algemene voorwaarden"
    }

    if (!formData.acceptPrivacy) {
      newErrors.acceptPrivacy = "U moet akkoord gaan met het privacybeleid"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/customers/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Registratie Succesvol!",
          description: "Uw account is aangemaakt. U wordt doorgestuurd naar de login pagina.",
        })

        // Redirect to login with success message
        router.push(`/login?registered=true&email=${encodeURIComponent(formData.email)}`)
      } else {
        toast({
          title: "Registratie Mislukt",
          description: result.error || "Er is een onbekende fout opgetreden",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Netwerkfout",
        description: "Controleer uw internetverbinding en probeer opnieuw",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof RegistrationData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const plans = [
    {
      id: "starter",
      name: "Starter",
      price: "€9.99",
      period: "per gebruiker/maand",
      features: ["Tot 25 gebruikers", "3 gebouwen", "Basis functionaliteit", "Email support"],
      popular: true,
    },
    {
      id: "professional",
      name: "Professional",
      price: "€19.99",
      period: "per gebruiker/maand",
      features: ["Onbeperkt gebruikers", "Onbeperkt gebouwen", "Alle functies", "Priority support"],
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "Op maat",
      period: "contact voor prijzen",
      features: ["Custom ontwikkeling", "Dedicated support", "SLA garanties", "On-premise optie"],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <BHV360Logo className="mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Start Uw BHV360 Journey</h1>
          <p className="text-gray-600">Registreer uw bedrijf en begin vandaag nog met professioneel BHV beheer</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Registration Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-orange-600" />
                  Bedrijfsregistratie
                </CardTitle>
                <CardDescription>
                  Vul uw bedrijfsgegevens in om te starten met een 14-dagen gratis proefperiode
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Company Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Bedrijfsinformatie
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="companyName">Bedrijfsnaam *</Label>
                        <Input
                          id="companyName"
                          value={formData.companyName}
                          onChange={(e) => handleInputChange("companyName", e.target.value)}
                          className={errors.companyName ? "border-red-500" : ""}
                          placeholder="Uw bedrijfsnaam"
                        />
                        {errors.companyName && <p className="text-sm text-red-600 mt-1">{errors.companyName}</p>}
                      </div>

                      <div>
                        <Label htmlFor="contactPerson">Contactpersoon *</Label>
                        <Input
                          id="contactPerson"
                          value={formData.contactPerson}
                          onChange={(e) => handleInputChange("contactPerson", e.target.value)}
                          className={errors.contactPerson ? "border-red-500" : ""}
                          placeholder="Voor- en achternaam"
                        />
                        {errors.contactPerson && <p className="text-sm text-red-600 mt-1">{errors.contactPerson}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">E-mailadres *</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                            placeholder="naam@bedrijf.nl"
                          />
                        </div>
                        {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
                      </div>

                      <div>
                        <Label htmlFor="phone">Telefoonnummer</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            className="pl-10"
                            placeholder="+31 20 123 4567"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address">Adres</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="address"
                          value={formData.address}
                          onChange={(e) => handleInputChange("address", e.target.value)}
                          className="pl-10"
                          placeholder="Straatnaam en huisnummer"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="postalCode">Postcode</Label>
                        <Input
                          id="postalCode"
                          value={formData.postalCode}
                          onChange={(e) => handleInputChange("postalCode", e.target.value)}
                          placeholder="1234 AB"
                        />
                      </div>

                      <div>
                        <Label htmlFor="city">Plaats</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => handleInputChange("city", e.target.value)}
                          placeholder="Amsterdam"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Account Security */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Account Beveiliging
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="password">Wachtwoord *</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => handleInputChange("password", e.target.value)}
                            className={`pl-10 ${errors.password ? "border-red-500" : ""}`}
                            placeholder="Minimaal 8 karakters"
                          />
                        </div>
                        {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
                      </div>

                      <div>
                        <Label htmlFor="confirmPassword">Bevestig Wachtwoord *</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                            className={`pl-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
                            placeholder="Herhaal wachtwoord"
                          />
                        </div>
                        {errors.confirmPassword && (
                          <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Plan Selection */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Kies Uw Plan
                    </h3>

                    <Select value={formData.planType} onValueChange={(value) => handleInputChange("planType", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecteer een plan" />
                      </SelectTrigger>
                      <SelectContent>
                        {plans.map((plan) => (
                          <SelectItem key={plan.id} value={plan.id}>
                            {plan.name} - {plan.price} {plan.period}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="space-y-4">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="acceptTerms"
                        checked={formData.acceptTerms}
                        onCheckedChange={(checked) => handleInputChange("acceptTerms", checked as boolean)}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label htmlFor="acceptTerms" className="text-sm font-normal">
                          Ik ga akkoord met de{" "}
                          <Link href="/terms" className="text-orange-600 hover:underline">
                            algemene voorwaarden
                          </Link>
                        </Label>
                        {errors.acceptTerms && <p className="text-sm text-red-600">{errors.acceptTerms}</p>}
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="acceptPrivacy"
                        checked={formData.acceptPrivacy}
                        onCheckedChange={(checked) => handleInputChange("acceptPrivacy", checked as boolean)}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label htmlFor="acceptPrivacy" className="text-sm font-normal">
                          Ik ga akkoord met het{" "}
                          <Link href="/privacy" className="text-orange-600 hover:underline">
                            privacybeleid
                          </Link>
                        </Label>
                        {errors.acceptPrivacy && <p className="text-sm text-red-600">{errors.acceptPrivacy}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      "Account wordt aangemaakt..."
                    ) : (
                      <>
                        Start 14-Dagen Gratis Proefperiode
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>

                  <p className="text-center text-sm text-gray-600">
                    Al een account?{" "}
                    <Link href="/login" className="text-orange-600 hover:underline font-medium">
                      Log hier in
                    </Link>
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Plan Details Sidebar */}
          <div className="space-y-6">
            {/* Selected Plan Details */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Uw Geselecteerde Plan</CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const selectedPlan = plans.find((p) => p.id === formData.planType)
                  return selectedPlan ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{selectedPlan.name}</h3>
                        {selectedPlan.popular && (
                          <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">Populair</span>
                        )}
                      </div>
                      <div>
                        <span className="text-2xl font-bold text-orange-600">{selectedPlan.price}</span>
                        <span className="text-gray-600 ml-1">{selectedPlan.period}</span>
                      </div>
                      <ul className="space-y-2">
                        {selectedPlan.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null
                })()}
              </CardContent>
            </Card>

            {/* Trial Information */}
            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-green-900 mb-2">14 Dagen Gratis</h3>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>• Geen creditcard vereist</li>
                      <li>• Volledige toegang tot alle functies</li>
                      <li>• Annuleer op elk moment</li>
                      <li>• Persoonlijke onboarding</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Notice */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                Uw gegevens worden veilig opgeslagen volgens de AVG-richtlijnen. We delen nooit uw informatie met
                derden.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </div>
  )
}
