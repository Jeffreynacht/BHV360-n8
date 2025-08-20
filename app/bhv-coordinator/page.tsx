"use client"

import { RoleGuard } from "@/components/rbac/role-guard"
import { UserRole } from "@/lib/rbac/user-management"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, Users, AlertTriangle, Map, UserCheck, Calendar, TrendingUp } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export default function BHVCoordinatorDashboard() {
  return (
    <RoleGuard allowedRoles={[UserRole.BHV_COORDINATOR]} requireCustomer={true}>
      <BHVCoordinatorContent />
    </RoleGuard>
  )
}

function BHVCoordinatorContent() {
  const { user } = useAuth()

  const bhvStats = {
    totalBHVMembers: 12,
    activeBHVMembers: 11,
    ehboMembers: 8,
    ontruimers: 6,
    upcomingTrainings: 3,
    expiringSoon: 2,
    recentIncidents: 1,
    evacuationTime: "4:32",
  }

  const teamMembers = [
    {
      name: "Jan de Vries",
      role: "BHV Ploegleider",
      building: "Hoofdgebouw",
      status: "active",
      certExpiry: "2024-08-15",
    },
    { name: "Marie Janssen", role: "EHBO'er", building: "Hoofdgebouw", status: "active", certExpiry: "2024-06-20" },
    { name: "Piet Bakker", role: "Ontruimer", building: "Bijgebouw", status: "active", certExpiry: "2024-09-10" },
    { name: "Anna de Wit", role: "BHV'er", building: "Hoofdgebouw", status: "training", certExpiry: "2024-07-05" },
  ]

  const upcomingTrainings = [
    { type: "BHV Herhalingstraining", date: "2024-02-15", participants: 8, location: "Trainingsruimte A" },
    { type: "EHBO Cursus", date: "2024-02-22", participants: 4, location: "Trainingsruimte B" },
    { type: "Evacuatie Oefening", date: "2024-03-01", participants: 156, location: "Hele organisatie" },
  ]

  return (
    <div className="container p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">BHV Coördinatie</h1>
          <p className="text-muted-foreground">Beheer het BHV team en veiligheidsprocedures</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Training Plannen
          </Button>
          <Button>
            <AlertTriangle className="mr-2 h-4 w-4" />
            Incident Melden
          </Button>
        </div>
      </div>

      {/* BHV Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">BHV Team</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bhvStats.totalBHVMembers}</div>
            <p className="text-xs text-muted-foreground">{bhvStats.activeBHVMembers} actief beschikbaar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">EHBO'ers</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bhvStats.ehboMembers}</div>
            <p className="text-xs text-muted-foreground">Gecertificeerde EHBO'ers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certificaten</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bhvStats.expiringSoon}</div>
            <p className="text-xs text-muted-foreground">Verlopen binnenkort</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Evacuatietijd</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bhvStats.evacuationTime}</div>
            <p className="text-xs text-muted-foreground">Laatste oefening</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Overview */}
        <Card>
          <CardHeader>
            <CardTitle>BHV Team Overzicht</CardTitle>
            <CardDescription>Status van alle BHV teamleden</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teamMembers.map((member, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {member.role} - {member.building}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={member.status === "active" ? "default" : "secondary"}>{member.status}</Badge>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Cert. verloopt:</p>
                      <p className="text-xs">{member.certExpiry}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Trainings */}
        <Card>
          <CardHeader>
            <CardTitle>Geplande Trainingen</CardTitle>
            <CardDescription>Aankomende BHV trainingen en oefeningen</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingTrainings.map((training, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{training.type}</p>
                    <p className="text-sm text-muted-foreground">{training.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{training.date}</p>
                    <p className="text-sm text-muted-foreground">{training.participants} deelnemers</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>BHV Acties</CardTitle>
          <CardDescription>Veelgebruikte BHV coördinatie functies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <Users className="h-6 w-6 mb-2" />
              Team Beheer
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Map className="h-6 w-6 mb-2" />
              Plotkaart
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Calendar className="h-6 w-6 mb-2" />
              Trainingen
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <AlertTriangle className="h-6 w-6 mb-2" />
              Incidenten
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
