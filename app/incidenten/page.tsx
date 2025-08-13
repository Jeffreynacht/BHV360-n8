"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PageHeader } from "@/components/page-header"
import { useToast } from "@/hooks/use-toast"
import {
  AlertTriangle,
  Plus,
  Search,
  Filter,
  Clock,
  User,
  MapPin,
  Calendar,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Incident {
  id: string
  title: string
  description: string
  type: "fire" | "medical" | "evacuation" | "security" | "other"
  severity: "low" | "medium" | "high" | "critical"
  status: "open" | "in_progress" | "resolved" | "closed"
  reportedBy: string
  reportedAt: string
  location: string
  assignedTo?: string
  resolvedAt?: string
  notes?: string
}

const mockIncidents: Incident[] = [
  {
    id: "INC-001",
    title: "Brandmelding Kantine",
    description: "Rookmelder afgegaan in de kantine, mogelijk vals alarm",
    type: "fire",
    severity: "high",
    status: "resolved",
    reportedBy: "Jan de Vries",
    reportedAt: "2024-01-20T14:30:00Z",
    location: "Kantine, Begane Grond",
    assignedTo: "Maria Janssen",
    resolvedAt: "2024-01-20T15:15:00Z",
    notes: "Vals alarm door aangebrande toast",
  },
  {
    id: "INC-002",
    title: "Medische Noodsituatie",
    description: "Medewerker gevallen op trap, mogelijk enkelblessure",
    type: "medical",
    severity: "medium",
    status: "in_progress",
    reportedBy: "Peter van der Berg",
    reportedAt: "2024-01-20T11:45:00Z",
    location: "Trap A, Eerste Verdieping",
    assignedTo: "Dr. Lisa de Jong",
  },
  {
    id: "INC-003",
    title: "Verdachte Persoon",
    description: "Onbekende persoon in gebouw zonder badge",
    type: "security",
    severity: "medium",
    status: "open",
    reportedBy: "Receptie",
    reportedAt: "2024-01-20T09:15:00Z",
    location: "Hoofdingang",
  },
  {
    id: "INC-004",
    title: "Waterlekkage",
    description: "Lekkage in plafond kantoorruimte",
    type: "other",
    severity: "low",
    status: "closed",
    reportedBy: "Anna Bakker",
    reportedAt: "2024-01-19T16:20:00Z",
    location: "Kantoor 2.15",
    assignedTo: "Technische Dienst",
    resolvedAt: "2024-01-20T08:30:00Z",
  },
]

const typeLabels = {
  fire: "Brand",
  medical: "Medisch",
  evacuation: "Evacuatie",
  security: "Beveiliging",
  other: "Overig",
}

const typeColors = {
  fire: "bg-red-100 text-red-800",
  medical: "bg-blue-100 text-blue-800",
  evacuation: "bg-purple-100 text-purple-800",
  security: "bg-yellow-100 text-yellow-800",
  other: "bg-gray-100 text-gray-800",
}

const severityLabels = {
  low: "Laag",
  medium: "Gemiddeld",
  high: "Hoog",
  critical: "Kritiek",
}

const severityColors = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  critical: "bg-red-100 text-red-800",
}

const statusLabels = {
  open: "Open",
  in_progress: "In Behandeling",
  resolved: "Opgelost",
  closed: "Gesloten",
}

const statusColors = {
  open: "bg-red-100 text-red-800",
  in_progress: "bg-yellow-100 text-yellow-800",
  resolved: "bg-green-100 text-green-800",
  closed: "bg-gray-100 text-gray-800",
}

const statusIcons = {
  open: AlertCircle,
  in_progress: Clock,
  resolved: CheckCircle,
  closed: XCircle,
}

export default function IncidentenPage() {
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [severityFilter, setSeverityFilter] = useState<string>("all")
  const { toast } = useToast()

  const filteredIncidents = incidents.filter((incident) => {
    const matchesSearch =
      incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.location.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = typeFilter === "all" || incident.type === typeFilter
    const matchesStatus = statusFilter === "all" || incident.status === statusFilter
    const matchesSeverity = severityFilter === "all" || incident.severity === severityFilter

    return matchesSearch && matchesType && matchesStatus && matchesSeverity
  })

  const getStatusCount = (status: Incident["status"]) => {
    return incidents.filter((incident) => incident.status === status).length
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("nl-NL")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("nl-NL")
  }

  const handleNewIncident = () => {
    toast({
      title: "Nieuw Incident",
      description: "Je wordt doorgestuurd naar het incident formulier",
    })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Incidenten Beheer"
        description="Overzicht en beheer van alle veiligheidsincidenten"
        showBackButton={true}
        backUrl="/dashboard"
      >
        <Button onClick={handleNewIncident} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nieuw Incident
        </Button>
      </PageHeader>

      {/* Status Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{getStatusCount("open")}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Behandeling</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{getStatusCount("in_progress")}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Opgelost</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{getStatusCount("resolved")}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gesloten</CardTitle>
            <XCircle className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{getStatusCount("closed")}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <Label htmlFor="search">Zoeken</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Zoek in titel, beschrijving of locatie..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="type">Type</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Alle types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle types</SelectItem>
                  <SelectItem value="fire">Brand</SelectItem>
                  <SelectItem value="medical">Medisch</SelectItem>
                  <SelectItem value="evacuation">Evacuatie</SelectItem>
                  <SelectItem value="security">Beveiliging</SelectItem>
                  <SelectItem value="other">Overig</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Alle statussen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle statussen</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Behandeling</SelectItem>
                  <SelectItem value="resolved">Opgelost</SelectItem>
                  <SelectItem value="closed">Gesloten</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="severity">Ernst</Label>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Alle niveaus" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle niveaus</SelectItem>
                  <SelectItem value="low">Laag</SelectItem>
                  <SelectItem value="medium">Gemiddeld</SelectItem>
                  <SelectItem value="high">Hoog</SelectItem>
                  <SelectItem value="critical">Kritiek</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Incidents Table */}
      <Card>
        <CardHeader>
          <CardTitle>Incidenten ({filteredIncidents.length})</CardTitle>
          <CardDescription>Overzicht van alle incidenten met hun huidige status</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Incident</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Ernst</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Locatie</TableHead>
                <TableHead>Gemeld</TableHead>
                <TableHead className="text-right">Acties</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIncidents.map((incident) => {
                const StatusIcon = statusIcons[incident.status]
                return (
                  <TableRow key={incident.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{incident.title}</div>
                        <div className="text-sm text-muted-foreground">{incident.id}</div>
                        <div className="text-sm text-muted-foreground line-clamp-2">{incident.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={typeColors[incident.type]}>{typeLabels[incident.type]}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={severityColors[incident.severity]}>{severityLabels[incident.severity]}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <StatusIcon className="h-4 w-4" />
                        <Badge className={statusColors[incident.status]}>{statusLabels[incident.status]}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="h-3 w-3" />
                        {incident.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(incident.reportedAt)}
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <User className="h-3 w-3" />
                          {incident.reportedBy}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-1 justify-end">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>

          {filteredIncidents.length === 0 && (
            <div className="text-center py-12">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Geen incidenten gevonden</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || typeFilter !== "all" || statusFilter !== "all" || severityFilter !== "all"
                  ? "Probeer je zoekfilters aan te passen"
                  : "Er zijn momenteel geen incidenten geregistreerd"}
              </p>
              {!searchTerm && typeFilter === "all" && statusFilter === "all" && severityFilter === "all" && (
                <Button onClick={handleNewIncident}>
                  <Plus className="mr-2 h-4 w-4" />
                  Eerste Incident Melden
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
