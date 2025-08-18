// Globale shims om build te unblokken. Later verfijnen.

declare module "web-push"

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
  model: PricingModel
  basePrice: number
  setupFee?: number
  freeTrialDays?: number
  tierMultipliers?: Partial<Record<ModuleTierId, number>>
}

interface ModuleDef {
  id: string
  title: string
  description?: string
  category: ModuleCategoryId | ModuleCategory
  tier?: ModuleTierId | ModuleTier
  pricing: ModulePricing | number // sommige code leest .price direct
  status?: "beta" | "ga" | "internal"
  implemented?: boolean
  routePath?: string
  features?: string[]
  rating?: number
  reviews?: number
  popularity?: number
  version?: string
  core?: boolean // i.p.v. isCore
}

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
