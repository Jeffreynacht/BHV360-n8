import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle,
  Shield,
  Users,
  Zap,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Star,
  Award,
  Building2,
  Smartphone,
  Globe,
  HeadphonesIcon,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Image
                src="/images/bhv360-logo-full.png"
                alt="BHV360 Logo"
                width={200}
                height={40}
                className="h-10 w-auto"
                priority
              />
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/platform" className="text-gray-600 hover:text-emerald-600 transition-colors">
                Platform
              </Link>
              <Link href="/demo" className="text-gray-600 hover:text-emerald-600 transition-colors">
                Demo
              </Link>
              <Link href="/help" className="text-gray-600 hover:text-emerald-600 transition-colors">
                Support
              </Link>
              <Button asChild variant="outline">
                <Link href="/login">Inloggen</Link>
              </Button>
              <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                <Link href="/register">Gratis Starten</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-6 bg-emerald-100 text-emerald-800 hover:bg-emerald-200">
            🚀 Nieuw: AI-gestuurde BHV planning
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Professionele BHV
            <span className="text-emerald-600"> Plotkaart</span>
            <br />
            Software
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Maak professionele BHV plotkaarten, beheer evacuatieprocedures en zorg voor optimale veiligheid in uw
            organisatie. Volledig compliant met Nederlandse BHV-wetgeving.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-lg px-8 py-4">
              <Link href="/register">
                Gratis Proberen <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-4 bg-transparent">
              <Link href="/demo">Live Demo Bekijken</Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500 mb-16">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-600" />
              <span>ISO 27001 Gecertificeerd</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              <span>GDPR Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-emerald-600" />
              <span>Nederlandse BHV Standaard</span>
            </div>
          </div>

          {/* Hero Image/Demo */}
          <div className="relative max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl border overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 to-blue-600 p-4">
                <div className="flex items-center gap-2 text-white">
                  <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                  <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                  <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                  <span className="ml-4 text-sm">BHV360 Dashboard</span>
                </div>
              </div>
              <div className="p-8 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Plotkaart Editor</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-32 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <Building2 className="h-12 w-12 text-emerald-600" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">BHV Beheer</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-32 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Users className="h-12 w-12 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Rapportages</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-32 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Zap className="h-12 w-12 text-purple-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Alles wat u nodig heeft voor professionele BHV</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Van plotkaart ontwerp tot evacuatieprocedures - onze complete suite helpt u bij elke stap
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                  <Building2 className="h-6 w-6 text-emerald-600" />
                </div>
                <CardTitle>Plotkaart Editor</CardTitle>
                <CardDescription>Intuïtieve drag-and-drop editor voor professionele BHV plotkaarten</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    Voorgedefinieerde BHV symbolen
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    Automatische compliance check
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    Export naar PDF/PNG
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>BHV Beheer</CardTitle>
                <CardDescription>Centraal beheer van BHV'ers, certificaten en roosters</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    Certificaat tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    Automatische herinneringen
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    Rooster planning
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Incident Management</CardTitle>
                <CardDescription>Registreer en analyseer incidenten voor continue verbetering</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    Incident registratie
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    Trend analyse
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    Actie tracking
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Smartphone className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle>Mobile App</CardTitle>
                <CardDescription>Toegang tot plotkaarten en procedures vanaf elke locatie</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    Offline toegang
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    QR code scanning
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    Push notificaties
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Rapportages</CardTitle>
                <CardDescription>Uitgebreide rapportages voor compliance en management</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    Compliance dashboards
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    Automatische rapporten
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    Export mogelijkheden
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle>Integraties</CardTitle>
                <CardDescription>Koppel met bestaande systemen en externe diensten</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    HR systemen
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    Alarm systemen
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    API toegang
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-emerald-600 to-blue-600 text-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Vertrouwd door organisaties in heel Nederland</h2>
            <p className="text-xl opacity-90">Meer dan 1000+ organisaties vertrouwen op BHV360</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-lg opacity-90">Actieve Klanten</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-lg opacity-90">BHV'ers Beheerd</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-lg opacity-90">Uptime</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-lg opacity-90">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Wat onze klanten zeggen</h2>
            <p className="text-xl text-gray-600">Ontdek waarom organisaties kiezen voor BHV360</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "BHV360 heeft onze BHV processen volledig getransformeerd. De plotkaart editor is intuïtief en de
                  compliance features geven ons vertrouwen dat we aan alle eisen voldoen."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-emerald-600 font-semibold">MJ</span>
                  </div>
                  <div>
                    <div className="font-semibold">Maria Jansen</div>
                    <div className="text-sm text-gray-500">Facility Manager, TechCorp</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "De mobile app is fantastisch. Onze BHV'ers hebben nu altijd toegang tot de laatste plotkaarten en
                  procedures, zelfs zonder internetverbinding."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-semibold">PV</span>
                  </div>
                  <div>
                    <div className="font-semibold">Pieter van der Berg</div>
                    <div className="text-sm text-gray-500">BHV Coördinator, MediCenter</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "De rapportage functionaliteit bespaart ons uren werk. Compliance rapportages worden automatisch
                  gegenereerd en zijn altijd up-to-date."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-purple-600 font-semibold">SK</span>
                  </div>
                  <div>
                    <div className="font-semibold">Sandra Koster</div>
                    <div className="text-sm text-gray-500">Safety Manager, LogisticsPro</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Klaar om te starten met professionele BHV?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Begin vandaag nog met een gratis proefperiode. Geen creditcard vereist, volledige toegang tot alle functies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-lg px-8 py-4">
              <Link href="/register">
                Gratis 30 Dagen Proberen <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-4 bg-transparent">
              <Link href="/demo">Plan een Demo</Link>
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-4">30 dagen gratis • Geen setup kosten • Cancel elk moment</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <Image
                src="/images/bhv360-logo-full.png"
                alt="BHV360 Logo"
                width={160}
                height={32}
                className="h-8 w-auto brightness-0 invert mb-4"
              />
              <p className="text-gray-400 mb-4">
                Professionele BHV software voor moderne organisaties. Compliant, betrouwbaar en gebruiksvriendelijk.
              </p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                  <span className="text-xs">f</span>
                </div>
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                  <span className="text-xs">t</span>
                </div>
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                  <span className="text-xs">in</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/platform" className="hover:text-white transition-colors">
                    Platform
                  </Link>
                </li>
                <li>
                  <Link href="/demo" className="hover:text-white transition-colors">
                    Demo
                  </Link>
                </li>
                <li>
                  <Link href="/mobile-app" className="hover:text-white transition-colors">
                    Mobile App
                  </Link>
                </li>
                <li>
                  <Link href="/integrations" className="hover:text-white transition-colors">
                    Integraties
                  </Link>
                </li>
                <li>
                  <Link href="/api" className="hover:text-white transition-colors">
                    API
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/video-tutorials" className="hover:text-white transition-colors">
                    Video Tutorials
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/status" className="hover:text-white transition-colors">
                    Status
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>+31 (0)20 123 4567</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>info@bhv360.nl</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Amsterdam, Nederland</span>
                </li>
                <li className="flex items-center gap-2">
                  <HeadphonesIcon className="h-4 w-4" />
                  <span>24/7 Support</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2024 BHV360. Alle rechten voorbehouden.</p>
            <div className="flex space-x-6 text-sm text-gray-400 mt-4 md:mt-0">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Voorwaarden
              </Link>
              <Link href="/cookies" className="hover:text-white transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
