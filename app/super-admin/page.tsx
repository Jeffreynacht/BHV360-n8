"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, Users, Briefcase, DollarSign, Globe, Shield } from "lucide-react"

export default function SuperAdminDashboard() {
  const stats = {
    totalPartners: 12,
    totalCustomers: 156,
    totalUsers: 3420,
    monthlyRevenue: 45600,
    activeIncidents: 3,
    systemHealth: 99.8,
  }

  const recentPartners = [
    { name: "SafetyFirst Consultancy", customers: 15, revenue: 2500, status: "active" },
    { name: "VeiligheidsExperts BV", customers: 8, revenue: 1200, status: "active" },
    { name: "BHV Solutions", customers: 23, revenue: 4100, status: "active" },
  ]

  const systemAlerts = [
    { type: "warning", message: "Database backup delayed by 15 minutes", time: "2 min ago" },
    { type: "info", message: "New partner registration: Emergency Experts", time: "1 hour ago" },
    { type: "success", message: "System update completed successfully", time: "3 hours ago" },
  ]

  return (
    <div className="container p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">App Eigenaar Dashboard</h1>
          <p className="text-muted-foreground">Volledige controle over BHV360 platform</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Globe className="mr-2 h-4 w-4" />
            Systeem Status
          </Button>
          <Button>
            <Briefcase className="mr-2 h-4 w-4" />
            Nieuwe Partner
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">White-label Partners</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPartners}</div>
            <p className="text-xs text-muted-foreground">+2 deze maand</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totaal Klanten</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">+12 deze maand</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actieve Gebruikers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+156 deze week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maandelijkse Omzet</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{stats.monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+8.2% vs vorige maand</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Partners */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Partners</CardTitle>
            <CardDescription>Partners met de hoogste omzet deze maand</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPartners.map((partner, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{partner.name}</p>
                    <p className="text-sm text-muted-foreground">{partner.customers} klanten</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">€{partner.revenue}</p>
                    <Badge variant={partner.status === "active" ? "default" : "secondary"}>{partner.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Systeem Meldingen</CardTitle>
            <CardDescription>Recente systeem events en alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemAlerts.map((alert, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      alert.type === "warning"
                        ? "bg-yellow-500"
                        : alert.type === "info"
                          ? "bg-blue-500"
                          : "bg-green-500"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Health */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5" />
            Systeem Gezondheid
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.systemHealth}%</div>
              <p className="text-sm text-muted-foreground">Uptime</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">245ms</div>
              <p className="text-sm text-muted-foreground">Avg Response</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.activeIncidents}</div>
              <p className="text-sm text-muted-foreground">Active Incidents</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">12.4GB</div>
              <p className="text-sm text-muted-foreground">Storage Used</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
