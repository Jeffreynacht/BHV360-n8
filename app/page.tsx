import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  CheckCircle,
  Shield,
  Users,
  MapPin,
  Play,
  Star,
  Clock,
  Smartphone,
  BarChart3,
  AlertTriangle,
  X,
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Image
                src="/images/bhv360-logo-full.png"
                alt="BHV360 Logo"
                width={180}
                height={45}
                className="h-10 w-auto"
                priority
              />
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="#modules" className="text-gray-600 hover:text-gray-900 transition-colors">
                Modules
              </Link>
              <Link href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
                Prijzen
              </Link>
              <Link href="#demos" className="text-gray-600 hover:text-gray-900 transition-colors">
                Demo's
              </Link>
              <Link href="#contact" className="text-gray-600 hover:text-gray-900 transition-colors">
                Contact
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
                  Professioneel
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
            <Badge className="mb-6 bg-gradient-to-r from-emerald-500 to-blue-600 text-white px-4 py-2">
              Professioneel BHV Beheer
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              BHV Beheer
              <br />
              <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                Gemaakt Eenvoudig
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Van papieren chaos naar digitale controle. BHV360 maakt veiligheidsmanagement eenvoudig, compliant en
              effectief voor elke organisatie.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/demo">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white px-8 py-4 text-lg"
                >
                  <Play className="mr-2 w-5 h-5" />
                  Bekijk Demo
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" size="lg" className="px-8 py-4 text-lg bg-white">
                  30 Dagen Gratis
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* BHV360 Voordelen */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">BHV360 Voordelen</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0" />
              <span className="text-gray-700">100% digitale BHV administratie</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0" />
              <span className="text-gray-700">Interactieve plotkaarten met real-time status</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0" />
              <span className="text-gray-700">Automatische compliance rapportage</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0" />
              <span className="text-gray-700">Mobiele app voor alle BHV'ers</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0" />
              <span className="text-gray-700">Instant incident management</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stop met BHV Frustraties */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Stop met BHV Frustraties</h2>
            <p className="text-xl text-gray-600">
              Deze problemen kosten u tijd, geld en zorgen voor compliance risico's
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <X className="w-8 h-8 text-red-500" />
                </div>
                <CardTitle className="text-lg">Papieren BHV administratie</CardTitle>
                <CardDescription>Verloren documenten, verouderde informatie, geen overzicht</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg bg-white">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
                <CardTitle className="text-lg">Onduidelijke evacuatieroutes</CardTitle>
                <CardDescription>Statische plattegronden, geen real-time updates</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg bg-white">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-red-500" />
                </div>
                <CardTitle className="text-lg">Trage incident afhandeling</CardTitle>
                <CardDescription>Handmatige processen, geen automatisering</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg bg-white">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-red-500" />
                </div>
                <CardTitle className="text-lg">Geen inzicht in compliance</CardTitle>
                <CardDescription>Onduidelijke rapportages, geen real-time monitoring</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Transparante Prijzen</h2>
            <p className="text-xl text-gray-600">Kies het plan dat perfect past bij uw organisatie</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
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
                    <span className="text-gray-700">Tot 50 gebruikers</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span className="text-gray-700">Basis plotkaarten</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span className="text-gray-700">Incident registratie</span>
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
                <CardDescription className="mt-2">Ideaal voor middelgrote bedrijven</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span className="text-gray-700">Tot 250 gebruikers</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span className="text-gray-700">Geavanceerde plotkaarten</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span className="text-gray-700">Real-time monitoring</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span className="text-gray-700">Telefoon ondersteuning</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span className="text-gray-700">Custom rapportages</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span className="text-gray-700">API integraties</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span className="text-gray-700">Multi-locatie support</span>
                  </li>
                </ul>
                <Button className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700">
                  Start Gratis Trial
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl">Enterprise</CardTitle>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-gray-900">Op maat</span>
                </div>
                <CardDescription className="mt-2">Voor grote organisaties</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span className="text-gray-700">Onbeperkt gebruikers</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span className="text-gray-700">White-label oplossing</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span className="text-gray-700">Dedicated support</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span className="text-gray-700">Custom ontwikkeling</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span className="text-gray-700">SLA garanties</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span className="text-gray-700">On-premise optie</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span className="text-gray-700">Training & consultancy</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full bg-transparent">
                  Contact Opnemen
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Alle plannen bevatten een 30-dagen gratis proefperiode</p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                Geen setup kosten
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                Maandelijks opzegbaar
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                Nederlandse support
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BHV360 Modules */}
      <section id="modules" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">BHV360 Modules</h2>
            <p className="text-xl text-gray-600">
              Ontdek alle functionaliteiten die BHV360 biedt voor professioneel veiligheidsmanagement.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <Badge variant="secondary">€39/maand</Badge>
                </div>
                <CardTitle>BHV Dashboard</CardTitle>
                <CardDescription>Complete BHV administratie met certificering tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-transparent">
                  Meer Info
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <Badge variant="secondary">€29/maand</Badge>
                </div>
                <CardTitle>Interactieve Plotkaarten</CardTitle>
                <CardDescription>Digitale plattegronden met real-time status</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-transparent">
                  Meer Info
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </div>
                  <Badge variant="secondary">€49/maand</Badge>
                </div>
                <CardTitle>Incident Management</CardTitle>
                <CardDescription>Snelle incident registratie met workflows</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-transparent">
                  Meer Info
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <Badge variant="secondary">€35/maand</Badge>
                </div>
                <CardTitle>Bezoeker Registratie</CardTitle>
                <CardDescription>Professionele bezoeker check-in systeem</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-transparent">
                  Meer Info
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <Badge variant="secondary">€25/maand</Badge>
                </div>
                <CardTitle>Analytics & Rapportage</CardTitle>
                <CardDescription>Uitgebreide analytics en compliance rapportage</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-transparent">
                  Meer Info
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <Smartphone className="w-6 h-6 text-white" />
                  </div>
                  <Badge variant="secondary">€19/maand</Badge>
                </div>
                <CardTitle>Mobiele App</CardTitle>
                <CardDescription>Complete mobiele toegang voor BHV'ers</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-transparent">
                  Meer Info
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Bewezen Resultaten */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Bewezen Resultaten</h2>
            <p className="text-xl text-gray-600">Onze klanten zien direct resultaat</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-emerald-600 mb-2">75%</div>
              <div className="text-xl font-semibold text-gray-900 mb-1">Tijd besparing</div>
              <div className="text-gray-600">Minder administratie</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-600 mb-2">98%</div>
              <div className="text-xl font-semibold text-gray-900 mb-1">Compliance score</div>
              <div className="text-gray-600">Verhoogde compliance</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-emerald-600 mb-2">60%</div>
              <div className="text-xl font-semibold text-gray-900 mb-1">Incident respons</div>
              <div className="text-gray-600">Snellere afhandeling</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-600 mb-2">€15.000</div>
              <div className="text-xl font-semibold text-gray-900 mb-1">Kosten reductie</div>
              <div className="text-gray-600">Jaarlijkse besparing</div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demos" className="py-20 bg-gradient-to-br from-emerald-50 to-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Ervaar BHV360 in Actie</h2>
            <p className="text-xl text-gray-600">
              Ontdek hoe BHV360 werkt met onze interactieve demo's. Geen registratie vereist.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <CardTitle>BHV Dashboard</CardTitle>
                <CardDescription>
                  Bekijk het complete BHV dashboard met team overzicht en certificeringen.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700">
                  <Play className="mr-2 w-4 h-4" />
                  Start Demo
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <CardTitle>Plotkaart Editor</CardTitle>
                <CardDescription>Ervaar hoe eenvoudig het is om interactieve plotkaarten te maken.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700">
                  <Play className="mr-2 w-4 h-4" />
                  Start Demo
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-white" />
                </div>
                <CardTitle>Incident Simulator</CardTitle>
                <CardDescription>Simuleer een noodsituatie en zie hoe BHV360 automatisch reageert.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700">
                  <Play className="mr-2 w-4 h-4" />
                  Start Demo
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Link href="/demo">
              <Button variant="outline" size="lg" className="bg-white">
                Alle Demo's Bekijken
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Waarom 500+ Organisaties Kiezen voor BHV360
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-blue-50">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">
                  "BHV360 heeft onze BHV administratie van chaos naar complete controle gebracht. Aanrader!"
                </p>
                <div className="text-sm text-gray-600">- Jan Bakker, Facility Manager</div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">
                  "Eindelijk een systeem dat werkt! Compliance is nu een fluitje van een cent."
                </p>
                <div className="text-sm text-gray-600">- Maria de Vries, HR Manager</div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-cyan-50 to-emerald-50">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">
                  "De ROI was binnen 3 maanden zichtbaar. Tijd en kosten besparing is enorm."
                </p>
                <div className="text-sm text-gray-600">- Peter Jansen, Operations Director</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact & Company Info */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Over BHV360</h2>
            <p className="text-xl text-gray-600">
              Complete bedrijfsinformatie en contactgegevens voor uw administratie en facturatie.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="text-lg">Bedrijfsgegevens</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <strong>BHV360 B.V.</strong>
                </div>
                <div>Innovatieve BHV software oplossingen</div>
                <div>
                  <strong>KvK nummer:</strong> 12345678
                </div>
                <div>
                  <strong>BTW nummer:</strong> NL123456789B01
                </div>
                <div>
                  <strong>IBAN:</strong> NL12 ABCD 0123 4567 89
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="text-lg">Contactgegevens</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <strong>Telefoon:</strong> 033-4614303
                </div>
                <div>
                  <strong>E-mail algemeen:</strong> info@BHV360.nl
                </div>
                <div>
                  <strong>E-mail support:</strong> support@BHV360.nl
                </div>
                <div>
                  <strong>Website:</strong> www.bhv360.nl
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="text-lg">Adresgegevens</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <strong>Bezoekadres:</strong>
                </div>
                <div>Fokkerstraat 16</div>
                <div>3833 LD Leusden</div>
                <div>Nederland</div>
                <div className="mt-3">
                  <strong>Postadres:</strong>
                </div>
                <div>Postbus 456</div>
                <div>3800 AL Amersfoort</div>
                <div>Nederland</div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="text-lg">Openingstijden</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <strong>Maandag - Vrijdag:</strong> 09:00 - 17:30
                </div>
                <div>
                  <strong>Zaterdag:</strong> Gesloten
                </div>
                <div>
                  <strong>Zondag:</strong> Gesloten
                </div>
                <div className="mt-3 text-emerald-600">24/7 Support beschikbaar voor Enterprise klanten</div>
              </CardContent>
            </Card>
          </div>

          {/* Demo Request Form */}
          <div className="max-w-2xl mx-auto">
            <Card className="border-0 shadow-xl bg-white">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Krijg Uw Persoonlijke Demo</CardTitle>
                <CardDescription>
                  Zie hoe BHV360 uw specifieke uitdagingen oplost. Gratis demo op maat van uw organisatie.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Naam *</label>
                      <Input placeholder="Uw volledige naam" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">E-mail *</label>
                      <Input type="email" placeholder="uw.email@bedrijf.nl" />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Telefoon</label>
                      <Input placeholder="+31 6 12345678" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bedrijfsnaam *</label>
                      <Input placeholder="Uw bedrijfsnaam" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Aanvullende Informatie</label>
                    <Textarea placeholder="Vertel ons meer over uw specifieke situatie..." rows={4} />
                  </div>
                  <Button className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-lg py-3">
                    Gratis Demo Aanvragen
                  </Button>
                  <div className="text-center text-sm text-gray-500">
                    ✓ Geen verplichtingen ✓ Binnen 24 uur reactie ✓ Op maat van uw organisatie
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">BHV360</span>
              </div>
              <p className="text-gray-400 mb-4">
                BHV software van Nederland. Vertrouwd door 500+ organisaties voor professioneel veiligheidsmanagement.
              </p>
              <div className="space-y-2 text-sm text-gray-400">
                <div>info@BHV360.nl</div>
                <div>033-4614303</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#demos" className="hover:text-white transition-colors">
                    Demo's
                  </Link>
                </li>
                <li>
                  <Link href="#modules" className="hover:text-white transition-colors">
                    Modules
                  </Link>
                </li>
                <li>
                  <Link href="/plotkaarten" className="hover:text-white transition-colors">
                    Plotkaarten
                  </Link>
                </li>
                <li>
                  <Link href="/incidenten" className="hover:text-white transition-colors">
                    Incidenten
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white transition-colors">
                    Helpdesk
                  </Link>
                </li>
                <li>
                  <Link href="/training" className="hover:text-white transition-colors">
                    Training
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-white transition-colors">
                    Inloggen
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
              <h3 className="font-semibold mb-4">Compliance</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <div>✓ GDPR Compliant</div>
                <div>✓ Voldoet aan ISO Standaarden</div>
                <div>✓ Nederlandse Support</div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 BHV360 - BHV Software van Nederland</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
