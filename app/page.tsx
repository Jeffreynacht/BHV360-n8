"use client"

import { useState, useEffect } from "react"
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
  QrCode,
  Target,
  Gauge,
  Clock,
  MapPin,
  Mail,
  Globe,
  Server,
  LogIn,
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

interface Demo {
  title: string
  description: string
  icon: any
  href: string
  image: string
  category: string
}

export default function HomePage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

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
        "Priority support (ma-vr 09:00-16:00)",
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
        "Priority support (ma-vr 09:00-16:00)",
        "On-premise deployment optie",
        "Advanced security features",
        "Compliance rapportages",
        "Training & consultancy",
      ],
      cta: "Offerte Aanvragen",
      href: "/contact?plan=enterprise",
    },
  ]

  // Alleen echte testimonials - voorlopig leeg tot we echte klanten hebben
  const testimonials = [
    {
      name: "Demo Gebruiker",
      company: "Test Organisatie",
      role: "BHV Coördinator",
      content: "We testen momenteel BHV360 en zijn onder de indruk van de gebruiksvriendelijkheid van het platform.",
      rating: 5,
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

  // 6 verschillende demo's
  const demos: Demo[] = [
    {
      title: "Plotkaart Editor Demo",
      description: "Bekijk hoe je interactieve BHV plotkaarten maakt met onze drag-and-drop editor",
      icon: Map,
      href: "/demo/plotkaart-editor",
      image: "/placeholder.svg?height=200&width=300&text=Plotkaart+Editor",
      category: "Core Feature",
    },
    {
      title: "Incident Management Demo",
      description: "Ervaar real-time incident tracking en automatische escalatie procedures",
      icon: AlertTriangle,
      href: "/demo/incident-simulator",
      image: "/placeholder.svg?height=200&width=300&text=Incident+Management",
      category: "Safety",
    },
    {
      title: "BHV Team Dashboard",
      description: "Zie hoe je je BHV team coördineert en hun status monitort",
      icon: Shield,
      href: "/demo/bhv-status",
      image: "/placeholder.svg?height=200&width=300&text=BHV+Dashboard",
      category: "Team Management",
    },
    {
      title: "Mobile App Experience",
      description: "Test de volledige functionaliteit van onze native mobile applicatie",
      icon: Smartphone,
      href: "/mobile-app",
      image: "/placeholder.svg?height=200&width=300&text=Mobile+App",
      category: "Mobile",
    },
    {
      title: "NFC Scanner Demo",
      description: "Probeer onze NFC tag scanning voor equipment verificatie",
      icon: QrCode,
      href: "/nfc-scan",
      image: "/placeholder.svg?height=200&width=300&text=NFC+Scanner",
      category: "Technology",
    },
    {
      title: "Analytics Dashboard",
      description: "Ontdek uitgebreide rapportages en real-time veiligheidsanalytics",
      icon: BarChart3,
      href: "/demo/overview",
      image: "/placeholder.svg?height=200&width=300&text=Analytics",
      category: "Insights",
    },
  ]

  // Realistische statistieken - alleen wat we kunnen waarmaken
  const stats = [
    { number: "2024", label: "Opgericht", icon: Building },
    { number: "100%", label: "Nederlandse Ontwikkeling", icon: Globe },
    { number: "99.9%", label: "Systeem Beschikbaarheid", icon: Server },
    { number: "GDPR", label: "Compliant", icon: Lock },
  ]

  // Voordelen t.o.v. andere oplossingen
  const advantages = [
    {
      icon: Target,
      title: "Specifiek voor Nederlandse BHV",
      description:
        "Ontwikkeld volgens Nederlandse BHV wetgeving en best practices, niet een generieke internationale oplossing.",
    },
    {
      icon: Gauge,
      title: "Eenvoudiger dan Excel/Word",
      description: "Geen complexe spreadsheets meer. Alles geïntegreerd in één gebruiksvriendelijk platform.",
    },
    {
      icon: Smartphone,
      title: "Mobile-First Design",
      description: "Werkt perfect op alle apparaten, in tegenstelling tot desktop-only oplossingen.",
    },
    {
      icon: Zap,
      title: "Real-time Updates",
      description: "Directe synchronisatie tussen alle gebruikers, geen verouderde informatie meer.",
    },
  ]

  // Volledige functielijst
  const allFeatures = [
    "Interactieve plotkaart editor met 50+ veiligheidssymbolen",
    "Drag & drop interface voor eenvoudig gebruik",
    "Real-time incident registratie en tracking",
    "Automatische notificaties via email en SMS",
    "BHV team beheer en certificaat tracking",
    "Mobile app voor iOS en Android",
    "NFC tag integratie voor equipment scanning",
    "Uitgebreide rapportage en analytics",
    "Bezoekersregistratie systeem",
    "Evacuatie procedures en checklists",
    "Foto's en documenten bij incidenten",
    "GPS locatie tracking",
    "Offline functionaliteit",
    "Multi-locatie ondersteuning",
    "API voor integraties",
    "White-label oplossing (Enterprise)",
    "GDPR compliant data verwerking",
    "Nederlandse hosting en support",
    "Automatische backups",
    "Role-based access control",
    "Training module integratie",
    "Inspectie workflows",
    "Asset management",
    "Custom dashboards",
    "PDF export functionaliteit",
  ]

  // Compliance - alleen wat waar is
  const complianceItems = [
    { name: "GDPR", description: "Algemene Verordening Gegevensbescherming", status: "Voldoet aan richtlijnen" },
    { name: "AVG", description: "Nederlandse implementatie van GDPR", status: "Voldoet aan richtlijnen" },
    { name: "Nederlandse Hosting", description: "Data blijft binnen Nederland", status: "Gegarandeerd" },
    { name: "SSL Encryptie", description: "Veilige data overdracht", status: "Standaard" },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [testimonials.length])

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
              <a href="#demos" className="text-gray-700 hover:text-green-600 transition-colors">
                Demo's
              </a>
              <a href="#pricing" className="text-gray-700 hover:text-green-600 transition-colors">
                Prijzen
              </a>
              <a href="#contact" className="text-gray-700 hover:text-green-600 transition-colors">
                Contact
              </a>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/platform">
                <Button variant="ghost" className="text-gray-700 hover:text-green-600">
                  <LogIn className="w-4 h-4 mr-2" />
                  Inloggen
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-gradient-to-r from-green-500 to-blue-500 text-white hover:opacity-90">
                  Gratis Proberen
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
              🚀 Nieuw: NFC integratie nu beschikbaar
            </Badge>

            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Moderne BHV
              </span>
              <br />
              <span className="text-gray-900">Management Software</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed">
              Vervang je Excel sheets en Word documenten door een professioneel BHV platform. Interactieve plotkaarten,
              incident management en team coördinatie in één systeem.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90 text-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Gratis Proberen
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="#demos">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-green-500 text-green-700 hover:bg-green-50 px-8 py-4 text-lg bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Eye className="w-5 h-5 mr-2" />
                  Bekijk Demo's
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Nederlandse ontwikkeling</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>GDPR compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Nederlandse support</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Data blijft in Nederland</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <Card key={index} className="text-center shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <IconComponent className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Compliance Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Veilig en
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                {" "}
                Betrouwbaar
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              BHV360 voldoet aan alle relevante Nederlandse en Europese richtlijnen voor gegevensbescherming en
              veiligheid.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {complianceItems.map((item, index) => (
              <Card key={index} className="text-center shadow-lg border-0">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    <CheckCircle className="w-12 h-12 text-green-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                  <Badge variant="outline" className="text-green-700 border-green-300">
                    {item.status}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Waarom BHV360 beter is dan
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                {" "}
                Excel en Word
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stap over van verouderde spreadsheets en documenten naar een moderne, geïntegreerde oplossing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {advantages.map((advantage, index) => {
              const IconComponent = advantage.icon
              return (
                <Card
                  key={index}
                  className="text-center shadow-lg hover:shadow-xl transition-all duration-300 border-0 hover:-translate-y-1"
                >
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{advantage.title}</h3>
                    <p className="text-sm text-gray-600">{advantage.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demos" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Probeer onze
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                {" "}
                6 interactieve demo's
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ervaar zelf hoe BHV360 jouw veiligheidsprocedures kan transformeren. Elke demo toont een ander aspect van
              ons platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {demos.map((demo, index) => {
              const IconComponent = demo.icon
              return (
                <Link key={index} href={demo.href}>
                  <Card className="shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group border-0 hover:-translate-y-1">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <Image
                        src={demo.image || "/placeholder.svg"}
                        alt={demo.title}
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-white/90 text-gray-700">{demo.category}</Badge>
                      </div>
                      <div className="absolute top-4 right-4">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{demo.title}</h3>
                      <p className="text-gray-600 mb-4">{demo.description}</p>
                      <div className="flex items-center text-green-600 font-medium">
                        <Play className="w-4 h-4 mr-2" />
                        Start Demo
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Wil je een persoonlijke demo met jouw specifieke use case?</p>
            <Link href="/contact">
              <Button size="lg" variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                Plan Persoonlijke Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <Card
                  key={index}
                  className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 hover:-translate-y-1"
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

          {/* Complete Feature List */}
          <Card className="shadow-lg border-0">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Volledige Functielijst</CardTitle>
              <CardDescription>Alle features die BHV360 te bieden heeft</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {allFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
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
              Kies het plan dat het beste bij jouw organisatie past. Start vandaag nog met een gratis demo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`shadow-lg hover:shadow-xl transition-all duration-300 border-0 hover:-translate-y-1 relative ${
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

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Heb je vragen over onze prijzen of wil je een custom oplossing?</p>
            <Link href="/contact">
              <Button variant="outline" size="lg">
                <Phone className="w-4 h-4 mr-2" />
                Neem Contact Op
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-500 to-blue-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Klaar om te starten met modern BHV management?</h2>
          <p className="text-xl text-green-100 mb-8">
            Vervang je Excel sheets en Word documenten door een professioneel platform. Probeer BHV360 vandaag nog
            gratis uit.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-white text-green-600 hover:bg-gray-50 px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Play className="w-5 h-5 mr-2" />
                Gratis Proberen
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 text-lg transition-all duration-300 bg-transparent"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Plan Demo
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
              <p className="text-gray-400 mb-4">Modern BHV management platform voor Nederlandse organisaties.</p>
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
                  <a href="#demos" className="hover:text-white transition-colors">
                    Demo's
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-white transition-colors">
                    Prijzen
                  </a>
                </li>
                <li>
                  <span className="text-gray-500">White-label beschikbaar</span>
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
                  <span className="text-gray-400">Ma-Vr 09:00-16:00</span>
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
                    Fokkerstraat 16
                    <br />
                    3833LD Leusden
                    <br />
                    Nederland
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-3" />
                  <span>Ma-Vr 09:00-16:00</span>
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
