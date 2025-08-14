"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { nl } from "date-fns/locale"
import { CalendarIcon, ChevronLeft, FileText, Filter, Printer } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { RapportageGrafiek } from "@/components/rapportage-grafiek"
import { RapportageStatistieken } from "@/components/rapportage-statistieken"

export default function RapportagePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("incidenten")
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().getFullYear(), 0, 1), // Start of current year
    to: new Date(),
  })
  const [fromDate, setFromDate] = useState<Date | undefined>(dateRange.from)
  const [toDate, setToDate] = useState<Date | undefined>(dateRange.to)
  const [filterOpen, setFilterOpen] = useState(false)
  const [filters, setFilters] = useState({
    locatie: "alle",
    type: "alle",
    status: "alle",
  })

  // Dummy data voor incidenten
  const incidenten = [
    {
      id: 1,
      datum: "2023-03-15",
      tijd: "14:30",
      type: "Brandmelding",
      locatie: "Verdieping 3, west",
      beschrijving: "Rookontwikkeling in serverruimte",
      status: "Afgehandeld",
      bhvInzet: 4,
      evacuatie: true,
      hulpdiensten: true,
    },
    {
      id: 2,
      datum: "2023-05-22",
      tijd: "10:15",
      type: "EHBO",
      locatie: "Verdieping 1, Zuid west",
      beschrijving: "Medewerker onwel geworden",
      status: "Afgehandeld",
      bhvInzet: 2,
      evacuatie: false,
      hulpdiensten: false,
    },
    {
      id: 3,
      datum: "2023-07-08",
      tijd: "09:45",
      type: "Ontruiming",
      locatie: "Gehele gebouw",
      beschrijving: "Geplande ontruimingsoefening",
      status: "Afgehandeld",
      bhvInzet: 12,
      evacuatie: true,
      hulpdiensten: false,
    },
    {
      id: 4,
      datum: "2023-09-30",
      tijd: "16:20",
      type: "Technisch",
      locatie: "Verdieping -1, fitness",
      beschrijving: "Waterlekkage in technische ruimte",
      status: "Afgehandeld",
      bhvInzet: 3,
      evacuatie: false,
      hulpdiensten: false,
    },
    {
      id: 5,
      datum: "2023-11-14",
      tijd: "11:05",
      type: "AED inzet",
      locatie: "Begane grond, Receptie",
      beschrijving: "Bezoeker met hartklachten",
      status: "Afgehandeld",
      bhvInzet: 3,
      evacuatie: false,
      hulpdiensten: true,
    },
    {
      id: 6,
      datum: "2024-01-25",
      tijd: "08:30",
      type: "Brandmelding",
      locatie: "Verdieping 5, oost",
      beschrijving: "Brandalarm geactiveerd door stoomvorming",
      status: "Afgehandeld",
      bhvInzet: 5,
      evacuatie: true,
      hulpdiensten: true,
    },
    {
      id: 7,
      datum: "2024-02-18",
      tijd: "13:40",
      type: "EHBO",
      locatie: "Verdieping 2, west",
      beschrijving: "Snijwond tijdens werkzaamheden",
      status: "Afgehandeld",
      bhvInzet: 1,
      evacuatie: false,
      hulpdiensten: false,
    },
  ]

  // Dummy data voor oefeningen
  const oefeningen = [
    {
      id: 1,
      datum: "2023-04-12",
      tijd: "14:00",
      type: "Ontruimingsoefening",
      locatie: "Gehele gebouw",
      deelnemers: 245,
      bhvInzet: 15,
      duur: 18,
      evaluatie: "Goed verlopen, aandachtspunten bij communicatie",
      status: "Afgerond",
    },
    {
      id: 2,
      datum: "2023-06-30",
      tijd: "10:30",
      type: "Table-top oefening",
      locatie: "Vergaderzaal 3.12",
      deelnemers: 8,
      bhvInzet: 8,
      duur: 120,
      evaluatie: "Scenario's doorlopen, verbeterpunten geïdentificeerd",
      status: "Afgerond",
    },
    {
      id: 3,
      datum: "2023-09-15",
      tijd: "09:00",
      type: "BHV training",
      locatie: "Trainingsruimte BG",
      deelnemers: 12,
      bhvInzet: 12,
      duur: 240,
      evaluatie: "Jaarlijkse herhalingstraining succesvol afgerond",
      status: "Afgerond",
    },
    {
      id: 4,
      datum: "2023-11-28",
      tijd: "15:30",
      type: "AED training",
      locatie: "EHBO ruimte -1",
      deelnemers: 6,
      bhvInzet: 6,
      duur: 90,
      evaluatie: "Praktische vaardigheden verbeterd",
      status: "Afgerond",
    },
    {
      id: 5,
      datum: "2024-01-17",
      tijd: "13:00",
      type: "Ontruimingsoefening",
      locatie: "Verdiepingen 1-5",
      deelnemers: 120,
      bhvInzet: 10,
      duur: 22,
      evaluatie: "Gedeeltelijke ontruiming, goede doorstroming",
      status: "Afgerond",
    },
  ]

  // Dummy data voor apparatuur inspecties
  const inspecties = [
    {
      id: 1,
      datum: "2023-02-15",
      type: "Jaarlijkse keuring",
      apparatuur: "Brandblussers",
      aantal: 45,
      inspecteur: "Firma Brandveilig BV",
      resultaat: "42 goedgekeurd, 3 afgekeurd",
      opmerkingen: "Afgekeurde blussers vervangen",
      status: "Afgerond",
    },
    {
      id: 2,
      datum: "2023-04-20",
      type: "Kwartaalcontrole",
      apparatuur: "EHBO-koffers",
      aantal: 12,
      inspecteur: "Intern - Jan Jansen",
      resultaat: "Alle goedgekeurd, 4 aangevuld",
      opmerkingen: "Pleisters en desinfectiemiddel aangevuld",
      status: "Afgerond",
    },
    {
      id: 3,
      datum: "2023-06-10",
      type: "Jaarlijkse keuring",
      apparatuur: "AED's",
      aantal: 5,
      inspecteur: "Firma MediTech",
      resultaat: "Alle goedgekeurd",
      opmerkingen: "Batterijen en elektroden vervangen",
      status: "Afgerond",
    },
    {
      id: 4,
      datum: "2023-08-05",
      type: "Kwartaalcontrole",
      apparatuur: "Evacuatiestoelen",
      aantal: 3,
      inspecteur: "Intern - Petra de Vries",
      resultaat: "Alle goedgekeurd",
      opmerkingen: "Geen bijzonderheden",
      status: "Afgerond",
    },
    {
      id: 5,
      datum: "2023-10-12",
      type: "Kwartaalcontrole",
      apparatuur: "EHBO-koffers",
      aantal: 12,
      inspecteur: "Intern - Mohammed El Amrani",
      resultaat: "Alle goedgekeurd, 2 aangevuld",
      opmerkingen: "Handschoenen en verbandmiddelen aangevuld",
      status: "Afgerond",
    },
    {
      id: 6,
      datum: "2023-12-08",
      type: "Halfjaarlijkse keuring",
      apparatuur: "Brandslangen",
      aantal: 24,
      inspecteur: "Firma Brandveilig BV",
      resultaat: "23 goedgekeurd, 1 afgekeurd",
      opmerkingen: "Slang op verdieping 4 west vervangen",
      status: "Afgerond",
    },
    {
      id: 7,
      datum: "2024-01-25",
      type: "Kwartaalcontrole",
      apparatuur: "EHBO-koffers",
      aantal: 12,
      inspecteur: "Intern - Jan Jansen",
      resultaat: "Alle goedgekeurd, 5 aangevuld",
      opmerkingen: "Algemene aanvulling na inventarisatie",
      status: "Afgerond",
    },
  ]

  // Filter data based on date range and other filters
  const filterData = (data) => {
    return data.filter((item) => {
      const itemDate = new Date(item.datum)
      const fromDateObj = fromDate || new Date(0)
      const toDateObj = toDate || new Date()

      const dateInRange = itemDate >= fromDateObj && itemDate <= toDateObj

      const locationMatch =
        filters.locatie === "alle" ||
        (item.locatie && item.locatie.toLowerCase().includes(filters.locatie.toLowerCase()))

      const typeMatch = filters.type === "alle" || (item.type && item.type.toLowerCase() === filters.type.toLowerCase())

      const statusMatch =
        filters.status === "alle" || (item.status && item.status.toLowerCase() === filters.status.toLowerCase())

      return dateInRange && locationMatch && typeMatch && statusMatch
    })
  }

  const filteredIncidenten = filterData(incidenten)
  const filteredOefeningen = filterData(oefeningen)
  const filteredInspecties = filterData(inspecties)

  const handleExport = (format) => {
    alert(`Rapport wordt geëxporteerd als ${format}...`)
    // In een echte applicatie zou hier de export logica komen
  }

  return (
    <main className="container mx-auto p-4">
      <div className="mb-4 flex items-center">
        <Button variant="outline" size="sm" onClick={() => router.push("/beheer")}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Terug naar beheer
        </Button>
        <div className="ml-4">
          <h1 className="text-2xl font-bold">BHV Rapportages</h1>
          <p className="text-muted-foreground">Provinciehuis Noord-Brabant</p>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="date-range" className="whitespace-nowrap">
              Periode:
            </Label>
            <div className="grid gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button id="date-range" variant={"outline"} className="w-[300px] justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {fromDate ? (
                      toDate ? (
                        <>
                          {format(fromDate, "d MMMM yyyy", { locale: nl })} -{" "}
                          {format(toDate, "d MMMM yyyy", { locale: nl })}
                        </>
                      ) : (
                        format(fromDate, "d MMMM yyyy", { locale: nl })
                      )
                    ) : (
                      <span>Selecteer een periode</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={fromDate}
                    selected={{
                      from: fromDate,
                      to: toDate,
                    }}
                    onSelect={(range) => {
                      setFromDate(range?.from)
                      setToDate(range?.to)
                    }}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <Button variant="outline" size="sm" onClick={() => setFilterOpen(!filterOpen)}>
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" />
            Afdrukken
          </Button>
          <Select onValueChange={(value) => handleExport(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Exporteren als..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">
                <div className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  PDF
                </div>
              </SelectItem>
              <SelectItem value="excel">
                <div className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  Excel
                </div>
              </SelectItem>
              <SelectItem value="csv">
                <div className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  CSV
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filterOpen && (
        <Card className="mb-4">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="filter-locatie">Locatie</Label>
                <Select value={filters.locatie} onValueChange={(value) => setFilters({ ...filters, locatie: value })}>
                  <SelectTrigger id="filter-locatie">
                    <SelectValue placeholder="Alle locaties" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alle">Alle locaties</SelectItem>
                    <SelectItem value="verdieping -2">Verdieping -2</SelectItem>
                    <SelectItem value="verdieping -1">Verdieping -1</SelectItem>
                    <SelectItem value="begane grond">Begane grond</SelectItem>
                    <SelectItem value="verdieping 1">Verdieping 1</SelectItem>
                    <SelectItem value="verdieping 2">Verdieping 2</SelectItem>
                    <SelectItem value="verdieping 3">Verdieping 3</SelectItem>
                    <SelectItem value="verdieping 4">Verdieping 4</SelectItem>
                    <SelectItem value="verdieping 5">Verdieping 5</SelectItem>
                    <SelectItem value="verdieping 6">Verdieping 6</SelectItem>
                    <SelectItem value="verdieping 7">Verdieping 7</SelectItem>
                    <SelectItem value="verdieping 8">Verdieping 8</SelectItem>
                    <SelectItem value="verdieping 9">Verdieping 9</SelectItem>
                    <SelectItem value="verdieping 10">Verdieping 10</SelectItem>
                    <SelectItem value="verdieping 11">Verdieping 11</SelectItem>
                    <SelectItem value="verdieping 12">Verdieping 12</SelectItem>
                    <SelectItem value="verdieping 13">Verdieping 13</SelectItem>
                    <SelectItem value="verdieping 14">Verdieping 14</SelectItem>
                    <SelectItem value="verdieping 15">Verdieping 15</SelectItem>
                    <SelectItem value="verdieping 16">Verdieping 16</SelectItem>
                    <SelectItem value="verdieping 17">Verdieping 17</SelectItem>
                    <SelectItem value="verdieping 18">Verdieping 18</SelectItem>
                    <SelectItem value="verdieping 19">Verdieping 19</SelectItem>
                    <SelectItem value="verdieping 20">Verdieping 20</SelectItem>
                    <SelectItem value="verdieping 21">Verdieping 21</SelectItem>
                    <SelectItem value="verdieping 22">Verdieping 22</SelectItem>
                    <SelectItem value="verdieping 23">Verdieping 23</SelectItem>
                    <SelectItem value="verdieping 24">Verdieping 24</SelectItem>
                    <SelectItem value="gehele gebouw">Gehele gebouw</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="filter-type">Type</Label>
                <Select value={filters.type} onValueChange={(value) => setFilters({ ...filters, type: value })}>
                  <SelectTrigger id="filter-type">
                    <SelectValue placeholder="Alle types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alle">Alle types</SelectItem>
                    <SelectItem value="brandmelding">Brandmelding</SelectItem>
                    <SelectItem value="ehbo">EHBO</SelectItem>
                    <SelectItem value="ontruiming">Ontruiming</SelectItem>
                    <SelectItem value="aed inzet">AED inzet</SelectItem>
                    <SelectItem value="technisch">Technisch</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="filter-status">Status</Label>
                <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                  <SelectTrigger id="filter-status">
                    <SelectValue placeholder="Alle statussen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alle">Alle statussen</SelectItem>
                    <SelectItem value="afgehandeld">Afgehandeld</SelectItem>
                    <SelectItem value="in behandeling">In behandeling</SelectItem>
                    <SelectItem value="afgerond">Afgerond</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="incidenten">Incidenten</TabsTrigger>
          <TabsTrigger value="oefeningen">Oefeningen</TabsTrigger>
          <TabsTrigger value="inspecties">Apparatuur Inspecties</TabsTrigger>
        </TabsList>

        <TabsContent value="incidenten">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Incidenten Overzicht</CardTitle>
                <CardDescription>Overzicht van alle BHV incidenten in de geselecteerde periode</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Datum</TableHead>
                      <TableHead>Tijd</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Locatie</TableHead>
                      <TableHead>BHV Inzet</TableHead>
                      <TableHead>Evacuatie</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredIncidenten.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center">
                          Geen incidenten gevonden in de geselecteerde periode
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredIncidenten.map((incident) => (
                        <TableRow key={incident.id}>
                          <TableCell>{format(new Date(incident.datum), "dd-MM-yyyy")}</TableCell>
                          <TableCell>{incident.tijd}</TableCell>
                          <TableCell>{incident.type}</TableCell>
                          <TableCell>{incident.locatie}</TableCell>
                          <TableCell>{incident.bhvInzet} personen</TableCell>
                          <TableCell>{incident.evacuatie ? "Ja" : "Nee"}</TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                incident.status === "Afgehandeld"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-orange-100 text-orange-800"
                              }`}
                            >
                              {incident.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Statistieken</CardTitle>
                  <CardDescription>Samenvatting van incidenten in de geselecteerde periode</CardDescription>
                </CardHeader>
                <CardContent>
                  <RapportageStatistieken data={filteredIncidenten} type="incidenten" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Incidenten per Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <RapportageGrafiek data={filteredIncidenten} type="incidenten" />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="oefeningen">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Oefeningen Overzicht</CardTitle>
                <CardDescription>Overzicht van alle BHV oefeningen in de geselecteerde periode</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Datum</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Locatie</TableHead>
                      <TableHead>Deelnemers</TableHead>
                      <TableHead>BHV Inzet</TableHead>
                      <TableHead>Duur (min)</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOefeningen.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center">
                          Geen oefeningen gevonden in de geselecteerde periode
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredOefeningen.map((oefening) => (
                        <TableRow key={oefening.id}>
                          <TableCell>{format(new Date(oefening.datum), "dd-MM-yyyy")}</TableCell>
                          <TableCell>{oefening.type}</TableCell>
                          <TableCell>{oefening.locatie}</TableCell>
                          <TableCell>{oefening.deelnemers}</TableCell>
                          <TableCell>{oefening.bhvInzet} personen</TableCell>
                          <TableCell>{oefening.duur} min</TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                oefening.status === "Afgerond"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-orange-100 text-orange-800"
                              }`}
                            >
                              {oefening.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Statistieken</CardTitle>
                  <CardDescription>Samenvatting van oefeningen in de geselecteerde periode</CardDescription>
                </CardHeader>
                <CardContent>
                  <RapportageStatistieken data={filteredOefeningen} type="oefeningen" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Oefeningen per Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <RapportageGrafiek data={filteredOefeningen} type="oefeningen" />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="inspecties">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Apparatuur Inspecties</CardTitle>
                <CardDescription>
                  Overzicht van alle BHV apparatuur inspecties in de geselecteerde periode
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Datum</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Apparatuur</TableHead>
                      <TableHead>Aantal</TableHead>
                      <TableHead>Inspecteur</TableHead>
                      <TableHead>Resultaat</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInspecties.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center">
                          Geen inspecties gevonden in de geselecteerde periode
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredInspecties.map((inspectie) => (
                        <TableRow key={inspectie.id}>
                          <TableCell>{format(new Date(inspectie.datum), "dd-MM-yyyy")}</TableCell>
                          <TableCell>{inspectie.type}</TableCell>
                          <TableCell>{inspectie.apparatuur}</TableCell>
                          <TableCell>{inspectie.aantal}</TableCell>
                          <TableCell>{inspectie.inspecteur}</TableCell>
                          <TableCell>{inspectie.resultaat}</TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                inspectie.status === "Afgerond"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-orange-100 text-orange-800"
                              }`}
                            >
                              {inspectie.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Statistieken</CardTitle>
                  <CardDescription>Samenvatting van inspecties in de geselecteerde periode</CardDescription>
                </CardHeader>
                <CardContent>
                  <RapportageStatistieken data={filteredInspecties} type="inspecties" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Inspecties per Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <RapportageGrafiek data={filteredInspecties} type="inspecties" />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  )
}
