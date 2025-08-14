"use client"

import type * as React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useCustomer } from "@/components/customer-context"
import {
  Building2,
  Users,
  Shield,
  AlertTriangle,
  Settings,
  FileText,
  BarChart3,
  Crown,
  Globe,
  Database,
  HelpCircle,
  LogOut,
  ChevronDown,
  Home,
  MapPin,
  Bell,
  Wrench,
  Monitor,
  Smartphone,
  Calendar,
  Package,
  Activity,
  Zap,
  Plus,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

const navigationItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
    roles: ["super-admin", "admin", "customer-admin", "bhv-coordinator", "employee"],
  },
  {
    title: "Klanten",
    icon: Building2,
    roles: ["super-admin", "admin"],
    items: [
      {
        title: "Alle Klanten",
        url: "/klanten",
        icon: Building2,
      },
      {
        title: "Whitelabel Klanten",
        url: "/whitelabel-klanten",
        icon: Crown,
      },
      {
        title: "Klant Overzichten",
        url: "/klant-overzichten",
        icon: BarChart3,
      },
    ],
  },
  {
    title: "BHV Management",
    icon: Shield,
    roles: ["super-admin", "admin", "customer-admin", "bhv-coordinator"],
    items: [
      {
        title: "BHV Personeel",
        url: "/gebruikers",
        icon: Users,
      },
      {
        title: "BHV Aanwezigheid",
        url: "/bhv-aanwezigheid",
        icon: Calendar,
      },
      {
        title: "BHV Coordinator",
        url: "/bhv-coordinator",
        icon: Shield,
      },
    ],
  },
  {
    title: "Plotkaart & Locaties",
    icon: MapPin,
    roles: ["super-admin", "admin", "customer-admin", "bhv-coordinator", "employee"],
    items: [
      {
        title: "Plotkaart Bekijken",
        url: "/plotkaart",
        icon: MapPin,
      },
      {
        title: "Plotkaart Editor",
        url: "/beheer/plotkaart-editor",
        icon: Settings,
        roles: ["super-admin", "admin", "customer-admin"],
      },
      {
        title: "Voorzieningen",
        url: "/beheer/voorzieningen",
        icon: Package,
        roles: ["super-admin", "admin", "customer-admin"],
      },
    ],
  },
  {
    title: "Incidenten",
    icon: AlertTriangle,
    roles: ["super-admin", "admin", "customer-admin", "bhv-coordinator", "employee"],
    items: [
      {
        title: "Incident Overzicht",
        url: "/incidenten",
        icon: AlertTriangle,
      },
      {
        title: "Nieuwe Melding",
        url: "/incidenten/nieuw",
        icon: Plus,
      },
    ],
  },
  {
    title: "Beheer",
    icon: Settings,
    roles: ["super-admin", "admin", "customer-admin"],
    items: [
      {
        title: "Gebruikers Beheer",
        url: "/beheer/gebruikers",
        icon: Users,
      },
      {
        title: "Autorisaties",
        url: "/beheer/autorisaties",
        icon: Shield,
      },
      {
        title: "Rapportages",
        url: "/beheer/rapportages",
        icon: FileText,
      },
      {
        title: "Backups",
        url: "/beheer/backups",
        icon: Database,
      },
      {
        title: "Performance",
        url: "/beheer/performance",
        icon: Activity,
      },
    ],
  },
  {
    title: "Geavanceerd",
    icon: Wrench,
    roles: ["super-admin", "admin"],
    items: [
      {
        title: "API Integraties",
        url: "/beheer/api-integraties",
        icon: Zap,
      },
      {
        title: "NFC Overzicht",
        url: "/beheer/nfc-overzicht",
        icon: Smartphone,
      },
      {
        title: "System Health",
        url: "/system-health",
        icon: Monitor,
      },
    ],
  },
  {
    title: "Super Admin",
    icon: Crown,
    roles: ["super-admin"],
    items: [
      {
        title: "Partners",
        url: "/super-admin/partners",
        icon: Globe,
      },
      {
        title: "System Overview",
        url: "/super-admin",
        icon: Monitor,
      },
    ],
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const { selectedCustomer, customers } = useCustomer()
  const { state } = useSidebar()
  const [logoError, setLogoError] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const filteredNavigation = navigationItems.filter((item) => {
    if (!item.roles || !user?.role) return false
    return item.roles.includes(user.role)
  })

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                  {!logoError ? (
                    <Image
                      src="/images/bhv360-logo.png"
                      alt="BHV360 Logo"
                      width={32}
                      height={32}
                      className="rounded-lg"
                      onError={() => setLogoError(true)}
                    />
                  ) : (
                    <Shield className="h-5 w-5" />
                  )}
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">BHV360</span>
                  <span className="truncate text-xs">Safety Management</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Customer Selection */}
        {user?.role !== "employee" && (
          <>
            <SidebarGroup>
              <SidebarGroupLabel>Klant</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuButton>
                          <Building2 className="h-4 w-4" />
                          <span className="truncate">
                            {selectedCustomer ? selectedCustomer.name : "Selecteer klant"}
                          </span>
                          <ChevronDown className="ml-auto h-4 w-4" />
                        </SidebarMenuButton>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-[--radix-popper-anchor-width]" align="start">
                        {customers.length === 0 ? (
                          <DropdownMenuItem disabled>Geen klanten beschikbaar</DropdownMenuItem>
                        ) : (
                          customers.map((customer) => (
                            <DropdownMenuItem key={customer.id}>
                              <Building2 className="mr-2 h-4 w-4" />
                              {customer.name}
                            </DropdownMenuItem>
                          ))
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/klanten">
                            <Plus className="mr-2 h-4 w-4" />
                            Nieuwe klant
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarSeparator />
          </>
        )}

        {/* Navigation */}
        {filteredNavigation.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items ? (
                  <Collapsible defaultOpen className="group/collapsible">
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip={item.title}>
                          {item.icon && <item.icon className="h-4 w-4" />}
                          <span>{item.title}</span>
                          <ChevronDown className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map((subItem) => {
                            const isActive = pathname === subItem.url
                            const hasAccess = !subItem.roles || subItem.roles.includes(user?.role || "")

                            if (!hasAccess) return null

                            return (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton asChild isActive={isActive}>
                                  <Link href={subItem.url}>
                                    {subItem.icon && <subItem.icon className="h-4 w-4" />}
                                    <span>{subItem.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            )
                          })}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ) : (
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === item.url} tooltip={item.title}>
                      <Link href={item.url}>
                        {item.icon && <item.icon className="h-4 w-4" />}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        {/* Quick Actions */}
        <SidebarGroup>
          <SidebarGroupLabel>Snelle Acties</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Help & Support">
                  <Link href="/help">
                    <HelpCircle className="h-4 w-4" />
                    <span>Help</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Notificaties">
                  <Link href="/notificaties">
                    <Bell className="h-4 w-4" />
                    <span>Notificaties</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src="/placeholder-user.jpg" alt={user?.name} />
                    <AvatarFallback className="rounded-lg">
                      {user?.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user?.name || "Gebruiker"}</span>
                    <span className="truncate text-xs">{user?.email}</span>
                  </div>
                  <ChevronDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-popper-anchor-width] min-w-56 rounded-lg"
                side={state === "collapsed" ? "right" : "bottom"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem asChild>
                  <Link href="/instellingen">
                    <Settings className="mr-2 h-4 w-4" />
                    Instellingen
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/help">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Help & Support
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Uitloggen
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
