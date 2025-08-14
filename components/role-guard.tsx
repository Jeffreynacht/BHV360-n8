"use client"

import { useAuth } from "@/contexts/auth-context"
import { type UserRole, RBACService, type Resource, type Action } from "@/lib/rbac/roles"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, AlertTriangle, Loader2 } from "lucide-react"
import type { ReactNode } from "react"

interface RoleGuardProps {
  children: ReactNode
  requiredRole?: UserRole | UserRole[]
  resource?: Resource
  action?: Action
  fallback?: ReactNode
  showLoading?: boolean
}

export function RoleGuard({ children, requiredRole, resource, action, fallback, showLoading = true }: RoleGuardProps) {
  const { user, loading } = useAuth()

  // Show loading state
  if (loading && showLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm text-muted-foreground">Authenticatie controleren...</p>
        </div>
      </div>
    )
  }

  // No user logged in
  if (!user) {
    return (
      fallback || (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Shield className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Inloggen Vereist</h3>
            <p className="text-muted-foreground text-center">Je moet ingelogd zijn om deze pagina te bekijken.</p>
          </CardContent>
        </Card>
      )
    )
  }

  // Check role-based access
  if (requiredRole) {
    const userRole = user.role as UserRole
    const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]

    if (!allowedRoles.includes(userRole)) {
      return (
        fallback || (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Toegang Geweigerd</h3>
              <p className="text-muted-foreground text-center">
                Je hebt geen toestemming om deze pagina te bekijken.
                <br />
                <span className="text-sm">
                  Vereiste rol: <strong>{allowedRoles.join(" of ")}</strong>
                  <br />
                  Jouw rol: <strong>{userRole}</strong>
                </span>
              </p>
            </CardContent>
          </Card>
        )
      )
    }
  }

  // Check resource/action based access
  if (resource && action) {
    const userRole = user.role as UserRole
    const hasPermission = RBACService.hasPermission(userRole, resource, action)

    if (!hasPermission) {
      return (
        fallback || (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Onvoldoende Rechten</h3>
              <p className="text-muted-foreground text-center">
                Je hebt geen toestemming om {action} uit te voeren op {resource}.
                <br />
                <span className="text-sm">Neem contact op met je beheerder voor toegang.</span>
              </p>
            </CardContent>
          </Card>
        )
      )
    }
  }

  // User has access, render children
  return <>{children}</>
}
