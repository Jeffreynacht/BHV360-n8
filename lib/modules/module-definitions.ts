export interface Module {
  id: string
  name: string
  description: string
  category: "core" | "premium" | "enterprise" | "addon"
  price: number
  currency: string
  features: string[]
  icon: string
  color: string
  popular: boolean
  active: boolean
  dependencies?: string[]
  version: string
  lastUpdated: Date
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
  status: "active" | "beta" | "deprecated"
  features: string[]
  pricing: {
    basePrice: number
    setupFee?: number
    freeTrialDays?: number
  }
  rating: number
  reviews: number
  popularity: number
  implemented: boolean
  routePath?: string
}

export interface ModuleTier {
  id: string
  name: string
  description: string
  priceRange: string
  features: string[]
}

export interface ModuleCategory {
  id: string
  name: string
  description: string
  icon: string
  color: string
}

export interface ModulePricing {
  basePrice: number
  setupFee?: number
  monthlyFee?: number
  yearlyDiscount?: number
  freeTrialDays?: number
}

export interface ModuleActivationRequest {
  id: string
  customerId: string
  moduleId: string
  requestedBy: string
  requestedAt: Date
  status: "pending" | "approved" | "rejected"
  approvedBy?: string
  approvedAt?: Date
  rejectedBy?: string
  rejectedAt?: Date
  rejectionReason?: string
  notes?: string
  pricing: ModulePricing
}

const modules: Module[] = [
  {
    id: "bhv-dashboard",
    name: "BHV Dashboard",
    description: "Complete BHV administratie met certificering tracking",
    category: "core",
    price: 39,
    currency: "EUR",
    features: [
      "Team overzicht",
      "Certificaat tracking",
      "Competentie matrix",
      "Rooster planning",
      "Rapportage dashboard",
    ],
    icon: "shield",
    color: "#2563eb",
    popular: true,
    active: true,
    version: "2.1.0",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "plotkaart-editor",
    name: "Interactieve Plotkaarten",
    description: "Digitale plattegronden met real-time status",
    category: "core",
    price: 29,
    currency: "EUR",
    features: [
      "Drag & drop editor",
      "Veiligheidsiconen bibliotheek",
      "Real-time updates",
      "PDF export",
      "Multi-verdieping support",
    ],
    icon: "map",
    color: "#16a34a",
    popular: true,
    active: true,
    version: "1.8.2",
    lastUpdated: new Date("2024-01-10"),
  },
  {
    id: "incident-management",
    name: "Incident Management",
    description: "Snelle incident registratie met workflows",
    category: "premium",
    price: 49,
    currency: "EUR",
    features: [
      "Real-time incident logging",
      "Automatische workflows",
      "Escalatie procedures",
      "Rapportage & analytics",
      "Mobile incident app",
    ],
    icon: "alert-triangle",
    color: "#dc2626",
    popular: true,
    active: true,
    version: "3.0.1",
    lastUpdated: new Date("2024-01-12"),
  },
  {
    id: "visitor-registration",
    name: "Bezoeker Registratie",
    description: "Professionele bezoeker check-in systeem",
    category: "premium",
    price: 35,
    currency: "EUR",
    features: [
      "QR code check-in",
      "Badge printing",
      "Aanwezigheidsoverzicht",
      "Evacuatie lijsten",
      "Contractor management",
    ],
    icon: "users",
    color: "#7c3aed",
    popular: false,
    active: true,
    version: "1.5.0",
    lastUpdated: new Date("2024-01-08"),
  },
  {
    id: "analytics-reporting",
    name: "Analytics & Rapportage",
    description: "Uitgebreide analytics en compliance rapportage",
    category: "premium",
    price: 25,
    currency: "EUR",
    features: ["Custom dashboards", "Compliance rapportage", "Trend analyse", "Automated reports", "Data export"],
    icon: "bar-chart",
    color: "#ea580c",
    popular: false,
    active: true,
    version: "2.3.1",
    lastUpdated: new Date("2024-01-14"),
  },
  {
    id: "mobile-app",
    name: "Mobiele App",
    description: "Complete mobiele toegang voor BHV'ers",
    category: "addon",
    price: 19,
    currency: "EUR",
    features: [
      "iOS & Android app",
      "Offline functionaliteit",
      "Push notificaties",
      "QR code scanner",
      "Emergency button",
    ],
    icon: "smartphone",
    color: "#4f46e5",
    popular: false,
    active: true,
    version: "1.2.3",
    lastUpdated: new Date("2024-01-11"),
  },
  {
    id: "advanced-notifications",
    name: "Geavanceerde Notificaties",
    description: "Multi-channel notificatie systeem",
    category: "enterprise",
    price: 59,
    currency: "EUR",
    features: ["SMS notificaties", "Email campaigns", "Push notifications", "Voice calls", "Escalation chains"],
    icon: "bell",
    color: "#059669",
    popular: false,
    active: true,
    version: "1.0.5",
    lastUpdated: new Date("2024-01-09"),
  },
  {
    id: "api-integrations",
    name: "API Integraties",
    description: "Koppeling met externe systemen",
    category: "enterprise",
    price: 79,
    currency: "EUR",
    features: ["REST API access", "Webhook support", "Third-party integrations", "Custom connectors", "Real-time sync"],
    icon: "link",
    color: "#0891b2",
    popular: false,
    active: true,
    version: "2.0.0",
    lastUpdated: new Date("2024-01-13"),
  },
]

