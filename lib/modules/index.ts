// Barrel file for clean imports
export * from "./module-definitions"
export * from "./customer-modules"
export * from "./module-notifications"
export * from "./pricing-calculator"

// Re-export commonly used functions for convenience
export {
  getModuleById,
  getCoreModules,
  getVisibleModules,
  getModulesByCategory,
  getModulesByTier,
  calculateModulePrice,
  getEnabledModules,
  getImplementedModules,
  getModulesByStatus,
  getPopularModules,
  getHighRatedModules,
  searchModules,
  canActivateModule,
  getModuleActivationCost,
  getModuleSetupCost,
  hasFreeTrial,
  getTrialDays,
  getTotalModuleCost,
  getTotalSetupCost,
  getModuleStats,
  moduleDefinitions,
  moduleCategories,
  tierDefinitions,
  AVAILABLE_MODULES,
} from "./module-definitions"

// Legacy compatibility
export type { Module } from "./customer-modules"
