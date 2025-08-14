"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"

interface Customer {
  id: string
  name: string
  type: string
  active: boolean
}

interface CustomerContextType {
  selectedCustomer: Customer | null
  customers: Customer[]
  selectCustomer: (customer: Customer) => void
  loading: boolean
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined)

export function CustomerProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      // Set demo customer based on user
      const demoCustomer: Customer = {
        id: user.customerId || "demo-company",
        name: user.customerName || "Demo Bedrijf BV",
        type: "demo",
        active: true,
      }

      setSelectedCustomer(demoCustomer)
      setCustomers([demoCustomer])
    }
    setLoading(false)
  }, [user])

  const selectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer)
  }

  return (
    <CustomerContext.Provider value={{ selectedCustomer, customers, selectCustomer, loading }}>
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
