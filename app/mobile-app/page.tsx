"use client"

import { useState } from "react"
import {
  ArrowLeft,
  Smartphone,
  Apple,
  Play,
  QrCode,
  Shield,
  Bell,
  MapPin,
  Users,
  Activity,
  CheckCircle,
  Star,
  Globe,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Image from "next/image"

const MobileAppPage = () => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")

  const appFeatures = [
    {
      icon: <Shield className="h-6 w-6 text-blue-600" />,
      title: "Veiligheidsoverzicht",
      description: "Real-time status van alle veiligheidsvoorzieningen",
    },
    {
      icon: <QrCode className="h-6 w-6 text-green-600" />,
      title: "QR Code Scanner",
      description: "Scan QR codes voor snelle toegang tot informatie",
    },
    {
      icon: <Bell className="h-6 w-6 text-red-600" />,
      title: "Push Notificaties",
      description: "Ontvang direct meldingen bij incidenten",
    },
    {
      icon: <MapPin className="h-6 w-6 text-purple-600" />,
      title: "GPS Locatie",
      description: "Automatische locatiebepaling voor incidenten",
    },
    {
      icon: <Users className="h-6 w-6 text-orange-600" />,
      title: "Team Communicatie",
      description: "Directe communicatie met BHV team",
    },
    {
      icon: <Activity className="h-6 w-6 text-indigo-600" />,
      title: "Offline Functionaliteit",
      description: "Werkt ook zonder internetverbinding",
    },
  ]

  const appScreenshots = [
    {
      title: "Dashboard",
      description: "Hoofdscherm met overzicht",
      image: "/placeholder.svg?height=600&width=300&text=Dashboard",
    },
    {
      title: "Plotkaart",
      description: "Interactieve plattegrond",
      image: "/placeholder.svg?height=600&width=300&text=Plotkaart",
    },
    {
      title: "Incident Melden",
      description: "Snel incident rapporteren",
      image: "/placeholder.svg?height=600&width=300&text=Incident",
    },
    {
      title: "QR Scanner",
      description: "QR code scanner interface",
      image: "/placeholder.svg?height=600&width=300&text=QR+Scanner",
    },
  ]

  const permissions = [
    {
      permission: "Camera",
      reason: "Voor QR code scanning en foto's bij incidenten",
      required: true,
    },
    {
      permission: "Locatie",
      reason: "Voor automatische locatiebepaling bij incidenten",
      required: true,
    },
    {
      permission: "Notificaties",
      reason: "Voor push notificaties bij belangrijke meldingen",
      required: true,
    },
    {
      permission: "Opslag",
      reason: "Voor offline functionaliteit en cache",
      required: true,
    },
    {
      permission: "Microfoon",
      reason: "Voor spraakberichten en communicatie",
      required: false,
    },
    {
      permission: "Contacten",
      reason: "Voor snelle toegang tot noodcontacten",
      required: false,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => router.push("/")} className="p-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">BHV360 Mobiele App</h1>
                <p className="text-gray-600">Complete mobiele ervaring voor BHV'ers en medewerkers</p>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-800 px-3 py-1">
              <Activity className="h-4 w-4 mr-1" />
              Beschikbaar
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overzicht</TabsTrigger>
            <TabsTrigger value="features">Functies</TabsTrigger>
            <TabsTrigger value="screenshots">Screenshots</TabsTrigger>
            <TabsTrigger value="download">Download</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl">
                    <Smartphone className="h-16 w-16 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">BHV360 Mobile</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  De officiële BHV360 app brengt alle veiligheidsfunctionaliteiten naar uw smartphone. Altijd en overal
                  toegang tot uw BHV informatie.
                </p>
              </div>

              <div className="flex justify-center gap-4">
                <Button size="lg" className="bg-black text-white hover:bg-gray-800">
                  <Apple className="h-5 w-5 mr-2" />
                  Download voor iOS
                </Button>
                <Button size="lg" className="bg-green-600 text-white hover:bg-green-700">
                  <Play className="h-5 w-5 mr-2" />
                  Download voor Android
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">4.8</div>
                  <div className="flex justify-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <div className="text-sm text-gray-600">App Store Rating</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">10K+</div>
                  <div className="text-sm text-gray-600">Downloads</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">99.9%</div>
                  <div className="text-sm text-gray-600">Uptime</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
                  <div className="text-sm text-gray-600">Support</div>
                </CardContent>
              </Card>
            </div>

            {/* Key Features */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {appFeatures.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">{feature.icon}</div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                        <p className="text-gray-600 text-sm">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="features" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Uitgebreide Functionaliteiten</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                De BHV360 app biedt alle functionaliteiten die u nodig heeft voor effectief veiligheidsbeheer
              </p>
            </div>

            <div className="space-y-8">
              {/* Core Features */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                    Core Functionaliteiten
                  </CardTitle>
                  <CardDescription>Essentiële BHV functionaliteiten altijd bij de hand</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span>Interactieve plotkaarten</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span>Incident rapportage</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span>Real-time notificaties</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span>Gebruikersbeheer</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span>QR code scanning</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span>Offline functionaliteit</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span>GPS locatiebepaling</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span>Biometrische authenticatie</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Advanced Features */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-purple-600" />
                    Geavanceerde Functies
                  </CardTitle>
                  <CardDescription>Premium functionaliteiten voor professioneel gebruik</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-purple-600" />
                        <span>Advanced analytics dashboard</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-purple-600" />
                        <span>Custom rapportages</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-purple-600" />
                        <span>API integraties</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-purple-600" />
                        <span>White-label opties</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-purple-600" />
                        <span>Multi-tenant support</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-purple-600" />
                        <span>Advanced security</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-purple-600" />
                        <span>Custom workflows</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-purple-600" />
                        <span>Enterprise SSO</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Permissions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-orange-600" />
                    App Rechten & Permissies
                  </CardTitle>
                  <CardDescription>Overzicht van benodigde rechten en waarom deze nodig zijn</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {permissions.map((perm, index) => (
                      <div key={index} className="flex items-start justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{perm.permission}</span>
                            {perm.required ? (
                              <Badge variant="destructive" className="text-xs">
                                Vereist
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs">
                                Optioneel
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{perm.reason}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="screenshots" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">App Screenshots</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Bekijk hoe de BHV360 app eruit ziet en werkt op uw mobiele apparaat
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {appScreenshots.map((screenshot, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="aspect-[9/16] bg-gray-100 flex items-center justify-center">
                    <Image
                      src={screenshot.image || "/placeholder.svg"}
                      alt={screenshot.title}
                      width={300}
                      height={600}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-1">{screenshot.title}</h3>
                    <p className="text-sm text-gray-600">{screenshot.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="download" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Download BHV360 App</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Download de officiële BHV360 app voor iOS en Android</p>
            </div>

            {/* Download Cards */}
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="text-center p-8">
                <div className="mb-6">
                  <Apple className="h-16 w-16 mx-auto text-gray-900 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">iOS App</h3>
                  <p className="text-gray-600 mb-4">Voor iPhone en iPad</p>
                  <Badge className="mb-4">Versie 2.1.0</Badge>
                </div>
                <div className="space-y-4">
                  <div className="text-sm text-gray-600">
                    <div>Minimaal iOS 13.0</div>
                    <div>iPhone 6s of nieuwer</div>
                    <div>iPad Air 2 of nieuwer</div>
                  </div>
                  <Button size="lg" className="w-full bg-black text-white hover:bg-gray-800">
                    <Apple className="h-5 w-5 mr-2" />
                    Download van App Store
                  </Button>
                </div>
              </Card>

              <Card className="text-center p-8">
                <div className="mb-6">
                  <Play className="h-16 w-16 mx-auto text-green-600 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Android App</h3>
                  <p className="text-gray-600 mb-4">Voor Android smartphones</p>
                  <Badge className="mb-4">Versie 2.1.0</Badge>
                </div>
                <div className="space-y-4">
                  <div className="text-sm text-gray-600">
                    <div>Minimaal Android 7.0</div>
                    <div>2GB RAM aanbevolen</div>
                    <div>50MB opslagruimte</div>
                  </div>
                  <Button size="lg" className="w-full bg-green-600 text-white hover:bg-green-700">
                    <Play className="h-5 w-5 mr-2" />
                    Download van Play Store
                  </Button>
                </div>
              </Card>
            </div>

            {/* QR Codes */}
            <div className="text-center space-y-6">
              <h3 className="text-xl font-semibold">Of scan de QR code</h3>
              <div className="flex justify-center gap-8">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center mb-2">
                    <QrCode className="h-16 w-16 text-gray-600" />
                  </div>
                  <div className="text-sm text-gray-600">iOS App</div>
                </div>
                <div className="text-center">
                  <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center mb-2">
                    <QrCode className="h-16 w-16 text-gray-600" />
                  </div>
                  <div className="text-sm text-gray-600">Android App</div>
                </div>
              </div>
            </div>

            {/* Support Info */}
            <Alert>
              <Globe className="h-4 w-4" />
              <AlertDescription>
                <strong>Hulp nodig?</strong> Bezoek onze support pagina of neem contact op via support@bhv360.nl voor
                hulp bij de installatie.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default MobileAppPage
