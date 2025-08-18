"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Settings,
  Users,
  Shield,
  AlertTriangle,
  FileText,
  Calendar,
  MapPin,
  Smartphone,
  Zap,
  Loader2,
} from "lucide-react"
import { toast } from "sonner"
import { AVAILABLE_MODULES, getModuleById } from "@/lib/modules/module-definitions"

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  enabledModules: string[]
}

interface ModuleToggleState {
  [key: string]: boolean
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "core":
      return <Shield className="h-5 w-5" />
    case "safety":
      return <AlertTriangle className="h-5 w-5" />
    case "management":
      return <Users className="h-5 w-5" />
    case "reporting":
      return <FileText className="h-5 w-5" />
    case "scheduling":
      return <Calendar className="h-5 w-5" />
    case "location":
      return <MapPin className="h-5 w-5" />
    case "mobile":
      return <Smartphone className="h-5 w-5" />
    case "integration":
      return <Zap className="h-5 w-5" />
    default:
      return <Settings className="h-5 w-5" />
  }
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case "core":
      return "bg-blue-100 text-blue-800"
    case "safety":
      return "bg-red-100 text-red-800"
    case "management":
      return "bg-green-100 text-green-800"
    case "reporting":
      return "bg-purple-100 text-purple-800"
    case "scheduling":
      return "bg-orange-100 text-orange-800"
    case "location":
      return "bg-teal-100 text-teal-800"
    case "mobile":
      return "bg-pink-100 text-pink-800"
    case "integration":
      return "bg-yellow-100 text-yellow-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function CustomerModulesPage() {
  const params = useParams()
  const router = useRouter()
  const customerId = params.id as string

  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)
  const [toggleLoading, setToggleLoading] = useState<ModuleToggleState>({})
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCustomer()
  }, [customerId])

  const fetchCustomer = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/customers/${customerId}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch customer: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.success) {
        setCustomer(data.customer)
      } else {
        throw new Error(data.error || "Failed to fetch customer")
      }
    } catch (error) {
      console.error("Error fetching customer:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch customer")
      toast.error("Failed to load customer data")
    } finally {
      setLoading(false)
    }
  }

  const toggleModule = async (moduleId: string, enabled: boolean) => {
    if (!customer) return

    try {
      setToggleLoading((prev) => ({ ...prev, [moduleId]: true }))

      const response = await fetch(`/api/customers/${customerId}/modules`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          moduleId,
          enabled,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to update module: ${response.statusText}`)
      }

      const result = await response.json()

      if (result.success) {
        setCustomer((prev) => {
          if (!prev) return null

          const updatedModules = enabled
            ? [...prev.enabledModules, moduleId]
            : prev.enabledModules.filter((id) => id !== moduleId)

          return {
            ...prev,
            enabledModules: updatedModules,
          }
        })

        const module = getModuleById(moduleId)
        toast.success(`${module?.name || "Module"} ${enabled ? "enabled" : "disabled"} successfully`)
      } else {
        throw new Error(result.error || "Failed to update module")
      }
    } catch (error) {
      console.error("Error toggling module:", error)
      toast.error(error instanceof Error ? error.message : "Failed to update module")
    } finally {
      setToggleLoading((prev) => ({ ...prev, [moduleId]: false }))
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading customer modules...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !customer) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Error Loading Customer</h3>
              <p className="text-muted-foreground mb-4">{error || "Customer not found"}</p>
              <Button onClick={fetchCustomer} variant="outline">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const groupedModules = AVAILABLE_MODULES.reduce(
    (acc, module) => {
      if (!acc[module.category]) {
        acc[module.category] = []
      }
      acc[module.category].push(module)
      return acc
    },
    {} as Record<string, typeof AVAILABLE_MODULES>,
  )

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Module Management</h1>
          <p className="text-muted-foreground">Manage modules for {customer.name}</p>
        </div>
      </div>

      {/* Customer Info */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Customer Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Name</p>
              <p className="text-sm">{customer.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-sm">{customer.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Phone</p>
              <p className="text-sm">{customer.phone}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Enabled Modules</p>
              <p className="text-sm">
                {customer.enabledModules.length} of {AVAILABLE_MODULES.length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modules by Category */}
      <div className="space-y-6">
        {Object.entries(groupedModules).map(([category, modules]) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 capitalize">
                {getCategoryIcon(category)}
                {category} Modules
              </CardTitle>
              <CardDescription>
                {modules.length} module{modules.length !== 1 ? "s" : ""} available in this category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {modules.map((module) => {
                  const isEnabled = customer.enabledModules.includes(module.id)
                  const isLoading = toggleLoading[module.id]

                  return (
                    <Card key={module.id} className="relative">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-base flex items-center gap-2">
                              {module.name}
                              <Badge variant="secondary" className={getCategoryColor(module.category)}>
                                {module.category}
                              </Badge>
                            </CardTitle>
                            <CardDescription className="text-sm mt-1">{module.description}</CardDescription>
                          </div>
                          <div className="flex items-center gap-2 ml-2">
                            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                            <Switch
                              checked={isEnabled}
                              onCheckedChange={(checked) => toggleModule(module.id, checked)}
                              disabled={isLoading}
                            />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        {module.features && module.features.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-2">Key Features:</p>
                            <ul className="text-xs text-muted-foreground space-y-1">
                              {module.features.slice(0, 3).map((feature, index) => (
                                <li key={index} className="flex items-center gap-1">
                                  <span className="w-1 h-1 bg-current rounded-full flex-shrink-0" />
                                  {feature}
                                </li>
                              ))}
                              {module.features.length > 3 && (
                                <li className="text-xs text-muted-foreground/70">
                                  +{module.features.length - 3} more features
                                </li>
                              )}
                            </ul>
                          </div>
                        )}

                        {module.pricing && (
                          <div className="mt-3 pt-3 border-t">
                            <p className="text-xs font-medium text-muted-foreground">
                              Pricing: €{module.pricing.monthly}/month
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Module Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-600">{customer.enabledModules.length}</p>
              <p className="text-sm text-muted-foreground">Enabled</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-600">
                {AVAILABLE_MODULES.length - customer.enabledModules.length}
              </p>
              <p className="text-sm text-muted-foreground">Disabled</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{AVAILABLE_MODULES.length}</p>
              <p className="text-sm text-muted-foreground">Total Available</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">
                {Math.round((customer.enabledModules.length / AVAILABLE_MODULES.length) * 100)}%
              </p>
              <p className="text-sm text-muted-foreground">Utilization</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
