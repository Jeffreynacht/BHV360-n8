"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import {
  Settings,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  TestTube,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Database,
  MessageSquare,
  Lock,
  BarChart3,
  Zap,
  RefreshCw,
  Save,
  X,
} from "lucide-react"

interface Integration {
  id: string
  name: string
  category: string
  description: string
  status: "live" | "testing" | "planned" | "deprecated"
  visible: boolean
  tested: boolean
  color: string
  icon: string
  lastTested: string
  testResults: {
    connection: boolean
    functionality: boolean
    performance: boolean
    security: boolean
  }
  supportLevel: "basic" | "standard" | "premium"
  version: string
  dependencies: string[]
}

export default function IntegrationManagementPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [editingIntegration, setEditingIntegration] = useState<Integration | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [testingId, setTestingId] = useState<string | null>(null)
  const { toast } = useToast()

  // Initialize with real integrations
  useEffect(() => {
    const initialIntegrations: Integration[] = [
      {
        id: "supabase-db",
        name: "Supabase Database",
        category: "Database & Storage",
        description: "Betrouwbare data opslag en synchronisatie",
        status: "live",
        visible: true,
        tested: true,
        color: "text-green-600",
        icon: "Database",
        lastTested: "2024-01-15",
        testResults: {
          connection: true,
          functionality: true,
          performance: true,
          security: true,
        },
        supportLevel: "premium",
        version: "2.38.0",
        dependencies: ["PostgreSQL", "Auth"],
      },
      {
        id: "neon-postgres",
        name: "Neon PostgreSQL",
        category: "Database & Storage",
        description: "Serverless PostgreSQL database",
        status: "live",
        visible: true,
        tested: true,
        color: "text-blue-600",
        icon: "Database",
        lastTested: "2024-01-14",
        testResults: {
          connection: true,
          functionality: true,
          performance: true,
          security: true,
        },
        supportLevel: "standard",
        version: "1.2.0",
        dependencies: ["PostgreSQL"],
      },
      {
        id: "email-service",
        name: "Email Service",
        category: "Communicatie",
        description: "Professionele email notificaties",
        status: "live",
        visible: true,
        tested: true,
        color: "text-blue-600",
        icon: "MessageSquare",
        lastTested: "2024-01-15",
        testResults: {
          connection: true,
          functionality: true,
          performance: true,
          security: true,
        },
        supportLevel: "premium",
        version: "3.1.0",
        dependencies: ["SMTP", "Templates"],
      },
      {
        id: "sms-notifications",
        name: "SMS Notifications",
        category: "Communicatie",
        description: "SMS berichten met BHV360 branding",
        status: "live",
        visible: true,
        tested: true,
        color: "text-green-600",
        icon: "MessageSquare",
        lastTested: "2024-01-13",
        testResults: {
          connection: true,
          functionality: true,
          performance: false,
          security: true,
        },
        supportLevel: "standard",
        version: "2.5.0",
        dependencies: ["SMS Gateway"],
      },
      {
        id: "nextauth",
        name: "NextAuth.js",
        category: "Authentication & Security",
        description: "Veilige authenticatie en sessie beheer",
        status: "live",
        visible: true,
        tested: true,
        color: "text-purple-600",
        icon: "Lock",
        lastTested: "2024-01-12",
        testResults: {
          connection: true,
          functionality: true,
          performance: true,
          security: true,
        },
        supportLevel: "premium",
        version: "4.24.0",
        dependencies: ["OAuth", "JWT"],
      },
    ]
    setIntegrations(initialIntegrations)
  }, [])

  const handleToggleVisibility = (id: string) => {
    setIntegrations((prev) =>
      prev.map((integration) =>
        integration.id === id ? { ...integration, visible: !integration.visible } : integration,
      ),
    )
    toast({
      title: "Zichtbaarheid bijgewerkt",
      description: "Integratie zichtbaarheid is aangepast op de homepage.",
    })
  }

  const handleTestIntegration = async (id: string) => {
    setTestingId(id)

    // Simulate testing
    await new Promise((resolve) => setTimeout(resolve, 3000))

    const integration = integrations.find((i) => i.id === id)
    if (integration) {
      // Simulate random test results
      const testResults = {
        connection: Math.random() > 0.1,
        functionality: Math.random() > 0.15,
        performance: Math.random() > 0.2,
        security: Math.random() > 0.05,
      }

      setIntegrations((prev) =>
        prev.map((i) =>
          i.id === id
            ? {
                ...i,
                testResults,
                tested: true,
                lastTested: new Date().toISOString().split("T")[0],
              }
            : i,
        ),
      )

      const allPassed = Object.values(testResults).every(Boolean)
      toast({
        title: allPassed ? "Test geslaagd" : "Test waarschuwingen",
        description: allPassed
          ? "Alle tests zijn succesvol uitgevoerd."
          : "Sommige tests hebben waarschuwingen. Controleer de details.",
        variant: allPassed ? "default" : "destructive",
      })
    }

    setTestingId(null)
  }

  const handleSaveIntegration = (integration: Integration) => {
    if (isAddingNew) {
      setIntegrations((prev) => [...prev, { ...integration, id: Date.now().toString() }])
      toast({
        title: "Integratie toegevoegd",
        description: "Nieuwe integratie is succesvol toegevoegd.",
      })
    } else {
      setIntegrations((prev) => prev.map((i) => (i.id === integration.id ? integration : i)))
      toast({
        title: "Integratie bijgewerkt",
        description: "Integratie is succesvol bijgewerkt.",
      })
    }
    setEditingIntegration(null)
    setIsAddingNew(false)
  }

  const handleDeleteIntegration = (id: string) => {
    setIntegrations((prev) => prev.filter((i) => i.id !== id))
    toast({
      title: "Integratie verwijderd",
      description: "Integratie is succesvol verwijderd.",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "live":
        return <Badge className="bg-green-100 text-green-800">Live</Badge>
      case "testing":
        return <Badge className="bg-blue-100 text-blue-800">Testing</Badge>
      case "planned":
        return <Badge className="bg-yellow-100 text-yellow-800">Planned</Badge>
      case "deprecated":
        return <Badge className="bg-red-100 text-red-800">Deprecated</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>
    }
  }

  const getTestResultIcon = (result: boolean) => {
    return result ? <CheckCircle className="h-4 w-4 text-green-600" /> : <XCircle className="h-4 w-4 text-red-600" />
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Database & Storage":
        return <Database className="h-5 w-5" />
      case "Communicatie":
        return <MessageSquare className="h-5 w-5" />
      case "Authentication & Security":
        return <Lock className="h-5 w-5" />
      case "Analytics & Monitoring":
        return <BarChart3 className="h-5 w-5" />
      case "Development & Deployment":
        return <Zap className="h-5 w-5" />
      default:
        return <Settings className="h-5 w-5" />
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Integratie Beheer</h1>
          <p className="text-gray-600 mt-2">Beheer alle integraties die zichtbaar zijn op de homepage</p>
        </div>
        <Button
          onClick={() => {
            setIsAddingNew(true)
            setEditingIntegration({
              id: "",
              name: "",
              category: "Database & Storage",
              description: "",
              status: "testing",
              visible: false,
              tested: false,
              color: "text-blue-600",
              icon: "Database",
              lastTested: "",
              testResults: {
                connection: false,
                functionality: false,
                performance: false,
                security: false,
              },
              supportLevel: "basic",
              version: "1.0.0",
              dependencies: [],
            })
          }}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nieuwe Integratie
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overzicht</TabsTrigger>
          <TabsTrigger value="testing">Test Resultaten</TabsTrigger>
          <TabsTrigger value="settings">Instellingen</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6">
            {integrations.map((integration) => (
              <Card key={integration.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">{getCategoryIcon(integration.category)}</div>
                      <div>
                        <CardTitle className="flex items-center space-x-2">
                          <span>{integration.name}</span>
                          {getStatusBadge(integration.status)}
                        </CardTitle>
                        <CardDescription>{integration.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleToggleVisibility(integration.id)}>
                        {integration.visible ? (
                          <>
                            <Eye className="mr-1 h-4 w-4" />
                            Zichtbaar
                          </>
                        ) : (
                          <>
                            <EyeOff className="mr-1 h-4 w-4" />
                            Verborgen
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTestIntegration(integration.id)}
                        disabled={testingId === integration.id}
                      >
                        {testingId === integration.id ? (
                          <>
                            <RefreshCw className="mr-1 h-4 w-4 animate-spin" />
                            Testen...
                          </>
                        ) : (
                          <>
                            <TestTube className="mr-1 h-4 w-4" />
                            Test
                          </>
                        )}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setEditingIntegration(integration)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteIntegration(integration.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Categorie</p>
                      <p className="text-sm">{integration.category}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Versie</p>
                      <p className="text-sm">{integration.version}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Laatst getest</p>
                      <p className="text-sm">{integration.lastTested || "Nog niet getest"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Support Level</p>
                      <Badge
                        className={
                          integration.supportLevel === "premium"
                            ? "bg-purple-100 text-purple-800"
                            : integration.supportLevel === "standard"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                        }
                      >
                        {integration.supportLevel}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="testing" className="space-y-6">
          <div className="grid gap-6">
            {integrations.map((integration) => (
              <Card key={integration.id}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span>{integration.name}</span>
                    {integration.tested ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    )}
                  </CardTitle>
                  <CardDescription>Test resultaten voor alle componenten</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="flex items-center space-x-2">
                      {getTestResultIcon(integration.testResults.connection)}
                      <span className="text-sm">Verbinding</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getTestResultIcon(integration.testResults.functionality)}
                      <span className="text-sm">Functionaliteit</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getTestResultIcon(integration.testResults.performance)}
                      <span className="text-sm">Performance</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getTestResultIcon(integration.testResults.security)}
                      <span className="text-sm">Security</span>
                    </div>
                  </div>
                  {integration.dependencies.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-500 mb-2">Dependencies</p>
                      <div className="flex flex-wrap gap-2">
                        {integration.dependencies.map((dep, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {dep}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Homepage Integratie Instellingen</CardTitle>
              <CardDescription>Configureer hoe integraties worden weergegeven op de homepage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="maxVisible">Maximum zichtbare integraties</Label>
                  <Input id="maxVisible" type="number" defaultValue="15" />
                </div>
                <div>
                  <Label htmlFor="refreshInterval">Auto-refresh interval (minuten)</Label>
                  <Input id="refreshInterval" type="number" defaultValue="30" />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="autoTest" />
                <Label htmlFor="autoTest">Automatische tests uitvoeren</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="showTestResults" defaultChecked />
                <Label htmlFor="showTestResults">Test resultaten tonen op homepage</Label>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Save className="mr-2 h-4 w-4" />
                Instellingen Opslaan
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit/Add Integration Modal */}
      {editingIntegration && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{isAddingNew ? "Nieuwe Integratie" : "Integratie Bewerken"}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditingIntegration(null)
                    setIsAddingNew(false)
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Naam</Label>
                  <Input
                    id="name"
                    value={editingIntegration.name}
                    onChange={(e) => setEditingIntegration({ ...editingIntegration, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Categorie</Label>
                  <Select
                    value={editingIntegration.category}
                    onValueChange={(value) => setEditingIntegration({ ...editingIntegration, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Database & Storage">Database & Storage</SelectItem>
                      <SelectItem value="Communicatie">Communicatie</SelectItem>
                      <SelectItem value="Authentication & Security">Authentication & Security</SelectItem>
                      <SelectItem value="Analytics & Monitoring">Analytics & Monitoring</SelectItem>
                      <SelectItem value="Development & Deployment">Development & Deployment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Beschrijving</Label>
                <Textarea
                  id="description"
                  value={editingIntegration.description}
                  onChange={(e) => setEditingIntegration({ ...editingIntegration, description: e.target.value })}
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={editingIntegration.status}
                    onValueChange={(value: any) => setEditingIntegration({ ...editingIntegration, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="live">Live</SelectItem>
                      <SelectItem value="testing">Testing</SelectItem>
                      <SelectItem value="planned">Planned</SelectItem>
                      <SelectItem value="deprecated">Deprecated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="version">Versie</Label>
                  <Input
                    id="version"
                    value={editingIntegration.version}
                    onChange={(e) => setEditingIntegration({ ...editingIntegration, version: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="supportLevel">Support Level</Label>
                  <Select
                    value={editingIntegration.supportLevel}
                    onValueChange={(value: any) =>
                      setEditingIntegration({ ...editingIntegration, supportLevel: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="visible"
                    checked={editingIntegration.visible}
                    onCheckedChange={(checked) => setEditingIntegration({ ...editingIntegration, visible: checked })}
                  />
                  <Label htmlFor="visible">Zichtbaar op homepage</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="tested"
                    checked={editingIntegration.tested}
                    onCheckedChange={(checked) => setEditingIntegration({ ...editingIntegration, tested: checked })}
                  />
                  <Label htmlFor="tested">Getest</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingIntegration(null)
                    setIsAddingNew(false)
                  }}
                >
                  Annuleren
                </Button>
                <Button
                  onClick={() => handleSaveIntegration(editingIntegration)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isAddingNew ? "Toevoegen" : "Opslaan"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
