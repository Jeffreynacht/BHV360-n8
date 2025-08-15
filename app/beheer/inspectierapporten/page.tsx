"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { FileText, Search, Plus, Download, Eye, CheckCircle, AlertTriangle, XCircle, RotateCcw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface InspectionReport {
  id: string
  voorzieningId: string
  voorzieningNaam: string
  voorzieningType: string
  locatie: string
  inspecteur: string
  inspecteurCertificering: string
  inspectiedatum: string
  vervaldatum: string
  status: "goedgekeurd" | "herstel_nodig" | "afgekeurd" | "vervangen"
  bevindingen: string
  aanbevelingen: string
  volgendeInspectie: string
  createdAt: string
  updatedAt: string
}

const statusConfig = {
  goedgekeurd: { label: "Goedgekeurd", color: "bg-green-500", icon: CheckCircle },
  herstel_nodig: { label: "Herstel Nodig", color: "bg-yellow-500", icon: AlertTriangle },
  afgekeurd: { label: "Afgekeurd", color: "bg-red-500", icon: XCircle },
  vervangen: { label: "Vervangen", color: "bg-blue-500", icon: RotateCcw },
}

// Demo data
const demoReports: InspectionReport[] = [
  {
    id: "1",
    voorzieningId: "ext-001",
    voorzieningNaam: "Brandblusser Gang A",
    voorzieningType: "Brandblusser",
    locatie: "Begane grond - Gang A",
    inspecteur: "Jan Pietersen",
    inspecteurCertificering: "VCA-VOL, Brandveiligheid Niveau 3",
    inspectiedatum: "2024-01-15",
    vervaldatum: "2025-01-15",
    status: "goedgekeurd",
    bevindingen: "Brandblusser in goede staat. Druk correct, geen beschadigingen zichtbaar. Instructielabel leesbaar.",
    aanbevelingen: "Reguliere controle over 6 maanden. Geen directe actie vereist.",
    volgendeInspectie: "2024-07-15",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    voorzieningId: "aed-002",
    voorzieningNaam: "AED Receptie",
    voorzieningType: "AED",
    locatie: "Begane grond - Receptie",
    inspecteur: "Maria van der Berg",
    inspecteurCertificering: "BHV-Diploma, AED Instructeur",
    inspectiedatum: "2024-01-20",
    vervaldatum: "2025-01-20",
    status: "herstel_nodig",
    bevindingen: "AED functioneert correct. Batterij indicator toont 75%. Elektroden vervallen over 3 maanden.",
    aanbevelingen: "Nieuwe elektroden bestellen voor maart 2024. Batterij monitoren.",
    volgendeInspectie: "2024-07-20",
    createdAt: "2024-01-20T14:15:00Z",
    updatedAt: "2024-01-20T14:15:00Z",
  },
  {
    id: "3",
    voorzieningId: "ehbo-003",
    voorzieningNaam: "EHBO-kit Werkplaats",
    voorzieningType: "EHBO-kit",
    locatie: "1e verdieping - Werkplaats",
    inspecteur: "Piet Janssen",
    inspecteurCertificering: "EHBO-Diploma, Bedrijfshulpverlening",
    inspectiedatum: "2024-01-25",
    vervaldatum: "2024-07-25",
    status: "afgekeurd",
    bevindingen: "Meerdere items ontbreken: steriele gaasjes, pleistermateriaal. Enkele medicijnen verlopen.",
    aanbevelingen: "Complete vervanging van EHBO-kit vereist. Niet geschikt voor gebruik tot vervanging.",
    volgendeInspectie: "2024-02-01",
    createdAt: "2024-01-25T09:45:00Z",
    updatedAt: "2024-01-25T09:45:00Z",
  },
  {
    id: "4",
    voorzieningId: "exit-004",
    voorzieningNaam: "Nooduitgang Oost",
    voorzieningType: "Nooduitgang",
    locatie: "2e verdieping - Oostzijde",
    inspecteur: "Lisa de Vries",
    inspecteurCertificering: "Brandveiligheid Expert, VCA-VOL",
    inspectiedatum: "2024-02-01",
    vervaldatum: "2025-02-01",
    status: "goedgekeurd",
    bevindingen: "Nooduitgang vrij van obstakels. Deur opent correct. Verlichting functioneert. Signalering zichtbaar.",
    aanbevelingen: "Maandelijkse controle van vrije doorgang. Geen verdere actie nodig.",
    volgendeInspectie: "2024-08-01",
    createdAt: "2024-02-01T11:20:00Z",
    updatedAt: "2024-02-01T11:20:00Z",
  },
  {
    id: "5",
    voorzieningId: "alarm-005",
    voorzieningNaam: "Brandmelder Kantoor B",
    voorzieningType: "Brandmelder",
    locatie: "1e verdieping - Kantoor B",
    inspecteur: "Tom Bakker",
    inspecteurCertificering: "Technische Installaties, Branddetectie Specialist",
    inspectiedatum: "2024-02-05",
    vervaldatum: "2024-08-05",
    status: "vervangen",
    bevindingen: "Melder reageert traag op testprocedure. Sensor vervuild en verouderd (>10 jaar).",
    aanbevelingen: "Vervanging van brandmelder binnen 2 weken. Tijdelijke extra controles.",
    volgendeInspectie: "2024-02-20",
    createdAt: "2024-02-05T16:30:00Z",
    updatedAt: "2024-02-05T16:30:00Z",
  },
]

