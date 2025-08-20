"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCustomer } from "@/components/customer-context"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import {
  MapPin,
  Scan,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Shield,
  Zap,
  Navigation,
  Eye,
  Activity,
} from "lucide-react"

type FloorStatus = "normal" | "miva_detected" | "investigating" | "evacuated" | "emergency"
type MivaLocation = {
  id: string
  name: string
  scanned: boolean
  timestamp?: string
  scannedBy?: string
}
type EvacuationRoute = {
  id: string
  name: string
  scanned: boolean
  timestamp?: string
  scannedBy?: string
}

type FloorData = {
  id: number
  name: string
  status: FloorStatus
  mivaLocations: MivaLocation[]
  evacuationRoutes: EvacuationRoute[]
  lastUpdate?: string
  updatedBy?: string
}

export default function BHVPlotkaartPage() {
  const { selectedCustomer } = useCustomer()
  const { user } = useAuth()
  const { toast } = useToast()
  const [selectedFloor, setSelectedFloor] = useState<number>(1)
  const [floors, setFloors] = useState<FloorData[]>([
    {
      id: 1,
      name: "Begane Grond",
      status: "normal",
      mivaLocations: [
        { id: "miva-bg-1", name: "Hoofdingang", scanned: false },
        { id: "miva-bg-2", name: "Receptie", scanned: false },
        { id: "miva-bg-3", name: "Kantine", scanned: false },
      ],
      evacuationRoutes: [
        { id: "route-bg-1", name: "Trappenhuis A", scanned: false },
        { id: "route-bg-2", name: "Trappenhuis B", scanned: false },
        { id: "route-bg-3", name: "Nooduitgang Oost", scanned: false },
      ],
    },
    {
      id: 2,
      name: "Verdieping 1",
      status: "normal",
      mivaLocations: [
        { id: "miva-v1-1", name: "Gang Noord", scanned: false },
        { id: "miva-v1-2", name: "Vergaderruimte", scanned: false },
        { id: "miva-v1-3", name: "Werkplaats", scanned: false },
      ],
      evacuationRoutes: [
        { id: "route-v1-1", name: "Trappenhuis A", scanned: false },
        { id: "route-v1-2", name: "Trappenhuis B", scanned: false },
      ],
    },
    {
      id: 12,
      name: "Verdieping 12",
      status: "normal",
      mivaLocations: [
        { id: "miva-v12-1", name: "Gang Centrum", scanned: false },
        { id: "miva-v12-2", name: "Directiekamer", scanned: false },
        { id: "miva-v12-3", name: "Serverruimte", scanned: false },
      ],
      evacuationRoutes: [
        { id: "route-v12-1", name: "Trappenhuis A", scanned: false },
        { id: "route-v12-2", name: "Trappenhuis B", scanned: false },
        { id: "route-v12-3", name: "Nooduitgang West", scanned: false },
      ],
    },
  ])

  const getStatusColor = (status: FloorStatus) => {
    switch (status) {
      case "normal":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "miva_detected":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "investigating":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "evacuated":
        return "bg-green-100 text-green-800 border-green-200"
      case "emergency":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusText = (status: FloorStatus) => {
    switch (status) {
      case "normal":
        return "Normaal"
      case "miva_detected":
        return "MiVa Gedetecteerd"
      case "investigating":
        return "Onderzoek Lopend"
      case "evacuated":
        return "Geëvacueerd"
      case "emergency":
        return "Calamiteit"
      default:
        return "Onbekend"
    }
  }

  const getStatusIcon = (status: FloorStatus) => {
    switch (status) {
      case "normal":
        return <CheckCircle className="h-4 w-4" />
      case "miva_detected":
        return <AlertTriangle className="h-4 w-4" />
      case "investigating":
        return <Eye className="h-4 w-4" />
      case "evacuated":
        return <CheckCircle className="h-4 w-4" />
      case "emergency":
        return <Zap className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const updateFloorStatus = (floorId: number) => {
    setFloors((prevFloors) =>
      prevFloors.map((floor) => {
        if (floor.id !== floorId) return floor

        const mivaScanned = floor.mivaLocations.some((miva) => miva.scanned)
        const allRoutesScanned = floor.evacuationRoutes.every((route) => route.scanned)
        const anyMivaScanned = floor.mivaLocations.some((miva) => miva.scanned)

        let newStatus: FloorStatus = "normal"

        if (floor.status === "emergency") {
          newStatus = "emergency" // Emergency blijft emergency tot handmatig gereset
        } else if (mivaScanned && !allRoutesScanned) {
          newStatus = "miva_detected"
        } else if (mivaScanned && allRoutesScanned) {
          newStatus = anyMivaScanned ? "investigating" : "evacuated"
        } else if (allRoutesScanned && !anyMivaScanned) {
          newStatus = "evacuated"
        }

        return {
          ...floor,
          status: newStatus,
          lastUpdate: new Date().toLocaleTimeString(),
          updatedBy: user?.name || "Systeem",
        }
      }),
    )
  }

  const handleMivaScan = (floorId: number, mivaId: string) => {
    setFloors((prevFloors) =>
      prevFloors.map((floor) => {
        if (floor.id !== floorId) return floor

        return {
          ...floor,
          mivaLocations: floor.mivaLocations.map((miva) =>
            miva.id === mivaId
              ? {
                  ...miva,
                  scanned: !miva.scanned,
                  timestamp: new Date().toLocaleTimeString(),
                  scannedBy: user?.name || "Onbekend",
                }
              : miva,
          ),
        }
      }),
    )

    setTimeout(() => updateFloorStatus(floorId), 100)

    toast({
      title: "NFC Tag Gescand",
      description: `MiVa locatie gescand op ${floors.find((f) => f.id === floorId)?.name}`,
    })
  }

  const handleRouteScan = (floorId: number, routeId: string) => {
    setFloors((prevFloors) =>
      prevFloors.map((floor) => {
        if (floor.id !== floorId) return floor

        return {
          ...floor,
          evacuationRoutes: floor.evacuationRoutes.map((route) =>
            route.id === routeId
              ? {
                  ...route,
                  scanned: !route.scanned,
                  timestamp: new Date().toLocaleTimeString(),
                  scannedBy: user?.name || "Onbekend",
                }
              : route,
          ),
        }
      }),
    )

    setTimeout(() => updateFloorStatus(floorId), 100)

    toast({
      title: "Route Gescand",
      description: `Ontruimingsroute gescand op ${floors.find((f) => f.id === floorId)?.name}`,
    })
  }

  const simulateEmergency = (floorId: number) => {
    setFloors((prevFloors) =>
      prevFloors.map((floor) =>
        floor.id === floorId
          ? {
              ...floor,
              status: "emergency",
              lastUpdate: new Date().toLocaleTimeString(),
              updatedBy: user?.name || "Systeem",
            }
          : floor,
      ),
    )

    toast({
      title: "🚨 CALAMITEIT",
      description: `Noodsituatie gemeld op ${floors.find((f) => f.id === floorId)?.name}`,
      variant: "destructive",
    })
  }

  const resetFloor = (floorId: number) => {
    setFloors((prevFloors) =>
      prevFloors.map((floor) =>
        floor.id === floorId
          ? {
              ...floor,
              status: "normal",
              mivaLocations: floor.mivaLocations.map((miva) => ({
                ...miva,
                scanned: false,
                timestamp: undefined,
                scannedBy: undefined,
              })),
              evacuationRoutes: floor.evacuationRoutes.map((route) => ({
                ...route,
                scanned: false,
                timestamp: undefined,
                scannedBy: undefined,
              })),
              lastUpdate: new Date().toLocaleTimeString(),
              updatedBy: user?.name || "Systeem",
            }
          : floor,
      ),
    )

    toast({
      title: "Verdieping Gereset",
      description: `${floors.find((f) => f.id === floorId)?.name} is teruggezet naar normale status`,
    })
  }

  const currentFloor = floors.find((f) => f.id === selectedFloor)

  if (!selectedCustomer) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">Selecteer eerst een klant om de plotkaart te bekijken.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header met klant branding */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img
            src="/images/bhv360-logo-full.png"
            alt="BHV360 Logo"
            className="h-12 w-auto"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg?height=48&width=120&text=BHV360"
            }}
          />
          <div className="h-8 w-px bg-gray-300" />
          <img
            src="/placeholder-logo.png"
            alt={`${selectedCustomer.name} Logo`}
            className="h-12 w-auto"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg?height=48&width=120&text=Logo"
            }}
          />
          <div>
            <h1 className="text-3xl font-bold">Plotkaart {selectedCustomer.name}</h1>
            <p className="text-muted-foreground">{selectedCustomer.address}</p>
          </div>
        </div>
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          <MapPin className="h-3 w-3 mr-1" />
          BHV Plotkaart
        </Badge>
      </div>

      {/* Status Overzicht */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {floors.map((floor) => (
          <Card
            key={floor.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedFloor === floor.id ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={() => setSelectedFloor(floor.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{floor.name}</h3>
                {getStatusIcon(floor.status)}
              </div>
              <Badge className={`${getStatusColor(floor.status)} text-xs`}>{getStatusText(floor.status)}</Badge>
              {floor.lastUpdate && (
                <p className="text-xs text-muted-foreground mt-2">
                  Update: {floor.lastUpdate} door {floor.updatedBy}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Verdieping Details */}
      {currentFloor && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* MiVa Locaties */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                MiVa Locaties - {currentFloor.name}
              </CardTitle>
              <CardDescription>Scan NFC tags bij MiVa detectie</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentFloor.mivaLocations.map((miva) => (
                <div
                  key={miva.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    miva.scanned ? "bg-orange-50 border-orange-200" : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div>
                    <h4 className="font-medium">{miva.name}</h4>
                    {miva.timestamp && (
                      <p className="text-xs text-muted-foreground">
                        Gescand: {miva.timestamp} door {miva.scannedBy}
                      </p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant={miva.scanned ? "destructive" : "default"}
                    onClick={() => handleMivaScan(currentFloor.id, miva.id)}
                  >
                    <Scan className="h-4 w-4 mr-1" />
                    {miva.scanned ? "Reset" : "Scan NFC"}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Ontruimingsroutes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Navigation className="mr-2 h-5 w-5" />
                Ontruimingsroutes - {currentFloor.name}
              </CardTitle>
              <CardDescription>Scan routes tijdens evacuatie controle</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentFloor.evacuationRoutes.map((route) => (
                <div
                  key={route.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    route.scanned ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div>
                    <h4 className="font-medium">{route.name}</h4>
                    {route.timestamp && (
                      <p className="text-xs text-muted-foreground">
                        Gescand: {route.timestamp} door {route.scannedBy}
                      </p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant={route.scanned ? "destructive" : "outline"}
                    onClick={() => handleRouteScan(currentFloor.id, route.id)}
                  >
                    <Scan className="h-4 w-4 mr-1" />
                    {route.scanned ? "Reset" : "Scan Route"}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Controle Paneel */}
      {currentFloor && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Controle Paneel - {currentFloor.name}
            </CardTitle>
            <CardDescription>Simulatie en controle functies voor training en noodsituaties</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button variant="destructive" onClick={() => simulateEmergency(currentFloor.id)}>
                <Zap className="h-4 w-4 mr-1" />
                Calamiteit Melden
              </Button>
              <Button variant="outline" onClick={() => resetFloor(currentFloor.id)}>
                <Activity className="h-4 w-4 mr-1" />
                Verdieping Resetten
              </Button>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Laatste update: {currentFloor.lastUpdate || "Geen updates"}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status Legenda */}
      <Card>
        <CardHeader>
          <CardTitle>Status Legenda</CardTitle>
          <CardDescription>Betekenis van de verschillende kleuren en statussen</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-200 rounded"></div>
              <span className="text-sm">Normaal</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-orange-200 rounded"></div>
              <span className="text-sm">MiVa Gedetecteerd</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-200 rounded"></div>
              <span className="text-sm">Onderzoek Lopend</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-200 rounded"></div>
              <span className="text-sm">Geëvacueerd</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-200 rounded"></div>
              <span className="text-sm">Calamiteit</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
