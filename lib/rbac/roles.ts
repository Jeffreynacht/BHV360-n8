// User Roles Enum
export enum UserRole {
  // === APP EIGENAAR NIVEAU ===
  SUPER_ADMIN = "super_admin", // Jij - volledige controle

  // === PARTNER NIVEAU ===
  PARTNER_ADMIN = "partner_admin", // Partner eigenaar - volledige partner controle
  PARTNER_MANAGER = "partner_manager", // Partner medewerker - beperkte rechten

  // === KLANT NIVEAU ===
  CUSTOMER_OWNER = "customer_owner", // Klant eigenaar/directeur
  CUSTOMER_ADMIN = "customer_admin", // IT/Facility manager
  CUSTOMER_MANAGER = "customer_manager", // HR/Operations manager

  // === BHV ROLLEN ===
  BHV_COORDINATOR = "bhv_coordinator", // BHV coördinator - team leiding
  BHV_PLOEGLEIDER = "bhv_ploegleider", // BHV ploegleider - verdieping verantwoordelijke
  BHV_MEMBER = "bhv_member", // BHV lid
  EHBO_MEMBER = "ehbo_member", // EHBO lid
  ONTRUIMER = "ontruimer", // Ontruimer

  // === STANDAARD GEBRUIKERS ===
  EMPLOYEE = "employee", // Standaard medewerker
  VISITOR = "visitor", // Bezoeker - zeer beperkte toegang
}

// Permission Scopes
export enum PermissionScope {
  GLOBAL = "global", // Alle data
  PARTNER = "partner", // Alleen eigen partner data
  CUSTOMER = "customer", // Alleen eigen klant data
  DEPARTMENT = "department", // Alleen eigen afdeling
  OWN = "own", // Alleen eigen data
}

// Resources die beschermd kunnen worden
export enum Resource {
  // === PLATFORM BEHEER ===
  PLATFORM = "platform",
  PARTNERS = "partners",
  CUSTOMERS = "customers",
  USERS = "users",
  BILLING = "billing",
  SYSTEM_SETTINGS = "system_settings",

  // === ORGANISATIE ===
  BUILDINGS = "buildings",
  FLOORS = "floors",
  DEPARTMENTS = "departments",
  FACILITIES = "facilities",

  // === BHV SPECIFIEK ===
  BHV_TEAMS = "bhv_teams",
  PLOTKAART = "plotkaart",
  INCIDENTS = "incidents",
  EVACUATIONS = "evacuations",
  TRAINING = "training",
  CERTIFICATIONS = "certifications",

  // === VOORZIENINGEN ===
  NFC_TAGS = "nfc_tags",
  SAFETY_EQUIPMENT = "safety_equipment",
  EHBO_SUPPLIES = "ehbo_supplies",

  // === RAPPORTAGES ===
  REPORTS = "reports",
  ANALYTICS = "analytics",
  AUDIT_LOGS = "audit_logs",

  // === INSTELLINGEN ===
  PROFILE = "profile",
  NOTIFICATIONS = "notifications",
  INTEGRATIONS = "integrations",
}

// Actions die uitgevoerd kunnen worden
export enum Action {
  CREATE = "create",
  READ = "read",
  UPDATE = "update",
  DELETE = "delete",
  MANAGE = "manage", // Volledige controle
  EXECUTE = "execute", // Voor acties zoals backup, export, etc.
  APPROVE = "approve", // Voor goedkeuringen
}

// Permission definitie
export interface Permission {
  resource: Resource
  action: Action
  scope: PermissionScope
  conditions?: Record<string, any> // Extra voorwaarden
}

