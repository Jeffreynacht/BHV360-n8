"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  Users,
  MapPin,
  AlertTriangle,
  Building2,
  Heart,
  ArrowLeft,
  Play,
  Eye,
  MousePointer,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function DemoOverviewPage() {
  const demoModules = [
    {
      icon: Shield,
      title: "BHV Status Dashboard",
      description: "Bekijk real-time BHV aanwezigheid en status van alle medewerkers",
      color: "text-red-600",
      url: "/demo/bhv-status",
      features: ["Live status updates", "Certificering tracking", "Beschikbaarheid overzicht"],
    },
    {
      icon: MapPin,
      title: "Plotkaart Editor",
      description: "Interactieve editor voor het maken en bewerken van veiligheidsplattegronden",
      color: "text-blue-600",
      url: "/demo/plotkaart-editor",
      features: ["Drag & drop interface", "Veiligheidsiconen", "Real-time preview"],
    },
    {
      icon: AlertTriangle,
      title: "Incident Simulator",
      description: "Simuleer noodsituaties en bekijk hoe het systeem reageert",
      color: "text-orange-600",
      url: "/demo/incident-simulator",
      features: ["Noodmelding simulatie", "Escalatie procedures", "Communicatie flows"],
    },
    {
      icon: Users,
      title: "Gebruikersbeheer",
      description: "Beheer gebruikers, rollen en certificeringen",
      color: "text-green-600",
      url: "/demo/gebruikers-demo",
      features: ["Rollenbeleid", "Certificering tracking", "Gebruikersgroepen"],
    },
    {
      icon: Building2,
      title: "Multi-locatie Beheer",
      description: "Schakel tussen verschillende locaties en gebouwen",
      color: "text-purple-600",
      url: "/demo/multi-locatie",
      features: ["Locatie switching", "Centraal dashboard", "Locatie-specifieke data"],
    },
    {
      icon: Heart,
      title: "EHBO Monitoring",
      description: "Monitor EHBO voorraad en AED status",
      color: "text-pink-600",
      url: "/demo/ehbo-monitoring",
      features: ["Voorraad tracking", "Onderhoudsschema's", "Vervaldatum alerts"],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center text-blue-600 hover:text-blue-700">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Terug naar homepage
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              <Image
                src="/images/bhv360-logo.png"
                alt="BHV360 Logo"
                width={32}
                height={32}
                className="rounded-lg shadow-sm"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">BHV360 Demo</h1>
                <p className="text-xs text-gray-600">Interactieve demonstratie</p>
              </div>
            </div>
            <Link href="/login">
              <Button>Inloggen</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="secondary" className="mb-4">
            🎮 Interactieve Demo
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Ontdek de kracht van{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">BHV360</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Probeer alle functies van BHV360 in deze interactieve demo. Geen registratie vereist - begin direct met
            verkennen!
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-500">
            <div className="flex items-center">
              <Eye className="h-4 w-4 text-blue-500 mr-2" />
              Bekijk real-time data
            </div>
            <div className="flex items-center">
              <MousePointer className="h-4 w-4 text-green-500 mr-2" />
              Interactieve elementen
            </div>
            <div className="flex items-center">
              <Play className="h-4 w-4 text-purple-500 mr-2" />
              Live simulaties
            </div>
          </div>
        </div>
      </section>

      {/* Demo Modules */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {demoModules.map((module, index) => {
              const IconComponent = module.icon
              return (
                <Card
                  key={index}
                  className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg group"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl group-hover:scale-110 transition-transform">
                        <IconComponent className={`h-7 w-7 ${module.color}`} />
                      </div>
                      <CardTitle className="text-xl">{module.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-base mb-4 leading-relaxed">{module.description}</CardDescription>
                    <ul className="space-y-2 mb-6">
                      {module.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 flex-shrink-0"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link href={module.url}>
                      <Button className="w-full group-hover:bg-blue-600 transition-colors">
                        <Play className="mr-2 h-4 w-4" />
                        Start Demo
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Quick Access */}
      <section className="py-16 bg-white/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Snel aan de slag</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Volledige Demo Tour</h3>
              <p className="text-gray-600 mb-4">Bekijk alle modules in één gestructureerde tour met uitleg en tips.</p>
              <Link href="/demo/guided-tour">
                <Button className="w-full">
                  <Play className="mr-2 h-4 w-4" />
                  Start Guided Tour
                </Button>
              </Link>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Direct Inloggen</h3>
              <p className="text-gray-600 mb-4">
                Klaar om te beginnen? Log in met een demo account en verken het volledige platform.
              </p>
              <Link href="/login">
                <Button variant="outline" className="w-full bg-transparent">
                  <Shield className="mr-2 h-4 w-4" />
                  Naar Login
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Image src="/images/bhv360-logo.png" alt="BHV360 Logo" width={32} height={32} className="rounded" />
            <span className="text-xl font-bold">BHV360</span>
          </div>
          <p className="text-gray-400 mb-6">
            Ontdek hoe BHV360 uw veiligheidsorganisatie kan transformeren. Probeer alle functies gratis uit.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button variant="secondary">Start Gratis Trial</Button>
            </Link>
            <Link href="/">
              <Button
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-gray-900 bg-transparent"
              >
                Terug naar Homepage
              </Button>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
