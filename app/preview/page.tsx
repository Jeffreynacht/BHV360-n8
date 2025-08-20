"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Shield,
  Users,
  Building,
  AlertTriangle,
  MapPin,
  Smartphone,
  BarChart3,
  Settings,
  Bell,
  FileText,
  Zap,
  Heart,
  Phone,
  Navigation,
  Eye,
  CheckCircle,
  Clock,
  TrendingUp,
} from "lucide-react"

export default function PreviewPage() {
  const [activeTab, setActiveTab] = useState("dashboard")

  const mockStats = {
    totalUsers: 247,
    activeBhvUsers: 45,
    totalBuildings: 8,
    activeIncidents: 3,
    completedTrainings: 89,
    upcomingInspections: 12,
  }

  const mockIncidents = [
    { id: 1, title: "Brandmelding Gebouw A", severity: "high", status: "active", time: "2 min geleden" },
    { id: 2, title: "EHBO incident Kantine", severity: "medium", status: "resolved", time: "15 min geleden" },
    { id: 3, title: "Evacuatie oefening", severity: "low", status: "scheduled", time: "Morgen 14:00" },
  ]

  const mockUsers = [
    { id: 1, name: "Jan Jansen", role: "BHV Coördinator", status: "online", department: "Facilitair" },
    { id: 2, name: "Petra de Vries", role: "EHBO'er", status: "online", department: "HR" },
    { id: 3, name: "Mike van der Berg", role: "Brandwacht", status: "offline", department: "Techniek" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">BHV360</h1>
              <p className="text-gray-600">Bedrijfshulpverlening Management Platform</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <CheckCircle className="w-3 h-3 mr-1" />
              Systeem Online
            </Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              <Users className="w-3 h-3 mr-1" />
              {mockStats.totalUsers} Gebruikers
            </Badge>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              <Building className="w-3 h-3 mr-1" />
              {mockStats.totalBuildings} Gebouwen
            </Badge>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="incidents" className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Incidenten
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Gebruikers
            </TabsTrigger>
            <TabsTrigger value="plotkaart" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Plotkaart
            </TabsTrigger>
            <TabsTrigger value="mobile" className="flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              Mobiel
            </TabsTrigger>
            <TabsTrigger value="features" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Features
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Totaal Gebruikers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockStats.totalUsers}</div>
                  <div className="flex items-center text-sm opacity-90">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +12% deze maand
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Actieve BHV'ers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockStats.activeBhvUsers}</div>
                  <div className="flex items-center text-sm opacity-90">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Gecertificeerd
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Actieve Incidenten</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockStats.activeIncidents}</div>
                  <div className="flex items-center text-sm opacity-90">
                    <Clock className="w-4 h-4 mr-1" />
                    Laatste: 2 min
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Trainingen</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockStats.completedTrainings}%</div>
                  <div className="flex items-center text-sm opacity-90">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    Voltooid
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    Recente Incidenten
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockIncidents.map((incident) => (
                    <div key={incident.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{incident.title}</div>
                        <div className="text-sm text-gray-500">{incident.time}</div>
                      </div>
                      <Badge
                        variant={
                          incident.severity === "high"
                            ? "destructive"
                            : incident.severity === "medium"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {incident.status}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-500" />
                    BHV Team Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${user.status === "online" ? "bg-green-500" : "bg-gray-400"}`}
                        />
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-gray-500">
                            {user.role} • {user.department}
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline">{user.status}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Incidents Tab */}
          <TabsContent value="incidents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  Incident Management
                </CardTitle>
                <CardDescription>Real-time incident tracking en response management</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">3</div>
                    <div className="text-sm text-red-700">Actieve Incidenten</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">7</div>
                    <div className="text-sm text-yellow-700">In Behandeling</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">45</div>
                    <div className="text-sm text-green-700">Opgelost</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Incident Features:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Bell className="w-5 h-5 text-blue-500" />
                      <span>Real-time notificaties</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <MapPin className="w-5 h-5 text-green-500" />
                      <span>Locatie tracking</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Phone className="w-5 h-5 text-orange-500" />
                      <span>Automatische escalatie</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <FileText className="w-5 h-5 text-purple-500" />
                      <span>Incident rapportage</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  Gebruikers Management
                </CardTitle>
                <CardDescription>BHV team beheer en certificering tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{mockStats.totalUsers}</div>
                    <div className="text-sm text-blue-700">Totaal Gebruikers</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{mockStats.activeBhvUsers}</div>
                    <div className="text-sm text-green-700">BHV Gecertificeerd</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">12</div>
                    <div className="text-sm text-orange-700">Training Nodig</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">8</div>
                    <div className="text-sm text-purple-700">Coördinatoren</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Gebruiker Features:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Shield className="w-5 h-5 text-blue-500" />
                      <span>Rol-gebaseerde toegang</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>Certificering tracking</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Clock className="w-5 h-5 text-orange-500" />
                      <span>Training planning</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <BarChart3 className="w-5 h-5 text-purple-500" />
                      <span>Performance analytics</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Plotkaart Tab */}
          <TabsContent value="plotkaart" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-500" />
                  Interactieve Plotkaart
                </CardTitle>
                <CardDescription>Visuele gebouw layouts met BHV voorzieningen</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 rounded-lg p-8 text-center mb-6">
                  <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Plotkaart Editor</h3>
                  <p className="text-gray-600 mb-4">
                    Interactieve gebouwplattegronden met drag-and-drop functionaliteit
                  </p>
                  <Button>
                    <Navigation className="w-4 h-4 mr-2" />
                    Open Plotkaart Editor
                  </Button>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Plotkaart Features:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Eye className="w-5 h-5 text-blue-500" />
                      <span>Real-time visualisatie</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Settings className="w-5 h-5 text-green-500" />
                      <span>Drag & drop editor</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Heart className="w-5 h-5 text-red-500" />
                      <span>BHV voorzieningen</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-orange-500" />
                      <span>Evacuatie routes</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Mobile Tab */}
          <TabsContent value="mobile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-purple-500" />
                  Mobiele App
                </CardTitle>
                <CardDescription>Native mobiele ervaring voor BHV teams</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-8 text-center mb-6">
                  <Smartphone className="w-16 h-16 text-purple-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">BHV360 Mobile</h3>
                  <p className="text-gray-600 mb-4">
                    Volledig geoptimaliseerd voor mobiele apparaten met offline functionaliteit
                  </p>
                  <div className="flex justify-center gap-4">
                    <Button variant="outline">
                      <Smartphone className="w-4 h-4 mr-2" />
                      iOS App
                    </Button>
                    <Button variant="outline">
                      <Smartphone className="w-4 h-4 mr-2" />
                      Android App
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Mobiele Features:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Bell className="w-5 h-5 text-blue-500" />
                      <span>Push notificaties</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <MapPin className="w-5 h-5 text-green-500" />
                      <span>GPS locatie tracking</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Phone className="w-5 h-5 text-orange-500" />
                      <span>Noodknop functie</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-purple-500" />
                      <span>Offline synchronisatie</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Features Tab */}
          <TabsContent value="features" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Shield className="w-5 h-5 text-blue-500" />
                    Veiligheid
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Real-time monitoring</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Automatische alerting</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Incident tracking</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Users className="w-5 h-5 text-green-500" />
                    Team Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Gebruikers beheer</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Rol-gebaseerde toegang</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Training tracking</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <BarChart3 className="w-5 h-5 text-purple-500" />
                    Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Performance dashboards</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Rapportage tools</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Trend analyse</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Smartphone className="w-5 h-5 text-orange-500" />
                    Mobiel
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Native mobile apps</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Offline functionaliteit</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Push notificaties</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Settings className="w-5 h-5 text-gray-500" />
                    Integraties
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>API endpoints</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Third-party systemen</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Webhook support</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    Automatisering
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Workflow automation</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Smart scheduling</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>AI-powered insights</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-600">
          <p className="mb-2">BHV360 - Professionele Bedrijfshulpverlening Software</p>
          <div className="flex justify-center gap-4 text-sm">
            <span>✅ GDPR Compliant</span>
            <span>✅ ISO 27001</span>
            <span>✅ 24/7 Support</span>
            <span>✅ 99.9% Uptime</span>
          </div>
        </div>
      </div>
    </div>
  )
}
