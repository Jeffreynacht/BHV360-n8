"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  Users,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Clock,
  Building,
  Phone,
  Mail,
  ArrowRight,
  Star,
  Zap,
  Target,
} from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const [activeFeature, setActiveFeature] = useState(0)

  const features = [
    {
      icon: <MapPin className="h-8 w-8" />,
      title: "Interactieve Plotkaarten",
      description: "Digitale plattegronden met real-time locatie van BHV'ers en voorzieningen",
      benefits: ["Snelle evacuatie", "Overzichtelijke weergave", "Mobile-first ontwerp"],
    },
    {
      icon: <AlertTriangle className="h-8 w-8" />,
      title: "Incident Management",
      description: "Professioneel beheer van incidenten van melding tot afhandeling",
      benefits: ["Gestructureerde afhandeling", "Automatische rapportage", "Compliance tracking"],
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "BHV Beheer",
      description: "Complete administratie van BHV'ers, certificaten en roosters",
      benefits: ["Certificaat tracking", "Automatische herinneringen", "Competentie matrix"],
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Compliance Dashboard",
      description: "Real-time inzicht in compliance status en verbeterpunten",
      benefits: ["Audit-ready rapporten", "Risico monitoring", "Actieplan beheer"],
    },
  ]

  const stats = [
    { number: "500+", label: "Tevreden Klanten", icon: <Building className="h-5 w-5" /> },
    { number: "99.9%", label: "Uptime Garantie", icon: <CheckCircle className="h-5 w-5" /> },
    { number: "24/7", label: "Support Beschikbaar", icon: <Clock className="h-5 w-5" /> },
    { number: "< 2min", label: "Gemiddelde Response", icon: <Zap className="h-5 w-5" /> },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">BHV360</h1>
                <p className="text-xs text-gray-500">Professional BHV Software</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Inloggen
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Demo Bekijken
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-6 bg-blue-100 text-blue-800 border-blue-200">
            <Star className="h-3 w-3 mr-1" />
            #1 BHV Software Nederland
          </Badge>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            BHV Beheer
            <span className="block text-blue-600">Gemaakt Eenvoudig</span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Van papieren chaos naar digitale controle. BHV360 maakt veiligheidsmanagement eenvoudig, compliant en
            effectief voor elke organisatie.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/demo">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3">
                Gratis Demo Starten
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3 bg-transparent">
                <Phone className="mr-2 h-5 w-5" />
                Persoonlijke Demo
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold text-gray-900">{stat.number}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-green-100 text-green-800 border-green-200">
              <Target className="h-3 w-3 mr-1" />
              Kernfunctionaliteiten
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Alles wat je nodig hebt voor professioneel BHV beheer
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Een complete suite van tools die samenwerken om jouw veiligheidsprocessen te optimaliseren
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className={`cursor-pointer transition-all duration-300 ${
                    activeFeature === index ? "border-blue-500 shadow-lg bg-blue-50" : "hover:border-gray-300"
                  }`}
                  onClick={() => setActiveFeature(index)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-2 rounded-lg ${
                          activeFeature === index ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {feature.icon}
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base mb-3">{feature.description}</CardDescription>
                    <div className="flex flex-wrap gap-2">
                      {feature.benefits.map((benefit, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="lg:pl-8">
              <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-3 bg-blue-600 rounded-lg text-white">{features[activeFeature].icon}</div>
                    <div>
                      <CardTitle className="text-xl text-blue-900">{features[activeFeature].title}</CardTitle>
                      <CardDescription className="text-blue-700">Live Preview</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-white rounded-lg p-6 shadow-inner">
                    <div className="space-y-4">
                      <div className="h-4 bg-blue-200 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 bg-blue-100 rounded animate-pulse"></div>
                      <div className="grid grid-cols-3 gap-2 mt-6">
                        <div className="h-8 bg-green-100 rounded"></div>
                        <div className="h-8 bg-yellow-100 rounded"></div>
                        <div className="h-8 bg-blue-100 rounded"></div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <Link href="/demo">
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        Interactieve Demo
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Klaar om te starten met professioneel BHV beheer?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Sluit je aan bij honderden organisaties die hun veiligheidsprocessen hebben geoptimaliseerd met BHV360
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/demo">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                Gratis Demo Starten
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
              >
                <Mail className="mr-2 h-5 w-5" />
                Contact Opnemen
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold">BHV360</span>
              </div>
              <p className="text-gray-400 text-sm">Professionele BHV software voor moderne organisaties</p>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Product</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/features" className="hover:text-white">
                    Functionaliteiten
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-white">
                    Prijzen
                  </Link>
                </li>
                <li>
                  <Link href="/demo" className="hover:text-white">
                    Demo
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Ondersteuning</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white">
                    Hulp Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/status" className="hover:text-white">
                    Status
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Bedrijf</h3>
              <ul className="space-y-2 text-sm text-gray-400">
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

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 BHV360. Alle rechten voorbehouden.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
