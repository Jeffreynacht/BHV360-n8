"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Types
export interface Customer {
  id: string
  name: string
  address: string
  contactPerson: string
  email: string
  phone: string
  buildings: number
  employees: number
  status: "active" | "inactive" | "trial"
  createdAt: string
}

export interface BhvMember {
  id: string
  customerId: string
  name: string
  email: string
  phone: string
  role: "coordinator" | "ehbo" | "evacuation-leader" | "fire-warden"
  certificationDate: string
  certificationExpiry: string
  status: "active" | "inactive" | "expired"
  avatar?: string
}

export interface Incident {
  id: string
  customerId: string
  title: string
  description: string
  type: "fire" | "medical" | "evacuation" | "security" | "other"
  severity: "low" | "medium" | "high" | "critical"
  status: "open" | "in-progress" | "resolved" | "closed"
  reportedBy: string
  assignedTo?: string
  createdAt: string
  updatedAt: string
  location?: string
}

export interface NfcTag {
  id: string
  customerId: string
  tagId: string
  name: string
  type: "fire-extinguisher" | "aed" | "first-aid" | "emergency-exit" | "assembly-point" | "other"
  location: string
  floor: string
  status: "active" | "inactive" | "error"
  batteryLevel?: number
  lastSeen?: string
  lastScanned?: string
  assignedEquipment?: string
}

interface DataContextType {
  // Customers
  customers: Customer[]
  getCustomers: () => Promise<Customer[]>
  getCustomerById: (id: string) => Promise<Customer | null>
  createCustomer: (customer: Omit<Customer, "id" | "createdAt">) => Promise<Customer>
  updateCustomer: (id: string, updates: Partial<Customer>) => Promise<Customer>
  deleteCustomer: (id: string) => Promise<boolean>

  // BHV Members
  bhvMembers: BhvMember[]
  getBhvMembersByCustomer: (customerId: string) => Promise<BhvMember[]>
  getBhvMemberById: (id: string) => Promise<BhvMember | null>
  createBhvMember: (member: Omit<BhvMember, "id">) => Promise<BhvMember>
  updateBhvMember: (id: string, updates: Partial<BhvMember>) => Promise<BhvMember>
  deleteBhvMember: (id: string) => Promise<boolean>

  // Incidents
  incidents: Incident[]
  getIncidentsByCustomer: (customerId: string) => Promise<Incident[]>
  getIncidentById: (id: string) => Promise<Incident | null>
  createIncident: (incident: Omit<Incident, "id" | "createdAt" | "updatedAt">) => Promise<Incident>
  updateIncident: (id: string, updates: Partial<Incident>) => Promise<Incident>
  deleteIncident: (id: string) => Promise<boolean>

  // NFC Tags
  nfcTags: NfcTag[]
  getNfcTagsByCustomer: (customerId: string) => Promise<NfcTag[]>
  getNfcTagById: (id: string) => Promise<NfcTag | null>
  createNfcTag: (tag: Omit<NfcTag, "id">) => Promise<NfcTag>
  updateNfcTag: (id: string, updates: Partial<NfcTag>) => Promise<NfcTag>
  deleteNfcTag: (id: string) => Promise<boolean>
  scanNfcTag: (tagId: string) => Promise<NfcTag | null>

  // Loading states
  isLoading: boolean
  error: string | null
}

const DataContext = createContext<DataContextType | undefined>(undefined)

// Demo data
const DEMO_CUSTOMERS: Customer[] = [
  {
    id: "demo-bedrijf-bv",
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
    id: "acme-corp",
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
    id: "zorgcentrum-boomgaard",
    name: "Zorgcentrum De Boomgaard",
    address: "Zorgstraat 789, 3500 EF Utrecht",
    contactPerson: "Dr. Peter van der Berg",
    email: "p.vandenberg@boomgaard.nl",
    phone: "+31 30 555 1234",
    buildings: 2,
    employees: 45,
    status: "active",
    createdAt: "2024-01-20T09:15:00Z",
  },
]

