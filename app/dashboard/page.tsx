"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PresenceOverview } from "@/components/presence-overview"
import { useCustomer } from "@/components/customer-context"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import {
  Users,
  Shield,
  AlertTriangle,
  MapPin,
  Heart,
  Clock,
  CheckCircle,
  TrendingUp,
  Calendar,
  Building,
  Star,
  Activity,
  Bell,
  Settings,
  ArrowRight,
  RefreshCw,
} from "lucide-react"

export default function DashboardPage() {
  const { user } = useAuth()
  const { selectedCustomer } = useCustomer()
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  if (!selectedCustomer) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Building className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Welkom bij BHV360</h2>
            <p className="text-muted-foreground mb-4">Selecteer een klant om het dashboard te bekijken</p>
            <Link href="/klanten">
              <Button>
                Klant Selecteren
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
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
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welkom terug, {user?.name} • {selectedCustomer.name} • {currentTime.toLocaleString("nl-NL")}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-xs">
            <Activity className="h-3 w-3 mr-1" />
            Live
          </Badge>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Vernieuwen
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">8</div>
                <div className="text-sm text-muted-foreground">BHV-ers Aanwezig</div>
              </div>
            </div>
            <div className="mt-2">
              <Badge className="bg-green-100 text-green-800 text-xs">
                <CheckCircle className="h-3 w-3 mr-1" />
                Voldoende dekking
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold">25</div>
                <div className="text-sm text-muted-foreground">Totaal Aanwezig</div>
              </div>
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-xs">
                <TrendingUp className="h-3 w-3 mr-1" />
                +3 sinds gisteren
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-muted-foreground">Actieve Incidenten</div>
              </div>
            </div>
            <div className="mt-2">
              <Badge className="bg-green-100 text-green-800 text-xs">
                <CheckCircle className="h-3 w-3 mr-1" />
                Alles veilig
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-red-600" />
              <div>
                <div className="text-2xl font-bold">3</div>
                <div className="text-sm text-muted-foreground">AED's Operationeel</div>
              </div>
            </div>
            <div className="mt-2">
              <Badge className="bg-green-100 text-green-800 text-xs">
                <CheckCircle className="h-3 w-3 mr-1" />
                Alle systemen OK
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Presence Overview */}
        <div className="lg:col-span-2 space-y-6">
          <PresenceOverview compact={false} showFilters={true} autoRefresh={true} />

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Recente Activiteiten</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div className="flex-1">
                    <div className="font-medium">John Smith ingecheckt</div>
                    <div className="text-sm text-muted-foreground">Bezoeker van ABC Company • 10:15</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <div className="flex-1">
                    <div className="font-medium">BHV ronde voltooid</div>
                    <div className="text-sm text-muted-foreground">Jan Jansen • Verdieping 2 • 09:45</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <div className="flex-1">
                    <div className="font-medium">Monteur gestart</div>
                    <div className="text-sm text-muted-foreground">Piet Monteur • Serverruimte • 08:30</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <Star className="h-5 w-5 text-purple-600" />
                  <div className="flex-1">
                    <div className="font-medium">Ploegleider van dienst</div>
                    <div className="text-sm text-muted-foreground">Petra de Vries • Hele dag • 08:00</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Quick Actions & Status */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Snelle Acties</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/incidenten" className="block">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Incident Melden
                </Button>
              </Link>

              <Link href="/bhv-aanwezigheid" className="block">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Users className="h-4 w-4 mr-2" />
                  Aanwezigheid Bekijken
                </Button>
              </Link>

              <Link href="/plotkaart" className="block">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <MapPin className="h-4 w-4 mr-2" />
                  Plotkaart Openen
                </Button>
              </Link>

              <Link href="/ehbo-voorraad" className="block">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Heart className="h-4 w-4 mr-2" />
                  EHBO Voorraad
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Systeem Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">BHV Systeem</span>
                </div>
                <Badge className="bg-green-100 text-green-800">Online</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Brandmeldinstallatie</span>
                </div>
                <Badge className="bg-green-100 text-green-800">OK</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Ontruimingsalarm</span>
                </div>
                <Badge className="bg-green-100 text-green-800">Gereed</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">AED Monitoring</span>
                </div>
                <Badge className="bg-green-100 text-green-800">Actief</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm">Noodverlichting</span>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800">Test Gepland</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Komende Gebeurtenissen</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 border rounded-lg">
                <div className="font-medium text-sm">BHV Training</div>
                <div className="text-xs text-muted-foreground">Morgen 14:00 - Vergaderzaal A</div>
                <div className="text-xs text-blue-600">8 deelnemers</div>
              </div>

              <div className="p-3 border rounded-lg">
                <div className="font-medium text-sm">EHBO Herhalingscursus</div>
                <div className="text-xs text-muted-foreground">Vrijdag 09:00 - Training Center</div>
                <div className="text-xs text-green-600">12 deelnemers</div>
              </div>

              <div className="p-3 border rounded-lg">
                <div className="font-medium text-sm">Ontruimingsoefening</div>
                <div className="text-xs text-muted-foreground">Volgende week - Hele gebouw</div>
                <div className="text-xs text-orange-600">Alle medewerkers</div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Meldingen</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="font-medium text-sm text-blue-800">Certificaat verloopt binnenkort</div>
                  <div className="text-xs text-blue-600">Sarah Bakker - EHBO certificaat</div>
                </div>

                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="font-medium text-sm text-green-800">Nieuwe BHV-er toegevoegd</div>
                  <div className="text-xs text-green-600">Mohammed El Amrani - Ontruimer</div>
                </div>

                <div className="p-3 bg-yellow-50 rounded-lg">
                  <div className="font-medium text-sm text-yellow-800">Voorraad controle nodig</div>
                  <div className="text-xs text-yellow-600">EHBO koffer verdieping 3</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
