"use client"

import { BHV360Logo } from "@/components/bhv360-logo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, Settings, User, Menu } from "lucide-react"
import { cn } from "@/lib/utils"

interface BHV360BrandHeaderProps {
  customerName?: string
  userRole?: string
  className?: string
  showNotifications?: boolean
  notificationCount?: number
}

export function BHV360BrandHeader({
  customerName,
  userRole,
  className,
  showNotifications = true,
  notificationCount = 0,
}: BHV360BrandHeaderProps) {
  return (
    <header className={cn("bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-lg", className)}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo en Bedrijfsinfo */}
          <div className="flex items-center gap-6">
            <BHV360Logo size="lg" variant="white" />

            <div className="hidden md:block">
              <h1 className="text-xl font-bold text-white">BHV360 Veiligheid Platform</h1>
              {customerName && <p className="text-blue-100 text-sm">{customerName}</p>}
            </div>
          </div>

          {/* Gebruiker Info en Acties */}
          <div className="flex items-center gap-4">
            {/* Notificaties */}
            {showNotifications && (
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 relative">
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500 text-white">
                    {notificationCount}
                  </Badge>
                )}
              </Button>
            )}

            {/* Instellingen */}
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <Settings className="h-5 w-5" />
            </Button>

            {/* Gebruiker Rol */}
            {userRole && (
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 hidden md:inline-flex">
                {userRole}
              </Badge>
            )}

            {/* Gebruiker Menu */}
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <User className="h-5 w-5" />
            </Button>

            {/* Mobile Menu */}
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