const DEMO_BHV_MEMBERS: BhvMember[] = [
  {
    id: "bhv-001",
    customerId: "demo-bedrijf-bv",
    name: "Piet Pietersen",
    email: "piet@demobedrijf.nl",
    phone: "+31 6 1234 5678",
    role: "coordinator",
    certificationDate: "2023-03-15",
    certificationExpiry: "2025-03-15",
    status: "active",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: "bhv-002",
    customerId: "demo-bedrijf-bv",
    name: "Marie de Vries",
    email: "marie@demobedrijf.nl",
    phone: "+31 6 2345 6789",
    role: "ehbo",
    certificationDate: "2023-06-01",
    certificationExpiry: "2025-06-01",
    status: "active",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: "bhv-003",
    customerId: "demo-bedrijf-bv",
    name: "Kees van der Berg",
    email: "kees@demobedrijf.nl",
    phone: "+31 6 3456 7890",
    role: "evacuation-leader",
    certificationDate: "2023-09-10",
    certificationExpiry: "2025-09-10",
    status: "active",
    avatar: "/placeholder-user.jpg",
  },
]

const DEMO_INCIDENTS: Incident[] = [
  {
    id: "incident-001",
    customerId: "demo-bedrijf-bv",
    title: "Kleine brand in keuken",
    description: "Magnetron oververhit, kleine rookontwikkeling. Snel geblust met brandblusser.",
    type: "fire",
    severity: "medium",
    status: "resolved",
    reportedBy: "Jan Janssen",
    assignedTo: "Piet Pietersen",
    location: "Keuken, 2e verdieping",
    createdAt: "2024-01-10T14:30:00Z",
    updatedAt: "2024-01-10T15:45:00Z",
  },
  {
    id: "incident-002",
    customerId: "demo-bedrijf-bv",
    title: "Medische noodsituatie",
    description: "Medewerker gevallen van trap, mogelijk enkelblessure.",
    type: "medical",
    severity: "high",
    status: "closed",
    reportedBy: "Marie de Vries",
    assignedTo: "Marie de Vries",
    location: "Hoofdtrap, begane grond",
    createdAt: "2024-01-05T11:15:00Z",
    updatedAt: "2024-01-05T12:30:00Z",
  },
]

const DEMO_NFC_TAGS: NfcTag[] = [
  {
    id: "nfc-001",
    customerId: "demo-bedrijf-bv",
    tagId: "NFC-BRANDBLUSSER-001",
    name: "Brandblusser Hoofdingang",
    type: "fire-extinguisher",
    location: "Hoofdingang, begane grond",
    floor: "Begane grond",
    status: "active",
    batteryLevel: 85,
    lastSeen: "2024-01-15T10:30:00Z",
    lastScanned: "2024-01-14T16:45:00Z",
    assignedEquipment: "Brandblusser 6kg ABC poeder",
  },
  {
    id: "nfc-002",
    customerId: "demo-bedrijf-bv",
    tagId: "NFC-EHBO-002",
    name: "EHBO-post Verdieping 1",
    type: "first-aid",
    location: "Gang oost, 1e verdieping",
    floor: "1e verdieping",
    status: "active",
    batteryLevel: 92,
    lastSeen: "2024-01-15T09:15:00Z",
    lastScanned: "2024-01-13T14:20:00Z",
    assignedEquipment: "EHBO-koffer groot",
  },
  {
    id: "nfc-003",
    customerId: "demo-bedrijf-bv",
    tagId: "NFC-AED-003",
    name: "AED Receptie",
    type: "aed",
    location: "Receptie, begane grond",
    floor: "Begane grond",
    status: "active",
    batteryLevel: 78,
    lastSeen: "2024-01-15T08:45:00Z",
    lastScanned: "2024-01-12T10:30:00Z",
    assignedEquipment: "AED Philips HeartStart",
  },
]

