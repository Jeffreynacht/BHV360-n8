"use client"

import { BHV360Logo } from "@/components/bhv360-logo"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, Settings, User } from "lucide-react"

interface BHV360HeaderProps {
  title?: string
  subtitle?: string
  showNotifications?: boolean
  notificationCount?: number
  className?: string
}

export function BHV360Header({
  title = "BHV360 Platform",
  subtitle,
  showNotifications = true,
  notificationCount = 0,
  className,
}: BHV360HeaderProps) {
  return (
    <header className={`bg-white border-b shadow-sm ${className}`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <BHV360Logo size="lg" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {showNotifications && (
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
                    {notificationCount}
                  </Badge>
                )}
              </Button>
            )}

            <Button variant="ghost" size="sm">
              <Settings className="h-5 w-5" />
            </Button>

            <Button variant="ghost" size="sm">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
