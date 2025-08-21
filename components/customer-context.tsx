"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  createdAt: string
  contactPerson: string
  users: number
  buildings: number
  isActive: boolean
}

interface CustomerContextType {
  customers: Customer[]
  selectedCustomer: Customer | null
  setSelectedCustomer: (customer: Customer | null) => void
  addCustomer: (customer: Omit<Customer, "id" | "createdAt" | "users" | "buildings" | "isActive">) => void
  setCustomers: (customers: Customer[]) => void
  isLoading: boolean
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined)

export function CustomerProvider({ children }: { children: React.ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load customers from localStorage or API
    const loadCustomers = () => {
      try {
        const stored = localStorage.getItem("bhv-customers")
        if (stored) {
          const parsedCustomers = JSON.parse(stored)
          setCustomers(parsedCustomers)

          // Auto-select first customer if none selected
          const selectedId = localStorage.getItem("bhv-selected-customer")
          if (selectedId) {
            const customer = parsedCustomers.find((c: Customer) => c.id === selectedId)
            if (customer) {
              setSelectedCustomer(customer)
            }
          } else if (parsedCustomers.length > 0) {
            setSelectedCustomer(parsedCustomers[0])
          }
        } else {
          // Initialize with default customers
          const defaultCustomers: Customer[] = [
            {
              id: "1",
              name: "Ziekenhuis Sint Anna",
              email: "info@sintanna.nl",
              phone: "+31 13 123 4567",
              address: "Hoofdstraat 123, 5000 AB Tilburg",
              createdAt: new Date().toISOString(),
              contactPerson: "Dr. Maria van der Berg",
              users: 45,
              buildings: 3,
              isActive: true,
            },
            {
              id: "2",
              name: "TU Eindhoven",
              email: "bhv@tue.nl",
              phone: "+31 40 247 9111",
              address: "De Rondom 70, 5612 AP Eindhoven",
              createdAt: new Date().toISOString(),
              contactPerson: "Prof. Dr. Peter Bakker",
              users: 120,
              buildings: 8,
              isActive: true,
            },
            {
              id: "3",
              name: "Gemeente Tilburg",
              email: "bhv@tilburg.nl",
              phone: "+31 13 542 8111",
              address: "Stadhuisplein 1, 5038 TC Tilburg",
              createdAt: new Date().toISOString(),
              contactPerson: "Dhr. Jan van Tilburg",
              users: 85,
              buildings: 12,
              isActive: true,
            },
          ]
          setCustomers(defaultCustomers)
          setSelectedCustomer(defaultCustomers[0])
          localStorage.setItem("bhv-customers", JSON.stringify(defaultCustomers))
        }
      } catch (error) {
        console.error("Error loading customers:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadCustomers()
  }, [])

  const handleSetSelectedCustomer = (customer: Customer | null) => {
    setSelectedCustomer(customer)
    if (customer) {
      localStorage.setItem("bhv-selected-customer", customer.id)
    } else {
      localStorage.removeItem("bhv-selected-customer")
    }
  }

  const addCustomer = (customerData: Omit<Customer, "id" | "createdAt" | "users" | "buildings" | "isActive">) => {
    const newCustomer: Customer = {
      ...customerData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      users: 1,
      buildings: 1,
      isActive: true,
    }

    const updatedCustomers = [...customers, newCustomer]
    setCustomers(updatedCustomers)
    localStorage.setItem("bhv-customers", JSON.stringify(updatedCustomers))
  }

  const handleSetCustomers = (newCustomers: Customer[]) => {
    setCustomers(newCustomers)
    localStorage.setItem("bhv-customers", JSON.stringify(newCustomers))
  }

  return (
    <CustomerContext.Provider
      value={{
        customers,
        selectedCustomer,
        setSelectedCustomer: handleSetSelectedCustomer,
        addCustomer,
        setCustomers: handleSetCustomers,
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
