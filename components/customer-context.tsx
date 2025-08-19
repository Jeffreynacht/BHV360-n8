"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CustomerContextType {
  customers: Customer[]
  selectedCustomer: Customer | null
  setSelectedCustomer: (customer: Customer | null) => void
  loading: boolean
  error: string | null
  refreshCustomers: () => Promise<void>
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined)

export function useCustomer() {
  const context = useContext(CustomerContext)
  if (context === undefined) {
    throw new Error("useCustomer must be used within a CustomerProvider")
  }
  return context
}

interface CustomerProviderProps {
  children: ReactNode
}

export function CustomerProvider({ children }: CustomerProviderProps) {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const mockCustomers: Customer[] = [
    {
      id: "1",
      name: "Acme Corporation",
      email: "contact@acme.com",
      phone: "+31 20 123 4567",
      address: "Hoofdstraat 123, 1000 AB Amsterdam",
      isActive: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    },
    {
      id: "2",
      name: "TechCorp Nederland",
      email: "info@techcorp.nl",
      phone: "+31 30 987 6543",
      address: "Innovatielaan 456, 3500 CD Utrecht",
      isActive: true,
      createdAt: "2024-01-02T00:00:00Z",
      updatedAt: "2024-01-02T00:00:00Z",
    },
    {
      id: "3",
      name: "Provincie Noord-Brabant",
      email: "contact@brabant.nl",
      phone: "+31 73 681 2345",
      address: "Brabantlaan 1, 5200 BX Den Bosch",
      isActive: true,
      createdAt: "2024-01-03T00:00:00Z",
      updatedAt: "2024-01-03T00:00:00Z",
    },
  ]

  const refreshCustomers = async () => {
    try {
      setLoading(true)
      setError(null)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setCustomers(mockCustomers)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load customers")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshCustomers()
  }, [])

  const value: CustomerContextType = {
    customers,
    selectedCustomer,
    setSelectedCustomer,
    loading,
    error,
    refreshCustomers,
  }

  return <CustomerContext.Provider value={value}>{children}</CustomerContext.Provider>
}
