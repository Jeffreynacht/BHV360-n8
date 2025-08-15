"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Building, Users, Shield, AlertTriangle, Map, Wifi } from "lucide-react"
import Link from "next/link"

export default function CustomerAdminDashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Building className="h-8 w-8 text-green-600" />
            Organisatie Dashboard
          </h1>
          <p className="text-muted-foreground">Beheer uw organisatie en BHV systemen</p>
        </div>
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          Organisatie Administrator
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totaal Gebruikers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247</div>
            <p className="text-xs text-muted-foreground">+12 deze maand</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">BHV Leden</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">34</div>
            <p className="text-xs text-muted-foreground">14% van totaal</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actieve NFC Tags</CardTitle>
            <Wifi className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">95% operationeel</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Incidenten</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">-2 vs vorige week</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Snelle Acties</CardTitle>
          <CardDescription>Veelgebruikte beheerfuncties</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/beheer/gebruikers">
              <Button variant="outline" className="h-20 w-full flex-col gap-2">
                <Users className="h-6 w-6" />
                <span className="text-xs">Gebruikers</span>
              </Button>
            </Link>
            <Link href="/beheer/voorzieningen">
              <Button variant="outline" className="h-20 w-full flex-col gap-2">
                <Shield className="h-6 w-6" />
                <span className="text-xs">Voorzieningen</span>
              </Button>
            </Link>
            <Link href="/beheer/nfc-tags">
              <Button variant="outline" className="h-20 w-full flex-col gap-2">
                <Wifi className="h-6 w-6" />
                <span className="text-xs">NFC Tags</span>
              </Button>
            </Link>
            <Link href="/beheer/plotkaart-editor">
              <Button variant="outline" className="h-20 w-full flex-col gap-2">
                <Map className="h-6 w-6" />
                <span className="text-xs">Plotkaart Editor</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>BHV Team Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>BHV Leden Aanwezig</span>
                <span>28/34</span>
              </div>
              <Progress value={82} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>EHBO Gecertificeerd</span>
                <span>31/34</span>
              </div>
              <Progress value={91} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Training Up-to-date</span>
                <span>29/34</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recente Activiteit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Nieuwe gebruiker toegevoegd</p>
                  <p className="text-xs text-muted-foreground">Jan Pietersen - Afdeling IT - 30 min geleden</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">NFC tag geconfigureerd</p>
                  <p className="text-xs text-muted-foreground">Verdieping 2 - Brandmelder - 1 uur geleden</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Plotkaart bijgewerkt</p>
                  <p className="text-xs text-muted-foreground">Nieuwe nooduitgang toegevoegd - 2 uur geleden</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
