"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Shield,
  Map,
  Users,
  AlertTriangle,
  FileText,
  Settings,
  ArrowRight,
  CheckCircle,
  Clock,
  Building,
  Star,
  Zap,
  Globe,
  Award,
  TrendingUp,
  Phone,
  Mail,
  Lock,
  Heart,
  Activity,
  BarChart3,
  Play,
  ExternalLink,
} from "lucide-react"
import Link from "next/link"

// Simple inline BHV360 Logo component to avoid import issues
function BHV360Logo({
  size = "md",
  variant = "default",
  showText = true,
  className = "",
}: {
  size?: "sm" | "md" | "lg" | "xl"
  variant?: "default" | "white" | "dark"
  showText?: boolean
  className?: string
}) {
  const sizeClasses = {
    sm: "h-8 w-auto",
    md: "h-10 w-auto",
    lg: "h-12 w-auto",
    xl: "h-16 w-auto",
  }

  // Use the actual BHV360 logo image
  const logoSrc = "/images/bhv360-logo-full.png"

  return (
    <div className={`flex items-center ${className}`}>
      <img
        src={logoSrc || "/placeholder.svg?height=64&width=200&text=BHV360"}
        alt="BHV360 Logo"
        className={`${sizeClasses[size]} object-contain`}
      />
      {showText && variant !== "default" && (
        <div className="ml-3">
          <div
            className={`font-bold ${variant === "white" ? "text-white" : "text-gray-900"} ${
              size === "sm" ? "text-lg" : size === "md" ? "text-xl" : size === "lg" ? "text-2xl" : "text-3xl"
            }`}
          >
            BHV360
          </div>
          <div className={`text-sm ${variant === "white" ? "text-blue-100" : "text-gray-600"}`}>
            Veiligheid Platform
          </div>
        </div>
      )}
    </div>
  )
}

