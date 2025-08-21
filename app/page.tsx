"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Shield,
  Map,
  Users,
  AlertTriangle,
  CheckCircle,
  Zap,
  Smartphone,
  BarChart3,
  ArrowRight,
  Play,
  Phone,
  Calendar,
  Check,
  X,
  Lock,
  Building,
  Eye,
  Clock,
  MapPin,
  Mail,
  Globe,
  Server,
  LogIn,
  FileText,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface PricingPlan {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  notIncluded?: string[]
  popular?: boolean
  cta: string
  href: string
}

interface Feature {
  icon: any
  title: string
  description: string
  benefits: string[]
}

interface Problem {
  icon: any
  title: string
  description: string
  impact: string
}

export default function HomePage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  // BHV Problems that organizations face
  const bhvProblems: Problem[] = [
    {
      icon: FileText,
      title: "Papieren BHV administratie",
      description: "Verloren documenten, verouderde informatie, geen overzicht",
      impact: "Compliance risico's en inefficiëntie",
    },
    {
      icon: Map,
      title: "Onduidelijke evacuatieroutes",
      description: "Statische plattegronden, geen real-time updates",
      impact: "Gevaar bij noodsituaties",
    },
    {
      icon: Clock,
      title: "Trage incident afhandeling",
      description: "Handmatige processen, geen automatisering",
      impact: "Langere responstijden",
    },
    {
      icon: BarChart3,
      title: "Geen inzicht in compliance",
      description: "Onduidelijke rapportages, geen real-time monitoring",
      impact: "Boetes en aansprakelijkheid",
    },
  ]

  const pricingPlans: PricingPlan[] = [
    {
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
      notIncluded: ["Geavanceerde analytics", "NFC integratie", "API toegang", "Priority support"],
      cta: "Start Nu",
      href: "/register?plan=starter",
    },
    {
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
        "Priority support",
        "Automatische rapportages",
        "API toegang",
        "Bezoekersregistratie",
      ],
      popular: true,
      cta: "Meest Gekozen",
      href: "/register?plan=professional",
    },
    {
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
        "24/7 Priority support",
        "On-premise deployment optie",
        "Advanced security features",
        "Compliance rapportages",
        "Training & consultancy",
      ],
      cta: "Offerte Aanvragen",
      href: "/contact?plan=enterprise",
    },
  ]

  const features: Feature[] = [
    {
      icon: Map,
      title: "Interactieve Plotkaarten",
      description: "Professionele BHV plotkaarten met 50+ veiligheidssymbolen",
      benefits: ["Drag & drop editor", "Real-time updates", "PDF export", "Mobile responsive"],
    },
    {
      icon: AlertTriangle,
      title: "Incident Management",
      description: "Complete incident tracking en rapportage in real-time",
      benefits: ["Automatische notificaties", "Foto's en documenten", "Workflow management", "Compliance rapportages"],
    },
    {
      icon: Users,
      title: "Team Coördinatie",
      description: "Beheer je BHV team en hun certificeringen",
      benefits: ["Certificaat tracking", "Training planning", "Rol toewijzing", "Aanwezigheid monitoring"],
    },
    {
      icon: Smartphone,
      title: "Mobile App",
      description: "Native iOS en Android apps voor onderweg",
      benefits: ["Offline functionaliteit", "Push notificaties", "QR code scanning", "GPS locatie"],
    },
    {
      icon: BarChart3,
      title: "Analytics & Rapportage",
      description: "Uitgebreide inzichten in je veiligheidsprestaties",
      benefits: ["Custom dashboards", "Geautomatiseerde rapporten", "Trend analyse", "KPI monitoring"],
    },
    {
      icon: Zap,
      title: "NFC Integratie",
      description: "Moderne technologie voor equipment tracking",
      benefits: ["NFC tag scanning", "Onderhoudsschema's", "Asset management", "Inspectie workflows"],
    },
  ]

  // BHV360 Benefits
  const bhvBenefits = [
    "100% digitale BHV administratie",
    "Interactieve plotkaarten met real-time status",
    "Automatische compliance rapportage",
    "Mobiele app voor alle BHV'ers",
    "Instant incident management",
  ]

  // Statistics
  const stats = [
    { number: "2024", label: "Opgericht", icon: Building },
    { number: "100%", label: "Nederlandse Ontwikkeling", icon: Globe },
    { number: "99.9%", label: "Systeem Beschikbaarheid", icon: Server },
    { number: "GDPR", label: "Compliant", icon: Lock },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
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

            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-green-600 transition-colors">
                Features
              </a>
              <a href="#problems" className="text-gray-700 hover:text-green-600 transition-colors">
                Problemen
              </a>
              <a href="#pricing" className="text-gray-700 hover:text-green-600 transition-colors">
                Prijzen
              </a>
              <a href="#contact" className="text-gray-700 hover:text-green-600 transition-colors">
                Contact
              </a>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost" className="text-gray-700 hover:text-green-600">
                  <LogIn className="w-4 h-4 mr-2" />
                  Inloggen
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-gradient-to-r from-green-500 to-blue-500 text-white hover:opacity-90">
                  30 Dagen Gratis
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 via-blue-50 to-blue-100 overflow-hidden">
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-green-100 text-green-800 border-green-200">
              🚀 Nieuw: Volledig geautomatiseerde compliance rapportage
            </Badge>

            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-gray-900">Professioneel</span>
              <br />
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                BHV Beheer
              </span>
              <br />
              <span className="text-gray-900">Gemaakt Eenvoudig</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed">
              Van papieren chaos naar digitale controle. BHV360 maakt veiligheidsmanagement eenvoudig, compliant en
              effectief voor elke organisatie.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/demo">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90 text-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Bekijk Demo
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-green-500 text-green-700 hover:bg-green-50 px-8 py-4 text-lg bg-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  30 Dagen Gratis
                </Button>
              </Link>
            </div>

            {/* BHV360 Voordelen */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 border border-green-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">BHV360 Voordelen</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bhvBenefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stats - GREEN-BLUE GRADIENT TILES */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <Card
                  key={index}
                  className="text-center shadow-lg border-0 bg-gradient-to-br from-green-50 to-blue-50 hover:from-green-100 hover:to-blue-100 transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Problems Section */}
      <section id="problems" className="py-20 px-4 sm:px-6 lg:px-8 bg-red-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Stop met
              <span className="bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                {" "}
                BHV Frustraties
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Deze problemen kosten u tijd, geld en zorgen voor compliance risico's
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {bhvProblems.map((problem, index) => {
              const IconComponent = problem.icon
              return (
                <Card
                  key={index}
                  className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 hover:-translate-y-1 bg-white"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-6 h-6 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{problem.title}</h3>
                        <p className="text-gray-600 mb-3">{problem.description}</p>
                        <div className="flex items-center space-x-2">
                          <AlertCircle className="w-4 h-4 text-red-500" />
                          <span className="text-sm font-medium text-red-600">{problem.impact}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="text-center mt-12">
            <p className="text-lg text-gray-700 mb-6">
              <strong>BHV360 lost al deze problemen op met één geïntegreerd platform</strong>
            </p>
            <Link href="/demo">
              <Button size="lg" className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
                <Eye className="w-4 h-4 mr-2" />
                Zie Hoe BHV360 Helpt
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section - GREEN-BLUE GRADIENT TILES */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Alles wat je nodig hebt voor
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                {" "}
                professionele BHV
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Van interactieve plotkaarten tot geavanceerde analytics - BHV360 biedt alle tools die je nodig hebt.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <Card
                  key={index}
                  className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 hover:-translate-y-1 bg-gradient-to-br from-green-50 to-blue-50 hover:from-green-100 hover:to-blue-100"
                >
                  <CardHeader>
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-gray-600">{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section - GREEN-BLUE GRADIENT TILES */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Transparante
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                {" "}
                prijzen
              </span>
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Kies het plan dat het beste bij jouw organisatie past. Start vandaag nog met 30 dagen gratis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`shadow-lg hover:shadow-xl transition-all duration-300 border-0 hover:-translate-y-1 relative bg-gradient-to-br from-green-50 to-blue-50 hover:from-green-100 hover:to-blue-100 ${
                  plan.popular ? "ring-2 ring-green-500 scale-105" : ""
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-500 to-blue-500 text-white">
                    Meest Gekozen
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {plan.price}
                    {plan.period !== "per maand" ? null : (
                      <span className="text-lg font-normal text-gray-600">/{plan.period}</span>
                    )}
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                    {plan.notIncluded?.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-2 opacity-50">
                        <X className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-sm text-gray-500">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={plan.href}>
                    <Button
                      className={`w-full mt-6 ${
                        plan.popular
                          ? "bg-gradient-to-r from-green-500 to-blue-500 text-white hover:opacity-90"
                          : "border-2 border-green-500 text-green-700 hover:bg-green-50"
                      }`}
                      variant={plan.popular ? "default" : "outline"}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-500 to-blue-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Klaar om te starten met modern BHV management?</h2>
          <p className="text-xl text-green-100 mb-8">
            Vervang je papieren administratie door een professioneel digitaal platform. Probeer BHV360 vandaag nog 30
            dagen gratis uit.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-white text-green-600 hover:bg-gray-50 px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Play className="w-5 h-5 mr-2" />
                30 Dagen Gratis Proberen
              </Button>
            </Link>
            <Link href="/demo">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 text-lg transition-all duration-300 bg-transparent"
              >
                <Eye className="w-5 h-5 mr-2" />
                Bekijk Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Image
                src="/images/bhv360-logo-full.png"
                alt="BHV360 Logo"
                width={360}
                height={120}
                className="h-16 w-auto mb-4 brightness-0 invert"
              />
              <p className="text-gray-400 mb-4">Professioneel BHV management platform voor Nederlandse organisaties.</p>
              <div className="flex space-x-4">
                <Badge variant="outline" className="border-gray-600 text-gray-400">
                  <Shield className="w-3 h-3 mr-1" />
                  GDPR
                </Badge>
                <Badge variant="outline" className="border-gray-600 text-gray-400">
                  <Globe className="w-3 h-3 mr-1" />
                  NL Hosting
                </Badge>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#features" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="/demo" className="hover:text-white transition-colors">
                    Demo
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-white transition-colors">
                    Prijzen
                  </a>
                </li>
                <li>
                  <span className="text-gray-500">30 dagen gratis</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/video-tutorials" className="hover:text-white transition-colors">
                    Video Tutorials
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <span className="text-gray-400">Ma-Vr 09:00-17:00</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Contact</h4>
              <div className="space-y-3 text-gray-400">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-3" />
                  <a href="tel:0334616303" className="hover:text-white transition-colors">
                    033 461 6303
                  </a>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-3" />
                  <a href="mailto:info@bhv360.nl" className="hover:text-white transition-colors">
                    info@bhv360.nl
                  </a>
                </div>
                <div className="flex items-start">
                  <MapPin className="w-4 h-4 mr-3 mt-1" />
                  <span>
                    Nederland
                    <br />
                    Professionele BHV Software
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-3" />
                  <span>Ma-Vr 09:00-17:00</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">&copy; 2024 BHV360. Alle rechten voorbehouden.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
