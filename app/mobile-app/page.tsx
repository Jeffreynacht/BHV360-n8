"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Smartphone,
  Star,
  Shield,
  Camera,
  MapPin,
  Bell,
  Wifi,
  Battery,
  QrCode,
  Apple,
  Play,
  Users,
  BarChart3,
  CheckCircle,
  Info,
} from "lucide-react"

interface AppFeature {
  icon: React.ReactNode
  title: string
  description: string
  permissions?: string[]
}

interface AppStats {
  downloads: string
  rating: number
  reviews: number
  lastUpdate: string
  version: string
  size: string
}

export default function MobileAppPage() {
  const [activeTab, setActiveTab] = useState("overview")

  const appStats: AppStats = {
    downloads: "10.000+",
    rating: 4.8,
    reviews: 247,
    lastUpdate: "15 december 2024",
    version: "2.1.0",
    size: "45 MB",
  }

  const features: AppFeature[] = [
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "GPS Locatie",
      description: "Automatische locatiebepaling voor snelle hulpverlening",
      permissions: ["ACCESS_FINE_LOCATION", "ACCESS_COARSE_LOCATION"],
    },
    {
      icon: <Camera className="h-6 w-6" />,
      title: "Camera & Foto's",
      description: "Documenteer incidenten met foto's en video's",
      permissions: ["CAMERA", "WRITE_EXTERNAL_STORAGE"],
    },
    {
      icon: <Bell className="h-6 w-6" />,
      title: "Push Notificaties",
      description: "Ontvang directe meldingen bij noodsituaties",
      permissions: ["RECEIVE_BOOT_COMPLETED", "VIBRATE"],
    },
    {
      icon: <Wifi className="h-6 w-6" />,
      title: "Netwerk Toegang",
      description: "Synchroniseer data en ontvang real-time updates",
      permissions: ["INTERNET", "ACCESS_NETWORK_STATE"],
    },
    {
      icon: <QrCode className="h-6 w-6" />,
      title: "QR Code Scanner",
      description: "Scan NFC tags en QR codes voor snelle check-ins",
      permissions: ["CAMERA"],
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Biometrische Beveiliging",
      description: "Veilige toegang met vingerafdruk of gezichtsherkenning",
      permissions: ["USE_FINGERPRINT", "USE_BIOMETRIC"],
    },
  ]

  const permissions = [
    {
      name: "Locatie",
      reason: "Voor automatische positiebepaling tijdens noodsituaties",
      required: true,
      icon: <MapPin className="h-4 w-4" />,
    },
    {
      name: "Camera",
      reason: "Voor het documenteren van incidenten en QR code scanning",
      required: true,
      icon: <Camera className="h-4 w-4" />,
    },
    {
      name: "Notificaties",
      reason: "Voor het ontvangen van belangrijke veiligheidsmeldingen",
      required: true,
      icon: <Bell className="h-4 w-4" />,
    },
    {
      name: "Opslag",
      reason: "Voor het lokaal opslaan van plotkaarten en procedures",
      required: false,
      icon: <Battery className="h-4 w-4" />,
    },
    {
      name: "Netwerk",
      reason: "Voor synchronisatie en real-time communicatie",
      required: true,
      icon: <Wifi className="h-4 w-4" />,
    },
  ]

  const screenshots = [
    {
      url: "/placeholder.svg?height=600&width=300&text=Dashboard",
      title: "Dashboard",
      description: "Overzicht van alle BHV functies",
    },
    {
      url: "/placeholder.svg?height=600&width=300&text=Plotkaart",
      title: "Interactieve Plotkaart",
      description: "Navigeer door het gebouw",
    },
    {
      url: "/placeholder.svg?height=600&width=300&text=Incident",
      title: "Incident Melden",
      description: "Snelle incidentregistratie",
    },
    {
      url: "/placeholder.svg?height=600&width=300&text=Procedures",
      title: "BHV Procedures",
      description: "Stap-voor-stap instructies",
    },
    {
      url: "/placeholder.svg?height=600&width=300&text=Checklist",
      title: "Inspectie Checklists",
      description: "Digitale controles uitvoeren",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Smartphone className="h-12 w-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">BHV360 Mobiele App</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Professionele BHV software altijd binnen handbereik. Download nu de officiële BHV360 app voor iOS en
            Android.
          </p>

          {/* Download Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button size="lg" className="bg-black hover:bg-gray-800 text-white px-8 py-3">
              <Apple className="h-5 w-5 mr-2" />
              Download voor iOS
            </Button>
            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3">
              <Play className="h-5 w-5 mr-2" />
              Download voor Android
            </Button>
          </div>

          {/* QR Codes */}
          <div className="flex justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-white rounded-lg shadow-md flex items-center justify-center mb-2">
                <QrCode className="h-16 w-16 text-gray-400" />
              </div>
              <p className="text-sm text-gray-600">iOS App Store</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-white rounded-lg shadow-md flex items-center justify-center mb-2">
                <QrCode className="h-16 w-16 text-gray-400" />
              </div>
              <p className="text-sm text-gray-600">Google Play</p>
            </div>
          </div>

          {/* App Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{appStats.downloads}</div>
              <div className="text-sm text-gray-600">Downloads</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <span className="text-2xl font-bold text-gray-900">{appStats.rating}</span>
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
              </div>
              <div className="text-sm text-gray-600">{appStats.reviews} reviews</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{appStats.version}</div>
              <div className="text-sm text-gray-600">Versie</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{appStats.size}</div>
              <div className="text-sm text-gray-600">App grootte</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto mb-8">
            <TabsTrigger value="overview">Overzicht</TabsTrigger>
            <TabsTrigger value="features">Functies</TabsTrigger>
            <TabsTrigger value="permissions">Rechten</TabsTrigger>
            <TabsTrigger value="screenshots">Screenshots</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    App Statistieken
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Gebruikerstevredenheid</span>
                    <div className="flex items-center gap-2">
                      <Progress value={96} className="w-20" />
                      <span className="text-sm font-medium">96%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Prestaties</span>
                    <div className="flex items-center gap-2">
                      <Progress value={94} className="w-20" />
                      <span className="text-sm font-medium">94%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Stabiliteit</span>
                    <div className="flex items-center gap-2">
                      <Progress value={99} className="w-20" />
                      <span className="text-sm font-medium">99%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Batterijverbruik</span>
                    <Badge variant="outline" className="text-green-600">
                      Laag
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Gebruikers Reviews
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="border-l-4 border-green-500 pl-4">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <span className="text-sm font-medium">Jan V.</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        "Fantastische app! Zeer gebruiksvriendelijk en alle functies werken perfect."
                      </p>
                    </div>

                    <div className="border-l-4 border-green-500 pl-4">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <span className="text-sm font-medium">Maria K.</span>
                      </div>
                      <p className="text-sm text-gray-600">"Heeft onze BHV procedures enorm verbeterd. Aanrader!"</p>
                    </div>

                    <div className="border-l-4 border-blue-500 pl-4">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex">
                          {[...Array(4)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                          ))}
                          <Star className="h-4 w-4 text-gray-300" />
                        </div>
                        <span className="text-sm font-medium">Peter D.</span>
                      </div>
                      <p className="text-sm text-gray-600">"Goede app, zou graag meer offline functionaliteit zien."</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Wat is nieuw in versie {appStats.version}</CardTitle>
                <CardDescription>Laatste update: {appStats.lastUpdate}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Verbeterde offline functionaliteit</p>
                      <p className="text-sm text-gray-600">
                        Plotkaarten en procedures zijn nu volledig offline beschikbaar
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Snellere QR code scanning</p>
                      <p className="text-sm text-gray-600">50% snellere herkenning van NFC tags en QR codes</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Nieuwe dark mode</p>
                      <p className="text-sm text-gray-600">
                        Oogvriendelijke donkere interface voor gebruik in het donker
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Bug fixes en prestatie verbeteringen</p>
                      <p className="text-sm text-gray-600">Algemene stabiliteit en snelheid verbeteringen</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 rounded-lg text-orange-600">{feature.icon}</div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{feature.description}</p>
                    {feature.permissions && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-700">Vereiste rechten:</p>
                        {feature.permissions.map((permission, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs mr-1">
                            {permission}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="permissions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  App Rechten & Privacy
                </CardTitle>
                <CardDescription>
                  Waarom de BHV360 app bepaalde rechten nodig heeft en hoe we uw privacy beschermen
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {permissions.map((permission, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className="p-2 bg-gray-100 rounded-lg">{permission.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{permission.name}</h3>
                          {permission.required ? (
                            <Badge variant="destructive" className="text-xs">
                              Vereist
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">
                              Optioneel
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm">{permission.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-2">Privacy Garantie</h4>
                      <p className="text-blue-800 text-sm">
                        BHV360 respecteert uw privacy. Alle gegevens worden veilig opgeslagen en nooit gedeeld met
                        derden. Locatiegegevens worden alleen gebruikt voor noodsituaties en worden niet getrackt voor
                        andere doeleinden.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="screenshots" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {screenshots.map((screenshot, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-[9/16] bg-gray-100 relative">
                    <Image
                      src={screenshot.url || "/placeholder.svg"}
                      alt={screenshot.title}
                      fill
                      className="object-cover"
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
        </Tabs>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Klaar om te beginnen?</h2>
              <p className="text-gray-600 mb-6">Download de BHV360 app en ervaar de toekomst van BHV management</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-black hover:bg-gray-800">
                  <Apple className="h-5 w-5 mr-2" />
                  App Store
                </Button>
                <Button size="lg" className="bg-green-600 hover:bg-green-700">
                  <Play className="h-5 w-5 mr-2" />
                  Google Play
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Gratis download • Geen verborgen kosten • 30 dagen gratis trial
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
