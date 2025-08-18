export interface ModuleTier {
  id: string
  name: string
  description: string
  priceRange?: string
}

export interface ModuleCategory {
  id: string
  name: string
  description: string
}

export interface ModulePricing {
  model: "per_user" | "per_building" | "per_customer" | "fixed"
  basePrice: number
  setupFee?: number
  freeTrialDays?: number
  tierPricing?: { minUsers: number; maxUsers?: number; pricePerUser: number }[]
}

export interface ModuleDefinition {
  id: string
  name: string
  title: string
  description: string
  category: string
  tier: string
  features: string[]
  pricingModel: string
  pricing: ModulePricing
  status?: "ga" | "beta" | "dev"
  rating: number
  reviews: number
  popularity: number
  version: string
  visible: boolean
  enabled: boolean
  implemented: boolean
  routePath?: string
  core?: boolean
}

export const tierDefinitions: ModuleTier[] = [
  {
    id: "starter",
    name: "Starter",
    description: "Voor kleine organisaties",
    priceRange: "€0-50/maand",
  },
  {
    id: "professional",
    name: "Professional",
    description: "Voor middelgrote bedrijven",
    priceRange: "€50-200/maand",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Voor grote organisaties",
    priceRange: "€200+/maand",
  },
  {
    id: "custom",
    name: "Custom",
    description: "Op maat gemaakte oplossingen",
    priceRange: "Op aanvraag",
  },
]

export const moduleCategories: ModuleCategory[] = [
  {
    id: "basis",
    name: "Basis",
    description: "Essentiële BHV functionaliteiten",
  },
  {
    id: "geavanceerd",
    name: "Geavanceerd",
    description: "Uitgebreide BHV tools en rapportages",
  },
  {
    id: "premium",
    name: "Premium",
    description: "Professionele BHV oplossingen",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Enterprise-grade BHV management",
  },
]

export const moduleDefinitions: ModuleDefinition[] = [
  {
    id: "plotkaart",
    name: "BHV Plotkaart",
    title: "BHV Plotkaart",
    description: "Interactieve plotkaart voor BHV procedures en evacuatieroutes",
    category: "basis",
    tier: "starter",
    pricing: {
      model: "fixed",
      basePrice: 2900, // €29.00
      setupFee: 5000, // €50.00
      freeTrialDays: 14,
    },
    pricingModel: "Vaste prijs per organisatie",
    implemented: true,
    visible: true,
    enabled: true,
    routePath: "/bhv/plotkaart",
    core: true,
    features: ["Interactieve editor", "PDF export", "Evacuatieroutes", "Voorzieningen beheer"],
    rating: 4.8,
    reviews: 156,
    popularity: 95,
    version: "2.1.0",
    status: "ga",
  },
  {
    id: "incidenten",
    name: "Incident Management",
    title: "Incident Management",
    description: "Registratie en opvolging van BHV incidenten",
    category: "basis",
    tier: "starter",
    pricing: {
      model: "per_user",
      basePrice: 150, // €1.50 per user
      setupFee: 2500, // €25.00
      freeTrialDays: 30,
      tierPricing: [
        { minUsers: 1, maxUsers: 10, pricePerUser: 150 },
        { minUsers: 11, maxUsers: 50, pricePerUser: 125 },
        { minUsers: 51, pricePerUser: 100 },
      ],
    },
    pricingModel: "Per gebruiker per maand",
    implemented: true,
    visible: true,
    enabled: true,
    routePath: "/incidenten",
    core: true,
    features: ["Incident registratie", "Workflow management", "Rapportages", "Notificaties"],
    rating: 4.6,
    reviews: 89,
    popularity: 78,
    version: "1.8.2",
  },
  {
    id: "voorzieningen",
    name: "Voorzieningen Beheer",
    title: "Voorzieningen Beheer",
    description: "Beheer van brandblussers, AED's en andere veiligheidsvoorzieningen",
    category: "geavanceerd",
    tier: "professional",
    pricing: {
      model: "per_building",
      basePrice: 1500, // €15.00 per building
      setupFee: 7500, // €75.00
      freeTrialDays: 21,
    },
    pricingModel: "Per gebouw per maand",
    implemented: true,
    visible: true,
    enabled: true,
    routePath: "/beheer/voorzieningen",
    features: ["Voorzieningen database", "Onderhoudsplanning", "QR codes", "Inspectierapporten"],
    rating: 4.7,
    reviews: 124,
    popularity: 82,
    version: "1.5.1",
  },
  {
    id: "gebruikers",
    name: "Gebruikers Management",
    title: "Gebruikers Management",
    description: "Beheer van BHV medewerkers en hun certificeringen",
    category: "basis",
    tier: "starter",
    pricing: {
      model: "per_user",
      basePrice: 200, // €2.00 per user
      setupFee: 3000, // €30.00
      freeTrialDays: 14,
    },
    pricingModel: "Per gebruiker per maand",
    implemented: true,
    visible: true,
    enabled: true,
    routePath: "/beheer/gebruikers",
    core: true,
    features: ["Gebruikersbeheer", "Rollen & rechten", "Certificering tracking", "Training planning"],
    rating: 4.5,
    reviews: 203,
    popularity: 88,
    version: "2.0.3",
  },
  {
    id: "rapportages",
    name: "Rapportages & Analytics",
    title: "Rapportages & Analytics",
    description: "Uitgebreide rapportages en analyses van BHV activiteiten",
    category: "premium",
    tier: "professional",
    pricing: {
      model: "per_customer",
      basePrice: 4900, // €49.00 per organization
      setupFee: 15000, // €150.00
      freeTrialDays: 30,
    },
    pricingModel: "Per organisatie per maand",
    implemented: true,
    visible: true,
    enabled: true,
    routePath: "/beheer/rapportages",
    features: ["Dashboard analytics", "Custom rapporten", "Data export", "Trend analyse"],
    rating: 4.9,
    reviews: 67,
    popularity: 71,
    version: "1.3.0",
  },
  {
    id: "mobile-app",
    name: "Mobile App",
    title: "BHV360 Mobile App",
    description: "Mobiele app voor BHV medewerkers in het veld",
    category: "premium",
    tier: "professional",
    pricing: {
      model: "per_user",
      basePrice: 300, // €3.00 per user
      setupFee: 10000, // €100.00
      freeTrialDays: 30,
    },
    pricingModel: "Per gebruiker per maand",
    implemented: false,
    visible: true,
    enabled: true,
    routePath: "/mobile-app",
    features: ["Offline functionaliteit", "Push notificaties", "QR scanner", "GPS tracking"],
    rating: 4.4,
    reviews: 45,
    popularity: 65,
    version: "0.9.0",
    status: "beta",
  },
  {
    id: "api-integraties",
    name: "API Integraties",
    title: "API Integraties",
    description: "Integraties met externe systemen en API toegang",
    category: "enterprise",
    tier: "enterprise",
    pricing: {
      model: "per_customer",
      basePrice: 9900, // €99.00 per organization
      setupFee: 25000, // €250.00
      freeTrialDays: 14,
    },
    pricingModel: "Per organisatie per maand",
    implemented: true,
    visible: true,
    enabled: true,
    routePath: "/beheer/api-integraties",
    features: ["REST API", "Webhooks", "SSO integratie", "Custom connectors"],
    rating: 4.3,
    reviews: 28,
    popularity: 45,
    version: "1.1.0",
  },
]

