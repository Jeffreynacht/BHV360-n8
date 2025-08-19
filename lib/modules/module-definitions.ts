export interface ModulePricing {
  basePrice: number // in cents
  pricePerUser?: number // in cents
  pricePerBuilding?: number // in cents
  setupFee?: number // in cents
  freeTrialDays?: number
  model: "fixed" | "per-user" | "per-building" | "hybrid"
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
  pricing: ModulePricing
  dependencies?: string[]
  routePath?: string
  implemented: boolean
  rating: number
  reviews: number
  popularity: number
}

export interface ModuleCategory {
  id: string
  name: string
  description: string
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
  status: "pending" | "approved" | "rejected"
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
    id: "basis",
    name: "Basis Modules",
    description: "Essentiële functionaliteiten voor BHV beheer",
  },
  {
    id: "geavanceerd",
    name: "Geavanceerde Modules",
    description: "Uitgebreide functionaliteiten voor professioneel gebruik",
  },
  {
    id: "premium",
    name: "Premium Modules",
    description: "Premium functionaliteiten voor grote organisaties",
  },
  {
    id: "enterprise",
    name: "Enterprise Modules",
    description: "Enterprise-grade functionaliteiten",
  },
]

export const tierDefinitions: ModuleTier[] = [
  {
    id: "starter",
    name: "Starter",
    description: "Voor kleine organisaties",
    priceRange: "€19-49/maand",
    features: ["Basis BHV functionaliteiten", "Tot 25 gebruikers", "E-mail support"],
  },
  {
    id: "professional",
    name: "Professional",
    description: "Voor middelgrote organisaties",
    priceRange: "€49-149/maand",
    features: ["Alle basis functies", "Geavanceerde rapportages", "Priority support", "API toegang"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Voor grote organisaties",
    priceRange: "€149+/maand",
    features: ["Alle functies", "White-label opties", "Dedicated support", "Custom integraties"],
  },
  {
    id: "custom",
    name: "Custom",
    description: "Op maat gemaakte oplossingen",
    priceRange: "Op aanvraag",
    features: ["Volledig aangepast", "Dedicated infrastructuur", "24/7 support"],
  },
]

export const moduleDefinitions: ModuleDefinition[] = [
  {
    id: "bhv-aanwezigheid",
    name: "BHV Aanwezigheid Tracking",
    description: "Real-time tracking van BHV leden en hun beschikbaarheid",
    category: "basis",
    tier: "starter",
    version: "2.1.0",
    enabled: true,
    visible: true,
    core: true,
    status: "active",
    features: [
      "Real-time aanwezigheid tracking",
      "Automatische notificaties",
      "Mobiele app integratie",
      "Rapportage dashboard",
    ],
    pricing: {
      basePrice: 2900, // €29.00
      pricePerUser: 200, // €2.00 per user
      model: "hybrid",
      freeTrialDays: 14,
    },
    implemented: true,
    rating: 4.8,
    reviews: 156,
    popularity: 95,
    routePath: "/bhv-aanwezigheid",
  },
  {
    id: "plotkaart-editor",
    name: "Plotkaart Editor",
    description: "Interactieve editor voor het maken en bewerken van BHV plotkaarten",
    category: "basis",
    tier: "starter",
    version: "3.0.1",
    enabled: true,
    visible: true,
    core: true,
    status: "active",
    features: [
      "Drag & drop interface",
      "Symbolen bibliotheek",
      "PDF export",
      "Versie beheer",
      "Collaboratief bewerken",
    ],
    pricing: {
      basePrice: 1900, // €19.00
      pricePerBuilding: 500, // €5.00 per building
      model: "hybrid",
      freeTrialDays: 14,
    },
    implemented: true,
    rating: 4.9,
    reviews: 203,
    popularity: 98,
    routePath: "/bhv/editor",
  },
  {
    id: "incident-management",
    name: "Incident Management",
    description: "Uitgebreid systeem voor het beheren van incidenten en noodsituaties",
    category: "geavanceerd",
    tier: "professional",
    version: "1.8.2",
    enabled: true,
    visible: true,
    core: false,
    status: "active",
    features: [
      "Incident registratie",
      "Workflow management",
      "Real-time communicatie",
      "Rapportage en analyse",
      "Integratie met alarmsystemen",
    ],
    pricing: {
      basePrice: 4900, // €49.00
      pricePerUser: 300, // €3.00 per user
      model: "hybrid",
      setupFee: 9900, // €99.00
    },
    implemented: true,
    rating: 4.7,
    reviews: 89,
    popularity: 87,
    routePath: "/incidenten",
  },
  {
    id: "nfc-integratie",
    name: "NFC Tag Integratie",
    description: "NFC tags voor rondes, controles en snelle toegang tot informatie",
    category: "geavanceerd",
    tier: "professional",
    version: "2.3.0",
    enabled: true,
    visible: true,
    core: false,
    status: "active",
    features: ["NFC tag programmering", "Ronde registratie", "Controle checklists", "Mobiele app integratie"],
    pricing: {
      basePrice: 3900, // €39.00
      pricePerBuilding: 1000, // €10.00 per building
      model: "hybrid",
    },
    implemented: true,
    rating: 4.6,
    reviews: 67,
    popularity: 78,
    routePath: "/beheer/nfc-tags",
  },
  {
    id: "rapportage-dashboard",
    name: "Geavanceerde Rapportages",
    description: "Uitgebreide rapportage en analytics voor BHV activiteiten",
    category: "geavanceerd",
    tier: "professional",
    version: "1.5.1",
    enabled: true,
    visible: true,
    core: false,
    status: "active",
    features: ["Custom dashboards", "Geautomatiseerde rapporten", "Data export", "Trend analyse", "KPI monitoring"],
    pricing: {
      basePrice: 5900, // €59.00
      model: "fixed",
    },
    implemented: true,
    rating: 4.5,
    reviews: 45,
    popularity: 72,
    routePath: "/beheer/rapportages",
  },
  {
    id: "white-label",
    name: "White Label Platform",
    description: "Volledig aanpasbare white-label oplossing voor partners",
    category: "enterprise",
    tier: "enterprise",
    version: "1.2.0",
    enabled: true,
    visible: true,
    core: false,
    status: "active",
    features: ["Custom branding", "Partner portaal", "Multi-tenant architectuur", "API toegang", "Dedicated support"],
    pricing: {
      basePrice: 19900, // €199.00
      pricePerUser: 500, // €5.00 per user
      model: "hybrid",
      setupFee: 49900, // €499.00
    },
    implemented: true,
    rating: 4.8,
    reviews: 23,
    popularity: 65,
    routePath: "/white-label",
  },
]

export const AVAILABLE_MODULES = moduleDefinitions

export function getModuleById(id: string): ModuleDefinition | undefined {
  return moduleDefinitions.find((module) => module.id === id)
}

export function getVisibleModules(): ModuleDefinition[] {
  return moduleDefinitions.filter((module) => module.visible)
}

export function calculateModulePrice(module: ModuleDefinition, userCount: number, buildingCount: number) {
  const { pricing } = module
  let totalPrice = pricing.basePrice / 100 // Convert cents to euros

  if (pricing.model === "per-user" && pricing.pricePerUser) {
    totalPrice = (pricing.pricePerUser * userCount) / 100
  } else if (pricing.model === "per-building" && pricing.pricePerBuilding) {
    totalPrice = (pricing.pricePerBuilding * buildingCount) / 100
  } else if (pricing.model === "hybrid") {
    if (pricing.pricePerUser) {
      totalPrice += (pricing.pricePerUser * userCount) / 100
    }
    if (pricing.pricePerBuilding) {
      totalPrice += (pricing.pricePerBuilding * buildingCount) / 100
    }
  }

  let explanation = ""
  switch (pricing.model) {
    case "fixed":
      explanation = "Vaste maandelijkse prijs"
      break
    case "per-user":
      explanation = `€${(pricing.pricePerUser! / 100).toFixed(2)} per gebruiker`
      break
    case "per-building":
      explanation = `€${(pricing.pricePerBuilding! / 100).toFixed(2)} per gebouw`
      break
    case "hybrid":
      explanation = `Basis €${(pricing.basePrice / 100).toFixed(2)}`
      if (pricing.pricePerUser) {
        explanation += ` + €${(pricing.pricePerUser / 100).toFixed(2)}/gebruiker`
      }
      if (pricing.pricePerBuilding) {
        explanation += ` + €${(pricing.pricePerBuilding / 100).toFixed(2)}/gebouw`
      }
      break
  }

  return {
    price: totalPrice,
    model: pricing.model,
    explanation,
  }
}
