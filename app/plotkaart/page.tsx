"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PageHeader } from "@/components/page-header"
import { useToast } from "@/hooks/use-toast"
import {
  MapPin,
  Building,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  Edit,
  Eye,
  AlertTriangle,
  Shield,
  Navigation,
} from "lucide-react"

interface FloorPlan {
  id: string
  name: string
  building: string
  floor: number
  imageUrl: string
  lastUpdated: string
  status: "active" | "draft" | "archived"
}

interface SafetyItem {
  id: string
  type:
    | "fire_extinguisher"
    | "emergency_exit"
    | "first_aid"
    | "aed"
    | "assembly_point"
    | "fire_alarm"
    | "emergency_phone"
  x: number
  y: number
  label: string
  status: "operational" | "maintenance" | "defect"
}

const mockFloorPlans: FloorPlan[] = [
  {
    id: "1",
    name: "Begane Grond",
    building: "Hoofdgebouw",
    floor: 0,
    imageUrl: "/placeholder.svg?height=400&width=600",
    lastUpdated: "2024-01-15",
    status: "active",
  },
  {
    id: "2",
    name: "Eerste Verdieping",
    building: "Hoofdgebouw",
    floor: 1,
    imageUrl: "/placeholder.svg?height=400&width=600",
    lastUpdated: "2024-01-10",
    status: "active",
  },
  {
    id: "3",
    name: "Tweede Verdieping",
    building: "Hoofdgebouw",
    floor: 2,
    imageUrl: "/placeholder.svg?height=400&width=600",
    lastUpdated: "2024-01-08",
    status: "draft",
  },
]

const mockSafetyItems: SafetyItem[] = [
  { id: "1", type: "fire_extinguisher", x: 100, y: 150, label: "Brandblusser A1", status: "operational" },
  { id: "2", type: "emergency_exit", x: 500, y: 50, label: "Nooduitgang Noord", status: "operational" },
  { id: "3", type: "first_aid", x: 300, y: 200, label: "EHBO Post", status: "operational" },
  { id: "4", type: "aed", x: 200, y: 100, label: "AED Receptie", status: "maintenance" },
  { id: "5", type: "assembly_point", x: 400, y: 300, label: "Verzamelpunt A", status: "operational" },
  { id: "6", type: "fire_alarm", x: 150, y: 250, label: "Brandmelder", status: "operational" },
  { id: "7", type: "emergency_phone", x: 450, y: 180, label: "Noodtelefoon", status: "defect" },
]

const safetyItemIcons = {
  fire_extinguisher: "/images/fire-extinguisher-symbol.png",
  emergency_exit: "/images/emergency-exit-green.png",
  first_aid: "/images/medical-cross.png",
  aed: "/images/aed-heart.png",
  assembly_point: "/images/assembly-point-people.png",
  fire_alarm: "/images/fire-alarm-symbol.png",
  emergency_phone: "/images/emergency-phone.png",
}

const safetyItemLabels = {
  fire_extinguisher: "Brandblusser",
  emergency_exit: "Nooduitgang",
  first_aid: "EHBO",
  aed: "AED",
  assembly_point: "Verzamelpunt",
  fire_alarm: "Brandmelder",
  emergency_phone: "Noodtelefoon",
}

const statusColors = {
  operational: "bg-green-100 text-green-800",
  maintenance: "bg-yellow-100 text-yellow-800",
  defect: "bg-red-100 text-red-800",
}

const statusLabels = {
  operational: "Operationeel",
  maintenance: "Onderhoud",
  defect: "Defect",
}

