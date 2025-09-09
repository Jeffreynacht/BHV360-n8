"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useData } from "@/contexts/data-context"

export interface Customer {
  id: string
  name: string
  address: string
  contactPerson: string
  email: string
  phone: string
  isActive: boolean
  users?: number
  buildings?: number
  status?: string
  created_at?: string
  updated_at?: string
}

interface CustomerContextType {
  selectedCustomer: Customer | null
  setSelectedCustomer: (customer: Customer | null) => void
  customers: Customer[]
  setCustomers: (customers: Customer[]) => void
  loading: boolean
  error: string | null
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined)

export function CustomerProvider({ children }: { children: ReactNode }) {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { getCustomers: fetchCustomers } = useData()

  useEffect(() => {
    const loadCustomers = async () => {
      setLoading(true)
      setError(null)
      try {
        const customerList = await fetchCustomers()
        setCustomers(customerList)
        if (customerList.length > 0 && !selectedCustomer) {
          setSelectedCustomer(customerList[0])
        }
      } catch (e: any) {
        setError(e.message || "Failed to load customers")
      } finally {
        setLoading(false)
      }
    }

    loadCustomers()
  }, [fetchCustomers, selectedCustomer])

  const value: CustomerContextType = {
    selectedCustomer,
    setSelectedCustomer,
    customers,
    setCustomers,
    loading,
    error,
  }

  return <CustomerContext.Provider value={value}>{children}</CustomerContext.Provider>
}

export function useCustomer() {
  const context = useContext(CustomerContext)
  if (context === undefined) {
    throw new Error("useCustomer must be used within a CustomerProvider")
  }
  return context
}

export type { CustomerContextType }
