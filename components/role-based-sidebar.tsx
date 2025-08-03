"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { RoleBasedNavigation } from "@/components/role-based-navigation"
import { UserRole } from "@/lib/rbac/roles"
import { LogOut, Settings, User, ChevronDown, Menu, X, Shield } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

export function RoleBasedSidebar() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  // Don't show sidebar if not authenticated
  if (!user) {
    return null
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const getUserRole = (): UserRole => {
    // Map user.role to UserRole enum
    switch (user.role) {
      case "super-admin":
        return UserRole.SUPER_ADMIN
      case "admin":
        return UserRole.CUSTOMER_ADMIN
      case "employee":
        return UserRole.EMPLOYEE
      default:
        return UserRole.EMPLOYEE
    }
  }

  const getRoleDisplayName = (role: string): string => {
    switch (role) {
      case "super-admin":
        return "Super Admin"
      case "admin":
        return "Organisatie Admin"
      case "employee":
        return "Medewerker"
      default:
        return "Gebruiker"
    }
  }

  const getRoleBadgeColor = (role: string): string => {
    switch (role) {
      case "super-admin":
        return "bg-purple-100 text-purple-800"
      case "admin":
        return "bg-blue-100 text-blue-800"
      case "employee":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center space-x-3">
          <Image
            src="/images/bhv360-logo.png"
            alt="BHV360 Logo"
            width={40}
            height={40}
            className="rounded-lg shadow-sm"
          />
          <div>
            <h1 className="text-xl font-bold text-gray-900">BHV360</h1>
            <p className="text-sm text-gray-600">Safety Management</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-6 border-b">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start p-0 h-auto">
              <div className="flex items-center space-x-3 w-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder-user.jpg" alt={user.name} />
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <div className="font-medium text-sm">{user.name}</div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                  <Badge className={cn("text-xs mt-1", getRoleBadgeColor(user.role))}>
                    {getRoleDisplayName(user.role)}
                  </Badge>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem onClick={() => router.push("/profile")}>
              <User className="mr-2 h-4 w-4" />
              Profiel
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              Instellingen
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Uitloggen
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        <RoleBasedNavigation userRole={getUserRole()} currentPath={pathname} />
      </div>

      {/* Footer */}
      <div className="p-6 border-t">
        <div className="text-xs text-gray-500 text-center">
          <div className="flex items-center justify-center mb-2">
            <Shield className="h-4 w-4 mr-1" />
            BHV360 v2.0
          </div>
          <p>© 2024 Alle rechten voorbehouden</p>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile Sidebar */}
      <div className={cn("fixed inset-0 z-40 md:hidden", isMobileOpen ? "block" : "hidden")}>
        <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileOpen(false)} />
        <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl">{sidebarContent}</div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-80 md:flex-col md:fixed md:inset-y-0 bg-white border-r shadow-sm">
        {sidebarContent}
      </div>
    </>
  )
}
