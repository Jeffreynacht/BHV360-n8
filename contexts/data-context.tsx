"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useCustomer } from "@/components/customer-context"

interface DataContextType {
  // Users - Mock data voor nu
  getUsersByCustomer: (customerId: number) => any[]
  addUser: (user: any, customerId: number) => void
  updateUser: (id: number, user: any) => void
  deleteUser: (id: number) => void

  // Facilities - Mock data voor nu
  getFacilitiesByCustomer: (customerId: number) => any[]
  addFacility: (facility: any, customerId: number) => void
  updateFacility: (id: string, facility: any) => void
  deleteFacility: (id: string) => void

  // NFC Tags - Mock data voor nu
  getNfcTagsByCustomer: (customerId: number) => Promise<any[]>
  addNfcTag: (tag: any, customerId: number) => Promise<any>
  updateNfcTag: (id: string, tag: any) => Promise<any>
  deleteNfcTag: (id: string) => Promise<boolean>

  // Plotkaart - Mock data voor nu
  getPlotkaartByCustomer: (customerId: number) => any
  updatePlotkaartForCustomer: (customerId: number, floors: any[]) => void

  // Loading states
  isLoading: boolean
  setIsLoading: (loading: boolean) => void

  // Users array for compatibility
  users: any[]
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [users, setUsers] = useState<any[]>([])
  const { selectedCustomer } = useCustomer()

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Customer-specific mock data - GEEN provincie referenties
  const getCustomerData = (customerId: number) => {
    switch (customerId) {
      case 1: // BHV360 Demo Organisatie
        return {
          users: [
            {
              id: 1,
              name: "Jan de Vries",
              email: "jan@bhv360demo.nl",
              phone: "06-12345678",
              role: "admin",
              department: "Veiligheid",
              bhvRoles: ["BHV", "EHBO"],
              active: true,
              certificates: {
                bhv: { valid: true, expiryDate: "2024-12-31", level: "basis" },
                ehbo: { valid: true, expiryDate: "2024-11-30", level: "diploma" },
              },
            },
            {
              id: 2,
              name: "Marie Bakker",
              email: "marie@bhv360demo.nl",
              phone: "06-23456789",
              role: "employee",
              department: "HR",
              bhvRoles: [],
              active: true,
              certificates: {},
            },
          ],
          facilities: [
            {
              id: "demo-fac-1",
              name: "Brandblusser BHV-001",
              type: "fire-extinguisher",
              building: "BHV360 Hoofdgebouw",
              floor: "Begane Grond",
              zone: "Noord",
              status: "operational",
            },
          ],
          nfcTags: [
            {
              id: "demo-nfc-1",
              name: "BHV360-NFC-001",
              uid: "04:52:3A:B2:C1:80",
              type: "facility",
              location: "BHV360 Hoofdingang",
              building: "BHV360 Hoofdgebouw",
              status: "active",
            },
          ],
        }

      case 2: // TechCorp Nederland
        return {
          users: [
            {
              id: 3,
              name: "Piet van der Berg",
              email: "piet@techcorp.nl",
              phone: "06-34567890",
              role: "admin",
              department: "IT",
              bhvRoles: ["BHV"],
              active: true,
              certificates: {
                bhv: { valid: true, expiryDate: "2024-10-15", level: "basis" },
              },
            },
          ],
          facilities: [
            {
              id: "tech-fac-1",
              name: "TechCorp Brandblusser-001",
              type: "fire-extinguisher",
              building: "TechCorp Gebouw",
              floor: "Verdieping 1",
              zone: "Oost",
              status: "operational",
            },
          ],
          nfcTags: [
            {
              id: "tech-nfc-1",
              name: "TechCorp-NFC-001",
              uid: "04:52:3A:B2:C1:81",
              type: "facility",
              location: "TechCorp Locatie",
              building: "TechCorp Gebouw",
              status: "active",
            },
          ],
        }

      case 3: // Zorggroep Centraal
        return {
          users: [
            {
              id: 4,
              name: "Dr. Maria Jansen",
              email: "m.jansen@zorgcentraal.nl",
              phone: "06-45678901",
              role: "bhv-coordinator",
              department: "Facilitair",
              bhvRoles: ["BHV", "Ploegleider"],
              active: true,
              certificates: {
                bhv: { valid: true, expiryDate: "2025-01-15", level: "ploegleider" },
              },
            },
          ],
          facilities: [
            {
              id: "zorg-fac-1",
              name: "Zorgcentrum AED-001",
              type: "aed",
              building: "Zorgcentrum Hoofdgebouw",
              floor: "Begane Grond",
              zone: "Receptie",
              status: "operational",
            },
          ],
          nfcTags: [
            {
              id: "zorg-nfc-1",
              name: "Zorgcentrum-NFC-001",
              uid: "04:52:3A:B2:C1:82",
              type: "facility",
              location: "Zorgcentrum Ingang",
              building: "Zorgcentrum Hoofdgebouw",
              status: "active",
            },
          ],
        }

      default:
        return { users: [], facilities: [], nfcTags: [] }
    }
  }

