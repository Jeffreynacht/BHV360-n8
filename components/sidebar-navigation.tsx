"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { CustomerSelector } from "@/components/customer-selector"
import { useCustomer } from "@/components/customer-context"
import {
  LayoutDashboard,
  Users,
  Shield,
  FileText,
  Settings,
  Map,
  AlertTriangle,
  BarChart3,
  HelpCircle,
  Building,
  UserCheck,
  Smartphone,
  ChevronDown,
  ChevronRight,
  Heart,
  Database,
} from "lucide-react"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Plotkaart",
    href: "/plotkaart",
    icon: Map,
  },
  {
    name: "Gebruikers",
    href: "/gebruikers",
    icon: Users,
    badge: "new",
  },
  {
    name: "Incidenten",
    href: "/incidenten",
    icon: AlertTriangle,
  },
  {
    name: "BHV Functies",
    icon: Shield,
    children: [
      { name: "BHV Overzicht", href: "/bhv", icon: Shield },
      { name: "BHV Editor", href: "/bhv/editor", icon: FileText },
      { name: "BHV Aanwezigheid", href: "/bhv-aanwezigheid", icon: UserCheck },
      { name: "EHBO Voorraad", href: "/ehbo-voorraad", icon: Heart },
    ],
  },
  {
    name: "Beheer",
    icon: Settings,
    children: [
      { name: "Voorzieningen", href: "/beheer/voorzieningen", icon: Building },
      { name: "NFC Overzicht", href: "/beheer/nfc-overzicht", icon: Smartphone },
      { name: "NFC Tags", href: "/beheer/nfc-tags", icon: Smartphone },
      { name: "NFC Verdiepingen", href: "/beheer/nfc-verdiepingen", icon: Building },
      { name: "Plotkaart Editor", href: "/beheer/plotkaart-editor", icon: FileText },
      { name: "Rapportages", href: "/beheer/rapportages", icon: BarChart3 },
      { name: "Autorisaties", href: "/beheer/autorisaties", icon: Shield },
      { name: "Backups", href: "/beheer/backups", icon: FileText },
      { name: "Performance", href: "/beheer/performance", icon: BarChart3 },
    ],
  },
  {
    name: "Systeem",
    icon: Database,
    children: [
      { name: "Database Test", href: "/database-test", icon: Database },
      { name: "Debug", href: "/debug", icon: Settings },
      { name: "Instellingen", href: "/instellingen", icon: Settings },
    ],
  },
  {
    name: "Klanten",
    href: "/klanten",
    icon: Building,
  },
  {
    name: "White Label",
    href: "/white-label",
    icon: Settings,
  },
  {
    name: "Help",
    href: "/help",
    icon: HelpCircle,
  },
]

export function SidebarNavigation() {
  const pathname = usePathname()
  const { selectedCustomer } = useCustomer()
  const [expandedItems, setExpandedItems] = useState<string[]>(["BHV Functies", "Beheer"])

  const toggleExpanded = (name: string) => {
    setExpandedItems((prev) => (prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]))
  }

  return (
    <div className="flex h-full flex-col border-r bg-background w-80">
      {/* Logo */}
      <div className="flex h-32 items-center justify-center border-b px-6">
        <Link href="/dashboard" className="flex items-center">
          <img src="/images/bhv360-logo.png" alt="BHV360 Logo" className="h-24 w-24 object-contain" />
        </Link>
      </div>

      {/* Customer Selector */}
      <div className="border-b p-4">
        <CustomerSelector />
      </div>

      {/* Customer Info */}
      {selectedCustomer && (
        <div className="border-b p-4 space-y-2">
          <div className="text-sm font-medium text-muted-foreground">{selectedCustomer.name}</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
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
      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
          {navigation.map((item) => {
            if (item.children) {
              const isExpanded = expandedItems.includes(item.name)
              const hasActiveChild = item.children.some((child) => pathname === child.href)

              return (
                <div key={item.name}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start items-center h-10",
                      (hasActiveChild || isExpanded) && "bg-accent",
                    )}
                    onClick={() => toggleExpanded(item.name)}
                  >
                    <item.icon className="mr-3 h-4 w-4 flex-shrink-0" />
                    <span className="flex-1 text-left">{item.name}</span>
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 flex-shrink-0" />
                    ) : (
                      <ChevronRight className="h-4 w-4 flex-shrink-0" />
                    )}
                  </Button>
                  {isExpanded && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <Button
                          key={child.href}
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "w-full justify-start items-center h-9",
                            pathname === child.href && "bg-accent",
                          )}
                          asChild
                        >
                          <Link href={child.href} className="flex items-center">
                            <child.icon className="mr-3 h-3 w-3 flex-shrink-0" />
                            <span className="flex-1 text-left">{child.name}</span>
                          </Link>
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              )
            }

            return (
              <Button
                key={item.href}
                variant="ghost"
                className={cn("w-full justify-start items-center h-10", pathname === item.href && "bg-accent")}
                asChild
              >
                <Link href={item.href} className="flex items-center">
                  <item.icon className="mr-3 h-4 w-4 flex-shrink-0" />
                  <span className="flex-1 text-left">{item.name}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="text-xs flex-shrink-0">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              </Button>
            )
          })}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t p-4">
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
    </div>
  )
}
