// Barrel export for modules
export * from "./module-definitions"
export * from "./customer-modules"
export * from "./module-notifications"
export * from "./pricing-calculator"

// Re-export commonly used types
export type {
  ModuleDef,
  ModuleTier,
  ModuleCategory,
  ModulePricing,
  ModuleActivationRequest,
} from "@/types/shims"
