"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { BHV360BrandHeader } from "@/components/bhv360-brand-header"
import { Eye, EyeOff, Power, PowerOff, Save, Package, TrendingUp, Edit, Users, Building, Briefcase } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { moduleDefinitions, type ModuleDefinition } from "@/lib/modules/module-definitions"

export default function SuperAdminModuleManagementPage() {
  const [modules, setModules] = useState<ModuleDefinition[]>(moduleDefinitions)
  const [editingModule, setEditingModule] = useState<ModuleDefinition | null>(null)
  const [loading, setLoading] = useState(false)

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
    }).format(price)
  }

  const getModuleStats = () => {
    return {
      total: modules.length,
      visible: modules.filter((m) => m.visible).length,
      enabled: modules.filter((m) => m.enabled).length,
      implemented: modules.filter((m) => m.implemented).length,
    }
  }

  const stats = getModuleStats()

  return (
    <div className="min-h-screen bg-gray-50">
      <BHV360BrandHeader customerName="Super Admin" userRole="Systeem Beheerder" />

      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">BHV360 Module Beheer</h1>
          <p className="text-gray-600">Beheer modules, prijzen en zichtbaarheid in de BHV360 marketplace</p>
        </div>

        {/* Statistieken Dashboard */}
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
                  <p className="text-sm text-gray-600">Ingeschakeld</p>
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
                  <p className="text-sm text-gray-600">Geïmplementeerd</p>
                  <p className="text-2xl font-bold">{stats.implemented}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Module Beheer Tabel */}
        <Card>
          <CardHeader>
            <CardTitle>Module Overzicht</CardTitle>
            <CardDescription>Beheer de zichtbaarheid, status en prijzen van alle modules</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {modules.map((module) => (
                <div key={module.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{module.name}</h3>
                        <Badge
                          variant={
                            module.category === "basis"
                              ? "default"
                              : module.category === "geavanceerd"
                                ? "secondary"
                                : module.category === "premium"
                                  ? "destructive"
                                  : "outline"
                          }
                        >
                          {module.category}
                        </Badge>
                        {module.implemented && (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            Geïmplementeerd
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{module.description}</p>

                      {/* Prijsinformatie met uitleg */}
                      <div className="bg-gray-50 p-3 rounded-lg mb-3">
                        <div className="flex items-center gap-4 text-sm mb-2">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-blue-600" />
                            <span>
                              Per gebruiker: <strong>{formatPrice(module.pricing.perUser)}</strong>
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Building className="h-4 w-4 text-green-600" />
                            <span>
                              Per gebouw: <strong>{formatPrice(module.pricing.perBuilding)}</strong>
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Briefcase className="h-4 w-4 text-purple-600" />
                            <span>
                              Per organisatie: <strong>{formatPrice(module.pricing.perCustomer)}</strong>
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600">
                          <strong>Actief model:</strong> {module.pricingModel} - {module.pricingExplanation}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Prijzen Bewerken */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setEditingModule(module)}>
                            <Edit className="h-4 w-4 mr-1" />
                            Prijzen
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Prijzen Bewerken - {module.name}</DialogTitle>
                            <DialogDescription>Pas de prijzen voor deze module aan</DialogDescription>
                          </DialogHeader>
                          <PricingEditor
                            module={module}
                            onSave={(pricing) => handleUpdatePricing(module.id, pricing)}
                            onCancel={() => setEditingModule(null)}
                          />
                        </DialogContent>
                      </Dialog>

                      {/* Zichtbaarheid Toggle */}
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`visible-${module.id}`} className="text-sm">
                          {module.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </Label>
                        <Switch
                          id={`visible-${module.id}`}
                          checked={module.visible}
                          onCheckedChange={() => handleToggleVisibility(module.id)}
                          disabled={loading}
                        />
                      </div>

                      {/* Status Toggle */}
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`enabled-${module.id}`} className="text-sm">
                          {module.enabled ? <Power className="h-4 w-4" /> : <PowerOff className="h-4 w-4" />}
                        </Label>
                        <Switch
                          id={`enabled-${module.id}`}
                          checked={module.enabled}
                          onCheckedChange={() => handleToggleEnabled(module.id)}
                          disabled={loading}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

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

  const handleSave = () => {
    onSave(pricing)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="perUser" className="flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-600" />
            Per gebruiker (€)
          </Label>
          <Input
            id="perUser"
            type="number"
            step="0.01"
            value={pricing.perUser}
            onChange={(e) => setPricing({ ...pricing, perUser: Number.parseFloat(e.target.value) || 0 })}
          />
          <p className="text-xs text-gray-500 mt-1">Prijs per persoon per maand</p>
        </div>
        <div>
          <Label htmlFor="perBuilding" className="flex items-center gap-2">
            <Building className="h-4 w-4 text-green-600" />
            Per gebouw (€)
          </Label>
          <Input
            id="perBuilding"
            type="number"
            step="0.01"
            value={pricing.perBuilding}
            onChange={(e) => setPricing({ ...pricing, perBuilding: Number.parseFloat(e.target.value) || 0 })}
          />
          <p className="text-xs text-gray-500 mt-1">Prijs per locatie per maand</p>
        </div>
        <div>
          <Label htmlFor="perCustomer" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-purple-600" />
            Per organisatie (€)
          </Label>
          <Input
            id="perCustomer"
            type="number"
            step="0.01"
            value={pricing.perCustomer}
            onChange={(e) => setPricing({ ...pricing, perCustomer: Number.parseFloat(e.target.value) || 0 })}
          />
          <p className="text-xs text-gray-500 mt-1">Vaste prijs per organisatie</p>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold mb-2">Prijsvoorbeeld (10 gebruikers, 2 gebouwen):</h4>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p>
              <strong>Per gebruiker:</strong>
            </p>
            <p>€{(pricing.perUser * 10).toFixed(2)}/maand</p>
          </div>
          <div>
            <p>
              <strong>Per gebouw:</strong>
            </p>
            <p>€{(pricing.perBuilding * 2).toFixed(2)}/maand</p>
          </div>
          <div>
            <p>
              <strong>Per organisatie:</strong>
            </p>
            <p>€{pricing.perCustomer.toFixed(2)}/maand</p>
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
