"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { BHV360BrandHeader } from "@/components/bhv360-brand-header"
import { Eye, EyeOff, Power, PowerOff, Save, Package, TrendingUp, Edit, Building, Settings, BarChart3, Shield, Zap, Crown, Search, Plus, Copy, Download, Upload, XCircle, Clock, CheckCircle, Star } from 'lucide-react'
import { toast } from "@/hooks/use-toast"
import {
  AVAILABLE_MODULES,
  getModuleById,
  getCoreModules,
  getVisibleModules,
  calculateModulePrice,
  type ModuleDefinition,
  type ModuleCategory,
  type ModuleTier,
  type ModulePricing,
  moduleCategories,
  tierDefinitions,
} from "@/lib/modules/module-definitions"
import { Textarea } from "@/components/ui/textarea"
import { ModuleTableComponent } from "@/components/module-table-component"
import { ModuleCard } from "@/components/module-card"

// Force dynamic rendering to avoid static generation issues
export const dynamic = "force-dynamic"

interface ModuleStats {
  totalModules: number
  activeModules: number
  coreModules: number
  betaModules: number
  totalRevenue: number
  averageRating: number
}

export default function SuperAdminModuleManagementPage() {
  const [modules, setModules] = useState<ModuleDefinition[]>(AVAILABLE_MODULES)
  const [filteredModules, setFilteredModules] = useState<ModuleDefinition[]>(AVAILABLE_MODULES)
  const [selectedModule, setSelectedModule] = useState<ModuleDefinition | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [stats, setStats] = useState<ModuleStats>({
    totalModules: 0,
    activeModules: 0,
    coreModules: 0,
    betaModules: 0,
    totalRevenue: 0,
    averageRating: 0,
  })
  const [loading, setLoading] = useState(false)
  const [editingModule, setEditingModule] = useState<ModuleDefinition | null>(null)

  // Safe number formatting helper
  const formatPrice = (price: number): string => {
    try {
      return (price / 100).toFixed(2)
    } catch {
      return "0.00"
    }
  }

  // Calculate stats
  useEffect(() => {
    const totalModules = modules.length
    const activeModules = modules.filter((m) => m.enabled).length
    const coreModules = modules.filter((m) => m.core).length
    const betaModules = modules.filter((m) => m.status === "beta").length
    const totalRevenue = modules.reduce((sum, m) => sum + (m.pricing?.basePrice || 0), 0)
    const averageRating = modules.reduce((sum, m) => sum + m.rating, 0) / totalModules

    setStats({
      totalModules,
      activeModules,
      coreModules,
      betaModules,
      totalRevenue,
      averageRating,
    })
  }, [modules])

  // Filter modules
  useEffect(() => {
    let filtered = modules

    if (searchTerm) {
      filtered = filtered.filter(
        (module) =>
          module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          module.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((module) => module.category === categoryFilter)
    }

    if (statusFilter !== "all") {
      if (statusFilter === "enabled") {
        filtered = filtered.filter((module) => module.enabled)
      } else if (statusFilter === "disabled") {
        filtered = filtered.filter((module) => !module.enabled)
      } else if (statusFilter === "core") {
        filtered = filtered.filter((module) => module.core)
      } else if (statusFilter === "beta") {
        filtered = filtered.filter((module) => module.status === "beta")
      }
    }

    setFilteredModules(filtered)
  }, [modules, searchTerm, categoryFilter, statusFilter])

  const handleToggleModule = (moduleId: string) => {
    setModules((prev) =>
      prev.map((module) => (module.id === moduleId ? { ...module, enabled: !module.enabled } : module)),
    )
  }

  const handleToggleVisibility = (moduleId: string) => {
    setModules((prev) =>
      prev.map((module) => (module.id === moduleId ? { ...module, visible: !module.visible } : module)),
    )
  }

  const handleUpdatePricing = async (moduleId: string, pricing: any) => {
    setLoading(true)
    try {
      const updatedModules = modules.map((module) => (module.id === moduleId ? { ...module, pricing } : module))
      setModules(updatedModules)
      setEditingModule(null)

      toast({
        title: "Prijzen Bijgewerkt",
        description: "De module prijzen zijn succesvol bijgewerkt.",
      })
    } catch (error) {
      toast({
        title: "Fout",
        description: "Er is een fout opgetreden bij het bijwerken van de prijzen.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (module: ModuleDefinition) => {
    if (!module.enabled) {
      return (
        <Badge variant="secondary">
          <XCircle className="w-3 h-3 mr-1" />
          Uitgeschakeld
        </Badge>
      )
    }
    if (module.status === "beta") {
      return (
        <Badge variant="outline">
          <Clock className="w-3 h-3 mr-1" />
          Beta
        </Badge>
      )
    }
    if (module.core) {
      return (
        <Badge variant="default">
          <CheckCircle className="w-3 h-3 mr-1" />
          Core
        </Badge>
      )
    }
    return (
      <Badge variant="outline">
        <CheckCircle className="w-3 h-3 mr-1" />
        Actief
      </Badge>
    )
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "basis":
        return "bg-blue-100 text-blue-800"
      case "geavanceerd":
        return "bg-green-100 text-green-800"
      case "premium":
        return "bg-purple-100 text-purple-800"
      case "enterprise":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <BHV360BrandHeader customerName="Super Admin" userRole="Systeem Beheerder" />

      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">BHV360 Module Beheer</h1>
          <p className="text-gray-600">Beheer modules, prijzen en zichtbaarheid in de BHV360 marketplace</p>
        </div>

        {/* Statistieken Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Totaal</p>
                  <p className="text-2xl font-bold">{stats.totalModules}</p>
                </div>
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Zichtbaar</p>
                  <p className="text-2xl font-bold">{filteredModules.filter((m) => m.visible).length}</p>
                </div>
                <Eye className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Actief</p>
                  <p className="text-2xl font-bold">{stats.activeModules}</p>
                </div>
                <Power className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Live</p>
                  <p className="text-2xl font-bold">{stats.coreModules}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Basis</p>
                  <p className="text-2xl font-bold">{modules.filter((m) => m.category === "basis").length}</p>
                </div>
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Geavanceerd</p>
                  <p className="text-2xl font-bold">{modules.filter((m) => m.category === "geavanceerd").length}</p>
                </div>
                <Zap className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Premium</p>
                  <p className="text-2xl font-bold">{modules.filter((m) => m.category === "premium").length}</p>
                </div>
                <Crown className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Enterprise</p>
                  <p className="text-2xl font-bold">{modules.filter((m) => m.category === "enterprise").length}</p>
                </div>
                <Building className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters en Acties */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Module Filters & Acties</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </Button>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Nieuwe Module
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="search">Zoeken</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Zoek modules..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="category">Categorie</Label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Alle categorieën" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle categorieën</SelectItem>
                    <SelectItem value="basis">Basis</SelectItem>
                    <SelectItem value="geavanceerd">Geavanceerd</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Alle statussen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle statussen</SelectItem>
                    <SelectItem value="enabled">Ingeschakeld</SelectItem>
                    <SelectItem value="disabled">Uitgeschakeld</SelectItem>
                    <SelectItem value="core">Core modules</SelectItem>
                    <SelectItem value="beta">Beta modules</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Prijscalculator</Label>
                <Button variant="outline" className="w-full bg-transparent">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Calculator
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Module Overzicht */}
        <Tabs defaultValue="grid" className="space-y-6">
          <TabsList>
            <TabsTrigger value="grid">Grid Weergave</TabsTrigger>
            <TabsTrigger value="table">Tabel Weergave</TabsTrigger>
            <TabsTrigger value="categories">Per Categorie</TabsTrigger>
          </TabsList>

          <TabsContent value="grid">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredModules.map((module) => (
                <Card key={module.id} className="relative">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{module.name}</CardTitle>
                        <CardDescription className="mt-1">{module.description}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleToggleVisibility(module.id)}>
                          {module.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedModule(module)
                            setIsEditDialogOpen(true)
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Status and Category */}
                    <div className="flex flex-wrap gap-2">
                      {getStatusBadge(module)}
                      <Badge className={getCategoryColor(module.category)}>{module.category}</Badge>
                    </div>

                    {/* Pricing */}
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Prijsmodel</div>
                      <div className="text-lg font-bold text-green-600">
                        €{formatPrice(module.pricing?.basePrice || 0)}
                        <span className="text-sm font-normal text-muted-foreground ml-1">{module.pricingModel}</span>
                      </div>
                    </div>

                    {/* Rating and Reviews */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{module.rating}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">{module.reviews} reviews</div>
                      <div className="text-sm text-muted-foreground">v{module.version}</div>
                    </div>

                    {/* Toggle Switch */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <Label htmlFor={`toggle-${module.id}`} className="text-sm">
                        Module ingeschakeld
                      </Label>
                      <Switch
                        id={`toggle-${module.id}`}
                        checked={module.enabled}
                        onCheckedChange={() => handleToggleModule(module.id)}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="table">
            <ModuleTableComponent
              modules={filteredModules}
              onToggleVisibility={handleToggleVisibility}
              onToggleEnabled={handleToggleModule}
              onEditPricing={(module) => setSelectedModule(module)}
            />
          </TabsContent>

          <TabsContent value="categories">
            <div className="space-y-8">
              {moduleCategories.map((category) => {
                const categoryModules = filteredModules.filter((m) => m.category === category.id)
                if (categoryModules.length === 0) return null

                return (
                  <Card key={category.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        {category.name}
                        <Badge variant="outline">{categoryModules.length}</Badge>
                      </CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categoryModules.map((module) => (
                          <ModuleCard
                            key={module.id}
                            module={module}
                            onToggleVisibility={handleToggleVisibility}
                            onToggleEnabled={handleToggleModule}
                            onEditPricing={(module) => setSelectedModule(module)}
                            calculatorUsers={0}
                            calculatorBuildings={0}
                            compact
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>

        {/* Edit Module Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Module Bewerken</DialogTitle>
              <DialogDescription>Bewerk de instellingen van {selectedModule?.name}</DialogDescription>
            </DialogHeader>
            {selectedModule && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-name">Naam</Label>
                    <Input id="edit-name" defaultValue={selectedModule.name} />
                  </div>
                  <div>
                    <Label htmlFor="edit-version">Versie</Label>
                    <Input id="edit-version" defaultValue={selectedModule.version} />
                  </div>
                </div>

                <div>
                  <Label htmlFor="edit-description">Beschrijving</Label>
                  <Textarea id="edit-description" defaultValue={selectedModule.description} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-category">Categorie</Label>
                    <Select defaultValue={selectedModule.category}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basis">Basis</SelectItem>
                        <SelectItem value="geavanceerd">Geavanceerd</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                        <SelectItem value="enterprise">Enterprise</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit-tier">Tier</Label>
                    <Select defaultValue={selectedModule.tier}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="starter">Starter</SelectItem>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="enterprise">Enterprise</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-price">Basisprijs (in centen)</Label>
                    <Input id="edit-price" type="number" defaultValue={selectedModule.pricing?.basePrice || 0} />
                  </div>
                  <div>
                    <Label htmlFor="edit-setup-fee">Setup fee (in centen)</Label>
                    <Input id="edit-setup-fee" type="number" defaultValue={selectedModule.pricing?.setupFee || 0} />
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="edit-enabled" defaultChecked={selectedModule.enabled} />
                    <Label htmlFor="edit-enabled">Ingeschakeld</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="edit-visible" defaultChecked={selectedModule.visible} />
                    <Label htmlFor="edit-visible">Zichtbaar</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="edit-core" defaultChecked={selectedModule.core} />
                    <Label htmlFor="edit-core">Core module</Label>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Annuleren
                  </Button>
                  <Button onClick={() => setIsEditDialogOpen(false)}>Opslaan</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
