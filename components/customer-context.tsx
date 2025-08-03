"use client"

import type React from "react"
import { createContext, useState, useContext } from "react"

// Define the Customer type
export type Customer = {
  id: string
  name: string
  address: string
  contactPerson: string
  phone: string
  email: string
  isActive: boolean
  modules: string[]
}

// Create the Customer Context
type CustomerContextType = {
  selectedCustomer: Customer | null
  setSelectedCustomer: React.Dispatch<React.SetStateAction<Customer | null>>
  customers: Customer[]
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined)

// Create the Customer Provider
export const CustomerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // BHV360 demo klanten - GEEN provincie referenties meer
  const mockCustomers = [
    {
      id: "1",
      name: "BHV360 Demo Organisatie",
      address: "Veiligheidsstraat 1, 1234 AB Amsterdam",
      contactPerson: "Dhr. J. de Vries",
      phone: "+31 20 123 4567",
      email: "j.devries@bhv360demo.nl",
      isActive: true,
      modules: ["basic", "advanced", "premium"],
    },
    {
      id: "2",
      name: "TechCorp Nederland",
      address: "Innovatielaan 25, 5678 CD Utrecht",
      contactPerson: "Mw. S. van der Berg",
      phone: "+31 30 987 6543",
      email: "s.vandenberg@techcorp.nl",
      isActive: true,
      modules: ["basic", "advanced"],
    },
    {
      id: "3",
      name: "Zorggroep Centraal",
      address: "Gezondheidsplein 10, 9876 EF Rotterdam",
      contactPerson: "Dr. M. Jansen",
      phone: "+31 10 456 7890",
      email: "m.jansen@zorgcentraal.nl",
      isActive: true,
      modules: ["basic", "premium"],
    },
  ]

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(mockCustomers[0])
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers)

  return (
    <CustomerContext.Provider value={{ selectedCustomer, setSelectedCustomer, customers, setCustomers }}>
      {children}
    </CustomerContext.Provider>
  )
}

// Create a custom hook to use the Customer Context
export const useCustomer = (): CustomerContextType => {
  const context = useContext(CustomerContext)
  if (!context) {
    throw new Error("useCustomer must be used within a CustomerProvider")
  }
  return context
}