// Required exports for compatibility
export const AVAILABLE_MODULES = moduleDefinitions

export function getModuleById(id: string): ModuleDefinition | null {
  return moduleDefinitions.find((m) => m.id === id) || null
}

export function getCoreModules(): ModuleDefinition[] {
  return moduleDefinitions.filter((m) => m.core)
}

export function getVisibleModules(): ModuleDefinition[] {
  return moduleDefinitions.filter((m) => m.visible !== false)
}

export function calculateModulePrice(
  module: ModuleDefinition,
  users = 1,
  buildings = 1,
): { price: number; model: string; explanation: string } {
  const pricing = module.pricing
  let price = 0
  let explanation = ""

  switch (pricing.model) {
    case "per_user": {
      // Check for tier pricing
      if (pricing.tierPricing && pricing.tierPricing.length > 0) {
        const tier =
          pricing.tierPricing.find((t) => users >= t.minUsers && (!t.maxUsers || users <= t.maxUsers)) ||
          pricing.tierPricing[pricing.tierPricing.length - 1]

        price = (tier.pricePerUser / 100) * users
        explanation = `€${(tier.pricePerUser / 100).toFixed(2)} per gebruiker × ${users} gebruikers`
      } else {
        price = (pricing.basePrice / 100) * users
        explanation = `€${(pricing.basePrice / 100).toFixed(2)} per gebruiker × ${users} gebruikers`
      }
      return { price, model: "Per gebruiker", explanation }
    }
    case "per_building": {
      price = (pricing.basePrice / 100) * buildings
      explanation = `€${(pricing.basePrice / 100).toFixed(2)} per gebouw × ${buildings} gebouwen`
      return { price, model: "Per gebouw", explanation }
    }
    case "per_customer": {
      price = pricing.basePrice / 100
      explanation = `€${price.toFixed(2)} per organisatie`
      return { price, model: "Per organisatie", explanation }
    }
    case "fixed":
    default: {
      price = pricing.basePrice / 100
      explanation = `€${price.toFixed(2)} vaste prijs`
      return { price, model: "Vaste prijs", explanation }
    }
  }
}
