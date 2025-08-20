"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Heart,
  MapPin,
  Battery,
  AlertTriangle,
  CheckCircle,
  Clock,
  Wrench,
  Calendar,
  Activity,
  Phone,
} from "lucide-react"
import { useCustomer } from "@/components/customer-context"

type AEDStatus = "operational" | "maintenance" | "error" | "offline"

type AEDDevice = {
  id: string
  serialNumber: string
  model: string
  manufacturer: string
  location: string
  floor: string
  zone: string
  status: AEDStatus
  batteryLevel: number
  lastSelfTest: Date
  nextMaintenance: Date
  lastMaintenance: Date
  electrodeExpiry: Date
  batteryExpiry: Date
  totalUses: number
  lastUsed?: Date
  coordinates: { x: number; y: number }
  responsiblePerson: string
  emergencyContact: string
  notes: string
}

type MaintenanceRecord = {
  id: string
  aedId: string
  date: Date
  type: "routine" | "repair" | "replacement" | "inspection"
  technician: string
  description: string
  partsReplaced: string[]
  cost: number
  nextDue: Date
}

export default function AEDMonitoringPage() {
  const { selectedCustomer } = useCustomer()
  const [aedDevices, setAedDevices] = useState<AEDDevice[]>([])
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([])
  const [selectedAED, setSelectedAED] = useState<AEDDevice | null>(null)

  // Dummy data
  useEffect(() => {
    if (selectedCustomer) {
      setAedDevices([
        {
          id: "aed-001",
          serialNumber: "AED2024001",
          model: "HeartStart FRx",
          manufacturer: "Philips",
          location: "Hoofdingang Receptie",
          floor: "Begane grond",
          zone: "Zone A",
          status: "operational",
          batteryLevel: 87,
          lastSelfTest: new Date("2024-01-20"),
          nextMaintenance: new Date("2024-06-15"),
          lastMaintenance: new Date("2023-12-15"),
          electrodeExpiry: new Date("2025-03-20"),
          batteryExpiry: new Date("2025-08-15"),
          totalUses: 3,
          lastUsed: new Date("2023-11-08"),
          coordinates: { x: 150, y: 200 },
          responsiblePerson: "Jan Jansen",
          emergencyContact: "06-12345678",
          notes: "Regelmatige controles uitgevoerd",
        },
        {
          id: "aed-002",
          serialNumber: "AED2024002",
          model: "LIFEPAK CR2",
          manufacturer: "Stryker",
          location: "Kantine Verdieping 1",
          floor: "Verdieping 1",
          zone: "Zone B",
          status: "maintenance",
          batteryLevel: 45,
          lastSelfTest: new Date("2024-01-18"),
          nextMaintenance: new Date("2024-02-01"),
          lastMaintenance: new Date("2023-11-20"),
          electrodeExpiry: new Date("2024-12-10"),
          batteryExpiry: new Date("2024-09-30"),
          totalUses: 1,
          coordinates: { x: 300, y: 150 },
          responsiblePerson: "Petra de Vries",
          emergencyContact: "06-23456789",
          notes: "Batterij vervangen gepland",
        },
        {
          id: "aed-003",
          serialNumber: "AED2024003",
          model: "AED Plus",
          manufacturer: "ZOLL",
          location: "Productiehal Verdieping 2",
          floor: "Verdieping 2",
          zone: "Zone C",
          status: "error",
          batteryLevel: 12,
          lastSelfTest: new Date("2024-01-15"),
          nextMaintenance: new Date("2024-01-25"),
          lastMaintenance: new Date("2023-10-15"),
          electrodeExpiry: new Date("2024-08-15"),
          batteryExpiry: new Date("2024-04-20"),
          totalUses: 0,
          coordinates: { x: 450, y: 300 },
          responsiblePerson: "Mohammed El Amrani",
          emergencyContact: "06-34567890",
          notes: "Foutmelding: Batterij kritiek laag",
        },
        {
          id: "aed-004",
          serialNumber: "AED2024004",
          model: "HeartStart OnSite",
          manufacturer: "Philips",
          location: "Parkeergarage Ondergronds",
          floor: "Ondergronds",
          zone: "Zone D",
          status: "operational",
          batteryLevel: 92,
          lastSelfTest: new Date("2024-01-21"),
          nextMaintenance: new Date("2024-07-10"),
          lastMaintenance: new Date("2024-01-10"),
          electrodeExpiry: new Date("2025-06-30"),
          batteryExpiry: new Date("2025-12-15"),
          totalUses: 0,
          coordinates: { x: 200, y: 400 },
          responsiblePerson: "Sarah Bakker",
          emergencyContact: "06-45678901",
          notes: "Recent onderhoud uitgevoerd",
        },
      ])

      setMaintenanceRecords([
        {
          id: "maint-001",
          aedId: "aed-001",
          date: new Date("2023-12-15"),
          type: "routine",
          technician: "TechCare BV - Jan Technicus",
          description: "Routine onderhoud en kalibratie",
          partsReplaced: ["Elektroden", "Batterij test"],
          cost: 125.5,
          nextDue: new Date("2024-06-15"),
        },
        {
          id: "maint-002",
          aedId: "aed-004",
          date: new Date("2024-01-10"),
          type: "repair",
          technician: "Philips Service - Marie Reparateur",
          description: "Display vervangen en software update",
          partsReplaced: ["LCD Display", "Software v2.1"],
          cost: 285.75,
          nextDue: new Date("2024-07-10"),
        },
      ])
    }
  }, [selectedCustomer])

  const getStatusColor = (status: AEDStatus) => {
    switch (status) {
      case "operational":
        return "bg-green-100 text-green-800"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800"
      case "error":
        return "bg-red-100 text-red-800"
      case "offline":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: AEDStatus) => {
    switch (status) {
      case "operational":
        return "Operationeel"
      case "maintenance":
        return "Onderhoud"
      case "error":
        return "Fout"
      case "offline":
        return "Offline"
      default:
        return "Onbekend"
    }
  }

  const getStatusIcon = (status: AEDStatus) => {
    switch (status) {
      case "operational":
        return <CheckCircle className="h-4 w-4" />
      case "maintenance":
        return <Wrench className="h-4 w-4" />
      case "error":
        return <AlertTriangle className="h-4 w-4" />
      case "offline":
        return <Activity className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getBatteryColor = (level: number) => {
    if (level > 50) return "bg-green-500"
    if (level > 20) return "bg-yellow-500"
    return "bg-red-500"
  }

  const isMaintenanceDue = (device: AEDDevice) => {
    const daysUntilMaintenance = Math.ceil(
      (device.nextMaintenance.getTime() - new Date().getTime()) / (1000 * 3600 * 24),
    )
    return daysUntilMaintenance <= 30
  }

  const isExpiryWarning = (expiryDate: Date) => {
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24))
    return daysUntilExpiry <= 90
  }

  const operationalDevices = aedDevices.filter((d) => d.status === "operational").length
  const maintenanceDevices = aedDevices.filter((d) => d.status === "maintenance").length
  const errorDevices = aedDevices.filter((d) => d.status === "error").length
  const dueMaintenance = aedDevices.filter(isMaintenanceDue).length

  if (!selectedCustomer) {
    return (
      <div className="flex h-full items-center justify-center">
        <Card className="w-[450px]">
          <CardHeader>
            <CardTitle>Geen klant geselecteerd</CardTitle>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="container p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">AED Monitoring Systeem</h1>
          <p className="text-muted-foreground">Real-time monitoring van Automatische Externe Defibrillatoren</p>
        </div>
        <div className="flex space-x-2">
          <Button>
            <Heart className="h-4 w-4 mr-2" />
            Nieuwe AED Toevoegen
          </Button>
          <Button variant="outline">
            <Wrench className="h-4 w-4 mr-2" />
            Onderhoud Plannen
          </Button>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
              Operationeel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{operationalDevices}</div>
            <p className="text-xs text-muted-foreground">van {aedDevices.length} AED's</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Wrench className="h-4 w-4 mr-2 text-yellow-500" />
              Onderhoud
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{maintenanceDevices}</div>
            <p className="text-xs text-muted-foreground">In onderhoud</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
              Fouten
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{errorDevices}</div>
            <p className="text-xs text-muted-foreground">Aandacht vereist</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-blue-500" />
              Onderhoud Gepland
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{dueMaintenance}</div>
            <p className="text-xs text-muted-foreground">Binnen 30 dagen</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="devices" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="devices">AED Overzicht</TabsTrigger>
          <TabsTrigger value="map">Locatie Kaart</TabsTrigger>
          <TabsTrigger value="maintenance">Onderhoud</TabsTrigger>
          <TabsTrigger value="reports">Rapporten</TabsTrigger>
        </TabsList>

        <TabsContent value="devices">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Device List */}
            <div className="lg:col-span-2 space-y-4">
              {aedDevices.map((device) => (
                <Card
                  key={device.id}
                  className={`cursor-pointer transition-all ${
                    selectedAED?.id === device.id ? "ring-2 ring-blue-500" : "hover:shadow-md"
                  }`}
                  onClick={() => setSelectedAED(device)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg flex items-center">
                          <Heart className="h-5 w-5 mr-2 text-red-500" />
                          {device.model}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">{device.manufacturer}</p>
                        <p className="text-sm text-muted-foreground">S/N: {device.serialNumber}</p>
                      </div>
                      <Badge className={getStatusColor(device.status)}>
                        {getStatusIcon(device.status)}
                        <span className="ml-1">{getStatusText(device.status)}</span>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{device.location}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Battery className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Batterij:</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 h-2 bg-gray-200 rounded-full">
                            <div
                              className={`h-2 rounded-full ${getBatteryColor(device.batteryLevel)}`}
                              style={{ width: `${device.batteryLevel}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{device.batteryLevel}%</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Laatste test:</span>
                          <p>{device.lastSelfTest.toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Volgend onderhoud:</span>
                          <p className={isMaintenanceDue(device) ? "text-orange-600 font-medium" : ""}>
                            {device.nextMaintenance.toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {(device.status === "error" || device.batteryLevel < 20 || isMaintenanceDue(device)) && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {device.status === "error" && (
                            <Badge variant="outline" className="text-red-600">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Fout
                            </Badge>
                          )}
                          {device.batteryLevel < 20 && (
                            <Badge variant="outline" className="text-orange-600">
                              <Battery className="h-3 w-3 mr-1" />
                              Batterij Laag
                            </Badge>
                          )}
                          {isMaintenanceDue(device) && (
                            <Badge variant="outline" className="text-blue-600">
                              <Calendar className="h-3 w-3 mr-1" />
                              Onderhoud Gepland
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Device Details */}
            <div>
              {selectedAED ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Heart className="h-5 w-5 mr-2 text-red-500" />
                      AED Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">{selectedAED.model}</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Fabrikant:</span>
                          <span>{selectedAED.manufacturer}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Serienummer:</span>
                          <span>{selectedAED.serialNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Locatie:</span>
                          <span>{selectedAED.location}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Verdieping:</span>
                          <span>{selectedAED.floor}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Zone:</span>
                          <span>{selectedAED.zone}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Status & Onderhoud</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Status:</span>
                          <Badge className={getStatusColor(selectedAED.status)}>
                            {getStatusText(selectedAED.status)}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Batterij niveau:</span>
                          <span className={selectedAED.batteryLevel < 20 ? "text-red-600 font-medium" : ""}>
                            {selectedAED.batteryLevel}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Laatste zelftest:</span>
                          <span>{selectedAED.lastSelfTest.toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Volgend onderhoud:</span>
                          <span className={isMaintenanceDue(selectedAED) ? "text-orange-600 font-medium" : ""}>
                            {selectedAED.nextMaintenance.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Vervaldatums</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Elektroden:</span>
                          <span
                            className={
                              isExpiryWarning(selectedAED.electrodeExpiry) ? "text-orange-600 font-medium" : ""
                            }
                          >
                            {selectedAED.electrodeExpiry.toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Batterij:</span>
                          <span
                            className={isExpiryWarning(selectedAED.batteryExpiry) ? "text-orange-600 font-medium" : ""}
                          >
                            {selectedAED.batteryExpiry.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Gebruik</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Totaal gebruikt:</span>
                          <span>{selectedAED.totalUses} keer</span>
                        </div>
                        {selectedAED.lastUsed && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Laatst gebruikt:</span>
                            <span>{selectedAED.lastUsed.toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Verantwoordelijke</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Persoon:</span>
                          <span>{selectedAED.responsiblePerson}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Contact:</span>
                          <span>{selectedAED.emergencyContact}</span>
                        </div>
                      </div>
                    </div>

                    {selectedAED.notes && (
                      <div>
                        <h3 className="font-medium mb-2">Notities</h3>
                        <p className="text-sm text-muted-foreground">{selectedAED.notes}</p>
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1">
                        <Wrench className="h-3 w-3 mr-1" />
                        Onderhoud
                      </Button>
                      <Button size="sm" variant="outline">
                        <Phone className="h-3 w-3 mr-1" />
                        Contact
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Selecteer een AED</h3>
                    <p className="text-muted-foreground">Klik op een AED om details te bekijken</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="map">
          <Card>
            <CardHeader>
              <CardTitle>AED Locatie Overzicht</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative bg-gray-100 rounded-lg" style={{ height: "500px" }}>
                {/* Simplified floor plan */}
                <svg width="100%" height="100%" viewBox="0 0 600 500">
                  {/* Floor plan outline */}
                  <rect x="50" y="50" width="500" height="400" fill="white" stroke="#ccc" strokeWidth="2" />

                  {/* Rooms */}
                  <rect x="70" y="70" width="120" height="80" fill="#f0f0f0" stroke="#ddd" />
                  <text x="130" y="115" textAnchor="middle" fontSize="12" fill="#666">
                    Receptie
                  </text>

                  <rect x="220" y="70" width="150" height="80" fill="#f0f0f0" stroke="#ddd" />
                  <text x="295" y="115" textAnchor="middle" fontSize="12" fill="#666">
                    Kantine
                  </text>

                  <rect x="400" y="70" width="130" height="80" fill="#f0f0f0" stroke="#ddd" />
                  <text x="465" y="115" textAnchor="middle" fontSize="12" fill="#666">
                    Productie
                  </text>

                  <rect x="70" y="180" width="460" height="100" fill="#f0f0f0" stroke="#ddd" />
                  <text x="300" y="235" textAnchor="middle" fontSize="12" fill="#666">
                    Parkeergarage
                  </text>

                  {/* AED Locations */}
                  {aedDevices.map((device) => (
                    <g key={device.id}>
                      <circle
                        cx={device.coordinates.x}
                        cy={device.coordinates.y}
                        r="12"
                        fill={
                          device.status === "operational"
                            ? "#10b981"
                            : device.status === "maintenance"
                              ? "#f59e0b"
                              : device.status === "error"
                                ? "#ef4444"
                                : "#6b7280"
                        }
                        stroke="white"
                        strokeWidth="2"
                        className="cursor-pointer"
                        onClick={() => setSelectedAED(device)}
                      />
                      <text
                        x={device.coordinates.x}
                        y={device.coordinates.y + 4}
                        textAnchor="middle"
                        fontSize="10"
                        fill="white"
                        fontWeight="bold"
                      >
                        AED
                      </text>
                    </g>
                  ))}
                </svg>

                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-md">
                  <h4 className="font-medium text-sm mb-2">Status Legend</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>Operationeel</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span>Onderhoud</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span>Fout</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                      <span>Offline</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Onderhoud Planning</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {aedDevices.filter(isMaintenanceDue).map((device) => (
                    <div key={device.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{device.model}</h3>
                          <p className="text-sm text-muted-foreground">{device.location}</p>
                          <p className="text-sm text-muted-foreground">S/N: {device.serialNumber}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="text-orange-600">
                            <Calendar className="h-3 w-3 mr-1" />
                            {Math.ceil((device.nextMaintenance.getTime() - new Date().getTime()) / (1000 * 3600 * 24))}{" "}
                            dagen
                          </Badge>
                        </div>
                      </div>
                      <div className="flex space-x-2 mt-3">
                        <Button size="sm">Onderhoud Plannen</Button>
                        <Button size="sm" variant="outline">
                          Contact Technicus
                        </Button>
                      </div>
                    </div>
                  ))}
                  {aedDevices.filter(isMaintenanceDue).length === 0 && (
                    <p className="text-center text-muted-foreground py-8">Geen onderhoud gepland binnen 30 dagen</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Onderhoud Geschiedenis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {maintenanceRecords.map((record) => {
                    const device = aedDevices.find((d) => d.id === record.aedId)
                    return (
                      <div key={record.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{device?.model}</h3>
                            <p className="text-sm text-muted-foreground">{device?.location}</p>
                            <p className="text-sm">{record.description}</p>
                            <p className="text-xs text-muted-foreground">Door: {record.technician}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{record.date.toLocaleDateString()}</p>
                            <Badge variant="outline">{record.type}</Badge>
                            <p className="text-sm text-muted-foreground">€{record.cost.toFixed(2)}</p>
                          </div>
                        </div>
                        {record.partsReplaced.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-muted-foreground">Vervangen onderdelen:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {record.partsReplaced.map((part, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {part}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Maandelijks Rapport</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Operationele AED's:</span>
                    <span className="font-medium">
                      {operationalDevices}/{aedDevices.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Uitgevoerde onderhoud:</span>
                    <span className="font-medium">{maintenanceRecords.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Totale kosten:</span>
                    <span className="font-medium">
                      €{maintenanceRecords.reduce((acc, record) => acc + record.cost, 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Gemiddelde uptime:</span>
                    <span className="font-medium">98.5%</span>
                  </div>
                </div>
                <Button className="w-full">Download Rapport</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Compliance Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Onderhoud Schema:</span>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Compliant
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Certificering:</span>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Geldig
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Documentatie:</span>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Compleet
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Training Records:</span>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      <Clock className="h-3 w-3 mr-1" />
                      Update Vereist
                    </Badge>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  Compliance Rapport
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
