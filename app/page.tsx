"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { BHV360Logo } from "@/components/bhv360-logo"
import {
  Shield,
  Users,
  MapPin,
  AlertTriangle,
  FileText,
  Smartphone,
  CheckCircle,
  Play,
  Menu,
  X,
  Phone,
  Mail,
  Clock,
} from "lucide-react"

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [formData, setFormData] = useState({
    naam: "",
    email: "",
    telefoon: "",
    bedrijfsnaam: "",
    bericht: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert("Bedankt voor uw aanvraag! We nemen binnen 24 uur contact met u op.")
        setFormData({
          naam: "",
          email: "",
          telefoon: "",
          bedrijfsnaam: "",
          bericht: "",
        })
      } else {
        alert("Er is een fout opgetreden. Probeer het opnieuw of bel ons direct.")
      }
    } catch (error) {
      console.error("Contact form error:", error)
      alert("Er is een fout opgetreden. Probeer het opnieuw of bel ons direct.")
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BHV360Logo size="md" />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  href="#modules"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Modules
                </Link>
                <Link
                  href="#prijzen"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Prijzen
                </Link>
                <Link
                  href="#demos"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Demo's
                </Link>
                <Link
                  href="#contact"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Contact
                </Link>
              </div>
            </div>

            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6 space-x-3">
                <Link href="/login">
                  <Button variant="ghost">Inloggen</Button>
                </Link>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <Link
                href="#modules"
                className="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Modules
              </Link>
              <Link
                href="#prijzen"
                className="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Prijzen
              </Link>
              <Link
                href="#demos"
                className="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Demo's
              </Link>
              <Link
                href="#contact"
                className="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="pt-4 pb-3 border-t border-gray-200">
                <Link href="/login">
                  <Button variant="ghost" className="w-full">
                    Inloggen
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight sm:text-5xl md:text-6xl">
              Professioneel
              <br />
              <span className="text-blue-600">BHV Beheer</span>
              <br />
              Gemaakt Eenvoudig
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              Van papieren chaos naar digitale controle. BHV360 maakt veiligheidsmanagement eenvoudig, compliant en
              effectief voor elke organisatie.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/demo/bhv-status">
                <Button size="lg" className="px-8 py-3">
                  <Play className="mr-2 h-5 w-5" />
                  Bekijk Demo
                </Button>
              </Link>
              <Link href="#contact">
                <Button variant="outline" size="lg" className="px-8 py-3 bg-transparent">
                  30 Dagen Gratis
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* BHV360 Voordelen */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">BHV360 Voordelen</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
              <span className="text-gray-700">100% digitale BHV administratie</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
              <span className="text-gray-700">Interactieve plotkaarten met real-time status</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
              <span className="text-gray-700">Automatische compliance rapportage</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
              <span className="text-gray-700">Mobiele app voor alle BHV'ers</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
              <span className="text-gray-700">Instant incident management</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stop met BHV Frustraties */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Stop met BHV Frustraties</h2>
            <p className="mt-4 text-xl text-gray-600">
              Deze problemen kosten u tijd, geld en zorgen voor compliance risico's
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-white">
              <CardHeader>
                <FileText className="h-8 w-8 text-red-500 mb-2" />
                <CardTitle className="text-red-700">Papieren BHV administratie</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Verloren documenten, verouderde informatie, geen overzicht</p>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardHeader>
                <MapPin className="h-8 w-8 text-red-500 mb-2" />
                <CardTitle className="text-red-700">Onduidelijke evacuatieroutes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Statische plattegronden, geen real-time updates</p>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardHeader>
                <Clock className="h-8 w-8 text-red-500 mb-2" />
                <CardTitle className="text-red-700">Trage incident afhandeling</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Handmatige processen, geen automatisering</p>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardHeader>
                <AlertTriangle className="h-8 w-8 text-red-500 mb-2" />
                <CardTitle className="text-red-700">Geen inzicht in compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Onduidelijke rapportages, geen real-time monitoring</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="prijzen" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Transparante Prijzen</h2>
            <p className="mt-4 text-xl text-gray-600">Kies het plan dat perfect past bij uw organisatie</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Starter Plan */}
            <Card className="bg-white">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-gray-900">Starter</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">€49</span>
                  <span className="text-xl text-gray-500">/maand</span>
                </div>
                <CardDescription className="mt-4">Perfect voor kleine organisaties</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Tot 50 gebruikers</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Basis plotkaarten</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Incident registratie</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Email ondersteuning</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Standaard rapportages</span>
                  </li>
                </ul>
                <div className="mt-8">
                  <Link href="#contact">
                    <Button className="w-full bg-transparent" variant="outline">
                      Start Gratis Trial
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Professional Plan */}
            <Card className="bg-white border-2 border-blue-500 relative">
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600">Meest Populair</Badge>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-gray-900">Professional</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">€149</span>
                  <span className="text-xl text-gray-500">/maand</span>
                </div>
                <CardDescription className="mt-4">Ideaal voor middelgrote bedrijven</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Tot 250 gebruikers</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Geavanceerde plotkaarten</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Real-time monitoring</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Telefoon ondersteuning</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Custom rapportages</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>API integraties</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Multi-locatie support</span>
                  </li>
                </ul>
                <div className="mt-8">
                  <Link href="#contact">
                    <Button className="w-full">Start Gratis Trial</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="bg-white">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-gray-900">Enterprise</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">Op maat</span>
                </div>
                <CardDescription className="mt-4">Voor grote organisaties</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Onbeperkt gebruikers</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>White-label oplossing</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Dedicated support</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Custom ontwikkeling</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>SLA garanties</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>On-premise optie</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Training & consultancy</span>
                  </li>
                </ul>
                <div className="mt-8">
                  <Link href="#contact">
                    <Button className="w-full bg-transparent" variant="outline">
                      Contact Opnemen
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600">Alle plannen bevatten een 30-dagen gratis proefperiode</p>
            <div className="flex justify-center space-x-8 mt-4 text-sm text-gray-500">
              <span>✓ Geen setup kosten</span>
              <span>✓ Maandelijks opzegbaar</span>
              <span>✓ Nederlandse support</span>
            </div>
          </div>
        </div>
      </section>

      {/* BHV360 Modules */}
      <section id="modules" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">BHV360 Modules</h2>
            <p className="mt-4 text-xl text-gray-600">
              Ontdek alle functionaliteiten die BHV360 biedt voor professioneel veiligheidsmanagement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-white">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <Shield className="h-8 w-8 text-blue-600" />
                  <span className="text-2xl font-bold text-blue-600">€39/maand</span>
                </div>
                <CardTitle>BHV Dashboard</CardTitle>
                <CardDescription>Complete BHV administratie met certificering tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/demo/bhv-status">
                  <Button variant="outline" className="w-full bg-transparent">
                    Meer Info
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <MapPin className="h-8 w-8 text-green-600" />
                  <span className="text-2xl font-bold text-green-600">€29/maand</span>
                </div>
                <CardTitle>Interactieve Plotkaarten</CardTitle>
                <CardDescription>Digitale plattegronden met real-time status</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/demo/plotkaart-editor">
                  <Button variant="outline" className="w-full bg-transparent">
                    Meer Info
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                  <span className="text-2xl font-bold text-red-600">€49/maand</span>
                </div>
                <CardTitle>Incident Management</CardTitle>
                <CardDescription>Snelle incident registratie met workflows</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/demo/incident-simulator">
                  <Button variant="outline" className="w-full bg-transparent">
                    Meer Info
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <Users className="h-8 w-8 text-purple-600" />
                  <span className="text-2xl font-bold text-purple-600">€35/maand</span>
                </div>
                <CardTitle>Bezoeker Registratie</CardTitle>
                <CardDescription>Professionele bezoeker check-in systeem</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/visitor-registration">
                  <Button variant="outline" className="w-full bg-transparent">
                    Meer Info
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <FileText className="h-8 w-8 text-orange-600" />
                  <span className="text-2xl font-bold text-orange-600">€25/maand</span>
                </div>
                <CardTitle>Analytics & Rapportage</CardTitle>
                <CardDescription>Uitgebreide analytics en compliance rapportage</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/beheer/rapportages">
                  <Button variant="outline" className="w-full bg-transparent">
                    Meer Info
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <Smartphone className="h-8 w-8 text-indigo-600" />
                  <span className="text-2xl font-bold text-indigo-600">€19/maand</span>
                </div>
                <CardTitle>Mobiele App</CardTitle>
                <CardDescription>Complete mobiele toegang voor BHV'ers</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/mobile-app">
                  <Button variant="outline" className="w-full bg-transparent">
                    Meer Info
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Bewezen Resultaten */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Bewezen Resultaten</h2>
            <p className="mt-4 text-xl text-gray-600">Onze klanten zien direct resultaat</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">75%</div>
              <div className="text-xl font-semibold text-gray-900 mb-1">Tijd besparing</div>
              <div className="text-gray-600">Minder administratie</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">98%</div>
              <div className="text-xl font-semibold text-gray-900 mb-1">Compliance score</div>
              <div className="text-gray-600">Verhoogde compliance</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">60%</div>
              <div className="text-xl font-semibold text-gray-900 mb-1">Incident respons</div>
              <div className="text-gray-600">Snellere afhandeling</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">€15.000</div>
              <div className="text-xl font-semibold text-gray-900 mb-1">Kosten reductie</div>
              <div className="text-gray-600">Jaarlijkse besparing</div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demos" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Ervaar BHV360 in Actie</h2>
            <p className="mt-4 text-xl text-gray-600">
              Ontdek hoe BHV360 werkt met onze interactieve demo's. Geen registratie vereist.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white">
              <CardHeader>
                <Shield className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>BHV Dashboard</CardTitle>
                <CardDescription>
                  Bekijk het complete BHV dashboard met team overzicht en certificeringen.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/demo/bhv-status">
                  <Button className="w-full">
                    <Play className="mr-2 h-4 w-4" />
                    Start Demo
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardHeader>
                <MapPin className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>Plotkaart Editor</CardTitle>
                <CardDescription>Ervaar hoe eenvoudig het is om interactieve plotkaarten te maken.</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/demo/plotkaart-editor">
                  <Button className="w-full">
                    <Play className="mr-2 h-4 w-4" />
                    Start Demo
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardHeader>
                <AlertTriangle className="h-8 w-8 text-red-600 mb-2" />
                <CardTitle>Incident Simulator</CardTitle>
                <CardDescription>Simuleer een noodsituatie en zie hoe BHV360 automatisch reageert.</CardDescription>
              </CardHeader>
              <CardContent>
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
              <Button variant="outline" size="lg">
                Alle Demo's Bekijken
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Waarom 500+ Organisaties Kiezen voor BHV360</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-gray-50">
              <CardContent className="pt-6">
                <p className="text-gray-700 mb-4">
                  "BHV360 heeft onze BHV administratie van chaos naar complete controle gebracht. Aanrader!"
                </p>
                <div className="text-sm text-gray-600">- Jan Bakker, Facility Manager</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-50">
              <CardContent className="pt-6">
                <p className="text-gray-700 mb-4">
                  "Eindelijk een systeem dat werkt! Compliance is nu een fluitje van een cent."
                </p>
                <div className="text-sm text-gray-600">- Maria de Vries, HR Manager</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-50">
              <CardContent className="pt-6">
                <p className="text-gray-700 mb-4">
                  "De ROI was binnen 3 maanden zichtbaar. Tijd en kosten besparing is enorm."
                </p>
                <div className="text-sm text-gray-600">- Peter Jansen, Operations Director</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Krijg Uw Persoonlijke Demo</h3>
              <p className="text-gray-600 mb-6">
                Zie hoe BHV360 uw specifieke uitdagingen oplost. Gratis demo op maat van uw organisatie.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="naam" className="block text-sm font-medium text-gray-700 mb-1">
                    Naam *
                  </label>
                  <Input
                    id="naam"
                    name="naam"
                    type="text"
                    required
                    placeholder="Uw volledige naam"
                    value={formData.naam}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    E-mail *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="uw.email@bedrijf.nl"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label htmlFor="telefoon" className="block text-sm font-medium text-gray-700 mb-1">
                    Telefoon
                  </label>
                  <Input
                    id="telefoon"
                    name="telefoon"
                    type="tel"
                    placeholder="+31 6 12345678"
                    value={formData.telefoon}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label htmlFor="bedrijfsnaam" className="block text-sm font-medium text-gray-700 mb-1">
                    Bedrijfsnaam *
                  </label>
                  <Input
                    id="bedrijfsnaam"
                    name="bedrijfsnaam"
                    type="text"
                    required
                    placeholder="Uw bedrijfsnaam"
                    value={formData.bedrijfsnaam}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label htmlFor="bericht" className="block text-sm font-medium text-gray-700 mb-1">
                    Aanvullende Informatie
                  </label>
                  <Textarea
                    id="bericht"
                    name="bericht"
                    rows={4}
                    placeholder="Vertel ons meer over uw specifieke situatie..."
                    value={formData.bericht}
                    onChange={handleInputChange}
                  />
                </div>

                <Button type="submit" className="w-full">
                  Gratis Demo Aanvragen
                </Button>
              </form>

              <div className="mt-4 text-sm text-gray-500 text-center">
                ✓ Geen verplichtingen ✓ Binnen 24 uur reactie ✓ Op maat van uw organisatie
              </div>
            </div>

            {/* Contact Info */}
            <div className="text-white">
              <h3 className="text-2xl font-bold mb-6">Direct Contact</h3>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">Sales & Demo's</h4>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-5 w-5" />
                    <a href="mailto:info@BHV360.nl" className="hover:underline">
                      info@BHV360.nl
                    </a>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Direct Bellen</h4>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-5 w-5" />
                    <a href="tel:033-4614303" className="hover:underline">
                      033-4614303
                    </a>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Reactietijd</h4>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>Binnen 4 uur op werkdagen</span>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <h4 className="font-semibold mb-4">Wat u krijgt</h4>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5" />
                    <span>Persoonlijke demo op maat</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5" />
                    <span>ROI berekening voor uw situatie</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5" />
                    <span>Implementatie roadmap</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5" />
                    <span>30 dagen gratis proefperiode</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5" />
                    <span>Gratis training voor uw team</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 p-4 bg-blue-700 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold">320%</div>
                  <div className="text-sm">Gemiddelde ROI</div>
                  <div className="text-xs">Binnen 12 maanden</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <BHV360Logo variant="white" size="md" />
              <p className="mt-4 text-gray-400 max-w-md">
                BHV software van Nederland. Vertrouwd door 500+ organisaties voor professioneel veiligheidsmanagement.
              </p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <a href="mailto:info@BHV360.nl" className="text-sm hover:underline">
                    info@BHV360.nl
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <a href="tel:033-4614303" className="text-sm hover:underline">
                    033-4614303
                  </a>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#demos" className="text-gray-300 hover:text-white">
                    Demo's
                  </Link>
                </li>
                <li>
                  <Link href="#modules" className="text-gray-300 hover:text-white">
                    Modules
                  </Link>
                </li>
                <li>
                  <Link href="/demo/plotkaart-editor" className="text-gray-300 hover:text-white">
                    Plotkaarten
                  </Link>
                </li>
                <li>
                  <Link href="/demo/incident-simulator" className="text-gray-300 hover:text-white">
                    Incidenten
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/help" className="text-gray-300 hover:text-white">
                    Helpdesk
                  </Link>
                </li>
                <li>
                  <Link href="/video-tutorials" className="text-gray-300 hover:text-white">
                    Training
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="text-gray-300 hover:text-white">
                    Inloggen
                  </Link>
                </li>
                <li>
                  <Link href="/system-health" className="text-gray-300 hover:text-white">
                    Status
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">© 2025 BHV360 - BHV Software van Nederland</p>
              <div className="mt-4 md:mt-0 flex space-x-6 text-sm text-gray-400">
                <span>✓ GDPR Compliant</span>
                <span>✓ Voldoet aan ISO Standaarden</span>
                <span>✓ Nederlandse Support</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
