"use client"

import { useState, useEffect } from "react"
import { useCustomer } from "@/components/customer-context"
import { useData, type DataContextType } from "@/contexts/data-context"
import { NoCustomerSelected } from "@/components/no-customer-selected"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Edit, Trash2, MapPin, Settings, Scan, Smartphone, Wifi, AlertTriangle } from "lucide-react"

const tagTypes = [
  { id: "facility", name: "Voorziening", description: "Gekoppeld aan veiligheidsvoorziening" },
  { id: "location", name: "Locatie", description: "Locatie informatie en navigatie" },
  { id: "emergency", name: "Noodgeval", description: "Noodprocedures en contacten" },
  { id: "info", name: "Informatie", description: "Algemene informatie" },
  { id: "wifi", name: "WiFi", description: "WiFi toegang en instellingen" },
  { id: "contact", name: "Contact", description: "Contactgegevens" },
]

const actionTypes = [
  { id: "url", name: "Website", icon: "🌐" },
  { id: "wifi", name: "WiFi", icon: "📶" },
  { id: "contact", name: "Contact", icon: "📞" },
  { id: "text", name: "Tekst", icon: "📝" },
  { id: "app", name: "App", icon: "📱" },
  { id: "emergency", name: "Noodgeval", icon: "🚨" },
]

