"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useCustomer } from "@/components/customer-context"
import { NoCustomerSelected } from "@/components/no-customer-selected"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, Check, Compass, Download, Edit, Plus, Save, Tag, Trash2, Upload } from "lucide-react"

// Types
interface NFCTag {
  id: string
  name: string
  uid: string
  location: string
  direction: "noord" | "oost" | "zuid" | "west" | "centraal" | "anders"
  building: string
  floor: string
  status: "actief" | "inactief" | "defect"
  lastScanned: string | null
  notes: string
}

interface Building {
  id: string
  name: string
  floors: Floor[]
}

interface Floor {
  id: string
  name: string
  level: number
  tags: NFCTag[]
}

// Sample data
const sampleBuildings: Building[] = [
  {
    id: "1",
    name: "Hoofdgebouw",
    floors: [
      {
        id: "hg-bg",
        name: "Begane Grond",
        level: 0,
        tags: [
          {
            id: "tag-1",
            name: "Brandblusser Noord BG",
            uid: "04:A3:16:25:FC",
            location: "Noordelijke gang bij receptie",
            direction: "noord",
            building: "Hoofdgebouw",
            floor: "Begane Grond",
            status: "actief",
            lastScanned: "2024-01-15 14:30",
            notes: "Gecontroleerd tijdens laatste inspectie",
          },
          {
            id: "tag-2",
            name: "EHBO-koffer Oost BG",
            uid: "04:B2:18:35:DD",
            location: "Oostelijke gang bij kantine",
            direction: "oost",
            building: "Hoofdgebouw",
            floor: "Begane Grond",
            status: "actief",
            lastScanned: "2024-01-14 09:15",
            notes: "Inhoud aangevuld op 10-01-2024",
          },
        ],
      },
      {
        id: "hg-1v",
        name: "1e Verdieping",
        level: 1,
        tags: [
          {
            id: "tag-3",
            name: "AED West 1V",
            uid: "04:C5:19:45:EE",
            location: "Westelijke gang bij vergaderzalen",
            direction: "west",
            building: "Hoofdgebouw",
            floor: "1e Verdieping",
            status: "actief",
            lastScanned: "2024-01-13 16:20",
            notes: "Batterij vervangen op 05-01-2024",
          },
        ],
      },
      {
        id: "hg-2v",
        name: "2e Verdieping",
        level: 2,
        tags: [],
      },
    ],
  },
  {
    id: "2",
    name: "Bijgebouw",
    floors: [
      {
        id: "bg-bg",
        name: "Begane Grond",
        level: 0,
        tags: [
          {
            id: "tag-4",
            name: "Nooduitgang Zuid BG",
            uid: "04:D7:20:55:FF",
            location: "Zuidelijke nooduitgang",
            direction: "zuid",
            building: "Bijgebouw",
            floor: "Begane Grond",
            status: "actief",
            lastScanned: "2024-01-12 11:45",
            notes: "Controle noodverlichting uitgevoerd",
          },
        ],
      },
    ],
  },
]

// Direction options
const directionOptions = [
  { value: "noord", label: "Noord" },
  { value: "oost", label: "Oost" },
  { value: "zuid", label: "Zuid" },
  { value: "west", label: "West" },
  { value: "centraal", label: "Centraal" },
  { value: "anders", label: "Anders" },
]

// Status options
const statusOptions = [
  { value: "actief", label: "Actief" },
  { value: "inactief", label: "Inactief" },
  { value: "defect", label: "Defect" },
]