  // Update users when customer changes
  useEffect(() => {
    if (selectedCustomer && isClient) {
      const customerData = getCustomerData(Number.parseInt(selectedCustomer.id))
      setUsers(customerData.users)
    } else {
      setUsers([])
    }
  }, [selectedCustomer, isClient])

  // Safe functions that work during SSR
  const getUsersByCustomer = (customerId: number) => {
    if (!isClient) return []
    const customerData = getCustomerData(customerId)
    return customerData.users
  }

  const getFacilitiesByCustomer = (customerId: number) => {
    if (!isClient) return []
    const customerData = getCustomerData(customerId)
    return customerData.facilities
  }

  const getNfcTagsByCustomer = async (customerId: number) => {
    if (!isClient) return []
    const customerData = getCustomerData(customerId)
    return customerData.nfcTags
  }

  const addUser = (user: any, customerId: number) => {
    if (!isClient) return
    console.log("Adding user:", user, "for customer:", customerId)
  }

  const updateUser = (id: number, user: any) => {
    if (!isClient) return
    console.log("Updating user:", id, user)
  }

  const deleteUser = (id: number) => {
    if (!isClient) return
    console.log("Deleting user:", id)
  }

  const addFacility = (facility: any, customerId: number) => {
    if (!isClient) return
    console.log("Adding facility:", facility, "for customer:", customerId)
  }

  const updateFacility = (id: string, facility: any) => {
    if (!isClient) return
    console.log("Updating facility:", id, facility)
  }

  const deleteFacility = (id: string) => {
    if (!isClient) return
    console.log("Deleting facility:", id)
  }

  const addNfcTag = async (tag: any, customerId: number) => {
    if (!isClient) return null
    console.log("Adding NFC tag:", tag, "for customer:", customerId)
    return { ...tag, id: Date.now().toString() }
  }

  const updateNfcTag = async (id: string, tag: any) => {
    if (!isClient) return null
    console.log("Updating NFC tag:", id, tag)
    return { ...tag, id }
  }

  const deleteNfcTag = async (id: string) => {
    if (!isClient) return false
    console.log("Deleting NFC tag:", id)
    return true
  }

  const getPlotkaartByCustomer = (customerId: number) => {
    if (!isClient) return null
    return {
      id: customerId,
      floors: [],
      lastUpdated: "2024-01-15 14:30",
      updatedBy: "System",
    }
  }

  const updatePlotkaartForCustomer = (customerId: number, floors: any[]) => {
    if (!isClient) return
    console.log("Updating plotkaart for customer:", customerId, floors)
  }

  const value: DataContextType = {
    getUsersByCustomer,
    addUser,
    updateUser,
    deleteUser,
    getFacilitiesByCustomer,
    addFacility,
    updateFacility,
    deleteFacility,
    getNfcTagsByCustomer,
    addNfcTag,
    updateNfcTag,
    deleteNfcTag,
    getPlotkaartByCustomer,
    updatePlotkaartForCustomer,
    isLoading,
    setIsLoading,
    users,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    // Return safe defaults during SSR
    if (typeof window === "undefined") {
      return {
        getUsersByCustomer: () => [],
        addUser: () => {},
        updateUser: () => {},
        deleteUser: () => {},
        getFacilitiesByCustomer: () => [],
        addFacility: () => {},
        updateFacility: () => {},
        deleteFacility: () => {},
        getNfcTagsByCustomer: async () => [],
        addNfcTag: async () => null,
        updateNfcTag: async () => null,
        deleteNfcTag: async () => false,
        getPlotkaartByCustomer: () => null,
        updatePlotkaartForCustomer: () => {},
        isLoading: false,
        setIsLoading: () => {},
        users: [],
      }
    }
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}
