"use client"

import type React from "react"

import { useCustomer } from "@/components/customer-context"
import { NoCustomerSelected } from "@/components/no-customer-selected"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Users, QrCode, BarChart3, Shield, Wrench, MapPin } from "lucide-react"

const navigation = [
  { name: "Plotkaart Editor", href: "/beheer/plotkaart-editor", icon: MapPin },
  { name: "Gebruikers", href: "/beheer/gebruikers", icon: Users },
  { name: "Autorisaties", href: "/beheer/autorisaties", icon: Shield },
  { name: "NFC Tags", href: "/beheer/nfc-tags", icon: QrCode },
  { name: "Voorzieningen", href: "/beheer/voorzieningen", icon: Wrench },
  { name: "Rapportages", href: "/beheer/rapportages", icon: BarChart3 },
]

export default function BeheerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { selectedCustomer } = useCustomer()
  const pathname = usePathname()

  if (!selectedCustomer) {
    return <NoCustomerSelected />
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900">Beheer</h2>
          <p className="text-sm text-gray-600">{selectedCustomer.name}</p>
        </div>
        <nav className="mt-6">
          <div className="px-3">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-3 py-2 text-sm font-medium rounded-md mb-1",
                    isActive ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                  )}
                >
                  <item.icon
                    className={cn(
                      "mr-3 h-5 w-5",
                      isActive ? "text-blue-500" : "text-gray-400 group-hover:text-gray-500",
                    )}
                  />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  )
}
