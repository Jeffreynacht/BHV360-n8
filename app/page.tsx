"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Users, AlertTriangle, MapPin, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isLoading && user) {
      // Redirect authenticated users to dashboard
      router.push("/dashboard")
    }
  }, [user, isLoading, mounted, router])

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (user) {
    return null // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">BHV360</h1>
            </div>
            <div className="flex space-x-4">
              <Link href="/login">
                <Button variant="outline">Inloggen</Button>
              </Link>
              <Link href="/register">
                <Button>Registreren</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">Professioneel BHV Management</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Complete oplossing voor bedrijfshulpverlening. Beheer uw BHV team, incidenten, bezoekers en meer vanuit één
            centraal platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="px-8 py-3">
                Gratis Proberen
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="outline" size="lg" className="px-8 py-3 bg-transparent">
                Demo Bekijken
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Alles wat u nodig heeft voor BHV</h2>
            <p className="text-lg text-gray-600">
              Van incident management tot bezoekersregistratie - alles in één platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <AlertTriangle className="h-8 w-8 text-red-500 mb-2" />
                <CardTitle>Incident Management</CardTitle>
                <CardDescription>Registreer en beheer incidenten in real-time</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Real-time meldingen
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Automatische rapportage
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Escalatie procedures
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-blue-500 mb-2" />
                <CardTitle>Team Management</CardTitle>
                <CardDescription>Beheer uw BHV team en certificeringen</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Certificaat tracking
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Rooster planning
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Competentie matrix
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <MapPin className="h-8 w-8 text-green-500 mb-2" />
                <CardTitle>Plotkaart Editor</CardTitle>
                <CardDescription>Interactieve plattegronden met veiligheidsvoorzieningen</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Drag & drop editor
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Veiligheidsiconen
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    PDF export
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Clock className="h-8 w-8 text-purple-500 mb-2" />
                <CardTitle>Bezoekersregistratie</CardTitle>
                <CardDescription>Digitale in- en uitchecking voor bezoekers</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    QR code check-in
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Aanwezigheidsoverzicht
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Evacuatie lijsten
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-8 w-8 text-orange-500 mb-2" />
                <CardTitle>Compliance</CardTitle>
                <CardDescription>Voldoe aan alle wettelijke vereisten</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Automatische rapporten
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Audit trails
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Wettelijke updates
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-indigo-500 mb-2" />
                <CardTitle>Multi-tenant</CardTitle>
                <CardDescription>Geschikt voor organisaties van elke grootte</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Meerdere locaties
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Rol-gebaseerde toegang
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    White-label opties
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Transparante Prijzen</h2>
            <p className="text-lg text-gray-600">Kies het plan dat bij uw organisatie past</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Starter</CardTitle>
                <CardDescription>Voor kleine organisaties</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">€29</span>
                  <span className="text-gray-600">/maand</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>Tot 25 gebruikers</li>
                  <li>Basis incident management</li>
                  <li>Plotkaart editor</li>
                  <li>Email ondersteuning</li>
                </ul>
                <Button className="w-full mt-6 bg-transparent" variant="outline">
                  Probeer Gratis
                </Button>
              </CardContent>
            </Card>

            <Card className="border-blue-500 border-2">
              <CardHeader>
                <Badge className="w-fit mb-2">Populair</Badge>
                <CardTitle>Professional</CardTitle>
                <CardDescription>Voor groeiende organisaties</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">€79</span>
                  <span className="text-gray-600">/maand</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>Tot 100 gebruikers</li>
                  <li>Geavanceerd incident management</li>
                  <li>Bezoekersregistratie</li>
                  <li>Rapportage & analytics</li>
                  <li>Telefoon ondersteuning</li>
                </ul>
                <Button className="w-full mt-6">Start Nu</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Enterprise</CardTitle>
                <CardDescription>Voor grote organisaties</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">€199</span>
                  <span className="text-gray-600">/maand</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>Onbeperkt gebruikers</li>
                  <li>Alle functies</li>
                  <li>White-label opties</li>
                  <li>API toegang</li>
                  <li>Dedicated support</li>
                </ul>
                <Button className="w-full mt-6 bg-transparent" variant="outline">
                  Contact Opnemen
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Klaar om te beginnen?</h2>
          <p className="text-xl text-blue-100 mb-8">Start vandaag nog met een gratis proefperiode van 30 dagen</p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="px-8 py-3">
              Gratis Proberen
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Shield className="h-6 w-6 text-blue-400 mr-2" />
                <span className="text-lg font-bold">BHV360</span>
              </div>
              <p className="text-gray-400">Professioneel BHV management platform voor moderne organisaties.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/features">Functies</Link>
                </li>
                <li>
                  <Link href="/pricing">Prijzen</Link>
                </li>
                <li>
                  <Link href="/demo">Demo</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Ondersteuning</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help">Help Center</Link>
                </li>
                <li>
                  <Link href="/contact">Contact</Link>
                </li>
                <li>
                  <Link href="/status">Status</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Bedrijf</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about">Over Ons</Link>
                </li>
                <li>
                  <Link href="/privacy">Privacy</Link>
                </li>
                <li>
                  <Link href="/terms">Voorwaarden</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 BHV360. Alle rechten voorbehouden.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
