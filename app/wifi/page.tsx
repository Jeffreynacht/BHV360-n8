"use client"

import { useState } from "react"
import { useCustomer } from "@/components/customer-context"
import { NoCustomerSelected } from "@/components/no-customer-selected"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Wifi, WifiOff, Signal, Users, Shield, Settings, Plus, Trash2 } from "lucide-react"

interface WiFiNetwork {
  id: string
  name: string
  password: string
  security: string
  band: string
  channel: number
  isEnabled: boolean
  connectedDevices: number
  signalStrength: number
  isGuest: boolean
}

interface AccessPoint {
  id: string
  name: string
  location: string
  building: string
  floor: string
  ipAddress: string
  status: "online" | "offline" | "warning"
  connectedDevices: number
  signalStrength: number
  lastSeen: string
}

const initialNetworks: WiFiNetwork[] = [
  {
    id: "net-1",
    name: "BedrijfsWiFi-Secure",
    password: "SecurePass2024!",
    security: "WPA3",
    band: "5GHz",
    channel: 36,
    isEnabled: true,
    connectedDevices: 45,
    signalStrength: 85,
    isGuest: false,
  },
  {
    id: "net-2",
    name: "BedrijfsWiFi-Guest",
    password: "GuestAccess123",
    security: "WPA2",
    band: "2.4GHz",
    channel: 6,
    isEnabled: true,
    connectedDevices: 12,
    signalStrength: 78,
    isGuest: true,
  },
  {
    id: "net-3",
    name: "BHV-Emergency",
    password: "Emergency2024",
    security: "WPA3",
    band: "5GHz",
    channel: 149,
    isEnabled: true,
    connectedDevices: 3,
    signalStrength: 92,
    isGuest: false,
  },
]

const initialAccessPoints: AccessPoint[] = [
  {
    id: "ap-1",
    name: "AP-Hoofdgebouw-BG",
    location: "Receptie",
    building: "Hoofdgebouw",
    floor: "Begane Grond",
    ipAddress: "192.168.1.10",
    status: "online",
    connectedDevices: 23,
    signalStrength: 88,
    lastSeen: "Nu online",
  },
  {
    id: "ap-2",
    name: "AP-Hoofdgebouw-1V",
    location: "Vergaderzaal A",
    building: "Hoofdgebouw",
    floor: "1e Verdieping",
    ipAddress: "192.168.1.11",
    status: "online",
    connectedDevices: 15,
    signalStrength: 82,
    lastSeen: "Nu online",
  },
  {
    id: "ap-3",
    name: "AP-Bijgebouw-BG",
    location: "Magazijn",
    building: "Bijgebouw A",
    floor: "Begane Grond",
    ipAddress: "192.168.1.12",
    status: "warning",
    connectedDevices: 7,
    signalStrength: 65,
    lastSeen: "5 minuten geleden",
  },
  {
    id: "ap-4",
    name: "AP-Parkeergarage-N1",
    location: "Sector A",
    building: "Parkeergarage",
    floor: "Niveau -1",
    ipAddress: "192.168.1.13",
    status: "offline",
    connectedDevices: 0,
    signalStrength: 0,
    lastSeen: "2 uur geleden",
  },
]

