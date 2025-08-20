import type { User } from "@/contexts/auth-context"

export function getDashboardRoute(user: User | null): string {
  if (!user) {
    return "/login"
  }

  // Route based on user role
  switch (user.role) {
    case "SUPER_ADMIN":
      return "/dashboards/super-admin"
    case "PARTNER_ADMIN":
      return "/dashboards/partner-admin"
    case "CUSTOMER_ADMIN":
      return "/dashboards/customer-admin"
    case "BHV_COORDINATOR":
      return "/dashboards/bhv-coordinator"
    case "SECURITY_RECEPTIONIST":
      return "/dashboards/security-receptionist"
    case "EMPLOYEE":
      return "/dashboards/employee"
    default:
      return "/dashboard"
  }
}

export function canAccessRoute(user: User | null, route: string): boolean {
  if (!user) {
    return false
  }

  // Define route access rules
  const routeAccess: Record<string, string[]> = {
    "/super-admin": ["SUPER_ADMIN"],
    "/dashboards/super-admin": ["SUPER_ADMIN"],
    "/dashboards/partner-admin": ["SUPER_ADMIN", "PARTNER_ADMIN"],
    "/dashboards/customer-admin": ["SUPER_ADMIN", "PARTNER_ADMIN", "CUSTOMER_ADMIN"],
    "/dashboards/bhv-coordinator": ["SUPER_ADMIN", "PARTNER_ADMIN", "CUSTOMER_ADMIN", "BHV_COORDINATOR"],
    "/dashboards/security-receptionist": ["SUPER_ADMIN", "PARTNER_ADMIN", "CUSTOMER_ADMIN", "SECURITY_RECEPTIONIST"],
    "/dashboards/employee": [
      "SUPER_ADMIN",
      "PARTNER_ADMIN",
      "CUSTOMER_ADMIN",
      "BHV_COORDINATOR",
      "SECURITY_RECEPTIONIST",
      "EMPLOYEE",
    ],
  }

  const allowedRoles = routeAccess[route]
  if (!allowedRoles) {
    return true // Allow access to routes not explicitly restricted
  }

  return allowedRoles.includes(user.role)
}
