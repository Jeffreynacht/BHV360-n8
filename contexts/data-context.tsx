"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

// Types
interface Customer {
  id: string
  name: string
  address: string
  contactPerson: string
  email: string
  phone: string
  buildings: number
  employees: number
  status: "active" | "inactive"
  createdAt: string
}

interface BhvMember {
  id: string
  customerId: string
  name: string
  email: string
  phone: string
  role: "coordinator" | "ehbo" | "evacuation" | "fire_warden"
  certificateExpiry: string
  status: "active" | "inactive" | "expired"
  lastTraining?: string
  avatar?: string
}

interface Incident {
  id: string
  customerId: string
  title: string
  description: string
  type: "fire" | "medical" | "evacuation" | "security" | "other"
  severity: "low" | "medium" | "high" | "critical"
  status: "open" | "in_progress" | "resolved" | "closed"
  reportedBy: string
  assignedTo?: string
  location: string
  createdAt: string
  updatedAt: string
  resolvedAt?: string
}

interface NfcTag {
  id: string
  customerId: string
  tagId: string
  name: string
  type: "fire_extinguisher" | "ehbo_post" | "aed" | "evacuation_point" | "emergency_exit" | "other"
  location: string
  description: string
  batteryLevel: number
  status: "active" | "inactive" | "error"
  lastSeen: string
  lastScanned?: string
  createdAt: string
}

interface DataContextType {
  // Customers
  customers: Customer[]
  selectedCustomer: Customer | null
  setSelectedCustomer: (customer: Customer | null) => void
  getCustomerById: (id: string) => Customer | null
  addCustomer: (customer: Omit<Customer, "id" | "createdAt">) => Promise<void>
  updateCustomer: (id: string, updates: Partial<Customer>) => Promise<void>
  deleteCustomer: (id: string) => Promise<void>

  // BHV Members
  bhvMembers: BhvMember[]
  getBhvMembersByCustomer: (customerId: string) => BhvMember[]
  addBhvMember: (member: Omit<BhvMember, "id">) => Promise<void>
  updateBhvMember: (id: string, updates: Partial<BhvMember>) => Promise<void>
  deleteBhvMember: (id: string) => Promise<void>

  // Incidents
  incidents: Incident[]
  getIncidentsByCustomer: (customerId: string) => Incident[]
  addIncident: (incident: Omit<Incident, "id" | "createdAt" | "updatedAt">) => Promise<void>
  updateIncident: (id: string, updates: Partial<Incident>) => Promise<void>
  deleteIncident: (id: string) => Promise<void>

  // NFC Tags
  nfcTags: NfcTag[]
  getNfcTagsByCustomer: (customerId: string) => NfcTag[]
  addNfcTag: (tag: Omit<NfcTag, "id" | "createdAt">) => Promise<void>
  updateNfcTag: (id: string, updates: Partial<NfcTag>) => Promise<void>
  deleteNfcTag: (id: string) => Promise<void>
  scanNfcTag: (tagId: string) => Promise<NfcTag | null>

  // Loading states
  isLoading: boolean
  error: string | null
}

const DataContext = createContext<DataContextType | undefined>(undefined)

// Demo data
const demoCustomers: Customer[] = [
  {
    id: "1",
    name: "Demo Bedrijf BV",
    address: "Hoofdstraat 123, 1000 AB Amsterdam",
    contactPerson: "Jan Janssen",
    email: "jan@demobedrijf.nl",
    phone: "+31 20 123 4567",
    buildings: 3,
    employees: 25,
    status: "active",
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    name: "Acme Corporation",
    address: "Industrieweg 456, 3000 CD Rotterdam",
    contactPerson: "Sarah de Wit",
    email: "sarah@acme.nl",
    phone: "+31 10 987 6543",
    buildings: 1,
    employees: 12,
    status: "active",
    createdAt: "2024-02-01T14:30:00Z",
  },
  {
    id: "3",
    name: "Zorgcentrum De Boomgaard",
    address: "Parkweg 789, 3500 EF Utrecht",
    contactPerson: "Dr. Peter van der Berg",
    email: "p.vandenberg@boomgaard.nl",
    phone: "+31 30 555 1234",
    buildings: 2,
    employees: 45,
    status: "active",
    createdAt: "2024-01-20T09:15:00Z",
  },
]

