"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface Customer {
  id: string
  name: string
  address: string
  contactPerson: string
  email: string
  phone: string
  status: "active" | "inactive"
  modules: string[]
}

interface CustomerContextType {
  customers: Customer[]
  selectedCustomer: Customer | null
  setSelectedCustomer: (customer: Customer | null) => void
  loading: boolean
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined)

export function CustomerProvider({ children }: { children: React.ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading demo customers
    const demoCustomers: Customer[] = [
      {
        id: "1",
        name: "Provincie Noord-Brabant",
        address: "Brabantlaan 1, 5216 TV 's-Hertogenbosch",
        contactPerson: "Jan van der Berg",
        email: "j.vandenberg@brabant.nl",
        phone: "073-681 2812",
        status: "active",
        modules: ["bhv-team", "plotkaart", "incidenten", "bezoekers"],
      },
      {
        id: "2",
        name: "Gemeente Eindhoven",
        address: "Stadhuisplein 10, 5611 EM Eindhoven",
        contactPerson: "Maria Janssen",
        email: "m.janssen@eindhoven.nl",
        phone: "040-238 0000",
        status: "active",
        modules: ["bhv-team", "plotkaart", "analytics"],
      },
      {
        id: "3",
        name: "Philips Healthcare",
        address: "Veenpluis 4-6, 5684 PC Best",
        contactPerson: "Robert de Vries",
        email: "robert.devries@philips.com",
        phone: "040-276 9111",
        status: "active",
        modules: ["bhv-team", "plotkaart", "incidenten", "bezoekers", "analytics", "mobile-app"],
      },
    ]

    setTimeout(() => {
      setCustomers(demoCustomers)
      setSelectedCustomer(demoCustomers[0]) // Auto-select first customer
      setLoading(false)
    }, 500)
  }, [])

  return (
    <CustomerContext.Provider
      value={{
        customers,
        selectedCustomer,
        setSelectedCustomer,
        loading,
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
