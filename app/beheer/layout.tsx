"use client"

import type React from "react"

import { useCustomer } from "@/components/customer-context"
import { NoCustomerSelected } from "@/components/no-customer-selected"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Settings,
  Users,
  Shield,
  BarChart3,
  Smartphone,
  Map,
  FileText,
  UserCheck,
  Database,
  Zap,
  Package,
  CheckCircle,
  Building,
  Activity,
} from "lucide-react"

const navigationItems = [
  {
    title: "Overzicht",
    href: "/beheer",
    icon: Activity,
    description: "Algemeen beheer overzicht",
  },
  {
    title: "Beheeromgeving",
    href: "/beheer/beheeromgeving",
    icon: Settings,
    description: "Systeem configuratie",
  },
  {
    title: "Gebruikers",
    href: "/beheer/gebruikers",
    icon: Users,
    description: "Gebruikersbeheer",
  },
  {
    title: "Voorzieningen",
    href: "/beheer/voorzieningen",
    icon: Shield,
    description: "Veiligheidsvoorzieningen",
  },
  {
    title: "Module Marketplace",
    href: "/beheer/module-marketplace",
    icon: Package,
    description: "Nieuwe modules installeren",
    badge: "Nieuw",
  },
  {
    title: "Module Goedkeuringen",
    href: "/beheer/module-approvals",
    icon: CheckCircle,
    description: "Module activatie verzoeken",
  },
  {
    title: "NFC Overzicht",
    href: "/beheer/nfc-overzicht",
    icon: Smartphone,
    description: "NFC tags beheer",
  },
  {
    title: "NFC Tags",
    href: "/beheer/nfc-tags",
    icon: UserCheck,
    description: "Tag configuratie",
  },
  {
    title: "Plotkaart Editor",
    href: "/beheer/plotkaart-editor",
    icon: Map,
    description: "Plattegrond bewerken",
  },
  {
    title: "Rapportages",
    href: "/beheer/rapportages",
    icon: BarChart3,
    description: "Rapporten en analytics",
  },
  {
    title: "Inspectie Rapporten",
    href: "/beheer/inspectierapporten",
    icon: FileText,
    description: "Inspectie documentatie",
  },
  {
    title: "Autorisaties",
    href: "/beheer/autorisaties",
    icon: UserCheck,
    description: "Toegangsrechten",
  },
  {
    title: "API Integraties",
    href: "/beheer/api-integraties",
    icon: Zap,
    description: "Externe koppelingen",
  },
  {
    title: "Performance",
    href: "/beheer/performance",
    icon: Activity,
    description: "Systeem prestaties",
  },
  {
    title: "Backups",
    href: "/beheer/backups",
    icon: Database,
    description: "Data backup beheer",
  },
]

export default function BeheerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { selectedCustomer } = useCustomer()
  const pathname = usePathname()

  if (!selectedCustomer) {
    return <NoCustomerSelected />
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Building className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold">Beheer</h1>
              <p className="text-sm text-gray-600">{selectedCustomer.name}</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link key={item.href} href={item.href}>
                <Button variant={isActive ? "secondary" : "ghost"} className="w-full justify-start h-auto p-3">
                  <div className="flex items-center gap-3 w-full">
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.title}</span>
                        {item.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                    </div>
                  </div>
                </Button>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  )
}
