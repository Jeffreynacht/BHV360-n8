// Global type shims to unblock build. Refine later.

declare module "web-push" {
  export function setVapidDetails(subject: string, publicKey: string, privateKey: string): void
  export function sendNotification(subscription: any, payload: string, options?: any): Promise<any>
}

declare module "jsonwebtoken" {
  export function sign(payload: any, secret: string, options?: any): string
  export function verify(token: string, secret: string, options?: any): any
}

type UUID = string

interface Customer {
  id: UUID
  name: string
  contactPerson: string
  email: string
  phone: string
  address: string
  logo?: string
  active: boolean
  createdAt: string
  userCount: number
  buildings: number
  users: number
}

declare const UserRole: {
  readonly CUSTOMER_OWNER: "CUSTOMER_OWNER"
  readonly CUSTOMER_MANAGER: "CUSTOMER_MANAGER"
  readonly BHV_PLOEGLEIDER: "BHV_PLOEGLEIDER"
  readonly BHV_MEMBER: "BHV_MEMBER"
  readonly EHBO_MEMBER: "EHBO_MEMBER"
  readonly ONTRUIMER: "ONTRUIMER"
  readonly VISITOR: "VISITOR"
}

type ModuleTierId = "starter" | "professional" | "enterprise" | "custom"

interface ModuleTier {
  id: string
  name: string
  description: string
}

type ModuleCategoryId = "basis" | "geavanceerd" | "premium" | "enterprise"

interface ModuleCategory {
  id: string
  name: string
  description: string
}

type PricingModel = "fixed" | "per_user" | "per_building" | "per_customer"

interface ModulePricing {
  type: PricingModel
  basePrice: number
  setupFee?: number
  freeTrialDays?: number
  tierPricing?: { minUsers: number; maxUsers?: number; pricePerUser: number }[]
}

interface ModuleDefinition {
  id: string
  name: string
  description: string
  category: string
  tier: string
  features: string[]
  pricingModel: string
  pricing: ModulePricing
  status: "live" | "beta" | "dev"
  rating: number
  reviews: number
  popularity: number
  version: string
  visible: boolean
  enabled: boolean
  implemented: boolean
}

// Alias for compatibility
type ModuleDef = ModuleDefinition
type Module = ModuleDefinition

interface ModuleActivationRequest {
  id: string
  moduleId: string
  customerName: string
  requestedBy: string
  requestedByEmail: string
  requestedAt: Date
  approvedBy?: string
  approvedAt?: Date
  rejectedBy?: string
  rejectedAt?: Date
  rejectionReason?: string
  status: "pending" | "approved" | "rejected" | "auto_approved"
  monthlyCost: number
  yearlyCost: number
}

type DeepInspectionStatus = "warning" | "pass" | "fail"
interface DeepInspectionReport {
  score?: number
  criticalIssues?: any[]
  components?: any[]
}

type SkillLevel = 1 | 2 | 3 | 4 | 5

// Global declarations for common patterns
declare global {
  interface Window {
    gtag?: (...args: any[]) => void
  }
}

export {}
