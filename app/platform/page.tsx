"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  MapPin,
  AlertTriangle,
  BarChart3,
  Settings,
  Bell,
  Activity,
  Clock,
  CheckCircle,
  Database,
  Server,
  Smartphone,
  QrCode,
  Calendar,
  UserCheck,
  Eye,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function PlatformPage() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [systemHealth, setSystemHealth] = useState({
    database: "operational",
    api: "operational",
    notifications: "operational",
    mobile: "operational",
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const stats = [
    { label: "Actieve BHV'ers", value: "24", change: "+2", icon: Users, color: "text-green-600" },
    { label: "Open Incidenten", value: "0", change: "0", icon: AlertTriangle, color: "text-green-600" },
    { label: "Plotkaarten", value: "8", change: "+1", icon: MapPin, color: "text-blue-600" },
    { label: "Systeem Status", value: "100%", change: "0", icon: Activity, color: "text-green-600" },
  ]

  const recentActivities = [
    {
      type: "plotkaart",
      message: "Plotkaart 'Hoofdgebouw BG' bijgewerkt",
      time: "2 minuten geleden",
      user: "Jan de Vries",
      icon: MapPin,
    },
    {
      type: "bhv",
      message: "Nieuwe BHV'er toegevoegd: Maria Janssen",
      time: "15 minuten geleden",
      user: "System",
      icon: UserCheck,
    },
    {
      type: "inspection",
      message: "Maandelijkse inspectie voltooid",
      time: "1 uur geleden",
      user: "Piet Bakker",
      icon: CheckCircle,
    },
    {
      type: "training",
      message: "BHV training gepland voor volgende week",
      time: "2 uur geleden",
      user: "Lisa van Dam",
      icon: Calendar,
    },
  ]

  const quickActions = [
    {
      title: "Nieuwe Plotkaart",
      description: "Maak een nieuwe BHV plotkaart",
      icon: MapPin,
      href: "/beheer/plotkaart-editor",
      color: "bg-blue-500",
    },
    {
      title: "Incident Melden",
      description: "Registreer een nieuw incident",
      icon: AlertTriangle,
      href: "/incidenten",
      color: "bg-red-500",
    },
    {
      title: "BHV Team",
      description: "Beheer je BHV team",
      icon: Users,
      href: "/beheer/gebruikers",
      color: "bg-green-500",
    },
    {
      title: "Rapportages",
      description: "Bekijk uitgebreide rapportages",
      icon: BarChart3,
      href: "/beheer/rapportages",
      color: "bg-purple-500",
    },
    {
      title: "NFC Scanner",
      description: "Scan NFC tags voor inspectie",
      icon: QrCode,
      href: "/nfc-scan",
      color: "bg-orange-500",
    },
    {
      title: "Help & Support",
      description: "Documentatie en ondersteuning",
      icon: Eye,
      href: "/help",
      color: "bg-gray-500",
    },
  ]

  const moduleStats = [
    { name: "Plotkaart Editor", usage: 95, status: "active" },
    { name: "Incident Management", usage: 78, status: "active" },
    { name: "Team Beheer", usage: 89, status: "active" },
    { name: "NFC Integratie", usage: 45, status: "active" },
    { name: "Rapportages", usage: 67, status: "active" },
    { name: "Mobile App", usage: 82, status: "active" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Image
                  src="/images/bhv360-logo-full.png"
                  alt="BHV360 Logo"
                  width={360}
                  height={120}
                  className="h-16 w-auto cursor-pointer"
                />
              </Link>
              <div className="hidden md:block">
                <Badge variant="outline" className="text-green-700 border-green-300">
                  Platform Dashboard
                </Badge>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{currentTime.toLocaleTimeString("nl-NL")}</span>
              </div>
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Notificaties
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Instellingen
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welkom terug!</h1>
          <p className="text-gray-600">Hier is een overzicht van je BHV platform activiteiten.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <Card key={index} className="shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                      {stat.change !== "0" && (
                        <p className={`text-sm ${stat.color}`}>
                          {stat.change.startsWith("+") ? "+" : ""}
                          {stat.change} deze week
                        </p>
                      )}
                    </div>
                    <div className={`p-3 rounded-full bg-gray-100`}>
                      <IconComponent className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* System Health */}
        <Card className="mb-8 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2 text-green-600" />
              Systeem Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <Database className="w-4 h-4 text-green-600" />
                <span className="text-sm">Database</span>
                <Badge variant="outline" className="text-green-700 border-green-300">
                  Operationeel
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Server className="w-4 h-4 text-green-600" />
                <span className="text-sm">API</span>
                <Badge variant="outline" className="text-green-700 border-green-300">
                  Operationeel
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Bell className="w-4 h-4 text-green-600" />
                <span className="text-sm">Notificaties</span>
                <Badge variant="outline" className="text-green-700 border-green-300">
                  Operationeel
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Smartphone className="w-4 h-4 text-green-600" />
                <span className="text-sm">Mobile App</span>
                <Badge variant="outline" className="text-green-700 border-green-300">
                  Operationeel
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overzicht</TabsTrigger>
            <TabsTrigger value="modules">Modules</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="activity">Activiteit</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Actions */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Snelle Acties</CardTitle>
                <CardDescription>Veelgebruikte functies voor dagelijks gebruik</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {quickActions.map((action, index) => {
                    const IconComponent = action.icon
                    return (
                      <Link key={index} href={action.href}>
                        <Card className="hover:shadow-md transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-200">
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-3">
                              <div className={`p-2 rounded-lg ${action.color}`}>
                                <IconComponent className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-900">{action.title}</h3>
                                <p className="text-sm text-gray-600">{action.description}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="modules" className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Module Gebruik</CardTitle>
                <CardDescription>Overzicht van module activiteit en gebruik</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {moduleStats.map((module, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">{module.name}</h3>
                        <p className="text-sm text-gray-600">{module.usage}% gebruik deze maand</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${module.usage}%` }}></div>
                        </div>
                        <Badge variant="outline" className="text-green-700 border-green-300">
                          Actief
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Incident Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Geen incidenten deze maand</p>
                    <p className="text-sm text-green-600 mt-2">Uitstekende veiligheidsprestatie!</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Team Prestaties</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">BHV Certificeringen</span>
                      <span className="font-medium">24/24 Geldig</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Laatste Training</span>
                      <span className="font-medium">2 weken geleden</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Responstijd Gemiddeld</span>
                      <span className="font-medium">2.3 minuten</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Recente Activiteit</CardTitle>
                <CardDescription>Laatste acties en wijzigingen in het systeem</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => {
                    const IconComponent = activity.icon
                    return (
                      <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <IconComponent className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                          <p className="text-xs text-gray-600">
                            {activity.time} • door {activity.user}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
