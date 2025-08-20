"use client"

import { useState } from "react"
import { useCustomer } from "@/components/customer-context"
import { NoCustomerSelected } from "@/components/no-customer-selected"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Wifi,
  QrCode,
  MapPin,
  Radio,
  Mic,
  FileText,
  Settings,
  Activity,
  CheckCircle,
  Download,
  Upload,
  Play,
  Pause,
} from "lucide-react"

export default function GeavanceerdeFunctiesPage() {
  const { selectedCustomer } = useCustomer()
  const [locationTracking, setLocationTracking] = useState({
    wifi: true,
    beacons: false,
    gps: true,
    autoCheckin: true,
  })
  const [qrAlarm, setQrAlarm] = useState({
    enabled: true,
    codes: 12,
    lastScan: "2024-01-15 14:30",
  })
  const [indoorPositioning, setIndoorPositioning] = useState({
    enabled: false,
    accuracy: 2.5,
    activeUsers: 23,
  })
  const [espaIntegration, setEspaIntegration] = useState({
    connected: false,
    serverAddress: "192.168.1.100",
    port: 8080,
    devices: 5,
  })
  const [handsFreeMode, setHandsFreeMode] = useState({
    enabled: false,
    voiceActivation: true,
    isRecording: false,
    currentChannel: "emergency",
  })
  const [pdfSchemas, setPdfSchemas] = useState({
    fire: true,
    medical: true,
    evacuation: true,
    security: false,
  })

  if (!selectedCustomer) {
    return <NoCustomerSelected />
  }

  const handleStartHandsFree = async () => {
    setHandsFreeMode((prev) => ({ ...prev, enabled: true }))
    // In real implementation, start hands-free service
  }

  const handleStopHandsFree = () => {
    setHandsFreeMode((prev) => ({ ...prev, enabled: false, isRecording: false }))
  }

  const handleGenerateQRCodes = () => {
    // Generate new QR alarm codes
    alert("QR alarm codes gegenereerd voor alle locaties!")
  }

  const handleTestESPA = async () => {
    // Test ESPA connection
    alert("ESPA test bericht verzonden!")
  }

  const handleGeneratePDFSchema = (type: string) => {
    // Generate PDF schema for scenario type
    alert(`PDF schema gegenereerd voor ${type} scenario`)
  }

  return (
    <div className="container p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Geavanceerde Functies</h1>
        <p className="text-muted-foreground">Beheer geavanceerde BHV functies voor {selectedCustomer.name}</p>
      </div>

      <Tabs defaultValue="location" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="location">Locatie</TabsTrigger>
          <TabsTrigger value="qr-alarm">QR Alarm</TabsTrigger>
          <TabsTrigger value="positioning">Positioning</TabsTrigger>
          <TabsTrigger value="espa">ESPA 4.4.4</TabsTrigger>
          <TabsTrigger value="ptt">Push-to-Talk</TabsTrigger>
          <TabsTrigger value="schemas">PDF Schema's</TabsTrigger>
        </TabsList>

        <TabsContent value="location" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wifi className="h-5 w-5 mr-2" />
                Automatische Locatie Check-in
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="wifi-tracking">WiFi Tracking</Label>
                    <Switch
                      id="wifi-tracking"
                      checked={locationTracking.wifi}
                      onCheckedChange={(checked) => setLocationTracking((prev) => ({ ...prev, wifi: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="beacon-tracking">Beacon Tracking</Label>
                    <Switch
                      id="beacon-tracking"
                      checked={locationTracking.beacons}
                      onCheckedChange={(checked) => setLocationTracking((prev) => ({ ...prev, beacons: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="gps-tracking">GPS Tracking</Label>
                    <Switch
                      id="gps-tracking"
                      checked={locationTracking.gps}
                      onCheckedChange={(checked) => setLocationTracking((prev) => ({ ...prev, gps: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-checkin">Automatische Check-in</Label>
                    <Switch
                      id="auto-checkin"
                      checked={locationTracking.autoCheckin}
                      onCheckedChange={(checked) => setLocationTracking((prev) => ({ ...prev, autoCheckin: checked }))}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-medium text-blue-800 mb-2">Status</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>WiFi Access Points:</span>
                        <Badge variant="outline">12 actief</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Beacons:</span>
                        <Badge variant="outline">8 actief</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Getrackte gebruikers:</span>
                        <Badge className="bg-green-100 text-green-800">23</Badge>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Configureer Locaties
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="qr-alarm" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <QrCode className="h-5 w-5 mr-2" />
                QR Alarm Systeem
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="qr-alarm-enabled">QR Alarm Actief</Label>
                    <Switch
                      id="qr-alarm-enabled"
                      checked={qrAlarm.enabled}
                      onCheckedChange={(checked) => setQrAlarm((prev) => ({ ...prev, enabled: checked }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Alarm Types</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {["Brand", "EHBO", "Ontruiming", "Beveiliging"].map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked />
                          <Label className="text-sm">{type}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button onClick={handleGenerateQRCodes} className="w-full">
                    <QrCode className="h-4 w-4 mr-2" />
                    Genereer QR Codes
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h3 className="font-medium text-orange-800 mb-2">Statistieken</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Actieve QR codes:</span>
                        <Badge variant="outline">{qrAlarm.codes}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Laatste scan:</span>
                        <Badge variant="outline">{qrAlarm.lastScan}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Scans vandaag:</span>
                        <Badge className="bg-orange-100 text-orange-800">3</Badge>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download QR Codes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="positioning" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Indoor Positioning
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="positioning-enabled">Indoor Positioning</Label>
                    <Switch
                      id="positioning-enabled"
                      checked={indoorPositioning.enabled}
                      onCheckedChange={(checked) => setIndoorPositioning((prev) => ({ ...prev, enabled: checked }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Positioning Methoden</Label>
                    <div className="space-y-2">
                      {[
                        { id: "wifi-fingerprint", label: "WiFi Fingerprinting" },
                        { id: "beacon-trilateration", label: "Beacon Trilateration" },
                        { id: "uwb", label: "Ultra-Wideband (UWB)" },
                        { id: "hybrid", label: "Hybrid Positioning" },
                      ].map((method) => (
                        <div key={method.id} className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked={method.id !== "uwb"} />
                          <Label className="text-sm">{method.label}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h3 className="font-medium text-purple-800 mb-2">Prestaties</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Gemiddelde nauwkeurigheid:</span>
                        <Badge variant="outline">{indoorPositioning.accuracy}m</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Actieve gebruikers:</span>
                        <Badge className="bg-purple-100 text-purple-800">{indoorPositioning.activeUsers}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Update frequentie:</span>
                        <Badge variant="outline">5 sec</Badge>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full">
                    <Activity className="h-4 w-4 mr-2" />
                    Live Positioning View
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="espa" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Radio className="h-5 w-5 mr-2" />
                ESPA 4.4.4 Integratie
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-3 h-3 rounded-full ${espaIntegration.connected ? "bg-green-500" : "bg-red-500"}`}
                    />
                    <Label>{espaIntegration.connected ? "Verbonden" : "Niet verbonden"}</Label>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="espa-server">Server Adres</Label>
                    <Input
                      id="espa-server"
                      value={espaIntegration.serverAddress}
                      onChange={(e) => setEspaIntegration((prev) => ({ ...prev, serverAddress: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="espa-port">Poort</Label>
                    <Input
                      id="espa-port"
                      type="number"
                      value={espaIntegration.port}
                      onChange={(e) =>
                        setEspaIntegration((prev) => ({ ...prev, port: Number.parseInt(e.target.value) }))
                      }
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button className="flex-1">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Verbinden
                    </Button>
                    <Button variant="outline" onClick={handleTestESPA}>
                      Test
                    </Button>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="font-medium text-green-800 mb-2">ESPA Apparaten</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Pagers:</span>
                        <Badge variant="outline">3</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Displays:</span>
                        <Badge variant="outline">1</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Mobiele apps:</span>
                        <Badge variant="outline">1</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Totaal actief:</span>
                        <Badge className="bg-green-100 text-green-800">{espaIntegration.devices}</Badge>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Beheer Apparaten
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ptt" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mic className="h-5 w-5 mr-2" />
                Hands-free Push-to-Talk
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="hands-free-enabled">Hands-free Modus</Label>
                    <Switch
                      id="hands-free-enabled"
                      checked={handsFreeMode.enabled}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          handleStartHandsFree()
                        } else {
                          handleStopHandsFree()
                        }
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="voice-activation">Spraakactivatie</Label>
                    <Switch
                      id="voice-activation"
                      checked={handsFreeMode.voiceActivation}
                      onCheckedChange={(checked) => setHandsFreeMode((prev) => ({ ...prev, voiceActivation: checked }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ptt-channel">Actief Kanaal</Label>
                    <Select
                      value={handsFreeMode.currentChannel}
                      onValueChange={(value) => setHandsFreeMode((prev) => ({ ...prev, currentChannel: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="emergency">🚨 Noodkanaal</SelectItem>
                        <SelectItem value="coordination">📋 Coördinatie</SelectItem>
                        <SelectItem value="medical">🏥 EHBO</SelectItem>
                        <SelectItem value="security">🛡️ Beveiliging</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      className="flex-1"
                      variant={handsFreeMode.isRecording ? "destructive" : "default"}
                      onMouseDown={() => setHandsFreeMode((prev) => ({ ...prev, isRecording: true }))}
                      onMouseUp={() => setHandsFreeMode((prev) => ({ ...prev, isRecording: false }))}
                    >
                      {handsFreeMode.isRecording ? (
                        <>
                          <Pause className="h-4 w-4 mr-2" />
                          Opname...
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Push to Talk
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-medium text-blue-800 mb-2">Spraakcommando's</h3>
                    <div className="space-y-1 text-sm">
                      <div>"Alarm" → Algemeen alarm</div>
                      <div>"Brand" → Brandalarm</div>
                      <div>"EHBO" → Medisch alarm</div>
                      <div>"Evacuatie" → Ontruiming</div>
                      <div>"Status" → Huidige situatie</div>
                      <div>"Help" → Hulpverzoek</div>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium mb-2">Audio Status</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Microfoon:</span>
                        <Badge variant={handsFreeMode.enabled ? "default" : "outline"}>
                          {handsFreeMode.enabled ? "Actief" : "Inactief"}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Spraakherkenning:</span>
                        <Badge variant={handsFreeMode.voiceActivation ? "default" : "outline"}>
                          {handsFreeMode.voiceActivation ? "Aan" : "Uit"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schemas" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                PDF Schema Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Beschikbare Schema's</h3>
                  {Object.entries(pdfSchemas).map(([type, enabled]) => (
                    <div key={type} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Switch
                          checked={enabled}
                          onCheckedChange={(checked) => setPdfSchemas((prev) => ({ ...prev, [type]: checked }))}
                        />
                        <div>
                          <p className="font-medium capitalize">{type} Schema</p>
                          <p className="text-sm text-muted-foreground">
                            {type === "fire" && "Brandbestrijding instructies"}
                            {type === "medical" && "EHBO procedures"}
                            {type === "evacuation" && "Ontruiming procedures"}
                            {type === "security" && "Beveiligingsprotocollen"}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleGeneratePDFSchema(type)}>
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h3 className="font-medium text-yellow-800 mb-2">Schema Functies</h3>
                    <div className="space-y-2 text-sm text-yellow-700">
                      <div>✓ Automatische PDF generatie bij alarm</div>
                      <div>✓ Locatie-specifieke instructies</div>
                      <div>✓ Meertalige ondersteuning</div>
                      <div>✓ Aangepaste instructies mogelijk</div>
                      <div>✓ Email bijlage bij scenario activatie</div>
                    </div>
                  </div>
                  <Button className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Aangepast Schema
                  </Button>
                  <Button variant="outline" className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Schema Editor
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
