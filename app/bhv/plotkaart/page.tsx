"use client"
import { useState } from "react"
import { useCustomer } from "@/components/customer-context"
import { NoCustomerSelected } from "@/components/no-customer-selected"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Legend } from "@/components/legend"
import { UserManual } from "@/components/user-manual"
import {
  Flame,
  ShieldCheck,
  Zap,
  Droplets,
  Eye,
  Volume2,
  Heart,
  Phone,
  MapPin,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Smartphone,
  User,
  ArrowRight,
  Scan,
  Building2,
} from "lucide-react"

interface Floor {
  id: string
  name: string
  level: number
  facilities: Facility[]
  checklistItems: ChecklistItem[]
  mivaLocations: MivaLocation[]
  notes: string
}

interface Facility {
  id: string
  name: string
  type: string
  location: string
  status: "operational" | "maintenance" | "defect" | "unknown"
  nfcTagId: string
  lastInspection: string
  nextInspection: string
}

interface ChecklistItem {
  id: string
  text: string
  checked: boolean
  comment: string
}

interface MivaLocation {
  id: string
  name: string
  location: string
  present: boolean
  evacuated: boolean
}

const facilityTypes = [
  { id: "fire-extinguisher", name: "Brandblusser", icon: Flame, color: "text-red-500" },
  { id: "fire-hose", name: "Brandslang", icon: Droplets, color: "text-blue-500" },
  { id: "emergency-exit", name: "Nooduitgang", icon: ShieldCheck, color: "text-green-500" },
  { id: "emergency-lighting", name: "Noodverlichting", icon: Zap, color: "text-yellow-500" },
  { id: "smoke-detector", name: "Rookmelder", icon: Eye, color: "text-gray-500" },
  { id: "alarm-button", name: "Alarmknop", icon: Volume2, color: "text-orange-500" },
  { id: "aed", name: "AED", icon: Heart, color: "text-pink-500" },
  { id: "emergency-phone", name: "Noodtelefoon", icon: Phone, color: "text-indigo-500" },
]

// Simple safety icons component inline to avoid import issues
function SafetyIconsDisplay() {
  return (
    <div className="grid grid-cols-4 gap-2 p-4">
      <div className="flex flex-col items-center p-2 border rounded">
        <Flame className="h-6 w-6 text-red-500 mb-1" />
        <span className="text-xs">Brand</span>
      </div>
      <div className="flex flex-col items-center p-2 border rounded">
        <ShieldCheck className="h-6 w-6 text-green-500 mb-1" />
        <span className="text-xs">Veilig</span>
      </div>
      <div className="flex flex-col items-center p-2 border rounded">
        <Heart className="h-6 w-6 text-pink-500 mb-1" />
        <span className="text-xs">AED</span>
      </div>
      <div className="flex flex-col items-center p-2 border rounded">
        <Phone className="h-6 w-6 text-indigo-500 mb-1" />
        <span className="text-xs">Nood</span>
      </div>
    </div>
  )
}

