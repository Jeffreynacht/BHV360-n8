"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ZoomIn, ZoomOut, RotateCcw, Download, Edit3, Save, X, Plus } from "lucide-react"
import {
  type Voorziening,
  getVoorzieningen,
  createVoorziening,
  updateVoorziening,
  deleteVoorziening,
  getVoorzieningIcon,
  getVoorzieningLabel,
  getStatusColor,
  getStatusLabel,
} from "@/lib/voorzieningen"
import VoorzieningModal from "./VoorzieningModal"
import { toast } from "sonner"

const SAFETY_ICONS = {
  brandblusser: {
    icon: "/images/fire-extinguisher-symbol.png",
    label: "Brandblusser",
    color: "bg-red-100 border-red-300",
  },
  nooduitgang: {
    icon: "/images/emergency-exit-green.png",
    label: "Nooduitgang",
    color: "bg-green-100 border-green-300",
  },
  ehbo: {
    icon: "/images/medical-cross.png",
    label: "EHBO Post",
    color: "bg-blue-100 border-blue-300",
  },
  aed: {
    icon: "/images/aed-heart.png",
    label: "AED",
    color: "bg-purple-100 border-purple-300",
  },
  verzamelplaats: {
    icon: "/images/assembly-point-people.png",
    label: "Verzamelplaats",
    color: "bg-orange-100 border-orange-300",
  },
  brandmelder: {
    icon: "/images/fire-alarm-symbol.png",
    label: "Brandmelder",
    color: "bg-yellow-100 border-yellow-300",
  },
  noodtelefoon: {
    icon: "/images/emergency-phone.png",
    label: "Noodtelefoon",
    color: "bg-indigo-100 border-indigo-300",
  },
}

