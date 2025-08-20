"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ChevronLeft,
  Phone,
  Plus,
  Trash2,
  Edit,
  Save,
  Shield,
  AlertCircle,
  Check,
  X,
  Search,
  Download,
  Upload,
  Smartphone,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"

export default function AutorisatiesPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("telefoonnummers")
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [currentContact, setCurrentContact] = useState({
    id: 0,
    naam: "",
    functie: "",
    afdeling: "",
    telefoonnummer: "",
    email: "",
    type: "bhv",
    mindervalide: false,
    autorisaties: {
      scannen: true,
      meldingen: true,
      beheer: false,
    },
    status: "actief",
  })

  // Dummy data voor contacten
  const [contacten, setContacten] = useState([
    {
      id: 1,
      naam: "Jan Jansen",
      functie: "BHV Ploegleider",
      afdeling: "Facilitair",
      telefoonnummer: "06-12345678",
      email: "j.jansen@provincie-nb.nl",
      type: "ploegleider",
      mindervalide: false,
      autorisaties: {
        scannen: true,
        meldingen: true,
        beheer: true,
      },
      status: "actief",
    },
    {
      id: 2,
      naam: "Petra de Vries",
      functie: "BHV-er",
      afdeling: "HR",
      telefoonnummer: "06-23456789",
      email: "p.devries@provincie-nb.nl",
      type: "bhv",
      mindervalide: false,
      autorisaties: {
        scannen: true,
        meldingen: true,
        beheer: false,
      },
      status: "actief",
    },
    {
      id: 3,
      naam: "Mohammed El Amrani",
      functie: "EHBO-er",
      afdeling: "ICT",
      telefoonnummer: "06-34567890",
      email: "m.elamrani@provincie-nb.nl",
      type: "bhv",
      mindervalide: false,
      autorisaties: {
        scannen: true,
        meldingen: true,
        beheer: false,
      },
      status: "actief",
    },
    {
      id: 4,
      naam: "Sophie Bakker",
      functie: "Gebouwbeheerder",
      afdeling: "Facilitair",
      telefoonnummer: "06-45678901",
      email: "s.bakker@provincie-nb.nl",
      type: "beheerder",
      mindervalide: false,
      autorisaties: {
        scannen: true,
        meldingen: true,
        beheer: true,
      },
      status: "actief",
    },
    {
      id: 5,
      naam: "Willem van Dijk",
      functie: "Medewerker",
      afdeling: "Financiën",
      telefoonnummer: "06-56789012",
      email: "w.vandijk@provincie-nb.nl",
      type: "mindervalide",
      mindervalide: true,
      autorisaties: {
        scannen: false,
        meldingen: false,
        beheer: false,
      },
      status: "actief",
    },
    {
      id: 6,
      naam: "Laura Janssen",
      functie: "BHV-er",
      afdeling: "Communicatie",
      telefoonnummer: "06-67890123",
      email: "l.janssen@provincie-nb.nl",
      type: "bhv",
      mindervalide: false,
      autorisaties: {
        scannen: true,
        meldingen: true,
        beheer: false,
      },
      status: "actief",
    },
  ])

  // Dummy data voor meldingen
  const [meldingen, setMeldingen] = useState([
    {
      id: 1,
      tijdstip: "2024-02-15 09:45",
      contactNaam: "Jan Jansen",
      telefoonnummer: "06-12345678",
      tagNaam: "Checkpoint Verdieping 1 West",
      type: "Controle",
      bericht: "Controle uitgevoerd, geen bijzonderheden",
      status: "Verwerkt",
    },
    {
      id: 2,
      tijdstip: "2024-02-14 14:30",
      contactNaam: "Petra de Vries",
      telefoonnummer: "06-23456789",
      tagNaam: "EHBO-koffer Verdieping 2 Oost",
      type: "Melding",
      bericht: "EHBO-koffer moet aangevuld worden",
      status: "In behandeling",
    },
    {
      id: 3,
      tijdstip: "2024-02-13 11:20",
      contactNaam: "Mohammed El Amrani",
      telefoonnummer: "06-34567890",
      tagNaam: "Brandblusser Verdieping 3 Noord",
      type: "Inspectie",
      bericht: "Brandblusser gecontroleerd, druk is goed",
      status: "Verwerkt",
    },
    {
      id: 4,
      tijdstip: "2024-02-12 16:15",
      contactNaam: "Sophie Bakker",
      telefoonnummer: "06-45678901",
      tagNaam: "Nooduitgang Verdieping 5 Zuid",
      type: "Alarm",
      bericht: "Nooduitgang geblokkeerd door opgeslagen materialen",
      status: "Urgent",
    },
    {
      id: 5,
      tijdstip: "2024-02-10 08:50",
      contactNaam: "Laura Janssen",
      telefoonnummer: "06-67890123",
      tagNaam: "Verzamelplaats Begane Grond",
      type: "Oefening",
      bericht: "Ontruimingsoefening gestart",
      status: "Verwerkt",
    },
  ])

  const filteredContacten = contacten.filter(
    (contact) =>
      contact.naam.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.functie.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.telefoonnummer.includes(searchTerm) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddContact = () => {
    setCurrentContact({
      id: 0,
      naam: "",
      functie: "",
      afdeling: "",
      telefoonnummer: "",
      email: "",
      type: "bhv",
      mindervalide: false,
      autorisaties: {
        scannen: true,
        meldingen: true,
        beheer: false,
      },
      status: "actief",
    })
    setShowForm(true)
  }

  const handleEditContact = (contact) => {
    setCurrentContact(contact)
    setShowForm(true)
  }

  const handleDeleteContact = (id) => {
    setContacten(contacten.filter((contact) => contact.id !== id))
  }

  const handleSaveContact = () => {
    if (currentContact.id === 0) {
      // Add new contact
      const newContact = {
        ...currentContact,
        id: contacten.length + 1,
      }
      setContacten([...contacten, newContact])
    } else {
      // Update existing contact
      setContacten(contacten.map((contact) => (contact.id === currentContact.id ? currentContact : contact)))
    }
    setShowForm(false)
  }

  const handleImport = () => {
    alert("Importeren van contacten uit CSV of Excel bestand")
    // In een echte applicatie zou hier de import functionaliteit komen
  }

  const handleExport = () => {
    alert("Exporteren van contacten naar CSV of Excel bestand")
    // In een echte applicatie zou hier de export functionaliteit komen
  }

  const getTypeLabel = (type) => {
    switch (type) {
      case "bhv":
        return "BHV-er"
      case "ploegleider":
        return "Ploegleider"
      case "beheerder":
        return "Beheerder"
      case "mindervalide":
        return "Mindervalide"
      default:
        return type
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case "bhv":
        return "bg-green-100 text-green-800"
      case "ploegleider":
        return "bg-blue-100 text-blue-800"
      case "beheerder":
        return "bg-purple-100 text-purple-800"
      case "mindervalide":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getMeldingStatusColor = (status) => {
    switch (status) {
      case "Verwerkt":
        return "bg-green-100 text-green-800"
      case "In behandeling":
        return "bg-blue-100 text-blue-800"
      case "Urgent":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <main className="container mx-auto p-4">
      <div className="mb-4 flex items-center">
        <Button variant="outline" size="sm" onClick={() => router.push("/beheer")}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Terug naar beheer
        </Button>
        <div className="ml-4">
          <h1 className="text-2xl font-bold">Autorisaties & Telefoonnummers</h1>
          <p className="text-muted-foreground">Provinciehuis Noord-Brabant</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="telefoonnummers">
            <Phone className="mr-2 h-4 w-4" />
            Telefoonnummers
          </TabsTrigger>
          <TabsTrigger value="meldingen">
            <AlertCircle className="mr-2 h-4 w-4" />
            Meldingen
          </TabsTrigger>
        </TabsList>

        <TabsContent value="telefoonnummers">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Geautoriseerde Telefoonnummers</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleImport}>
                    <Upload className="mr-2 h-4 w-4" />
                    Importeren
                  </Button>
                  <Button variant="outline" onClick={handleExport}>
                    <Download className="mr-2 h-4 w-4" />
                    Exporteren
                  </Button>
                  <Button onClick={handleAddContact}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nieuw Contact
                  </Button>
                </div>
              </div>
              <CardDescription>
                Beheer telefoonnummers van BHV'ers, beheerders, ploegleiders en mindervalide medewerkers
              </CardDescription>

              {!showForm && (
                <div className="relative mt-2">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Zoek op naam, functie of telefoonnummer..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              )}
            </CardHeader>
            <CardContent>
              {showForm ? (
                <div className="space-y-4 rounded-md border p-4">
                  <h3 className="text-lg font-medium">
                    {currentContact.id === 0 ? "Nieuw Contact" : "Bewerk Contact"}
                  </h3>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="naam">Naam</Label>
                      <Input
                        id="naam"
                        value={currentContact.naam}
                        onChange={(e) => setCurrentContact({ ...currentContact, naam: e.target.value })}
                        placeholder="Volledige naam"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="functie">Functie</Label>
                      <Input
                        id="functie"
                        value={currentContact.functie}
                        onChange={(e) => setCurrentContact({ ...currentContact, functie: e.target.value })}
                        placeholder="Bijv. BHV-er, EHBO-er"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="afdeling">Afdeling</Label>
                      <Input
                        id="afdeling"
                        value={currentContact.afdeling}
                        onChange={(e) => setCurrentContact({ ...currentContact, afdeling: e.target.value })}
                        placeholder="Bijv. Facilitair, HR"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="telefoonnummer">Telefoonnummer</Label>
                      <Input
                        id="telefoonnummer"
                        value={currentContact.telefoonnummer}
                        onChange={(e) => setCurrentContact({ ...currentContact, telefoonnummer: e.target.value })}
                        placeholder="Bijv. 06-12345678"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={currentContact.email}
                        onChange={(e) => setCurrentContact({ ...currentContact, email: e.target.value })}
                        placeholder="Bijv. naam@provincie-nb.nl"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="type">Type</Label>
                      <Select
                        value={currentContact.type}
                        onValueChange={(value) => setCurrentContact({ ...currentContact, type: value })}
                      >
                        <SelectTrigger id="type">
                          <SelectValue placeholder="Selecteer type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bhv">BHV-er</SelectItem>
                          <SelectItem value="ploegleider">Ploegleider</SelectItem>
                          <SelectItem value="beheerder">Beheerder</SelectItem>
                          <SelectItem value="mindervalide">Mindervalide</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={currentContact.status}
                        onValueChange={(value) => setCurrentContact({ ...currentContact, status: value })}
                      >
                        <SelectTrigger id="status">
                          <SelectValue placeholder="Selecteer status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="actief">Actief</SelectItem>
                          <SelectItem value="inactief">Inactief</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="col-span-2 space-y-4">
                      <h4 className="font-medium">Autorisaties</h4>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="scannen"
                            checked={currentContact.autorisaties.scannen}
                            onCheckedChange={(checked) =>
                              setCurrentContact({
                                ...currentContact,
                                autorisaties: { ...currentContact.autorisaties, scannen: checked },
                              })
                            }
                          />
                          <Label htmlFor="scannen">NFC Tags scannen</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch
                            id="meldingen"
                            checked={currentContact.autorisaties.meldingen}
                            onCheckedChange={(checked) =>
                              setCurrentContact({
                                ...currentContact,
                                autorisaties: { ...currentContact.autorisaties, meldingen: checked },
                              })
                            }
                          />
                          <Label htmlFor="meldingen">Meldingen versturen</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch
                            id="beheer"
                            checked={currentContact.autorisaties.beheer}
                            onCheckedChange={(checked) =>
                              setCurrentContact({
                                ...currentContact,
                                autorisaties: { ...currentContact.autorisaties, beheer: checked },
                              })
                            }
                          />
                          <Label htmlFor="beheer">Beheerderstoegang</Label>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-2 flex items-center space-x-2">
                      <Switch
                        id="mindervalide"
                        checked={currentContact.mindervalide}
                        onCheckedChange={(checked) =>
                          setCurrentContact({
                            ...currentContact,
                            mindervalide: checked,
                          })
                        }
                      />
                      <Label htmlFor="mindervalide">Mindervalide medewerker</Label>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowForm(false)}>
                      Annuleren
                    </Button>
                    <Button onClick={handleSaveContact}>
                      <Save className="mr-2 h-4 w-4" />
                      Opslaan
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <Alert className="mb-4">
                    <Shield className="h-4 w-4" />
                    <AlertTitle>Geautoriseerde telefoonnummers</AlertTitle>
                    <AlertDescription>
                      Alleen geautoriseerde telefoonnummers kunnen NFC tags scannen en meldingen doorsturen. Zorg ervoor
                      dat alle BHV'ers, beheerders en ploegleiders zijn geregistreerd.
                    </AlertDescription>
                  </Alert>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Naam</TableHead>
                        <TableHead>Functie</TableHead>
                        <TableHead>Telefoonnummer</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Autorisaties</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Acties</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredContacten.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center">
                            Geen contacten gevonden
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredContacten.map((contact) => (
                          <TableRow key={contact.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{contact.naam}</div>
                                <div className="text-xs text-muted-foreground">{contact.email}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <div>{contact.functie}</div>
                                <div className="text-xs text-muted-foreground">{contact.afdeling}</div>
                              </div>
                            </TableCell>
                            <TableCell>{contact.telefoonnummer}</TableCell>
                            <TableCell>
                              <Badge className={getTypeColor(contact.type)}>{getTypeLabel(contact.type)}</Badge>
                              {contact.mindervalide && (
                                <Badge className="ml-1 bg-orange-100 text-orange-800">Mindervalide</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-1">
                                {contact.autorisaties.scannen && (
                                  <Badge variant="outline" className="border-green-200 text-green-800">
                                    <Smartphone className="mr-1 h-3 w-3" />
                                    Scannen
                                  </Badge>
                                )}
                                {contact.autorisaties.meldingen && (
                                  <Badge variant="outline" className="border-blue-200 text-blue-800">
                                    <AlertCircle className="mr-1 h-3 w-3" />
                                    Meldingen
                                  </Badge>
                                )}
                                {contact.autorisaties.beheer && (
                                  <Badge variant="outline" className="border-purple-200 text-purple-800">
                                    <Shield className="mr-1 h-3 w-3" />
                                    Beheer
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  contact.status === "actief"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }
                              >
                                {contact.status === "actief" ? (
                                  <>
                                    <Check className="mr-1 h-3 w-3" /> Actief
                                  </>
                                ) : (
                                  <>
                                    <X className="mr-1 h-3 w-3" /> Inactief
                                  </>
                                )}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" onClick={() => handleEditContact(contact)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteContact(contact.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="meldingen">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Ontvangen Meldingen</CardTitle>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Exporteren
                </Button>
              </div>
              <CardDescription>Overzicht van alle meldingen die zijn verstuurd via NFC tags</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tijdstip</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Tag</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Bericht</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {meldingen.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        Geen meldingen gevonden
                      </TableCell>
                    </TableRow>
                  ) : (
                    meldingen.map((melding) => (
                      <TableRow key={melding.id}>
                        <TableCell>{melding.tijdstip}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{melding.contactNaam}</div>
                            <div className="text-xs text-muted-foreground">{melding.telefoonnummer}</div>
                          </div>
                        </TableCell>
                        <TableCell>{melding.tagNaam}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              melding.type === "Alarm"
                                ? "bg-red-100 text-red-800"
                                : melding.type === "Melding"
                                  ? "bg-orange-100 text-orange-800"
                                  : melding.type === "Controle"
                                    ? "bg-green-100 text-green-800"
                                    : melding.type === "Inspectie"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-purple-100 text-purple-800"
                            }
                          >
                            {melding.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{melding.bericht}</TableCell>
                        <TableCell>
                          <Badge className={getMeldingStatusColor(melding.status)}>{melding.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}
