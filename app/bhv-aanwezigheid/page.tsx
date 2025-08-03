"use client"

import { useState, useEffect } from "react"
import { useCustomer } from "@/components/customer-context"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import {
  Users,
  Bell,
  AlertTriangle,
  Clock,
  MapPin,
  Wifi,
  UserCheck,
  UserX,
  Smartphone,
  Phone,
  FileText,
  Shield,
  Heart,
  Download,
  Eye,
  Settings,
  CheckCircle,
  XCircle,
  AlertCircle,
  Mail,
  Star,
  ShipWheelIcon as Wheelchair,
  ExternalLink,
} from "lucide-react"

type BHVMember = {
  id: number
  name: string
  role: string
  status: "available" | "unavailable" | "responding" | "onduty"
  location: string
  lastSeen: string
  phone: string
  email: string
  photoUrl?: string
  detectionMethod: "wifi" | "gps" | "manual" | "nfc"
  certificates: {
    bhv?: { valid: boolean; expiryDate: string; level: string; certificateNumber?: string; fileUrl?: string }
    ehbo?: { valid: boolean; expiryDate: string; level: string; certificateNumber?: string; fileUrl?: string }
    ontruiming?: { valid: boolean; expiryDate: string; certificateNumber?: string; fileUrl?: string }
  }
  emergencyContact: {
    name: string
    phone: string
    relation: string
  }
  isCoordinator?: boolean
  isPloegleider?: boolean
}

type Visitor = {
  id: number
  name: string
  company: string
  purpose: string
  host: string
  arrivalTime: string
  departureTime?: string
  status: "registered" | "arrived" | "departed"
  qrCode: string
  photo?: string
  emergencyContact?: {
    name: string
    phone: string
  }
  isDisabled?: boolean
  disabilityType?: string
  needsAssistance?: boolean
  assistanceDetails?: string
}

type Scenario = {
  id: number
  name: string
  description: string
  type: "fire" | "medical" | "evacuation" | "security" | "other"
  steps: string[]
  notifyRoles: string[]
  priority: "low" | "medium" | "high" | "critical"
}

type ActiveIncident = {
  id: number
  type: string
  location: string
  status: "active" | "responding" | "resolved"
  startTime: string
  scenario: string
  responders: number[]
  priority: "low" | "medium" | "high" | "critical"
  notes: string[]
}

type DisabledPerson = {
  id: number
  name: string
  type: "permanent" | "temporary"
  startDate?: string
  endDate?: string
  location: string
  needsAssistance: boolean
  assistanceDetails: string
  assistedBy?: number[]
  phone: string
  photoUrl?: string
}

