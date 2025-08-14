"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Shield,
  Users,
  Building2,
  Star,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Heart,
  FileText,
  Globe,
  BarChart3,
  UserCheck,
  Map,
  Eye,
  Play,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Inline BHV360 Logo Component
const BHV360Logo = ({ className = "h-8 w-auto" }: { className?: string }) => (
  <div className="flex items-center space-x-2">
    <Image
      src="/images/bhv360-logo-full.png"
      alt="BHV360 Logo"
      width={120}
      height={32}
      className={className}
      onError={(e) => {
        const target = e.target as HTMLImageElement
        target.style.display = "none"
        const nextSibling = target.nextElementSibling as HTMLElement
        if (nextSibling) {
          nextSibling.classList.remove("hidden")
        }
      }}
    />
    <div className="hidden">
      <div className="flex items-center space-x-1">
        <Shield className="h-6 w-6 text-red-600" />
        <span className="text-xl font-bold text-gray-900">BHV360</span>
      </div>
    </div>
  </div>
)

export default function HomePage() {
  const [currentFeature, setCurrentFeature] = useState(0)

  const features = [
    {
      title: "BHV Management",
      description: "Complete BHV organisatie en coördinatie met real-time status updates",
      icon: Users,
      action: "Bekijk live BHV status dashboard",
      href: "/bhv-aanwezigheid",
    },
    {
      title: "Interactieve Plotkaarten",
      description: "Digitale veiligheidsplattegronden met drag & drop editor",
      icon: Map,
      action: "Probeer de plotkaart editor",
      href: "/plotkaart",
    },
    {
      title: "Incident Management",
      description: "Snelle registratie en automatische escalatie van incidenten",
      icon: AlertTriangle,
      action: "Simuleer een noodmelding",
      href: "/incidenten",
    },
    {
      title: "Gebruikersbeheer",
      description: "Geavanceerd rollenbeleid en certificering tracking",
      icon: UserCheck,
      action: "Bekijk gebruikersrollen",
      href: "/beheer/gebruikers",
    },
    {
      title: "Multi-locatie Support",
      description: "Centraal beheer van meerdere gebouwen en vestigingen",
      icon: Building2,
      action: "Schakel tussen locaties",
      href: "/site-map",
    },
    {
      title: "EHBO & AED Monitoring",
      description: "Automatische tracking van voorraad en onderhoudsschema's",
      icon: Heart,
      action: "Bekijk voorraad status",
      href: "/ehbo-voorraad",
    },
    {
      title: "Analytics",
      description: "Uitgebreide rapportages en inzichten",
      icon: BarChart3,
      action: "Bekijk rapportages",
      href: "/beheer/rapportages",
    },
  ]

  const testimonials = [
    {
      quote: "BHV360 heeft onze veiligheidsprocedures volledig getransformeerd. De real-time inzichten zijn onmisbaar.",
      name: "Jeffrey Nachtegaal",
      role: "BHV Coördinator",
      company: "Provincie Noord-Brabant",
    },
    {
      quote: "Eindelijk een platform dat alle aspecten van BHV management integreert. Zeer gebruiksvriendelijk!",
      name: "Maria van der Berg",
      role: "Facility Manager",
      company: "TechCorp Nederland",
    },
    {
      quote: "De automatische rapportages besparen ons uren werk per week. Absolute aanrader!",
      name: "Pieter Janssen",
      role: "Veiligheidsadviseur",
      company: "SafetyFirst B.V.",
    },
  ]

  const pricingPlans = [
    {
      name: "Starter",
      price: "€49",
      period: "/maand",
      description: "Perfect voor kleine organisaties",
      features: [
        "Tot 50 gebruikers",
        "Basis plotkaarten",
        "Incident registratie",
        "Email ondersteuning",
        "Standaard rapportages",
      ],
      popular: false,
    },
    {
      name: "Professional",
      price: "€149",
      period: "/maand",
      description: "Ideaal voor middelgrote bedrijven",
      features: [
        "Tot 250 gebruikers",
        "Geavanceerde plotkaarten",
        "Real-time monitoring",
        "Telefoon ondersteuning",
        "Custom rapportages",
        "API integraties",
        "Multi-locatie support",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Op maat",
      period: "",
      description: "Voor grote organisaties",
      features: [
        "Onbeperkt gebruikers",
        "White-label oplossing",
        "Dedicated support",
        "Custom ontwikkeling",
        "SLA garanties",
        "On-premise optie",
        "Training & consultancy",
      ],
      popular: false,
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [features.length])

  const currentFeatureData = features[currentFeature]
  const FeatureIcon = currentFeatureData.icon

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <BHV360Logo className="h-8 w-auto" />
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/demo/overview" className="text-gray-600 hover:text-gray-900">
                Live Demo
              </Link>
              <Link href="/login" className="text-gray-600 hover:text-gray-900">
                Inloggen
              </Link>
              <Link href="#pricing" className="text-gray-600 hover:text-gray-900">
                Prijzen
              </Link>
              <Link href="/help" className="text-gray-600 hover:text-gray-900">
                Support
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Button variant="outline" asChild>
                <Link href="/demo/overview">
                  <Play className="h-4 w-4 mr-2" />
                  Bekijk Demo
                </Link>
              </Button>
              <Button asChild>
                <Link href="/dashboard">Start Gratis Trial</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 via-white to-red-50">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            {/* New Feature Badge */}
            <Badge className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2">
              <Sparkles className="h-4 w-4 mr-2" />🚀 Nieuw: AI-powered incident detectie
            </Badge>

            <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
              De toekomst van{" "}
              <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                BHV Management
              </span>{" "}
              is hier
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
              Transformeer uw veiligheidsorganisatie met het meest geavanceerde BHV platform van Nederland. Real-time
              monitoring, intelligente rapportages en naadloze integratie in één krachtige oplossing.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="bg-red-600 hover:bg-red-700 text-lg px-8 py-4" asChild>
                <Link href="/demo/overview">
                  <Eye className="mr-2 h-5 w-5" />
                  Bekijk Live Demo
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 bg-transparent" asChild>
                <Link href="/dashboard">
                  <ArrowRight className="mr-2 h-5 w-5" />
                  Start Gratis Trial
                </Link>
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center items-center gap-6 mb-16">
              <Badge variant="outline" className="px-4 py-2 bg-white">
                <Shield className="h-4 w-4 mr-2" />
                ISO 27001 Compliant
              </Badge>
              <Badge variant="outline" className="px-4 py-2 bg-white">
                <FileText className="h-4 w-4 mr-2" />
                AVG Compliant
              </Badge>
              <Badge variant="outline" className="px-4 py-2 bg-white">
                <Globe className="h-4 w-4 mr-2" />
                Nederlandse Support
              </Badge>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
                <div className="text-gray-600 text-sm">
                  Actieve Organisaties
                  <br />
                  <span className="text-xs text-gray-500">Vertrouwen op BHV360</span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">10,000+</div>
                <div className="text-gray-600 text-sm">
                  BHV'ers Beheerd
                  <br />
                  <span className="text-xs text-gray-500">Gecertificeerde professionals</span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">25,000+</div>
                <div className="text-gray-600 text-sm">
                  Incidenten Afgehandeld
                  <br />
                  <span className="text-xs text-gray-500">Succesvol geregistreerd</span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-red-600 mb-2">99.9%</div>
                <div className="text-gray-600 text-sm">
                  Uptime Garantie
                  <br />
                  <span className="text-xs text-gray-500">Betrouwbare service</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Alles wat u nodig heeft</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Een complete, geïntegreerde oplossing die alle aspecten van BHV management samenbrengt in één intuïtief
              platform.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Feature Showcase */}
              <div className="order-2 lg:order-1">
                <Card className="overflow-hidden shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <FeatureIcon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-white">{currentFeatureData.title}</CardTitle>
                        <CardDescription className="text-blue-100">{currentFeatureData.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="bg-gray-50 rounded-lg h-48 flex items-center justify-center mb-6">
                      <div className="text-center">
                        <FeatureIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-4">{currentFeatureData.title} Demo</p>
                        <Button asChild>
                          <Link href={currentFeatureData.href}>{currentFeatureData.action}</Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Feature List */}
              <div className="order-1 lg:order-2 space-y-4">
                {features.map((feature, index) => {
                  const Icon = feature.icon
                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-lg cursor-pointer transition-all ${
                        index === currentFeature
                          ? "bg-blue-50 border-l-4 border-blue-600"
                          : "hover:bg-gray-50 border-l-4 border-transparent"
                      }`}
                      onClick={() => setCurrentFeature(index)}
                    >
                      <div className="flex items-start space-x-4">
                        <div
                          className={`p-2 rounded-lg ${
                            index === currentFeature ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                          <p className="text-gray-600 text-sm">{feature.description}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Wat onze klanten zeggen</h2>
            <p className="text-xl text-gray-600">Ontdek waarom organisaties kiezen voor BHV360</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="text-gray-700 mb-6 italic">"{testimonial.quote}"</blockquote>
                  <div className="border-t pt-4">
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                    <div className="text-sm text-blue-600">{testimonial.company}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Transparante prijzen</h2>
            <p className="text-xl text-gray-600">Kies het plan dat perfect past bij uw organisatie</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? "ring-2 ring-blue-500 shadow-xl" : "shadow-lg"}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 px-4 py-1">
                    Meest Populair
                  </Badge>
                )}
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>
                  <CardDescription className="mt-2">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-6">
                    <Button
                      className={`w-full ${plan.popular ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                      variant={plan.popular ? "default" : "outline"}
                      asChild
                    >
                      <Link href={plan.name === "Enterprise" ? "/contact" : "/dashboard"}>
                        {plan.name === "Enterprise" ? "Contact Opnemen" : "Start Gratis Trial"}
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-4">Klaar voor de volgende stap?</h2>
            <p className="text-xl mb-8 text-blue-100">
              Sluit u aan bij honderden organisaties die hun veiligheid hebben getransformeerd met BHV360. Start vandaag
              nog met een gratis 30-dagen trial.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" asChild>
                <Link href="/dashboard">
                  <ArrowRight className="mr-2 h-5 w-5" />
                  Start Gratis Trial
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 bg-transparent"
                asChild
              >
                <Link href="/demo/overview">
                  <Eye className="mr-2 h-5 w-5" />
                  Bekijk Demo
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <BHV360Logo className="h-8 w-auto mb-4 brightness-0 invert" />
              <p className="text-gray-400 mb-6 max-w-md">
                Het meest geavanceerde BHV management platform van Nederland. Ontwikkeld door veiligheidsprofessionals,
                voor veiligheidsprofessionals.
              </p>
              <div className="flex space-x-4 mb-6">
                <Badge variant="outline" className="text-gray-300 border-gray-600">
                  <Shield className="h-3 w-3 mr-1" />
                  ISO 27001 Compliant
                </Badge>
                <Badge variant="outline" className="text-gray-300 border-gray-600">
                  <FileText className="h-3 w-3 mr-1" />
                  AVG Compliant
                </Badge>
                <Badge variant="outline" className="text-gray-300 border-gray-600">
                  <Globe className="h-3 w-3 mr-1" />
                  Made in NL
                </Badge>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/demo/overview" className="hover:text-white">
                    Live Demo
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-white">
                    Inloggen
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-white">
                    Prijzen
                  </Link>
                </li>
                <li>
                  <Link href="/integrations" className="hover:text-white">
                    API Documentatie
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white">
                    Helpcentrum
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/video-tutorials" className="hover:text-white">
                    Training
                  </Link>
                </li>
                <li>
                  <Link href="/system-health" className="hover:text-white">
                    Status Pagina
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <Separator className="my-8 bg-gray-700" />

          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2024 BHV360. Alle rechten voorbehouden.</p>
            <div className="flex space-x-6 text-sm text-gray-400 mt-4 md:mt-0">
              <Link href="/privacy" className="hover:text-white">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-white">
                Voorwaarden
              </Link>
              <Link href="/cookies" className="hover:text-white">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
