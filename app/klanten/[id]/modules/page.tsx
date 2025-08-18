"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Loader2, Settings, Users, Shield, AlertTriangle } from "lucide-react"
import { CustomerModuleService } from "@/services/CustomerModuleService"
import type { Customer as ICustomer } from "@/components/customer-context"
import type { ModuleDefinition as ICustomerModule } from "@/lib/modules/module-definitions"

const CustomerModulesPage = () => {
  const { id } = useParams<{ id: string }>()
  const [selectedCustomer, setSelectedCustomer] = useState<ICustomer | null>(null)
  const [customerModules, setCustomerModules] = useState<ICustomerModule[]>([])
  const [loadingModule, setLoadingModule] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      loadCustomer(id)
      loadCustomerModules()
    }
  }, [id])

  const loadCustomer = async (customerId: string) => {
    try {
      const customer = await CustomerModuleService.getCustomer(customerId)
      setSelectedCustomer(customer)
    } catch (error) {
      console.error("Error loading customer:", error)
      setError("Fout bij laden van klantgegevens")
    }
  }

  const loadCustomerModules = async () => {
    try {
      setLoading(true)
      const modules = await CustomerModuleService.getAvailableModules()
      setCustomerModules(modules)
    } catch (error) {
      console.error("Error loading customer modules:", error)
      setError("Fout bij laden van modules")
    } finally {
      setLoading(false)
    }
  }

  const handleToggleModule = async (moduleId: string, enabled: boolean) => {
    if (!selectedCustomer) return

    setLoadingModule(moduleId)

    try {
      if (enabled) {
        const result = await CustomerModuleService.enableModule(
          selectedCustomer.id,
          moduleId,
          "current_user", // In productie: echte gebruiker
        )

        if (result.success) {
          // Update local state
          setCustomerModules((prev) =>
            prev.map((module) => (module.id === moduleId ? { ...module, enabled: true } : module)),
          )
        } else {
          setError(result.message || "Fout bij inschakelen module")
        }
      } else {
        const result = await CustomerModuleService.disableModule(
          selectedCustomer.id,
          moduleId,
          "current_user", // In productie: echte gebruiker
        )

        if (result.success) {
          // Update local state
          setCustomerModules((prev) =>
            prev.map((module) => (module.id === moduleId ? { ...module, enabled: false } : module)),
          )
        } else {
          setError(result.message || "Fout bij uitschakelen module")
        }
      }
    } catch (error) {
      console.error("Error toggling module:", error)
      setError("Fout bij wijzigen module status")
    } finally {
      setLoadingModule(null)
    }
  }

  const getModuleIcon = (category: string) => {
    switch (category) {
      case "core":
        return <Shield className="h-5 w-5" />
      case "management":
        return <Settings className="h-5 w-5" />
      case "communication":
        return <Users className="h-5 w-5" />
      default:
        return <AlertTriangle className="h-5 w-5" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "core":
        return "bg-blue-100 text-blue-800"
      case "management":
        return "bg-green-100 text-green-800"
      case "communication":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Modules laden...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Fout opgetreden</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Opnieuw proberen</Button>
        </div>
      </div>
    )
  }

  if (!selectedCustomer) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Klant niet gevonden</h3>
          <p className="text-gray-600">De opgevraagde klant kon niet worden geladen.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Modules voor {selectedCustomer.name}</h1>
        <p className="text-gray-600">Beheer welke modules beschikbaar zijn voor deze klant</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {customerModules.map((module) => (
          <Card key={module.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  {getModuleIcon(module.category)}
                  <CardTitle className="text-lg">{module.name}</CardTitle>
                </div>
                <Switch
                  checked={module.enabled || false}
                  onCheckedChange={(checked) => handleToggleModule(module.id, checked)}
                  disabled={loadingModule === module.id}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={getCategoryColor(module.category)}>{module.category}</Badge>
                {module.tier && <Badge variant="outline">{module.tier}</Badge>}
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">{module.description}</CardDescription>

              {module.features && module.features.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-900">Functies:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {module.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                        <span>{feature}</span>
                      </li>
                    ))}
                    {module.features.length > 3 && (
                      <li className="text-xs text-gray-500">+{module.features.length - 3} meer...</li>
                    )}
                  </ul>
                </div>
              )}

              {loadingModule === module.id && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {customerModules.length === 0 && (
        <div className="text-center py-12">
          <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Geen modules beschikbaar</h3>
          <p className="text-gray-600">Er zijn momenteel geen modules beschikbaar voor deze klant.</p>
        </div>
      )}
    </div>
  )
}

export default CustomerModulesPage
