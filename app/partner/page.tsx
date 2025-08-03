"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, Users, TrendingUp, DollarSign, Plus, Settings } from "lucide-react"

export default function PartnerDashboard() {
  const partnerStats = {
    totalCustomers: 23,
    totalUsers: 456,
    monthlyRevenue: 4100,
    newCustomersThisMonth: 3,
  }

  const recentCustomers = [
    { name: "Ziekenhuis Sint Anna", users: 150, plan: "Enterprise", status: "active" },
    { name: "TU Eindhoven", users: 300, plan: "Enterprise", status: "active" },
    { name: "Gemeente Tilburg", users: 85, plan: "Professional", status: "active" },
  ]

  return (
    <div className="container p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Partner Dashboard</h1>
          <p className="text-muted-foreground">Beheer uw white-label BHV360 omgeving</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Branding
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nieuwe Klant
          </Button>
        </div>
      </div>

      {/* Partner Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mijn Klanten</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{partnerStats.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">+{partnerStats.newCustomersThisMonth} deze maand</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totaal Gebruikers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{partnerStats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Gemiddeld 19.8 per klant</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maandelijkse Omzet</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{partnerStats.monthlyRevenue}</div>
            <p className="text-xs text-muted-foreground">+12.5% vs vorige maand</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Groei Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+15.2%</div>
            <p className="text-xs text-muted-foreground">Klanten groei dit kwartaal</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Customers */}
      <Card>
        <CardHeader>
          <CardTitle>Mijn Klanten</CardTitle>
          <CardDescription>Overzicht van uw actieve klanten</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentCustomers.map((customer, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{customer.name}</p>
                  <p className="text-sm text-muted-foreground">{customer.users} gebruikers</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{customer.plan}</Badge>
                  <Badge variant={customer.status === "active" ? "default" : "secondary"}>{customer.status}</Badge>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
