"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  city?: string
  postalCode?: string
  country?: string
  industry?: string
  employeeCount?: number
  subscriptionPlan?: "starter" | "professional" | "enterprise"
  subscriptionStatus?: "active" | "inactive" | "trial" | "expired"
  createdAt: string
  updatedAt: string
  settings?: {
    notifications: boolean
    emailReports: boolean
    smsAlerts: boolean
    language: string
    timezone: string
  }
  modules?: string[]
  contactPerson?: {
    name: string
    email: string
    phone: string
    role: string
  }
  billingInfo?: {
    companyName: string
    vatNumber?: string
    billingAddress: string
    billingCity: string
    billingPostalCode: string
    billingCountry: string
  }
}

interface CustomerContextType {
  selectedCustomer: Customer | null
  customers: Customer[]
  isLoading: boolean
  error: string | null
  selectCustomer: (customer: Customer | null) => void
  updateCustomer: (customer: Customer) => void
  refreshCustomers: () => Promise<void>
  createCustomer: (customerData: Partial<Customer>) => Promise<Customer>
  deleteCustomer: (customerId: string) => Promise<void>
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
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Mock data for development
  const mockCustomers: Customer[] = [
    {
      id: "1",
      name: "Acme Corporation",
      email: "contact@acme.com",
      phone: "+31 20 123 4567",
      address: "Hoofdstraat 123",
      city: "Amsterdam",
      postalCode: "1000 AB",
      country: "Nederland",
      industry: "Technology",
      employeeCount: 150,
      subscriptionPlan: "professional",
      subscriptionStatus: "active",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-15T10:30:00Z",
      settings: {
        notifications: true,
        emailReports: true,
        smsAlerts: false,
        language: "nl",
        timezone: "Europe/Amsterdam",
      },
      modules: ["plotkaart", "incident-management", "team-coordination"],
      contactPerson: {
        name: "Jan de Vries",
        email: "jan@acme.com",
        phone: "+31 20 123 4567",
        role: "BHV Coördinator",
      },
      billingInfo: {
        companyName: "Acme Corporation B.V.",
        vatNumber: "NL123456789B01",
        billingAddress: "Hoofdstraat 123",
        billingCity: "Amsterdam",
        billingPostalCode: "1000 AB",
        billingCountry: "Nederland",
      },
    },
    {
      id: "2",
      name: "Beta Industries",
      email: "info@beta.nl",
      phone: "+31 30 987 6543",
      address: "Industrieweg 456",
      city: "Utrecht",
      postalCode: "3500 CD",
      country: "Nederland",
      industry: "Manufacturing",
      employeeCount: 75,
      subscriptionPlan: "starter",
      subscriptionStatus: "active",
      createdAt: "2024-01-10T00:00:00Z",
      updatedAt: "2024-01-14T14:20:00Z",
      settings: {
        notifications: true,
        emailReports: false,
        smsAlerts: true,
        language: "nl",
        timezone: "Europe/Amsterdam",
      },
      modules: ["plotkaart", "incident-management"],
      contactPerson: {
        name: "Maria Janssen",
        email: "maria@beta.nl",
        phone: "+31 30 987 6543",
        role: "Veiligheidscoördinator",
      },
    },
    {
      id: "3",
      name: "Gamma Services",
      email: "contact@gamma.com",
      phone: "+31 40 555 1234",
      address: "Servicestraat 789",
      city: "Eindhoven",
      postalCode: "5600 EF",
      country: "Nederland",
      industry: "Services",
      employeeCount: 300,
      subscriptionPlan: "enterprise",
      subscriptionStatus: "active",
      createdAt: "2023-12-01T00:00:00Z",
      updatedAt: "2024-01-12T09:15:00Z",
      settings: {
        notifications: true,
        emailReports: true,
        smsAlerts: true,
        language: "nl",
        timezone: "Europe/Amsterdam",
      },
      modules: ["plotkaart", "incident-management", "team-coordination", "analytics", "nfc-integration"],
      contactPerson: {
        name: "Peter van der Berg",
        email: "peter@gamma.com",
        phone: "+31 40 555 1234",
        role: "Facility Manager",
      },
      billingInfo: {
        companyName: "Gamma Services N.V.",
        vatNumber: "NL987654321B01",
        billingAddress: "Servicestraat 789",
        billingCity: "Eindhoven",
        billingPostalCode: "5600 EF",
        billingCountry: "Nederland",
      },
    },
  ]

  const selectCustomer = (customer: Customer | null) => {
    setSelectedCustomer(customer)
    if (customer) {
      localStorage.setItem("selectedCustomerId", customer.id)
    } else {
      localStorage.removeItem("selectedCustomerId")
    }
  }

  const updateCustomer = (updatedCustomer: Customer) => {
    setCustomers((prev) => prev.map((customer) => (customer.id === updatedCustomer.id ? updatedCustomer : customer)))
    if (selectedCustomer?.id === updatedCustomer.id) {
      setSelectedCustomer(updatedCustomer)
    }
  }

  const refreshCustomers = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setCustomers(mockCustomers)
    } catch (err) {
      setError("Failed to refresh customers")
      console.error("Error refreshing customers:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const createCustomer = async (customerData: Partial<Customer>): Promise<Customer> => {
    setIsLoading(true)
    setError(null)
    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newCustomer: Customer = {
        id: Date.now().toString(),
        name: customerData.name || "",
        email: customerData.email || "",
        phone: customerData.phone,
        address: customerData.address,
        city: customerData.city,
        postalCode: customerData.postalCode,
        country: customerData.country || "Nederland",
        industry: customerData.industry,
        employeeCount: customerData.employeeCount,
        subscriptionPlan: customerData.subscriptionPlan || "starter",
        subscriptionStatus: "trial",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        settings: {
          notifications: true,
          emailReports: true,
          smsAlerts: false,
          language: "nl",
          timezone: "Europe/Amsterdam",
        },
        modules: ["plotkaart"],
        ...customerData,
      }

      setCustomers((prev) => [...prev, newCustomer])
      return newCustomer
    } catch (err) {
      setError("Failed to create customer")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const deleteCustomer = async (customerId: string) => {
    setIsLoading(true)
    setError(null)
    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setCustomers((prev) => prev.filter((customer) => customer.id !== customerId))
      if (selectedCustomer?.id === customerId) {
        setSelectedCustomer(null)
        localStorage.removeItem("selectedCustomerId")
      }
    } catch (err) {
      setError("Failed to delete customer")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Load customers and selected customer on mount
  useEffect(() => {
    const loadData = async () => {
      await refreshCustomers()

      // Restore selected customer from localStorage
      const savedCustomerId = localStorage.getItem("selectedCustomerId")
      if (savedCustomerId) {
        const savedCustomer = mockCustomers.find((c) => c.id === savedCustomerId)
        if (savedCustomer) {
          setSelectedCustomer(savedCustomer)
        }
      }
    }

    loadData()
  }, [])

  const value: CustomerContextType = {
    selectedCustomer,
    customers,
    isLoading,
    error,
    selectCustomer,
    updateCustomer,
    refreshCustomers,
    createCustomer,
    deleteCustomer,
  }

  return <CustomerContext.Provider value={value}>{children}</CustomerContext.Provider>
}

export default CustomerProvider
