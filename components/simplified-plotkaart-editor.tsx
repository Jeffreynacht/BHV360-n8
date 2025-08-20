"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SafetyIcon } from "@/components/safety-icons"
import { Save, Undo, Redo, ZoomIn, ZoomOut, Trash2, Download, Plus, Grid, FileUp, Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { exportPlotkaartToPDF, exportPlotkaartAsImage } from "@/lib/pdf-export"
import { ImageIcon } from "lucide-react"

// Types for safety items
type SafetyItemType =
  | "fire-extinguisher"
  | "fire-hose"
  | "evacuation-chair"
  | "emergency-exit"
  | "assembly-point"
  | "first-aid"
  | "aed"
  | "emergency-button"
  | "evacuation-route"
  | "fire-alarm"
  | "drag-mattress"
  | "dry-riser"
  | "a-first-aid"
  | "auto-gas"
  | "mobile-extinguisher"
  | "smoke-screens"
  | "bhv-kit"
  | "yellow-first-aid"
  | "red-bhv-bag"
  | "sprinkler"
  | "fire-door"
  | "bmc"
  | "mobile-fire-extinguisher"
  | "fire-curtain"
  | "fire-suppression-nozzle"
  | "fire-blanket"
  | "class-b-extinguisher"
  | "fire-alarm-horn"
  | "fire-blanket-usage"
  | "emergency-phone"
  | "fire-hydrant"
  | "emergency-exit-green"
  | "direction-arrow-red"
  | "direction-arrow-simple"
  | "safety-vest"
  | "fire-equipment"
  | "water-valve"
  | "electrical-hazard"
  | "gas-valve"
  | "public-address"
  | "emergency-stop"
  | "emergency-torch"
  | "evacuation-arrow-green"
  | "exit-up-arrow"
  | "assembly-point-people"
  | "accessible-exit"
  | "emergency-call-button"
  | "medical-stretcher"
  | "medical-cross"
  | "eye-wash-station"
  | "medical-transport"
  | "first-aid-provider"
  | "aed-heart"
  | "emergency-shower"
  | "bhv-helmet"
  | "safety-gloves"
  | "safety-harness"
  | "no-elevator"
  | "no-open-flames"
  | "no-forklifts"
  | "custom"

interface SafetyItem {
  id: string
  type: SafetyItemType
  x: number
  y: number
  rotation: number
  label?: string
  notes?: string
  lastInspection?: string
  custom?: boolean
  customIcon?: string
}

// Types for floor plan
interface FloorPlan {
  id: string
  name: string
  building: string
  floor: string
  imageUrl: string
  items: SafetyItem[]
}

// Sample data
const sampleFloorPlans: FloorPlan[] = [
  {
    id: "1",
    name: "Hoofdgebouw - Begane Grond",
    building: "Hoofdgebouw",
    floor: "Begane Grond",
    imageUrl: "/placeholder.svg?height=800&width=1200",
    items: [],
  },
  {
    id: "2",
    name: "Hoofdgebouw - 1e Verdieping",
    building: "Hoofdgebouw",
    floor: "1e Verdieping",
    imageUrl: "/placeholder.svg?height=800&width=1200",
    items: [],
  },
  {
    id: "3",
    name: "Bijgebouw - Begane Grond",
    building: "Bijgebouw",
    floor: "Begane Grond",
    imageUrl: "/placeholder.svg?height=800&width=1200",
    items: [],
  },
]

// Safety item types with their descriptions
const safetyItemTypes = [
  // Blusmiddelen
  {
    id: "fire-extinguisher",
    name: "Brandblusser",
    description: "Draagbare brandblusser voor het blussen van kleine branden",
    category: "blusmiddelen",
  },
  {
    id: "fire-hose",
    name: "Brandslanghaspel",
    description: "Brandslanghaspel voor het blussen van grotere branden",
    category: "blusmiddelen",
  },
  {
    id: "sprinkler",
    name: "Sprinklerinstallatie",
    description: "Automatische sprinklerinstallatie",
    category: "blusmiddelen",
  },
  {
    id: "mobile-fire-extinguisher",
    name: "Verrijdbare brandblusser",
    description: "Verrijdbare brandblusser voor grotere branden",
    category: "blusmiddelen",
  },
  {
    id: "fire-suppression-nozzle",
    name: "Blusinstallatie mondstuk",
    description: "Mondstuk van automatische blusinstallatie",
    category: "blusmiddelen",
  },
  {
    id: "fire-blanket",
    name: "Blusdeken",
    description: "Blusdeken voor het blussen van kleine branden",
    category: "blusmiddelen",
  },
  {
    id: "class-b-extinguisher",
    name: "Klasse B brandblusser",
    description: "Brandblusser speciaal voor vloeistofbranden (klasse B)",
    category: "blusmiddelen",
  },
  {
    id: "fire-blanket-usage",
    name: "Blusdeken instructie",
    description: "Instructiepictogram voor het gebruik van blusdeken",
    category: "blusmiddelen",
  },
  {
    id: "fire-hydrant",
    name: "Brandkraan",
    description: "Aansluiting voor brandweerslangen",
    category: "blusmiddelen",
  },
  {
    id: "dry-riser",
    name: "Aansluitpunt droge stijgleiding",
    description: "Aansluitpunt voor brandweerslangen",
    category: "blusmiddelen",
  },
  {
    id: "auto-gas",
    name: "Automatische blusgasinstallatie",
    description: "Automatisch systeem dat blusgas vrijgeeft bij brand",
    category: "blusmiddelen",
  },
  {
    id: "mobile-extinguisher",
    name: "Verrijdbare blusmiddelen",
    description: "Verrijdbare brandblusser voor grotere branden",
    category: "blusmiddelen",
  },
  {
    id: "fire-equipment",
    name: "Brandweermateriaal",
    description: "Algemeen brandweermateriaal",
    category: "blusmiddelen",
  },

  // Evacuatie
  {
    id: "emergency-exit",
    name: "Nooduitgang",
    description: "Uitgang te gebruiken in geval van nood",
    category: "evacuatie",
  },
  {
    id: "emergency-exit-green",
    name: "Nooduitgang (groen)",
    description: "Groene nooduitgang aanduiding",
    category: "evacuatie",
  },
  {
    id: "exit-up-arrow",
    name: "Uitgang omhoog",
    description: "Nooduitgang richting omhoog",
    category: "evacuatie",
  },
  {
    id: "accessible-exit",
    name: "Toegankelijke uitgang",
    description: "Nooduitgang toegankelijk voor mindervaliden",
    category: "evacuatie",
  },
  {
    id: "fire-door",
    name: "Brandwerende deur",
    description: "Deur die brandverspreiding tegenhoudt",
    category: "evacuatie",
  },
  {
    id: "direction-arrow-red",
    name: "Richtingspijl (rood)",
    description: "Rode pijl voor vluchtroute aanduiding",
    category: "evacuatie",
  },
  {
    id: "direction-arrow-simple",
    name: "Richtingspijl (eenvoudig)",
    description: "Eenvoudige pijl voor vluchtroute aanduiding",
    category: "evacuatie",
  },
  {
    id: "evacuation-arrow-green",
    name: "Evacuatiepijl (groen)",
    description: "Groene pijl voor evacuatieroute",
    category: "evacuatie",
  },
  {
    id: "evacuation-route",
    name: "Vluchtroute",
    description: "Aangewezen route voor evacuatie",
    category: "evacuatie",
  },
  {
    id: "assembly-point",
    name: "Verzamelpunt",
    description: "Verzamelpunt voor evacuatie",
    category: "evacuatie",
  },
  {
    id: "assembly-point-people",
    name: "Verzamelpunt personen",
    description: "Verzamelpunt met personen pictogram",
    category: "evacuatie",
  },
  {
    id: "evacuation-chair",
    name: "Evacuatiestoel",
    description: "Stoel voor het evacueren van mindervaliden via de trap",
    category: "evacuatie",
  },
  {
    id: "drag-mattress",
    name: "Sleepmatras",
    description: "Matras voor het evacueren van mindervaliden",
    category: "evacuatie",
  },

  // EHBO
  {
    id: "first-aid",
    name: "EHBO-koffer",
    description: "EHBO-koffer met eerste hulp materialen",
    category: "ehbo",
  },
  {
    id: "aed",
    name: "AED",
    description: "Automatische Externe Defibrillator",
    category: "ehbo",
  },
  {
    id: "aed-heart",
    name: "AED (hart)",
    description: "AED met hartsymbool",
    category: "ehbo",
  },
  {
    id: "a-first-aid",
    name: "A-EHBO trommel",
    description: "Uitgebreide EHBO-trommel type A",
    category: "ehbo",
  },
  {
    id: "bhv-kit",
    name: "BHV trommel",
    description: "Trommel met BHV-materialen",
    category: "ehbo",
  },
  {
    id: "yellow-first-aid",
    name: "Gele EHBO tas",
    description: "Gele tas met EHBO-materialen",
    category: "ehbo",
  },
  {
    id: "red-bhv-bag",
    name: "Rode BHV tas",
    description: "Rode tas met BHV-materialen",
    category: "ehbo",
  },
  {
    id: "medical-cross",
    name: "Medisch kruis",
    description: "Groen medisch kruis voor EHBO-post",
    category: "ehbo",
  },
  {
    id: "medical-stretcher",
    name: "Brancard",
    description: "Brancard voor gewondentransport",
    category: "ehbo",
  },
  {
    id: "medical-transport",
    name: "Medisch transport",
    description: "Symbool voor gewondentransport",
    category: "ehbo",
  },
  {
    id: "first-aid-provider",
    name: "EHBO-verlener",
    description: "Symbool voor EHBO-verlener",
    category: "ehbo",
  },
  {
    id: "eye-wash-station",
    name: "Oogdouche",
    description: "Nooddouche voor ogen",
    category: "ehbo",
  },
  {
    id: "emergency-shower",
    name: "Nooddouche",
    description: "Nooddouche voor chemische ongevallen",
    category: "ehbo",
  },

  // Alarm
  {
    id: "fire-alarm",
    name: "Handmelder",
    description: "Handmatige brandmelder",
    category: "alarm",
  },
  {
    id: "bmc",
    name: "Brand Meld Centrale",
    description: "Centrale voor brandmeldingsysteem",
    category: "alarm",
  },
  {
    id: "fire-alarm-horn",
    name: "Brandalarmsirene",
    description: "Sirene die afgaat bij brandalarm",
    category: "alarm",
  },
  {
    id: "emergency-button",
    name: "Noodknop",
    description: "Knop voor het activeren van het brandalarm",
    category: "alarm",
  },
  {
    id: "emergency-call-button",
    name: "Noodoproepknop",
    description: "Knop voor het oproepen van hulp",
    category: "alarm",
  },
  {
    id: "public-address",
    name: "Omroepinstallatie",
    description: "Systeem voor noodberichten en evacuatie-instructies",
    category: "alarm",
  },

  // BHV Materiaal
  {
    id: "safety-vest",
    name: "Veiligheidsvest",
    description: "Veiligheidsvest voor BHV'ers",
    category: "bhv-materiaal",
  },
  {
    id: "bhv-helmet",
    name: "BHV-helm",
    description: "Veiligheidshelm voor BHV-functionarissen",
    category: "bhv-materiaal",
  },
  {
    id: "safety-gloves",
    name: "Veiligheidshandschoenen",
    description: "Handschoenen voor bescherming",
    category: "bhv-materiaal",
  },
  {
    id: "safety-harness",
    name: "Veiligheidsharnas",
    description: "Harnas voor valbeveiliging",
    category: "bhv-materiaal",
  },

  // Preventie
  {
    id: "smoke-screens",
    name: "Rookschermen",
    description: "Schermen die automatisch zakken om rookverspreiding te voorkomen",
    category: "preventie",
  },
  {
    id: "fire-curtain",
    name: "Brandscherm",
    description: "Automatisch brandscherm om brandverspreiding te voorkomen",
    category: "preventie",
  },

  // Communicatie
  {
    id: "emergency-phone",
    name: "Noodtelefoon",
    description: "Telefoon voor noodgevallen",
    category: "communicatie",
  },

  // Technische voorzieningen
  {
    id: "water-valve",
    name: "Waterafsluiter",
    description: "Afsluiter voor de watertoevoer",
    category: "techniek",
  },
  {
    id: "gas-valve",
    name: "Gasafsluiter",
    description: "Afsluiter voor de gastoevoer",
    category: "techniek",
  },
  {
    id: "emergency-stop",
    name: "Noodstop",
    description: "Noodstopknop voor machines en installaties",
    category: "techniek",
  },

  // Verlichting
  {
    id: "emergency-torch",
    name: "Noodverlichting",
    description: "Noodverlichting voor evacuatie",
    category: "verlichting",
  },

  // Verbodsborden
  {
    id: "no-elevator",
    name: "Lift verboden",
    description: "Lift niet gebruiken bij evacuatie",
    category: "verboden",
  },
  {
    id: "no-open-flames",
    name: "Open vuur verboden",
    description: "Verbod op open vuur",
    category: "verboden",
  },
  {
    id: "no-forklifts",
    name: "Heftrucks verboden",
    description: "Verbod op heftrucks",
    category: "verboden",
  },

  // Gevaaraanduidingen
  {
    id: "electrical-hazard",
    name: "Elektrisch gevaar",
    description: "Waarschuwing voor elektrisch gevaar",
    category: "gevaar",
  },
]

// Categories
const categories = [
  { id: "blusmiddelen", name: "Blusmiddelen" },
  { id: "evacuatie", name: "Evacuatie" },
  { id: "ehbo", name: "EHBO" },
  { id: "alarm", name: "Alarmsystemen" },
  { id: "bhv-materiaal", name: "BHV Materiaal" },
  { id: "preventie", name: "Preventie" },
  { id: "communicatie", name: "Communicatie" },
  { id: "techniek", name: "Technische voorzieningen" },
  { id: "verlichting", name: "Verlichting" },
  { id: "verboden", name: "Verbodsborden" },
  { id: "gevaar", name: "Gevaaraanduidingen" },
]

// Named export for the component
export function SimplifiedPlotkaartEditor() {
  const [selectedFloorPlan, setSelectedFloorPlan] = useState<FloorPlan>(sampleFloorPlans[0])
  const [items, setItems] = useState<SafetyItem[]>([])
  const [selectedItem, setSelectedItem] = useState<SafetyItem | null>(null)
  const [selectedItemType, setSelectedItemType] = useState<SafetyItemType | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("blusmiddelen")
  const [zoom, setZoom] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [showGrid, setShowGrid] = useState(false)
  const [customItemName, setCustomItemName] = useState("")
  const [customItemIcon, setCustomItemIcon] = useState("")
  const [isAddingCustomItem, setIsAddingCustomItem] = useState(false)
  const [showAllItems, setShowAllItems] = useState(true)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)

  const canvasRef = useRef<HTMLDivElement>(null)
  const historyRef = useRef<{ past: SafetyItem[][]; future: SafetyItem[][] }>({ past: [], future: [] })

  // Load items when floor plan changes
  useEffect(() => {
    setItems(selectedFloorPlan.items)
    setSelectedItem(null)
    setSelectedItemType(null)
  }, [selectedFloorPlan])

  // Save current state to history before making changes
  const saveToHistory = () => {
    historyRef.current.past.push([...items])
    historyRef.current.future = []
  }

  // Undo last action
  const undo = () => {
    if (historyRef.current.past.length > 0) {
      const previous = historyRef.current.past.pop()
      if (previous) {
        historyRef.current.future.push([...items])
        setItems(previous)
      }
    }
  }

  // Redo last undone action
  const redo = () => {
    if (historyRef.current.future.length > 0) {
      const next = historyRef.current.future.pop()
      if (next) {
        historyRef.current.past.push([...items])
        setItems(next)
      }
    }
  }

  // Handle canvas click to place item
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedItemType || selectedItem) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) / zoom
    const y = (e.clientY - rect.top) / zoom

    saveToHistory()

    const newItem: SafetyItem = {
      id: `item-${Date.now()}`,
      type: selectedItemType,
      x,
      y,
      rotation: 0,
      label: getItemName(selectedItemType),
      notes: "",
      lastInspection: new Date().toISOString().split("T")[0],
      custom: isAddingCustomItem,
      customIcon: isAddingCustomItem ? customItemIcon : undefined,
    }

    setItems([...items, newItem])
    setSelectedItem(newItem)
    setSelectedItemType(null)
    setIsAddingCustomItem(false)
  }

  // Handle item click
  const handleItemClick = (e: React.MouseEvent, item: SafetyItem) => {
    e.stopPropagation()
    setSelectedItem(item)
  }

  // Handle item drag
  const handleItemDragStart = (e: React.MouseEvent, item: SafetyItem) => {
    e.stopPropagation()
    setIsDragging(true)
    setSelectedItem(item)

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) / zoom
    const y = (e.clientY - rect.top) / zoom

    setDragOffset({
      x: item.x - x,
      y: item.y - y,
    })
  }

  // Handle mouse move for dragging
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedItem) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) / zoom + dragOffset.x
    const y = (e.clientY - rect.top) / zoom + dragOffset.y

    const updatedItems = items.map((item) => (item.id === selectedItem.id ? { ...item, x, y } : item))

    setItems(updatedItems)
    setSelectedItem({ ...selectedItem, x, y })
  }

  // Handle mouse up to end dragging
  const handleMouseUp = () => {
    if (isDragging) {
      saveToHistory()
      setIsDragging(false)
    }
  }

  // Update item properties
  const updateItemProperty = (property: keyof SafetyItem, value: any) => {
    if (!selectedItem) return

    saveToHistory()

    const updatedItems = items.map((item) => (item.id === selectedItem.id ? { ...item, [property]: value } : item))

    setItems(updatedItems)
    setSelectedItem({ ...selectedItem, [property]: value })
  }

  // Delete selected item
  const deleteSelectedItem = () => {
    if (!selectedItem) return

    saveToHistory()

    const updatedItems = items.filter((item) => item.id !== selectedItem.id)
    setItems(updatedItems)
    setSelectedItem(null)
  }

  // Save floor plan
  const saveFloorPlan = () => {
    const updatedFloorPlans = sampleFloorPlans.map((plan) =>
      plan.id === selectedFloorPlan.id ? { ...plan, items } : plan,
    )

    console.log("Saving floor plan:", { ...selectedFloorPlan, items })
    alert("Plattegrond opgeslagen!")
  }

  // Export floor plan as JSON
  const exportFloorPlan = () => {
    const dataStr = JSON.stringify({ ...selectedFloorPlan, items }, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

    const exportFileDefaultName = `${selectedFloorPlan.building}-${selectedFloorPlan.floor}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  // Add custom item
  const addCustomItem = () => {
    if (!customItemName || !customItemIcon) return

    setSelectedItemType("custom")
    setIsAddingCustomItem(true)
  }

  // Get name for item type
  const getItemName = (type: SafetyItemType): string => {
    if (type === "custom") return customItemName
    const itemType = safetyItemTypes.find((item) => item.id === type)
    return itemType ? itemType.name : "Onbekend item"
  }

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        setUploadedImage(event.target.result as string)

        const updatedFloorPlan = {
          ...selectedFloorPlan,
          imageUrl: event.target.result as string,
        }
        setSelectedFloorPlan(updatedFloorPlan)
      }
    }
    reader.readAsDataURL(file)
  }

  // Filter items by category
  const filteredItemTypes = safetyItemTypes.filter((item) => item.category === selectedCategory)

  // Export plotkaart as PDF
  const exportToPDF = async () => {
    const filename = `${selectedFloorPlan.building}-${selectedFloorPlan.floor}-plotkaart.pdf`
    await exportPlotkaartToPDF("plotkaart-canvas", {
      filename,
      title: "BHV Plotkaart",
      building: selectedFloorPlan.building,
      floor: selectedFloorPlan.floor,
      customerName: "BHV360 Management", // You can get this from context
      quality: 2,
    })
  }

  // Export plotkaart as image
  const exportToImage = async () => {
    const filename = `${selectedFloorPlan.building}-${selectedFloorPlan.floor}-plotkaart.png`
    await exportPlotkaartAsImage("plotkaart-canvas", filename)
  }

  return (
    <div className="p-4">
      <Card className="mb-4">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>BHV Plotkaart Editor</CardTitle>
              <CardDescription>Maak eenvoudig een BHV-plotkaart met officiële veiligheidspictogrammen</CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={undo} disabled={historyRef.current.past.length === 0}>
                <Undo className="h-4 w-4 mr-1" /> Ongedaan maken
              </Button>
              <Button variant="outline" size="sm" onClick={redo} disabled={historyRef.current.future.length === 0}>
                <Redo className="h-4 w-4 mr-1" /> Opnieuw
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowGrid(!showGrid)}>
                <Grid className="h-4 w-4 mr-1" /> {showGrid ? "Raster verbergen" : "Raster tonen"}
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowAllItems(!showAllItems)}>
                {showAllItems ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                {showAllItems ? "Verberg items" : "Toon items"}
              </Button>
              <Button variant="default" size="sm" onClick={saveFloorPlan}>
                <Save className="h-4 w-4 mr-1" /> Opslaan
              </Button>
              <Button variant="outline" size="sm" onClick={exportToPDF}>
                <ImageIcon className="h-4 w-4 mr-1" /> PDF Export
              </Button>
              <Button variant="outline" size="sm" onClick={exportToImage}>
                <ImageIcon className="h-4 w-4 mr-1" /> PNG Export
              </Button>
              <Button variant="outline" size="sm" onClick={exportFloorPlan}>
                <Download className="h-4 w-4 mr-1" /> JSON Export
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-1">
          <Tabs defaultValue="items">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="items">Voorzieningen</TabsTrigger>
              <TabsTrigger value="floor">Plattegrond</TabsTrigger>
            </TabsList>

            <TabsContent value="items">
              <Card>
                <CardHeader>
                  <CardTitle>Veiligheidsvoorzieningen</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="category">Categorie</Label>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Selecteer categorie" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <ScrollArea className="h-[400px] pr-4">
                      <div className="grid grid-cols-2 gap-2">
                        {filteredItemTypes.map((itemType) => (
                          <Button
                            key={itemType.id}
                            variant={selectedItemType === itemType.id ? "default" : "outline"}
                            className={cn(
                              "justify-start h-auto py-2 px-3 transition-all",
                              selectedItemType === itemType.id && "ring-2 ring-primary shadow-md",
                            )}
                            onClick={() => {
                              setSelectedItemType(itemType.id as SafetyItemType)
                              setSelectedItem(null)
                              setIsAddingCustomItem(false)
                            }}
                          >
                            <div className="flex flex-col items-start">
                              <SafetyIcon type={itemType.id as SafetyItemType} className="mb-1" />
                              <span className="text-xs">{itemType.name}</span>
                            </div>
                          </Button>
                        ))}
                      </div>

                      <div className="mt-4">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="w-full">
                              <Plus className="h-4 w-4 mr-2" /> Aangepaste voorziening
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Aangepaste voorziening toevoegen</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label htmlFor="custom-name">Naam</Label>
                                <Input
                                  id="custom-name"
                                  value={customItemName}
                                  onChange={(e) => setCustomItemName(e.target.value)}
                                  placeholder="Bijv. Noodverlichting"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="custom-icon">Pictogram (emoji of tekst)</Label>
                                <Input
                                  id="custom-icon"
                                  value={customItemIcon}
                                  onChange={(e) => setCustomItemIcon(e.target.value)}
                                  placeholder="Bijv. 💡 of NV"
                                />
                              </div>
                              <Button
                                onClick={() => {
                                  addCustomItem()
                                  document.body.click()
                                }}
                                disabled={!customItemName || !customItemIcon}
                              >
                                Toevoegen
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </ScrollArea>

                    {selectedItemType && (
                      <div className="mt-4 p-3 bg-muted rounded-md">
                        <div className="flex items-center gap-2 mb-2">
                          <SafetyIcon type={selectedItemType} size={32} />
                          <div>
                            <p className="text-sm font-medium">
                              Geselecteerd: {isAddingCustomItem ? customItemName : getItemName(selectedItemType)}
                            </p>
                            <p className="text-xs text-muted-foreground">Klik op de plattegrond om te plaatsen</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2"
                          onClick={() => {
                            setSelectedItemType(null)
                            setIsAddingCustomItem(false)
                          }}
                        >
                          Annuleren
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="floor">
              <Card>
                <CardHeader>
                  <CardTitle>Plattegrond beheer</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="floor-plan">Selecteer plattegrond</Label>
                      <Select
                        value={selectedFloorPlan.id}
                        onValueChange={(value) => {
                          const plan = sampleFloorPlans.find((p) => p.id === value)
                          if (plan) setSelectedFloorPlan(plan)
                        }}
                      >
                        <SelectTrigger id="floor-plan">
                          <SelectValue placeholder="Selecteer plattegrond" />
                        </SelectTrigger>
                        <SelectContent>
                          {sampleFloorPlans.map((plan) => (
                            <SelectItem key={plan.id} value={plan.id}>
                              {plan.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="building">Gebouw</Label>
                      <Input
                        id="building"
                        value={selectedFloorPlan.building}
                        onChange={(e) => setSelectedFloorPlan({ ...selectedFloorPlan, building: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="floor">Verdieping</Label>
                      <Input
                        id="floor"
                        value={selectedFloorPlan.floor}
                        onChange={(e) => setSelectedFloorPlan({ ...selectedFloorPlan, floor: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="upload-image">Upload plattegrond</Label>
                      <div className="flex items-center mt-1">
                        <Input
                          id="upload-image"
                          type="file"
                          accept="image/*,.pdf"
                          className="hidden"
                          onChange={handleFileUpload}
                        />
                        <Button
                          variant="outline"
                          onClick={() => document.getElementById("upload-image")?.click()}
                          className="w-full"
                        >
                          <FileUp className="h-4 w-4 mr-2" /> Plattegrond uploaden
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Ondersteunde formaten: JPG, PNG, PDF</p>
                    </div>

                    {uploadedImage && (
                      <div className="mt-2">
                        <p className="text-sm text-green-600">Plattegrond succesvol geüpload!</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {selectedItem && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Item bewerken</span>
                  <Button variant="destructive" size="sm" onClick={deleteSelectedItem}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="item-label">Label</Label>
                    <Input
                      id="item-label"
                      value={selectedItem.label || ""}
                      onChange={(e) => updateItemProperty("label", e.target.value)}
                      placeholder="Bijv. Brandblusser 1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="item-notes">Opmerkingen</Label>
                    <Textarea
                      id="item-notes"
                      value={selectedItem.notes || ""}
                      onChange={(e) => updateItemProperty("notes", e.target.value)}
                      placeholder="Bijv. Laatste controle: 01-01-2023"
                    />
                  </div>

                  <div>
                    <Label htmlFor="item-inspection">Laatste inspectie</Label>
                    <Input
                      id="item-inspection"
                      type="date"
                      value={selectedItem.lastInspection || ""}
                      onChange={(e) => updateItemProperty("lastInspection", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Rotatie ({selectedItem.rotation}°)</Label>
                    <Slider
                      value={[selectedItem.rotation]}
                      min={0}
                      max={359}
                      step={1}
                      onValueChange={(value) => updateItemProperty("rotation", value[0])}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="md:col-span-3">
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                    disabled={zoom <= 0.5}
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="text-sm">{Math.round(zoom * 100)}%</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setZoom(Math.min(2, zoom + 0.1))}
                    disabled={zoom >= 2}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">
                    {selectedFloorPlan.building} - {selectedFloorPlan.floor}
                  </span>
                </div>
              </div>

              <div
                id="plotkaart-canvas"
                className="relative border rounded-md overflow-hidden"
                style={{ height: "600px" }}
              >
                <div
                  ref={canvasRef}
                  className={cn("relative w-full h-full overflow-auto", showGrid && "bg-grid-pattern")}
                  onClick={handleCanvasClick}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  <div
                    className="relative"
                    style={{
                      transform: `scale(${zoom})`,
                      transformOrigin: "top left",
                      width: "fit-content",
                      height: "fit-content",
                    }}
                  >
                    <img
                      src={selectedFloorPlan.imageUrl || "/placeholder.svg"}
                      alt={selectedFloorPlan.name}
                      className="max-w-none"
                    />

                    {showAllItems &&
                      items.map((item) => (
                        <div
                          key={item.id}
                          className={cn(
                            "absolute cursor-move flex items-center justify-center",
                            selectedItem?.id === item.id && "ring-2 ring-primary",
                          )}
                          style={{
                            left: `${item.x}px`,
                            top: `${item.y}px`,
                            transform: `translate(-50%, -50%) rotate(${item.rotation}deg)`,
                            zIndex: selectedItem?.id === item.id ? 10 : 1,
                          }}
                          onClick={(e) => handleItemClick(e, item)}
                          onMouseDown={(e) => handleItemDragStart(e, item)}
                        >
                          <Popover>
                            <PopoverTrigger asChild>
                              <div className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-md">
                                {item.custom ? (
                                  <span className="text-xl">{item.customIcon}</span>
                                ) : (
                                  <SafetyIcon type={item.type} size={32} />
                                )}
                              </div>
                            </PopoverTrigger>
                            <PopoverContent className="w-60 p-0" align="center">
                              <div className="p-3">
                                <h3 className="font-medium">
                                  {item.label || (item.custom ? customItemName : getItemName(item.type))}
                                </h3>
                                {item.notes && <p className="text-sm mt-1">{item.notes}</p>}
                                {item.lastInspection && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Laatste inspectie: {item.lastInspection}
                                  </p>
                                )}
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <div className="text-sm text-muted-foreground">{items.length} veiligheidsvoorzieningen geplaatst</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Default export
export default SimplifiedPlotkaartEditor
