"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { BHV360Logo } from "@/components/bhv360-logo"
import {
  Crown,
  Users,
  Building2,
  TrendingUp,
  Activity,
  Shield,
  Database,
  Settings,
  BarChart3,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Globe,
  Smartphone,
  Mail,
  ArrowRight,
  Plus,
  Eye,
  Edit,
  Trash2,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const platformStats = [
  {
    title: "Totaal Klanten",
    value: "2,847",
    change: "+12.5%",
    trend: "up",
    icon: Building2,
    color: "text-blue-600",
  },
  {
    title: "Actieve Gebruikers",
    value: "45,231",
    change: "+8.2%",
    trend: "up",
    icon: Users,
    color: "text-green-600",
  },
  {
    title: "Maandelijkse Omzet",
    value: "€284,500",
    change: "+15.3%",
    trend: "up",
    icon: DollarSign,
    color: "text-purple-600",
  },
  {
    title: "System Uptime",
    value: "99.97%",
    change: "+0.02%",
    trend: "up",
    icon: Activity,
    color: "text-orange-600",
  },
]

const demoCustomers = [
  {
    id: 1,
    name: "Demo Klant - TechCorp",
    email: "demo@techcorp.nl",
    users: 45,
    status: "active",
    created: "2024-01-15",
    lastLogin: "2024-01-20 14:30",
    type: "sales-demo",
  },
  {
    id: 2,
    name: "Demo Klant - HealthCare Plus",
    email: "demo@healthcare.nl",
    users: 78,
    status: "trial",
    created: "2024-01-18",
    lastLogin: "2024-01-19 09:15",
    type: "trial",
  },
  {
    id: 3,
    name: "Demo Klant - SafetyFirst",
    email: "demo@safetyfirst.nl",
    users: 23,
    status: "expired",
    created: "2024-01-10",
    lastLogin: "2024-01-17 16:45",
    type: "sales-demo",
  },
]

const recentPartners = [
  {
    id: 1,
    name: "VeiligWerk Solutions",
    email: "contact@veiligwerk.nl",
    tier: "Silver",
    clients: 23,
    revenue: "€12,500",
    status: "active",
    joined: "2024-01-12",
  },
  {
    id: 2,
    name: "BHV Experts Nederland",
    email: "info@bhvexperts.nl",
    tier: "Bronze",
    clients: 8,
    revenue: "€3,200",
    status: "pending",
    joined: "2024-01-19",
  },
]

const systemAlerts = [
  {
    type: "warning",
    message: "Database backup voltooid met waarschuwingen",
    time: "5 min geleden",
    icon: Database,
  },
  {
    type: "success",
    message: "Nieuwe partner onboarding succesvol",
    time: "1 uur geleden",
    icon: CheckCircle,
  },
  {
    type: "info",
    message: "Systeem update gepland voor vanavond 23:00",
    time: "2 uur geleden",
    icon: Clock,
  },
]

export default function SuperAdminPortalPage() {
  const [newDemoName, setNewDemoName] = useState("")
  const [newDemoEmail, setNewDemoEmail] = useState("")

  const createDemoCustomer = () => {
    // In real app, this would create a demo customer via API
    alert(`Demo klant "${newDemoName}" wordt aangemaakt...`)
    setNewDemoName("")
    setNewDemoEmail("")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "trial":
        return "bg-blue-100 text-blue-800"
      case "expired":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Gold":
        return "bg-yellow-100 text-yellow-800"
      case "Silver":
        return "bg-gray-100 text-gray-800"
      case "Bronze":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <BHV360Logo size="lg" />
            <Badge className="bg-purple-100 text-purple-800">
              <Crown className="h-4 w-4 mr-2" />
              Super Admin Portal
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost">Terug naar Dashboard</Button>
            </Link>
            <Link href="/system-health">
              <Button variant="outline">
                <Activity className="mr-2 h-4 w-4" />
                System Health
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6 space-y-8">
        {/* Welcome Section */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Super Admin Portal
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Centraal beheer van het BHV360 platform. Beheer klanten, partners, demo omgevingen en monitor de
            systeemgezondheid.
          </p>
        </div>

        {/* Platform Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {platformStats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className={`text-xs ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                  {stat.change} van vorige maand
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="mr-2 h-5 w-5 text-yellow-500" />
              Snelle Acties
            </CardTitle>
            <CardDescription>Veelgebruikte beheersfuncties</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/super-admin/partners">
                <Button variant="outline" className="h-20 w-full flex-col gap-2 hover:bg-blue-50 bg-transparent">
                  <Building2 className="h-6 w-6" />
                  <span className="text-xs">Partners Beheren</span>
                </Button>
              </Link>
              <Link href="/klanten">
                <Button variant="outline" className="h-20 w-full flex-col gap-2 hover:bg-green-50 bg-transparent">
                  <Users className="h-6 w-6" />
                  <span className="text-xs">Klanten Overzicht</span>
                </Button>
              </Link>
              <Link href="/system-health">
                <Button variant="outline" className="h-20 w-full flex-col gap-2 hover:bg-purple-50 bg-transparent">
                  <Activity className="h-6 w-6" />
                  <span className="text-xs">System Health</span>
                </Button>
              </Link>
              <Link href="/super-admin/link-monitoring">
                <Button variant="outline" className="h-20 w-full flex-col gap-2 hover:bg-orange-50 bg-transparent">
                  <Globe className="h-6 w-6" />
                  <span className="text-xs">Link Monitoring</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Demo Customers Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Smartphone className="mr-2 h-5 w-5 text-blue-500" />
                    Demo Klanten
                  </CardTitle>
                  <CardDescription>Beheer demo omgevingen voor verkoop</CardDescription>
                </div>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Nieuwe Demo
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Quick Create Demo */}
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-3">Snelle Demo Aanmaken</h4>
                <div className="space-y-2">
                  <Input
                    placeholder="Demo klant naam"
                    value={newDemoName}
                    onChange={(e) => setNewDemoName(e.target.value)}
                  />
                  <Input
                    placeholder="Email adres"
                    type="email"
                    value={newDemoEmail}
                    onChange={(e) => setNewDemoEmail(e.target.value)}
                  />
                  <Button onClick={createDemoCustomer} className="w-full" size="sm">
                    Demo Aanmaken
                  </Button>
                </div>
              </div>

              {/* Demo Customers List */}
              <div className="space-y-3">
                {demoCustomers.map((customer) => (
                  <div key={customer.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm">{customer.name}</h4>
                        <Badge className={getStatusColor(customer.status)} variant="outline">
                          {customer.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500">{customer.email}</p>
                      <p className="text-xs text-gray-500">{customer.users} gebruikers</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Partners */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Building2 className="mr-2 h-5 w-5 text-green-500" />
                    Recente Partners
                  </CardTitle>
                  <CardDescription>Nieuwe partner aanmeldingen</CardDescription>
                </div>
                <Link href="/super-admin/partners">
                  <Button variant="outline" size="sm">
                    Alle Partners
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPartners.map((partner) => (
                  <div key={partner.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm">{partner.name}</h4>
                        <Badge className={getTierColor(partner.tier)} variant="outline">
                          {partner.tier}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500">{partner.email}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs text-gray-500">{partner.clients} klanten</span>
                        <span className="text-xs text-green-600 font-medium">{partner.revenue}</span>
                      </div>
                    </div>
                    <Badge className={getStatusColor(partner.status)} variant="outline">
                      {partner.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-orange-500" />
              Systeem Meldingen
            </CardTitle>
            <CardDescription>Recente systeem events en waarschuwingen</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {systemAlerts.map((alert, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div
                    className={`p-2 rounded-full ${
                      alert.type === "success"
                        ? "bg-green-100"
                        : alert.type === "warning"
                          ? "bg-orange-100"
                          : "bg-blue-100"
                    }`}
                  >
                    <alert.icon
                      className={`h-4 w-4 ${
                        alert.type === "success"
                          ? "text-green-600"
                          : alert.type === "warning"
                            ? "text-orange-600"
                            : "text-blue-600"
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{alert.message}</p>
                    <p className="text-xs text-gray-500">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Platform Management */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-600">
                <Database className="mr-2 h-5 w-5" />
                Database Beheer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Beheer database backups, migraties en performance</p>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                  <Database className="mr-2 h-4 w-4" />
                  Database Status
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                  <Shield className="mr-2 h-4 w-4" />
                  Backup Beheer
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Performance Monitor
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center text-green-600">
                <Settings className="mr-2 h-5 w-5" />
                Platform Instellingen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Globale platform configuratie en instellingen</p>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                  <Settings className="mr-2 h-4 w-4" />
                  Systeem Config
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                  <Mail className="mr-2 h-4 w-4" />
                  Email Templates
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                  <Globe className="mr-2 h-4 w-4" />
                  Domain Beheer
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center text-purple-600">
                <BarChart3 className="mr-2 h-5 w-5" />
                Analytics & Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Platform analytics en gedetailleerde rapportages</p>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Usage Analytics
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Revenue Reports
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Growth Metrics
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
