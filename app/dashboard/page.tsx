"use client"

import { useAuth } from "@/contexts/auth-context"
import { useCustomer } from "@/components/customer-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, AlertTriangle, Users, MapPin, FileText, Calendar, Activity } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { user } = useAuth()
  const { selectedCustomer } = useCustomer()

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="mb-4">Je bent niet ingelogd.</p>
            <Link href="/login">
              <Button>Ga naar login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const quickActions = [
    {
      title: "Plotkaart Bekijken",
      description: "Bekijk de interactieve veiligheidsplattegrond",
      icon: MapPin,
      href: "/plotkaart",
      color: "bg-blue-500",
    },
    {
      title: "BHV Personeel",
      description: "Beheer BHV medewerkers en certificeringen",
      icon: Users,
      href: "/gebruikers",
      color: "bg-green-500",
    },
    {
      title: "Incidenten",
      description: "Bekijk en beheer veiligheidsincidenten",
      icon: AlertTriangle,
      href: "/incidenten",
      color: "bg-orange-500",
    },
    {
      title: "Rapportages",
      description: "Genereer veiligheidsrapporten",
      icon: FileText,
      href: "/beheer/rapportages",
      color: "bg-purple-500",
    },
  ]

  const stats = [
    {
      title: "Actieve BHV'ers",
      value: selectedCustomer ? "12" : "0",
      icon: Shield,
      color: "text-green-600",
    },
    {
      title: "Open Incidenten",
      value: "3",
      icon: AlertTriangle,
      color: "text-orange-600",
    },
    {
      title: "Locaties",
      value: selectedCustomer ? selectedCustomer.buildings.toString() : "0",
      icon: MapPin,
      color: "text-blue-600",
    },
    {
      title: "Certificeringen",
      value: "24",
      icon: FileText,
      color: "text-purple-600",
    },
  ]

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          Welkom terug, {user.name}
          {selectedCustomer && ` - ${selectedCustomer.name}`}
        </p>
      </div>

      {/* Customer Selection Notice */}
      {!selectedCustomer && (
        <Card className="mb-6 border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <p className="text-orange-800">Selecteer een klant in de sidebar om specifieke data te bekijken.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const IconComponent = stat.icon
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <IconComponent className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Snelle Acties</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action) => {
            const IconComponent = action.icon
            return (
              <Link key={action.title} href={action.href}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${action.color} text-white`}>
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-lg">{action.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{action.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recente Activiteit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">BHV training voltooid</p>
                  <p className="text-xs text-gray-500">2 uur geleden</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">Incident gemeld - Verdieping 2</p>
                  <p className="text-xs text-gray-500">4 uur geleden</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">Plotkaart bijgewerkt</p>
                  <p className="text-xs text-gray-500">1 dag geleden</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Aankomende Taken
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div>
                  <p className="text-sm font-medium">BHV certificering verloopt</p>
                  <p className="text-xs text-gray-500">Over 2 weken</p>
                </div>
                <Badge variant="outline" className="text-yellow-700 border-yellow-300">
                  Urgent
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div>
                  <p className="text-sm font-medium">Maandelijkse veiligheidsinspectie</p>
                  <p className="text-xs text-gray-500">Over 5 dagen</p>
                </div>
                <Badge variant="outline" className="text-blue-700 border-blue-300">
                  Gepland
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div>
                  <p className="text-sm font-medium">Team meeting BHV</p>
                  <p className="text-xs text-gray-500">Volgende week</p>
                </div>
                <Badge variant="outline" className="text-green-700 border-green-300">
                  Meeting
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
