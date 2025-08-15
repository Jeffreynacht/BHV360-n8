"use client"

import { useState } from "react"
import { useCustomer } from "@/components/customer-context"
import { NoCustomerSelected } from "@/components/no-customer-selected"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Users,
  Shield,
  Eye,
  Wrench,
  List,
  Cpu,
  Plus,
  Trash2,
  Edit,
  Save,
  Upload,
  Download,
  Settings,
  AlertTriangle,
  CheckCircle,
  UserPlus,
  MapPin,
  Wifi,
  Bluetooth,
  Radio,
} from "lucide-react"

export default function BeheeromgevingPage() {
  const { selectedCustomer } = useCustomer()

  // State voor verschillende secties
  const [userRoles, setUserRoles] = useState([
    { id: 1, name: "BHV Coördinator", permissions: ["read", "write", "admin"], users: 3 },
    { id: 2, name: "BHV'er", permissions: ["read", "write"], users: 12 },
    { id: 3, name: "Bezoeker", permissions: ["read"], users: 45 },
  ])

  const [displaySettings, setDisplaySettings] = useState({
    primaryColor: "#3b82f6",
    secondaryColor: "#64748b",
    logoUrl: "/images/bhv360-logo.png",
    companyName: selectedCustomer?.name || "",
    showWeatherWidget: true,
    showClockWidget: true,
    darkModeEnabled: false,
    autoRefreshInterval: 30,
  })

  const [nameList, setNameList] = useState([
    { id: 1, category: "BHV'ers", names: ["Jan de Vries", "Maria Jansen", "Piet Bakker"] },
    { id: 2, category: "EHBO'ers", names: ["Lisa van Dam", "Tom Hendriks"] },
    { id: 3, category: "Brandwachten", names: ["Karel Smit", "Anna de Boer", "Rob van Dijk"] },
  ])

  const [facilities, setFacilities] = useState([
    { id: 1, name: "Brandblusser", type: "Veiligheid", location: "Gang A", status: "Actief", lastCheck: "2024-01-15" },
    { id: 2, name: "EHBO Kit", type: "Medisch", location: "Kantine", status: "Actief", lastCheck: "2024-01-10" },
    {
      id: 3,
      name: "Nooduitgang",
      type: "Evacuatie",
      location: "Hoofdingang",
      status: "Actief",
      lastCheck: "2024-01-12",
    },
  ])

  const [aamSettings, setAamSettings] = useState({
    enabled: true,
    detectionMethod: "nfc",
    autoCheckIn: true,
    checkInRadius: 50,
    reminderInterval: 15,
    emergencyContacts: ["112", "0800-1234567"],
  })

  const [iotDevices, setIotDevices] = useState([
    {
      id: 1,
      name: "Temperatuur Sensor A1",
      type: "temperature",
      location: "Serverruimte",
      status: "Online",
      battery: 85,
    },
    { id: 2, name: "Rookmelder B2", type: "smoke", location: "Gang B", status: "Online", battery: 92 },
    { id: 3, name: "Deur Sensor C1", type: "door", location: "Nooduitgang", status: "Offline", battery: 12 },
  ])

  if (!selectedCustomer) {
    return <NoCustomerSelected />
  }

  return (
    <div className="container p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Beheeromgeving</h1>
          <p className="text-muted-foreground">Beheer alle instellingen voor {selectedCustomer.name}</p>
        </div>
        <Button>
          <Save className="h-4 w-4 mr-2" />
          Alles Opslaan
        </Button>
      </div>

      <Tabs defaultValue="functies" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="functies">
            <Shield className="h-4 w-4 mr-2" />
            Functies
          </TabsTrigger>
          <TabsTrigger value="weergaven">
            <Eye className="h-4 w-4 mr-2" />
            Weergaven
          </TabsTrigger>
          <TabsTrigger value="namenlijsten">
            <List className="h-4 w-4 mr-2" />
            Namenlijsten
          </TabsTrigger>
          <TabsTrigger value="middelen">
            <Wrench className="h-4 w-4 mr-2" />
            Middelen
          </TabsTrigger>
          <TabsTrigger value="aam">
            <Users className="h-4 w-4 mr-2" />
            AAM
          </TabsTrigger>
          <TabsTrigger value="iot">
            <Cpu className="h-4 w-4 mr-2" />
            IoT
          </TabsTrigger>
        </TabsList>

        {/* FUNCTIES TAB */}
        <TabsContent value="functies" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gebruikersrollen & Rechten</CardTitle>
              <CardDescription>Beheer rollen en bijbehorende rechten voor gebruikers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Bestaande Rollen</h3>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nieuwe Rol
                </Button>
              </div>

              <div className="space-y-3">
                {userRoles.map((role) => (
                  <div key={role.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{role.name}</h4>
                      <div className="flex gap-2 mt-2">
                        {role.permissions.map((perm) => (
                          <Badge key={perm} variant="secondary">
                            {perm}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{role.users} gebruikers</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Nieuwe Rol Aanmaken</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="roleName">Rol Naam</Label>
                    <Input id="roleName" placeholder="Bijv. Veiligheidscoördinator" />
                  </div>
                  <div>
                    <Label htmlFor="roleDescription">Beschrijving</Label>
                    <Input id="roleDescription" placeholder="Korte beschrijving van de rol" />
                  </div>
                </div>

                <div>
                  <Label>Rechten</Label>
                  <div className="grid grid-cols-3 gap-4 mt-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="read" />
                      <Label htmlFor="read">Lezen</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="write" />
                      <Label htmlFor="write">Schrijven</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="admin" />
                      <Label htmlFor="admin">Beheerder</Label>
                    </div>
                  </div>
                </div>

                <Button>Rol Aanmaken</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* WEERGAVEN TAB */}
        <TabsContent value="weergaven" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Huisstijl</CardTitle>
                <CardDescription>Pas kleuren en logo aan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="primaryColor">Primaire Kleur</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={displaySettings.primaryColor}
                      onChange={(e) => setDisplaySettings({ ...displaySettings, primaryColor: e.target.value })}
                      className="w-16 h-10"
                    />
                    <Input
                      value={displaySettings.primaryColor}
                      onChange={(e) => setDisplaySettings({ ...displaySettings, primaryColor: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="secondaryColor">Secundaire Kleur</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={displaySettings.secondaryColor}
                      onChange={(e) => setDisplaySettings({ ...displaySettings, secondaryColor: e.target.value })}
                      className="w-16 h-10"
                    />
                    <Input
                      value={displaySettings.secondaryColor}
                      onChange={(e) => setDisplaySettings({ ...displaySettings, secondaryColor: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="companyName">Bedrijfsnaam</Label>
                  <Input
                    id="companyName"
                    value={displaySettings.companyName}
                    onChange={(e) => setDisplaySettings({ ...displaySettings, companyName: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Logo Uploaden</Label>
                  <div className="flex gap-2 mt-1">
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Logo
                    </Button>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download Huidig
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Interface Instellingen</CardTitle>
                <CardDescription>Pas de interface aan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="weatherWidget">Weer Widget Tonen</Label>
                  <Switch
                    id="weatherWidget"
                    checked={displaySettings.showWeatherWidget}
                    onCheckedChange={(checked) =>
                      setDisplaySettings({ ...displaySettings, showWeatherWidget: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="clockWidget">Klok Widget Tonen</Label>
                  <Switch
                    id="clockWidget"
                    checked={displaySettings.showClockWidget}
                    onCheckedChange={(checked) => setDisplaySettings({ ...displaySettings, showClockWidget: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="darkMode">Donkere Modus</Label>
                  <Switch
                    id="darkMode"
                    checked={displaySettings.darkModeEnabled}
                    onCheckedChange={(checked) => setDisplaySettings({ ...displaySettings, darkModeEnabled: checked })}
                  />
                </div>

                <div>
                  <Label htmlFor="refreshInterval">Auto Ververs Interval (seconden)</Label>
                  <Select
                    value={displaySettings.autoRefreshInterval.toString()}
                    onValueChange={(value) =>
                      setDisplaySettings({ ...displaySettings, autoRefreshInterval: Number.parseInt(value) })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 seconden</SelectItem>
                      <SelectItem value="30">30 seconden</SelectItem>
                      <SelectItem value="60">1 minuut</SelectItem>
                      <SelectItem value="300">5 minuten</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* NAMENLIJSTEN TAB */}
        <TabsContent value="namenlijsten" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Namenlijsten Beheren</CardTitle>
              <CardDescription>Beheer lijsten van personen per categorie</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {nameList.map((category) => (
                <div key={category.id} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">{category.category}</h3>
                    <Button size="sm">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Persoon Toevoegen
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {category.names.map((name, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <span>{name}</span>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Input placeholder="Nieuwe naam toevoegen..." />
                    <Button>Toevoegen</Button>
                  </div>

                  <Separator />
                </div>
              ))}

              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Nieuwe Categorie</h3>
                <div className="flex gap-2">
                  <Input placeholder="Categorie naam (bijv. Ontruimingscoördinatoren)" />
                  <Button>Categorie Aanmaken</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* MIDDELEN TAB */}
        <TabsContent value="middelen" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Veiligheidsmiddelen & Voorzieningen</CardTitle>
              <CardDescription>Beheer alle veiligheidsmiddelen en hun locaties</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Bestaande Middelen</h3>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nieuw Middel
                </Button>
              </div>

              <div className="space-y-3">
                {facilities.map((facility) => (
                  <div key={facility.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium">{facility.name}</h4>
                        <Badge variant={facility.status === "Actief" ? "default" : "destructive"}>
                          {facility.status}
                        </Badge>
                      </div>
                      <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                        <span>Type: {facility.type}</span>
                        <span>Locatie: {facility.location}</span>
                        <span>Laatste controle: {facility.lastCheck}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <MapPin className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Nieuw Middel Toevoegen</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="facilityName">Naam</Label>
                    <Input id="facilityName" placeholder="Bijv. Brandblusser CO2" />
                  </div>
                  <div>
                    <Label htmlFor="facilityType">Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecteer type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="safety">Veiligheid</SelectItem>
                        <SelectItem value="medical">Medisch</SelectItem>
                        <SelectItem value="evacuation">Evacuatie</SelectItem>
                        <SelectItem value="communication">Communicatie</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="facilityLocation">Locatie</Label>
                    <Input id="facilityLocation" placeholder="Bijv. Gang A, Verdieping 2" />
                  </div>
                  <div>
                    <Label htmlFor="facilityStatus">Status</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecteer status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Actief</SelectItem>
                        <SelectItem value="maintenance">Onderhoud</SelectItem>
                        <SelectItem value="inactive">Inactief</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="facilityNotes">Opmerkingen</Label>
                  <Textarea id="facilityNotes" placeholder="Extra informatie over dit middel..." />
                </div>
                <Button>Middel Toevoegen</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AAM TAB */}
        <TabsContent value="aam" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Aanwezigheids Assistentie Module (AAM)</CardTitle>
              <CardDescription>Configureer de automatische aanwezigheidsregistratie</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="aamEnabled">AAM Inschakelen</Label>
                  <p className="text-sm text-muted-foreground">Automatische aanwezigheidsregistratie activeren</p>
                </div>
                <Switch
                  id="aamEnabled"
                  checked={aamSettings.enabled}
                  onCheckedChange={(checked) => setAamSettings({ ...aamSettings, enabled: checked })}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <div>
                  <Label htmlFor="detectionMethod">Detectiemethode</Label>
                  <Select
                    value={aamSettings.detectionMethod}
                    onValueChange={(value) => setAamSettings({ ...aamSettings, detectionMethod: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nfc">NFC Tags</SelectItem>
                      <SelectItem value="bluetooth">Bluetooth Beacons</SelectItem>
                      <SelectItem value="wifi">WiFi Positioning</SelectItem>
                      <SelectItem value="manual">Handmatig</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autoCheckIn">Automatisch Inchecken</Label>
                    <p className="text-sm text-muted-foreground">Gebruikers automatisch inchecken bij detectie</p>
                  </div>
                  <Switch
                    id="autoCheckIn"
                    checked={aamSettings.autoCheckIn}
                    onCheckedChange={(checked) => setAamSettings({ ...aamSettings, autoCheckIn: checked })}
                  />
                </div>

                <div>
                  <Label htmlFor="checkInRadius">Check-in Radius (meters)</Label>
                  <Input
                    id="checkInRadius"
                    type="number"
                    value={aamSettings.checkInRadius}
                    onChange={(e) => setAamSettings({ ...aamSettings, checkInRadius: Number.parseInt(e.target.value) })}
                  />
                </div>

                <div>
                  <Label htmlFor="reminderInterval">Herinnering Interval (minuten)</Label>
                  <Select
                    value={aamSettings.reminderInterval.toString()}
                    onValueChange={(value) =>
                      setAamSettings({ ...aamSettings, reminderInterval: Number.parseInt(value) })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 minuten</SelectItem>
                      <SelectItem value="15">15 minuten</SelectItem>
                      <SelectItem value="30">30 minuten</SelectItem>
                      <SelectItem value="60">1 uur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Noodcontacten</Label>
                  <div className="space-y-2 mt-2">
                    {aamSettings.emergencyContacts.map((contact, index) => (
                      <div key={index} className="flex gap-2">
                        <Input value={contact} readOnly />
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <Input placeholder="Nieuw noodcontact..." />
                      <Button>Toevoegen</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* IOT TAB */}
        <TabsContent value="iot" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>IoT Apparaten & Sensoren</CardTitle>
              <CardDescription>Beheer alle aangesloten IoT apparaten</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Aangesloten Apparaten</h3>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Apparaat Toevoegen
                </Button>
              </div>

              <div className="space-y-3">
                {iotDevices.map((device) => (
                  <div key={device.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-full bg-muted">
                        {device.type === "temperature" && <Settings className="h-4 w-4" />}
                        {device.type === "smoke" && <AlertTriangle className="h-4 w-4" />}
                        {device.type === "door" && <Shield className="h-4 w-4" />}
                      </div>
                      <div>
                        <h4 className="font-medium">{device.name}</h4>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span>Locatie: {device.location}</span>
                          <span>Batterij: {device.battery}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={device.status === "Online" ? "default" : "destructive"}>
                        {device.status === "Online" ? (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        ) : (
                          <AlertTriangle className="h-3 w-3 mr-1" />
                        )}
                        {device.status}
                      </Badge>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Nieuw Apparaat Toevoegen</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="deviceName">Apparaat Naam</Label>
                    <Input id="deviceName" placeholder="Bijv. Temperatuur Sensor A2" />
                  </div>
                  <div>
                    <Label htmlFor="deviceType">Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecteer type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="temperature">Temperatuur Sensor</SelectItem>
                        <SelectItem value="smoke">Rookmelder</SelectItem>
                        <SelectItem value="door">Deur Sensor</SelectItem>
                        <SelectItem value="motion">Bewegingssensor</SelectItem>
                        <SelectItem value="camera">Camera</SelectItem>
                        <SelectItem value="beacon">Bluetooth Beacon</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="deviceLocation">Locatie</Label>
                    <Input id="deviceLocation" placeholder="Bijv. Serverruimte, Verdieping 1" />
                  </div>
                  <div>
                    <Label htmlFor="deviceId">Apparaat ID</Label>
                    <Input id="deviceId" placeholder="Unieke identificatie" />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Connectiviteit</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Wifi className="h-4 w-4" />
                      <Switch id="wifi" />
                      <Label htmlFor="wifi">WiFi</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Bluetooth className="h-4 w-4" />
                      <Switch id="bluetooth" />
                      <Label htmlFor="bluetooth">Bluetooth</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Radio className="h-4 w-4" />
                      <Switch id="zigbee" />
                      <Label htmlFor="zigbee">Zigbee</Label>
                    </div>
                  </div>
                </div>

                <Button>Apparaat Toevoegen</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
