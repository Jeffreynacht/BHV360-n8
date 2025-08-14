"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BHV360Logo } from "@/components/bhv360-logo"
import {
  Shield,
  MapPin,
  AlertTriangle,
  Heart,
  Phone,
  Zap,
  Eye,
  Droplets,
  Wind,
  Users,
  Navigation,
  Edit,
  Trash2,
  Save,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  Upload,
  Settings,
} from "lucide-react"

interface Voorziening {
  id: string
  type: string
  x: number
  y: number
  label: string
  status: "active" | "maintenance" | "inactive"
  lastChecked?: string
  description?: string
}

interface Floor {
  id: string
  name: string
  image?: string
  voorzieningen: Voorziening[]
}

const voorzieningTypes = {
  "fire-extinguisher": { icon: Shield, color: "text-red-600", label: "Brandblusser" },
  "fire-hose": { icon: Droplets, color: "text-blue-600", label: "Brandslang" },
  aed: { icon: Heart, color: "text-green-600", label: "AED" },
  "emergency-exit": { icon: Navigation, color: "text-green-600", label: "Nooduitgang" },
  "assembly-point": { icon: Users, color: "text-blue-600", label: "Verzamelpunt" },
  "emergency-phone": { icon: Phone, color: "text-orange-600", label: "Noodtelefoon" },
  "fire-alarm": { icon: AlertTriangle, color: "text-red-600", label: "Brandalarm" },
  "emergency-shower": { icon: Droplets, color: "text-blue-600", label: "Nooddouche" },
  "eye-wash": { icon: Eye, color: "text-blue-600", label: "Oogdouche" },
  "gas-valve": { icon: Wind, color: "text-yellow-600", label: "Gasafsluiter" },
  "electrical-panel": { icon: Zap, color: "text-yellow-600", label: "Elektriciteitspaneel" },
}

