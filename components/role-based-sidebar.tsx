"use client"

import { useAuth } from "@/contexts/auth-context"
import { usePathname } from "next/navigation"
import { RoleBasedNavigation } from "@/components/role-based-navigation"
import { Button } from "@/components/ui/button"
import { LogOut, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { getRoleDisplayName, getRoleColor } from "@/lib/rbac/roles"
import Image from "next/image"

export function RoleBasedSidebar() {
  const { user, logout, isAuthenticated } = useAuth()
  const pathname = usePathname()

  // Mock data voor preview/development
  const mockUser = {
    id: "1",
    name: "Jan de Vries",
    email: "jan@bhv360.nl",
    role: "super_admin" as const,
    customerId: "1",
  }

  // Gebruik mock data als er geen echte gebruiker is (voor preview)
  const currentUser = user || mockUser
  const showSidebar = isAuthenticated || !user // Toon altijd in preview

  if (!showSidebar) {
    return null
  }

  const handleLogout = async () => {
    if (logout) {
      await logout()
      window.location.href = "/login"
    }
  }

  return (
    <div className="hidden md:flex md:w-80 md:flex-col md:fixed md:inset-y-0 bg-card border-r shadow-sm">
      {/* Header met Logo */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="flex items-center space-x-3">
          <div className="relative w-10 h-10 flex-shrink-0">
            <Image
              src="/images/bhv360-logo.png"
              alt="BHV360 Logo"
              width={40}
              height={40}
              className="rounded-lg shadow-sm"
              priority
            />
          </div>
          <div className="min-w-0">
            <h1 className="font-bold text-xl text-primary truncate">BHV360</h1>
            <p className="text-xs text-muted-foreground truncate">Safety Management Platform</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b bg-muted/20 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <Avatar className="h-12 w-12 border-2 border-primary/20 flex-shrink-0">
            <AvatarImage src="/placeholder-user.jpg" alt={currentUser.name} />
            <AvatarFallback className="bg-primary/10">
              <User className="h-6 w-6 text-primary" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{currentUser.name}</p>
            <p className="text-xs text-muted-foreground truncate">{currentUser.email}</p>
            <Badge variant="secondary" className={`text-xs mt-1 ${getRoleColor(currentUser.role)}`}>
              {getRoleDisplayName(currentUser.role)}
            </Badge>
          </div>
        </div>
      </div>

      {/* Navigation - Scrollable */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="p-2">
          <RoleBasedNavigation userRole={currentUser.role} currentPath={pathname} />
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t bg-muted/20 flex-shrink-0">
        <Button variant="outline" size="sm" onClick={handleLogout} className="w-full">
          <LogOut className="mr-2 h-4 w-4" />
          Uitloggen
        </Button>
      </div>
    </div>
  )
}
