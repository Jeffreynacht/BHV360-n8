"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Building2,
  Shield,
  Users,
  AlertTriangle,
  MapPin,
  Smartphone,
  CheckCircle,
  ArrowRight,
  Star,
} from "lucide-react"
import Link from "next/link"

const features = [
  {
    icon: MapPin,
    title: "Interactieve Plotkaarten",
    description: "Digitale plattegronden met real-time BHV informatie en evacuatieroutes",
  },
  {
    icon: Shield,
    title: "BHV Management",
    description: "Complete beheer van BHV teams, certificeringen en roosters",
  },
  {
    icon: AlertTriangle,
    title: "Incident Management",
    description: "Snelle registratie en afhandeling van veiligheidsincidenten",
  },
  {
    icon: Smartphone,
    title: "Mobile Ready",
    description: "Toegang tot alle functies via smartphone en tablet",
  },
  {
    icon: Users,
    title: "Multi-tenant",
    description: "Beheer meerdere organisaties vanuit één platform",
  },
  {
    icon: CheckCircle,
    title: "Compliance",
    description: "Voldoe aan alle Nederlandse BHV wetgeving en normen",
  },
]

export default function HomePage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push("/dashboard")
    }
  }, [user, router])

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Doorverwijzen naar dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600 mr-3" />
              <span className="text-2xl font-bold text-gray-900">BHV360</span>
              <Badge variant="secondary" className="ml-3">
                Professional
              </Badge>
            </div>
            <Link href="/login">
              <Button>
                Inloggen
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Professionele
            <span className="text-blue-600 block">BHV Software</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Complete oplossing voor bedrijfshulpverlening. Beheer je BHV teams, plotkaarten en incidenten vanuit één
            overzichtelijk platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="text-lg px-8 py-3">
                Start Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3 bg-transparent">
              Meer Informatie
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Alles wat je nodig hebt</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              BHV360 biedt alle tools die je nodig hebt voor professioneel bedrijfshulpverleningsmanagement
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <IconComponent className="h-6 w-6 text-blue-600" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Klaar om te beginnen?</h2>
          <p className="text-xl text-blue-100 mb-8">Probeer BHV360 gratis uit met onze demo accounts</p>
          <Link href="/login">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              <Star className="mr-2 h-5 w-5" />
              Start Gratis Demo
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <Building2 className="h-6 w-6 text-blue-400 mr-2" />
            <span className="text-lg font-semibold">BHV360</span>
            <span className="ml-4 text-gray-400">© 2024 Professional Safety Management Platform</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
