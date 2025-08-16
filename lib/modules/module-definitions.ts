export type ModuleTier = "starter" | "professional" | "enterprise" | "custom"
export type ModuleCategory = "basis" | "geavanceerd" | "premium" | "enterprise"

export interface ModuleDefinition {
  id: string
  key: string
  name: string
  description: string
  longDescription?: string
  category: ModuleCategory
  tier: ModuleTier
  version: string
  status: "active" | "beta" | "deprecated" | "coming-soon"
  pricing: {
    type: "per_user" | "per_building" | "per_customer" | "fixed"
    basePrice: number // In euro cents
    tierPricing?: {
      minUsers: number
      maxUsers?: number
      pricePerUser: number
    }[]
    currency: "EUR"
    billingPeriod: "monthly"
    setupFee?: number
    freeTrialDays?: number
  }
  pricingModel: string
  pricingExplanation: string
  features: string[]
  requirements: string[]
  integrations: string[]
  compliance: string[]
  implemented: boolean
  visible: boolean
  enabled: boolean
  routePath?: string
  popularity: number
  rating: number
  reviews: number
  lastUpdated: string
  developer: {
    name: string
    verified: boolean
    support: string
  }
  permissions: string[]
  dataRetention: number
  backupIncluded: boolean
  slaLevel: "99.9%" | "99.95%" | "99.99%"
  tags: string[]
}

export const moduleCategories = [
  {
    id: "basis",
    name: "Basis Modules",
    description: "Essentiële BHV functionaliteiten voor elke organisatie",
    color: "bg-blue-50 border-blue-200 text-blue-800",
    icon: "Shield",
  },
  {
    id: "geavanceerd",
    name: "Geavanceerde Modules",
    description: "Professionele tools voor middelgrote tot grote organisaties",
    color: "bg-green-50 border-green-200 text-green-800",
    icon: "Zap",
  },
  {
    id: "premium",
    name: "Premium Modules",
    description: "Enterprise functionaliteiten met analytics en integraties",
    color: "bg-purple-50 border-purple-200 text-purple-800",
    icon: "Crown",
  },
  {
    id: "enterprise",
    name: "Enterprise Modules",
    description: "Volledig maatwerk en white-label oplossingen",
    color: "bg-orange-50 border-orange-200 text-orange-800",
    icon: "Building",
  },
] as const