export function BHV360Plotkaart() {
  const [floors, setFloors] = useState<Floor[]>([
    {
      id: "ground",
      name: "Begane Grond",
      voorzieningen: [
        {
          id: "1",
          type: "fire-extinguisher",
          x: 100,
          y: 150,
          label: "Blusser A1",
          status: "active",
          lastChecked: "2024-01-15",
        },
        {
          id: "2",
          type: "aed",
          x: 300,
          y: 200,
          label: "AED Hoofdingang",
          status: "active",
          lastChecked: "2024-01-10",
        },
        {
          id: "3",
          type: "emergency-exit",
          x: 450,
          y: 100,
          label: "Nooduitgang Noord",
          status: "active",
        },
        {
          id: "4",
          type: "assembly-point",
          x: 200,
          y: 350,
          label: "Verzamelpunt A",
          status: "active",
        },
      ],
    },
    {
      id: "first",
      name: "Eerste Verdieping",
      voorzieningen: [
        {
          id: "5",
          type: "fire-extinguisher",
          x: 150,
          y: 120,
          label: "Blusser B1",
          status: "maintenance",
          lastChecked: "2024-01-12",
        },
        {
          id: "6",
          type: "fire-hose",
          x: 350,
          y: 180,
          label: "Brandslang B2",
          status: "active",
          lastChecked: "2024-01-14",
        },
      ],
    },
  ])

  const [activeFloor, setActiveFloor] = useState("ground")
  const [selectedVoorziening, setSelectedVoorziening] = useState<Voorziening | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const svgRef = useRef<SVGSVGElement>(null)

  const currentFloor = floors.find((f) => f.id === activeFloor)

  const handleVoorzieningClick = (voorziening: Voorziening) => {
    setSelectedVoorziening(voorziening)
  }

  const handleAddVoorziening = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!isEditing) return

    const rect = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - rect.left - pan.x) / zoom
    const y = (event.clientY - rect.top - pan.y) / zoom

    const newVoorziening: Voorziening = {
      id: Date.now().toString(),
      type: "fire-extinguisher",
      x,
      y,
      label: `Nieuwe voorziening ${Date.now()}`,
      status: "active",
    }

    setFloors((prev) =>
      prev.map((floor) =>
        floor.id === activeFloor ? { ...floor, voorzieningen: [...floor.voorzieningen, newVoorziening] } : floor,
      ),
    )
  }

  const handleDeleteVoorziening = (id: string) => {
    setFloors((prev) =>
      prev.map((floor) =>
        floor.id === activeFloor ? { ...floor, voorzieningen: floor.voorzieningen.filter((v) => v.id !== id) } : floor,
      ),
    )
    setSelectedVoorziening(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "fill-green-500"
      case "maintenance":
        return "fill-yellow-500"
      case "inactive":
        return "fill-red-500"
      default:
        return "fill-gray-500"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-600">Actief</Badge>
      case "maintenance":
        return <Badge variant="secondary">Onderhoud</Badge>
      case "inactive":
        return <Badge variant="destructive">Inactief</Badge>
      default:
        return <Badge variant="outline">Onbekend</Badge>
    }
  }

  const exportPlotkaart = () => {
    if (!svgRef.current) return

    const svgData = new XMLSerializer().serializeToString(svgRef.current)
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" })
    const svgUrl = URL.createObjectURL(svgBlob)

    const downloadLink = document.createElement("a")
    downloadLink.href = svgUrl
    downloadLink.download = `plotkaart-${activeFloor}-${new Date().toISOString().split("T")[0]}.svg`
    downloadLink.click()

    URL.revokeObjectURL(svgUrl)
  }

  return (
    <div className="container p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <BHV360Logo size="md" showText={false} />
            <h1 className="text-3xl font-bold">BHV360 Plotkaart</h1>
          </div>
          <p className="text-muted-foreground">Interactieve plattegrond met BHV voorzieningen</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? (
              <>
                <Save className="mr-2 h-4 w-4" />
                Opslaan
              </>
            ) : (
              <>
                <Edit className="mr-2 h-4 w-4" />
                Bewerken
              </>
            )}
          </Button>
          <Button variant="outline" onClick={exportPlotkaart}>
            <Download className="mr-2 h-4 w-4" />
            Exporteren
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Plotkaart */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Plattegrond - {currentFloor?.name}</CardTitle>
                  <CardDescription>
                    {isEditing ? "Klik om voorzieningen toe te voegen" : "Klik op voorzieningen voor details"}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}>
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setZoom(Math.min(2, zoom + 0.1))}>
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setZoom(1)
                      setPan({ x: 0, y: 0 })
                    }}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeFloor} onValueChange={setActiveFloor}>
                <TabsList className="mb-4">
                  {floors.map((floor) => (
                    <TabsTrigger key={floor.id} value={floor.id}>
                      {floor.name}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {floors.map((floor) => (
                  <TabsContent key={floor.id} value={floor.id}>
                    <div className="border rounded-lg overflow-hidden bg-gray-50">
                      <svg
                        ref={svgRef}
                        width="100%"
                        height="500"
                        viewBox="0 0 600 400"
                        className="cursor-crosshair"
                        onClick={isEditing ? handleAddVoorziening : undefined}
                        style={{ transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)` }}
                      >
                        {/* Background grid */}
                        <defs>
                          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="1" />
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />

                        {/* Building outline */}
                        <rect x="50" y="50" width="500" height="300" fill="white" stroke="#374151" strokeWidth="2" />

                        {/* Rooms */}
                        <rect x="70" y="70" width="150" height="100" fill="#f9fafb" stroke="#d1d5db" strokeWidth="1" />
                        <text x="145" y="125" textAnchor="middle" className="text-sm fill-gray-600">
                          Kantoor A
                        </text>

                        <rect x="240" y="70" width="150" height="100" fill="#f9fafb" stroke="#d1d5db" strokeWidth="1" />
                        <text x="315" y="125" textAnchor="middle" className="text-sm fill-gray-600">
                          Kantoor B
                        </text>

                        <rect x="410" y="70" width="120" height="100" fill="#f9fafb" stroke="#d1d5db" strokeWidth="1" />
                        <text x="470" y="125" textAnchor="middle" className="text-sm fill-gray-600">
                          Vergaderruimte
                        </text>

                        <rect x="70" y="190" width="460" height="140" fill="#f9fafb" stroke="#d1d5db" strokeWidth="1" />
                        <text x="300" y="265" textAnchor="middle" className="text-sm fill-gray-600">
                          Open Werkruimte
                        </text>

                        {/* Voorzieningen */}
                        {floor.voorzieningen.map((voorziening) => {
                          const VoorzieningIcon =
                            voorzieningTypes[voorziening.type as keyof typeof voorzieningTypes]?.icon || Shield
                          return (
                            <g key={voorziening.id}>
                              <circle
                                cx={voorziening.x}
                                cy={voorziening.y}
                                r="15"
                                className={`${getStatusColor(voorziening.status)} stroke-white stroke-2 cursor-pointer hover:opacity-80`}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleVoorzieningClick(voorziening)
                                }}
                              />
                              <foreignObject
                                x={voorziening.x - 8}
                                y={voorziening.y - 8}
                                width="16"
                                height="16"
                                className="pointer-events-none"
                              >
                                <VoorzieningIcon className="h-4 w-4 text-white" />
                              </foreignObject>
                              <text
                                x={voorziening.x}
                                y={voorziening.y + 25}
                                textAnchor="middle"
                                className="text-xs fill-gray-700 font-medium"
                              >
                                {voorziening.label}
                              </text>
                            </g>
                          )
                        })}
                      </svg>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Legend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Legenda
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-3">
                  {Object.entries(voorzieningTypes).map(([type, config]) => {
                    const Icon = config.icon
                    return (
                      <div key={type} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                          <Icon className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-sm">{config.label}</span>
                      </div>
                    )
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Statistieken</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Totaal voorzieningen:</span>
                  <Badge variant="outline">
                    {floors.reduce((total, floor) => total + floor.voorzieningen.length, 0)}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Actief:</span>
                  <Badge className="bg-green-600">
                    {floors.reduce(
                      (total, floor) => total + floor.voorzieningen.filter((v) => v.status === "active").length,
                      0,
                    )}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Onderhoud:</span>
                  <Badge variant="secondary">
                    {floors.reduce(
                      (total, floor) => total + floor.voorzieningen.filter((v) => v.status === "maintenance").length,
                      0,
                    )}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Inactief:</span>
                  <Badge variant="destructive">
                    {floors.reduce(
                      (total, floor) => total + floor.voorzieningen.filter((v) => v.status === "inactive").length,
                      0,
                    )}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Snelle Acties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Plattegrond Uploaden
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Instellingen
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Rapport Genereren
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Voorziening Details Dialog */}
      <Dialog open={!!selectedVoorziening} onOpenChange={() => setSelectedVoorziening(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Voorziening Details</DialogTitle>
            <DialogDescription>Informatie over de geselecteerde voorziening</DialogDescription>
          </DialogHeader>
          {selectedVoorziening && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Type</label>
                  <div className="mt-1">
                    {voorzieningTypes[selectedVoorziening.type as keyof typeof voorzieningTypes]?.label || "Onbekend"}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <div className="mt-1">{getStatusBadge(selectedVoorziening.status)}</div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Label</label>
                <div className="mt-1">{selectedVoorziening.label}</div>
              </div>

              {selectedVoorziening.lastChecked && (
                <div>
                  <label className="text-sm font-medium">Laatst gecontroleerd</label>
                  <div className="mt-1">{new Date(selectedVoorziening.lastChecked).toLocaleDateString("nl-NL")}</div>
                </div>
              )}

              {selectedVoorziening.description && (
                <div>
                  <label className="text-sm font-medium">Beschrijving</label>
                  <div className="mt-1">{selectedVoorziening.description}</div>
                </div>
              )}

              <div className="flex justify-between pt-4">
                <Button variant="outline">
                  <Edit className="mr-2 h-4 w-4" />
                  Bewerken
                </Button>
                <Button variant="destructive" onClick={() => handleDeleteVoorziening(selectedVoorziening.id)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Verwijderen
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
