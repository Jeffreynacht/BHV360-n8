// Barrel export for modules
export * from "./module-definitions"
export * from "./customer-modules"
export * from "./module-notifications"
export * from "./pricing-calculator"

// Re-export commonly used types and interfaces
import type { ModuleDefinition, ModulePricing } from "./module-definitions"

// Re-export services
export { CustomerModuleService, ModuleAuditService } from "./customer-modules"
export { ModuleNotificationService } from "./module-notifications"
export { PricingCalculator } from "./pricing-calculator"

// Compatibility layer for legacy Module interface
export interface Module {
  id: string
  name: string
  description: string
  category: string
  version: string
  enabled: boolean
  visible: boolean
  core?: boolean
  implemented: boolean
  status: "active" | "beta" | "deprecated"
  features: string[]
  rating: number
  reviews: number
  popularity: number
  routePath?: string
  dependencies?: string[]
  customers?: number
  lastUpdated?: string
  // Legacy properties
  price?: number
  currency?: string
  icon?: string
  color?: string
  tier?: string
  isCore?: boolean
  pricing?: ModulePricing
}

// Conversion utilities
export function convertModuleDefinitionToModule(def: ModuleDefinition): Module {
  return {
    ...def,
    price: def.pricing.basePrice / 100,
    currency: "EUR",
    icon: "package",
    color: "blue",
    isCore: def.core,
    pricing: def.pricing,
  }
}

export function convertModuleToModuleDefinition(module: Module): ModuleDefinition {
  return {
    id: module.id,
    name: module.name,
    description: module.description,
    category: module.category,
    tier: module.tier || "starter",
    version: module.version,
    enabled: module.enabled,
    visible: module.visible,
    core: module.core || module.isCore || false,
    implemented: module.implemented,
    status: module.status,
    features: module.features,
    pricing: module.pricing || {
      basePrice: (module.price || 0) * 100,
      model: "fixed",
    },
    rating: module.rating,
    reviews: module.reviews,
    popularity: module.popularity,
    routePath: module.routePath,
    dependencies: module.dependencies,
    customers: module.customers,
    lastUpdated: module.lastUpdated,
  }
}
