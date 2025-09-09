"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Settings,
  Plus,
  Search,
  Package,
  Users,
  DollarSign,
  Activity,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Edit,
  Download,
  Upload,
  Star,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Module {
  id: string
  name: string
  description: string
  category: "core" | "premium" | "enterprise" | "addon"
  status: "active" | "inactive" | "deprecated" | "development"
  version: string
  price: number
  customers: number
  rating: number
  downloads: number
  lastUpdated: string
  features: string[]
  dependencies: string[]
  compatibility: string[]
}

export default function ModuleManagementPage() {
  const [modules, setModules] = useState<Module[]>([
    {
      id: "bhv-dashboard",
      name: "BHV Dashboard",
      description: "Complete BHV administratie met certificering tracking en team overzicht",
      category: "core",
      status: "active",
      version: "2.1.0",
      price: 39,
      customers: 245,
      rating: 4.8,
      downloads: 1250,
      lastUpdated: "2024-01-10T10:00:00Z",
      features: ["Certificaat tracking", "Team beheer", "Rapportages", "Dashboard analytics"],
      dependencies: ["user-management", "notifications"],
      compatibility: ["web", "mobile", "tablet"],
    },
    {
      id: "plotkaart-editor",
      name: "Interactieve Plotkaarten",
      description: "Digitale plattegronden met real-time status en evacuatieroutes",
      category: "core",
      status: "active",
      version: "1.8.2",
      price: 29,
      customers: 189,
      rating: 4.6,
      downloads: 890,
      lastUpdated: "2024-01-08T14:30:00Z",
      features: ["Drag & drop editor", "Real-time updates", "Mobile responsive", "Export functie"],
      dependencies: ["file-storage"],
      compatibility: ["web", "mobile"],
    },
    {
      id: "incident-management",
      name: "Incident Management",
      description: "Professioneel beheer van incidenten van melding tot afhandeling",
      category: "premium",
      status: "active",
      version: "3.0.1",
      price: 49,
      customers: 156,
      rating: 4.9,
      downloads: 720,
      lastUpdated: "2024-01-12T09:15:00Z",
      features: ["Workflow automation", "Real-time notifications", "Rapportage", "Escalatie procedures"],
      dependencies: ["notifications", "user-management"],
      compatibility: ["web", "mobile", "tablet"],
    },
    {
      id: "visitor-registration",
      name: "Bezoeker Registratie",
      description: "Professionele bezoeker check-in systeem met badge printing",
      category: "addon",
      status: "active",
      version: "1.5.0",
      price: 35,
      customers: 98,
      rating: 4.4,
      downloads: 450,
      lastUpdated: "2024-01-05T16:20:00Z",
      features: ["QR code scanning", "Badge printing", "Host notifications", "Visitor analytics"],
      dependencies: ["notifications"],
      compatibility: ["web", "tablet"],
    },
    {
      id: "analytics-reporting",
      name: "Analytics & Rapportage",
      description: "Uitgebreide analytics en compliance rapportage met export functionaliteit",
      category: "premium",
      status: "active",
      version: "2.3.1",
      price: 25,
      customers: 134,
      rating: 4.7,
      downloads: 680,
      lastUpdated: "2024-01-09T11:45:00Z",
      features: ["Custom dashboards", "Scheduled reports", "Data export", "Compliance tracking"],
      dependencies: ["data-warehouse"],
      compatibility: ["web"],
    },
    {
      id: "mobile-app",
      name: "Mobiele App",
      description: "Complete mobiele toegang voor BHV'ers met offline functionaliteit",
      category: "core",
      status: "development",
      version: "0.9.0-beta",
      price: 19,
      customers: 45,
      rating: 4.2,
      downloads: 180,
      lastUpdated: "2024-01-14T13:00:00Z",
      features: ["Offline sync", "Push notifications", "Camera integration", "GPS tracking"],
      dependencies: ["sync-service", "notifications"],
      compatibility: ["ios", "android"],
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isNewModuleOpen, setIsNewModuleOpen] = useState(false)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "inactive":
        return <XCircle className="h-4 w-4 text-gray-500" />
      case "deprecated":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "development":
        return <Activity className="h-4 w-4 text-blue-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "core":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "premium":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "enterprise":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "addon":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const filteredModules = modules.filter((module) => {
    const matchesSearch =
      module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || module.category === categoryFilter
    const matchesStatus = statusFilter === "all" || module.status === statusFilter

    return matchesSearch && matchesCategory && matchesStatus
  })

  const totalRevenue = modules.reduce((sum, module) => sum + module.price * module.customers, 0)
  const totalCustomers = modules.reduce((sum, module) => sum + module.customers, 0)
  const averageRating = modules.reduce((sum, module) => sum + module.rating, 0) / modules.length

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Package className="h-8 w-8 text-blue-600 mr-3" />
                Module Management
              </h1>
              <p className="text-gray-600 mt-2">Beheer alle modules, prijzen en functionaliteiten van het platform</p>
            </div>

            <div className="flex space-x-2">
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
              <Dialog open={isNewModuleOpen} onOpenChange={setIsNewModuleOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Nieuwe Module
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Nieuwe Module Toevoegen</DialogTitle>
                    <DialogDescription>Configureer een nieuwe module voor het BHV360 platform</DialogDescription>
                  </DialogHeader>

                  <Tabs defaultValue="basic" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="basic">Basis Info</TabsTrigger>
                      <TabsTrigger value="features">Features</TabsTrigger>
                      <TabsTrigger value="pricing">Prijzen</TabsTrigger>
                      <TabsTrigger value="technical">Technisch</TabsTrigger>
                    </TabsList>

                    <TabsContent value="basic" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Module Naam *</Label>
                          <Input id="name" placeholder="Bijv. BHV Dashboard" />
                        </div>
                        <div>
                          <Label htmlFor="version">Versie *</Label>
                          <Input id="version" placeholder="1.0.0" />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="description">Beschrijving *</Label>
                        <Textarea
                          id="description"
                          placeholder="Korte beschrijving van de module functionaliteit..."
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="category">Categorie *</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecteer categorie" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="core">Core</SelectItem>
                              <SelectItem value="premium">Premium</SelectItem>
                              <SelectItem value="enterprise">Enterprise</SelectItem>
                              <SelectItem value="addon">Add-on</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="status">Status *</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecteer status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="development">Development</SelectItem>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                              <SelectItem value="deprecated">Deprecated</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="features" className="space-y-4">
                      <div>
                        <Label>Hoofdfuncties</Label>
                        <div className="space-y-2 mt-2">
                          <Input placeholder="Feature 1" />
                          <Input placeholder="Feature 2" />
                          <Input placeholder="Feature 3" />
                          <Button variant="outline" size="sm">
                            <Plus className="h-4 w-4 mr-1" />
                            Meer Features
                          </Button>
                        </div>
                      </div>

                      <div>
                        <Label>Compatibiliteit</Label>
                        <div className="flex space-x-4 mt-2">
                          <div className="flex items-center space-x-2">
                            <Switch id="web" />
                            <Label htmlFor="web">Web</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch id="mobile" />
                            <Label htmlFor="mobile">Mobile</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch id="tablet" />
                            <Label htmlFor="tablet">Tablet</Label>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="pricing" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="price">Maandelijkse Prijs (€) *</Label>
                          <Input id="price" type="number" placeholder="29" />
                        </div>
                        <div>
                          <Label htmlFor="setup-fee">Setup Kosten (€)</Label>
                          <Input id="setup-fee" type="number" placeholder="0" />
                        </div>
                      </div>

                      <div>
                        <Label>Prijsmodel</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecteer prijsmodel" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fixed">Vast bedrag</SelectItem>
                            <SelectItem value="per-user">Per gebruiker</SelectItem>
                            <SelectItem value="per-location">Per locatie</SelectItem>
                            <SelectItem value="usage-based">Op basis van gebruik</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TabsContent>

                    <TabsContent value="technical" className="space-y-4">
                      <div>
                        <Label>Afhankelijkheden</Label>
                        <Textarea placeholder="Lijst van module afhankelijkheden..." rows={3} />
                      </div>

                      <div>
                        <Label>API Endpoints</Label>
                        <Textarea placeholder="Lijst van API endpoints die deze module gebruikt..." rows={3} />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="min-version">Min. Platform Versie</Label>
                          <Input id="min-version" placeholder="2.0.0" />
                        </div>
                        <div>
                          <Label htmlFor="max-version">Max. Platform Versie</Label>
                          <Input id="max-version" placeholder="3.0.0" />
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="flex justify-end space-x-2 pt-4 border-t">
                    <Button variant="outline" onClick={() => setIsNewModuleOpen(false)}>
                      Annuleren
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700">Module Opslaan</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Totaal Modules</p>
                    <p className="text-2xl font-bold text-gray-900">{modules.length}</p>
                  </div>
                  <Package className="h-8 w-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Totaal Klanten</p>
                    <p className="text-2xl font-bold text-blue-600">{totalCustomers}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Maandelijkse Omzet</p>
                    <p className="text-2xl font-bold text-green-600">€{totalRevenue.toLocaleString()}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Gem. Rating</p>
                    <p className="text-2xl font-bold text-yellow-600">{averageRating.toFixed(1)}</p>
                  </div>
                  <Star className="h-8 w-8 text-yellow-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Zoek modules..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Categorie filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle categorieën</SelectItem>
                  <SelectItem value="core">Core</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                  <SelectItem value="addon">Add-on</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Status filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle statussen</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="development">Development</SelectItem>
                  <SelectItem value="deprecated">Deprecated</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((module) => (
            <Card key={module.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <CardTitle className="text-lg">{module.name}</CardTitle>
                      <Badge className={getCategoryColor(module.category)}>{module.category}</Badge>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      {getStatusIcon(module.status)}
                      <span className="text-sm text-gray-600 capitalize">{module.status}</span>
                      <span className="text-sm text-gray-400">v{module.version}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">€{module.price}</div>
                    <div className="text-xs text-gray-500">/maand</div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <CardDescription className="text-sm">{module.description}</CardDescription>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold text-blue-600">{module.customers}</div>
                    <div className="text-xs text-gray-500">Klanten</div>
                  </div>
                  <div>
                    <div className="flex items-center justify-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-lg font-semibold">{module.rating}</span>
                    </div>
                    <div className="text-xs text-gray-500">Rating</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-green-600">{module.downloads}</div>
                    <div className="text-xs text-gray-500">Downloads</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-700">Features:</div>
                  <div className="flex flex-wrap gap-1">
                    {module.features.slice(0, 3).map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {module.features.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{module.features.length - 3} meer
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t">
                  <div className="text-xs text-gray-500">
                    Bijgewerkt: {new Date(module.lastUpdated).toLocaleDateString("nl-NL")}
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredModules.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Geen modules gevonden</h3>
              <p className="text-gray-600">Er zijn geen modules die voldoen aan de huidige filters.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
