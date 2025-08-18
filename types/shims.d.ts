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
  active?: boolean
  address?: string
  email?: string
  phone?: string
  contactPerson?: string
  logo?: string
  users?: any[]
  buildings?: any[]
  createdAt?: string
  userCount?: number
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
  id: ModuleTierId
  name: string
  description?: string
  priceRange?: string
  features?: string[]
}

type ModuleCategoryId = "basis" | "geavanceerd" | "premium" | "enterprise"

interface ModuleCategory {
  id: ModuleCategoryId
  name: string
  description?: string
}

type PricingModel = "fixed" | "per_user" | "per_building" | "per_customer"

interface ModulePricing {
  type?: PricingModel
  model: PricingModel
  basePrice: number
  setupFee?: number
  freeTrialDays?: number
  tierMultipliers?: Partial<Record<ModuleTierId, number>>
  tierPricing?: Array<{
    minUsers: number
    maxUsers?: number
    pricePerUser: number
  }>
}

interface ModuleDefinition {
  id: string
  name: string
  title?: string
  description?: string
  category: ModuleCategoryId | ModuleCategory
  tier?: ModuleTierId | ModuleTier
  pricing: ModulePricing
  pricingModel?: string
  status?: "beta" | "ga" | "internal"
  implemented?: boolean
  visible?: boolean
  enabled?: boolean
  routePath?: string
  features?: string[]
  rating?: number
  reviews?: number
  popularity?: number
  version?: string
  core?: boolean
}

// Alias for compatibility
type ModuleDef = ModuleDefinition
type Module = ModuleDefinition

interface ModuleActivationRequest {
  moduleId: string
  monthlyCost?: number
  yearlyCost?: number
  status: "pending" | "approved" | "rejected"
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
