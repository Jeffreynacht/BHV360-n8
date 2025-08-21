"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, Shield, AlertTriangle, MapPin, Calendar, Bell, Settings, FileText, Activity } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalBHVers: 12,
    activeBHVers: 10,
    totalIncidents: 3,
    openIncidents: 1,
    plotkaarten: 5,
    compliance: 85,
  })

  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      type: "incident",
      title: "Kleine brand in keuken",
      time: "2 uur geleden",
      status: "resolved",
    },
    {
      id: 2,
      type: "training",
      title: "BHV training gepland",
      time: "1 dag geleden",
      status: "scheduled",
    },
    {
      id: 3,
      type: "inspection",
      title: "Brandblusser controle",
      time: "3 dagen geleden",
      status: "completed",
    },
  ])

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
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Notificaties
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Instellingen
              </Button>
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Uitloggen
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welkom terug! Hier is een overzicht van uw BHV status.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">BHV'ers</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.activeBHVers}/{stats.totalBHVers}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="mt-4">
                <Progress value={(stats.activeBHVers / stats.totalBHVers) * 100} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">Actieve BHV'ers</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Incidenten</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.openIncidents}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="mt-4">
                <Badge variant={stats.openIncidents > 0 ? "destructive" : "secondary"}>
                  {stats.openIncidents > 0 ? "Actie vereist" : "Alles onder controle"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Plotkaarten</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.plotkaarten}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="mt-4">
                <Badge variant="secondary">Alle up-to-date</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Compliance</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.compliance}%</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="mt-4">
                <Progress value={stats.compliance} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">Compliance score</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Recente Activiteit
                </CardTitle>
                <CardDescription>Overzicht van recente gebeurtenissen en acties</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            activity.status === "resolved"
                              ? "bg-green-500"
                              : activity.status === "scheduled"
                                ? "bg-blue-500"
                                : "bg-gray-500"
                          }`}
                        />
                        <div>
                          <p className="font-medium text-gray-900">{activity.title}</p>
                          <p className="text-sm text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          activity.status === "resolved"
                            ? "default"
                            : activity.status === "scheduled"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {activity.status === "resolved"
                          ? "Opgelost"
                          : activity.status === "scheduled"
                            ? "Gepland"
                            : "Voltooid"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Snelle Acties</CardTitle>
                <CardDescription>Veelgebruikte functies en tools</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/plotkaart">
                  <Button className="w-full justify-start bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90 text-white">
                    <MapPin className="w-4 h-4 mr-2" />
                    Plotkaart Bewerken
                  </Button>
                </Link>

                <Link href="/incidenten">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Incident Melden
                  </Button>
                </Link>

                <Link href="/bhv">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Users className="w-4 h-4 mr-2" />
                    BHV Team Beheren
                  </Button>
                </Link>

                <Link href="/help">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <FileText className="w-4 h-4 mr-2" />
                    Rapportages
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Upcoming Tasks */}
            <Card className="shadow-lg mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Aankomende Taken
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">BHV Training</p>
                      <p className="text-xs text-gray-500">15 maart 2024</p>
                    </div>
                    <Badge variant="secondary">Gepland</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Brandblusser Controle</p>
                      <p className="text-xs text-gray-500">20 maart 2024</p>
                    </div>
                    <Badge variant="outline">Te doen</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Certificaat Verlenging</p>
                      <p className="text-xs text-gray-500">1 april 2024</p>
                    </div>
                    <Badge variant="secondary">Herinnering</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
