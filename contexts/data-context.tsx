"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface BHVMember {
  id: string
  name: string
  email: string
  phone: string
  role: "bhv-coordinator" | "bhv-member" | "ehbo" | "evacuation-leader"
  certificationDate: string
  expirationDate: string
  isActive: boolean
  customerId: string
}

interface Incident {
  id: string
  title: string
  description: string
  type: "fire" | "medical" | "evacuation" | "other"
  severity: "low" | "medium" | "high" | "critical"
  status: "open" | "in-progress" | "resolved" | "closed"
  reportedBy: string
  assignedTo?: string
  location: string
  createdAt: string
  updatedAt: string
  customerId: string
}

interface User {
  id: string
  name: string
  email: string
  phone: string
  role: string
  department: string
  bhv_roles: string[]
  active: boolean
  customerId: string
  createdAt: string
  updatedAt: string
}

interface Facility {
  id: string
  name: string
  type: string
  location: string
  building: string
  floor: string
  zone: string
  status: "operational" | "maintenance" | "out-of-order"
  lastInspection: string
  nextInspection: string
  customerId: string
  createdAt: string
  updatedAt: string
}

interface NFCTag {
  id: string
  name: string
  uid: string
  type: string
  location: string
  building: string
  floor: string
  zone: string
  status: "active" | "inactive" | "error" | "unassigned"
  batteryLevel: number
  lastSeen: string
  lastScanned: string | null
  assignedTo: string
  notes: string
  tagType: string
  customerId: string
  createdAt: string
  updatedAt: string
}

interface PlotkaartData {
  id: string
  customerId: string
  floors: any[]
  lastUpdated: string
  updatedBy: string
}

interface DataContextType {
  // BHV Members
  bhvMembers: BHVMember[]
  addBHVMember: (member: Omit<BHVMember, "id">) => void
  updateBHVMember: (id: string, member: Partial<BHVMember>) => void
  deleteBHVMember: (id: string) => void

  // Incidents
  incidents: Incident[]
  addIncident: (incident: Omit<Incident, "id" | "createdAt" | "updatedAt">) => void
  updateIncident: (id: string, incident: Partial<Incident>) => void
  deleteIncident: (id: string) => void

  // Users
  users: User[]
  getUsersByCustomer: (customerId: string) => Promise<User[]>
  addUser: (user: any, customerId: string) => Promise<User>
  updateUser: (id: string, user: any) => Promise<User>
  deleteUser: (id: string) => Promise<boolean>

  // Facilities
  facilities: Facility[]
  getFacilitiesByCustomer: (customerId: string) => Promise<Facility[]>
  addFacility: (facility: any, customerId: string) => Promise<Facility>
  updateFacility: (id: string, facility: any) => Promise<Facility>
  deleteFacility: (id: string) => Promise<boolean>

  // NFC Tags
  nfcTags: NFCTag[]
  getNfcTagsByCustomer: (customerId: string) => Promise<NFCTag[]>
  addNfcTag: (tag: any, customerId: string) => Promise<NFCTag>
  updateNfcTag: (id: string, tag: any) => Promise<NFCTag>
  deleteNfcTag: (id: string) => Promise<boolean>

  // Plotkaart
  getPlotkaartByCustomer: (customerId: string) => Promise<PlotkaartData | null>
  updatePlotkaartForCustomer: (customerId: string, floors: any[]) => Promise<PlotkaartData>

  // Loading states
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  error: string | null
  setError: (error: string | null) => void
  refreshData: () => Promise<void>
}

const DataContext = createContext<DataContextType | undefined>(undefined)

// Demo BHV leden
const initialBHVMembers: BHVMember[] = [
  {
    id: "1",
    name: "Piet Pietersen",
    email: "piet@demobedrijf.nl",
    phone: "06-12345678",
    role: "bhv-coordinator",
    certificationDate: "2023-01-15",
    expirationDate: "2025-01-15",
    isActive: true,
    customerId: "1",
  },
  {
    id: "2",
    name: "Marie de Vries",
    email: "marie@demobedrijf.nl",
    phone: "06-87654321",
    role: "ehbo",
    certificationDate: "2023-03-20",
    expirationDate: "2025-03-20",
    isActive: true,
    customerId: "1",
  },
  {
    id: "3",
    name: "Kees van der Berg",
    email: "kees@demobedrijf.nl",
    phone: "06-11223344",
    role: "evacuation-leader",
    certificationDate: "2023-06-10",
    expirationDate: "2025-06-10",
    isActive: true,
    customerId: "1",
  },
]

