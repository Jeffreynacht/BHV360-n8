import { UserRole } from "@/lib/rbac/roles"

export function getDashboardRoute(role: UserRole): string {
  switch (role) {
    case UserRole.SUPER_ADMIN:
      return "/dashboards/super-admin"
    case UserRole.PARTNER_ADMIN:
    case UserRole.PARTNER_MANAGER:
      return "/dashboards/partner-admin"
    case UserRole.CUSTOMER_OWNER:
    case UserRole.CUSTOMER_ADMIN:
    case UserRole.CUSTOMER_MANAGER:
      return "/dashboards/customer-admin"
    case UserRole.BHV_COORDINATOR:
    case UserRole.BHV_PLOEGLEIDER:
      return "/dashboards/bhv-coordinator"
    case UserRole.BHV_MEMBER:
    case UserRole.EHBO_MEMBER:
    case UserRole.ONTRUIMER:
    case UserRole.EMPLOYEE:
    case UserRole.VISITOR:
      return "/dashboards/employee"
    default:
      return "/dashboards/employee"
  }
}

export function getDashboardTitle(role: UserRole): string {
  switch (role) {
    case UserRole.SUPER_ADMIN:
      return "Platform Overzicht"
    case UserRole.PARTNER_ADMIN:
      return "Partner Dashboard"
    case UserRole.PARTNER_MANAGER:
      return "Partner Manager Dashboard"
    case UserRole.CUSTOMER_OWNER:
      return "Organisatie Eigenaar Dashboard"
    case UserRole.CUSTOMER_ADMIN:
      return "Organisatie Dashboard"
    case UserRole.CUSTOMER_MANAGER:
      return "Organisatie Manager Dashboard"
    case UserRole.BHV_COORDINATOR:
      return "BHV Coördinator Dashboard"
    case UserRole.BHV_PLOEGLEIDER:
      return "BHV Ploegleider Dashboard"
    case UserRole.BHV_MEMBER:
      return "BHV Lid Dashboard"
    case UserRole.EHBO_MEMBER:
      return "EHBO Lid Dashboard"
    case UserRole.ONTRUIMER:
      return "Ontruimer Dashboard"
    case UserRole.EMPLOYEE:
      return "Medewerker Dashboard"
    case UserRole.VISITOR:
      return "Bezoeker Dashboard"
    default:
      return "Dashboard"
  }
}
