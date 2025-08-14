"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, Database, Building2, Activity, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"

interface DatabaseStatus {
  success: boolean
  message: string
  timestamp?: string
  database?: string
  error?: string
}

interface CustomerStats {
  total: number
  active: number
  inactive: number
}

export default function HomePage() {
  const { user, loading } = useAuth()
  const [dbStatus, setDbStatus] = useState<DatabaseStatus | null>(null)
  const [customerStats, setCustomerStats] = useState<CustomerStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkDatabaseStatus()
    loadCustomerStats()
  }, [])

  const checkDatabaseStatus = async () => {
    try {
      const response = await fetch("/api/test-database")
      const data = await response.json()
      setDbStatus(data)
    } catch (error) {
      console.error("Failed to check database status:", error)
      setDbStatus({
        success: false,
        message: "Failed to connect to database",
        error: "Connection error",
      })
    }
  }

  const loadCustomerStats = async () => {
    try {
      const response = await fetch("/api/customers")
      const data = await response.json()

      if (data.success) {
        const customers = data.customers
        setCustomerStats({
          total: customers.length,
          active: customers.filter((c: any) => c.status === "active").length,
          inactive: customers.filter((c: any) => c.status !== "active").length,
        })
      }
    } catch (error) {
      console.error("Failed to load customer stats:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Shield className="h-12 w-12 text-blue-600" />
          <h1 className="text-4xl font-bold tracking-tight">BHV360</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Professional Safety Management System - Complete BHV management with real-time monitoring and compliance
          reporting
        </p>
        {user && (
          <div className="flex items-center justify-center gap-2">
            <Badge variant="outline">Welcome back, {user.name}</Badge>
            <Badge variant={user.role === "super-admin" ? "default" : "secondary"}>{user.role}</Badge>
          </div>
        )}
      </div>

      {/* System Status */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database Status</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {dbStatus?.success ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <div className="text-2xl font-bold">{dbStatus?.success ? "Connected" : "Disconnected"}</div>
            </div>
            <p className="text-xs text-muted-foreground">{dbStatus?.database || "Neon PostgreSQL"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : customerStats?.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              {customerStats?.active || 0} active, {customerStats?.inactive || 0} inactive
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div className="text-2xl font-bold">Operational</div>
            </div>
            <p className="text-xs text-muted-foreground">All systems running</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {user?.role === "super-admin" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Customer Management
              </CardTitle>
              <CardDescription>Manage all customers and their configurations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link href="/klanten">
                  <Button className="w-full">View All Customers</Button>
                </Link>
                <Link href="/whitelabel-klanten">
                  <Button variant="outline" className="w-full bg-transparent">
                    Whitelabel Customers
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              BHV Management
            </CardTitle>
            <CardDescription>Manage safety personnel and incidents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Link href="/gebruikers">
                <Button className="w-full">BHV Personnel</Button>
              </Link>
              <Link href="/incidenten">
                <Button variant="outline" className="w-full bg-transparent">
                  View Incidents
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              System Tools
            </CardTitle>
            <CardDescription>Database and system management tools</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Link href="/test-database">
                <Button className="w-full">Test Database</Button>
              </Link>
              <Link href="/help">
                <Button variant="outline" className="w-full bg-transparent">
                  Help & Support
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Role-based Access Test */}
      {user && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Role-based Access Test
            </CardTitle>
            <CardDescription>Test different access levels based on your role: {user.role}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <h4 className="font-semibold">Super Admin Only</h4>
                <Link href="/whitelabel-klanten">
                  <Button
                    variant={user.role === "super-admin" ? "default" : "outline"}
                    className="w-full"
                    disabled={user.role !== "super-admin"}
                  >
                    Whitelabel Overview
                  </Button>
                </Link>
                <Link href="/super-admin">
                  <Button
                    variant={user.role === "super-admin" ? "default" : "outline"}
                    className="w-full"
                    disabled={user.role !== "super-admin"}
                  >
                    Super Admin Panel
                  </Button>
                </Link>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Admin & Above</h4>
                <Link href="/klanten">
                  <Button
                    variant={["super-admin", "admin"].includes(user.role) ? "default" : "outline"}
                    className="w-full"
                    disabled={!["super-admin", "admin"].includes(user.role)}
                  >
                    Customer Management
                  </Button>
                </Link>
                <Link href="/beheer/gebruikers">
                  <Button
                    variant={["super-admin", "admin", "customer-admin"].includes(user.role) ? "default" : "outline"}
                    className="w-full"
                    disabled={!["super-admin", "admin", "customer-admin"].includes(user.role)}
                  >
                    User Management
                  </Button>
                </Link>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">All Users</h4>
                <Link href="/dashboard">
                  <Button className="w-full">Dashboard</Button>
                </Link>
                <Link href="/help">
                  <Button variant="outline" className="w-full bg-transparent">
                    Help
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Database Status Details */}
      {dbStatus && (
        <Card>
          <CardHeader>
            <CardTitle>Database Connection Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Status:</span>
                <Badge variant={dbStatus.success ? "default" : "destructive"}>
                  {dbStatus.success ? "Connected" : "Error"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Message:</span>
                <span className="text-sm">{dbStatus.message}</span>
              </div>
              {dbStatus.timestamp && (
                <div className="flex items-center justify-between">
                  <span>Timestamp:</span>
                  <span className="text-sm">{new Date(dbStatus.timestamp).toLocaleString()}</span>
                </div>
              )}
              {dbStatus.error && (
                <div className="flex items-center justify-between">
                  <span>Error:</span>
                  <span className="text-sm text-red-600">{dbStatus.error}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