const demoBhvMembers: BhvMember[] = [
  {
    id: "1",
    customerId: "1",
    name: "Piet Pietersen",
    email: "piet@demobedrijf.nl",
    phone: "+31 6 1234 5678",
    role: "coordinator",
    certificateExpiry: "2025-06-15",
    status: "active",
    lastTraining: "2024-03-15",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: "2",
    customerId: "1",
    name: "Marie de Vries",
    email: "marie@demobedrijf.nl",
    phone: "+31 6 2345 6789",
    role: "ehbo",
    certificateExpiry: "2025-08-20",
    status: "active",
    lastTraining: "2024-02-10",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: "3",
    customerId: "1",
    name: "Kees van der Berg",
    email: "kees@demobedrijf.nl",
    phone: "+31 6 3456 7890",
    role: "evacuation",
    certificateExpiry: "2025-04-30",
    status: "active",
    lastTraining: "2024-01-25",
    avatar: "/placeholder-user.jpg",
  },
]

const demoIncidents: Incident[] = [
  {
    id: "1",
    customerId: "1",
    title: "Kleine brand in keuken",
    description: "Magnetron oververhit, kleine rookontwikkeling. Snel geblust met brandblusser.",
    type: "fire",
    severity: "medium",
    status: "resolved",
    reportedBy: "Marie de Vries",
    assignedTo: "Piet Pietersen",
    location: "Keuken, 2e verdieping",
    createdAt: "2024-03-10T14:30:00Z",
    updatedAt: "2024-03-10T15:15:00Z",
    resolvedAt: "2024-03-10T15:15:00Z",
  },
  {
    id: "2",
    customerId: "1",
    title: "Medische noodsituatie",
    description: "Medewerker gevallen van trap, ambulance gebeld. Eerste hulp verleend.",
    type: "medical",
    severity: "high",
    status: "closed",
    reportedBy: "Kees van der Berg",
    assignedTo: "Marie de Vries",
    location: "Trappenhuis hoofdgebouw",
    createdAt: "2024-03-05T11:20:00Z",
    updatedAt: "2024-03-05T12:45:00Z",
    resolvedAt: "2024-03-05T12:45:00Z",
  },
]

