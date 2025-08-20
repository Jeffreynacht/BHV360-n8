"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Building2,
  Users,
  Shield,
  Settings,
  BarChart3,
  AlertTriangle,
  Map,
  UserCheck,
  Crown,
  Briefcase,
  ChevronDown,
  ChevronRight,
  Home,
  HelpCircle,
  Heart,
  Database,
  Smartphone,
  Activity,
  Palette,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UserRole } from "@/lib/rbac/roles"
import { cn } from "@/lib/utils"

interface NavigationItem {
  title: string
  href: string
  icon: any
  roles: UserRole[]
  badge?: string
  children?: NavigationItem[]
}

const NAVIGATION_STRUCTURE: NavigationItem[] = [
  // === DASHBOARD (VOOR IEDEREEN) ===
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
    roles: Object.values(UserRole),
  },

  // === SUPER ADMIN - PLATFORM BEHEER ===
  {
    title: "Platform Beheer",
    href: "/super-admin",
    icon: Crown,
    roles: [UserRole.SUPER_ADMIN],
    children: [
      {
        title: "Partners Overzicht",
        href: "/super-admin/partners",
        icon: Briefcase,
        roles: [UserRole.SUPER_ADMIN],
        badge: "new",
      },
      {
        title: "White-label Portal",
        href: "/white-label",
        icon: Palette,
        roles: [UserRole.SUPER_ADMIN],
      },
      {
        title: "Alle Klanten",
        href: "/klanten",
        icon: Building2,
        roles: [UserRole.SUPER_ADMIN],
      },
      {
        title: "Systeem Monitoring",
        href: "/super-admin/monitoring",
        icon: Activity,
        roles: [UserRole.SUPER_ADMIN],
      },
      {
        title: "Database Beheer",
        href: "/database-test",
        icon: Database,
        roles: [UserRole.SUPER_ADMIN],
      },
      {
        title: "Platform Instellingen",
        href: "/super-admin/settings",
        icon: Settings,
        roles: [UserRole.SUPER_ADMIN],
      },
    ],
  },

  // === PARTNER BEHEER ===
  {
    title: "Partner Beheer",
    href: "/partner",
    icon: Briefcase,
    roles: [UserRole.PARTNER_ADMIN, UserRole.PARTNER_MANAGER],
    children: [
      {
        title: "Mijn Klanten",
        href: "/klanten",
        icon: Building2,
        roles: [UserRole.PARTNER_ADMIN, UserRole.PARTNER_MANAGER],
      },
      {
        title: "White-label",
        href: "/white-label",
        icon: Palette,
        roles: [UserRole.PARTNER_ADMIN],
      },
    ],
  },

  // === KLANT NIVEAU - PLOTKAART (VOOR IEDEREEN BEHALVE SUPER ADMIN) ===
  {
    title: "Plotkaart",
    href: "/plotkaart",
    icon: Map,
    roles: [
      UserRole.PARTNER_ADMIN,
      UserRole.PARTNER_MANAGER,
      UserRole.CUSTOMER_OWNER,
      UserRole.CUSTOMER_ADMIN,
      UserRole.CUSTOMER_MANAGER,
      UserRole.BHV_COORDINATOR,
      UserRole.BHV_PLOEGLEIDER,
      UserRole.BHV_MEMBER,
      UserRole.EHBO_MEMBER,
      UserRole.ONTRUIMER,
      UserRole.EMPLOYEE,
      UserRole.VISITOR,
    ],
  },

  // === KLANT NIVEAU - GEBRUIKERS ===
  {
    title: "Gebruikers",
    href: "/gebruikers",
    icon: Users,
    roles: [UserRole.CUSTOMER_OWNER, UserRole.CUSTOMER_ADMIN, UserRole.CUSTOMER_MANAGER],
    badge: "new",
  },

  // === KLANT NIVEAU - INCIDENTEN ===
  {
    title: "Incidenten",
    href: "/incidenten",
    icon: AlertTriangle,
    roles: [UserRole.BHV_COORDINATOR, UserRole.BHV_PLOEGLEIDER, UserRole.BHV_MEMBER],
  },

  // === KLANT NIVEAU - BHV FUNCTIES ===
  {
    title: "BHV Functies",
    href: "/bhv",
    icon: Shield,
    roles: [
      UserRole.BHV_COORDINATOR,
      UserRole.BHV_PLOEGLEIDER,
      UserRole.BHV_MEMBER,
      UserRole.EHBO_MEMBER,
      UserRole.ONTRUIMER,
    ],
    children: [
      {
        title: "BHV Overzicht",
        href: "/bhv",
        icon: Shield,
        roles: [UserRole.BHV_COORDINATOR, UserRole.BHV_PLOEGLEIDER, UserRole.BHV_MEMBER],
      },
      {
        title: "BHV Editor",
        href: "/bhv/editor",
        icon: Map,
        roles: [UserRole.BHV_COORDINATOR],
      },
      {
        title: "BHV Aanwezigheid",
        href: "/bhv-aanwezigheid",
        icon: Users,
        roles: [UserRole.BHV_COORDINATOR, UserRole.BHV_PLOEGLEIDER],
      },
      {
        title: "EHBO Voorraad",
        href: "/ehbo-voorraad",
        icon: Heart,
        roles: [UserRole.BHV_COORDINATOR, UserRole.EHBO_MEMBER],
      },
    ],
  },

  // === KLANT NIVEAU - ORGANISATIE BEHEER ===
  {
    title: "Beheer",
    href: "/beheer",
    icon: Settings,
    roles: [UserRole.CUSTOMER_OWNER, UserRole.CUSTOMER_ADMIN, UserRole.CUSTOMER_MANAGER],
    children: [
      {
        title: "Voorzieningen",
        href: "/beheer/voorzieningen",
        icon: Shield,
        roles: [UserRole.CUSTOMER_ADMIN],
      },
      {
        title: "NFC Overzicht",
        href: "/beheer/nfc-overzicht",
        icon: Smartphone,
        roles: [UserRole.CUSTOMER_ADMIN],
      },
      {
        title: "NFC Tags",
        href: "/beheer/nfc-tags",
        icon: UserCheck,
        roles: [UserRole.CUSTOMER_ADMIN],
      },
      {
        title: "Plotkaart Editor",
        href: "/beheer/plotkaart-editor",
        icon: Map,
        roles: [UserRole.CUSTOMER_ADMIN],
      },
      {
        title: "Rapportages",
        href: "/beheer/rapportages",
        icon: BarChart3,
        roles: [UserRole.CUSTOMER_OWNER, UserRole.CUSTOMER_ADMIN, UserRole.CUSTOMER_MANAGER],
      },
      {
        title: "Autorisaties",
        href: "/beheer/autorisaties",
        icon: UserCheck,
        roles: [UserRole.CUSTOMER_OWNER],
      },
    ],
  },

  // === TECHNISCH - ALLEEN VOOR ADMINS ===
  {
    title: "Systeem",
    href: "/debug",
    icon: Database,
    roles: [UserRole.CUSTOMER_ADMIN],
    children: [
      {
        title: "Debug",
        href: "/debug",
        icon: Settings,
        roles: [UserRole.CUSTOMER_ADMIN],
      },
      {
        title: "Instellingen",
        href: "/instellingen",
        icon: Settings,
        roles: [UserRole.CUSTOMER_ADMIN],
      },
    ],
  },

  // === HELP (VOOR IEDEREEN) ===
  {
    title: "Help",
    href: "/help",
    icon: HelpCircle,
    roles: Object.values(UserRole),
  },
]