// Role definities met permissions
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  // === SUPER ADMIN - Volledige toegang ===
  [UserRole.SUPER_ADMIN]: [
    { resource: Resource.PLATFORM, action: Action.MANAGE, scope: PermissionScope.GLOBAL },
    { resource: Resource.PARTNERS, action: Action.MANAGE, scope: PermissionScope.GLOBAL },
    { resource: Resource.CUSTOMERS, action: Action.MANAGE, scope: PermissionScope.GLOBAL },
    { resource: Resource.USERS, action: Action.MANAGE, scope: PermissionScope.GLOBAL },
    { resource: Resource.BILLING, action: Action.MANAGE, scope: PermissionScope.GLOBAL },
    { resource: Resource.SYSTEM_SETTINGS, action: Action.MANAGE, scope: PermissionScope.GLOBAL },
    { resource: Resource.AUDIT_LOGS, action: Action.READ, scope: PermissionScope.GLOBAL },
    { resource: Resource.ANALYTICS, action: Action.READ, scope: PermissionScope.GLOBAL },
  ],

  // === PARTNER ADMIN ===
  [UserRole.PARTNER_ADMIN]: [
    { resource: Resource.CUSTOMERS, action: Action.MANAGE, scope: PermissionScope.PARTNER },
    { resource: Resource.USERS, action: Action.MANAGE, scope: PermissionScope.PARTNER },
    { resource: Resource.BILLING, action: Action.READ, scope: PermissionScope.PARTNER },
    { resource: Resource.REPORTS, action: Action.READ, scope: PermissionScope.PARTNER },
    { resource: Resource.SYSTEM_SETTINGS, action: Action.UPDATE, scope: PermissionScope.PARTNER },
    { resource: Resource.INTEGRATIONS, action: Action.MANAGE, scope: PermissionScope.PARTNER },
  ],

  // === PARTNER MANAGER ===
  [UserRole.PARTNER_MANAGER]: [
    { resource: Resource.CUSTOMERS, action: Action.READ, scope: PermissionScope.PARTNER },
    { resource: Resource.USERS, action: Action.READ, scope: PermissionScope.PARTNER },
    { resource: Resource.REPORTS, action: Action.READ, scope: PermissionScope.PARTNER },
  ],

  // === CUSTOMER OWNER ===
  [UserRole.CUSTOMER_OWNER]: [
    { resource: Resource.USERS, action: Action.MANAGE, scope: PermissionScope.CUSTOMER },
    { resource: Resource.BUILDINGS, action: Action.MANAGE, scope: PermissionScope.CUSTOMER },
    { resource: Resource.DEPARTMENTS, action: Action.MANAGE, scope: PermissionScope.CUSTOMER },
    { resource: Resource.BHV_TEAMS, action: Action.MANAGE, scope: PermissionScope.CUSTOMER },
    { resource: Resource.BILLING, action: Action.READ, scope: PermissionScope.CUSTOMER },
    { resource: Resource.REPORTS, action: Action.READ, scope: PermissionScope.CUSTOMER },
    { resource: Resource.SYSTEM_SETTINGS, action: Action.UPDATE, scope: PermissionScope.CUSTOMER },
  ],

  // === CUSTOMER ADMIN ===
  [UserRole.CUSTOMER_ADMIN]: [
    { resource: Resource.USERS, action: Action.MANAGE, scope: PermissionScope.CUSTOMER },
    { resource: Resource.BUILDINGS, action: Action.MANAGE, scope: PermissionScope.CUSTOMER },
    { resource: Resource.FACILITIES, action: Action.MANAGE, scope: PermissionScope.CUSTOMER },
    { resource: Resource.NFC_TAGS, action: Action.MANAGE, scope: PermissionScope.CUSTOMER },
    { resource: Resource.SAFETY_EQUIPMENT, action: Action.MANAGE, scope: PermissionScope.CUSTOMER },
    { resource: Resource.INTEGRATIONS, action: Action.MANAGE, scope: PermissionScope.CUSTOMER },
    { resource: Resource.REPORTS, action: Action.READ, scope: PermissionScope.CUSTOMER },
  ],

  // === CUSTOMER MANAGER ===
  [UserRole.CUSTOMER_MANAGER]: [
    { resource: Resource.USERS, action: Action.READ, scope: PermissionScope.CUSTOMER },
    { resource: Resource.TRAINING, action: Action.MANAGE, scope: PermissionScope.CUSTOMER },
    { resource: Resource.CERTIFICATIONS, action: Action.MANAGE, scope: PermissionScope.CUSTOMER },
    { resource: Resource.REPORTS, action: Action.READ, scope: PermissionScope.CUSTOMER },
  ],

  // === BHV COORDINATOR ===
  [UserRole.BHV_COORDINATOR]: [
    { resource: Resource.BHV_TEAMS, action: Action.MANAGE, scope: PermissionScope.CUSTOMER },
    { resource: Resource.PLOTKAART, action: Action.MANAGE, scope: PermissionScope.CUSTOMER },
    { resource: Resource.INCIDENTS, action: Action.MANAGE, scope: PermissionScope.CUSTOMER },
    { resource: Resource.EVACUATIONS, action: Action.MANAGE, scope: PermissionScope.CUSTOMER },
    { resource: Resource.TRAINING, action: Action.MANAGE, scope: PermissionScope.CUSTOMER },
    { resource: Resource.CERTIFICATIONS, action: Action.MANAGE, scope: PermissionScope.CUSTOMER },
    { resource: Resource.SAFETY_EQUIPMENT, action: Action.READ, scope: PermissionScope.CUSTOMER },
    { resource: Resource.REPORTS, action: Action.READ, scope: PermissionScope.CUSTOMER },
  ],

  // === BHV PLOEGLEIDER ===
  [UserRole.BHV_PLOEGLEIDER]: [
    { resource: Resource.BHV_TEAMS, action: Action.READ, scope: PermissionScope.DEPARTMENT },
    { resource: Resource.PLOTKAART, action: Action.READ, scope: PermissionScope.CUSTOMER },
    { resource: Resource.INCIDENTS, action: Action.CREATE, scope: PermissionScope.CUSTOMER },
    { resource: Resource.INCIDENTS, action: Action.UPDATE, scope: PermissionScope.DEPARTMENT },
    { resource: Resource.EVACUATIONS, action: Action.EXECUTE, scope: PermissionScope.DEPARTMENT },
    { resource: Resource.TRAINING, action: Action.READ, scope: PermissionScope.CUSTOMER },
  ],

  // === BHV MEMBER ===
  [UserRole.BHV_MEMBER]: [
    { resource: Resource.PLOTKAART, action: Action.READ, scope: PermissionScope.CUSTOMER },
    { resource: Resource.INCIDENTS, action: Action.CREATE, scope: PermissionScope.CUSTOMER },
    { resource: Resource.INCIDENTS, action: Action.READ, scope: PermissionScope.CUSTOMER },
    { resource: Resource.SAFETY_EQUIPMENT, action: Action.READ, scope: PermissionScope.CUSTOMER },
    { resource: Resource.TRAINING, action: Action.READ, scope: PermissionScope.OWN },
  ],

  // === EHBO MEMBER ===
  [UserRole.EHBO_MEMBER]: [
    { resource: Resource.PLOTKAART, action: Action.READ, scope: PermissionScope.CUSTOMER },
    { resource: Resource.INCIDENTS, action: Action.CREATE, scope: PermissionScope.CUSTOMER },
    { resource: Resource.EHBO_SUPPLIES, action: Action.MANAGE, scope: PermissionScope.CUSTOMER },
    { resource: Resource.TRAINING, action: Action.READ, scope: PermissionScope.OWN },
  ],

  // === ONTRUIMER ===
  [UserRole.ONTRUIMER]: [
    { resource: Resource.PLOTKAART, action: Action.READ, scope: PermissionScope.CUSTOMER },
    { resource: Resource.EVACUATIONS, action: Action.EXECUTE, scope: PermissionScope.DEPARTMENT },
    { resource: Resource.TRAINING, action: Action.READ, scope: PermissionScope.OWN },
  ],

  // === EMPLOYEE ===
  [UserRole.EMPLOYEE]: [
    { resource: Resource.PLOTKAART, action: Action.READ, scope: PermissionScope.CUSTOMER },
    { resource: Resource.PROFILE, action: Action.UPDATE, scope: PermissionScope.OWN },
    { resource: Resource.NOTIFICATIONS, action: Action.READ, scope: PermissionScope.OWN },
  ],

  // === VISITOR ===
  [UserRole.VISITOR]: [{ resource: Resource.PLOTKAART, action: Action.READ, scope: PermissionScope.CUSTOMER }],
}

