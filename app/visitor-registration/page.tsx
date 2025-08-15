"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { UserPlus, CheckCircle, Camera, AlertTriangle, QrCode, X } from "lucide-react"
import { toast } from "@/hooks/use-toast"

type Visitor = {
  id: string
  name: string
  company: string
  purpose: string
  host: string
  phone: string
  email?: string
  arrivalTime: string
  expectedDepartureTime?: string
  photo?: string
  emergencyContact?: {
    name: string
    phone: string
  }
  hasDisability: boolean
  disabilityDetails?: string
  needsAssistance: boolean
  assistanceDetails?: string
  privacyConsent: boolean
  safetyBriefingCompleted: boolean
  status: "registered" | "arrived"
}

export default function VisitorRegistrationPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const [photo, setPhoto] = useState<string | null>(null)
  const [visitor, setVisitor] = useState<Visitor | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    purpose: "",
    host: "",
    phone: "",
    email: "",
    expectedDepartureTime: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    hasDisability: false,
    disabilityDetails: "",
    needsAssistance: false,
    assistanceDetails: "",
    privacyConsent: false,
    safetyBriefingCompleted: false,
  })

  const purposeOptions = [
    "Vergadering",
    "Presentatie",
    "Training",
    "Interview",
    "Leverancier",
    "Onderhoud",
    "Inspectie",
    "Consultatie",
    "Andere",
  ]

  const hostOptions = [
    "Marie Jansen - HR Manager",
    "Piet de Vries - IT Manager",
    "Lisa van Dam - Marketing Manager",
    "Tom Bakker - Facility Manager",
    "Jan Pietersen - Operations Manager",
    "Sarah Wilson - Finance Manager",
  ]

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const takePicture = () => {
    // Simulate taking a picture
    setPhoto("/placeholder.svg?height=200&width=200")
    setShowCamera(false)
    toast({
      title: "Foto gemaakt",
      description: "Foto succesvol toegevoegd aan registratie",
    })
  }

  const handleRegister = async () => {
    // Validation
    if (!formData.name || !formData.company || !formData.purpose || !formData.host || !formData.phone) {
      toast({
        title: "Velden ontbreken",
        description: "Vul alle verplichte velden in",
        variant: "destructive",
      })
      return
    }

    if (!formData.privacyConsent) {
      toast({
        title: "Privacy toestemming vereist",
        description: "Je moet akkoord gaan met de privacy voorwaarden",
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

    const newVisitor: Visitor = {
      id: `VIS-${Date.now()}`,
      name: formData.name,
      company: formData.company,
      purpose: formData.purpose,
      host: formData.host,
      phone: formData.phone,
      email: formData.email,
      arrivalTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      expectedDepartureTime: formData.expectedDepartureTime,
      photo,
      emergencyContact: formData.emergencyContactName
        ? {
            name: formData.emergencyContactName,
            phone: formData.emergencyContactPhone,
          }
        : undefined,
      hasDisability: formData.hasDisability,
      disabilityDetails: formData.disabilityDetails,
      needsAssistance: formData.needsAssistance,
      assistanceDetails: formData.assistanceDetails,
      privacyConsent: formData.privacyConsent,
      safetyBriefingCompleted: formData.safetyBriefingCompleted,
      status: "arrived",
    }

    setVisitor(newVisitor)
    setIsSubmitting(false)
    setShowSuccess(true)

    toast({
      title: "Registratie voltooid",
      description: `${newVisitor.name} is succesvol geregistreerd`,
    })
  }

  const resetForm = () => {
    setFormData({
      name: "",
      company: "",
      purpose: "",
      host: "",
      phone: "",
      email: "",
      expectedDepartureTime: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      hasDisability: false,
      disabilityDetails: "",
      needsAssistance: false,
      assistanceDetails: "",
      privacyConsent: false,
      safetyBriefingCompleted: false,
    })
    setPhoto(null)
    setVisitor(null)
    setShowSuccess(false)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Bezoeker Registratie</h1>
        <p className="text-muted-foreground">Registreer een nieuwe bezoeker voor toegang tot het gebouw</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserPlus className="h-5 w-5" />
              <span>Nieuwe Bezoeker</span>
            </CardTitle>
            <CardDescription>
              Alle velden met * zijn verplicht. Gegevens worden AVG-proof verwerkt en na 30 dagen automatisch
              verwijderd.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Persoonlijke Gegevens</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Volledige naam *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Voor- en achternaam"
                  />
                </div>
                <div>
                  <Label htmlFor="company">Bedrijf/Organisatie *</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => handleInputChange("company", e.target.value)}
                    placeholder="Bedrijfsnaam"
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
                  <Label htmlFor="email">E-mailadres</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="naam@bedrijf.nl"
                  />
                </div>
              </div>
            </div>

            {/* Visit Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Bezoek Informatie</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="purpose">Doel van bezoek *</Label>
                  <Select value={formData.purpose} onValueChange={(value) => handleInputChange("purpose", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecteer doel" />
                    </SelectTrigger>
                    <SelectContent>
                      {purposeOptions.map((purpose) => (
                        <SelectItem key={purpose} value={purpose}>
                          {purpose}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="host">Gastheer/Contactpersoon *</Label>
                  <Select value={formData.host} onValueChange={(value) => handleInputChange("host", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecteer gastheer" />
                    </SelectTrigger>
                    <SelectContent>
                      {hostOptions.map((host) => (
                        <SelectItem key={host} value={host}>
                          {host}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="expectedDepartureTime">Verwachte vertrektijd</Label>
                <Input
                  id="expectedDepartureTime"
                  type="time"
                  value={formData.expectedDepartureTime}
                  onChange={(e) => handleInputChange("expectedDepartureTime", e.target.value)}
                />
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
                <Button variant="outline" onClick={() => setShowCamera(true)} className="w-full">
                  <Camera className="h-4 w-4 mr-2" />
                  Foto maken voor identificatie
                </Button>
              ) : (
                <div className="flex items-center space-x-4">
                  <img
                    src={photo || "/placeholder.svg"}
                    alt="Visitor photo"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <Button variant="outline" onClick={() => setPhoto(null)}>
                    <X className="h-4 w-4 mr-2" />
                    Verwijderen
                  </Button>
                </div>
              )}
            </div>

            {/* Accessibility */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Toegankelijkheid</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="hasDisability"
                    checked={formData.hasDisability}
                    onCheckedChange={(checked) => handleInputChange("hasDisability", checked as boolean)}
                  />
                  <div>
                    <Label htmlFor="hasDisability" className="text-sm font-medium">
                      Ik heb een beperking die relevant is voor evacuatie
                    </Label>
                    <p className="text-xs text-gray-600 mt-1">
                      Bijvoorbeeld: rolstoelgebruiker, slechtziend, slechthorend
                    </p>
                  </div>
                </div>
                {formData.hasDisability && (
                  <div>
                    <Label htmlFor="disabilityDetails">Beschrijving beperking</Label>
                    <Textarea
                      id="disabilityDetails"
                      value={formData.disabilityDetails}
                      onChange={(e) => handleInputChange("disabilityDetails", e.target.value)}
                      placeholder="Beschrijf je beperking zodat we je kunnen helpen..."
                      rows={2}
                    />
                  </div>
                )}
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="needsAssistance"
                    checked={formData.needsAssistance}
                    onCheckedChange={(checked) => handleInputChange("needsAssistance", checked as boolean)}
                  />
                  <div>
                    <Label htmlFor="needsAssistance" className="text-sm font-medium">
                      Ik heb hulp nodig bij evacuatie
                    </Label>
                  </div>
                </div>
                {formData.needsAssistance && (
                  <div>
                    <Label htmlFor="assistanceDetails">Welke hulp heb je nodig?</Label>
                    <Textarea
                      id="assistanceDetails"
                      value={formData.assistanceDetails}
                      onChange={(e) => handleInputChange("assistanceDetails", e.target.value)}
                      placeholder="Beschrijf welke hulp je nodig hebt bij evacuatie..."
                      rows={2}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Privacy & Safety */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Privacy & Veiligheid</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="privacyConsent"
                    checked={formData.privacyConsent}
                    onCheckedChange={(checked) => handleInputChange("privacyConsent", checked as boolean)}
                  />
                  <div>
                    <Label htmlFor="privacyConsent" className="text-sm font-medium">
                      Ik ga akkoord met de verwerking van mijn gegevens *
                    </Label>
                    <p className="text-xs text-gray-600 mt-1">
                      Je gegevens worden gebruikt voor toegangscontrole en veiligheid. Na 30 dagen worden ze automatisch
                      verwijderd.
                    </p>
                  </div>
                </div>
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
                      Inclusief evacuatieprocedures, nooduitgangen en verzamelpunt
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleRegister}
              disabled={isSubmitting || !formData.privacyConsent || !formData.safetyBriefingCompleted}
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
                  Bezoeker Registreren
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
            <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
              <Camera className="h-16 w-16 text-gray-400" />
              <p className="text-gray-500 ml-2">Camera Preview</p>
            </div>
            <div className="flex space-x-2">
              <Button onClick={takePicture} className="flex-1">
                <Camera className="h-4 w-4 mr-2" />
                Foto maken
              </Button>
              <Button variant="outline" onClick={() => setShowCamera(false)}>
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
            <DialogDescription>De bezoeker is succesvol geregistreerd en kan het gebouw betreden.</DialogDescription>
          </DialogHeader>
          {visitor && (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800">Bezoeker gegevens:</h4>
                <p className="text-sm text-green-700">Naam: {visitor.name}</p>
                <p className="text-sm text-green-700">Bedrijf: {visitor.company}</p>
                <p className="text-sm text-green-700">Gastheer: {visitor.host}</p>
                <p className="text-sm text-green-700">Aankomst: {visitor.arrivalTime}</p>
                {visitor.expectedDepartureTime && (
                  <p className="text-sm text-green-700">Verwacht vertrek: {visitor.expectedDepartureTime}</p>
                )}
              </div>

              {(visitor.hasDisability || visitor.needsAssistance) && (
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <h4 className="font-semibold text-orange-800 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    Speciale aandacht:
                  </h4>
                  {visitor.hasDisability && (
                    <p className="text-sm text-orange-700">Beperking: {visitor.disabilityDetails}</p>
                  )}
                  {visitor.needsAssistance && (
                    <p className="text-sm text-orange-700">Hulp nodig: {visitor.assistanceDetails}</p>
                  )}
                </div>
              )}

              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 flex items-center">
                  <QrCode className="h-4 w-4 mr-1" />
                  Bezoeker ID: {visitor.id}
                </h4>
                <p className="text-sm text-blue-700 mt-2">Deze ID kan gebruikt worden voor uitchecken en tracking.</p>
              </div>

              <Button onClick={resetForm} className="w-full">
                Nieuwe Bezoeker Registreren
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