export default function PlotkaartPage() {
  const [selectedFloorPlan, setSelectedFloorPlan] = useState<FloorPlan>(mockFloorPlans[0])
  const [safetyItems, setSafetyItems] = useState<SafetyItem[]>(mockSafetyItems)
  const [zoom, setZoom] = useState(1)
  const [showLegend, setShowLegend] = useState(true)
  const [selectedItemTypes, setSelectedItemTypes] = useState<string[]>(Object.keys(safetyItemLabels))
  const { toast } = useToast()

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.2, 3))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.2, 0.5))
  }

  const handleResetZoom = () => {
    setZoom(1)
  }

  const handleDownload = () => {
    toast({
      title: "Download gestart",
      description: "De plotkaart wordt gedownload als PDF",
    })
  }

  const handleEditMode = () => {
    toast({
      title: "Bewerkingsmodus",
      description: "Je wordt doorgestuurd naar de plotkaart editor",
    })
  }

  const filteredSafetyItems = safetyItems.filter((item) => selectedItemTypes.includes(item.type))

  const getStatusCount = (status: SafetyItem["status"]) => {
    return safetyItems.filter((item) => item.status === status).length
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Plotkaart Viewer"
        description="Bekijk en navigeer door de veiligheidsplattegronden"
        showBackButton={true}
        backUrl="/dashboard"
      >
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Button onClick={handleEditMode}>
            <Edit className="h-4 w-4 mr-2" />
            Bewerken
          </Button>
        </div>
      </PageHeader>

      {/* Status Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totaal Items</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{safetyItems.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Operationeel</CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{getStatusCount("operational")}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Onderhoud</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{getStatusCount("maintenance")}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Defect</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{getStatusCount("defect")}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Controls */}
        <div className="space-y-4">
          {/* Floor Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Building className="h-5 w-5" />
                Verdieping Selectie
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Gebouw & Verdieping</label>
                <Select
                  value={selectedFloorPlan.id}
                  onValueChange={(value) => {
                    const plan = mockFloorPlans.find((p) => p.id === value)
                    if (plan) setSelectedFloorPlan(plan)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {mockFloorPlans.map((plan) => (
                      <SelectItem key={plan.id} value={plan.id}>
                        {plan.building} - {plan.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="text-sm text-muted-foreground">
                Laatst bijgewerkt: {new Date(selectedFloorPlan.lastUpdated).toLocaleDateString("nl-NL")}
              </div>
            </CardContent>
          </Card>

          {/* Zoom Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ZoomIn className="h-5 w-5" />
                Zoom Besturing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Zoom: {Math.round(zoom * 100)}%</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleZoomOut}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleResetZoom}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleZoomIn}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Legend */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Layers className="h-5 w-5" />
                Legenda
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(safetyItemLabels).map(([type, label]) => (
                <div key={type} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id={type}
                    checked={selectedItemTypes.includes(type)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedItemTypes([...selectedItemTypes, type])
                      } else {
                        setSelectedItemTypes(selectedItemTypes.filter((t) => t !== type))
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                  <img
                    src={safetyItemIcons[type as keyof typeof safetyItemIcons] || "/placeholder.svg"}
                    alt={label}
                    className="w-6 h-6"
                  />
                  <label htmlFor={type} className="text-sm font-medium cursor-pointer">
                    {label}
                  </label>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Floor Plan View */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    {selectedFloorPlan.building} - {selectedFloorPlan.name}
                  </CardTitle>
                  <CardDescription>Interactieve veiligheidsplattegrond met alle voorzieningen</CardDescription>
                </div>
                <Badge
                  className={
                    selectedFloorPlan.status === "active"
                      ? "bg-green-100 text-green-800"
                      : selectedFloorPlan.status === "draft"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                  }
                >
                  {selectedFloorPlan.status === "active"
                    ? "Actief"
                    : selectedFloorPlan.status === "draft"
                      ? "Concept"
                      : "Gearchiveerd"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative border rounded-lg overflow-hidden bg-gray-50">
                <div
                  className="relative"
                  style={{
                    transform: `scale(${zoom})`,
                    transformOrigin: "top left",
                    transition: "transform 0.2s ease-in-out",
                  }}
                >
                  {/* Floor Plan Image */}
                  <img
                    src={selectedFloorPlan.imageUrl || "/placeholder.svg"}
                    alt={`${selectedFloorPlan.building} - ${selectedFloorPlan.name}`}
                    className="w-full h-auto max-w-none"
                    style={{ minHeight: "400px", minWidth: "600px" }}
                  />

                  {/* Safety Items Overlay */}
                  {filteredSafetyItems.map((item) => (
                    <div
                      key={item.id}
                      className="absolute cursor-pointer group"
                      style={{
                        left: `${item.x}px`,
                        top: `${item.y}px`,
                        transform: "translate(-50%, -50%)",
                      }}
                      title={`${item.label} - ${statusLabels[item.status]}`}
                    >
                      {/* Safety Item Icon */}
                      <div
                        className={`relative p-1 rounded-full border-2 ${
                          item.status === "operational"
                            ? "border-green-500 bg-green-50"
                            : item.status === "maintenance"
                              ? "border-yellow-500 bg-yellow-50"
                              : "border-red-500 bg-red-50"
                        }`}
                      >
                        <img
                          src={safetyItemIcons[item.type] || "/placeholder.svg"}
                          alt={safetyItemLabels[item.type]}
                          className="w-8 h-8"
                        />

                        {/* Status Indicator */}
                        <div
                          className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                            item.status === "operational"
                              ? "bg-green-500"
                              : item.status === "maintenance"
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                        />
                      </div>

                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        <div className="font-medium">{item.label}</div>
                        <div className="text-gray-300">{statusLabels[item.status]}</div>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floor Plan Info */}
              <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span>Zoom: {Math.round(zoom * 100)}%</span>
                  <span>
                    Items getoond: {filteredSafetyItems.length}/{safetyItems.length}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>Alleen-lezen modus</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Safety Items List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            Veiligheidsvoorzieningen Overzicht
          </CardTitle>
          <CardDescription>Alle veiligheidsvoorzieningen op de geselecteerde verdieping</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredSafetyItems.map((item) => (
              <div key={item.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                <img
                  src={safetyItemIcons[item.type] || "/placeholder.svg"}
                  alt={safetyItemLabels[item.type]}
                  className="w-8 h-8"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{item.label}</div>
                  <div className="text-sm text-muted-foreground">{safetyItemLabels[item.type]}</div>
                </div>
                <Badge className={statusColors[item.status]}>{statusLabels[item.status]}</Badge>
              </div>
            ))}
          </div>

          {filteredSafetyItems.length === 0 && (
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Geen items gevonden</h3>
              <p className="text-muted-foreground">Geen veiligheidsvoorzieningen gevonden met de huidige filters</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
