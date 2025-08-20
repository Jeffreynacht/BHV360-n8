"use client"

import { useState, useEffect } from "react"
import { useCustomer } from "@/components/customer-context"
import { NoCustomerSelected } from "@/components/no-customer-selected"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  MessageSquare,
  Search,
  Shield,
  Stethoscope,
  Flame,
  Droplets,
  Bell,
  Eye,
  Send,
  AlertCircle,
  XCircle,
} from "lucide-react"

interface NFCTagOverview {
  id: string
  name: string
  uid: string
  type: "brandblusser" | "brandslanghaspel" | "ehbo-koffer" | "aed" | "nooduitgang" | "verzamelpunt"
  location: string
  building: string
  floor: string
  zone: string
  status: "ok" | "warning" | "critical" | "expired" | "missing-seal"
  lastInspection: string
  nextInspection: string
  expiryDate?: string
  sealStatus: "intact" | "broken" | "missing"
  batteryLevel: number
  lastScanned: string | null
  assignedTo: string
  notes: string
  reports: TagReport[]
}

interface TagReport {
  id: string
  tagId: string
  reportedBy: string
  reportedAt: string
  type: "defect" | "missing-seal" | "expired" | "maintenance" | "other"
  description: string
  status: "open" | "in-progress" | "resolved"
  resolvedBy?: string
  resolvedAt?: string
  priority: "low" | "medium" | "high" | "critical"
}

interface NotificationAlert {
  id: string
  type: "expiry" | "inspection" | "seal" | "report"
  tagId: string
  tagName: string
  message: string
  priority: "low" | "medium" | "high" | "critical"
  createdAt: string
  acknowledged: boolean
}

const tagTypes = [
  { id: "brandblusser", name: "Brandblusser", icon: Flame, color: "text-red-500" },
  { id: "brandslanghaspel", name: "Brandslanghaspel", icon: Droplets, color: "text-blue-500" },
  { id: "ehbo-koffer", name: "EHBO Koffer", icon: Stethoscope, color: "text-green-500" },
  { id: "aed", name: "AED", icon: Shield, color: "text-purple-500" },
  { id: "nooduitgang", name: "Nooduitgang", icon: MapPin, color: "text-orange-500" },
  { id: "verzamelpunt", name: "Verzamelpunt", icon: MapPin, color: "text-gray-500" },
]

const reportTypes = [
  { id: "defect", name: "Defect", color: "bg-red-100 text-red-800" },
  { id: "missing-seal", name: "Zegel ontbreekt", color: "bg-orange-100 text-orange-800" },
  { id: "expired", name: "Verlopen", color: "bg-yellow-100 text-yellow-800" },
  { id: "maintenance", name: "Onderhoud nodig", color: "bg-blue-100 text-blue-800" },
  { id: "other", name: "Overig", color: "bg-gray-100 text-gray-800" },
]

const mockTags: NFCTagOverview[] = [
  {
    id: "1",
    name: "Brandblusser HG-001",
    uid: "04:52:3A:B2:C1:80",
    type: "brandblusser",
    location: "Hoofdingang",
    building: "Hoofdgebouw",
    floor: "Begane Grond",
    zone: "Noord",
    status: "warning",
    lastInspection: "2024-01-15",
    nextInspection: "2024-07-15",
    expiryDate: "2025-01-15",
    sealStatus: "intact",
    batteryLevel: 85,
    lastScanned: "2024-01-10 14:30",
    assignedTo: "Jan Jansen",
    notes: "Keuring bijna vervallen",
    reports: [],
  },
  {
    id: "2",
    name: "EHBO Koffer K-002",
    uid: "04:52:3A:B2:C1:81",
    type: "ehbo-koffer",
    location: "Kantine",
    building: "Hoofdgebouw",
    floor: "2e Verdieping",
    zone: "Kantine",
    status: "critical",
    lastInspection: "2023-12-01",
    nextInspection: "2024-06-01",
    expiryDate: "2024-03-01",
    sealStatus: "broken",
    batteryLevel: 92,
    lastScanned: null,
    assignedTo: "Maria Janssen",
    notes: "Zegel beschadigd, inhoud controleren",
    reports: [
      {
        id: "r1",
        tagId: "2",
        reportedBy: "Piet Bakker",
        reportedAt: "2024-01-08 09:15",
        type: "missing-seal",
        description: "Zegel van EHBO koffer is beschadigd en hangt los",
        status: "open",
        priority: "high",
      },
    ],
  },
  {
    id: "3",
    name: "AED Receptie",
    uid: "04:52:3A:B2:C1:82",
    type: "aed",
    location: "Receptie",
    building: "Hoofdgebouw",
    floor: "Begane Grond",
    zone: "Centrale hal",
    status: "ok",
    lastInspection: "2024-01-01",
    nextInspection: "2024-07-01",
    sealStatus: "intact",
    batteryLevel: 78,
    lastScanned: "2024-01-12 11:20",
    assignedTo: "Lisa de Vries",
    notes: "Alles in orde",
    reports: [],
  },
]

