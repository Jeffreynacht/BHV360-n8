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
  Clock,
  Star,
  ArrowRight,
  CheckCircle,
  MapPin,
  AlertTriangle,
  Heart,
  FileText,
  Globe,
  Award,
  TrendingUp,
  Phone,
  Mail,
  ExternalLink,
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
        // Fallback to text logo if image fails
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
  const [currentDemo, setCurrentDemo] = useState(0)
  const [countdown, setCountdown] = useState(10)

  const demos = [
    {
      title: "Plotkaart Editor",
      description: "Interactieve plattegronden met BHV voorzieningen",
      icon: MapPin,
      color: "bg-blue-500",
    },
    {
      title: "Incident Management",
      description: "Real-time incident tracking en communicatie",
      icon: AlertTriangle,
      color: "bg-red-500",
    },
    {
      title: "BHV Status Dashboard",
      description: "Live overzicht van BHV'ers en hun beschikbaarheid",
      icon: Users,
      color: "bg-green-500",
    },
    {
      title: "AED Monitoring",
      description: "Automatische monitoring van AED status",
      icon: Heart,
      color: "bg-purple-500",
    },
  ]

  const modules = [
    {
      name: "Plotkaart Editor Pro",
      description: "Geavanceerde plattegrond editor met 3D visualisatie",
      price: "€25/maand",
      popular: true,
      features: ["3D Visualisatie", "CAD Import", "Real-time Updates"],
    },
    {
      name: "Incident Response Suite",
      description: "Complete incident management en communicatie",
      price: "€35/maand",
      popular: false,
      features: ["SMS Alerts", "Push Notifications", "Escalatie Matrix"],
    },
    {
      name: "Compliance Tracker",
      description: "Automatische compliance monitoring en rapportage",
      price: "€20/maand",
      popular: false,
      features: ["Auto Rapporten", "Audit Trail", "Certificering"],
    },
  ]

  const testimonials = [
    {
      name: "Jan van der Berg",
      company: "Provincie Noord-Brabant",
      role: "BHV Coördinator",
      content: "BHV360 heeft onze BHV organisatie volledig getransformeerd. De real-time inzichten zijn onmisbaar.",
      rating: 5,
    },
    {
      name: "Maria Janssen",
      company: "Ziekenhuis Amphia",
      role: "Facility Manager",
      content: "De automatische AED monitoring heeft ons al meerdere keren geholpen. Uitstekende software!",
      rating: 5,
    },
    {
      name: "Peter de Vries",
      company: "Shell Nederland",
      role: "HSE Manager",
      content: "Eindelijk een BHV systeem dat écht werkt. De compliance rapportage bespaart ons uren werk.",
      rating: 5,
    },
  ]

  useEffect(() => {
    const demoInterval = setInterval(() => {
      setCurrentDemo((prev) => (prev + 1) % demos.length)
    }, 3000)

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          window.location.href = "/dashboard"
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      clearInterval(demoInterval)
      clearInterval(countdownInterval)
    }
  }, [demos.length])

  const currentDemoData = demos[currentDemo]
  const IconComponent = currentDemoData.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <BHV360Logo className="h-8 w-auto" />
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Clock className="h-3 w-3 mr-1" />
                Auto-redirect in {countdown}s
              </Badge>
              <Button asChild>
                <Link href="/dashboard">
                  Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <BHV360Logo className="h-16 w-auto mx-auto mb-8" />
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              De Toekomst van <span className="text-red-600">BHV Management</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              BHV360 is het meest geavanceerde platform voor Bedrijfshulpverlening. Van interactieve plotkaarten tot
              real-time incident management - alles wat je nodig hebt voor professionele BHV organisatie.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                <div className="text-gray-600">Tevreden Klanten</div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="text-3xl font-bold text-green-600 mb-2">99.9%</div>
                <div className="text-gray-600">Uptime Garantie</div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
                <div className="text-gray-600">Support</div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="text-3xl font-bold text-red-600 mb-2">ISO</div>
                <div className="text-gray-600">Gecertificeerd</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-red-600 hover:bg-red-700" asChild>
                <Link href="/dashboard">
                  Start Gratis Trial <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/demo/overview">
                  Bekijk Demo <ExternalLink className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Live Demo Carousel */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Live Demo Showcase</h2>
            <p className="text-gray-600">Zie onze modules in actie</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${currentDemoData.color}`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-white">{currentDemoData.title}</CardTitle>
                    <CardDescription className="text-blue-100">{currentDemoData.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                  <div className="text-center">
                    <IconComponent className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Demo van {currentDemoData.title}</p>
                    <Button className="mt-4" asChild>
                      <Link href="/demo/overview">Volledige Demo Bekijken</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Demo Navigation */}
            <div className="flex justify-center mt-6 space-x-2">
              {demos.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentDemo ? "bg-blue-600" : "bg-gray-300"
                  }`}
                  onClick={() => setCurrentDemo(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Module Marketplace */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Populaire Modules</h2>
            <p className="text-gray-600">Kies de modules die perfect bij jouw organisatie passen</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {modules.map((module, index) => (
              <Card key={index} className={`relative ${module.popular ? "ring-2 ring-blue-500" : ""}`}>
                {module.popular && (
                  <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-500">Populair</Badge>
                )}
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {module.name}
                    <span className="text-lg font-bold text-green-600">{module.price}</span>
                  </CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {module.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" variant={module.popular ? "default" : "outline"}>
                    Module Activeren
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Models */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Flexibele Prijsmodellen</h2>
            <p className="text-gray-600">Kies het model dat het beste bij jouw organisatie past</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Per Gebruiker</CardTitle>
                <CardDescription>Ideaal voor groeiende teams</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600 mb-2">€6-25</div>
                <div className="text-gray-600 mb-4">per gebruiker/maand</div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Basis: €6/gebruiker</li>
                  <li>• Professional: €15/gebruiker</li>
                  <li>• Enterprise: €25/gebruiker</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center ring-2 ring-blue-500">
              <CardHeader>
                <Building2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Per Gebouw</CardTitle>
                <CardDescription>Perfect voor meerdere locaties</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 mb-2">€35-150</div>
                <div className="text-gray-600 mb-4">per gebouw/maand</div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Klein gebouw: €35/maand</li>
                  <li>• Middelgroot: €75/maand</li>
                  <li>• Groot complex: €150/maand</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Globe className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>Per Organisatie</CardTitle>
                <CardDescription>Voor enterprise klanten</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600 mb-2">€120-800</div>
                <div className="text-gray-600 mb-4">vast tarief/maand</div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Starter: €120/maand</li>
                  <li>• Business: €350/maand</li>
                  <li>• Enterprise: €800/maand</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Wat Onze Klanten Zeggen</h2>
            <p className="text-gray-600">Meer dan 500 organisaties vertrouwen op BHV360</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white">
                <CardHeader>
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardDescription className="text-gray-700 italic">"{testimonial.content}"</CardDescription>
                </CardHeader>
                <CardContent>
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

      {/* Quick Actions */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Snelle Toegang</h2>
            <p className="text-gray-600">Direct naar de meest gebruikte functies</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent" asChild>
              <Link href="/plotkaart">
                <MapPin className="h-6 w-6" />
                <span>Plotkaart</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent" asChild>
              <Link href="/incidenten">
                <AlertTriangle className="h-6 w-6" />
                <span>Incidenten</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent" asChild>
              <Link href="/bhv-aanwezigheid">
                <Users className="h-6 w-6" />
                <span>BHV Status</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent" asChild>
              <Link href="/aed-monitoring">
                <Heart className="h-6 w-6" />
                <span>AED Monitor</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Compliance & Security */}
      <section className="py-16 px-4 bg-blue-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Compliance & Beveiliging</h2>
            <p className="text-gray-600">Voldoet aan alle Nederlandse en Europese standaarden</p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-8 max-w-4xl mx-auto">
            <Badge variant="outline" className="px-6 py-3 text-lg bg-white">
              <Shield className="h-5 w-5 mr-2" />
              AVG Compliant
            </Badge>
            <Badge variant="outline" className="px-6 py-3 text-lg bg-white">
              <Award className="h-5 w-5 mr-2" />
              ISO 27001
            </Badge>
            <Badge variant="outline" className="px-6 py-3 text-lg bg-white">
              <FileText className="h-5 w-5 mr-2" />
              NEN 3011
            </Badge>
            <Badge variant="outline" className="px-6 py-3 text-lg bg-white">
              <TrendingUp className="h-5 w-5 mr-2" />
              SOC 2 Type II
            </Badge>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <BHV360Logo className="h-8 w-auto mb-4 brightness-0 invert" />
              <p className="text-gray-400 mb-4">
                Het meest geavanceerde platform voor professionele Bedrijfshulpverlening.
              </p>
              <div className="flex space-x-4">
                <Button size="sm" variant="outline" className="text-white border-gray-600 bg-transparent" asChild>
                  <Link href="tel:+31850606060">
                    <Phone className="h-4 w-4 mr-2" />
                    085-060 60 60
                  </Link>
                </Button>
                <Button size="sm" variant="outline" className="text-white border-gray-600 bg-transparent" asChild>
                  <Link href="mailto:info@bhv360.nl">
                    <Mail className="h-4 w-4 mr-2" />
                    Contact
                  </Link>
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/plotkaart" className="hover:text-white">
                    Plotkaart Editor
                  </Link>
                </li>
                <li>
                  <Link href="/incidenten" className="hover:text-white">
                    Incident Management
                  </Link>
                </li>
                <li>
                  <Link href="/aed-monitoring" className="hover:text-white">
                    AED Monitoring
                  </Link>
                </li>
                <li>
                  <Link href="/mobile-app" className="hover:text-white">
                    Mobile App
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Ondersteuning</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/video-tutorials" className="hover:text-white">
                    Video Tutorials
                  </Link>
                </li>
                <li>
                  <Link href="/setup-demo" className="hover:text-white">
                    Demo Aanvragen
                  </Link>
                </li>
                <li>
                  <Link href="/integrations" className="hover:text-white">
                    Integraties
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Bedrijf</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/gratis-bhv-software" className="hover:text-white">
                    Gratis Versie
                  </Link>
                </li>
                <li>
                  <Link href="/white-label" className="hover:text-white">
                    White Label
                  </Link>
                </li>
                <li>
                  <Link href="/partner" className="hover:text-white">
                    Partner Worden
                  </Link>
                </li>
                <li>
                  <Link href="/system-health" className="hover:text-white">
                    Status Page
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
