"use client"

import { useState } from "react"
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
import {
  Eye,
  EyeOff,
  Power,
  PowerOff,
  Save,
  Package,
  TrendingUp,
  Edit,
  Building,
  Settings,
  BarChart3,
  Shield,
  Zap,
  Crown,
  Search,
  Plus,
  Copy,
  Download,
  Upload,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import {
  moduleDefinitions,
  moduleCategories,
  tierDefinitions,
  calculateModulePrice,
  type ModuleDefinition,
} from "@/lib/modules/module-definitions"

export default function SuperAdminModuleManagementPage() {
  const [modules, setModules] = useState<ModuleDefinition[]>(moduleDefinitions)
  const [editingModule, setEditingModule] = useState<ModuleDefinition | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedTier, setSelectedTier] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [showPricingCalculator, setShowPricingCalculator] = useState(false)
  const [calculatorUsers, setCalculatorUsers] = useState(25)
  const [calculatorBuildings, setCalculatorBuildings] = useState(2)

  const handleToggleVisibility = async (moduleId: string) => {
    setLoading(true)
    try {
      const updatedModules = modules.map((module) =>
        module.id === moduleId ? { ...module, visible: !module.visible } : module,
      )
      setModules(updatedModules)

      toast({
        title: "Module Zichtbaarheid Bijgewerkt",
        description: `Module is nu ${updatedModules.find((m) => m.id === moduleId)?.visible ? "zichtbaar" : "verborgen"} in de marketplace.`,
      })
    } catch (error) {
      toast({
        title: "Fout",
        description: "Er is een fout opgetreden bij het bijwerken van de module.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleToggleEnabled = async (moduleId: string) => {
    setLoading(true)
    try {
      const updatedModules = modules.map((module) =>
        module.id === moduleId ? { ...module, enabled: !module.enabled } : module,
      )
      setModules(updatedModules)

      toast({
        title: "Module Status Bijgewerkt",
        description: `Module is nu ${updatedModules.find((m) => m.id === moduleId)?.enabled ? "ingeschakeld" : "uitgeschakeld"}.`,
      })
    } catch (error) {
      toast({
        title: "Fout",
        description: "Er is een fout opgetreden bij het bijwerken van de module.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: "EUR",
    }).format(price / 100) // Convert from cents to euros
  }

  const getModuleStats = () => {
    return {
      total: modules.length,
      visible: modules.filter((m) => m.visible).length,
      enabled: modules.filter((m) => m.enabled).length,
      implemented: modules.filter((m) => m.implemented).length,
      basis: modules.filter((m) => m.category === "basis").length,
      geavanceerd: modules.filter((m) => m.category === "geavanceerd").length,
      premium: modules.filter((m) => m.category === "premium").length,
      enterprise: modules.filter((m) => m.category === "enterprise").length,
    }
  }

  const filteredModules = modules.filter((module) => {
    const matchesCategory = selectedCategory === "all" || module.category === selectedCategory
    const matchesTier = selectedTier === "all" || module.tier === selectedTier
    const matchesSearch =
      searchTerm === "" ||
      module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.description.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesCategory && matchesTier && matchesSearch
  })

  const stats = getModuleStats()

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "basis":
        return <Shield className="h-4 w-4" />
      case "geavanceerd":
        return <Zap className="h-4 w-4" />
      case "premium":
        return <Crown className="h-4 w-4" />
      case "enterprise":
        return <Building className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "basis":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "geavanceerd":
        return "bg-green-100 text-green-800 border-green-200"
      case "premium":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "enterprise":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
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
                  <p className="text-2xl font-bold">{stats.total}</p>
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
                  <p className="text-2xl font-bold">{stats.visible}</p>
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
                  <p className="text-2xl font-bold">{stats.enabled}</p>
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
                  <p className="text-2xl font-bold">{stats.implemented}</p>
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
                  <p className="text-2xl font-bold">{stats.basis}</p>
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
                  <p className="text-2xl font-bold">{stats.geavanceerd}</p>
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
                  <p className="text-2xl font-bold">{stats.premium}</p>
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
                  <p className="text-2xl font-bold">{stats.enterprise}</p>
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
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Alle categorieën" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle categorieën</SelectItem>
                    {moduleCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="tier">Tier</Label>
                <Select value={selectedTier} onValueChange={setSelectedTier}>
                  <SelectTrigger>
                    <SelectValue placeholder="Alle tiers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle tiers</SelectItem>
                    {tierDefinitions.map((tier) => (
                      <SelectItem key={tier.id} value={tier.id}>
                        {tier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Prijscalculator</Label>
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => setShowPricingCalculator(true)}
                >
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
                <ModuleCard
                  key={module.id}
                  module={module}
                  onToggleVisibility={handleToggleVisibility}
                  onToggleEnabled={handleToggleEnabled}
                  onEditPricing={(module) => setEditingModule(module)}
                  loading={loading}
                  calculatorUsers={calculatorUsers}
                  calculatorBuildings={calculatorBuildings}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="table">
            <ModuleTable
              modules={filteredModules}
              onToggleVisibility={handleToggleVisibility}
              onToggleEnabled={handleToggleEnabled}
              onEditPricing={(module) => setEditingModule(module)}
              loading={loading}
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
                        {getCategoryIcon(category.id)}
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
                            onToggleEnabled={handleToggleEnabled}
                            onEditPricing={(module) => setEditingModule(module)}
                            loading={loading}
                            calculatorUsers={calculatorUsers}
                            calculatorBuildings={calculatorBuildings}
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

        {/* Pricing Editor Dialog */}
        {editingModule && (
          <Dialog open={!!editingModule} onOpenChange={() => setEditingModule(null)}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Prijzen Bewerken - {editingModule.name}</DialogTitle>
                <DialogDescription>Pas de prijzen en pricing model aan voor deze module</DialogDescription>
              </DialogHeader>
              <PricingEditor
                module={editingModule}
                onSave={(pricing) => handleUpdatePricing(editingModule.id, pricing)}
                onCancel={() => setEditingModule(null)}
              />
            </DialogContent>
          </Dialog>
        )}

        {/* Pricing Calculator Dialog */}
        <Dialog open={showPricingCalculator} onOpenChange={setShowPricingCalculator}>
          <DialogContent className="max-w-6xl">
            <DialogHeader>
              <DialogTitle>Prijscalculator - Alle Modules</DialogTitle>
              <DialogDescription>Bereken de totale kosten voor verschillende scenario's</DialogDescription>
            </DialogHeader>
            <PricingCalculator
              modules={modules.filter((m) => m.visible && m.enabled)}
              users={calculatorUsers}
              buildings={calculatorBuildings}
              onUsersChange={setCalculatorUsers}
              onBuildingsChange={setCalculatorBuildings}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

// Module Card Component
function ModuleCard({
  module,
  onToggleVisibility,
  onToggleEnabled,
  onEditPricing,
  loading,
  calculatorUsers,
  calculatorBuildings,
  compact = false,
}: {
  module: ModuleDefinition
  onToggleVisibility: (id: string) => void
  onToggleEnabled: (id: string) => void
  onEditPricing: (module: ModuleDefinition) => void
  loading: boolean
  calculatorUsers: number
  calculatorBuildings: number
  compact?: boolean
}) {
  const priceInfo = calculateModulePrice(module, calculatorUsers, calculatorBuildings)

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "basis":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "geavanceerd":
        return "bg-green-100 text-green-800 border-green-200"
      case "premium":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "enterprise":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <Card className={`${compact ? "h-auto" : "h-full"} transition-all duration-200 hover:shadow-md`}>
      <CardHeader className={compact ? "pb-3" : ""}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className={`${compact ? "text-base" : "text-lg"} mb-2 flex items-center gap-2`}>
              {module.name}
              {!module.implemented && (
                <Badge variant="outline" className="text-xs">
                  In Ontwikkeling
                </Badge>
              )}
            </CardTitle>
            <div className="flex gap-2 mb-2">
              <Badge className={getCategoryColor(module.category)}>{module.category}</Badge>
              <Badge variant="outline">{module.tier}</Badge>
              {module.status === "beta" && <Badge variant="secondary">Beta</Badge>}
            </div>
            {!compact && <CardDescription className="text-sm">{module.description}</CardDescription>}
          </div>
          <div className="flex items-center gap-2">
            {module.visible ? <Eye className="h-4 w-4 text-green-600" /> : <EyeOff className="h-4 w-4 text-gray-400" />}
            {module.enabled ? (
              <Power className="h-4 w-4 text-green-600" />
            ) : (
              <PowerOff className="h-4 w-4 text-gray-400" />
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className={compact ? "pt-0" : ""}>
        {/* Prijsinformatie */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-lg text-blue-600">€{priceInfo.price.toFixed(2)}/maand</span>
            <Badge variant="outline">{priceInfo.model}</Badge>
          </div>
          <p className="text-xs text-gray-600">{priceInfo.explanation}</p>

          {module.pricing.setupFee && (
            <p className="text-xs text-orange-600 mt-1">+ €{(module.pricing.setupFee / 100).toFixed(2)} setup fee</p>
          )}
        </div>

        {!compact && (
          <>
            {/* Features */}
            <div className="mb-4">
              <h4 className="font-semibold text-sm mb-2">Belangrijkste features:</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                {module.features.slice(0, 4).map((feature, index) => (
                  <li key={index} className="flex items-center gap-1">
                    <div className="w-1 h-1 bg-blue-600 rounded-full" />
                    {feature}
                  </li>
                ))}
                {module.features.length > 4 && <li className="text-gray-500">+{module.features.length - 4} meer...</li>}
              </ul>
            </div>

            {/* Stats */}
            <div className="mb-4 flex items-center gap-4 text-xs text-gray-500">
              <span>
                ★ {module.rating} ({module.reviews})
              </span>
              <span>Populariteit: {module.popularity}%</span>
              <span>v{module.version}</span>
            </div>
          </>
        )}

        {/* Acties */}
        <div className="flex gap-2">
          <Button onClick={() => onEditPricing(module)} variant="outline" size="sm" className="flex-1">
            <Edit className="h-4 w-4 mr-1" />
            Prijzen
          </Button>

          <div className="flex items-center gap-1">
            <Switch
              checked={module.visible}
              onCheckedChange={() => onToggleVisibility(module.id)}
              disabled={loading}
              size="sm"
            />
            <Switch
              checked={module.enabled}
              onCheckedChange={() => onToggleEnabled(module.id)}
              disabled={loading}
              size="sm"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Module Table Component
function ModuleTable({
  modules,
  onToggleVisibility,
  onToggleEnabled,
  onEditPricing,
  loading,
}: {
  modules: ModuleDefinition[]
  onToggleVisibility: (id: string) => void
  onToggleEnabled: (id: string) => void
  onEditPricing: (module: ModuleDefinition) => void
  loading: boolean
}) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4 font-semibold">Module</th>
                <th className="text-left p-4 font-semibold">Categorie</th>
                <th className="text-left p-4 font-semibold">Pricing</th>
                <th className="text-left p-4 font-semibold">Status</th>
                <th className="text-left p-4 font-semibold">Populariteit</th>
                <th className="text-left p-4 font-semibold">Acties</th>
              </tr>
            </thead>
            <tbody>
              {modules.map((module) => (
                <tr key={module.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <div>
                      <h4 className="font-semibold">{module.name}</h4>
                      <p className="text-sm text-gray-600">{module.description}</p>
                      <div className="flex gap-1 mt-1">
                        {!module.implemented && (
                          <Badge variant="outline" className="text-xs">
                            Dev
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          v{module.version}
                        </Badge>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge
                      className={
                        module.category === "basis"
                          ? "bg-blue-100 text-blue-800"
                          : module.category === "geavanceerd"
                            ? "bg-green-100 text-green-800"
                            : module.category === "premium"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-orange-100 text-orange-800"
                      }
                    >
                      {module.category}
                    </Badge>
                    <div className="text-xs text-gray-500 mt-1">{module.tier}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm">
                      <div className="font-semibold">€{(module.pricing.basePrice / 100).toFixed(2)}/maand</div>
                      <div className="text-gray-500">{module.pricingModel}</div>
                      {module.pricing.setupFee && (
                        <div className="text-xs text-orange-600">
                          +€{(module.pricing.setupFee / 100).toFixed(2)} setup
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {module.visible ? (
                          <Eye className="h-4 w-4 text-green-600" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        )}
                        <Switch
                          checked={module.visible}
                          onCheckedChange={() => onToggleVisibility(module.id)}
                          disabled={loading}
                          size="sm"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        {module.enabled ? (
                          <Power className="h-4 w-4 text-green-600" />
                        ) : (
                          <PowerOff className="h-4 w-4 text-gray-400" />
                        )}
                        <Switch
                          checked={module.enabled}
                          onCheckedChange={() => onToggleEnabled(module.id)}
                          disabled={loading}
                          size="sm"
                        />
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm">
                      <div className="flex items-center gap-1">
                        <span>★ {module.rating}</span>
                        <span className="text-gray-500">({module.reviews})</span>
                      </div>
                      <div className="text-xs text-gray-500">{module.popularity}% populariteit</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Button onClick={() => onEditPricing(module)} variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

// Pricing Editor Component
function PricingEditor({
  module,
  onSave,
  onCancel,
}: {
  module: ModuleDefinition
  onSave: (pricing: any) => void
  onCancel: () => void
}) {
  const [pricing, setPricing] = useState(module.pricing)
  const [pricingType, setPricingType] = useState(module.pricing.type)

  const handleSave = () => {
    onSave({ ...pricing, type: pricingType })
  }

  const handlePricingTypeChange = (newType: string) => {
    setPricingType(newType as any)
    // Reset pricing when type changes
    setPricing({
      ...pricing,
      type: newType as any,
      basePrice: 0,
      tierPricing: undefined,
    })
  }

  return (
    <div className="space-y-6">
      {/* Pricing Type Selection */}
      <div>
        <Label htmlFor="pricingType">Pricing Model</Label>
        <Select value={pricingType} onValueChange={handlePricingTypeChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="per_user">Per Gebruiker</SelectItem>
            <SelectItem value="per_building">Per Gebouw</SelectItem>
            <SelectItem value="per_customer">Per Organisatie</SelectItem>
            <SelectItem value="fixed">Vaste Prijs</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Base Price */}
      <div>
        <Label htmlFor="basePrice">Basis Prijs (in euro centen)</Label>
        <Input
          id="basePrice"
          type="number"
          value={pricing.basePrice}
          onChange={(e) => setPricing({ ...pricing, basePrice: Number(e.target.value) || 0 })}
          placeholder="Bijvoorbeeld: 850 voor €8.50"
        />
        <p className="text-xs text-gray-500 mt-1">
          Huidige prijs: €{(pricing.basePrice / 100).toFixed(2)} per{" "}
          {pricingType === "per_user"
            ? "gebruiker"
            : pricingType === "per_building"
              ? "gebouw"
              : pricingType === "per_customer"
                ? "organisatie"
                : "maand"}
        </p>
      </div>

      {/* Setup Fee */}
      <div>
        <Label htmlFor="setupFee">Setup Fee (optioneel, in euro centen)</Label>
        <Input
          id="setupFee"
          type="number"
          value={pricing.setupFee || 0}
          onChange={(e) => setPricing({ ...pricing, setupFee: Number(e.target.value) || undefined })}
          placeholder="Bijvoorbeeld: 15000 voor €150"
        />
        {pricing.setupFee && (
          <p className="text-xs text-gray-500 mt-1">Setup fee: €{(pricing.setupFee / 100).toFixed(2)}</p>
        )}
      </div>

      {/* Tier Pricing for per_user */}
      {pricingType === "per_user" && (
        <div>
          <Label>Tier Pricing (optioneel)</Label>
          <div className="space-y-3 mt-2">
            <div className="grid grid-cols-3 gap-2 text-sm font-semibold">
              <span>Min Gebruikers</span>
              <span>Max Gebruikers</span>
              <span>Prijs per Gebruiker</span>
            </div>
            {pricing.tierPricing?.map((tier, index) => (
              <div key={index} className="grid grid-cols-3 gap-2">
                <Input
                  type="number"
                  value={tier.minUsers}
                  onChange={(e) => {
                    const newTiers = [...(pricing.tierPricing || [])]
                    newTiers[index] = { ...tier, minUsers: Number(e.target.value) }
                    setPricing({ ...pricing, tierPricing: newTiers })
                  }}
                />
                <Input
                  type="number"
                  value={tier.maxUsers || ""}
                  onChange={(e) => {
                    const newTiers = [...(pricing.tierPricing || [])]
                    newTiers[index] = { ...tier, maxUsers: Number(e.target.value) || undefined }
                    setPricing({ ...pricing, tierPricing: newTiers })
                  }}
                  placeholder="Onbeperkt"
                />
                <Input
                  type="number"
                  value={tier.pricePerUser}
                  onChange={(e) => {
                    const newTiers = [...(pricing.tierPricing || [])]
                    newTiers[index] = { ...tier, pricePerUser: Number(e.target.value) }
                    setPricing({ ...pricing, tierPricing: newTiers })
                  }}
                />
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const newTier = { minUsers: 1, pricePerUser: pricing.basePrice }
                setPricing({
                  ...pricing,
                  tierPricing: [...(pricing.tierPricing || []), newTier],
                })
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Tier Toevoegen
            </Button>
          </div>
        </div>
      )}

      {/* Free Trial */}
      <div>
        <Label htmlFor="freeTrialDays">Gratis Proefperiode (dagen)</Label>
        <Input
          id="freeTrialDays"
          type="number"
          value={pricing.freeTrialDays || 0}
          onChange={(e) => setPricing({ ...pricing, freeTrialDays: Number(e.target.value) || undefined })}
        />
      </div>

      {/* Pricing Preview */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold mb-3">Prijsvoorbeeld</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p>
              <strong>10 gebruikers, 1 gebouw:</strong>
            </p>
            <p>
              €{calculateModulePrice({ ...module, pricing: { ...pricing, type: pricingType } }, 10, 1).price.toFixed(2)}
              /maand
            </p>
          </div>
          <div>
            <p>
              <strong>25 gebruikers, 2 gebouwen:</strong>
            </p>
            <p>
              €{calculateModulePrice({ ...module, pricing: { ...pricing, type: pricingType } }, 25, 2).price.toFixed(2)}
              /maand
            </p>
          </div>
          <div>
            <p>
              <strong>100 gebruikers, 5 gebouwen:</strong>
            </p>
            <p>
              €
              {calculateModulePrice({ ...module, pricing: { ...pricing, type: pricingType } }, 100, 5).price.toFixed(2)}
              /maand
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Annuleren
        </Button>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Opslaan
        </Button>
      </div>
    </div>
  )
}

// Pricing Calculator Component
function PricingCalculator({
  modules,
  users,
  buildings,
  onUsersChange,
  onBuildingsChange,
}: {
  modules: ModuleDefinition[]
  users: number
  buildings: number
  onUsersChange: (users: number) => void
  onBuildingsChange: (buildings: number) => void
}) {
  const [selectedModules, setSelectedModules] = useState<string[]>([])

  const toggleModule = (moduleId: string) => {
    setSelectedModules((prev) => (prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]))
  }

  const calculateTotal = () => {
    return selectedModules.reduce((total, moduleId) => {
      const module = modules.find((m) => m.id === moduleId)
      if (module) {
        const price = calculateModulePrice(module, users, buildings)
        return total + price.price
      }
      return total
    }, 0)
  }

  const calculateSetupFees = () => {
    return selectedModules.reduce((total, moduleId) => {
      const module = modules.find((m) => m.id === moduleId)
      if (module && module.pricing.setupFee) {
        return total + module.pricing.setupFee / 100
      }
      return total
    }, 0)
  }

  return (
    <div className="space-y-6">
      {/* Calculator Inputs */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="calcUsers">Aantal Gebruikers</Label>
          <Input
            id="calcUsers"
            type="number"
            value={users}
            onChange={(e) => onUsersChange(Number(e.target.value) || 1)}
            min="1"
          />
        </div>
        <div>
          <Label htmlFor="calcBuildings">Aantal Gebouwen</Label>
          <Input
            id="calcBuildings"
            type="number"
            value={buildings}
            onChange={(e) => onBuildingsChange(Number(e.target.value) || 1)}
            min="1"
          />
        </div>
      </div>

      {/* Module Selection */}
      <div>
        <h4 className="font-semibold mb-3">Selecteer Modules</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
          {modules.map((module) => {
            const priceInfo = calculateModulePrice(module, users, buildings)
            const isSelected = selectedModules.includes(module.id)

            return (
              <div
                key={module.id}
                className={`p-3 border rounded-lg cursor-pointer transition-all ${
                  isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => toggleModule(module.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h5 className="font-semibold text-sm">{module.name}</h5>
                    <p className="text-xs text-gray-600">{module.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">€{priceInfo.price.toFixed(2)}/maand</p>
                    <p className="text-xs text-gray-500">{priceInfo.model}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Totals */}
      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Maandelijkse kosten:</span>
            <span className="font-semibold">€{calculateTotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Jaarlijkse kosten:</span>
            <span className="font-semibold">€{(calculateTotal() * 12).toFixed(2)}</span>
          </div>
          {calculateSetupFees() > 0 && (
            <div className="flex justify-between text-orange-600">
              <span>Eenmalige setup kosten:</span>
              <span className="font-semibold">€{calculateSetupFees().toFixed(2)}</span>
            </div>
          )}
          <hr className="border-green-300" />
          <div className="flex justify-between text-lg font-bold text-green-800">
            <span>Totaal eerste jaar:</span>
            <span>€{(calculateTotal() * 12 + calculateSetupFees()).toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-3 text-xs text-green-700">
          {selectedModules.length} modules geselecteerd voor {users} gebruikers en {buildings} gebouwen
        </div>
      </div>
    </div>
  )
}
