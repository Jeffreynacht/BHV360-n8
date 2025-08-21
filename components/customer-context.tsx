"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

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

const DEMO_CUSTOMERS: Customer[] = [
  {
    id: "demo-bedrijf-bv",
    name: "Demo Bedrijf BV",
    address: "Hoofdstraat 123, 1234 AB Amsterdam",
    contactPerson: "Jan Janssen",
    email: "jan@demobedrijf.nl",
    phone: "+31 20 123 4567",
    isActive: true,
    users: 25,
    buildings: 3,
    status: "active",
  },
  {
    id: "test-company-ltd",
    name: "Test Company Ltd",
    address: "Testlaan 456, 5678 CD Rotterdam",
    contactPerson: "Piet Pietersen",
    email: "piet@testcompany.nl",
    phone: "+31 10 987 6543",
    isActive: true,
    users: 50,
    buildings: 2,
    status: "active",
  },
  {
    id: "zorgcentrum-boomgaard",
    name: "Zorgcentrum De Boomgaard",
    address: "Zorgstraat 789, 3500 EF Utrecht",
    contactPerson: "Dr. Peter van der Berg",
    email: "p.vandenberg@boomgaard.nl",
    phone: "+31 30 555 7890",
    isActive: true,
    users: 100,
    buildings: 5,
    status: "active",
  },
]

export function CustomerProvider({ children }: { children: ReactNode }) {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [customers, setCustomers] = useState<Customer[]>(DEMO_CUSTOMERS)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Auto-select first customer on mount
  useEffect(() => {
    if (!selectedCustomer && customers.length > 0) {
      setSelectedCustomer(customers[0])
    }
  }, [customers, selectedCustomer])

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
