"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  ArrowLeft,
  Building2,
  Users,
  Euro,
  Calendar,
  Mail,
  Phone,
  Globe,
  CheckCircle,
  XCircle,
  AlertCircle,
  Settings,
  Edit,
} from "lucide-react"

interface Partner {
  id: string
  name: string
  contactPerson: string
  email: string
  phone: string
  status: "active" | "inactive" | "suspended"
  contractType: "basic" | "premium" | "enterprise"
  startDate: string
  commission: number
  monthlyRevenue: number
  totalCustomers: number
  whitelabelDomain?: string
  address: string
  website: string
  notes: string
}

interface Customer {
  id: string
  name: string
  contactPerson: string
  email: string
  status: "active" | "inactive"
  startDate: string
  monthlyValue: number
}

// Mock data - in real app this would come from API
const getPartnerById = (id: string): Partner => ({
  id,
  name: "SafetyFirst Consultancy",
  contactPerson: "Jan de Vries",
  email: "jan@safetyfirst.nl",
  phone: "+31 6 12345678",
  status: "active",
  contractType: "premium",
  startDate: "2024-01-15",
  commission: 25,
  monthlyRevenue: 15000,
  totalCustomers: 23,
  whitelabelDomain: "safetyfirst.bhv360.com",
  address: "Hoofdstraat 123, 1234 AB Amsterdam",
  website: "https://safetyfirst.nl",
  notes: "Zeer actieve partner met goede klantrelaties. Specialiseert in MKB bedrijven.",
})

const getPartnerCustomers = (partnerId: string): Customer[] => [
  {
    id: "1",
    name: "Bakkerij Jansen",
    contactPerson: "Piet Jansen",
    email: "piet@bakkerijjansen.nl",
    status: "active",
    startDate: "2024-02-01",
    monthlyValue: 89,
  },
  {
    id: "2",
    name: "Garage Van der Berg",
    contactPerson: "Marie van der Berg",
    email: "marie@garagevdberg.nl",
    status: "active",
    startDate: "2024-01-20",
    monthlyValue: 156,
  },
  {
    id: "3",
    name: "Restaurant De Gouden Leeuw",
    contactPerson: "Carlos Martinez",
    email: "carlos@goudenleeuw.nl",
    status: "inactive",
    startDate: "2023-12-15",
    monthlyValue: 0,
  },
]

export default function PartnerDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")

  const partner = getPartnerById(params.id)
  const customers = getPartnerCustomers(params.id)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Actief
          </Badge>
        )
      case "inactive":
        return (
          <Badge className="bg-gray-100 text-gray-800">
            <XCircle className="w-3 h-3 mr-1" />
            Inactief
          </Badge>
        )
      case "suspended":
        return (
          <Badge className="bg-red-100 text-red-800">
            <AlertCircle className="w-3 h-3 mr-1" />
            Opgeschort
          </Badge>
        )
    }
  }

  const getContractBadge = (type: string) => {
    switch (type) {
      case "basic":
        return <Badge variant="outline">Basis</Badge>
      case "premium":
        return <Badge className="bg-blue-100 text-blue-800">Premium</Badge>
      case "enterprise":
        return <Badge className="bg-purple-100 text-purple-800">Enterprise</Badge>
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Terug
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{partner.name}</h1>
          <p className="text-muted-foreground">Partner details en beheer</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Edit className="w-4 h-4 mr-2" />
            Bewerken
          </Button>
          <Button variant="outline" onClick={() => router.push(`/super-admin/partners/${partner.id}/settings`)}>
            <Settings className="w-4 h-4 mr-2" />
            Instellingen
          </Button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>{getStatusBadge(partner.status)}</CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maandelijkse Omzet</CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{partner.monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{partner.commission}% commissie</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Klanten</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{partner.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              {customers.filter((c) => c.status === "active").length} actief
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contract</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {getContractBadge(partner.contractType)}
            <p className="text-xs text-muted-foreground mt-1">
              Sinds {new Date(partner.startDate).toLocaleDateString("nl-NL")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overzicht</TabsTrigger>
          <TabsTrigger value="customers">Klanten ({customers.length})</TabsTrigger>
          <TabsTrigger value="revenue">Omzet</TabsTrigger>
          <TabsTrigger value="notes">Notities</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Informatie</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{partner.contactPerson}</p>
                    <p className="text-sm text-muted-foreground">{partner.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <p>{partner.phone}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <p className="text-sm">{partner.address}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <a
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {partner.website}
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>White-label Configuratie</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Domain</p>
                  <p className="text-sm text-muted-foreground">{partner.whitelabelDomain || "Niet geconfigureerd"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Contract Type</p>
                  {getContractBadge(partner.contractType)}
                </div>
                <div>
                  <p className="text-sm font-medium">Commissie</p>
                  <p className="text-sm text-muted-foreground">{partner.commission}%</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => router.push(`/white-label?partner=${partner.id}`)}>
                  <Settings className="w-4 h-4 mr-2" />
                  White-label Configureren
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="customers">
          <Card>
            <CardHeader>
              <CardTitle>Partner Klanten</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Klant</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Start Datum</TableHead>
                    <TableHead>Maandwaarde</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>
                        <div>
                          <div>{customer.contactPerson}</div>
                          <div className="text-sm text-muted-foreground">{customer.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(customer.status)}</TableCell>
                      <TableCell>{new Date(customer.startDate).toLocaleDateString("nl-NL")}</TableCell>
                      <TableCell>€{customer.monthlyValue}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Omzet Overzicht</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold">€{partner.monthlyRevenue.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Deze Maand</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold">
                      €{Math.round((partner.monthlyRevenue * partner.commission) / 100).toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Commissie ({partner.commission}%)</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold">
                      €{Math.round(partner.monthlyRevenue * 12).toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Jaarlijks (geschat)</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle>Partner Notities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm">{partner.notes}</p>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Notities Bewerken
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
