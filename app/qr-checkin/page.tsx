"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { QrCode, UserPlus, UserMinus, Clock, AlertTriangle } from "lucide-react"
import { toast } from "sonner"

type VisitorType = "bezoeker" | "monteur" | "leverancier" | "contractor" | "inspecteur"

type CheckInData = {
  id: string
  name: string
  company: string
  email: string
  phone: string
  visitorType: VisitorType
  purpose: string
  expectedDuration: string
  hostContact: string
  vehicleLicense?: string
  emergencyContact: string
  emergencyPhone: string
  checkInTime: Date
  checkOutTime?: Date
  location: string
  qrCode: string
  status: "checked-in" | "checked-out"
  specialRequirements?: string
  hasInduction: boolean
  inductionCompletedBy?: string
}

export default function QRCheckinPage() {
  const [mode, setMode] = useState<"checkin" | "checkout" | "generate">("generate")
  const [visitors, setVisitors] = useState<CheckInData[]>([])
  const [currentVisitor, setCurrentVisitor] = useState<Partial<CheckInData>>({
    visitorType: "bezoeker",
    hasInduction: false,
  })
  const [qrCodeData, setQrCodeData] = useState("")
  const [scannedCode, setScannedCode] = useState("")

  // Load visitors from localStorage
  useEffect(() => {
    const savedVisitors = localStorage.getItem("bhv360-visitors")
    if (savedVisitors) {
      setVisitors(JSON.parse(savedVisitors))
    }
  }, [])

  // Save visitors to localStorage
  useEffect(() => {
    localStorage.setItem("bhv360-visitors", JSON.stringify(visitors))
  }, [visitors])

  const generateQRCode = (data: string) => {
    // In een echte app zou je een QR library gebruiken zoals qrcode
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="white" stroke="black"/>
        <text x="100" y="90" textAnchor="middle" fontFamily="Arial" fontSize="12" fill="black">
          BHV360 QR Code
        </text>
        <text x="100" y="110" textAnchor="middle" fontFamily="Arial" fontSize="10" fill="black">
          ${data}
        </text>
        <text x="100" y="130" textAnchor="middle" fontFamily="Arial" fontSize="8" fill="gray">
          Scan voor check-in/out
        </text>
      </svg>
    `)}`
  }

  const handleCheckIn = () => {
    if (!currentVisitor.name || !currentVisitor.company || !currentVisitor.purpose) {
      toast.error("Vul alle verplichte velden in")
      return
    }

    const newVisitor: CheckInData = {
      id: Date.now().toString(),
      name: currentVisitor.name!,
      company: currentVisitor.company!,
      email: currentVisitor.email || "",
      phone: currentVisitor.phone || "",
      visitorType: currentVisitor.visitorType!,
      purpose: currentVisitor.purpose!,
      expectedDuration: currentVisitor.expectedDuration || "",
      hostContact: currentVisitor.hostContact || "",
      vehicleLicense: currentVisitor.vehicleLicense,
      emergencyContact: currentVisitor.emergencyContact || "",
      emergencyPhone: currentVisitor.emergencyPhone || "",
      checkInTime: new Date(),
      location: "Hoofdingang",
      qrCode: `CHECKIN-${Date.now()}`,
      status: "checked-in",
      specialRequirements: currentVisitor.specialRequirements,
      hasInduction: currentVisitor.hasInduction || false,
      inductionCompletedBy: currentVisitor.inductionCompletedBy,
    }

    setVisitors([...visitors, newVisitor])
    setCurrentVisitor({ visitorType: "bezoeker", hasInduction: false })
    toast.success(`${newVisitor.name} succesvol ingecheckt!`)

    // Generate QR code for checkout
    setQrCodeData(`CHECKOUT-${newVisitor.id}`)
  }

  const handleCheckOut = () => {
    if (!scannedCode) {
      toast.error("Scan eerst een QR code")
      return
    }

    const visitorId = scannedCode.replace("CHECKOUT-", "")
    const visitorIndex = visitors.findIndex((v) => v.id === visitorId && v.status === "checked-in")

    if (visitorIndex === -1) {
      toast.error("Bezoeker niet gevonden of al uitgecheckt")
      return
    }

    const updatedVisitors = [...visitors]
    updatedVisitors[visitorIndex] = {
      ...updatedVisitors[visitorIndex],
      checkOutTime: new Date(),
      status: "checked-out",
    }

    setVisitors(updatedVisitors)
    setScannedCode("")
    toast.success(`${updatedVisitors[visitorIndex].name} succesvol uitgecheckt!`)
  }

  const getVisitorTypeColor = (type: VisitorType) => {
    switch (type) {
      case "bezoeker":
        return "bg-blue-100 text-blue-800"
      case "monteur":
        return "bg-orange-100 text-orange-800"
      case "leverancier":
        return "bg-green-100 text-green-800"
      case "contractor":
        return "bg-purple-100 text-purple-800"
      case "inspecteur":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const activeVisitors = visitors.filter((v) => v.status === "checked-in")
  const todayVisitors = visitors.filter((v) => {
    const today = new Date().toDateString()
    return v.checkInTime && new Date(v.checkInTime).toDateString() === today
  })

  return (
    <div className="container p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">QR Code Check-in/Check-out Systeem</h1>
          <p className="text-muted-foreground">Beheer bezoeker registratie met QR codes</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant={mode === "generate" ? "default" : "outline"}
            onClick={() => setMode("generate")}
            className="flex items-center"
          >
            <QrCode className="h-4 w-4 mr-2" />
            QR Genereren
          </Button>
          <Button
            variant={mode === "checkin" ? "default" : "outline"}
            onClick={() => setMode("checkin")}
            className="flex items-center"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Check-in
          </Button>
          <Button
            variant={mode === "checkout" ? "default" : "outline"}
            onClick={() => setMode("checkout")}
            className="flex items-center"
          >
            <UserMinus className="h-4 w-4 mr-2" />
            Check-out
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {mode === "generate" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <QrCode className="h-5 w-5 mr-2" />
                  QR Codes Genereren
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-2 border-green-200">
                    <CardHeader className="text-center">
                      <CardTitle className="text-green-700">Check-in QR Code</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <img
                        src={generateQRCode("CHECKIN-MAIN") || "/placeholder.svg"}
                        alt="Check-in QR Code"
                        className="mx-auto mb-4 border"
                      />
                      <p className="text-sm text-muted-foreground mb-4">
                        Hang deze QR code op bij de hoofdingang voor bezoekers om in te checken
                      </p>
                      <Button onClick={() => window.print()} className="w-full">
                        Print QR Code
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-red-200">
                    <CardHeader className="text-center">
                      <CardTitle className="text-red-700">Check-out QR Code</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <img
                        src={generateQRCode("CHECKOUT-MAIN") || "/placeholder.svg"}
                        alt="Check-out QR Code"
                        className="mx-auto mb-4 border"
                      />
                      <p className="text-sm text-muted-foreground mb-4">
                        Hang deze QR code op bij de uitgang voor bezoekers om uit te checken
                      </p>
                      <Button onClick={() => window.print()} className="w-full">
                        Print QR Code
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-800 mb-2">Instructies:</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Print beide QR codes uit en hang ze op de juiste locaties</li>
                    <li>• Bezoekers scannen de check-in code bij aankomst</li>
                    <li>• Na het invullen van gegevens krijgen ze een persoonlijke checkout QR</li>
                    <li>• Bij vertrek scannen ze hun persoonlijke QR code</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}

          {mode === "checkin" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserPlus className="h-5 w-5 mr-2" />
                  Bezoeker Check-in
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Naam *</Label>
                    <Input
                      id="name"
                      value={currentVisitor.name || ""}
                      onChange={(e) => setCurrentVisitor({ ...currentVisitor, name: e.target.value })}
                      placeholder="Voor- en achternaam"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Bedrijf *</Label>
                    <Input
                      id="company"
                      value={currentVisitor.company || ""}
                      onChange={(e) => setCurrentVisitor({ ...currentVisitor, company: e.target.value })}
                      placeholder="Bedrijfsnaam"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={currentVisitor.email || ""}
                      onChange={(e) => setCurrentVisitor({ ...currentVisitor, email: e.target.value })}
                      placeholder="email@bedrijf.nl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefoon</Label>
                    <Input
                      id="phone"
                      value={currentVisitor.phone || ""}
                      onChange={(e) => setCurrentVisitor({ ...currentVisitor, phone: e.target.value })}
                      placeholder="06-12345678"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="visitorType">Type Bezoeker *</Label>
                    <Select
                      value={currentVisitor.visitorType}
                      onValueChange={(value: VisitorType) =>
                        setCurrentVisitor({ ...currentVisitor, visitorType: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bezoeker">Bezoeker</SelectItem>
                        <SelectItem value="monteur">Monteur</SelectItem>
                        <SelectItem value="leverancier">Leverancier</SelectItem>
                        <SelectItem value="contractor">Contractor</SelectItem>
                        <SelectItem value="inspecteur">Inspecteur</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expectedDuration">Verwachte Duur</Label>
                    <Select
                      value={currentVisitor.expectedDuration}
                      onValueChange={(value) => setCurrentVisitor({ ...currentVisitor, expectedDuration: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecteer duur" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="< 1 uur">Minder dan 1 uur</SelectItem>
                        <SelectItem value="1-2 uur">1-2 uur</SelectItem>
                        <SelectItem value="2-4 uur">2-4 uur</SelectItem>
                        <SelectItem value="4-8 uur">4-8 uur</SelectItem>
                        <SelectItem value="> 8 uur">Meer dan 8 uur</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purpose">Doel van bezoek *</Label>
                  <Textarea
                    id="purpose"
                    value={currentVisitor.purpose || ""}
                    onChange={(e) => setCurrentVisitor({ ...currentVisitor, purpose: e.target.value })}
                    placeholder="Beschrijf kort het doel van uw bezoek"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hostContact">Contactpersoon</Label>
                    <Input
                      id="hostContact"
                      value={currentVisitor.hostContact || ""}
                      onChange={(e) => setCurrentVisitor({ ...currentVisitor, hostContact: e.target.value })}
                      placeholder="Naam van contactpersoon"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vehicleLicense">Kenteken (optioneel)</Label>
                    <Input
                      id="vehicleLicense"
                      value={currentVisitor.vehicleLicense || ""}
                      onChange={(e) => setCurrentVisitor({ ...currentVisitor, vehicleLicense: e.target.value })}
                      placeholder="XX-XXX-X"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContact">Noodcontact</Label>
                    <Input
                      id="emergencyContact"
                      value={currentVisitor.emergencyContact || ""}
                      onChange={(e) => setCurrentVisitor({ ...currentVisitor, emergencyContact: e.target.value })}
                      placeholder="Naam noodcontact"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyPhone">Noodcontact Telefoon</Label>
                    <Input
                      id="emergencyPhone"
                      value={currentVisitor.emergencyPhone || ""}
                      onChange={(e) => setCurrentVisitor({ ...currentVisitor, emergencyPhone: e.target.value })}
                      placeholder="06-12345678"
                    />
                  </div>
                </div>

                {(currentVisitor.visitorType === "monteur" || currentVisitor.visitorType === "contractor") && (
                  <div className="space-y-4 p-4 bg-orange-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="hasInduction"
                        checked={currentVisitor.hasInduction}
                        onChange={(e) => setCurrentVisitor({ ...currentVisitor, hasInduction: e.target.checked })}
                      />
                      <Label htmlFor="hasInduction">Veiligheidsintroductie ontvangen</Label>
                    </div>
                    {currentVisitor.hasInduction && (
                      <div className="space-y-2">
                        <Label htmlFor="inductionCompletedBy">Introductie gegeven door</Label>
                        <Input
                          id="inductionCompletedBy"
                          value={currentVisitor.inductionCompletedBy || ""}
                          onChange={(e) =>
                            setCurrentVisitor({ ...currentVisitor, inductionCompletedBy: e.target.value })
                          }
                          placeholder="Naam BHV'er of supervisor"
                        />
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="specialRequirements">Speciale Vereisten</Label>
                      <Textarea
                        id="specialRequirements"
                        value={currentVisitor.specialRequirements || ""}
                        onChange={(e) => setCurrentVisitor({ ...currentVisitor, specialRequirements: e.target.value })}
                        placeholder="Bijv. hoogtevrees, medische beperkingen, etc."
                        rows={2}
                      />
                    </div>
                  </div>
                )}

                <Button onClick={handleCheckIn} className="w-full" size="lg">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Check-in Voltooien
                </Button>

                {qrCodeData && (
                  <Card className="border-2 border-green-200">
                    <CardHeader className="text-center">
                      <CardTitle className="text-green-700">Uw Persoonlijke Check-out QR</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <img
                        src={generateQRCode(qrCodeData) || "/placeholder.svg"}
                        alt="Personal QR Code"
                        className="mx-auto mb-4 border"
                      />
                      <p className="text-sm text-muted-foreground">Bewaar deze QR code om uit te checken bij vertrek</p>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          )}

          {mode === "checkout" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserMinus className="h-5 w-5 mr-2" />
                  Bezoeker Check-out
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="scannedCode">Gescande QR Code</Label>
                  <Input
                    id="scannedCode"
                    value={scannedCode}
                    onChange={(e) => setScannedCode(e.target.value)}
                    placeholder="Scan QR code of voer handmatig in"
                  />
                </div>

                <Button onClick={handleCheckOut} className="w-full" size="lg">
                  <UserMinus className="h-4 w-4 mr-2" />
                  Check-out Voltooien
                </Button>

                <div className="space-y-4">
                  <h3 className="font-medium">Snelle Check-out:</h3>
                  {activeVisitors.map((visitor) => (
                    <Card key={visitor.id} className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{visitor.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {visitor.company} • Ingecheckt om{" "}
                            {new Date(visitor.checkInTime).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => {
                            setScannedCode(`CHECKOUT-${visitor.id}`)
                            handleCheckOut()
                          }}
                        >
                          Check-out
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Vandaag</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Totaal bezoekers:</span>
                <Badge variant="outline">{todayVisitors.length}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Momenteel aanwezig:</span>
                <Badge className="bg-green-100 text-green-800">{activeVisitors.length}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Uitgecheckt:</span>
                <Badge variant="outline">{todayVisitors.filter((v) => v.status === "checked-out").length}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Active Visitors */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserPlus className="h-4 w-4 mr-2" />
                Aanwezige Bezoekers
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activeVisitors.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">Geen bezoekers aanwezig</p>
              ) : (
                <div className="space-y-3">
                  {activeVisitors.map((visitor) => (
                    <div key={visitor.id} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium text-sm">{visitor.name}</p>
                          <p className="text-xs text-muted-foreground">{visitor.company}</p>
                        </div>
                        <Badge className={getVisitorTypeColor(visitor.visitorType)} variant="outline">
                          {visitor.visitorType}
                        </Badge>
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(visitor.checkInTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Emergency Info */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center text-red-700">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Noodprocedure
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>Bij evacuatie:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Controleer alle aanwezige bezoekers</li>
                <li>Begeleid naar verzamelplaats</li>
                <li>Meld aan BHV coördinator</li>
                <li>Gebruik noodcontacten indien nodig</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
