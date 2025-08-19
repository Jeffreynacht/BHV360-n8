"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Upload, Eye, Download, Move, RotateCcw, Save } from "lucide-react"
import Link from "next/link"

const voorzieningen = [
  { id: "fire-extinguisher", name: "Brandblusser", icon: "🧯", color: "red" },
  { id: "fire-alarm", name: "Brandmelder", icon: "🚨", color: "red" },
  { id: "emergency-exit", name: "Nooduitgang", icon: "🚪", color: "green" },
  { id: "first-aid", name: "EHBO Post", icon: "🏥", color: "blue" },
  { id: "aed", name: "AED", icon: "💓", color: "blue" },
  { id: "assembly-point", name: "Verzamelplaats", icon: "👥", color: "orange" },
  { id: "fire-hose", name: "Brandslang", icon: "🔥", color: "red" },
  { id: "emergency-shower", name: "Nooddouche", icon: "🚿", color: "blue" },
]

const placedItems = [
  { id: 1, type: "fire-extinguisher", x: 150, y: 200, name: "Brandblusser A1" },
  { id: 2, type: "emergency-exit", x: 50, y: 100, name: "Nooduitgang Noord" },
  { id: 3, type: "first-aid", x: 300, y: 150, name: "EHBO Post Hoofdkantoor" },
  { id: 4, type: "aed", x: 200, y: 300, name: "AED Receptie" },
  { id: 5, type: "fire-alarm", x: 400, y: 100, name: "Brandmelder Zone 1" },
]

export default function PlotkaartEditorDemo() {
  const [selectedTool, setSelectedTool] = useState("select")
  const [selectedVoorziening, setSelectedVoorziening] = useState(null)
  const [showGrid, setShowGrid] = useState(true)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Terug naar Home
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Plotkaart Editor Demo</h1>
                <p className="text-sm text-gray-500">Interactieve plattegrond editor met BHV voorzieningen</p>
              </div>
            </div>
            <Badge className="bg-blue-100 text-blue-800">Demo Modus</Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Toolbar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Gereedschappen</CardTitle>
                <CardDescription>Selecteer een tool om te beginnen</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Tools */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-900">Basis Tools</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={selectedTool === "select" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTool("select")}
                      className="justify-start"
                    >
                      <Move className="h-4 w-4 mr-2" />
                      Selecteren
                    </Button>
                    <Button
                      variant={selectedTool === "upload" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTool("upload")}
                      className="justify-start"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                </div>

                {/* Voorzieningen */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-900">BHV Voorzieningen</h4>
                  <div className="space-y-1">
                    {voorzieningen.map((voorziening) => (
                      <Button
                        key={voorziening.id}
                        variant={selectedVoorziening === voorziening.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          setSelectedVoorziening(voorziening.id)
                          setSelectedTool("place")
                        }}
                        className="w-full justify-start"
                      >
                        <span className="mr-2">{voorziening.icon}</span>
                        {voorziening.name}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* View Options */}
                <div className="space-y-2 pt-4 border-t">
                  <h4 className="text-sm font-medium text-gray-900">Weergave</h4>
                  <div className="space-y-2">
                    <Button
                      variant={showGrid ? "default" : "outline"}
                      size="sm"
                      onClick={() => setShowGrid(!showGrid)}
                      className="w-full justify-start"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      {showGrid ? "Verberg" : "Toon"} Raster
                    </Button>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-4 border-t">
                  <Button className="w-full" size="sm">
                    <Save className="h-4 w-4 mr-2" />
                    Opslaan
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Exporteren
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent" size="sm">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Canvas Area */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Plattegrond Canvas</CardTitle>
                    <CardDescription>
                      {selectedTool === "select" && "Klik op voorzieningen om ze te selecteren en verplaatsen"}
                      {selectedTool === "upload" && "Sleep een plattegrond bestand naar dit gebied"}
                      {selectedTool === "place" &&
                        selectedVoorziening &&
                        `Klik om een ${voorzieningen.find((v) => v.id === selectedVoorziening)?.name} te plaatsen`}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">1:100 schaal</Badge>
                    <Badge variant="outline">500x400px</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {/* Canvas */}
                  <div
                    className={`relative w-full h-96 border-2 border-dashed border-gray-300 rounded-lg bg-white overflow-hidden ${
                      selectedTool === "upload" ? "border-blue-400 bg-blue-50" : ""
                    }`}
                    style={{
                      backgroundImage: showGrid ? "radial-gradient(circle, #e5e7eb 1px, transparent 1px)" : "none",
                      backgroundSize: showGrid ? "20px 20px" : "auto",
                    }}
                  >
                    {/* Background Floor Plan */}
                    <div className="absolute inset-0 opacity-20">
                      <svg width="100%" height="100%" viewBox="0 0 500 400">
                        {/* Simple floor plan outline */}
                        <rect x="50" y="50" width="400" height="300" fill="none" stroke="#666" strokeWidth="2" />
                        <rect x="100" y="100" width="100" height="80" fill="none" stroke="#666" strokeWidth="1" />
                        <rect x="250" y="100" width="100" height="80" fill="none" stroke="#666" strokeWidth="1" />
                        <rect x="100" y="220" width="250" height="80" fill="none" stroke="#666" strokeWidth="1" />
                        <text x="150" y="140" fontSize="12" fill="#666">
                          Kantoor A
                        </text>
                        <text x="300" y="140" fontSize="12" fill="#666">
                          Kantoor B
                        </text>
                        <text x="200" y="260" fontSize="12" fill="#666">
                          Vergaderruimte
                        </text>
                      </svg>
                    </div>

                    {/* Placed Items */}
                    {placedItems.map((item) => {
                      const voorziening = voorzieningen.find((v) => v.id === item.type)
                      return (
                        <div
                          key={item.id}
                          className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform"
                          style={{ left: item.x, top: item.y }}
                          title={item.name}
                        >
                          <div className="w-8 h-8 bg-white rounded-full shadow-lg border-2 border-gray-300 flex items-center justify-center text-lg hover:border-blue-500">
                            {voorziening?.icon}
                          </div>
                        </div>
                      )
                    })}

                    {/* Upload Overlay */}
                    {selectedTool === "upload" && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <Upload className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                          <p className="text-lg font-medium text-gray-900">Sleep uw plattegrond hierheen</p>
                          <p className="text-sm text-gray-500">Ondersteunde formaten: PNG, JPG, PDF</p>
                          <Button className="mt-4">Bestand Selecteren</Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Legend */}
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Legenda</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {voorzieningen.slice(0, 8).map((voorziening) => (
                        <div key={voorziening.id} className="flex items-center space-x-2">
                          <span className="text-lg">{voorziening.icon}</span>
                          <span className="text-xs text-gray-600">{voorziening.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Properties Panel */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Eigenschappen</CardTitle>
                <CardDescription>Details van geselecteerde voorziening</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Naam</label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Voorziening naam"
                      defaultValue="Brandblusser A1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Type</label>
                    <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                      <option>Brandblusser</option>
                      <option>Nooduitgang</option>
                      <option>EHBO Post</option>
                      <option>AED</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                      <option>Operationeel</option>
                      <option>Onderhoud</option>
                      <option>Defect</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Demo CTA */}
        <Card className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Professionele plotkaarten in minuten!</h3>
              <p className="text-gray-600 mb-4">
                Maak interactieve plattegronden met alle BHV voorzieningen. Start uw gratis trial.
              </p>
              <div className="flex justify-center space-x-4">
                <Link href="/login">
                  <Button size="lg">Start Gratis Trial</Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" size="lg">
                    Meer Demo's
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
