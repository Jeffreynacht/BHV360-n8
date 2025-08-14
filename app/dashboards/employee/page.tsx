"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  MapPin,
  AlertTriangle,
  CheckCircle,
  Calendar,
  User,
  Scan,
  FileText,
  UserCheck,
  Heart,
  Shield,
  Clock,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"

export default function EmployeeDashboard() {
  const { user } = useAuth()

  // Extract first name from user name
  const firstName = user?.name?.split(" ")[0] || "Medewerker"

  // Mock data for demonstration
  const mockData = {
    certifications: [
      { name: "BHV Certificaat", status: "Geldig tot maart 2025", valid: true },
      { name: "EHBO Certificaat", status: "Verloopt 15 februari 2024", valid: false },
    ],
    recentActivities: [
      {
        id: 1,
        type: "check-in",
        description: "Ingecheckt voor dienst",
        time: "08:15",
        icon: CheckCircle,
        color: "text-green-600",
      },
      {
        id: 2,
        type: "training",
        description: "BHV training voltooid",
        time: "Gisteren",
        icon: FileText,
        color: "text-blue-600",
      },
      {
        id: 3,
        type: "incident",
        description: "NFC tag gescand - EHBO koffer",
        time: "2 dagen geleden",
        icon: Scan,
        color: "text-purple-600",
      },
    ],
    currentStatus: {
      present: true,
      location: "Hoofdgebouw - Verdieping 2",
      nextTraining: "15 maart 2024",
      emergencyRole: "EHBO Verlener",
    },
  }

  return (
    <div className="p-6 space-y-6">
      {/* Personal Greeting */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Goedemorgen, {firstName}! 👋</h1>
            <p className="text-blue-100 mt-2">Welkom terug bij je BHV dashboard</p>
            <div className="flex items-center mt-3 space-x-2">
              <Badge variant="secondary" className="bg-blue-500 text-white">
                <Shield className="h-3 w-3 mr-1" />
                BHV Medewerker
              </Badge>
              <Badge variant="secondary" className="bg-green-500 text-white">
                <CheckCircle className="h-3 w-3 mr-1" />
                Aanwezig
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <p className="text-blue-100 text-sm">Dienst</p>
            <p className="text-white font-semibold">08:00 - 17:00</p>
          </div>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Aanwezigheid Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aanwezigheid</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Aanwezig</div>
            <p className="text-xs text-muted-foreground">Sinds 08:15</p>
          </CardContent>
        </Card>

        {/* BHV Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">BHV Status</CardTitle>
            <Shield className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">Actief</div>
            <p className="text-xs text-muted-foreground">EHBO Verlener</p>
          </CardContent>
        </Card>

        {/* Certificaat Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certificaten</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">1 Verloopt</div>
            <p className="text-xs text-muted-foreground">EHBO hernieuwing nodig</p>
          </CardContent>
        </Card>

        {/* Volgende Training */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Training</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">15 maart</div>
            <p className="text-xs text-muted-foreground">Herhalingscursus EHBO</p>
          </CardContent>
        </Card>
      </div>

      {/* Snelle Acties */}
      <Card>
        <CardHeader>
          <CardTitle>Snelle Acties</CardTitle>
          <CardDescription>Veelgebruikte BHV functies voor medewerkers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Link href="/nfc-scan">
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2 w-full bg-transparent hover:bg-blue-50 hover:border-blue-200"
              >
                <div className="p-2 bg-blue-100 rounded-full">
                  <Scan className="h-6 w-6 text-blue-600" />
                </div>
                <span className="text-sm font-medium">NFC Scanner</span>
                <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                  Nieuw
                </Badge>
              </Button>
            </Link>
            <Link href="/plotkaart">
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2 w-full bg-transparent hover:bg-green-50 hover:border-green-200"
              >
                <div className="p-2 bg-green-100 rounded-full">
                  <MapPin className="h-6 w-6 text-green-600" />
                </div>
                <span className="text-sm font-medium">Plotkaart</span>
              </Button>
            </Link>
            <Link href="/incidenten">
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2 w-full bg-transparent hover:bg-red-50 hover:border-red-200"
              >
                <div className="p-2 bg-red-100 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <span className="text-sm font-medium">Incident Melden</span>
              </Button>
            </Link>
            <Link href="/bhv-aanwezigheid">
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2 w-full bg-transparent hover:bg-purple-50 hover:border-purple-200"
              >
                <div className="p-2 bg-purple-100 rounded-full">
                  <UserCheck className="h-6 w-6 text-purple-600" />
                </div>
                <span className="text-sm font-medium">Aanwezigheid</span>
              </Button>
            </Link>
            <Link href="/profiel">
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2 w-full bg-transparent hover:bg-gray-50 hover:border-gray-200"
              >
                <div className="p-2 bg-gray-100 rounded-full">
                  <User className="h-6 w-6 text-gray-600" />
                </div>
                <span className="text-sm font-medium">Mijn Profiel</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Certificaten & Recente Activiteit */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Certificaten */}
        <Card>
          <CardHeader>
            <CardTitle>Mijn Certificaten</CardTitle>
            <CardDescription>Overzicht van je BHV certificeringen</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockData.certifications.map((cert, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-4 border rounded-lg ${
                    cert.valid ? "border-green-200 bg-green-50" : "border-orange-200 bg-orange-50"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${cert.valid ? "bg-green-100" : "bg-orange-100"}`}>
                      {cert.valid ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Clock className="h-4 w-4 text-orange-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{cert.name}</h3>
                      <p className="text-xs text-gray-600">{cert.status}</p>
                    </div>
                  </div>
                  <Badge className={cert.valid ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}>
                    {cert.valid ? "Geldig" : "Actie Vereist"}
                  </Badge>
                </div>
              ))}
              <div className="pt-2">
                <Link href="/profiel">
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    Certificaten Beheren
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recente Activiteit */}
        <Card>
          <CardHeader>
            <CardTitle>Recente Activiteit</CardTitle>
            <CardDescription>Je laatste BHV gerelateerde acties</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockData.recentActivities.map((activity) => {
                const IconComponent = activity.icon
                return (
                  <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <IconComponent className={`w-4 h-4 ${activity.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.description}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                )
              })}
              <div className="pt-2">
                <Link href="/help">
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    Meer Activiteiten Bekijken
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Belangrijke Informatie voor BHV Medewerkers */}
      <Card>
        <CardHeader>
          <CardTitle>Belangrijke BHV Informatie</CardTitle>
          <CardDescription>Essentiële informatie voor BHV medewerkers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <h3 className="font-semibold text-red-900">Noodprocedures</h3>
              </div>
              <p className="text-sm text-red-700">
                Bij brand: Activeer brandalarm en evacueer via dichtstbijzijnde nooduitgang. Controleer je sector
                voordat je vertrekt.
              </p>
            </div>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Heart className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold text-green-900">EHBO Posten</h3>
              </div>
              <p className="text-sm text-green-700">
                Hoofdlocatie: Begane grond bij receptie. Backup: Verdieping 1 werkplaats. AED beschikbaar in centrale
                hal.
              </p>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-blue-900">Verzamelpunt</h3>
              </div>
              <p className="text-sm text-blue-700">
                Parkeerplaats voor het hoofdgebouw. Wacht op instructies van BHV coördinator. Tel aanwezigen in je
                sector.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mijn BHV Verantwoordelijkheden */}
      <Card>
        <CardHeader>
          <CardTitle>Mijn BHV Verantwoordelijkheden</CardTitle>
          <CardDescription>Jouw specifieke taken als BHV medewerker</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 flex items-center">
                <Shield className="h-4 w-4 mr-2 text-blue-600" />
                Als EHBO Verlener
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                  Eerste hulp verlenen bij ongevallen
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                  EHBO materiaal controleren
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                  Incidenten documenteren
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                  Collega's instrueren over veiligheid
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2 text-orange-600" />
                Bij Evacuatie
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                  Sector Verdieping 2 controleren
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                  Personen begeleiden naar uitgang
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                  Aanwezigheid controleren bij verzamelpunt
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                  Rapporteren aan BHV coördinator
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