export default function BHVPlotkaartPage() {
  const { selectedCustomer } = useCustomer()
  const [floors, setFloors] = useState<Floor[]>([
    {
      id: "floor-1",
      name: "Begane Grond",
      level: 0,
      facilities: [
        {
          id: "fac-1",
          name: "Brandblusser BG-001",
          type: "fire-extinguisher",
          location: "Bij hoofdingang",
          status: "operational",
          nfcTagId: "nfc-hg-bg-001",
          lastInspection: "2024-01-15",
          nextInspection: "2024-04-15",
        },
        {
          id: "fac-2",
          name: "AED Receptie",
          type: "aed",
          location: "Receptiebalie",
          status: "operational",
          nfcTagId: "nfc-hg-bg-002",
          lastInspection: "2024-01-10",
          nextInspection: "2024-02-10",
        },
      ],
      checklistItems: [
        { id: "check-1", text: "Nooduitgangen vrij van obstakels", checked: true, comment: "" },
        { id: "check-2", text: "Brandblussers gecontroleerd", checked: false, comment: "" },
      ],
      mivaLocations: [
        { id: "miva-1", name: "Rolstoelgebruiker", location: "Receptie", present: true, evacuated: false },
      ],
      notes: "Hoofdingang wordt gebruikt als primaire verzamelplaats.",
    },
  ])
  const [activeFloor, setActiveFloor] = useState<string>("floor-1")
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null)
  const [isScanning, setIsScanning] = useState<boolean>(false)
  const [scanResult, setScanResult] = useState<string | null>(null)

  if (!selectedCustomer) {
    return <NoCustomerSelected />
  }

  const currentFloor = floors.find((floor) => floor.id === activeFloor) || floors[0]

  const simulateNFCScan = (facility: Facility) => {
    setIsScanning(true)
    setScanResult(null)
    setSelectedFacility(facility)

    setTimeout(() => {
      setIsScanning(false)
      setScanResult(facility.nfcTagId)
    }, 1500)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "bg-green-500"
      case "maintenance":
        return "bg-orange-500"
      case "defect":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "operational":
        return "Operationeel"
      case "maintenance":
        return "Onderhoud"
      case "defect":
        return "Defect"
      default:
        return "Onbekend"
    }
  }

  const getFacilityIcon = (type: string) => {
    const facilityType = facilityTypes.find((ft) => ft.id === type)
    return facilityType ? facilityType.icon : MapPin
  }

  const getFacilityColor = (type: string) => {
    const facilityType = facilityTypes.find((ft) => ft.id === type)
    return facilityType ? facilityType.color : "text-gray-500"
  }

  return (
    <div className="container p-6">
      {/* Header met klant branding */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            {/* BHV360 Logo */}
            <img
              src="/images/bhv360-logo.png"
              alt="BHV360"
              className="h-12 w-auto"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg?height=48&width=120&text=BHV360"
              }}
            />
            <div className="h-8 w-px bg-gray-300" />
            {/* Klant Logo */}
            <div className="flex items-center space-x-3">
              {selectedCustomer.logo ? (
                <img
                  src={selectedCustomer.logo || "/placeholder.svg"}
                  alt={selectedCustomer.name}
                  className="h-10 w-auto max-w-[120px]"
                  onError={(e) => {
                    e.currentTarget.src =
                      "/placeholder.svg?height=40&width=80&text=" +
                      encodeURIComponent(selectedCustomer.name.substring(0, 3))
                  }}
                />
              ) : (
                <div className="h-10 w-16 bg-gray-100 rounded flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-gray-400" />
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{selectedCustomer.name}</h1>
                <p className="text-sm text-gray-600">{selectedCustomer.address}</p>
              </div>
            </div>
          </div>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            BHV Plotkaart Actief
          </Badge>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-blue-800">BHV Plotkaart voor {selectedCustomer.name}</h3>
              <p className="text-sm text-blue-700 mt-1">
                Actuele BHV informatie en veiligheidsvoorzieningen voor {selectedCustomer.address}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Floor Selection & Map */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Verdieping Selectie</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {floors.map((floor) => (
                  <Button
                    key={floor.id}
                    variant={activeFloor === floor.id ? "default" : "outline"}
                    onClick={() => setActiveFloor(floor.id)}
                    className="whitespace-nowrap"
                  >
                    {floor.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>
                  {currentFloor.name} - {selectedCustomer.name}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">Niveau {currentFloor.level}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative bg-gray-100 w-full h-[500px] flex items-center justify-center">
                <div className="text-center p-6">
                  <div className="mb-4">
                    <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                    <p className="text-lg font-medium text-gray-700">{selectedCustomer.name}</p>
                    <p className="text-sm text-gray-500">{currentFloor.name}</p>
                  </div>

                  {/* Facility Icons on Map */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {currentFloor.facilities.map((facility) => {
                      const Icon = getFacilityIcon(facility.type)
                      return (
                        <div
                          key={facility.id}
                          className="flex flex-col items-center p-2 border rounded-lg cursor-pointer hover:bg-gray-50"
                          onClick={() => setSelectedFacility(facility)}
                        >
                          <div className={`w-3 h-3 rounded-full mb-2 ${getStatusColor(facility.status)}`} />
                          <Icon className={`h-8 w-8 mb-1 ${getFacilityColor(facility.type)}`} />
                          <p className="text-xs text-center">{facility.name}</p>
                        </div>
                      )
                    })}
                  </div>

                  <SafetyIconsDisplay />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Voorzieningen op {currentFloor.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentFloor.facilities.map((facility) => {
                  const Icon = getFacilityIcon(facility.type)
                  return (
                    <div
                      key={facility.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted cursor-pointer"
                      onClick={() => setSelectedFacility(facility)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(facility.status)}`} />
                        <Icon className={`h-5 w-5 ${getFacilityColor(facility.type)}`} />
                        <div>
                          <h3 className="font-medium">{facility.name}</h3>
                          <p className="text-sm text-muted-foreground">{facility.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={
                            facility.status === "operational"
                              ? "default"
                              : facility.status === "maintenance"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {getStatusText(facility.status)}
                        </Badge>
                        <Button variant="outline" size="sm" onClick={() => simulateNFCScan(facility)}>
                          <Scan className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <UserManual module="bhv-plotkaart" />
        </div>

        {/* Right Column - Checklist & MiVa */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>BHV Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentFloor.checklistItems.map((item) => (
                  <div key={item.id} className="space-y-2">
                    <div className="flex items-start space-x-2">
                      <Checkbox id={item.id} checked={item.checked} />
                      <div className="grid gap-1.5 leading-none w-full">
                        <Label
                          htmlFor={item.id}
                          className={`text-sm font-medium leading-none ${
                            item.checked ? "line-through text-muted-foreground" : ""
                          }`}
                        >
                          {item.text}
                        </Label>
                        {item.comment && (
                          <Textarea
                            placeholder="Voeg opmerking toe..."
                            className="mt-1 h-20"
                            value={item.comment}
                            readOnly
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>MiVa Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              {currentFloor.mivaLocations.length > 0 ? (
                <div className="space-y-4">
                  {currentFloor.mivaLocations.map((miva) => (
                    <div key={miva.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4" />
                          <span className="font-medium">{miva.name}</span>
                        </div>
                        <Badge variant="outline">{miva.location}</Badge>
                      </div>
                      <div className="flex items-center justify-between space-x-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox id={`present-${miva.id}`} checked={miva.present} />
                          <Label htmlFor={`present-${miva.id}`}>Aanwezig</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id={`evacuated-${miva.id}`} checked={miva.evacuated} />
                          <Label htmlFor={`evacuated-${miva.id}`}>Geëvacueerd</Label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Geen MiVa personen op deze verdieping</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Notities</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Voeg notities toe over deze verdieping..."
                className="min-h-[100px]"
                value={currentFloor.notes}
                readOnly
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Legenda</CardTitle>
            </CardHeader>
            <CardContent>
              <Legend />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Facility Detail Dialog */}
      {selectedFacility && (
        <Dialog
          open={!!selectedFacility}
          onOpenChange={() => {
            setSelectedFacility(null)
            setScanResult(null)
          }}
        >
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{selectedFacility.name}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="flex items-center space-x-4">
                {(() => {
                  const Icon = getFacilityIcon(selectedFacility.type)
                  return <Icon className={`h-10 w-10 ${getFacilityColor(selectedFacility.type)}`} />
                })()}
                <div>
                  <h3 className="font-medium">{facilityTypes.find((t) => t.id === selectedFacility.type)?.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedFacility.location}</p>
                </div>
                <Badge
                  variant={
                    selectedFacility.status === "operational"
                      ? "default"
                      : selectedFacility.status === "maintenance"
                        ? "secondary"
                        : "destructive"
                  }
                  className="ml-auto"
                >
                  {getStatusText(selectedFacility.status)}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Laatste controle</p>
                  <div className="flex items-center mt-1">
                    <CheckCircle2 className="h-4 w-4 mr-1 text-green-500" />
                    <p className="text-sm">{selectedFacility.lastInspection}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium">Volgende controle</p>
                  <div className="flex items-center mt-1">
                    <Clock className="h-4 w-4 mr-1 text-blue-500" />
                    <p className="text-sm">{selectedFacility.nextInspection}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm font-medium mb-2">NFC Tag</p>
                <div className="flex items-center space-x-2">
                  <QrCode className="h-4 w-4 text-blue-500" />
                  <p className="text-sm font-mono">{selectedFacility.nfcTagId}</p>
                </div>

                {isScanning ? (
                  <div className="flex items-center justify-center space-x-2 mt-4 p-4 border rounded-lg bg-blue-50">
                    <Smartphone className="h-5 w-5 text-blue-500 animate-pulse" />
                    <p className="text-blue-700">NFC tag scannen...</p>
                  </div>
                ) : scanResult ? (
                  <div className="mt-4 p-4 border rounded-lg bg-green-50">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <p className="text-green-700 font-medium">NFC Tag gescand</p>
                    </div>
                    <p className="text-sm text-green-600 mt-1">Tag ID: {scanResult}</p>
                    <div className="mt-3 space-y-2">
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Bekijk instructies
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Meld probleem
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <Clock className="h-4 w-4 mr-2" />
                        Registreer controle
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button className="mt-4 w-full" onClick={() => simulateNFCScan(selectedFacility)}>
                    <Scan className="h-4 w-4 mr-2" />
                    Scan NFC Tag
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