interface RoleBasedNavigationProps {
  userRole: UserRole
  currentPath: string
}

export function RoleBasedNavigation({ userRole, currentPath }: RoleBasedNavigationProps) {
  const router = useRouter()
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(["Platform Beheer"]))

  // Auto-open section als huidige path erin zit
  useEffect(() => {
    NAVIGATION_STRUCTURE.forEach((item) => {
      if (item.children) {
        const hasActiveChild = item.children.some(
          (child) => currentPath === child.href || currentPath.startsWith(child.href + "/"),
        )
        if (hasActiveChild) {
          setOpenSections((prev) => new Set([...prev, item.title]))
        }
      }
    })
  }, [currentPath])

  const toggleSection = (title: string) => {
    setOpenSections((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(title)) {
        newSet.delete(title)
      } else {
        newSet.add(title)
      }
      return newSet
    })
  }

  const hasAccess = (item: NavigationItem): boolean => {
    return item.roles.includes(userRole)
  }

  const getVisibleItems = (items: NavigationItem[]): NavigationItem[] => {
    return items.filter(hasAccess).map((item) => ({
      ...item,
      children: item.children ? getVisibleItems(item.children) : undefined,
    }))
  }

  const visibleNavigation = getVisibleItems(NAVIGATION_STRUCTURE)

  const renderNavigationItem = (item: NavigationItem, level = 0) => {
    const isActive = currentPath === item.href || currentPath.startsWith(item.href + "/")
    const isOpen = openSections.has(item.title)
    const hasChildren = item.children && item.children.length > 0

    return (
      <div key={item.title} className={cn("space-y-1", level > 0 && "ml-4")}>
        {hasChildren ? (
          <div>
            <Button
              variant={isActive ? "secondary" : "ghost"}
              className="w-full justify-start"
              size="sm"
              onClick={() => toggleSection(item.title)}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.title}
              {item.badge && (
                <Badge variant="secondary" className="ml-auto mr-2">
                  {item.badge}
                </Badge>
              )}
              {isOpen ? <ChevronDown className="ml-auto h-4 w-4" /> : <ChevronRight className="ml-auto h-4 w-4" />}
            </Button>
            {isOpen && (
              <div className="space-y-1 mt-1">
                {item.children?.map((child) => renderNavigationItem(child, level + 1))}
              </div>
            )}
          </div>
        ) : (
          <Button
            variant={isActive ? "secondary" : "ghost"}
            className="w-full justify-start"
            size="sm"
            onClick={() => router.push(item.href)}
          >
            <item.icon className="mr-2 h-4 w-4" />
            {item.title}
            {item.badge && (
              <Badge variant="secondary" className="ml-auto">
                {item.badge}
              </Badge>
            )}
          </Button>
        )}
      </div>
    )
  }

  return (
    <nav className="space-y-2 p-4">
      <div className="space-y-1">{visibleNavigation.map((item) => renderNavigationItem(item))}</div>
    </nav>
  )
}
