"use client"

import { useState } from "react"
import { useCustomer } from "@/components/customer-context"
import { NoCustomerSelected } from "@/components/no-customer-selected"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  AlertTriangle,
  Clock,
  Users,
  MapPin,
  CheckCircle,
  Search,
  PlusCircle,
  User,
  Flame,
  Heart,
  ShieldAlert,
  Droplets,
  Zap,
  Skull,
  Radiation,
  BarChart3,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Incident = {
  id: string
  title: string
  type: string
  priority: "low" | "medium" | "high" | "critical"
  status: "active" | "resolved" | "in-progress" | "archived"
  location: string
  building: string
  floor: string
  zone: string
  reportedBy: string
  reportedAt: string
  resolvedAt?: string
  description: string
  actions: {
    timestamp: string
    user: string
    action: string
  }[]
  responders: {
    id: string
    name: string
    role: string
    status: string
    arrivedAt?: string
  }[]
  notes: {
    id: string
    user: string
    timestamp: string
    text: string
  }[]
  customerId: string
}

export default function IncidentenPage() {
  const { selectedCustomer } = useCustomer()
  const [activeTab, setActiveTab] = useState("actief")
  const [isNewIncidentDialogOpen, setIsNewIncidentDialogOpen] = useState(false)
  const [isIncidentDetailsDialogOpen, setIsIncidentDetailsDialogOpen] = useState(false)
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [newNote, setNewNote] = useState("")

  const [newIncident, setNewIncident] = useState({
    title: "",
    type: "brand",
    priority: "medium" as "low" | "medium" | "high" | "critical",
    location: "",
    building: "",
    floor: "",
    zone: "",
    description: "",
  })

  // Dummy data
  const incidents: Incident[] = [
    {
      id: "inc-1",
      title: "Brand in serverruimte",
      type: "brand",
      priority: "critical",
      status: "active",
      location: "Serverruimte C2.05",
      building: "Hoofdgebouw",
      floor: "2e Verdieping",
      zone: "IT Afdeling",
      reportedBy: "Jan Jansen",
      reportedAt: "2024-06-10 14:30",
      description: "Rookontwikkeling gedetecteerd in de serverruimte. Automatisch blussysteem geactiveerd.",
      actions: [
        {
          timestamp: "2024-06-10 14:30",
          user: "Systeem",
          action: "Brandmelding geactiveerd",
        },
        {
          timestamp: "2024-06-10 14:31",
          user: "Systeem",
          action: "Automatisch blussysteem geactiveerd",
        },
        {
          timestamp: "2024-06-10 14:32",
          user: "Jan Jansen",
          action: "Incident gemeld",
        },
        {
          timestamp: "2024-06-10 14:35",
          user: "Petra de Vries",
          action: "BHV team gealarmeerd",
        },
      ],
      responders: [
        {
          id: "resp-1",
          name: "Petra de Vries",
          role: "Ploegleider",
          status: "responding",
          arrivedAt: "2024-06-10 14:38",
        },
        {
          id: "resp-2",
          name: "Mohammed El Amrani",
          role: "BHV",
          status: "responding",
          arrivedAt: "2024-06-10 14:40",
        },
      ],
      notes: [
        {
          id: "note-1",
          user: "Petra de Vries",
          timestamp: "2024-06-10 14:45",
          text: "Brandweer is onderweg. Verdieping wordt ontruimd.",
        },
      ],
      customerId: selectedCustomer?.id || "",
    },
    {
      id: "inc-2",
      title: "Persoon onwel geworden",
      type: "ehbo",
      priority: "high",
      status: "in-progress",
      location: "Kantine",
      building: "Hoofdgebouw",
      floor: "1e Verdieping",
      zone: "Kantine",
      reportedBy: "Maria Janssen",
      reportedAt: "2024-06-10 12:15",
      description: "Medewerker onwel geworden tijdens lunch. Mogelijk allergische reactie.",
      actions: [
        {
          timestamp: "2024-06-10 12:15",
          user: "Maria Janssen",
          action: "Incident gemeld",
        },
        {
          timestamp: "2024-06-10 12:16",
          user: "Systeem",
          action: "EHBO team gealarmeerd",
        },
      ],
      responders: [
        {
          id: "resp-3",
          name: "Jan Jansen",
          role: "EHBO",
          status: "on-site",
          arrivedAt: "2024-06-10 12:18",
        },
      ],
      notes: [
        {
          id: "note-2",
          user: "Jan Jansen",
          timestamp: "2024-06-10 12:20",
          text: "Persoon bij bewustzijn. Vermoedelijk allergische reactie op noten. EpiPen toegediend.",
        },
        {
          id: "note-3",
          user: "Jan Jansen",
          timestamp: "2024-06-10 12:25",
          text: "Ambulance gebeld. Verwachte aankomsttijd 12:35.",
        },
      ],
      customerId: selectedCustomer?.id || "",
    },
    {
      id: "inc-3",
      title: "Waterlekkage toiletgroep",
      type: "wateroverlast",
      priority: "medium",
      status: "resolved",
      location: "Toiletgroep West",
      building: "Hoofdgebouw",
      floor: "3e Verdieping",
      zone: "West",
      reportedBy: "Pieter van Dijk",
      reportedAt: "2024-06-09 09:45",
      resolvedAt: "2024-06-09 11:30",
      description: "Waterlekkage in herentoilet. Water stroomt onder de deur door de gang op.",
      actions: [
        {
          timestamp: "2024-06-09 09:45",
          user: "Pieter van Dijk",
          action: "Incident gemeld",
        },
        {
          timestamp: "2024-06-09 09:50",
          user: "Technische Dienst",
          action: "Hoofdkraan afgesloten",
        },
        {
          timestamp: "2024-06-09 11:30",
          user: "Technische Dienst",
          action: "Lekkage verholpen, incident afgesloten",
        },
      ],
      responders: [
        {
          id: "resp-4",
          name: "Technische Dienst",
          role: "Onderhoud",
          status: "completed",
          arrivedAt: "2024-06-09 09:55",
        },
      ],
      notes: [
        {
          id: "note-4",
          user: "Technische Dienst",
          timestamp: "2024-06-09 10:15",
          text: "Kapotte watertoevoerleiding geïdentificeerd. Onderdelen besteld voor reparatie.",
        },
        {
          id: "note-5",
          user: "Technische Dienst",
          timestamp: "2024-06-09 11:30",
          text: "Lekkage verholpen. Toiletgroep weer in gebruik.",
        },
      ],
      customerId: selectedCustomer?.id || "",
    },
    {
      id: "inc-4",
      title: "Stroomuitval Zuidvleugel",
      type: "stroomuitval",
      priority: "high",
      status: "resolved",
      location: "Zuidvleugel",
      building: "Hoofdgebouw",
      floor: "Alle verdiepingen",
      zone: "Zuid",
      reportedBy: "Systeem",
      reportedAt: "2024-06-08 16:20",
      resolvedAt: "2024-06-08 17:45",
      description: "Volledige stroomuitval in de zuidvleugel. Noodverlichting geactiveerd.",
      actions: [
        {
          timestamp: "2024-06-08 16:20",
          user: "Systeem",
          action: "Stroomuitval gedetecteerd",
        },
        {
          timestamp: "2024-06-08 16:21",
          user: "Systeem",
          action: "Noodgenerator geactiveerd",
        },
        {
          timestamp: "2024-06-08 17:45",
          user: "Technische Dienst",
          action: "Stroomvoorziening hersteld, incident afgesloten",
        },
      ],
      responders: [
        {
          id: "resp-5",
          name: "Technische Dienst",
          role: "Elektra",
          status: "completed",
          arrivedAt: "2024-06-08 16:30",
        },
      ],
      notes: [
        {
          id: "note-6",
          user: "Technische Dienst",
          timestamp: "2024-06-08 16:45",
          text: "Oorzaak geïdentificeerd: kortsluiting in hoofdverdeelkast. Tijdelijke omleiding gecreëerd.",
        },
        {
          id: "note-7",
          user: "Technische Dienst",
          timestamp: "2024-06-08 17:45",
          text: "Hoofdverdeelkast gerepareerd. Stroomvoorziening hersteld en getest.",
        },
      ],
      customerId: selectedCustomer?.id || "",
    },
  ]

  const handleCreateIncident = () => {
    console.log("Nieuw incident aangemaakt:", newIncident)
    setIsNewIncidentDialogOpen(false)
    setNewIncident({
      title: "",
      type: "brand",
      priority: "medium",
      location: "",
      building: "",
      floor: "",
      zone: "",
      description: "",
    })
  }

  const handleAddNote = () => {
    if (!selectedIncident || !newNote.trim()) return
    console.log("Nieuwe notitie toegevoegd aan incident:", selectedIncident.id, newNote)
    setNewNote("")
  }

  const getIncidentTypeIcon = (type: string) => {
    switch (type) {
      case "brand":
        return <Flame className="h-5 w-5 text-red-500" />
      case "ehbo":
        return <Heart className="h-5 w-5 text-green-500" />
      case "ontruiming":
        return <Users className="h-5 w-5 text-orange-500" />
      case "beveiliging":
        return <ShieldAlert className="h-5 w-5 text-blue-500" />
      case "wateroverlast":
        return <Droplets className="h-5 w-5 text-blue-500" />
      case "stroomuitval":
        return <Zap className="h-5 w-5 text-yellow-500" />
      case "gevaarlijke_stoffen":
        return <Skull className="h-5 w-5 text-purple-500" />
      case "stralingsincident":
        return <Radiation className="h-5 w-5 text-orange-500" />
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />
    }
  }

  const getIncidentTypeLabel = (type: string) => {
    switch (type) {
      case "brand":
        return "Brand"
      case "ehbo":
        return "EHBO / Medisch"
      case "ontruiming":
        return "Ontruiming"
      case "beveiliging":
        return "Beveiliging"
      case "wateroverlast":
        return "Wateroverlast"
      case "stroomuitval":
        return "Stroomuitval"
      case "gevaarlijke_stoffen":
        return "Gevaarlijke stoffen"
      case "stralingsincident":
        return "Stralingsincident"
      default:
        return type
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "critical":
        return <Badge variant="destructive">Kritiek</Badge>
      case "high":
        return <Badge variant="destructive">Hoog</Badge>
      case "medium":
        return <Badge variant="default">Gemiddeld</Badge>
      case "low":
        return <Badge variant="outline">Laag</Badge>
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="destructive">Actief</Badge>
      case "in-progress":
        return <Badge variant="default">In behandeling</Badge>
      case "resolved":
        return <Badge variant="outline">Opgelost</Badge>
      case "archived":
        return <Badge variant="secondary">Gearchiveerd</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (!selectedCustomer) {
    return <NoCustomerSelected />
  }

  const activeIncidents = incidents.filter((inc) => inc.status === "active" || inc.status === "in-progress")
  const resolvedIncidents = incidents.filter((inc) => inc.status === "resolved" || inc.status === "archived")

  const filteredIncidents =
    activeTab === "actief"
      ? activeIncidents.filter(
          (inc) =>
            inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            inc.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
            inc.description.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      : resolvedIncidents.filter(
          (inc) =>
            inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            inc.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
            inc.description.toLowerCase().includes(searchQuery.toLowerCase()),
        )

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Incidenten Management</h1>
          <p className="text-muted-foreground">Beheer en registreer incidenten voor {selectedCustomer.name}</p>
        </div>
        <Dialog open={isNewIncidentDialogOpen} onOpenChange={setIsNewIncidentDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nieuw Incident
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Nieuw Incident Melden</DialogTitle>
              <DialogDescription>Vul de details in voor het nieuwe incident.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titel</Label>
                  <Input
                    id="title"
                    value={newIncident.title}
                    onChange={(e) => setNewIncident({ ...newIncident, title: e.target.value })}
                    placeholder="Bijv. Brand in serverruimte"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type Incident</Label>
                  <Select
                    value={newIncident.type}
                    onValueChange={(value) => setNewIncident({ ...newIncident, type: value })}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Selecteer type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="brand">Brand</SelectItem>
                      <SelectItem value="ehbo">EHBO / Medisch</SelectItem>
                      <SelectItem value="ontruiming">Ontruiming</SelectItem>
                      <SelectItem value="beveiliging">Beveiliging</SelectItem>
                      <SelectItem value="wateroverlast">Wateroverlast</SelectItem>
                      <SelectItem value="stroomuitval">Stroomuitval</SelectItem>
                      <SelectItem value="gevaarlijke_stoffen">Gevaarlijke stoffen</SelectItem>
                      <SelectItem value="stralingsincident">Stralingsincident</SelectItem>
                      <SelectItem value="other">Overig</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Prioriteit</Label>
                  <Select
                    value={newIncident.priority}
                    onValueChange={(value: "low" | "medium" | "high" | "critical") =>
                      setNewIncident({ ...newIncident, priority: value })
                    }
                  >
                    <SelectTrigger id="priority">
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
                <div className="space-y-2">
                  <Label htmlFor="building">Gebouw</Label>
                  <Input
                    id="building"
                    value={newIncident.building}
                    onChange={(e) => setNewIncident({ ...newIncident, building: e.target.value })}
                    placeholder="Bijv. Hoofdgebouw"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="floor">Verdieping</Label>
                  <Input
                    id="floor"
                    value={newIncident.floor}
                    onChange={(e) => setNewIncident({ ...newIncident, floor: e.target.value })}
                    placeholder="Bijv. 2e Verdieping"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zone">Zone</Label>
                  <Input
                    id="zone"
                    value={newIncident.zone}
                    onChange={(e) => setNewIncident({ ...newIncident, zone: e.target.value })}
                    placeholder="Bijv. IT Afdeling"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Specifieke locatie</Label>
                <Input
                  id="location"
                  value={newIncident.location}
                  onChange={(e) => setNewIncident({ ...newIncident, location: e.target.value })}
                  placeholder="Bijv. Serverruimte C2.05"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Beschrijving</Label>
                <Textarea
                  id="description"
                  value={newIncident.description}
                  onChange={(e) => setNewIncident({ ...newIncident, description: e.target.value })}
                  placeholder="Beschrijf het incident zo gedetailleerd mogelijk"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewIncidentDialogOpen(false)}>
                Annuleren
              </Button>
              <Button onClick={handleCreateIncident}>Incident Melden</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Zoek incidenten..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="actief">Actieve Incidenten</TabsTrigger>
          <TabsTrigger value="opgelost">Opgeloste Incidenten</TabsTrigger>
          <TabsTrigger value="statistieken">Statistieken</TabsTrigger>
        </TabsList>

        <TabsContent value="actief" className="space-y-4 mt-6">
          {filteredIncidents.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                <p className="text-muted-foreground">Geen actieve incidenten</p>
                <Button variant="outline" className="mt-4" onClick={() => setIsNewIncidentDialogOpen(true)}>
                  Incident Melden
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredIncidents.map((incident) => (
                <Card key={incident.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-2">
                        {getIncidentTypeIcon(incident.type)}
                        <CardTitle>{incident.title}</CardTitle>
                      </div>
                      <div className="flex space-x-2">
                        {getPriorityBadge(incident.priority)}
                        {getStatusBadge(incident.status)}
                      </div>
                    </div>
                    <CardDescription>{getIncidentTypeLabel(incident.type)}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="space-y-3">
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>
                          {incident.building}, {incident.floor}, {incident.location}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>Gemeld op {incident.reportedAt}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <User className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>Gemeld door {incident.reportedBy}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{incident.responders.length} responders</span>
                      </div>
                      {incident.description && (
                        <p className="text-sm text-muted-foreground mt-2">{incident.description}</p>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedIncident(incident)
                        setIsIncidentDetailsDialogOpen(true)
                      }}
                    >
                      Details
                    </Button>
                    <div className="space-x-2">
                      <Button variant="outline" size="sm">
                        Responders
                      </Button>
                      <Button size="sm">{incident.status === "active" ? "In behandeling" : "Oplossen"}</Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="opgelost" className="space-y-4 mt-6">
          {filteredIncidents.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Geen opgeloste incidenten gevonden</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredIncidents.map((incident) => (
                <Card key={incident.id}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-2">
                        {getIncidentTypeIcon(incident.type)}
                        <CardTitle>{incident.title}</CardTitle>
                      </div>
                      <div className="flex space-x-2">
                        {getPriorityBadge(incident.priority)}
                        {getStatusBadge(incident.status)}
                      </div>
                    </div>
                    <CardDescription>{getIncidentTypeLabel(incident.type)}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="space-y-3">
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>
                          {incident.building}, {incident.floor}, {incident.location}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>Opgelost op {incident.resolvedAt}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <User className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>Gemeld door {incident.reportedBy}</span>
                      </div>
                      {incident.description && (
                        <p className="text-sm text-muted-foreground mt-2">{incident.description}</p>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedIncident(incident)
                        setIsIncidentDetailsDialogOpen(true)
                      }}
                    >
                      Details
                    </Button>
                    <Button variant="outline" size="sm">
                      Rapport
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="statistieken" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Totaal Incidenten</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{incidents.length}</div>
                <p className="text-xs text-muted-foreground">Deze maand</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Actieve Incidenten</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeIncidents.length}</div>
                <p className="text-xs text-muted-foreground">Momenteel actief</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Opgeloste Incidenten</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{resolvedIncidents.length}</div>
                <p className="text-xs text-muted-foreground">Deze maand</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Gemiddelde Responstijd</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.2 min</div>
                <p className="text-xs text-muted-foreground">Afgelopen 30 dagen</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Incident Types</CardTitle>
              <CardDescription>Verdeling van incident types deze maand</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Flame className="h-4 w-4 text-red-500" />
                    <span>Brand</span>
                  </div>
                  <span className="font-medium">1</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Heart className="h-4 w-4 text-green-500" />
                    <span>EHBO / Medisch</span>
                  </div>
                  <span className="font-medium">1</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Droplets className="h-4 w-4 text-blue-500" />
                    <span>Wateroverlast</span>
                  </div>
                  <span className="font-medium">1</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    <span>Stroomuitval</span>
                  </div>
                  <span className="font-medium">1</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isIncidentDetailsDialogOpen} onOpenChange={setIsIncidentDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              {selectedIncident && getIncidentTypeIcon(selectedIncident.type)}
              <span>{selectedIncident?.title}</span>
            </DialogTitle>
            <DialogDescription>
              {selectedIncident && getIncidentTypeLabel(selectedIncident.type)} - {selectedIncident?.reportedAt}
            </DialogDescription>
          </DialogHeader>
          {selectedIncident && (
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Incident Details</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>Status:</strong> {getStatusBadge(selectedIncident.status)}
                    </div>
                    <div>
                      <strong>Prioriteit:</strong> {getPriorityBadge(selectedIncident.priority)}
                    </div>
                    <div>
                      <strong>Locatie:</strong> {selectedIncident.location}
                    </div>
                    <div>
                      <strong>Gebouw:</strong> {selectedIncident.building}
                    </div>
                    <div>
                      <strong>Verdieping:</strong> {selectedIncident.floor}
                    </div>
                    <div>
                      <strong>Zone:</strong> {selectedIncident.zone}
                    </div>
                    <div>
                      <strong>Gemeld door:</strong> {selectedIncident.reportedBy}
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Responders</h4>
                  <div className="space-y-2">
                    {selectedIncident.responders.map((responder) => (
                      <div key={responder.id} className="flex items-center justify-between text-sm">
                        <span>
                          {responder.name} ({responder.role})
                        </span>
                        <Badge variant="outline">{responder.status}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Beschrijving</h4>
                <p className="text-sm text-muted-foreground">{selectedIncident.description}</p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Tijdlijn</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedIncident.actions.map((action, index) => (
                    <div key={index} className="flex items-start space-x-2 text-sm">
                      <div className="w-16 text-muted-foreground">{action.timestamp.split(" ")[1]}</div>
                      <div className="flex-1">
                        <strong>{action.user}:</strong> {action.action}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Notities</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto mb-4">
                  {selectedIncident.notes.map((note) => (
                    <div key={note.id} className="p-2 bg-muted rounded text-sm">
                      <div className="flex justify-between items-start mb-1">
                        <strong>{note.user}</strong>
                        <span className="text-muted-foreground text-xs">{note.timestamp}</span>
                      </div>
                      <p>{note.text}</p>
                    </div>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Voeg een notitie toe..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                  />
                  <Button onClick={handleAddNote}>Toevoegen</Button>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsIncidentDetailsDialogOpen(false)}>
              Sluiten
            </Button>
            {selectedIncident?.status === "active" && <Button>Incident Oplossen</Button>}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