const demoNfcTags: NfcTag[] = [
  {
    id: "1",
    customerId: "1",
    tagId: "NFC-001",
    name: "Brandblusser Hoofdingang",
    type: "fire_extinguisher",
    location: "Hoofdingang, begane grond",
    description: "6kg poederblusser bij de hoofdingang",
    batteryLevel: 85,
    status: "active",
    lastSeen: "2024-03-15T10:30:00Z",
    lastScanned: "2024-03-14T16:45:00Z",
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    customerId: "1",
    tagId: "NFC-002",
    name: "EHBO-post Verdieping 1",
    type: "ehbo_post",
    location: "Gang verdieping 1",
    description: "Volledige EHBO-post met AED",
    batteryLevel: 92,
    status: "active",
    lastSeen: "2024-03-15T09:15:00Z",
    lastScanned: "2024-03-13T14:20:00Z",
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "3",
    customerId: "1",
    tagId: "NFC-003",
    name: "AED Receptie",
    type: "aed",
    location: "Receptie, begane grond",
    description: "Automatische Externe Defibrillator",
    batteryLevel: 78,
    status: "active",
    lastSeen: "2024-03-15T08:45:00Z",
    lastScanned: "2024-03-12T11:30:00Z",
    createdAt: "2024-01-15T10:00:00Z",
  },
]

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [bhvMembers, setBhvMembers] = useState<BhvMember[]>([])
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [nfcTags, setNfcTags] = useState<NfcTag[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize data from localStorage or use demo data
  useEffect(() => {
    try {
      const storedCustomers = localStorage.getItem("bhv360-customers")
      const storedBhvMembers = localStorage.getItem("bhv360-bhv-members")
      const storedIncidents = localStorage.getItem("bhv360-incidents")
      const storedNfcTags = localStorage.getItem("bhv360-nfc-tags")
      const storedSelectedCustomer = localStorage.getItem("bhv360-selected-customer")

      setCustomers(storedCustomers ? JSON.parse(storedCustomers) : demoCustomers)
      setBhvMembers(storedBhvMembers ? JSON.parse(storedBhvMembers) : demoBhvMembers)
      setIncidents(storedIncidents ? JSON.parse(storedIncidents) : demoIncidents)
      setNfcTags(storedNfcTags ? JSON.parse(storedNfcTags) : demoNfcTags)

      if (storedSelectedCustomer) {
        const customer = JSON.parse(storedSelectedCustomer)
        setSelectedCustomer(customer)
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error)
      setCustomers(demoCustomers)
      setBhvMembers(demoBhvMembers)
      setIncidents(demoIncidents)
      setNfcTags(demoNfcTags)
    }
  }, [])

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem("bhv360-customers", JSON.stringify(customers))
  }, [customers])

  useEffect(() => {
    localStorage.setItem("bhv360-bhv-members", JSON.stringify(bhvMembers))
  }, [bhvMembers])

  useEffect(() => {
    localStorage.setItem("bhv360-incidents", JSON.stringify(incidents))
  }, [incidents])

  useEffect(() => {
    localStorage.setItem("bhv360-nfc-tags", JSON.stringify(nfcTags))
  }, [nfcTags])

  useEffect(() => {
    if (selectedCustomer) {
      localStorage.setItem("bhv360-selected-customer", JSON.stringify(selectedCustomer))
    } else {
      localStorage.removeItem("bhv360-selected-customer")
    }
  }, [selectedCustomer])

  // Customer functions
  const getCustomerById = (id: string): Customer | null => {
    return customers.find((customer) => customer.id === id) || null
  }

  const addCustomer = async (customerData: Omit<Customer, "id" | "createdAt">): Promise<void> => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API call
      const newCustomer: Customer = {
        ...customerData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      }
      setCustomers((prev) => [...prev, newCustomer])
    } catch (err) {
      setError("Fout bij toevoegen klant")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const updateCustomer = async (id: string, updates: Partial<Customer>): Promise<void> => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setCustomers((prev) => prev.map((customer) => (customer.id === id ? { ...customer, ...updates } : customer)))
      if (selectedCustomer?.id === id) {
        setSelectedCustomer((prev) => (prev ? { ...prev, ...updates } : null))
      }
    } catch (err) {
      setError("Fout bij bijwerken klant")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const deleteCustomer = async (id: string): Promise<void> => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setCustomers((prev) => prev.filter((customer) => customer.id !== id))
      if (selectedCustomer?.id === id) {
        setSelectedCustomer(null)
      }
      // Also remove related data
      setBhvMembers((prev) => prev.filter((member) => member.customerId !== id))
      setIncidents((prev) => prev.filter((incident) => incident.customerId !== id))
      setNfcTags((prev) => prev.filter((tag) => tag.customerId !== id))
    } catch (err) {
      setError("Fout bij verwijderen klant")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // BHV Member functions
  const getBhvMembersByCustomer = (customerId: string): BhvMember[] => {
    return bhvMembers.filter((member) => member.customerId === customerId)
  }

  const addBhvMember = async (memberData: Omit<BhvMember, "id">): Promise<void> => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const newMember: BhvMember = {
        ...memberData,
        id: Date.now().toString(),
      }
      setBhvMembers((prev) => [...prev, newMember])
    } catch (err) {
      setError("Fout bij toevoegen BHV-lid")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const updateBhvMember = async (id: string, updates: Partial<BhvMember>): Promise<void> => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setBhvMembers((prev) => prev.map((member) => (member.id === id ? { ...member, ...updates } : member)))
    } catch (err) {
      setError("Fout bij bijwerken BHV-lid")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const deleteBhvMember = async (id: string): Promise<void> => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setBhvMembers((prev) => prev.filter((member) => member.id !== id))
    } catch (err) {
      setError("Fout bij verwijderen BHV-lid")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Incident functions
  const getIncidentsByCustomer = (customerId: string): Incident[] => {
    return incidents.filter((incident) => incident.customerId === customerId)
  }

  const addIncident = async (incidentData: Omit<Incident, "id" | "createdAt" | "updatedAt">): Promise<void> => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const now = new Date().toISOString()
      const newIncident: Incident = {
        ...incidentData,
        id: Date.now().toString(),
        createdAt: now,
        updatedAt: now,
      }
      setIncidents((prev) => [...prev, newIncident])
    } catch (err) {
      setError("Fout bij toevoegen incident")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const updateIncident = async (id: string, updates: Partial<Incident>): Promise<void> => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const updatedAt = new Date().toISOString()
      setIncidents((prev) =>
        prev.map((incident) =>
          incident.id === id
            ? {
                ...incident,
                ...updates,
                updatedAt,
                resolvedAt:
                  updates.status === "resolved" || updates.status === "closed" ? updatedAt : incident.resolvedAt,
              }
            : incident,
        ),
      )
    } catch (err) {
      setError("Fout bij bijwerken incident")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const deleteIncident = async (id: string): Promise<void> => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setIncidents((prev) => prev.filter((incident) => incident.id !== id))
    } catch (err) {
      setError("Fout bij verwijderen incident")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // NFC Tag functions
  const getNfcTagsByCustomer = (customerId: string): NfcTag[] => {
    return nfcTags.filter((tag) => tag.customerId === customerId)
  }

  const addNfcTag = async (tagData: Omit<NfcTag, "id" | "createdAt">): Promise<void> => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const newTag: NfcTag = {
        ...tagData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      }
      setNfcTags((prev) => [...prev, newTag])
    } catch (err) {
      setError("Fout bij toevoegen NFC-tag")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const updateNfcTag = async (id: string, updates: Partial<NfcTag>): Promise<void> => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setNfcTags((prev) => prev.map((tag) => (tag.id === id ? { ...tag, ...updates } : tag)))
    } catch (err) {
      setError("Fout bij bijwerken NFC-tag")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const deleteNfcTag = async (id: string): Promise<void> => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setNfcTags((prev) => prev.filter((tag) => tag.id !== id))
    } catch (err) {
      setError("Fout bij verwijderen NFC-tag")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const scanNfcTag = async (tagId: string): Promise<NfcTag | null> => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate scan time
      const tag = nfcTags.find((t) => t.tagId === tagId)
      if (tag) {
        const now = new Date().toISOString()
        await updateNfcTag(tag.id, { lastScanned: now, lastSeen: now })
        return { ...tag, lastScanned: now, lastSeen: now }
      }
      return null
    } catch (err) {
      setError("Fout bij scannen NFC-tag")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const value: DataContextType = {
    // Customers
    customers,
    selectedCustomer,
    setSelectedCustomer,
    getCustomerById,
    addCustomer,
    updateCustomer,
    deleteCustomer,

    // BHV Members
    bhvMembers,
    getBhvMembersByCustomer,
    addBhvMember,
    updateBhvMember,
    deleteBhvMember,

    // Incidents
    incidents,
    getIncidentsByCustomer,
    addIncident,
    updateIncident,
    deleteIncident,

    // NFC Tags
    nfcTags,
    getNfcTagsByCustomer,
    addNfcTag,
    updateNfcTag,
    deleteNfcTag,
    scanNfcTag,

    // Loading states
    isLoading,
    error,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData moet gebruikt worden binnen een DataProvider")
  }
  return context
}
