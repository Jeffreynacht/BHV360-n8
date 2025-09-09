"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertTriangle,
  Plus,
  Search,
  Clock,
  User,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Edit,
  Download,
  Calendar,
  Phone,
  Mail,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Incident {
  id: string
  title: string
  description: string
  type: "fire" | "medical" | "evacuation" | "security" | "other"
  priority: "low" | "medium" | "high" | "critical"
  status: "open" | "in-progress" | "resolved" | "closed"
  location: string
  reporter: string
  assignee?: string
  createdAt: string
  updatedAt: string
}

export default function IncidentenPage() {
  const [incidents, setIncidents] = useState<Incident[]>([
    {
      id: "INC-001",
      title: "Brandalarm Gebouw A",
      description: "Automatisch brandalarm afgegaan in gebouw A, verdieping 2",
      type: "fire",
      priority: "high",
      status: "resolved",
      location: "Gebouw A - Verdieping 2",
      reporter: "Jan Bakker",
      assignee: "Maria de Vries",
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-01-15T11:45:00Z",
    },
    {
      id: "INC-002",
      title: "Medische noodsituatie",
      description: "Persoon gevallen in kantoor, mogelijk gebroken arm",
      type: "medical",
      priority: "critical",
      status: "in-progress",
      location: "Kantoor 205",
      reporter: "Lisa van Dam",
      assignee: "Peter Jansen",
      createdAt: "2024-01-15T14:20:00Z",
      updatedAt: "2024-01-15T14:25:00Z",
    },
    {
      id: "INC-003",
      title: "Verdachte persoon",
      description: "Onbekende persoon in beveiligd gebied gespot",
      type: "security",
      priority: "medium",
      status: "open",
      location: "Parkeergarage B1",
      reporter: "Security Team",
      createdAt: "2024-01-15T16:10:00Z",
      updatedAt: "2024-01-15T16:10:00Z",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [isNewIncidentOpen, setIsNewIncidentOpen] = useState(false)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "closed":
        return <XCircle className="h-4 w-4 text-gray-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "fire":
        return "🔥"
      case "medical":
        return "🏥"
      case "evacuation":
        return "🚨"
      case "security":
        return "🔒"
      default:
        return "⚠️"
    }
  }

  const filteredIncidents = incidents.filter((incident) => {
    const matchesSearch =
      incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || incident.status === statusFilter
    const matchesPriority = priorityFilter === "all" || incident.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const handleNewIncident = (formData: FormData) => {
    const newIncident: Incident = {
      id: `INC-${String(incidents.length + 1).padStart(3, "0")}`,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      type: formData.get("type") as any,
      priority: formData.get("priority") as any,
      status: "open",
      location: formData.get("location") as string,
      reporter: "Huidige Gebruiker",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setIncidents([newIncident, ...incidents])
    setIsNewIncidentOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <AlertTriangle className="h-8 w-8 text-red-600 mr-3" />
                Incident Management
              </h1>
              <p className="text-gray-600 mt-2">Beheer en volg alle veiligheidsincidenten in real-time</p>
            </div>

            <Dialog open={isNewIncidentOpen} onOpenChange={setIsNewIncidentOpen}>
              <DialogTrigger asChild>
                <Button className="bg-red-600 hover:bg-red-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Nieuw Incident
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Nieuw Incident Melden</DialogTitle>
                  <DialogDescription>
                    Vul de onderstaande gegevens in om een nieuw incident te registreren
                  </DialogDescription>
                </DialogHeader>
                <form action={handleNewIncident} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Incident Titel *</Label>
                      <Input id="title" name="title" placeholder="Korte beschrijving van het incident" required />
                    </div>
                    <div>
                      <Label htmlFor="location">Locatie *</Label>
                      <Input id="location" name="location" placeholder="Gebouw, verdieping, ruimte" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="type">Type Incident *</Label>
                      <Select name="type" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecteer type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fire">🔥 Brand</SelectItem>
                          <SelectItem value="medical">🏥 Medisch</SelectItem>
                          <SelectItem value="evacuation">🚨 Evacuatie</SelectItem>
                          <SelectItem value="security">🔒 Beveiliging</SelectItem>
                          <SelectItem value="other">⚠️ Overig</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="priority">Prioriteit *</Label>
                      <Select name="priority" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecteer prioriteit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Laag</SelectItem>
                          <SelectItem value="medium">Gemiddeld</SelectItem>
                          <SelectItem value="high">Hoog</SelectItem>
                          <SelectItem value="critical">Kritiek</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Beschrijving *</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Gedetailleerde beschrijving van het incident..."
                      rows={4}
                      required
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsNewIncidentOpen(false)}>
                      Annuleren
                    </Button>
                    <Button type="submit" className="bg-red-600 hover:bg-red-700">
                      Incident Melden
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Totaal Incidenten</p>
                    <p className="text-2xl font-bold text-gray-900">{incidents.length}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Open</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {incidents.filter((i) => i.status === "open").length}
                    </p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-yellow-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">In Behandeling</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {incidents.filter((i) => i.status === "in-progress").length}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Opgelost</p>
                    <p className="text-2xl font-bold text-green-600">
                      {incidents.filter((i) => i.status === "resolved").length}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Zoek incidenten..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Status filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle statussen</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in-progress">In behandeling</SelectItem>
                  <SelectItem value="resolved">Opgelost</SelectItem>
                  <SelectItem value="closed">Gesloten</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Prioriteit filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle prioriteiten</SelectItem>
                  <SelectItem value="low">Laag</SelectItem>
                  <SelectItem value="medium">Gemiddeld</SelectItem>
                  <SelectItem value="high">Hoog</SelectItem>
                  <SelectItem value="critical">Kritiek</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Incidents List */}
        <div className="space-y-4">
          {filteredIncidents.map((incident) => (
            <Card key={incident.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl">{getTypeIcon(incident.type)}</span>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{incident.title}</h3>
                        <p className="text-sm text-gray-500">#{incident.id}</p>
                      </div>
                      <Badge className={getPriorityColor(incident.priority)}>{incident.priority.toUpperCase()}</Badge>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(incident.status)}
                        <span className="text-sm text-gray-600 capitalize">{incident.status.replace("-", " ")}</span>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-3">{incident.description}</p>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{incident.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>Gemeld door: {incident.reporter}</span>
                      </div>
                      {incident.assignee && (
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>Toegewezen aan: {incident.assignee}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(incident.createdAt).toLocaleString("nl-NL")}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2 ml-4">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Mail className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredIncidents.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Geen incidenten gevonden</h3>
              <p className="text-gray-600">Er zijn geen incidenten die voldoen aan de huidige filters.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
