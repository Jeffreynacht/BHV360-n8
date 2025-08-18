export enum UserRole {
  SUPER_ADMIN = "super_admin",
  ADMIN = "admin",
  PARTNER_ADMIN = "partner_admin",
  PARTNER_MANAGER = "partner-manager",
  CUSTOMER_OWNER = "customer_owner",
  CUSTOMER_ADMIN = "customer_admin",
  CUSTOMER_MANAGER = "customer_manager",
  BHV_COORDINATOR = "bhv_coordinator",
  BHV_PLOEGLEIDER = "bhv_ploegleider",
  BHV_MEMBER = "bhv_member",
  EHBO_MEMBER = "ehbo_member",
  ONTRUIMER = "ontruimer",
  VISITOR = "visitor",
  SECURITY_RECEPTIONIST = "security-receptionist",
  EMPLOYEE = "employee",
}

export enum Resource {
  CUSTOMERS = "customers",
  USERS = "users",
  BUILDINGS = "buildings",
  FACILITIES = "facilities",
  PLOTKAART = "plotkaart",
  WHITELABEL = "whitelabel",
  REPORTS = "reports",
  SYSTEM = "system",
  INCIDENTS = "incidents",
  VISITORS = "visitors",
  CONTRACTORS = "contractors",
  PRESENCE = "presence",
  BHV_ROLES = "bhv_roles",
}

export enum Action {
  CREATE = "create",
  READ = "read",
  UPDATE = "update",
  DELETE = "delete",
  MANAGE = "manage",
  REGISTER = "register",
  CHECK_IN = "check_in",
  CHECK_OUT = "check_out",
  ASSIGN = "assign",
  REVOKE = "revoke",
}

interface Permission {
  resource: Resource
  actions: Action[]
}

const rolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.SUPER_ADMIN]: [
    {
      resource: Resource.CUSTOMERS,
      actions: [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE, Action.MANAGE],
    },
    { resource: Resource.USERS, actions: [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE, Action.MANAGE] },
    {
      resource: Resource.BUILDINGS,
      actions: [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE, Action.MANAGE],
    },
    {
      resource: Resource.FACILITIES,
      actions: [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE, Action.MANAGE],
    },
    {
      resource: Resource.PLOTKAART,
      actions: [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE, Action.MANAGE],
    },
    {
      resource: Resource.WHITELABEL,
      actions: [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE, Action.MANAGE],
    },
    { resource: Resource.REPORTS, actions: [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE, Action.MANAGE] },
    { resource: Resource.SYSTEM, actions: [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE, Action.MANAGE] },
    {
      resource: Resource.INCIDENTS,
      actions: [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE, Action.MANAGE],
    },
    { resource: Resource.VISITORS, actions: [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE, Action.MANAGE] },
    {
      resource: Resource.CONTRACTORS,
      actions: [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE, Action.MANAGE],
    },
    { resource: Resource.PRESENCE, actions: [Action.READ, Action.MANAGE] },
    { resource: Resource.BHV_ROLES, actions: [Action.ASSIGN, Action.REVOKE, Action.MANAGE] },
  ],

  // Admin en BHV Coordinator hebben dezelfde rechten voor operationele zaken + BHV rol toekenning
  [UserRole.ADMIN]: [
    { resource: Resource.USERS, actions: [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE] },
    { resource: Resource.BUILDINGS, actions: [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE] },
    { resource: Resource.FACILITIES, actions: [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE] },
    { resource: Resource.PLOTKAART, actions: [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE] },
    { resource: Resource.REPORTS, actions: [Action.CREATE, Action.READ, Action.UPDATE] },
    { resource: Resource.INCIDENTS, actions: [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE] },
    { resource: Resource.VISITORS, actions: [Action.READ, Action.UPDATE] },
    { resource: Resource.CONTRACTORS, actions: [Action.READ, Action.UPDATE] },
    { resource: Resource.PRESENCE, actions: [Action.READ] },
    { resource: Resource.BHV_ROLES, actions: [Action.ASSIGN, Action.REVOKE] }, // Kan BHV rollen toekennen
  ],

  [UserRole.BHV_COORDINATOR]: [
    { resource: Resource.USERS, actions: [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE] },
    { resource: Resource.BUILDINGS, actions: [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE] },
    { resource: Resource.FACILITIES, actions: [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE] },
    { resource: Resource.PLOTKAART, actions: [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE] },
    { resource: Resource.REPORTS, actions: [Action.CREATE, Action.READ, Action.UPDATE] },
    { resource: Resource.INCIDENTS, actions: [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE] },
    { resource: Resource.VISITORS, actions: [Action.READ, Action.UPDATE] },
    { resource: Resource.CONTRACTORS, actions: [Action.READ, Action.UPDATE] },
    { resource: Resource.PRESENCE, actions: [Action.READ] },
    { resource: Resource.BHV_ROLES, actions: [Action.ASSIGN, Action.REVOKE] }, // Kan BHV rollen toekennen
  ],

  [UserRole.PARTNER_ADMIN]: [
    { resource: Resource.CUSTOMERS, actions: [Action.CREATE, Action.READ, Action.UPDATE] },
    { resource: Resource.USERS, actions: [Action.CREATE, Action.READ, Action.UPDATE] },
    { resource: Resource.REPORTS, actions: [Action.READ, Action.UPDATE] },
    { resource: Resource.INCIDENTS, actions: [Action.CREATE, Action.READ, Action.UPDATE] },
    { resource: Resource.PLOTKAART, actions: [Action.READ, Action.UPDATE] },
    { resource: Resource.PRESENCE, actions: [Action.READ] },
  ],

  [UserRole.PARTNER_MANAGER]: [
    { resource: Resource.CUSTOMERS, actions: [Action.READ, Action.UPDATE] },
    { resource: Resource.USERS, actions: [Action.READ, Action.UPDATE] },
    { resource: Resource.REPORTS, actions: [Action.READ] },
    { resource: Resource.INCIDENTS, actions: [Action.CREATE, Action.READ, Action.UPDATE] },
    { resource: Resource.PLOTKAART, actions: [Action.READ] },
    { resource: Resource.PRESENCE, actions: [Action.READ] },
  ],

  [UserRole.CUSTOMER_OWNER]: [
    {
      resource: Resource.CUSTOMERS,
      actions: [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE, Action.MANAGE],
    },
    { resource: Resource.USERS, actions: [Action.CREATE, Action.READ, Action.UPDATE] },
    { resource: Resource.REPORTS, actions: [Action.READ, Action.UPDATE] },
    { resource: Resource.INCIDENTS, actions: [Action.CREATE, Action.READ, Action.UPDATE] },
    { resource: Resource.PLOTKAART, actions: [Action.READ, Action.UPDATE] },
    { resource: Resource.PRESENCE, actions: [Action.READ] },
  ],

  [UserRole.CUSTOMER_ADMIN]: [
    { resource: Resource.USERS, actions: [Action.CREATE, Action.READ, Action.UPDATE] },
    { resource: Resource.REPORTS, actions: [Action.READ] },
    { resource: Resource.INCIDENTS, actions: [Action.CREATE, Action.READ, Action.UPDATE] },
    { resource: Resource.PLOTKAART, actions: [Action.READ, Action.UPDATE] },
    { resource: Resource.VISITORS, actions: [Action.READ] },
    { resource: Resource.CONTRACTORS, actions: [Action.READ] },
    { resource: Resource.PRESENCE, actions: [Action.READ] },
  ],

  [UserRole.CUSTOMER_MANAGER]: [
    { resource: Resource.USERS, actions: [Action.READ, Action.UPDATE] },
    { resource: Resource.REPORTS, actions: [Action.READ] },
    { resource: Resource.INCIDENTS, actions: [Action.CREATE, Action.READ, Action.UPDATE] },
    { resource: Resource.PLOTKAART, actions: [Action.READ] },
    { resource: Resource.VISITORS, actions: [Action.READ] },
    { resource: Resource.CONTRACTORS, actions: [Action.READ] },
    { resource: Resource.PRESENCE, actions: [Action.READ] },
  ],

  [UserRole.BHV_PLOEGLEIDER]: [
    { resource: Resource.USERS, actions: [Action.READ, Action.UPDATE] },
    { resource: Resource.BUILDINGS, actions: [Action.READ] },
    { resource: Resource.FACILITIES, actions: [Action.READ] },
    { resource: Resource.PLOTKAART, actions: [Action.READ] },
    { resource: Resource.REPORTS, actions: [Action.READ] },
    { resource: Resource.INCIDENTS, actions: [Action.CREATE, Action.READ, Action.UPDATE] },
    { resource: Resource.VISITORS, actions: [Action.READ] },
    { resource: Resource.CONTRACTORS, actions: [Action.READ] },
    { resource: Resource.PRESENCE, actions: [Action.READ] },
    { resource: Resource.BHV_ROLES, actions: [Action.READ] },
  ],

  [UserRole.BHV_MEMBER]: [
    { resource: Resource.USERS, actions: [Action.READ] },
    { resource: Resource.BUILDINGS, actions: [Action.READ] },
    { resource: Resource.FACILITIES, actions: [Action.READ] },
    { resource: Resource.PLOTKAART, actions: [Action.READ] },
    { resource: Resource.REPORTS, actions: [Action.READ] },
    { resource: Resource.INCIDENTS, actions: [Action.CREATE, Action.READ] },
    { resource: Resource.VISITORS, actions: [Action.READ] },
    { resource: Resource.CONTRACTORS, actions: [Action.READ] },
    { resource: Resource.PRESENCE, actions: [Action.READ] },
  ],

  [UserRole.EHBO_MEMBER]: [
    { resource: Resource.USERS, actions: [Action.READ] },
    { resource: Resource.BUILDINGS, actions: [Action.READ] },
    { resource: Resource.FACILITIES, actions: [Action.READ] },
    { resource: Resource.PLOTKAART, actions: [Action.READ] },
    { resource: Resource.REPORTS, actions: [Action.READ] },
    { resource: Resource.INCIDENTS, actions: [Action.CREATE, Action.READ] },
    { resource: Resource.VISITORS, actions: [Action.READ] },
    { resource: Resource.CONTRACTORS, actions: [Action.READ] },
    { resource: Resource.PRESENCE, actions: [Action.READ] },
  ],

  [UserRole.ONTRUIMER]: [
    { resource: Resource.USERS, actions: [Action.READ] },
    { resource: Resource.BUILDINGS, actions: [Action.READ] },
    { resource: Resource.FACILITIES, actions: [Action.READ] },
    { resource: Resource.PLOTKAART, actions: [Action.READ] },
    { resource: Resource.REPORTS, actions: [Action.READ] },
    { resource: Resource.INCIDENTS, actions: [Action.CREATE, Action.READ] },
    { resource: Resource.VISITORS, actions: [Action.READ] },
    { resource: Resource.CONTRACTORS, actions: [Action.READ] },
    { resource: Resource.PRESENCE, actions: [Action.READ] },
  ],

  [UserRole.VISITOR]: [
    { resource: Resource.PLOTKAART, actions: [Action.READ] },
    { resource: Resource.PRESENCE, actions: [Action.READ] },
  ],

  // Security/Receptionist - GEEN BHV rechten standaard, alleen bezoeker/monteur beheer
  [UserRole.SECURITY_RECEPTIONIST]: [
    {
      resource: Resource.VISITORS,
      actions: [Action.CREATE, Action.READ, Action.UPDATE, Action.REGISTER, Action.CHECK_IN, Action.CHECK_OUT],
    },
    {
      resource: Resource.CONTRACTORS,
      actions: [Action.CREATE, Action.READ, Action.UPDATE, Action.REGISTER, Action.CHECK_IN, Action.CHECK_OUT],
    },
    { resource: Resource.INCIDENTS, actions: [Action.CREATE, Action.READ] },
    { resource: Resource.PLOTKAART, actions: [Action.READ] },
    { resource: Resource.PRESENCE, actions: [Action.READ] },
    // GEEN BHV_ROLES rechten - kan zichzelf geen BHV rechten toekennen
  ],

  [UserRole.EMPLOYEE]: [
    { resource: Resource.INCIDENTS, actions: [Action.CREATE, Action.READ] },
    { resource: Resource.PLOTKAART, actions: [Action.READ] },
    { resource: Resource.PRESENCE, actions: [Action.READ] },
  ],
}

