"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Heart, MapPin, Calendar, AlertTriangle, CheckCircle, Battery, Wifi } from "lucide-react"

interface AEDDevice {
  id: string
  location: string
  status: "operational" | "maintenance" | "offline"
  batteryLevel: number
  lastCheck: string
  nextMaintenance: string
  serialNumber: string
}

export function AEDMonitoringContent() {
  const [aedDevices, setAedDevices] = useState<AEDDevice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading AED devices
    setTimeout(() => {
      setAedDevices([
        {
          id: "1",
          location: "Hoofdingang",
          status: "operational",
          batteryLevel: 85,
          lastCheck: "2024-01-15",
          nextMaintenance: "2024-02-15",
          serialNumber: "AED-001",
        },
        {
          id: "2",
          location: "Kantoor verdieping 2",
          status: "maintenance",
          batteryLevel: 45,
          lastCheck: "2024-01-10",
          nextMaintenance: "2024-01-20",
          serialNumber: "AED-002",
        },
        {
          id: "3",
          location: "Productiehal",
          status: "operational",
          batteryLevel: 92,
          lastCheck: "2024-01-18",
          nextMaintenance: "2024-03-01",
          serialNumber: "AED-003",
        },
      ])
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
        return <AlertTriangle className="h-4 w-4" />
      case "offline":
        return <Wifi className="h-4 w-4" />
      default:
        return <Heart className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Heart className="h-8 w-8 animate-pulse mx-auto mb-4" />
            <p>Loading AED monitoring data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Heart className="h-8 w-8 text-red-500" />
          AED Monitoring
        </h1>
        <p className="text-muted-foreground">Monitor de status van alle AED apparaten in uw gebouw</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {aedDevices.map((device) => (
          <Card key={device.id} className="relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  {device.location}
                </CardTitle>
                <Badge variant="secondary" className={`${getStatusColor(device.status)} text-white`}>
                  {getStatusIcon(device.status)}
                  {device.status}
                </Badge>
              </div>
              <CardDescription>Serial: {device.serialNumber}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Battery className="h-4 w-4" />
                  Batterij
                </span>
                <span
                  className={`font-semibold ${
                    device.batteryLevel > 70
                      ? "text-green-600"
                      : device.batteryLevel > 30
                        ? "text-yellow-600"
                        : "text-red-600"
                  }`}
                >
                  {device.batteryLevel}%
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Laatste check
                </span>
                <span>{device.lastCheck}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Volgende onderhoud
                </span>
                <span>{device.nextMaintenance}</span>
              </div>

              {device.status === "maintenance" && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>Dit apparaat heeft onderhoud nodig</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  Details
                </Button>
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  Test
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>AED Overzicht</CardTitle>
            <CardDescription>Algemene status van alle AED apparaten</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {aedDevices.filter((d) => d.status === "operational").length}
                </div>
                <div className="text-sm text-muted-foreground">Operationeel</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {aedDevices.filter((d) => d.status === "maintenance").length}
                </div>
                <div className="text-sm text-muted-foreground">Onderhoud</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {aedDevices.filter((d) => d.status === "offline").length}
                </div>
                <div className="text-sm text-muted-foreground">Offline</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
