export type SubscriptionTier = "FREE" | "STARTER" | "PROFESSIONAL" | "ENTERPRISE"

export interface ModulePricing {
  basePrice: number // in cents
  perUser?: number // additional cost per user in cents
  perBuilding?: number // additional cost per building in cents
  setupFee?: number // one-time setup fee in cents
  freeTrialDays?: number
  model: "fixed" | "per_user" | "per_building" | "hybrid"
}

export interface ModuleDefinition {
  id: string
  name: string
  description: string
  category: string
  tier: string
  version: string
  enabled: boolean
  visible: boolean
  core: boolean
  implemented: boolean
  status: "active" | "beta" | "deprecated"
  features: string[]
  pricing: ModulePricing
  rating: number
  reviews: number
  popularity: number
  routePath?: string
  dependencies?: string[]
  customers?: number
  lastUpdated?: string
}

export interface ModuleCategory {
  id: string
  name: string
  description: string
  icon: string
  color: string
}

export interface ModuleTier {
  id: string
  name: string
  description: string
  priceRange: string
  features: string[]
}

export interface ModuleActivationRequest {
  id: string
  moduleId: string
  customerId: string
  customerName: string
  requestedBy: string
  requestedByEmail: string
  requestedAt: Date
  status: "pending" | "approved" | "rejected" | "auto_approved"
  approvedBy?: string
  approvedAt?: Date
  rejectedBy?: string
  rejectedAt?: Date
  rejectionReason?: string
  monthlyCost: number
  yearlyCost: number
}

export const moduleCategories: ModuleCategory[] = [
  {
    id: "core",
    name: "Core Modules",
    description: "Essential BHV functionality",
    icon: "shield",
    color: "blue",
  },
  {
    id: "premium",
    name: "Premium Features",
    description: "Advanced functionality",
    icon: "star",
    color: "purple",
  },
  {
    id: "enterprise",
    name: "Enterprise Solutions",
    description: "Large-scale deployments",
    icon: "building",
    color: "orange",
  },
  {
    id: "addon",
    name: "Add-ons",
    description: "Optional enhancements",
    icon: "plus",
    color: "green",
  },
]

