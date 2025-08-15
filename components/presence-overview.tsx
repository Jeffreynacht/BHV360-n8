"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useCustomer } from "@/components/customer-context"
import { MessageComposer } from "@/components/messaging/message-composer"
import {
  Users,
  Shield,
  UserCheck,
  Building,
  MapPin,
  Clock,
  Phone,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Star,
  Heart,
  MessageSquare,
  Mail,
} from "lucide-react"

type PresenceStatus = "present" | "absent" | "responding" | "on_duty"
type PersonType = "bhv_member" | "ploegleider" | "visitor" | "contractor"

interface Person {
  id: string
  name: string
  type: PersonType
  status: PresenceStatus
  location: string
  lastSeen: string
  phone?: string
  email?: string
  company?: string
  role?: string
  bhvRoles?: string[]
  photo?: string
  checkInTime?: string
  expectedDuration?: string
  licensePlate?: string
  host?: string
  purpose?: string
}

interface PresenceOverviewProps {
  compact?: boolean
  showFilters?: boolean
  autoRefresh?: boolean
  showMessaging?: boolean
}

export function PresenceOverview({
  compact = false,
  showFilters = true,
  autoRefresh = true,
  showMessaging = true,
}: PresenceOverviewProps) {
  const { selectedCustomer } = useCustomer()
  const [people, setPeople] = useState<Person[]>([])
  const [filter, setFilter] = useState<PersonType | "all">("all")
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [isLoading, setIsLoading] = useState(false)

  // Mock data - in production this would come from real-time API
  useEffect(() => {
    if (selectedCustomer) {
      const mockPeople: Person[] = [
        // BHV Members
        {
          id: "bhv-1",
          name: "Jan Jansen",
          type: "bhv_member",
          status: "present",
          location: "Verdieping 2, Kantoor 2.15",
          lastSeen: "2 minuten geleden",
          phone: "06-12345678",
          email: "jan.jansen@demobedrijf.nl",
          role: "BHV Coördinator",
          bhvRoles: ["BHV", "EHBO", "Coördinator"],
          photo: "/placeholder.svg?height=40&width=40",
        },
        {
          id: "bhv-2",
          name: "Mohammed El Amrani",
          type: "bhv_member",
          status: "present",
          location: "Verdieping 3, Vergaderzaal 3.04",
          lastSeen: "5 minuten geleden",
          phone: "06-34567890",
          email: "mohammed.elamrani@demobedrijf.nl",
          role: "BHV Ontruimer",
          bhvRoles: ["BHV", "Ontruimer"],
          photo: "/placeholder.svg?height=40&width=40",
        },
        {
          id: "bhv-3",
          name: "Sarah Bakker",
          type: "bhv_member",
          status: "absent",
          location: "Buiten het gebouw",
          lastSeen: "30 minuten geleden",
          phone: "06-45678901",
          email: "sarah.bakker@demobedrijf.nl",
          role: "EHBO'er",
          bhvRoles: ["EHBO"],
          photo: "/placeholder.svg?height=40&width=40",
        },
        // Ploegleiders
        {
          id: "pl-1",
          name: "Petra de Vries",
          type: "ploegleider",
          status: "on_duty",
          location: "Verdieping 1, Receptie",
          lastSeen: "1 minuut geleden",
          phone: "06-23456789",
          email: "petra.devries@demobedrijf.nl",
          role: "Ploegleider",
          bhvRoles: ["Ploegleider", "EHBO", "BHV"],
          photo: "/placeholder.svg?height=40&width=40",
        },
        {
          id: "pl-2",
          name: "Pieter van Dijk",
          type: "ploegleider",
          status: "responding",
          location: "Verdieping 4, onderweg naar incident",
          lastSeen: "Nu",
          phone: "06-56789012",
          email: "pieter.vandijk@demobedrijf.nl",
          role: "Ploegleider",
          bhvRoles: ["Ploegleider", "BHV"],
          photo: "/placeholder.svg?height=40&width=40",
        },
        // Visitors
        {
          id: "vis-1",
          name: "John Smith",
          type: "visitor",
          status: "present",
          location: "Verdieping 2, Vergaderzaal 2.08",
          lastSeen: "10 minuten geleden",
          phone: "06-11111111",
          email: "john.smith@abccompany.com",
          company: "ABC Company",
          host: "Jan Jansen",
          purpose: "Leverancier",
          checkInTime: "09:30",
          photo: "/placeholder.svg?height=40&width=40",
        },
        {
          id: "vis-2",
          name: "Maria Garcia",
          type: "visitor",
          status: "present",
          location: "Verdieping 1, Kantine",
          lastSeen: "5 minuten geleden",
          phone: "06-22222222",
          email: "maria.garcia@xyzcorp.com",
          company: "XYZ Corp",
          host: "Petra de Vries",
          purpose: "Klant",
          checkInTime: "10:15",
          photo: "/placeholder.svg?height=40&width=40",
        },
        // Contractors
        {
          id: "con-1",
          name: "Piet Monteur",
          type: "contractor",
          status: "present",
          location: "Verdieping 2, Serverruimte",
          lastSeen: "3 minuten geleden",
          phone: "06-12345678",
          email: "piet@elektrotech.nl",
          company: "ElektroTech BV",
          licensePlate: "12-ABC-3",
          checkInTime: "08:30",
          expectedDuration: "4 uur",
          photo: "/placeholder.svg?height=40&width=40",
        },
        {
          id: "con-2",
          name: "Marie Schoonmaak",
          type: "contractor",
          status: "present",
          location: "Gehele gebouw",
          lastSeen: "15 minuten geleden",
          phone: "06-87654321",
          email: "marie@cleanpro.nl",
          company: "CleanPro Services",
          checkInTime: "07:00",
          expectedDuration: "6 uur",
          photo: "/placeholder.svg?height=40&width=40",
        },
      ]

      setPeople(mockPeople)
    }
  }, [selectedCustomer])

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        setLastUpdate(new Date())
        // In production, this would trigger a data refresh
      }, 30000)

      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  const handleRefresh = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setLastUpdate(new Date())
    setIsLoading(false)
  }

  const getStatusBadge = (status: PresenceStatus) => {
    switch (status) {
      case "present":
        return <Badge className="bg-green-100 text-green-800">Aanwezig</Badge>
      case "absent":
        return <Badge className="bg-gray-100 text-gray-800">Afwezig</Badge>
      case "responding":
        return <Badge className="bg-orange-100 text-orange-800">Reageert</Badge>
      case "on_duty":
        return <Badge className="bg-blue-100 text-blue-800">Van dienst</Badge>
      default:
        return <Badge>Onbekend</Badge>
    }
  }

  const getTypeIcon = (type: PersonType) => {
    switch (type) {
      case "bhv_member":
        return <Shield className="h-4 w-4 text-blue-600" />
      case "ploegleider":
        return <Star className="h-4 w-4 text-purple-600" />
      case "visitor":
        return <Users className="h-4 w-4 text-green-600" />
      case "contractor":
        return <Building className="h-4 w-4 text-orange-600" />
      default:
        return <UserCheck className="h-4 w-4" />
    }
  }

  const getTypeLabel = (type: PersonType) => {
    switch (type) {
      case "bhv_member":
        return "BHV'er"
      case "ploegleider":
        return "Ploegleider"
      case "visitor":
        return "Bezoeker"
      case "contractor":
        return "Monteur"
      default:
        return "Onbekend"
    }
  }

  const filteredPeople = filter === "all" ? people : people.filter((person) => person.type === filter)
  const presentCount = people.filter((p) => p.status === "present" || p.status === "on_duty").length
  const bhvPresentCount = people.filter(
    (p) => (p.type === "bhv_member" || p.type === "ploegleider") && (p.status === "present" || p.status === "on_duty"),
  ).length

  // Get messageable people (visitors and contractors)
  const messageablePeople = people.filter(
    (p) => (p.type === "visitor" || p.type === "contractor") && p.status === "present" && (p.phone || p.email),
  )

  if (!selectedCustomer) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Selecteer een klant om aanwezigheid te bekijken</p>
        </CardContent>
      </Card>
    )
  }

  if (compact) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Aanwezigheid</CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                {presentCount} aanwezig
              </Badge>
              <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{bhvPresentCount}</div>
              <div className="text-sm text-muted-foreground">BHV Aanwezig</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {people.filter((p) => p.type === "visitor" && p.status === "present").length}
              </div>
              <div className="text-sm text-muted-foreground">Bezoekers</div>
            </div>
          </div>
          {showMessaging && messageablePeople.length > 0 && (
            <div className="mt-4">
              <MessageComposer
                recipients={messageablePeople}
                trigger={
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Bericht Sturen ({messageablePeople.length})
                  </Button>
                }
              />
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Actuele Aanwezigheid - {selectedCustomer.name}</span>
            </CardTitle>
            <CardDescription>Real-time overzicht van alle aanwezige personen in het gebouw</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              {lastUpdate.toLocaleTimeString("nl-NL")}
            </Badge>
            {showMessaging && messageablePeople.length > 0 && (
              <MessageComposer
                recipients={messageablePeople}
                trigger={
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Bericht Sturen ({messageablePeople.length})
                  </Button>
                }
              />
            )}
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Vernieuwen
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{bhvPresentCount}</div>
            <div className="text-sm text-blue-700">BHV Aanwezig</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {people.filter((p) => p.type === "visitor" && p.status === "present").length}
            </div>
            <div className="text-sm text-green-700">Bezoekers</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {people.filter((p) => p.type === "contractor" && p.status === "present").length}
            </div>
            <div className="text-sm text-orange-700">Monteurs</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{presentCount}</div>
            <div className="text-sm text-purple-700">Totaal Aanwezig</div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="flex flex-wrap gap-2">
            <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
              Alle ({people.length})
            </Button>
            <Button
              variant={filter === "ploegleider" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("ploegleider")}
            >
              <Star className="h-4 w-4 mr-1" />
              Ploegleiders ({people.filter((p) => p.type === "ploegleider").length})
            </Button>
            <Button
              variant={filter === "bhv_member" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("bhv_member")}
            >
              <Shield className="h-4 w-4 mr-1" />
              BHV'ers ({people.filter((p) => p.type === "bhv_member").length})
            </Button>
            <Button
              variant={filter === "visitor" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("visitor")}
            >
              <Users className="h-4 w-4 mr-1" />
              Bezoekers ({people.filter((p) => p.type === "visitor").length})
            </Button>
            <Button
              variant={filter === "contractor" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("contractor")}
            >
              <Building className="h-4 w-4 mr-1" />
              Monteurs ({people.filter((p) => p.type === "contractor").length})
            </Button>
          </div>
        )}

        {/* People List */}
        <div className="space-y-3">
          {filteredPeople.map((person) => (
            <div key={person.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50">
              <Avatar className="h-12 w-12">
                <AvatarImage src={person.photo || "/placeholder.svg"} alt={person.name} />
                <AvatarFallback>
                  {person.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  {getTypeIcon(person.type)}
                  <h3 className="font-semibold">{person.name}</h3>
                  <Badge variant="outline" className="text-xs">
                    {getTypeLabel(person.type)}
                  </Badge>
                  {person.bhvRoles && person.bhvRoles.length > 0 && (
                    <div className="flex space-x-1">
                      {person.bhvRoles.includes("EHBO") && <Heart className="h-3 w-3 text-red-500" />}
                      {person.bhvRoles.includes("Coördinator") && <Star className="h-3 w-3 text-yellow-500" />}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {person.location}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {person.lastSeen}
                  </div>
                  <div className="flex items-center space-x-2">
                    {person.phone && (
                      <div className="flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        {person.phone}
                      </div>
                    )}
                    {person.email && <Mail className="h-3 w-3 text-blue-500" />}
                  </div>
                </div>

                {/* Additional info based on type */}
                {person.type === "visitor" && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    {person.company} • Host: {person.host} • {person.purpose}
                    {person.checkInTime && ` • Ingecheckt: ${person.checkInTime}`}
                  </div>
                )}

                {person.type === "contractor" && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    {person.company}
                    {person.licensePlate && ` • ${person.licensePlate}`}
                    {person.checkInTime && ` • Ingecheckt: ${person.checkInTime}`}
                    {person.expectedDuration && ` • Verwacht: ${person.expectedDuration}`}
                  </div>
                )}

                {person.role && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    Rol: {person.role}
                    {person.bhvRoles && ` • BHV: ${person.bhvRoles.join(", ")}`}
                  </div>
                )}
              </div>

              <div className="text-right space-y-2">
                {getStatusBadge(person.status)}
                {person.status === "responding" && (
                  <div className="flex items-center text-xs text-orange-600">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Incident response
                  </div>
                )}
                {person.status === "on_duty" && (
                  <div className="flex items-center text-xs text-blue-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Van dienst
                  </div>
                )}
                {/* Individual messaging for visitors and contractors */}
                {showMessaging &&
                  (person.type === "visitor" || person.type === "contractor") &&
                  person.status === "present" &&
                  (person.phone || person.email) && (
                    <MessageComposer
                      recipients={[person]}
                      trigger={
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Bericht
                        </Button>
                      }
                    />
                  )}
              </div>
            </div>
          ))}

          {filteredPeople.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Geen personen gevonden voor het geselecteerde filter</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
