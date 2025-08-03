"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useCustomer } from "@/components/customer-context"

interface DataContextType {
  // Users
  getUsersByCustomer: (customerId: number) => any[]
  addUser: (user: any, customerId: number) => void
  updateUser: (id: number, user: any) => void
  deleteUser: (id: number) => void

  // Facilities
  getFacilitiesByCustomer: (customerId: number) => any[]
  addFacility: (facility: any, customerId: number) => void
  updateFacility: (id: string, facility: any) => void
  deleteFacility: (id: string) => void

  // NFC Tags
  getNfcTagsByCustomer: (customerId: number) => Promise<any[]>
  addNfcTag: (tag: any, customerId: number) => Promise<any>
  updateNfcTag: (id: string, tag: any) => Promise<any>
  deleteNfcTag: (id: string) => Promise<boolean>

  // Plotkaart
  getPlotkaartByCustomer: (customerId: number) => any
  updatePlotkaartForCustomer: (customerId: number, floors: any[]) => void

  // Loading states
  isLoading: boolean
  setIsLoading: (loading: boolean) => void

  // Users array for compatibility
  users: any[]
}

const DataContext = createContext<DataContextType | undefined>(undefined)

// In-memory storage for customer data
const customerData: { [customerId: number]: any } = {}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [users, setUsers] = useState<any[]>([])
  const { selectedCustomer } = useCustomer()

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Initialize customer data if it doesn't exist
  const initializeCustomerData = (customerId: number) => {
    if (!customerData[customerId]) {
      customerData[customerId] = {
        users: [],
        facilities: [],
        nfcTags: [],
        plotkaart: {
          id: customerId,
          floors: [],
          lastUpdated: new Date().toISOString(),
          updatedBy: "System",
        },
      }
    }
  }

  // Update users when customer changes
  useEffect(() => {
    if (selectedCustomer && isClient) {
      const customerId = Number.parseInt(selectedCustomer.id.toString())
      initializeCustomerData(customerId)
      setUsers(customerData[customerId].users)
    } else {
      setUsers([])
    }
  }, [selectedCustomer, isClient])

  // User management functions
  const getUsersByCustomer = (customerId: number) => {
    if (!isClient) return []
    initializeCustomerData(customerId)
    return customerData[customerId].users
  }

  const addUser = (user: any, customerId: number) => {
    if (!isClient) return
    initializeCustomerData(customerId)

    const newUser = {
      ...user,
      id: Date.now(),
      customerId,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    customerData[customerId].users.push(newUser)

    if (selectedCustomer && Number.parseInt(selectedCustomer.id.toString()) === customerId) {
      setUsers([...customerData[customerId].users])
    }

    console.log("Added user:", newUser)
  }

  const updateUser = (id: number, user: any) => {
    if (!isClient || !selectedCustomer) return

    const customerId = Number.parseInt(selectedCustomer.id.toString())
    initializeCustomerData(customerId)

    const userIndex = customerData[customerId].users.findIndex((u: any) => u.id === id)
    if (userIndex !== -1) {
      customerData[customerId].users[userIndex] = {
        ...customerData[customerId].users[userIndex],
        ...user,
        updatedAt: new Date().toISOString(),
      }
      setUsers([...customerData[customerId].users])
      console.log("Updated user:", customerData[customerId].users[userIndex])
    }
  }

  const deleteUser = (id: number) => {
    if (!isClient || !selectedCustomer) return

    const customerId = Number.parseInt(selectedCustomer.id.toString())
    initializeCustomerData(customerId)

    customerData[customerId].users = customerData[customerId].users.filter((u: any) => u.id !== id)
    setUsers([...customerData[customerId].users])
    console.log("Deleted user with id:", id)
  }

  // Facility management functions
  const getFacilitiesByCustomer = (customerId: number) => {
    if (!isClient) return []
    initializeCustomerData(customerId)
    return customerData[customerId].facilities
  }

  const addFacility = (facility: any, customerId: number) => {
    if (!isClient) return
    initializeCustomerData(customerId)

    const newFacility = {
      ...facility,
      id: Date.now().toString(),
      customerId,
      status: "operational",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    customerData[customerId].facilities.push(newFacility)
    console.log("Added facility:", newFacility)
  }

  const updateFacility = (id: string, facility: any) => {
    if (!isClient || !selectedCustomer) return

    const customerId = Number.parseInt(selectedCustomer.id.toString())
    initializeCustomerData(customerId)

    const facilityIndex = customerData[customerId].facilities.findIndex((f: any) => f.id === id)
    if (facilityIndex !== -1) {
      customerData[customerId].facilities[facilityIndex] = {
        ...customerData[customerId].facilities[facilityIndex],
        ...facility,
        updatedAt: new Date().toISOString(),
      }
      console.log("Updated facility:", customerData[customerId].facilities[facilityIndex])
    }
  }

  const deleteFacility = (id: string) => {
    if (!isClient || !selectedCustomer) return

    const customerId = Number.parseInt(selectedCustomer.id.toString())
    initializeCustomerData(customerId)

    customerData[customerId].facilities = customerData[customerId].facilities.filter((f: any) => f.id !== id)
    console.log("Deleted facility with id:", id)
  }

  // NFC Tag management functions
  const getNfcTagsByCustomer = async (customerId: number) => {
    if (!isClient) return []
    initializeCustomerData(customerId)
    return customerData[customerId].nfcTags
  }

  const addNfcTag = async (tag: any, customerId: number) => {
    if (!isClient) return null
    initializeCustomerData(customerId)

    const newTag = {
      ...tag,
      id: Date.now().toString(),
      customerId,
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    customerData[customerId].nfcTags.push(newTag)
    console.log("Added NFC tag:", newTag)
    return newTag
  }

  const updateNfcTag = async (id: string, tag: any) => {
    if (!isClient || !selectedCustomer) return null

    const customerId = Number.parseInt(selectedCustomer.id.toString())
    initializeCustomerData(customerId)

    const tagIndex = customerData[customerId].nfcTags.findIndex((t: any) => t.id === id)
    if (tagIndex !== -1) {
      customerData[customerId].nfcTags[tagIndex] = {
        ...customerData[customerId].nfcTags[tagIndex],
        ...tag,
        updatedAt: new Date().toISOString(),
      }
      console.log("Updated NFC tag:", customerData[customerId].nfcTags[tagIndex])
      return customerData[customerId].nfcTags[tagIndex]
    }
    return null
  }

  const deleteNfcTag = async (id: string) => {
    if (!isClient || !selectedCustomer) return false

    const customerId = Number.parseInt(selectedCustomer.id.toString())
    initializeCustomerData(customerId)

    customerData[customerId].nfcTags = customerData[customerId].nfcTags.filter((t: any) => t.id !== id)
    console.log("Deleted NFC tag with id:", id)
    return true
  }

  // Plotkaart management functions
  const getPlotkaartByCustomer = (customerId: number) => {
    if (!isClient) return null
    initializeCustomerData(customerId)
    return customerData[customerId].plotkaart
  }

  const updatePlotkaartForCustomer = (customerId: number, floors: any[]) => {
    if (!isClient) return
    initializeCustomerData(customerId)

    customerData[customerId].plotkaart = {
      ...customerData[customerId].plotkaart,
      floors,
      lastUpdated: new Date().toISOString(),
      updatedBy: "Current User",
    }

    console.log("Updated plotkaart for customer:", customerId, floors)
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