export function BHV360Plotkaart() {
  const [zoom, setZoom] = useState(1)
  const [isEditMode, setIsEditMode] = useState(false)
  const [voorzieningen, setVoorzieningen] = useState<Voorziening[]>([])
  const [selectedVoorziening, setSelectedVoorziening] = useState<Voorziening | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">("view")
  const [isLoading, setIsLoading] = useState(true)
  const plotkaartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadVoorzieningen()
  }, [])

  const loadVoorzieningen = async () => {
    try {
      setIsLoading(true)
      const data = await getVoorzieningen()
      setVoorzieningen(data)
    } catch (error) {
      console.error("Error loading voorzieningen:", error)
      toast.error("Fout bij laden van voorzieningen")
    } finally {
      setIsLoading(false)
    }
  }

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
    if (plotkaartRef.current) {
      // In een echte implementatie zou hier een PDF of PNG export komen
      toast.success("Download functionaliteit wordt binnenkort toegevoegd")
    }
  }

  const handleEditToggle = () => {
    setIsEditMode(!isEditMode)
    if (isEditMode) {
      toast.success("Edit modus uitgeschakeld")
    } else {
      toast.success("Edit modus ingeschakeld - klik op de plattegrond om voorzieningen toe te voegen")
    }
  }

  const handlePlotkaartClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isEditMode) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = Math.round((e.clientX - rect.left) / zoom)
    const y = Math.round((e.clientY - rect.top) / zoom)

    setSelectedVoorziening({
      id: "",
      type: "brandblusser",
      naam: "",
      locatie: { x, y },
      status: "actief",
      createdAt: "",
      updatedAt: "",
    })
    setModalMode("create")
    setIsModalOpen(true)
  }

  const handleVoorzieningClick = (voorziening: Voorziening, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedVoorziening(voorziening)
    setModalMode(isEditMode ? "edit" : "view")
    setIsModalOpen(true)
  }

  const handleSaveVoorziening = async (voorzieningData: Omit<Voorziening, "id" | "createdAt" | "updatedAt">) => {
    try {
      if (modalMode === "create") {
        await createVoorziening(voorzieningData)
        toast.success("Voorziening toegevoegd")
      } else if (modalMode === "edit" && selectedVoorziening) {
        await updateVoorziening(selectedVoorziening.id, voorzieningData)
        toast.success("Voorziening bijgewerkt")
      }
      await loadVoorzieningen()
    } catch (error) {
      console.error("Error saving voorziening:", error)
      toast.error("Fout bij opslaan van voorziening")
    }
  }

  const handleDeleteVoorziening = async (id: string) => {
    try {
      await deleteVoorziening(id)
      toast.success("Voorziening verwijderd")
      await loadVoorzieningen()
      setIsModalOpen(false)
    } catch (error) {
      console.error("Error deleting voorziening:", error)
      toast.error("Fout bij verwijderen van voorziening")
    }
  }

  const getStatistics = () => {
    const stats = voorzieningen.reduce(
      (acc, voorziening) => {
        acc[voorziening.type] = (acc[voorziening.type] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return Object.entries(SAFETY_ICONS).map(([type, config]) => ({
      type: type as keyof typeof SAFETY_ICONS,
      label: config.label,
      count: stats[type] || 0,
      color: config.color,
    }))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">BHV360 Plotkaart</h1>
          <p className="text-gray-600 mt-1">Interactieve plattegrond met veiligheidsvoorzieningen</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={handleZoomIn}>
            <ZoomIn className="w-4 h-4 mr-2" />
            Zoom In
          </Button>
          <Button variant="outline" size="sm" onClick={handleZoomOut}>
            <ZoomOut className="w-4 h-4 mr-2" />
            Zoom Out
          </Button>
          <Button variant="outline" size="sm" onClick={handleResetZoom}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button variant={isEditMode ? "default" : "outline"} size="sm" onClick={handleEditToggle}>
            {isEditMode ? (
              <>
                <Save className="w-4 h-4 mr-2" />
                Opslaan
              </>
            ) : (
              <>
                <Edit3 className="w-4 h-4 mr-2" />
                Bewerken
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Plotkaart */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Plattegrond
                {isEditMode && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    <Edit3 className="w-3 h-3 mr-1" />
                    Edit Modus
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                {isEditMode
                  ? "Klik op de plattegrond om voorzieningen toe te voegen of klik op bestaande voorzieningen om te bewerken"
                  : "Klik op voorzieningen voor meer informatie"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                ref={plotkaartRef}
                className={`relative bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden ${
                  isEditMode ? "cursor-crosshair" : "cursor-default"
                }`}
                style={{
                  height: "500px",
                  transform: `scale(${zoom})`,
                  transformOrigin: "top left",
                }}
                onClick={handlePlotkaartClick}
              >
                {/* Gebouw outline */}
                <div className="absolute inset-4 border-2 border-gray-400 bg-white rounded">
                  {/* Kamers */}
                  <div className="absolute top-4 left-4 w-32 h-24 border border-gray-300 bg-blue-50 rounded flex items-center justify-center text-xs font-medium">
                    Receptie
                  </div>
                  <div className="absolute top-4 right-4 w-40 h-32 border border-gray-300 bg-green-50 rounded flex items-center justify-center text-xs font-medium">
                    Kantoor
                  </div>
                  <div className="absolute bottom-4 left-4 w-48 h-28 border border-gray-300 bg-yellow-50 rounded flex items-center justify-center text-xs font-medium">
                    Vergaderruimte
                  </div>
                  <div className="absolute bottom-4 right-4 w-32 h-20 border border-gray-300 bg-red-50 rounded flex items-center justify-center text-xs font-medium">
                    Keuken
                  </div>

                  {/* Gang */}
                  <div className="absolute top-32 left-4 right-4 bottom-36 bg-gray-100 rounded flex items-center justify-center text-xs font-medium text-gray-600">
                    Centrale Gang
                  </div>
                </div>

                {/* Voorzieningen */}
                {voorzieningen.map((voorziening) => (
                  <div
                    key={voorziening.id}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all hover:scale-110 ${
                      SAFETY_ICONS[voorziening.type]?.color || "bg-gray-100 border-gray-300"
                    } border-2 rounded-full p-2 shadow-md`}
                    style={{
                      left: voorziening.locatie.x,
                      top: voorziening.locatie.y,
                    }}
                    onClick={(e) => handleVoorzieningClick(voorziening, e)}
                    title={`${voorziening.naam} (${getStatusLabel(voorziening.status)})`}
                  >
                    <img
                      src={getVoorzieningIcon(voorziening.type) || "/placeholder.svg"}
                      alt={getVoorzieningLabel(voorziening.type)}
                      className="w-6 h-6"
                    />
                    {voorziening.status !== "actief" && (
                      <div
                        className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
                          voorziening.status === "onderhoud" ? "bg-yellow-500" : "bg-red-500"
                        }`}
                      />
                    )}
                  </div>
                ))}

                {/* Zoom indicator */}
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                  {Math.round(zoom * 100)}%
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Legenda en Statistieken */}
        <div className="space-y-6">
          {/* Legenda */}
          <Card>
            <CardHeader>
              <CardTitle>Legenda</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {getStatistics().map((stat) => (
                <div key={stat.type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded border ${stat.color}`} />
                    <span className="text-sm font-medium">{stat.label}</span>
                  </div>
                  <Badge variant="secondary">{stat.count} items</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Statistieken */}
          <Card>
            <CardHeader>
              <CardTitle>Statistieken</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{voorzieningen.length}</div>
                  <div className="text-xs text-gray-600">Totaal</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {voorzieningen.filter((v) => v.status === "actief").length}
                  </div>
                  <div className="text-xs text-gray-600">Actief</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {voorzieningen.filter((v) => v.status === "onderhoud").length}
                  </div>
                  <div className="text-xs text-gray-600">Onderhoud</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {voorzieningen.filter((v) => v.status === "defect").length}
                  </div>
                  <div className="text-xs text-gray-600">Defect</div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-medium text-sm">Status Overzicht</h4>
                {voorzieningen
                  .filter((v) => v.status !== "actief")
                  .map((voorziening) => (
                    <div key={voorziening.id} className="flex items-center justify-between text-xs">
                      <span className="truncate">{voorziening.naam}</span>
                      <Badge variant="outline" className={getStatusColor(voorziening.status)}>
                        {getStatusLabel(voorziening.status)}
                      </Badge>
                    </div>
                  ))}
                {voorzieningen.filter((v) => v.status !== "actief").length === 0 && (
                  <p className="text-xs text-gray-500 italic">Alle voorzieningen zijn actief</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          {isEditMode && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => {
                    setSelectedVoorziening(null)
                    setModalMode("create")
                    setIsModalOpen(true)
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Voorziening Toevoegen
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={handleEditToggle}
                >
                  <X className="w-4 h-4 mr-2" />
                  Exit Edit Mode
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Modal */}
      <VoorzieningModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        voorziening={selectedVoorziening}
        onSave={handleSaveVoorziening}
        mode={modalMode}
      />
    </div>
  )
}

// Named export for compatibility

// Default export
export default BHV360Plotkaart