export default function WiFiPage() {
  const { selectedCustomer } = useCustomer()
  const [networks, setNetworks] = useState<WiFiNetwork[]>(initialNetworks)
  const [accessPoints, setAccessPoints] = useState<AccessPoint[]>(initialAccessPoints)
  const [newNetwork, setNewNetwork] = useState({
    name: "",
    password: "",
    security: "WPA3",
    band: "5GHz",
    channel: 36,
    isGuest: false,
  })

  if (!selectedCustomer) {
    return <NoCustomerSelected />
  }

  const toggleNetworkStatus = (networkId: string) => {
    setNetworks((prev) =>
      prev.map((network) => (network.id === networkId ? { ...network, isEnabled: !network.isEnabled } : network)),
    )
    // Simulate API call
    setTimeout(() => {
      alert(
        `Netwerk ${networks.find((n) => n.id === networkId)?.name} ${networks.find((n) => n.id === networkId)?.isEnabled ? "uitgeschakeld" : "ingeschakeld"}`,
      )
    }, 500)
  }

  const addNetwork = () => {
    if (!newNetwork.name.trim()) {
      alert("Netwerknaam is verplicht")
      return
    }
    if (!newNetwork.password.trim() || newNetwork.password.length < 8) {
      alert("Wachtwoord moet minimaal 8 karakters zijn")
      return
    }

    const network: WiFiNetwork = {
      id: `net-${Date.now()}`,
      ...newNetwork,
      connectedDevices: 0,
      signalStrength: Math.floor(Math.random() * 40) + 60, // Random signal 60-100%
      isEnabled: true,
    }
    setNetworks((prev) => [...prev, network])
    setNewNetwork({
      name: "",
      password: "",
      security: "WPA3",
      band: "5GHz",
      channel: 36,
      isGuest: false,
    })
    alert(`WiFi netwerk "${network.name}" succesvol toegevoegd!`)
  }

  const removeNetwork = (networkId: string) => {
    setNetworks(networks.filter((network) => network.id !== networkId))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "warning":
        return "bg-orange-500"
      case "offline":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getSignalIcon = (strength: number) => {
    if (strength >= 80) return <Signal className="h-4 w-4 text-green-500" />
    if (strength >= 60) return <Signal className="h-4 w-4 text-orange-500" />
    if (strength >= 40) return <Signal className="h-4 w-4 text-red-500" />
    return <WifiOff className="h-4 w-4 text-gray-500" />
  }

  const totalDevices = networks.reduce((sum, network) => sum + network.connectedDevices, 0)
  const activeNetworks = networks.filter((network) => network.isEnabled).length
  const onlineAccessPoints = accessPoints.filter((ap) => ap.status === "online").length

  return (
    <div className="container p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">WiFi Beheer</h1>
        <p className="text-muted-foreground">Beheer WiFi netwerken en access points voor {selectedCustomer.name}</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Totaal Apparaten</p>
                <p className="text-2xl font-bold">{totalDevices}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Actieve Netwerken</p>
                <p className="text-2xl font-bold">{activeNetworks}</p>
              </div>
              <Wifi className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Online Access Points</p>
                <p className="text-2xl font-bold">
                  {onlineAccessPoints}/{accessPoints.length}
                </p>
              </div>
              <Signal className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Beveiliging</p>
                <p className="text-2xl font-bold">WPA3</p>
              </div>
              <Shield className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="networks" className="space-y-6">
        <TabsList>
          <TabsTrigger value="networks">WiFi Netwerken</TabsTrigger>
          <TabsTrigger value="access-points">Access Points</TabsTrigger>
          <TabsTrigger value="settings">Instellingen</TabsTrigger>
        </TabsList>

        <TabsContent value="networks" className="space-y-6">
          {/* Add New Network */}
          <Card>
            <CardHeader>
              <CardTitle>Nieuw WiFi Netwerk Toevoegen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="network-name">Netwerknaam</Label>
                  <Input
                    id="network-name"
                    value={newNetwork.name}
                    onChange={(e) => setNewNetwork({ ...newNetwork, name: e.target.value })}
                    placeholder="Bijv. BedrijfsWiFi"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="network-password">Wachtwoord</Label>
                  <Input
                    id="network-password"
                    type="password"
                    value={newNetwork.password}
                    onChange={(e) => setNewNetwork({ ...newNetwork, password: e.target.value })}
                    placeholder="Sterk wachtwoord"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="network-security">Beveiliging</Label>
                  <Select
                    value={newNetwork.security}
                    onValueChange={(value) => setNewNetwork({ ...newNetwork, security: value })}
                  >
                    <SelectTrigger id="network-security">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="WPA3">WPA3</SelectItem>
                      <SelectItem value="WPA2">WPA2</SelectItem>
                      <SelectItem value="WEP">WEP (niet aanbevolen)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="network-band">Frequentieband</Label>
                  <Select
                    value={newNetwork.band}
                    onValueChange={(value) => setNewNetwork({ ...newNetwork, band: value })}
                  >
                    <SelectTrigger id="network-band">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2.4GHz">2.4GHz</SelectItem>
                      <SelectItem value="5GHz">5GHz</SelectItem>
                      <SelectItem value="6GHz">6GHz</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="network-channel">Kanaal</Label>
                  <Input
                    id="network-channel"
                    type="number"
                    value={newNetwork.channel}
                    onChange={(e) => setNewNetwork({ ...newNetwork, channel: Number.parseInt(e.target.value) })}
                    min="1"
                    max="165"
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={addNetwork} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Toevoegen
                  </Button>
                </div>
              </div>
              <div className="flex items-center space-x-2 mt-4">
                <Switch
                  id="guest-network"
                  checked={newNetwork.isGuest}
                  onCheckedChange={(checked) => setNewNetwork({ ...newNetwork, isGuest: checked })}
                />
                <Label htmlFor="guest-network">Gastnetwerk</Label>
              </div>
            </CardContent>
          </Card>

          {/* Networks List */}
          <Card>
            <CardHeader>
              <CardTitle>WiFi Netwerken</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {networks.map((network) => (
                  <div key={network.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {network.isEnabled ? (
                          <Wifi className="h-5 w-5 text-green-500" />
                        ) : (
                          <WifiOff className="h-5 w-5 text-gray-500" />
                        )}
                        <div>
                          <h3 className="font-medium">{network.name}</h3>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <span>{network.security}</span>
                            <span>•</span>
                            <span>{network.band}</span>
                            <span>•</span>
                            <span>Kanaal {network.channel}</span>
                            {network.isGuest && (
                              <>
                                <span>•</span>
                                <Badge variant="secondary">Gast</Badge>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">{network.connectedDevices} apparaten</p>
                        <div className="flex items-center space-x-1">
                          {getSignalIcon(network.signalStrength)}
                          <span className="text-sm text-muted-foreground">{network.signalStrength}%</span>
                        </div>
                      </div>
                      <Switch checked={network.isEnabled} onCheckedChange={() => toggleNetworkStatus(network.id)} />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeNetwork(network.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="access-points" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Access Points</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {accessPoints.map((ap) => (
                  <div key={ap.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(ap.status)}`} />
                      <div>
                        <h3 className="font-medium">{ap.name}</h3>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>{ap.building}</span>
                          <span>•</span>
                          <span>{ap.floor}</span>
                          <span>•</span>
                          <span>{ap.location}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{ap.ipAddress}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{ap.connectedDevices} apparaten</p>
                      <div className="flex items-center justify-end space-x-1">
                        {getSignalIcon(ap.signalStrength)}
                        <span className="text-sm text-muted-foreground">{ap.signalStrength}%</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{ap.lastSeen}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>WiFi Instellingen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Algemene Instellingen</h3>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-channel">Automatische kanaal selectie</Label>
                    <Switch id="auto-channel" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="band-steering">Band steering</Label>
                    <Switch id="band-steering" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="load-balancing">Load balancing</Label>
                    <Switch id="load-balancing" defaultChecked />
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Beveiliging</h3>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="wps-enabled">WPS ingeschakeld</Label>
                    <Switch id="wps-enabled" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="mac-filtering">MAC adres filtering</Label>
                    <Switch id="mac-filtering" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="guest-isolation">Gast isolatie</Label>
                    <Switch id="guest-isolation" defaultChecked />
                  </div>
                </div>
              </div>
              <div className="pt-4">
                <Button>
                  <Settings className="h-4 w-4 mr-2" />
                  Instellingen Opslaan
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
