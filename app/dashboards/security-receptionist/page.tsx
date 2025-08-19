"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PresenceOverview } from "@/components/presence-overview"
import { MessageComposer } from "@/components/messaging/message-composer"
import {
  Users,
  UserPlus,
  Clock,
  MapPin,
  Phone,
  Car,
  Building,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Search,
  Eye,
  FileText,
  Shield,
  Bell,
  RefreshCw,
  MessageSquare,
  Mail,
} from "lucide-react"
import Link from "next/link"

type VisitorStatus = "registered" | "arrived" | "departed"
type ContractorStatus = "registered" | "checked_in" | "working" | "checked_out"

type Visitor = {
  id: string
  name: string
  company: string
  purpose: string
  host: string
  phone: string
  email?: string
  arrivalTime: string
  departureTime?: string
  status: VisitorStatus
  photo?: string
  emergencyContact?: {
    name: string
    phone: string
  }
  registeredAt: string
}

type Contractor = {
  id: string
  firstName: string
  lastName: string
  company: string
  phone: string
  email?: string
  licensePlate?: string
  workLocation: string
  workDescription: string
  status: ContractorStatus
  checkInTime?: string
  checkOutTime?: string
  expectedDuration: string
  photo?: string
  registeredAt: string
}

export default function SecurityReceptionistDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("overview")
  const [visitors, setVisitors] = useState<Visitor[]>([])
  const [contractors, setContractors] = useState<Contractor[]>([])
  const [lastUpdate, setLastUpdate] = useState(new Date())

  // Real-time data simulation - in productie zou dit via WebSocket of polling gaan
  useEffect(() => {
    // Initial data
    setVisitors([
      {
        id: "VIS-001",
        name: "John Smith",
        company: "ABC Consulting",
        purpose: "Vergadering",
        host: "Marie Jansen",
        phone: "06-12345678",
        email: "john.smith@abcconsulting.com",
        arrivalTime: "09:30",
        status: "arrived",
        photo: "/placeholder.svg?height=100&width=100",
        registeredAt: "2024-01-15T09:25:00Z",
      },
      {
        id: "VIS-002",
        name: "Sarah Johnson",
        company: "XYZ Corp",
        purpose: "Presentatie",
        host: "Piet de Vries",
        phone: "06-87654321",
        email: "sarah.johnson@xyzcorp.com",
        arrivalTime: "10:15",
        status: "arrived",
        registeredAt: "2024-01-15T10:10:00Z",
      },
      {
        id: "VIS-003",
        name: "Mike Wilson",
        company: "Tech Solutions",
        purpose: "Onderhoud",
        host: "Lisa van Dam",
        phone: "06-11223344",
        email: "mike.wilson@techsolutions.com",
        arrivalTime: "08:45",
        departureTime: "11:30",
        status: "departed",
        registeredAt: "2024-01-15T08:40:00Z",
      },
    ])

    setContractors([
      {
        id: "CONTR-001",
        firstName: "Piet",
        lastName: "Jansen",
        company: "ElektroTech BV",
        phone: "06-12345678",
        email: "piet@elektrotech.nl",
        licensePlate: "12-ABC-3",
        workLocation: "Verdieping 2 - Serverruimte",
        workDescription: "Onderhoud UPS systemen",
        expectedDuration: "4 uur",
        status: "checked_in",
        checkInTime: "08:30",
        registeredAt: "2024-01-15T08:25:00Z",
      },
      {
        id: "CONTR-002",
        firstName: "Marie",
        lastName: "de Vries",
        company: "CleanPro Services",
        phone: "06-87654321",
        email: "marie@cleanpro.nl",
        workLocation: "Gehele gebouw",
        workDescription: "Ramen schoonmaken",
        expectedDuration: "6 uur",
        status: "working",
        checkInTime: "07:00",
        registeredAt: "2024-01-15T06:55:00Z",
      },
      {
        id: "CONTR-003",
        firstName: "Tom",
        lastName: "Bakker",
        company: "HVAC Solutions",
        phone: "06-55443322",
        email: "tom@hvacsolutions.nl",
        licensePlate: "99-XYZ-1",
        workLocation: "Verdieping 1 - Technische ruimte",
        workDescription: "Airco onderhoud",
        expectedDuration: "3 uur",
        status: "checked_out",
        checkInTime: "13:00",
        checkOutTime: "16:00",
        registeredAt: "2024-01-15T12:55:00Z",
      },
    ])

    // Simuleer real-time updates elke 30 seconden
    const interval = setInterval(() => {
      setLastUpdate(new Date())

      // Simuleer nieuwe registraties (in productie zou dit via WebSocket komen)
      const shouldAddNewVisitor = Math.random() < 0.1 // 10% kans
      const shouldAddNewContractor = Math.random() < 0.05 // 5% kans

      if (shouldAddNewVisitor) {
        const newVisitor: Visitor = {
          id: `VIS-${Date.now()}`,
          name: "Nieuwe Bezoeker",
          company: "Demo Company",
          purpose: "Afspraak",
          host: "Demo Host",
          phone: "06-00000000",
          email: "demo@example.com",
          arrivalTime: new Date().toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" }),
          status: "registered",
          registeredAt: new Date().toISOString(),
        }

        setVisitors((prev) => [newVisitor, ...prev])

        // Toon notificatie (in productie zou dit een toast/notification zijn)
        console.log("Nieuwe bezoeker geregistreerd:", newVisitor.name)
      }

      if (shouldAddNewContractor) {
        const newContractor: Contractor = {
          id: `CONTR-${Date.now()}`,
          firstName: "Nieuwe",
          lastName: "Monteur",
          company: "Demo Bedrijf",
          phone: "06-00000000",
          email: "demo@example.com",
          workLocation: "Demo Locatie",
          workDescription: "Demo Werk",
          expectedDuration: "2 uur",
          status: "registered",
          registeredAt: new Date().toISOString(),
        }

        setContractors((prev) => [newContractor, ...prev])

        // Toon notificatie
        console.log("Nieuwe monteur geregistreerd:", `${newContractor.firstName} ${newContractor.lastName}`)
      }
    }, 30000) // Elke 30 seconden

    return () => clearInterval(interval)
  }, [])

  const getVisitorStatusBadge = (status: VisitorStatus) => {
    switch (status) {
      case "registered":
        return <Badge className="bg-blue-100 text-blue-800">Geregistreerd</Badge>
      case "arrived":
        return <Badge className="bg-green-100 text-green-800">Aanwezig</Badge>
      case "departed":
        return <Badge className="bg-gray-100 text-gray-800">Vertrokken</Badge>
      default:
        return <Badge>Onbekend</Badge>
    }
  }

  const getContractorStatusBadge = (status: ContractorStatus) => {
    switch (status) {
      case "registered":
        return <Badge className="bg-blue-100 text-blue-800">Geregistreerd</Badge>
      case "checked_in":
        return <Badge className="bg-green-100 text-green-800">Ingecheckt</Badge>
      case "working":
        return <Badge className="bg-yellow-100 text-yellow-800">Aan het werk</Badge>
      case "checked_out":
        return <Badge className="bg-gray-100 text-gray-800">Uitgecheckt</Badge>
      default:
        return <Badge>Onbekend</Badge>
    }
  }

  const currentVisitors = visitors.filter((v) => v.status === "arrived").length
  const currentContractors = contractors.filter((c) => c.status === "checked_in" || c.status === "working").length
  const totalToday = visitors.length + contractors.length

  // Nieuwe registraties van vandaag (laatste 24 uur)
  const recentRegistrations = [
    ...visitors.map((v) => ({ ...v, type: "visitor" as const })),
    ...contractors.map((c) => ({ ...c, type: "contractor" as const })),
  ]
    .filter((item) => {
      const registrationTime = new Date(item.registeredAt)
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      return registrationTime > yesterday
    })
    .sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime())
    .slice(0, 5) // Laatste 5 registraties

  // Convert to messageable format
  const messageableVisitors = visitors
    .filter((v) => v.status === "arrived")
    .map((v) => ({
      id: v.id,
      name: v.name,
      type: "visitor" as const,
      phone: v.phone,
      email: v.email,
      company: v.company,
      location: "In het gebouw",
      host: v.host,
      purpose: v.purpose,
    }))

  const messageableContractors = contractors
    .filter((c) => c.status === "checked_in" || c.status === "working")
    .map((c) => ({
      id: c.id,
      name: `${c.firstName} ${c.lastName}`,
      type: "contractor" as const,
      phone: c.phone,
      email: c.email,
      company: c.company,
      location: c.workLocation,
    }))

  const allMessageablePeople = [...messageableVisitors, ...messageableContractors]

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Beveiliging & Receptie Dashboard</h1>
          <p className="text-gray-600">Beheer bezoekers, monteurs en toegangscontrole</p>
          <div className="flex items-center space-x-2 mt-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              <Shield className="h-3 w-3 mr-1" />
              Beveiliging/Receptie
            </Badge>
            <Badge variant="outline" className="text-xs">
              <RefreshCw className="h-3 w-3 mr-1" />
              Laatste update: {lastUpdate.toLocaleTimeString("nl-NL")}
            </Badge>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {allMessageablePeople.length > 0 && (
            <MessageComposer
              recipients={allMessageablePeople}
              trigger={
                <Button>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Bericht Sturen ({allMessageablePeople.length})
                </Button>
              }
            />
          )}
          <Button variant="outline" onClick={() => setLastUpdate(new Date())}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Vernieuwen
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Huidige Bezoekers</p>
                <p className="text-2xl font-bold text-green-600">{currentVisitors}</p>
                <p className="text-xs text-gray-500">In het gebouw</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Actieve Monteurs</p>
                <p className="text-2xl font-bold text-blue-600">{currentContractors}</p>
                <p className="text-xs text-gray-500">Aan het werk</p>
              </div>
              <Building className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Totaal Vandaag</p>
                <p className="text-2xl font-bold text-gray-900">{totalToday}</p>
                <p className="text-xs text-gray-500">Registraties</p>
              </div>
              <FileText className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Berichten Vandaag</p>
                <p className="text-2xl font-bold text-orange-600">12</p>
                <p className="text-xs text-gray-500">Verzonden</p>
              </div>
              <MessageSquare className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Notifications */}
      {recentRegistrations.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-blue-800">
              <Bell className="h-5 w-5 mr-2" />
              Recente Registraties (Real-time)
            </CardTitle>
            <CardDescription>Nieuwe aanmeldingen worden automatisch hier getoond</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentRegistrations.slice(0, 3).map((item) => (
                <div key={item.id} className="flex items-center justify-between p-2 bg-white rounded border">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-2 h-2 rounded-full ${item.type === "visitor" ? "bg-green-500" : "bg-blue-500"}`}
                    />
                    <div>
                      <p className="text-sm font-medium">
                        {item.type === "visitor"
                          ? `Bezoeker: ${item.name}`
                          : `Monteur: ${item.firstName} ${item.lastName}`}
                      </p>
                      <p className="text-xs text-gray-600">
                        {item.type === "visitor"
                          ? `${item.company} - ${item.purpose}`
                          : `${item.company} - ${item.workDescription}`}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {new Date(item.registeredAt).toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" })}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Snelle Acties</CardTitle>
          <CardDescription>Veelgebruikte functies voor beveiliging en receptie</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/visitor-registration">
              <Button variant="outline" className="h-20 w-full flex-col gap-2 bg-transparent hover:bg-green-50">
                <UserPlus className="h-6 w-6 text-green-600" />
                <span className="text-sm">Bezoeker Registreren</span>
              </Button>
            </Link>
            <Link href="/contractor-registration">
              <Button variant="outline" className="h-20 w-full flex-col gap-2 bg-transparent hover:bg-blue-50">
                <Building className="h-6 w-6 text-blue-600" />
                <span className="text-sm">Monteur Registreren</span>
              </Button>
            </Link>
            <Link href="/plotkaart">
              <Button variant="outline" className="h-20 w-full flex-col gap-2 bg-transparent hover:bg-purple-50">
                <MapPin className="h-6 w-6 text-purple-600" />
                <span className="text-sm">Plotkaart</span>
              </Button>
            </Link>
            <Link href="/incidenten">
              <Button variant="outline" className="h-20 w-full flex-col gap-2 bg-transparent hover:bg-red-50">
                <AlertTriangle className="h-6 w-6 text-red-600" />
                <span className="text-sm">Incident Melden</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-white">
          <TabsTrigger value="overview">Overzicht</TabsTrigger>
          <TabsTrigger value="presence">Aanwezigheid</TabsTrigger>
          <TabsTrigger value="visitors">Bezoekers</TabsTrigger>
          <TabsTrigger value="contractors">Monteurs</TabsTrigger>
          <TabsTrigger value="messaging">Berichten</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Current Visitors */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Huidige Bezoekers</span>
                  <Badge variant="outline">{currentVisitors} aanwezig</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {visitors
                    .filter((v) => v.status === "arrived")
                    .map((visitor) => (
                      <div key={visitor.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <Users className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">{visitor.name}</p>
                            <p className="text-sm text-gray-600">{visitor.company}</p>
                            <p className="text-xs text-gray-500">Host: {visitor.host}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          {getVisitorStatusBadge(visitor.status)}
                          <p className="text-xs text-gray-500 mt-1">Sinds {visitor.arrivalTime}</p>
                        </div>
                      </div>
                    ))}
                  {currentVisitors === 0 && (
                    <div className="text-center py-6 text-gray-500">
                      <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>Geen bezoekers aanwezig</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Current Contractors */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Actieve Monteurs</span>
                  <Badge variant="outline">{currentContractors} actief</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {contractors
                    .filter((c) => c.status === "checked_in" || c.status === "working")
                    .map((contractor) => (
                      <div key={contractor.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Building className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">
                              {contractor.firstName} {contractor.lastName}
                            </p>
                            <p className="text-sm text-gray-600">{contractor.company}</p>
                            <p className="text-xs text-gray-500 flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {contractor.workLocation}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          {getContractorStatusBadge(contractor.status)}
                          <p className="text-xs text-gray-500 mt-1">Sinds {contractor.checkInTime}</p>
                        </div>
                      </div>
                    ))}
                  {currentContractors === 0 && (
                    <div className="text-center py-6 text-gray-500">
                      <Building className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>Geen actieve monteurs</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Recente Activiteit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium">Bezoeker ingecheckt</p>
                    <p className="text-xs text-gray-600">John Smith - ABC Consulting - 10:15</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Building className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium">Monteur geregistreerd</p>
                    <p className="text-xs text-gray-600">Piet Jansen - ElektroTech BV - 08:30</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <XCircle className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium">Monteur uitgecheckt</p>
                    <p className="text-xs text-gray-600">Tom Bakker - HVAC Solutions - 16:00</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-sm font-medium">Bericht verzonden</p>
                    <p className="text-xs text-gray-600">Welkomstbericht naar 3 bezoekers - 14:30</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="presence" className="space-y-4">
          <PresenceOverview showMessaging={true} />
        </TabsContent>

        <TabsContent value="visitors" className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Zoek bezoekers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white"
              />
            </div>
            <Link href="/visitor-registration">
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Nieuwe Bezoeker
              </Button>
            </Link>
            {messageableVisitors.length > 0 && (
              <MessageComposer
                recipients={messageableVisitors}
                trigger={
                  <Button variant="outline">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Bericht naar Bezoekers ({messageableVisitors.length})
                  </Button>
                }
              />
            )}
          </div>

          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Alle Bezoekers</CardTitle>
              <CardDescription>Overzicht van alle geregistreerde bezoekers vandaag</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {visitors
                  .filter(
                    (visitor) =>
                      visitor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      visitor.company.toLowerCase().includes(searchQuery.toLowerCase()),
                  )
                  .map((visitor) => (
                    <div key={visitor.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                          {visitor.photo ? (
                            <img
                              src={visitor.photo || "/placeholder.svg"}
                              alt={visitor.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <Users className="h-6 w-6 text-gray-600" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold">{visitor.name}</h3>
                          <p className="text-sm text-gray-600">{visitor.company}</p>
                          <p className="text-xs text-gray-500">
                            {visitor.purpose} • Host: {visitor.host}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Phone className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{visitor.phone}</span>
                            {visitor.email && <Mail className="h-3 w-3 text-blue-400" />}
                          </div>
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        {getVisitorStatusBadge(visitor.status)}
                        <div className="text-xs text-gray-500">
                          <p className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            Aankomst: {visitor.arrivalTime}
                          </p>
                          {visitor.departureTime && (
                            <p className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              Vertrek: {visitor.departureTime}
                            </p>
                          )}
                        </div>
                        <div className="flex space-x-1">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            Details
                          </Button>
                          {visitor.status === "arrived" && (visitor.phone || visitor.email) && (
                            <MessageComposer
                              recipients={[
                                {
                                  id: visitor.id,
                                  name: visitor.name,
                                  type: "visitor",
                                  phone: visitor.phone,
                                  email: visitor.email,
                                  company: visitor.company,
                                  location: "In het gebouw",
                                  host: visitor.host,
                                  purpose: visitor.purpose,
                                },
                              ]}
                              trigger={
                                <Button variant="ghost" size="sm">
                                  <MessageSquare className="h-4 w-4" />
                                </Button>
                              }
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contractors" className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Zoek monteurs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white"
              />
            </div>
            <Link href="/contractor-registration">
              <Button>
                <Building className="h-4 w-4 mr-2" />
                Nieuwe Monteur
              </Button>
            </Link>
            {messageableContractors.length > 0 && (
              <MessageComposer
                recipients={messageableContractors}
                trigger={
                  <Button variant="outline">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Bericht naar Monteurs ({messageableContractors.length})
                  </Button>
                }
              />
            )}
          </div>

          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Alle Monteurs</CardTitle>
              <CardDescription>Overzicht van alle geregistreerde monteurs vandaag</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {contractors
                  .filter(
                    (contractor) =>
                      `${contractor.firstName} ${contractor.lastName}`
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                      contractor.company.toLowerCase().includes(searchQuery.toLowerCase()),
                  )
                  .map((contractor) => (
                    <div key={contractor.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          {contractor.photo ? (
                            <img
                              src={contractor.photo || "/placeholder.svg"}
                              alt={`${contractor.firstName} ${contractor.lastName}`}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <Building className="h-6 w-6 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold">
                            {contractor.firstName} {contractor.lastName}
                          </h3>
                          <p className="text-sm text-gray-600">{contractor.company}</p>
                          <p className="text-xs text-gray-500">{contractor.workDescription}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-500">{contractor.workLocation}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Phone className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-500">{contractor.phone}</span>
                            </div>
                            {contractor.email && <Mail className="h-3 w-3 text-blue-400" />}
                            {contractor.licensePlate && (
                              <div className="flex items-center space-x-1">
                                <Car className="h-3 w-3 text-gray-400" />
                                <span className="text-xs text-gray-500">{contractor.licensePlate}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        {getContractorStatusBadge(contractor.status)}
                        <div className="text-xs text-gray-500">
                          <p>Verwacht: {contractor.expectedDuration}</p>
                          {contractor.checkInTime && (
                            <p className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              Ingecheckt: {contractor.checkInTime}
                            </p>
                          )}
                          {contractor.checkOutTime && (
                            <p className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              Uitgecheckt: {contractor.checkOutTime}
                            </p>
                          )}
                        </div>
                        <div className="flex space-x-1">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            Details
                          </Button>
                          {(contractor.status === "checked_in" || contractor.status === "working") &&
                            (contractor.phone || contractor.email) && (
                              <MessageComposer
                                recipients={[
                                  {
                                    id: contractor.id,
                                    name: `${contractor.firstName} ${contractor.lastName}`,
                                    type: "contractor",
                                    phone: contractor.phone,
                                    email: contractor.email,
                                    company: contractor.company,
                                    location: contractor.workLocation,
                                  },
                                ]}
                                trigger={
                                  <Button variant="ghost" size="sm">
                                    <MessageSquare className="h-4 w-4" />
                                  </Button>
                                }
                              />
                            )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messaging" className="space-y-4">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5" />
                <span>Berichten Centrum</span>
              </CardTitle>
              <CardDescription>Verstuur berichten naar bezoekers en monteurs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Quick Message Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <h3 className="font-semibold mb-2">Bezoekers ({messageableVisitors.length})</h3>
                  <p className="text-sm text-gray-600 mb-3">Stuur berichten naar aanwezige bezoekers</p>
                  {messageableVisitors.length > 0 ? (
                    <MessageComposer
                      recipients={messageableVisitors}
                      trigger={
                        <Button className="w-full">
                          <Users className="h-4 w-4 mr-2" />
                          Bericht naar Alle Bezoekers
                        </Button>
                      }
                    />
                  ) : (
                    <Button disabled className="w-full">
                      <Users className="h-4 w-4 mr-2" />
                      Geen bezoekers aanwezig
                    </Button>
                  )}
                </Card>

                <Card className="p-4">
                  <h3 className="font-semibold mb-2">Monteurs ({messageableContractors.length})</h3>
                  <p className="text-sm text-gray-600 mb-3">Stuur berichten naar actieve monteurs</p>
                  {messageableContractors.length > 0 ? (
                    <MessageComposer
                      recipients={messageableContractors}
                      trigger={
                        <Button className="w-full">
                          <Building className="h-4 w-4 mr-2" />
                          Bericht naar Alle Monteurs
                        </Button>
                      }
                    />
                  ) : (
                    <Button disabled className="w-full">
                      <Building className="h-4 w-4 mr-2" />
                      Geen monteurs actief
                    </Button>
                  )}
                </Card>
              </div>

              {/* Combined Messaging */}
              {allMessageablePeople.length > 0 && (
                <div className="text-center">
                  <MessageComposer
                    recipients={allMessageablePeople}
                    trigger={
                      <Button size="lg">
                        <MessageSquare className="h-5 w-5 mr-2" />
                        Bericht naar Iedereen ({allMessageablePeople.length})
                      </Button>
                    }
                  />
                </div>
              )}

              {/* Message Templates Preview */}
              <div>
                <h3 className="font-semibold mb-3">Beschikbare Sjablonen</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium text-sm">Welkomstbericht</h4>
                    <p className="text-xs text-gray-600">Voor nieuwe bezoekers</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium text-sm">Uitcheck herinnering</h4>
                    <p className="text-xs text-gray-600">Vergeten uit te checken</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium text-sm">Locatie wijziging</h4>
                    <p className="text-xs text-gray-600">Werklocatie aangepast</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium text-sm">Noodinformatie</h4>
                    <p className="text-xs text-gray-600">Belangrijke mededelingen</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium text-sm">Afspraak herinnering</h4>
                    <p className="text-xs text-gray-600">Meeting reminder</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium text-sm">Werk voltooid</h4>
                    <p className="text-xs text-gray-600">Bedankt voor werkzaamheden</p>
                  </div>
                </div>
              </div>

              {/* Recent Messages */}
              <div>
                <h3 className="font-semibold mb-3">Recente Berichten</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Welkomstbericht verzonden</p>
                      <p className="text-xs text-gray-600">Naar 3 bezoekers • 14:30</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Email + SMS
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Locatie wijziging</p>
                      <p className="text-xs text-gray-600">Naar Piet Jansen • 13:15</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      SMS
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Uitcheck herinnering</p>
                      <p className="text-xs text-gray-600">Naar 2 bezoekers • 12:45</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Email
                    </Badge>
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
