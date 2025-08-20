"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Users, Shield, CheckCircle, Award, ArrowLeft, Phone, MapPin, Calendar } from "lucide-react"
import Link from "next/link"

const bhvTeamData = [
  {
    id: 1,
    name: "Jan van der Berg",
    role: "BHV Coördinator",
    status: "Aanwezig",
    certification: "Geldig tot 15-03-2025",
    location: "Verdieping 2",
    phone: "06-12345678",
    lastTraining: "15-09-2024",
  },
  {
    id: 2,
    name: "Maria Jansen",
    role: "EHBO'er",
    status: "Aanwezig",
    certification: "Geldig tot 22-07-2025",
    location: "Verdieping 1",
    phone: "06-87654321",
    lastTraining: "22-07-2024",
  },
  {
    id: 3,
    name: "Piet Bakker",
    role: "Ontruimingsassistent",
    status: "Afwezig",
    certification: "Verloopt over 30 dagen",
    location: "Niet aanwezig",
    phone: "06-11223344",
    lastTraining: "10-01-2024",
  },
  {
    id: 4,
    name: "Lisa de Vries",
    role: "BHV'er",
    status: "Aanwezig",
    certification: "Geldig tot 08-12-2025",
    location: "Verdieping 3",
    phone: "06-99887766",
    lastTraining: "08-12-2023",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "Aanwezig":
      return "bg-green-100 text-green-800"
    case "Afwezig":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getCertificationColor = (certification: string) => {
  if (certification.includes("Verloopt over")) {
    return "bg-yellow-100 text-yellow-800"
  }
  return "bg-green-100 text-green-800"
}

export default function BHVStatusDemo() {
  const [selectedMember, setSelectedMember] = useState(bhvTeamData[0])

  const presentCount = bhvTeamData.filter((member) => member.status === "Aanwezig").length
  const totalCount = bhvTeamData.length
  const presentPercentage = (presentCount / totalCount) * 100

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Terug naar Home
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">BHV Team Dashboard Demo</h1>
                <p className="text-sm text-gray-500">Complete overzicht van uw BHV team status</p>
              </div>
            </div>
            <Badge className="bg-blue-100 text-blue-800">Demo Modus</Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Totaal BHV Team</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCount}</div>
              <p className="text-xs text-muted-foreground">Gecertificeerde BHV'ers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aanwezig</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{presentCount}</div>
              <p className="text-xs text-muted-foreground">{presentPercentage.toFixed(0)}% van het team</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Certificaten</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Geldig, 1 verloopt binnenkort</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <Shield className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Operationeel</div>
              <p className="text-xs text-muted-foreground">Voldoende dekking</p>
            </CardContent>
          </Card>
        </div>

        {/* Team Presence Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Team Aanwezigheid</CardTitle>
            <CardDescription>Real-time overzicht van BHV team aanwezigheid</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Aanwezigheidspercentage</span>
                <span className="text-sm text-muted-foreground">
                  {presentCount}/{totalCount}
                </span>
              </div>
              <Progress value={presentPercentage} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Minimaal vereist: 75%</span>
                <span className="text-green-600 font-medium">Huidige: {presentPercentage.toFixed(0)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Team List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>BHV Team Leden</CardTitle>
                <CardDescription>Klik op een teamlid voor meer details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bhvTeamData.map((member) => (
                    <div
                      key={member.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                        selectedMember.id === member.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedMember(member)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                            <Users className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{member.name}</h3>
                            <p className="text-sm text-gray-500">{member.role}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(member.status)}>{member.status}</Badge>
                          <Badge className={getCertificationColor(member.certification)}>
                            {member.certification.includes("Verloopt") ? "Verloopt binnenkort" : "Geldig"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Member Details */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Teamlid Details</CardTitle>
                <CardDescription>Gedetailleerde informatie</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Users className="h-8 w-8 text-gray-600" />
                    </div>
                    <h3 className="font-semibold text-lg">{selectedMember.name}</h3>
                    <p className="text-gray-500">{selectedMember.role}</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Shield className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium">Status</p>
                        <Badge className={getStatusColor(selectedMember.status)}>{selectedMember.status}</Badge>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium">Locatie</p>
                        <p className="text-sm text-gray-600">{selectedMember.location}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium">Telefoon</p>
                        <p className="text-sm text-gray-600">{selectedMember.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Award className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium">Certificering</p>
                        <p className="text-sm text-gray-600">{selectedMember.certification}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium">Laatste Training</p>
                        <p className="text-sm text-gray-600">{selectedMember.lastTraining}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Button className="w-full" size="sm">
                      <Phone className="h-4 w-4 mr-2" />
                      Direct Contact
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Demo CTA */}
        <Card className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Indrukwekkend? Dit is nog maar het begin!</h3>
              <p className="text-gray-600 mb-4">
                Ontdek alle BHV360 functies met een gratis 30-dagen trial. Geen creditcard vereist.
              </p>
              <div className="flex justify-center space-x-4">
                <Link href="/login">
                  <Button size="lg">Start Gratis Trial</Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" size="lg">
                    Meer Demo's
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
