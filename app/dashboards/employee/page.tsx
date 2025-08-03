"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, Map, Bell, HelpCircle, Shield, AlertTriangle, Heart, Phone } from "lucide-react"
import Link from "next/link"

export default function EmployeeDashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <User className="h-8 w-8 text-gray-600" />
            Medewerker Dashboard
          </h1>
          <p className="text-muted-foreground">Uw persoonlijke veiligheidsoverzicht</p>
        </div>
        <Badge variant="secondary" className="bg-gray-100 text-gray-800">
          Medewerker
        </Badge>
      </div>

      {/* Emergency Actions */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-800 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Noodgeval? Klik hier!
          </CardTitle>
          <CardDescription className="text-red-700">
            In geval van nood, gebruik een van onderstaande opties
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="destructive" className="h-16 flex-col gap-2">
              <AlertTriangle className="h-6 w-6" />
              <span>BRAND ALARM</span>
            </Button>
            <Button variant="destructive" className="h-16 flex-col gap-2">
              <Heart className="h-6 w-6" />
              <span>EHBO HULP</span>
            </Button>
            <Button variant="destructive" className="h-16 flex-col gap-2">
              <Phone className="h-6 w-6" />
              <span>112 BELLEN</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Access */}
      <Card>
        <CardHeader>
          <CardTitle>Snelle Toegang</CardTitle>
          <CardDescription>Veelgebruikte functies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/plotkaart">
              <Button variant="outline" className="h-20 w-full flex-col gap-2">
                <Map className="h-6 w-6" />
                <span className="text-xs">Plotkaart</span>
              </Button>
            </Link>
            <Link href="/instellingen">
              <Button variant="outline" className="h-20 w-full flex-col gap-2">
                <User className="h-6 w-6" />
                <span className="text-xs">Mijn Profiel</span>
              </Button>
            </Link>
            <Link href="/notificaties">
              <Button variant="outline" className="h-20 w-full flex-col gap-2">
                <Bell className="h-6 w-6" />
                <span className="text-xs">Meldingen</span>
              </Button>
            </Link>
            <Link href="/help">
              <Button variant="outline" className="h-20 w-full flex-col gap-2">
                <HelpCircle className="h-6 w-6" />
                <span className="text-xs">Help</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Safety Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Veiligheidsinformatie</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4 p-3 bg-green-50 rounded-lg">
              <Shield className="h-8 w-8 text-green-600" />
              <div>
                <p className="font-medium text-green-800">BHV Team Aanwezig</p>
                <p className="text-sm text-green-600">28 BHV'ers zijn vandaag aanwezig</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg">
              <Heart className="h-8 w-8 text-blue-600" />
              <div>
                <p className="font-medium text-blue-800">EHBO Beschikbaar</p>
                <p className="text-sm text-blue-600">12 EHBO'ers zijn beschikbaar</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Belangrijke Mededelingen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Ontruimingsoefening gepland</p>
                  <p className="text-xs text-muted-foreground">Volgende week dinsdag 14:00 - 5 min geleden</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Nieuwe EHBO post geïnstalleerd</p>
                  <p className="text-xs text-muted-foreground">Verdieping 3, bij de lift - 2 uur geleden</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Werkzaamheden brandtrap</p>
                  <p className="text-xs text-muted-foreground">Tijdelijk alternatieve route - 1 dag geleden</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
