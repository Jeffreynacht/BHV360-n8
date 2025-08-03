"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Smartphone,
  Download,
  Bell,
  MapPin,
  Users,
  Shield,
  Heart,
  Radio,
  Camera,
  Wifi,
  CheckCircle,
  Star,
  BarChart3,
} from "lucide-react"

export default function MobileAppPage() {
  const [appStats] = useState({
    totalDownloads: 1247,
    activeUsers: 892,
    avgRating: 4.8,
    lastUpdate: "2024-01-15",
  })

  const features = [
    {
      icon: Bell,
      title: "Push Notificaties",
      description: "Ontvang direct meldingen van incidenten en alarmen",
      status: "active",
    },
    {
      icon: MapPin,
      title: "GPS Tracking",
      description: "Automatische locatie tracking voor aanwezigheidsregistratie",
      status: "active",
    },
    {
      icon: Radio,
      title: "Push-to-Talk",
      description: "Directe communicatie met andere BHV'ers",
      status: "active",
    },
    {
      icon: Camera,
      title: "Incident Rapportage",
      description: "Foto's en video's toevoegen aan incident meldingen",
      status: "active",
    },
    {
      icon: Users,
      title: "Team Overzicht",
      description: "Bekijk status en locatie van andere BHV'ers",
      status: "active",
    },
    {
      icon: Shield,
      title: "Noodprocedures",
      description: "Offline toegang tot alle noodprocedures en checklists",
      status: "active",
    },
    {
      icon: Heart,
      title: "EHBO Gids",
      description: "Stap-voor-stap EHBO instructies met afbeeldingen",
      status: "active",
    },
    {
      icon: Wifi,
      title: "Offline Modus",
      description: "Belangrijke functies werken ook zonder internet",
      status: "active",
    },
  ]

  const appVersions = [
    {
      platform: "iOS",
      version: "2.1.3",
      size: "45.2 MB",
      requirements: "iOS 13.0 of hoger",
      downloadUrl: "#",
      icon: "🍎",
    },
    {
      platform: "Android",
      version: "2.1.3",
      size: "38.7 MB",
      requirements: "Android 8.0 of hoger",
      downloadUrl: "#",
      icon: "🤖",
    },
    {
      platform: "PWA",
      version: "2.1.3",
      size: "12.1 MB",
      requirements: "Moderne browser",
      downloadUrl: "#",
      icon: "🌐",
    },
  ]

  const screenshots = [
    {
      title: "Dashboard",
      description: "Hoofdscherm met status overzicht",
      image: "/placeholder.svg?height=400&width=200&text=Dashboard",
    },
    {
      title: "Incident Melding",
      description: "Snel incident melden met foto's",
      image: "/placeholder.svg?height=400&width=200&text=Incident",
    },
    {
      title: "Team Communicatie",
      description: "Push-to-talk en chat functionaliteit",
      image: "/placeholder.svg?height=400&width=200&text=Chat",
    },
    {
      title: "Noodprocedures",
      description: "Offline toegang tot procedures",
      image: "/placeholder.svg?height=400&width=200&text=Procedures",
    },
  ]

  return (
    <div className="container p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">BHV360 Mobile App</h1>
          <p className="text-muted-foreground">Professionele BHV app voor iOS, Android en Web</p>
        </div>
        <div className="flex space-x-2">
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Download Links Delen
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overzicht</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="downloads">Downloads</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* App Stats */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Smartphone className="h-5 w-5 mr-2" />
                  App Statistieken
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Totaal Downloads:</span>
                  <Badge variant="outline">{appStats.totalDownloads.toLocaleString()}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Actieve Gebruikers:</span>
                  <Badge className="bg-green-100 text-green-800">{appStats.activeUsers.toLocaleString()}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Gemiddelde Rating:</span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{appStats.avgRating}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Laatste Update:</span>
                  <Badge variant="outline">{appStats.lastUpdate}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Screenshots */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>App Screenshots</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {screenshots.map((screenshot, index) => (
                    <div key={index} className="text-center">
                      <img
                        src={screenshot.image || "/placeholder.svg"}
                        alt={screenshot.title}
                        className="w-full h-48 object-cover rounded-lg border mb-2"
                      />
                      <h3 className="font-medium text-sm">{screenshot.title}</h3>
                      <p className="text-xs text-muted-foreground">{screenshot.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Download Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {appVersions.map((version, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{version.icon}</span>
                    <div>
                      <CardTitle className="text-lg">{version.platform}</CardTitle>
                      <p className="text-sm text-muted-foreground">Versie {version.version}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Grootte:</span>
                      <span>{version.size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Vereisten:</span>
                      <span className="text-right">{version.requirements}</span>
                    </div>
                  </div>
                  <Button className="w-full" onClick={() => window.open(version.downloadUrl, "_blank")}>
                    <Download className="h-4 w-4 mr-2" />
                    Download {version.platform}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="features">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <feature.icon className="h-6 w-6 text-blue-600" />
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Actief
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="downloads">
          <div className="space-y-6">
            {/* QR Codes for Downloads */}
            <Card>
              <CardHeader>
                <CardTitle>Download QR Codes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <img
                      src="/placeholder.svg?height=150&width=150&text=iOS+QR"
                      alt="iOS QR Code"
                      className="mx-auto mb-2 border"
                    />
                    <h3 className="font-medium">iOS App Store</h3>
                    <p className="text-sm text-muted-foreground">Scan voor iPhone/iPad</p>
                  </div>
                  <div className="text-center">
                    <img
                      src="/placeholder.svg?height=150&width=150&text=Android+QR"
                      alt="Android QR Code"
                      className="mx-auto mb-2 border"
                    />
                    <h3 className="font-medium">Google Play Store</h3>
                    <p className="text-sm text-muted-foreground">Scan voor Android</p>
                  </div>
                  <div className="text-center">
                    <img
                      src="/placeholder.svg?height=150&width=150&text=PWA+QR"
                      alt="PWA QR Code"
                      className="mx-auto mb-2 border"
                    />
                    <h3 className="font-medium">Web App (PWA)</h3>
                    <p className="text-sm text-muted-foreground">Scan voor browser</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Installation Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>Installatie Instructies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2 flex items-center">🍎 iOS Installatie</h3>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Open de App Store op uw iPhone of iPad</li>
                    <li>Zoek naar "BHV360" of scan de QR code</li>
                    <li>Tik op "Installeren" en voer uw Apple ID wachtwoord in</li>
                    <li>Open de app en log in met uw BHV360 account</li>
                    <li>Sta notificaties en locatietoegang toe voor alle functies</li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-medium mb-2 flex items-center">🤖 Android Installatie</h3>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Open Google Play Store op uw Android apparaat</li>
                    <li>Zoek naar "BHV360" of scan de QR code</li>
                    <li>Tik op "Installeren" en accepteer de benodigde rechten</li>
                    <li>Open de app en log in met uw BHV360 account</li>
                    <li>Configureer notificatie-instellingen in de app</li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-medium mb-2 flex items-center">🌐 Web App (PWA) Installatie</h3>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Open uw browser en ga naar app.bhv360.nl</li>
                    <li>Log in met uw BHV360 account</li>
                    <li>Klik op "Toevoegen aan startscherm" in uw browser</li>
                    <li>De app wordt toegevoegd als een native app</li>
                    <li>Sta notificaties toe voor push berichten</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Dagelijkse Actieve Gebruikers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">743</div>
                <p className="text-xs text-muted-foreground">+12% t.o.v. vorige week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Push Notificaties</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,247</div>
                <p className="text-xs text-muted-foreground">Verzonden deze maand</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Incident Meldingen</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">89</div>
                <p className="text-xs text-muted-foreground">Via mobile app</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Gemiddelde Sessie</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4m 32s</div>
                <p className="text-xs text-muted-foreground">Per app sessie</p>
              </CardContent>
            </Card>
          </div>

          {/* Usage Chart Placeholder */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>App Gebruik Afgelopen 30 Dagen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500">Usage Analytics Chart</p>
                  <p className="text-sm text-gray-400">Integratie met analytics platform vereist</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Device Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Verdeling</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">iOS</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full">
                        <div className="w-16 h-2 bg-blue-500 rounded-full"></div>
                      </div>
                      <span className="text-sm">67%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Android</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full">
                        <div className="w-8 h-2 bg-green-500 rounded-full"></div>
                      </div>
                      <span className="text-sm">33%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span>Push Notificaties</span>
                    <Badge variant="outline">94%</Badge>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Incident Rapportage</span>
                    <Badge variant="outline">87%</Badge>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Team Communicatie</span>
                    <Badge variant="outline">76%</Badge>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Noodprocedures</span>
                    <Badge variant="outline">68%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
