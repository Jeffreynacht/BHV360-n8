import type React from "react"
import { RoleBasedSidebar } from "@/components/role-based-sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-background">
      <RoleBasedSidebar />
      <main className="flex-1 overflow-y-auto md:ml-80">{children}</main>
    </div>
  )
}