export const AVAILABLE_MODULES: ModuleDefinition[] = [
  {
    id: "bhv-aanwezigheid",
    name: "BHV Aanwezigheid",
    description: "Real-time tracking van BHV leden",
    category: "basis",
    tier: "starter",
    version: "2.1.0",
    enabled: true,
    visible: true,
    core: true,
    status: "active",
    features: ["Real-time tracking", "Status updates", "Locatie monitoring"],
    pricing: { basePrice: 2900, freeTrialDays: 14 },
    rating: 4.8,
    reviews: 45,
    popularity: 85,
    implemented: true,
    routePath: "/bhv-aanwezigheid",
  },
  {
    id: "incident-management",
    name: "Incident Management",
    description: "Uitgebreid incident beheer systeem",
    category: "geavanceerd",
    tier: "professional",
    version: "1.8.2",
    enabled: true,
    visible: true,
    core: false,
    status: "active",
    features: ["Incident tracking", "Rapportage", "Workflow management"],
    pricing: { basePrice: 4900, setupFee: 5000 },
    rating: 4.6,
    reviews: 32,
    popularity: 78,
    implemented: true,
    routePath: "/incidenten",
  },
  {
    id: "plotkaart-editor",
    name: "Plotkaart Editor",
    description: "Interactieve plattegrond editor",
    category: "basis",
    tier: "starter",
    version: "1.5.0",
    enabled: true,
    visible: true,
    core: true,
    status: "active",
    features: ["Drag & drop", "Veiligheidsiconen", "PDF export"],
    pricing: { basePrice: 1900 },
    rating: 4.7,
    reviews: 28,
    popularity: 92,
    implemented: true,
    routePath: "/plotkaart",
  },
  {
    id: "visitor-registration",
    name: "Bezoeker Registratie",
    description: "Professionele bezoeker check-in",
    category: "uitgebreid",
    tier: "professional",
    version: "2.0.1",
    enabled: true,
    visible: true,
    core: false,
    status: "active",
    features: ["QR check-in", "Badge printing", "Evacuatie lijsten"],
    pricing: { basePrice: 3500, setupFee: 2500 },
    rating: 4.5,
    reviews: 19,
    popularity: 67,
    implemented: true,
    routePath: "/visitor-registration",
  },
]

export const tierDefinitions: ModuleTier[] = [
  {
    id: "starter",
    name: "Starter",
    description: "Basis functionaliteiten voor kleine organisaties",
    priceRange: "€29-99/maand",
    features: ["Basis BHV functies", "Tot 25 gebruikers", "E-mail support"],
  },
  {
    id: "professional",
    name: "Professional",
    description: "Uitgebreide functies voor middelgrote organisaties",
    priceRange: "€99-299/maand",
    features: ["Alle basis functies", "Tot 100 gebruikers", "Geavanceerde rapportage", "Priority support"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Complete oplossing voor grote organisaties",
    priceRange: "€299+/maand",
    features: ["Alle functies", "Onbeperkt gebruikers", "Custom integraties", "24/7 support"],
  },
]

// Required named exports
export const moduleDefinitions = modules
export const moduleCategories: ModuleCategory[] = [
  {
    id: "core",
    name: "Basis Modules",
    description: "Essentiële functionaliteiten voor elke organisatie",
    icon: "shield",
    color: "#2563eb",
  },
  {
    id: "premium",
    name: "Premium Modules",
    description: "Geavanceerde functies voor professioneel gebruik",
    icon: "star",
    color: "#7c3aed",
  },
  {
    id: "enterprise",
    name: "Enterprise Modules",
    description: "Complete oplossingen voor grote organisaties",
    icon: "building",
    color: "#059669",
  },
  {
    id: "addon",
    name: "Add-on Modules",
    description: "Aanvullende functionaliteiten en integraties",
    icon: "puzzle",
    color: "#ea580c",
  },
]

export function getModuleById(id: string): Module | undefined {
  return modules.find((module) => module.id === id)
}

export function getCoreModules(): Module[] {
  return modules.filter((module) => module.category === "core")
}

export function getModulesByCategory(category: Module["category"]): Module[] {
  return modules.filter((module) => module.category === category)
}

export function getPopularModules(): Module[] {
  return modules.filter((module) => module.popular)
}

export function getActiveModules(): Module[] {
  return modules.filter((module) => module.active)
}

export function getAllModules(): Module[] {
  return [...modules]
}

export function getModulePrice(id: string): number {
  const module = getModuleById(id)
  return module ? module.price : 0
}

export function calculateTotalPrice(moduleIds: string[]): number {
  return moduleIds.reduce((total, id) => {
    const module = getModuleById(id)
    return total + (module ? module.price : 0)
  }, 0)
}

export function getModuleDependencies(id: string): Module[] {
  const module = getModuleById(id)
  if (!module || !module.dependencies) return []

  return module.dependencies.map((depId) => getModuleById(depId)).filter((dep): dep is Module => dep !== undefined)
}

export function validateModuleCompatibility(moduleIds: string[]): { valid: boolean; missing: string[] } {
  const missing: string[] = []

  for (const id of moduleIds) {
    const module = getModuleById(id)
    if (module && module.dependencies) {
      for (const depId of module.dependencies) {
        if (!moduleIds.includes(depId)) {
          missing.push(depId)
        }
      }
    }
  }

  return {
    valid: missing.length === 0,
    missing: [...new Set(missing)],
  }
}

export function getModuleDefinitionById(id: string): ModuleDefinition | undefined {
  return AVAILABLE_MODULES.find((module) => module.id === id)
}

export function getVisibleModules(): ModuleDefinition[] {
  return AVAILABLE_MODULES.filter((module) => module.visible)
}

export function calculateModulePrice(module: ModuleDefinition, userCount: number, buildingCount: number) {
  const basePrice = module.pricing.basePrice / 100
  return {
    price: basePrice,
    model: "Per maand",
    explanation: `€${basePrice.toFixed(2)} per maand voor ${userCount} gebruikers`,
  }
}

export default modules
