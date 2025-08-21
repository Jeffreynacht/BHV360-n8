"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Heart,
  Battery,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Settings,
  Activity,
  RefreshCw,
  Download,
  Bell,
  User,
  Wrench,
  BarChart3,
  TrendingUp,
  AlertCircle,
} from "lucide-react"

interface AEDDevice {
  id: string
  serialNumber: string
  location: string
  floor: string
  batteryLevel: number
  lastCheck: string
  status: "operational" | "maintenance" | "critical" | "offline"
  nextMaintenance: string
  lastMaintenance: string
  model: string
  manufacturer: string
  installDate: string
  responsiblePerson: string
  notes?: string
}

interface MaintenanceRecord {
  id: string
  aedId: string
  date: string
  type: "routine" | "repair" | "battery" | "pads" | "calibration"
  technician: string
  description: string
  status: "completed" | "pending" | "scheduled"
  cost?: number
}

interface AEDAlert {
  id: string
  aedId: string
  type: "battery_low" | "maintenance_due" | "offline" | "error"
  message: string
  severity: "low" | "medium" | "high" | "critical"
  timestamp: string
  acknowledged: boolean
}

export default function AEDMonitoringPage() {
  const [selectedAED, setSelectedAED] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Mock data for AED devices
  const [aedDevices, setAEDDevices] = useState<AEDDevice[]>([
    {
      id: "1",
      serialNumber: "AED-001-2024",
      location: "Hoofdingang",
      floor: "Begane grond",
      batteryLevel: 95,
      lastCheck: "2024-01-15 14:30",
      status: "operational",
      nextMaintenance: "2024-03-15",
      lastMaintenance: "2023-12-15",
      model: "HeartStart FRx",
      manufacturer: "Philips",
      installDate: "2023-06-01",
      responsiblePerson: "Jan de Vries",
      notes: "Locatie goed zichtbaar, regelmatig gecontroleerd",
    },
    {
      id: "2",
      serialNumber: "AED-002-2024",
      location: "Kantine",
      floor: "1e verdieping",
      batteryLevel: 78,
      lastCheck: "2024-01-14 09:15",
      status: "operational",
      nextMaintenance: "2024-02-28",
      lastMaintenance: "2023-11-28",
      model: "LIFEPAK CR2",
      manufacturer: "Physio-Control",
      installDate: "2023-05-15",
      responsiblePerson: "Maria Janssen",
    },
    {
      id: "3",
      serialNumber: "AED-003-2024",
      location: "Sporthal",
      floor: "Begane grond",
      batteryLevel: 45,
      lastCheck: "2024-01-12 16:45",
      status: "maintenance",
      nextMaintenance: "2024-01-20",
      lastMaintenance: "2023-10-20",
      model: "AED Plus",
      manufacturer: "ZOLL",
      installDate: "2023-04-10",
      responsiblePerson: "Peter van der Berg",
      notes: "Batterij vervangen nodig, onderhoud gepland",
    },
    {
      id: "4",
      serialNumber: "AED-004-2024",
      location: "Parkeergarage",
      floor: "Ondergronds",
      batteryLevel: 15,
      lastCheck: "2024-01-10 11:20",
      status: "critical",
      nextMaintenance: "2024-01-18",
      lastMaintenance: "2023-09-18",
      model: "HeartStart OnSite",
      manufacturer: "Philips",
      installDate: "2023-03-20",
      responsiblePerson: "Lisa de Jong",
      notes: "URGENT: Batterij bijna leeg, directe actie vereist",
    },
    {
      id: "5",
      serialNumber: "AED-005-2024",
      location: "Vergaderzaal A",
      floor: "2e verdieping",
      batteryLevel: 0,
      lastCheck: "2024-01-08 13:00",
      status: "offline",
      nextMaintenance: "2024-01-16",
      lastMaintenance: "2023-08-16",
      model: "LIFEPAK CR Plus",
      manufacturer: "Physio-Control",
      installDate: "2023-02-28",
      responsiblePerson: "Tom Bakker",
      notes: "Apparaat offline, technische storing",
    },
  ])

  // Mock maintenance records
  const maintenanceRecords: MaintenanceRecord[] = [
    {
      id: "1",
      aedId: "1",
      date: "2023-12-15",
      type: "routine",
      technician: "Service Team Alpha",
      description: "Routine onderhoud en batterij controle",
      status: "completed",
      cost: 125,
    },
    {
      id: "2",
      aedId: "2",
      date: "2024-02-28",
      type: "battery",
      technician: "Service Team Beta",
      description: "Batterij vervanging gepland",
      status: "scheduled",
      cost: 89,
    },
    {
      id: "3",
      aedId: "3",
      date: "2024-01-20",
      type: "repair",
      technician: "Service Team Alpha",
      description: "Batterij vervanging en systeem check",
      status: "pending",
      cost: 156,
    },
    {
      id: "4",
      aedId: "4",
      date: "2024-01-18",
      type: "battery",
      technician: "Emergency Service",
      description: "URGENT: Batterij vervanging",
      status: "scheduled",
      cost: 89,
    },
  ]

  // Mock alerts
  const [alerts, setAlerts] = useState<AEDAlert[]>([
    {
      id: "1",
      aedId: "4",
      type: "battery_low",
      message: "Batterij niveau kritiek laag (15%)",
      severity: "critical",
      timestamp: "2024-01-15 10:30",
      acknowledged: false,
    },
    {
      id: "2",
      aedId: "5",
      type: "offline",
      message: "AED apparaat offline sinds 2 dagen",
      severity: "high",
      timestamp: "2024-01-14 08:15",
      acknowledged: false,
    },
    {
      id: "3",
      aedId: "3",
      type: "maintenance_due",
      message: "Onderhoud gepland voor morgen",
      severity: "medium",
      timestamp: "2024-01-14 14:00",
      acknowledged: true,
    },
    {
      id: "4",
      aedId: "2",
      type: "maintenance_due",
      message: "Onderhoud vervalt over 2 weken",
      severity: "low",
      timestamp: "2024-01-13 09:00",
      acknowledged: true,
    },
  ])

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
      // Simulate data refresh
    }, 2000)
  }

  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, acknowledged: true } : alert)))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "bg-green-100 text-green-800"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800"
      case "critical":
        return "bg-red-100 text-red-800"
      case "offline":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "maintenance":
        return <Wrench className="w-4 h-4 text-yellow-500" />
      case "critical":
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      case "offline":
        return <AlertCircle className="w-4 h-4 text-gray-500" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />
    }
  }

  const getBatteryColor = (level: number) => {
    if (level >= 80) return "text-green-500"
    if (level >= 50) return "text-yellow-500"
    if (level >= 20) return "text-orange-500"
    return "text-red-500"
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Statistics
  const totalAEDs = aedDevices.length
  const operationalAEDs = aedDevices.filter((aed) => aed.status === "operational").length
  const criticalAEDs = aedDevices.filter((aed) => aed.status === "critical" || aed.status === "offline").length
  const maintenanceAEDs = aedDevices.filter((aed) => aed.status === "maintenance").length
  const unacknowledgedAlerts = alerts.filter((alert) => !alert.acknowledged).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">AED Monitoring</h1>
                <p className="text-gray-600">Real-time monitoring van alle AED apparaten</p>
              </div>
            </div>
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="bg-gradient-to-r from-red-500 to-blue-500 text-white"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              {isRefreshing ? "Vernieuwen..." : "Vernieuwen"}
            </Button>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Totaal AEDs</p>
                    <p className="text-2xl font-bold text-gray-900">{totalAEDs}</p>
                  </div>
                  <Heart className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Operationeel</p>
                    <p className="text-2xl font-bold text-green-600">{operationalAEDs}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Onderhoud</p>
                    <p className="text-2xl font-bold text-yellow-600">{maintenanceAEDs}</p>
                  </div>
                  <Wrench className="w-8 h-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Kritiek</p>
                    <p className="text-2xl font-bold text-red-600">{criticalAEDs}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Alerts</p>
                    <p className="text-2xl font-bold text-orange-600">{unacknowledgedAlerts}</p>
                  </div>
                  <Bell className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="devices" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-lg">
            <TabsTrigger value="devices" className="flex items-center space-x-2">
              <Heart className="w-4 h-4" />
              <span>AED Apparaten</span>
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center space-x-2">
              <Bell className="w-4 h-4" />
              <span>Alerts ({unacknowledgedAlerts})</span>
            </TabsTrigger>
            <TabsTrigger value="maintenance" className="flex items-center space-x-2">
              <Wrench className="w-4 h-4" />
              <span>Onderhoud</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </TabsTrigger>
          </TabsList>

          {/* Devices Tab */}
          <TabsContent value="devices" className="space-y-6">
            <div className="grid gap-4">
              {aedDevices.map((aed) => (
                <Card
                  key={aed.id}
                  className={`shadow-lg hover:shadow-xl transition-all duration-300 border-0 cursor-pointer bg-gradient-to-r from-green-50 to-blue-50 hover:from-green-100 hover:to-blue-100 ${
                    selectedAED === aed.id ? "ring-2 ring-blue-500" : ""
                  }`}
                  onClick={() => setSelectedAED(selectedAED === aed.id ? null : aed.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-blue-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                          <Heart className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{aed.serialNumber}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>
                                {aed.location} - {aed.floor}
                              </span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <User className="w-4 h-4" />
                              <span>{aed.responsiblePerson}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className={`flex items-center space-x-1 ${getBatteryColor(aed.batteryLevel)}`}>
                            <Battery className="w-4 h-4" />
                            <span className="text-sm font-medium">{aed.batteryLevel}%</span>
                          </div>
                          <div className="text-xs text-gray-500">Batterij</div>
                        </div>
                        <Badge className={getStatusColor(aed.status)}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(aed.status)}
                            <span className="capitalize">{aed.status}</span>
                          </div>
                        </Badge>
                      </div>
                    </div>

                    {selectedAED === aed.id && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div>
                            <Label className="text-sm font-medium text-gray-700">Model</Label>
                            <p className="text-sm text-gray-900">{aed.model}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-700">Fabrikant</Label>
                            <p className="text-sm text-gray-900">{aed.manufacturer}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-700">Installatie Datum</Label>
                            <p className="text-sm text-gray-900">{aed.installDate}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-700">Laatste Controle</Label>
                            <p className="text-sm text-gray-900">{aed.lastCheck}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-700">Laatste Onderhoud</Label>
                            <p className="text-sm text-gray-900">{aed.lastMaintenance}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-700">Volgend Onderhoud</Label>
                            <p className="text-sm text-gray-900">{aed.nextMaintenance}</p>
                          </div>
                        </div>
                        {aed.notes && (
                          <div className="mt-4">
                            <Label className="text-sm font-medium text-gray-700">Opmerkingen</Label>
                            <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg mt-1">{aed.notes}</p>
                          </div>
                        )}
                        <div className="flex justify-end space-x-2 mt-4">
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Rapport
                          </Button>
                          <Button size="sm" className="bg-gradient-to-r from-red-500 to-blue-500 text-white">
                            <Settings className="w-4 h-4 mr-2" />
                            Beheren
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Actieve Alerts</h2>

            <div className="grid gap-4">
              {alerts.map((alert) => {
                const aed = aedDevices.find((d) => d.id === alert.aedId)
                return (
                  <Card
                    key={alert.id}
                    className={`shadow-lg border-0 ${
                      alert.acknowledged ? "opacity-60" : ""
                    } bg-gradient-to-r from-red-50 to-blue-50`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              alert.severity === "critical"
                                ? "bg-red-500"
                                : alert.severity === "high"
                                  ? "bg-orange-500"
                                  : alert.severity === "medium"
                                    ? "bg-yellow-500"
                                    : "bg-blue-500"
                            }`}
                          />
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{alert.message}</h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span>AED: {aed?.serialNumber}</span>
                              <span>Locatie: {aed?.location}</span>
                              <span>{alert.timestamp}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getSeverityColor(alert.severity)}>{alert.severity.toUpperCase()}</Badge>
                          {!alert.acknowledged && (
                            <Button
                              size="sm"
                              onClick={() => handleAcknowledgeAlert(alert.id)}
                              className="bg-gradient-to-r from-green-500 to-blue-500 text-white"
                            >
                              Bevestigen
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* Maintenance Tab */}
          <TabsContent value="maintenance" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Onderhoud Planning</h2>

            <div className="grid gap-4">
              {maintenanceRecords.map((record) => {
                const aed = aedDevices.find((d) => d.id === record.aedId)
                return (
                  <Card key={record.id} className="shadow-lg border-0 bg-gradient-to-r from-green-50 to-blue-50">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                            <Wrench className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{record.description}</h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span>AED: {aed?.serialNumber}</span>
                              <span>Technicus: {record.technician}</span>
                              <span>Datum: {record.date}</span>
                              {record.cost && <span>Kosten: €{record.cost}</span>}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge
                            className={
                              record.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : record.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-blue-100 text-blue-800"
                            }
                          >
                            {record.status === "completed"
                              ? "Voltooid"
                              : record.status === "pending"
                                ? "In behandeling"
                                : "Gepland"}
                          </Badge>
                          <Badge variant="outline" className="capitalize">
                            {record.type}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">AED Analytics</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-green-500" />
                    <span>Beschikbaarheid</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {Math.round((operationalAEDs / totalAEDs) * 100)}%
                    </div>
                    <div className="text-sm text-gray-600">AEDs operationeel</div>
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                          style={{ width: `${(operationalAEDs / totalAEDs) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Battery className="w-5 h-5 text-blue-500" />
                    <span>Gemiddelde Batterij</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {Math.round(aedDevices.reduce((sum, aed) => sum + aed.batteryLevel, 0) / aedDevices.length)}%
                    </div>
                    <div className="text-sm text-gray-600">Batterij niveau</div>
                    <div className="mt-4 space-y-2">
                      {aedDevices.map((aed) => (
                        <div key={aed.id} className="flex items-center justify-between text-xs">
                          <span>{aed.serialNumber}</span>
                          <span className={getBatteryColor(aed.batteryLevel)}>{aed.batteryLevel}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-purple-500" />
                    <span>Onderhoud Trend</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Deze maand</span>
                      <span className="text-sm font-medium">3 onderhoud</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Volgende maand</span>
                      <span className="text-sm font-medium">2 gepland</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Gemiddelde kosten</span>
                      <span className="text-sm font-medium">€115</span>
                    </div>
                    <div className="mt-4">
                      <Badge className="bg-green-100 text-green-800">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Binnen planning
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