// RBAC Service voor permission checking
export class RBACService {
  static hasPermission(userRole: UserRole, resource: Resource, action: Action, scope?: PermissionScope): boolean {
    const rolePermissions = ROLE_PERMISSIONS[userRole] || []

    return rolePermissions.some((permission) => {
      // Check resource match
      if (permission.resource !== resource) return false

      // Check action match (MANAGE includes all actions)
      if (permission.action !== action && permission.action !== Action.MANAGE) return false

      // Check scope if provided
      if (scope && permission.scope !== scope) {
        // GLOBAL scope includes all other scopes
        if (permission.scope !== PermissionScope.GLOBAL) return false
      }

      return true
    })
  }

  static getRolePermissions(userRole: UserRole): Permission[] {
    return ROLE_PERMISSIONS[userRole] || []
  }

  static canAccessResource(userRole: UserRole, resource: Resource): boolean {
    const rolePermissions = ROLE_PERMISSIONS[userRole] || []
    return rolePermissions.some((permission) => permission.resource === resource)
  }

  static getAccessibleResources(userRole: UserRole): Resource[] {
    const rolePermissions = ROLE_PERMISSIONS[userRole] || []
    return [...new Set(rolePermissions.map((permission) => permission.resource))]
  }

  static isHigherRole(role1: UserRole, role2: UserRole): boolean {
    const roleHierarchy = [
      UserRole.VISITOR,
      UserRole.EMPLOYEE,
      UserRole.ONTRUIMER,
      UserRole.EHBO_MEMBER,
      UserRole.BHV_MEMBER,
      UserRole.BHV_PLOEGLEIDER,
      UserRole.BHV_COORDINATOR,
      UserRole.CUSTOMER_MANAGER,
      UserRole.CUSTOMER_ADMIN,
      UserRole.CUSTOMER_OWNER,
      UserRole.PARTNER_MANAGER,
      UserRole.PARTNER_ADMIN,
      UserRole.SUPER_ADMIN,
    ]

    return roleHierarchy.indexOf(role1) > roleHierarchy.indexOf(role2)
  }
}

