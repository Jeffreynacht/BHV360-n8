"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PresenceOverview } from "@/components/presence-overview"
import { useCustomer } from "@/components/customer-context"
import { Users, Shield, AlertTriangle, Clock, CheckCircle, Star, MapPin, RefreshCw } from "lucide-react"

export default function BHVAanwezigheidPage() {
  const { selectedCustomer } = useCustomer()
  const [lastUpdate, setLastUpdate] = useState(new Date())

  if (!selectedCustomer) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Geen klant geselecteerd</h2>
            <p className="text-muted-foreground">Selecteer een klant om de BHV aanwezigheid te bekijken</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">BHV Aanwezigheid</h1>
          <p className="text-muted-foreground">
            Real-time overzicht van alle BHV-ers, ploegleiders, bezoekers en monteurs voor {selectedCustomer.name}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-xs">
            <Clock className="h-3 w-3 mr-1" />
            Laatste update: {lastUpdate.toLocaleTimeString("nl-NL")}
          </Badge>
          <Button variant="outline" size="sm" onClick={() => setLastUpdate(new Date())}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Vernieuwen
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Shield className="h-6 w-6 text-blue-600 mr-2" />
              <div className="text-2xl font-bold text-blue-600">8</div>
            </div>
            <div className="text-sm text-muted-foreground">BHV-ers Aanwezig</div>
            <div className="text-xs text-green-600 mt-1">
              <CheckCircle className="h-3 w-3 inline mr-1" />
              Voldoende dekking
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Star className="h-6 w-6 text-purple-600 mr-2" />
              <div className="text-2xl font-bold text-purple-600">2</div>
            </div>
            <div className="text-sm text-muted-foreground">Ploegleiders</div>
            <div className="text-xs text-green-600 mt-1">
              <CheckCircle className="h-3 w-3 inline mr-1" />
              Van dienst
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Users className="h-6 w-6 text-green-600 mr-2" />
              <div className="text-2xl font-bold text-green-600">12</div>
            </div>
            <div className="text-sm text-muted-foreground">Bezoekers</div>
            <div className="text-xs text-blue-600 mt-1">
              <MapPin className="h-3 w-3 inline mr-1" />
              Geregistreerd
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <AlertTriangle className="h-6 w-6 text-orange-600 mr-2" />
              <div className="text-2xl font-bold text-orange-600">3</div>
            </div>
            <div className="text-sm text-muted-foreground">Monteurs</div>
            <div className="text-xs text-orange-600 mt-1">
              <Clock className="h-3 w-3 inline mr-1" />
              Actief werkzaam
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Overzicht</span>
          </TabsTrigger>
          <TabsTrigger value="bhv" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>BHV Status</span>
          </TabsTrigger>
          <TabsTrigger value="visitors" className="flex items-center space-x-2">
            <MapPin className="h-4 w-4" />
            <span>Bezoekers</span>
          </TabsTrigger>
          <TabsTrigger value="display" className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4" />
            <span>Publieke Weergave</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <PresenceOverview showFilters={true} autoRefresh={true} />
        </TabsContent>

        <TabsContent value="bhv" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span>BHV Dekking Status</span>
                </CardTitle>
                <CardDescription>Huidige BHV dekking per verdieping en gebied</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">Verdieping 1</h4>
                        <Badge className="bg-green-100 text-green-800">Gedekt</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <div>BHV-ers: 3 aanwezig</div>
                        <div>EHBO: 2 beschikbaar</div>
                        <div>Ploegleider: Petra de Vries</div>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">Verdieping 2</h4>
                        <Badge className="bg-green-100 text-green-800">Gedekt</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <div>BHV-ers: 2 aanwezig</div>
                        <div>EHBO: 1 beschikbaar</div>
                        <div>Coördinator: Jan Jansen</div>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">Verdieping 3</h4>
                        <Badge className="bg-yellow-100 text-yellow-800">Beperkt</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <div>BHV-ers: 1 aanwezig</div>
                        <div>EHBO: 0 beschikbaar</div>
                        <div>Ontruimer: Mohammed El Amrani</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Aanbevelingen</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Verdieping 3 heeft extra EHBO dekking nodig</li>
                      <li>• Alle verdiepingen hebben voldoende BHV dekking</li>
                      <li>• Ploegleiders zijn optimaal verdeeld</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <PresenceOverview showFilters={false} autoRefresh={true} />
          </div>
        </TabsContent>

        <TabsContent value="visitors" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-green-600" />
                  <span>Bezoeker & Monteur Registratie</span>
                </CardTitle>
                <CardDescription>Overzicht van alle externe personen in het gebouw</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Vandaag Ingecheckt</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Bezoekers:</span>
                          <span className="font-medium">12</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Monteurs:</span>
                          <span className="font-medium">3</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Leveranciers:</span>
                          <span className="font-medium">2</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Gemiddelde Verblijfsduur</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Bezoekers:</span>
                          <span className="font-medium">2.5 uur</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Monteurs:</span>
                          <span className="font-medium">4.2 uur</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Leveranciers:</span>
                          <span className="font-medium">1.1 uur</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-semibold text-orange-800 mb-2">Veiligheidsnotities</h4>
                    <ul className="text-sm text-orange-700 space-y-1">
                      <li>• Alle bezoekers hebben veiligheidsinstructie ontvangen</li>
                      <li>• Monteurs werken onder begeleiding van vaste medewerkers</li>
                      <li>• Nooduitgangen zijn gecommuniceerd aan alle externe personen</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <PresenceOverview showFilters={true} autoRefresh={true} />
          </div>
        </TabsContent>

        <TabsContent value="display" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span>Publieke Weergave - Lobby Display</span>
              </CardTitle>
              <CardDescription>
                Vereenvoudigde weergave voor publieke schermen in de lobby en bij recepties
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 text-white p-8 rounded-lg">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-2">BHV Status - {selectedCustomer.name}</h2>
                  <p className="text-gray-300">Laatste update: {lastUpdate.toLocaleTimeString("nl-NL")}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-400 mb-2">✓</div>
                    <div className="text-lg font-semibold">BHV Dekking</div>
                    <div className="text-sm text-gray-300">8 BHV-ers aanwezig</div>
                  </div>

                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-400 mb-2">✓</div>
                    <div className="text-lg font-semibold">EHBO</div>
                    <div className="text-sm text-gray-300">3 EHBO-ers beschikbaar</div>
                  </div>

                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-400 mb-2">2</div>
                    <div className="text-lg font-semibold">Ploegleiders</div>
                    <div className="text-sm text-gray-300">Van dienst</div>
                  </div>

                  <div className="text-center">
                    <div className="text-4xl font-bold text-yellow-400 mb-2">15</div>
                    <div className="text-lg font-semibold">Bezoekers</div>
                    <div className="text-sm text-gray-300">Geregistreerd</div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="inline-flex items-center px-4 py-2 bg-green-600 rounded-full">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    <span className="font-semibold">Alle veiligheidssystemen operationeel</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Display Instellingen</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Automatische verversing:</strong> Elke 30 seconden
                  </div>
                  <div>
                    <strong>Weergave modus:</strong> Publiek (geen persoonlijke gegevens)
                  </div>
                  <div>
                    <strong>Taal:</strong> Nederlands
                  </div>
                  <div>
                    <strong>Thema:</strong> Donker (geschikt voor lobby displays)
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
