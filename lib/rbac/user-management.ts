import { UserRole } from "./roles"

// Re-export UserRole for convenience
export { UserRole } from "./roles"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  partnerId?: string // Voor partner gebruikers
  customerId?: string // Voor klant gebruikers
  departmentId?: string // Voor organisatie structuur
  isActive: boolean
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
  permissions?: string[] // Extra permissions bovenop rol
  metadata?: {
    phone?: string
    position?: string
    certifications?: string[]
    emergencyContact?: string
    profileImage?: string
  }
}

export interface Partner {
  id: string
  name: string
  domain: string // Voor white-label subdomain
  branding: {
    logo?: string
    primaryColor: string
    secondaryColor: string
    customCss?: string
  }
  settings: {
    allowCustomerSelfRegistration: boolean
    maxCustomers: number
    features: string[]
  }
  contactPerson: {
    name: string
    email: string
    phone: string
  }
  billing: {
    plan: "starter" | "professional" | "enterprise"
    monthlyFee: number
    perUserFee: number
  }
  isActive: boolean
  createdAt: Date
}

export interface Customer {
  id: string
  partnerId?: string // null voor direct klanten
  name: string
  type: "bedrijf" | "overheid" | "zorginstelling" | "onderwijsinstelling" | "non-profit"
  address: {
    street: string
    city: string
    postalCode: string
    country: string
  }
  contactPerson: {
    name: string
    email: string
    phone: string
    position: string
  }
  settings: {
    maxUsers: number
    maxBuildings: number
    features: string[]
    customFields?: Record<string, any>
  }
  billing: {
    plan: "basic" | "professional" | "enterprise"
    monthlyFee: number
    perUserFee: number
  }
  isActive: boolean
  createdAt: Date
}

export class UserManagementService {
  static async createUser(userData: Partial<User>): Promise<User> {
    // Implementatie voor het aanmaken van gebruikers
    const user: User = {
      id: crypto.randomUUID(),
      email: userData.email!,
      name: userData.name!,
      role: userData.role!,
      partnerId: userData.partnerId,
      customerId: userData.customerId,
      departmentId: userData.departmentId,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      permissions: userData.permissions || [],
      metadata: userData.metadata || {},
    }

    // Hier zou je de user opslaan in de database
    console.log("Creating user:", user)
    return user
  }

  static async getUsersByRole(role: UserRole, scopeId?: string): Promise<User[]> {
    // Mock implementatie - in productie zou dit uit database komen
    const mockUsers: User[] = [
      {
        id: "1",
        email: "admin@bhv360.nl",
        name: "BHV360 Admin",
        role: UserRole.SUPER_ADMIN,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "2",
        email: "partner@safetyfirst.nl",
        name: "Safety First Admin",
        role: UserRole.PARTNER_ADMIN,
        partnerId: "partner-1",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    return mockUsers.filter((user) => user.role === role)
  }

  static async assignRole(userId: string, newRole: UserRole, assignedBy: string): Promise<boolean> {
    // Implementatie voor rol toewijzing met audit trail
    console.log(`Assigning role ${newRole} to user ${userId} by ${assignedBy}`)
    return true
  }

  static async getUserHierarchy(userId: string): Promise<User[]> {
    // Geeft alle gebruikers terug die onder deze user vallen
    const user = await this.getUserById(userId)
    if (!user) return []

    // Implementatie afhankelijk van rol
    switch (user.role) {
      case UserRole.SUPER_ADMIN:
        return this.getAllUsers()
      case UserRole.PARTNER_ADMIN:
        return this.getUsersByPartner(user.partnerId!)
      case UserRole.CUSTOMER_ADMIN:
        return this.getUsersByCustomer(user.customerId!)
      default:
        return [user]
    }
  }

  static async getUserById(userId: string): Promise<User | null> {
    // Mock implementatie
    return null
  }

  static async getAllUsers(): Promise<User[]> {
    // Mock implementatie
    return []
  }

  static async getUsersByPartner(partnerId: string): Promise<User[]> {
    // Mock implementatie
    return []
  }

  static async getUsersByCustomer(customerId: string): Promise<User[]> {
    // Mock implementatie
    return []
  }
}