export default function InspectieRapportenPage() {
  const [reports, setReports] = useState<InspectionReport[]>(demoReports)
  const [filteredReports, setFilteredReports] = useState<InspectionReport[]>(demoReports)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [selectedReport, setSelectedReport] = useState<InspectionReport | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const { toast } = useToast()

  // Filter reports based on search and filters
  useEffect(() => {
    let filtered = reports

    if (searchTerm) {
      filtered = filtered.filter(
        (report) =>
          report.voorzieningNaam.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.inspecteur.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.locatie.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((report) => report.status === statusFilter)
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((report) => report.voorzieningType === typeFilter)
    }

    setFilteredReports(filtered)
  }, [reports, searchTerm, statusFilter, typeFilter])

  // Calculate statistics
  const stats = {
    total: reports.length,
    goedgekeurd: reports.filter((r) => r.status === "goedgekeurd").length,
    binnenkoortVervallen: reports.filter((r) => {
      const vervaldatum = new Date(r.vervaldatum)
      const now = new Date()
      const diffTime = vervaldatum.getTime() - now.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays <= 30 && diffDays > 0
    }).length,
    vervallen: reports.filter((r) => new Date(r.vervaldatum) < new Date()).length,
  }

  const handleDownloadPDF = async (reportId: string) => {
    try {
      const response = await fetch(`/api/reports/inspection-pdf?id=${reportId}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `inspectie-rapport-${reportId}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        toast({
          title: "PDF gedownload",
          description: "Het inspectie rapport is succesvol gedownload.",
        })
      }
    } catch (error) {
      toast({
        title: "Download mislukt",
        description: "Er is een fout opgetreden bij het downloaden van het rapport.",
        variant: "destructive",
      })
    }
  }

  const handleViewReport = (report: InspectionReport) => {
    setSelectedReport(report)
    setIsViewDialogOpen(true)
  }

  const getUniqueTypes = () => {
    const types = [...new Set(reports.map((r) => r.voorzieningType))]
    return types.sort()
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Inspectie Rapporten</h1>
          <p className="text-muted-foreground">Beheer en bekijk alle veiligheidsinspecties</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nieuw Rapport
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totaal Rapporten</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Goedgekeurd</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.goedgekeurd}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Binnenkort Vervallen</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.binnenkoortVervallen}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vervallen</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.vervallen}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Zoeken</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Zoek op naam, inspecteur of locatie..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="status-filter">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Alle statussen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle statussen</SelectItem>
                  <SelectItem value="goedgekeurd">Goedgekeurd</SelectItem>
                  <SelectItem value="herstel_nodig">Herstel Nodig</SelectItem>
                  <SelectItem value="afgekeurd">Afgekeurd</SelectItem>
                  <SelectItem value="vervangen">Vervangen</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="type-filter">Type</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Alle types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle types</SelectItem>
                  {getUniqueTypes().map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inspectie Rapporten ({filteredReports.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Voorziening</th>
                  <th className="text-left p-2">Type</th>
                  <th className="text-left p-2">Locatie</th>
                  <th className="text-left p-2">Inspecteur</th>
                  <th className="text-left p-2">Datum</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Vervaldatum</th>
                  <th className="text-left p-2">Acties</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((report) => {
                  const StatusIcon = statusConfig[report.status].icon
                  const isExpired = new Date(report.vervaldatum) < new Date()
                  const isExpiringSoon = (() => {
                    const vervaldatum = new Date(report.vervaldatum)
                    const now = new Date()
                    const diffTime = vervaldatum.getTime() - now.getTime()
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                    return diffDays <= 30 && diffDays > 0
                  })()

                  return (
                    <tr key={report.id} className="border-b hover:bg-muted/50">
                      <td className="p-2 font-medium">{report.voorzieningNaam}</td>
                      <td className="p-2">{report.voorzieningType}</td>
                      <td className="p-2">{report.locatie}</td>
                      <td className="p-2">{report.inspecteur}</td>
                      <td className="p-2">{new Date(report.inspectiedatum).toLocaleDateString("nl-NL")}</td>
                      <td className="p-2">
                        <Badge className={`${statusConfig[report.status].color} text-white`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusConfig[report.status].label}
                        </Badge>
                      </td>
                      <td className="p-2">
                        <span
                          className={`${isExpired ? "text-red-600 font-semibold" : isExpiringSoon ? "text-yellow-600 font-semibold" : ""}`}
                        >
                          {new Date(report.vervaldatum).toLocaleDateString("nl-NL")}
                        </span>
                      </td>
                      <td className="p-2">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => handleViewReport(report)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDownloadPDF(report.id)}>
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* View Report Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Inspectie Rapport Details</DialogTitle>
            <DialogDescription>Volledige details van het inspectie rapport</DialogDescription>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Voorziening</Label>
                  <p className="font-semibold">{selectedReport.voorzieningNaam}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Type</Label>
                  <p>{selectedReport.voorzieningType}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Locatie</Label>
                  <p>{selectedReport.locatie}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                  <div className="mt-1">
                    <Badge className={`${statusConfig[selectedReport.status].color} text-white`}>
                      {statusConfig[selectedReport.status].label}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Inspecteur</Label>
                  <p>{selectedReport.inspecteur}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Certificering</Label>
                  <p>{selectedReport.inspecteurCertificering}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Inspectiedatum</Label>
                  <p>{new Date(selectedReport.inspectiedatum).toLocaleDateString("nl-NL")}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Vervaldatum</Label>
                  <p>{new Date(selectedReport.vervaldatum).toLocaleDateString("nl-NL")}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">Bevindingen</Label>
                <p className="mt-1 p-3 bg-muted rounded-md">{selectedReport.bevindingen}</p>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">Aanbevelingen</Label>
                <p className="mt-1 p-3 bg-muted rounded-md">{selectedReport.aanbevelingen}</p>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">Volgende Inspectie</Label>
                <p>{new Date(selectedReport.volgendeInspectie).toLocaleDateString("nl-NL")}</p>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => handleDownloadPDF(selectedReport.id)}>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button onClick={() => setIsViewDialogOpen(false)}>Sluiten</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
