"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import { useCustomer } from "@/components/customer-context"
import { PresenceOverview } from "@/components/presence-overview"
import { MessageComposer } from "@/components/messaging/message-composer"
import Link from "next/link"
import {
  Shield,
  Users,
  MapPin,
  AlertTriangle,
  Settings,
  FileText,
  Heart,
  UserPlus,
  Scan,
  BarChart3,
  CheckCircle,
  Clock,
  Activity,
  Plus,
  Edit,
  Eye,
  Download,
  Zap,
  MessageSquare,
} from "lucide-react"

export default function BHVCoordinatorDashboard() {
  const { user } = useAuth()
  const { selectedCustomer } = useCustomer()
  const [activeIncidents, setActiveIncidents] = useState(2)
  const [bhvMembers, setBhvMembers] = useState(8)
  const [totalEmployees, setTotalEmployees] = useState(45)
  const [lastInspection, setLastInspection] = useState("2024-01-15")

  const quickActions = [
    {
      title: "Plotkaart Beheren",
      description: "Bekijk en wijzig de plotkaart",
      icon: MapPin,
      href: "/bhv/plotkaart",
      color: "bg-blue-500",
    },
    {
      title: "Plotkaart Editor",
      description: "Bewerk locaties en voorzieningen",
      icon: Edit,
      href: "/beheer/plotkaart-editor",
      color: "bg-green-500",
    },
    {
      title: "Medewerkers Beheren",
      description: "Voeg toe, wijzig of verwijder medewerkers",
      icon: Users,
      href: "/beheer/gebruikers",
      color: "bg-purple-500",
    },
    {
      title: "BHV Rollen Toekennen",
      description: "Ken BHV rollen en rechten toe",
      icon: Shield,
      href: "/beheer/autorisaties",
      color: "bg-orange-500",
    },
    {
      title: "Modules Aanvragen",
      description: "Vraag nieuwe modules aan",
      icon: Plus,
      href: "/beheer/module-marketplace",
      color: "bg-indigo-500",
    },
    {
      title: "NFC Scanner",
      description: "Scan NFC tags voor MiVa tracking",
      icon: Scan,
      href: "/nfc-scan",
      color: "bg-red-500",
    },
  ]

  const managementActions = [
    {
      title: "Voorzieningen Beheren",
      description: "Beheer EHBO, brandblussers, etc.",
      icon: Heart,
      href: "/beheer/voorzieningen",
    },
    {
      title: "Inspectierapporten",
      description: "Bekijk en genereer rapporten",
      icon: FileText,
      href: "/beheer/inspectierapporten",
    },
    {
      title: "Rapportages",
      description: "Uitgebreide analyses en statistieken",
      icon: BarChart3,
      href: "/beheer/rapportages",
    },
    {
      title: "NFC Tags Beheren",
      description: "Configureer NFC tags en locaties",
      icon: Settings,
      href: "/beheer/nfc-overzicht",
    },
    {
      title: "Backups & Data",
      description: "Databeheer en backup instellingen",
      icon: Download,
      href: "/beheer/backups",
    },
    {
      title: "BHV Aanwezigheid",
      description: "Overzicht van aanwezige BHV'ers",
      icon: UserPlus,
      href: "/bhv-aanwezigheid",
    },
  ]

  const recentActivities = [
    {
      id: 1,
      type: "miva_scan",
      message: "MiVa gescand op Verdieping 12 - Kantoor 12A",
      time: "10:30",
      user: "Jan Pietersen",
      status: "warning",
    },
    {
      id: 2,
      type: "route_scan",
      message: "Ontruimingsroute gescand - Trappenhuis A",
      time: "10:25",
      user: "Maria Janssen",
      status: "info",
    },
    {
      id: 3,
      type: "user_added",
      message: "Nieuwe medewerker toegevoegd: Peter de Vries",
      time: "09:45",
      user: "Jan Pietersen",
      status: "success",
    },
    {
      id: 4,
      type: "inspection",
      message: "EHBO kit geïnspecteerd - Verdieping 1",
      time: "09:15",
      user: "Lisa van der Berg",
      status: "success",
    },
    {
      id: 5,
      type: "message_sent",
      message: "Bericht verzonden naar 5 bezoekers",
      time: "08:45",
      user: "Jan Pietersen",
      status: "info",
    },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "miva_scan":
        return <AlertTriangle className="h-4 w-4" />
      case "route_scan":
        return <MapPin className="h-4 w-4" />
      case "user_added":
        return <UserPlus className="h-4 w-4" />
      case "inspection":
        return <CheckCircle className="h-4 w-4" />
      case "message_sent":
        return <MessageSquare className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getActivityColor = (status: string) => {
    switch (status) {
      case "warning":
        return "text-orange-600"
      case "info":
        return "text-blue-600"
      case "success":
        return "text-green-600"
      case "error":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  // Mock messageable people for demo
  const messageablePeople = [
    {
      id: "vis-1",
      name: "John Smith",
      type: "visitor" as const,
      phone: "06-11111111",
      email: "john.smith@abccompany.com",
      company: "ABC Company",
      location: "Verdieping 2, Vergaderzaal 2.08",
      host: "Jan Jansen",
      purpose: "Leverancier",
    },
    {
      id: "con-1",
      name: "Piet Monteur",
      type: "contractor" as const,
      phone: "06-12345678",
      email: "piet@elektrotech.nl",
      company: "ElektroTech BV",
      location: "Verdieping 2, Serverruimte",
    },
  ]

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">BHV Coördinator Dashboard</h1>
          <p className="text-muted-foreground">
            Welkom terug, {user?.name} • {selectedCustomer?.name || "Geen klant geselecteerd"}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <Shield className="h-3 w-3 mr-1" />
            BHV Coördinator
          </Badge>
          {messageablePeople.length > 0 && (
            <MessageComposer
              recipients={messageablePeople}
              trigger={
                <Button variant="outline">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Bericht Sturen
                </Button>
              }
            />
          )}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actieve Incidenten</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{activeIncidents}</div>
            <p className="text-xs text-muted-foreground">Vereisen aandacht</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">BHV Medewerkers</CardTitle>
            <Shield className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{bhvMembers}</div>
            <p className="text-xs text-muted-foreground">Van {totalEmployees} medewerkers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Laatste Inspectie</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {new Date(lastInspection).toLocaleDateString("nl-NL")}
            </div>
            <p className="text-xs text-muted-foreground">Volgende: 15 feb 2024</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Systeem Status</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Online</div>
            <p className="text-xs text-muted-foreground">Alle systemen operationeel</p>
          </CardContent>
        </Card>
      </div>

      {/* Presence Overview */}
      <PresenceOverview compact={true} showMessaging={true} />

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="mr-2 h-5 w-5" />
            Snelle Acties
          </CardTitle>
          <CardDescription>Meest gebruikte functies voor dagelijks beheer</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${action.color} text-white`}>
                        <action.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{action.title}</h3>
                        <p className="text-sm text-muted-foreground">{action.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Management Functions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="mr-2 h-5 w-5" />
            Beheer Functies
          </CardTitle>
          <CardDescription>Uitgebreide beheer en configuratie opties</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {managementActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <action.icon className="h-5 w-5 text-gray-600" />
                      <div>
                        <h3 className="font-medium">{action.title}</h3>
                        <p className="text-sm text-muted-foreground">{action.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="mr-2 h-5 w-5" />
            Recente Activiteiten
          </CardTitle>
          <CardDescription>Laatste acties en gebeurtenissen</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                <div className={`${getActivityColor(activity.status)}`}>{getActivityIcon(activity.type)}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {activity.time} • door {activity.user}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Alle activiteiten bekijken
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Alert */}
      {activeIncidents > 0 && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Let op:</strong> Er zijn {activeIncidents} actieve incidenten die uw aandacht vereisen.{" "}
            <Link href="/incidenten" className="underline font-medium">
              Bekijk incidenten →
            </Link>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
