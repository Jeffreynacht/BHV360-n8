"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  Users,
  AlertTriangle,
  Download,
  Calendar,
  FileText,
  Activity,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  ArrowLeft,
} from "lucide-react"
import { useCustomer } from "@/components/customer-context"
import { NoCustomerSelected } from "@/components/no-customer-selected"
import Link from "next/link"

export default function RapportagesPage() {
  const { selectedCustomer, loading } = useCustomer()
  const [selectedPeriod, setSelectedPeriod] = useState("month")

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Laden...</p>
        </div>
      </div>
    )
  }

  if (!selectedCustomer) {
    return <NoCustomerSelected />
  }

  // Demo data
  const kpiData = {
    totalIncidents: 23,
    resolvedIncidents: 21,
    activePersonnel: 45,
    trainingCompliance: 87,
    responseTime: "2.3 min",
    equipmentStatus: 94,
  }

  const recentReports = [
    {
      id: 1,
      title: "Maandrapport BHV Activiteiten",
      type: "Maandelijks",
      date: "2024-01-15",
      status: "Voltooid",
      downloadUrl: "#",
    },
    {
      id: 2,
      title: "Incident Analyse Q4 2023",
      type: "Kwartaal",
      date: "2024-01-10",
      status: "Voltooid",
      downloadUrl: "#",
    },
    {
      id: 3,
      title: "Training Voortgang Rapport",
      type: "Wekelijks",
      date: "2024-01-08",
      status: "In behandeling",
      downloadUrl: "#",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/beheer">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Terug naar Beheer
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Rapportages & Analytics</h1>
              <p className="text-gray-600 mt-2">Uitgebreide rapportages en analyses voor {selectedCustomer.name}</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                Periode: Deze maand
              </Button>
              <Button>
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Totaal Incidenten</p>
                  <p className="text-2xl font-bold text-gray-900">{kpiData.totalIncidents}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-orange-500" />
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-600">+12%</span>
                  <span className="text-gray-500 ml-1">vs vorige maand</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Opgelost</p>
                  <p className="text-2xl font-bold text-gray-900">{kpiData.resolvedIncidents}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <div className="mt-4">
                <Progress value={(kpiData.resolvedIncidents / kpiData.totalIncidents) * 100} className="h-2" />
                <p className="text-sm text-gray-500 mt-1">
                  {Math.round((kpiData.resolvedIncidents / kpiData.totalIncidents) * 100)}% opgelost
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Actief Personeel</p>
                  <p className="text-2xl font-bold text-gray-900">{kpiData.activePersonnel}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
              <div className="mt-4">
                <Badge variant="secondary" className="text-xs">
                  BHV Gecertificeerd
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Training Compliance</p>
                  <p className="text-2xl font-bold text-gray-900">{kpiData.trainingCompliance}%</p>
                </div>
                <Shield className="w-8 h-8 text-purple-500" />
              </div>
              <div className="mt-4">
                <Progress value={kpiData.trainingCompliance} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Responstijd</p>
                  <p className="text-2xl font-bold text-gray-900">{kpiData.responseTime}</p>
                </div>
                <Clock className="w-8 h-8 text-indigo-500" />
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm">
                  <span className="text-green-600">-0.5 min</span>
                  <span className="text-gray-500 ml-1">vs vorige maand</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Apparatuur Status</p>
                  <p className="text-2xl font-bold text-gray-900">{kpiData.equipmentStatus}%</p>
                </div>
                <Activity className="w-8 h-8 text-teal-500" />
              </div>
              <div className="mt-4">
                <Progress value={kpiData.equipmentStatus} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different report types */}
        <Tabs defaultValue="incidents" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="incidents">Incidenten</TabsTrigger>
            <TabsTrigger value="training">Training</TabsTrigger>
            <TabsTrigger value="equipment">Apparatuur</TabsTrigger>
            <TabsTrigger value="reports">Rapporten</TabsTrigger>
          </TabsList>

          <TabsContent value="incidents" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Incident Trends</CardTitle>
                  <CardDescription>Overzicht van incidenten per categorie</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Brand</span>
                      <div className="flex items-center gap-2">
                        <Progress value={65} className="w-20 h-2" />
                        <span className="text-sm text-gray-600">8</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">EHBO</span>
                      <div className="flex items-center gap-2">
                        <Progress value={45} className="w-20 h-2" />
                        <span className="text-sm text-gray-600">6</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Evacuatie</span>
                      <div className="flex items-center gap-2">
                        <Progress value={30} className="w-20 h-2" />
                        <span className="text-sm text-gray-600">4</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Overig</span>
                      <div className="flex items-center gap-2">
                        <Progress value={40} className="w-20 h-2" />
                        <span className="text-sm text-gray-600">5</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Response Tijden</CardTitle>
                  <CardDescription>Gemiddelde responstijden per incident type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Brand</span>
                      <Badge variant="secondary">1.8 min</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">EHBO</span>
                      <Badge variant="secondary">2.1 min</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Evacuatie</span>
                      <Badge variant="secondary">3.2 min</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Overig</span>
                      <Badge variant="secondary">2.8 min</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="training" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Training Voortgang</CardTitle>
                <CardDescription>Overzicht van training status per afdeling</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">IT Afdeling</span>
                      <span className="text-sm text-gray-600">12/15 voltooid</span>
                    </div>
                    <Progress value={80} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">HR Afdeling</span>
                      <span className="text-sm text-gray-600">8/10 voltooid</span>
                    </div>
                    <Progress value={80} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Facilitair</span>
                      <span className="text-sm text-gray-600">6/8 voltooid</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="equipment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Apparatuur Status</CardTitle>
                <CardDescription>Status van BHV apparatuur en voorzieningen</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Brandblussers</span>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-green-600">24/25 OK</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">AED Apparaten</span>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-green-600">4/4 OK</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">EHBO Koffers</span>
                      <div className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-red-500" />
                        <span className="text-sm text-red-600">7/8 OK</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Rookmelders</span>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-green-600">45/45 OK</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Noodverlichting</span>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-green-600">32/32 OK</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Vluchtwegen</span>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-green-600">12/12 OK</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recente Rapporten</CardTitle>
                <CardDescription>Overzicht van gegenereerde rapporten</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentReports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-8 h-8 text-blue-500" />
                        <div>
                          <h3 className="font-medium text-gray-900">{report.title}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {report.type}
                            </Badge>
                            <span className="text-sm text-gray-500">{report.date}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant={report.status === "Voltooid" ? "default" : "secondary"} className="text-xs">
                          {report.status}
                        </Badge>
                        {report.status === "Voltooid" && (
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
