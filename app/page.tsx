"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Clock,
  Users,
  MapPin,
  AlertTriangle,
  BarChart3,
  Smartphone,
  Shield,
  CheckCircle,
  Phone,
  MapIcon,
  Globe,
  Award,
  Building,
  Timer,
  Eye,
  HeadphonesIcon,
  Play,
  Star,
  TrendingUp,
  Check,
  Zap,
  Crown,
  Mail,
  Send,
  RefreshCw,
} from "lucide-react"
import type React from "react"
import { EmailLink } from "@/components/ui/email-link"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

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

const demoModules = [
  {
    id: "bhv-team-dashboard",
    title: "BHV Team Dashboard",
    description: "Complete overzicht van uw BHV team, aanwezigheid, certificeringen en status monitoring",
    difficulty: "Beginner",
    duration: "5-10 min",
    icon: Users,
    features: ["Team overzicht", "Certificaat tracking", "Aanwezigheid monitoring", "Status dashboard"],
    href: "/demo/bhv-status",
    requiresLogin: false,
  },
  {
    id: "interactive-plotmaps",
    title: "Interactieve Plotkaarten",
    description: "Ervaar hoe eenvoudig het is om digitale plattegronden te maken met BHV voorzieningen",
    difficulty: "Gemiddeld",
    duration: "10-15 min",
    icon: MapPin,
    features: ["Plattegrond upload", "Voorziening markering", "Interactieve navigatie", "Print functionaliteit"],
    href: "/demo/plotkaart-editor",
    requiresLogin: false,
  },
  {
    id: "incident-management",
    title: "Incident Management",
    description: "Simuleer een noodsituatie en zie hoe BHV360 automatisch procedures activeert",
    difficulty: "Geavanceerd",
    duration: "15-20 min",
    icon: AlertTriangle,
    features: ["Incident simulatie", "Automatische workflows", "Team mobilisatie", "Real-time monitoring"],
    href: "/demo/incident-simulator",
    requiresLogin: false,
  },
  {
    id: "visitor-registration",
    title: "Bezoeker Registratie",
    description: "Professionele bezoeker check-in met veiligheidscheck en evacuatielijsten",
    difficulty: "Beginner",
    duration: "5-8 min",
    icon: Shield,
    features: ["Digitale check-in", "Host notificaties", "Veiligheidscheck", "Evacuatie lijsten"],
    href: "/visitor-registration",
    requiresLogin: false,
  },
  {
    id: "analytics-reporting",
    title: "Analytics & Rapportage",
    description: "Uitgebreide dashboards met KPI's, trends en compliance rapportages",
    difficulty: "Gemiddeld",
    duration: "8-12 min",
    icon: BarChart3,
    features: ["Executive dashboards", "KPI tracking", "Trend analyse", "Compliance reports"],
    href: "/beheer/rapportages",
    requiresLogin: false,
  },
  {
    id: "mobile-app",
    title: "Mobiele App",
    description: "Complete mobiele ervaring voor BHV'ers en medewerkers onderweg",
    difficulty: "Beginner",
    duration: "6-10 min",
    icon: Smartphone,
    features: ["iOS & Android", "Offline functionaliteit", "Push notificaties", "QR scanning"],
    href: "/mobile-app",
    requiresLogin: false,
  },
]

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Beginner":
      return "bg-green-100 text-green-800"
    case "Gemiddeld":
      return "bg-yellow-100 text-yellow-800"
    case "Geavanceerd":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const painPoints = [
  {
    icon: AlertTriangle,
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

const roiStats = [
  { label: "Tijd besparing", value: "75%", description: "Minder administratie" },
  { label: "Compliance score", value: "98%", description: "Verhoogde compliance" },
  { label: "Incident respons", value: "60%", description: "Snellere afhandeling" },
  { label: "Kosten reductie", value: "€15.000", description: "Jaarlijkse besparing" },
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
    buttonText: "Start Gratis Trial",
    buttonVariant: "outline" as const,
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
    buttonText: "Start Gratis Trial",
    buttonVariant: "default" as const,
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
    buttonText: "Contact Opnemen",
    buttonVariant: "outline" as const,
    popular: false,
  },
]

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
  const router = useRouter()

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

      const result = await response.json()

      if (response.ok && result.success) {
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
        throw new Error(result.error || "Er is een fout opgetreden")
      }
    } catch (error) {
      console.error("Contact form error:", error)
      toast({
        title: "Fout bij verzenden",
        description: "Probeer het opnieuw of neem direct contact op.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStartTrial = (planName: string) => {
    localStorage.setItem("selectedPlan", planName)
    router.push("/login?trial=true")
  }

  const handleContactSales = () => {
    const contactSection = document.getElementById("contact")
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleDemoClick = (demoPath: string) => {
    if (demoPath === "/demo/overview") {
      router.push(demoPath)
    } else {
      router.push(`/login?demo=${encodeURIComponent(demoPath)}`)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Navigation */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <img src="/images/bhv360-logo-full.png" alt="BHV360 Logo" className="h-10 w-auto object-contain" />
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => document.getElementById("modules")?.scrollIntoView({ behavior: "smooth" })}
                className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
              >
                Demo's
              </button>
              <button
                onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
                className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
              >
                Prijzen
              </button>
              <button
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
              >
                Contact
              </button>
              <Button onClick={() => router.push("/login")} className="bg-blue-600 hover:bg-blue-700">
                <Phone className="mr-2 h-4 w-4" />
                Inloggen
              </Button>
            </nav>
            <div className="md:hidden">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => router.push("/login")}>
                <Phone className="mr-2 h-4 w-4" />
                Login
              </Button>
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
                <Button
                  size="lg"
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 text-lg font-semibold"
                  onClick={() => handleDemoClick("/demo/overview")}
                >
                  <Play className="mr-2 h-5 w-5" />
                  Bekijk Demo
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold bg-transparent"
                  onClick={() => handleStartTrial("Professional")}
                >
                  <Zap className="mr-2 h-5 w-5" />
                  30 Dagen Gratis
                </Button>
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
                  <p className="text-gray-600">{pain.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Demo Modules Section */}
      <div id="modules" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              <span className="text-blue-600">Interactieve Demo's</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ervaar BHV360 met onze uitgebreide demo's. Elke demo toont specifieke functionaliteiten in actie.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {demoModules.map((module, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 h-full">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <module.icon className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Badge className={getDifficultyColor(module.difficulty)}>{module.difficulty}</Badge>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {module.duration}
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-xl mb-2">{module.title}</CardTitle>
                  <p className="text-base text-gray-600 mb-4">{module.description}</p>

                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-gray-700">Wat u gaat zien:</p>
                    <ul className="space-y-1">
                      {module.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                          <Check className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => router.push(module.href)}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Start Demo
                  </Button>
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

      {/* Pricing Section */}
      <div id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Transparante Prijzen</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Kies het plan dat perfect past bij uw organisatie</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`relative hover:shadow-xl transition-all duration-300 ${
                  plan.popular ? "border-2 border-blue-500 scale-105" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white px-4 py-1 text-sm font-semibold">
                      <Crown className="mr-1 h-4 w-4" />
                      Meest Populair
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl font-bold text-gray-900">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-1">{plan.period}</span>
                  </div>
                  <p className="text-gray-600 mt-2">{plan.description}</p>
                </CardHeader>

                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-6">
                    <Button
                      className={`w-full py-3 text-lg font-semibold ${
                        plan.popular
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                      }`}
                      variant={plan.buttonVariant}
                      onClick={() => {
                        if (plan.name === "Enterprise") {
                          handleContactSales()
                        } else {
                          handleStartTrial(plan.name)
                        }
                      }}
                    >
                      {plan.name === "Enterprise" ? (
                        <>
                          <Mail className="mr-2 h-5 w-5" />
                          {plan.buttonText}
                        </>
                      ) : (
                        <>
                          <Zap className="mr-2 h-5 w-5" />
                          {plan.buttonText}
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Alle plannen bevatten een 30-dagen gratis proefperiode</p>
            <div className="flex justify-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Geen setup kosten
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Maandelijks opzegbaar
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Nederlandse support
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Company Information */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Over BHV360</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Complete bedrijfsinformatie en contactgegevens voor uw administratie en facturatie.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                  <EmailLink
                    email="info@BHV360.nl"
                    subject="Informatie BHV360"
                    body="Hallo,%0D%0A%0D%0AIk zou graag meer informatie ontvangen over BHV360.%0D%0A%0D%0AMet vriendelijke groet,"
                  />
                </div>
                <div>
                  <p className="font-medium text-gray-700">E-mail support:</p>
                  <EmailLink
                    email="support@BHV360.nl"
                    subject="Support Aanvraag"
                    body="Hallo support team,%0D%0A%0D%0AIk heb hulp nodig met:%0D%0A%0D%0A[Beschrijf uw probleem hier]%0D%0A%0D%0AMet vriendelijke groet,"
                  />
                </div>
                <div>
                  <p className="font-medium text-gray-700">Website:</p>
                  <a href="https://www.bhv360.nl" className="text-blue-600 hover:underline">
                    www.bhv360.nl
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapIcon className="h-5 w-5 text-purple-600" />
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
                  <button
                    onClick={() => handleDemoClick("/help")}
                    className="text-blue-600 hover:underline cursor-pointer"
                  >
                    help.bhv360.nl
                  </button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-green-600" />
                  <span>Compliance & Richtlijnen</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">ISO 27001 Compliant</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">GDPR Compliant</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">SOC 2 Type II Compliant</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">NEN 7510 Healthcare Compliant</span>
                </div>
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    <Shield className="inline h-4 w-4 mr-1" />
                    Voldoet aan alle relevante richtlijnen en standaarden
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Contact Form Section */}
      <div id="contact" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Krijg Uw Persoonlijke Demo</h2>
            <p className="text-xl text-gray-600">
              Zie hoe BHV360 uw specifieke uitdagingen oplost. Gratis demo op maat van uw organisatie.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Demo Aanvragen</CardTitle>
                <p className="text-gray-600">
                  Vul het formulier in en we tonen u binnen 24 uur hoe BHV360 uw problemen oplost.
                </p>
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
                      <EmailLink
                        email="info@BHV360.nl"
                        subject="Demo Aanvraag BHV360"
                        body="Hallo,%0D%0A%0D%0AIk ben geïnteresseerd in een demo van BHV360.%0D%0A%0D%0AMet vriendelijke groet,"
                      />
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

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src="/images/bhv360-logo-full.png"
                  alt="BHV360 Logo"
                  className="h-8 w-auto object-contain filter brightness-0 invert"
                />
              </div>
              <p className="text-gray-300 mb-4 max-w-md">
                BHV software van Nederland. Vertrouwd door 500+ organisaties voor professioneel veiligheidsmanagement.
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <EmailLink
                    email="info@BHV360.nl"
                    subject="Informatie BHV360"
                    body="Hallo,%0D%0A%0D%0AIk zou graag meer informatie ontvangen over BHV360.%0D%0A%0D%0AMet vriendelijke groet,"
                    className="text-gray-300 hover:text-white"
                  />
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
                  <button onClick={() => handleDemoClick("/demo/overview")} className="hover:text-white cursor-pointer">
                    Demo's
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => document.getElementById("modules")?.scrollIntoView({ behavior: "smooth" })}
                    className="hover:text-white cursor-pointer"
                  >
                    Modules
                  </button>
                </li>
                <li>
                  <button onClick={() => router.push("/login")} className="hover:text-white cursor-pointer">
                    Plotkaarten (Login)
                  </button>
                </li>
                <li>
                  <button onClick={() => router.push("/login")} className="hover:text-white cursor-pointer">
                    Incidenten (Login)
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <button onClick={() => handleDemoClick("/help")} className="hover:text-white cursor-pointer">
                    Helpdesk
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleDemoClick("/video-tutorials")}
                    className="hover:text-white cursor-pointer"
                  >
                    Training
                  </button>
                </li>
                <li>
                  <button onClick={() => router.push("/login")} className="hover:text-white cursor-pointer">
                    Inloggen
                  </button>
                </li>
                <li>
                  <button onClick={() => handleDemoClick("/system-health")} className="hover:text-white cursor-pointer">
                    Status
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2025 BHV360 - BHV Software van Nederland</p>
            <p className="mt-2">✓ GDPR Compliant ✓ Voldoet aan ISO Standaarden ✓ Nederlandse Support</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
