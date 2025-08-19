// Re-export everything from module-definitions
export * from "./module-definitions"

// Additional module-related exports
export { default as CustomerModuleService } from "./customer-modules"
export { default as ModuleNotificationService } from "./module-notifications"
export { default as PricingCalculator } from "./pricing-calculator"

// Type definitions for compatibility
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
  // Additional properties for backward compatibility
  price?: number
  currency?: string
  icon?: string
  color?: string
  tier?: string
  isCore?: boolean
  pricing?: {
    basePrice: number
    perUser?: number
    perBuilding?: number
    setupFee?: number
    freeTrialDays?: number
    model: "fixed" | "per_user" | "per_building" | "hybrid"
  }
}

// Compatibility functions
export function convertModuleDefinitionToModule(def: import("./module-definitions").ModuleDefinition): Module {
  return {
    ...def,
    price: def.pricing.basePrice / 100,
    currency: "EUR",
    icon: "package",
    color: "blue",
    isCore: def.core,
  }
}

export function convertModuleToModuleDefinition(module: Module): import("./module-definitions").ModuleDefinition {
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
