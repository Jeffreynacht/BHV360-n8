"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, Undo, Redo, ZoomIn, ZoomOut, Grid, MousePointer, Move, RotateCcw } from "lucide-react"
import Link from "next/link"

export default function PlotkaartEditorDemoPage() {
  const [selectedTool, setSelectedTool] = useState("pointer")
  const [zoom, setZoom] = useState(100)

  const tools = [
    { id: "pointer", name: "Selecteren", icon: MousePointer },
    { id: "move", name: "Verplaatsen", icon: Move },
    { id: "rotate", name: "Roteren", icon: RotateCcw },
  ]

  const safetyIcons = [
    { name: "Nooduitgang", icon: "🚪", category: "Uitgangen" },
    { name: "Brandblusser", icon: "🧯", category: "Brandveiligheid" },
    { name: "EHBO Kit", icon: "🏥", category: "Medisch" },
    { name: "AED", icon: "❤️", category: "Medisch" },
    { name: "Verzamelpunt", icon: "👥", category: "Evacuatie" },
    { name: "Brandmelder", icon: "🔥", category: "Brandveiligheid" },
    { name: "Sprinkler", icon: "💧", category: "Brandveiligheid" },
    { name: "Noodverlichting", icon: "💡", category: "Verlichting" },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/demo/overview" className="flex items-center text-blue-600 hover:text-blue-700">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Terug naar demo overzicht
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                🎨 Interactieve Editor
              </Badge>
              <h1 className="text-xl font-bold text-gray-900">Plotkaart Editor</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Undo className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Redo className="h-4 w-4" />
              </Button>
              <Button size="sm">
                <Save className="h-4 w-4 mr-2" />
                Opslaan
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r overflow-y-auto">
          {/* Tools */}
          <div className="p-4 border-b">
            <h3 className="font-semibold text-gray-900 mb-3">Gereedschappen</h3>
            <div className="grid grid-cols-3 gap-2">
              {tools.map((tool) => {
                const IconComponent = tool.icon
                return (
                  <Button
                    key={tool.id}
                    variant={selectedTool === tool.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTool(tool.id)}
                    className="flex flex-col h-16"
                  >
                    <IconComponent className="h-5 w-5 mb-1" />
                    <span className="text-xs">{tool.name}</span>
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Zoom Controls */}
          <div className="p-4 border-b">
            <h3 className="font-semibold text-gray-900 mb-3">Zoom</h3>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setZoom(Math.max(25, zoom - 25))}
                disabled={zoom <= 25}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium w-16 text-center">{zoom}%</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setZoom(Math.min(200, zoom + 25))}
                disabled={zoom >= 200}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-2">
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                <Grid className="h-4 w-4 mr-2" />
                Raster aan/uit
              </Button>
            </div>
          </div>

          {/* Safety Icons */}
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Veiligheidsiconen</h3>
            <div className="space-y-4">
              {["Uitgangen", "Brandveiligheid", "Medisch", "Evacuatie", "Verlichting"].map((category) => (
                <div key={category}>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">{category}</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {safetyIcons
                      .filter((icon) => icon.category === category)
                      .map((icon, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="flex flex-col h-16 text-xs bg-transparent"
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData("text/plain", icon.name)
                          }}
                        >
                          <span className="text-2xl mb-1">{icon.icon}</span>
                          {icon.name}
                        </Button>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 relative overflow-hidden">
          <div
            className="w-full h-full bg-white relative"
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top left" }}
            onDrop={(e) => {
              e.preventDefault()
              const iconName = e.dataTransfer.getData("text/plain")
              console.log(`Dropped ${iconName} at position`, e.clientX, e.clientY)
            }}
            onDragOver={(e) => e.preventDefault()}
          >
            {/* Grid Background */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                  linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
                `,
                backgroundSize: "20px 20px",
              }}
            />

            {/* Demo Floor Plan */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 600">
              {/* Room Outlines */}
              <rect x="50" y="50" width="300" height="200" fill="none" stroke="#374151" strokeWidth="2" />
              <rect x="400" y="50" width="300" height="200" fill="none" stroke="#374151" strokeWidth="2" />
              <rect x="50" y="300" width="650" height="250" fill="none" stroke="#374151" strokeWidth="2" />

              {/* Room Labels */}
              <text x="200" y="40" textAnchor="middle" className="fill-gray-700 text-sm font-medium">
                Kantoor A
              </text>
              <text x="550" y="40" textAnchor="middle" className="fill-gray-700 text-sm font-medium">
                Kantoor B
              </text>
              <text x="375" y="290" textAnchor="middle" className="fill-gray-700 text-sm font-medium">
                Open Werkruimte
              </text>

              {/* Demo Safety Icons */}
              <g className="cursor-pointer" onClick={() => alert("Nooduitgang geselecteerd!")}>
                <rect x="45" y="140" width="10" height="20" fill="#ef4444" />
                <text x="25" y="135" className="fill-gray-600 text-xs">
                  Nooduitgang
                </text>
              </g>

              <g className="cursor-pointer" onClick={() => alert("Brandblusser geselecteerd!")}>
                <circle cx="100" cy="100" r="8" fill="#f97316" />
                <text x="75" y="85" className="fill-gray-600 text-xs">
                  Brandblusser
                </text>
              </g>

              <g className="cursor-pointer" onClick={() => alert("AED geselecteerd!")}>
                <rect x="450" y="90" width="16" height="12" fill="#dc2626" rx="2" />
                <text x="430" y="85" className="fill-gray-600 text-xs">
                  AED
                </text>
              </g>

              <g className="cursor-pointer" onClick={() => alert("EHBO Kit geselecteerd!")}>
                <rect x="600" y="90" width="16" height="16" fill="#059669" rx="2" />
                <text x="575" y="85" className="fill-gray-600 text-xs">
                  EHBO Kit
                </text>
              </g>

              <g className="cursor-pointer" onClick={() => alert("Verzamelpunt geselecteerd!")}>
                <circle cx="375" cy="400" r="12" fill="#3b82f6" />
                <text x="340" y="385" className="fill-gray-600 text-xs">
                  Verzamelpunt
                </text>
              </g>
            </svg>

            {/* Drop Zone Indicator */}
            <div className="absolute top-4 left-4 bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg p-4 max-w-xs">
              <p className="text-sm text-blue-700">
                💡 <strong>Tip:</strong> Sleep iconen uit de zijbalk naar de plattegrond om ze toe te voegen. Klik op
                bestaande iconen om ze te selecteren.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Info Bar */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Badge variant="secondary">🎮 Demo Modus</Badge>
            <span className="text-sm text-gray-600">
              Probeer iconen te slepen, klik op elementen, en gebruik de zoom functies
            </span>
          </div>
          <div className="flex space-x-2">
            <Link href="/demo/incident-simulator">
              <Button variant="outline" size="sm">
                Volgende Demo
              </Button>
            </Link>
            <Link href="/login">
              <Button size="sm">Probeer Volledige Versie</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