export function DataProvider({ children }: { children: ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [bhvMembers, setBhvMembers] = useState<BhvMember[]>([])
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [nfcTags, setNfcTags] = useState<NfcTag[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize data from localStorage or demo data
  useEffect(() => {
    const initializeData = () => {
      try {
        if (typeof window !== "undefined") {
          // Load customers
          const savedCustomers = localStorage.getItem("bhv360-customers")
          setCustomers(savedCustomers ? JSON.parse(savedCustomers) : DEMO_CUSTOMERS)

          // Load BHV members
          const savedBhvMembers = localStorage.getItem("bhv360-bhv-members")
          setBhvMembers(savedBhvMembers ? JSON.parse(savedBhvMembers) : DEMO_BHV_MEMBERS)

          // Load incidents
          const savedIncidents = localStorage.getItem("bhv360-incidents")
          setIncidents(savedIncidents ? JSON.parse(savedIncidents) : DEMO_INCIDENTS)

          // Load NFC tags
          const savedNfcTags = localStorage.getItem("bhv360-nfc-tags")
          setNfcTags(savedNfcTags ? JSON.parse(savedNfcTags) : DEMO_NFC_TAGS)
        }
      } catch (error) {
        console.error("Error loading data from localStorage:", error)
        // Use demo data as fallback
        setCustomers(DEMO_CUSTOMERS)
        setBhvMembers(DEMO_BHV_MEMBERS)
        setIncidents(DEMO_INCIDENTS)
        setNfcTags(DEMO_NFC_TAGS)
      }
    }

    initializeData()
  }, [])

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (typeof window !== "undefined" && customers.length > 0) {
      localStorage.setItem("bhv360-customers", JSON.stringify(customers))
    }
  }, [customers])

  useEffect(() => {
    if (typeof window !== "undefined" && bhvMembers.length > 0) {
      localStorage.setItem("bhv360-bhv-members", JSON.stringify(bhvMembers))
    }
  }, [bhvMembers])

  useEffect(() => {
    if (typeof window !== "undefined" && incidents.length > 0) {
      localStorage.setItem("bhv360-incidents", JSON.stringify(incidents))
    }
  }, [incidents])

  useEffect(() => {
    if (typeof window !== "undefined" && nfcTags.length > 0) {
      localStorage.setItem("bhv360-nfc-tags", JSON.stringify(nfcTags))
    }
  }, [nfcTags])

  // Utility function to simulate async operations
  const simulateAsync = <T,>(data: T): Promise<T> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(data), 100 + Math.random() * 200)
    })
  }

  // Customer functions
  const getCustomers = async (): Promise<Customer[]> => {
    setIsLoading(true)
    try {
      const result = await simulateAsync(customers)
      return result
    } finally {
      setIsLoading(false)
    }
  }

  const getCustomerById = async (id: string): Promise<Customer | null> => {
    const customer = customers.find((c) => c.id === id)
    return simulateAsync(customer || null)
  }

  const createCustomer = async (customerData: Omit<Customer, "id" | "createdAt">): Promise<Customer> => {
    const newCustomer: Customer = {
      ...customerData,
      id: `customer-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    setCustomers((prev) => [...prev, newCustomer])
    return simulateAsync(newCustomer)
  }

  const updateCustomer = async (id: string, updates: Partial<Customer>): Promise<Customer> => {
    const updatedCustomers = customers.map((c) => (c.id === id ? { ...c, ...updates } : c))
    setCustomers(updatedCustomers)
    const updatedCustomer = updatedCustomers.find((c) => c.id === id)!
    return simulateAsync(updatedCustomer)
  }

  const deleteCustomer = async (id: string): Promise<boolean> => {
    setCustomers((prev) => prev.filter((c) => c.id !== id))
    return simulateAsync(true)
  }

  // BHV Member functions
  const getBhvMembersByCustomer = async (customerId: string): Promise<BhvMember[]> => {
    const customerMembers = bhvMembers.filter((m) => m.customerId === customerId)
    return simulateAsync(customerMembers)
  }

  const getBhvMemberById = async (id: string): Promise<BhvMember | null> => {
    const member = bhvMembers.find((m) => m.id === id)
    return simulateAsync(member || null)
  }

  const createBhvMember = async (memberData: Omit<BhvMember, "id">): Promise<BhvMember> => {
    const newMember: BhvMember = {
      ...memberData,
      id: `bhv-${Date.now()}`,
    }
    setBhvMembers((prev) => [...prev, newMember])
    return simulateAsync(newMember)
  }

  const updateBhvMember = async (id: string, updates: Partial<BhvMember>): Promise<BhvMember> => {
    const updatedMembers = bhvMembers.map((m) => (m.id === id ? { ...m, ...updates } : m))
    setBhvMembers(updatedMembers)
    const updatedMember = updatedMembers.find((m) => m.id === id)!
    return simulateAsync(updatedMember)
  }

  const deleteBhvMember = async (id: string): Promise<boolean> => {
    setBhvMembers((prev) => prev.filter((m) => m.id !== id))
    return simulateAsync(true)
  }

  // Incident functions
  const getIncidentsByCustomer = async (customerId: string): Promise<Incident[]> => {
    const customerIncidents = incidents.filter((i) => i.customerId === customerId)
    return simulateAsync(customerIncidents)
  }

  const getIncidentById = async (id: string): Promise<Incident | null> => {
    const incident = incidents.find((i) => i.id === id)
    return simulateAsync(incident || null)
  }

  const createIncident = async (incidentData: Omit<Incident, "id" | "createdAt" | "updatedAt">): Promise<Incident> => {
    const now = new Date().toISOString()
    const newIncident: Incident = {
      ...incidentData,
      id: `incident-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    }
    setIncidents((prev) => [...prev, newIncident])
    return simulateAsync(newIncident)
  }

  const updateIncident = async (id: string, updates: Partial<Incident>): Promise<Incident> => {
    const updatedIncidents = incidents.map((i) =>
      i.id === id ? { ...i, ...updates, updatedAt: new Date().toISOString() } : i,
    )
    setIncidents(updatedIncidents)
    const updatedIncident = updatedIncidents.find((i) => i.id === id)!
    return simulateAsync(updatedIncident)
  }

  const deleteIncident = async (id: string): Promise<boolean> => {
    setIncidents((prev) => prev.filter((i) => i.id !== id))
    return simulateAsync(true)
  }

  // NFC Tag functions
  const getNfcTagsByCustomer = async (customerId: string): Promise<NfcTag[]> => {
    const customerTags = nfcTags.filter((t) => t.customerId === customerId)
    return simulateAsync(customerTags)
  }

  const getNfcTagById = async (id: string): Promise<NfcTag | null> => {
    const tag = nfcTags.find((t) => t.id === id)
    return simulateAsync(tag || null)
  }

  const createNfcTag = async (tagData: Omit<NfcTag, "id">): Promise<NfcTag> => {
    const newTag: NfcTag = {
      ...tagData,
      id: `nfc-${Date.now()}`,
    }
    setNfcTags((prev) => [...prev, newTag])
    return simulateAsync(newTag)
  }

  const updateNfcTag = async (id: string, updates: Partial<NfcTag>): Promise<NfcTag> => {
    const updatedTags = nfcTags.map((t) => (t.id === id ? { ...t, ...updates } : t))
    setNfcTags(updatedTags)
    const updatedTag = updatedTags.find((t) => t.id === id)!
    return simulateAsync(updatedTag)
  }

  const deleteNfcTag = async (id: string): Promise<boolean> => {
    setNfcTags((prev) => prev.filter((t) => t.id !== id))
    return simulateAsync(true)
  }

  const scanNfcTag = async (tagId: string): Promise<NfcTag | null> => {
    const tag = nfcTags.find((t) => t.tagId === tagId)
    if (tag) {
      const updatedTag = {
        ...tag,
        lastScanned: new Date().toISOString(),
      }
      await updateNfcTag(tag.id, { lastScanned: updatedTag.lastScanned })
      return simulateAsync(updatedTag)
    }
    return simulateAsync(null)
  }

  const value: DataContextType = {
    // Data
    customers,
    bhvMembers,
    incidents,
    nfcTags,

    // Customer functions
    getCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer,

    // BHV Member functions
    getBhvMembersByCustomer,
    getBhvMemberById,
    createBhvMember,
    updateBhvMember,
    deleteBhvMember,

    // Incident functions
    getIncidentsByCustomer,
    getIncidentById,
    createIncident,
    updateIncident,
    deleteIncident,

    // NFC Tag functions
    getNfcTagsByCustomer,
    getNfcTagById,
    createNfcTag,
    updateNfcTag,
    deleteNfcTag,
    scanNfcTag,

    // State
    isLoading,
    error,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}
