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
  logo?: string
  branding?: {
    primaryColor?: string
    secondaryColor?: string
    customDomain?: string
  }
}

interface CustomerContextType {
  selectedCustomer: Customer | null
  setSelectedCustomer: (customer: Customer | null) => void
  customers: Customer[]
  isLoading: boolean
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined)

// Demo customers met branding
const DEMO_CUSTOMERS: Customer[] = [
  {
    id: "demo-bedrijf-bv",
    name: "Demo Bedrijf BV",
    address: "Hoofdstraat 123, 1234 AB Amsterdam",
    contactPerson: "Jan Janssen",
    email: "jan@demobedrijf.nl",
    phone: "+31 20 123 4567",
    isActive: true,
    logo: "/placeholder.svg?height=40&width=120&text=Demo+BV",
    branding: {
      primaryColor: "#2563eb",
      secondaryColor: "#64748b",
      customDomain: "demo.bhv360.nl",
    },
  },
  {
    id: "test-company-ltd",
    name: "Test Company Ltd",
    address: "Testlaan 456, 5678 CD Rotterdam",
    contactPerson: "Piet Pietersen",
    email: "piet@testcompany.nl",
    phone: "+31 10 987 6543",
    isActive: true,
    logo: "/placeholder.svg?height=40&width=120&text=Test+Co",
    branding: {
      primaryColor: "#059669",
      secondaryColor: "#6b7280",
    },
  },
  {
    id: "zorgcentrum-boomgaard",
    name: "Zorgcentrum De Boomgaard",
    address: "Zorgstraat 789, 3500 EF Utrecht",
    contactPerson: "Dr. Peter van der Berg",
    email: "p.vandenberg@boomgaard.nl",
    phone: "+31 30 555 7890",
    isActive: true,
    logo: "/placeholder.svg?height=40&width=120&text=Zorg+BG",
    branding: {
      primaryColor: "#dc2626",
      secondaryColor: "#991b1b",
    },
  },
  {
    id: "innovatie-hub-tech",
    name: "Innovatie Hub Tech",
    address: "Techpark 101, 2600 GH Delft",
    contactPerson: "Sarah van der Meer",
    email: "s.vandermeer@innovatiehub.nl",
    phone: "+31 15 278 9012",
    isActive: true,
    logo: "/placeholder.svg?height=40&width=120&text=IH+Tech",
    branding: {
      primaryColor: "#7c3aed",
      secondaryColor: "#5b21b6",
    },
  },
  {
    id: "groene-energie-coop",
    name: "Groene Energie Coöperatie",
    address: "Windmolenweg 25, 8000 AB Zwolle",
    contactPerson: "Mark Groenewegen",
    email: "m.groenewegen@groeneenergie.coop",
    phone: "+31 38 456 7890",
    isActive: true,
    logo: "/placeholder.svg?height=40&width=120&text=GE+Coop",
    branding: {
      primaryColor: "#16a34a",
      secondaryColor: "#15803d",
    },
  },
]

export function CustomerProvider({ children }: { children: ReactNode }) {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading customers
    const loadCustomers = async () => {
      setIsLoading(true)

      // Check localStorage for saved customers
      const savedCustomers = localStorage.getItem("bhv360-customers")
      if (savedCustomers) {
        try {
          const parsedCustomers = JSON.parse(savedCustomers)
          setCustomers(parsedCustomers)
        } catch (error) {
          console.error("Error parsing saved customers:", error)
          setCustomers(DEMO_CUSTOMERS)
          localStorage.setItem("bhv360-customers", JSON.stringify(DEMO_CUSTOMERS))
        }
      } else {
        setCustomers(DEMO_CUSTOMERS)
        localStorage.setItem("bhv360-customers", JSON.stringify(DEMO_CUSTOMERS))
      }

      // Check for saved selected customer
      const savedSelectedId = localStorage.getItem("bhv360-selected-customer-id")
      if (savedSelectedId) {
        const customer = DEMO_CUSTOMERS.find((c) => c.id === savedSelectedId)
        if (customer) {
          setSelectedCustomer(customer)
        }
      }

      setIsLoading(false)
    }

    loadCustomers()
  }, [])

  const handleSetSelectedCustomer = (customer: Customer | null) => {
    setSelectedCustomer(customer)
    if (customer) {
      localStorage.setItem("bhv360-selected-customer-id", customer.id)
    } else {
      localStorage.removeItem("bhv360-selected-customer-id")
    }
  }

  return (
    <CustomerContext.Provider
      value={{
        selectedCustomer,
        setSelectedCustomer: handleSetSelectedCustomer,
        customers,
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