// Demo incidenten
const initialIncidents: Incident[] = [
  {
    id: "1",
    title: "Kleine brand in keuken",
    description: "Rookontwikkeling door oververhitte magnetron",
    type: "fire",
    severity: "low",
    status: "resolved",
    reportedBy: "Marie de Vries",
    assignedTo: "Piet Pietersen",
    location: "Keuken, 2e verdieping",
    createdAt: "2024-01-20T14:30:00Z",
    updatedAt: "2024-01-20T15:45:00Z",
    customerId: "1",
  },
  {
    id: "2",
    title: "Medische noodsituatie",
    description: "Medewerker gevallen van trap",
    type: "medical",
    severity: "medium",
    status: "closed",
    reportedBy: "Jan Janssen",
    assignedTo: "Marie de Vries",
    location: "Hoofdtrap, begane grond",
    createdAt: "2024-01-18T09:15:00Z",
    updatedAt: "2024-01-18T10:30:00Z",
    customerId: "1",
  },
]

// Demo gebruikers
const initialUsers: User[] = [
  {
    id: "1",
    name: "Jan de Vries",
    email: "jan@demobedrijf.nl",
    phone: "06-12345678",
    role: "admin",
    department: "Management",
    bhv_roles: ["bhv-coordinator"],
    active: true,
    customerId: "1",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "Piet Pietersen",
    email: "piet@demobedrijf.nl",
    phone: "06-87654321",
    role: "bhv-coordinator",
    department: "Veiligheid",
    bhv_roles: ["bhv-coordinator", "ehbo"],
    active: true,
    customerId: "1",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    name: "Marie van den Berg",
    email: "marie@demobedrijf.nl",
    phone: "06-11223344",
    role: "employee",
    department: "HR",
    bhv_roles: ["ehbo"],
    active: true,
    customerId: "1",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
]

// Demo voorzieningen
const initialFacilities: Facility[] = [
  {
    id: "1",
    name: "Brandblusser HG-001",
    type: "fire-extinguisher",
    location: "Hoofdingang",
    building: "Hoofdgebouw",
    floor: "Begane Grond",
    zone: "Noord",
    status: "operational",
    lastInspection: "2024-01-15",
    nextInspection: "2024-07-15",
    customerId: "1",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "2",
    name: "EHBO-post Kantoor",
    type: "first-aid",
    location: "Kantoorruimte",
    building: "Hoofdgebouw",
    floor: "1e Verdieping",
    zone: "Midden",
    status: "operational",
    lastInspection: "2024-01-10",
    nextInspection: "2024-04-10",
    customerId: "1",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-10T00:00:00Z",
  },
  {
    id: "3",
    name: "AED Receptie",
    type: "aed",
    location: "Receptie",
    building: "Hoofdgebouw",
    floor: "Begane Grond",
    zone: "Zuid",
    status: "operational",
    lastInspection: "2024-01-20",
    nextInspection: "2024-07-20",
    customerId: "1",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-20T00:00:00Z",
  },
]

// Demo NFC tags
const initialNFCTags: NFCTag[] = [
  {
    id: "1",
    name: "NFC-Brandblusser-001",
    uid: "04:52:3A:B2:C1:80",
    type: "facility",
    location: "Hoofdingang",
    building: "Hoofdgebouw",
    floor: "Begane Grond",
    zone: "Noord",
    status: "active",
    batteryLevel: 85,
    lastSeen: "2024-01-20T14:30:00Z",
    lastScanned: "2024-01-19T09:15:00Z",
    assignedTo: "Piet Pietersen",
    notes: "Gekoppeld aan brandblusser HG-001",
    tagType: "facility",
    customerId: "1",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-20T14:30:00Z",
  },
  {
    id: "2",
    name: "NFC-EHBO-002",
    uid: "04:52:3A:B2:C1:81",
    type: "facility",
    location: "Kantoorruimte",
    building: "Hoofdgebouw",
    floor: "1e Verdieping",
    zone: "Midden",
    status: "active",
    batteryLevel: 92,
    lastSeen: "2024-01-20T12:00:00Z",
    lastScanned: "2024-01-18T16:30:00Z",
    assignedTo: "Marie van den Berg",
    notes: "Gekoppeld aan EHBO-post",
    tagType: "facility",
    customerId: "1",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-20T12:00:00Z",
  },
  {
    id: "3",
    name: "NFC-AED-003",
    uid: "04:52:3A:B2:C1:82",
    type: "facility",
    location: "Receptie",
    building: "Hoofdgebouw",
    floor: "Begane Grond",
    zone: "Zuid",
    status: "active",
    batteryLevel: 78,
    lastSeen: "2024-01-20T10:45:00Z",
    lastScanned: "2024-01-20T08:20:00Z",
    assignedTo: "Jan de Vries",
    notes: "Gekoppeld aan AED bij receptie",
    tagType: "facility",
    customerId: "1",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-20T10:45:00Z",
  },
]

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [bhvMembers, setBHVMembers] = useState<BHVMember[]>([])
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [nfcTags, setNfcTags] = useState<NFCTag[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Laad data uit localStorage of gebruik initiële data
    const loadData = () => {
      try {
        // BHV Members
        const storedBHVMembers = localStorage.getItem("bhv360-bhv-members")
        if (storedBHVMembers) {
          setBHVMembers(JSON.parse(storedBHVMembers))
        } else {
          setBHVMembers(initialBHVMembers)
        }

        // Incidents
        const storedIncidents = localStorage.getItem("bhv360-incidents")
        if (storedIncidents) {
          setIncidents(JSON.parse(storedIncidents))
        } else {
          setIncidents(initialIncidents)
        }

        // Users
        const storedUsers = localStorage.getItem("bhv360-users")
        if (storedUsers) {
          setUsers(JSON.parse(storedUsers))
        } else {
          setUsers(initialUsers)
        }

        // Facilities
        const storedFacilities = localStorage.getItem("bhv360-facilities")
        if (storedFacilities) {
          setFacilities(JSON.parse(storedFacilities))
        } else {
          setFacilities(initialFacilities)
        }

        // NFC Tags
        const storedNFCTags = localStorage.getItem("bhv360-nfc-tags")
        if (storedNFCTags) {
          setNfcTags(JSON.parse(storedNFCTags))
        } else {
          setNfcTags(initialNFCTags)
        }
      } catch (error) {
        console.error("Fout bij het laden van data:", error)
        setError("Fout bij het laden van data")
        // Gebruik initiële data als fallback
        setBHVMembers(initialBHVMembers)
        setIncidents(initialIncidents)
        setUsers(initialUsers)
        setFacilities(initialFacilities)
        setNfcTags(initialNFCTags)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Sla data op in localStorage
  useEffect(() => {
    if (bhvMembers.length > 0) {
      localStorage.setItem("bhv360-bhv-members", JSON.stringify(bhvMembers))
    }
  }, [bhvMembers])

  useEffect(() => {
    if (incidents.length > 0) {
      localStorage.setItem("bhv360-incidents", JSON.stringify(incidents))
    }
  }, [incidents])

  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem("bhv360-users", JSON.stringify(users))
    }
  }, [users])

  useEffect(() => {
    if (facilities.length > 0) {
      localStorage.setItem("bhv360-facilities", JSON.stringify(facilities))
    }
  }, [facilities])

  useEffect(() => {
    if (nfcTags.length > 0) {
      localStorage.setItem("bhv360-nfc-tags", JSON.stringify(nfcTags))
    }
  }, [nfcTags])

  // BHV Members functions
  const addBHVMember = (memberData: Omit<BHVMember, "id">) => {
    const newMember: BHVMember = {
      ...memberData,
      id: Date.now().toString(),
    }
    setBHVMembers((prev) => [...prev, newMember])
  }

  const updateBHVMember = (id: string, memberData: Partial<BHVMember>) => {
    setBHVMembers((prev) => prev.map((member) => (member.id === id ? { ...member, ...memberData } : member)))
  }

  const deleteBHVMember = (id: string) => {
    setBHVMembers((prev) => prev.filter((member) => member.id !== id))
  }

  // Incident functions
  const addIncident = (incidentData: Omit<Incident, "id" | "createdAt" | "updatedAt">) => {
    const newIncident: Incident = {
      ...incidentData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setIncidents((prev) => [...prev, newIncident])
  }

  const updateIncident = (id: string, incidentData: Partial<Incident>) => {
    setIncidents((prev) =>
      prev.map((incident) =>
        incident.id === id ? { ...incident, ...incidentData, updatedAt: new Date().toISOString() } : incident,
      ),
    )
  }

  const deleteIncident = (id: string) => {
    setIncidents((prev) => prev.filter((incident) => incident.id !== id))
  }

  // User functions
  const getUsersByCustomer = async (customerId: string): Promise<User[]> => {
    await new Promise((resolve) => setTimeout(resolve, 100)) // Simuleer API call
    return users.filter((user) => user.customerId === customerId)
  }

  const addUser = async (userData: any, customerId: string): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 100)) // Simuleer API call
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      customerId,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setUsers((prev) => [...prev, newUser])
    return newUser
  }

  const updateUser = async (id: string, userData: any): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 100)) // Simuleer API call
    const updatedUser = { ...userData, id, updatedAt: new Date().toISOString() }
    setUsers((prev) => prev.map((user) => (user.id === id ? { ...user, ...updatedUser } : user)))
    return updatedUser
  }

  const deleteUser = async (id: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 100)) // Simuleer API call
    setUsers((prev) => prev.filter((user) => user.id !== id))
    return true
  }

  // Facility functions
  const getFacilitiesByCustomer = async (customerId: string): Promise<Facility[]> => {
    await new Promise((resolve) => setTimeout(resolve, 100)) // Simuleer API call
    return facilities.filter((facility) => facility.customerId === customerId)
  }

  const addFacility = async (facilityData: any, customerId: string): Promise<Facility> => {
    await new Promise((resolve) => setTimeout(resolve, 100)) // Simuleer API call
    const newFacility: Facility = {
      ...facilityData,
      id: Date.now().toString(),
      customerId,
      status: "operational",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setFacilities((prev) => [...prev, newFacility])
    return newFacility
  }

  const updateFacility = async (id: string, facilityData: any): Promise<Facility> => {
    await new Promise((resolve) => setTimeout(resolve, 100)) // Simuleer API call
    const updatedFacility = { ...facilityData, id, updatedAt: new Date().toISOString() }
    setFacilities((prev) =>
      prev.map((facility) => (facility.id === id ? { ...facility, ...updatedFacility } : facility)),
    )
    return updatedFacility
  }

  const deleteFacility = async (id: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 100)) // Simuleer API call
    setFacilities((prev) => prev.filter((facility) => facility.id !== id))
    return true
  }

  // NFC Tag functions
  const getNfcTagsByCustomer = async (customerId: string): Promise<NFCTag[]> => {
    await new Promise((resolve) => setTimeout(resolve, 100)) // Simuleer API call
    return nfcTags.filter((tag) => tag.customerId === customerId)
  }

  const addNfcTag = async (tagData: any, customerId: string): Promise<NFCTag> => {
    await new Promise((resolve) => setTimeout(resolve, 100)) // Simuleer API call
    const newTag: NFCTag = {
      ...tagData,
      id: Date.now().toString(),
      customerId,
      status: "active",
      batteryLevel: 100,
      lastSeen: new Date().toISOString(),
      lastScanned: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setNfcTags((prev) => [...prev, newTag])
    return newTag
  }

  const updateNfcTag = async (id: string, tagData: any): Promise<NFCTag> => {
    await new Promise((resolve) => setTimeout(resolve, 100)) // Simuleer API call
    const updatedTag = { ...tagData, id, updatedAt: new Date().toISOString() }
    setNfcTags((prev) => prev.map((tag) => (tag.id === id ? { ...tag, ...updatedTag } : tag)))
    const result = nfcTags.find((tag) => tag.id === id)
    return result ? { ...result, ...updatedTag } : updatedTag
  }

  const deleteNfcTag = async (id: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 100)) // Simuleer API call
    setNfcTags((prev) => prev.filter((tag) => tag.id !== id))
    return true
  }

  // Plotkaart functions
  const getPlotkaartByCustomer = async (customerId: string): Promise<PlotkaartData | null> => {
    await new Promise((resolve) => setTimeout(resolve, 100)) // Simuleer API call
    const stored = localStorage.getItem(`bhv360-plotkaart-${customerId}`)
    if (stored) {
      return JSON.parse(stored)
    }
    return null
  }

  const updatePlotkaartForCustomer = async (customerId: string, floors: any[]): Promise<PlotkaartData> => {
    await new Promise((resolve) => setTimeout(resolve, 100)) // Simuleer API call
    const plotkaartData: PlotkaartData = {
      id: customerId,
      customerId,
      floors,
      lastUpdated: new Date().toISOString(),
      updatedBy: "Current User",
    }
    localStorage.setItem(`bhv360-plotkaart-${customerId}`, JSON.stringify(plotkaartData))
    return plotkaartData
  }

  const refreshData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // Simuleer data refresh
      await new Promise((resolve) => setTimeout(resolve, 1000))
    } catch (err) {
      setError("Fout bij het verversen van data")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DataContext.Provider
      value={{
        // BHV Members
        bhvMembers,
        addBHVMember,
        updateBHVMember,
        deleteBHVMember,
        // Incidents
        incidents,
        addIncident,
        updateIncident,
        deleteIncident,
        // Users
        users,
        getUsersByCustomer,
        addUser,
        updateUser,
        deleteUser,
        // Facilities
        facilities,
        getFacilitiesByCustomer,
        addFacility,
        updateFacility,
        deleteFacility,
        // NFC Tags
        nfcTags,
        getNfcTagsByCustomer,
        addNfcTag,
        updateNfcTag,
        deleteNfcTag,
        // Plotkaart
        getPlotkaartByCustomer,
        updatePlotkaartForCustomer,
        // Loading states
        isLoading,
        setIsLoading,
        error,
        setError,
        refreshData,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData moet gebruikt worden binnen een DataProvider")
  }
  return context
}
