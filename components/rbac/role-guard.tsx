"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { UserRole } from "@/lib/rbac/roles"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles: UserRole[]
  fallback?: React.ReactNode
  requireCustomer?: boolean
  requirePartner?: boolean
}

export function RoleGuard({
  children,
  allowedRoles,
  fallback,
  requireCustomer = false,
  requirePartner = false,
}: RoleGuardProps) {
  const { user, canAccess } = useAuth()
  const router = useRouter()

  if (!user) {
    return (
      <div className="flex h-full items-center justify-center">
        <Card className="w-[400px]">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Authenticatie Vereist</CardTitle>
            </div>
            <CardDescription>U moet ingelogd zijn om deze pagina te bekijken.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/login")} className="w-full">
              Inloggen
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Check role access
  if (!canAccess(allowedRoles)) {
    return (
      fallback || (
        <div className="flex h-full items-center justify-center">
          <Card className="w-[400px]">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <CardTitle>Toegang Geweigerd</CardTitle>
              </div>
              <CardDescription>
                U heeft geen toegang tot deze pagina. Vereiste rol: {allowedRoles.join(", ")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Uw huidige rol: <strong>{user.role}</strong>
                </p>
                <Button variant="outline" onClick={() => router.back()} className="w-full">
                  Terug
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    )
  }

  // Check customer requirement
  if (requireCustomer && !user.customerId) {
    return (
      <div className="flex h-full items-center justify-center">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>Klant Selectie Vereist</CardTitle>
            <CardDescription>Selecteer eerst een klant om deze functionaliteit te gebruiken.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/klanten")} className="w-full">
              Klant Selecteren
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Check partner requirement
  if (requirePartner && !user.partnerId && user.role !== UserRole.SUPER_ADMIN) {
    return (
      <div className="flex h-full items-center justify-center">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>Partner Selectie Vereist</CardTitle>
            <CardDescription>Selecteer eerst een partner om deze functionaliteit te gebruiken.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/partners")} className="w-full">
              Partner Selecteren
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
