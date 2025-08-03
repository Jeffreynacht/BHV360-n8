"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Shield, Users, AlertTriangle, Map, UserCheck, Heart } from "lucide-react"
import Link from "next/link"

export default function BHVCoordinatorDashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8 text-red-600" />
            BHV Coördinator Dashboard
          </h1>
          <p className="text-muted-foreground">Overzicht van uw BHV team en veiligheid</p>
        </div>
        <Badge variant="secondary" className="bg-red-100 text-red-800">
          BHV Coördinator
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">BHV Team</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">34</div>
            <p className="text-xs text-muted-foreground">28 aanwezig vandaag</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actieve Incidenten</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Alles onder controle</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Training Compliance</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">91%</div>
            <p className="text-xs text-muted-foreground">31/34 up-to-date</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">EHBO Voorraad</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">3 items laag</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Snelle Acties</CardTitle>
          <CardDescription>Belangrijke BHV functies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/bhv/plotkaart">
              <Button variant="outline" className="h-20 w-full flex-col gap-2">
                <Map className="h-6 w-6" />
                <span className="text-xs">Plotkaart</span>
              </Button>
            </Link>
            <Link href="/incidenten">
              <Button variant="outline" className="h-20 w-full flex-col gap-2">
                <AlertTriangle className="h-6 w-6" />
                <span className="text-xs">Incidenten</span>
              </Button>
            </Link>
            <Link href="/bhv-aanwezigheid">
              <Button variant="outline" className="h-20 w-full flex-col gap-2">
                <Users className="h-6 w-6" />
                <span className="text-xs">Aanwezigheid</span>
              </Button>
            </Link>
            <Link href="/ehbo-voorraad">
              <Button variant="outline" className="h-20 w-full flex-col gap-2">
                <Heart className="h-6 w-6" />
                <span className="text-xs">EHBO Voorraad</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Team Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Team Aanwezigheid</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>BHV Leden</span>
                <span>28/34 (82%)</span>
              </div>
              <Progress value={82} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>EHBO Leden</span>
                <span>12/15 (80%)</span>
              </div>
              <Progress value={80} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Ontruimers</span>
                <span>8/10 (80%)</span>
              </div>
              <Progress value={80} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recente BHV Activiteit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Training voltooid</p>
                  <p className="text-xs text-muted-foreground">Marie Jansen - EHBO cursus - 2 uur geleden</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Incident afgehandeld</p>
                  <p className="text-xs text-muted-foreground">Kleine verwonding - Verdieping 2 - 4 uur geleden</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">EHBO voorraad aangevuld</p>
                  <p className="text-xs text-muted-foreground">Verbanddoos verdieping 1 - 6 uur geleden</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
