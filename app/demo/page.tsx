"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Shield, Users, AlertTriangle, UserCheck, BarChart3, Smartphone, ArrowRight, Play } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

const demoModules = [
  {
    id: "bhv-dashboard",
    title: "BHV Team Dashboard",
    description: "Overzicht van uw BHV team, certificeringen en beschikbaarheid",
    icon: Shield,
    color: "bg-blue-500",
    href: "/demo/bhv-status",
    features: ["Team overzicht", "Certificering status", "Beschikbaarheid tracking"],
  },
  {
    id: "plotkaart-editor",
    title: "Interactieve Plotkaart",
    description: "Bewerk en beheer uw evacuatieplattegronden met drag-and-drop editor",
    icon: Users,
    color: "bg-green-500",
    href: "/demo/plotkaart-editor",
    features: ["Drag & drop editor", "Veiligheidsiconen", "PDF export"],
  },
  {
    id: "incident-management",
    title: "Incident Management",
    description: "Registreer en volg incidenten met real-time updates",
    icon: AlertTriangle,
    color: "bg-red-500",
    href: "/demo/incident-simulator",
    features: ["Real-time meldingen", "Workflow management", "Rapportage"],
  },
  {
    id: "visitor-registration",
    title: "Bezoekersregistratie",
    description: "Digitale in- en uitcheck voor bezoekers en aannemers",
    icon: UserCheck,
    color: "bg-purple-500",
    href: "/visitor-registration",
    features: ["QR code check-in", "Digitale badges", "Automatische notificaties"],
  },
  {
    id: "analytics",
    title: "Analytics & Rapportage",
    description: "Uitgebreide analyses en rapporten van uw BHV activiteiten",
    icon: BarChart3,
    color: "bg-orange-500",
    href: "/beheer/rapportages",
    features: ["Dashboard analytics", "Custom rapporten", "Data export"],
  },
  {
    id: "mobile-app",
    title: "Mobiele App",
    description: "BHV360 onderweg - volledige functionaliteit op uw smartphone",
    icon: Smartphone,
    color: "bg-indigo-500",
    href: "/mobile-app",
    features: ["Offline functionaliteit", "Push notificaties", "GPS tracking"],
  },
]

export default function DemoPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the plotkaart-editor demo page
    router.push("/demo/plotkaart-editor")
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">BHV360 Demo</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ontdek de kracht van BHV360 met onze interactieve demo modules. Geen registratie vereist - begin direct met
            verkennen!
          </p>
          <Badge variant="secondary" className="mt-4">
            <Play className="h-4 w-4 mr-2" />
            Live Demo - Geen Login Vereist
          </Badge>
        </div>

        {/* Demo Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {demoModules.map((module) => {
            const IconComponent = module.icon
            return (
              <Card key={module.id} className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`p-3 rounded-full ${module.color} text-white`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{module.title}</CardTitle>
                    </div>
                  </div>
                  <CardDescription className="text-gray-600">{module.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      {module.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    <Link href={module.href}>
                      <Button className="w-full group">
                        Demo Starten
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-blue-500 to-green-500 text-white border-0">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Klaar om te beginnen?</h2>
              <p className="text-blue-100 mb-6">
                Ontdek hoe BHV360 uw bedrijfshulpverlening naar het volgende niveau kan tillen.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button size="lg" variant="secondary" className="text-blue-600">
                    Gratis Account Aanmaken
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-white border-white hover:bg-white hover:text-blue-600 bg-transparent"
                  >
                    Inloggen
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
