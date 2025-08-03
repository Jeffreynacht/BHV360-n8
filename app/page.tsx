"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  Users,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Star,
  Play,
  Building2,
  Heart,
  Phone,
  Mail,
  Clock,
  Award,
  Lock,
  Headphones,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  const features = [
    {
      icon: MapPin,
      title: "Interactieve Plotkaarten",
      description: "Maak en beheer professionele veiligheidsplattegronden met drag-and-drop functionaliteit.",
      color: "text-blue-600",
    },
    {
      icon: Users,
      title: "BHV Team Beheer",
      description: "Organiseer je BHV team, beheer certificeringen en plan roosters efficiënt.",
      color: "text-green-600",
    },
    {
      icon: AlertTriangle,
      title: "Incident Management",
      description: "Registreer, volg en analyseer incidenten met geautomatiseerde rapportage.",
      color: "text-orange-600",
    },
    {
      icon: Heart,
      title: "EHBO & AED Monitoring",
      description: "Houd EHBO voorraad en AED status bij met automatische herinneringen.",
      color: "text-red-600",
    },
    {
      icon: Building2,
      title: "Multi-locatie Support",
      description: "Beheer meerdere locaties vanuit één centraal dashboard.",
      color: "text-purple-600",
    },
    {
      icon: Shield,
      title: "Compliance Tracking",
      description: "Blijf compliant met Nederlandse BHV wetgeving en rapportage eisen.",
      color: "text-indigo-600",
    },
  ]

  const testimonials = [
    {
      name: "Jan van der Berg",
      role: "Facility Manager",
      company: "TechCorp Nederland",
      content: "BHV360 heeft onze veiligheidsprocedures volledig getransformeerd. De plotkaarten zijn kristalhelder.",
      rating: 5,
    },
    {
      name: "Marie Janssen",
      role: "BHV Coördinator",
      company: "Zorggroep Midden",
      content: "Eindelijk een systeem dat echt werkt voor Nederlandse BHV teams. Intuïtief en compleet.",
      rating: 5,
    },
    {
      name: "Piet de Vries",
      role: "Veiligheidsmanager",
      company: "Industriepark West",
      content: "De incident tracking en rapportage bespaart ons uren werk per week. Zeer aan te bevelen.",
      rating: 5,
    },
  ]

  const trustBadges = [
    {
      icon: Lock,
      title: "ISO 27001 Compliant",
      description: "Voldoet aan internationale beveiligingsstandaarden",
    },
    {
      icon: Shield,
      title: "AVG Compliant",
      description: "Volledig conform Europese privacywetgeving",
    },
    {
      icon: Headphones,
      title: "Nederlandse Support",
      description: "Professionele ondersteuning in het Nederlands",
    },
    {
      icon: Award,
      title: "Nederlandse Wetgeving",
      description: "Speciaal ontwikkeld voor Nederlandse BHV eisen",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Image
                src="/images/bhv360-logo.png"
                alt="BHV360 Logo"
                width={40}
                height={40}
                className="rounded-lg shadow-sm"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">BHV360</h1>
                <p className="text-xs text-gray-600">Professional Safety Management</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-gray-600 hover:text-gray-900">
                Functies
              </Link>
              <Link href="#pricing" className="text-gray-600 hover:text-gray-900">
                Prijzen
              </Link>
              <Link href="/demo/overview" className="text-gray-600 hover:text-gray-900">
                Demo
              </Link>
              <Link href="#contact" className="text-gray-600 hover:text-gray-900">
                Contact
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              <Link href="/demo/overview">
                <Button variant="outline">
                  <Play className="mr-2 h-4 w-4" />
                  Demo
                </Button>
              </Link>
              <Link href="/login">
                <Button>Inloggen</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4">
              🚀 Nieuw: AI-gestuurde incident analyse
            </Badge>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Professioneel{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">
                BHV Management
              </span>{" "}
              voor Nederlandse Bedrijven
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Beheer je BHV team, plotkaarten, incidenten en compliance vanuit één krachtig platform. Speciaal
              ontwikkeld voor Nederlandse veiligheidseisen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/demo/overview">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Play className="mr-2 h-5 w-5" />
                  Start Gratis Demo
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline">
                  <Shield className="mr-2 h-5 w-5" />
                  Direct Inloggen
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-white/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustBadges.map((badge, index) => {
              const IconComponent = badge.icon
              return (
                <div key={index} className="text-center">
                  <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                    <IconComponent className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">{badge.title}</h3>
                  <p className="text-xs text-gray-600 mt-1">{badge.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Alles wat je nodig hebt voor BHV Management</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Van plotkaarten tot incident tracking - BHV360 biedt alle tools voor professioneel veiligheidsbeheer.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow border-0 shadow-md">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-50 rounded-lg">
                        <IconComponent className={`h-6 w-6 ${feature.color}`} />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Probeer BHV360 Gratis</h2>
          <p className="text-xl mb-8 opacity-90">
            Ontdek alle functies in onze interactieve demo. Geen registratie vereist - begin direct met verkennen!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/demo/overview">
              <Button size="lg" variant="secondary">
                <Play className="mr-2 h-5 w-5" />
                Start Interactieve Demo
              </Button>
            </Link>
            <Link href="/video-tutorials">
              <Button
                size="lg"
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-blue-600 bg-transparent"
              >
                <Play className="mr-2 h-5 w-5" />
                Bekijk Video Tutorials
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Wat onze klanten zeggen</h2>
            <p className="text-xl text-gray-600">Ontdek waarom Nederlandse bedrijven kiezen voor BHV360</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">
                      {testimonial.role} bij {testimonial.company}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Transparante Prijzen</h2>
            <p className="text-xl text-gray-600">Kies het plan dat past bij jouw organisatie</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Starter</CardTitle>
                <CardDescription>Perfect voor kleine teams</CardDescription>
                <div className="text-3xl font-bold text-gray-900">
                  €49<span className="text-lg font-normal text-gray-600">/maand</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Tot 25 gebruikers
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Basis plotkaarten
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Incident registratie
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Email support
                  </li>
                </ul>
                <Button className="w-full mt-6">Start Gratis Trial</Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-500 shadow-xl relative">
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">Populair</Badge>
              <CardHeader>
                <CardTitle className="text-xl">Professional</CardTitle>
                <CardDescription>Voor groeiende organisaties</CardDescription>
                <div className="text-3xl font-bold text-gray-900">
                  €99<span className="text-lg font-normal text-gray-600">/maand</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Tot 100 gebruikers
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Geavanceerde plotkaarten
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Volledige rapportage
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Nederlandse support
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    API toegang
                  </li>
                </ul>
                <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700">Start Gratis Trial</Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Enterprise</CardTitle>
                <CardDescription>Voor grote organisaties</CardDescription>
                <div className="text-3xl font-bold text-gray-900">
                  Op maat<span className="text-lg font-normal text-gray-600"></span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Onbeperkt gebruikers
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    White-label oplossing
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Dedicated support
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Custom integraties
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    SLA garantie
                  </li>
                </ul>
                <Button variant="outline" className="w-full mt-6 bg-transparent">
                  Neem Contact Op
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Neem Contact Op</h2>
            <p className="text-xl text-gray-600">
              Vragen over BHV360? Ons Nederlandse support team helpt je graag verder.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="h-5 w-5 mr-2 text-blue-600" />
                  Telefonisch Contact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Bel ons voor directe ondersteuning of een persoonlijke demonstratie.
                </p>
                <p className="font-semibold text-lg">+31 (0)20 123 4567</p>
                <p className="text-sm text-gray-600 mt-2">
                  <Clock className="h-4 w-4 inline mr-1" />
                  Ma-Vr: 09:00 - 17:00
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-blue-600" />
                  Email Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Stuur ons een email en we reageren binnen 24 uur.</p>
                <p className="font-semibold text-lg">support@bhv360.nl</p>
                <p className="text-sm text-gray-600 mt-2">Voor technische vragen en ondersteuning</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Image src="/images/bhv360-logo.png" alt="BHV360 Logo" width={32} height={32} className="rounded" />
                <span className="text-xl font-bold">BHV360</span>
              </div>
              <p className="text-gray-400">
                Professioneel BHV management platform voor Nederlandse bedrijven. Veiligheid voorop, technologie als
                partner.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#features" className="hover:text-white">
                    Functies
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-white">
                    Prijzen
                  </Link>
                </li>
                <li>
                  <Link href="/demo/overview" className="hover:text-white">
                    Demo
                  </Link>
                </li>
                <li>
                  <Link href="/video-tutorials" className="hover:text-white">
                    Tutorials
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#contact" className="hover:text-white">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/docs" className="hover:text-white">
                    Documentatie
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Bedrijf</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white">
                    Over Ons
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white">
                    Voorwaarden
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2024 BHV360. Alle rechten voorbehouden.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
