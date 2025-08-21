"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  status: "active" | "inactive"
  createdAt: string
  modules?: string[]
}

interface CustomerContextType {
  selectedCustomer: Customer | null
  setSelectedCustomer: (customer: Customer | null) => void
  customers: Customer[]
  setCustomers: (customers: Customer[]) => void
  loading: boolean
  setLoading: (loading: boolean) => void
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined)

export function CustomerProvider({ children }: { children: ReactNode }) {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(false)

  return (
    <CustomerContext.Provider
      value={{
        selectedCustomer,
        setSelectedCustomer,
        customers,
        setCustomers,
        loading,
        setLoading,
      }}
    >
      {children}
    </CustomerContext.Provider>
  )
}

export function useCustomer() {
  const context = useContext(CustomerContext)
  if (context === undefined) {
    throw new Error("useCustomer must be used within a CustomerProvider")
  }
  return context
}

export default CustomerProvider
