"use client"

import { useState } from "react"
import { useCustomer } from "@/components/customer-context"
import { NoCustomerSelected } from "@/components/no-customer-selected"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProvincieBrabantPlotkaart } from "@/components/provincie-brabant-plotkaart"
import { Eye, Edit, Users, Shield, AlertTriangle, CheckCircle2, Clock, MapPin, Phone } from "lucide-react"

export default function BHVPage() {
  const { selectedCustomer } = useCustomer()
  const [activeTab, setActiveTab] = useState("plotkaart")

  if (!selectedCustomer) {
    return <NoCustomerSelected />
  }

  return (
    <div className="container p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">BHV360 Dashboard</h1>
          <p className="text-muted-foreground">Bedrijfshulpverlening overzicht voor {selectedCustomer.name}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-green-50 text-green-700">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Systeem Operationeel
          </Badge>
          <Button onClick={() => (window.location.href = "/bhv/editor")}>
            <Edit className="h-4 w-4 mr-2" />
            Editor Openen
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">BHV'ers Beschikbaar</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Voorzieningen</p>
                <p className="text-2xl font-bold">48</p>
              </div>
              <Shield className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Actieve Incidenten</p>
                <p className="text-2xl font-bold">0</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Laatste Controle</p>
                <p className="text-2xl font-bold">2d</p>
              </div>
              <Clock className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="plotkaart">
            <Eye className="h-4 w-4 mr-2" />
            Plotkaart
          </TabsTrigger>
          <TabsTrigger value="status">
            <Shield className="h-4 w-4 mr-2" />
            Status
          </TabsTrigger>
          <TabsTrigger value="contact">
            <Phone className="h-4 w-4 mr-2" />
            Noodcontacten
          </TabsTrigger>
        </TabsList>

        <TabsContent value="plotkaart">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Interactieve BHV Plotkaart</CardTitle>
                <Button variant="outline" onClick={() => (window.location.href = "/bhv/editor")}>
                  <Edit className="h-4 w-4 mr-2" />
                  Bewerken
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ProvincieBrabantPlotkaart />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
                  Operationele Voorzieningen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-medium">Brandblussers</span>
                    </div>
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      24/24
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-medium">AED's</span>
                    </div>
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      6/6
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-medium">Nooduitgangen</span>
                    </div>
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      12/12
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-blue-500" />
                  BHV Team Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="font-medium">Beschikbaar</span>
                    </div>
                    <Badge variant="outline" className="bg-blue-100 text-blue-800">
                      8 personen
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span className="font-medium">Van dienst</span>
                    </div>
                    <Badge variant="outline" className="bg-orange-100 text-orange-800">
                      2 personen
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                      <span className="font-medium">Niet beschikbaar</span>
                    </div>
                    <Badge variant="outline" className="bg-gray-100 text-gray-800">
                      2 personen
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contact">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="h-5 w-5 mr-2 text-red-500" />
                  Noodcontacten
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-red-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-red-800">Brandweer / Ambulance / Politie</h3>
                        <p className="text-red-600">Voor alle noodsituaties</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-red-800">112</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">BHV Coördinator</h3>
                        <p className="text-muted-foreground">Jan Jansen</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">06-12345678</p>
                        <p className="text-sm text-muted-foreground">j.jansen@brabant.nl</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">Facilitair Manager</h3>
                        <p className="text-muted-foreground">Maria Janssen</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">06-23456789</p>
                        <p className="text-sm text-muted-foreground">m.janssen@brabant.nl</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-green-500" />
                  Verzamelpunten
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-green-50">
                    <div>
                      <h3 className="font-semibold text-green-800">Primair Verzamelpunt</h3>
                      <p className="text-green-600">Parkeerplaats voorzijde</p>
                      <p className="text-sm text-green-600 mt-1">Voor alle verdiepingen van het hoofdgebouw</p>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg bg-blue-50">
                    <div>
                      <h3 className="font-semibold text-blue-800">Secundair Verzamelpunt</h3>
                      <p className="text-blue-600">Parkeerplaats achterzijde</p>
                      <p className="text-sm text-blue-600 mt-1">Bij blokkering van het primaire verzamelpunt</p>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">Bijgebouw A</h3>
                      <p className="text-muted-foreground">Grasveld naast bijgebouw</p>
                      <p className="text-sm text-muted-foreground mt-1">Specifiek voor bijgebouw A</p>
                    </div>
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
