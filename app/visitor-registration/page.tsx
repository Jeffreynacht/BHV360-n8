"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, UserPlus, Shield, Clock, CheckCircle, Users, Bell, MapPin, Phone } from "lucide-react"
import Link from "next/link"

export default function VisitorRegistrationDemo() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    host: "",
    purpose: "",
    duration: "",
    safetyBriefing: false,
    emergencyContact: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (step < 3) {
      setStep(step + 1)
    }
  }

  const hosts = ["Jan van der Berg - Directie", "Maria Jansen - HR", "Piet Bakker - IT", "Lisa de Vries - Marketing"]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Terug naar Home
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Bezoeker Registratie Demo</h1>
                <p className="text-sm text-gray-500">Professionele check-in met veiligheidsprotocol</p>
              </div>
            </div>
            <Badge className="bg-blue-100 text-blue-800">Demo Modus</Badge>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= stepNumber ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {step > stepNumber ? <CheckCircle className="h-4 w-4" /> : stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-24 h-1 mx-2 ${step > stepNumber ? "bg-blue-600" : "bg-gray-300"}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Registratie</span>
            <span>Veiligheid</span>
            <span>Bevestiging</span>
          </div>
        </div>

        {/* Step 1: Basic Registration */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserPlus className="h-5 w-5 mr-2" />
                Bezoeker Informatie
              </CardTitle>
              <CardDescription>Vul uw gegevens in voor een veilige en professionele ontvangst</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Volledige Naam *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Uw voor- en achternaam"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="company">Bedrijf</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Naam van uw bedrijf"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">E-mailadres *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="uw.email@bedrijf.nl"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefoonnummer *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="06-12345678"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="host">Gastheer/Gastvrouw *</Label>
                    <Select onValueChange={(value) => setFormData({ ...formData, host: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecteer uw contactpersoon" />
                      </SelectTrigger>
                      <SelectContent>
                        {hosts.map((host) => (
                          <SelectItem key={host} value={host}>
                            {host}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="duration">Verwachte duur</Label>
                    <Select onValueChange={(value) => setFormData({ ...formData, duration: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Hoe lang blijft u?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30min">30 minuten</SelectItem>
                        <SelectItem value="1hour">1 uur</SelectItem>
                        <SelectItem value="2hours">2 uur</SelectItem>
                        <SelectItem value="halfday">Halve dag</SelectItem>
                        <SelectItem value="fullday">Hele dag</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="purpose">Doel van het bezoek</Label>
                  <Textarea
                    id="purpose"
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                    placeholder="Korte beschrijving van uw bezoek..."
                    rows={3}
                  />
                </div>
                <Button type="submit" className="w-full" size="lg">
                  Volgende Stap
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Safety Briefing */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Veiligheidsprotocol
              </CardTitle>
              <CardDescription>Belangrijke veiligheidsinformatie voor uw bezoek</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Safety Information */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-3">Veiligheidsinstructies</h3>
                  <div className="space-y-2 text-sm text-blue-800">
                    <div className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Bij alarm: volg de groene evacuatieborden naar de dichtstbijzijnde uitgang</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Verzamelplaats: parkeerplaats aan de voorzijde van het gebouw</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>BHV'ers zijn herkenbaar aan hun gele hesjes</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>EHBO post bevindt zich op de begane grond bij de receptie</span>
                    </div>
                  </div>
                </div>

                {/* Emergency Contacts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <h4 className="font-semibold text-red-900 mb-2">Noodgevallen</h4>
                    <div className="space-y-1 text-sm text-red-800">
                      <div className="flex items-center">
                        <Phone className="h-3 w-3 mr-2" />
                        <span>Brandweer/Ambulance: 112</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-3 w-3 mr-2" />
                        <span>BHV Coördinator: 06-12345678</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-900 mb-2">Uw Gastheer</h4>
                    <div className="space-y-1 text-sm text-green-800">
                      <div className="flex items-center">
                        <Users className="h-3 w-3 mr-2" />
                        <span>{formData.host || "Nog niet geselecteerd"}</span>
                      </div>
                      <div className="flex items-center">
                        <Bell className="h-3 w-3 mr-2" />
                        <span>Wordt automatisch geïnformeerd</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Confirmation */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="safety"
                      checked={formData.safetyBriefing}
                      onCheckedChange={(checked) => setFormData({ ...formData, safetyBriefing: checked as boolean })}
                    />
                    <Label htmlFor="safety" className="text-sm">
                      Ik heb de veiligheidsinstructies gelezen en begrepen *
                    </Label>
                  </div>
                  <div>
                    <Label htmlFor="emergency">Noodcontact (optioneel)</Label>
                    <Input
                      id="emergency"
                      value={formData.emergencyContact}
                      onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                      placeholder="Naam en telefoonnummer van noodcontact"
                    />
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                    Vorige
                  </Button>
                  <Button onClick={() => setStep(3)} className="flex-1" disabled={!formData.safetyBriefing}>
                    Registratie Voltooien
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-green-600">
                <CheckCircle className="h-5 w-5 mr-2" />
                Registratie Voltooid
              </CardTitle>
              <CardDescription>Welkom! Uw bezoek is geregistreerd en uw gastheer is geïnformeerd.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Visitor Badge */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Bezoeker Badge</h3>
                      <p className="text-blue-100">Draag deze zichtbaar tijdens uw bezoek</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">#V001</div>
                      <div className="text-sm text-blue-100">Badge nummer</div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-blue-400">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-blue-100">Bezoeker</div>
                        <div className="font-semibold">{formData.name}</div>
                      </div>
                      <div>
                        <div className="text-blue-100">Gastheer</div>
                        <div className="font-semibold">{formData.host}</div>
                      </div>
                      <div>
                        <div className="text-blue-100">Datum</div>
                        <div className="font-semibold">{new Date().toLocaleDateString("nl-NL")}</div>
                      </div>
                      <div>
                        <div className="text-blue-100">Tijd</div>
                        <div className="font-semibold">
                          {new Date().toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Next Steps */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Volgende Stappen</h4>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span>Uw gastheer {formData.host?.split(" - ")[0]} is geïnformeerd</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span>U bent toegevoegd aan de evacuatielijst</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-blue-500 mr-2" />
                      <span>Verwachte aankomst gastheer: 2-3 minuten</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                      <span>Wachtruimte: receptie begane grond</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-4">
                  <Button className="flex-1">
                    <Phone className="h-4 w-4 mr-2" />
                    Contact Gastheer
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    Badge Printen
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Demo CTA */}
        <Card className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Professionele bezoeker ervaring!</h3>
              <p className="text-gray-600 mb-4">
                BHV360 zorgt voor een veilige en professionele ontvangst van al uw bezoekers. Automatische notificaties,
                veiligheidsprotocol en evacuatielijsten.
              </p>
              <div className="flex justify-center space-x-4">
                <Link href="/login">
                  <Button size="lg">Start Gratis Trial</Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" size="lg">
                    Meer Demo's
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
