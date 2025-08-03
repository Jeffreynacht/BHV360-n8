"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Users, MapPin, AlertTriangle, Building2, Heart, Video } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  const { user } = useAuth()
  const router = useRouter()

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (user) {
      router.push("/dashboard")
    }
  }, [user, router])

  const features = [
    {
      icon: Shield,
      title: "BHV Management",
      description: "Complete BHV organisatie en coördinatie",
      color: "text-red-600",
    },
    {
      icon: MapPin,
      title: "Interactieve Plotkaarten",
      description: "Digitale veiligheidsplattegronden met real-time updates",
      color: "text-blue-600",
    },
    {
      icon: AlertTriangle,
      title: "Incident Management",
      description: "Registratie en opvolging van veiligheidsincidenten",
      color: "text-orange-600",
    },
    {
      icon: Users,
      title: "Gebruikersbeheer",
      description: "Beheer van BHV-ers, certificeringen en rollen",
      color: "text-green-600",
    },
    {
      icon: Building2,
      title: "Multi-locatie Support",
      description: "Beheer meerdere gebouwen en locaties",
      color: "text-purple-600",
    },
    {
      icon: Heart,
      title: "EHBO & AED Monitoring",
      description: "Tracking van EHBO voorraad en AED status",
      color: "text-pink-600",
    },
  ]

  const stats = [
    { label: "Actieve Organisaties", value: "500+" },
    { label: "BHV-ers Beheerd", value: "10,000+" },
    { label: "Incidenten Geregistreerd", value: "25,000+" },
    { label: "Uptime", value: "99.9%" },
  ]

  if (user) {
    return null // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Image
                src="/images/bhv360-logo.png"
                alt="BHV360 Logo"
                width={48}
                height={48}
                className="rounded-lg shadow-sm"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">BHV360</h1>
                <p className="text-sm text-gray-600">Safety Management Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="outline">Inloggen</Button>
              </Link>
              <Link href="/dashboard">
                <Button>Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Professioneel{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">
                BHV Management
              </span>{" "}
              Platform
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Beheer uw BHV organisatie, plotkaarten, incidenten en certificeringen in één gebruiksvriendelijk platform.
              Speciaal ontwikkeld voor Jeffrey Nachtegaal.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button size="lg" className="text-lg px-8 py-3">
                  <Shield className="mr-2 h-5 w-5" />
                  Start Dashboard
                </Button>
              </Link>
              <Link href="/plotkaart">
                <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                  <MapPin className="mr-2 h-5 w-5" />
                  Bekijk Plotkaart
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Alles wat u nodig heeft</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Een complete oplossing voor BHV management met alle tools die u nodig heeft voor effectieve
              veiligheidsbeheer.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <IconComponent className={`h-6 w-6 ${feature.color}`} />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
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
      <section className="py-20 bg-gradient-to-r from-red-600 to-orange-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Klaar om te beginnen?</h2>
          <p className="text-xl text-red-100 mb-8">
            Start vandaag nog met professioneel BHV management voor uw organisatie.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                Ga naar Dashboard
              </Button>
            </Link>
            <Link href="/help">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-3 text-white border-white hover:bg-white hover:text-red-600"
              >
                <Video className="mr-2 h-5 w-5" />
                Bekijk Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <Image src="/images/bhv360-logo.png" alt="BHV360 Logo" width={32} height={32} className="rounded" />
                <span className="text-xl font-bold">BHV360</span>
              </div>
              <p className="text-gray-400 mb-4">
                Professioneel BHV management platform voor moderne organisaties. Ontwikkeld met focus op gebruiksgemak
                en effectiviteit.
              </p>
              <Badge variant="secondary">Ontwikkeld voor Jeffrey Nachtegaal</Badge>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/dashboard" className="hover:text-white">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/plotkaart" className="hover:text-white">
                    Plotkaarten
                  </Link>
                </li>
                <li>
                  <Link href="/bhv" className="hover:text-white">
                    BHV Management
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
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white">
                    Documentatie
                  </Link>
                </li>
                <li>
                  <Link href="/video-tutorials" className="hover:text-white">
                    Video Tutorials
                  </Link>
                </li>
                <li>
                  <Link href="/site-map" className="hover:text-white">
                    Site Map
                  </Link>
                </li>
                <li>
                  <Link href="/debug" className="hover:text-white">
                    System Status
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 BHV360. Alle rechten voorbehouden. Ontwikkeld voor Jeffrey Nachtegaal.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
