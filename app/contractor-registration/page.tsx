"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { QrCode, UserPlus, CheckCircle, Clock, MapPin, Phone, Car, Building, AlertTriangle, Camera } from "lucide-react"
import { toast } from "@/hooks/use-toast"

type ContractorStatus = "registered" | "checked_in" | "working" | "checked_out" | "completed"

type Contractor = {
  id: string
  firstName: string
  lastName: string
  phone: string
  licensePlate: string
  company: string
  companyPhone: string
  workLocation: string
  workDescription: string
  expectedDuration: string
  emergencyContact?: {
    name: string
    phone: string
  }
  status: ContractorStatus
  checkInTime?: string
  checkOutTime?: string
  photo?: string
  signature?: string
  safetyBriefingCompleted: boolean
  workPermitRequired: boolean
  workPermitNumber?: string
  createdAt: string
  updatedAt: string
}

export default function ContractorRegistrationPage() {
  const [mode, setMode] = useState<"scan" | "register" | "checkout">("scan")
  const [scannedCode, setScannedCode] = useState<string | null>(null)
  const [contractor, setContractor] = useState<Contractor | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const [photo, setPhoto] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    licensePlate: "",
    company: "",
    companyPhone: "",
    workLocation: "",
    workDescription: "",
    expectedDuration: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    safetyBriefingCompleted: false,
    workPermitRequired: false,
    workPermitNumber: "",
  })

  // Mock existing contractors for demo
  const existingContractors: Contractor[] = [
    {
      id: "CONTR-001",
      firstName: "Piet",
      lastName: "Jansen",
      phone: "06-12345678",
      licensePlate: "12-ABC-3",
      company: "ElektroTech BV",
      companyPhone: "020-1234567",
      workLocation: "Verdieping 2 - Serverruimte",
      workDescription: "Onderhoud UPS systemen",
      expectedDuration: "4 uur",
      status: "checked_in",
      checkInTime: "08:30",
      safetyBriefingCompleted: true,
      workPermitRequired: true,
      workPermitNumber: "WP-2024-001",
      createdAt: "2024-01-15T08:30:00Z",
      updatedAt: "2024-01-15T08:30:00Z",
    },
    {
      id: "CONTR-002",
      firstName: "Marie",
      lastName: "de Vries",
      phone: "06-87654321",
      licensePlate: "45-XYZ-6",
      company: "CleanPro Services",
      companyPhone: "030-7654321",
      workLocation: "Gehele gebouw",
      workDescription: "Ramen schoonmaken",
      expectedDuration: "6 uur",
      status: "working",
      checkInTime: "07:00",
      safetyBriefingCompleted: true,
      workPermitRequired: false,
      createdAt: "2024-01-15T07:00:00Z",
      updatedAt: "2024-01-15T07:00:00Z",
    },
  ]

  const workLocations = [
    "Begane grond - Receptie",
    "Begane grond - Kantine",
    "Begane grond - Serverruimte",
    "Verdieping 1 - Kantoren",
    "Verdieping 1 - Vergaderzalen",
    "Verdieping 1 - Werkplaats",
    "Verdieping 2 - Kantoren",
    "Verdieping 2 - Serverruimte",
    "Verdieping 2 - Laboratorium",
    "Parkeergarage",
    "Buitenterrein",
    "Gehele gebouw",
  ]

  const simulateQRScan = () => {
    // Simulate scanning the registration QR code
    setScannedCode("QR-CONTRACTOR-REG-001")
    setMode("register")
    toast({
      title: "QR Code gescand",
      description: "Registratie formulier geladen",
    })
  }

  const simulateCheckoutScan = () => {
    // Simulate scanning for checkout with existing contractor
    const existingContractor = existingContractors[0]
    setScannedCode("QR-CONTRACTOR-REG-001")
    setContractor(existingContractor)
    setMode("checkout")
    toast({
      title: "Monteur gevonden",
      description: `${existingContractor.firstName} ${existingContractor.lastName} - ${existingContractor.company}`,
    })
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setShowCamera(true)
      }
    } catch (error) {
      toast({
        title: "Camera fout",
        description: "Kan camera niet openen",
        variant: "destructive",
      })
    }
  }

  const takePicture = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas")
      const context = canvas.getContext("2d")
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight

      if (context) {
        context.drawImage(videoRef.current, 0, 0)
        const dataURL = canvas.toDataURL("image/jpeg")
        setPhoto(dataURL)
        stopCamera()
      }
    }
  }

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
    }
    setShowCamera(false)
  }

  const handleRegister = async () => {
    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.company) {
      toast({
        title: "Velden ontbreken",
        description: "Vul alle verplichte velden in",
        variant: "destructive",
      })
      return
    }

    if (!formData.safetyBriefingCompleted) {
      toast({
        title: "Veiligheidsinstructie vereist",
        description: "De veiligheidsinstructie moet worden voltooid",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const newContractor: Contractor = {
      id: `CONTR-${Date.now()}`,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      licensePlate: formData.licensePlate,
      company: formData.company,
      companyPhone: formData.companyPhone,
      workLocation: formData.workLocation,
      workDescription: formData.workDescription,
      expectedDuration: formData.expectedDuration,
      emergencyContact: formData.emergencyContactName
        ? {
            name: formData.emergencyContactName,
            phone: formData.emergencyContactPhone,
          }
        : undefined,
      status: "checked_in",
      checkInTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      photo,
      safetyBriefingCompleted: formData.safetyBriefingCompleted,
      workPermitRequired: formData.workPermitRequired,
      workPermitNumber: formData.workPermitNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setContractor(newContractor)
    setIsSubmitting(false)
    setShowSuccess(true)

    toast({
      title: "Registratie voltooid",
      description: `${newContractor.firstName} ${newContractor.lastName} is ingecheckt`,
    })
  }

  const handleCheckout = async () => {
    if (!contractor) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const updatedContractor = {
      ...contractor,
      status: "checked_out" as ContractorStatus,
      checkOutTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      updatedAt: new Date().toISOString(),
    }

    setContractor(updatedContractor)
    setIsSubmitting(false)
    setShowSuccess(true)

    toast({
      title: "Uitchecken voltooid",
      description: `${contractor.firstName} ${contractor.lastName} is uitgecheckt`,
    })
  }

  const resetForm = () => {
    setMode("scan")
    setScannedCode(null)
    setContractor(null)
    setPhoto(null)
    setShowSuccess(false)
    setFormData({
      firstName: "",
      lastName: "",
      phone: "",
      licensePlate: "",
      company: "",
      companyPhone: "",
      workLocation: "",
      workDescription: "",
      expectedDuration: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      safetyBriefingCompleted: false,
      workPermitRequired: false,
      workPermitNumber: "",
    })
  }

  const getStatusBadge = (status: ContractorStatus) => {
    switch (status) {
      case "registered":
        return <Badge className="bg-blue-100 text-blue-800">Geregistreerd</Badge>
      case "checked_in":
        return <Badge className="bg-green-100 text-green-800">Ingecheckt</Badge>
      case "working":
        return <Badge className="bg-yellow-100 text-yellow-800">Aan het werk</Badge>
      case "checked_out":
        return <Badge className="bg-gray-100 text-gray-800">Uitgecheckt</Badge>
      case "completed":
        return <Badge className="bg-purple-100 text-purple-800">Voltooid</Badge>
      default:
        return <Badge>Onbekend</Badge>
    }
  }

  if (mode === "scan") {
    return (
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Monteur Registratie</h1>
          <p className="text-muted-foreground">Scan QR code voor registratie of uitchecken</p>
        </div>

        {/* Scan Interface */}
        <div className="max-w-md mx-auto space-y-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center space-x-2">
                <QrCode className="h-6 w-6" />
                <span>QR Code Scanner</span>
              </CardTitle>
              <CardDescription>Scan de QR code bij de receptie</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="w-32 h-32 mx-auto bg-blue-100 rounded-lg flex items-center justify-center">
                <QrCode className="h-16 w-16 text-blue-600 animate-pulse" />
              </div>

              <div className="space-y-3">
                <Button onClick={simulateQRScan} className="w-full">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Simuleer Registratie Scan
                </Button>
                <Button onClick={simulateCheckoutScan} variant="outline" className="w-full bg-transparent">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Simuleer Uitcheck Scan
                </Button>
              </div>

              <p className="text-xs text-gray-500">Voor demo: gebruik de knoppen om QR scan te simuleren</p>
            </CardContent>
          </Card>

          {/* Current Contractors */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Huidige Monteurs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {existingContractors.map((contractor) => (
                  <div key={contractor.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">
                        {contractor.firstName} {contractor.lastName}
                      </p>
                      <p className="text-sm text-gray-600">{contractor.company}</p>
                      <p className="text-xs text-gray-500">{contractor.workLocation}</p>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(contractor.status)}
                      <p className="text-xs text-gray-500 mt-1">Sinds {contractor.checkInTime}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (mode === "register") {
    return (
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Monteur Registratie</h1>
            <p className="text-muted-foreground">Vul je gegevens in voor toegang tot het gebouw</p>
          </div>
          <Button variant="outline" onClick={resetForm}>
            Terug naar Scanner
          </Button>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UserPlus className="h-5 w-5" />
                <span>Registratie Formulier</span>
              </CardTitle>
              <CardDescription>
                Alle velden met * zijn verplicht. Je gegevens worden AVG-proof verwerkt.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Persoonlijke Gegevens</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Voornaam *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      placeholder="Voornaam"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Achternaam *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      placeholder="Achternaam"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Telefoonnummer *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="06-12345678"
                    />
                  </div>
                  <div>
                    <Label htmlFor="licensePlate">Kenteken</Label>
                    <Input
                      id="licensePlate"
                      value={formData.licensePlate}
                      onChange={(e) => handleInputChange("licensePlate", e.target.value)}
                      placeholder="12-ABC-3"
                    />
                  </div>
                </div>
              </div>

              {/* Company Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Bedrijfsgegevens</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="company">Werkgever *</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => handleInputChange("company", e.target.value)}
                      placeholder="Bedrijfsnaam"
                    />
                  </div>
                  <div>
                    <Label htmlFor="companyPhone">Bedrijfstelefoon</Label>
                    <Input
                      id="companyPhone"
                      value={formData.companyPhone}
                      onChange={(e) => handleInputChange("companyPhone", e.target.value)}
                      placeholder="020-1234567"
                    />
                  </div>
                </div>
              </div>

              {/* Work Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Werkzaamheden</h3>
                <div>
                  <Label htmlFor="workLocation">Werklocatie *</Label>
                  <Select
                    value={formData.workLocation}
                    onValueChange={(value) => handleInputChange("workLocation", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecteer werklocatie" />
                    </SelectTrigger>
                    <SelectContent>
                      {workLocations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="workDescription">Beschrijving werkzaamheden *</Label>
                  <Textarea
                    id="workDescription"
                    value={formData.workDescription}
                    onChange={(e) => handleInputChange("workDescription", e.target.value)}
                    placeholder="Beschrijf kort wat je gaat doen..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="expectedDuration">Verwachte duur</Label>
                  <Select
                    value={formData.expectedDuration}
                    onValueChange={(value) => handleInputChange("expectedDuration", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecteer verwachte duur" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1 uur">1 uur</SelectItem>
                      <SelectItem value="2 uur">2 uur</SelectItem>
                      <SelectItem value="halve dag">Halve dag (4 uur)</SelectItem>
                      <SelectItem value="hele dag">Hele dag (8 uur)</SelectItem>
                      <SelectItem value="meerdere dagen">Meerdere dagen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Noodcontact (optioneel)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="emergencyContactName">Naam noodcontact</Label>
                    <Input
                      id="emergencyContactName"
                      value={formData.emergencyContactName}
                      onChange={(e) => handleInputChange("emergencyContactName", e.target.value)}
                      placeholder="Naam"
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergencyContactPhone">Telefoon noodcontact</Label>
                    <Input
                      id="emergencyContactPhone"
                      value={formData.emergencyContactPhone}
                      onChange={(e) => handleInputChange("emergencyContactPhone", e.target.value)}
                      placeholder="06-12345678"
                    />
                  </div>
                </div>
              </div>

              {/* Photo */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Foto (optioneel)</h3>
                {!photo ? (
                  <Button variant="outline" onClick={startCamera} className="w-full bg-transparent">
                    <Camera className="h-4 w-4 mr-2" />
                    Foto maken voor identificatie
                  </Button>
                ) : (
                  <div className="flex items-center space-x-4">
                    <img
                      src={photo || "/placeholder.svg"}
                      alt="Contractor photo"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <Button variant="outline" onClick={() => setPhoto(null)}>
                      Nieuwe foto maken
                    </Button>
                  </div>
                )}
              </div>

              {/* Safety & Permits */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Veiligheid & Vergunningen</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="safetyBriefing"
                      checked={formData.safetyBriefingCompleted}
                      onCheckedChange={(checked) => handleInputChange("safetyBriefingCompleted", checked as boolean)}
                    />
                    <div>
                      <Label htmlFor="safetyBriefing" className="text-sm font-medium">
                        Ik heb de veiligheidsinstructies gelezen en begrepen *
                      </Label>
                      <p className="text-xs text-gray-600 mt-1">
                        Inclusief evacuatieprocedures, nooduitgangen en contactpersonen
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="workPermit"
                      checked={formData.workPermitRequired}
                      onCheckedChange={(checked) => handleInputChange("workPermitRequired", checked as boolean)}
                    />
                    <Label htmlFor="workPermit" className="text-sm">
                      Werkvergunning vereist voor deze werkzaamheden
                    </Label>
                  </div>
                  {formData.workPermitRequired && (
                    <div>
                      <Label htmlFor="workPermitNumber">Werkvergunning nummer</Label>
                      <Input
                        id="workPermitNumber"
                        value={formData.workPermitNumber}
                        onChange={(e) => handleInputChange("workPermitNumber", e.target.value)}
                        placeholder="WP-2024-001"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleRegister}
                disabled={isSubmitting || !formData.safetyBriefingCompleted}
                className="w-full"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Registreren...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Registreren & Inchecken
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Camera Modal */}
        <Dialog open={showCamera} onOpenChange={setShowCamera}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Foto maken</DialogTitle>
              <DialogDescription>Maak een foto voor identificatie</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg" />
              <div className="flex space-x-2">
                <Button onClick={takePicture} className="flex-1">
                  <Camera className="h-4 w-4 mr-2" />
                  Foto maken
                </Button>
                <Button variant="outline" onClick={stopCamera}>
                  Annuleren
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Success Modal */}
        <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span>Registratie Voltooid!</span>
              </DialogTitle>
              <DialogDescription>Je bent succesvol geregistreerd en ingecheckt in het gebouw.</DialogDescription>
            </DialogHeader>
            {contractor && (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800">Gegevens:</h4>
                  <p className="text-sm text-green-700">
                    Naam: {contractor.firstName} {contractor.lastName}
                  </p>
                  <p className="text-sm text-green-700">Bedrijf: {contractor.company}</p>
                  <p className="text-sm text-green-700">Werklocatie: {contractor.workLocation}</p>
                  <p className="text-sm text-green-700">Ingecheckt om: {contractor.checkInTime}</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    Belangrijke informatie:
                  </h4>
                  <ul className="text-sm text-blue-700 mt-2 space-y-1">
                    <li>• Scan dezelfde QR code om uit te checken</li>
                    <li>• Bij evacuatie: ga naar het verzamelpunt op de parkeerplaats</li>
                    <li>• Bij nood: bel 112 of druk op een noodknop</li>
                    <li>• Draag altijd je identificatie bij je</li>
                  </ul>
                </div>
                <Button onClick={resetForm} className="w-full">
                  Nieuwe Registratie
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  if (mode === "checkout" && contractor) {
    return (
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Uitchecken</h1>
            <p className="text-muted-foreground">Bevestig dat je klaar bent met je werkzaamheden</p>
          </div>
          <Button variant="outline" onClick={resetForm}>
            Terug naar Scanner
          </Button>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>Uitcheck Bevestiging</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Contractor Info */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  {contractor.photo && (
                    <img
                      src={contractor.photo || "/placeholder.svg"}
                      alt="Contractor"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <h3 className="font-semibold text-lg">
                      {contractor.firstName} {contractor.lastName}
                    </h3>
                    <p className="text-gray-600">{contractor.company}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      {getStatusBadge(contractor.status)}
                      <span className="text-sm text-gray-500">Ingecheckt om {contractor.checkInTime}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Work Summary */}
              <div className="space-y-4">
                <h3 className="font-semibold">Werkzaamheden Samenvatting</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Werklocatie</Label>
                    <p className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                      {contractor.workLocation}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Verwachte duur</Label>
                    <p className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-gray-500" />
                      {contractor.expectedDuration}
                    </p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Beschrijving</Label>
                  <p className="text-sm">{contractor.workDescription}</p>
                </div>
              </div>

              {/* Checkout Confirmation */}
              <div className="p-4 border-2 border-orange-200 bg-orange-50 rounded-lg">
                <h3 className="font-semibold text-orange-800 mb-2">Ben je klaar met je werkzaamheden?</h3>
                <p className="text-sm text-orange-700 mb-4">
                  Door uit te checken bevestig je dat je werkzaamheden zijn voltooid en je het gebouw verlaat.
                </p>
                <div className="flex space-x-3">
                  <Button onClick={handleCheckout} disabled={isSubmitting} className="flex-1">
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Uitchecken...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Ja, Uitchecken
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={resetForm} className="flex-1 bg-transparent">
                    Annuleren
                  </Button>
                </div>
              </div>

              {/* Contact Info */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Contact informatie:</h4>
                <div className="space-y-1 text-sm text-blue-700">
                  <p className="flex items-center">
                    <Phone className="h-4 w-4 mr-1" />
                    Persoonlijk: {contractor.phone}
                  </p>
                  <p className="flex items-center">
                    <Building className="h-4 w-4 mr-1" />
                    Bedrijf: {contractor.companyPhone}
                  </p>
                  {contractor.licensePlate && (
                    <p className="flex items-center">
                      <Car className="h-4 w-4 mr-1" />
                      Kenteken: {contractor.licensePlate}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Success Modal */}
        <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span>Uitchecken Voltooid!</span>
              </DialogTitle>
              <DialogDescription>Je bent succesvol uitgecheckt. Bedankt voor je bezoek!</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800">Samenvatting:</h4>
                <p className="text-sm text-green-700">Uitgecheckt om: {contractor.checkOutTime}</p>
                <p className="text-sm text-green-700">
                  Totale tijd: {contractor.checkInTime} - {contractor.checkOutTime}
                </p>
              </div>
              <Button onClick={resetForm} className="w-full">
                Nieuwe Registratie
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  return null
}
