"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { BHV360BrandHeader } from "@/components/bhv360-brand-header"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Package,
  Settings,
  TrendingUp,
  Shield,
  Zap,
  Crown,
  Building,
  Search,
  Filter,
  Save,
  CheckCircle,
  Clock,
  Euro,
  Users,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { toFixedSafe } from "@/helpers/number"
import {
  moduleDefinitions,
  moduleCategories,
  calculateModulePrice,
  type ModuleDefinition,
} from "@/lib/modules/module-definitions"

// Force dynamic rendering for this page
export const dynamic = "force-dynamic"
export const revalidate = 0

interface CustomerModule {
  id: string
  moduleId: string
  customerId: string
  enabled: boolean
  activatedAt?: string
  deactivatedAt?: string
  settings?: Record<string, any>
  usage?: {
    activeUsers: number
    totalUsers: number
    lastUsed?: string
  }
}

export default function CustomerModulesPage() {
  const params = useParams()
  const customerId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [customerModules, setCustomerModules] = useState<CustomerModule[]>([])
  const [customer, setCustomer] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [showOnlyEnabled, setShowOnlyEnabled] = useState(false)
  const [editingModule, setEditingModule] = useState<ModuleDefinition | null>(null)

  // Load customer and modules data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)

        // Mock customer data
        const mockCustomer = {
          id: customerId,
          name: "Acme Corporation",
          tier: "premium",
          users: 45,
          buildings: 3,
          subscription: {
            plan: "Premium",
            status: "active",
            nextBilling: "2024-02-15",
          },
        }

        // Mock customer modules - some enabled, some disabled
        const mockCustomerModules: CustomerModule[] = [
          {
            id: "1",
            moduleId: "bhv-aanwezigheid",
            customerId,
            enabled: true,
            activatedAt: "2024-01-15T10:00:00Z",
            usage: { activeUsers: 32, totalUsers: 45, lastUsed: "2024-01-20T14:30:00Z" },
          },
          {
            id: "2",
            moduleId: "plotkaart-editor",
            customerId,
            enabled: true,
            activatedAt: "2024-01-15T10:00:00Z",
            usage: { activeUsers: 8, totalUsers: 45, lastUsed: "2024-01-19T16:45:00Z" },
          },
          {
            id: "3",
            moduleId: "incident-management",
            customerId,
            enabled: false,
            deactivatedAt: "2024-01-10T12:00:00Z",
          },
          {
            id: "4",
            moduleId: "nfc-integratie",
            customerId,
            enabled: true,
            activatedAt: "2024-01-18T09:30:00Z",
            usage: { activeUsers: 12, totalUsers: 45, lastUsed: "2024-01-20T11:15:00Z" },
          },
          {
            id: "5",
            moduleId: "rapportage-dashboard",
            customerId,
            enabled: false,
          },
        ]

        setCustomer(mockCustomer)
        setCustomerModules(mockCustomerModules)
      } catch (error) {
        console.error("Error loading data:", error)
        toast({
          title: "Fout bij laden",
          description: "Er is een fout opgetreden bij het laden van de module gegevens.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (customerId) {
      loadData()
    }
  }, [customerId])

  const handleToggleModule = async (moduleId: string, enabled: boolean) => {
    setSaving(true)
    try {
      // Update local state
      setCustomerModules((prev) =>
        prev.map((cm) =>
          cm.moduleId === moduleId
            ? {
                ...cm,
                enabled,
                activatedAt: enabled ? new Date().toISOString() : cm.activatedAt,
                deactivatedAt: !enabled ? new Date().toISOString() : undefined,
              }
            : cm,
        ),
      )

      const module = moduleDefinitions.find((m) => m.id === moduleId)
      toast({
        title: enabled ? "Module Geactiveerd" : "Module Gedeactiveerd",
        description: `${module?.name || "Module"} is ${enabled ? "ingeschakeld" : "uitgeschakeld"} voor deze klant.`,
      })
    } catch (error) {
      toast({
        title: "Fout",
        description: "Er is een fout opgetreden bij het bijwerken van de module.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const getModuleStatus = (moduleId: string): CustomerModule | null => {
    return customerModules.find((cm) => cm.moduleId === moduleId) || null
  }

  const getFilteredModules = () => {
    return moduleDefinitions.filter((module) => {
      const matchesSearch =
        searchTerm === "" ||
        module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        module.description.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory = selectedCategory === "all" || module.category === selectedCategory

      const customerModule = getModuleStatus(module.id)
      const matchesEnabledFilter = !showOnlyEnabled || (customerModule?.enabled ?? false)

      return matchesSearch && matchesCategory && matchesEnabledFilter
    })
  }

  const getModuleStats = () => {
    const enabledModules = customerModules.filter((cm) => cm.enabled)
    const totalUsage = enabledModules.reduce((sum, cm) => sum + (cm.usage?.activeUsers || 0), 0)

    return {
      total: moduleDefinitions.length,
      enabled: enabledModules.length,
      disabled: customerModules.length - enabledModules.length,
      totalUsage,
      averageUsage: enabledModules.length > 0 ? totalUsage / enabledModules.length : 0,
    }
  }

  const calculateMonthlyCost = () => {
    if (!customer) return 0

    return customerModules
      .filter((cm) => cm.enabled)
      .reduce((total, cm) => {
        const module = moduleDefinitions.find((m) => m.id === cm.moduleId)
        if (module) {
          const price = calculateModulePrice(module, customer.users, customer.buildings)
          return total + price.price
        }
        return total
      }, 0)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <BHV360BrandHeader customerName="Laden..." userRole="Beheerder" />
        <div className="container mx-auto p-6">
          <div className="space-y-6">
            <Skeleton className="h-8 w-64" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-24" />
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-64" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const stats = getModuleStats()
  const monthlyCost = calculateMonthlyCost()
  const filteredModules = getFilteredModules()

  return (
    <div className="min-h-screen bg-gray-50">
      <BHV360BrandHeader customerName={customer?.name || "Klant"} userRole="Module Beheerder" />

      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Module Beheer</h1>
          <p className="text-gray-600">
            Beheer de actieve modules voor {customer?.name} ({customer?.users} gebruikers, {customer?.buildings}{" "}
            gebouwen)
          </p>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Totaal Modules</p>
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
                  <p className="text-sm text-gray-600">Actieve Modules</p>
                  <p className="text-2xl font-bold text-green-600">{stats.enabled}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Maandelijkse Kosten</p>
                  <p className="text-2xl font-bold text-blue-600">€{toFixedSafe(monthlyCost)}</p>
                </div>
                <Euro className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Gem. Gebruik</p>
                  <p className="text-2xl font-bold text-purple-600">{toFixedSafe(stats.averageUsage, 0)}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filters & Zoeken</CardTitle>
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

              <div className="flex items-center space-x-2 pt-6">
                <Switch id="showOnlyEnabled" checked={showOnlyEnabled} onCheckedChange={setShowOnlyEnabled} />
                <Label htmlFor="showOnlyEnabled">Alleen actieve modules</Label>
              </div>

              <div className="pt-6">
                <Button variant="outline" className="w-full bg-transparent">
                  <Filter className="h-4 w-4 mr-2" />
                  Meer filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((module) => {
            const customerModule = getModuleStatus(module.id)
            const isEnabled = customerModule?.enabled ?? false
            const priceInfo = calculateModulePrice(module, customer?.users || 1, customer?.buildings || 1)

            return (
              <ModuleCard
                key={module.id}
                module={module}
                customerModule={customerModule}
                isEnabled={isEnabled}
                priceInfo={priceInfo}
                onToggle={(enabled) => handleToggleModule(module.id, enabled)}
                onEdit={() => setEditingModule(module)}
                saving={saving}
              />
            )
          })}
        </div>

        {filteredModules.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Geen modules gevonden</h3>
              <p className="text-gray-600">Pas je zoekfilters aan om modules te vinden.</p>
            </CardContent>
          </Card>
        )}

        {/* Module Settings Dialog */}
        {editingModule && (
          <Dialog open={!!editingModule} onOpenChange={() => setEditingModule(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Module Instellingen - {editingModule.name}</DialogTitle>
                <DialogDescription>Pas de instellingen aan voor deze module</DialogDescription>
              </DialogHeader>
              <ModuleSettingsForm
                module={editingModule}
                customerModule={getModuleStatus(editingModule.id)}
                onSave={() => {
                  setEditingModule(null)
                  toast({
                    title: "Instellingen Opgeslagen",
                    description: "De module instellingen zijn succesvol bijgewerkt.",
                  })
                }}
                onCancel={() => setEditingModule(null)}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}

// Module Card Component
function ModuleCard({
  module,
  customerModule,
  isEnabled,
  priceInfo,
  onToggle,
  onEdit,
  saving,
}: {
  module: ModuleDefinition
  customerModule: CustomerModule | null
  isEnabled: boolean
  priceInfo: any
  onToggle: (enabled: boolean) => void
  onEdit: () => void
  saving: boolean
}) {
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

  return (
    <Card className={`transition-all duration-200 hover:shadow-md ${isEnabled ? "ring-2 ring-green-200" : ""}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2 flex items-center gap-2">
              {module.name}
              {isEnabled && <CheckCircle className="h-5 w-5 text-green-600" />}
            </CardTitle>
            <div className="flex gap-2 mb-2">
              <Badge className={getCategoryColor(module.category)}>
                {getCategoryIcon(module.category)}
                <span className="ml-1">{module.category}</span>
              </Badge>
              <Badge variant="outline">{module.tier}</Badge>
              {module.status === "beta" && <Badge variant="secondary">Beta</Badge>}
            </div>
            <CardDescription className="text-sm">{module.description}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Usage Stats */}
        {isEnabled && customerModule?.usage && (
          <div className="mb-4 p-3 bg-green-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-green-800">Actief Gebruik</span>
              <Users className="h-4 w-4 text-green-600" />
            </div>
            <div className="text-sm text-green-700">
              <p>
                {customerModule.usage.activeUsers} van {customerModule.usage.totalUsers} gebruikers actief
              </p>
              {customerModule.usage.lastUsed && (
                <p className="text-xs mt-1">
                  Laatst gebruikt: {new Date(customerModule.usage.lastUsed).toLocaleDateString("nl-NL")}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Pricing Info */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-lg text-blue-600">€{toFixedSafe(priceInfo.price)}/maand</span>
            <Badge variant="outline">{priceInfo.model}</Badge>
          </div>
          <p className="text-xs text-gray-600">{priceInfo.explanation}</p>
        </div>

        {/* Key Features */}
        <div className="mb-4">
          <h4 className="font-semibold text-sm mb-2">Belangrijkste features:</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            {module.features.slice(0, 3).map((feature, index) => (
              <li key={index} className="flex items-center gap-1">
                <div className="w-1 h-1 bg-blue-600 rounded-full" />
                {feature}
              </li>
            ))}
            {module.features.length > 3 && <li className="text-gray-500">+{module.features.length - 3} meer...</li>}
          </ul>
        </div>

        {/* Status & Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Switch checked={isEnabled} onCheckedChange={onToggle} disabled={saving} />
            <span className="text-sm font-medium">{isEnabled ? "Actief" : "Inactief"}</span>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Activation/Deactivation Date */}
        {customerModule && (
          <div className="mt-3 pt-3 border-t text-xs text-gray-500">
            {isEnabled && customerModule.activatedAt && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Geactiveerd: {new Date(customerModule.activatedAt).toLocaleDateString("nl-NL")}
              </div>
            )}
            {!isEnabled && customerModule.deactivatedAt && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Gedeactiveerd: {new Date(customerModule.deactivatedAt).toLocaleDateString("nl-NL")}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Module Settings Form Component
function ModuleSettingsForm({
  module,
  customerModule,
  onSave,
  onCancel,
}: {
  module: ModuleDefinition
  customerModule: CustomerModule | null
  onSave: () => void
  onCancel: () => void
}) {
  const [settings, setSettings] = useState(customerModule?.settings || {})

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold mb-2">{module.name}</h4>
        <p className="text-sm text-gray-600">{module.description}</p>
      </div>

      {/* Mock settings based on module type */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="notifications">Notificaties inschakelen</Label>
          <Switch
            id="notifications"
            checked={settings.notifications ?? true}
            onCheckedChange={(checked) => setSettings({ ...settings, notifications: checked })}
          />
        </div>

        <div>
          <Label htmlFor="autoSync">Automatische synchronisatie</Label>
          <Switch
            id="autoSync"
            checked={settings.autoSync ?? false}
            onCheckedChange={(checked) => setSettings({ ...settings, autoSync: checked })}
          />
        </div>

        <div>
          <Label htmlFor="reportFrequency">Rapportage frequentie</Label>
          <Select
            value={settings.reportFrequency || "weekly"}
            onValueChange={(value) => setSettings({ ...settings, reportFrequency: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Dagelijks</SelectItem>
              <SelectItem value="weekly">Wekelijks</SelectItem>
              <SelectItem value="monthly">Maandelijks</SelectItem>
              <SelectItem value="never">Nooit</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Annuleren
        </Button>
        <Button onClick={onSave}>
          <Save className="h-4 w-4 mr-2" />
          Opslaan
        </Button>
      </div>
    </div>
  )
}
