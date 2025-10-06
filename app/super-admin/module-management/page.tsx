"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Settings, Package, Euro, Star, Eye, CheckCircle, XCircle, Clock, Power } from "lucide-react"
import { toast } from "sonner"
import { AVAILABLE_MODULES, type ModuleDefinition } from "@/lib/modules/module-definitions"
import { BHV360BrandHeader } from "@/components/bhv360-brand-header"
import { ModuleTableComponent } from "@/components/module-table-component"
import { toFixedSafe, toNumberSafe } from "@/helpers/number"

// Force dynamic rendering to avoid static generation issues
export const dynamic = "force-dynamic"
export const revalidate = 0

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
  const formatPrice = (price: number | undefined): string => {
    const safePrice = toNumberSafe(price)
    return toFixedSafe(safePrice / 100, 2)
  }

  // Calculate stats
  useEffect(() => {
    const totalModules = modules.length
    const activeModules = modules.filter((m) => m.enabled).length
    const coreModules = modules.filter((m) => m.core).length
    const betaModules = modules.filter((m) => m.status === "beta").length
    const totalRevenue = modules.reduce((sum, m) => sum + toNumberSafe(m.pricing?.basePrice), 0)
    const averageRating =
      totalModules > 0 ? modules.reduce((sum, m) => sum + toNumberSafe(m.rating), 0) / totalModules : 0

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

      toast.success("Prijzen Bijgewerkt", {
        description: "De module prijzen zijn succesvol bijgewerkt.",
      })
    } catch (error) {
      toast.error("Fout", {
        description: "Er is een fout opgetreden bij het bijwerken van de prijzen.",
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
                  <p className="text-sm text-gray-600">Gemiddelde Rating</p>
                  <p className="text-2xl font-bold">{toFixedSafe(stats.averageRating, 1)}</p>
                </div>
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Core Modules</p>
                  <p className="text-2xl font-bold">{stats.coreModules}</p>
                </div>
                <Settings className="h-8 w-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Beta Modules</p>
                  <p className="text-2xl font-bold">{stats.betaModules}</p>
                </div>
                <Clock className="h-8 w-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Totale Omzet</p>
                  <p className="text-2xl font-bold">€{formatPrice(stats.totalRevenue)}</p>
                </div>
                <Euro className="h-8 w-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Module Table */}
        <ModuleTableComponent
          modules={filteredModules}
          onToggleModule={handleToggleModule}
          onToggleVisibility={handleToggleVisibility}
          onUpdatePricing={handleUpdatePricing}
          getStatusBadge={getStatusBadge}
          getCategoryColor={getCategoryColor}
        />

        {/* Module Creation Dialog */}
        {isCreateDialogOpen && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nieuwe Module Aanmaken</DialogTitle>
                <DialogDescription>Vul de details in voor de nieuwe module.</DialogDescription>
              </DialogHeader>
              {/* Form fields for module creation */}
            </DialogContent>
          </Dialog>
        )}

        {/* Module Edit Dialog */}
        {isEditDialogOpen && editingModule && (
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingModule.name} Bewerken</DialogTitle>
                <DialogDescription>Pas de details van de module aan.</DialogDescription>
              </DialogHeader>
              {/* Form fields for module editing */}
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}
