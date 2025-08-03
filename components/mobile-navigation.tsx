"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { CustomerSelector } from "@/components/customer-selector"
import { useCustomer } from "@/components/customer-context"
import {
  Users,
  FileText,
  Tag,
  Shield,
  Map,
  Settings,
  Menu,
  X,
  UserCheck,
  AlertTriangle,
  LayoutDashboard,
  Edit,
  ChevronRight,
  ChevronDown,
  Building,
  HelpCircle,
  Heart,
  Database,
  BarChart3,
  Smartphone,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"

const navigationItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    requiresCustomer: false,
  },
  {
    title: "Plotkaart",
    href: "/plotkaart",
    icon: Map,
    requiresCustomer: true,
  },
  {
    title: "Gebruikers",
    href: "/gebruikers",
    icon: Users,
    requiresCustomer: true,
    badge: "new",
  },
  {
    title: "Incidenten",
    href: "/incidenten",
    icon: AlertTriangle,
    requiresCustomer: true,
  },
  {
    title: "BHV Functies",
    icon: Shield,
    requiresCustomer: true,
    children: [
      {
        title: "BHV Overzicht",
        href: "/bhv",
        icon: Shield,
      },
      {
        title: "BHV Editor",
        href: "/bhv/editor",
        icon: Edit,
      },
      {
        title: "BHV Aanwezigheid",
        href: "/bhv-aanwezigheid",
        icon: UserCheck,
      },
      {
        title: "EHBO Voorraad",
        href: "/ehbo-voorraad",
        icon: Heart,
      },
    ],
  },
  {
    title: "Beheer",
    icon: Settings,
    requiresCustomer: true,
    children: [
      {
        title: "Voorzieningen",
        href: "/beheer/voorzieningen",
        icon: Building,
      },
      {
        title: "NFC Overzicht",
        href: "/beheer/nfc-overzicht",
        icon: Smartphone,
      },
      {
        title: "NFC Tags",
        href: "/beheer/nfc-tags",
        icon: Tag,
      },
      {
        title: "NFC Verdiepingen",
        href: "/beheer/nfc-verdiepingen",
        icon: Building,
      },
      {
        title: "Plotkaart Editor",
        href: "/beheer/plotkaart-editor",
        icon: Edit,
      },
      {
        title: "Rapportages",
        href: "/beheer/rapportages",
        icon: FileText,
      },
      {
        title: "Autorisaties",
        href: "/beheer/autorisaties",
        icon: Shield,
      },
      {
        title: "Backups",
        href: "/beheer/backups",
        icon: FileText,
      },
      {
        title: "Performance",
        href: "/beheer/performance",
        icon: BarChart3,
      },
    ],
  },
  {
    title: "Systeem",
    icon: Database,
    requiresCustomer: false,
    children: [
      {
        title: "Database Test",
        href: "/database-test",
        icon: Database,
      },
      {
        title: "Debug",
        href: "/debug",
        icon: Settings,
      },
      {
        title: "Instellingen",
        href: "/instellingen",
        icon: Settings,
      },
    ],
  },
  {
    title: "Klanten",
    href: "/klanten",
    icon: Building,
    requiresCustomer: false,
  },
  {
    title: "White Label",
    href: "/white-label",
    icon: Settings,
    requiresCustomer: false,
  },
  {
    title: "Help",
    href: "/help",
    icon: HelpCircle,
    requiresCustomer: false,
  },
]

export function MobileNavigation() {
  const pathname = usePathname()
  const { selectedCustomer } = useCustomer()
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const toggleSubmenu = (title: string) => {
    if (openSubmenu === title) {
      setOpenSubmenu(null)
    } else {
      setOpenSubmenu(title)
    }
  }

  const closeSheet = () => {
    setIsOpen(false)
    setOpenSubmenu(null)
  }

  return (
    <div className="lg:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="mr-2">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[85%] sm:w-[350px] overflow-y-auto p-0">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <img src="/images/bhv360-logo.png" alt="BHV360 Logo" className="h-12 w-12 object-contain" />
              <span className="font-bold text-lg">BHV360</span>
            </div>
            <Button variant="ghost" size="icon" onClick={closeSheet}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close menu</span>
            </Button>
          </div>

          {/* Customer Selector */}
          <div className="p-4 border-b">
            <CustomerSelector />
          </div>

          {/* Customer Info */}
          {selectedCustomer && (
            <div className="p-4 border-b bg-muted/30">
              <div className="text-sm font-medium">{selectedCustomer.name}</div>
              <div className="text-xs text-muted-foreground mt-1">{selectedCustomer.contactPerson}</div>
              <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                <div className="flex items-center space-x-1">
                  <Building className="h-3 w-3" />
                  <span>{selectedCustomer.buildings} gebouwen</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-3 w-3" />
                  <span>{selectedCustomer.users} gebruikers</span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 p-2">
            <ul className="space-y-1">
              {navigationItems.map((item) => {
                if (item.children) {
                  const isActive = item.children.some(
                    (child) => pathname === child.href || pathname.startsWith(`${child.href}/`),
                  )
                  const isDisabled = item.requiresCustomer && !selectedCustomer
                  const isExpanded = openSubmenu === item.title

                  return (
                    <li key={item.title}>
                      <button
                        onClick={() => !isDisabled && toggleSubmenu(item.title)}
                        disabled={isDisabled}
                        className={cn(
                          "flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                          isDisabled
                            ? "text-muted-foreground/50 cursor-not-allowed"
                            : isActive || isExpanded
                              ? "bg-accent text-accent-foreground"
                              : "hover:bg-accent hover:text-accent-foreground",
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="h-4 w-4 flex-shrink-0" />
                          <span>{item.title}</span>
                        </div>
                        {!isDisabled && (
                          <>{isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}</>
                        )}
                      </button>
                      {isExpanded && !isDisabled && (
                        <ul className="ml-6 space-y-1 mt-1">
                          {item.children.map((child) => {
                            const isChildActive = pathname === child.href || pathname.startsWith(`${child.href}/`)

                            return (
                              <li key={child.title}>
                                <Link
                                  href={child.href}
                                  onClick={closeSheet}
                                  className={cn(
                                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                    isChildActive
                                      ? "bg-primary text-primary-foreground"
                                      : "hover:bg-accent hover:text-accent-foreground",
                                  )}
                                >
                                  <child.icon className="h-3 w-3 flex-shrink-0" />
                                  <span>{child.title}</span>
                                </Link>
                              </li>
                            )
                          })}
                        </ul>
                      )}
                    </li>
                  )
                }

                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                const isDisabled = item.requiresCustomer && !selectedCustomer

                return (
                  <li key={item.title}>
                    <Link
                      href={isDisabled ? "#" : item.href}
                      onClick={isDisabled ? (e) => e.preventDefault() : closeSheet}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                        isDisabled
                          ? "text-muted-foreground/50 cursor-not-allowed"
                          : isActive
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-accent hover:text-accent-foreground",
                      )}
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      <span>{item.title}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="text-xs ml-auto">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="border-t p-4 bg-muted/30">
            <div className="text-xs text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>Demo Mode</span>
                <Badge variant="outline" className="text-xs">
                  v2.0
                </Badge>
              </div>
              <div className="mt-1">Alle functies beschikbaar</div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
