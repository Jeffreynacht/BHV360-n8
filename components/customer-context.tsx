"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  contactPerson: string
  isActive: boolean
  users: number
  buildings: number
  createdAt: string
}

export interface CustomerContextType {
  customers: Customer[]
  selectedCustomer: Customer | null
  setSelectedCustomer: (customer: Customer | null) => void
  addCustomer: (customer: Omit<Customer, "id" | "isActive" | "users" | "buildings" | "createdAt">) => void
  isLoading: boolean
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined)

export function useCustomer() {
  const context = useContext(CustomerContext)
  if (context === undefined) {
    // Return default values instead of throwing error during SSR
    return {
      customers: [],
      selectedCustomer: null,
      setSelectedCustomer: () => {},
      addCustomer: () => {},
      isLoading: false,
    }
  }
  return context
}

interface CustomerProviderProps {
  children: ReactNode
}

export function CustomerProvider({ children }: CustomerProviderProps) {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Initialize with demo customers
    const demoCustomers: Customer[] = [
      {
        id: "1",
        name: "Ziekenhuis Sint Anna",
        email: "info@sintanna.nl",
        phone: "+31 13 123 4567",
        address: "Hoofdstraat 123, 5000 AB Tilburg",
        contactPerson: "Dr. Maria van der Berg",
        isActive: true,
        users: 45,
        buildings: 3,
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        name: "Gemeente Tilburg",
        email: "bhv@tilburg.nl",
        phone: "+31 13 234 5678",
        address: "Stadhuisplein 1, 5038 BC Tilburg",
        contactPerson: "Jan Janssen",
        isActive: true,
        users: 120,
        buildings: 8,
        createdAt: new Date().toISOString(),
      },
      {
        id: "3",
        name: "Fontys Hogescholen",
        email: "veiligheid@fontys.nl",
        phone: "+31 8850 60000",
        address: "Rachelsmolen 1, 5612 MA Eindhoven",
        contactPerson: "Sarah de Vries",
        isActive: true,
        users: 89,
        buildings: 12,
        createdAt: new Date().toISOString(),
      },
    ]

    setCustomers(demoCustomers)
    setSelectedCustomer(demoCustomers[0])
    setIsLoading(false)
  }, [])

  const addCustomer = (customerData: Omit<Customer, "id" | "isActive" | "users" | "buildings" | "createdAt">) => {
    const newCustomer: Customer = {
      ...customerData,
      id: Date.now().toString(),
      isActive: true,
      users: 0,
      buildings: 0,
      createdAt: new Date().toISOString(),
    }
    setCustomers((prev) => [...prev, newCustomer])
  }

  const value: CustomerContextType = {
    customers,
    selectedCustomer,
    setSelectedCustomer,
    addCustomer,
    isLoading,
  }

  return <CustomerContext.Provider value={value}>{children}</CustomerContext.Provider>
}
