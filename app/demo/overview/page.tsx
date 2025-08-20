"use client"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  Users,
  MapPin,
  AlertTriangle,
  BarChart3,
  UserCheck,
  Play,
  ArrowLeft,
  Clock,
  Star,
  Eye,
  Smartphone,
} from "lucide-react"

export default function DemoOverviewPage() {
  const demos = [
    {
      id: "bhv-status",
      title: "BHV Team Dashboard",
      description: "Complete overzicht van uw BHV team, aanwezigheid, certificeringen en status monitoring",
      icon: Shield,
      color: "bg-blue-500",
      duration: "5-10 min",
      difficulty: "Beginner",
      features: ["Team overzicht", "Certificaat tracking", "Aanwezigheid monitoring", "Status dashboard"],
      path: "/demo/bhv-status",
    },
    {
      id: "plotkaart-editor",
      title: "Interactieve Plotkaarten",
      description: "Ervaar hoe eenvoudig het is om digitale plattegronden te maken met BHV voorzieningen",
      icon: MapPin,
      color: "bg-green-500",
      duration: "10-15 min",
      difficulty: "Gemiddeld",
      features: ["Plattegrond upload", "Voorziening markering", "Interactieve navigatie", "Print functionaliteit"],
      path: "/demo/plotkaart-editor",
    },
    {
      id: "incident-simulator",
      title: "Incident Management",
      description: "Simuleer een noodsituatie en zie hoe BHV360 automatisch procedures activeert",
      icon: AlertTriangle,
      color: "bg-red-500",
      duration: "15-20 min",
      difficulty: "Geavanceerd",
      features: ["Incident simulatie", "Automatische workflows", "Team mobilisatie", "Real-time monitoring"],
      path: "/demo/incident-simulator",
    },
    {
      id: "visitor-registration",
      title: "Bezoeker Registratie",
      description: "Professionele bezoeker check-in met veiligheidscheck en evacuatielijsten",
      icon: UserCheck,
      color: "bg-purple-500",
      duration: "5-8 min",
      difficulty: "Beginner",
      features: ["Digitale check-in", "Host notificaties", "Veiligheidscheck", "Evacuatie lijsten"],
      path: "/visitor-registration",
    },
    {
      id: "analytics-dashboard",
      title: "Analytics & Rapportage",
      description: "Uitgebreide dashboards met KPI's, trends en compliance rapportages",
      icon: BarChart3,
      color: "bg-orange-500",
      duration: "8-12 min",
      difficulty: "Gemiddeld",
      features: ["Executive dashboards", "KPI tracking", "Trend analyse", "Compliance reports"],
      path: "/beheer/rapportages",
    },
    {
      id: "mobile-app",
      title: "Mobiele App",
      description: "Complete mobiele ervaring voor BHV'ers en medewerkers onderweg",
      icon: Smartphone,
      color: "bg-indigo-500",
      duration: "6-10 min",
      difficulty: "Beginner",
      features: ["iOS & Android", "Offline functionaliteit", "Push notificaties", "QR scanning"],
      path: "/mobile-app",
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center text-blue-600 hover:text-blue-700">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Terug naar home
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                🎮 Interactieve Demo's
              </Badge>
              <h1 className="text-2xl font-bold text-gray-900">BHV360 Demo Center</h1>
            </div>
            <Link href="/login">
              <Button>
                <Eye className="mr-2 h-4 w-4" />
                Volledige Versie
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Ervaar <span className="text-blue-600">BHV360</span> in Actie
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Ontdek alle mogelijkheden van BHV360 met onze interactieve demo's. Geen registratie vereist - start direct
            met verkennen.
          </p>
          <div className="flex justify-center space-x-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <p className="text-gray-500">Beoordeeld met 4.8/5 sterren door 500+ organisaties</p>
        </div>

        {/* Demo Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {demos.map((demo, index) => (
            <Card key={demo.id} className="hover:shadow-xl transition-all duration-300 group">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 ${demo.color} rounded-lg text-white`}>
                    <demo.icon className="h-8 w-8" />
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className={getDifficultyColor(demo.difficulty)}>
                      {demo.difficulty}
                    </Badge>
                  </div>
                </div>
                <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">{demo.title}</CardTitle>
                <CardDescription className="text-base">{demo.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {demo.duration}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      Demo
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-gray-700">Wat u gaat zien:</h4>
                    <ul className="space-y-1">
                      {demo.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="text-sm text-gray-600 flex items-center">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link href={demo.path}>
                    <Button className="w-full group-hover:bg-blue-700 transition-colors">
                      <Play className="mr-2 h-4 w-4" />
                      Start Demo
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-12 px-8 rounded-2xl">
            <h2 className="text-3xl font-bold mb-4">Klaar voor de Volledige Ervaring?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Deze demo's tonen slechts een fractie van wat BHV360 kan. Ontdek alle functies met een gratis 30-dagen
              proefperiode.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3">
                  <Eye className="mr-2 h-5 w-5" />
                  Start Gratis Proef
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 bg-transparent"
                onClick={() => (window.location.href = "mailto:demo@BHV360.nl")}
              >
                Persoonlijke Demo Aanvragen
              </Button>
            </div>
            <p className="text-sm text-blue-200 mt-6">
              ✓ Geen creditcard vereist ✓ Volledige functionaliteit ✓ Nederlandse support
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
