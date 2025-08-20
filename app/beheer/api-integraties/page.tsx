"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Key,
  Plus,
  Settings,
  Activity,
  AlertCircle,
  CheckCircle,
  Copy,
  Eye,
  EyeOff,
  Trash2,
  Edit,
  Zap,
} from "lucide-react"

interface ApiKey {
  id: string
  name: string
  service: string
  key: string
  status: "active" | "inactive" | "expired"
  permissions: string[]
  lastUsed: string
  createdAt: string
  expiresAt?: string
  requestCount: number
  rateLimit: string
}

interface Webhook {
  id: string
  name: string
  url: string
  events: string[]
  status: "active" | "inactive"
  lastTriggered?: string
  successRate: number
  retryCount: number
}

const initialApiKeys: ApiKey[] = [
  {
    id: "1",
    name: "KNMI Weather API",
    service: "weather",
    key: "sk_live_51H...",
    status: "active",
    permissions: ["weather:read", "alerts:read"],
    lastUsed: "2024-01-15 14:30",
    createdAt: "2024-01-01 10:00",
    expiresAt: "2024-12-31 23:59",
    requestCount: 1247,
    rateLimit: "1000/hour",
  },
  {
    id: "2",
    name: "Microsoft Teams Bot",
    service: "teams",
    key: "bot_token_abc123...",
    status: "active",
    permissions: ["messages:write", "channels:read"],
    lastUsed: "2024-01-15 16:45",
    createdAt: "2024-01-05 09:15",
    requestCount: 892,
    rateLimit: "300/minute",
  },
  {
    id: "3",
    name: "Slack Webhook",
    service: "slack",
    key: "xoxb-1234567890...",
    status: "inactive",
    permissions: ["chat:write", "channels:read"],
    lastUsed: "2024-01-10 11:20",
    createdAt: "2024-01-03 14:30",
    requestCount: 456,
    rateLimit: "100/minute",
  },
]

const initialWebhooks: Webhook[] = [
  {
    id: "1",
    name: "Incident Notifications",
    url: "https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX",
    events: ["incident.created", "incident.resolved"],
    status: "active",
    lastTriggered: "2024-01-15 15:30",
    successRate: 98.5,
    retryCount: 3,
  },
  {
    id: "2",
    name: "Training Reminders",
    url: "https://outlook.office.com/webhook/...",
    events: ["training.due", "certification.expiring"],
    status: "active",
    lastTriggered: "2024-01-14 09:00",
    successRate: 100,
    retryCount: 2,
  },
  {
    id: "3",
    name: "Emergency Alerts",
    url: "https://api.emergency-system.com/webhook",
    events: ["emergency.triggered", "evacuation.started"],
    status: "inactive",
    successRate: 95.2,
    retryCount: 5,
  },
]

const availableServices = [
  { id: "weather", name: "Weather Services", icon: "🌤️" },
  { id: "teams", name: "Microsoft Teams", icon: "💬" },
  { id: "slack", name: "Slack", icon: "💬" },
  { id: "email", name: "Email Services", icon: "📧" },
  { id: "sms", name: "SMS Services", icon: "📱" },
  { id: "iot", name: "IoT Sensors", icon: "📡" },
  { id: "security", name: "Security Systems", icon: "🔒" },
  { id: "analytics", name: "Analytics", icon: "📊" },
]

const availableEvents = [
  "incident.created",
  "incident.updated",
  "incident.resolved",
  "emergency.triggered",
  "evacuation.started",
  "evacuation.completed",
  "training.due",
  "certification.expiring",
  "user.created",
  "user.updated",
  "system.maintenance",
]

const availablePermissions = [
  "incidents:read",
  "incidents:write",
  "users:read",
  "users:write",
  "reports:read",
  "reports:write",
  "notifications:send",
  "webhooks:manage",
  "system:admin",
]

