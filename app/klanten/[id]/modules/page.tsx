"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Loader2,
  Settings,
  Shield,
  Users,
  BarChart3,
  Bell,
  FileText,
  Smartphone,
  Zap,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { toast } from "sonner"

interface Module {
  id: string
  name: string
  description: string
  category: string
  features: string[]
  enabled: boolean
  price?: number
  isCore?: boolean
}

interface Customer {
  id: string
  name: string
  email: string
  modules: string[]
}

const categoryIcons = {
  core: Settings,
  safety: Shield,
  management: Users,
  analytics: BarChart3,
  communication: Bell,
  reporting: FileText,
  mobile: Smartphone,
  automation: Zap,
}

const categoryColors = {
  core: "bg-blue-100 text-blue-800 border-blue-200",
  safety: "bg-red-100 text-red-800 border-red-200",
  management: "bg-green-100 text-green-800 border-green-200",
  analytics: "bg-purple-100 text-purple-800 border-purple-200",
  communication: "bg-orange-100 text-orange-800 border-orange-200",
  reporting: "bg-indigo-100 text-indigo-800 border-indigo-200",
  mobile: "bg-pink-100 text-pink-800 border-pink-200",
  automation: "bg-yellow-100 text-yellow-800 border-yellow-200",
}

export default function CustomerModulesPage() {
  const params = useParams()
  const customerId = params.id as string

  const [customer, setCustomer] = useState<Customer | null>(null)
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  // Mock data - replace with actual API calls
  const mockModules: Module[] = [
    {
      id: "bhv-basis",
      name: "BHV Basis",
      description: "Basis BHV functionaliteiten voor bedrijfshulpverlening",
      category: "core",
      features: ["Plotkaart beheer", "Gebruikersbeheer", "Basis rapportage"],
      enabled: true,
      isCore: true,
    },
    {
      id: "incident-management",
      name: "Incident Management",
      description: "Uitgebreid incident management systeem",
      category: "safety",
      features: ["Incident registratie", "Workflow management", "Escalatie procedures"],
      enabled: true,
      price: 29,
    },
    {
      id: "advanced-reporting",
      name: "Geavanceerde Rapportage",
      description: "Uitgebreide rapportage en analytics",
      category: "analytics",
      features: ["Custom dashboards", "Trend analyse", "Export functionaliteit"],
      enabled: false,
      price: 19,
    },
    {
      id: "mobile-app",
      name: "Mobiele App",
      description: "Native mobiele applicatie voor iOS en Android",
      category: "mobile",
      features: ["Push notificaties", "Offline functionaliteit", "QR code scanning"],
      enabled: false,
      price: 39,
    },
    {
      id: "notification-system",
      name: "Notificatie Systeem",
      description: "Geavanceerd notificatie en alerting systeem",
      category: "communication",
      features: ["Multi-channel alerts", "Escalatie matrix", "Bulk messaging"],
      enabled: true,
      price: 15,
    },
    {
      id: "user-management",
      name: "Gebruikersbeheer Pro",
      description: "Uitgebreid gebruikers- en rechtenbeheer",
      category: "management",
      features: ["Role-based access", "Single sign-on", "Audit logging"],
      enabled: false,
      price: 25,
    },
    {
      id: "inspection-module",
      name: "Inspectie Module",
      description: "Digitale inspectie workflows en checklists",
      category: "safety",
      features: ["Digital checklists", "Photo documentation", "Compliance tracking"],
      enabled: false,
      price: 35,
    },
    {
      id: "automation-workflows",
      name: "Automatisering",
      description: "Geautomatiseerde workflows en processen",
      category: "automation",
      features: ["Workflow builder", "Scheduled tasks", "Integration APIs"],
      enabled: false,
      price: 45,
    },
  ]

  const mockCustomer: Customer = {
    id: customerId,
    name: "Acme Corporation",
    email: "admin@acme.com",
    modules: ["bhv-basis", "incident-management", "notification-system"],
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const updatedModules = mockModules.map((module) => ({
          ...module,
          enabled: mockCustomer.modules.includes(module.id),
        }))

        setCustomer(mockCustomer)
        setModules(updatedModules)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("Fout bij het laden van gegevens")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [customerId])

  const toggleModule = async (moduleId: string, enabled: boolean) => {
    setUpdating(moduleId)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Update local state
      setModules((prev) => prev.map((module) => (module.id === moduleId ? { ...module, enabled } : module)))

      if (customer) {
        const updatedModules = enabled
          ? [...customer.modules, moduleId]
          : customer.modules.filter((id) => id !== moduleId)

        setCustomer((prev) => (prev ? { ...prev, modules: updatedModules } : null))
      }

      toast.success(enabled ? "Module geactiveerd" : "Module gedeactiveerd")
    } catch (error) {
      console.error("Error updating module:", error)
      toast.error("Fout bij het bijwerken van module")
    } finally {
      setUpdating(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Modules laden...</span>
        </div>
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Klant niet gevonden</h2>
          <p className="text-gray-600">De opgevraagde klant kon niet worden geladen.</p>
        </div>
      </div>
    )
  }

  const enabledModules = modules.filter((m) => m.enabled)
  const disabledModules = modules.filter((m) => !m.enabled)
  const totalCost = enabledModules.reduce((sum, module) => sum + (module.price || 0), 0)

  const groupedModules = modules.reduce(
    (acc, module) => {
      if (!acc[module.category]) {
        acc[module.category] = []
      }
      acc[module.category].push(module)
      return acc
    },
    {} as Record<string, Module[]>,
  )

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Module Beheer</h1>
          <p className="text-gray-600 mt-1">Beheer modules voor {customer.name}</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">Maandelijkse kosten</div>
          <div className="text-2xl font-bold text-green-600">€{totalCost}</div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <div className="text-2xl font-bold">{enabledModules.length}</div>
                <div className="text-sm text-gray-600">Actieve modules</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="h-5 w-5 text-gray-400" />
              <div>
                <div className="text-2xl font-bold">{disabledModules.length}</div>
                <div className="text-sm text-gray-600">Beschikbare modules</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{modules.length}</div>
                <div className="text-sm text-gray-600">Totaal modules</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modules by Category */}
      <div className="space-y-6">
        {Object.entries(groupedModules).map(([category, categoryModules]) => {
          const IconComponent = categoryIcons[category as keyof typeof categoryIcons] || Settings

          return (
            <div key={category}>
              <div className="flex items-center space-x-2 mb-4">
                <IconComponent className="h-5 w-5" />
                <h2 className="text-xl font-semibold capitalize">
                  {category === "core"
                    ? "Basis Modules"
                    : category === "safety"
                      ? "Veiligheid"
                      : category === "management"
                        ? "Beheer"
                        : category === "analytics"
                          ? "Analytics"
                          : category === "communication"
                            ? "Communicatie"
                            : category === "reporting"
                              ? "Rapportage"
                              : category === "mobile"
                                ? "Mobiel"
                                : category === "automation"
                                  ? "Automatisering"
                                  : category}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryModules.map((module) => (
                  <Card
                    key={module.id}
                    className={`transition-all duration-200 ${
                      module.enabled ? "ring-2 ring-green-200 bg-green-50" : ""
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg flex items-center space-x-2">
                            <span>{module.name}</span>
                            {module.isCore && (
                              <Badge variant="secondary" className="text-xs">
                                Basis
                              </Badge>
                            )}
                          </CardTitle>
                          <CardDescription className="mt-1">{module.description}</CardDescription>
                        </div>
                        <Badge
                          variant="outline"
                          className={categoryColors[module.category as keyof typeof categoryColors]}
                        >
                          <IconComponent className="h-3 w-3 mr-1" />
                          {category}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Functionaliteiten:</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {module.features.map((feature, index) => (
                              <li key={index} className="flex items-center space-x-2">
                                <div className="w-1 h-1 bg-gray-400 rounded-full" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t">
                          <div className="flex items-center space-x-2">
                            {module.price && (
                              <span className="text-lg font-semibold text-green-600">€{module.price}/maand</span>
                            )}
                            {module.isCore && <span className="text-sm text-gray-500">Inbegrepen</span>}
                          </div>

                          <div className="flex items-center space-x-2">
                            {updating === module.id && <Loader2 className="h-4 w-4 animate-spin" />}
                            <Switch
                              checked={module.enabled}
                              onCheckedChange={(checked) => toggleModule(module.id, checked)}
                              disabled={updating === module.id || module.isCore}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
