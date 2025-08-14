"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    // Redirect to role-specific dashboard
    switch (user.role) {
      case "super_admin":
        router.push("/dashboards/super-admin")
        break
      case "partner_admin":
        router.push("/dashboards/partner-admin")
        break
      case "customer_admin":
        router.push("/dashboards/customer-admin")
        break
      case "bhv_coordinator":
        router.push("/dashboards/bhv-coordinator")
        break
      case "bhv_medewerker":
      case "employee":
        router.push("/dashboards/employee")
        break
      default:
        router.push("/dashboards/employee")
    }
  }, [user, router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-muted-foreground">Dashboard wordt geladen...</p>
      </div>
    </div>
  )
}
