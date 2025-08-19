"use client"

import type React from "react"

import { useCustomer } from "@/components/customer-context"
import { NoCustomerSelected } from "@/components/no-customer-selected"

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const { selectedCustomer, isLoading } = useCustomer()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Show customer selection for admin/management pages
  const isAdminPage =
    typeof window !== "undefined" &&
    (window.location.pathname.startsWith("/beheer") ||
      window.location.pathname.startsWith("/admin") ||
      window.location.pathname.startsWith("/super-admin"))

  if (isAdminPage && !selectedCustomer) {
    return <NoCustomerSelected />
  }

  return <>{children}</>
}
