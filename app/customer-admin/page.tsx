"use client"

import { RoleGuard } from "@/components/rbac/role-guard"
import { UserRole } from "@/lib/rbac/user-management"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, Users, Shield, Settings, AlertTriangle, TrendingUp } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export default function CustomerAdminDashboard() {
  return (
    <RoleGuard allowedRoles={[UserRole.CUSTOMER_OWNER, UserRole.CUSTOMER_ADMIN]} requireCustomer={true}>
      <CustomerAdminContent />
    </RoleGuard>
  )
}

function CustomerAdminContent() {
  const { user } = useAuth()

  const customerStats = {
    totalUsers: 156,
    activeUsers: 142,
    totalBuildings: 3,
    bhvMembers: 12,
    recentIncidents: 2,
    complianceScore: 94,
  }

  const recentActivities = [
    { type: "user_added", message: "Nieuwe gebruiker toegevoegd: Jan Pietersen", time: "2 uur geleden" },
    { type: "incident", message: "Incident gemeld in Gebouw A, Verdieping 2", time: "4 uur geleden" },
    { type: "training", message: "BHV training gepland voor volgende week", time: "1 dag geleden" },
  ]

  const complianceItems = [
    { item: "BHV Certificeringen", status: "compliant", percentage: 100 },
    { item: "EHBO Certificeringen", status: "warning", percentage: 85 },
    { item: "Plotkaart Updates", status: "compliant", percentage: 100 },
    { item: "Incident Rapportage", status: "compliant", percentage: 95 },
  ]

  return (
    <div className="container p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Organisatie Beheer</h1>
          <p className="text-muted-foreground">Beheer uw organisatie en BHV voorzieningen</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Instellingen
          </Button>
          <Button>
            <Users className="mr-2 h-4 w-4" />
            Gebruiker Toevoegen
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totaal Gebruikers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerStats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">{customerStats.activeUsers} actief deze maand</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gebouwen</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerStats.totalBuildings}</div>
            <p className="text-xs text-muted-foreground">Alle locaties actief</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">BHV Team</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerStats.bhvMembers}</div>
            <p className="text-xs text-muted-foreground">Gecertificeerde BHV'ers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerStats.complianceScore}%</div>
            <p className="text-xs text-muted-foreground">+2% vs vorige maand</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recente Activiteiten</CardTitle>
            <CardDescription>Laatste gebeurtenissen in uw organisatie</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === "incident"
                        ? "bg-red-500"
                        : activity.type === "user_added"
                          ? "bg-green-500"
                          : "bg-blue-500"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Compliance Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Compliance Overzicht</CardTitle>
            <CardDescription>Status van verplichte BHV onderdelen</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {complianceItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{item.item}</p>
                    <p className="text-sm text-muted-foreground">{item.percentage}% compliant</p>
                  </div>
                  <Badge
                    variant={
                      item.status === "compliant" ? "default" : item.status === "warning" ? "secondary" : "destructive"
                    }
                  >
                    {item.status === "compliant" ? "✓" : item.status === "warning" ? "⚠" : "✗"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Snelle Acties</CardTitle>
          <CardDescription>Veelgebruikte beheerfuncties</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <Users className="h-6 w-6 mb-2" />
              Gebruikers
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Building2 className="h-6 w-6 mb-2" />
              Gebouwen
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Shield className="h-6 w-6 mb-2" />
              BHV Team
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
