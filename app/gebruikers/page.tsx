"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { EmailLink } from "@/components/ui/email-link"
import {
  Users,
  Shield,
  UserCheck,
  Building,
  Phone,
  Mail,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff,
  Heart,
  ShipWheelIcon as Wheelchair,
} from "lucide-react"

interface User {
  id: number
  name: string
  email: string
  role: string
  department: string
  phone?: string
  bhv_certified: boolean
  certification_expiry?: string
  last_training?: string
  emergency_contact?: string
  medical_info?: string
  location?: string
  status: "active" | "inactive" | "on_leave"
  is_bhv_team?: boolean
  is_mobility_impaired?: boolean
}

export default function GebruikersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showSensitiveInfo, setShowSensitiveInfo] = useState(false)

  // Demo data
  useEffect(() => {
    const demoUsers: User[] = [
      {
        id: 1,
        name: "Jan Bakker",
        email: "jan.bakker@demobedrijf.nl",
        role: "BHV Coördinator",
        department: "Facilitair",
        phone: "+31 6 12345678",
        bhv_certified: true,
        certification_expiry: "2024-12-15",
        last_training: "2024-06-15",
        emergency_contact: "Marie Bakker - 06 87654321",
        location: "Verdieping 1",
        status: "active",
        is_bhv_team: true,
      },
      {
        id: 2,
        name: "Sandra de Vries",
        email: "sandra.devries@demobedrijf.nl",
        role: "BHV'er",
        department: "HR",
        phone: "+31 6 23456789",
        bhv_certified: true,
        certification_expiry: "2025-03-20",
        last_training: "2024-09-10",
        emergency_contact: "Peter de Vries - 06 76543210",
        location: "Verdieping 2",
        status: "active",
        is_bhv_team: true,
      },
      {
        id: 3,
        name: "Mike Johnson",
        email: "mike.johnson@demobedrijf.nl",
        role: "Medewerker",
        department: "IT",
        phone: "+31 6 34567890",
        bhv_certified: false,
        emergency_contact: "Lisa Johnson - 06 65432109",
        location: "Verdieping 3",
        status: "active",
        medical_info: "Geen bijzonderheden",
      },
      {
        id: 4,
        name: "Lisa van der Berg",
        email: "lisa.vandenberg@demobedrijf.nl",
        role: "Ploegleider",
        department: "Operations",
        phone: "+31 6 45678901",
        bhv_certified: true,
        certification_expiry: "2024-11-30",
        last_training: "2024-08-05",
        emergency_contact: "Tom van der Berg - 06 54321098",
        location: "Verdieping 1",
        status: "active",
        is_bhv_team: true,
      },
      {
        id: 5,
        name: "Ahmed Hassan",
        email: "ahmed.hassan@demobedrijf.nl",
        role: "Medewerker",
        department: "Finance",
        phone: "+31 6 56789012",
        bhv_certified: false,
        emergency_contact: "Fatima Hassan - 06 43210987",
        location: "Verdieping 2",
        status: "active",
        is_mobility_impaired: true,
        medical_info: "Rolstoel gebruiker - speciale evacuatieprocedure",
      },
      {
        id: 6,
        name: "Emma Jansen",
        email: "emma.jansen@demobedrijf.nl",
        role: "BHV'er",
        department: "Marketing",
        phone: "+31 6 67890123",
        bhv_certified: true,
        certification_expiry: "2025-01-15",
        last_training: "2024-07-20",
        emergency_contact: "Piet Jansen - 06 32109876",
        location: "Verdieping 3",
        status: "on_leave",
        is_bhv_team: true,
      },
    ]

    setTimeout(() => {
      setUsers(demoUsers)
      setLoading(false)
    }, 1000)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-red-100 text-red-800"
      case "on_leave":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Actief"
      case "inactive":
        return "Inactief"
      case "on_leave":
        return "Verlof"
      default:
        return "Onbekend"
    }
  }

  const bhvTeam = users.filter((user) => user.is_bhv_team)
  const regularUsers = users.filter((user) => !user.is_bhv_team && !user.is_mobility_impaired)
  const mobilityImpairedUsers = users.filter((user) => user.is_mobility_impaired)

  const stats = {
    total: users.length,
    active: users.filter((u) => u.status === "active").length,
    bhvCertified: users.filter((u) => u.bhv_certified).length,
    onLeave: users.filter((u) => u.status === "on_leave").length,
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Gebruikers laden...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gebruikers Overzicht</h1>
          <p className="text-gray-600 mt-2">Beheer alle gebruikers en hun BHV status</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSensitiveInfo(!showSensitiveInfo)}
            className="flex items-center space-x-2"
          >
            {showSensitiveInfo ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span>{showSensitiveInfo ? "Verberg" : "Toon"} Gevoelige Info</span>
          </Button>
        </div>
      </div>

      {/* Privacy Warning */}
      {showSensitiveInfo && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Privacy Waarschuwing:</strong> Gevoelige informatie zoals medische gegevens en noodcontacten zijn nu
            zichtbaar. Behandel deze informatie vertrouwelijk volgens GDPR richtlijnen.
          </AlertDescription>
        </Alert>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totaal Gebruikers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Alle geregistreerde gebruikers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actieve Gebruikers</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-xs text-muted-foreground">Momenteel actief</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">BHV Gecertificeerd</CardTitle>
            <Shield className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.bhvCertified}</div>
            <p className="text-xs text-muted-foreground">Met geldige certificering</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Met Verlof</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.onLeave}</div>
            <p className="text-xs text-muted-foreground">Tijdelijk afwezig</p>
          </CardContent>
        </Card>
      </div>

      {/* User Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Alle Gebruikers ({users.length})</TabsTrigger>
          <TabsTrigger value="bhv">BHV Team ({bhvTeam.length})</TabsTrigger>
          <TabsTrigger value="regular">Medewerkers ({regularUsers.length})</TabsTrigger>
          <TabsTrigger value="mobility">Mindervaliden ({mobilityImpairedUsers.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4">
            {users.map((user) => (
              <Card key={user.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          {user.is_bhv_team ? (
                            <Shield className="h-6 w-6 text-blue-600" />
                          ) : user.is_mobility_impaired ? (
                            <Wheelchair className="h-6 w-6 text-purple-600" />
                          ) : (
                            <Users className="h-6 w-6 text-gray-600" />
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-lg font-semibold">{user.name}</h3>
                          <Badge className={getStatusColor(user.status)}>{getStatusText(user.status)}</Badge>
                          {user.bhv_certified && (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              <Shield className="h-3 w-3 mr-1" />
                              BHV Gecertificeerd
                            </Badge>
                          )}
                          {user.is_mobility_impaired && (
                            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                              <Heart className="h-3 w-3 mr-1" />
                              Speciale Zorg
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center space-x-1">
                              <Building className="h-4 w-4" />
                              <span>{user.department}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <UserCheck className="h-4 w-4" />
                              <span>{user.role}</span>
                            </span>
                            {user.location && (
                              <span className="flex items-center space-x-1">
                                <MapPin className="h-4 w-4" />
                                <span>{user.location}</span>
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center space-x-1">
                              <Mail className="h-4 w-4" />
                              <EmailLink
                                email={user.email}
                                subject={`Contact met ${user.name} - BHV360`}
                                body={`Beste ${user.name},%0D%0A%0D%0A[Uw bericht hier]%0D%0A%0D%0AMet vriendelijke groet,`}
                                className="text-blue-600 hover:underline"
                              />
                            </span>
                            {user.phone && (
                              <span className="flex items-center space-x-1">
                                <Phone className="h-4 w-4" />
                                <a href={`tel:${user.phone}`} className="text-blue-600 hover:underline">
                                  {user.phone}
                                </a>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {user.bhv_certified && user.certification_expiry && (
                        <div className="text-sm">
                          <span className="text-gray-500">Certificaat verloopt:</span>
                          <div className="font-medium text-orange-600">
                            {new Date(user.certification_expiry).toLocaleDateString("nl-NL")}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Sensitive Information */}
                  {showSensitiveInfo && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        {user.emergency_contact && (
                          <div>
                            <span className="font-medium text-gray-700">Noodcontact:</span>
                            <p className="text-gray-600">{user.emergency_contact}</p>
                          </div>
                        )}
                        {user.medical_info && (
                          <div>
                            <span className="font-medium text-gray-700">Medische info:</span>
                            <p className="text-gray-600">{user.medical_info}</p>
                          </div>
                        )}
                        {user.last_training && (
                          <div>
                            <span className="font-medium text-gray-700">Laatste training:</span>
                            <p className="text-gray-600">{new Date(user.last_training).toLocaleDateString("nl-NL")}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="bhv" className="space-y-4">
          <div className="mb-4">
            <Alert className="border-blue-200 bg-blue-50">
              <Shield className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>BHV Team:</strong> Deze gebruikers hebben BHV certificering en zijn verantwoordelijk voor
                noodsituaties. Voor BHV communicatie kunt u direct contact opnemen.
              </AlertDescription>
            </Alert>
          </div>
          <div className="grid gap-4">
            {bhvTeam.map((user) => (
              <Card key={user.id} className="border-blue-200 bg-blue-50/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Shield className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-lg font-semibold">{user.name}</h3>
                          <Badge className="bg-blue-100 text-blue-800">BHV Team</Badge>
                          <Badge className={getStatusColor(user.status)}>{getStatusText(user.status)}</Badge>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div className="flex items-center space-x-4">
                            <span>
                              {user.department} - {user.role}
                            </span>
                            {user.location && <span>📍 {user.location}</span>}
                          </div>
                          <div className="flex items-center space-x-4">
                            <EmailLink
                              email={user.email}
                              subject={`BHV Communicatie - ${user.name}`}
                              body={`Beste ${user.name},%0D%0A%0D%0ABetreft: BHV gerelateerde communicatie%0D%0A%0D%0A[Uw bericht hier]%0D%0A%0D%0AMet vriendelijke groet,`}
                              className="text-blue-600 hover:underline flex items-center space-x-1"
                            >
                              <Mail className="h-4 w-4" />
                              <span>BHV Contact</span>
                            </EmailLink>
                            {user.phone && (
                              <a
                                href={`tel:${user.phone}`}
                                className="text-blue-600 hover:underline flex items-center space-x-1"
                              >
                                <Phone className="h-4 w-4" />
                                <span>{user.phone}</span>
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    {user.certification_expiry && (
                      <div className="text-right text-sm">
                        <span className="text-gray-500">Certificaat verloopt:</span>
                        <div className="font-medium text-orange-600">
                          {new Date(user.certification_expiry).toLocaleDateString("nl-NL")}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="regular" className="space-y-4">
          <div className="grid gap-4">
            {regularUsers.map((user) => (
              <Card key={user.id}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-semibold">{user.name}</h3>
                        <Badge className={getStatusColor(user.status)}>{getStatusText(user.status)}</Badge>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>
                          {user.department} - {user.role}
                        </div>
                        <div className="flex items-center space-x-4">
                          <EmailLink
                            email={user.email}
                            subject={`Contact met ${user.name}`}
                            body={`Beste ${user.name},%0D%0A%0D%0A[Uw bericht hier]%0D%0A%0D%0AMet vriendelijke groet,`}
                            className="text-blue-600 hover:underline flex items-center space-x-1"
                          >
                            <Mail className="h-4 w-4" />
                            <span>Contact</span>
                          </EmailLink>
                          {user.phone && (
                            <a
                              href={`tel:${user.phone}`}
                              className="text-blue-600 hover:underline flex items-center space-x-1"
                            >
                              <Phone className="h-4 w-4" />
                              <span>{user.phone}</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="mobility" className="space-y-4">
          <div className="mb-4">
            <Alert className="border-purple-200 bg-purple-50">
              <Wheelchair className="h-4 w-4 text-purple-600" />
              <AlertDescription className="text-purple-800">
                <strong>Speciale Zorg Gebruikers:</strong> Deze gebruikers hebben speciale evacuatieprocedures nodig.
                Zorg ervoor dat hun evacuatieplan up-to-date is en bekend bij het BHV team.
              </AlertDescription>
            </Alert>
          </div>
          <div className="grid gap-4">
            {mobilityImpairedUsers.map((user) => (
              <Card key={user.id} className="border-purple-200 bg-purple-50/30">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <Wheelchair className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-semibold">{user.name}</h3>
                        <Badge className="bg-purple-100 text-purple-800">Speciale Zorg</Badge>
                        <Badge className={getStatusColor(user.status)}>{getStatusText(user.status)}</Badge>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>
                          {user.department} - {user.role}
                        </div>
                        {user.location && <div>📍 {user.location}</div>}
                        <div className="flex items-center space-x-4">
                          <EmailLink
                            email={user.email}
                            subject={`Evacuatieplan - ${user.name}`}
                            body={`Beste ${user.name},%0D%0A%0D%0ABetreft: Persoonlijk evacuatieplan en veiligheidsprocedures%0D%0A%0D%0A[Uw bericht hier]%0D%0A%0D%0AMet vriendelijke groet,`}
                            className="text-purple-600 hover:underline flex items-center space-x-1"
                          >
                            <Mail className="h-4 w-4" />
                            <span>Evacuatieplan</span>
                          </EmailLink>
                          {user.phone && (
                            <a
                              href={`tel:${user.phone}`}
                              className="text-purple-600 hover:underline flex items-center space-x-1"
                            >
                              <Phone className="h-4 w-4" />
                              <span>{user.phone}</span>
                            </a>
                          )}
                        </div>
                        {showSensitiveInfo && user.medical_info && (
                          <div className="mt-2 p-2 bg-purple-100 rounded text-purple-800 text-xs">
                            <strong>Medische info:</strong> {user.medical_info}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