export default function HomePage() {
  const router = useRouter()
  const [currentDemo, setCurrentDemo] = useState(0)
  const [autoRedirectCountdown, setAutoRedirectCountdown] = useState(10)

  // Auto-redirect countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setAutoRedirectCountdown((prev) => {
        if (prev <= 1) {
          router.push("/dashboard")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  // Demo carousel
  const demos = [
    {
      title: "Interactieve Plotkaart",
      description: "Real-time overzicht van alle BHV voorzieningen",
      image: "/placeholder.svg?height=300&width=500&text=Plotkaart+Demo",
      href: "/plotkaart",
    },
    {
      title: "BHV Status Dashboard",
      description: "Live monitoring van BHV'ers en hun beschikbaarheid",
      image: "/placeholder.svg?height=300&width=500&text=BHV+Status+Demo",
      href: "/bhv-aanwezigheid",
    },
    {
      title: "Incident Management",
      description: "Snelle incident registratie en opvolging",
      image: "/placeholder.svg?height=300&width=500&text=Incident+Demo",
      href: "/incidenten",
    },
    {
      title: "Noodprocedures",
      description: "Stap-voor-stap procedures met checklists",
      image: "/placeholder.svg?height=300&width=500&text=Procedures+Demo",
      href: "/bhv/procedures",
    },
  ]

  useEffect(() => {
    const demoTimer = setInterval(() => {
      setCurrentDemo((prev) => (prev + 1) % demos.length)
    }, 4000)

    return () => clearInterval(demoTimer)
  }, [demos.length])

  const features = [
    {
      icon: Map,
      title: "Plotkaart Beheer",
      description: "Interactieve plattegronden met BHV voorzieningen",
      href: "/plotkaart",
      status: "active",
      demo: true,
    },
    {
      icon: Shield,
      title: "BHV Coördinatie",
      description: "Real-time overzicht van BHV'ers en hun status",
      href: "/bhv",
      status: "active",
      demo: true,
    },
    {
      icon: AlertTriangle,
      title: "Incident Management",
      description: "Snelle respons en documentatie van incidenten",
      href: "/incidenten",
      status: "active",
      demo: true,
    },
    {
      icon: Users,
      title: "Gebruikersbeheer",
      description: "Beheer van gebruikers en autorisaties",
      href: "/beheer/gebruikers",
      status: "active",
      demo: false,
    },
    {
      icon: FileText,
      title: "Rapportages",
      description: "Uitgebreide rapportage en compliance tracking",
      href: "/beheer/rapportages",
      status: "active",
      demo: false,
    },
    {
      icon: Settings,
      title: "Systeembeheer",
      description: "Configuratie en onderhoud van het platform",
      href: "/beheer",
      status: "active",
      demo: false,
    },
  ]

  const stats = [
    { label: "Actieve Organisaties", value: "500+", icon: Building, color: "text-blue-600" },
    { label: "BHV'ers Online", value: "12,000+", icon: Shield, color: "text-green-600" },
    { label: "Beheerde Gebouwen", value: "1,200+", icon: Map, color: "text-purple-600" },
    { label: "Incidenten Afgehandeld", value: "25,000+", icon: AlertTriangle, color: "text-orange-600" },
  ]

  const complianceItems = [
    { name: "AVG/GDPR Compliant", icon: Lock, status: "certified" },
    { name: "ISO 27001 Gecertificeerd", icon: Award, status: "certified" },
    { name: "NEN 3011 Conform", icon: Shield, status: "certified" },
    { name: "Arbo-wet Compliant", icon: CheckCircle, status: "certified" },
    { name: "BHV Richtlijnen", icon: Heart, status: "certified" },
    { name: "99.9% Uptime SLA", icon: Activity, status: "guaranteed" },
  ]

  const testimonials = [
    {
      name: "Marie van der Berg",
      role: "BHV Coördinator",
      company: "TechCorp Nederland",
      quote: "BHV360 heeft onze veiligheidsprocedures volledig getransformeerd. Real-time inzicht in alle BHV'ers!",
      rating: 5,
    },
    {
      name: "Piet Janssen",
      role: "Facility Manager",
      company: "Zorggroep Zuid",
      quote: "De plotkaart functie is fantastisch. Eindelijk overzicht van alle voorzieningen in één systeem.",
      rating: 5,
    },
    {
      name: "Lisa de Vries",
      role: "Veiligheidsmanager",
      company: "Industriepark West",
      quote: "Compliance rapportage is nu een fluitje van een cent. Besparen uren werk per maand!",
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <BHV360Logo size="xl" variant="white" />
              <div>
                <h1 className="text-4xl font-bold">BHV360 Platform</h1>
                <p className="text-blue-100 text-lg">Nederland's #1 BHV Management Systeem</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                v2.0 Live
              </Badge>
              <Badge variant="secondary" className="bg-green-500/20 text-white border-green-300/30">
                <CheckCircle className="h-3 w-3 mr-1" />
                Gecertificeerd
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Auto-redirect notice */}
        <Card className="mb-8 border-blue-200 bg-gradient-to-r from-blue-50 to-green-50">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-blue-600" />
              <span className="text-blue-800">
                Automatische doorverwijzing naar dashboard in {autoRedirectCountdown} seconden...
              </span>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => router.push("/dashboard")} className="bg-blue-600 hover:bg-blue-700">
                Nu naar Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => setAutoRedirectCountdown(60)}
                className="border-blue-300 text-blue-700"
              >
                Meer tijd
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Hero Demo Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Zie BHV360 in Actie</h2>
            <p className="text-gray-600 text-lg">Ontdek onze krachtige modules met live demo's</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Demo Carousel */}
            <div className="relative">
              <Card className="overflow-hidden shadow-xl">
                <div className="relative h-80">
                  <img
                    src={demos[currentDemo].image || "/placeholder.svg"}
                    alt={demos[currentDemo].title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold mb-2">{demos[currentDemo].title}</h3>
                    <p className="text-gray-200">{demos[currentDemo].description}</p>
                  </div>
                  <Button
                    className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white"
                    size="sm"
                    onClick={() => router.push(demos[currentDemo].href)}
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Live Demo
                  </Button>
                </div>
              </Card>

              {/* Demo Navigation */}
              <div className="flex justify-center mt-4 gap-2">
                {demos.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentDemo(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentDemo ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Quick Stats & Benefits */}
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Waarom BHV360?</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Real-time monitoring van alle BHV voorzieningen</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Automatische compliance rapportage</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Mobiele app voor onderweg</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>24/7 support en 99.9% uptime</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">500+</div>
                  <div className="text-sm text-gray-600">Tevreden Klanten</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">99.9%</div>
                  <div className="text-sm text-gray-600">Uptime Garantie</div>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                onClick={() => router.push("/beheer/module-marketplace")}
              >
                <Zap className="h-5 w-5 mr-2" />
                Bekijk Alle Modules
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                    </div>
                    <Icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Features Grid */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Complete BHV Oplossing</h2>
            <p className="text-gray-600 text-lg">Alles wat je nodig hebt voor professioneel BHV management</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card
                  key={index}
                  className="hover:shadow-lg transition-all cursor-pointer group hover:scale-105"
                  onClick={() => router.push(feature.href)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Icon className="h-8 w-8 text-blue-600 group-hover:text-green-600 transition-colors" />
                      <div className="flex gap-2">
                        {feature.demo && (
                          <Badge variant="outline" className="text-blue-600 border-blue-600">
                            <Play className="h-3 w-3 mr-1" />
                            Demo
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {feature.status}
                        </Badge>
                      </div>
                    </div>
                    <CardTitle className="group-hover:text-blue-600 transition-colors">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="ghost" className="w-full group-hover:bg-blue-50">
                      {feature.demo ? "Live Demo" : "Openen"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Compliance & Certifications */}
        <Card className="mb-12 bg-gradient-to-r from-green-50 to-blue-50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-gray-900 flex items-center justify-center gap-2">
              <Award className="h-6 w-6 text-green-600" />
              Compliance & Certificeringen
            </CardTitle>
            <CardDescription className="text-lg">
              BHV360 voldoet aan alle Nederlandse en Europese veiligheidsnormen
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {complianceItems.map((item, index) => {
                const Icon = item.icon
                return (
                  <div key={index} className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
                    <Icon className="h-6 w-6 text-green-600" />
                    <div>
                      <div className="font-semibold text-gray-900">{item.name}</div>
                      <Badge
                        variant="outline"
                        className={
                          item.status === "certified"
                            ? "text-green-600 border-green-600"
                            : "text-blue-600 border-blue-600"
                        }
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {item.status === "certified" ? "Gecertificeerd" : "Gegarandeerd"}
                      </Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Testimonials */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Wat Onze Klanten Zeggen</h2>
            <p className="text-gray-600 text-lg">Meer dan 500 organisaties vertrouwen op BHV360</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardDescription className="text-base italic">"{testimonial.quote}"</CardDescription>
                </CardHeader>
                <CardContent>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                    <div className="text-sm text-blue-600">{testimonial.company}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Module Marketplace Preview */}
        <Card className="mb-12">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-gray-900 flex items-center justify-center gap-2">
              <Globe className="h-6 w-6 text-blue-600" />
              Module Marketplace
            </CardTitle>
            <CardDescription className="text-lg">Ontdek onze uitgebreide collectie van BHV modules</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="popular" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="popular">Populair</TabsTrigger>
                <TabsTrigger value="new">Nieuw</TabsTrigger>
                <TabsTrigger value="enterprise">Enterprise</TabsTrigger>
              </TabsList>

              <TabsContent value="popular" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                          Noodprocedures
                        </CardTitle>
                        <Badge className="bg-red-100 text-red-700">
                          <Star className="h-3 w-3 mr-1" />
                          #1
                        </Badge>
                      </div>
                      <CardDescription>Interactieve procedures met checklists</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          <div>Per gebruiker: €12/maand</div>
                          <div>Per gebouw: €75/maand</div>
                        </div>
                        <Button size="sm" variant="outline">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Demo
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Map className="h-5 w-5 text-blue-600" />
                          Plotkaart Pro
                        </CardTitle>
                        <Badge className="bg-blue-100 text-blue-700">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Trending
                        </Badge>
                      </div>
                      <CardDescription>Geavanceerde plattegronden met NFC</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          <div>Per gebouw: €45/maand</div>
                          <div>Enterprise: €200/maand</div>
                        </div>
                        <Button size="sm" variant="outline">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Demo
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Shield className="h-5 w-5 text-green-600" />
                          BHV Dashboard
                        </CardTitle>
                        <Badge className="bg-green-100 text-green-700">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Stabiel
                        </Badge>
                      </div>
                      <CardDescription>Complete BHV coördinatie suite</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          <div>Per gebruiker: €18/maand</div>
                          <div>Per organisatie: €250/maand</div>
                        </div>
                        <Button size="sm" variant="outline">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Demo
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="new" className="space-y-4">
                <div className="text-center py-8">
                  <Zap className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Nieuwe Modules Binnenkort</h3>
                  <p className="text-gray-600">AI-powered incident voorspelling en automatische rapportage</p>
                </div>
              </TabsContent>

              <TabsContent value="enterprise" className="space-y-4">
                <div className="text-center py-8">
                  <Building className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Enterprise Oplossingen</h3>
                  <p className="text-gray-600">White-label, API toegang en custom integraties</p>
                  <Button className="mt-4">
                    <Phone className="h-4 w-4 mr-2" />
                    Contact Sales
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            <div className="text-center mt-6">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                onClick={() => router.push("/beheer/module-marketplace")}
              >
                <Globe className="h-5 w-5 mr-2" />
                Volledige Marketplace Bekijken
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-600" />
              Snelle Acties
            </CardTitle>
            <CardDescription>Veelgebruikte functies voor dagelijks BHV beheer</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                variant="outline"
                className="h-20 flex-col gap-2 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border-blue-200"
                onClick={() => router.push("/plotkaart")}
              >
                <Map className="h-6 w-6 text-blue-600" />
                <span className="text-sm">Plotkaart Bekijken</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col gap-2 bg-gradient-to-br from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 border-red-200"
                onClick={() => router.push("/incidenten")}
              >
                <AlertTriangle className="h-6 w-6 text-red-600" />
                <span className="text-sm">Incident Melden</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col gap-2 bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 border-green-200"
                onClick={() => router.push("/bhv-aanwezigheid")}
              >
                <Users className="h-6 w-6 text-green-600" />
                <span className="text-sm">BHV Status</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col gap-2 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border-purple-200"
                onClick={() => router.push("/beheer/rapportages")}
              >
                <BarChart3 className="h-6 w-6 text-purple-600" />
                <span className="text-sm">Rapportages</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl text-white p-12 text-center mb-12">
          <BHV360Logo size="lg" variant="white" className="justify-center mb-6" />
          <h2 className="text-3xl font-bold mb-4">Klaar om BHV360 te Ervaren?</h2>
          <p className="text-xl mb-8 opacity-90">Sluit je aan bij meer dan 500 organisaties die vertrouwen op BHV360</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-gray-100"
              onClick={() => router.push("/beheer/module-marketplace")}
            >
              <Globe className="h-5 w-5 mr-2" />
              Bekijk Modules
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-blue-600 bg-transparent"
              onClick={() => router.push("/dashboard")}
            >
              <ArrowRight className="h-5 w-5 mr-2" />
              Start Dashboard
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-blue-600 bg-transparent"
              onClick={() => router.push("/demo/overview")}
            >
              <Play className="h-5 w-5 mr-2" />
              Live Demo's
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <BHV360Logo size="md" className="mb-4" />
              <p className="text-gray-600 text-sm">
                Nederland's meest vertrouwde BHV management platform. Meer dan 500 organisaties vertrouwen op onze
                oplossingen.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="/beheer/module-marketplace" className="hover:text-blue-600">
                    Module Marketplace
                  </Link>
                </li>
                <li>
                  <Link href="/demo/overview" className="hover:text-blue-600">
                    Live Demo's
                  </Link>
                </li>
                <li>
                  <Link href="/beheer/rapportages" className="hover:text-blue-600">
                    Rapportages
                  </Link>
                </li>
                <li>
                  <Link href="/mobile-app" className="hover:text-blue-600">
                    Mobile App
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="/help" className="hover:text-blue-600">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/video-tutorials" className="hover:text-blue-600">
                    Video Tutorials
                  </Link>
                </li>
                <li>
                  <Link href="/system-health" className="hover:text-blue-600">
                    System Status
                  </Link>
                </li>
                <li className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  <span>+31 20 123 4567</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Bedrijf</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="/gratis-bhv-software" className="hover:text-blue-600">
                    Gratis Versie
                  </Link>
                </li>
                <li>
                  <Link href="/partner" className="hover:text-blue-600">
                    Partners
                  </Link>
                </li>
                <li>
                  <Link href="/white-label" className="hover:text-blue-600">
                    White Label
                  </Link>
                </li>
                <li className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  <span>info@bhv360.nl</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BHV360Logo size="sm" showText={false} />
              <span className="text-sm text-gray-600">© 2024 BHV360 Platform - Alle rechten voorbehouden</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-500" />
                99.9% Uptime
              </span>
              <span className="flex items-center gap-1">
                <Lock className="h-3 w-3 text-blue-500" />
                AVG Compliant
              </span>
              <span className="flex items-center gap-1">
                <Award className="h-3 w-3 text-purple-500" />
                ISO 27001
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
