"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  contactPerson: string
  createdAt: string
  users: number
  buildings: number
}

interface CustomerContextType {
  customers: Customer[]
  selectedCustomer: Customer | null
  setSelectedCustomer: (customer: Customer | null) => void
  addCustomer: (customer: Omit<Customer, "id" | "createdAt" | "users" | "buildings">) => void
  isLoading: boolean
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined)

export function CustomerProvider({ children }: { children: React.ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load demo customers
    const demoCustomers: Customer[] = [
      {
        id: "1",
        name: "Demo Bedrijf BV",
        email: "info@demobedrijf.nl",
        phone: "+31 20 123 4567",
        address: "Hoofdstraat 123, 1000 AB Amsterdam",
        contactPerson: "Jan de Vries",
        createdAt: "2024-01-15T10:00:00Z",
        users: 25,
        buildings: 3,
      },
      {
        id: "2",
        name: "Veiligheid Eerst BV",
        email: "contact@veiligheideerst.nl",
        phone: "+31 30 987 6543",
        address: "Veiligheidsweg 456, 3500 CD Utrecht",
        contactPerson: "Maria Janssen",
        createdAt: "2024-02-20T14:30:00Z",
        users: 45,
        buildings: 5,
      },
      {
        id: "3",
        name: "BHV Partners",
        email: "info@bhvpartners.nl",
        phone: "+31 10 555 7890",
        address: "Partnerslaan 789, 3000 EF Rotterdam",
        contactPerson: "Piet van der Berg",
        createdAt: "2024-03-10T09:15:00Z",
        users: 12,
        buildings: 2,
      },
    ]

    setCustomers(demoCustomers)
    setSelectedCustomer(demoCustomers[0])
    setIsLoading(false)
  }, [])

  const addCustomer = (customerData: Omit<Customer, "id" | "createdAt" | "users" | "buildings">) => {
    const newCustomer: Customer = {
      ...customerData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      users: 0,
      buildings: 0,
    }
    setCustomers((prev) => [...prev, newCustomer])
  }

  return (
    <CustomerContext.Provider
      value={{
        customers,
        selectedCustomer,
        setSelectedCustomer,
        addCustomer,
        isLoading,
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
