"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  AlertTriangle,
  Plus,
  Search,
  Clock,
  User,
  MapPin,
  Building,
  Users,
  Calendar,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react"

// Force dynamic rendering
export const dynamic = "force-dynamic"
export const revalidate = 0

interface Incident {
  id: number
  title: string
  description: string
  severity: "low" | "medium" | "high" | "critical"
  status: "open" | "in_progress" | "resolved" | "closed"
  location: string
  building?: string
  floor?: string
  reported_by: string
  reported_at: string
  assigned_to?: string
  customer_id: number
  customer_name?: string
  customer_contact?: string
  partner_id?: number
  partner_name?: string
  whitelabel_partner?: string
}

const mockIncidents: Incident[] = [
  {
    id: 1,
    title: "Brand alarm verdieping 3",
    description: "Rookmelder afgegaan in kantoorruimte 3.12. Mogelijk vals alarm door stof.",
    severity: "high",
    status: "in_progress",
    location: "Gebouw A, Verdieping 3, Ruimte 3.12",
    building: "Gebouw A",
    floor: "Verdieping 3",
    reported_by: "Jan Janssen",
    reported_at: "2024-01-15T10:30:00Z",
    assigned_to: "BHV Team Alpha",
    customer_id: 1,
    customer_name: "Ziekenhuis Sint Anna",
    customer_contact: "Dr. Maria van der Berg",
    partner_id: 1,
    partner_name: "SafetyFirst Consultancy",
    whitelabel_partner: "SafetyFirst Consultancy",
  },
  {
    id: 2,
    title: "EHBO incident kantine",
    description: "Medewerker gevallen in kantine, mogelijk enkelblessure. EHBO verleend.",
    severity: "medium",
    status: "resolved",
    location: "Hoofdgebouw, Begane grond, Kantine",
    building: "Hoofdgebouw",
    floor: "Begane grond",
    reported_by: "Lisa de Vries",
    reported_at: "2024-01-15T14:15:00Z",
    assigned_to: "EHBO Team",
    customer_id: 2,
    customer_name: "TU Eindhoven",
    customer_contact: "Prof. Dr. Peter Bakker",
    partner_id: 2,
    partner_name: "VeiligheidsExperts BV",
    whitelabel_partner: "VeiligheidsExperts BV",
  },
  {
    id: 3,
    title: "Evacuatie oefening",
    description: "Geplande evacuatie oefening voor alle medewerkers van verdieping 1 en 2.",
    severity: "low",
    status: "open",
    location: "Kantoorgebouw, Verdieping 1-2",
    building: "Kantoorgebouw",
    floor: "Verdieping 1-2",
    reported_by: "BHV Coördinator",
    reported_at: "2024-01-15T09:00:00Z",
    customer_id: 3,
    customer_name: "Gemeente Tilburg",
    customer_contact: "Dhr. Jan van Tilburg",
    partner_id: 1,
    partner_name: "SafetyFirst Consultancy",
    whitelabel_partner: "SafetyFirst Consultancy",
  },
  {
    id: 4,
    title: "AED gebruikt parkeergarage",
    description: "AED gebruikt bij reanimatie in parkeergarage. Ambulance ter plaatse geweest.",
    severity: "critical",
    status: "closed",
    location: "Parkeergarage, Niveau -1",
    building: "Parkeergarage",
    floor: "Niveau -1",
    reported_by: "Beveiliging",
    reported_at: "2024-01-14T16:45:00Z",
    assigned_to: "Emergency Response Team",
    customer_id: 4,
    customer_name: "Winkelcentrum De Plaza",
    customer_contact: "Mevr. Sandra Willems",
    partner_id: 3,
    partner_name: "BHV Solutions",
    whitelabel_partner: "BHV Solutions",
  },
]

