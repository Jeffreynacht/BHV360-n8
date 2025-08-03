"use client"

import type * as React from "react"
import { useAuth } from "@/contexts/auth-context"
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
  SidebarRail,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Image from "next/image"
import {
  LayoutDashboard,
  Building2,
  Users,
  Shield,
  AlertTriangle,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  ChevronUp,
  Palette,
  Globe,
  Database,
  FileText,
  Activity,
} from "lucide-react"
import Link from "next/link"

const navigationItems = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Overzicht",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "BHV Status",
        url: "/bhv-status",
        icon: Shield,
      },
      {
        title: "Incidenten",
        url: "/incidenten",
        icon: AlertTriangle,
      },
    ],
  },
  {
    title: "Klanten Beheer",
    items: [
      {
        title: "Alle Klanten",
        url: "/klanten",
        icon: Building2,
      },
      {
        title: "Whitelabel Klanten",
        url: "/whitelabel-klanten",
        icon: Palette,
      },
      {
        title: "Klant Overzichten",
        url: "/klant-overzichten",
        icon: BarChart3,
      },
    ],
  },
  {
    title: "Whitelabel",
    items: [
      {
        title: "Configuratie",
        url: "/white-label/configure",
        icon: Settings,
      },
      {
        title: "Partner Klanten",
        url: "/white-label/partner-customers",
        icon: Users,
      },
      {
        title: "Domeinen",
        url: "/white-label/domains",
        icon: Globe,
      },
    ],
  },
  {
    title: "Beheer",
    items: [
      {
        title: "Gebruikers",
        url: "/beheer/gebruikers",
        icon: Users,
      },
      {
        title: "Rapportages",
        url: "/beheer/rapportages",
        icon: FileText,
      },
      {
        title: "Performance",
        url: "/beheer/performance",
        icon: Activity,
      },
      {
        title: "Backups",
        url: "/beheer/backups",
        icon: Database,
      },
    ],
  },
  {
    title: "Support",
    items: [
      {
        title: "Help Dashboard",
        url: "/help-dashboard",
        icon: HelpCircle,
      },
      {
        title: "Instellingen",
        url: "/instellingen",
        icon: Settings,
      },
    ],
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, logout } = useAuth()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <Image src="/images/bhv360-logo.png" alt="BHV360 Logo" width={32} height={32} className="rounded-lg" />
          <div className="group-data-[collapsible=icon]:hidden">
            <p className="text-sm font-semibold">BHV360</p>
            <p className="text-xs text-muted-foreground">Safety Management</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {navigationItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
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
                    <AvatarFallback className="rounded-lg">{user?.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user?.name}</span>
                    <span className="truncate text-xs">{user?.email}</span>
                  </div>
                  <ChevronUp className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem onClick={logout}>
                  <LogOut />
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
