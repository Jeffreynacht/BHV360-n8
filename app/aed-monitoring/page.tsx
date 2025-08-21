"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, MapPin, Calendar, AlertTriangle, CheckCircle, Clock } from "lucide-react"

export const dynamic = "force-dynamic"

interface AEDDevice {
  id: string
  location: string
  building: string
  floor: string
  status: "operational" | "maintenance" | "offline"
  lastCheck: string
  batteryLevel: number
  serialNumber: string
  model: string
  expiryDate: string
}

export default function AEDMonitoringPage() {
  const [devices, setDevices] = useState<AEDDevice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock AED data
    const mockDevices: AEDDevice[] = [
      {
        id: "aed-001",
        location: "Hoofdingang",
        building: "Hoofdgebouw",
        floor: "Begane Grond",
        status: "operational",
        lastCheck: "2024-01-15",
        batteryLevel: 85,
        serialNumber: "AED2024001",
        model: "Philips HeartStart FRx",
        expiryDate: "2025-06-15",
      },
      {
        id: "aed-002",
        location: "Kantine",
        building: "Hoofdgebouw",
        floor: "1e Verdieping",
        status: "operational",
        lastCheck: "2024-01-14",
        batteryLevel: 92,
        serialNumber: "AED2024002",
        model: "Zoll AED Plus",
        expiryDate: "2025-08-20",
      },
      {
        id: "aed-003",
        location: "Magazijn",
        building: "Bijgebouw A",
        floor: "Begane Grond",
        status: "maintenance",
        lastCheck: "2024-01-10",
        batteryLevel: 45,
        serialNumber: "AED2024003",
        model: "Philips HeartStart FRx",
        expiryDate: "2025-03-10",
      },
      {
        id: "aed-004",
        location: "Parkeergarage",
        building: "Parkeergarage",
        floor: "Niveau -1",
        status: "offline",
        lastCheck: "2024-01-05",
        batteryLevel: 15,
        serialNumber: "AED2024004",
        model: "Cardiac Science Powerheart G5",
        expiryDate: "2024-12-31",
      },
    ]

    setTimeout(() => {
      setDevices(mockDevices)
      setLoading(false)
    }, 1000)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "bg-green-500"
      case "maintenance":
        return "bg-yellow-500"
      case "offline":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <CheckCircle className="h-4 w-4" />
      case "maintenance":
        return <Clock className="h-4 w-4" />
      case "offline":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getBatteryColor = (level: number) => {
    if (level > 70) return "bg-green-500"
    if (level > 30) return "bg-yellow-500"
    return "bg-red-500"
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        </div>
      </div>
    )
  }

  const operationalCount = devices.filter((d) => d.status === "operational").length
  const maintenanceCount = devices.filter((d) => d.status === "maintenance").length
  const offlineCount = devices.filter((d) => d.status === "offline").length

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Heart className="h-8 w-8 text-red-600" />
            AED Monitoring
          </h1>
          <p className="text-muted-foreground">Overzicht van alle AED apparaten en hun status</p>
        </div>
        <Button>
          <MapPin className="h-4 w-4 mr-2" />
          Locatie Kaart
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Totaal AED's</p>
                <p className="text-2xl font-bold">{devices.length}</p>
              </div>
              <Heart className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Operationeel</p>
                <p className="text-2xl font-bold text-green-600">{operationalCount}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Onderhoud</p>
                <p className="text-2xl font-bold text-yellow-600">{maintenanceCount}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Offline</p>
                <p className="text-2xl font-bold text-red-600">{offlineCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AED Devices */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {devices.map((device) => (
          <Card key={device.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{device.location}</CardTitle>
                <Badge variant="secondary" className={`${getStatusColor(device.status)} text-white`}>
                  {getStatusIcon(device.status)}
                  <span className="ml-1 capitalize">{device.status}</span>
                </Badge>
              </div>
              <CardDescription>
                {device.building} - {device.floor}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Model:</span>
                  <span className="font-medium">{device.model}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Serienummer:</span>
                  <span className="font-medium">{device.serialNumber}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Batterij:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${getBatteryColor(device.batteryLevel)}`}
                        style={{ width: `${device.batteryLevel}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{device.batteryLevel}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Laatste controle:</span>
                  <span className="font-medium">{device.lastCheck}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Vervaldatum:</span>
                  <span className="font-medium">{device.expiryDate}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Calendar className="h-4 w-4 mr-1" />
                  Plan Controle
                </Button>
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
