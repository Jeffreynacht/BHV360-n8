"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Scan, Camera, Upload, CheckCircle, Heart, Shield, Package, MapPin, User, Calendar, X, Eye } from "lucide-react"

export default function NFCScanPage() {
  const [scannedItem, setScannedItem] = useState<any>(null)
  const [selectedIssues, setSelectedIssues] = useState<string[]>([])
  const [description, setDescription] = useState("")
  const [photo, setPhoto] = useState<string | null>(null)
  const [showCamera, setShowCamera] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // Mock BHV middelen database
  const bhvMiddelen = [
    {
      id: "NFC-EHBO-001",
      name: "EHBO Koffer Hoofdingang",
      type: "EHBO",
      location: "Begane grond - Receptie",
      responsible: "Marie Jansen",
      lastCheck: "15-4-2024",
      status: "actief",
      specifications: "Volledig uitgeruste EHBO koffer volgens NEN-norm",
      icon: Heart,
      color: "text-red-600",
    },
    {
      id: "NFC-EHBO-002",
      name: "EHBO Koffer Werkplaats",
      type: "EHBO",
      location: "Verdieping 1 - Werkplaats",
      responsible: "Jan Pietersen",
      lastCheck: "10-4-2024",
      status: "onderhoud",
      specifications: "Industriële EHBO koffer met brandwonden kit",
      icon: Heart,
      color: "text-red-600",
    },
    {
      id: "NFC-BLUS-001",
      name: "Brandblusser Hoofdingang",
      type: "Brandbestrijding",
      location: "Begane grond - Hoofdingang",
      responsible: "Piet de Vries",
      lastCheck: "20-7-2024",
      status: "actief",
      specifications: "6kg ABC poeder brandblusser",
      icon: Shield,
      color: "text-orange-600",
    },
    {
      id: "NFC-AED-001",
      name: "AED Centrale Hal",
      type: "AED",
      location: "Begane grond - Centrale hal",
      responsible: "Lisa van Dam",
      lastCheck: "22-2-2024",
      status: "actief",
      specifications: "Automatische Externe Defibrillator met volwassen pads",
      icon: Heart,
      color: "text-blue-600",
    },
    {
      id: "NFC-SLEEP-001",
      name: "Sleepmatras Gang Noord",
      type: "Evacuatie",
      location: "Verdieping 1 - Gang Noord",
      responsible: "Marie Jansen",
      lastCheck: "12-7-2024",
      status: "actief",
      specifications: "Evacuatie sleepmatras voor mindervaliden",
      icon: Package,
      color: "text-purple-600",
    },
    {
      id: "NFC-DOUCHE-001",
      name: "Nooddouche Werkplaats",
      type: "Veiligheid",
      location: "Verdieping 1 - Werkplaats",
      responsible: "Jan Pietersen",
      lastCheck: "11-4-2024",
      status: "onderhoud",
      specifications: "Oogdouche en nooddouche combinatie",
      icon: Eye,
      color: "text-green-600",
    },
  ]

  const issueTypes = [
    "Zegel verbroken",
    "Defect geconstateerd",
    "Beschadigd",
    "Leeg/Gebruikt",
    "Vervallen datum",
    "Onderhoud nodig",
    "Aanvulling nodig",
    "Controle OK",
    "Niet toegankelijk",
    "Verkeerde locatie",
  ]

  const simulateNFCScan = () => {
    // Simulate scanning a random NFC tag
    const randomItem = bhvMiddelen[Math.floor(Math.random() * bhvMiddelen.length)]
    setScannedItem(randomItem)
    setSelectedIssues([])
    setDescription("")
    setPhoto(null)
  }

  const handleIssueToggle = (issue: string) => {
    setSelectedIssues((prev) => (prev.includes(issue) ? prev.filter((i) => i !== issue) : [...prev, issue]))
  }

  const handlePhotoCapture = () => {
    // Simulate photo capture
    setPhoto("/placeholder.jpg")
    setShowCamera(false)
  }

  const handleSubmit = async () => {
    if (selectedIssues.length === 0) {
      alert("Selecteer minimaal één meldingstype")
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setShowSuccess(true)

    // Reset form after 3 seconds
    setTimeout(() => {
      setShowSuccess(false)
      setScannedItem(null)
      setSelectedIssues([])
      setDescription("")
      setPhoto(null)
    }, 3000)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">NFC Scanner</h1>
          <p className="text-muted-foreground">Scan BHV middelen en maak meldingen</p>
        </div>
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          <Scan className="h-3 w-3 mr-1" />
          NFC Actief
        </Badge>
      </div>

      {!scannedItem ? (
        /* Scan Interface */
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2">
              <Scan className="h-6 w-6" />
              <span>NFC Tag Scannen</span>
            </CardTitle>
            <CardDescription>Houd je telefoon bij een NFC tag om te scannen</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="w-32 h-32 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
              <Scan className="h-16 w-16 text-blue-600 animate-pulse" />
            </div>
            <Button onClick={simulateNFCScan} className="w-full">
              <Scan className="h-4 w-4 mr-2" />
              Simuleer NFC Scan
            </Button>
            <p className="text-xs text-gray-500">Voor demo: klik op de knop om een willekeurige NFC tag te simuleren</p>
          </CardContent>
        </Card>
      ) : (
        /* Scanned Item Details & Report Form */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Item Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <scannedItem.icon className={`h-5 w-5 ${scannedItem.color}`} />
                <span>Gescand Item</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{scannedItem.name}</h3>
                <Badge
                  className={
                    scannedItem.status === "actief"
                      ? "bg-green-100 text-green-800"
                      : scannedItem.status === "onderhoud"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }
                >
                  {scannedItem.status}
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{scannedItem.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Verantwoordelijke: {scannedItem.responsible}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Laatste controle: {scannedItem.lastCheck}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Scan className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">NFC Tag: {scannedItem.id}</span>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">{scannedItem.specifications}</p>
              </div>
            </CardContent>
          </Card>

          {/* Report Form */}
          <Card>
            <CardHeader>
              <CardTitle>Melding Maken</CardTitle>
              <CardDescription>Selecteer het type melding en voeg details toe</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Issue Types */}
              <div>
                <Label className="text-base font-semibold">Meldingstype *</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {issueTypes.map((issue) => (
                    <div key={issue} className="flex items-center space-x-2">
                      <Checkbox
                        id={issue}
                        checked={selectedIssues.includes(issue)}
                        onCheckedChange={() => handleIssueToggle(issue)}
                      />
                      <Label htmlFor={issue} className="text-sm cursor-pointer">
                        {issue}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Beschrijving</Label>
                <Textarea
                  id="description"
                  placeholder="Beschrijf het probleem of je bevindingen..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1"
                />
              </div>

              {/* Photo Section */}
              <div>
                <Label className="text-base font-semibold">Foto (optioneel)</Label>
                {!photo ? (
                  <div className="flex space-x-2 mt-2">
                    <Button variant="outline" onClick={() => setShowCamera(true)} className="flex-1">
                      <Camera className="h-4 w-4 mr-2" />
                      Foto Maken
                    </Button>
                    <Button variant="outline" onClick={() => setPhoto("/placeholder.jpg")} className="flex-1">
                      <Upload className="h-4 w-4 mr-2" />
                      Uploaden
                    </Button>
                  </div>
                ) : (
                  <div className="mt-2 relative">
                    <img
                      src={photo || "/placeholder.svg"}
                      alt="Uploaded"
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => setPhoto(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <Button onClick={handleSubmit} disabled={selectedIssues.length === 0 || isSubmitting} className="w-full">
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Melding Verzenden...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Melding Verzenden
                  </>
                )}
              </Button>

              <Button variant="outline" onClick={() => setScannedItem(null)} className="w-full">
                Nieuwe Scan
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Camera Modal */}
      <Dialog open={showCamera} onOpenChange={setShowCamera}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Foto Maken</DialogTitle>
            <DialogDescription>Maak een foto van het BHV middel</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
              <Camera className="h-16 w-16 text-gray-400" />
              <p className="text-gray-500 ml-2">Camera Preview</p>
            </div>
            <div className="flex space-x-2">
              <Button onClick={handlePhotoCapture} className="flex-1">
                <Camera className="h-4 w-4 mr-2" />
                Foto Maken
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
              <span>Melding Verzonden!</span>
            </DialogTitle>
            <DialogDescription>
              Je melding is succesvol verzonden en wordt verwerkt door de BHV coördinator.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-800">Samenvatting:</h4>
              <p className="text-sm text-green-700">Item: {scannedItem?.name}</p>
              <p className="text-sm text-green-700">Meldingen: {selectedIssues.join(", ")}</p>
              {photo && <p className="text-sm text-green-700">Foto: Bijgevoegd</p>}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Instructions */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Instructies:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Houd je telefoon dicht bij de NFC tag op het BHV middel</li>
            <li>• Selecteer het juiste meldingstype (meerdere mogelijk)</li>
            <li>• Voeg een beschrijving toe voor meer details</li>
            <li>• Maak indien nodig een foto van het probleem</li>
            <li>• Verzend de melding naar de BHV coördinator</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
