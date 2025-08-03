"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface Customer {
  id: string
  name: string
  contactPerson?: string
  email?: string
  phone?: string
  address?: string
  active: boolean
  createdAt: string
  updatedAt: string
}

interface CustomerContextType {
  customers: Customer[]
  selectedCustomer: Customer | null
  setSelectedCustomer: (customer: Customer | null) => void
  addCustomer: (customer: Omit<Customer, "id" | "createdAt" | "updatedAt">) => Promise<Customer>
  updateCustomer: (id: string, customer: Partial<Customer>) => Promise<Customer>
  deleteCustomer: (id: string) => Promise<boolean>
  refreshCustomers: () => Promise<void>
  isLoading: boolean
  error: string | null
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined)

export function CustomerProvider({ children }: { children: React.ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refreshCustomers = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch("/api/customers")
      if (!response.ok) {
        throw new Error("Failed to fetch customers")
      }

      const data = await response.json()
      setCustomers(data.customers || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      console.error("Error fetching customers:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const addCustomer = async (customerData: Omit<Customer, "id" | "createdAt" | "updatedAt">): Promise<Customer> => {
    try {
      setIsLoading(true)
      setError(null)

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
      return newCustomer
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const updateCustomer = async (id: string, customerData: Partial<Customer>): Promise<Customer> => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/customers/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customerData),
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
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const deleteCustomer = async (id: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/customers/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete customer")
      }

      setCustomers((prev) => prev.filter((c) => c.id !== id))

      if (selectedCustomer?.id === id) {
        setSelectedCustomer(null)
      }

      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshCustomers()
  }, [])

  const value: CustomerContextType = {
    customers,
    selectedCustomer,
    setSelectedCustomer,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    refreshCustomers,
    isLoading,
    error,
  }

  return <CustomerContext.Provider value={value}>{children}</CustomerContext.Provider>
}

export function useCustomers() {
  const context = useContext(CustomerContext)
  if (context === undefined) {
    throw new Error("useCustomers must be used within a CustomerProvider")
  }
  return context
}

// Backward compatibility export
export const useCustomer = useCustomers
