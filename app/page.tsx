"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Database,
  Users,
  Building2,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  ArrowRight,
  Zap,
  Bell,
  MapPin,
} from "lucide-react"
import Link from "next/link"

interface DatabaseStatus {
  connection: {
    success: boolean
    message: string
    timestamp: string
  }
  schema: {
    exists: boolean
    tables: string[]
    message: string
  }
  data: {
    customers: number
    users: number
    message: string
  }
}

export default function HomePage() {
  const [dbStatus, setDbStatus] = useState<DatabaseStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const checkDatabaseStatus = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/test-database")
      const data = await response.json()

      if (response.ok) {
        setDbStatus(data)
      } else {
        setError(data.error || "Database check failed")
      }
    } catch (err) {
      console.error("Database check error:", err)
      setError("Failed to connect to database")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkDatabaseStatus()
  }, [])

  const getStatusIcon = (success: boolean | undefined) => {
    if (success === undefined) return <RefreshCw className="h-4 w-4 animate-spin" />
    return success ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />
  }

  const getStatusBadge = (success: boolean | undefined) => {
    if (success === undefined) return <Badge variant="secondary">Checking...</Badge>
    return success ? (
      <Badge className="bg-green-100 text-green-800">Connected</Badge>
    ) : (
      <Badge variant="destructive">Failed</Badge>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          BHV360 Management System
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Professioneel BHV beheer met real-time monitoring, incident management en compliance rapportage
        </p>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            System Status
            {getStatusBadge(dbStatus?.connection?.success)}
          </CardTitle>
          <CardDescription>Real-time status van database connectie en systeem gezondheid</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>{error}</span>
                <Button variant="outline" size="sm" onClick={checkDatabaseStatus}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Database Connection */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(dbStatus?.connection?.success)}
                <div>
                  <p className="font-medium">Database</p>
                  <p className="text-sm text-muted-foreground">
                    {loading ? "Checking..." : dbStatus?.connection?.message || "Unknown"}
                  </p>
                </div>
              </div>
            </div>

            {/* Schema Status */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(dbStatus?.schema?.exists)}
                <div>
                  <p className="font-medium">Schema</p>
                  <p className="text-sm text-muted-foreground">
                    {loading ? "Checking..." : dbStatus?.schema?.message || "Unknown"}
                  </p>
                </div>
              </div>
            </div>

            {/* Data Status */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(dbStatus?.data ? true : false)}
                <div>
                  <p className="font-medium">Data</p>
                  <p className="text-sm text-muted-foreground">
                    {loading ? "Checking..." : dbStatus?.data?.message || "No data"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {dbStatus?.schema?.tables && dbStatus.schema.tables.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Available Tables:</p>
              <div className="flex flex-wrap gap-2">
                {dbStatus.schema.tables.map((table) => (
                  <Badge key={table} variant="outline">
                    {table}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Klanten</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : dbStatus?.data?.customers || 0}</div>
            <p className="text-xs text-muted-foreground">Actieve organisaties</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gebruikers</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : dbStatus?.data?.users || 0}</div>
            <p className="text-xs text-muted-foreground">BHV medewerkers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gebouwen</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Beheerde locaties</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.9%</div>
            <p className="text-xs text-muted-foreground">Laatste 30 dagen</p>
          </CardContent>
        </Card>
      </div>

      {/* Key Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-500" />
              Multi-channel Alarmering
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Push, SMS, telefoon, e-mail en desktop notificaties met bypass van stille modus
            </p>
            <Link href="/beheer/module-approvals">
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                Configureren <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-500" />
              Scenario-based Alerting
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Voorgeprogrammeerde evacuatie, brand en lone worker scenario's
            </p>
            <Link href="/bhv/plotkaart">
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                Bekijken <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-500" />
              Hardware Triggers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Koppeling met fysieke paniekknoppen, NFC en BMC (ESPA 4.4.4)
            </p>
            <Link href="/beheer/nfc-tags">
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                Beheren <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Snelle Acties</CardTitle>
          <CardDescription>Veelgebruikte functies en beheer opties</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/klanten">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2 bg-transparent">
                <Users className="h-6 w-6" />
                <span className="text-sm">Klanten</span>
              </Button>
            </Link>

            <Link href="/bhv/plotkaart">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2 bg-transparent">
                <MapPin className="h-6 w-6" />
                <span className="text-sm">Plotkaart</span>
              </Button>
            </Link>

            <Link href="/incidenten">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2 bg-transparent">
                <AlertTriangle className="h-6 w-6" />
                <span className="text-sm">Incidenten</span>
              </Button>
            </Link>

            <Link href="/beheer">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2 bg-transparent">
                <Shield className="h-6 w-6" />
                <span className="text-sm">Beheer</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Setup Help */}
      {(!dbStatus?.connection?.success || !dbStatus?.schema?.exists) && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <span>Database setup vereist. Volg de setup instructies om te beginnen.</span>
              <Link href="/database-test">
                <Button variant="outline" size="sm">
                  Setup Guide
                </Button>
              </Link>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
