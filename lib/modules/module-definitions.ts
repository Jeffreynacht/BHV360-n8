export interface ModuleDefinition {
  id: string
  name: string
  description: string
  longDescription: string
  category: "basis" | "geavanceerd" | "premium" | "enterprise"
  tier: "starter" | "professional" | "enterprise" | "custom"
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

export const moduleDefinitions: ModuleDefinition[] = [
  // BASIS MODULES - Essentiële functionaliteiten
  {
    id: "bhv-basis-dashboard",
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
    id: "bezoeker-registratie-basis",
    name: "Bezoeker Registratie",
    description: "Digitale bezoeker registratie met check-in/out en basis veiligheidscheck",
    longDescription:
      "Professionele bezoeker registratie voor uw receptie. Digitale check-in/out, foto registratie, host notificaties en automatische evacuatielijsten.",
    category: "basis",
    tier: "professional",
    version: "2.3.0",
    status: "active",
    pricing: {
      type: "per_building",
      basePrice: 3500, // €35.00 per gebouw per maand
      currency: "EUR",
      billingPeriod: "monthly",
      setupFee: 25000, // €250 setup fee
      freeTrialDays: 14,
    },
    pricingModel: "per_building",
    pricingExplanation: "Betaal per locatie/gebouw. Onbeperkt aantal bezoekers en hosts per locatie.",
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
    visible: true,
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

  // GEAVANCEERDE MODULES - Professionele functionaliteiten
  {
    id: "noodprocedures-pro",
    name: "Noodprocedures Professional",
    description: "Interactieve noodprocedures met real-time monitoring en automatische escalatie",
    longDescription:
      "Complete noodprocedure module met interactieve checklists, rol-gebaseerde toewijzingen, real-time voortgangsmonitoring en automatische escalatie procedures.",
    category: "geavanceerd",
    tier: "professional",
    version: "3.2.0",
    status: "active",
    pricing: {
      type: "per_user",
      basePrice: 1250, // €12.50 per gebruiker per maand
      tierPricing: [
        { minUsers: 1, maxUsers: 15, pricePerUser: 1250 },
        { minUsers: 16, maxUsers: 50, pricePerUser: 1100 },
        { minUsers: 51, maxUsers: 100, pricePerUser: 950 },
        { minUsers: 101, pricePerUser: 800 },
      ],
      currency: "EUR",
      billingPeriod: "monthly",
      freeTrialDays: 14,
    },
    pricingModel: "per_user",
    pricingExplanation:
      "Betaal per BHV'er die toegang heeft tot noodprocedures. Inclusief mobile app en real-time monitoring.",
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
    visible: true,
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
    id: "plotkaart-advanced",
    name: "Plotkaart Advanced + NFC",
    description: "Geavanceerde plotkaart met NFC tracking, inspectie management en real-time updates",
    longDescription:
      "Professionele plotkaart module met NFC tag integratie, automatische inspectie planning, real-time voorziening status en uitgebreide rapportage mogelijkheden.",
    category: "geavanceerd",
    tier: "professional",
    version: "3.5.0",
    status: "active",
    pricing: {
      type: "per_building",
      basePrice: 4500, // €45.00 per gebouw per maand
      currency: "EUR",
      billingPeriod: "monthly",
      setupFee: 35000, // €350 setup fee (inclusief NFC tags)
      freeTrialDays: 21,
    },
    pricingModel: "per_building",
    pricingExplanation: "Betaal per gebouw. Inclusief NFC tags, inspectie management en real-time monitoring.",
    features: [
      "NFC tag integratie",
      "Real-time voorziening status",
      "Automatische inspectie planning",
      "QR code generatie",
      "Multi-verdieping ondersteuning",
      "Voorziening categorisatie",
      "Inspectie rapporten",
      "Maintenance alerts",
      "Advanced analytics",
      "API integratie",
    ],
    requirements: ["Digitale plattegronden", "NFC compatible devices", "Inspectie team"],
    integrations: ["NFC Management", "Inspectie Systeem", "Maintenance Planning", "Analytics"],
    compliance: ["Bouwbesluit", "NEN 2575", "Inspectie Verplichtingen"],
    implemented: true,
    visible: true,
    enabled: true,
    routePath: "/beheer/plotkaart-editor",
    popularity: 78,
    rating: 4.5,
    reviews: 94,
    lastUpdated: "2024-01-13",
    developer: {
      name: "BHV360 Core Team",
      verified: true,
      support: "Phone + Email Support",
    },
    permissions: ["plotkaart.advanced", "nfc.manage", "inspections.plan", "analytics.view"],
    dataRetention: 1825, // 5 jaar
    backupIncluded: true,
    slaLevel: "99.95%",
    tags: ["plotkaart", "nfc", "inspectie", "geavanceerd"],
  },

  {
    id: "incident-management-pro",
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

  // PREMIUM MODULES - Enterprise functionaliteiten
  {
    id: "bhv-analytics-suite",
    name: "BHV Analytics Suite",
    description: "Uitgebreide analytics en business intelligence voor BHV management",
    longDescription:
      "Complete analytics suite met dashboards, KPI tracking, predictive analytics en executive reporting voor strategisch BHV management.",
    category: "premium",
    tier: "enterprise",
    version: "1.8.0",
    status: "active",
    pricing: {
      type: "per_customer",
      basePrice: 28500, // €285.00 per organisatie per maand
      currency: "EUR",
      billingPeriod: "monthly",
      setupFee: 75000, // €750 setup fee
      freeTrialDays: 30,
    },
    pricingModel: "per_customer",
    pricingExplanation:
      "Enterprise pricing per organisatie. Inclusief alle analytics, custom dashboards en executive reporting.",
    features: [
      "Executive dashboards",
      "KPI tracking & monitoring",
      "Predictive analytics",
      "Trend analysis",
      "Benchmark rapportage",
      "Custom visualisaties",
      "Automated reporting",
      "Data export (Excel/CSV)",
      "API voor BI tools",
      "Real-time monitoring",
    ],
    requirements: ["Data analyst toegang", "Executive stakeholders", "Minimum 6 maanden data"],
    integrations: ["BI Tools", "Excel/Power BI", "Custom APIs", "Data Warehouse"],
    compliance: ["Data Analytics Standards", "Executive Reporting Requirements"],
    implemented: false,
    visible: true,
    enabled: true,
    routePath: "/beheer/rapportages",
    popularity: 45,
    rating: 4.6,
    reviews: 23,
    lastUpdated: "2024-01-08",
    developer: {
      name: "BHV360 Analytics Team",
      verified: true,
      support: "Dedicated Account Manager",
    },
    permissions: ["analytics.view", "analytics.export", "dashboards.create", "reports.executive"],
    dataRetention: 2555, // 7 jaar
    backupIncluded: true,
    slaLevel: "99.99%",
    tags: ["analytics", "enterprise", "dashboards", "kpi"],
  },

  {
    id: "api-integration-suite",
    name: "API Integration Suite",
    description: "Complete API suite voor integratie met HR, ERP en veiligheidssystemen",
    longDescription:
      "Uitgebreide API suite voor naadloze integratie met bestaande bedrijfssystemen zoals HR, ERP, toegangscontrole en brandmeldinstallaties.",
    category: "premium",
    tier: "enterprise",
    version: "2.1.0",
    status: "active",
    pricing: {
      type: "per_customer",
      basePrice: 22500, // €225.00 per organisatie per maand
      currency: "EUR",
      billingPeriod: "monthly",
      setupFee: 100000, // €1000 setup fee (inclusief implementatie)
      freeTrialDays: 30,
    },
    pricingModel: "per_customer",
    pricingExplanation: "Enterprise pricing inclusief API toegang, implementatie ondersteuning en dedicated support.",
    features: [
      "RESTful API endpoints",
      "Webhook ondersteuning",
      "Real-time data sync",
      "HR systeem integratie",
      "ERP connectoren",
      "Toegangscontrole koppeling",
      "Brandmeld integratie",
      "Custom API development",
      "API monitoring",
      "Rate limiting",
    ],
    requirements: ["IT afdeling", "Systeem integratie kennis", "Bestaande bedrijfssystemen"],
    integrations: ["HR Systemen", "ERP Platforms", "Toegangscontrole", "Brandmeldinstallaties"],
    compliance: ["API Security Standards", "OAuth 2.0", "Enterprise Security"],
    implemented: true,
    visible: true,
    enabled: true,
    routePath: "/beheer/api-integraties",
    popularity: 35,
    rating: 4.5,
    reviews: 18,
    lastUpdated: "2024-01-09",
    developer: {
      name: "BHV360 Integration Team",
      verified: true,
      support: "Dedicated Technical Support",
    },
    permissions: ["api.admin", "integrations.manage", "webhooks.configure", "systems.connect"],
    dataRetention: 1095, // 3 jaar
    backupIncluded: true,
    slaLevel: "99.99%",
    tags: ["api", "integratie", "enterprise", "systemen"],
  },

  // ENTERPRISE MODULES - Volledig maatwerk
  {
    id: "white-label-platform",
    name: "White Label Platform",
    description: "Volledig white-label platform voor partners en resellers",
    longDescription:
      "Complete white-label oplossing waarmee partners het BHV360 platform kunnen aanbieden onder eigen merk met volledige customisatie en multi-tenant architectuur.",
    category: "enterprise",
    tier: "custom",
    version: "1.5.0",
    status: "active",
    pricing: {
      type: "fixed",
      basePrice: 150000, // €1500.00 per maand
      currency: "EUR",
      billingPeriod: "monthly",
      setupFee: 500000, // €5000 setup fee
      freeTrialDays: 60,
    },
    pricingModel: "fixed",
    pricingExplanation:
      "Enterprise white-label pricing. Inclusief volledige platform customisatie, multi-tenant architectuur en dedicated support.",
    features: [
      "Volledige merk customisatie",
      "Multi-tenant architectuur",
      "Partner management portal",
      "Klant onboarding tools",
      "Billing integratie",
      "Support ticket systeem",
      "Custom domein ondersteuning",
      "Dedicated infrastructure",
      "SLA garanties",
      "24/7 monitoring",
    ],
    requirements: ["Partner overeenkomst", "Minimum volume commitment", "Dedicated implementatie team"],
    integrations: ["Billing Platforms", "CRM Systemen", "Support Tools", "Monitoring Systems"],
    compliance: ["Partner Agreements", "Multi-tenant Security", "Enterprise SLA"],
    implemented: true,
    visible: true,
    enabled: true,
    routePath: "/white-label",
    popularity: 15,
    rating: 4.8,
    reviews: 8,
    lastUpdated: "2024-01-05",
    developer: {
      name: "BHV360 Enterprise Team",
      verified: true,
      support: "Dedicated Account Manager + 24/7 Support",
    },
    permissions: ["whitelabel.admin", "platform.customize", "tenants.manage", "billing.configure"],
    dataRetention: 2555, // 7 jaar
    backupIncluded: true,
    slaLevel: "99.99%",
    tags: ["white-label", "enterprise", "partner", "platform"],
  },

  {
    id: "custom-development",
    name: "Custom Development Services",
    description: "Maatwerk ontwikkeling voor specifieke organisatie behoeften",
    longDescription:
      "Volledig maatwerk ontwikkeling van specifieke modules en functionaliteiten die perfect aansluiten bij uw organisatie processen en requirements.",
    category: "enterprise",
    tier: "custom",
    version: "1.0.0",
    status: "active",
    pricing: {
      type: "fixed",
      basePrice: 0, // Prijs op aanvraag
      currency: "EUR",
      billingPeriod: "monthly",
    },
    pricingModel: "custom",
    pricingExplanation:
      "Maatwerk pricing op basis van requirements analyse. Vanaf €10.000 per maand afhankelijk van complexiteit.",
    features: [
      "Requirements analyse",
      "Custom module ontwikkeling",
      "Dedicated development team",
      "Agile development proces",
      "User acceptance testing",
      "Deployment ondersteuning",
      "Maintenance & support",
      "Training & documentatie",
      "Integration services",
      "Performance optimization",
    ],
    requirements: ["Dedicated project manager", "Requirements specificatie", "Acceptance criteria"],
    integrations: ["Alle bestaande systemen", "Custom API's", "Legacy systemen"],
    compliance: ["Custom Compliance Requirements", "Industry Standards"],
    implemented: false,
    visible: true,
    enabled: true,
    popularity: 5,
    rating: 5.0,
    reviews: 3,
    lastUpdated: "2024-01-01",
    developer: {
      name: "BHV360 Custom Development",
      verified: true,
      support: "Dedicated Development Team",
    },
    permissions: ["custom.admin", "development.manage", "requirements.define"],
    dataRetention: 3650, // 10 jaar
    backupIncluded: true,
    slaLevel: "99.99%",
    tags: ["maatwerk", "custom", "development", "enterprise"],
  },
]

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

// Export for compatibility with existing code
export const AVAILABLE_MODULES = moduleDefinitions

// Get core/essential modules
export function getCoreModules(): ModuleDefinition[] {
  return moduleDefinitions.filter(
    (module) => module.category === "basis" && module.implemented && module.visible && module.enabled,
  )
}