export default function NFCOverzichtPage() {
  const { selectedCustomer } = useCustomer()
  const [tags, setTags] = useState<NFCTagOverview[]>(mockTags)
  const [filteredTags, setFilteredTags] = useState<NFCTagOverview[]>(mockTags)
  const [alerts, setAlerts] = useState<NotificationAlert[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [buildingFilter, setBuildingFilter] = useState("all")
  const [selectedTag, setSelectedTag] = useState<NFCTagOverview | null>(null)
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false)
  const [newReport, setNewReport] = useState({
    type: "defect",
    description: "",
    priority: "medium",
  })

  useEffect(() => {
    // Generate alerts based on tag status
    const newAlerts: NotificationAlert[] = []

    tags.forEach((tag) => {
      // Check for expiring items
      if (tag.expiryDate) {
        const expiryDate = new Date(tag.expiryDate)
        const today = new Date()
        const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

        if (daysUntilExpiry <= 30 && daysUntilExpiry > 0) {
          newAlerts.push({
            id: `exp-${tag.id}`,
            type: "expiry",
            tagId: tag.id,
            tagName: tag.name,
            message: `Verloopt over ${daysUntilExpiry} dagen`,
            priority: daysUntilExpiry <= 7 ? "critical" : daysUntilExpiry <= 14 ? "high" : "medium",
            createdAt: new Date().toISOString(),
            acknowledged: false,
          })
        }
      }

      // Check for upcoming inspections
      const inspectionDate = new Date(tag.nextInspection)
      const today = new Date()
      const daysUntilInspection = Math.ceil((inspectionDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

      if (daysUntilInspection <= 14 && daysUntilInspection > 0) {
        newAlerts.push({
          id: `insp-${tag.id}`,
          type: "inspection",
          tagId: tag.id,
          tagName: tag.name,
          message: `Keuring vervalt over ${daysUntilInspection} dagen`,
          priority: daysUntilInspection <= 3 ? "critical" : daysUntilInspection <= 7 ? "high" : "medium",
          createdAt: new Date().toISOString(),
          acknowledged: false,
        })
      }

      // Check for seal issues
      if (tag.sealStatus !== "intact") {
        newAlerts.push({
          id: `seal-${tag.id}`,
          type: "seal",
          tagId: tag.id,
          tagName: tag.name,
          message: `Zegel ${tag.sealStatus === "broken" ? "beschadigd" : "ontbreekt"}`,
          priority: "high",
          createdAt: new Date().toISOString(),
          acknowledged: false,
        })
      }

      // Check for open reports
      tag.reports.forEach((report) => {
        if (report.status === "open") {
          newAlerts.push({
            id: `report-${report.id}`,
            type: "report",
            tagId: tag.id,
            tagName: tag.name,
            message: `Nieuwe melding: ${report.description.substring(0, 50)}...`,
            priority: report.priority,
            createdAt: report.reportedAt,
            acknowledged: false,
          })
        }
      })
    })

    setAlerts(newAlerts)
  }, [tags])

  useEffect(() => {
    // Filter tags based on search and filters
    let filtered = tags

    if (searchTerm) {
      filtered = filtered.filter(
        (tag) =>
          tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tag.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tag.uid.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((tag) => tag.status === statusFilter)
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((tag) => tag.type === typeFilter)
    }

    if (buildingFilter !== "all") {
      filtered = filtered.filter((tag) => tag.building === buildingFilter)
    }

    setFilteredTags(filtered)
  }, [tags, searchTerm, statusFilter, typeFilter, buildingFilter])

  if (!selectedCustomer) {
    return <NoCustomerSelected />
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ok":
        return "bg-green-100 text-green-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "critical":
        return "bg-red-100 text-red-800"
      case "expired":
        return "bg-red-100 text-red-800"
      case "missing-seal":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "ok":
        return "OK"
      case "warning":
        return "Waarschuwing"
      case "critical":
        return "Kritiek"
      case "expired":
        return "Verlopen"
      case "missing-seal":
        return "Zegel ontbreekt"
      default:
        return "Onbekend"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ok":
        return <CheckCircle className="h-4 w-4" />
      case "warning":
        return <AlertTriangle className="h-4 w-4" />
      case "critical":
        return <XCircle className="h-4 w-4" />
      case "expired":
        return <Clock className="h-4 w-4" />
      case "missing-seal":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "critical":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleSubmitReport = () => {
    if (!selectedTag || !newReport.description.trim()) {
      alert("Vul een beschrijving in")
      return
    }

    const report: TagReport = {
      id: `r-${Date.now()}`,
      tagId: selectedTag.id,
      reportedBy: "Huidige Gebruiker",
      reportedAt: new Date().toLocaleString(),
      type: newReport.type as any,
      description: newReport.description,
      status: "open",
      priority: newReport.priority as any,
    }

    // Update tag with new report
    setTags(
      tags.map((tag) =>
        tag.id === selectedTag.id
          ? {
              ...tag,
              reports: [...tag.reports, report],
              status:
                newReport.type === "expired"
                  ? "expired"
                  : newReport.type === "missing-seal"
                    ? "missing-seal"
                    : "critical",
            }
          : tag,
      ),
    )

    // Reset form
    setNewReport({
      type: "defect",
      description: "",
      priority: "medium",
    })
    setIsReportDialogOpen(false)
    setSelectedTag(null)

    alert("Melding verzonden naar beheerder!")
  }

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(alerts.map((alert) => (alert.id === alertId ? { ...alert, acknowledged: true } : alert)))
  }

  const criticalAlerts = alerts.filter((alert) => alert.priority === "critical" && !alert.acknowledged)
  const highAlerts = alerts.filter((alert) => alert.priority === "high" && !alert.acknowledged)
  const totalAlerts = alerts.filter((alert) => !alert.acknowledged).length

  return (
    <div className="container p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">NFC Tags Overzicht</h1>
        <p className="text-muted-foreground">Monitoring en beheer van alle NFC tags voor {selectedCustomer.name}</p>
      </div>

      {/* Alert Summary */}
      {totalAlerts > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <div>
                  <p className="font-medium text-red-800">Kritieke Meldingen</p>
                  <p className="text-2xl font-bold text-red-900">{criticalAlerts.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="font-medium text-orange-800">Hoge Prioriteit</p>
                  <p className="text-2xl font-bold text-orange-900">{highAlerts.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium text-blue-800">Totaal Meldingen</p>
                  <p className="text-2xl font-bold text-blue-900">{totalAlerts}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overzicht</TabsTrigger>
          <TabsTrigger value="alerts">
            Meldingen
            {totalAlerts > 0 && (
              <Badge variant="destructive" className="ml-2">
                {totalAlerts}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="reports">Rapporten</TabsTrigger>
          <TabsTrigger value="manual">Gebruikshandleiding</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>NFC Tags Status</CardTitle>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4" />
                  <Input
                    placeholder="Zoeken..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle statussen</SelectItem>
                    <SelectItem value="ok">OK</SelectItem>
                    <SelectItem value="warning">Waarschuwing</SelectItem>
                    <SelectItem value="critical">Kritiek</SelectItem>
                    <SelectItem value="expired">Verlopen</SelectItem>
                    <SelectItem value="missing-seal">Zegel ontbreekt</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle types</SelectItem>
                    {tagTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={buildingFilter} onValueChange={setBuildingFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Gebouw" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle gebouwen</SelectItem>
                    <SelectItem value="Hoofdgebouw">Hoofdgebouw</SelectItem>
                    <SelectItem value="Bijgebouw A">Bijgebouw A</SelectItem>
                    <SelectItem value="Parkeergarage">Parkeergarage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Naam</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Locatie</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Keuring</TableHead>
                    <TableHead>Vervaldatum</TableHead>
                    <TableHead>Zegel</TableHead>
                    <TableHead>Acties</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTags.map((tag) => {
                    const tagType = tagTypes.find((t) => t.id === tag.type)
                    const TypeIcon = tagType?.icon || MapPin
                    return (
                      <TableRow key={tag.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            <TypeIcon className={`h-4 w-4 ${tagType?.color}`} />
                            <span>{tag.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{tagType?.name}</Badge>
                        </TableCell>
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
                          <Badge className={getStatusColor(tag.status)}>
                            {getStatusIcon(tag.status)}
                            <span className="ml-1">{getStatusText(tag.status)}</span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>Volgende: {tag.nextInspection}</div>
                            <div className="text-muted-foreground">Laatste: {tag.lastInspection}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {tag.expiryDate ? (
                            <div className="text-sm">
                              <div>{tag.expiryDate}</div>
                              <div className="text-muted-foreground">
                                {Math.ceil(
                                  (new Date(tag.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
                                )}{" "}
                                dagen
                              </div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">N.v.t.</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={tag.sealStatus === "intact" ? "default" : "destructive"}
                            className={
                              tag.sealStatus === "intact"
                                ? "bg-green-100 text-green-800"
                                : tag.sealStatus === "broken"
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-red-100 text-red-800"
                            }
                          >
                            {tag.sealStatus === "intact"
                              ? "Intact"
                              : tag.sealStatus === "broken"
                                ? "Beschadigd"
                                : "Ontbreekt"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setSelectedTag(tag)}>
                                  <MessageSquare className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Melding indienen voor {tag.name}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="report-type">Type melding</Label>
                                    <Select
                                      value={newReport.type}
                                      onValueChange={(value) => setNewReport({ ...newReport, type: value })}
                                    >
                                      <SelectTrigger id="report-type">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {reportTypes.map((type) => (
                                          <SelectItem key={type.id} value={type.id}>
                                            {type.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="report-priority">Prioriteit</Label>
                                    <Select
                                      value={newReport.priority}
                                      onValueChange={(value) => setNewReport({ ...newReport, priority: value })}
                                    >
                                      <SelectTrigger id="report-priority">
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
                                  <div className="space-y-2">
                                    <Label htmlFor="report-description">Beschrijving</Label>
                                    <Textarea
                                      id="report-description"
                                      value={newReport.description}
                                      onChange={(e) => setNewReport({ ...newReport, description: e.target.value })}
                                      placeholder="Beschrijf het probleem..."
                                      rows={4}
                                    />
                                  </div>
                                  <div className="flex justify-end space-x-2">
                                    <Button variant="outline">Annuleren</Button>
                                    <Button onClick={handleSubmitReport}>
                                      <Send className="h-4 w-4 mr-2" />
                                      Melding versturen
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>Actieve Meldingen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts
                  .filter((alert) => !alert.acknowledged)
                  .map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-4 rounded-lg border ${
                        alert.priority === "critical"
                          ? "border-red-200 bg-red-50"
                          : alert.priority === "high"
                            ? "border-orange-200 bg-orange-50"
                            : "border-yellow-200 bg-yellow-50"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge className={getPriorityColor(alert.priority)}>
                              {alert.priority === "critical"
                                ? "Kritiek"
                                : alert.priority === "high"
                                  ? "Hoog"
                                  : alert.priority === "medium"
                                    ? "Gemiddeld"
                                    : "Laag"}
                            </Badge>
                            <span className="font-medium">{alert.tagName}</span>
                          </div>
                          <p className="text-sm text-gray-700">{alert.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{alert.createdAt}</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => acknowledgeAlert(alert.id)}>
                          Bevestigen
                        </Button>
                      </div>
                    </div>
                  ))}
                {alerts.filter((alert) => !alert.acknowledged).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4" />
                    <p>Geen actieve meldingen</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Gebruikersmeldingen</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tag</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Beschrijving</TableHead>
                    <TableHead>Gemeld door</TableHead>
                    <TableHead>Datum</TableHead>
                    <TableHead>Prioriteit</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tags
                    .flatMap((tag) => tag.reports.map((report) => ({ ...report, tagName: tag.name })))
                    .map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{report.tagName}</TableCell>
                        <TableCell>
                          <Badge className={reportTypes.find((t) => t.id === report.type)?.color}>
                            {reportTypes.find((t) => t.id === report.type)?.name}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{report.description}</TableCell>
                        <TableCell>{report.reportedBy}</TableCell>
                        <TableCell>{report.reportedAt}</TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(report.priority)}>
                            {report.priority === "critical"
                              ? "Kritiek"
                              : report.priority === "high"
                                ? "Hoog"
                                : report.priority === "medium"
                                  ? "Gemiddeld"
                                  : "Laag"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              report.status === "resolved"
                                ? "default"
                                : report.status === "in-progress"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {report.status === "resolved"
                              ? "Opgelost"
                              : report.status === "in-progress"
                                ? "In behandeling"
                                : "Open"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manual">
          <Card>
            <CardHeader>
              <CardTitle>Gebruikshandleiding - NFC Tags Overzicht</CardTitle>
              <CardDescription>Leer hoe u het NFC Tags overzicht gebruikt voor monitoring en beheer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">📊 Dashboard Overzicht</h3>
                <div className="space-y-2 text-sm">
                  <p>
                    • <strong>Kritieke Meldingen:</strong> Tags die directe actie vereisen (defecten, beschadigde
                    zegels)
                  </p>
                  <p>
                    • <strong>Hoge Prioriteit:</strong> Tags met waarschuwingen of bijna vervallen keuringen
                  </p>
                  <p>
                    • <strong>Totaal Meldingen:</strong> Alle actieve alerts in het systeem
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">🔍 Zoeken en Filteren</h3>
                <div className="space-y-2 text-sm">
                  <p>
                    • <strong>Zoekbalk:</strong> Zoek op naam, locatie of UID van de NFC tag
                  </p>
                  <p>
                    • <strong>Status Filter:</strong> Filter op OK, Waarschuwing, Kritiek, Verlopen of Zegel ontbreekt
                  </p>
                  <p>
                    • <strong>Type Filter:</strong> Filter op type voorziening (Brandblusser, AED, EHBO, etc.)
                  </p>
                  <p>
                    • <strong>Gebouw Filter:</strong> Filter op specifiek gebouw of locatie
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">📋 Status Betekenissen</h3>
                <div className="space-y-2 text-sm">
                  <p>
                    • <Badge className="bg-green-100 text-green-800">OK</Badge> - Alles in orde, geen actie vereist
                  </p>
                  <p>
                    • <Badge className="bg-yellow-100 text-yellow-800">Waarschuwing</Badge> - Keuring vervalt binnenkort
                  </p>
                  <p>
                    • <Badge className="bg-red-100 text-red-800">Kritiek</Badge> - Directe actie vereist
                  </p>
                  <p>
                    • <Badge className="bg-red-100 text-red-800">Verlopen</Badge> - Vervaldatum overschreden
                  </p>
                  <p>
                    • <Badge className="bg-orange-100 text-orange-800">Zegel ontbreekt</Badge> - Zegel beschadigd of weg
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">📱 Melding Indienen</h3>
                <div className="space-y-2 text-sm">
                  <p>
                    1. Klik op de <MessageSquare className="h-4 w-4 inline" /> knop bij een NFC tag
                  </p>
                  <p>2. Selecteer het type melding (Defect, Zegel ontbreekt, Verlopen, etc.)</p>
                  <p>3. Kies de prioriteit (Kritiek, Hoog, Gemiddeld, Laag)</p>
                  <p>4. Beschrijf het probleem in detail</p>
                  <p>5. Verstuur de melding naar de beheerder</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">🚨 Alerts Beheren</h3>
                <div className="space-y-2 text-sm">
                  <p>• Bekijk alle actieve alerts in het "Meldingen" tabblad</p>
                  <p>• Alerts worden automatisch gegenereerd voor:</p>
                  <p className="ml-4">- Vervaldatums (30 dagen van tevoren)</p>
                  <p className="ml-4">- Keuringen (14 dagen van tevoren)</p>
                  <p className="ml-4">- Beschadigde zegels (direct)</p>
                  <p className="ml-4">- Nieuwe gebruikersmeldingen</p>
                  <p>• Klik "Bevestigen" om een alert als gelezen te markeren</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">📊 Rapporten Bekijken</h3>
                <div className="space-y-2 text-sm">
                  <p>• Het "Rapporten" tabblad toont alle gebruikersmeldingen</p>
                  <p>• Zie wie de melding heeft ingediend en wanneer</p>
                  <p>• Volg de status van meldingen (Nieuw, In behandeling, Opgelost)</p>
                  <p>• Filter op prioriteit en type melding</p>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">💡 Tips voor Effectief Gebruik</h4>
                <div className="space-y-1 text-sm text-blue-700">
                  <p>• Controleer dagelijks de kritieke meldingen</p>
                  <p>• Plan keuringen op basis van de vervaldatums</p>
                  <p>• Reageer snel op meldingen over beschadigde zegels</p>
                  <p>• Gebruik filters om specifieke problemen te identificeren</p>
                  <p>• Houd de locatie-informatie up-to-date voor snelle respons</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
