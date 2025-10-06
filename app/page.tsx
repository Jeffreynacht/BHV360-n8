import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Shield, Users, Zap, Phone, Mail, MapPin, ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">BHV360</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                Functies
              </Link>
              <Link href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
                Prijzen
              </Link>
              <Link href="#contact" className="text-gray-600 hover:text-gray-900 transition-colors">
                Contact
              </Link>
              <Link href="/demo" className="text-gray-600 hover:text-gray-900 transition-colors">
                Demo
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Inloggen
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700"
                >
                  Gratis Proberen
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 via-blue-50 to-cyan-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-4 bg-gradient-to-r from-emerald-500 to-blue-600 text-white">
              Professionele BHV Software
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Moderne BHV Software voor{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                Veilige Werkplekken
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Beheer plotkaarten, coördineer BHV-ers en zorg voor optimale veiligheid met onze gebruiksvriendelijke
              software.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white px-8 py-3"
                >
                  Start Gratis Trial
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button variant="outline" size="lg" className="px-8 py-3 bg-transparent">
                  Bekijk Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Alles wat je nodig hebt voor BHV</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Van plotkaarten tot incidentenbeheer - onze software ondersteunt alle aspecten van bedrijfshulpverlening.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-blue-50">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Interactieve Plotkaarten</CardTitle>
                <CardDescription>
                  Maak en beheer professionele plotkaarten met alle veiligheidsvoorzieningen.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <CardTitle>BHV-er Beheer</CardTitle>
                <CardDescription>Coördineer je BHV-team, beheer certificeringen en plan trainingen.</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-cyan-50 to-emerald-50">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Real-time Monitoring</CardTitle>
                <CardDescription>Monitor veiligheidsvoorzieningen en ontvang automatische meldingen.</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Transparante Prijzen</h2>
            <p className="text-xl text-gray-600">Kies het plan dat bij jouw organisatie past</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-2 border-gray-200 shadow-lg">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl">Starter</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">€49</span>
                  <span className="text-gray-600">/maand</span>
                </div>
                <CardDescription className="mt-2">Perfect voor kleine organisaties</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span className="text-gray-700">Tot 50 werknemers</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span className="text-gray-700">Basis plotkaarten</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span className="text-gray-700">Email ondersteuning</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span className="text-gray-700">Standaard rapportages</span>
                  </li>
                </ul>
                <Button className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700">
                  Start Gratis Trial
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-emerald-500 shadow-xl relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white px-4 py-1">
                  Meest Populair
                </Badge>
              </div>
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl">Professional</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">€149</span>
                  <span className="text-gray-600">/maand</span>
                </div>
                <CardDescription className="mt-2">Voor groeiende organisaties</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span className="text-gray-700">Onbeperkt werknemers</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span className="text-gray-700">Geavanceerde plotkaarten</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span className="text-gray-700">Telefoon & email support</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span className="text-gray-700">API integraties</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span className="text-gray-700">Aangepaste rapportages</span>
                  </li>
                </ul>
                <Button className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700">
                  Start Gratis Trial
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Neem Contact Op</h2>
            <p className="text-xl text-gray-600">Vragen? We helpen je graag verder</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="text-center border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-blue-50">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Telefoon</CardTitle>
                <CardDescription>
                  <a href="tel:033-461-6303" className="text-emerald-600 hover:text-emerald-700">
                    033 461 6303
                  </a>
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Email</CardTitle>
                <CardDescription>
                  <a href="mailto:info@bhv360.nl" className="text-emerald-600 hover:text-emerald-700">
                    info@bhv360.nl
                  </a>
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center border-0 shadow-lg bg-gradient-to-br from-cyan-50 to-emerald-50">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Adres</CardTitle>
                <CardDescription>
                  Fokkerstraat 16
                  <br />
                  3833 LD Leusden
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">BHV360</span>
              </div>
              <p className="text-gray-400">Professionele BHV software voor veilige werkplekken.</p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#features" className="hover:text-white transition-colors">
                    Functies
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-white transition-colors">
                    Prijzen
                  </Link>
                </li>
                <li>
                  <Link href="/demo" className="hover:text-white transition-colors">
                    Demo
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Ondersteuning</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#contact" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <div className="space-y-2 text-gray-400">
                <p>Fokkerstraat 16</p>
                <p>3833 LD Leusden</p>
                <p>033 461 6303</p>
                <p>info@bhv360.nl</p>
              </div>
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
