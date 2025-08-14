"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useCustomer } from "@/components/customer-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { EmailLink } from "@/components/ui/email-link"
import {
  Edit,
  UserPlus,
  Mail,
  Phone,
  Shield,
  Upload,
  X,
  Heart,
  Users,
  ShipWheelIcon as Wheelchair,
  Clock,
  Calendar,
  Star,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Play,
  Map,
  SearchIcon,
  Filter,
  Download,
  MapPin,
  Settings,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { BHV360Logo } from "@/components/bhv360-logo"
import { RBACService, type UserRole } from "@/lib/rbac/roles"

type User = {
  id: number
  name: string
  email: string
  phone: string
  role: string
  department: string
  bhvRoles: string[]
  active: boolean
  lastLogin: string
  photoUrl?: string
  emergencyContact: {
    name: string
    phone: string
    relation: string
  }
  certificates: {
    bhv?: { valid: boolean; expiryDate: string; level: string; certificateNumber: string }
    ehbo?: { valid: boolean; expiryDate: string; level: string; certificateNumber: string }
    ontruiming?: { valid: boolean; expiryDate: string; certificateNumber: string }
    ploegleider?: { valid: boolean; expiryDate: string; certificateNumber: string }
    coordinator?: { valid: boolean; expiryDate: string; certificateNumber: string }
  }
  accessibility?: {
    isMindervalide: boolean
    isTijdelijkMindervalide: boolean
    assistanceNeeded: string
    evacuationPlan: string
    notes: string
    startDate?: string
    endDate?: string
  }
  workSchedule?: {
    monday: { start: string; end: string; present: boolean }
    tuesday: { start: string; end: string; present: boolean }
    wednesday: { start: string; end: string; present: boolean }
    thursday: { start: string; end: string; present: boolean }
    friday: { start: string; end: string; present: boolean }
    saturday: { start: string; end: string; present: boolean }
    sunday: { start: string; end: string; present: boolean }
  }
  status?: string
  certifications?: string[]
  avatar?: string
  limitations?: string
}

// Mock data voor gebruikers
const mockUsers = [
  {
    id: 1,
    name: "Jan Jansen",
    email: "j.jansen@example.com",
    phone: "+31 6 12345678",
    role: "BHV Coördinator",
    department: "Facilitair",
    status: "Actief",
    lastLogin: "2024-01-15",
    certifications: ["BHV Basis", "EHBO", "AED"],
    avatar: "/placeholder-user.jpg",
    bhvRoles: ["Coordinator BHV"],
    active: true,
    emergencyContact: { name: "", phone: "", relation: "" },
    certificates: {},
  },
  {
    id: 2,
    name: "Maria de Vries",
    email: "m.devries@example.com",
    phone: "+31 6 87654321",
    role: "BHV'er",
    department: "HR",
    status: "Actief",
    lastLogin: "2024-01-14",
    certifications: ["BHV Basis", "EHBO"],
    avatar: "/placeholder-user.jpg",
    bhvRoles: ["BHV"],
    active: true,
    emergencyContact: { name: "", phone: "", relation: "" },
    certificates: {},
  },
  {
    id: 3,
    name: "Peter Bakker",
    email: "p.bakker@example.com",
    phone: "+31 6 11223344",
    role: "Ploegleider",
    department: "Operations",
    status: "Inactief",
    lastLogin: "2024-01-10",
    certifications: ["BHV Basis", "EHBO", "AED", "Ontruiming"],
    avatar: "/placeholder-user.jpg",
    bhvRoles: ["Ploegleider"],
    active: false,
    emergencyContact: { name: "", phone: "", relation: "" },
    certificates: {},
  },
  {
    id: 4,
    name: "Lisa van der Berg",
    email: "l.vandenberg@example.com",
    phone: "+31 6 55667788",
    role: "Medewerker",
    department: "IT",
    status: "Actief",
    lastLogin: "2024-01-15",
    certifications: [],
    avatar: "/placeholder-user.jpg",
    bhvRoles: [],
    active: true,
    emergencyContact: { name: "", phone: "", relation: "" },
    certificates: {},
  },
  {
    id: 5,
    name: "Tom Hendriks",
    email: "t.hendriks@example.com",
    phone: "+31 6 99887766",
    role: "BHV'er",
    department: "Productie",
    status: "Actief",
    lastLogin: "2024-01-13",
    certifications: ["BHV Basis"],
    avatar: "/placeholder-user.jpg",
    bhvRoles: ["BHV"],
    active: true,
    emergencyContact: { name: "", phone: "", relation: "" },
    certificates: {},
  },
]

const mockMindervalidenUsers = [
  {
    id: 6,
    name: "Anna Smit",
    email: "a.smit@example.com",
    phone: "+31 6 44556677",
    department: "Administratie",
    limitations: "Rolstoel gebruiker",
    evacuationPlan: "Lift naar begane grond, verzamelpunt A",
    emergencyContact: "Familie: +31 6 12345678",
    notes: "Heeft hulp nodig bij evacuatie",
    avatar: "/placeholder-user.jpg",
    bhvRoles: [],
    active: true,
    certificates: {},
  },
  {
    id: 7,
    name: "Robert de Jong",
    email: "r.dejong@example.com",
    phone: "+31 6 33445566",
    department: "Marketing",
    limitations: "Slechtziend",
    evacuationPlan: "Begeleiding via hoofdroute, verzamelpunt B",
    emergencyContact: "Partner: +31 6 87654321",
    notes: "Heeft geleidehond, kent routes goed",
    avatar: "/placeholder-user.jpg",
    bhvRoles: [],
    active: true,
    certificates: {},
  },
]

const features = [
  {
    icon: Map,
    title: "Interactieve Plotkaarten",
    description: "Digitale plattegronden met alle BHV voorzieningen en evacuatieroutes",
  },
  {
    icon: Shield,
    title: "BHV Beheer",
    description: "Complete administratie van BHV'ers, certificaten en roosters",
  },
  {
    icon: AlertTriangle,
    title: "Incident Management",
    description: "Realtime incident registratie en opvolging",
  },
  {
    icon: Users,
    title: "Gebruikersbeheer",
    description: "Rol-gebaseerde toegang en autorisaties",
  },
]

const pricing = [
  {
    name: "Starter",
    price: "€49",
    period: "/maand",
    description: "Perfect voor kleine bedrijven",
    features: ["Tot 50 gebruikers", "Basis plotkaarten", "Email support", "Standaard rapportages"],
    popular: false,
  },
  {
    name: "Professional",
    price: "€149",
    period: "/maand",
    description: "Voor groeiende organisaties",
    features: [
      "Tot 250 gebruikers",
      "Geavanceerde plotkaarten",
      "Priority support",
      "Custom rapportages",
      "API toegang",
      "White-label optie",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Op maat",
    period: "",
    description: "Voor grote organisaties",
    features: [
      "Onbeperkt gebruikers",
      "Alle functies",
      "24/7 support",
      "Dedicated account manager",
      "Custom integraties",
      "On-premise optie",
    ],
    popular: false,
  },
]

const testimonials = [
  {
    name: "Jan van der Berg",
    role: "BHV Coördinator",
    company: "TechCorp Nederland",
    content: "BHV360 heeft onze BHV organisatie volledig getransformeerd. Alles is nu digitaal en overzichtelijk.",
    rating: 5,
  },
  {
    name: "Maria Janssen",
    role: "Facility Manager",
    company: "HealthCare Plus",
    content: "De plotkaarten zijn fantastisch. Onze medewerkers weten nu precies waar alles staat.",
    rating: 5,
  },
]

export default function GebruikersPage() {
  const { user } = useAuth()
  const { selectedCustomer } = useCustomer()
  const [users, setUsers] = useState<User[]>([])
  const [activeTab, setActiveTab] = useState("alle-gebruikers")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isAccessibilityDialogOpen, setIsAccessibilityDialogOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [filterRole, setFilterRole] = useState("all")
  const [filterDepartment, setFilterDepartment] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [email, setEmail] = useState("")

  const [selectedCertificates, setSelectedCertificates] = useState<{ [key: string]: boolean }>({})
  const [certificateFiles, setCertificateFiles] = useState<{ [key: string]: File | null }>({})
  const [certificateData, setCertificateData] = useState<{
    [key: string]: {
      expiryDate: string
      certificateNumber: string
      level: string
    }
  }>({})

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTab, setSelectedTab] = useState("all")

  // Check of huidige gebruiker BHV rollen mag toekennen
  const canAssignBHVRoles = user ? RBACService.canAssignBHVRoles(user.role as UserRole) : false

  // Dummy data for users - Security heeft GEEN BHV rechten
  useEffect(() => {
    if (selectedCustomer) {
      setUsers([
        {
          id: 1,
          name: "Jan Jansen",
          email: "j.jansen@example.com",
          phone: "06-12345678",
          role: "BHV Coordinator",
          department: "IT",
          bhvRoles: ["EHBO", "BHV", "Coordinator BHV"],
          active: true,
          lastLogin: "2023-06-09 14:30",
          photoUrl: "/placeholder.svg?height=100&width=100",
          emergencyContact: {
            name: "Marie Jansen",
            phone: "06-87654321",
            relation: "Echtgenote",
          },
          certificates: {
            bhv: { valid: true, expiryDate: "2024-12-15", level: "Basis", certificateNumber: "BHV-2023-001" },
            ehbo: { valid: true, expiryDate: "2024-10-20", level: "Diploma", certificateNumber: "EHBO-2023-001" },
            coordinator: { valid: true, expiryDate: "2025-03-10", certificateNumber: "COORD-2023-001" },
          },
          workSchedule: {
            monday: { start: "08:00", end: "17:00", present: true },
            tuesday: { start: "08:00", end: "17:00", present: true },
            wednesday: { start: "08:00", end: "17:00", present: true },
            thursday: { start: "08:00", end: "17:00", present: true },
            friday: { start: "08:00", end: "16:00", present: true },
            saturday: { start: "", end: "", present: false },
            sunday: { start: "", end: "", present: false },
          },
          status: "Actief",
          certifications: ["BHV Basis", "EHBO", "AED"],
          avatar: "/placeholder-user.jpg",
        },
        {
          id: 2,
          name: "Petra de Vries",
          email: "p.devries@example.com",
          phone: "06-23456789",
          role: "Ploegleider",
          department: "HR",
          bhvRoles: ["Ploegleider", "EHBO"],
          active: true,
          lastLogin: "2023-06-08 09:15",
          photoUrl: "/placeholder.svg?height=100&width=100",
          emergencyContact: {
            name: "Piet de Vries",
            phone: "06-11223344",
            relation: "Echtgenoot",
          },
          certificates: {
            bhv: { valid: true, expiryDate: "2025-03-10", level: "Ploegleider", certificateNumber: "BHV-2023-002" },
            ehbo: { valid: true, expiryDate: "2024-11-05", level: "Diploma", certificateNumber: "EHBO-2023-002" },
            ploegleider: { valid: true, expiryDate: "2025-01-15", certificateNumber: "PLOEG-2023-001" },
          },
          workSchedule: {
            monday: { start: "09:00", end: "18:00", present: true },
            tuesday: { start: "09:00", end: "18:00", present: true },
            wednesday: { start: "09:00", end: "18:00", present: true },
            thursday: { start: "09:00", end: "18:00", present: true },
            friday: { start: "09:00", end: "17:00", present: true },
            saturday: { start: "", end: "", present: false },
            sunday: { start: "", end: "", present: false },
          },
          status: "Actief",
          certifications: ["BHV Basis", "EHBO"],
          avatar: "/placeholder-user.jpg",
        },
        {
          id: 3,
          name: "Mohammed El Amrani",
          email: "m.elamrani@example.com",
          phone: "06-34567890",
          role: "Ontruimer",
          department: "Facilitair",
          bhvRoles: ["BHV", "Ontruimer"],
          active: true,
          lastLogin: "2023-06-07 16:45",
          photoUrl: "/placeholder.svg?height=100&width=100",
          emergencyContact: {
            name: "Fatima El Amrani",
            phone: "06-99887766",
            relation: "Echtgenote",
          },
          certificates: {
            bhv: { valid: true, expiryDate: "2024-08-30", level: "Basis", certificateNumber: "BHV-2023-003" },
            ontruiming: { valid: true, expiryDate: "2024-12-01", certificateNumber: "ONT-2023-001" },
          },
          workSchedule: {
            monday: { start: "07:00", end: "16:00", present: true },
            tuesday: { start: "07:00", end: "16:00", present: true },
            wednesday: { start: "07:00", end: "16:00", present: true },
            thursday: { start: "07:00", end: "16:00", present: true },
            friday: { start: "07:00", end: "15:00", present: true },
            saturday: { start: "", end: "", present: false },
            sunday: { start: "", end: "", present: false },
          },
          status: "Actief",
          certifications: ["BHV Basis"],
          avatar: "/placeholder-user.jpg",
        },
        {
          id: 4,
          name: "Sarah Bakker",
          email: "s.bakker@example.com",
          phone: "06-45678901",
          role: "EHBO'er",
          department: "Receptie",
          bhvRoles: ["EHBO"],
          active: false,
          lastLogin: "2023-05-30 11:20",
          photoUrl: "/placeholder.svg?height=100&width=100",
          emergencyContact: {
            name: "Tom Bakker",
            phone: "06-55443322",
            relation: "Partner",
          },
          certificates: {
            ehbo: { valid: false, expiryDate: "2024-02-15", level: "Basis", certificateNumber: "EHBO-2023-003" },
          },
          workSchedule: {
            monday: { start: "08:30", end: "17:30", present: true },
            tuesday: { start: "08:30", end: "17:30", present: true },
            wednesday: { start: "08:30", end: "17:30", present: true },
            thursday: { start: "08:30", end: "17:30", present: true },
            friday: { start: "08:30", end: "16:30", present: true },
            saturday: { start: "", end: "", present: false },
            sunday: { start: "", end: "", present: false },
          },
          status: "Inactief",
          certifications: ["EHBO"],
          avatar: "/placeholder-user.jpg",
        },
        {
          id: 5,
          name: "Lisa van der Berg",
          email: "l.vandenberg@example.com",
          phone: "06-56789012",
          role: "Gebruiker",
          department: "Marketing",
          bhvRoles: [],
          active: true,
          lastLogin: "2023-06-09 10:15",
          photoUrl: "/placeholder.svg?height=100&width=100",
          emergencyContact: {
            name: "Mark van der Berg",
            phone: "06-77889900",
            relation: "Broer",
          },
          certificates: {},
          accessibility: {
            isMindervalide: true,
            isTijdelijkMindervalide: false,
            assistanceNeeded: "Rolstoel gebruiker, heeft hulp nodig bij evacuatie",
            evacuationPlan: "Evacuatiestoel beschikbaar op verdieping 2, hulp van 2 personen vereist",
            notes: "Kan niet zelfstandig trappen gebruiken",
          },
          workSchedule: {
            monday: { start: "09:00", end: "17:00", present: true },
            tuesday: { start: "09:00", end: "17:00", present: true },
            wednesday: { start: "09:00", end: "17:00", present: true },
            thursday: { start: "09:00", end: "17:00", present: true },
            friday: { start: "09:00", end: "16:00", present: true },
            saturday: { start: "", end: "", present: false },
            sunday: { start: "", end: "", present: false },
          },
          status: "Actief",
          certifications: [],
          avatar: "/placeholder-user.jpg",
        },
        {
          id: 6,
          name: "David Smit",
          email: "d.smit@example.com",
          phone: "06-67890123",
          role: "Gebruiker",
          department: "Verkoop",
          bhvRoles: [],
          active: true,
          lastLogin: "2023-06-08 14:20",
          photoUrl: "/placeholder.svg?height=100&width=100",
          emergencyContact: {
            name: "Anna Smit",
            phone: "06-88990011",
            relation: "Echtgenote",
          },
          certificates: {},
          accessibility: {
            isMindervalide: false,
            isTijdelijkMindervalide: true,
            assistanceNeeded: "Gebroken been, loopt met krukken",
            evacuationPlan: "Heeft extra tijd nodig, kan langzaam lopen met ondersteuning",
            notes: "Tijdelijk beperkt mobiel door ongeval",
            startDate: "2023-05-15",
            endDate: "2023-07-15",
          },
          workSchedule: {
            monday: { start: "09:30", end: "17:30", present: true },
            tuesday: { start: "09:30", end: "17:30", present: true },
            wednesday: { start: "09:30", end: "17:30", present: true },
            thursday: { start: "09:30", end: "17:30", present: true },
            friday: { start: "09:30", end: "16:30", present: true },
            saturday: { start: "", end: "", present: false },
            sunday: { start: "", end: "", present: false },
          },
          status: "Actief",
          certifications: [],
          avatar: "/placeholder-user.jpg",
        },
        // Sandra Beveiliging - GEEN BHV rechten standaard
        {
          id: 7,
          name: "Sandra Beveiliging",
          email: "security@demobedrijf.nl",
          phone: "06-78901234",
          role: "Security/Receptionist",
          department: "Beveiliging",
          bhvRoles: [], // GEEN BHV rechten standaard
          active: true,
          lastLogin: "2023-06-09 08:00",
          photoUrl: "/placeholder.svg?height=100&width=100",
          emergencyContact: {
            name: "Peter Beveiliging",
            phone: "06-99001122",
            relation: "Partner",
          },
          certificates: {},
          workSchedule: {
            monday: { start: "06:00", end: "14:00", present: true },
            tuesday: { start: "06:00", end: "14:00", present: true },
            wednesday: { start: "06:00", end: "14:00", present: true },
            thursday: { start: "06:00", end: "14:00", present: true },
            friday: { start: "06:00", end: "14:00", present: true },
            saturday: { start: "06:00", end: "14:00", present: true },
            sunday: { start: "", end: "", present: false },
          },
          status: "Actief",
          certifications: [],
          avatar: "/placeholder-user.jpg",
        },
      ])
    }
  }, [selectedCustomer])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)

      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const clearSelectedFile = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
  }

  const handleCertificateToggle = (role: string, checked: boolean) => {
    setSelectedCertificates((prev) => ({
      ...prev,
      [role]: checked,
    }))

    if (!checked) {
      // Clear certificate data when unchecked
      setCertificateData((prev) => {
        const newData = { ...prev }
        delete newData[role]
        return newData
      })
      setCertificateFiles((prev) => {
        const newFiles = { ...prev }
        delete newFiles[role]
        return newFiles
      })
    }
  }

  const handleCertificateFileChange = (role: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setCertificateFiles((prev) => ({
        ...prev,
        [role]: file,
      }))
    }
  }

  const handleCertificateDataChange = (role: string, field: string, value: string) => {
    setCertificateData((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [field]: value,
      },
    }))
  }

  const getCertificateStatus = (certificate: any) => {
    if (!certificate) return { status: "none", color: "gray", text: "Geen certificaat" }

    const expiryDate = new Date(certificate.expiryDate)
    const today = new Date()
    const monthsUntilExpiry = (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30)

    if (expiryDate < today) {
      return { status: "expired", color: "red", text: "Verlopen" }
    } else if (monthsUntilExpiry <= 3) {
      return { status: "expiring", color: "orange", text: "Verloopt binnenkort" }
    } else {
      return { status: "valid", color: "green", text: "Geldig" }
    }
  }

  const handleAddUser = () => {
    setIsAddDialogOpen(false)
  }

  const handleEditUser = (user: User) => {
    setCurrentUser(user)
    setPreviewUrl(user.photoUrl || null)
    setIsEditDialogOpen(true)
  }

  const handleUpdateUser = () => {
    setIsEditDialogOpen(false)
  }

  const handleDeleteUser = (userId: number) => {
    setUsers(users.filter((user) => user.id !== userId))
  }

  const handleAccessibilityEdit = (user: User) => {
    setCurrentUser(user)
    setIsAccessibilityDialogOpen(true)
  }

  const getBHVRoleBadgeColor = (role: string) => {
    switch (role) {
      case "Coordinator BHV":
        return "bg-purple-100 text-purple-800"
      case "Ploegleider":
        return "bg-blue-100 text-blue-800"
      case "BHV":
        return "bg-green-100 text-green-800"
      case "EHBO":
        return "bg-red-100 text-red-800"
      case "Ontruimer":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getBHVRoleIcon = (role: string) => {
    switch (role) {
      case "Coordinator BHV":
        return <Star className="h-3 w-3" />
      case "Ploegleider":
        return <Shield className="h-3 w-3" />
      case "BHV":
        return <Shield className="h-3 w-3" />
      case "EHBO":
        return <Heart className="h-3 w-3" />
      case "Ontruimer":
        return <Users className="h-3 w-3" />
      default:
        return null
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRole =
      filterRole === "all" ||
      user.bhvRoles.includes(filterRole) ||
      (filterRole === "Gebruiker" && user.bhvRoles.length === 0)

    const matchesDepartment = filterDepartment === "all" || user.department === filterDepartment

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && user.active) ||
      (filterStatus === "inactive" && !user.active)

    return matchesSearch && matchesRole && matchesDepartment && matchesStatus
  })

  const bhvUsers = users.filter((user) => user.bhvRoles.length > 0)
  const mindervalideUsers = users.filter(
    (user) => user.accessibility?.isMindervalide || user.accessibility?.isTijdelijkMindervalide,
  )

  const filteredUsersNew = mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredMindervalidenUsers = mockMindervalidenUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Actief":
        return "bg-green-100 text-green-800"
      case "Inactief":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRoleIconNew = (role: string) => {
    switch (role) {
      case "BHV Coördinator":
        return <Shield className="h-4 w-4 text-blue-600" />
      case "Ploegleider":
        return <Users className="h-4 w-4 text-purple-600" />
      case "BHV'er":
        return <AlertTriangle className="h-4 w-4 text-orange-600" />
      default:
        return <Users className="h-4 w-4 text-gray-600" />
    }
  }

  if (!selectedCustomer) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        {/* Header */}
        <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <BHV360Logo size="lg" />
            <div className="flex items-center gap-4">
              {user ? (
                <Link href="/dashboard">
                  <Button>
                    Naar Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost">Inloggen</Button>
                  </Link>
                  <Button>Gratis Demo</Button>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <Badge className="mb-4" variant="secondary">
              🚀 Nieuw: AI-powered incident detectie
            </Badge>
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              De toekomst van BHV beheer
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Digitaliseer je BHV organisatie met onze complete software suite. Van plotkaarten tot incident management
              - alles in één platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8">
                <Play className="mr-2 h-5 w-5" />
                Bekijk Demo
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
                Gratis Trial Starten
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Alles wat je nodig hebt</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Een complete suite van tools om je BHV organisatie professioneel te beheren
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <feature.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Transparante prijzen</h2>
              <p className="text-gray-600">Kies het plan dat bij jouw organisatie past</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {pricing.map((plan, index) => (
                <Card key={index} className={`relative ${plan.popular ? "border-blue-500 shadow-lg scale-105" : ""}`}>
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">Meest Populair</Badge>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <div className="text-3xl font-bold text-blue-600">
                      {plan.price}
                      <span className="text-sm text-gray-500">{plan.period}</span>
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                      {plan.name === "Enterprise" ? "Contact Opnemen" : "Gratis Proberen"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Wat onze klanten zeggen</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-gray-500">{testimonial.role}</div>
                      <div className="text-sm text-gray-500">{testimonial.company}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-green-600 text-white">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Klaar om te beginnen?</h2>
            <p className="text-xl mb-8 opacity-90">Start vandaag nog met je gratis trial en ervaar het verschil</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Input
                placeholder="Je email adres"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white text-gray-900"
              />
              <Button size="lg" variant="secondary">
                Start Gratis Trial
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12 px-4">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <BHV360Logo size="md" variant="white" />
                <p className="text-gray-400 mt-4">De complete BHV software suite voor moderne organisaties</p>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Product</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <Link href="#" className="hover:text-white">
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white">
                      Prijzen
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white">
                      Demo
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Support</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <Link href="#" className="hover:text-white">
                      Help Center
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white">
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white">
                      Status
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Contact</h3>
                <div className="space-y-2 text-gray-400">
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>033-4614303</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    <EmailLink
                      email="info@BHV360.nl"
                      subject="Informatie BHV360"
                      body="Hallo,%0A%0AIk zou graag meer informatie ontvangen over BHV360.%0A%0AMet vriendelijke groet,"
                      className="text-gray-400 hover:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 BHV360. Alle rechten voorbehouden.</p>
            </div>
          </div>
        </footer>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gebruikers Beheer - {selectedCustomer.name}</h1>
          <p className="text-gray-600 mt-1">Beheer alle gebruikers en hun toegangsrechten</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Nieuwe Gebruiker
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Nieuwe Gebruiker Toevoegen</DialogTitle>
                <DialogDescription>Vul de gegevens in om een nieuwe gebruiker aan te maken.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="relative">
                      {previewUrl ? (
                        <div className="relative">
                          <img
                            src={previewUrl || "/placeholder.svg"}
                            alt="Preview"
                            className="h-32 w-32 rounded-full object-cover border-2 border-gray-200"
                          />
                          <button
                            onClick={clearSelectedFile}
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center">
                          <Upload className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="photo" className="cursor-pointer text-sm text-blue-600">
                        Foto uploaden
                      </Label>
                      <Input id="photo" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </div>
                    <p className="text-xs text-gray-500">Max. 5MB (JPG, PNG)</p>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Naam</Label>
                      <Input id="name" placeholder="Volledige naam" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mailadres</Label>
                      <Input id="email" type="email" placeholder="email@voorbeeld.nl" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefoonnummer</Label>
                      <Input id="phone" placeholder="06-12345678" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Hoofdrol</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecteer een rol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="bhv-coordinator">BHV Coordinator</SelectItem>
                        <SelectItem value="ploegleider">Ploegleider</SelectItem>
                        <SelectItem value="bhv">BHV'er</SelectItem>
                        <SelectItem value="ehbo">EHBO'er</SelectItem>
                        <SelectItem value="ontruimer">Ontruimer</SelectItem>
                        <SelectItem value="security-receptionist">Security/Receptionist</SelectItem>
                        <SelectItem value="user">Gebruiker</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Afdeling</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecteer een afdeling" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IT">IT</SelectItem>
                        <SelectItem value="HR">HR</SelectItem>
                        <SelectItem value="Facilitair">Facilitair</SelectItem>
                        <SelectItem value="Beveiliging">Beveiliging</SelectItem>
                        <SelectItem value="Receptie">Receptie</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Verkoop">Verkoop</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* BHV Rollen sectie - alleen zichtbaar voor admin/bhv-coordinator */}
                {canAssignBHVRoles && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>BHV Rollen & Certificaten</Label>
                      <Badge variant="outline" className="text-xs">
                        <Shield className="h-3 w-3 mr-1" />
                        Alleen Admin/BHV Coordinator
                      </Badge>
                    </div>
                    <div className="space-y-4">
                      {[
                        { id: "coordinator-bhv", label: "Coordinator BHV", icon: Star, role: "coordinator" },
                        { id: "ploegleider", label: "Ploegleider", icon: Shield, role: "ploegleider" },
                        { id: "bhv", label: "BHV", icon: Shield, role: "bhv" },
                        { id: "ehbo", label: "EHBO", icon: Heart, role: "ehbo" },
                        { id: "ontruimer", label: "Ontruimer", icon: Users, role: "ontruiming" },
                      ].map(({ id, label, icon: Icon, role }) => (
                        <div key={id} className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={id}
                              checked={selectedCertificates[role] || false}
                              onCheckedChange={(checked) => handleCertificateToggle(role, checked as boolean)}
                            />
                            <Label htmlFor={id} className="text-sm flex items-center">
                              <Icon className="h-3 w-3 mr-1" />
                              {label}
                            </Label>
                          </div>

                          {selectedCertificates[role] && (
                            <div className="ml-6 p-4 bg-gray-50 rounded-lg space-y-3">
                              <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                  <Label htmlFor={`${role}-expiry`} className="text-sm">
                                    Verloopdatum
                                  </Label>
                                  <Input
                                    id={`${role}-expiry`}
                                    type="date"
                                    onChange={(e) => handleCertificateDataChange(role, "expiryDate", e.target.value)}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`${role}-level`} className="text-sm">
                                    Niveau
                                  </Label>
                                  <Select onValueChange={(value) => handleCertificateDataChange(role, "level", value)}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Selecteer niveau" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="basis">Basis</SelectItem>
                                      <SelectItem value="diploma">Diploma</SelectItem>
                                      <SelectItem value="herhalingscursus">Herhalingscursus</SelectItem>
                                      <SelectItem value="instructeur">Instructeur</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor={`${role}-number`} className="text-sm">
                                  Certificaatnummer
                                </Label>
                                <Input
                                  id={`${role}-number`}
                                  placeholder="Bijv. BHV-2024-001"
                                  onChange={(e) =>
                                    handleCertificateDataChange(role, "certificateNumber", e.target.value)
                                  }
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor={`${role}-file`} className="text-sm">
                                  Certificaat uploaden
                                </Label>
                                <div className="flex items-center space-x-2">
                                  <Input
                                    id={`${role}-file`}
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={(e) => handleCertificateFileChange(role, e)}
                                    className="flex-1"
                                  />
                                  {certificateFiles[role] && (
                                    <Badge variant="outline" className="text-green-600">
                                      <Upload className="h-3 w-3 mr-1" />
                                      Geüpload
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-gray-500">PDF, JPG of PNG - Max. 10MB</p>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Waarschuwing voor niet-geautoriseerde gebruikers */}
                {!canAssignBHVRoles && (
                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-5 w-5 text-orange-600" />
                      <div>
                        <h4 className="font-semibold text-orange-800">BHV Rollen Toekenning</h4>
                        <p className="text-sm text-orange-700">
                          Alleen Admin en BHV Coördinatoren kunnen BHV rollen toekennen aan gebruikers.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <Label>Noodcontact</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="emergency-name">Naam</Label>
                      <Input id="emergency-name" placeholder="Naam noodcontact" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergency-phone">Telefoon</Label>
                      <Input id="emergency-phone" placeholder="06-12345678" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergency-relation">Relatie</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Relatie" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="partner">Partner</SelectItem>
                          <SelectItem value="echtgenoot">Echtgenoot</SelectItem>
                          <SelectItem value="echtgenote">Echtgenote</SelectItem>
                          <SelectItem value="ouder">Ouder</SelectItem>
                          <SelectItem value="kind">Kind</SelectItem>
                          <SelectItem value="broer">Broer</SelectItem>
                          <SelectItem value="zus">Zus</SelectItem>
                          <SelectItem value="vriend">Vriend</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Toegankelijkheid</Label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="mindervalide" />
                      <Label htmlFor="mindervalide">Mindervalide</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="tijdelijk-mindervalide" />
                      <Label htmlFor="tijdelijk-mindervalide">Tijdelijk mindervalide</Label>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="assistance">Benodigde hulp</Label>
                      <Textarea id="assistance" placeholder="Beschrijf welke hulp nodig is..." />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="evacuation-plan">Evacuatieplan</Label>
                      <Textarea id="evacuation-plan" placeholder="Specifiek evacuatieplan..." />
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="active" defaultChecked />
                  <Label htmlFor="active">Actief</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Annuleren
                </Button>
                <Button onClick={handleAddUser}>Toevoegen</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Zoek gebruikers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="alle-gebruikers">Alle Gebruikers ({mockUsers.length})</TabsTrigger>
          <TabsTrigger value="bhv-overzicht">BHV Overzicht</TabsTrigger>
          <TabsTrigger value="certificaten">Certificaten</TabsTrigger>
          <TabsTrigger value="mindervaliden">Mindervaliden ({mockMindervalidenUsers.length})</TabsTrigger>
          <TabsTrigger value="roosters">Roosters</TabsTrigger>
        </TabsList>

        <TabsContent value="alle-gebruikers" className="space-y-4">
          <div className="grid gap-4">
            {filteredUsersNew.map((user) => (
              <Card key={user.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback>
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-lg">{user.name}</h3>
                          {getRoleIconNew(user.role)}
                          <Badge variant="outline">{user.role}</Badge>
                          <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Mail className="h-4 w-4" />
                            <EmailLink
                              email={user.email}
                              subject={`Contact via BHV360 - ${user.name}`}
                              body={`Hallo ${user.name},\n\n[Uw bericht hier]\n\nMet vriendelijke groet,`}
                              className="hover:text-blue-600 hover:underline"
                            >
                              {user.email}
                            </EmailLink>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Phone className="h-4 w-4" />
                            <a href={`tel:${user.phone}`} className="hover:text-blue-600 hover:underline">
                              {user.phone}
                            </a>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>{user.department}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-right text-sm">
                        <p className="text-gray-600">Laatste login:</p>
                        <p className="font-medium">{user.lastLogin}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {user.certifications && user.certifications.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">Certificeringen:</span>
                        <div className="flex flex-wrap gap-1">
                          {user.certifications.map((cert, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="bhv-overzicht" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-purple-700">
                  <Star className="mr-2 h-5 w-5" />
                  BHV Coordinators
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {bhvUsers
                    .filter((user) => user.bhvRoles.includes("Coordinator BHV"))
                    .map((user) => (
                      <div key={user.id} className="flex items-center space-x-3 p-2 bg-purple-50 rounded-md">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.photoUrl || "/placeholder.svg"} alt={user.name} />
                          <AvatarFallback>
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.department}</p>
                        </div>
                        <Badge variant={user.active ? "default" : "secondary"}>
                          {user.active ? "Actief" : "Inactief"}
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-blue-700">
                  <Shield className="mr-2 h-5 w-5" />
                  Ploegleiders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {bhvUsers
                    .filter((user) => user.bhvRoles.includes("Ploegleider"))
                    .map((user) => (
                      <div key={user.id} className="flex items-center space-x-3 p-2 bg-blue-50 rounded-md">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.photoUrl || "/placeholder.svg"} alt={user.name} />
                          <AvatarFallback>
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.department}</p>
                        </div>
                        <Badge variant={user.active ? "default" : "secondary"}>
                          {user.active ? "Actief" : "Inactief"}
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-green-700">
                  <Shield className="mr-2 h-5 w-5" />
                  BHV'ers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {bhvUsers
                    .filter((user) => user.bhvRoles.includes("BHV"))
                    .map((user) => (
                      <div key={user.id} className="flex items-center space-x-3 p-2 bg-green-50 rounded-md">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.photoUrl || "/placeholder.svg"} alt={user.name} />
                          <AvatarFallback>
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.department}</p>
                        </div>
                        <Badge variant={user.active ? "default" : "secondary"}>
                          {user.active ? "Actief" : "Inactief"}
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-red-700">
                  <Heart className="mr-2 h-5 w-5" />
                  EHBO'ers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {bhvUsers
                    .filter((user) => user.bhvRoles.includes("EHBO"))
                    .map((user) => (
                      <div key={user.id} className="flex items-center space-x-3 p-2 bg-red-50 rounded-md">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.photoUrl || "/placeholder.svg"} alt={user.name} />
                          <AvatarFallback>
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.department}</p>
                        </div>
                        <Badge variant={user.active ? "default" : "secondary"}>
                          {user.active ? "Actief" : "Inactief"}
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-orange-700">
                  <Users className="mr-2 h-5 w-5" />
                  Ontruimers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {bhvUsers
                    .filter((user) => user.bhvRoles.includes("Ontruimer"))
                    .map((user) => (
                      <div key={user.id} className="flex items-center space-x-3 p-2 bg-orange-50 rounded-md">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.photoUrl || "/placeholder.svg"} alt={user.name} />
                          <AvatarFallback>
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.department}</p>
                        </div>
                        <Badge variant={user.active ? "default" : "secondary"}>
                          {user.active ? "Actief" : "Inactief"}
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="certificaten" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Certificaten Overzicht
              </CardTitle>
              <CardDescription>Status van alle BHV certificaten en verloopdatums</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Verlopen certificaten */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-red-700 flex items-center">
                    <X className="mr-2 h-4 w-4" />
                    Verlopen Certificaten
                  </h3>
                  <div className="space-y-2">
                    {users.flatMap((user) =>
                      Object.entries(user.certificates || {})
                        .filter(([_, cert]) => getCertificateStatus(cert).status === "expired")
                        .map(([certType, cert]) => (
                          <div
                            key={`${user.id}-${certType}`}
                            className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200"
                          >
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={user.photoUrl || "/placeholder.svg"} alt={user.name} />
                                <AvatarFallback className="text-xs">
                                  {user.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm">{user.name}</p>
                                <p className="text-xs text-muted-foreground">{user.department}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge className="bg-red-100 text-red-800">{certType.toUpperCase()} - Verlopen</Badge>
                              <p className="text-xs text-red-600 mt-1">Verlopen: {cert.expiryDate}</p>
                            </div>
                          </div>
                        )),
                    )}
                  </div>
                </div>

                {/* Binnenkort verlopende certificaten */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-orange-700 flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    Verloopt Binnenkort (binnen 3 maanden)
                  </h3>
                  <div className="space-y-2">
                    {users.flatMap((user) =>
                      Object.entries(user.certificates || {})
                        .filter(([_, cert]) => getCertificateStatus(cert).status === "expiring")
                        .map(([certType, cert]) => (
                          <div
                            key={`${user.id}-${certType}`}
                            className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200"
                          >
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={user.photoUrl || "/placeholder.svg"} alt={user.name} />
                                <AvatarFallback className="text-xs">
                                  {user.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm">{user.name}</p>
                                <p className="text-xs text-muted-foreground">{user.department}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge className="bg-orange-100 text-orange-800">
                                {certType.toUpperCase()} - Verloopt binnenkort
                              </Badge>
                              <p className="text-xs text-orange-600 mt-1">Verloopt: {cert.expiryDate}</p>
                            </div>
                          </div>
                        )),
                    )}
                  </div>
                </div>

                {/* Geldige certificaten */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-green-700 flex items-center">
                    <Shield className="mr-2 h-4 w-4" />
                    Geldige Certificaten
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {users.flatMap((user) =>
                      Object.entries(user.certificates || {})
                        .filter(([_, cert]) => getCertificateStatus(cert).status === "valid")
                        .map(([certType, cert]) => (
                          <div
                            key={`${user.id}-${certType}`}
                            className="p-3 bg-green-50 rounded-lg border border-green-200"
                          >
                            <div className="flex items-center space-x-2 mb-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={user.photoUrl || "/placeholder.svg"} alt={user.name} />
                                <AvatarFallback className="text-xs">
                                  {user.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <p className="font-medium text-sm">{user.name}</p>
                            </div>
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              {certType.toUpperCase()} - {cert.level}
                            </Badge>
                            <p className="text-xs text-green-600 mt-1">Geldig tot: {cert.expiryDate}</p>
                            {cert.certificateNumber && (
                              <p className="text-xs text-muted-foreground mt-1">Nr: {cert.certificateNumber}</p>
                            )}
                          </div>
                        )),
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mindervaliden" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wheelchair className="mr-2 h-5 w-5" />
                Minder- en Tijdelijk Mindervaliden
              </CardTitle>
              <CardDescription>Overzicht van personen die extra hulp nodig hebben bij evacuatie</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mindervalideUsers.map((user) => (
                  <Card key={user.id} className="p-4">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user.photoUrl || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback>
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">{user.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {user.department} •{" "}
                              <EmailLink
                                email={user.email}
                                subject={`Contact via BHV360 - ${user.name}`}
                                body={`Hallo ${user.name},%0A%0A[Uw bericht hier]%0A%0AMet vriendelijke groet,`}
                                className="text-blue-600 hover:underline"
                              />
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {user.accessibility?.isMindervalide && (
                              <Badge className="bg-blue-100 text-blue-800">
                                <Wheelchair className="h-3 w-3 mr-1" />
                                Mindervalide
                              </Badge>
                            )}
                            {user.accessibility?.isTijdelijkMindervalide && (
                              <Badge className="bg-orange-100 text-orange-800">
                                <Clock className="h-3 w-3 mr-1" />
                                Tijdelijk
                              </Badge>
                            )}
                            <Button variant="outline" size="sm" onClick={() => handleAccessibilityEdit(user)}>
                              <Edit className="h-4 w-4 mr-1" />
                              Bewerken
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium">Benodigde hulp:</Label>
                            <p className="text-sm text-muted-foreground mt-1">
                              {user.accessibility?.assistanceNeeded || "Niet gespecificeerd"}
                            </p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Evacuatieplan:</Label>
                            <p className="text-sm text-muted-foreground mt-1">
                              {user.accessibility?.evacuationPlan || "Niet gespecificeerd"}
                            </p>
                          </div>
                        </div>

                        {user.accessibility?.isTijdelijkMindervalide && (
                          <div className="flex items-center space-x-4 text-sm">
                            {user.accessibility.startDate && (
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                <span>Van: {user.accessibility.startDate}</span>
                              </div>
                            )}
                            {user.accessibility.endDate && (
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                <span>Tot: {user.accessibility.endDate}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {user.accessibility?.notes && (
                          <div>
                            <Label className="text-sm font-medium">Opmerkingen:</Label>
                            <p className="text-sm text-muted-foreground mt-1">{user.accessibility.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}

                {mindervalideUsers.length === 0 && (
                  <div className="text-center py-8">
                    <Wheelchair className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Geen minder- of tijdelijk mindervaliden geregistreerd</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roosters" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Werkroosters</CardTitle>
              <CardDescription>Overzicht van werkroosters van alle medewerkers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users
                  .filter((user) => user.workSchedule)
                  .map((user) => (
                    <Card key={user.id} className="p-4">
                      <div className="flex items-center space-x-4 mb-4">
                        <Avatar>
                          <AvatarImage src={user.photoUrl || "/placeholder.svg"} alt={user.name} />
                          <AvatarFallback>
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{user.name}</h3>
                          <p className="text-sm text-muted-foreground">{user.department}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-7 gap-2">
                        {Object.entries(user.workSchedule || {}).map(([day, schedule]) => (
                          <div key={day} className="text-center">
                            <div className="font-medium text-sm capitalize mb-1">
                              {day === "monday"
                                ? "Ma"
                                : day === "tuesday"
                                  ? "Di"
                                  : day === "wednesday"
                                    ? "Wo"
                                    : day === "thursday"
                                      ? "Do"
                                      : day === "friday"
                                        ? "Vr"
                                        : day === "saturday"
                                          ? "Za"
                                          : "Zo"}
                            </div>
                            <div
                              className={`p-2 rounded text-xs ${
                                schedule.present ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-500"
                              }`}
                            >
                              {schedule.present ? (
                                <div>
                                  <div>{schedule.start}</div>
                                  <div>{schedule.end}</div>
                                </div>
                              ) : (
                                "Vrij"
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Accessibility Dialog */}
      <Dialog open={isAccessibilityDialogOpen} onOpenChange={setIsAccessibilityDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Toegankelijkheid bewerken - {currentUser?.name}</DialogTitle>
            <DialogDescription>Bewerk de toegankelijkheidsinstellingen en evacuatieplan</DialogDescription>
          </DialogHeader>
          {currentUser && (
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox id="edit-mindervalide" defaultChecked={currentUser.accessibility?.isMindervalide} />
                  <Label htmlFor="edit-mindervalide">Mindervalide</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit-tijdelijk-mindervalide"
                    defaultChecked={currentUser.accessibility?.isTijdelijkMindervalide}
                  />
                  <Label htmlFor="edit-tijdelijk-mindervalide">Tijdelijk mindervalide</Label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-start-date">Startdatum (tijdelijk)</Label>
                  <Input id="edit-start-date" type="date" defaultValue={currentUser.accessibility?.startDate} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-end-date">Einddatum (tijdelijk)</Label>
                  <Input id="edit-end-date" type="date" defaultValue={currentUser.accessibility?.endDate} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-assistance">Benodigde hulp</Label>
                <Textarea
                  id="edit-assistance"
                  placeholder="Beschrijf welke hulp nodig is..."
                  defaultValue={currentUser.accessibility?.assistanceNeeded}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-evacuation-plan">Evacuatieplan</Label>
                <Textarea
                  id="edit-evacuation-plan"
                  placeholder="Specifiek evacuatieplan..."
                  defaultValue={currentUser.accessibility?.evacuationPlan}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-notes">Opmerkingen</Label>
                <Textarea
                  id="edit-notes"
                  placeholder="Aanvullende opmerkingen..."
                  defaultValue={currentUser.accessibility?.notes}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAccessibilityDialogOpen(false)}>
              Annuleren
            </Button>
            <Button onClick={() => setIsAccessibilityDialogOpen(false)}>Opslaan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Gebruiker Bewerken</DialogTitle>
            <DialogDescription>Bewerk de gegevens van {currentUser?.name}.</DialogDescription>
          </DialogHeader>
          {currentUser && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center space-y-2">
                  <div className="relative">
                    {previewUrl ? (
                      <div className="relative">
                        <img
                          src={previewUrl || "/placeholder.svg"}
                          alt="Preview"
                          className="h-32 w-32 rounded-full object-cover border-2 border-gray-200"
                        />
                        <button
                          onClick={clearSelectedFile}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center">
                        <Upload className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="edit-photo" className="cursor-pointer text-sm text-blue-600">
                      Foto uploaden
                    </Label>
                    <Input
                      id="edit-photo"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                  <p className="text-xs text-gray-500">Max. 5MB (JPG, PNG)</p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Naam</Label>
                    <Input id="edit-name" defaultValue={currentUser.name} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-email">E-mailadres</Label>
                    <Input id="edit-email" type="email" defaultValue={currentUser.email} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-phone">Telefoonnummer</Label>
                    <Input id="edit-phone" defaultValue={currentUser.phone} />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-role">Rol</Label>
                  <Select defaultValue={currentUser.role.toLowerCase()}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="bhv-coordinator">BHV Coordinator</SelectItem>
                      <SelectItem value="ploegleider">Ploegleider</SelectItem>
                      <SelectItem value="bhv">BHV'er</SelectItem>
                      <SelectItem value="ehbo">EHBO'er</SelectItem>
                      <SelectItem value="ontruimer">Ontruimer</SelectItem>
                      <SelectItem value="security-receptionist">Security/Receptionist</SelectItem>
                      <SelectItem value="user">Gebruiker</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-department">Afdeling</Label>
                  <Select defaultValue={currentUser.department.toLowerCase()}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="it">IT</SelectItem>
                      <SelectItem value="hr">HR</SelectItem>
                      <SelectItem value="facilitair">Facilitair</SelectItem>
                      <SelectItem value="beveiliging">Beveiliging</SelectItem>
                      <SelectItem value="receptie">Receptie</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="verkoop">Verkoop</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* BHV Rollen - alleen zichtbaar voor geautoriseerde gebruikers */}
              {canAssignBHVRoles && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>BHV Rollen</Label>
                    <Badge variant="outline" className="text-xs">
                      <Shield className="h-3 w-3 mr-1" />
                      Admin/BHV Coordinator
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="edit-coordinator-bhv"
                        defaultChecked={currentUser.bhvRoles.includes("Coordinator BHV")}
                      />
                      <Label htmlFor="edit-coordinator-bhv" className="text-sm flex items-center">
                        <Star className="h-3 w-3 mr-1" />
                        Coordinator BHV
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="edit-ploegleider" defaultChecked={currentUser.bhvRoles.includes("Ploegleider")} />
                      <Label htmlFor="edit-ploegleider" className="text-sm flex items-center">
                        <Shield className="h-3 w-3 mr-1" />
                        Ploegleider
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="edit-bhv" defaultChecked={currentUser.bhvRoles.includes("BHV")} />
                      <Label htmlFor="edit-bhv" className="text-sm flex items-center">
                        <Shield className="h-3 w-3 mr-1" />
                        BHV
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="edit-ehbo" defaultChecked={currentUser.bhvRoles.includes("EHBO")} />
                      <Label htmlFor="edit-ehbo" className="text-sm flex items-center">
                        <Heart className="h-3 w-3 mr-1" />
                        EHBO
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="edit-ontruimer" defaultChecked={currentUser.bhvRoles.includes("Ontruimer")} />
                      <Label htmlFor="edit-ontruimer" className="text-sm flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        Ontruimer
                      </Label>
                    </div>
                  </div>
                </div>
              )}

              {/* Waarschuwing voor niet-geautoriseerde gebruikers */}
              {!canAssignBHVRoles && (
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    <div>
                      <h4 className="font-semibold text-orange-800">BHV Rollen Beperking</h4>
                      <p className="text-sm text-orange-700">
                        Alleen Admin en BHV Coördinatoren kunnen BHV rollen wijzigen.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Switch id="edit-active" defaultChecked={currentUser.active} />
                <Label htmlFor="edit-active">Actief</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Annuleren
            </Button>
            <Button onClick={handleUpdateUser}>Opslaan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Statistics Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{mockUsers.length}</p>
                <p className="text-sm text-gray-600">Totaal Gebruikers</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{mockUsers.filter((u) => u.role.includes("BHV")).length}</p>
                <p className="text-sm text-gray-600">BHV Team</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{mockUsers.filter((u) => u.status === "Actief").length}</p>
                <p className="text-sm text-gray-600">Actieve Gebruikers</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{mockMindervalidenUsers.length}</p>
                <p className="text-sm text-gray-600">Speciale Zorg</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
