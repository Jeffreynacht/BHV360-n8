"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface DataContextType {
  // Users
  getUsersByCustomer: (customerId: string) => Promise<any[]>
  addUser: (user: any, customerId: string) => Promise<any>
  updateUser: (id: string, user: any) => Promise<any>
  deleteUser: (id: string) => Promise<boolean>

  // Facilities
  getFacilitiesByCustomer: (customerId: string) => Promise<any[]>
  addFacility: (facility: any, customerId: string) => Promise<any>
  updateFacility: (id: string, facility: any) => Promise<any>
  deleteFacility: (id: string) => Promise<boolean>

  // NFC Tags
  getNfcTagsByCustomer: (customerId: string) => Promise<any[]>
  addNfcTag: (tag: any, customerId: string) => Promise<any>
  updateNfcTag: (id: string, tag: any) => Promise<any>
  deleteNfcTag: (id: string) => Promise<boolean>

  // Plotkaart
  getPlotkaartByCustomer: (customerId: string) => Promise<any>
  updatePlotkaartForCustomer: (customerId: string, floors: any[]) => Promise<any>

  // Loading states
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

const NeonDataContext = createContext<DataContextType | undefined>(undefined)

export function NeonDataProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // API base URL for Netlify Functions
  const API_BASE = typeof window !== "undefined" ? `${window.location.origin}/.netlify/functions` : ""

  // Helper function for API calls
  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    if (!isClient) return null

    try {
      const response = await fetch(`${API_BASE}/${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      })

      if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`API call to ${endpoint} failed:`, error)
      return null
    }
  }

  // User management functions
  const getUsersByCustomer = async (customerId: string) => {
    const result = await apiCall(`users?customerId=${customerId}`)
    return result || []
  }

  const addUser = async (user: any, customerId: string) => {
    const result = await apiCall("users", {
      method: "POST",
      body: JSON.stringify({ ...user, customer_id: customerId }),
    })
    return result
  }

  const updateUser = async (id: string, user: any) => {
    const result = await apiCall(`users/${id}`, {
      method: "PUT",
      body: JSON.stringify(user),
    })
    return result
  }

  const deleteUser = async (id: string) => {
    const result = await apiCall(`users/${id}`, {
      method: "DELETE",
    })
    return !!result
  }

  // Facility management functions
  const getFacilitiesByCustomer = async (customerId: string) => {
    const result = await apiCall(`facilities?customerId=${customerId}`)
    return result || []
  }

  const addFacility = async (facility: any, customerId: string) => {
    const result = await apiCall("facilities", {
      method: "POST",
      body: JSON.stringify({ ...facility, customer_id: customerId }),
    })
    return result
  }

  const updateFacility = async (id: string, facility: any) => {
    const result = await apiCall(`facilities/${id}`, {
      method: "PUT",
      body: JSON.stringify(facility),
    })
    return result
  }

  const deleteFacility = async (id: string) => {
    const result = await apiCall(`facilities/${id}`, {
      method: "DELETE",
    })
    return !!result
  }

  // NFC Tag management functions
  const getNfcTagsByCustomer = async (customerId: string) => {
    const result = await apiCall(`nfc-tags?customerId=${customerId}`)
    return result || []
  }

  const addNfcTag = async (tag: any, customerId: string) => {
    const result = await apiCall("nfc-tags", {
      method: "POST",
      body: JSON.stringify({ ...tag, customer_id: customerId }),
    })
    return result
  }

  const updateNfcTag = async (id: string, tag: any) => {
    const result = await apiCall(`nfc-tags/${id}`, {
      method: "PUT",
      body: JSON.stringify(tag),
    })
    return result
  }

  const deleteNfcTag = async (id: string) => {
    const result = await apiCall(`nfc-tags/${id}`, {
      method: "DELETE",
    })
    return !!result
  }

  // Plotkaart management functions
  const getPlotkaartByCustomer = async (customerId: string) => {
    const result = await apiCall(`plotkaart?customerId=${customerId}`)
    return result
  }

  const updatePlotkaartForCustomer = async (customerId: string, floors: any[]) => {
    const result = await apiCall("plotkaart", {
      method: "POST",
      body: JSON.stringify({
        customer_id: customerId,
        floors,
        updated_by: "Current User",
      }),
    })
    return result
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
  }

  return <NeonDataContext.Provider value={value}>{children}</NeonDataContext.Provider>
}

export function useNeonData() {
  const context = useContext(NeonDataContext)
  if (context === undefined) {
    // Return safe defaults during SSR
    if (typeof window === "undefined") {
      return {
        getUsersByCustomer: async () => [],
        addUser: async () => null,
        updateUser: async () => null,
        deleteUser: async () => false,
        getFacilitiesByCustomer: async () => [],
        addFacility: async () => null,
        updateFacility: async () => null,
        deleteFacility: async () => false,
        getNfcTagsByCustomer: async () => [],
        addNfcTag: async () => null,
        updateNfcTag: async () => null,
        deleteNfcTag: async () => false,
        getPlotkaartByCustomer: async () => null,
        updatePlotkaartForCustomer: async () => null,
        isLoading: false,
        setIsLoading: () => {},
      }
    }
    throw new Error("useNeonData must be used within a NeonDataProvider")
  }
  return context
}
