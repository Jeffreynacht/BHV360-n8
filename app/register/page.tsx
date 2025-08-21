"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, ArrowRight, Phone, Mail, MapPin } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"

export default function RegisterPage() {
  const searchParams = useSearchParams()
  const selectedPlan = searchParams.get("plan") || "professional"

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    employees: "",
    plan: selectedPlan,
    agreeTerms: false,
    agreeMarketing: false,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const plans = {
    starter: {
      name: "Starter",
      price: "€49",
      period: "per maand",
      description: "Perfect voor kleine bedrijven tot 50 medewerkers",
      features: [
        "Basis plotkaart editor",
        "Tot 5 BHV'ers",
        "Incident registratie",
        "Email ondersteuning",
        "Basis rapportages",
        "Mobile app toegang",
      ],
    },
    professional: {
      name: "Professional",
      price: "€149",
      period: "per maand",
      description: "Ideaal voor middelgrote bedrijven tot 200 medewerkers",
      features: [
        "Volledige plotkaart suite",
        "Onbeperkt BHV'ers",
        "Geavanceerd incident management",
        "NFC tag integratie",
        "Uitgebreide analytics",
        "Priority support (ma-vr 09:00-16:00)",
        "Automatische rapportages",
        "API toegang",
        "Bezoekersregistratie",
      ],
      popular: true,
    },
    enterprise: {
      name: "Enterprise",
      price: "Op maat",
      period: "per maand",
      description: "Voor grote organisaties met complexe behoeften",
      features: [
        "Alle Professional features",
        "White label oplossing",
        "Multi-locatie ondersteuning",
        "Dedicated account manager",
        "Custom integraties",
        "Priority support (ma-vr 09:00-16:00)",
        "On-premise deployment optie",
        "Advanced security features",
        "Compliance rapportages",
        "Training & consultancy",
      ],
    },
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Here you would normally send the data to your backend
    console.log("Form submitted:", formData)

    setIsSubmitting(false)
    // Redirect to success page or show success message
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const selectedPlanData = plans[formData.plan as keyof typeof plans]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <Link href="/">
                <Image
                  src="/images/bhv360-logo-full.png"
                  alt="BHV360 Logo"
                  width={360}
                  height={120}
                  className="h-16 w-auto cursor-pointer"
                />
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" className="text-gray-700 hover:text-green-600">
                  Terug naar Home
                </Button>
              </Link>
              <Link href="/platform">
                <Button variant="outline">Al een account? Inloggen</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Start met
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"> BHV360</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Vul je gegevens in en we nemen binnen 24 uur contact met je op voor een persoonlijke demo en onboarding.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Registration Form */}
          <div>
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-2xl">Aanmelden voor BHV360</CardTitle>
                <CardDescription>Vul je gegevens in en we starten je gratis demo binnen 24 uur.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Voornaam *</Label>
                      <Input
                        id="firstName"
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Achternaam *</Label>
                      <Input
                        id="lastName"
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email adres *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Telefoonnummer *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  {/* Company Information */}
                  <Separator />

                  <div>
                    <Label htmlFor="company">Bedrijfsnaam *</Label>
                    <Input
                      id="company"
                      type="text"
                      required
                      value={formData.company}
                      onChange={(e) => handleInputChange("company", e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="employees">Aantal medewerkers *</Label>
                    <Select value={formData.employees} onValueChange={(value) => handleInputChange("employees", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Selecteer aantal medewerkers" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10">1-10 medewerkers</SelectItem>
                        <SelectItem value="11-50">11-50 medewerkers</SelectItem>
                        <SelectItem value="51-200">51-200 medewerkers</SelectItem>
                        <SelectItem value="201-500">201-500 medewerkers</SelectItem>
                        <SelectItem value="500+">500+ medewerkers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Plan Selection */}
                  <Separator />

                  <div>
                    <Label>Gewenst plan</Label>
                    <Select value={formData.plan} onValueChange={(value) => handleInputChange("plan", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="starter">Starter - €49/maand</SelectItem>
                        <SelectItem value="professional">Professional - €149/maand</SelectItem>
                        <SelectItem value="enterprise">Enterprise - Op maat</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Terms and Conditions */}
                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="agreeTerms"
                        checked={formData.agreeTerms}
                        onCheckedChange={(checked) => handleInputChange("agreeTerms", checked as boolean)}
                        className="mt-1"
                      />
                      <Label htmlFor="agreeTerms" className="text-sm leading-5">
                        Ik ga akkoord met de{" "}
                        <Link href="/terms" className="text-green-600 hover:underline">
                          algemene voorwaarden
                        </Link>{" "}
                        en{" "}
                        <Link href="/privacy" className="text-green-600 hover:underline">
                          privacyverklaring
                        </Link>{" "}
                        van BHV360. *
                      </Label>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="agreeMarketing"
                        checked={formData.agreeMarketing}
                        onCheckedChange={(checked) => handleInputChange("agreeMarketing", checked as boolean)}
                        className="mt-1"
                      />
                      <Label htmlFor="agreeMarketing" className="text-sm leading-5">
                        Ik wil graag updates ontvangen over nieuwe features en BHV gerelateerde informatie.
                      </Label>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white hover:opacity-90 py-3 text-lg"
                    disabled={!formData.agreeTerms || isSubmitting}
                  >
                    {isSubmitting ? (
                      "Aanmelding wordt verwerkt..."
                    ) : (
                      <>
                        Start Mijn Demo
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>

                  <p className="text-sm text-gray-600 text-center">
                    We nemen binnen 24 uur contact met je op voor een persoonlijke demo.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Selected Plan Summary */}
          <div className="space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Geselecteerd Plan</CardTitle>
                  {selectedPlanData.popular && (
                    <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white">Meest Gekozen</Badge>
                  )}
                </div>
                <CardDescription>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{selectedPlanData.name}</div>
                  <div className="text-2xl font-semibold text-green-600 mb-2">
                    {selectedPlanData.price}
                    {selectedPlanData.period !== "per maand" ? null : (
                      <span className="text-lg font-normal text-gray-600">/{selectedPlanData.period}</span>
                    )}
                  </div>
                  <p className="text-gray-600">{selectedPlanData.description}</p>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Inbegrepen features:</h4>
                  <ul className="space-y-2">
                    {selectedPlanData.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* What Happens Next */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-xl">Wat gebeurt er nu?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Aanmelding verwerkt</h4>
                      <p className="text-sm text-gray-600">
                        Je aanmelding wordt direct verwerkt en je ontvangt een bevestiging per email.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Persoonlijk contact</h4>
                      <p className="text-sm text-gray-600">
                        Binnen 24 uur neemt een van onze specialisten contact met je op voor een persoonlijke demo.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Demo & Onboarding</h4>
                      <p className="text-sm text-gray-600">
                        We laten je het platform zien en helpen je met de setup voor jouw organisatie.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      4
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Start met BHV360</h4>
                      <p className="text-sm text-gray-600">
                        Je krijgt toegang tot het platform en kunt direct beginnen met het verbeteren van je BHV
                        processen.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-xl">Vragen?</CardTitle>
                <CardDescription>Neem direct contact met ons op voor meer informatie.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-green-600" />
                    <div>
                      <a href="tel:0334616303" className="font-medium text-gray-900 hover:text-green-600">
                        033 461 6303
                      </a>
                      <p className="text-sm text-gray-600">Ma-Vr 09:00-16:00</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-green-600" />
                    <div>
                      <a href="mailto:info@bhv360.nl" className="font-medium text-gray-900 hover:text-green-600">
                        info@bhv360.nl
                      </a>
                      <p className="text-sm text-gray-600">We reageren binnen 4 uur</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-green-600 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">
                        Fokkerstraat 16
                        <br />
                        3833LD Leusden
                      </p>
                      <p className="text-sm text-gray-600">Nederland</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
