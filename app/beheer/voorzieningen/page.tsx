"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit, Trash2, Search, Filter, Download, MapPin } from "lucide-react"
import { toast } from "sonner"
import {
  type Voorziening,
  getVoorzieningen,
  createVoorziening,
  updateVoorziening,
  deleteVoorziening,
  getVoorzieningLabel,
  getStatusColor,
  getStatusLabel,
} from "@/lib/voorzieningen"

export default function VoorzieningenPage() {
  const [voorzieningen, setVoorzieningen] = useState<Voorziening[]>([])
  const [filteredVoorzieningen, setFilteredVoorzieningen] = useState<Voorziening[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [selectedVoorziening, setSelectedVoorziening] = useState<Voorziening | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<"create" | "edit">("create")

  const [formData, setFormData] = useState({
    type: "brandblusser" as Voorziening["type"],
    naam: "",
    locatie: { x: 0, y: 0 },
    status: "actief" as Voorziening["status"],
    laatsteControle: "",
    volgendeControle: "",
    opmerkingen: "",
  })

  useEffect(() => {
    loadVoorzieningen()
  }, [])

  useEffect(() => {
    filterVoorzieningen()
  }, [voorzieningen, searchTerm, filterType, filterStatus])

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

  const filterVoorzieningen = () => {
    let filtered = voorzieningen

    if (searchTerm) {
      filtered = filtered.filter(
        (v) =>
          v.naam.toLowerCase().includes(searchTerm.toLowerCase()) ||
          getVoorzieningLabel(v.type).toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (filterType !== "all") {
      filtered = filtered.filter((v) => v.type === filterType)
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((v) => v.status === filterStatus)
    }

    setFilteredVoorzieningen(filtered)
  }

  const handleCreateNew = () => {
    setSelectedVoorziening(null)
    setFormData({
      type: "brandblusser",
      naam: "",
      locatie: { x: 0, y: 0 },
      status: "actief",
      laatsteControle: "",
      volgendeControle: "",
      opmerkingen: "",
    })
    setModalMode("create")
    setIsModalOpen(true)
  }

  const handleEdit = (voorziening: Voorziening) => {
    setSelectedVoorziening(voorziening)
    setFormData({
      type: voorziening.type,
      naam: voorziening.naam,
      locatie: voorziening.locatie,
      status: voorziening.status,
      laatsteControle: voorziening.laatsteControle || "",
      volgendeControle: voorziening.volgendeControle || "",
      opmerkingen: voorziening.opmerkingen || "",
    })
    setModalMode("edit")
    setIsModalOpen(true)
  }

  const handleSave = async () => {
    try {
      if (modalMode === "create") {
        await createVoorziening(formData)
        toast.success("Voorziening toegevoegd")
      } else if (selectedVoorziening) {
        await updateVoorziening(selectedVoorziening.id, formData)
        toast.success("Voorziening bijgewerkt")
      }
      await loadVoorzieningen()
      setIsModalOpen(false)
    } catch (error) {
      console.error("Error saving voorziening:", error)
      toast.error("Fout bij opslaan")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Weet je zeker dat je deze voorziening wilt verwijderen?")) {
      return
    }

    try {
      await deleteVoorziening(id)
      toast.success("Voorziening verwijderd")
      await loadVoorzieningen()
    } catch (error) {
      console.error("Error deleting voorziening:", error)
      toast.error("Fout bij verwijderen")
    }
  }

  const handleExport = () => {
    const csvContent = [
      ["Type", "Naam", "Status", "X", "Y", "Laatste Controle", "Volgende Controle", "Opmerkingen"],
      ...filteredVoorzieningen.map((v) => [
        getVoorzieningLabel(v.type),
        v.naam,
        getStatusLabel(v.status),
        v.locatie.x.toString(),
        v.locatie.y.toString(),
        v.laatsteControle || "",
        v.volgendeControle || "",
        v.opmerkingen || "",
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "voorzieningen.csv"
    a.click()
    URL.revokeObjectURL(url)
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
          <h1 className="text-3xl font-bold text-gray-900">Voorzieningen Beheer</h1>
          <p className="text-gray-600 mt-1">Beheer alle veiligheidsvoorzieningen in het gebouw</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExport} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleCreateNew}>
            <Plus className="w-4 h-4 mr-2" />
            Nieuwe Voorziening
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Zoeken</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Zoek voorzieningen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle types</SelectItem>
                  <SelectItem value="brandblusser">Brandblusser</SelectItem>
                  <SelectItem value="nooduitgang">Nooduitgang</SelectItem>
                  <SelectItem value="ehbo">EHBO Post</SelectItem>
                  <SelectItem value="aed">AED</SelectItem>
                  <SelectItem value="verzamelplaats">Verzamelplaats</SelectItem>
                  <SelectItem value="brandmelder">Brandmelder</SelectItem>
                  <SelectItem value="noodtelefoon">Noodtelefoon</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle statussen</SelectItem>
                  <SelectItem value="actief">Actief</SelectItem>
                  <SelectItem value="onderhoud">Onderhoud</SelectItem>
                  <SelectItem value="defect">Defect</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Resultaten</Label>
              <div className="flex items-center h-10 px-3 py-2 border border-gray-200 rounded-md bg-gray-50">
                <Filter className="w-4 h-4 mr-2 text-gray-400" />
                <span className="text-sm text-gray-600">{filteredVoorzieningen.length} gevonden</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Voorzieningen Overzicht</CardTitle>
          <CardDescription>Overzicht van alle geregistreerde veiligheidsvoorzieningen</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Naam</TableHead>
                <TableHead>Locatie</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Laatste Controle</TableHead>
                <TableHead>Volgende Controle</TableHead>
                <TableHead>Acties</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVoorzieningen.map((voorziening) => (
                <TableRow key={voorziening.id}>
                  <TableCell>
                    <Badge variant="outline">{getVoorzieningLabel(voorziening.type)}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{voorziening.naam}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="w-3 h-3" />
                      {voorziening.locatie.x}, {voorziening.locatie.y}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={voorziening.status === "actief" ? "default" : "secondary"}
                      className={getStatusColor(voorziening.status)}
                    >
                      {getStatusLabel(voorziening.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {voorziening.laatsteControle
                      ? new Date(voorziening.laatsteControle).toLocaleDateString("nl-NL")
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {voorziening.volgendeControle
                      ? new Date(voorziening.volgendeControle).toLocaleDateString("nl-NL")
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(voorziening)}>
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(voorziening.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{modalMode === "create" ? "Nieuwe Voorziening" : "Voorziening Bewerken"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value as Voorziening["type"] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="brandblusser">Brandblusser</SelectItem>
                    <SelectItem value="nooduitgang">Nooduitgang</SelectItem>
                    <SelectItem value="ehbo">EHBO Post</SelectItem>
                    <SelectItem value="aed">AED</SelectItem>
                    <SelectItem value="verzamelplaats">Verzamelplaats</SelectItem>
                    <SelectItem value="brandmelder">Brandmelder</SelectItem>
                    <SelectItem value="noodtelefoon">Noodtelefoon</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as Voorziening["status"] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="actief">Actief</SelectItem>
                    <SelectItem value="onderhoud">Onderhoud</SelectItem>
                    <SelectItem value="defect">Defect</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Naam</Label>
              <Input
                value={formData.naam}
                onChange={(e) => setFormData({ ...formData, naam: e.target.value })}
                placeholder="Bijv. Brandblusser Hoofdingang"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>X Positie</Label>
                <Input
                  type="number"
                  value={formData.locatie.x}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      locatie: { ...formData.locatie, x: Number.parseInt(e.target.value) || 0 },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Y Positie</Label>
                <Input
                  type="number"
                  value={formData.locatie.y}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      locatie: { ...formData.locatie, y: Number.parseInt(e.target.value) || 0 },
                    })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Laatste Controle</Label>
                <Input
                  type="date"
                  value={formData.laatsteControle}
                  onChange={(e) => setFormData({ ...formData, laatsteControle: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Volgende Controle</Label>
                <Input
                  type="date"
                  value={formData.volgendeControle}
                  onChange={(e) => setFormData({ ...formData, volgendeControle: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Opmerkingen</Label>
              <Textarea
                value={formData.opmerkingen}
                onChange={(e) => setFormData({ ...formData, opmerkingen: e.target.value })}
                placeholder="Aanvullende informatie..."
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Annuleren
              </Button>
              <Button onClick={handleSave}>{modalMode === "create" ? "Toevoegen" : "Opslaan"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
