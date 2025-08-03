"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, TrendingUp, Users, Building2, Crown, Activity, Calendar, DollarSign } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"

const subscriptionData = [
  { name: "Gratis", value: 0, color: "#6b7280" },
  { name: "Basis", value: 0, color: "#3b82f6" },
  { name: "Premium", value: 0, color: "#8b5cf6" },
  { name: "Enterprise", value: 0, color: "#f59e0b" },
]

const monthlyGrowthData = [
  { month: "Jan", klanten: 0, whitelabel: 0 },
  { month: "Feb", klanten: 0, whitelabel: 0 },
  { month: "Mrt", klanten: 0, whitelabel: 0 },
  { month: "Apr", klanten: 0, whitelabel: 0 },
  { month: "Mei", klanten: 0, whitelabel: 0 },
  { month: "Jun", klanten: 0, whitelabel: 0 },
]

export default function KlantOverzichtenPage() {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    whitelabelCustomers: 0,
    activeCustomers: 0,
    totalRevenue: 0,
    averageSubscription: "Gratis",
    growthRate: 0,
  })

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    // Since we removed demo data, all stats start at 0
    setStats({
      totalCustomers: 0,
      whitelabelCustomers: 0,
      activeCustomers: 0,
      totalRevenue: 0,
      averageSubscription: "Gratis",
      growthRate: 0,
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <BarChart3 className="h-8 w-8" />
          Klant Overzichten
        </h1>
        <p className="text-muted-foreground">Uitgebreide analyses en statistieken van al je klanten</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totaal Klanten</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{stats.growthRate}%</span> ten opzichte van vorige maand
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Whitelabel Klanten</CardTitle>
            <Crown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.whitelabelCustomers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalCustomers > 0 ? Math.round((stats.whitelabelCustomers / stats.totalCustomers) * 100) : 0}% van
              totaal
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actieve Klanten</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeCustomers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalCustomers > 0 ? Math.round((stats.activeCustomers / stats.totalCustomers) * 100) : 0}%
              activiteitsratio
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gemiddeld Abonnement</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageSubscription}</div>
            <p className="text-xs text-muted-foreground">Meest gekozen abonnement type</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overzicht</TabsTrigger>
          <TabsTrigger value="subscriptions">Abonnementen</TabsTrigger>
          <TabsTrigger value="growth">Groei</TabsTrigger>
          <TabsTrigger value="whitelabel">Whitelabel</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Klanten Status Verdeling</CardTitle>
                <CardDescription>Overzicht van actieve vs inactieve klanten</CardDescription>
              </CardHeader>
              <CardContent>
                {stats.totalCustomers === 0 ? (
                  <div className="flex items-center justify-center h-64 text-muted-foreground">
                    <div className="text-center">
                      <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Geen klanten om weer te geven</p>
                      <p className="text-sm">Voeg klanten toe om statistieken te zien</p>
                    </div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Actief", value: stats.activeCustomers, color: "#22c55e" },
                          { name: "Inactief", value: stats.totalCustomers - stats.activeCustomers, color: "#ef4444" },
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                      >
                        {[
                          { name: "Actief", value: stats.activeCustomers, color: "#22c55e" },
                          { name: "Inactief", value: stats.totalCustomers - stats.activeCustomers, color: "#ef4444" },
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Maandelijkse Activiteit</CardTitle>
                <CardDescription>Klant activiteit over de laatste 6 maanden</CardDescription>
              </CardHeader>
              <CardContent>
                {stats.totalCustomers === 0 ? (
                  <div className="flex items-center justify-center h-64 text-muted-foreground">
                    <div className="text-center">
                      <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Geen activiteitsdata beschikbaar</p>
                      <p className="text-sm">Data wordt verzameld zodra klanten actief worden</p>
                    </div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="klanten" stroke="#3b82f6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="subscriptions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Abonnement Verdeling</CardTitle>
              <CardDescription>Overzicht van alle abonnement types</CardDescription>
            </CardHeader>
            <CardContent>
              {stats.totalCustomers === 0 ? (
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  <div className="text-center">
                    <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Geen abonnement data beschikbaar</p>
                    <p className="text-sm">Voeg klanten toe om abonnement statistieken te zien</p>
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={subscriptionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="growth" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Groei Trend</CardTitle>
              <CardDescription>Klanten groei over de laatste 6 maanden</CardDescription>
            </CardHeader>
            <CardContent>
              {stats.totalCustomers === 0 ? (
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Geen groei data beschikbaar</p>
                    <p className="text-sm">Groei wordt bijgehouden zodra je klanten toevoegt</p>
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={monthlyGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="klanten"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="whitelabel" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Whitelabel vs Regulier</CardTitle>
                <CardDescription>Vergelijking tussen whitelabel en reguliere klanten</CardDescription>
              </CardHeader>
              <CardContent>
                {stats.totalCustomers === 0 ? (
                  <div className="flex items-center justify-center h-64 text-muted-foreground">
                    <div className="text-center">
                      <Crown className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Geen whitelabel data beschikbaar</p>
                      <p className="text-sm">Schakel whitelabel in voor klanten om data te zien</p>
                    </div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Whitelabel", value: stats.whitelabelCustomers, color: "#f59e0b" },
                          {
                            name: "Regulier",
                            value: stats.totalCustomers - stats.whitelabelCustomers,
                            color: "#3b82f6",
                          },
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                      >
                        {[
                          { name: "Whitelabel", value: stats.whitelabelCustomers, color: "#f59e0b" },
                          {
                            name: "Regulier",
                            value: stats.totalCustomers - stats.whitelabelCustomers,
                            color: "#3b82f6",
                          },
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Whitelabel Groei</CardTitle>
                <CardDescription>Groei van whitelabel klanten over tijd</CardDescription>
              </CardHeader>
              <CardContent>
                {stats.whitelabelCustomers === 0 ? (
                  <div className="flex items-center justify-center h-64 text-muted-foreground">
                    <div className="text-center">
                      <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Geen whitelabel groei data</p>
                      <p className="text-sm">Voeg whitelabel klanten toe om trends te zien</p>
                    </div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="whitelabel"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        dot={{ fill: "#f59e0b", strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
