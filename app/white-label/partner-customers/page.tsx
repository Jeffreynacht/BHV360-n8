"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Users,
  Building,
  Plus,
  ArrowLeft,
  BarChart3,
  Settings,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  AlertCircle,
} from "lucide-react"

export default function PartnerCustomersPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const partnerId = searchParams.get("id") || "1"
  const partnerName = searchParams.get("name") || "SafetyFirst Consultancy"

  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: "Kantoor Centrum",
      address: "Hoofdstraat 123, Amsterdam",
      users: 45,
      status: "active",
      subscription: "premium",
      startDate: "2024-01-15",
      lastActive: "2024-06-10",
      buildings: 2,
      floors: 8,
      facilities: 120,
      nfcTags: 85,
      contactPerson: "Jan de Vries",
      contactEmail: "jan@kantoorcentrum.nl",
      contactPhone: "06-12345678",
      logo: "/placeholder.svg?height=40&width=120",
    },
    {
      id: 2,
      name: "Medisch Centrum Noord",
      address: "Zorgweg 45, Rotterdam",
      users: 78,
      status: "active",
      subscription: "enterprise",
      startDate: "2024-02-20",
      lastActive: "2024-06-11",
      buildings: 3,
      floors: 12,
      facilities: 230,
      nfcTags: 145,
      contactPerson: "Emma Bakker",
      contactEmail: "e.bakker@mcnoord.nl",
      contactPhone: "06-87654321",
      logo: "/placeholder.svg?height=40&width=120",
    },
    {
      id: 3,
      name: "Techniek Groep BV",
      address: "Industrieweg 78, Eindhoven",
      users: 32,
      status: "pending",
      subscription: "standard",
      startDate: "2024-05-30",
      lastActive: "-",
      buildings: 1,
      floors: 4,
      facilities: 65,
      nfcTags: 40,
      contactPerson: "Pieter Jansen",
      contactEmail: "p.jansen@techniekgroep.nl",
      contactPhone: "06-11223344",
      logo: "/placeholder.svg?height=40&width=120",
    },
  ])

  return (
    <div className="container p-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => router.push("/white-label")} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Terug
        </Button>
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <span className="mr-2">{partnerName}</span>
            <Badge>Partner ID: {partnerId}</Badge>
          </h1>
          <p className="text-muted-foreground">Beheer klanten voor deze white-label partner</p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-2">
          <Card className="p-4 flex items-center space-x-2">
            <Users className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">Totaal klanten</p>
              <p className="text-xl font-bold">{customers.length}</p>
            </div>
          </Card>
          <Card className="p-4 flex items-center space-x-2">
            <Building className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">Totaal gebruikers</p>
              <p className="text-xl font-bold">{customers.reduce((sum, c) => sum + c.users, 0)}</p>
            </div>
          </Card>
          <Card className="p-4 flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-purple-500" />
            <div>
              <p className="text-sm text-muted-foreground">Actieve klanten</p>
              <p className="text-xl font-bold">{customers.filter((c) => c.status === "active").length}</p>
            </div>
          </Card>
        </div>

        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nieuwe Klant
        </Button>
      </div>

      <Tabs defaultValue="customers" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="customers">Klanten</TabsTrigger>
          <TabsTrigger value="settings">Partner Instellingen</TabsTrigger>
          <TabsTrigger value="branding">Partner Branding</TabsTrigger>
        </TabsList>

        <TabsContent value="customers">
          <div className="mb-6 flex justify-between items-center">
            <div className="w-1/3">
              <Input placeholder="Zoek klanten..." />
            </div>
            <div className="flex space-x-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle statussen</SelectItem>
                  <SelectItem value="active">Actief</SelectItem>
                  <SelectItem value="pending">In afwachting</SelectItem>
                  <SelectItem value="inactive">Inactief</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="name">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sorteer op" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Naam</SelectItem>
                  <SelectItem value="users">Aantal gebruikers</SelectItem>
                  <SelectItem value="date">Startdatum</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            {customers.map((customer) => (
              <Card key={customer.id} className="overflow-hidden">
                <div className="flex">
                  <div className="p-6 flex-grow">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <img
                          src={customer.logo || "/placeholder.svg"}
                          alt={`${customer.name} logo`}
                          className="h-10 mr-4 rounded"
                        />
                        <div>
                          <h3 className="text-lg font-medium">{customer.name}</h3>
                          <p className="text-sm text-muted-foreground">{customer.address}</p>
                        </div>
                      </div>
                      <Badge variant={customer.status === "active" ? "default" : "outline"}>
                        {customer.status === "active" ? "Actief" : "In afwachting"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-4 gap-4 mt-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Gebruikers</p>
                        <p className="font-medium">{customer.users}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Gebouwen</p>
                        <p className="font-medium">{customer.buildings}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Verdiepingen</p>
                        <p className="font-medium">{customer.floors}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Voorzieningen</p>
                        <p className="font-medium">{customer.facilities}</p>
                      </div>
                    </div>

                    <div className="flex mt-4 space-x-4">
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>Start: {customer.startDate}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Mail className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>{customer.contactEmail}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>{customer.contactPhone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 flex flex-col justify-between w-48">
                    <div>
                      <p className="text-sm font-medium">Abonnement</p>
                      <Badge variant="outline" className="mt-1">
                        {customer.subscription === "premium"
                          ? "Premium"
                          : customer.subscription === "enterprise"
                            ? "Enterprise"
                            : "Standard"}
                      </Badge>

                      <div className="mt-4">
                        <p className="text-sm font-medium">Status</p>
                        <div className="flex items-center mt-1">
                          {customer.status === "active" ? (
                            <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-amber-500 mr-1" />
                          )}
                          <span className="text-sm">{customer.status === "active" ? "Actief" : "In afwachting"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mt-4">
                      <Button size="sm" className="w-full">
                        Bekijk
                      </Button>
                      <Button size="sm" variant="outline" className="w-full">
                        <Settings className="h-3 w-3 mr-1" />
                        Beheer
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Partner Instellingen</CardTitle>
              <CardDescription>Configureer instellingen voor {partnerName}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Toegangsrechten</h3>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Klanten toevoegen</Label>
                      <p className="text-sm text-muted-foreground">Partner kan zelf klanten toevoegen</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Klanten verwijderen</Label>
                      <p className="text-sm text-muted-foreground">Partner kan klanten verwijderen</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Facturatie beheren</Label>
                      <p className="text-sm text-muted-foreground">Partner kan facturatie inzien en beheren</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Limieten</h3>

                  <div className="space-y-2">
                    <Label>Maximum aantal klanten</Label>
                    <Select defaultValue="unlimited">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10 klanten</SelectItem>
                        <SelectItem value="25">25 klanten</SelectItem>
                        <SelectItem value="50">50 klanten</SelectItem>
                        <SelectItem value="100">100 klanten</SelectItem>
                        <SelectItem value="unlimited">Onbeperkt</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Maximum gebruikers per klant</Label>
                    <Select defaultValue="unlimited">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="25">25 gebruikers</SelectItem>
                        <SelectItem value="50">50 gebruikers</SelectItem>
                        <SelectItem value="100">100 gebruikers</SelectItem>
                        <SelectItem value="250">250 gebruikers</SelectItem>
                        <SelectItem value="unlimited">Onbeperkt</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Toegang tot modules</Label>
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basis modules</SelectItem>
                        <SelectItem value="standard">Standaard modules</SelectItem>
                        <SelectItem value="premium">Premium modules</SelectItem>
                        <SelectItem value="all">Alle modules</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding">
          <Card>
            <CardHeader>
              <CardTitle>Partner Branding</CardTitle>
              <CardDescription>Bekijk en beheer de branding voor {partnerName}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-4">Huidige branding</h3>
                  <div className="border rounded-lg p-6 bg-white">
                    <div className="flex items-center justify-between mb-6">
                      <img src="/placeholder.svg?height=40&width=160" alt="Partner logo" className="h-10" />
                      <Badge variant="outline">White-label Partner</Badge>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Primaire kleur</p>
                        <div className="flex items-center mt-1">
                          <div className="w-6 h-6 rounded-full bg-blue-600 mr-2"></div>
                          <span className="text-sm">#2563eb</span>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground">Secundaire kleur</p>
                        <div className="flex items-center mt-1">
                          <div className="w-6 h-6 rounded-full bg-slate-700 mr-2"></div>
                          <span className="text-sm">#334155</span>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground">Accent kleur</p>
                        <div className="flex items-center mt-1">
                          <div className="w-6 h-6 rounded-full bg-emerald-600 mr-2"></div>
                          <span className="text-sm">#059669</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <p className="text-sm text-muted-foreground">Custom domain</p>
                      <p className="font-medium mt-1">safetyfirst.bhv360.com</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-4">Preview</h3>
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <img src="/placeholder.svg?height=30&width=120" alt="Partner logo" className="h-8 mr-4" />
                        <span className="font-medium">BHV Management Platform</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-white/20"></div>
                        <div className="w-8 h-8 rounded-full bg-white/20"></div>
                      </div>
                    </div>

                    <div className="p-4 bg-white">
                      <div className="flex space-x-2 mb-4">
                        <div className="w-24 h-8 rounded bg-gray-100"></div>
                        <div className="w-24 h-8 rounded bg-gray-100"></div>
                        <div className="w-24 h-8 rounded bg-gray-100"></div>
                      </div>

                      <div className="space-y-2">
                        <div className="h-12 rounded bg-gray-100 w-full"></div>
                        <div className="h-32 rounded bg-gray-100 w-full"></div>
                        <div className="h-12 rounded bg-gray-100 w-full"></div>
                      </div>

                      <div className="mt-4">
                        <Button className="bg-blue-600 hover:bg-blue-700">Voorbeeld Knop</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
