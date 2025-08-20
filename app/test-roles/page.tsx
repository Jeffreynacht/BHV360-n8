"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RoleGuard } from "@/components/role-guard"
import { UserRole, Resource, Action, RBACService } from "@/lib/rbac/roles"
import { useAuth } from "@/contexts/auth-context"
import { Shield, Users, Building2, Crown, FileText, Settings, CheckCircle, XCircle, Info } from "lucide-react"
import Link from "next/link"

export default function TestRolesPage() {
  const { user } = useAuth()
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.EMPLOYEE)

  const testScenarios = [
    {
      title: "Whitelabel Klanten",
      description: "Alleen Super Admin toegang",
      requiredRole: [UserRole.SUPER_ADMIN],
      resource: Resource.WHITELABEL,
      action: Action.READ,
      url: "/whitelabel-klanten",
      icon: Crown,
    },
    {
      title: "Klanten Beheer",
      description: "Admin en Super Admin toegang",
      requiredRole: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
      resource: Resource.CUSTOMERS,
      action: Action.MANAGE,
      url: "/klanten",
      icon: Building2,
    },
    {
      title: "Gebruikers Beheer",
      description: "Admin rollen en hoger",
      requiredRole: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CUSTOMER_ADMIN],
      resource: Resource.USERS,
      action: Action.MANAGE,
      url: "/beheer/gebruikers",
      icon: Users,
    },
    {
      title: "Rapportages",
      description: "Alle admin rollen",
      requiredRole: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.PARTNER_ADMIN, UserRole.CUSTOMER_ADMIN],
      resource: Resource.REPORTS,
      action: Action.READ,
      url: "/beheer/rapportages",
      icon: FileText,
    },
    {
      title: "Systeem Instellingen",
      description: "Alleen Super Admin en Admin",
      requiredRole: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
      resource: Resource.SYSTEM,
      action: Action.MANAGE,
      url: "/beheer",
      icon: Settings,
    },
  ]

  const checkAccess = (requiredRoles: UserRole[], resource?: Resource, action?: Action) => {
    if (!user) return false

    const userRole = user.role as UserRole
    const hasRoleAccess = requiredRoles.includes(userRole)

    if (resource && action) {
      const hasPermission = RBACService.hasPermission(userRole, resource, action)
      return hasRoleAccess && hasPermission
    }

    return hasRoleAccess
  }

  const simulateRoleAccess = (requiredRoles: UserRole[], resource?: Resource, action?: Action) => {
    const hasRoleAccess = requiredRoles.includes(selectedRole)

    if (resource && action) {
      const hasPermission = RBACService.hasPermission(selectedRole, resource, action)
      return hasRoleAccess && hasPermission
    }

    return hasRoleAccess
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold tracking-tight flex items-center justify-center gap-2">
          <Shield className="h-8 w-8" />
          Role-Based Access Control Test
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Test de toegangscontrole voor verschillende gebruikersrollen en bekijk welke functies beschikbaar zijn.
        </p>
      </div>

      {/* Current User Info */}
      {user && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Huidige gebruiker:</strong> {user.name} | <strong>Rol:</strong> {user.role}
          </AlertDescription>
        </Alert>
      )}

      {/* Role Simulator */}
      <Card>
        <CardHeader>
          <CardTitle>Rol Simulator</CardTitle>
          <CardDescription>Simuleer verschillende rollen om te zien welke toegang ze hebben</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <label htmlFor="role-select" className="text-sm font-medium">
              Simuleer rol:
            </label>
            <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(UserRole).map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Access Test Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {testScenarios.map((scenario, index) => {
          const hasCurrentAccess = checkAccess(scenario.requiredRole, scenario.resource, scenario.action)
          const hasSimulatedAccess = simulateRoleAccess(scenario.requiredRole, scenario.resource, scenario.action)

          return (
            <Card key={index} className="relative">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <scenario.icon className="h-5 w-5" />
                  {scenario.title}
                </CardTitle>
                <CardDescription>{scenario.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Required Roles */}
                <div>
                  <p className="text-sm font-medium mb-2">Vereiste rollen:</p>
                  <div className="flex flex-wrap gap-1">
                    {scenario.requiredRole.map((role) => (
                      <Badge key={role} variant="outline" className="text-xs">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Current User Access */}
                <div className="flex items-center justify-between">
                  <span className="text-sm">Jouw toegang:</span>
                  <div className="flex items-center gap-1">
                    {hasCurrentAccess ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <Badge variant={hasCurrentAccess ? "default" : "destructive"}>
                      {hasCurrentAccess ? "Toegestaan" : "Geweigerd"}
                    </Badge>
                  </div>
                </div>

                {/* Simulated Access */}
                <div className="flex items-center justify-between">
                  <span className="text-sm">Gesimuleerde toegang ({selectedRole}):</span>
                  <div className="flex items-center gap-1">
                    {hasSimulatedAccess ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <Badge variant={hasSimulatedAccess ? "default" : "secondary"}>
                      {hasSimulatedAccess ? "Toegestaan" : "Geweigerd"}
                    </Badge>
                  </div>
                </div>

                {/* Test Button */}
                <div className="pt-2">
                  <Link href={scenario.url}>
                    <Button
                      className="w-full"
                      variant={hasCurrentAccess ? "default" : "outline"}
                      disabled={!hasCurrentAccess}
                    >
                      Test Toegang
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Role Permissions Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Rol Rechten Overzicht</CardTitle>
          <CardDescription>Overzicht van alle rechten per rol voor {selectedRole}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.values(Resource).map((resource) => (
              <div key={resource} className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2 capitalize">{resource}</h4>
                <div className="space-y-1">
                  {Object.values(Action).map((action) => {
                    const hasPermission = RBACService.hasPermission(selectedRole, resource, action)
                    return (
                      <div key={action} className="flex items-center justify-between text-sm">
                        <span className="capitalize">{action}</span>
                        {hasPermission ? (
                          <CheckCircle className="h-3 w-3 text-green-600" />
                        ) : (
                          <XCircle className="h-3 w-3 text-red-600" />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Protected Content Examples */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Beschermde Content Voorbeelden</h2>

        <RoleGuard requiredRole={UserRole.SUPER_ADMIN}>
          <Alert>
            <Crown className="h-4 w-4" />
            <AlertDescription>
              <strong>Super Admin Content:</strong> Deze content is alleen zichtbaar voor Super Admins.
            </AlertDescription>
          </Alert>
        </RoleGuard>

        <RoleGuard requiredRole={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}>
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Admin Content:</strong> Deze content is zichtbaar voor Super Admins en Admins.
            </AlertDescription>
          </Alert>
        </RoleGuard>

        <RoleGuard resource={Resource.CUSTOMERS} action={Action.READ}>
          <Alert>
            <Building2 className="h-4 w-4" />
            <AlertDescription>
              <strong>Customer Read Access:</strong> Je hebt leestoegang tot klantgegevens.
            </AlertDescription>
          </Alert>
        </RoleGuard>

        <RoleGuard resource={Resource.WHITELABEL} action={Action.MANAGE}>
          <Alert>
            <Crown className="h-4 w-4" />
            <AlertDescription>
              <strong>Whitelabel Management:</strong> Je kunt whitelabel instellingen beheren.
            </AlertDescription>
          </Alert>
        </RoleGuard>
      </div>
    </div>
  )
}