export default function BeheerNFCTagsPage() {
  const { selectedCustomer } = useCustomer()
  const { getNfcTagsByCustomer, addNfcTag, updateNfcTag, deleteNfcTag } = useData() as DataContextType
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<string | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingTag, setEditingTag] = useState<any>(null)
  const [isNFCSupported, setIsNFCSupported] = useState(false)
  const [tags, setTags] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    uid: "",
    location: "",
    floor: "",
    building: "",
    zone: "",
    assignedTo: "",
    notes: "",
    tagType: "facility",
    actions: [] as any[],
  })

  useEffect(() => {
    // Check if Web NFC is supported
    if (typeof window !== "undefined" && "NDEFReader" in window) {
      setIsNFCSupported(true)
    }
  }, [])

  useEffect(() => {
    // Fetch NFC tags when selectedCustomer changes
    async function fetchTags() {
      if (selectedCustomer) {
        setIsLoading(true)
        try {
          const fetchedTags = await getNfcTagsByCustomer(selectedCustomer.id)
          setTags(fetchedTags || [])
        } catch (error) {
          console.error("Error fetching NFC tags:", error)
          setTags([])
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchTags()
  }, [selectedCustomer, getNfcTagsByCustomer])

  if (!selectedCustomer) {
    return <NoCustomerSelected />
  }

  const startNFCScan = async () => {
    if (!isNFCSupported) {
      alert("NFC wordt niet ondersteund door deze browser. Gebruik Chrome op Android.")
      return
    }

    try {
      setIsScanning(true)
      setScanResult(null)

      // Use the Web NFC API directly
      const ndef = new (window as any).NDEFReader()

      await ndef.scan()

      ndef.addEventListener("reading", ({ message, serialNumber }: any) => {
        setIsScanning(false)
        setScanResult(serialNumber)

        // Check if tag already exists
        const existingTag = tags.find((tag) => tag.uid === serialNumber)
        if (existingTag) {
          setEditingTag(existingTag)
          setFormData({
            name: existingTag.name,
            uid: existingTag.uid,
            location: existingTag.location,
            floor: existingTag.floor,
            building: existingTag.building,
            zone: existingTag.zone,
            assignedTo: existingTag.assignedTo,
            notes: existingTag.notes,
            tagType: existingTag.tagType,
            actions: [],
          })
        } else {
          // New tag - open add dialog
          setFormData({
            ...formData,
            uid: serialNumber,
            name: `NFC-${serialNumber.slice(-4)}`,
          })
          setIsAddDialogOpen(true)
        }
      })

      ndef.addEventListener("readingerror", () => {
        setIsScanning(false)
        alert("Fout bij het lezen van de NFC tag")
      })
    } catch (error) {
      setIsScanning(false)
      console.error("NFC scan error:", error)
      alert("Fout bij het starten van NFC scan: " + error)
    }
  }

  const simulateNFCScan = () => {
    // Simulate scanning for demo purposes
    const mockUID = `04:52:3A:B2:C1:${Math.floor(Math.random() * 100)
      .toString()
      .padStart(2, "0")}`
    setScanResult(mockUID)

    const existingTag = tags.find((tag) => tag.uid === mockUID)
    if (existingTag) {
      setEditingTag(existingTag)
      setFormData({
        name: existingTag.name,
        uid: existingTag.uid,
        location: existingTag.location,
        floor: existingTag.floor,
        building: existingTag.building,
        zone: existingTag.zone,
        assignedTo: existingTag.assignedTo,
        notes: existingTag.notes,
        tagType: existingTag.tagType,
        actions: [],
      })
    } else {
      setFormData({
        ...formData,
        uid: mockUID,
        name: `NFC-${mockUID.slice(-4)}`,
      })
      setIsAddDialogOpen(true)
    }
  }

  const writeNFCTag = async (tag: any) => {
    if (!isNFCSupported) {
      alert("NFC schrijven wordt niet ondersteund door deze browser.")
      return
    }

    try {
      const ndef = new (window as any).NDEFReader()

      const records = []

      // Add actions to NFC tag
      tag.actions?.forEach((action: any) => {
        if (!action.enabled) return

        switch (action.type) {
          case "url":
            records.push({ recordType: "url", data: action.value })
            break
          case "wifi":
            records.push({ recordType: "mime", mediaType: "application/vnd.wfa.wsc", data: action.value })
            break
          case "text":
            records.push({ recordType: "text", data: action.value })
            break
        }
      })

      await ndef.write({ records })
      alert("NFC tag succesvol geprogrammeerd!")
    } catch (error) {
      console.error("NFC write error:", error)
      alert("Fout bij het schrijven naar NFC tag: " + error)
    }
  }

  const addAction = () => {
    const newAction = {
      id: `act-${Date.now()}`,
      type: "url",
      label: "",
      value: "",
      enabled: true,
    }
    setFormData({
      ...formData,
      actions: [...formData.actions, newAction],
    })
  }

  const updateAction = (actionId: string, field: string, value: any) => {
    setFormData({
      ...formData,
      actions: formData.actions.map((action) => (action.id === actionId ? { ...action, [field]: value } : action)),
    })
  }

  const removeAction = (actionId: string) => {
    setFormData({
      ...formData,
      actions: formData.actions.filter((action) => action.id !== actionId),
    })
  }

  const handleAddTag = async () => {
    const tagData = {
      name: formData.name,
      uid: formData.uid,
      type: formData.tagType,
      location: formData.location,
      building: formData.building,
      floor: formData.floor,
      zone: formData.zone,
      status: "active" as const,
      batteryLevel: 100,
      lastSeen: new Date().toLocaleString(),
      lastScanned: null,
      assignedTo: formData.assignedTo,
      notes: formData.notes,
      tagType: formData.tagType,
    }

    try {
      const newTag = await addNfcTag(tagData, selectedCustomer.id)
      if (newTag) {
        setTags([...tags, newTag])
        resetForm()
        setIsAddDialogOpen(false)
        alert("NFC tag succesvol toegevoegd!")
      }
    } catch (error) {
      console.error("Error adding tag:", error)
      alert("Fout bij het toevoegen van de tag: " + error)
    }
  }

  const handleUpdateTag = async () => {
    if (!editingTag) return

    const tagData = {
      name: formData.name,
      uid: formData.uid,
      location: formData.location,
      floor: formData.floor,
      building: formData.building,
      zone: formData.zone,
      assignedTo: formData.assignedTo,
      notes: formData.notes,
      tagType: formData.tagType,
    }

    try {
      const updatedTag = await updateNfcTag(editingTag.id, tagData)
      if (updatedTag) {
        setTags(tags.map((tag) => (tag.id === editingTag.id ? updatedTag : tag)))
        setEditingTag(null)
        resetForm()
        alert("NFC tag succesvol bijgewerkt!")
      }
    } catch (error) {
      console.error("Error updating tag:", error)
      alert("Fout bij het bijwerken van de tag: " + error)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      uid: "",
      location: "",
      floor: "",
      building: "",
      zone: "",
      assignedTo: "",
      notes: "",
      tagType: "facility",
      actions: [],
    })
  }

  const handleDeleteTag = async (tagId: string) => {
    if (window.confirm("Weet je zeker dat je deze NFC tag wilt verwijderen?")) {
      try {
        const success = await deleteNfcTag(tagId)
        if (success) {
          setTags(tags.filter((tag) => tag.id !== tagId))
          alert("NFC tag verwijderd!")
        }
      } catch (error) {
        console.error("Error deleting tag:", error)
        alert("Fout bij het verwijderen van de tag: " + error)
      }
    }
  }

  const handleScanTag = async (tagId: string) => {
    try {
      const updatedTag = await updateNfcTag(tagId, {
        lastScanned: new Date().toLocaleString(),
        lastSeen: new Date().toLocaleString(),
      })

      if (updatedTag) {
        setTags(tags.map((tag) => (tag.id === tagId ? updatedTag : tag)))
        alert("NFC tag gescand!")
      }
    } catch (error) {
      console.error("Error scanning tag:", error)
      alert("Fout bij het scannen van de tag: " + error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "error":
        return "bg-red-100 text-red-800"
      case "unassigned":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Actief"
      case "inactive":
        return "Inactief"
      case "error":
        return "Fout"
      case "unassigned":
        return "Niet toegewezen"
      default:
        return "Onbekend"
    }
  }

  return (
    <div className="container p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">NFC Tags</h1>
          <p className="text-muted-foreground">NFC Tags beheer voor {selectedCustomer.name}</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={isNFCSupported ? startNFCScan : simulateNFCScan} disabled={isScanning}>
            <Scan className="h-4 w-4 mr-2" />
            {isScanning ? "Scannen..." : "Scan NFC Tag"}
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Handmatig Toevoegen
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </div>

      {!isNFCSupported && (
        <Card className="mb-6 border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <div>
                <p className="font-medium text-orange-800">NFC niet ondersteund</p>
                <p className="text-sm text-orange-700">
                  Web NFC wordt alleen ondersteund in Chrome op Android. Gebruik de simulatie functie voor demo
                  doeleinden.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {scanResult && (
        <Card className="mb-6 border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Smartphone className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-medium text-green-800">NFC Tag Gescand</p>
                <p className="text-sm text-green-700">UID: {scanResult}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="tags" className="space-y-6">
        <TabsList>
          <TabsTrigger value="tags">NFC Tags</TabsTrigger>
          <TabsTrigger value="actions">Acties</TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Instellingen
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tags">
          <Card>
            <CardHeader>
              <CardTitle>NFC Tags Overzicht ({tags.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-muted-foreground">NFC tags laden...</p>
                </div>
              ) : (
                <>
                  {tags.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Naam</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>UID</TableHead>
                          <TableHead>Locatie</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Beheer</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tags.map((tag) => (
                          <TableRow key={tag.id}>
                            <TableCell className="font-medium">{tag.name}</TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {tagTypes.find((t) => t.id === tag.tagType)?.name || tag.tagType}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-mono text-sm">{tag.uid}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                <div>
                                  <div className="font-medium">{tag.location}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {tag.building} - {tag.floor} - {tag.zone}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(tag.status)}>{getStatusText(tag.status)}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm" onClick={() => handleScanTag(tag.id)}>
                                  <Scan className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => writeNFCTag(tag)}>
                                  <Wifi className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setEditingTag(tag)
                                    setFormData({
                                      name: tag.name,
                                      uid: tag.uid,
                                      location: tag.location,
                                      floor: tag.floor,
                                      building: tag.building,
                                      zone: tag.zone,
                                      assignedTo: tag.assignedTo,
                                      notes: tag.notes,
                                      tagType: tag.tagType,
                                      actions: [],
                                    })
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDeleteTag(tag.id)}>
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
                      <Scan className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Geen NFC tags gevonden voor {selectedCustomer.name}</p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions">
          <Card>
            <CardHeader>
              <CardTitle>Beschikbare Acties</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {actionTypes.map((actionType) => (
                  <Card key={actionType.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{actionType.icon}</span>
                        <div>
                          <h3 className="font-medium">{actionType.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {actionType.id === "url" && "Open website of webpagina"}
                            {actionType.id === "wifi" && "Automatisch verbinden met WiFi"}
                            {actionType.id === "contact" && "Contactgegevens opslaan"}
                            {actionType.id === "text" && "Tekst weergeven"}
                            {actionType.id === "app" && "App openen"}
                            {actionType.id === "emergency" && "Noodprocedure starten"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>NFC Instellingen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Web NFC ingeschakeld</Label>
                  <p className="text-sm text-muted-foreground">Gebruik Web NFC API voor scannen en schrijven</p>
                </div>
                <Checkbox defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Automatisch registreren</Label>
                  <p className="text-sm text-muted-foreground">Nieuwe tags automatisch toevoegen bij scannen</p>
                </div>
                <Checkbox defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Authenticatie vereist</Label>
                  <p className="text-sm text-muted-foreground">Gebruikers moeten inloggen om tags te scannen</p>
                </div>
                <Checkbox />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Scans loggen</Label>
                  <p className="text-sm text-muted-foreground">Alle tag scans opslaan in logboek</p>
                </div>
                <Checkbox defaultChecked />
              </div>

              <div className="space-y-2">
                <Label htmlFor="scanInterval">Scan interval (seconden)</Label>
                <Input id="scanInterval" type="number" defaultValue="30" min="1" max="165" />
              </div>

              <div className="flex justify-end">
                <Button onClick={() => alert("NFC instellingen opgeslagen!")}>Instellingen Opslaan</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Tag Dialog */}
      <Dialog
        open={isAddDialogOpen || !!editingTag}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddDialogOpen(false)
            setEditingTag(null)
            resetForm()
          }
        }}
      >
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTag ? "NFC Tag Bewerken" : `Nieuwe NFC Tag Toevoegen voor ${selectedCustomer.name}`}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tag-name">Naam</Label>
                <Input
                  id="tag-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Bijv. Brandblusser HG-001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tag-type">Type</Label>
                <Select
                  value={formData.tagType}
                  onValueChange={(value) => setFormData({ ...formData, tagType: value })}
                >
                  <SelectTrigger id="tag-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tagTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        <div>
                          <div className="font-medium">{type.name}</div>
                          <div className="text-xs text-muted-foreground">{type.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tag-uid">UID</Label>
              <Input
                id="tag-uid"
                value={formData.uid}
                onChange={(e) => setFormData({ ...formData, uid: e.target.value })}
                placeholder="Bijv. 04:52:3A:B2:C1:80"
                disabled={!!scanResult}
              />
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tag-building">Gebouw</Label>
                <Input
                  id="tag-building"
                  value={formData.building}
                  onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                  placeholder="Hoofdgebouw"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tag-floor">Verdieping</Label>
                <Input
                  id="tag-floor"
                  value={formData.floor}
                  onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                  placeholder="Begane Grond"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tag-zone">Zone</Label>
                <Input
                  id="tag-zone"
                  value={formData.zone}
                  onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                  placeholder="Noord"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tag-location">Locatie</Label>
                <Input
                  id="tag-location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Hoofdingang"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tag-assigned">Toegewezen aan</Label>
              <Input
                id="tag-assigned"
                value={formData.assignedTo}
                onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                placeholder="Jan Jansen"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tag-notes">Opmerkingen</Label>
              <Textarea
                id="tag-notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Aanvullende informatie..."
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddDialogOpen(false)
                  setEditingTag(null)
                  resetForm()
                }}
              >
                Annuleren
              </Button>
              <Button onClick={editingTag ? handleUpdateTag : handleAddTag}>
                {editingTag ? "Opslaan" : "Toevoegen"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
