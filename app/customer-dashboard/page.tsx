"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Users,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Shield,
  FileText,
  Bell,
  Download,
  Plus,
  BarChart3,
} from "lucide-react"

interface DashboardStats {
  totalUsers: number
  activeUsers: number
  totalLocations: number
  totalIncidents: number
  openIncidents: number
  pendingInspections: number
  completedInspections: number
  complianceScore: number
}

interface RecentActivity {
  id: string
  type: "incident" | "inspection" | "user" | "system"
  title: string
  description: string
  timestamp: string
  status: "success" | "warning" | "error" | "info"
}

interface UpcomingTask {
  id: string
  title: string
  type: "inspection" | "training" | "review"
  dueDate: string
  priority: "low" | "medium" | "high"
  location?: string
}

export default function CustomerDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalLocations: 0,
    totalIncidents: 0,
    openIncidents: 0,
    pendingInspections: 0,
    completedInspections: 0,
    complianceScore: 0,
  })

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [upcomingTasks, setUpcomingTasks] = useState<UpcomingTask[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)

      // Simulate API calls - replace with actual API endpoints
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock data - replace with actual API responses
      setStats({
        totalUsers: 45,
        activeUsers: 38,
        totalLocations: 3,
        totalIncidents: 12,
        openIncidents: 2,
        pendingInspections: 8,
        completedInspections: 24,
        complianceScore: 87,
      })

      setRecentActivity([
        {
          id: "1",
          type: "incident",
          title: "Incident gemeld",
          description: "Kleine brand in keuken - Gebouw A",
          timestamp: "2 uur geleden",
          status: "warning",
        },
        {
          id: "2",
          type: "inspection",
          title: "Inspectie voltooid",
          description: "Brandblusser controle - Verdieping 2",
          timestamp: "4 uur geleden",
          status: "success",
        },
        {
          id: "3",
          type: "user",
          title: "Nieuwe gebruiker",
          description: "Jan Janssen toegevoegd als BHV-er",
          timestamp: "1 dag geleden",
          status: "info",
        },
        {
          id: "4",
          type: "system",
          title: "Backup voltooid",
          description: "Automatische backup succesvol uitgevoerd",
          timestamp: "1 dag geleden",
          status: "success",
        },
      ])

      setUpcomingTasks([
        {
          id: "1",
          title: "EHBO-kit inspectie",
          type: "inspection",
          dueDate: "2024-01-25",
          priority: "high",
          location: "Gebouw A - Verdieping 1",
        },
        {
          id: "2",
          title: "BHV training",
          type: "training",
          dueDate: "2024-01-28",
          priority: "medium",
          location: "Hoofdkantoor",
        },
        {
          id: "3",
          title: "Evacuatieplan review",
          type: "review",
          dueDate: "2024-02-01",
          priority: "medium",
          location: "Alle locaties",
        },
      ])
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-600"
      case "warning":
        return "text-yellow-600"
      case "error":
        return "text-red-600"
      default:
        return "text-blue-600"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-green-100 text-green-800"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-96 bg-gray-200 rounded-lg"></div>
              <div className="h-96 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Overzicht van uw BHV-organisatie</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Rapport
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Incident melden
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gebruikers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">{stats.activeUsers} actief deze maand</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Locaties</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalLocations}</div>
              <p className="text-xs text-muted-foreground">Alle locaties actief</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Incidenten</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalIncidents}</div>
              <p className="text-xs text-muted-foreground">{stats.openIncidents} nog open</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Compliance</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.complianceScore}%</div>
              <Progress value={stats.complianceScore} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Recent Activity & Tasks */}
          <div className="lg:col-span-2 space-y-6">
            {/* Compliance Alert */}
            {stats.pendingInspections > 5 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  U heeft {stats.pendingInspections} openstaande inspecties. Plan deze in om compliant te blijven.
                </AlertDescription>
              </Alert>
            )}

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Recente Activiteit
                </CardTitle>
                <CardDescription>Laatste gebeurtenissen in uw organisatie</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${getStatusColor(activity.status)}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-sm text-gray-500">{activity.description}</p>
                        <p className="text-xs text-gray-400 mt-1">{activity.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Snelle Acties</CardTitle>
                <CardDescription>Veelgebruikte functies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-20 flex-col bg-transparent">
                    <Plus className="h-6 w-6 mb-2" />
                    <span className="text-xs">Incident</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col bg-transparent">
                    <Calendar className="h-6 w-6 mb-2" />
                    <span className="text-xs">Inspectie</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col bg-transparent">
                    <Users className="h-6 w-6 mb-2" />
                    <span className="text-xs">Gebruiker</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col bg-transparent">
                    <FileText className="h-6 w-6 mb-2" />
                    <span className="text-xs">Rapport</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Tasks & Stats */}
          <div className="space-y-6">
            {/* Upcoming Tasks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Aankomende Taken
                </CardTitle>
                <CardDescription>Taken die aandacht vereisen</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingTasks.map((task) => (
                    <div key={task.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium">{task.title}</h4>
                        <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                      </div>
                      <p className="text-xs text-gray-500 mb-1">{task.location}</p>
                      <p className="text-xs text-gray-400">
                        Vervalt: {new Date(task.dueDate).toLocaleDateString("nl-NL")}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Inspection Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Inspecties
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Voltooid</span>
                    <span className="text-sm font-medium">{stats.completedInspections}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Openstaand</span>
                    <span className="text-sm font-medium text-orange-600">{stats.pendingInspections}</span>
                  </div>
                  <div className="pt-2">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Voortgang</span>
                      <span>
                        {Math.round(
                          (stats.completedInspections / (stats.completedInspections + stats.pendingInspections)) * 100,
                        )}
                        %
                      </span>
                    </div>
                    <Progress
                      value={
                        (stats.completedInspections / (stats.completedInspections + stats.pendingInspections)) * 100
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Deze Maand
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Nieuwe incidenten</span>
                    <span className="text-sm font-medium">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Inspecties gedaan</span>
                    <span className="text-sm font-medium">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Trainingen</span>
                    <span className="text-sm font-medium">2</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Actieve gebruikers</span>
                    <span className="text-sm font-medium">{stats.activeUsers}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Section - Tabs */}
        <div className="mt-8">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overzicht</TabsTrigger>
              <TabsTrigger value="incidents">Incidenten</TabsTrigger>
              <TabsTrigger value="inspections">Inspecties</TabsTrigger>
              <TabsTrigger value="reports">Rapporten</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Organisatie Overzicht</CardTitle>
                  <CardDescription>Algemene informatie over uw BHV-organisatie</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">{stats.complianceScore}%</div>
                      <p className="text-sm text-gray-600">Compliance Score</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">{stats.activeUsers}</div>
                      <p className="text-sm text-gray-600">Actieve BHV-ers</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-2">{stats.totalLocations}</div>
                      <p className="text-sm text-gray-600">Locaties</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="incidents" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recente Incidenten</CardTitle>
                  <CardDescription>Overzicht van gemelde incidenten</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">Hier komt een overzicht van alle incidenten...</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="inspections" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Inspectie Planning</CardTitle>
                  <CardDescription>Overzicht van geplande en uitgevoerde inspecties</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">Hier komt het inspectie overzicht...</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Rapporten</CardTitle>
                  <CardDescription>Genereer en download rapporten</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Button variant="outline" className="h-24 flex-col bg-transparent">
                      <FileText className="h-8 w-8 mb-2" />
                      <span>Maandrapport</span>
                    </Button>
                    <Button variant="outline" className="h-24 flex-col bg-transparent">
                      <BarChart3 className="h-8 w-8 mb-2" />
                      <span>Compliance Rapport</span>
                    </Button>
                    <Button variant="outline" className="h-24 flex-col bg-transparent">
                      <Calendar className="h-8 w-8 mb-2" />
                      <span>Inspectie Rapport</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
