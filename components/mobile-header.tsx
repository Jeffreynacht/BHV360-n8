"use client"

import { MobileNavigation } from "./mobile-navigation"
import { useCustomer } from "./customer-context"
import { Badge } from "./ui/badge"

export function MobileHeader() {
  const { selectedCustomer } = useCustomer()

  return (
    <header className="lg:hidden flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <MobileNavigation />
        <div className="flex items-center gap-2">
          <img src="/images/bhv360-logo.png" alt="BHV360" className="h-8 w-8 object-contain" />
          <span className="font-bold text-lg">BHV360</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {selectedCustomer && (
          <Badge variant="outline" className="text-xs hidden sm:inline-flex">
            {selectedCustomer.name}
          </Badge>
        )}
        <Badge variant="secondary" className="text-xs">
          Demo
        </Badge>
      </div>
    </header>
  )
}
