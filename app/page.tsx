import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Users,
  MapPin,
  AlertTriangle,
  Phone,
  Clock,
  CheckCircle,
  ArrowRight,
  Star,
  Mail,
  Smartphone,
  BarChart3,
  UserCheck,
  PlayCircle,
  FileX,
  Eye,
} from "lucide-react"
import Image from "next/image"

export const metadata: Metadata = {
  title: "BHV360 - BHV Beheer Gemaakt Eenvoudig",
  description:
    "Van papieren chaos naar digitale controle. BHV360 maakt veiligheidsmanagement eenvoudig, compliant en effectief voor elke organisatie.",
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Image
                src="/images/bhv360-logo-full.png"
                alt="BHV360 Logo"
                width={640}
                height={160}
                className="h-40 w-auto"
                priority
              />
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/modules" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">
                Modules
              </Link>
              <Link href="/pricing" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">
                Prijzen
              </Link>
              <Link href="/demo" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">
                Demo's
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">
                Contact
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 bg-transparent"
                >
                  Inloggen
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 via-cyan-50 to-emerald-100">
        <div className="container mx-auto">
          <div className="flex items-start justify-between mb-8">
            <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-200">
              Professioneel
            </Badge>
          </div>
          <div className="text-center max-w-5xl mx-auto">
            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              BHV Beheer
              <br />
              <span className="text-emerald-600">Gemaakt Eenvoudig</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-4xl mx-auto">
              Van papieren chaos naar digitale controle. BHV360 maakt veiligheidsmanagement eenvoudig, compliant en
              effectief voor elke organisatie.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/demo">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-lg px-8 py-4 text-white">
                  Bekijk Demo
                  <PlayCircle className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-4 border-emerald-600 text-emerald-600 hover:bg-emerald-50 bg-transparent"
                >
                  30 Dagen Gratis
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">BHV360 Voordelen</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-6 w-6 text-emerald-500 flex-shrink-0" />
              <span className="text-gray-700 font-medium">100% digitale BHV administratie</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-6 w-6 text-emerald-500 flex-shrink-0" />
              <span className="text-gray-700 font-medium">Interactieve plotkaarten met real-time status</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-6 w-6 text-emerald-500 flex-shrink-0" />
              <span className="text-gray-700 font-medium">Automatische compliance rapportage</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-6 w-6 text-emerald-500 flex-shrink-0" />
              <span className="text-gray-700 font-medium">Mobiele app voor alle BHV'ers</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-6 w-6 text-emerald-500 flex-shrink-0" />
              <span className="text-gray-700 font-medium">Instant incident management</span>
            </div>
          </div>
        </div>
      </section>

      {/* Problems Section */}
      <section className="py-20 px-4 bg-red-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Stop met BHV Frustraties</h2>
            <p className="text-xl text-gray-600">
              Deze problemen kosten u tijd, geld en zorgen voor compliance risico's
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-red-200 bg-white shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <FileX className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <CardTitle className="text-lg text-gray-900">Papieren BHV administratie</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm text-center">
                  Verloren documenten, verouderde informatie, geen overzicht
                </p>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-white shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <MapPin className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <CardTitle className="text-lg text-gray-900">Onduidelijke evacuatieroutes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm text-center">Statische plattegronden, geen real-time updates</p>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-white shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <Clock className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <CardTitle className="text-lg text-gray-900">Trage incident afhandeling</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm text-center">Handmatige processen, geen automatisering</p>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-white shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <Eye className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <CardTitle className="text-lg text-gray-900">Geen inzicht in compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm text-center">Onduidelijke rapportages, geen real-time monitoring</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Transparante Prijzen</h2>
            <p className="text-xl text-gray-600">Kies het plan dat perfect past bij uw organisatie</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Starter Plan */}
            <Card className="border-2 border-gray-200 hover:border-emerald-300 transition-colors shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-gray-900">Starter</CardTitle>
                <div className="text-4xl font-bold text-emerald-600 my-4">
                  €49<span className="text-lg text-gray-500">/maand</span>
                </div>
                <CardDescription className="text-gray-600">Perfect voor kleine organisaties</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Tot 50 gebruikers</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Basis plotkaarten</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Incident registratie</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Email ondersteuning</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Standaard rapportages</span>
                  </li>
                </ul>
                <Button
                  className="w-full mt-6 border-emerald-600 text-emerald-600 hover:bg-emerald-50 bg-transparent"
                  variant="outline"
                >
                  Start Gratis Trial
                </Button>
              </CardContent>
            </Card>

            {/* Professional Plan */}
            <Card className="border-2 border-emerald-500 relative shadow-xl">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-emerald-500 text-white px-4 py-1 text-sm font-medium">Meest Populair</Badge>
              </div>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-gray-900">Professional</CardTitle>
                <div className="text-4xl font-bold text-emerald-600 my-4">
                  €149<span className="text-lg text-gray-500">/maand</span>
                </div>
                <CardDescription className="text-gray-600">Ideaal voor middelgrote bedrijven</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Tot 250 gebruikers</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Geavanceerde plotkaarten</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Real-time monitoring</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Telefoon ondersteuning</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Custom rapportages</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">API integraties</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Multi-locatie support</span>
                  </li>
                </ul>
                <Button className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white">
                  Start Gratis Trial
                </Button>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="border-2 border-gray-200 hover:border-emerald-300 transition-colors shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-gray-900">Enterprise</CardTitle>
                <div className="text-4xl font-bold text-emerald-600 my-4">Op maat</div>
                <CardDescription className="text-gray-600">Voor grote organisaties</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Onbeperkt gebruikers</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">White-label oplossing</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Dedicated support</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Custom ontwikkeling</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">SLA garanties</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">On-premise optie</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Training & consultancy</span>
                  </li>
                </ul>
                <Button
                  className="w-full mt-6 border-emerald-600 text-emerald-600 hover:bg-emerald-50 bg-transparent"
                  variant="outline"
                >
                  Contact Opnemen
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 text-lg mb-4">Alle plannen bevatten een 30-dagen gratis proefperiode</p>
            <div className="flex justify-center space-x-8 text-sm text-gray-500">
              <span>✓ Geen setup kosten</span>
              <span>✓ Maandelijks opzegbaar</span>
              <span>✓ Nederlandse support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">BHV360 Modules</h2>
            <p className="text-xl text-gray-600">
              Ontdek alle functionaliteiten die BHV360 biedt voor professioneel veiligheidsmanagement.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow bg-white border border-gray-200">
              <CardHeader>
                <div className="flex justify-between items-start mb-4">
                  <Users className="h-12 w-12 text-emerald-600" />
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                    €39/maand
                  </Badge>
                </div>
                <CardTitle className="text-gray-900">BHV Dashboard</CardTitle>
                <CardDescription className="text-gray-600">
                  Complete BHV administratie met certificering tracking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50 bg-transparent"
                >
                  Meer Info
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow bg-white border border-gray-200">
              <CardHeader>
                <div className="flex justify-between items-start mb-4">
                  <MapPin className="h-12 w-12 text-teal-600" />
                  <Badge variant="secondary" className="bg-teal-100 text-teal-800">
                    €29/maand
                  </Badge>
                </div>
                <CardTitle className="text-gray-900">Interactieve Plotkaarten</CardTitle>
                <CardDescription className="text-gray-600">Digitale plattegronden met real-time status</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full border-teal-600 text-teal-600 hover:bg-teal-50 bg-transparent"
                >
                  Meer Info
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow bg-white border border-gray-200">
              <CardHeader>
                <div className="flex justify-between items-start mb-4">
                  <AlertTriangle className="h-12 w-12 text-red-600" />
                  <Badge variant="secondary" className="bg-red-100 text-red-800">
                    €49/maand
                  </Badge>
                </div>
                <CardTitle className="text-gray-900">Incident Management</CardTitle>
                <CardDescription className="text-gray-600">Snelle incident registratie met workflows</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full border-red-600 text-red-600 hover:bg-red-50 bg-transparent">
                  Meer Info
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow bg-white border border-gray-200">
              <CardHeader>
                <div className="flex justify-between items-start mb-4">
                  <UserCheck className="h-12 w-12 text-purple-600" />
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                    €35/maand
                  </Badge>
                </div>
                <CardTitle className="text-gray-900">Bezoeker Registratie</CardTitle>
                <CardDescription className="text-gray-600">Professionele bezoeker check-in systeem</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full border-purple-600 text-purple-600 hover:bg-purple-50 bg-transparent"
                >
                  Meer Info
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow bg-white border border-gray-200">
              <CardHeader>
                <div className="flex justify-between items-start mb-4">
                  <BarChart3 className="h-12 w-12 text-blue-600" />
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    €25/maand
                  </Badge>
                </div>
                <CardTitle className="text-gray-900">Analytics & Rapportage</CardTitle>
                <CardDescription className="text-gray-600">
                  Uitgebreide analytics en compliance rapportage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent"
                >
                  Meer Info
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow bg-white border border-gray-200">
              <CardHeader>
                <div className="flex justify-between items-start mb-4">
                  <Smartphone className="h-12 w-12 text-indigo-600" />
                  <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">
                    €19/maand
                  </Badge>
                </div>
                <CardTitle className="text-gray-900">Mobiele App</CardTitle>
                <CardDescription className="text-gray-600">Complete mobiele toegang voor BHV'ers</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full border-indigo-600 text-indigo-600 hover:bg-indigo-50 bg-transparent"
                >
                  Meer Info
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Bewezen Resultaten</h2>
            <p className="text-xl opacity-90">Onze klanten zien direct resultaat</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">75%</div>
              <div className="text-xl mb-2 font-semibold">Tijd besparing</div>
              <div className="text-sm opacity-80">Minder administratie</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">98%</div>
              <div className="text-xl mb-2 font-semibold">Compliance score</div>
              <div className="text-sm opacity-80">Verhoogde compliance</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">60%</div>
              <div className="text-xl mb-2 font-semibold">Incident respons</div>
              <div className="text-sm opacity-80">Snellere afhandeling</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">€15.000</div>
              <div className="text-xl mb-2 font-semibold">Kosten reductie</div>
              <div className="text-sm opacity-80">Jaarlijkse besparing</div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Ervaar BHV360 in Actie</h2>
            <p className="text-xl text-gray-600">
              Ontdek hoe BHV360 werkt met onze interactieve demo's. Geen registratie vereist.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow border border-gray-200">
              <CardHeader className="text-center">
                <Users className="h-16 w-16 text-emerald-600 mx-auto mb-4" />
                <CardTitle className="text-gray-900">BHV Dashboard</CardTitle>
                <CardDescription className="text-gray-600">
                  Bekijk het complete BHV dashboard met team overzicht en certificeringen.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                  <PlayCircle className="mr-2 h-4 w-4" />
                  Start Demo
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border border-gray-200">
              <CardHeader className="text-center">
                <MapPin className="h-16 w-16 text-teal-600 mx-auto mb-4" />
                <CardTitle className="text-gray-900">Plotkaart Editor</CardTitle>
                <CardDescription className="text-gray-600">
                  Ervaar hoe eenvoudig het is om interactieve plotkaarten te maken.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                  <PlayCircle className="mr-2 h-4 w-4" />
                  Start Demo
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border border-gray-200">
              <CardHeader className="text-center">
                <AlertTriangle className="h-16 w-16 text-red-600 mx-auto mb-4" />
                <CardTitle className="text-gray-900">Incident Simulator</CardTitle>
                <CardDescription className="text-gray-600">
                  Simuleer een noodsituatie en zie hoe BHV360 automatisch reageert.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                  <PlayCircle className="mr-2 h-4 w-4" />
                  Start Demo
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button
              variant="outline"
              size="lg"
              className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 bg-transparent"
            >
              Alle Demo's Bekijken
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Waarom 500+ Organisaties Kiezen voor BHV360</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white border border-gray-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "BHV360 heeft onze BHV administratie van chaos naar complete controle gebracht. Aanrader!"
                </p>
                <div className="text-sm">
                  <div className="font-semibold text-gray-900">- Jan Bakker</div>
                  <div className="text-gray-500">Facility Manager</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "Eindelijk een systeem dat werkt! Compliance is nu een fluitje van een cent."
                </p>
                <div className="text-sm">
                  <div className="font-semibold text-gray-900">- Maria de Vries</div>
                  <div className="text-gray-500">HR Manager</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "De ROI was binnen 3 maanden zichtbaar. Tijd en kosten besparing is enorm."
                </p>
                <div className="text-sm">
                  <div className="font-semibold text-gray-900">- Peter Jansen</div>
                  <div className="text-gray-500">Operations Director</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Krijg Uw Persoonlijke Demo</h2>
            <p className="text-xl text-gray-600">
              Zie hoe BHV360 uw specifieke uitdagingen oplost. Gratis demo op maat van uw organisatie.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Demo Aanvragen</h3>
              <p className="text-gray-600 mb-8">
                Vul het formulier in en we tonen u binnen 24 uur hoe BHV360 uw problemen oplost.
              </p>

              <form className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-gray-700 font-medium">
                    Naam *
                  </Label>
                  <Input
                    id="name"
                    placeholder="Uw volledige naam"
                    required
                    className="mt-1 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-gray-700 font-medium">
                    E-mail *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="uw.email@bedrijf.nl"
                    required
                    className="mt-1 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-gray-700 font-medium">
                    Telefoon
                  </Label>
                  <Input
                    id="phone"
                    placeholder="+31 6 12345678"
                    className="mt-1 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <Label htmlFor="company" className="text-gray-700 font-medium">
                    Bedrijfsnaam *
                  </Label>
                  <Input
                    id="company"
                    placeholder="Uw bedrijfsnaam"
                    required
                    className="mt-1 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <Label htmlFor="message" className="text-gray-700 font-medium">
                    Aanvullende Informatie
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Vertel ons meer over uw specifieke situatie..."
                    rows={4}
                    className="mt-1 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-lg py-3">
                  Gratis Demo Aanvragen
                </Button>
              </form>

              <div className="flex justify-center space-x-6 mt-6 text-sm text-gray-500">
                <span>✓ Geen verplichtingen</span>
                <span>✓ Binnen 24 uur reactie</span>
                <span>✓ Op maat van uw organisatie</span>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Direct Contact</h3>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Sales & Demo's</h4>
                  <div className="flex items-center space-x-3 text-gray-600">
                    <Mail className="h-5 w-5 text-emerald-600" />
                    <span>info@BHV360.nl</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Direct Bellen</h4>
                  <div className="flex items-center space-x-3 text-gray-600">
                    <Phone className="h-5 w-5 text-emerald-600" />
                    <span>033-4614303</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Reactietijd</h4>
                  <div className="flex items-center space-x-3 text-gray-600">
                    <Clock className="h-5 w-5 text-emerald-600" />
                    <span>Binnen 4 uur op werkdagen</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-emerald-50 rounded-lg border border-emerald-200">
                <h4 className="font-semibold text-gray-900 mb-4">Wat u krijgt</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                    Persoonlijke demo op maat
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                    ROI berekening voor uw situatie
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                    Implementatie roadmap
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                    30 dagen gratis proefperiode
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                    Gratis training voor uw team
                  </li>
                </ul>

                <div className="mt-6 text-center">
                  <div className="text-sm text-gray-600">Gemiddelde ROI</div>
                  <div className="text-3xl font-bold text-emerald-600">320%</div>
                  <div className="text-sm text-gray-600">Binnen 12 maanden</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Image
                  src="/images/bhv360-logo-full.png"
                  alt="BHV360 Logo"
                  width={480}
                  height={120}
                  className="h-32 w-auto filter brightness-200 contrast-200"
                />
              </div>
              <p className="text-gray-400 text-sm mb-4">
                BHV software van Nederland. Vertrouwd door 500+ organisaties voor professioneel veiligheidsmanagement.
              </p>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>info@BHV360.nl</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>033-4614303</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/demo" className="hover:text-white transition-colors">
                    Demo's
                  </Link>
                </li>
                <li>
                  <Link href="/modules" className="hover:text-white transition-colors">
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
              <ul className="space-y-2 text-sm text-gray-400">
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
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  <span>GDPR Compliant</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  <span>Voldoet aan ISO Standaarden</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  <span>Nederlandse Support</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 BHV360 - BHV Software van Nederland</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
