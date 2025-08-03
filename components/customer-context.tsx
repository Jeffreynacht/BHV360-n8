"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  contactPerson: string
  createdAt: string
  isActive: boolean
  buildings?: number
  users?: number
  notes?: string
}

interface CustomerContextType {
  customers: Customer[]
  selectedCustomer: Customer | null
  setSelectedCustomer: (customer: Customer | null) => void
  addCustomer: (customer: Omit<Customer, "id" | "createdAt">) => Promise<Customer>
  updateCustomer: (id: string, updates: Partial<Customer>) => Promise<Customer>
  deleteCustomer: (id: string) => Promise<boolean>
  refreshCustomers: () => Promise<void>
  isLoading: boolean
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined)

export function CustomerProvider({ children }: { children: React.ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [selectedCustomer, setSelectedCustomerState] = useState<Customer | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load customers on mount
  useEffect(() => {
    refreshCustomers()
  }, [])

  // Load selected customer from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("bhv360_selected_customer")
        if (saved) {
          const customer = JSON.parse(saved)
          setSelectedCustomerState(customer)
        }
      } catch (error) {
        console.error("Error loading selected customer:", error)
      }
    }
  }, [])

  const refreshCustomers = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/customers")

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setCustomers(data.customers || [])
      } else {
        console.error("API returned error:", data.error)
        setCustomers([])
      }
    } catch (error) {
      console.error("Error loading customers:", error)
      setCustomers([])
    } finally {
      setIsLoading(false)
    }
  }

  const setSelectedCustomer = (customer: Customer | null) => {
    setSelectedCustomerState(customer)
    if (typeof window !== "undefined") {
      if (customer) {
        localStorage.setItem("bhv360_selected_customer", JSON.stringify(customer))
      } else {
        localStorage.removeItem("bhv360_selected_customer")
      }
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
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to add customer")
      }

      const newCustomer = await response.json()
      setCustomers((prev) => [...prev, newCustomer])
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
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update customer")
      }

      const updatedCustomer = await response.json()
      setCustomers((prev) => prev.map((customer) => (customer.id === id ? updatedCustomer : customer)))

      if (selectedCustomer?.id === id) {
        setSelectedCustomer(updatedCustomer)
      }

      return updatedCustomer
    } catch (error) {
      console.error("Error updating customer:", error)
      throw error
    }
  }

  const deleteCustomer = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/customers/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete customer")
      }

      setCustomers((prev) => prev.filter((customer) => customer.id !== id))

      if (selectedCustomer?.id === id) {
        setSelectedCustomer(null)
      }

      return true
    } catch (error) {
      console.error("Error deleting customer:", error)
      return false
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

export function useCustomer() {
  const context = useContext(CustomerContext)
  if (context === undefined) {
    throw new Error("useCustomer must be used within a CustomerProvider")
  }
  return context
}

// Backward compatibility
export function useCustomers() {
  return useCustomer()
}
