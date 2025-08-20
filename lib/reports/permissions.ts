export interface UserRole {
  id: string
  name: string
  permissions: Permission[]
}

export interface Permission {
  resource: string
  actions: string[]
}

export interface User {
  id: string
  name: string
  email: string
  roles: string[]
  customerId: string
}

export class ReportPermissionService {
  private roles: UserRole[] = [
    {
      id: "admin",
      name: "Administrator",
      permissions: [
        { resource: "reports", actions: ["create", "read", "update", "delete", "export", "schedule"] },
        { resource: "users", actions: ["create", "read", "update", "delete"] },
        { resource: "customers", actions: ["create", "read", "update", "delete"] },
      ],
    },
    {
      id: "manager",
      name: "Manager",
      permissions: [
        { resource: "reports", actions: ["create", "read", "export", "schedule"] },
        { resource: "users", actions: ["read"] },
      ],
    },
    {
      id: "coordinator",
      name: "BHV Coördinator",
      permissions: [
        { resource: "reports", actions: ["create", "read", "export"] },
        { resource: "bhv", actions: ["create", "read", "update"] },
      ],
    },
    {
      id: "viewer",
      name: "Viewer",
      permissions: [{ resource: "reports", actions: ["read"] }],
    },
  ]

  canUserAccessReport(user: User, reportType: string, action: string): boolean {
    // Admin can do everything
    if (user.roles.includes("admin")) {
      return true
    }

    // Check specific permissions
    for (const roleId of user.roles) {
      const role = this.roles.find((r) => r.id === roleId)
      if (role) {
        const permission = role.permissions.find((p) => p.resource === "reports")
        if (permission && permission.actions.includes(action)) {
          return true
        }
      }
    }

    return false
  }

  getAvailableReportTypes(user: User): string[] {
    if (user.roles.includes("admin")) {
      return ["bhv", "incidents", "facilities", "users", "compliance", "training"]
    }

    if (user.roles.includes("manager")) {
      return ["bhv", "incidents", "facilities", "compliance"]
    }

    if (user.roles.includes("coordinator")) {
      return ["bhv", "incidents"]
    }

    return ["bhv"] // Default for viewers
  }

  canScheduleReports(user: User): boolean {
    return this.canUserAccessReport(user, "any", "schedule")
  }

  canExportReports(user: User): boolean {
    return this.canUserAccessReport(user, "any", "export")
  }

  canViewCustomerData(user: User, customerId: string): boolean {
    // Users can only view data for their own customer
    return user.customerId === customerId || user.roles.includes("admin")
  }

  filterReportDataByPermissions(user: User, data: any): any {
    if (user.roles.includes("admin")) {
      return data // Admin sees everything
    }

    // Filter sensitive data for non-admin users
    const filteredData = { ...data }

    if (!user.roles.includes("manager")) {
      // Remove sensitive user information for non-managers
      if (filteredData.users) {
        filteredData.users = filteredData.users.map((u: any) => ({
          ...u,
          email: undefined,
          phone: undefined,
          address: undefined,
        }))
      }
    }

    return filteredData
  }
}

export const reportPermissionService = new ReportPermissionService()
