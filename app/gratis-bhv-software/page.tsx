"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Check, Shield, Users, Building2, Zap, Star, ArrowRight, Mail, Phone } from "lucide-react"
import { FREE_TIER_LIMITS, PREMIUM_FEATURES } from "@/lib/freemium/free-tier-definitions"

export default function FreeBHVSoftwarePage() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate signup process
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // In productie: echte signup API call
    console.log("Signup for:", email)

    // Redirect to registration
    window.location.href = `/register?email=${encodeURIComponent(email)}&plan=free`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-100">
            🎉 100% Gratis - Geen Creditcard Vereist
          </Badge>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Gratis BHV Software voor Kleine Teams
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Start vandaag nog met professioneel BHV management. Onze gratis versie biedt alles wat je nodig hebt om te
            beginnen met veiligheidsmanagement voor maximaal 5 gebruikers.
          </p>

          {/* Signup Form */}
          <form onSubmit={handleSignup} className="max-w-md mx-auto mb-12">
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="je@bedrijf.nl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1"
              />
              <Button type="submit" disabled={isSubmitting} size="lg">
                {isSubmitting ? "Bezig..." : "Gratis Starten"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-2">Geen spam, geen verplichtingen. Altijd gratis opzegbaar.</p>
          </form>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>GDPR Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              <span>4.8/5 Sterren</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>500+ Tevreden Klanten</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Wat krijg je gratis?</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Free Features */}
            <Card className="border-green-200 shadow-lg">
              <CardHeader className="bg-green-50">
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <Zap className="h-5 w-5" />
                  Gratis Plan - €0/maand
                </CardTitle>
                <CardDescription>Perfect om te starten met BHV management</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {FREE_TIER_LIMITS.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Limieten:</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>• Maximaal 5 gebruikers</div>
                    <div>• 1 gebouw</div>
                    <div>• 10 incidenten per maand</div>
                    <div>• 10 NFC tags</div>
                    <div>• 1GB opslag</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Premium Features */}
            <Card className="border-blue-200 shadow-lg">
              <CardHeader className="bg-blue-50">
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <Star className="h-5 w-5" />
                  Premium Functies
                </CardTitle>
                <CardDescription>Upgrade wanneer je team groeit</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {PREMIUM_FEATURES.slice(0, 8).map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-blue-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                  <div className="text-sm text-gray-500">+{PREMIUM_FEATURES.length - 8} meer functies...</div>
                </div>

                <div className="mt-6">
                  <Button variant="outline" className="w-full">
                    Bekijk Alle Premium Functies
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Perfect voor</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Building2 className="h-8 w-8 text-blue-500 mb-2" />
                <CardTitle>Kleine Bedrijven</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Startups en kleine bedrijven die net beginnen met BHV management en een professionele oplossing
                  zoeken.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-green-500 mb-2" />
                <CardTitle>Kleine Teams</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Teams tot 5 personen die hun veiligheidsprocessen willen digitaliseren zonder hoge kosten.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="h-8 w-8 text-purple-500 mb-2" />
                <CardTitle>Proof of Concept</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Test onze software uitgebreid voordat je investeert in een betaald plan voor je hele organisatie.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Veelgestelde Vragen</h2>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is het echt 100% gratis?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Ja! Onze gratis versie is altijd gratis voor maximaal 5 gebruikers. Geen verborgen kosten, geen
                  tijdslimiet. Je kunt altijd upgraden als je team groeit.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Wat gebeurt er als ik meer dan 5 gebruikers nodig heb?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Dan kun je upgraden naar ons Starter plan (€9.99/gebruiker/maand) voor tot 25 gebruikers, of ons
                  Professional plan voor onbeperkte gebruikers.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Krijg ik support bij de gratis versie?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Ja! Je krijgt toegang tot onze community support en uitgebreide documentatie. Voor priority support
                  kun je upgraden naar een betaald plan.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Kan ik later upgraden zonder data te verliezen?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Absoluut! Al je data blijft behouden bij een upgrade. Je krijgt direct toegang tot alle premium
                  functies.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Klaar om te beginnen?</h2>
          <p className="text-xl mb-8 opacity-90">
            Sluit je aan bij honderden bedrijven die hun BHV management hebben gedigitaliseerd met BHV360.
          </p>

          <form onSubmit={handleSignup} className="max-w-md mx-auto mb-8">
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="je@bedrijf.nl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 bg-white text-gray-900"
              />
              <Button type="submit" disabled={isSubmitting} size="lg" variant="secondary">
                {isSubmitting ? "Bezig..." : "Gratis Starten"}
              </Button>
            </div>
          </form>

          <div className="flex items-center justify-center gap-8 text-sm opacity-75">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>support@bhv360.nl</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>085 - 130 5000</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
