"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, UserCheck, UserX, AlertTriangle, ShipWheelIcon as Wheelchair, Clock, RefreshCw } from "lucide-react"

type BHVMember = {
  id: number
  name: string
  role: string
  status: "available" | "unavailable" | "responding" | "onduty"
  location: string
  lastSeen: string
  photoUrl?: string
  isCoordinator?: boolean
  isPloegleider?: boolean
}

type ActiveIncident = {
  id: number
  type: string
  location: string
  status: "active" | "responding" | "resolved"
  startTime: string
  priority: "low" | "medium" | "high" | "critical"
  responders: number[]
}

type DisabledPerson = {
  id: number
  name: string
  type: "permanent" | "temporary"
  location: string
  photoUrl?: string
}

type Visitor = {
  id: number
  name: string
  company: string
  status: "arrived"
  isDisabled?: boolean
  disabilityType?: string
  photo?: string
}

export default function PublicBHVStatusPage() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [bhvMembers, setBhvMembers] = useState<BHVMember[]>([])
  const [activeIncidents, setActiveIncidents] = useState<ActiveIncident[]>([])
  const [disabledPersons, setDisabledPersons] = useState<DisabledPerson[]>([])
  const [visitors, setVisitors] = useState<Visitor[]>([])
  const [customerName, setCustomerName] = useState("BHV360 Organisatie")

  // Update tijd elke seconde
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Simuleer data refresh elke 30 seconden
  useEffect(() => {
    const loadData = () => {
      setBhvMembers([
        {
          id: 1,
          name: "Jan Jansen",
          role: "EHBO, BHV",
          status: "available",
          location: "Verdieping 2, Kantoor 2.15",
          lastSeen: "2 minuten geleden",
          photoUrl: "/placeholder.svg?height=100&width=100",
        },
        {
          id: 2,
          name: "Petra de Vries",
          role: "Ploegleider",
          status: "onduty",
          location: "Verdieping 1, Receptie",
          lastSeen: "1 minuut geleden",
          photoUrl: "/placeholder.svg?height=100&width=100",
          isPloegleider: true,
        },
        {
          id: 3,
          name: "Mohammed El Amrani",
          role: "BHV, Ontruimer",
          status: "available",
          location: "Verdieping 3, Vergaderzaal 3.04",
          lastSeen: "5 minuten geleden",
          photoUrl: "/placeholder.svg?height=100&width=100",
        },
        {
          id: 4,
          name: "Sarah Bakker",
          role: "EHBO",
          status: "unavailable",
          location: "Buiten het gebouw",
          lastSeen: "30 minuten geleden",
          photoUrl: "/placeholder.svg?height=100&width=100",
        },
        {
          id: 5,
          name: "Pieter van Dijk",
          role: "BHV",
          status: "responding",
          location: "Verdieping 4, onderweg naar incident",
          lastSeen: "Nu",
          photoUrl: "/placeholder.svg?height=100&width=100",
        },
        {
          id: 6,
          name: "Annemarie Visser",
          role: "Coördinator BHV",
          status: "available",
          location: "Verdieping 2, Kantoor 2.05",
          lastSeen: "5 minuten geleden",
          photoUrl: "/placeholder.svg?height=100&width=100",
          isCoordinator: true,
        },
      ])

      setActiveIncidents([
        {
          id: 1,
          type: "Brand",
          location: "Verdieping 3, Vleugel B",
          status: "active",
          startTime: "10:15",
          priority: "critical",
          responders: [2, 5],
        },
      ])

      setDisabledPersons([
        {
          id: 1,
          name: "Emma de Boer",
          type: "permanent",
          location: "Verdieping 3, Kantoor 3.12",
          photoUrl: "/placeholder.svg?height=100&width=100",
        },
        {
          id: 2,
          name: "Thomas Hendriks",
          type: "temporary",
          location: "Verdieping 1, Kantoor 1.05",
          photoUrl: "/placeholder.svg?height=100&width=100",
        },
      ])

      setVisitors([
        {
          id: 1,
          name: "Maria Garcia",
          company: "XYZ Corp",
          status: "arrived",
          isDisabled: true,
          disabilityType: "Rolstoelgebruiker",
          photo: "/placeholder.svg?height=100&width=100",
        },
      ])
    }

    loadData()
    const interval = setInterval(loadData, 30000) // Refresh elke 30 seconden
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500"
      case "unavailable":
        return "bg-gray-500"
      case "responding":
        return "bg-orange-500"
      case "onduty":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "available":
        return "Beschikbaar"
      case "unavailable":
        return "Niet beschikbaar"
      case "responding":
        return "Reageert op incident"
      case "onduty":
        return "Van dienst"
      default:
        return "Onbekend"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <img src="/images/bhv360-logo.png" alt="BHV360 Logo" className="h-16 w-auto" />
            <div>
              <h1 className="text-4xl font-bold text-gray-800">BHV Status Dashboard</h1>
              <p className="text-xl text-gray-600">{customerName}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-800">
              {currentTime.toLocaleTimeString("nl-NL", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </div>
            <div className="text-lg text-gray-600">
              {currentTime.toLocaleDateString("nl-NL", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <div className="flex items-center justify-end mt-2 text-sm text-gray-500">
              <RefreshCw className="h-4 w-4 mr-1" />
              Automatisch ververst
            </div>
          </div>
        </div>
      </div>

      {/* Actieve Incidenten - Prominente weergave */}
      {activeIncidents.length > 0 && (
        <div className="mb-8">
          <Card className="border-red-200 bg-red-50">
            <CardHeader className="bg-red-100">
              <CardTitle className="flex items-center text-red-800 text-2xl">
                <AlertTriangle className="mr-3 h-8 w-8 text-red-600" />🚨 ACTIEVE INCIDENTEN 🚨
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {activeIncidents.map((incident) => (
                  <div key={incident.id} className="p-6 border-2 border-red-300 bg-white rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-2xl font-bold text-red-800">{incident.type}</h3>
                        <p className="text-lg text-gray-700">{incident.location}</p>
                        <p className="text-lg">Gestart om {incident.startTime}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full ${getPriorityColor(incident.priority)}`} />
                        <Badge variant="destructive" className="text-lg px-4 py-2">
                          {incident.status === "active" ? "ACTIEF" : "IN BEHANDELING"}
                        </Badge>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-lg font-medium mb-3">Responders onderweg:</p>
                      <div className="flex flex-wrap gap-3">
                        {incident.responders.map((responderId) => {
                          const responder = bhvMembers.find((m) => m.id === responderId)
                          return responder ? (
                            <div key={responderId} className="flex items-center space-x-3 bg-blue-100 p-3 rounded-lg">
                              <Avatar className="h-12 w-12 border-2 border-blue-500">
                                <AvatarImage src={responder.photoUrl || "/placeholder.svg"} alt={responder.name} />
                                <AvatarFallback>
                                  {responder.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <span className="text-lg font-medium">{responder.name}</span>
                                <p className="text-sm text-gray-600">{responder.role}</p>
                              </div>
                            </div>
                          ) : null
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* BHV'ers van dienst */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="bg-blue-100">
            <CardTitle className="flex items-center text-blue-800 text-xl">
              <UserCheck className="mr-3 h-6 w-6 text-blue-600" />
              BHV'ers van Dienst ({bhvMembers.filter((m) => m.status === "onduty").length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {bhvMembers
                .filter((member) => member.status === "onduty")
                .map((member) => (
                  <div key={member.id} className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm">
                    <Avatar className="h-16 w-16 border-2 border-blue-500">
                      <AvatarImage src={member.photoUrl || "/placeholder.svg"} alt={member.name} />
                      <AvatarFallback className="text-lg">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-lg font-semibold">{member.name}</p>
                      <p className="text-gray-600">{member.role}</p>
                      <p className="text-sm text-gray-500">{member.location}</p>
                    </div>
                    <div className="text-right">
                      <div className={`w-4 h-4 rounded-full ${getStatusColor(member.status)} mb-1`} />
                      <p className="text-sm font-medium">{getStatusText(member.status)}</p>
                    </div>
                  </div>
                ))}
              {bhvMembers.filter((member) => member.status === "onduty").length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <UserX className="mx-auto h-16 w-16 mb-4" />
                  <p className="text-lg">Geen BHV'ers van dienst</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Beschikbare BHV'ers */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="bg-green-100">
            <CardTitle className="flex items-center text-green-800 text-xl">
              <Users className="mr-3 h-6 w-6 text-green-600" />
              Beschikbare BHV'ers ({bhvMembers.filter((m) => m.status === "available").length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {bhvMembers
                .filter((member) => member.status === "available")
                .map((member) => (
                  <div key={member.id} className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm">
                    <Avatar className="h-16 w-16 border-2 border-green-500">
                      <AvatarImage src={member.photoUrl || "/placeholder.svg"} alt={member.name} />
                      <AvatarFallback className="text-lg">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-lg font-semibold flex items-center">
                        {member.name}
                        {member.isCoordinator && <span className="ml-2 text-yellow-600">⭐</span>}
                        {member.isPloegleider && <span className="ml-2 text-blue-600">🛡️</span>}
                      </p>
                      <p className="text-gray-600">{member.role}</p>
                      <p className="text-sm text-gray-500">{member.location}</p>
                    </div>
                    <div className="text-right">
                      <div className={`w-4 h-4 rounded-full ${getStatusColor(member.status)} mb-1`} />
                      <p className="text-sm font-medium">{getStatusText(member.status)}</p>
                    </div>
                  </div>
                ))}
              {bhvMembers.filter((member) => member.status === "available").length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <UserX className="mx-auto h-16 w-16 mb-4" />
                  <p className="text-lg">Geen beschikbare BHV'ers</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mindervaliden in het gebouw */}
      <Card className="mt-8 border-purple-200 bg-purple-50">
        <CardHeader className="bg-purple-100">
          <CardTitle className="flex items-center text-purple-800 text-xl">
            <Wheelchair className="mr-3 h-6 w-6 text-purple-600" />
            Personen die Hulp Nodig Hebben bij Evacuatie (
            {disabledPersons.length + visitors.filter((v) => v.isDisabled).length})
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {disabledPersons.map((person) => (
              <div key={person.id} className="p-4 border border-purple-200 bg-white rounded-lg">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12 border-2 border-purple-300">
                    <AvatarImage src={person.photoUrl || "/placeholder.svg"} alt={person.name} />
                    <AvatarFallback>
                      {person.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{person.name}</h3>
                    <p className="text-sm text-gray-600">{person.location}</p>
                    <Badge variant="outline" className="mt-1">
                      {person.type === "permanent" ? "Permanent" : "Tijdelijk"}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
            {visitors
              .filter((visitor) => visitor.isDisabled)
              .map((visitor) => (
                <div key={visitor.id} className="p-4 border border-purple-200 bg-white rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12 border-2 border-purple-300">
                      <AvatarImage src={visitor.photo || "/placeholder.svg"} alt={visitor.name} />
                      <AvatarFallback>
                        {visitor.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{visitor.name}</h3>
                      <p className="text-sm text-gray-600">Bezoeker - {visitor.disabilityType}</p>
                      <Badge variant="outline" className="mt-1">
                        Bezoeker
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            {disabledPersons.length === 0 && visitors.filter((v) => v.isDisabled).length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-500">
                <Wheelchair className="mx-auto h-16 w-16 mb-4" />
                <p className="text-lg">Geen personen geregistreerd die hulp nodig hebben</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="mt-8 text-center text-gray-500">
        <p className="flex items-center justify-center">
          <Clock className="h-4 w-4 mr-2" />
          Laatste update: {currentTime.toLocaleTimeString("nl-NL")} | Deze pagina wordt automatisch ververst
        </p>
      </div>
    </div>
  )
}
