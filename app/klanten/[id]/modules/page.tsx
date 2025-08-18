"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BHV360BrandHeader } from "@/components/bhv360-brand-header"
import { Shield, Zap, Crown, Building, Package, Loader2, CheckCircle, XCircle, Euro, Users } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { moduleDefinitions, calculateModulePrice, type ModuleDefinition } from "@/lib/modules/module-definitions"

// Force dynamic rendering for this page
export const dynamic = "force-dynamic"
export const revalidate = 0

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
  country: string
  industry: string
  employeeCount: number
  buildingCount: number
  status: "active" | "inactive" | "trial"
  createdAt: string
  updatedAt: string
  enabledModules: string[]
}

export default function CustomerModulesPage() {
  const params = useParams()
  const customerId = params.id as string

  const [customer, setCustomer] = useState<Customer | null>(null)
  const [modules, setModules] = useState<ModuleDefinition[]>(moduleDefinitions)
  const [loading, setLoading] = useState(true)
  const [toggleLoading, setToggleLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadCustomerData()
  }, [customerId])

  const loadCustomerData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Mock customer data - replace with actual API call
      const mockCustomer: Customer = {
        id: customerId,
        name: "Acme Corporation",
        email: "contact@acme.com",
        phone: "+31 20 123 4567",
        address: "Hoofdstraat 123",
        city: "Amsterdam",
        postalCode: "1000 AB",
        country: "Nederland",
        industry: "Technology",
        employeeCount: 150,
        buildingCount: 3,
        status: "active",
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-01-20T14:30:00Z",
        enabledModules: ["bhv-presence", "incident-management", "evacuation-plans"],
      }

      setCustomer(mockCustomer)
    } catch (err) {
      console.error("Error loading customer:", err)
      setError("Fout bij het laden van klantgegevens")
    } finally {
      setLoading(false)
    }
  }

  const handleToggleModule = async (moduleId: string) => {
    if (!customer) return

    try {
      setToggleLoading(moduleId)

      const isCurrentlyEnabled = customer.enabledModules.includes(moduleId)
      const updatedModules = isCurrentlyEnabled
        ? customer.enabledModules.filter((id) => id !== moduleId)
        : [...customer.enabledModules, moduleId]

      // Mock API call - replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setCustomer({
        ...customer,
        enabledModules: updatedModules,
        updatedAt: new Date().toISOString(),
      })

      const module = modules.find((m) => m.id === moduleId)
      toast({
        title: isCurrentlyEnabled ? "Module Uitgeschakeld" : "Module Ingeschakeld",
        description: `${module?.name} is ${isCurrentlyEnabled ? "uitgeschakeld" : "ingeschakeld"} voor ${customer.name}`,
      })
    } catch (err) {
      console.error("Error toggling module:", err)
      toast({
        title: "Fout",
        description: "Er is een fout opgetreden bij het wijzigen van de module",
        variant: "destructive",
      })
    } finally {
      setToggleLoading(null)
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "basis":
        return <Shield className="h-5 w-5" />
      case "geavanceerd":
        return <Zap className="h-5 w-5" />
      case "premium":
        return <Crown className="h-5 w-5" />
      case "enterprise":
        return <Building className="h-5 w-5" />
      default:
        return <Package className="h-5 w-5" />
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

  const getModulesByCategory = (category: string) => {
    return modules.filter((module) => module.category === category && module.visible)
  }

  const calculateTotalCost = () => {
    if (!customer) return 0

    return customer.enabledModules.reduce((total, moduleId) => {
      const module = modules.find((m) => m.id === moduleId)
      if (module) {
        const price = calculateModulePrice(module, customer.employeeCount, customer.buildingCount)
        return total + price.price
      }
      return total
    }, 0)
  }

  const getModuleStats = () => {
    if (!customer) return { enabled: 0, total: 0, categories: {} }

    const visibleModules = modules.filter((m) => m.visible)
    const enabledCount = customer.enabledModules.length
    const totalCount = visibleModules.length

    const categories = visibleModules.reduce(
      (acc, module) => {
        if (!acc[module.category]) {
          acc[module.category] = { total: 0, enabled: 0 }
        }
        acc[module.category].total++
        if (customer.enabledModules.includes(module.id)) {
          acc[module.category].enabled++
        }
        return acc
      },
      {} as Record<string, { total: number; enabled: number }>,
    )

    return { enabled: enabledCount, total: totalCount, categories }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <BHV360BrandHeader customerName="Laden..." userRole="Beheerder" />
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !customer) {
    return (
      <div className="min-h-screen bg-gray-50">
        <BHV360BrandHeader customerName="Fout" userRole="Beheerder" />
        <div className="container mx-auto p-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Fout bij laden</h2>
                <p className="text-gray-600 mb-4">{error || "Klant niet gevonden"}</p>
                <Button onClick={loadCustomerData}>Opnieuw proberen</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const stats = getModuleStats()
  const totalCost = calculateTotalCost()

  return (
    <div className="min-h-screen bg-gray-50">
      <BHV360BrandHeader customerName={customer.name} userRole="Module Beheer" />

      <div className="container mx-auto p-6">
        {/* Customer Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{customer.name}</h1>
              <p className="text-gray-600">Module configuratie en beheer</p>
            </div>
            <Badge variant={customer.status === "active" ? "default" : "secondary"} className="text-sm">
              {customer.status === "active" ? "Actief" : customer.status === "trial" ? "Proefperiode" : "Inactief"}
            </Badge>
          </div>

          {/* Customer Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Gebruikers</p>
                    <p className="text-2xl font-bold">{customer.employeeCount}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Gebouwen</p>
                    <p className="text-2xl font-bold">{customer.buildingCount}</p>
                  </div>
                  <Building className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Actieve Modules</p>
                    <p className="text-2xl font-bold">
                      {stats.enabled}/{stats.total}
                    </p>
                  </div>
                  <Package className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Maandkosten</p>
                    <p className="text-2xl font-bold">
                      €{typeof totalCost === "number" ? totalCost.toFixed(2) : "0.00"}
                    </p>
                  </div>
                  <Euro className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Module Management */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">Alle Modules</TabsTrigger>
            <TabsTrigger value="enabled">Actieve Modules</TabsTrigger>
            <TabsTrigger value="basis">Basis</TabsTrigger>
            <TabsTrigger value="geavanceerd">Geavanceerd</TabsTrigger>
            <TabsTrigger value="premium">Premium</TabsTrigger>
            <TabsTrigger value="enterprise">Enterprise</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="space-y-8">
              {["basis", "geavanceerd", "premium", "enterprise"].map((category) => {
                const categoryModules = getModulesByCategory(category)
                if (categoryModules.length === 0) return null

                return (
                  <Card key={category}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        {getCategoryIcon(category)}
                        {category.charAt(0).toUpperCase() + category.slice(1)} Modules
                        <Badge variant="outline">
                          {stats.categories[category]?.enabled || 0}/{stats.categories[category]?.total || 0}
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        {category === "basis" && "Essentiële modules voor basis BHV functionaliteit"}
                        {category === "geavanceerd" && "Uitgebreide modules voor professioneel gebruik"}
                        {category === "premium" && "Premium modules met geavanceerde features"}
                        {category === "enterprise" && "Enterprise modules voor grote organisaties"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categoryModules.map((module) => (
                          <ModuleCard
                            key={module.id}
                            module={module}
                            customer={customer}
                            isEnabled={customer.enabledModules.includes(module.id)}
                            isLoading={toggleLoading === module.id}
                            onToggle={() => handleToggleModule(module.id)}
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="enabled">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {modules
                .filter((module) => customer.enabledModules.includes(module.id))
                .map((module) => (
                  <ModuleCard
                    key={module.id}
                    module={module}
                    customer={customer}
                    isEnabled={true}
                    isLoading={toggleLoading === module.id}
                    onToggle={() => handleToggleModule(module.id)}
                  />
                ))}
            </div>
          </TabsContent>

          {["basis", "geavanceerd", "premium", "enterprise"].map((category) => (
            <TabsContent key={category} value={category}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getModulesByCategory(category).map((module) => (
                  <ModuleCard
                    key={module.id}
                    module={module}
                    customer={customer}
                    isEnabled={customer.enabledModules.includes(module.id)}
                    isLoading={toggleLoading === module.id}
                    onToggle={() => handleToggleModule(module.id)}
                  />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}

// Module Card Component
function ModuleCard({
  module,
  customer,
  isEnabled,
  isLoading,
  onToggle,
}: {
  module: ModuleDefinition
  customer: Customer
  isEnabled: boolean
  isLoading: boolean
  onToggle: () => void
}) {
  const priceInfo = calculateModulePrice(module, customer.employeeCount, customer.buildingCount)

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
    <Card
      className={`transition-all duration-200 ${isEnabled ? "ring-2 ring-green-500 bg-green-50" : "hover:shadow-md"}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2 flex items-center gap-2">
              {module.name}
              {isEnabled && <CheckCircle className="h-5 w-5 text-green-600" />}
            </CardTitle>
            <div className="flex gap-2 mb-2">
              <Badge className={getCategoryColor(module.category)}>{module.category}</Badge>
              <Badge variant="outline">{module.tier}</Badge>
              {!module.implemented && (
                <Badge variant="secondary" className="text-xs">
                  Beta
                </Badge>
              )}
            </div>
            <CardDescription className="text-sm">{module.description}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Pricing */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-lg text-blue-600">
              €{typeof priceInfo.price === "number" ? priceInfo.price.toFixed(2) : "0.00"}/maand
            </span>
            <Badge variant="outline" className="text-xs">
              {priceInfo.model}
            </Badge>
          </div>
          <p className="text-xs text-gray-600">{priceInfo.explanation}</p>
        </div>

        {/* Features */}
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

        {/* Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Switch checked={isEnabled} onCheckedChange={onToggle} disabled={isLoading || !module.implemented} />
            <span className="text-sm font-medium">{isEnabled ? "Ingeschakeld" : "Uitgeschakeld"}</span>
          </div>
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        </div>

        {!module.implemented && <p className="text-xs text-orange-600 mt-2">Deze module is nog in ontwikkeling</p>}
      </CardContent>
    </Card>
  )
}
