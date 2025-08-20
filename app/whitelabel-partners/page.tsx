"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { BHV360Logo } from "@/components/bhv360-logo"
import {
  Users,
  CheckCircle,
  ArrowRight,
  Palette,
  Settings,
  BarChart3,
  Handshake,
  Crown,
  Zap,
  Target,
  Phone,
  Mail,
  Globe,
  DollarSign,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const partnerTiers = [
  {
    name: "Bronze Partner",
    commission: "20%",
    minClients: "5+",
    description: "Perfect voor startende partners",
    features: [
      "20% commissie op alle verkopen",
      "Basis marketing materialen",
      "Email support",
      "Maandelijkse rapportages",
      "Partner portal toegang",
    ],
    color: "bg-orange-100 text-orange-800 border-orange-200",
    popular: false,
  },
  {
    name: "Silver Partner",
    commission: "30%",
    minClients: "15+",
    description: "Voor groeiende partnerships",
    features: [
      "30% commissie op alle verkopen",
      "Uitgebreide marketing kit",
      "Priority support",
      "Wekelijkse rapportages",
      "Co-branding mogelijkheden",
      "Sales training programma",
    ],
    color: "bg-gray-100 text-gray-800 border-gray-200",
    popular: true,
  },
  {
    name: "Gold Partner",
    commission: "40%",
    minClients: "50+",
    description: "Voor premium partnerships",
    features: [
      "40% commissie op alle verkopen",
      "Volledige white-label oplossing",
      "24/7 dedicated support",
      "Real-time analytics",
      "Custom integraties",
      "Dedicated account manager",
      "Exclusieve territorium rechten",
    ],
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    popular: false,
  },
]

const successStories = [
  {
    name: "SafetyFirst Solutions",
    tier: "Gold Partner",
    clients: 127,
    revenue: "€45.000",
    growth: "+180%",
    testimonial: "BHV360's white-label oplossing heeft ons bedrijf getransformeerd. We hebben nu 127 actieve klanten.",
    logo: "/placeholder.svg?height=60&width=120",
  },
  {
    name: "VeiligWerk Nederland",
    tier: "Silver Partner",
    clients: 89,
    revenue: "€28.500",
    growth: "+145%",
    testimonial: "De partner support is uitstekend. We groeien elke maand met nieuwe klanten.",
    logo: "/placeholder.svg?height=60&width=120",
  },
  {
    name: "BHV Experts",
    tier: "Bronze Partner",
    clients: 34,
    revenue: "€12.200",
    growth: "+95%",
    testimonial: "Een geweldige manier om onze dienstverlening uit te breiden zonder technische complexiteit.",
    logo: "/placeholder.svg?height=60&width=120",
  },
]

const benefits = [
  {
    icon: DollarSign,
    title: "Hoge Commissies",
    description: "Tot 40% commissie op alle verkopen met transparante uitbetalingen",
  },
  {
    icon: Palette,
    title: "White-label Oplossing",
    description: "Volledig aanpasbare interface met jouw branding en kleuren",
  },
  {
    icon: Settings,
    title: "Technische Support",
    description: "24/7 technische ondersteuning voor jou en je klanten",
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description: "Gedetailleerde rapportages over verkopen en klantgebruik",
  },
  {
    icon: Users,
    title: "Sales Training",
    description: "Uitgebreide training en sales materialen om te helpen verkopen",
  },
  {
    icon: Target,
    title: "Marketing Support",
    description: "Professionele marketing materialen en campagne ondersteuning",
  },
]

export default function WhitelabelPartnersPage() {
  const [email, setEmail] = useState("")

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <BHV360Logo size="lg" />
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Partner Login</Button>
            </Link>
            <Button>Word Partner</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-4" variant="secondary">
            <Handshake className="h-4 w-4 mr-2" />
            Partner Programma
          </Badge>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Verdien met BHV360
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Word partner en bouw een winstgevend BHV software business. Tot 40% commissie op alle verkopen met volledige
            white-label ondersteuning.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8">
              <Crown className="mr-2 h-5 w-5" />
              Word Partner
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
              Partner Demo Bekijken
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Waarom Partner Worden?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Ontdek de voordelen van ons partner programma en hoe je kunt profiteren van de groeiende BHV markt
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <benefit.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <CardTitle className="text-xl">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{benefit.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Tiers */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Partner Niveaus</h2>
            <p className="text-gray-600">Kies het niveau dat bij jouw ambities past</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {partnerTiers.map((tier, index) => (
              <Card key={index} className={`relative ${tier.popular ? "border-blue-500 shadow-lg scale-105" : ""}`}>
                {tier.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">Meest Populair</Badge>
                )}
                <CardHeader className="text-center">
                  <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium mb-2 ${tier.color}`}>
                    {tier.name}
                  </div>
                  <div className="text-4xl font-bold text-blue-600 mb-2">{tier.commission}</div>
                  <div className="text-sm text-gray-500 mb-2">commissie per verkoop</div>
                  <div className="text-sm font-medium">Minimaal {tier.minClients} klanten</div>
                  <CardDescription className="mt-2">{tier.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" variant={tier.popular ? "default" : "outline"}>
                    Start als {tier.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Partner Success Stories</h2>
            <p className="text-gray-600">Zie hoe onze partners succesvol zijn geworden</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <img src={story.logo || "/placeholder.svg"} alt={story.name} className="h-8" />
                    <Badge variant="outline">{story.tier}</Badge>
                  </div>
                  <CardTitle className="text-lg">{story.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{story.clients}</div>
                      <div className="text-xs text-gray-500">Klanten</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{story.revenue}</div>
                      <div className="text-xs text-gray-500">Maand omzet</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{story.growth}</div>
                      <div className="text-xs text-gray-500">Groei</div>
                    </div>
                  </div>
                  <blockquote className="text-sm text-gray-600 italic">"{story.testimonial}"</blockquote>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Environment */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Partner Demo Omgeving</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Krijg toegang tot een volledig werkende demo omgeving om aan prospects te laten zien
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="mr-2 h-5 w-5 text-yellow-500" />
                  Instant Demo Setup
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">Demo klaar in 5 minuten</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">Jouw branding en logo</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">Voorbeelddata inbegrepen</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">Alle functies beschikbaar</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5 text-blue-500" />
                  White-label Configuratie
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">Custom domein instelling</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">Kleurenschema aanpassing</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">Logo en branding upload</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">Email templates aanpassen</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Klaar om Partner te Worden?</h2>
          <p className="text-xl mb-8 opacity-90">Start vandaag nog en bouw een winstgevend BHV software business</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Input
              placeholder="Je email adres"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white text-gray-900"
            />
            <Button size="lg" variant="secondary">
              Word Partner
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm opacity-75 mt-4">Geen setup kosten • 30 dagen gratis trial • Persoonlijke onboarding</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <BHV360Logo size="md" variant="white" />
              <p className="text-gray-400 mt-4">Het complete BHV partner programma voor ambitieuze ondernemers</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Partner Programma</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    Word Partner
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Partner Niveaus
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Success Stories
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Demo Aanvragen
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    Partner Support
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Documentatie
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Training
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    API Docs
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>+31 20 123 4567</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>partners@bhv360.nl</span>
                </div>
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-2" />
                  <span>www.bhv360.nl/partners</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 BHV360. Alle rechten voorbehouden.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
