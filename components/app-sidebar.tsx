"use client"

import type * as React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { BHV360Logo } from "@/components/bhv360-logo"
import { useAuth } from "@/contexts/auth-context"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  LayoutDashboard,
  Map,
  AlertTriangle,
  Settings,
  HelpCircle,
  Building2,
  ChevronRight,
  Crown,
  Users,
  Shield,
  BarChart3,
  Heart,
  Smartphone,
  UserCheck,
  Briefcase,
  Palette,
  Activity,
  Database,
  QrCode,
  UserPlus,
  Building,
  Edit,
  Plus,
  FileText,
} from "lucide-react"

interface MenuItem {
  title: string
  url: string
  icon: any
  badge?: string
  roles: string[]
  items?: MenuItem[]
}

const menuData: MenuItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    roles: [
      "super-admin",
      "partner-admin",
      "partner-manager",
      "customer-admin",
      "customer-manager",
      "bhv-coordinator",
      "employee",
      "bhv_medewerker",
      "security-receptionist",
      "admin",
    ],
  },
  {
    title: "NFC Scanner",
    url: "/nfc-scan",
    icon: QrCode,
    badge: "Live",
    roles: [
      "bhv-coordinator",
      "employee",
      "bhv_medewerker",
      "customer-admin",
      "customer-manager",
      "security-receptionist",
      "admin",
    ],
  },
  {
    title: "Plotkaart",
    url: "/plotkaart",
    icon: Map,
    badge: "Live",
    roles: [
      "partner-admin",
      "partner-manager",
      "customer-admin",
      "customer-manager",
      "bhv-coordinator",
      "employee",
      "bhv_medewerker",
      "security-receptionist",
      "admin",
    ],
  },
  {
    title: "BHV Plotkaart",
    url: "/bhv/plotkaart",
    icon: Shield,
    badge: "BHV",
    roles: ["bhv-coordinator", "admin"],
  },
  {
    title: "Klanten",
    url: "/klanten",
    icon: Building2,
    roles: ["super-admin", "partner-admin", "partner-manager", "customer-admin"],
  },
  {
    title: "Incidenten",
    url: "/incidenten",
    icon: AlertTriangle,
    badge: "3",
    roles: [
      "super-admin",
      "bhv-coordinator",
      "customer-admin",
      "employee",
      "bhv_medewerker",
      "security-receptionist",
      "admin",
    ],
  },
  {
    title: "BHV Functies",
    url: "/bhv",
    icon: Shield,
    roles: ["bhv-coordinator", "customer-admin", "admin"],
    items: [
      {
        title: "BHV Overzicht",
        url: "/bhv",
        icon: Shield,
        roles: ["bhv-coordinator", "customer-admin", "admin"],
      },
      {
        title: "BHV Editor",
        url: "/bhv/editor",
        icon: Edit,
        roles: ["bhv-coordinator", "admin"],
      },
      {
        title: "BHV Aanwezigheid",
        url: "/bhv-aanwezigheid",
        icon: Users,
        roles: ["bhv-coordinator", "employee", "bhv_medewerker", "admin"],
      },
      {
        title: "EHBO Voorraad",
        url: "/ehbo-voorraad",
        icon: Heart,
        roles: ["bhv-coordinator", "customer-admin", "admin"],
      },
    ],
  },
  {
    title: "Beheer",
    url: "/beheer",
    icon: Settings,
    roles: ["customer-admin", "customer-manager", "bhv-coordinator", "admin"],
    items: [
      {
        title: "Gebruikers",
        url: "/beheer/gebruikers",
        icon: Users,
        roles: ["customer-admin", "bhv-coordinator", "admin"],
      },
      {
        title: "Voorzieningen",
        url: "/beheer/voorzieningen",
        icon: Shield,
        roles: ["customer-admin", "bhv-coordinator", "admin"],
      },
      {
        title: "Module Marketplace",
        url: "/beheer/module-marketplace",
        icon: Plus,
        badge: "Nieuw",
        roles: ["customer-admin", "bhv-coordinator", "admin"],
      },
      {
        title: "Plotkaart Editor",
        url: "/beheer/plotkaart-editor",
        icon: Edit,
        roles: ["customer-admin", "bhv-coordinator", "admin"],
      },
      {
        title: "Inspectierapporten",
        url: "/beheer/inspectierapporten",
        icon: FileText,
        roles: ["customer-admin", "customer-manager", "bhv-coordinator", "admin"],
      },
      {
        title: "NFC Overzicht",
        url: "/beheer/nfc-overzicht",
        icon: Smartphone,
        roles: ["customer-admin", "bhv-coordinator", "admin"],
      },
      {
        title: "Rapportages",
        url: "/beheer/rapportages",
        icon: BarChart3,
        roles: ["customer-admin", "customer-manager", "bhv-coordinator", "admin"],
      },
      {
        title: "Autorisaties",
        url: "/beheer/autorisaties",
        icon: UserCheck,
        roles: ["customer-admin", "bhv-coordinator", "admin"],
      },
      {
        title: "Backups",
        url: "/beheer/backups",
        icon: Database,
        roles: ["customer-admin", "bhv-coordinator", "admin"],
      },
    ],
  },
  {
    title: "Partner Beheer",
    url: "/partner",
    icon: Briefcase,
    roles: ["partner-admin", "partner-manager"],
    items: [
      {
        title: "Mijn Klanten",
        url: "/klanten",
        icon: Building2,
        roles: ["partner-admin", "partner-manager"],
      },
      {
        title: "White-label",
        url: "/white-label",
        icon: Palette,
        roles: ["partner-admin"],
      },
      {
        title: "Partner Klanten",
        url: "/white-label/partner-customers",
        icon: Building2,
        roles: ["partner-admin", "partner-manager"],
      },
    ],
  },
  {
    title: "Super Admin",
    url: "/super-admin",
    icon: Crown,
    roles: ["super-admin"],
    items: [
      {
        title: "Partners",
        url: "/super-admin/partners",
        icon: Briefcase,
        roles: ["super-admin"],
      },
      {
        title: "Link Monitoring",
        url: "/super-admin/link-monitoring",
        icon: Activity,
        badge: "Nieuw",
        roles: ["super-admin"],
      },
      {
        title: "System Health",
        url: "/system-health",
        icon: Activity,
        roles: ["super-admin"],
      },
      {
        title: "White-label Portal",
        url: "/white-label",
        icon: Palette,
        roles: ["super-admin"],
      },
      {
        title: "Database Beheer",
        url: "/database-test",
        icon: Database,
        roles: ["super-admin"],
      },
    ],
  },
  {
    title: "Help",
    url: "/help",
    icon: HelpCircle,
    roles: [
      "super-admin",
      "partner-admin",
      "partner-manager",
      "customer-admin",
      "customer-manager",
      "bhv-coordinator",
      "employee",
      "bhv_medewerker",
      "admin",
    ],
  },
  {
    title: "Mijn Profiel",
    url: "/profiel",
    icon: Users,
    roles: ["bhv-coordinator", "employee", "customer-admin", "customer-manager", "bhv_medewerker", "admin"],
  },
  {
    title: "Bezoeker Registratie",
    url: "/visitor-registration",
    icon: UserPlus,
    badge: "Nieuw",
    roles: ["security-receptionist", "customer-admin", "bhv-coordinator", "admin"],
  },
  {
    title: "Monteur Registratie",
    url: "/contractor-registration",
    icon: Building,
    badge: "Nieuw",
    roles: ["security-receptionist", "customer-admin", "bhv-coordinator", "admin"],
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { user } = useAuth()

  // Filter menu items based on user role
  const filterMenuItems = (items: MenuItem[]): MenuItem[] => {
    if (!user?.role) return []

    return items
      .filter((item) => {
        // Check if user has access to this item
        const hasAccess = item.roles.includes(user.role)
        if (!hasAccess) return false

        // If item has subitems, filter those too
        if (item.items) {
          const filteredSubItems = filterMenuItems(item.items)
          // Only show parent if it has accessible subitems
          return filteredSubItems.length > 0
        }

        return true
      })
      .map((item) => ({
        ...item,
        items: item.items ? filterMenuItems(item.items) : undefined,
      }))
  }

  const visibleMenuItems = filterMenuItems(menuData)

  // Show loading state if user is not loaded yet
  if (!user) {
    return (
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
          <div className="flex items-center gap-2 px-4 py-2">
            <BHV360Logo size="md" variant="white" />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <div className="p-4 text-center text-muted-foreground">Laden...</div>
        </SidebarContent>
      </Sidebar>
    )
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="flex items-center gap-2 px-4 py-2">
          <BHV360Logo size="md" variant="white" />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {visibleMenuItems.map((item) => (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={pathname.startsWith(item.url)}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title} isActive={pathname === item.url} asChild={!item.items}>
                    {item.items ? (
                      <div className="flex items-center">
                        <item.icon className="mr-2 h-4 w-4" />
                        <span>{item.title}</span>
                        {item.badge && (
                          <Badge variant="secondary" className="ml-auto">
                            {item.badge}
                          </Badge>
                        )}
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </div>
                    ) : (
                      <Link href={item.url} className="flex items-center">
                        <item.icon className="mr-2 h-4 w-4" />
                        <span>{item.title}</span>
                        {item.badge && (
                          <Badge variant="secondary" className="ml-auto">
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    )}
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                {item.items && (
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild isActive={pathname === subItem.url}>
                            <Link href={subItem.url} className="flex items-center">
                              <span>{subItem.title}</span>
                              {subItem.badge && (
                                <Badge variant="outline" className="ml-auto text-xs">
                                  {subItem.badge}
                                </Badge>
                              )}
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                )}
              </SidebarMenuItem>
            </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <div className="p-4 text-center">
          <div className="text-xs text-muted-foreground">Ingelogd als: {user.role}</div>
          <div className="text-xs text-muted-foreground mt-1">BHV360 Platform v2.0</div>
          <div className="text-xs text-muted-foreground">© 2024 BHV360</div>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
