"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import {
  Shield,
  Users,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Phone,
  Mail,
  Clock,
  Star,
  Play,
  Download,
  Smartphone,
  Award,
  RefreshCw,
  Send,
  FileText,
  MapPin,
  TrendingUp,
  Eye,
  ArrowRight,
  Timer,
  LogIn,
  Building,
  Globe,
  HeadphonesIcon,
} from "lucide-react"
import Image from "next/image"

interface ContactFormData {
  name: string
  email: string
  phone: string
  company: string
  companyType: string
  companySize: string
  interest: string
  message: string
}

export default function HomePage() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    company: "",
    companyType: "",
    companySize: "",
    interest: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Bericht verzonden!",
          description: "We nemen binnen 24 uur contact met u op.",
        })
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          companyType: "",
          companySize: "",
          interest: "",
          message: "",
        })
      } else {
        throw new Error("Failed to send message")
      }
    } catch (error) {
      toast({
        title: "Fout bij verzenden",
        description: "Probeer het opnieuw of neem direct contact op.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Pijnpunten van klanten
  const painPoints = [
    {
      icon: FileText,
      problem: "Papieren BHV administratie",
      description: "Verloren documenten, verouderde informatie, geen overzicht",
      color: "text-red-600",
    },
    {
      icon: MapPin,
      problem: "Onduidelijke evacuatieroutes",
      description: "Statische plattegronden, geen real-time updates",
      color: "text-orange-600",
    },
    {
      icon: Timer,
      problem: "Trage incident afhandeling",
      description: "Handmatige processen, geen automatisering",
      color: "text-yellow-600",
    },
    {
      icon: Eye,
      problem: "Geen inzicht in compliance",
      description: "Onduidelijke rapportages, geen real-time monitoring",
      color: "text-purple-600",
    },
  ]

  // BHV360 Pakketten
  const packages = [
    {
      name: "Starter",
      price: "€49",
      period: "/maand",
      setupCost: "€199 setup",
      description: "Perfect voor kleine organisaties tot 50 medewerkers",
      features: ["BHV Dashboard basis", "Tot 2 plotkaarten", "Basis rapportage", "Email support", "Tot 50 gebruikers"],
      popular: false,
      cta: "Start Gratis Proef",
      link: "/login",
    },
    {
      name: "Professional",
      price: "€149",
      period: "/maand",
      setupCost: "€399 setup",
      description: "Ideaal voor middelgrote organisaties tot 200 medewerkers",
      features: [
        "Alle Starter functies",
        "Incident Management",
        "Onbeperkt plotkaarten",
        "Geavanceerde rapportage",
        "Mobiele app",
        "Telefoon support",
        "Tot 200 gebruikers",
      ],
      popular: true,
      cta: "Meest Gekozen",
      link: "/login",
    },
    {
      name: "Enterprise",
      price: "€349",
      period: "/maand",
      setupCost: "€799 setup",
      description: "Voor grote organisaties met complexe veiligheidseisen",
      features: [
        "Alle Professional functies",
        "Bezoeker registratie",
        "Analytics & BI",
        "API integraties",
        "Dedicated support",
        "Custom training",
        "Onbeperkt gebruikers",
      ],
      popular: false,
      cta: "Contact Opnemen",
      link: "#contact",
    },
  ]

  // BHV360 Modules
  const modules = [
    {
      icon: Shield,
      title: "BHV Dashboard",
      description: "Complete BHV administratie met certificering tracking",
      link: "/dashboards/bhv-coordinator",
    },
    {
      icon: MapPin,
      title: "Interactieve Plotkaarten",
      description: "Digitale plattegronden met real-time status",
      link: "/plotkaart",
    },
    {
      icon: AlertTriangle,
      title: "Incident Management",
      description: "Snelle incident registratie met workflows",
      link: "/incidenten",
    },
    {
      icon: Users,
      title: "Bezoeker Registratie",
      description: "Professionele bezoeker check-in systeem",
      link: "/visitor-registration",
    },
    {
      icon: BarChart3,
      title: "Analytics & Rapportage",
      description: "Uitgebreide analytics en compliance rapportage",
      link: "/beheer/rapportages",
    },
    {
      icon: Smartphone,
      title: "Mobiele App",
      description: "Complete mobiele toegang voor BHV'ers",
      link: "/mobile-app",
    },
  ]

  // ROI Calculator
  const roiStats = [
    { label: "Tijd besparing", value: "75%", description: "Minder administratie" },
    { label: "Compliance score", value: "98%", description: "Verhoogde compliance" },
    { label: "Incident respons", value: "60%", description: "Snellere afhandeling" },
    { label: "Kosten reductie", value: "€15.000", description: "Jaarlijkse besparing" },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header Navigation */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Image
                src="/images/bhv360-logo-full.png"
                alt="BHV360 Logo"
                width={150}
                height={40}
                className="h-8 w-auto"
                priority
              />
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/demo/overview" className="text-gray-600 hover:text-blue-600">
                Demo's
              </Link>
              <a href="#pricing" className="text-gray-600 hover:text-blue-600">
                Prijzen
              </a>
              <a href="#contact" className="text-gray-600 hover:text-blue-600">
                Contact
              </a>
              <Link href="/login">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <LogIn className="mr-2 h-4 w-4" />
                  Inloggen
                </Button>
              </Link>
            </nav>
            {/* Mobile menu button */}
            <div className="md:hidden">
              <Link href="/login">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="text-white">Professioneel</span>
                <br />
                <span className="text-green-300">BHV Beheer</span>
                <br />
                <span className="text-blue-200">Gemaakt Eenvoudig</span>
              </h1>

              <p className="text-xl mb-8 text-blue-100">
                Van papieren chaos naar digitale controle. BHV360 maakt veiligheidsmanagement eenvoudig, compliant en
                effectief voor elke organisatie.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/demo/overview">
                  <Button
                    size="lg"
                    className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 text-lg font-semibold"
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Bekijk Demo
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold bg-transparent"
                  >
                    <Download className="mr-2 h-5 w-5" />
                    30 Dagen Gratis
                  </Button>
                </Link>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold mb-6 text-center">
                <span className="text-green-300">BHV360</span> Voordelen
              </h3>
              <div className="space-y-4">
                {[
                  "✓ 100% digitale BHV administratie",
                  "✓ Interactieve plotkaarten met real-time status",
                  "✓ Automatische compliance rapportage",
                  "✓ Mobiele app voor alle BHV'ers",
                  "✓ Instant incident management",
                ].map((item, index) => (
                  <div key={index} className="flex items-center text-green-100 text-lg">
                    <CheckCircle className="mr-3 h-5 w-5 text-green-300" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pain Points Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Stop met <span className="text-red-600">BHV Frustraties</span>
            </h2>
            <p className="text-xl text-gray-600">
              Deze problemen kosten u tijd, geld en zorgen voor compliance risico's
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {painPoints.map((pain, index) => (
              <Card key={index} className="border-l-4 border-l-red-500 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <pain.icon className={`h-6 w-6 ${pain.color}`} />
                    </div>
                    <CardTitle className="text-lg text-red-700">{pain.problem}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">{pain.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Packages */}
      <div id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Kies het <span className="text-blue-600">Juiste Pakket</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transparante prijzen voor elke organisatiegrootte. Alle pakketten inclusief 30 dagen gratis proefperiode.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <Card
                key={index}
                className={`hover:shadow-xl transition-all duration-300 ${
                  pkg.popular ? "ring-2 ring-blue-500 transform scale-105" : ""
                }`}
              >
                {pkg.popular && (
                  <div className="bg-blue-500 text-white text-center py-2 text-sm font-semibold rounded-t-lg">
                    🔥 MEEST POPULAIR
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-blue-600">{pkg.price}</span>
                    <span className="text-gray-600">{pkg.period}</span>
                  </div>
                  <p className="text-sm text-orange-600 font-medium">{pkg.setupCost}</p>
                  <CardDescription className="text-base mt-2">{pkg.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-8">
                    {pkg.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center">
                        <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => {
                      if (pkg.link.startsWith("#")) {
                        document.querySelector(pkg.link)?.scrollIntoView({ behavior: "smooth" })
                      } else {
                        window.location.href = pkg.link
                      }
                    }}
                  >
                    {pkg.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Modules Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              <span className="text-blue-600">BHV360 Modules</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ontdek alle functionaliteiten die BHV360 biedt voor professioneel veiligheidsmanagement.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {modules.map((module, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <module.icon className="h-8 w-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl">{module.title}</CardTitle>
                  </div>
                  <CardDescription className="text-base">{module.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={module.link}>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Meer Info
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* ROI Section */}
      <div className="py-16 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Bewezen Resultaten</h2>
            <p className="text-xl text-blue-100">Onze klanten zien direct resultaat</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {roiStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-green-300 mb-2">{stat.value}</div>
                <div className="text-lg font-semibold mb-1">{stat.label}</div>
                <div className="text-blue-200 text-sm">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Demo Section */}
      <div className="py-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Ervaar <span className="text-blue-600">BHV360</span> in Actie
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ontdek hoe BHV360 werkt met onze interactieve demo's. Geen registratie vereist.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">BHV Dashboard</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base mb-4">
                  Bekijk het complete BHV dashboard met team overzicht en certificeringen.
                </CardDescription>
                <Link href="/demo/bhv-status">
                  <Button className="w-full">
                    <Play className="mr-2 h-4 w-4" />
                    Start Demo
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <MapPin className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-xl">Plotkaart Editor</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base mb-4">
                  Ervaar hoe eenvoudig het is om interactieve plotkaarten te maken.
                </CardDescription>
                <Link href="/demo/plotkaart-editor">
                  <Button className="w-full">
                    <Play className="mr-2 h-4 w-4" />
                    Start Demo
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <CardTitle className="text-xl">Incident Simulator</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base mb-4">
                  Simuleer een noodsituatie en zie hoe BHV360 automatisch reageert.
                </CardDescription>
                <Link href="/demo/incident-simulator">
                  <Button className="w-full">
                    <Play className="mr-2 h-4 w-4" />
                    Start Demo
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Link href="/demo/overview">
              <Button size="lg" variant="outline" className="px-8 py-3 bg-transparent">
                <Eye className="mr-2 h-5 w-5" />
                Alle Demo's Bekijken
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Social Proof */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Waarom 500+ Organisaties Kiezen voor BHV360</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="p-8">
                <div className="flex justify-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <blockquote className="text-lg text-gray-700 mb-4">
                  "BHV360 heeft onze BHV administratie van chaos naar complete controle gebracht. Aanrader!"
                </blockquote>
                <cite className="text-sm text-gray-500">- Jan Bakker, Facility Manager</cite>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <div className="flex justify-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <blockquote className="text-lg text-gray-700 mb-4">
                  "Eindelijk een systeem dat werkt! Compliance is nu een fluitje van een cent."
                </blockquote>
                <cite className="text-sm text-gray-500">- Maria de Vries, HR Manager</cite>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <div className="flex justify-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <blockquote className="text-lg text-gray-700 mb-4">
                  "De ROI was binnen 3 maanden zichtbaar. Tijd en kosten besparing is enorm."
                </blockquote>
                <cite className="text-sm text-gray-500">- Peter Jansen, Operations Director</cite>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Contact Form Section */}
      <div id="contact" className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Krijg Uw Persoonlijke Demo</h2>
            <p className="text-xl text-gray-600">
              Zie hoe BHV360 uw specifieke uitdagingen oplost. Gratis demo op maat van uw organisatie.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Demo Aanvragen</CardTitle>
                <CardDescription>
                  Vul het formulier in en we tonen u binnen 24 uur hoe BHV360 uw problemen oplost.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Naam *</Label>
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        required
                        placeholder="Uw volledige naam"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">E-mail *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                        placeholder="uw.email@bedrijf.nl"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Telefoon</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="+31 6 12345678"
                      />
                    </div>
                    <div>
                      <Label htmlFor="company">Bedrijfsnaam *</Label>
                      <Input
                        id="company"
                        type="text"
                        value={formData.company}
                        onChange={(e) => handleInputChange("company", e.target.value)}
                        required
                        placeholder="Uw bedrijfsnaam"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="companyType">Type Organisatie</Label>
                      <Select
                        value={formData.companyType}
                        onValueChange={(value) => handleInputChange("companyType", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecteer type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kantoor">Kantoor</SelectItem>
                          <SelectItem value="productie">Productie/Industrie</SelectItem>
                          <SelectItem value="zorg">Zorg</SelectItem>
                          <SelectItem value="onderwijs">Onderwijs</SelectItem>
                          <SelectItem value="retail">Retail</SelectItem>
                          <SelectItem value="horeca">Horeca</SelectItem>
                          <SelectItem value="overheid">Overheid</SelectItem>
                          <SelectItem value="anders">Anders</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="companySize">Aantal Medewerkers</Label>
                      <Select
                        value={formData.companySize}
                        onValueChange={(value) => handleInputChange("companySize", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecteer grootte" />
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
                  </div>

                  <div>
                    <Label htmlFor="interest">Grootste BHV Uitdaging</Label>
                    <Select value={formData.interest} onValueChange={(value) => handleInputChange("interest", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Wat is uw grootste uitdaging?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="administratie">Papieren administratie</SelectItem>
                        <SelectItem value="compliance">Compliance & rapportage</SelectItem>
                        <SelectItem value="plotkaarten">Verouderde plotkaarten</SelectItem>
                        <SelectItem value="incidenten">Incident afhandeling</SelectItem>
                        <SelectItem value="overzicht">Geen overzicht BHV team</SelectItem>
                        <SelectItem value="certificaten">Certificaat beheer</SelectItem>
                        <SelectItem value="anders">Anders</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="message">Aanvullende Informatie</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      placeholder="Vertel ons meer over uw specifieke situatie..."
                      rows={4}
                    />
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 py-3">
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Verzenden...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Gratis Demo Aanvragen
                      </>
                    )}
                  </Button>

                  <p className="text-sm text-gray-500 text-center">
                    ✓ Geen verplichtingen ✓ Binnen 24 uur reactie ✓ Op maat van uw organisatie
                  </p>
                </form>
              </CardContent>
            </Card>

            {/* Contact Info & Benefits */}
            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-blue-50 to-green-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Phone className="h-5 w-5 text-blue-600" />
                    <span>Direct Contact</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium">Sales & Demo's</p>
                      <a
                        href="mailto:info@BHV360.nl?subject=Demo%20Aanvraag%20BHV360&body=Hallo%2C%0A%0AIk%20ben%20geïnteresseerd%20in%20een%20demo%20van%20BHV360.%0A%0AMet%20vriendelijke%20groet%2C"
                        className="text-blue-600 hover:underline"
                      >
                        info@BHV360.nl
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium">Direct Bellen</p>
                      <a href="tel:+31334614303" className="text-blue-600 hover:underline">
                        033-4614303
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium">Reactietijd</p>
                      <p className="text-gray-600">Binnen 4 uur op werkdagen</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-green-600" />
                    <span>Wat u krijgt</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Persoonlijke demo op maat</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">ROI berekening voor uw situatie</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Implementatie roadmap</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">30 dagen gratis proefperiode</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Gratis training voor uw team</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
                <CardContent className="p-6">
                  <div className="text-center">
                    <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="font-semibold text-gray-900 mb-2">Gemiddelde ROI</p>
                    <div className="text-3xl font-bold text-green-600 mb-2">320%</div>
                    <p className="text-sm text-gray-600">Binnen 12 maanden</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Company Info Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Over BHV360</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Complete bedrijfsinformatie en contactgegevens voor uw administratie en facturatie.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Bedrijfsgegevens */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="h-5 w-5 text-blue-600" />
                  <span>Bedrijfsgegevens</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-medium text-gray-900">BHV360 B.V.</p>
                  <p className="text-gray-600">Innovatieve BHV software oplossingen</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">KvK nummer:</p>
                  <p className="text-gray-600">12345678</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">BTW nummer:</p>
                  <p className="text-gray-600">NL123456789B01</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">IBAN:</p>
                  <p className="text-gray-600">NL12 ABCD 0123 4567 89</p>
                </div>
              </CardContent>
            </Card>

            {/* Contactgegevens */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Phone className="h-5 w-5 text-green-600" />
                  <span>Contactgegevens</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-medium text-gray-700">Telefoon:</p>
                  <a href="tel:+31334614303" className="text-blue-600 hover:underline">
                    033-4614303
                  </a>
                </div>
                <div>
                  <p className="font-medium text-gray-700">E-mail algemeen:</p>
                  <a
                    href="mailto:info@BHV360.nl?subject=Informatie%20BHV360&body=Hallo%2C%0A%0AIk%20zou%20graag%20meer%20informatie%20ontvangen%20over%20BHV360.%0A%0AMet%20vriendelijke%20groet%2C"
                    className="text-blue-600 hover:underline"
                  >
                    info@BHV360.nl
                  </a>
                </div>
                <div>
                  <p className="font-medium text-gray-700">E-mail support:</p>
                  <a
                    href="mailto:support@BHV360.nl?subject=Support%20Aanvraag&body=Hallo%20support%20team%2C%0A%0AIk%20heb%20hulp%20nodig%20met%3A%0A%0A[Beschrijf%20uw%20probleem%20hier]%0A%0AMet%20vriendelijke%20groet%2C"
                    className="text-blue-600 hover:underline"
                  >
                    support@BHV360.nl
                  </a>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Website:</p>
                  <a href="https://www.bhv360.nl" className="text-blue-600 hover:underline">
                    www.bhv360.nl
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Adresgegevens */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-purple-600" />
                  <span>Adresgegevens</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-medium text-gray-700">Bezoekadres:</p>
                  <p className="text-gray-600">
                    Innovatiestraat 123
                    <br />
                    3811 AB Amersfoort
                    <br />
                    Nederland
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Postadres:</p>
                  <p className="text-gray-600">
                    Postbus 456
                    <br />
                    3800 AL Amersfoort
                    <br />
                    Nederland
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Openingstijden */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-orange-600" />
                  <span>Openingstijden</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-700">Maandag - Vrijdag:</span>
                  <span className="text-gray-600">09:00 - 17:30</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Zaterdag:</span>
                  <span className="text-gray-600">Gesloten</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Zondag:</span>
                  <span className="text-gray-600">Gesloten</span>
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <HeadphonesIcon className="inline h-4 w-4 mr-1" />
                    24/7 Support beschikbaar voor Enterprise klanten
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Sociale Media */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="h-5 w-5 text-blue-600" />
                  <span>Online Aanwezigheid</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-medium text-gray-700">LinkedIn:</p>
                  <a
                    href="https://linkedin.com/company/bhv360"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    linkedin.com/company/bhv360
                  </a>
                </div>
                <div>
                  <p className="font-medium text-gray-700">YouTube:</p>
                  <a
                    href="https://youtube.com/@bhv360"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    youtube.com/@bhv360
                  </a>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Knowledge Base:</p>
                  <Link href="/help" className="text-blue-600 hover:underline">
                    help.bhv360.nl
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Certificeringen */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-green-600" />
                  <span>Certificeringen</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">ISO 27001 Gecertificeerd</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">GDPR Compliant</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">SOC 2 Type II</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">NEN 7510 Healthcare</span>
                </div>
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    <Shield className="inline h-4 w-4 mr-1" />
                    Veiligheid en compliance staan voorop
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <Image
                  src="/images/bhv360-logo-full.png"
                  alt="BHV360 Logo"
                  width={200}
                  height={60}
                  className="h-10 w-auto brightness-0 invert"
                />
              </div>
              <p className="text-gray-300 mb-4 max-w-md">
                BHV software van Nederland. Vertrouwd door 500+ organisaties voor professioneel veiligheidsmanagement.
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <a
                    href="mailto:info@BHV360.nl?subject=Informatie%20BHV360&body=Hallo%2C%0A%0AIk%20zou%20graag%20meer%20informatie%20ontvangen%20over%20BHV360.%0A%0AMet%20vriendelijke%20groet%2C"
                    className="text-gray-300 hover:text-white"
                  >
                    info@BHV360.nl
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <a href="tel:+31334614303" className="text-gray-300 hover:text-white">
                    033-4614303
                  </a>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link href="/demo/overview" className="hover:text-white">
                    Demo's
                  </Link>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-white">
                    Prijzen
                  </a>
                </li>
                <li>
                  <Link href="/plotkaart" className="hover:text-white">
                    Plotkaarten
                  </Link>
                </li>
                <li>
                  <Link href="/incidenten" className="hover:text-white">
                    Incidenten
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link href="/help" className="hover:text-white">
                    Helpdesk
                  </Link>
                </li>
                <li>
                  <Link href="/video-tutorials" className="hover:text-white">
                    Training
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-white">
                    Inloggen
                  </Link>
                </li>
                <li>
                  <Link href="/system-health" className="hover:text-white">
                    Status
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2025 BHV360 - BHV Software van Nederland</p>
            <p className="mt-2">✓ GDPR Compliant ✓ ISO Gecertificeerd ✓ Nederlandse Support</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
