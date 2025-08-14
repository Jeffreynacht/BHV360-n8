export enum UserRole {
  SUPER_ADMIN = "super-admin",
  ADMIN = "admin",
  PARTNER_ADMIN = "partner-admin",
  PARTNER_MANAGER = "partner-manager",
  CUSTOMER_ADMIN = "customer-admin",
  BHV_COORDINATOR = "bhv-coordinator",
  EMPLOYEE = "employee",
}

export enum Resource {
  CUSTOMERS = "customers",
  USERS = "users",
  WHITELABEL = "whitelabel",
  REPORTS = "reports",
  SYSTEM = "system",
  INCIDENTS = "incidents",
  PLOTKAART = "plotkaart",
}

export enum Action {
  CREATE = "create",
  READ = "read",
  UPDATE = "update",
  DELETE = "delete",
  MANAGE = "manage",
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
      resource: Resource.WHITELABEL,
      actions: [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE, Action.MANAGE],
    },
    { resource: Resource.REPORTS, actions: [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE, Action.MANAGE] },
    { resource: Resource.SYSTEM, actions: [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE, Action.MANAGE] },
    {
      resource: Resource.INCIDENTS,
      actions: [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE, Action.MANAGE],
    },
    {
      resource: Resource.PLOTKAART,
      actions: [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE, Action.MANAGE],
    },
  ],
  [UserRole.ADMIN]: [
    { resource: Resource.CUSTOMERS, actions: [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE] },
    { resource: Resource.USERS, actions: [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE] },
    { resource: Resource.REPORTS, actions: [Action.CREATE, Action.READ, Action.UPDATE] },
    { resource: Resource.INCIDENTS, actions: [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE] },
    { resource: Resource.PLOTKAART, actions: [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE] },
  ],
  [UserRole.PARTNER_ADMIN]: [
    { resource: Resource.CUSTOMERS, actions: [Action.CREATE, Action.READ, Action.UPDATE] },
    { resource: Resource.USERS, actions: [Action.CREATE, Action.READ, Action.UPDATE] },
    { resource: Resource.REPORTS, actions: [Action.READ, Action.UPDATE] },
    { resource: Resource.INCIDENTS, actions: [Action.CREATE, Action.READ, Action.UPDATE] },
    { resource: Resource.PLOTKAART, actions: [Action.READ, Action.UPDATE] },
  ],
  [UserRole.PARTNER_MANAGER]: [
    { resource: Resource.CUSTOMERS, actions: [Action.READ, Action.UPDATE] },
    { resource: Resource.USERS, actions: [Action.READ, Action.UPDATE] },
    { resource: Resource.REPORTS, actions: [Action.READ] },
    { resource: Resource.INCIDENTS, actions: [Action.CREATE, Action.READ, Action.UPDATE] },
    { resource: Resource.PLOTKAART, actions: [Action.READ] },
  ],
  [UserRole.CUSTOMER_ADMIN]: [
    { resource: Resource.USERS, actions: [Action.CREATE, Action.READ, Action.UPDATE] },
    { resource: Resource.REPORTS, actions: [Action.READ] },
    { resource: Resource.INCIDENTS, actions: [Action.CREATE, Action.READ, Action.UPDATE] },
    { resource: Resource.PLOTKAART, actions: [Action.READ, Action.UPDATE] },
  ],
  [UserRole.BHV_COORDINATOR]: [
    { resource: Resource.USERS, actions: [Action.READ, Action.UPDATE] },
    { resource: Resource.INCIDENTS, actions: [Action.CREATE, Action.READ, Action.UPDATE] },
    { resource: Resource.PLOTKAART, actions: [Action.READ] },
  ],
  [UserRole.EMPLOYEE]: [
    { resource: Resource.INCIDENTS, actions: [Action.CREATE, Action.READ] },
    { resource: Resource.PLOTKAART, actions: [Action.READ] },
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
}
