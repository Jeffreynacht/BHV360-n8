"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface Customer {
  id: string
  name: string
  contactPerson: string
  email: string
  phone: string
  address: string
  city?: string
  postalCode?: string
  isActive: boolean
  modules: string[]
  userCount: number
  buildingCount: number
  createdAt: string
  updatedAt: string
  notes?: string
}

interface CustomerContextType {
  customers: Customer[]
  selectedCustomer: Customer | null
  setSelectedCustomer: (customer: Customer | null) => void
  addCustomer: (customer: Omit<Customer, "id" | "createdAt" | "updatedAt">) => Promise<Customer>
  updateCustomer: (id: string, customer: Partial<Customer>) => Promise<Customer | null>
  deleteCustomer: (id: string) => Promise<boolean>
  refreshCustomers: () => Promise<void>
  isLoading: boolean
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined)

// Demo klanten data
const initialCustomers: Customer[] = [
  {
    id: "1",
    name: "Demo Bedrijf BV",
    contactPerson: "Jan Janssen",
    email: "jan@demobedrijf.nl",
    phone: "06-12345678",
    address: "Hoofdstraat 1",
    city: "Amsterdam",
    postalCode: "1234 AB",
    isActive: true,
    modules: ["plotkaart", "bhv-management", "incident-reporting", "rapportages"],
    userCount: 25,
    buildingCount: 3,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    notes: "Hoofdkantoor met 3 vestigingen",
  },
  {
    id: "2",
    name: "Acme Corporation",
    contactPerson: "Piet Pietersen",
    email: "piet@acme.nl",
    phone: "06-87654321",
    address: "Industrieweg 50",
    city: "Rotterdam",
    postalCode: "5678 CD",
    isActive: true,
    modules: ["plotkaart", "nfc-tags", "bhv-management"],
    userCount: 12,
    buildingCount: 1,
    createdAt: "2024-01-20T14:30:00Z",
    updatedAt: "2024-01-20T14:30:00Z",
    notes: "Productielocatie met NFC integratie",
  },
  {
    id: "3",
    name: "Zorgcentrum De Boomgaard",
    contactPerson: "Dr. Sarah van Dijk",
    email: "s.vandijk@boomgaard.nl",
    phone: "020-1234567",
    address: "Zorgplein 15",
    city: "Utrecht",
    postalCode: "3500 AB",
    isActive: true,
    modules: ["plotkaart", "bhv-management", "incident-reporting", "ehbo-voorraad"],
    userCount: 45,
    buildingCount: 2,
    createdAt: "2024-02-01T09:15:00Z",
    updatedAt: "2024-02-01T09:15:00Z",
    notes: "Zorginstelling met speciale BHV eisen",
  },
]

export function CustomerProvider({ children }: { children: React.ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Laad klanten uit localStorage of gebruik initiële data
    const storedCustomers = localStorage.getItem("bhv360-customers")
    if (storedCustomers) {
      try {
        const parsedCustomers = JSON.parse(storedCustomers)
        setCustomers(parsedCustomers)
        // Auto-selecteer eerste klant als er geen geselecteerd is
        if (parsedCustomers.length > 0 && !selectedCustomer) {
          const storedSelected = localStorage.getItem("bhv360-selected-customer")
          if (storedSelected) {
            const parsedSelected = JSON.parse(storedSelected)
            setSelectedCustomer(parsedSelected)
          } else {
            setSelectedCustomer(parsedCustomers[0])
          }
        }
      } catch (error) {
        console.error("Fout bij het parsen van opgeslagen klanten:", error)
        setCustomers(initialCustomers)
        setSelectedCustomer(initialCustomers[0])
      }
    } else {
      setCustomers(initialCustomers)
      setSelectedCustomer(initialCustomers[0])
    }
    setIsLoading(false)
  }, [])

  // Sla klanten op in localStorage wanneer klanten veranderen
  useEffect(() => {
    if (customers.length > 0) {
      localStorage.setItem("bhv360-customers", JSON.stringify(customers))
    }
  }, [customers])

  // Sla geselecteerde klant op in localStorage
  useEffect(() => {
    if (selectedCustomer) {
      localStorage.setItem("bhv360-selected-customer", JSON.stringify(selectedCustomer))
    }
  }, [selectedCustomer])

  const addCustomer = async (customerData: Omit<Customer, "id" | "createdAt" | "updatedAt">): Promise<Customer> => {
    const newCustomer: Customer = {
      ...customerData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setCustomers((prev) => [...prev, newCustomer])
    return newCustomer
  }

  const updateCustomer = async (id: string, customerData: Partial<Customer>): Promise<Customer | null> => {
    const updatedCustomers = customers.map((customer) =>
      customer.id === id ? { ...customer, ...customerData, updatedAt: new Date().toISOString() } : customer,
    )

    setCustomers(updatedCustomers)

    const updatedCustomer = updatedCustomers.find((c) => c.id === id)
    if (updatedCustomer && selectedCustomer?.id === id) {
      setSelectedCustomer(updatedCustomer)
    }

    return updatedCustomer || null
  }

  const deleteCustomer = async (id: string): Promise<boolean> => {
    setCustomers((prev) => prev.filter((customer) => customer.id !== id))

    if (selectedCustomer?.id === id) {
      const remainingCustomers = customers.filter((c) => c.id !== id)
      setSelectedCustomer(remainingCustomers.length > 0 ? remainingCustomers[0] : null)
    }

    return true
  }

  const refreshCustomers = async (): Promise<void> => {
    setIsLoading(true)
    // Simuleer API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  return (
    <CustomerContext.Provider
      value={{
        customers,
        selectedCustomer,
        setSelectedCustomer,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        refreshCustomers,
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
    throw new Error("useCustomer moet gebruikt worden binnen een CustomerProvider")
  }
  return context
}

// Backwards compatibility
export function useCustomers() {
  return useCustomer()
}
