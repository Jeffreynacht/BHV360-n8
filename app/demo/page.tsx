"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, MapPin, Users, AlertTriangle, BarChart3, Smartphone, ArrowLeft, Eye, Download } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function DemoPage() {
  const [activeDemo, setActiveDemo] = useState("plotkaart")

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/">
                <Image
                  src="/images/bhv360-logo-full.png"
                  alt="BHV360 Logo"
                  width={160}
                  height={40}
                  className="h-8 w-auto"
                />
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="outline">Inloggen</Button>
              </Link>
              <Link href="/register">
                <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90 text-white">
                  Gratis Proberen
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-green-100 text-green-800 border-green-200">🎯 Interactieve Demo</Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Ontdek BHV360 in actie</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Bekijk hoe eenvoudig het is om professionele BHV plotkaarten te maken, incidenten te beheren en uw team te
            coördineren.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90 text-white">
              <Play className="mr-2 h-5 w-5" />
              Start Interactieve Demo
            </Button>
            <Link href="/register">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-green-500 text-green-700 hover:bg-green-50 bg-transparent"
              >
                Direct Gratis Proberen
              </Button>
            </Link>
          </div>
        </div>

        {/* Demo Tabs */}
        <Tabs value={activeDemo} onValueChange={setActiveDemo} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 mb-8">
            <TabsTrigger value="plotkaart" className="flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              Plotkaart
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Team
            </TabsTrigger>
            <TabsTrigger value="incidenten" className="flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Incidenten
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="mobile" className="flex items-center">
              <Smartphone className="w-4 h-4 mr-2" />
              Mobile
            </TabsTrigger>
          </TabsList>

          {/* Plotkaart Demo */}
          <TabsContent value="plotkaart">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Interactieve Plotkaart Editor</h3>
                <p className="text-gray-600 mb-6">
                  Maak professionele BHV plotkaarten met onze intuïtieve drag-and-drop editor. Gebruik officiële
                  Nederlandse BHV-symbolen en exporteer naar PDF.
                </p>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600 font-semibold text-sm">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Upload plattegrond</h4>
                      <p className="text-gray-600 text-sm">Sleep uw bestaande plattegrond in de editor</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600 font-semibold text-sm">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Plaats BHV-symbolen</h4>
                      <p className="text-gray-600 text-sm">Kies uit 50+ officiële veiligheidssymbolen</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600 font-semibold text-sm">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Exporteer en deel</h4>
                      <p className="text-gray-600 text-sm">Download als PDF of deel digitaal</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex space-x-3">
                  <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90 text-white">
                    <Play className="w-4 h-4 mr-2" />
                    Probeer Editor
                  </Button>
                  <Button variant="outline">
                    <Eye className="w-4 h-4 mr-2" />
                    Bekijk Voorbeeld
                  </Button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MapPin className="h-8 w-8 text-green-600" />
                    </div>
                    <p className="text-gray-600 font-medium">Plotkaart Editor Demo</p>
                    <p className="text-sm text-gray-500">Interactieve demo van de editor</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Team Demo */}
          <TabsContent value="team">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">BHV Team Management</h3>
                <p className="text-gray-600 mb-6">
                  Beheer uw BHV team, certificeringen en trainingen op één centrale plek. Krijg automatische
                  herinneringen voor verlopen certificaten.
                </p>

                <div className="space-y-4">
                  <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-0">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">Jan van der Berg</h4>
                          <p className="text-sm text-gray-600">BHV Coördinator</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Actief</Badge>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">Certificaat verloopt: 15 maart 2025</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-0">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">Sarah Bakker</h4>
                          <p className="text-sm text-gray-600">EHBO'er</p>
                        </div>
                        <Badge variant="outline">Training nodig</Badge>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">Certificaat verloopt: 1 april 2024</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-6">
                  <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90 text-white">
                    <Users className="w-4 h-4 mr-2" />
                    Bekijk Team Overzicht
                  </Button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="h-8 w-8 text-blue-600" />
                    </div>
                    <p className="text-gray-600 font-medium">Team Management Demo</p>
                    <p className="text-sm text-gray-500">BHV team beheer interface</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Incidenten Demo */}
          <TabsContent value="incidenten">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Incident Management</h3>
                <p className="text-gray-600 mb-6">
                  Registreer incidenten snel en efficiënt. Volg de status, voeg foto's toe en genereer automatisch
                  rapporten voor compliance.
                </p>

                <div className="space-y-4">
                  <Card className="border-l-4 border-l-red-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">Brand in keuken</h4>
                        <Badge variant="destructive">Hoog</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Kleine brand ontstaan door oververhitting frituurpan</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Gemeld: 2 uur geleden</span>
                        <span>Status: Opgelost</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-yellow-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">Uitglijpartij trap</h4>
                        <Badge variant="secondary">Laag</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Medewerker uitgegleden op natte vloer bij ingang</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Gemeld: 1 dag geleden</span>
                        <span>Status: In behandeling</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-6">
                  <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90 text-white">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Nieuw Incident Melden
                  </Button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertTriangle className="h-8 w-8 text-orange-600" />
                    </div>
                    <p className="text-gray-600 font-medium">Incident Management Demo</p>
                    <p className="text-sm text-gray-500">Incident registratie en tracking</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Analytics Demo */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Analytics & Rapportage</h3>
                <p className="text-gray-600 mb-6">
                  Krijg inzicht in uw veiligheidsprestaties met uitgebreide analytics. Genereer automatisch compliance
                  rapporten en identificeer trends.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-0">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-gray-900">85%</div>
                      <div className="text-sm text-gray-600">Compliance Score</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-0">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-gray-900">12</div>
                      <div className="text-sm text-gray-600">Actieve BHV'ers</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-0">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-gray-900">3</div>
                      <div className="text-sm text-gray-600">Incidenten (30d)</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-0">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-gray-900">98%</div>
                      <div className="text-sm text-gray-600">Uptime</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-6">
                  <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90 text-white mr-3">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Bekijk Dashboard
                  </Button>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download Rapport
                  </Button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BarChart3 className="h-8 w-8 text-purple-600" />
                    </div>
                    <p className="text-gray-600 font-medium">Analytics Dashboard Demo</p>
                    <p className="text-sm text-gray-500">Uitgebreide rapportages en inzichten</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Mobile Demo */}
          <TabsContent value="mobile">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Mobile App</h3>
                <p className="text-gray-600 mb-6">
                  Toegang tot alle BHV functionaliteiten onderweg. Native iOS en Android apps met offline
                  functionaliteit en push notificaties.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Smartphone className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Offline Toegang</h4>
                      <p className="text-sm text-gray-600">Bekijk plotkaarten en gegevens zonder internet</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Snelle Incident Melding</h4>
                      <p className="text-sm text-gray-600">Meld incidenten direct met foto's en locatie</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Team Communicatie</h4>
                      <p className="text-sm text-gray-600">Direct contact met BHV team leden</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90 text-white">
                    <Smartphone className="w-4 h-4 mr-2" />
                    Download App
                  </Button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Smartphone className="h-8 w-8 text-indigo-600" />
                    </div>
                    <p className="text-gray-600 font-medium">Mobile App Demo</p>
                    <p className="text-sm text-gray-500">iOS en Android applicatie</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-white mb-4">Klaar om BHV360 uit te proberen?</h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Start vandaag nog met uw 30 dagen gratis proefperiode. Geen setup kosten, geen verplichtingen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-50 px-8 py-4 text-lg">
                30 Dagen Gratis Proberen
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 text-lg bg-transparent"
              >
                Persoonlijke Demo Aanvragen
              </Button>
            </Link>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-800">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Terug naar homepage
          </Link>
        </div>
      </div>
    </div>
  )
}
