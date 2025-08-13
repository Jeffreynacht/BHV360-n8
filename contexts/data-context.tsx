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

interface DataContextType {
  bhvMembers: BHVMember[]
  incidents: Incident[]
  addBHVMember: (member: Omit<BHVMember, "id">) => void
  updateBHVMember: (id: string, member: Partial<BHVMember>) => void
  deleteBHVMember: (id: string) => void
  addIncident: (incident: Omit<Incident, "id" | "createdAt" | "updatedAt">) => void
  updateIncident: (id: string, incident: Partial<Incident>) => void
  deleteIncident: (id: string) => void
  isLoading: boolean
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

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [bhvMembers, setBHVMembers] = useState<BHVMember[]>([])
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Laad data uit localStorage of gebruik initiële data
    const storedBHVMembers = localStorage.getItem("bhv360-bhv-members")
    const storedIncidents = localStorage.getItem("bhv360-incidents")

    if (storedBHVMembers) {
      try {
        setBHVMembers(JSON.parse(storedBHVMembers))
      } catch (error) {
        console.error("Fout bij het laden van BHV leden:", error)
        setBHVMembers(initialBHVMembers)
      }
    } else {
      setBHVMembers(initialBHVMembers)
    }

    if (storedIncidents) {
      try {
        setIncidents(JSON.parse(storedIncidents))
      } catch (error) {
        console.error("Fout bij het laden van incidenten:", error)
        setIncidents(initialIncidents)
      }
    } else {
      setIncidents(initialIncidents)
    }

    setIsLoading(false)
  }, [])

  // Sla BHV leden op in localStorage
  useEffect(() => {
    if (bhvMembers.length > 0) {
      localStorage.setItem("bhv360-bhv-members", JSON.stringify(bhvMembers))
    }
  }, [bhvMembers])

  // Sla incidenten op in localStorage
  useEffect(() => {
    if (incidents.length > 0) {
      localStorage.setItem("bhv360-incidents", JSON.stringify(incidents))
    }
  }, [incidents])

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

  return (
    <DataContext.Provider
      value={{
        bhvMembers,
        incidents,
        addBHVMember,
        updateBHVMember,
        deleteBHVMember,
        addIncident,
        updateIncident,
        deleteIncident,
        isLoading,
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
