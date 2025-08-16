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

export interface ModuleDef {
  id: string
  name: string
  category: ModuleCategory
  description?: string
  core?: boolean
  visible?: boolean // default: true als undefined
  pricing: {
    model: "fixed" | "per_user" | "per_building" | "per_customer"
    basePrice: number
    tierMultipliers?: Partial<Record<ModuleTier, number>>
  }
  dependsOn?: string[]
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

export const moduleDefinitions: ModuleDef[] = [
  {
    id: "bhv-basis-dashboard",
    name: "BHV Basis Dashboard",
    category: "basis",
    description: "Essentieel dashboard voor BHV coördinatoren met team overzicht en basis functionaliteiten",
    longDescription:
      "Het basis dashboard biedt een compleet overzicht van uw BHV team, aanwezigheid, certificeringen en basis rapportages. Ideaal voor kleinere organisaties die net beginnen met digitaal BHV beheer.",
    core: true,
    visible: true,
    pricing: {
      model: "per_user",
      basePrice: 850, // €8.50 per gebruiker per maand
      tierMultipliers: {
        professional: 1.2,
        enterprise: 1.5,
      },
    },
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
    name: "Interactieve Plotkaart Basis",
    category: "basis",
    description: "Digitale plattegronden met BHV voorzieningen en basis functionaliteiten",
    longDescription:
      "Upload uw plattegronden en markeer alle BHV voorzieningen digitaal. Inclusief basis voorziening beheer, eenvoudige updates en print functionaliteit.",
    core: true,
    visible: true,
    pricing: {
      model: "per_building",
      basePrice: 2500, // €25.00 per gebouw per maand
      tierMultipliers: {
        professional: 1.2,
        enterprise: 1.5,
      },
    },
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
    id: "bezoeker-registratie-basis",
    name: "Bezoeker Registratie",
    category: "basis",
    description: "Digitale bezoeker registratie met check-in/out en basis veiligheidscheck",
    longDescription:
      "Professionele bezoeker registratie voor uw receptie. Digitale check-in/out, foto registratie, host notificaties en automatische evacuatielijsten.",
    visible: true,
    pricing: {
      model: "per_building",
      basePrice: 3500, // €35.00 per gebouw per maand
      tierMultipliers: {
        professional: 1.2,
        enterprise: 1.5,
      },
    },
    features: [
      "Digitale check-in/out",
      "Foto registratie",
      "Host notificaties",
      "Bezoeker badges",
      "Veiligheidscheck",
      "Evacuatie lijsten",
      "Bezoeker historie",
      "Privacy compliance",
    ],
    requirements: ["Tablet voor receptie", "Internet verbinding", "Badge printer (optioneel)"],
    integrations: ["Email Service", "Badge Printer", "BHV Dashboard"],
    compliance: ["AVG/GDPR", "Bezoeker Privacy Wet"],
    implemented: true,
    enabled: true,
    routePath: "/visitor-registration",
    popularity: 72,
    rating: 4.3,
    reviews: 89,
    lastUpdated: "2024-01-10",
    developer: {
      name: "BHV360 Core Team",
      verified: true,
      support: "Email Support",
    },
    permissions: ["visitors.register", "visitors.view", "visitors.checkout"],
    dataRetention: 30, // 30 dagen (AVG)
    backupIncluded: true,
    slaLevel: "99.9%",
    tags: ["bezoeker", "receptie", "check-in", "veiligheid"],
  },
  {
    id: "noodprocedures-pro",
    name: "Noodprocedures Professional",
    category: "geavanceerd",
    description: "Interactieve noodprocedures met real-time monitoring en automatische escalatie",
    longDescription:
      "Complete noodprocedure module met interactieve checklists, rol-gebaseerde toewijzingen, real-time voortgangsmonitoring en automatische escalatie procedures.",
    visible: true,
    pricing: {
      model: "per_user",
      basePrice: 1250, // €12.50 per gebruiker per maand
      tierMultipliers: {
        professional: 1.2,
        enterprise: 1.5,
      },
    },
    features: [
      "Interactieve checklists",
      "Rol-gebaseerde procedures",
      "Real-time voortgang",
      "Automatische escalatie",
      "Mobile app",
      "Offline synchronisatie",
      "Tijdslimiet monitoring",
      "PDF export procedures",
      "Procedure analytics",
      "Custom procedures",
    ],
    requirements: ["BHV team van minimaal 3 personen", "Smartphone/tablet toegang", "Actuele noodprocedures"],
    integrations: ["BHV Dashboard", "Mobile App", "Notification Service", "Analytics"],
    compliance: ["NEN 3011", "Arbo-wet", "BHV Richtlijnen"],
    implemented: true,
    enabled: true,
    routePath: "/bhv/procedures",
    popularity: 85,
    rating: 4.7,
    reviews: 127,
    lastUpdated: "2024-01-14",
    developer: {
      name: "BHV360 Core Team",
      verified: true,
      support: "Phone + Email Support",
    },
    permissions: ["procedures.read", "procedures.execute", "procedures.monitor", "procedures.export"],
    dataRetention: 2555, // 7 jaar
    backupIncluded: true,
    slaLevel: "99.95%",
    tags: ["noodprocedures", "interactief", "monitoring", "mobiel"],
  },
  {
    id: "incident-manager",
    name: "Incident Manager",
    category: "geavanceerd",
    description: "Realtime incidentafhandeling en logging",
    dependsOn: ["plotkaart-core"],
    visible: true,
    pricing: {
      model: "per_user",
      basePrice: 3,
      tierMultipliers: {
        professional: 1.1,
        enterprise: 1.3,
      },
    },
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
  {
    id: "export-pdf",
    name: "PDF Export",
    category: "basis",
    visible: true,
    pricing: {
      model: "fixed",
      basePrice: 15,
    },
    features: ["Export naar PDF"],
    requirements: ["Internet verbinding"],
    integrations: ["BHV Dashboard", "PDF Export"],
    compliance: ["AVG/GDPR"],
    implemented: true,
    enabled: true,
    routePath: "/export-pdf",
    popularity: 80,
    rating: 4.5,
    reviews: 100,
    lastUpdated: "2024-01-09",
    developer: {
      name: "BHV360 Core Team",
      verified: true,
      support: "Email Support",
    },
    permissions: ["export.pdf"],
    dataRetention: 365, // 1 jaar
    backupIncluded: true,
    slaLevel: "99.9%",
    tags: ["export", "pdf"],
  },
  {
    id: "nfc-tags",
    name: "NFC Tags",
    category: "premium",
    visible: true,
    pricing: {
      model: "per_building",
      basePrice: 5,
    },
    features: ["NFC tag integratie"],
    requirements: ["NFC tag lezer"],
    integrations: ["BHV Dashboard", "NFC Tag Reader"],
    compliance: ["NEN 3011"],
    implemented: true,
    enabled: true,
    routePath: "/nfc-tags",
    popularity: 75,
    rating: 4.6,
    reviews: 90,
    lastUpdated: "2024-01-08",
    developer: {
      name: "BHV360 Core Team",
      verified: true,
      support: "Phone + Email Support",
    },
    permissions: ["nfc.tags.manage"],
    dataRetention: 365, // 1 jaar
    backupIncluded: true,
    slaLevel: "99.95%",
    tags: ["nfc", "tags", "integratie"],
  },
  {
    id: "advanced-reporting",
    name: "Advanced Reporting",
    category: "geavanceerd",
    description: "Uitgebreide rapportage en analytics",
    visible: true,
    pricing: {
      model: "per_user",
      basePrice: 2,
      tierMultipliers: {
        professional: 1.2,
        enterprise: 1.4,
      },
    },
    features: ["Uitgebreide rapportage", "Analytics"],
    requirements: ["Internet verbinding"],
    integrations: ["BHV Dashboard", "Analytics"],
    compliance: ["AVG/GDPR"],
    implemented: true,
    enabled: true,
    routePath: "/advanced-reporting",
    popularity: 82,
    rating: 4.7,
    reviews: 110,
    lastUpdated: "2024-01-07",
    developer: {
      name: "BHV360 Core Team",
      verified: true,
      support: "Phone + Email Support",
    },
    permissions: ["reporting.view", "reporting.export"],
    dataRetention: 365, // 1 jaar
    backupIncluded: true,
    slaLevel: "99.95%",
    tags: ["rapportage", "analytics"],
  },
  {
    id: "mobile-app",
    name: "Mobile App",
    category: "premium",
    description: "Mobiele applicatie voor BHV-ers",
    core: true,
    visible: true,
    pricing: {
      model: "per_user",
      basePrice: 4,
      tierMultipliers: {
        professional: 1.1,
        enterprise: 1.2,
      },
    },
    features: ["Mobiele app toegang"],
    requirements: ["Smartphone/tablet"],
    integrations: ["BHV Dashboard", "Mobile App"],
    compliance: ["AVG/GDPR"],
    implemented: true,
    enabled: true,
    routePath: "/mobile-app",
    popularity: 90,
    rating: 4.8,
    reviews: 120,
    lastUpdated: "2024-01-06",
    developer: {
      name: "BHV360 Core Team",
      verified: true,
      support: "Phone + Email Support",
    },
    permissions: ["mobile.app.access"],
    dataRetention: 365, // 1 jaar
    backupIncluded: true,
    slaLevel: "99.95%",
    tags: ["mobiel", "app"],
  },
  {
    id: "api-integration",
    name: "API Integration",
    category: "enterprise",
    description: "API toegang voor externe systemen",
    visible: true,
    pricing: {
      model: "fixed",
      basePrice: 99,
      tierMultipliers: {
        enterprise: 1.0,
        custom: 1.5,
      },
    },
    features: ["API toegang"],
    requirements: ["IT afdeling"],
    integrations: ["HR Systemen", "ERP Platforms", "Toegangscontrole", "Brandmeldinstallaties"],
    compliance: ["API Security Standards", "OAuth 2.0"],
    implemented: true,
    enabled: true,
    routePath: "/api-integration",
    popularity: 60,
    rating: 4.5,
    reviews: 70,
    lastUpdated: "2024-01-05",
    developer: {
      name: "BHV360 Integration Team",
      verified: true,
      support: "Dedicated Technical Support",
    },
    permissions: ["api.admin", "integrations.manage"],
    dataRetention: 365, // 1 jaar
    backupIncluded: true,
    slaLevel: "99.99%",
    tags: ["api", "integratie"],
  },
  {
    id: "white-label",
    name: "White Label",
    category: "enterprise",
    description: "Volledig aangepaste branding",
    visible: true,
    pricing: {
      model: "per_customer",
      basePrice: 199,
      tierMultipliers: {
        enterprise: 1.0,
        custom: 1.2,
      },
    },
    features: ["Aangepaste branding"],
    requirements: ["Branding afdeling"],
    integrations: ["BHV Dashboard", "Branding Tools"],
    compliance: ["Enterprise Security"],
    implemented: true,
    enabled: true,
    routePath: "/white-label",
    popularity: 55,
    rating: 4.6,
    reviews: 65,
    lastUpdated: "2024-01-04",
    developer: {
      name: "BHV360 Branding Team",
      verified: true,
      support: "Dedicated Technical Support",
    },
    permissions: ["branding.customize"],
    dataRetention: 365, // 1 jaar
    backupIncluded: true,
    slaLevel: "99.99%",
    tags: ["white-label", "branding"],
  },
]

// Utility functions
export function calculateModulePrice(
  mod: ModuleDef,
  opts: { tier?: ModuleTier; users?: number; buildings?: number; customers?: number } = {},
): number {
  const tier = opts.tier ?? "starter"
  const mult = mod.pricing.tierMultipliers?.[tier] ?? 1
  const base = mod.pricing.basePrice * mult

  switch (mod.pricing.model) {
    case "per_user":
      return base * Math.max(1, opts.users ?? 0)
    case "per_building":
      return base * Math.max(1, opts.buildings ?? 0)
    case "per_customer":
      return base * Math.max(1, opts.customers ?? 0)
    default:
      return base
  }
}

export function getVisibleModules(defs: ModuleDef[] = moduleDefinitions) {
  return defs.filter((m) => m.visible !== false)
}

export function getModuleById(id: string) {
  return moduleDefinitions.find((m) => m.id === id)
}

export function getCoreModules() {
  return moduleDefinitions.filter((m) => m.core)
}

export function validateDependencies(defs: ModuleDef[] = moduleDefinitions) {
  const keys = new Set(defs.map((d) => d.id))
  const missing: string[] = []
  for (const d of defs) for (const dep of d.dependsOn ?? []) if (!keys.has(dep)) missing.push(`${d.id} -> ${dep}`)
  return { ok: missing.length === 0, missing }
}

// Export for compatibility with existing code - REQUIRED EXPORT
export const AVAILABLE_MODULES = moduleDefinitions