export const tierDefinitions = [
  {
    id: "starter",
    name: "Starter",
    description: "Voor kleine organisaties (1-25 medewerkers)",
    priceRange: "€8-35/maand",
    features: ["Basis functionaliteiten", "Email support", "Standard SLA"],
  },
  {
    id: "professional",
    name: "Professional",
    description: "Voor middelgrote organisaties (25-100 medewerkers)",
    priceRange: "€35-185/maand",
    features: ["Geavanceerde tools", "Phone + Email support", "Enhanced SLA"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Voor grote organisaties (100+ medewerkers)",
    priceRange: "€185-1500/maand",
    features: ["Enterprise features", "Dedicated support", "Premium SLA"],
  },
  {
    id: "custom",
    name: "Custom",
    description: "Volledig maatwerk oplossingen",
    priceRange: "Op aanvraag",
    features: ["Maatwerk development", "Dedicated team", "Custom SLA"],
  },
] as const

export const moduleDefinitions: ModuleDefinition[] = [
  {
    id: "bhv-basis-dashboard",
    key: "bhv-basis-dashboard",
    name: "BHV Basis Dashboard",
    description: "Essentieel dashboard voor BHV coördinatoren met team overzicht en basis functionaliteiten",
    longDescription:
      "Het basis dashboard biedt een compleet overzicht van uw BHV team, aanwezigheid, certificeringen en basis rapportages. Ideaal voor kleinere organisaties die net beginnen met digitaal BHV beheer.",
    category: "basis",
    tier: "starter",
    version: "3.1.0",
    status: "active",
    pricing: {
      type: "per_user",
      basePrice: 850, // €8.50 per gebruiker per maand
      tierPricing: [
        { minUsers: 1, maxUsers: 10, pricePerUser: 850 },
        { minUsers: 11, maxUsers: 25, pricePerUser: 750 },
        { minUsers: 26, maxUsers: 50, pricePerUser: 650 },
        { minUsers: 51, pricePerUser: 550 },
      ],
      currency: "EUR",
      billingPeriod: "monthly",
      freeTrialDays: 30,
    },
    pricingModel: "per_user",
    pricingExplanation:
      "Betaal per BHV'er in uw team. Inclusief basis dashboard, aanwezigheid tracking en certificering beheer.",
    features: [
      "BHV team overzicht",
      "Aanwezigheid registratie",
      "Certificering tracking",
      "Basis rapportages",
      "Email notificaties",
      "Mobile app toegang",
      "Basis plotkaart",
      "Contact beheer",
    ],
    requirements: ["Minimaal 1 BHV coördinator", "Email adressen van BHV team"],
    integrations: ["Email Service", "Mobile App", "Basis Rapportage"],
    compliance: ["Arbo-wet", "BHV Richtlijnen", "AVG/GDPR"],
    implemented: true,
    visible: true,
    enabled: true,
    routePath: "/dashboards/bhv-coordinator",
    popularity: 95,
    rating: 4.6,
    reviews: 234,
    lastUpdated: "2024-01-15",
    developer: {
      name: "BHV360 Core Team",
      verified: true,
      support: "Email Support",
    },
    permissions: ["bhv.dashboard.read", "bhv.team.view", "bhv.certificates.manage"],
    dataRetention: 1095, // 3 jaar
    backupIncluded: true,
    slaLevel: "99.9%",
    tags: ["essentieel", "starter", "dashboard", "basis"],
  },
  {
    id: "plotkaart-basis",
    key: "plotkaart-basis",
    name: "Interactieve Plotkaart Basis",
    description: "Digitale plattegronden met BHV voorzieningen en basis functionaliteiten",
    longDescription:
      "Upload uw plattegronden en markeer alle BHV voorzieningen digitaal. Inclusief basis voorziening beheer, eenvoudige updates en print functionaliteit.",
    category: "basis",
    tier: "starter",
    version: "2.8.0",
    status: "active",
    pricing: {
      type: "per_building",
      basePrice: 2500, // €25.00 per gebouw per maand
      currency: "EUR",
      billingPeriod: "monthly",
      setupFee: 15000, // €150 setup fee
      freeTrialDays: 21,
    },
    pricingModel: "per_building",
    pricingExplanation: "Betaal per gebouw/locatie. Alle verdiepingen en ruimtes binnen dat gebouw zijn inbegrepen.",
    features: [
      "Upload plattegronden (PDF/JPG)",
      "Voorziening markering",
      "Basis voorziening types",
      "Print functionaliteit",
      "Zoom en navigatie",
      "Basis legenda",
      "Eenvoudige updates",
      "Export naar PDF",
    ],
    requirements: ["Digitale plattegronden", "Overzicht BHV voorzieningen"],
    integrations: ["BHV Dashboard", "Print Service", "PDF Export"],
    compliance: ["Bouwbesluit", "NEN 2575"],
    implemented: true,
    visible: true,
    enabled: true,
    routePath: "/plotkaart",
    popularity: 88,
    rating: 4.4,
    reviews: 156,
    lastUpdated: "2024-01-12",
    developer: {
      name: "BHV360 Core Team",
      verified: true,
      support: "Email Support",
    },
    permissions: ["plotkaart.view", "plotkaart.edit", "plotkaart.print"],
    dataRetention: 1825, // 5 jaar
    backupIncluded: true,
    slaLevel: "99.9%",
    tags: ["plotkaart", "basis", "plattegrond", "voorzieningen"],
  },
  {
    id: "incident-management-pro",
    key: "incident-management-pro",
    name: "Incident Management Professional",
    description: "Complete incident registratie met workflows, analyse en compliance rapportage",
    longDescription:
      "Professioneel incident management systeem met automatische workflows, escalatie procedures, uitgebreide analyse en compliance rapportage voor Arbeidsinspectie.",
    category: "geavanceerd",
    tier: "professional",
    version: "2.8.0",
    status: "active",
    pricing: {
      type: "per_customer",
      basePrice: 18500, // €185.00 per organisatie per maand
      currency: "EUR",
      billingPeriod: "monthly",
      setupFee: 50000, // €500 setup fee
      freeTrialDays: 14,
    },
    pricingModel: "per_customer",
    pricingExplanation: "Vaste prijs per organisatie. Onbeperkt aantal gebruikers en incidenten.",
    features: [
      "Snelle incident registratie",
      "Automatische workflows",
      "Escalatie procedures",
      "Foto/video upload",
      "Witness statements",
      "Root cause analysis",
      "Compliance rapportage",
      "Arbeidsinspectie export",
      "Trend analyse",
      "Mobile app",
    ],
    requirements: ["Incident response team", "Compliance officer", "Mobile devices"],
    integrations: ["Workflow Engine", "Document Management", "Compliance Reporting", "Analytics"],
    compliance: ["Arbo-wet", "Incident Rapportage Verplichtingen", "Arbeidsinspectie Eisen"],
    implemented: true,
    visible: true,
    enabled: true,
    routePath: "/incidenten",
    popularity: 68,
    rating: 4.4,
    reviews: 76,
    lastUpdated: "2024-01-11",
    developer: {
      name: "BHV360 Core Team",
      verified: true,
      support: "Phone + Email Support",
    },
    permissions: ["incidents.create", "incidents.investigate", "incidents.report", "compliance.export"],
    dataRetention: 3650, // 10 jaar
    backupIncluded: true,
    slaLevel: "99.95%",
    tags: ["incident", "compliance", "workflow", "analyse"],
  },
]

// Utility functions
export function getModuleById(id: string): ModuleDefinition | undefined {
  return moduleDefinitions.find((module) => module.id === id)
}

export function getModulesByCategory(category: ModuleDefinition["category"]): ModuleDefinition[] {
  return moduleDefinitions.filter((module) => module.category === category)
}

export function getModulesByTier(tier: ModuleDefinition["tier"]): ModuleDefinition[] {
  return moduleDefinitions.filter((module) => module.tier === tier)
}

export function getVisibleModules(): ModuleDefinition[] {
  return moduleDefinitions.filter((module) => module.visible && module.enabled)
}

export function calculateModulePrice(
  module: ModuleDefinition,
  userCount: number,
  buildingCount = 1,
): {
  price: number
  model: string
  explanation: string
} {
  const { pricing } = module

  switch (pricing.type) {
    case "per_user":
      let pricePerUser = pricing.basePrice

      // Check for tier pricing
      if (pricing.tierPricing) {
        const tier = pricing.tierPricing.find(
          (t) => userCount >= t.minUsers && (!t.maxUsers || userCount <= t.maxUsers),
        )
        if (tier) {
          pricePerUser = tier.pricePerUser
        }
      }

      return {
        price: (pricePerUser * userCount) / 100, // Convert from cents to euros
        model: "Per Gebruiker",
        explanation: `${userCount} gebruikers × €${(pricePerUser / 100).toFixed(2)}/maand`,
      }

    case "per_building":
      return {
        price: (pricing.basePrice * buildingCount) / 100,
        model: "Per Gebouw",
        explanation: `${buildingCount} gebouwen × €${(pricing.basePrice / 100).toFixed(2)}/maand`,
      }

    case "per_customer":
      return {
        price: pricing.basePrice / 100,
        model: "Per Organisatie",
        explanation: `Vaste prijs voor hele organisatie: €${(pricing.basePrice / 100).toFixed(2)}/maand`,
      }

    case "fixed":
      if (pricing.basePrice === 0) {
        return {
          price: 0,
          model: "Op Aanvraag",
          explanation: "Prijs op basis van requirements analyse",
        }
      }
      return {
        price: pricing.basePrice / 100,
        model: "Vaste Prijs",
        explanation: `Enterprise pricing: €${(pricing.basePrice / 100).toFixed(2)}/maand`,
      }

    default:
      return {
        price: 0,
        model: "Onbekend",
        explanation: "Prijs op aanvraag",
      }
  }
}

export function validateDependencies(defs: ModuleDefinition[] = moduleDefinitions): { ok: boolean; missing: string[] } {
  const keys = new Set(defs.map((d) => d.key))
  const missing: string[] = []

  for (const d of defs) {
    // Check if module has dependencies (you can extend this logic)
    const deps = d.requirements || []
    for (const dep of deps) {
      // This is a simplified check - you might want more sophisticated dependency validation
      if (dep.includes("module:") && !keys.has(dep.replace("module:", ""))) {
        missing.push(`${d.key} -> ${dep}`)
      }
    }
  }

  return { ok: missing.length === 0, missing }
}

// Export for compatibility with existing code
export const AVAILABLE_MODULES = moduleDefinitions

// Get core/essential modules
export function getCoreModules(): ModuleDefinition[] {
  return moduleDefinitions.filter(
    (module) => module.category === "basis" && module.implemented && module.visible && module.enabled,
  )
}