// Helper functions voor UI
export function getRoleDisplayName(role: UserRole): string {
  const displayNames: Record<UserRole, string> = {
    [UserRole.SUPER_ADMIN]: "Super Administrator",
    [UserRole.PARTNER_ADMIN]: "Partner Administrator",
    [UserRole.PARTNER_MANAGER]: "Partner Manager",
    [UserRole.CUSTOMER_OWNER]: "Organisatie Eigenaar",
    [UserRole.CUSTOMER_ADMIN]: "Organisatie Administrator",
    [UserRole.CUSTOMER_MANAGER]: "Organisatie Manager",
    [UserRole.BHV_COORDINATOR]: "BHV Coördinator",
    [UserRole.BHV_PLOEGLEIDER]: "BHV Ploegleider",
    [UserRole.BHV_MEMBER]: "BHV Lid",
    [UserRole.EHBO_MEMBER]: "EHBO Lid",
    [UserRole.ONTRUIMER]: "Ontruimer",
    [UserRole.EMPLOYEE]: "Medewerker",
    [UserRole.VISITOR]: "Bezoeker",
  }

  return displayNames[role] || role
}

export function getRoleColor(role: UserRole): string {
  const colors: Record<UserRole, string> = {
    [UserRole.SUPER_ADMIN]: "bg-purple-100 text-purple-800",
    [UserRole.PARTNER_ADMIN]: "bg-blue-100 text-blue-800",
    [UserRole.PARTNER_MANAGER]: "bg-blue-50 text-blue-600",
    [UserRole.CUSTOMER_OWNER]: "bg-green-100 text-green-800",
    [UserRole.CUSTOMER_ADMIN]: "bg-green-50 text-green-600",
    [UserRole.CUSTOMER_MANAGER]: "bg-green-25 text-green-500",
    [UserRole.BHV_COORDINATOR]: "bg-red-100 text-red-800",
    [UserRole.BHV_PLOEGLEIDER]: "bg-red-50 text-red-600",
    [UserRole.BHV_MEMBER]: "bg-orange-100 text-orange-800",
    [UserRole.EHBO_MEMBER]: "bg-pink-100 text-pink-800",
    [UserRole.ONTRUIMER]: "bg-yellow-100 text-yellow-800",
    [UserRole.EMPLOYEE]: "bg-gray-100 text-gray-800",
    [UserRole.VISITOR]: "bg-gray-50 text-gray-600",
  }

  return colors[role] || "bg-gray-100 text-gray-800"
}
