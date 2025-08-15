export function getDashboardRoute(userRole: string): string {
  console.log("🚀 Getting dashboard route for role:", userRole)

  switch (userRole) {
    case "super_admin":
      console.log("✅ Super admin detected, routing to super-admin dashboard")
      return "/dashboards/super-admin"
    case "admin":
      console.log("🎯 Admin role detected, routing to BHV coordinator dashboard")
      return "/dashboards/bhv-coordinator" // Admin krijgt BHV Coordinator dashboard
    case "partner_admin":
    case "partner-admin":
      console.log("✅ Partner admin detected")
      return "/dashboards/partner-admin"
    case "partner_manager":
    case "partner-manager":
      console.log("✅ Partner manager detected")
      return "/dashboards/partner-admin"
    case "customer_admin":
    case "customer-admin":
      console.log("✅ Customer admin detected")
      return "/dashboards/customer-admin"
    case "customer_manager":
      console.log("✅ Customer manager detected")
      return "/dashboards/customer-admin"
    case "bhv-coordinator":
    case "bhv_coordinator":
      console.log("✅ BHV coordinator detected")
      return "/dashboards/bhv-coordinator"
    case "security-receptionist":
    case "security_receptionist":
      console.log("✅ Security receptionist detected")
      return "/dashboards/security-receptionist"
    case "employee":
    case "bhv_medewerker":
    default:
      console.log("✅ Employee detected")
      return "/dashboards/employee"
  }
}

export function getAvailableRoutes(userRole: string): string[] {
  const baseRoutes = ["/plotkaart", "/incidenten", "/profiel"]

  switch (userRole) {
    case "super_admin":
      return [
        ...baseRoutes,
        "/dashboards/super-admin",
        "/dashboards/bhv-coordinator",
        "/dashboards/customer-admin",
        "/dashboards/partner-admin",
        "/dashboards/security-receptionist",
        "/dashboards/employee",
        "/gebruikers",
        "/klanten",
        "/beheer",
        "/visitor-registration",
        "/contractor-registration",
        "/bhv-aanwezigheid",
        "/ehbo-voorraad",
        "/nfc-scan",
        "/bhv/plotkaart",
      ]
    case "admin":
    case "bhv-coordinator":
    case "bhv_coordinator":
      return [
        ...baseRoutes,
        "/dashboards/bhv-coordinator",
        "/gebruikers",
        "/beheer/voorzieningen",
        "/beheer/plotkaart-editor",
        "/beheer/nfc-tags",
        "/beheer/gebruikers",
        "/beheer/module-marketplace",
        "/beheer/inspectierapporten",
        "/beheer/rapportages",
        "/beheer/autorisaties",
        "/beheer/backups",
        "/bhv-aanwezigheid",
        "/ehbo-voorraad",
        "/nfc-scan",
        "/bhv/plotkaart",
        "/bhv/editor",
      ]
    case "security-receptionist":
    case "security_receptionist":
      return [
        ...baseRoutes,
        "/dashboards/security-receptionist",
        "/visitor-registration",
        "/contractor-registration",
        "/bhv-aanwezigheid",
      ]
    case "customer_admin":
    case "customer-admin":
    case "customer_manager":
      return [...baseRoutes, "/dashboards/customer-admin", "/gebruikers", "/beheer/voorzieningen"]
    case "employee":
    case "bhv_medewerker":
    default:
      return [...baseRoutes, "/dashboards/employee", "/bhv-aanwezigheid", "/nfc-scan"]
  }
}

export function canAccessRoute(userRole: string, route: string): boolean {
  const availableRoutes = getAvailableRoutes(userRole)
  return availableRoutes.some((availableRoute) => route.startsWith(availableRoute))
}

export function getDashboardTitle(role: string): string {
  switch (role) {
    case "super_admin":
      return "Platform Overzicht"
    case "partner_admin":
    case "partner-manager":
      return "Partner Dashboard"
    case "customer_admin":
    case "customer_manager":
      return "Organisatie Dashboard"
    case "bhv-coordinator":
      return "BHV Coördinator Dashboard"
    case "admin":
      return "Admin Dashboard" // Admin heeft eigen titel maar BHV Coordinator rechten
    case "security-receptionist":
      return "Beveiliging & Receptie Dashboard"
    case "employee":
    case "bhv_medewerker":
    default:
      return "Medewerker Dashboard"
  }
}
