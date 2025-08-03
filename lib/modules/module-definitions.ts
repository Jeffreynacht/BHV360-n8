// Module definities
export interface Module {
  id: string
  name: string
  description: string
  category: ModuleCategory
  pricing: ModulePricing
  features: string[]
  dependencies?: string[] // Andere modules die nodig zijn
  isCore: boolean // Core modules kunnen niet uitgeschakeld worden
}

export enum ModuleCategory {
  CORE = "core",
  BHV = "bhv",
  SAFETY = "safety",
  REPORTING = "reporting",
  INTEGRATION = "integration",
  ADVANCED = "advanced",
}

export interface ModulePricing {
  type: "per_user" | "per_customer" | "per_building" | "fixed"
  basePrice: number // In euro cents
  tierPricing?: TierPricing[]
}

export interface TierPricing {
  minUsers: number
  maxUsers?: number
  pricePerUser: number
}

// Alle beschikbare modules
export const AVAILABLE_MODULES: Module[] = [
  // === CORE MODULES (Altijd aan) ===
  {
    id: "core_platform",
    name: "Basis Platform",
    description: "Basis functionaliteit voor inloggen en gebruikersbeheer",
    category: ModuleCategory.CORE,
    pricing: { type: "per_user", basePrice: 500 }, // €5.00 per gebruiker
    features: ["Gebruikersbeheer", "Basis dashboard", "Profiel beheer"],
    isCore: true,
  },
  {
    id: "core_plotkaart",
    name: "Basis Plotkaart",
    description: "Eenvoudige plattegrond weergave",
    category: ModuleCategory.CORE,
    pricing: { type: "per_user", basePrice: 200 }, // €2.00 per gebruiker
    features: ["Plattegrond weergave", "Basis navigatie"],
    isCore: true,
  },

  // === BHV MODULES ===
  {
    id: "bhv_coordinator",
    name: "BHV Coördinator",
    description: "Uitgebreide BHV beheer functionaliteit",
    category: ModuleCategory.BHV,
    pricing: {
      type: "per_user",
      basePrice: 800,
      tierPricing: [
        { minUsers: 1, maxUsers: 10, pricePerUser: 800 },
        { minUsers: 11, maxUsers: 50, pricePerUser: 600 },
        { minUsers: 51, pricePerUser: 400 },
      ],
    },
    features: [
      "BHV team beheer",
      "Incident management",
      "Evacuatie planning",
      "Training planning",
      "Certificaat beheer",
    ],
    isCore: false,
  },
  {
    id: "bhv_advanced_plotkaart",
    name: "Geavanceerde Plotkaart",
    description: "Interactieve plotkaart met real-time updates",
    category: ModuleCategory.BHV,
    pricing: { type: "per_user", basePrice: 400 },
    features: [
      "Interactieve plotkaart editor",
      "Real-time status updates",
      "Meerdere verdiepingen",
      "Zoom functionaliteit",
    ],
    dependencies: ["core_plotkaart"],
    isCore: false,
  },

  // === SAFETY MODULES ===
  {
    id: "nfc_management",
    name: "NFC Tag Beheer",
    description: "Beheer van NFC tags en locaties",
    category: ModuleCategory.SAFETY,
    pricing: { type: "per_customer", basePrice: 2500 }, // €25.00 per klant per maand
    features: ["NFC tag registratie", "Locatie tracking", "Status monitoring", "Maintenance scheduling"],
    isCore: false,
  },
  {
    id: "facility_management",
    name: "Voorzieningen Beheer",
    description: "Beheer van veiligheidsvoorzieningen",
    category: ModuleCategory.SAFETY,
    pricing: { type: "per_building", basePrice: 1500 }, // €15.00 per gebouw
    features: ["Brandblussers beheer", "AED monitoring", "EHBO voorraad", "Inspectie planning"],
    isCore: false,
  },

  // === REPORTING MODULES ===
  {
    id: "basic_reporting",
    name: "Basis Rapportages",
    description: "Standaard rapportages en exports",
    category: ModuleCategory.REPORTING,
    pricing: { type: "per_customer", basePrice: 1000 },
    features: ["Gebruikers rapporten", "Incident overzichten", "PDF export", "Excel export"],
    isCore: false,
  },
  {
    id: "advanced_analytics",
    name: "Geavanceerde Analytics",
    description: "Uitgebreide analytics en dashboards",
    category: ModuleCategory.REPORTING,
    pricing: { type: "per_customer", basePrice: 2000 },
    features: ["Real-time dashboards", "Trend analyse", "Predictive analytics", "Custom reports"],
    dependencies: ["basic_reporting"],
    isCore: false,
  },

  // === INTEGRATION MODULES ===
  {
    id: "api_access",
    name: "API Toegang",
    description: "REST API voor integraties",
    category: ModuleCategory.INTEGRATION,
    pricing: { type: "per_customer", basePrice: 3000 },
    features: ["REST API endpoints", "Webhook support", "Rate limiting", "API documentatie"],
    isCore: false,
  },
  {
    id: "sso_integration",
    name: "Single Sign-On",
    description: "SAML/OAuth integratie",
    category: ModuleCategory.INTEGRATION,
    pricing: { type: "per_customer", basePrice: 5000 },
    features: ["SAML 2.0 support", "OAuth 2.0 support", "Active Directory sync", "Multi-tenant support"],
    isCore: false,
  },

  // === ADVANCED MODULES ===
  {
    id: "mobile_app",
    name: "Mobiele App",
    description: "Native mobiele applicatie",
    category: ModuleCategory.ADVANCED,
    pricing: { type: "per_user", basePrice: 300 },
    features: ["iOS app", "Android app", "Offline functionaliteit", "Push notificaties"],
    isCore: false,
  },
  {
    id: "white_label",
    name: "White-label Branding",
    description: "Aangepaste branding en domein",
    category: ModuleCategory.ADVANCED,
    pricing: { type: "per_customer", basePrice: 10000 }, // €100.00 per klant
    features: ["Custom logo", "Custom kleuren", "Custom domein", "Custom CSS"],
    isCore: false,
  },
]

// Helper functions
export function getModuleById(moduleId: string): Module | undefined {
  return AVAILABLE_MODULES.find((m) => m.id === moduleId)
}

export function getModulesByCategory(category: ModuleCategory): Module[] {
  return AVAILABLE_MODULES.filter((m) => m.category === category)
}

export function getCoreModules(): Module[] {
  return AVAILABLE_MODULES.filter((m) => m.isCore)
}

export function getOptionalModules(): Module[] {
  return AVAILABLE_MODULES.filter((m) => !m.isCore)
}

export function validateModuleDependencies(enabledModules: string[]): string[] {
  const errors: string[] = []

  for (const moduleId of enabledModules) {
    const module = getModuleById(moduleId)
    if (module?.dependencies) {
      for (const dependency of module.dependencies) {
        if (!enabledModules.includes(dependency)) {
          errors.push(`Module '${module.name}' vereist '${getModuleById(dependency)?.name}'`)
        }
      }
    }
  }

  return errors
}