export default function BHVAanwezigheidPage() {
  const { selectedCustomer } = useCustomer()
  const [bhvMembers, setBhvMembers] = useState<BHVMember[]>([])
  const [visitors, setVisitors] = useState<Visitor[]>([])
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [activeIncidents, setActiveIncidents] = useState<ActiveIncident[]>([])
  const [disabledPersons, setDisabledPersons] = useState<DisabledPerson[]>([])
  const [activeTab, setActiveTab] = useState("aanwezigheid")
  const [isScenarioDialogOpen, setIsScenarioDialogOpen] = useState(false)
  const [isVisitorDialogOpen, setIsVisitorDialogOpen] = useState(false)
  const [isCertificateDialogOpen, setIsCertificateDialogOpen] = useState(false)
  const [isQRDialogOpen, setIsQRDialogOpen] = useState(false)
  const [isDisabledPersonDialogOpen, setIsDisabledPersonDialogOpen] = useState(false)
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null)
  const [selectedMember, setSelectedMember] = useState<BHVMember | null>(null)
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null)
  const [selectedDisabledPerson, setSelectedDisabledPerson] = useState<DisabledPerson | null>(null)
  const [selectedLocation, setSelectedLocation] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isPublicDisplayMode, setIsPublicDisplayMode] = useState(false)
  const [isCommunicationActive, setIsCommunicationActive] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<
    { id: number; sender: string; text: string; time: string; isSystem?: boolean }[]
  >([])
  const [newVisitor, setNewVisitor] = useState({
    name: "",
    company: "",
    purpose: "",
    host: "",
    emergencyContact: { name: "", phone: "" },
    isDisabled: false,
    disabilityType: "",
    needsAssistance: false,
    assistanceDetails: "",
  })
  const [newDisabledPerson, setNewDisabledPerson] = useState({
    name: "",
    type: "permanent",
    startDate: "",
    endDate: "",
    location: "",
    needsAssistance: true,
    assistanceDetails: "",
    phone: "",
  })
  const [autoDetection, setAutoDetection] = useState({
    wifi: true,
    gps: true,
    nfc: true,
    bluetooth: false,
  })

  // Dummy data
  useEffect(() => {
    if (selectedCustomer) {
      setBhvMembers([
        {
          id: 1,
          name: "Jan Jansen",
          role: "EHBO, BHV",
          status: "available",
          location: "Verdieping 2, Kantoor 2.15",
          lastSeen: "2 minuten geleden",
          phone: "06-12345678",
          email: "jan.jansen@company.com",
          photoUrl: "/placeholder.svg?height=100&width=100",
          detectionMethod: "wifi",
          certificates: {
            bhv: {
              valid: true,
              expiryDate: "2024-12-15",
              level: "Basis",
              certificateNumber: "BHV-2023-45678",
              fileUrl: "/certificates/bhv-janjansen.pdf",
            },
            ehbo: {
              valid: true,
              expiryDate: "2024-10-20",
              level: "Diploma",
              certificateNumber: "EHBO-2023-12345",
              fileUrl: "/certificates/ehbo-janjansen.pdf",
            },
          },
          emergencyContact: {
            name: "Marie Jansen",
            phone: "06-87654321",
            relation: "Echtgenote",
          },
        },
        {
          id: 2,
          name: "Petra de Vries",
          role: "Ploegleider",
          status: "onduty",
          location: "Verdieping 1, Receptie",
          lastSeen: "1 minuut geleden",
          phone: "06-23456789",
          email: "petra.devries@company.com",
          photoUrl: "/placeholder.svg?height=100&width=100",
          detectionMethod: "nfc",
          certificates: {
            bhv: {
              valid: true,
              expiryDate: "2025-03-10",
              level: "Ploegleider",
              certificateNumber: "BHV-PL-2023-78901",
              fileUrl: "/certificates/bhv-petradevries.pdf",
            },
            ehbo: {
              valid: true,
              expiryDate: "2024-11-05",
              level: "Diploma",
              certificateNumber: "EHBO-2023-23456",
              fileUrl: "/certificates/ehbo-petradevries.pdf",
            },
            ontruiming: {
              valid: true,
              expiryDate: "2025-01-15",
              certificateNumber: "ONT-2023-34567",
              fileUrl: "/certificates/ont-petradevries.pdf",
            },
          },
          emergencyContact: {
            name: "Piet de Vries",
            phone: "06-11223344",
            relation: "Echtgenoot",
          },
          isPloegleider: true,
        },
        {
          id: 3,
          name: "Mohammed El Amrani",
          role: "BHV, Ontruimer",
          status: "available",
          location: "Verdieping 3, Vergaderzaal 3.04",
          lastSeen: "5 minuten geleden",
          phone: "06-34567890",
          email: "mohammed.elamrani@company.com",
          photoUrl: "/placeholder.svg?height=100&width=100",
          detectionMethod: "gps",
          certificates: {
            bhv: {
              valid: true,
              expiryDate: "2024-08-30",
              level: "Basis",
              certificateNumber: "BHV-2023-56789",
              fileUrl: "/certificates/bhv-mohammedelamrani.pdf",
            },
            ontruiming: {
              valid: true,
              expiryDate: "2024-12-01",
              certificateNumber: "ONT-2023-45678",
              fileUrl: "/certificates/ont-mohammedelamrani.pdf",
            },
          },
          emergencyContact: {
            name: "Fatima El Amrani",
            phone: "06-99887766",
            relation: "Echtgenote",
          },
        },
        {
          id: 4,
          name: "Sarah Bakker",
          role: "EHBO",
          status: "unavailable",
          location: "Buiten het gebouw",
          lastSeen: "30 minuten geleden",
          phone: "06-45678901",
          email: "sarah.bakker@company.com",
          photoUrl: "/placeholder.svg?height=100&width=100",
          detectionMethod: "manual",
          certificates: {
            ehbo: {
              valid: false,
              expiryDate: "2024-02-15",
              level: "Basis",
              certificateNumber: "EHBO-2022-34567",
              fileUrl: "/certificates/ehbo-sarahbakker.pdf",
            },
          },
          emergencyContact: {
            name: "Tom Bakker",
            phone: "06-55443322",
            relation: "Partner",
          },
        },
        {
          id: 5,
          name: "Pieter van Dijk",
          role: "BHV",
          status: "responding",
          location: "Verdieping 4, onderweg naar incident",
          lastSeen: "Nu",
          phone: "06-56789012",
          email: "pieter.vandijk@company.com",
          photoUrl: "/placeholder.svg?height=100&width=100",
          detectionMethod: "gps",
          certificates: {
            bhv: {
              valid: true,
              expiryDate: "2025-06-20",
              level: "Basis",
              certificateNumber: "BHV-2023-67890",
              fileUrl: "/certificates/bhv-pietervandijk.pdf",
            },
          },
          emergencyContact: {
            name: "Linda van Dijk",
            phone: "06-77889900",
            relation: "Zus",
          },
        },
        {
          id: 6,
          name: "Annemarie Visser",
          role: "Coördinator BHV",
          status: "available",
          location: "Verdieping 2, Kantoor 2.05",
          lastSeen: "5 minuten geleden",
          phone: "06-67890123",
          email: "annemarie.visser@company.com",
          photoUrl: "/placeholder.svg?height=100&width=100",
          detectionMethod: "wifi",
          certificates: {
            bhv: {
              valid: true,
              expiryDate: "2025-08-15",
              level: "Coördinator",
              certificateNumber: "BHV-COORD-2023-12345",
              fileUrl: "/certificates/bhv-annemarievisser.pdf",
            },
            ehbo: {
              valid: true,
              expiryDate: "2025-07-10",
              level: "Instructeur",
              certificateNumber: "EHBO-INST-2023-23456",
              fileUrl: "/certificates/ehbo-annemarievisser.pdf",
            },
            ontruiming: {
              valid: true,
              expiryDate: "2025-09-20",
              certificateNumber: "ONT-COORD-2023-34567",
              fileUrl: "/certificates/ont-annemarievisser.pdf",
            },
          },
          emergencyContact: {
            name: "Hans Visser",
            phone: "06-33445566",
            relation: "Echtgenoot",
          },
          isCoordinator: true,
        },
      ])

      setVisitors([
        {
          id: 1,
          name: "John Smith",
          company: "ABC Company",
          purpose: "Leverancier",
          host: "Jan Jansen",
          arrivalTime: "09:30",
          status: "arrived",
          qrCode: "QR123456789",
          photo: "/placeholder.svg?height=100&width=100",
          emergencyContact: {
            name: "Jane Smith",
            phone: "+31-6-12345678",
          },
        },
        {
          id: 2,
          name: "Maria Garcia",
          company: "XYZ Corp",
          purpose: "Klant",
          host: "Petra de Vries",
          arrivalTime: "10:15",
          status: "arrived",
          qrCode: "QR987654321",
          photo: "/placeholder.svg?height=100&width=100",
          emergencyContact: {
            name: "Carlos Garcia",
            phone: "+31-6-87654321",
          },
          isDisabled: true,
          disabilityType: "Rolstoelgebruiker",
          needsAssistance: true,
          assistanceDetails: "Hulp nodig bij evacuatie via de trap",
        },
        {
          id: 3,
          name: "David Johnson",
          company: "Tech Solutions",
          purpose: "Onderhoud",
          host: "Mohammed El Amrani",
          arrivalTime: "08:45",
          departureTime: "11:30",
          status: "departed",
          qrCode: "QR456789123",
          photo: "/placeholder.svg?height=100&width=100",
        },
      ])

      setDisabledPersons([
        {
          id: 1,
          name: "Emma de Boer",
          type: "permanent",
          location: "Verdieping 3, Kantoor 3.12",
          needsAssistance: true,
          assistanceDetails: "Rolstoelgebruiker, heeft hulp nodig bij evacuatie via de trap",
          assistedBy: [2, 3],
          phone: "06-12345678",
          photoUrl: "/placeholder.svg?height=100&width=100",
        },
        {
          id: 2,
          name: "Thomas Hendriks",
          type: "temporary",
          startDate: "2023-10-15",
          endDate: "2024-01-15",
          location: "Verdieping 1, Kantoor 1.05",
          needsAssistance: true,
          assistanceDetails: "Gebroken been, gebruikt krukken, kan niet snel trappen af",
          assistedBy: [1],
          phone: "06-23456789",
          photoUrl: "/placeholder.svg?height=100&width=100",
        },
        {
          id: 3,
          name: "Sophie van Dijk",
          type: "permanent",
          location: "Verdieping 2, Kantoor 2.20",
          needsAssistance: true,
          assistanceDetails: "Slechtziend, heeft begeleiding nodig bij evacuatie",
          assistedBy: [5],
          phone: "06-34567890",
          photoUrl: "/placeholder.svg?height=100&width=100",
        },
      ])

      setScenarios([
        {
          id: 1,
          name: "Brand",
          description: "Scenario voor het melden en afhandelen van een brand.",
          type: "fire",
          priority: "critical",
          steps: [
            "Alarmeer aanwezige BHV-ers",
            "Informeer receptie",
            "Start ontruiming indien nodig",
            "Bel 112 indien nodig",
          ],
          notifyRoles: ["Ploegleider", "BHV", "Ontruimer"],
        },
        {
          id: 2,
          name: "Medisch incident",
          description: "Scenario voor het afhandelen van een medisch incident.",
          type: "medical",
          priority: "high",
          steps: ["Alarmeer EHBO-ers in de buurt", "Informeer receptie", "Bel 112 indien nodig"],
          notifyRoles: ["EHBO", "Ploegleider"],
        },
        {
          id: 3,
          name: "Ontruiming",
          description: "Scenario voor het ontruimen van het gebouw.",
          type: "evacuation",
          priority: "critical",
          steps: [
            "Alarmeer alle BHV-ers",
            "Start ontruimingsalarm",
            "Controleer alle ruimtes",
            "Verzamel op verzamelplaats",
            "Doe aanwezigheidscontrole",
          ],
          notifyRoles: ["Ploegleider", "BHV", "Ontruimer"],
        },
        {
          id: 4,
          name: "Inbraak/Beveiliging",
          description: "Scenario voor het afhandelen van een beveiligingsincident.",
          type: "security",
          priority: "medium",
          steps: ["Informeer beveiliging", "Alarmeer ploegleider", "Bel 112 indien nodig", "Beveilig toegangsdeuren"],
          notifyRoles: ["Ploegleider"],
        },
      ])

      setActiveIncidents([
        {
          id: 1,
          type: "Brand",
          location: "Verdieping 3, Vleugel B",
          status: "active",
          startTime: "10:15",
          scenario: "Brand",
          responders: [2, 5],
          priority: "critical",
          notes: ["Rook gedetecteerd in serverruimte", "Brandweer onderweg"],
        },
        {
          id: 2,
          type: "EHBO",
          location: "Verdieping 1, Kantine",
          status: "responding",
          startTime: "09:45",
          scenario: "Medisch incident",
          responders: [1],
          priority: "high",
          notes: ["Persoon gevallen", "Bewustzijn aanwezig"],
        },
      ])

      // Initial system messages
      setMessages([
        {
          id: 1,
          sender: "Systeem",
          text: "Welkom bij het BHV360 communicatiesysteem. Gebruik dit kanaal voor BHV-gerelateerde communicatie.",
          time: "09:30",
          isSystem: true,
        },
        {
          id: 2,
          sender: "Petra de Vries",
          text: "Goedemorgen allemaal, ik ben vandaag ploegleider van dienst.",
          time: "09:35",
        },
        {
          id: 3,
          sender: "Systeem",
          text: "ALARM: Brand gemeld op Verdieping 3, Vleugel B",
          time: "10:15",
          isSystem: true,
        },
        {
          id: 4,
          sender: "Petra de Vries",
          text: "Ik ga erheen, wie kan er assisteren?",
          time: "10:16",
        },
        {
          id: 5,
          sender: "Pieter van Dijk",
          text: "Ik ben onderweg naar Verdieping 3",
          time: "10:17",
        },
      ])
    }
  }, [selectedCustomer])

  const handleActivateScenario = () => {
    if (selectedScenario && selectedLocation) {
      const newIncident: ActiveIncident = {
        id: Date.now(),
        type: selectedScenario.name,
        location: selectedLocation,
        status: "active",
        startTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        scenario: selectedScenario.name,
        responders: [],
        priority: selectedScenario.priority,
        notes: [`Scenario geactiveerd: ${selectedScenario.description}`],
      }

      setActiveIncidents([...activeIncidents, newIncident])

      const newMessage = {
        id: Date.now(),
        sender: "Systeem",
        text: `ALARM: ${selectedScenario.name} gemeld op ${selectedLocation}`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isSystem: true,
      }
      setMessages([...messages, newMessage])

      setIsScenarioDialogOpen(false)
      setSelectedScenario(null)
      setSelectedLocation("")
      setActiveTab("incidenten")
    }
  }

  const handleRegisterVisitor = () => {
    if (newVisitor.name && newVisitor.company) {
      const visitor: Visitor = {
        id: Date.now(),
        name: newVisitor.name,
        company: newVisitor.company,
        purpose: newVisitor.purpose,
        host: newVisitor.host,
        arrivalTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        status: "registered",
        qrCode: `QR${Date.now()}`,
        emergencyContact: newVisitor.emergencyContact.name ? newVisitor.emergencyContact : undefined,
        isDisabled: newVisitor.isDisabled,
        disabilityType: newVisitor.disabilityType,
        needsAssistance: newVisitor.needsAssistance,
        assistanceDetails: newVisitor.assistanceDetails,
      }

      setVisitors([...visitors, visitor])
      setSelectedVisitor(visitor)
      setIsVisitorDialogOpen(false)
      setIsQRDialogOpen(true)

      setNewVisitor({
        name: "",
        company: "",
        purpose: "",
        host: "",
        emergencyContact: { name: "", phone: "" },
        isDisabled: false,
        disabilityType: "",
        needsAssistance: false,
        assistanceDetails: "",
      })
    }
  }

  const handleAddDisabledPerson = () => {
    if (newDisabledPerson.name && newDisabledPerson.location) {
      const disabledPerson: DisabledPerson = {
        id: Date.now(),
        name: newDisabledPerson.name,
        type: newDisabledPerson.type as "permanent" | "temporary",
        startDate: newDisabledPerson.startDate || undefined,
        endDate: newDisabledPerson.endDate || undefined,
        location: newDisabledPerson.location,
        needsAssistance: newDisabledPerson.needsAssistance,
        assistanceDetails: newDisabledPerson.assistanceDetails,
        phone: newDisabledPerson.phone,
        photoUrl: "/placeholder.svg?height=100&width=100",
      }

      setDisabledPersons([...disabledPersons, disabledPerson])
      setNewDisabledPerson({
        name: "",
        type: "permanent",
        startDate: "",
        endDate: "",
        location: "",
        needsAssistance: true,
        assistanceDetails: "",
        phone: "",
      })
      setIsDisabledPersonDialogOpen(false)
    }
  }

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: Date.now(),
        sender: "Jij",
        text: message,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages([...messages, newMessage])
      setMessage("")
    }
  }

  const generateVisitorQR = (visitor: Visitor) => {
    // In a real app, this would generate an actual QR code
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="white"/>
        <text x="100" y="100" textAnchor="middle" fontFamily="Arial" fontSize="12">
          QR: ${visitor.qrCode}
        </text>
        <text x="100" y="120" textAnchor="middle" fontFamily="Arial" fontSize="10">
          ${visitor.name}
        </text>
      </svg>
    `)}`
  }

  const filteredBhvMembers = bhvMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500"
      case "unavailable":
        return "bg-gray-500"
      case "responding":
        return "bg-orange-500"
      case "onduty":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "available":
        return "Beschikbaar"
      case "unavailable":
        return "Niet beschikbaar"
      case "responding":
        return "Reageert op incident"
      case "onduty":
        return "Van dienst"
      default:
        return "Onbekend"
    }
  }

  const getDetectionIcon = (method: string) => {
    switch (method) {
      case "wifi":
        return <Wifi className="h-4 w-4" />
      case "gps":
        return <MapPin className="h-4 w-4" />
      case "nfc":
        return <Smartphone className="h-4 w-4" />
      case "manual":
        return <UserCheck className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getCertificateStatus = (certificate: any) => {
    if (!certificate) return { icon: <XCircle className="h-4 w-4 text-gray-400" />, text: "Geen certificaat" }
    if (!certificate.valid) return { icon: <XCircle className="h-4 w-4 text-red-500" />, text: "Verlopen" }

    const expiryDate = new Date(certificate.expiryDate)
    const today = new Date()
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 3600 * 24))

    if (daysUntilExpiry <= 30) {
      return {
        icon: <AlertCircle className="h-4 w-4 text-orange-500" />,
        text: `Verloopt over ${daysUntilExpiry} dagen`,
      }
    }

    return { icon: <CheckCircle className="h-4 w-4 text-green-500" />, text: "Geldig" }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  if (!selectedCustomer) {
    return (
      <div className="flex h-full items-center justify-center">
        <Card className="w-[450px]">
          <CardHeader>
            <CardTitle>Geen klant geselecteerd</CardTitle>
            <CardDescription>Selecteer een klant om BHV aanwezigheid te bekijken</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (isPublicDisplayMode) {
    return (
      <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">BHV360 Aanwezigheid - {selectedCustomer.name}</h1>
          <Button onClick={() => setIsPublicDisplayMode(false)}>Beheerweergave</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="col-span-1">
            <CardHeader className="bg-blue-50">
              <CardTitle className="flex items-center">
                <UserCheck className="mr-2 h-6 w-6 text-blue-600" />
                BHV'ers van dienst
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {bhvMembers
                  .filter((member) => member.status === "onduty")
                  .map((member) => (
                    <div key={member.id} className="flex items-center space-x-4 p-3 bg-blue-50 rounded-md">
                      <Avatar className="h-12 w-12 border-2 border-blue-500">
                        <AvatarImage src={member.photoUrl || "/placeholder.svg"} alt={member.name} />
                        <AvatarFallback>
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                  ))}
                {bhvMembers.filter((member) => member.status === "onduty").length === 0 && (
                  <div className="text-center py-6 text-muted-foreground">
                    <UserX className="mx-auto h-12 w-12 mb-2" />
                    <p>Geen BHV'ers van dienst</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader className="bg-green-50">
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-6 w-6 text-green-600" />
                Beschikbare BHV'ers
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {bhvMembers
                  .filter((member) => member.status === "available")
                  .map((member) => (
                    <div key={member.id} className="flex items-center space-x-4 p-3 bg-green-50 rounded-md">
                      <Avatar className="h-12 w-12 border-2 border-green-500">
                        <AvatarImage src={member.photoUrl || "/placeholder.svg"} alt={member.name} />
                        <AvatarFallback>
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                  ))}
                {bhvMembers.filter((member) => member.status === "available").length === 0 && (
                  <div className="text-center py-6 text-muted-foreground">
                    <UserX className="mx-auto h-12 w-12 mb-2" />
                    <p>Geen beschikbare BHV'ers</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {activeIncidents.length > 0 && (
          <Card className="mt-6">
            <CardHeader className="bg-red-50">
              <CardTitle className="flex items-center text-red-700">
                <AlertTriangle className="mr-2 h-6 w-6 text-red-600" />
                Actieve Incidenten
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {activeIncidents.map((incident) => (
                  <div key={incident.id} className="p-4 border border-red-200 bg-red-50 rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">{incident.type}</h3>
                        <p className="text-sm text-muted-foreground">{incident.location}</p>
                        <p className="text-sm">Gestart om {incident.startTime}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${getPriorityColor(incident.priority)}`} />
                        <Badge
                          variant={
                            incident.status === "active"
                              ? "destructive"
                              : incident.status === "responding"
                                ? "default"
                                : "outline"
                          }
                        >
                          {incident.status === "active"
                            ? "Actief"
                            : incident.status === "responding"
                              ? "In behandeling"
                              : "Opgelost"}
                        </Badge>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">Responders:</p>
                      <div className="flex flex-wrap gap-2">
                        {incident.responders.map((responderId) => {
                          const responder = bhvMembers.find((m) => m.id === responderId)
                          return responder ? (
                            <div key={responderId} className="flex items-center space-x-2 bg-white p-2 rounded-md">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={responder.photoUrl || "/placeholder.svg"} alt={responder.name} />
                                <AvatarFallback>
                                  {responder.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm">{responder.name}</span>
                            </div>
                          ) : null
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="mt-6">
          <CardHeader className="bg-purple-50">
            <CardTitle className="flex items-center">
              <Wheelchair className="mr-2 h-6 w-6 text-purple-600" />
              Mindervaliden in het gebouw
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {disabledPersons.map((person) => (
                <div key={person.id} className="p-4 border border-purple-100 bg-purple-50 rounded-md">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12 border-2 border-purple-300">
                      <AvatarImage src={person.photoUrl || "/placeholder.svg"} alt={person.name} />
                      <AvatarFallback>
                        {person.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{person.name}</h3>
                      <p className="text-sm text-muted-foreground">{person.location}</p>
                      <Badge variant="outline" className="mt-1">
                        {person.type === "permanent" ? "Permanent" : "Tijdelijk"}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
              {visitors
                .filter((visitor) => visitor.isDisabled && visitor.status === "arrived")
                .map((visitor) => (
                  <div key={visitor.id} className="p-4 border border-purple-100 bg-purple-50 rounded-md">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12 border-2 border-purple-300">
                        <AvatarImage src={visitor.photo || "/placeholder.svg"} alt={visitor.name} />
                        <AvatarFallback>
                          {visitor.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{visitor.name}</h3>
                        <p className="text-sm text-muted-foreground">Bezoeker - {visitor.disabilityType}</p>
                        <Badge variant="outline" className="mt-1">
                          Bezoeker
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              {disabledPersons.length === 0 &&
                visitors.filter((visitor) => visitor.isDisabled && visitor.status === "arrived").length === 0 && (
                  <div className="text-center py-6 text-muted-foreground">
                    <Wheelchair className="mx-auto h-12 w-12 mb-2" />
                    <p>Geen mindervaliden geregistreerd in het gebouw</p>
                  </div>
                )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">BHV360 Aanwezigheid & Communicatie - {selectedCustomer.name}</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setIsPublicDisplayMode(true)}>
            <Eye className="mr-2 h-4 w-4" />
            Publieke Weergave
          </Button>
          <Button variant="outline" onClick={() => window.open("/display/bhv-status", "_blank")}>
            <ExternalLink className="mr-2 h-4 w-4" />
            Externe Display
          </Button>
          <Dialog open={isScenarioDialogOpen} onOpenChange={setIsScenarioDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Bell className="mr-2 h-4 w-4" />
                Scenario Activeren
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Scenario Activeren</DialogTitle>
                <DialogDescription>Selecteer een scenario en locatie om een alarm te activeren.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="scenario">Scenario</Label>
                  <Select
                    onValueChange={(value) => {
                      const scenario = scenarios.find((s) => s.id.toString() === value)
                      setSelectedScenario(scenario || null)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecteer een scenario" />
                    </SelectTrigger>
                    <SelectContent>
                      {scenarios.map((scenario) => (
                        <SelectItem key={scenario.id} value={scenario.id.toString()}>
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${getPriorityColor(scenario.priority)}`} />
                            <span>{scenario.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Locatie</Label>
                  <Input
                    id="location"
                    placeholder="Bijv. Verdieping 2, Kantoor 2.15"
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                  />
                </div>
                {selectedScenario && (
                  <div className="space-y-2">
                    <Label>Scenario Details</Label>
                    <div className="p-3 bg-gray-50 rounded-md">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className={`w-3 h-3 rounded-full ${getPriorityColor(selectedScenario.priority)}`} />
                        <span className="text-sm font-medium capitalize">{selectedScenario.priority} prioriteit</span>
                      </div>
                      <p className="text-sm font-medium">{selectedScenario.description}</p>
                      <div className="mt-2">
                        <p className="text-xs font-medium text-gray-600">Stappen:</p>
                        <ul className="text-xs text-gray-600 list-disc list-inside">
                          {selectedScenario.steps.map((step, index) => (
                            <li key={index}>{step}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-2">
                        <p className="text-xs font-medium text-gray-600">Te informeren rollen:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedScenario.notifyRoles.map((role, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsScenarioDialogOpen(false)}>
                  Annuleren
                </Button>
                <Button onClick={handleActivateScenario} disabled={!selectedScenario || !selectedLocation}>
                  Activeren
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="aanwezigheid">Aanwezigheid</TabsTrigger>
          <TabsTrigger value="certificaten">Certificaten</TabsTrigger>
          <TabsTrigger value="incidenten">Incidenten</TabsTrigger>
          <TabsTrigger value="communicatie">Communicatie</TabsTrigger>
          <TabsTrigger value="bezoekers">Bezoekers</TabsTrigger>
          <TabsTrigger value="mindervaliden">Mindervaliden</TabsTrigger>
        </TabsList>

        <TabsContent value="aanwezigheid" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <Input
                placeholder="Zoek BHV'ers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64"
              />
            </div>
            <div className="flex items-center space-x-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="mr-2 h-4 w-4" />
                    Detectie-instellingen
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Automatische Detectie Instellingen</DialogTitle>
                    <DialogDescription>
                      Configureer welke methoden gebruikt worden voor automatische aanwezigheidsdetectie.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Wifi className="h-4 w-4" />
                        <Label>WiFi Detectie</Label>
                      </div>
                      <Switch
                        checked={autoDetection.wifi}
                        onCheckedChange={(checked) => setAutoDetection({ ...autoDetection, wifi: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <Label>GPS Detectie</Label>
                      </div>
                      <Switch
                        checked={autoDetection.gps}
                        onCheckedChange={(checked) => setAutoDetection({ ...autoDetection, gps: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Smartphone className="h-4 w-4" />
                        <Label>NFC Detectie</Label>
                      </div>
                      <Switch
                        checked={autoDetection.nfc}
                        onCheckedChange={(checked) => setAutoDetection({ ...autoDetection, nfc: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Smartphone className="h-4 w-4" />
                        <Label>Bluetooth Detectie</Label>
                      </div>
                      <Switch
                        checked={autoDetection.bluetooth}
                        onCheckedChange={(checked) => setAutoDetection({ ...autoDetection, bluetooth: checked })}
                      />
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <div className="text-sm text-muted-foreground">
                Totaal: {bhvMembers.length} | Beschikbaar: {bhvMembers.filter((m) => m.status === "available").length}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBhvMembers.map((member) => (
              <Card key={member.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={member.photoUrl || "/placeholder.svg"} alt={member.name} />
                      <AvatarFallback>
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-base flex items-center">
                        {member.name}
                        {member.isCoordinator && <Star className="h-4 w-4 ml-1 text-yellow-500" />}
                        {member.isPloegleider && <Shield className="h-4 w-4 ml-1 text-blue-500" />}
                      </CardTitle>
                      <CardDescription className="text-sm">{member.role}</CardDescription>
                    </div>
                    <div className="flex items-center space-x-1">
                      {getDetectionIcon(member.detectionMethod)}
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(member.status)}`} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge
                        variant={
                          member.status === "available"
                            ? "default"
                            : member.status === "onduty"
                              ? "secondary"
                              : member.status === "responding"
                                ? "destructive"
                                : "outline"
                        }
                      >
                        {getStatusText(member.status)}
                      </Badge>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Mail className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-sm">
                      <p className="flex items-center text-muted-foreground">
                        <MapPin className="h-3 w-3 mr-1" />
                        {member.location}
                      </p>
                      <p className="flex items-center text-muted-foreground mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        {member.lastSeen}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 text-xs">
                      {member.certificates.bhv && (
                        <div className="flex items-center space-x-1">
                          <Shield className="h-3 w-3" />
                          {getCertificateStatus(member.certificates.bhv).icon}
                        </div>
                      )}
                      {member.certificates.ehbo && (
                        <div className="flex items-center space-x-1">
                          <Heart className="h-3 w-3" />
                          {getCertificateStatus(member.certificates.ehbo).icon}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="certificaten" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Certificaten Overzicht</h2>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exporteer Rapport
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bhvMembers.map((member) => (
              <Card key={member.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={member.photoUrl || "/placeholder.svg"} alt={member.name} />
                      <AvatarFallback>
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-base flex items-center">
                        {member.name}
                        {member.isCoordinator && <Star className="h-4 w-4 ml-1 text-yellow-500" />}
                        {member.isPloegleider && <Shield className="h-4 w-4 ml-1 text-blue-500" />}
                      </CardTitle>
                      <CardDescription className="text-sm">{member.role}</CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedMember(member)
                        setIsCertificateDialogOpen(true)
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {member.certificates.bhv && (
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                        <div className="flex items-center space-x-2">
                          <Shield className="h-4 w-4" />
                          <div>
                            <p className="text-sm font-medium">BHV</p>
                            <p className="text-xs text-muted-foreground">{member.certificates.bhv.level}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          {getCertificateStatus(member.certificates.bhv).icon}
                          <span className="text-xs">{member.certificates.bhv.expiryDate}</span>
                        </div>
                      </div>
                    )}

                    {member.certificates.ehbo && (
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                        <div className="flex items-center space-x-2">
                          <Heart className="h-4 w-4" />
                          <div>
                            <p className="text-sm font-medium">EHBO</p>
                            <p className="text-xs text-muted-foreground">{member.certificates.ehbo.level}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          {getCertificateStatus(member.certificates.ehbo).icon}
                          <span className="text-xs">{member.certificates.ehbo.expiryDate}</span>
                        </div>
                      </div>
                    )}

                    {member.certificates.ontruiming && (
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4" />
                          <div>
                            <p className="text-sm font-medium">Ontruiming</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          {getCertificateStatus(member.certificates.ontruiming).icon}
                          <span className="text-xs">{member.certificates.ontruiming.expiryDate}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Dialog open={isCertificateDialogOpen} onOpenChange={setIsCertificateDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Certificaten Details - {selectedMember?.name}</DialogTitle>
                <DialogDescription>Overzicht van alle certificaten en contactgegevens</DialogDescription>
              </DialogHeader>
              {selectedMember && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={selectedMember.photoUrl || "/placeholder.svg"} alt={selectedMember.name} />
                      <AvatarFallback>
                        {selectedMember.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold flex items-center">
                        {selectedMember.name}
                        {selectedMember.isCoordinator && <Star className="h-4 w-4 ml-1 text-yellow-500" />}
                        {selectedMember.isPloegleider && <Shield className="h-4 w-4 ml-1 text-blue-500" />}
                      </h3>
                      <p className="text-muted-foreground">{selectedMember.role}</p>
                      <p className="text-sm">
                        {selectedMember.phone} • {selectedMember.email}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Certificaten</h4>
                    {selectedMember.certificates.bhv && (
                      <div className="p-4 border rounded-md">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Shield className="h-5 w-5" />
                            <span className="font-medium">BHV Certificaat</span>
                          </div>
                          {getCertificateStatus(selectedMember.certificates.bhv).icon}
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Niveau</p>
                            <p>{selectedMember.certificates.bhv.level}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Vervaldatum</p>
                            <p>{selectedMember.certificates.bhv.expiryDate}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Certificaatnummer</p>
                            <p>{selectedMember.certificates.bhv.certificateNumber || "Niet geregistreerd"}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2 mt-3">
                          <Button size="sm" variant="outline">
                            <FileText className="mr-2 h-4 w-4" />
                            Bekijk Certificaat
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                        </div>
                      </div>
                    )}

                    {selectedMember.certificates.ehbo && (
                      <div className="p-4 border rounded-md">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Heart className="h-5 w-5" />
                            <span className="font-medium">EHBO Certificaat</span>
                          </div>
                          {getCertificateStatus(selectedMember.certificates.ehbo).icon}
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Niveau</p>
                            <p>{selectedMember.certificates.ehbo.level}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Vervaldatum</p>
                            <p>{selectedMember.certificates.ehbo.expiryDate}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Certificaatnummer</p>
                            <p>{selectedMember.certificates.ehbo.certificateNumber || "Niet geregistreerd"}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2 mt-3">
                          <Button size="sm" variant="outline">
                            <FileText className="mr-2 h-4 w-4" />
                            Bekijk Certificaat
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                        </div>
                      </div>
                    )}

                    {selectedMember.certificates.ontruiming && (
                      <div className="p-4 border rounded-md">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Users className="h-5 w-5" />
                            <span className="font-medium">Ontruiming Certificaat</span>
                          </div>
                          {getCertificateStatus(selectedMember.certificates.ontruiming).icon}
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Vervaldatum</p>
                            <p>{selectedMember.certificates.ontruiming.expiryDate}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Certificaatnummer</p>
                            <p>{selectedMember.certificates.ontruiming.certificateNumber || "Niet geregistreerd"}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2 mt-3">
                          <Button size="sm" variant="outline">
                            <FileText className="mr-2 h-4 w-4" />
                            Bekijk Certificaat
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Noodcontact</h4>
                    <div className="p-4 bg-gray-50 rounded-md">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Naam</p>
                          <p>{selectedMember.emergencyContact.name}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Relatie</p>
                          <p>{selectedMember.emergencyContact.relation}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-muted-foreground">Telefoon</p>
                          <p>{selectedMember.emergencyContact.phone}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="incidenten" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Actieve Incidenten</h2>
            <Badge variant="outline">{activeIncidents.length} actief</Badge>
          </div>

          {activeIncidents.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Geen actieve incidenten</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {activeIncidents.map((incident) => (
                <Card key={incident.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center">
                          <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
                          {incident.type}
                        </CardTitle>
                        <CardDescription>{incident.location}</CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${getPriorityColor(incident.priority)}`} />
                        <Badge
                          variant={
                            incident.status === "active"
                              ? "destructive"
                              : incident.status === "responding"
                                ? "default"
                                : "outline"
                          }
                        >
                          {incident.status === "active"
                            ? "Actief"
                            : incident.status === "responding"
                              ? "In behandeling"
                              : "Opgelost"}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>Gestart om {incident.startTime}</span>
                        <span>•</span>
                        <span>Scenario: {incident.scenario}</span>
                        <span>•</span>
                        <span className="capitalize">{incident.priority} prioriteit</span>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-2">Responders ({incident.responders.length}):</p>
                        <div className="flex flex-wrap gap-2">
                          {incident.responders.map((responderId) => {
                            const responder = bhvMembers.find((m) => m.id === responderId)
                            return responder ? (
                              <div key={responderId} className="flex items-center space-x-2 bg-gray-100 p-2 rounded-md">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={responder.photoUrl || "/placeholder.svg"} alt={responder.name} />
                                  <AvatarFallback>
                                    {responder.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm">{responder.name}</span>
                              </div>
                            ) : null
                          })}
                        </div>
                      </div>

                      {incident.notes.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-2">Notities:</p>
                          <div className="space-y-1">
                            {incident.notes.map((note, index) => (
                              <p key={index} className="text-sm text-muted-foreground">
                                • {note}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          Details
                        </Button>
                        <Button size="sm" variant="outline">
                          Responder toevoegen
                        </Button>
                        <Button size="sm" variant="outline">
                          Notitie toevoegen
                        </Button>
                        {incident.status === "active" && <Button size="sm">Markeer als opgelost</Button>}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="communicatie" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">BHV360 Communicatie</h2>
            <div className="flex space-x-2">
              <Button
                variant={isCommunicationActive ? "destructive" : "default"}
                onClick={() => setIsCommunicationActive(!isCommunicationActive)}
              >
                <Smartphone className="mr-2 h-4 w-4" />
                {isCommunicationActive ? "Stop Push-to-Talk" : "Start Push-to-Talk"}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Smartphone className="mr-2 h-5 w-5" />
                  Berichten
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === "Jij" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                          msg.isSystem
                            ? "bg-yellow-100 text-yellow-800"
                            : msg.sender === "Jij"
                              ? "bg-blue-500 text-white"
                              : "bg-gray-100"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-xs font-medium opacity-75">{msg.sender}</p>
                            <p className="text-sm">{msg.text}</p>
                          </div>
                          <span className="text-xs opacity-50 ml-2">{msg.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex space-x-2 mt-4">
                  <Input
                    placeholder="Typ een bericht..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage} disabled={!message.trim()}>
                    <Smartphone className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Online BHV'ers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {bhvMembers
                    .filter(
                      (member) =>
                        member.status === "available" || member.status === "onduty" || member.status === "responding",
                    )
                    .map((member) => (
                      <div key={member.id} className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.photoUrl || "/placeholder.svg"} alt={member.name} />
                          <AvatarFallback>
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.role}</p>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(member.status)}`} />
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="bezoekers" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Bezoekersregistratie</h2>
            <Dialog open={isVisitorDialogOpen} onOpenChange={setIsVisitorDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Users className="mr-2 h-4 w-4" />
                  Nieuwe bezoeker
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nieuwe bezoeker registreren</DialogTitle>
                  <DialogDescription>Vul de gegevens van de bezoeker in om deze te registreren.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="visitor-name">Naam</Label>
                      <Input
                        id="visitor-name"
                        value={newVisitor.name}
                        onChange={(e) => setNewVisitor({ ...newVisitor, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="visitor-company">Bedrijf</Label>
                      <Input
                        id="visitor-company"
                        value={newVisitor.company}
                        onChange={(e) => setNewVisitor({ ...newVisitor, company: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="visitor-purpose">Doel bezoek</Label>
                      <Input
                        id="visitor-purpose"
                        value={newVisitor.purpose}
                        onChange={(e) => setNewVisitor({ ...newVisitor, purpose: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="visitor-host">Gastheer</Label>
                      <Input
                        id="visitor-host"
                        value={newVisitor.host}
                        onChange={(e) => setNewVisitor({ ...newVisitor, host: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="visitor-disabled"
                        checked={newVisitor.isDisabled}
                        onChange={(e) => setNewVisitor({ ...newVisitor, isDisabled: e.target.checked })}
                      />
                      <Label htmlFor="visitor-disabled">Bezoeker heeft een beperking</Label>
                    </div>
                  </div>
                  {newVisitor.isDisabled && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="visitor-disability-type">Type beperking</Label>
                        <Input
                          id="visitor-disability-type"
                          value={newVisitor.disabilityType}
                          onChange={(e) => setNewVisitor({ ...newVisitor, disabilityType: e.target.value })}
                          placeholder="Bijv. Rolstoelgebruiker, slechtziend, etc."
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="visitor-needs-assistance"
                            checked={newVisitor.needsAssistance}
                            onChange={(e) => setNewVisitor({ ...newVisitor, needsAssistance: e.target.checked })}
                          />
                          <Label htmlFor="visitor-needs-assistance">Heeft hulp nodig bij evacuatie</Label>
                        </div>
                      </div>
                      {newVisitor.needsAssistance && (
                        <div className="space-y-2">
                          <Label htmlFor="visitor-assistance-details">Hulp details</Label>
                          <Input
                            id="visitor-assistance-details"
                            value={newVisitor.assistanceDetails}
                            onChange={(e) => setNewVisitor({ ...newVisitor, assistanceDetails: e.target.value })}
                            placeholder="Beschrijf welke hulp nodig is"
                          />
                        </div>
                      )}
                    </>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="visitor-emergency-name">Noodcontact naam</Label>
                      <Input
                        id="visitor-emergency-name"
                        value={newVisitor.emergencyContact.name}
                        onChange={(e) =>
                          setNewVisitor({
                            ...newVisitor,
                            emergencyContact: { ...newVisitor.emergencyContact, name: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="visitor-emergency-phone">Noodcontact telefoon</Label>
                      <Input
                        id="visitor-emergency-phone"
                        value={newVisitor.emergencyContact.phone}
                        onChange={(e) =>
                          setNewVisitor({
                            ...newVisitor,
                            emergencyContact: { ...newVisitor.emergencyContact, phone: e.target.value },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsVisitorDialogOpen(false)}>
                    Annuleren
                  </Button>
                  <Button onClick={handleRegisterVisitor}>Registreren</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visitors.map((visitor) => (
              <Card key={visitor.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={visitor.photo || "/placeholder.svg"} alt={visitor.name} />
                      <AvatarFallback>
                        {visitor.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-base flex items-center">
                        {visitor.name}
                        {visitor.isDisabled && <Wheelchair className="h-4 w-4 ml-1 text-purple-500" />}
                      </CardTitle>
                      <CardDescription className="text-sm">{visitor.company}</CardDescription>
                    </div>
                    <Badge
                      variant={
                        visitor.status === "arrived"
                          ? "default"
                          : visitor.status === "departed"
                            ? "outline"
                            : "secondary"
                      }
                    >
                      {visitor.status === "arrived"
                        ? "Aanwezig"
                        : visitor.status === "departed"
                          ? "Vertrokken"
                          : "Geregistreerd"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div className="text-sm">
                      <p>
                        <strong>Doel:</strong> {visitor.purpose}
                      </p>
                      <p>
                        <strong>Gastheer:</strong> {visitor.host}
                      </p>
                      <p>
                        <strong>Aankomst:</strong> {visitor.arrivalTime}
                      </p>
                      {visitor.departureTime && (
                        <p>
                          <strong>Vertrek:</strong> {visitor.departureTime}
                        </p>
                      )}
                    </div>
                    {visitor.isDisabled && (
                      <div className="p-2 bg-purple-50 rounded-md">
                        <p className="text-sm font-medium text-purple-800">Beperking: {visitor.disabilityType}</p>
                        {visitor.needsAssistance && (
                          <p className="text-xs text-purple-600">Hulp nodig: {visitor.assistanceDetails}</p>
                        )}
                      </div>
                    )}
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedVisitor(visitor)
                          setIsQRDialogOpen(true)
                        }}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        QR Code
                      </Button>
                      <Button size="sm" variant="outline">
                        <Phone className="mr-2 h-4 w-4" />
                        Contact
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Dialog open={isQRDialogOpen} onOpenChange={setIsQRDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>QR Code - {selectedVisitor?.name}</DialogTitle>
                <DialogDescription>QR code voor bezoeker identificatie</DialogDescription>
              </DialogHeader>
              {selectedVisitor && (
                <div className="flex flex-col items-center space-y-4">
                  <img
                    src={generateVisitorQR(selectedVisitor) || "/placeholder.svg"}
                    alt="QR Code"
                    className="w-48 h-48 border"
                  />
                  <div className="text-center">
                    <p className="font-medium">{selectedVisitor.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedVisitor.company}</p>
                    <p className="text-xs text-muted-foreground">QR: {selectedVisitor.qrCode}</p>
                  </div>
                  <Button onClick={() => window.print()}>
                    <Download className="mr-2 h-4 w-4" />
                    Print QR Code
                  </Button>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="mindervaliden" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Minder- en Tijdelijk Mindervaliden</h2>
            <Dialog open={isDisabledPersonDialogOpen} onOpenChange={setIsDisabledPersonDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Wheelchair className="mr-2 h-4 w-4" />
                  Persoon toevoegen
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Mindervalide persoon toevoegen</DialogTitle>
                  <DialogDescription>Registreer een persoon die hulp nodig heeft bij evacuatie.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="disabled-name">Naam</Label>
                      <Input
                        id="disabled-name"
                        value={newDisabledPerson.name}
                        onChange={(e) => setNewDisabledPerson({ ...newDisabledPerson, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="disabled-type">Type</Label>
                      <Select
                        value={newDisabledPerson.type}
                        onValueChange={(value) => setNewDisabledPerson({ ...newDisabledPerson, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="permanent">Permanent</SelectItem>
                          <SelectItem value="temporary">Tijdelijk</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {newDisabledPerson.type === "temporary" && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="disabled-start-date">Startdatum</Label>
                        <Input
                          id="disabled-start-date"
                          type="date"
                          value={newDisabledPerson.startDate}
                          onChange={(e) => setNewDisabledPerson({ ...newDisabledPerson, startDate: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="disabled-end-date">Einddatum</Label>
                        <Input
                          id="disabled-end-date"
                          type="date"
                          value={newDisabledPerson.endDate}
                          onChange={(e) => setNewDisabledPerson({ ...newDisabledPerson, endDate: e.target.value })}
                        />
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="disabled-location">Locatie</Label>
                      <Input
                        id="disabled-location"
                        value={newDisabledPerson.location}
                        onChange={(e) => setNewDisabledPerson({ ...newDisabledPerson, location: e.target.value })}
                        placeholder="Bijv. Verdieping 2, Kantoor 2.15"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="disabled-phone">Telefoon</Label>
                      <Input
                        id="disabled-phone"
                        value={newDisabledPerson.phone}
                        onChange={(e) => setNewDisabledPerson({ ...newDisabledPerson, phone: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="disabled-assistance-details">Hulp details</Label>
                    <Input
                      id="disabled-assistance-details"
                      value={newDisabledPerson.assistanceDetails}
                      onChange={(e) =>
                        setNewDisabledPerson({ ...newDisabledPerson, assistanceDetails: e.target.value })
                      }
                      placeholder="Beschrijf welke hulp nodig is bij evacuatie"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDisabledPersonDialogOpen(false)}>
                    Annuleren
                  </Button>
                  <Button onClick={handleAddDisabledPerson}>Toevoegen</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wheelchair className="mr-2 h-5 w-5 text-purple-600" />
                  Permanente Beperkingen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {disabledPersons
                    .filter((person) => person.type === "permanent")
                    .map((person) => (
                      <div key={person.id} className="p-4 border border-purple-200 bg-purple-50 rounded-md">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={person.photoUrl || "/placeholder.svg"} alt={person.name} />
                            <AvatarFallback>
                              {person.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h3 className="font-medium">{person.name}</h3>
                            <p className="text-sm text-muted-foreground">{person.location}</p>
                            <p className="text-sm text-muted-foreground">{person.phone}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedDisabledPerson(person)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="mt-3 p-2 bg-white rounded-md">
                          <p className="text-sm">
                            <strong>Hulp nodig:</strong> {person.assistanceDetails}
                          </p>
                          {person.assistedBy && person.assistedBy.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs font-medium text-gray-600">Assistenten:</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {person.assistedBy.map((assistantId) => {
                                  const assistant = bhvMembers.find((m) => m.id === assistantId)
                                  return assistant ? (
                                    <Badge key={assistantId} variant="outline" className="text-xs">
                                      {assistant.name}
                                    </Badge>
                                  ) : null
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  {disabledPersons.filter((person) => person.type === "permanent").length === 0 && (
                    <div className="text-center py-6 text-muted-foreground">
                      <Wheelchair className="mx-auto h-12 w-12 mb-2" />
                      <p>Geen permanente beperkingen geregistreerd</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-orange-600" />
                  Tijdelijke Beperkingen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {disabledPersons
                    .filter((person) => person.type === "temporary")
                    .map((person) => (
                      <div key={person.id} className="p-4 border border-orange-200 bg-orange-50 rounded-md">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={person.photoUrl || "/placeholder.svg"} alt={person.name} />
                            <AvatarFallback>
                              {person.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h3 className="font-medium">{person.name}</h3>
                            <p className="text-sm text-muted-foreground">{person.location}</p>
                            <p className="text-sm text-muted-foreground">{person.phone}</p>
                            {person.startDate && person.endDate && (
                              <p className="text-xs text-orange-600">
                                {person.startDate} tot {person.endDate}
                              </p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedDisabledPerson(person)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="mt-3 p-2 bg-white rounded-md">
                          <p className="text-sm">
                            <strong>Hulp nodig:</strong> {person.assistanceDetails}
                          </p>
                          {person.assistedBy && person.assistedBy.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs font-medium text-gray-600">Assistenten:</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {person.assistedBy.map((assistantId) => {
                                  const assistant = bhvMembers.find((m) => m.id === assistantId)
                                  return assistant ? (
                                    <Badge key={assistantId} variant="outline" className="text-xs">
                                      {assistant.name}
                                    </Badge>
                                  ) : null
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  {disabledPersons.filter((person) => person.type === "temporary").length === 0 && (
                    <div className="text-center py-6 text-muted-foreground">
                      <Clock className="mx-auto h-12 w-12 mb-2" />
                      <p>Geen tijdelijke beperkingen geregistreerd</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5 text-blue-600" />
                  Bezoekers met Beperkingen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {visitors
                    .filter((visitor) => visitor.isDisabled && visitor.status === "arrived")
                    .map((visitor) => (
                      <div key={visitor.id} className="p-4 border border-blue-200 bg-blue-50 rounded-md">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={visitor.photo || "/placeholder.svg"} alt={visitor.name} />
                            <AvatarFallback>
                              {visitor.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h3 className="font-medium">{visitor.name}</h3>
                            <p className="text-sm text-muted-foreground">{visitor.company}</p>
                            <p className="text-sm text-muted-foreground">Gastheer: {visitor.host}</p>
                            <Badge variant="outline" className="mt-1">
                              Bezoeker
                            </Badge>
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-white rounded-md">
                          <p className="text-sm">
                            <strong>Beperking:</strong> {visitor.disabilityType}
                          </p>
                          {visitor.needsAssistance && visitor.assistanceDetails && (
                            <p className="text-sm">
                              <strong>Hulp nodig:</strong> {visitor.assistanceDetails}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  {visitors.filter((visitor) => visitor.isDisabled && visitor.status === "arrived").length === 0 && (
                    <div className="text-center py-6 text-muted-foreground">
                      <Users className="mx-auto h-12 w-12 mb-2" />
                      <p>Geen bezoekers met beperkingen aanwezig</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
