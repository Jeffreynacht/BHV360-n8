"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Smartphone, Tag, Plus, Trash2, Edit, Save, QrCode, Download, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function NFCTagsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("tags")
  const [showForm, setShowForm] = useState(false)
  const [scanningMode, setScanningMode] = useState(false)
  const [currentTag, setCurrentTag] = useState({
    id: 0,
    tagId: "",
    naam: "",
    verdieping: "",
    locatie: "",
    type: "checkpoint",
    laatstGescand: "",
    status: "actief",
  })

  // Dummy data voor NFC tags
  const [tags, setTags] = useState([
    {
      id: 1,
      tagId: "04:A2:E9:B2:5C:1F",
      naam: "Checkpoint Verdieping 1 West",
      verdieping: "Verdieping 1",
      locatie: "West",
      type: "checkpoint",
      laatstGescand: "2024-02-15 09:45",
      status: "actief",
    },
    {
      id: 2,
      tagId: "04:B3:F1:C4:7D:2E",
      naam: "EHBO-koffer Verdieping 2 Oost",
      verdieping: "Verdieping 2",
      locatie: "Oost",
      type: "apparatuur",
      laatstGescand: "2024-02-10 14:30",
      status: "actief",
    },
    {
      id: 3,
      tagId: "04:D5:E7:F8:9A:3B",
      naam: "Verzamelplaats Begane Grond",
      verdieping: "Begane grond",
      locatie: "Hoofdingang",
      type: "verzamelplaats",
      laatstGescand: "2024-02-18 11:20",
      status: "actief",
    },
    {
      id: 4,
      tagId: "04:C6:D7:E8:9F:4A",
      naam: "Brandblusser Verdieping 3 Noord",
      verdieping: "Verdieping 3",
      locatie: "Noord",
      type: "apparatuur",
      laatstGescand: "2024-02-05 16:15",
      status: "actief",
    },
    {
      id: 5,
      tagId: "04:E8:F9:A1:B2:5C",
      naam: "Nooduitgang Verdieping 5 Zuid",
      verdieping: "Verdieping 5",
      locatie: "Zuid",
      type: "nooduitgang",
      laatstGescand: "2024-02-12 08:50",
      status: "actief",
    },
  ])

  // Dummy data voor scan geschiedenis
  const [scanHistory, setScanHistory] = useState([
    {
      id: 1,
      tagId: "04:A2:E9:B2:5C:1F",
      tagNaam: "Checkpoint Verdieping 1 West",
      gebruiker: "Jan Jansen",
      tijdstip: "2024-02-15 09:45",
      actie: "Controle ronde",
    },
    {
      id: 2,
      tagId: "04:B3:F1:C4:7D:2E",
      tagNaam: "EHBO-koffer Verdieping 2 Oost",
      gebruiker: "Petra de Vries",
      tijdstip: "2024-02-10 14:30",
      actie: "Inspectie",
    },
    {
      id: 3,
      tagId: "04:D5:E7:F8:9A:3B",
      tagNaam: "Verzamelplaats Begane Grond",
      gebruiker: "Mohammed El Amrani",
      tijdstip: "2024-02-18 11:20",
      actie: "Ontruimingsoefening",
    },
    {
      id: 4,
      tagId: "04:C6:D7:E8:9F:4A",
      tagNaam: "Brandblusser Verdieping 3 Noord",
      gebruiker: "Sophie Bakker",
      tijdstip: "2024-02-05 16:15",
      actie: "Inspectie",
    },
    {
      id: 5,
      tagId: "04:A2:E9:B2:5C:1F",
      tagNaam: "Checkpoint Verdieping 1 West",
      gebruiker: "Willem van Dijk",
      tijdstip: "2024-02-14 13:25",
      actie: "Controle ronde",
    },
    {
      id: 6,
      tagId: "04:E8:F9:A1:B2:5C",
      tagNaam: "Nooduitgang Verdieping 5 Zuid",
      gebruiker: "Jan Jansen",
      tijdstip: "2024-02-12 08:50",
      actie: "Inspectie",
    },
  ])

  const handleAddTag = () => {
    setCurrentTag({
      id: 0,
      tagId: "",
      naam: "",
      verdieping: "",
      locatie: "",
      type: "checkpoint",
      laatstGescand: "",
      status: "actief",
    })
    setShowForm(true)
    setScanningMode(false)
  }

  const handleEditTag = (tag) => {
    setCurrentTag(tag)
    setShowForm(true)
    setScanningMode(false)
  }

  const handleDeleteTag = (id) => {
    setTags(tags.filter((tag) => tag.id !== id))
  }

  const handleSaveTag = () => {
    if (currentTag.id === 0) {
      // Add new tag
      const newTag = {
        ...currentTag,
        id: tags.length + 1,
        laatstGescand: "",
      }
      setTags([...tags, newTag])
    } else {
      // Update existing tag
      setTags(tags.map((tag) => (tag.id === currentTag.id ? currentTag : tag)))
    }
    setShowForm(false)
  }

  const startScanningMode = () => {
    setScanningMode(true)
    // In een echte applicatie zou hier de NFC scanning worden gestart
    setTimeout(() => {
      // Simuleer het vinden van een NFC tag na 3 seconden
      const mockTagId =
        "04:" +
        Math.random()
          .toString(16)
          .substring(2, 10)
          .toUpperCase()
          .match(/.{1,2}/g)
          .join(":")
      setCurrentTag({
        ...currentTag,
        tagId: mockTagId,
      })
      setScanningMode(false)
    }, 3000)
  }

  const generateQRCode = (tagId) => {
    alert(`QR-code wordt gegenereerd voor tag ${tagId}`)
    // In een echte applicatie zou hier de QR-code generatie plaatsvinden
  }

  return (
    <main className="container mx-auto p-4">
      <div className="mb-4 flex items-center">
        <Button variant="outline" size="sm" onClick={() => router.push("/beheer")}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Terug naar beheer
        </Button>
        <div className="ml-4">
          <h1 className="text-2xl font-bold">NFC Tags Beheer</h1>
          <p className="text-muted-foreground">Provinciehuis Noord-Brabant</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tags">
            <Tag className="mr-2 h-4 w-4" />
            NFC Tags
          </TabsTrigger>
          <TabsTrigger value="geschiedenis">
            <Smartphone className="mr-2 h-4 w-4" />
            Scan Geschiedenis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tags">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>NFC Tags</CardTitle>
                <Button onClick={handleAddTag}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nieuwe NFC Tag
                </Button>
              </div>
              <CardDescription>Beheer alle NFC tags en koppel ze aan verdiepingen en locaties</CardDescription>
            </CardHeader>
            <CardContent>
              {showForm ? (
                <div className="space-y-4 rounded-md border p-4">
                  <h3 className="text-lg font-medium">{currentTag.id === 0 ? "Nieuwe NFC Tag" : "Bewerk NFC Tag"}</h3>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="tagId">Tag ID</Label>
                      <div className="flex gap-2">
                        <Input
                          id="tagId"
                          value={currentTag.tagId}
                          onChange={(e) => setCurrentTag({ ...currentTag, tagId: e.target.value })}
                          placeholder="Scan tag of voer ID handmatig in"
                          disabled={scanningMode}
                          className="flex-1"
                        />
                        <Button
                          variant={scanningMode ? "default" : "outline"}
                          onClick={startScanningMode}
                          disabled={scanningMode}
                        >
                          {scanningMode ? (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                              Scannen...
                            </>
                          ) : (
                            <>
                              <Smartphone className="mr-2 h-4 w-4" />
                              Scan
                            </>
                          )}
                        </Button>
                      </div>
                      {scanningMode && (
                        <p className="text-xs text-muted-foreground">Houd uw apparaat dicht bij de NFC tag...</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="naam">Naam</Label>
                      <Input
                        id="naam"
                        value={currentTag.naam}
                        onChange={(e) => setCurrentTag({ ...currentTag, naam: e.target.value })}
                        placeholder="Bijv. Checkpoint Verdieping 1 West"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="verdieping">Verdieping</Label>
                      <Select
                        value={currentTag.verdieping}
                        onValueChange={(value) => setCurrentTag({ ...currentTag, verdieping: value })}
                      >
                        <SelectTrigger id="verdieping">
                          <SelectValue placeholder="Selecteer verdieping" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Kelderverdiepingen</SelectLabel>
                            <SelectItem value="Verdieping -2">Verdieping -2</SelectItem>
                            <SelectItem value="Verdieping -1">Verdieping -1</SelectItem>
                          </SelectGroup>
                          <SelectGroup>
                            <SelectLabel>Begane grond</SelectLabel>
                            <SelectItem value="Begane grond">Begane grond</SelectItem>
                          </SelectGroup>
                          <SelectGroup>
                            <SelectLabel>Lagere verdiepingen</SelectLabel>
                            <SelectItem value="Verdieping 1">Verdieping 1</SelectItem>
                            <SelectItem value="Verdieping 2">Verdieping 2</SelectItem>
                            <SelectItem value="Verdieping 3">Verdieping 3</SelectItem>
                            <SelectItem value="Verdieping 4">Verdieping 4</SelectItem>
                            <SelectItem value="Verdieping 5">Verdieping 5</SelectItem>
                            <SelectItem value="Verdieping 6">Verdieping 6</SelectItem>
                            <SelectItem value="Verdieping 7">Verdieping 7</SelectItem>
                            <SelectItem value="Verdieping 8">Verdieping 8</SelectItem>
                          </SelectGroup>
                          <SelectGroup>
                            <SelectLabel>Middelste verdiepingen</SelectLabel>
                            <SelectItem value="Verdieping 9">Verdieping 9</SelectItem>
                            <SelectItem value="Verdieping 10">Verdieping 10</SelectItem>
                            <SelectItem value="Verdieping 11">Verdieping 11</SelectItem>
                            <SelectItem value="Verdieping 12">Verdieping 12</SelectItem>
                            <SelectItem value="Verdieping 13">Verdieping 13</SelectItem>
                            <SelectItem value="Verdieping 14">Verdieping 14</SelectItem>
                            <SelectItem value="Verdieping 15">Verdieping 15</SelectItem>
                            <SelectItem value="Verdieping 16">Verdieping 16</SelectItem>
                          </SelectGroup>
                          <SelectGroup>
                            <SelectLabel>Hogere verdiepingen</SelectLabel>
                            <SelectItem value="Verdieping 17">Verdieping 17</SelectItem>
                            <SelectItem value="Verdieping 18">Verdieping 18</SelectItem>
                            <SelectItem value="Verdieping 19">Verdieping 19</SelectItem>
                            <SelectItem value="Verdieping 20">Verdieping 20</SelectItem>
                            <SelectItem value="Verdieping 21">Verdieping 21</SelectItem>
                            <SelectItem value="Verdieping 22">Verdieping 22</SelectItem>
                            <SelectItem value="Verdieping 23">Verdieping 23</SelectItem>
                            <SelectItem value="Verdieping 24">Verdieping 24</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="locatie">Locatie</Label>
                      <Input
                        id="locatie"
                        value={currentTag.locatie}
                        onChange={(e) => setCurrentTag({ ...currentTag, locatie: e.target.value })}
                        placeholder="Bijv. West, Noord, Hoofdingang"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="type">Type</Label>
                      <Select
                        value={currentTag.type}
                        onValueChange={(value) => setCurrentTag({ ...currentTag, type: value })}
                      >
                        <SelectTrigger id="type">
                          <SelectValue placeholder="Selecteer type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="checkpoint">Checkpoint</SelectItem>
                          <SelectItem value="apparatuur">BHV Apparatuur</SelectItem>
                          <SelectItem value="nooduitgang">Nooduitgang</SelectItem>
                          <SelectItem value="verzamelplaats">Verzamelplaats</SelectItem>
                          <SelectItem value="overig">Overig</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={currentTag.status}
                        onValueChange={(value) => setCurrentTag({ ...currentTag, status: value })}
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
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowForm(false)}>
                      Annuleren
                    </Button>
                    <Button onClick={handleSaveTag}>
                      <Save className="mr-2 h-4 w-4" />
                      Opslaan
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <Alert className="mb-4">
                    <Smartphone className="h-4 w-4" />
                    <AlertTitle>NFC Tags programmeren</AlertTitle>
                    <AlertDescription>
                      Gebruik de "Scan" knop bij het toevoegen of bewerken van een tag om deze te programmeren. Zorg
                      ervoor dat uw apparaat NFC ondersteunt en dat NFC is ingeschakeld.
                    </AlertDescription>
                  </Alert>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tag ID</TableHead>
                        <TableHead>Naam</TableHead>
                        <TableHead>Verdieping</TableHead>
                        <TableHead>Locatie</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Laatst gescand</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Acties</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tags.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center">
                            Geen NFC tags gevonden
                          </TableCell>
                        </TableRow>
                      ) : (
                        tags.map((tag) => (
                          <TableRow key={tag.id}>
                            <TableCell className="font-mono text-xs">{tag.tagId}</TableCell>
                            <TableCell>{tag.naam}</TableCell>
                            <TableCell>{tag.verdieping}</TableCell>
                            <TableCell>{tag.locatie}</TableCell>
                            <TableCell>
                              <span className="capitalize">{tag.type}</span>
                            </TableCell>
                            <TableCell>{tag.laatstGescand || "Nooit"}</TableCell>
                            <TableCell>
                              <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                  tag.status === "actief" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                }`}
                              >
                                {tag.status === "actief" ? "Actief" : "Inactief"}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" onClick={() => generateQRCode(tag.tagId)}>
                                <QrCode className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleEditTag(tag)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteTag(tag.id)}>
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

        <TabsContent value="geschiedenis">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Scan Geschiedenis</CardTitle>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Exporteren
                </Button>
              </div>
              <CardDescription>Overzicht van alle NFC tag scans</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tijdstip</TableHead>
                    <TableHead>Tag ID</TableHead>
                    <TableHead>Tag Naam</TableHead>
                    <TableHead>Gebruiker</TableHead>
                    <TableHead>Actie</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scanHistory.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        Geen scan geschiedenis gevonden
                      </TableCell>
                    </TableRow>
                  ) : (
                    scanHistory.map((scan) => (
                      <TableRow key={scan.id}>
                        <TableCell>{scan.tijdstip}</TableCell>
                        <TableCell className="font-mono text-xs">{scan.tagId}</TableCell>
                        <TableCell>{scan.tagNaam}</TableCell>
                        <TableCell>{scan.gebruiker}</TableCell>
                        <TableCell>{scan.actie}</TableCell>
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