export default function IncidentenPage() {
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents)
  const [filteredIncidents, setFilteredIncidents] = useState<Incident[]>(mockIncidents)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [severityFilter, setSeverityFilter] = useState<string>("all")
  const [isNewIncidentOpen, setIsNewIncidentOpen] = useState(false)
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null)

  // Filter incidents based on search/filter criteria
  useEffect(() => {
    let filtered = incidents

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (incident) =>
          incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          incident.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          incident.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          incident.reported_by.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (incident.customer_name && incident.customer_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (incident.partner_name && incident.partner_name.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((incident) => incident.status === statusFilter)
    }

    // Apply severity filter
    if (severityFilter !== "all") {
      filtered = filtered.filter((incident) => incident.severity === severityFilter)
    }

    setFilteredIncidents(filtered)
  }, [incidents, searchTerm, statusFilter, severityFilter])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "in_progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200"
      case "closed":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertCircle className="h-4 w-4" />
      case "in_progress":
        return <Clock className="h-4 w-4" />
      case "resolved":
        return <CheckCircle className="h-4 w-4" />
      case "closed":
        return <XCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("nl-NL", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleNewIncident = (formData: any) => {
    const newIncident: Incident = {
      id: incidents.length + 1,
      title: formData.title,
      description: formData.description,
      severity: formData.severity,
      status: "open",
      location: formData.location,
      building: formData.building,
      floor: formData.floor,
      reported_by: "Huidige Gebruiker",
      reported_at: new Date().toISOString(),
      customer_id: 1,
      customer_name: "Huidige Klant",
      customer_contact: "contact@klant.nl",
    }
    setIncidents([newIncident, ...incidents])
    setIsNewIncidentOpen(false)
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <AlertTriangle className="mr-3 h-8 w-8 text-red-600" />
            Incident Management
          </h1>
          <p className="text-muted-foreground mt-1">Beheer en volg incidenten binnen uw organisatie</p>
        </div>
        <Dialog open={isNewIncidentOpen} onOpenChange={setIsNewIncidentOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nieuw Incident
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Nieuw Incident Melden</DialogTitle>
              <DialogDescription>Vul de details van het incident in voor snelle afhandeling</DialogDescription>
            </DialogHeader>
            <NewIncidentForm onSubmit={handleNewIncident} />
          </DialogContent>
        </Dialog>
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
                <SelectItem value="in_progress">In behandeling</SelectItem>
                <SelectItem value="resolved">Opgelost</SelectItem>
                <SelectItem value="closed">Gesloten</SelectItem>
              </SelectContent>
            </Select>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Ernst filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle ernst niveaus</SelectItem>
                <SelectItem value="critical">Kritiek</SelectItem>
                <SelectItem value="high">Hoog</SelectItem>
                <SelectItem value="medium">Gemiddeld</SelectItem>
                <SelectItem value="low">Laag</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Incidents List */}
      <div className="space-y-4">
        {filteredIncidents.map((incident) => (
          <Card key={incident.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{incident.title}</h3>
                    <Badge className={getSeverityColor(incident.severity)}>
                      {incident.severity === "critical" && "Kritiek"}
                      {incident.severity === "high" && "Hoog"}
                      {incident.severity === "medium" && "Gemiddeld"}
                      {incident.severity === "low" && "Laag"}
                    </Badge>
                    <Badge className={getStatusColor(incident.status)}>
                      {getStatusIcon(incident.status)}
                      <span className="ml-1">
                        {incident.status === "open" && "Open"}
                        {incident.status === "in_progress" && "In behandeling"}
                        {incident.status === "resolved" && "Opgelost"}
                        {incident.status === "closed" && "Gesloten"}
                      </span>
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-3">{incident.description}</p>

                  {/* Location and Customer Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                      <span>{incident.location}</span>
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-green-500" />
                      <span>Gemeld door: {incident.reported_by}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-purple-500" />
                      <span>{formatDate(incident.reported_at)}</span>
                    </div>

                    {incident.assigned_to && (
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-red-500" />
                        <span>Toegewezen aan: {incident.assigned_to}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <Button variant="outline" size="sm" onClick={() => setSelectedIncident(incident)}>
                    <Eye className="h-4 w-4 mr-1" />
                    Details
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Bewerken
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
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== "all" || severityFilter !== "all"
                ? "Probeer uw zoek- of filtercriteria aan te passen"
                : "Er zijn momenteel geen incidenten gemeld"}
            </p>
            <Button onClick={() => setIsNewIncidentOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Eerste Incident Melden
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Incident Detail Modal */}
      {selectedIncident && (
        <IncidentDetailModal
          incident={selectedIncident}
          isOpen={!!selectedIncident}
          onClose={() => setSelectedIncident(null)}
        />
      )}
    </div>
  )
}

// New Incident Form Component
function NewIncidentForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    severity: "medium",
    location: "",
    building: "",
    floor: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({
      title: "",
      description: "",
      severity: "medium",
      location: "",
      building: "",
      floor: "",
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Incident Titel *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Korte beschrijving van het incident"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Beschrijving *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Uitgebreide beschrijving van wat er is gebeurd"
          rows={3}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="severity">Ernst Niveau</Label>
          <Select value={formData.severity} onValueChange={(value) => setFormData({ ...formData, severity: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Laag</SelectItem>
              <SelectItem value="medium">Gemiddeld</SelectItem>
              <SelectItem value="high">Hoog</SelectItem>
              <SelectItem value="critical">Kritiek</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="building">Gebouw</Label>
          <Input
            id="building"
            value={formData.building}
            onChange={(e) => setFormData({ ...formData, building: e.target.value })}
            placeholder="Gebouw naam/nummer"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="floor">Verdieping</Label>
          <Input
            id="floor"
            value={formData.floor}
            onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
            placeholder="Verdieping/niveau"
          />
        </div>

        <div>
          <Label htmlFor="location">Specifieke Locatie *</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="Ruimte, gang, etc."
            required
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline">
          Annuleren
        </Button>
        <Button type="submit">
          <AlertTriangle className="mr-2 h-4 w-4" />
          Incident Melden
        </Button>
      </div>
    </form>
  )
}

// Incident Detail Modal Component
function IncidentDetailModal({
  incident,
  isOpen,
  onClose,
}: {
  incident: Incident
  isOpen: boolean
  onClose: () => void
}) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "in_progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200"
      case "closed":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertCircle className="h-4 w-4" />
      case "in_progress":
        return <Clock className="h-4 w-4" />
      case "resolved":
        return <CheckCircle className="h-4 w-4" />
      case "closed":
        return <XCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("nl-NL", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            {incident.title}
          </DialogTitle>
          <div className="flex gap-2">
            <Badge className={getSeverityColor(incident.severity)}>
              {incident.severity === "critical" && "Kritiek"}
              {incident.severity === "high" && "Hoog"}
              {incident.severity === "medium" && "Gemiddeld"}
              {incident.severity === "low" && "Laag"}
            </Badge>
            <Badge className={getStatusColor(incident.status)}>
              {getStatusIcon(incident.status)}
              <span className="ml-1">
                {incident.status === "open" && "Open"}
                {incident.status === "in_progress" && "In behandeling"}
                {incident.status === "resolved" && "Opgelost"}
                {incident.status === "closed" && "Gesloten"}
              </span>
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-2">Beschrijving</h4>
            <p className="text-gray-600">{incident.description}</p>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Incident Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                  <span>{incident.location}</span>
                </div>
                {incident.building && (
                  <div className="flex items-center">
                    <Building className="h-4 w-4 mr-2 text-gray-500" />
                    <span>Gebouw: {incident.building}</span>
                  </div>
                )}
                {incident.floor && (
                  <div className="flex items-center">
                    <span className="w-4 h-4 mr-2"></span>
                    <span>Verdieping: {incident.floor}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-purple-500" />
                  <span>Gemeld: {formatDate(incident.reported_at)}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Betrokkenen</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-green-500" />
                  <span>Gemeld door: {incident.reported_by}</span>
                </div>
                {incident.assigned_to && (
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-red-500" />
                    <span>Toegewezen aan: {incident.assigned_to}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={onClose}>
            Sluiten
          </Button>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Bewerken
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
