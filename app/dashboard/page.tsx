"use client"

import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Building2, AlertTriangle, Shield, TrendingUp, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Toegang geweigerd</h2>
          <p className="text-gray-600 mb-4">Je moet ingelogd zijn om deze pagina te bekijken.</p>
          <Link href="/login">
            <Button>Inloggen</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welkom terug, {user.name}</p>
        </div>
        <Badge variant="outline" className="text-sm">
          {user.role === "super-admin" ? "Super Admin" : user.role}
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totaal Klanten</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Geen klanten toegevoegd</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actieve Gebruikers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Jij bent de enige gebruiker</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Incidenten</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Geen actieve incidenten</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">BHV Status</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Actief</div>
            <p className="text-xs text-muted-foreground">Systeem operationeel</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Klanten Beheer
            </CardTitle>
            <CardDescription>Voeg nieuwe klanten toe en beheer bestaande accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Link href="/klanten">
                <Button className="w-full bg-transparent" variant="outline">
                  Alle Klanten
                </Button>
              </Link>
              <Link href="/whitelabel-klanten">
                <Button className="w-full bg-transparent" variant="outline">
                  Whitelabel Klanten
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Gebruikers
            </CardTitle>
            <CardDescription>Beheer gebruikersaccounts en permissies</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/beheer/gebruikers">
              <Button className="w-full">Gebruikers Beheren</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Rapportages
            </CardTitle>
            <CardDescription>Bekijk uitgebreide analyses en statistieken</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/beheer/rapportages">
              <Button className="w-full bg-transparent" variant="outline">
                Rapportages Bekijken
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>Systeem Status</CardTitle>
          <CardDescription>Overzicht van de huidige systeemstatus</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Database Verbinding</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">API Services</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Notificaties</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Backup Systeem</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Getting Started */}
      <Card>
        <CardHeader>
          <CardTitle>Aan de slag</CardTitle>
          <CardDescription>Volg deze stappen om je BHV360 platform in te richten</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold">
                1
              </div>
              <div>
                <p className="font-medium">Voeg je eerste klant toe</p>
                <p className="text-sm text-muted-foreground">
                  Begin met het toevoegen van een organisatie aan het platform
                </p>
              </div>
              <Link href="/klanten" className="ml-auto">
                <Button size="sm">Start</Button>
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-300 text-gray-600 text-xs font-bold">
                2
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Configureer gebruikers</p>
                <p className="text-sm text-muted-foreground">Stel gebruikersrollen en permissies in</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-300 text-gray-600 text-xs font-bold">
                3
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Test het systeem</p>
                <p className="text-sm text-muted-foreground">Voer een testrun uit om alles te controleren</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