export default function NFCVerdiepingenPage() {
  const { selectedCustomer } = useCustomer()
  const [buildings, setBuildings] = useState<Building[]>(sampleBuildings)
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null)
  const [selectedFloor, setSelectedFloor] = useState<Floor | null>(null)
  const [selectedDirection, setSelectedDirection] = useState<string>("alle")
  const [searchQuery, setSearchQuery] = useState("")
  const [newTag, setNewTag] = useState<Omit<NFCTag, "id">>({
    name: "",
    uid: "",
    location: "",
    direction: "noord",
    building: "",
    floor: "",
    status: "actief",
    lastScanned: null,
    notes: "",
  })
  const [editingTag, setEditingTag] = useState<NFCTag | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [tagToDelete, setTagToDelete] = useState<NFCTag | null>(null)

  // Set default building and floor when component loads
  useEffect(() => {
    if (buildings.length > 0) {
      setSelectedBuilding(buildings[0])
      if (buildings[0].floors.length > 0) {
        setSelectedFloor(buildings[0].floors[0])
      }
    }
  }, [buildings])

  // Update new tag when building or floor changes
  useEffect(() => {
    if (selectedBuilding && selectedFloor) {
      setNewTag((prev) => ({
        ...prev,
        building: selectedBuilding.name,
        floor: selectedFloor.name,
      }))
    }
  }, [selectedBuilding, selectedFloor])

  // Filter tags based on direction and search query
  const filteredTags = selectedFloor?.tags.filter((tag) => {
    const matchesDirection = selectedDirection === "alle" || tag.direction === selectedDirection
    const matchesSearch =
      searchQuery === "" ||
      tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tag.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tag.uid.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesDirection && matchesSearch
  })

  // Count tags by direction
  const tagCounts = {
    noord: selectedFloor?.tags.filter((tag) => tag.direction === "noord").length || 0,
    oost: selectedFloor?.tags.filter((tag) => tag.direction === "oost").length || 0,
    zuid: selectedFloor?.tags.filter((tag) => tag.direction === "zuid").length || 0,
    west: selectedFloor?.tags.filter((tag) => tag.direction === "west").length || 0,
    centraal: selectedFloor?.tags.filter((tag) => tag.direction === "centraal").length || 0,
    anders: selectedFloor?.tags.filter((tag) => tag.direction === "anders").length || 0,
    alle: selectedFloor?.tags.length || 0,
  }

  // Add new tag
  const handleAddTag = () => {
    if (!selectedBuilding || !selectedFloor) return

    const newTagWithId: NFCTag = {
      ...newTag,
      id: `tag-${Date.now()}`,
    }

    const updatedFloors = selectedBuilding.floors.map((floor) => {
      if (floor.id === selectedFloor.id) {
        return {
          ...floor,
          tags: [...floor.tags, newTagWithId],
        }
      }
      return floor
    })

    const updatedBuildings = buildings.map((building) => {
      if (building.id === selectedBuilding.id) {
        return {
          ...building,
          floors: updatedFloors,
        }
      }
      return building
    })

    setBuildings(updatedBuildings)
    setSelectedBuilding({
      ...selectedBuilding,
      floors: updatedFloors,
    })
    setSelectedFloor({
      ...selectedFloor,
      tags: [...selectedFloor.tags, newTagWithId],
    })

    // Reset form
    setNewTag({
      name: "",
      uid: "",
      location: "",
      direction: "noord",
      building: selectedBuilding.name,
      floor: selectedFloor.name,
      status: "actief",
      lastScanned: null,
      notes: "",
    })
    setShowAddDialog(false)
  }

  // Update tag
  const handleUpdateTag = () => {
    if (!selectedBuilding || !selectedFloor || !editingTag) return

    const updatedFloors = selectedBuilding.floors.map((floor) => {
      if (floor.id === selectedFloor.id) {
        return {
          ...floor,
          tags: floor.tags.map((tag) => (tag.id === editingTag.id ? editingTag : tag)),
        }
      }
      return floor
    })

    const updatedBuildings = buildings.map((building) => {
      if (building.id === selectedBuilding.id) {
        return {
          ...building,
          floors: updatedFloors,
        }
      }
      return building
    })

    setBuildings(updatedBuildings)
    setSelectedBuilding({
      ...selectedBuilding,
      floors: updatedFloors,
    })
    setSelectedFloor({
      ...selectedFloor,
      tags: selectedFloor.tags.map((tag) => (tag.id === editingTag.id ? editingTag : tag)),
    })

    setEditingTag(null)
    setShowEditDialog(false)
  }

  // Delete tag
  const handleDeleteTag = () => {
    if (!selectedBuilding || !selectedFloor || !tagToDelete) return

    const updatedFloors = selectedBuilding.floors.map((floor) => {
      if (floor.id === selectedFloor.id) {
        return {
          ...floor,
          tags: floor.tags.filter((tag) => tag.id !== tagToDelete.id),
        }
      }
      return floor
    })

    const updatedBuildings = buildings.map((building) => {
      if (building.id === selectedBuilding.id) {
        return {
          ...building,
          floors: updatedFloors,
        }
      }
      return building
    })

    setBuildings(updatedBuildings)
    setSelectedBuilding({
      ...selectedBuilding,
      floors: updatedFloors,
    })
    setSelectedFloor({
      ...selectedFloor,
      tags: selectedFloor.tags.filter((tag) => tag.id !== tagToDelete.id),
    })

    setTagToDelete(null)
    setShowDeleteDialog(false)
  }

  // Export tags as CSV
  const exportTags = () => {
    if (!selectedFloor) return

    const headers = ["Naam", "UID", "Locatie", "Richting", "Gebouw", "Verdieping", "Status", "Laatste Scan", "Notities"]
    const rows = selectedFloor.tags.map((tag) => [
      tag.name,
      tag.uid,
      tag.location,
      tag.direction,
      tag.building,
      tag.floor,
      tag.status,
      tag.lastScanned || "",
      tag.notes,
    ])

    const csvContent = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `nfc-tags-${selectedBuilding?.name}-${selectedFloor.name}.csv`)
    link.click()
  }

  // Import tags from CSV
  const importTags = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !selectedBuilding || !selectedFloor) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const csvText = event.target?.result as string
      const lines = csvText.split("\n")
      const headers = lines[0].split(",").map((header) => header.replace(/"/g, "").trim())

      const newTags: NFCTag[] = []
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue

        const values = lines[i].split(",").map((value) => value.replace(/"/g, "").trim())
        const tagData: any = {}

        headers.forEach((header, index) => {
          const value = values[index] || ""
          switch (header.toLowerCase()) {
            case "naam":
              tagData.name = value
              break
            case "uid":
              tagData.uid = value
              break
            case "locatie":
              tagData.location = value
              break
            case "richting":
              tagData.direction = value
              break
            case "gebouw":
              tagData.building = value
              break
            case "verdieping":
              tagData.floor = value
              break
            case "status":
              tagData.status = value
              break
            case "laatste scan":
              tagData.lastScanned = value
              break
            case "notities":
              tagData.notes = value
              break
          }
        })

        newTags.push({
          id: `tag-${Date.now()}-${i}`,
          name: tagData.name || "",
          uid: tagData.uid || "",
          location: tagData.location || "",
          direction: (tagData.direction as any) || "noord",
          building: tagData.building || selectedBuilding.name,
          floor: tagData.floor || selectedFloor.name,
          status: (tagData.status as any) || "actief",
          lastScanned: tagData.lastScanned || null,
          notes: tagData.notes || "",
        })
      }

      const updatedFloors = selectedBuilding.floors.map((floor) => {
        if (floor.id === selectedFloor.id) {
          return {
            ...floor,
            tags: [...floor.tags, ...newTags],
          }
        }
        return floor
      })

      const updatedBuildings = buildings.map((building) => {
        if (building.id === selectedBuilding.id) {
          return {
            ...building,
            floors: updatedFloors,
          }
        }
        return building
      })

      setBuildings(updatedBuildings)
      setSelectedBuilding({
        ...selectedBuilding,
        floors: updatedFloors,
      })
      setSelectedFloor({
        ...selectedFloor,
        tags: [...selectedFloor.tags, ...newTags],
      })
    }

    reader.readAsText(file)
  }

  if (!selectedCustomer) {
    return <NoCustomerSelected />
  }

  return (
    <div className="container p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">NFC Tags per Verdieping</h1>
          <p className="text-muted-foreground">Beheer NFC tags per verdieping en richting (noord, oost, zuid, west)</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportTags} disabled={!selectedFloor}>
            <Download className="h-4 w-4 mr-2" />
            Exporteer Tags
          </Button>
          <div className="relative">
            <Input
              type="file"
              accept=".csv"
              id="import-csv"
              className="hidden"
              onChange={importTags}
              disabled={!selectedFloor}
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById("import-csv")?.click()}
              disabled={!selectedFloor}
            >
              <Upload className="h-4 w-4 mr-2" />
              Importeer CSV
            </Button>
          </div>
          <Button onClick={() => setShowAddDialog(true)} disabled={!selectedFloor}>
            <Plus className="h-4 w-4 mr-2" />
            Nieuwe NFC Tag
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gebouw & Verdieping</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="building">Gebouw</Label>
                <Select
                  value={selectedBuilding?.id || ""}
                  onValueChange={(value) => {
                    const building = buildings.find((b) => b.id === value)
                    if (building) {
                      setSelectedBuilding(building)
                      if (building.floors.length > 0) {
                        setSelectedFloor(building.floors[0])
                      } else {
                        setSelectedFloor(null)
                      }
                    }
                  }}
                >
                  <SelectTrigger id="building">
                    <SelectValue placeholder="Selecteer gebouw" />
                  </SelectTrigger>
                  <SelectContent>
                    {buildings.map((building) => (
                      <SelectItem key={building.id} value={building.id}>
                        {building.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="floor">Verdieping</Label>
                <Select
                  value={selectedFloor?.id || ""}
                  onValueChange={(value) => {
                    if (selectedBuilding) {
                      const floor = selectedBuilding.floors.find((f) => f.id === value)
                      if (floor) {
                        setSelectedFloor(floor)
                      }
                    }
                  }}
                  disabled={!selectedBuilding || selectedBuilding.floors.length === 0}
                >
                  <SelectTrigger id="floor">
                    <SelectValue placeholder="Selecteer verdieping" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedBuilding?.floors.map((floor) => (
                      <SelectItem key={floor.id} value={floor.id}>
                        {floor.name} ({floor.tags.length} tags)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="direction">Richting</Label>
                <Select value={selectedDirection} onValueChange={setSelectedDirection}>
                  <SelectTrigger id="direction">
                    <SelectValue placeholder="Selecteer richting" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alle">Alle richtingen ({tagCounts.alle})</SelectItem>
                    <SelectItem value="noord">Noord ({tagCounts.noord})</SelectItem>
                    <SelectItem value="oost">Oost ({tagCounts.oost})</SelectItem>
                    <SelectItem value="zuid">Zuid ({tagCounts.zuid})</SelectItem>
                    <SelectItem value="west">West ({tagCounts.west})</SelectItem>
                    <SelectItem value="centraal">Centraal ({tagCounts.centraal})</SelectItem>
                    <SelectItem value="anders">Anders ({tagCounts.anders})</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="search">Zoeken</Label>
                <Input
                  id="search"
                  placeholder="Zoek op naam, locatie of UID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statistieken</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Totaal aantal tags:</span>
                  <Badge variant="secondary">{tagCounts.alle}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Actieve tags:</span>
                  <Badge variant="default">
                    {selectedFloor?.tags.filter((tag) => tag.status === "actief").length || 0}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Inactieve tags:</span>
                  <Badge variant="secondary">
                    {selectedFloor?.tags.filter((tag) => tag.status === "inactief").length || 0}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Defecte tags:</span>
                  <Badge variant="destructive">
                    {selectedFloor?.tags.filter((tag) => tag.status === "defect").length || 0}
                  </Badge>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Noord:</span>
                  <Badge variant="outline">{tagCounts.noord}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Oost:</span>
                  <Badge variant="outline">{tagCounts.oost}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Zuid:</span>
                  <Badge variant="outline">{tagCounts.zuid}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>West:</span>
                  <Badge variant="outline">{tagCounts.west}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Centraal:</span>
                  <Badge variant="outline">{tagCounts.centraal}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Anders:</span>
                  <Badge variant="outline">{tagCounts.anders}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedFloor
                  ? `NFC Tags - ${selectedBuilding?.name} - ${selectedFloor.name}`
                  : "Selecteer een gebouw en verdieping"}
              </CardTitle>
              <CardDescription>
                {selectedDirection === "alle"
                  ? "Alle richtingen"
                  : `Richting: ${selectedDirection.charAt(0).toUpperCase() + selectedDirection.slice(1)}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedFloor ? (
                filteredTags && filteredTags.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Naam</TableHead>
                        <TableHead>UID</TableHead>
                        <TableHead>Locatie</TableHead>
                        <TableHead>Richting</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Laatste Scan</TableHead>
                        <TableHead className="text-right">Acties</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTags.map((tag) => (
                        <TableRow key={tag.id}>
                          <TableCell className="font-medium">{tag.name}</TableCell>
                          <TableCell>
                            <code className="bg-muted px-1 py-0.5 rounded text-xs">{tag.uid}</code>
                          </TableCell>
                          <TableCell>{tag.location}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {tag.direction}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                tag.status === "actief"
                                  ? "default"
                                  : tag.status === "inactief"
                                    ? "secondary"
                                    : "destructive"
                              }
                            >
                              {tag.status === "actief" && <Check className="h-3 w-3 mr-1" />}
                              {tag.status === "defect" && <AlertCircle className="h-3 w-3 mr-1" />}
                              {tag.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{tag.lastScanned || "-"}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditingTag(tag)
                                  setShowEditDialog(true)
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setTagToDelete(tag)
                                  setShowDeleteDialog(true)
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <Tag className="h-12 w-12 mx-auto text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">Geen NFC tags gevonden</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {searchQuery
                        ? "Geen tags gevonden die overeenkomen met je zoekopdracht."
                        : selectedDirection !== "alle"
                          ? `Er zijn geen tags in de richting '${selectedDirection}' op deze verdieping.`
                          : "Er zijn nog geen NFC tags toegevoegd aan deze verdieping."}
                    </p>
                    <Button className="mt-4" onClick={() => setShowAddDialog(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Nieuwe NFC Tag Toevoegen
                    </Button>
                  </div>
                )
              ) : (
                <div className="text-center py-8">
                  <Compass className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">Selecteer een gebouw en verdieping</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Kies een gebouw en verdieping om de NFC tags te beheren.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Tag Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Nieuwe NFC Tag Toevoegen</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-name">Naam</Label>
                <Input
                  id="new-name"
                  value={newTag.name}
                  onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
                  placeholder="Bijv. Brandblusser Noord BG"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-uid">UID</Label>
                <Input
                  id="new-uid"
                  value={newTag.uid}
                  onChange={(e) => setNewTag({ ...newTag, uid: e.target.value })}
                  placeholder="Bijv. 04:A3:16:25:FC"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-location">Locatie</Label>
              <Input
                id="new-location"
                value={newTag.location}
                onChange={(e) => setNewTag({ ...newTag, location: e.target.value })}
                placeholder="Bijv. Noordelijke gang bij receptie"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-direction">Richting</Label>
                <Select
                  value={newTag.direction}
                  onValueChange={(value: any) => setNewTag({ ...newTag, direction: value })}
                >
                  <SelectTrigger id="new-direction">
                    <SelectValue placeholder="Selecteer richting" />
                  </SelectTrigger>
                  <SelectContent>
                    {directionOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-status">Status</Label>
                <Select value={newTag.status} onValueChange={(value: any) => setNewTag({ ...newTag, status: value })}>
                  <SelectTrigger id="new-status">
                    <SelectValue placeholder="Selecteer status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-notes">Notities</Label>
              <Textarea
                id="new-notes"
                value={newTag.notes}
                onChange={(e) => setNewTag({ ...newTag, notes: e.target.value })}
                placeholder="Extra informatie over deze NFC tag..."
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Annuleren
            </Button>
            <Button onClick={handleAddTag} disabled={!newTag.name || !newTag.uid}>
              <Plus className="h-4 w-4 mr-2" />
              Tag Toevoegen
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Tag Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>NFC Tag Bewerken</DialogTitle>
          </DialogHeader>
          {editingTag && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Naam</Label>
                  <Input
                    id="edit-name"
                    value={editingTag.name}
                    onChange={(e) => setEditingTag({ ...editingTag, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-uid">UID</Label>
                  <Input
                    id="edit-uid"
                    value={editingTag.uid}
                    onChange={(e) => setEditingTag({ ...editingTag, uid: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-location">Locatie</Label>
                <Input
                  id="edit-location"
                  value={editingTag.location}
                  onChange={(e) => setEditingTag({ ...editingTag, location: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-direction">Richting</Label>
                  <Select
                    value={editingTag.direction}
                    onValueChange={(value: any) => setEditingTag({ ...editingTag, direction: value })}
                  >
                    <SelectTrigger id="edit-direction">
                      <SelectValue placeholder="Selecteer richting" />
                    </SelectTrigger>
                    <SelectContent>
                      {directionOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={editingTag.status}
                    onValueChange={(value: any) => setEditingTag({ ...editingTag, status: value })}
                  >
                    <SelectTrigger id="edit-status">
                      <SelectValue placeholder="Selecteer status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-notes">Notities</Label>
                <Textarea
                  id="edit-notes"
                  value={editingTag.notes}
                  onChange={(e) => setEditingTag({ ...editingTag, notes: e.target.value })}
                />
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Annuleren
            </Button>
            <Button onClick={handleUpdateTag} disabled={!editingTag?.name || !editingTag?.uid}>
              <Save className="h-4 w-4 mr-2" />
              Wijzigingen Opslaan
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Tag Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>NFC Tag Verwijderen</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Weet je zeker dat je de NFC tag <strong>{tagToDelete?.name}</strong> wilt verwijderen? Deze actie kan niet
              ongedaan worden gemaakt.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Annuleren
            </Button>
            <Button variant="destructive" onClick={handleDeleteTag}>
              <Trash2 className="h-4 w-4 mr-2" />
              Verwijderen
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
