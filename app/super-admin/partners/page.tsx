"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Building2,
  Users,
  Euro,
  TrendingUp,
  Search,
  Plus,
  Settings,
  Eye,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react"

import { useRouter } from "next/navigation"

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
}

const mockPartners: Partner[] = [
  {
    id: "1",
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
  },
  {
    id: "2",
    name: "VeiligheidsExperts BV",
    contactPerson: "Maria Janssen",
    email: "maria@veiligheidsexperts.nl",
    phone: "+31 6 87654321",
    status: "active",
    contractType: "enterprise",
    startDate: "2023-08-20",
    commission: 30,
    monthlyRevenue: 28000,
    totalCustomers: 45,
    whitelabelDomain: "veiligheidsexperts.bhv360.com",
  },
  {
    id: "3",
    name: "BHV Solutions",
    contactPerson: "Peter van Dam",
    email: "peter@bhvsolutions.nl",
    phone: "+31 6 11223344",
    status: "inactive",
    contractType: "basic",
    startDate: "2024-03-10",
    commission: 15,
    monthlyRevenue: 5500,
    totalCustomers: 8,
  },
  {
    id: "4",
    name: "Emergency Partners",
    contactPerson: "Lisa Bakker",
    email: "lisa@emergencypartners.nl",
    phone: "+31 6 99887766",
    status: "suspended",
    contractType: "premium",
    startDate: "2023-11-05",
    commission: 25,
    monthlyRevenue: 0,
    totalCustomers: 12,
    whitelabelDomain: "emergency.bhv360.com",
  },
]

export default function PartnersOverzichtPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTab, setSelectedTab] = useState("all")

  const router = useRouter()

  const filteredPartners = mockPartners.filter((partner) => {
    const matchesSearch =
      partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())

    if (selectedTab === "all") return matchesSearch
    return matchesSearch && partner.status === selectedTab
  })

  const getStatusBadge = (status: Partner["status"]) => {
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

  const getContractBadge = (type: Partner["contractType"]) => {
    switch (type) {
      case "basic":
        return <Badge variant="outline">Basis</Badge>
      case "premium":
        return <Badge className="bg-blue-100 text-blue-800">Premium</Badge>
      case "enterprise":
        return <Badge className="bg-purple-100 text-purple-800">Enterprise</Badge>
    }
  }

  const totalRevenue = mockPartners.reduce((sum, partner) => sum + partner.monthlyRevenue, 0)
  const activePartners = mockPartners.filter((p) => p.status === "active").length
  const totalCustomers = mockPartners.reduce((sum, partner) => sum + partner.totalCustomers, 0)

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Partners Overzicht</h1>
          <p className="text-muted-foreground">Beheer en monitor al je business partners</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nieuwe Partner
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actieve Partners</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activePartners}</div>
            <p className="text-xs text-muted-foreground">van {mockPartners.length} totaal</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maandelijkse Omzet</CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12% t.o.v. vorige maand</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totaal Klanten</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">via alle partners</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gem. Commissie</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23%</div>
            <p className="text-xs text-muted-foreground">gewogen gemiddelde</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Zoek partners..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList>
                <TabsTrigger value="all">Alle ({mockPartners.length})</TabsTrigger>
                <TabsTrigger value="active">
                  Actief ({mockPartners.filter((p) => p.status === "active").length})
                </TabsTrigger>
                <TabsTrigger value="inactive">
                  Inactief ({mockPartners.filter((p) => p.status === "inactive").length})
                </TabsTrigger>
                <TabsTrigger value="suspended">
                  Opgeschort ({mockPartners.filter((p) => p.status === "suspended").length})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Partner</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Contract</TableHead>
                <TableHead>Commissie</TableHead>
                <TableHead>Omzet/Maand</TableHead>
                <TableHead>Klanten</TableHead>
                <TableHead>Acties</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPartners.map((partner) => (
                <TableRow key={partner.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{partner.name}</div>
                      {partner.whitelabelDomain && (
                        <div className="text-sm text-muted-foreground">{partner.whitelabelDomain}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{partner.contactPerson}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <Mail className="w-3 h-3" />
                        {partner.email}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <Phone className="w-3 h-3" />
                        {partner.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(partner.status)}</TableCell>
                  <TableCell>
                    <div>
                      {getContractBadge(partner.contractType)}
                      <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <Calendar className="w-3 h-3" />
                        Sinds {new Date(partner.startDate).toLocaleDateString("nl-NL")}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{partner.commission}%</TableCell>
                  <TableCell>€{partner.monthlyRevenue.toLocaleString()}</TableCell>
                  <TableCell>{partner.totalCustomers}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/super-admin/partners/${partner.id}`)}
                        title="Partner details bekijken"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/super-admin/partners/${partner.id}/settings`)}
                        title="Partner instellingen"
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