export const tierDefinitions: ModuleTier[] = [
  {
    id: "starter",
    name: "Starter",
    description: "Basic BHV functionality",
    priceRange: "€19-49/maand",
    features: ["Basic plotkaart", "User management", "Incident reporting", "Email support"],
  },
  {
    id: "professional",
    name: "Professional",
    description: "Advanced features for growing teams",
    priceRange: "€49-149/maand",
    features: ["Advanced analytics", "Real-time monitoring", "API access", "Priority support"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Full-featured solution for large organizations",
    priceRange: "€149+/maand",
    features: ["White-label options", "Custom integrations", "Dedicated support", "SLA guarantee"],
  },
  {
    id: "custom",
    name: "Custom",
    description: "Tailored solutions",
    priceRange: "Op maat",
    features: ["Custom development", "On-premise deployment", "24/7 support", "Training included"],
  },
]

export const moduleDefinitions: ModuleDefinition[] = [
  {
    id: "bhv-plotkaart",
    name: "BHV Plotkaart",
    description: "Interactive floor plans with safety equipment locations",
    category: "core",
    tier: "starter",
    version: "2.1.0",
    enabled: true,
    visible: true,
    core: true,
    implemented: true,
    status: "active",
    features: [
      "Interactive floor plans",
      "Safety equipment markers",
      "Evacuation routes",
      "Real-time updates",
      "Mobile responsive",
    ],
    pricing: {
      basePrice: 1900, // €19.00
      model: "fixed",
      freeTrialDays: 14,
    },
    rating: 4.8,
    reviews: 156,
    popularity: 95,
    routePath: "/plotkaart",
    customers: 245,
    lastUpdated: "2024-01-15",
  },
  {
    id: "incident-management",
    name: "Incident Management",
    description: "Complete incident tracking and reporting system",
    category: "core",
    tier: "professional",
    version: "1.8.2",
    enabled: true,
    visible: true,
    core: true,
    implemented: true,
    status: "active",
    features: [
      "Incident reporting",
      "Real-time notifications",
      "Photo attachments",
      "Status tracking",
      "Analytics dashboard",
    ],
    pricing: {
      basePrice: 4900, // €49.00
      perUser: 200, // €2.00 per user
      model: "hybrid",
      setupFee: 9900, // €99.00
      freeTrialDays: 30,
    },
    rating: 4.6,
    reviews: 89,
    popularity: 87,
    routePath: "/incidenten",
    customers: 178,
    lastUpdated: "2024-01-12",
  },
  {
    id: "user-management",
    name: "User Management",
    description: "Advanced user and role management",
    category: "core",
    tier: "starter",
    version: "3.0.1",
    enabled: true,
    visible: true,
    core: true,
    implemented: true,
    status: "active",
    features: ["Role-based access", "User profiles", "Permission management", "Bulk operations", "Activity logging"],
    pricing: {
      basePrice: 2900, // €29.00
      perUser: 150, // €1.50 per user
      model: "hybrid",
    },
    rating: 4.7,
    reviews: 203,
    popularity: 92,
    routePath: "/gebruikers",
    customers: 312,
    lastUpdated: "2024-01-18",
  },
  {
    id: "nfc-integration",
    name: "NFC Integration",
    description: "NFC tag scanning and management",
    category: "premium",
    tier: "professional",
    version: "2.3.0",
    enabled: true,
    visible: true,
    core: false,
    implemented: true,
    status: "active",
    features: [
      "NFC tag scanning",
      "Equipment tracking",
      "Maintenance schedules",
      "Mobile app integration",
      "Bulk tag management",
    ],
    pricing: {
      basePrice: 7900, // €79.00
      perBuilding: 1500, // €15.00 per building
      model: "hybrid",
      setupFee: 19900, // €199.00
    },
    rating: 4.4,
    reviews: 67,
    popularity: 73,
    routePath: "/beheer/nfc-overzicht",
    customers: 89,
    lastUpdated: "2024-01-10",
  },
  {
    id: "advanced-analytics",
    name: "Advanced Analytics",
    description: "Comprehensive reporting and analytics",
    category: "premium",
    tier: "professional",
    version: "1.5.0",
    enabled: true,
    visible: true,
    core: false,
    implemented: true,
    status: "active",
    features: ["Custom dashboards", "Automated reports", "Data visualization", "Export capabilities", "Trend analysis"],
    pricing: {
      basePrice: 9900, // €99.00
      model: "fixed",
      freeTrialDays: 21,
    },
    rating: 4.5,
    reviews: 45,
    popularity: 68,
    routePath: "/beheer/rapportages",
    customers: 134,
    lastUpdated: "2024-01-08",
  },
  {
    id: "white-label",
    name: "White Label Solution",
    description: "Fully customizable branding and interface",
    category: "enterprise",
    tier: "enterprise",
    version: "1.2.0",
    enabled: true,
    visible: true,
    core: false,
    implemented: true,
    status: "active",
    features: ["Custom branding", "Logo integration", "Color schemes", "Custom domains", "Partner portals"],
    pricing: {
      basePrice: 29900, // €299.00
      setupFee: 99900, // €999.00
      model: "fixed",
    },
    rating: 4.9,
    reviews: 23,
    popularity: 45,
    routePath: "/white-label",
    customers: 34,
    lastUpdated: "2024-01-05",
  },
  {
    id: "bhv-coordinator",
    name: "BHV Coordinator Dashboard",
    description: "Centralized dashboard for BHV coordinators",
    category: "core",
    tier: "professional",
    version: "1.4.0",
    enabled: true,
    visible: true,
    core: false,
    implemented: true,
    status: "active",
    features: ["Team overview", "Schedule management", "Training tracking", "Compliance monitoring", "Reporting tools"],
    pricing: {
      basePrice: 3900, // €39.00
      perUser: 100, // €1.00 per user
      model: "hybrid",
    },
    rating: 4.6,
    reviews: 78,
    popularity: 82,
    routePath: "/bhv-coordinator",
    customers: 156,
    lastUpdated: "2024-01-14",
  },
  {
    id: "mobile-app",
    name: "Mobile App Access",
    description: "Native mobile app for iOS and Android",
    category: "premium",
    tier: "professional",
    version: "2.0.3",
    enabled: true,
    visible: true,
    core: false,
    implemented: true,
    status: "active",
    features: [
      "Native iOS/Android apps",
      "Offline functionality",
      "Push notifications",
      "QR code scanning",
      "Emergency alerts",
    ],
    pricing: {
      basePrice: 1900, // €19.00
      perUser: 50, // €0.50 per user
      model: "hybrid",
    },
    rating: 4.7,
    reviews: 234,
    popularity: 89,
    routePath: "/mobile-app",
    customers: 198,
    lastUpdated: "2024-01-16",
  },
]

export const AVAILABLE_MODULES = moduleDefinitions

export function getModuleById(id: string): ModuleDefinition | undefined {
  return moduleDefinitions.find((module) => module.id === id)
}

export function getVisibleModules(): ModuleDefinition[] {
  return moduleDefinitions.filter((module) => module.visible)
}

export function getCoreModules(): ModuleDefinition[] {
  return moduleDefinitions.filter((module) => module.core)
}

export function getModulesByCategory(category: string): ModuleDefinition[] {
  return moduleDefinitions.filter((module) => module.category === category)
}

export function getModulesByTier(tier: string): ModuleDefinition[] {
  return moduleDefinitions.filter((module) => module.tier === tier)
}

export function calculateModulePrice(
  module: ModuleDefinition,
  userCount = 1,
  buildingCount = 1,
): { price: number; model: string; explanation: string } {
  let price = module.pricing.basePrice / 100 // Convert cents to euros

  switch (module.pricing.model) {
    case "per_user":
      price = ((module.pricing.perUser || 0) * userCount) / 100
      return {
        price,
        model: "Per gebruiker",
        explanation: `€${(module.pricing.perUser || 0) / 100} × ${userCount} gebruikers`,
      }

    case "per_building":
      price = ((module.pricing.perBuilding || 0) * buildingCount) / 100
      return {
        price,
        model: "Per gebouw",
        explanation: `€${(module.pricing.perBuilding || 0) / 100} × ${buildingCount} gebouwen`,
      }

    case "hybrid":
      const userCost = ((module.pricing.perUser || 0) * userCount) / 100
      const buildingCost = ((module.pricing.perBuilding || 0) * buildingCount) / 100
      price = price + userCost + buildingCost
      return {
        price,
        model: "Hybride",
        explanation: `€${module.pricing.basePrice / 100} basis + €${userCost} gebruikers + €${buildingCost} gebouwen`,
      }

    case "fixed":
    default:
      return {
        price,
        model: "Vast tarief",
        explanation: `€${price} per maand`,
      }
  }
}

// Additional utility functions
export function getEnabledModules(): ModuleDefinition[] {
  return moduleDefinitions.filter((module) => module.enabled)
}

export function getImplementedModules(): ModuleDefinition[] {
  return moduleDefinitions.filter((module) => module.implemented)
}

export function getModulesByStatus(status: "active" | "beta" | "deprecated"): ModuleDefinition[] {
  return moduleDefinitions.filter((module) => module.status === status)
}

export function getPopularModules(limit = 5): ModuleDefinition[] {
  return moduleDefinitions.sort((a, b) => b.popularity - a.popularity).slice(0, limit)
}

export function getHighRatedModules(minRating = 4.5): ModuleDefinition[] {
  return moduleDefinitions.filter((module) => module.rating >= minRating)
}

export function searchModules(query: string): ModuleDefinition[] {
  const lowercaseQuery = query.toLowerCase()
  return moduleDefinitions.filter(
    (module) =>
      module.name.toLowerCase().includes(lowercaseQuery) ||
      module.description.toLowerCase().includes(lowercaseQuery) ||
      module.features.some((feature) => feature.toLowerCase().includes(lowercaseQuery)),
  )
}

export function getModuleDependencies(moduleId: string): ModuleDefinition[] {
  const module = getModuleById(moduleId)
  if (!module || !module.dependencies) return []

  return module.dependencies
    .map((depId) => getModuleById(depId))
    .filter((dep): dep is ModuleDefinition => dep !== undefined)
}

export function canActivateModule(moduleId: string, activatedModules: string[]): boolean {
  const module = getModuleById(moduleId)
  if (!module) return false

  if (!module.dependencies || module.dependencies.length === 0) return true

  return module.dependencies.every((depId) => activatedModules.includes(depId))
}

export function getModuleActivationCost(moduleId: string, userCount: number, buildingCount: number): number {
  const module = getModuleById(moduleId)
  if (!module) return 0

  const { price } = calculateModulePrice(module, userCount, buildingCount)
  return price
}

export function getModuleSetupCost(moduleId: string): number {
  const module = getModuleById(moduleId)
  if (!module || !module.pricing.setupFee) return 0

  return module.pricing.setupFee / 100 // Convert cents to euros
}

export function hasFreeTrial(moduleId: string): boolean {
  const module = getModuleById(moduleId)
  return !!(module?.pricing.freeTrialDays && module.pricing.freeTrialDays > 0)
}

export function getTrialDays(moduleId: string): number {
  const module = getModuleById(moduleId)
  return module?.pricing.freeTrialDays || 0
}

export function getTotalModuleCost(moduleIds: string[], userCount: number, buildingCount: number): number {
  return moduleIds.reduce((total, moduleId) => {
    return total + getModuleActivationCost(moduleId, userCount, buildingCount)
  }, 0)
}

export function getTotalSetupCost(moduleIds: string[]): number {
  return moduleIds.reduce((total, moduleId) => {
    return total + getModuleSetupCost(moduleId)
  }, 0)
}

export function getModuleStats() {
  return {
    total: moduleDefinitions.length,
    core: getCoreModules().length,
    premium: getModulesByCategory("premium").length,
    enterprise: getModulesByCategory("enterprise").length,
    implemented: getImplementedModules().length,
    active: getModulesByStatus("active").length,
    beta: getModulesByStatus("beta").length,
    averageRating: moduleDefinitions.reduce((sum, m) => sum + m.rating, 0) / moduleDefinitions.length,
    totalCustomers: moduleDefinitions.reduce((sum, m) => sum + (m.customers || 0), 0),
  }
}

// Export all interfaces and types for external use
export type { ModuleDefinition, ModulePricing, ModuleCategory, ModuleTier, ModuleActivationRequest, SubscriptionTier }
