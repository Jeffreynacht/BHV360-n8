"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface Customer {
  id: number
  name: string
  contactPerson?: string
  email?: string
  phone?: string
  address?: string
  active: boolean
  buildings: number
  users: number
  status: string
  createdAt: string
  updatedAt: string
}

interface CustomerContextType {
  customers: Customer[]
  selectedCustomer: Customer | null
  setSelectedCustomer: (customer: Customer | null) => void
  isLoading: boolean
  addCustomer: (customerData: Partial<Customer>) => Promise<Customer | null>
  updateCustomer: (id: number, customerData: Partial<Customer>) => Promise<Customer | null>
  deleteCustomer: (id: number) => Promise<boolean>
  refreshCustomers: () => Promise<void>
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined)

export function CustomerProvider({ children }: { children: React.ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch customers from API
  const fetchCustomers = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/customers")
      if (response.ok) {
        const data = await response.json()
        setCustomers(data)

        // If no customer is selected and we have customers, select the first one
        if (!selectedCustomer && data.length > 0) {
          setSelectedCustomer(data[0])
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

  // Load customers on mount
  useEffect(() => {
    fetchCustomers()
  }, [])

  // Add new customer
  const addCustomer = async (customerData: Partial<Customer>): Promise<Customer | null> => {
    try {
      const response = await fetch("/api/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: customerData.name,
          contactPerson: customerData.contactPerson,
          email: customerData.email,
          phone: customerData.phone,
          address: customerData.address,
          buildings: customerData.buildings || 1,
          users: customerData.users || 1,
        }),
      })

      if (response.ok) {
        const newCustomer = await response.json()
        setCustomers((prev) => [...prev, newCustomer])
        return newCustomer
      } else {
        console.error("Failed to add customer")
        return null
      }
    } catch (error) {
      console.error("Error adding customer:", error)
      return null
    }
  }

  // Update customer
  const updateCustomer = async (id: number, customerData: Partial<Customer>): Promise<Customer | null> => {
    try {
      const response = await fetch(`/api/customers/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customerData),
      })

      if (response.ok) {
        const updatedCustomer = await response.json()
        setCustomers((prev) => prev.map((c) => (c.id === id ? updatedCustomer : c)))

        // Update selected customer if it's the one being updated
        if (selectedCustomer?.id === id) {
          setSelectedCustomer(updatedCustomer)
        }

        return updatedCustomer
      } else {
        console.error("Failed to update customer")
        return null
      }
    } catch (error) {
      console.error("Error updating customer:", error)
      return null
    }
  }

  // Delete customer
  const deleteCustomer = async (id: number): Promise<boolean> => {
    try {
      const response = await fetch(`/api/customers/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setCustomers((prev) => prev.filter((c) => c.id !== id))

        // Clear selected customer if it's the one being deleted
        if (selectedCustomer?.id === id) {
          const remainingCustomers = customers.filter((c) => c.id !== id)
          setSelectedCustomer(remainingCustomers.length > 0 ? remainingCustomers[0] : null)
        }

        return true
      } else {
        console.error("Failed to delete customer")
        return false
      }
    } catch (error) {
      console.error("Error deleting customer:", error)
      return false
    }
  }

  // Refresh customers
  const refreshCustomers = async () => {
    await fetchCustomers()
  }

  const value: CustomerContextType = {
    customers,
    selectedCustomer,
    setSelectedCustomer,
    isLoading,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    refreshCustomers,
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
