"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

// Define the Customer interface
export interface Customer {
  id: string
  name: string
  address: string
  contactPerson: string
  email: string
  phone: string
  logo?: string
  users?: number
  buildings?: number
  createdAt?: string
}

// Define the CustomerContext type
export interface CustomerContextType {
  selectedCustomer: Customer | null
  setSelectedCustomer: (customer: Customer | null) => void
  customers: Customer[]
  setCustomers: (customers: Customer[]) => void
  addCustomer: (customer: Omit<Customer, "id">) => void
  updateCustomer: (id: string, updates: Partial<Customer>) => void
  deleteCustomer: (id: string) => void
  isLoading: boolean
}

// Create the CustomerContext
const CustomerContext = createContext<CustomerContextType | undefined>(undefined)

// CustomerProvider component
export function CustomerProvider({ children }: { children: React.ReactNode }) {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Load customers from local storage on initial load
    const storedCustomers = localStorage.getItem("customers")
    if (storedCustomers) {
      setCustomers(JSON.parse(storedCustomers))
    }
  }, [])

  useEffect(() => {
    // Save customers to local storage whenever the customers state changes
    localStorage.setItem("customers", JSON.stringify(customers))
  }, [customers])

  const addCustomer = (customer: Omit<Customer, "id">) => {
    const newCustomer: Customer = {
      ...customer,
      id: Date.now().toString(), // Generate a unique ID
    }
    setCustomers([...customers, newCustomer])
  }

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers(customers.map((customer) => (customer.id === id ? { ...customer, ...updates } : customer)))
  }

  const deleteCustomer = (id: string) => {
    setCustomers(customers.filter((customer) => customer.id !== id))
  }

  const value: CustomerContextType = {
    selectedCustomer,
    setSelectedCustomer,
    customers,
    setCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    isLoading,
  }

  return <CustomerContext.Provider value={value}>{children}</CustomerContext.Provider>
}

// Custom hook to use the customer context
export function useCustomer() {
  const context = useContext(CustomerContext)
  if (context === undefined) {
    throw new Error("useCustomer must be used within a CustomerProvider")
  }
  return context
}