export default function ApiIntegrationsPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(initialApiKeys)
  const [webhooks, setWebhooks] = useState<Webhook[]>(initialWebhooks)
  const [showApiKey, setShowApiKey] = useState<string | null>(null)
  const [newApiKey, setNewApiKey] = useState({
    name: "",
    service: "",
    permissions: [] as string[],
    expiresAt: "",
  })
  const [newWebhook, setNewWebhook] = useState({
    name: "",
    url: "",
    events: [] as string[],
  })

  const generateApiKey = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let result = "bhv360_"
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  const handleCreateApiKey = () => {
    if (!newApiKey.name || !newApiKey.service) {
      alert("Vul alle verplichte velden in")
      return
    }

    const apiKey: ApiKey = {
      id: Date.now().toString(),
      name: newApiKey.name,
      service: newApiKey.service,
      key: generateApiKey(),
      status: "active",
      permissions: newApiKey.permissions,
      lastUsed: "Nog niet gebruikt",
      createdAt: new Date().toLocaleString(),
      expiresAt: newApiKey.expiresAt || undefined,
      requestCount: 0,
      rateLimit: "1000/hour",
    }

    setApiKeys([...apiKeys, apiKey])
    setNewApiKey({ name: "", service: "", permissions: [], expiresAt: "" })
    alert("API key succesvol aangemaakt!")
  }

  const handleCreateWebhook = () => {
    if (!newWebhook.name || !newWebhook.url || newWebhook.events.length === 0) {
      alert("Vul alle verplichte velden in")
      return
    }

    const webhook: Webhook = {
      id: Date.now().toString(),
      name: newWebhook.name,
      url: newWebhook.url,
      events: newWebhook.events,
      status: "active",
      successRate: 100,
      retryCount: 3,
    }

    setWebhooks([...webhooks, webhook])
    setNewWebhook({ name: "", url: "", events: [] })
    alert("Webhook succesvol aangemaakt!")
  }

  const toggleApiKeyStatus = (id: string) => {
    setApiKeys(
      apiKeys.map((key) => (key.id === id ? { ...key, status: key.status === "active" ? "inactive" : "active" } : key)),
    )
  }

  const toggleWebhookStatus = (id: string) => {
    setWebhooks(
      webhooks.map((webhook) =>
        webhook.id === id ? { ...webhook, status: webhook.status === "active" ? "inactive" : "active" } : webhook,
      ),
    )
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert("Gekopieerd naar klembord!")
  }

  const testWebhook = async (webhook: Webhook) => {
    alert(`Test webhook verzonden naar ${webhook.name}`)
    // In een echte implementatie zou hier een API call komen
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Actief</Badge>
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">Inactief</Badge>
      case "expired":
        return <Badge className="bg-red-100 text-red-800">Verlopen</Badge>
      default:
        return <Badge variant="secondary">Onbekend</Badge>
    }
  }

  return (
    <div className="container p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">API Integraties</h1>
          <p className="text-muted-foreground">Beheer API keys, webhooks en externe integraties</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Instellingen
          </Button>
          <Button>
            <Activity className="h-4 w-4 mr-2" />
            API Logs
          </Button>
        </div>
      </div>

      <Tabs defaultValue="api-keys" className="space-y-6">
        <TabsList>
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="rate-limits">Rate Limits</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="api-keys">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">API Keys</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nieuwe API Key
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Nieuwe API Key Aanmaken</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="api-name">Naam</Label>
                      <Input
                        id="api-name"
                        value={newApiKey.name}
                        onChange={(e) => setNewApiKey({ ...newApiKey, name: e.target.value })}
                        placeholder="Bijv. Weather API Key"
                      />
                    </div>
                    <div>
                      <Label htmlFor="api-service">Service</Label>
                      <Select
                        value={newApiKey.service}
                        onValueChange={(value) => setNewApiKey({ ...newApiKey, service: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecteer service" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableServices.map((service) => (
                            <SelectItem key={service.id} value={service.id}>
                              {service.icon} {service.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Permissions</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {availablePermissions.map((permission) => (
                          <div key={permission} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={permission}
                              checked={newApiKey.permissions.includes(permission)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setNewApiKey({ ...newApiKey, permissions: [...newApiKey.permissions, permission] })
                                } else {
                                  setNewApiKey({
                                    ...newApiKey,
                                    permissions: newApiKey.permissions.filter((p) => p !== permission),
                                  })
                                }
                              }}
                            />
                            <Label htmlFor={permission} className="text-sm">
                              {permission}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="api-expires">Verloopt op (optioneel)</Label>
                      <Input
                        id="api-expires"
                        type="datetime-local"
                        value={newApiKey.expiresAt}
                        onChange={(e) => setNewApiKey({ ...newApiKey, expiresAt: e.target.value })}
                      />
                    </div>
                    <Button onClick={handleCreateApiKey} className="w-full">
                      <Key className="h-4 w-4 mr-2" />
                      API Key Aanmaken
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Naam</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>API Key</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Laatste gebruik</TableHead>
                      <TableHead>Requests</TableHead>
                      <TableHead>Acties</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {apiKeys.map((apiKey) => (
                      <TableRow key={apiKey.id}>
                        <TableCell className="font-medium">{apiKey.name}</TableCell>
                        <TableCell>
                          {availableServices.find((s) => s.id === apiKey.service)?.icon}{" "}
                          {availableServices.find((s) => s.id === apiKey.service)?.name}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <code className="text-sm bg-muted px-2 py-1 rounded">
                              {showApiKey === apiKey.id ? apiKey.key : `${apiKey.key.substring(0, 12)}...`}
                            </code>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setShowApiKey(showApiKey === apiKey.id ? null : apiKey.id)}
                            >
                              {showApiKey === apiKey.id ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => copyToClipboard(apiKey.key)}>
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(apiKey.status)}</TableCell>
                        <TableCell>{apiKey.lastUsed}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{apiKey.requestCount.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">{apiKey.rateLimit}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button size="sm" variant="ghost" onClick={() => toggleApiKeyStatus(apiKey.id)}>
                              {apiKey.status === "active" ? (
                                <AlertCircle className="h-4 w-4" />
                              ) : (
                                <CheckCircle className="h-4 w-4" />
                              )}
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="webhooks">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Webhooks</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nieuwe Webhook
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Nieuwe Webhook Aanmaken</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="webhook-name">Naam</Label>
                      <Input
                        id="webhook-name"
                        value={newWebhook.name}
                        onChange={(e) => setNewWebhook({ ...newWebhook, name: e.target.value })}
                        placeholder="Bijv. Slack Notifications"
                      />
                    </div>
                    <div>
                      <Label htmlFor="webhook-url">Webhook URL</Label>
                      <Input
                        id="webhook-url"
                        value={newWebhook.url}
                        onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })}
                        placeholder="https://hooks.slack.com/services/..."
                      />
                    </div>
                    <div>
                      <Label>Events</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2 max-h-48 overflow-y-auto">
                        {availableEvents.map((event) => (
                          <div key={event} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={event}
                              checked={newWebhook.events.includes(event)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setNewWebhook({ ...newWebhook, events: [...newWebhook.events, event] })
                                } else {
                                  setNewWebhook({
                                    ...newWebhook,
                                    events: newWebhook.events.filter((ev) => ev !== event),
                                  })
                                }
                              }}
                            />
                            <Label htmlFor={event} className="text-sm">
                              {event}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Button onClick={handleCreateWebhook} className="w-full">
                      <Zap className="h-4 w-4 mr-2" />
                      Webhook Aanmaken
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Naam</TableHead>
                      <TableHead>URL</TableHead>
                      <TableHead>Events</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Success Rate</TableHead>
                      <TableHead>Laatste trigger</TableHead>
                      <TableHead>Acties</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {webhooks.map((webhook) => (
                      <TableRow key={webhook.id}>
                        <TableCell className="font-medium">{webhook.name}</TableCell>
                        <TableCell>
                          <code className="text-sm bg-muted px-2 py-1 rounded">
                            {webhook.url.length > 30 ? `${webhook.url.substring(0, 30)}...` : webhook.url}
                          </code>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {webhook.events.slice(0, 2).map((event) => (
                              <Badge key={event} variant="outline" className="text-xs">
                                {event}
                              </Badge>
                            ))}
                            {webhook.events.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{webhook.events.length - 2} meer
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(webhook.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div
                              className={`h-2 w-2 rounded-full ${
                                webhook.successRate >= 95
                                  ? "bg-green-500"
                                  : webhook.successRate >= 80
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                              }`}
                            />
                            <span>{webhook.successRate}%</span>
                          </div>
                        </TableCell>
                        <TableCell>{webhook.lastTriggered || "Nog niet getriggerd"}</TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button size="sm" variant="ghost" onClick={() => testWebhook(webhook)}>
                              <Zap className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => toggleWebhookStatus(webhook.id)}>
                              {webhook.status === "active" ? (
                                <AlertCircle className="h-4 w-4" />
                              ) : (
                                <CheckCircle className="h-4 w-4" />
                              )}
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="rate-limits">
          <Card>
            <CardHeader>
              <CardTitle>Rate Limits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold">1,247</div>
                      <div className="text-sm text-muted-foreground">Requests vandaag</div>
                      <div className="text-xs text-green-600">van 10,000 limiet</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold">89</div>
                      <div className="text-sm text-muted-foreground">Requests dit uur</div>
                      <div className="text-xs text-green-600">van 1,000 limiet</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold">12</div>
                      <div className="text-sm text-muted-foreground">Requests deze minuut</div>
                      <div className="text-xs text-green-600">van 100 limiet</div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>API Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-muted rounded">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="font-mono text-sm">POST /api/incidents</span>
                    <Badge variant="outline">200</Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">2024-01-15 16:45:23</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="font-mono text-sm">GET /api/users</span>
                    <Badge variant="outline">200</Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">2024-01-15 16:44:15</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <span className="font-mono text-sm">POST /api/notifications</span>
                    <Badge variant="destructive">429</Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">2024-01-15 16:43:02</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