export class RBACService {
  static hasPermission(userRole: UserRole, resource: Resource, action: Action): boolean {
    const permissions = rolePermissions[userRole] || []
    const resourcePermission = permissions.find((p) => p.resource === resource)
    return resourcePermission?.actions.includes(action) || false
  }

  static getPermissions(userRole: UserRole): Permission[] {
    return rolePermissions[userRole] || []
  }

  static canAccessResource(userRole: UserRole, resource: Resource): boolean {
    const permissions = rolePermissions[userRole] || []
    return permissions.some((p) => p.resource === resource)
  }

  static canManageContractors(userRole: UserRole): boolean {
    return (
      this.hasPermission(userRole, Resource.CONTRACTORS, Action.REGISTER) ||
      this.hasPermission(userRole, Resource.CONTRACTORS, Action.MANAGE)
    )
  }

  static canManageVisitors(userRole: UserRole): boolean {
    return (
      this.hasPermission(userRole, Resource.VISITORS, Action.REGISTER) ||
      this.hasPermission(userRole, Resource.VISITORS, Action.MANAGE)
    )
  }

  static canAssignBHVRoles(userRole: UserRole): boolean {
    return this.hasPermission(userRole, Resource.BHV_ROLES, Action.ASSIGN)
  }

  static canRevokeBHVRoles(userRole: UserRole): boolean {
    return this.hasPermission(userRole, Resource.BHV_ROLES, Action.REVOKE)
  }

  static canManageCustomers(userRole: UserRole): boolean {
    return this.hasPermission(userRole, Resource.CUSTOMERS, Action.MANAGE)
  }

  static canManageBHVRoles(userRole: UserRole): boolean {
    return this.hasPermission(userRole, Resource.BHV_ROLES, Action.MANAGE)
  }
}
