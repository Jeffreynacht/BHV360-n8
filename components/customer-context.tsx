"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface Customer {
  id: string
  name: string
  contactPerson: string
  email: string
  phone: string
  address: string
  createdAt: string
  isActive: boolean
  modules: string[]
  userCount: number
  lastActivity?: string
}

interface CustomerContextType {
  customers: Customer[]
  selectedCustomer: Customer | null
  setSelectedCustomer: (customer: Customer | null) => void
  addCustomer: (customer: Omit<Customer, "id" | "createdAt">) => Promise<Customer>
  updateCustomer: (id: string, updates: Partial<Customer>) => Promise<Customer>
  deleteCustomer: (id: string) => Promise<void>
  refreshCustomers: () => Promise<void>
  isLoading: boolean
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined)

// Export both useCustomer and useCustomers for compatibility
export function useCustomer() {
  const context = useContext(CustomerContext)
  if (context === undefined) {
    throw new Error("useCustomer must be used within a CustomerProvider")
  }
  return context
}

export function useCustomers() {
  const context = useContext(CustomerContext)
  if (context === undefined) {
    throw new Error("useCustomers must be used within a CustomerProvider")
  }
  return context
}

export function CustomerProvider({ children }: { children: React.ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load customers on mount
  useEffect(() => {
    refreshCustomers()
  }, [])

  const refreshCustomers = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/customers")
      if (response.ok) {
        const data = await response.json()
        setCustomers(data.customers || [])

        // If no customer is selected and we have customers, select the first one
        if (!selectedCustomer && data.customers && data.customers.length > 0) {
          setSelectedCustomer(data.customers[0])
        }
      } else {
        console.error("Failed to fetch customers")
        setCustomers([])
      }
    } catch (error) {
      console.error("Error fetching customers:", error)
      setCustomers([])
    } finally {
      setIsLoading(false)
    }
  }

  const addCustomer = async (customerData: Omit<Customer, "id" | "createdAt">): Promise<Customer> => {
    try {
      const response = await fetch("/api/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customerData),
      })

      if (!response.ok) {
        throw new Error("Failed to add customer")
      }

      const newCustomer = await response.json()
      setCustomers((prev) => [...prev, newCustomer])

      // Auto-select the new customer if it's the first one
      if (customers.length === 0) {
        setSelectedCustomer(newCustomer)
      }

      return newCustomer
    } catch (error) {
      console.error("Error adding customer:", error)
      throw error
    }
  }

  const updateCustomer = async (id: string, updates: Partial<Customer>): Promise<Customer> => {
    try {
      const response = await fetch(`/api/customers/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        throw new Error("Failed to update customer")
      }

      const updatedCustomer = await response.json()
      setCustomers((prev) => prev.map((c) => (c.id === id ? updatedCustomer : c)))

      if (selectedCustomer?.id === id) {
        setSelectedCustomer(updatedCustomer)
      }

      return updatedCustomer
    } catch (error) {
      console.error("Error updating customer:", error)
      throw error
    }
  }

  const deleteCustomer = async (id: string): Promise<void> => {
    try {
      const response = await fetch(`/api/customers/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete customer")
      }

      setCustomers((prev) => prev.filter((c) => c.id !== id))

      if (selectedCustomer?.id === id) {
        const remainingCustomers = customers.filter((c) => c.id !== id)
        setSelectedCustomer(remainingCustomers.length > 0 ? remainingCustomers[0] : null)
      }
    } catch (error) {
      console.error("Error deleting customer:", error)
      throw error
    }
  }

  const value: CustomerContextType = {
    customers,
    selectedCustomer,
    setSelectedCustomer,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    refreshCustomers,
    isLoading,
  }

  return <CustomerContext.Provider value={value}>{children}</CustomerContext.Provider>
}
