"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Wifi,
  Signal,
  Settings,
  Users,
  Activity,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Router,
  Smartphone,
  Laptop,
  Tablet,
  Monitor,
  Clock,
  BarChart3,
  TrendingUp,
} from "lucide-react"

interface WifiNetwork {
  id: string
  name: string
  signal: number
  security: "WPA2" | "WPA3" | "Open"
  frequency: "2.4GHz" | "5GHz"
  connected: boolean
  password?: string
}

interface ConnectedDevice {
  id: string
  name: string
  type: "smartphone" | "laptop" | "tablet" | "desktop"
  ip: string
  mac: string
  connected: string
  bandwidth: number
}

interface NetworkStats {
  totalDevices: number
  activeDevices: number
  totalBandwidth: number
  usedBandwidth: number
  uptime: string
}

export default function WiFiPage() {
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [password, setPassword] = useState("")

  // Mock data for WiFi networks
  const [wifiNetworks, setWifiNetworks] = useState<WifiNetwork[]>([
    {
      id: "1",
      name: "BHV360-Office",
      signal: 95,
      security: "WPA3",
      frequency: "5GHz",
      connected: true,
      password: "BHV360Secure2024!",
    },
    {
      id: "2",
      name: "BHV360-Guest",
      signal: 88,
      security: "WPA2",
      frequency: "2.4GHz",
      connected: false,
      password: "GuestAccess123",
    },
    {
      id: "3",
      name: "BHV360-IoT",
      signal: 76,
      security: "WPA2",
      frequency: "2.4GHz",
      connected: false,
      password: "IoTDevices2024",
    },
    {
      id: "4",
      name: "Neighbor_WiFi",
      signal: 45,
      security: "WPA2",
      frequency: "2.4GHz",
      connected: false,
    },
    {
      id: "5",
      name: "Public_Hotspot",
      signal: 32,
      security: "Open",
      frequency: "2.4GHz",
      connected: false,
    },
  ])

  // Mock data for connected devices
  const connectedDevices: ConnectedDevice[] = [
    {
      id: "1",
      name: "iPhone 15 Pro",
      type: "smartphone",
      ip: "192.168.1.101",
      mac: "AA:BB:CC:DD:EE:01",
      connected: "2 uur geleden",
      bandwidth: 25.6,
    },
    {
      id: "2",
      name: "MacBook Pro",
      type: "laptop",
      ip: "192.168.1.102",
      mac: "AA:BB:CC:DD:EE:02",
      connected: "5 minuten geleden",
      bandwidth: 156.8,
    },
    {
      id: "3",
      name: "iPad Air",
      type: "tablet",
      ip: "192.168.1.103",
      mac: "AA:BB:CC:DD:EE:03",
      connected: "1 uur geleden",
      bandwidth: 45.2,
    },
    {
      id: "4",
      name: "Desktop PC",
      type: "desktop",
      ip: "192.168.1.104",
      mac: "AA:BB:CC:DD:EE:04",
      connected: "30 minuten geleden",
      bandwidth: 89.4,
    },
  ]

  // Mock network statistics
  const networkStats: NetworkStats = {
    totalDevices: 12,
    activeDevices: 8,
    totalBandwidth: 1000,
    usedBandwidth: 317,
    uptime: "15 dagen, 8 uur",
  }

  const handleScanNetworks = () => {
    setIsScanning(true)
    setTimeout(() => {
      setIsScanning(false)
      // Simulate finding new networks or updating signal strength
    }, 3000)
  }

  const handleConnectNetwork = (networkId: string) => {
    const network = wifiNetworks.find((n) => n.id === networkId)
    if (network && network.security !== "Open" && !password) {
      alert("Voer het wachtwoord in")
      return
    }

    // Simulate connection
    setWifiNetworks((prev) =>
      prev.map((network) => ({
        ...network,
        connected: network.id === networkId,
      })),
    )
    setPassword("")
    setSelectedNetwork(null)
  }

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "smartphone":
        return <Smartphone className="w-5 h-5" />
      case "laptop":
        return <Laptop className="w-5 h-5" />
      case "tablet":
        return <Tablet className="w-5 h-5" />
      case "desktop":
        return <Monitor className="w-5 h-5" />
      default:
        return <Router className="w-5 h-5" />
    }
  }

  const getSignalIcon = (signal: number) => {
    if (signal >= 80) return <Signal className="w-5 h-5 text-green-500" />
    if (signal >= 60) return <Signal className="w-5 h-5 text-yellow-500" />
    if (signal >= 40) return <Signal className="w-5 h-5 text-orange-500" />
    return <Signal className="w-5 h-5 text-red-500" />
  }

  const getSecurityIcon = (security: string) => {
    if (security === "Open") return <Unlock className="w-4 h-4 text-red-500" />
    return <Lock className="w-4 h-4 text-green-500" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
              <Wifi className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">WiFi Beheer</h1>
              <p className="text-gray-600">Beheer netwerkverbindingen en apparaten</p>
            </div>
          </div>

          {/* Network Status */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Verbonden Apparaten</p>
                    <p className="text-2xl font-bold text-gray-900">{networkStats.activeDevices}</p>
                  </div>
                  <Users className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Bandbreedte Gebruik</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {Math.round((networkStats.usedBandwidth / networkStats.totalBandwidth) * 100)}%
                    </p>
                  </div>
                  <Activity className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Netwerk Uptime</p>
                    <p className="text-lg font-bold text-gray-900">{networkStats.uptime}</p>
                  </div>
                  <Clock className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Netwerk Status</p>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium text-green-600">Online</span>
                    </div>
                  </div>
                  <Router className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="networks" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-lg">
            <TabsTrigger value="networks" className="flex items-center space-x-2">
              <Wifi className="w-4 h-4" />
              <span>Netwerken</span>
            </TabsTrigger>
            <TabsTrigger value="devices" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Apparaten</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Instellingen</span>
            </TabsTrigger>
          </TabsList>

          {/* Networks Tab */}
          <TabsContent value="networks" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Beschikbare Netwerken</h2>
              <Button
                onClick={handleScanNetworks}
                disabled={isScanning}
                className="bg-gradient-to-r from-blue-500 to-green-500 text-white"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isScanning ? "animate-spin" : ""}`} />
                {isScanning ? "Scannen..." : "Scan Netwerken"}
              </Button>
            </div>

            <div className="grid gap-4">
              {wifiNetworks.map((network) => (
                <Card
                  key={network.id}
                  className={`shadow-lg hover:shadow-xl transition-all duration-300 border-0 cursor-pointer ${
                    network.connected
                      ? "bg-gradient-to-r from-green-50 to-blue-50 ring-2 ring-green-500"
                      : "bg-white hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50"
                  }`}
                  onClick={() => setSelectedNetwork(selectedNetwork === network.id ? null : network.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {getSignalIcon(network.signal)}
                          {network.connected && <CheckCircle className="w-5 h-5 text-green-500" />}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{network.name}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="flex items-center space-x-1">
                              {getSecurityIcon(network.security)}
                              <span>{network.security}</span>
                            </span>
                            <span>{network.frequency}</span>
                            <span>Signaal: {network.signal}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {network.connected && <Badge className="bg-green-100 text-green-800">Verbonden</Badge>}
                        <Badge variant="outline">{network.frequency}</Badge>
                      </div>
                    </div>

                    {selectedNetwork === network.id && !network.connected && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        {network.security !== "Open" && (
                          <div className="space-y-3">
                            <Label htmlFor="password">Wachtwoord</Label>
                            <div className="flex space-x-2">
                              <div className="relative flex-1">
                                <Input
                                  id="password"
                                  type={showPassword ? "text" : "password"}
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  placeholder="Voer wachtwoord in"
                                  className="pr-10"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-0 top-0 h-full px-3"
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </Button>
                              </div>
                              <Button
                                onClick={() => handleConnectNetwork(network.id)}
                                className="bg-gradient-to-r from-blue-500 to-green-500 text-white"
                              >
                                Verbinden
                              </Button>
                            </div>
                          </div>
                        )}
                        {network.security === "Open" && (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 text-orange-600">
                              <AlertTriangle className="w-4 h-4" />
                              <span className="text-sm">Open netwerk - niet beveiligd</span>
                            </div>
                            <Button
                              onClick={() => handleConnectNetwork(network.id)}
                              className="bg-gradient-to-r from-blue-500 to-green-500 text-white"
                            >
                              Verbinden
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Devices Tab */}
          <TabsContent value="devices" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Verbonden Apparaten</h2>

            <div className="grid gap-4">
              {connectedDevices.map((device) => (
                <Card
                  key={device.id}
                  className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-r from-green-50 to-blue-50"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center text-white">
                          {getDeviceIcon(device.type)}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{device.name}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>IP: {device.ip}</span>
                            <span>MAC: {device.mac}</span>
                            <span>Verbonden: {device.connected}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900">{device.bandwidth} Mbps</div>
                        <div className="text-sm text-gray-600">Bandbreedte</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Netwerk Analytics</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    <span>Bandbreedte Gebruik</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Gebruikt</span>
                      <span className="text-sm font-medium">{networkStats.usedBandwidth} Mbps</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                        style={{
                          width: `${(networkStats.usedBandwidth / networkStats.totalBandwidth) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>0 Mbps</span>
                      <span>{networkStats.totalBandwidth} Mbps</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-blue-500" />
                    <span>Apparaat Activiteit</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Actief</span>
                      <span className="text-sm font-medium">{networkStats.activeDevices}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
                        style={{
                          width: `${(networkStats.activeDevices / networkStats.totalDevices) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>0</span>
                      <span>{networkStats.totalDevices} apparaten</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-purple-500" />
                    <span>Netwerk Uptime</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-2">{networkStats.uptime}</div>
                    <div className="text-sm text-gray-600">Zonder onderbreking</div>
                    <div className="mt-4">
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Stabiel
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">WiFi Instellingen</h2>

            <div className="grid gap-6">
              <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-blue-50">
                <CardHeader>
                  <CardTitle>Netwerk Configuratie</CardTitle>
                  <CardDescription>Beheer je WiFi netwerk instellingen</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="network-name">Netwerk Naam (SSID)</Label>
                      <Input id="network-name" defaultValue="BHV360-Office" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="network-password">Wachtwoord</Label>
                      <Input id="network-password" type="password" defaultValue="BHV360Secure2024!" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="security-type">Beveiliging</Label>
                      <select
                        id="security-type"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        defaultValue="WPA3"
                      >
                        <option value="WPA3">WPA3</option>
                        <option value="WPA2">WPA2</option>
                        <option value="Open">Open</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="frequency">Frequentie</Label>
                      <select
                        id="frequency"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        defaultValue="5GHz"
                      >
                        <option value="5GHz">5GHz</option>
                        <option value="2.4GHz">2.4GHz</option>
                        <option value="Dual">Dual Band</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-blue-50">
                <CardHeader>
                  <CardTitle>Geavanceerde Instellingen</CardTitle>
                  <CardDescription>Configureer geavanceerde netwerk opties</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="guest-network">Gast Netwerk</Label>
                      <p className="text-sm text-gray-600">Schakel een apart gast netwerk in</p>
                    </div>
                    <Switch id="guest-network" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="bandwidth-limit">Bandbreedte Limiet</Label>
                      <p className="text-sm text-gray-600">Beperk bandbreedte per apparaat</p>
                    </div>
                    <Switch id="bandwidth-limit" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="access-control">Toegangscontrole</Label>
                      <p className="text-sm text-gray-600">Beheer welke apparaten kunnen verbinden</p>
                    </div>
                    <Switch id="access-control" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="auto-disconnect">Automatisch Verbreken</Label>
                      <p className="text-sm text-gray-600">Verbreek inactieve verbindingen automatisch</p>
                    </div>
                    <Switch id="auto-disconnect" />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end space-x-4">
                <Button variant="outline">Annuleren</Button>
                <Button className="bg-gradient-to-r from-green-500 to-blue-500 text-white">Instellingen Opslaan</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
