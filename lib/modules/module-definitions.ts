export interface ModuleDefinition {
  id: string
  name: string
  description: string
  longDescription: string
  category: "safety" | "management" | "compliance" | "communication" | "analytics" | "integration"
  version: string
  status: "active" | "beta" | "deprecated" | "coming-soon"
  pricing: {
    model: "per-user" | "per-building" | "per-organization" | "hybrid"
    perUser?: number
    perBuilding?: number
    perOrganization?: number
    currency: "EUR"
    billingPeriod: "monthly" | "yearly"
    freeTrialDays?: number
  }
  features: string[]
  requirements: string[]
  integrations: string[]
  compliance: string[]
  screenshots: string[]
  demoUrl?: string
  documentationUrl?: string
  supportLevel: "basic" | "standard" | "premium"
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
  dataRetention: number // days
  backupIncluded: boolean
  slaLevel: "99.9%" | "99.95%" | "99.99%"
  tags: string[]
}

export const moduleDefinitions: ModuleDefinition[] = [
  {
    id: "noodprocedures",
    name: "Noodprocedures",
    description: "Interactieve noodprocedures met real-time checklists en voortgangsmonitoring",
    longDescription:
      "Complete module voor het beheren van noodprocedures met interactieve checklists, rol-gebaseerde toewijzingen, tijdslimieten en PDF export functionaliteit. Inclusief real-time voortgangsmonitoring en automatische escalatie.",
    category: "safety",
    version: "2.1.0",
    status: "active",
    pricing: {
      model: "hybrid",
      perUser: 12,
      perBuilding: 75,
      perOrganization: 250,
      currency: "EUR",
      billingPeriod: "monthly",
      freeTrialDays: 14,
    },
    features: [
      "Interactieve checklists",
      "Rol-gebaseerde toewijzingen",
      "Real-time voortgangsmonitoring",
      "Tijdslimiet instellingen",
      "PDF export functionaliteit",
      "Automatische escalatie",
      "Mobile app ondersteuning",
      "Offline synchronisatie",
    ],
    requirements: ["Minimaal 2 BHV coördinatoren", "Actuele plattegronden", "Smartphone/tablet toegang"],
    integrations: ["BHV Dashboard", "Incident Management", "Plotkaart Systeem", "Notificatie Service"],
    compliance: ["NEN 3011", "Arbo-wet", "BHV Richtlijnen", "AVG/GDPR"],
    screenshots: [
      "/placeholder.svg?height=400&width=600&text=Noodprocedures+Dashboard",
      "/placeholder.svg?height=400&width=600&text=Interactieve+Checklist",
      "/placeholder.svg?height=400&width=600&text=Voortgang+Monitoring",
    ],
    demoUrl: "/bhv/procedures",
    documentationUrl: "/docs/noodprocedures",
    supportLevel: "premium",
    popularity: 95,
    rating: 4.8,
    reviews: 127,
    lastUpdated: "2024-01-15",
    developer: {
      name: "BHV360 Core Team",
      verified: true,
      support: "24/7 Premium Support",
    },
    permissions: ["bhv.procedures.read", "bhv.procedures.write", "bhv.procedures.assign", "bhv.procedures.export"],
    dataRetention: 2555, // 7 jaar
    backupIncluded: true,
    slaLevel: "99.95%",
    tags: ["populair", "essentieel", "compliance", "mobiel"],
  },
  {
    id: "geavanceerde-plotkaart",
    name: "Geavanceerde Plotkaart",
    description: "Interactieve plattegronden met NFC tracking en real-time voorziening monitoring",
    longDescription:
      "Professionele plotkaart module met geavanceerde functies zoals NFC tag integratie, real-time monitoring van BHV voorzieningen, automatische updates en uitgebreide rapportage mogelijkheden.",
    category: "safety",
    version: "3.0.2",
    status: "active",
    pricing: {
      model: "per-building",
      perBuilding: 45,
      perOrganization: 200,
      currency: "EUR",
      billingPeriod: "monthly",
      freeTrialDays: 21,
    },
    features: [
      "NFC tag integratie",
      "Real-time voorziening status",
      "Automatische updates",
      "Multi-verdieping ondersteuning",
      "Zoom en pan functionaliteit",
      "Voorziening categorisatie",
      "Inspectie planning",
      "QR code generatie",
    ],
    requirements: ["Digitale plattegronden (PDF/DWG)", "NFC tags (optioneel)", "Tablet/smartphone voor inspectie"],
    integrations: ["NFC Management", "Inspectie Systeem", "BHV Dashboard", "Rapportage Module"],
    compliance: ["Bouwbesluit", "NEN 2575", "BHV Richtlijnen"],
    screenshots: [
      "/placeholder.svg?height=400&width=600&text=Interactieve+Plotkaart",
      "/placeholder.svg?height=400&width=600&text=NFC+Integratie",
      "/placeholder.svg?height=400&width=600&text=Voorziening+Details",
    ],
    demoUrl: "/bhv/plotkaart",
    documentationUrl: "/docs/plotkaart",
    supportLevel: "standard",
    popularity: 88,
    rating: 4.6,
    reviews: 94,
    lastUpdated: "2024-01-10",
    developer: {
      name: "BHV360 Core Team",
      verified: true,
      support: "Werkdag Support",
    },
    permissions: ["plotkaart.read", "plotkaart.edit", "plotkaart.nfc.manage", "plotkaart.export"],
    dataRetention: 1825, // 5 jaar
    backupIncluded: true,
    slaLevel: "99.9%",
    tags: ["trending", "visueel", "nfc", "inspectie"],
  },
  {
    id: "bhv-coordinator-dashboard",
    name: "BHV Coördinator Dashboard",
    description: "Complete dashboard voor BHV coördinatoren met team management en analytics",
    longDescription:
      "Uitgebreid dashboard speciaal ontworpen voor BHV coördinatoren. Bevat team management, competentie tracking, planning tools, analytics en rapportage functionaliteiten.",
    category: "management",
    version: "2.5.1",
    status: "active",
    pricing: {
      model: "hybrid",
      perUser: 18,
      perOrganization: 250,
      currency: "EUR",
      billingPeriod: "monthly",
      freeTrialDays: 30,
    },
    features: [
      "Team overzicht dashboard",
      "Competentie management",
      "Planning en roostering",
      "Performance analytics",
      "Certificering tracking",
      "Training planning",
      "Incident analyse",
      "Rapportage tools",
    ],
    requirements: ["BHV coördinator rol", "Team van minimaal 5 BHV'ers", "Actuele certificeringen"],
    integrations: ["Gebruikersbeheer", "Training Module", "Incident Management", "Rapportage Systeem"],
    compliance: ["Arbo-wet", "BHV Richtlijnen", "Certificering Eisen"],
    screenshots: [
      "/placeholder.svg?height=400&width=600&text=Coordinator+Dashboard",
      "/placeholder.svg?height=400&width=600&text=Team+Management",
      "/placeholder.svg?height=400&width=600&text=Analytics+View",
    ],
    demoUrl: "/dashboards/bhv-coordinator",
    documentationUrl: "/docs/coordinator",
    supportLevel: "premium",
    popularity: 82,
    rating: 4.7,
    reviews: 73,
    lastUpdated: "2024-01-08",
    developer: {
      name: "BHV360 Core Team",
      verified: true,
      support: "24/7 Premium Support",
    },
    permissions: ["bhv.coordinator.read", "bhv.team.manage", "bhv.analytics.view", "bhv.reports.generate"],
    dataRetention: 2190, // 6 jaar
    backupIncluded: true,
    slaLevel: "99.95%",
    tags: ["management", "analytics", "coordinator", "premium"],
  },
  {
    id: "incident-management",
    name: "Incident Management",
    description: "Complete incident registratie en opvolging met automatische workflows",
    longDescription:
      "Professioneel incident management systeem met automatische workflows, escalatie procedures, rapportage en analyse functionaliteiten. Inclusief mobile app voor snelle incident registratie.",
    category: "safety",
    version: "2.3.0",
    status: "active",
    pricing: {
      model: "per-organization",
      perOrganization: 180,
      currency: "EUR",
      billingPeriod: "monthly",
      freeTrialDays: 14,
    },
    features: [
      "Snelle incident registratie",
      "Automatische workflows",
      "Escalatie procedures",
      "Foto en video upload",
      "Real-time notificaties",
      "Incident analyse",
      "Compliance rapportage",
      "Mobile app",
    ],
    requirements: ["Incident response team", "Smartphone/tablet toegang", "Notificatie systeem"],
    integrations: ["Notificatie Service", "BHV Dashboard", "Rapportage Module", "Email Systeem"],
    compliance: ["Arbo-wet", "Incident Rapportage Verplichtingen", "AVG/GDPR"],
    screenshots: [
      "/placeholder.svg?height=400&width=600&text=Incident+Registratie",
      "/placeholder.svg?height=400&width=600&text=Workflow+Management",
      "/placeholder.svg?height=400&width=600&text=Incident+Analytics",
    ],
    demoUrl: "/incidenten",
    documentationUrl: "/docs/incidents",
    supportLevel: "standard",
    popularity: 76,
    rating: 4.5,
    reviews: 89,
    lastUpdated: "2024-01-12",
    developer: {
      name: "BHV360 Core Team",
      verified: true,
      support: "Werkdag Support",
    },
    permissions: ["incidents.create", "incidents.read", "incidents.update", "incidents.analyze"],
    dataRetention: 3650, // 10 jaar
    backupIncluded: true,
    slaLevel: "99.9%",
    tags: ["incident", "workflow", "mobiel", "rapportage"],
  },
  {
    id: "bezoeker-registratie",
    name: "Bezoeker Registratie",
    description: "Digitale bezoeker registratie met toegangscontrole en veiligheidscheck",
    longDescription:
      "Complete bezoeker registratie module met digitale check-in/out, foto registratie, veiligheidscheck, toegangscontrole en automatische host notificaties.",
    category: "management",
    version: "1.8.0",
    status: "active",
    pricing: {
      model: "per-building",
      perBuilding: 35,
      perOrganization: 150,
      currency: "EUR",
      billingPeriod: "monthly",
      freeTrialDays: 21,
    },
    features: [
      "Digitale check-in/out",
      "Foto registratie",
      "Veiligheidscheck",
      "Host notificaties",
      "Toegangscontrole",
      "Bezoeker badges",
      "Evacuatie lijsten",
      "Privacy compliance",
    ],
    requirements: ["Receptie/ingang bemanning", "Tablet voor registratie", "Badge printer (optioneel)"],
    integrations: ["Toegangscontrole Systeem", "Email Service", "BHV Dashboard", "Evacuatie Module"],
    compliance: ["AVG/GDPR", "Bezoeker Privacy Wet", "Toegangscontrole Richtlijnen"],
    screenshots: [
      "/placeholder.svg?height=400&width=600&text=Bezoeker+Registratie",
      "/placeholder.svg?height=400&width=600&text=Check-in+Process",
      "/placeholder.svg?height=400&width=600&text=Bezoeker+Overzicht",
    ],
    demoUrl: "/visitor-registration",
    documentationUrl: "/docs/visitors",
    supportLevel: "standard",
    popularity: 68,
    rating: 4.3,
    reviews: 52,
    lastUpdated: "2024-01-05",
    developer: {
      name: "BHV360 Core Team",
      verified: true,
      support: "Werkdag Support",
    },
    permissions: ["visitors.register", "visitors.read", "visitors.checkout", "visitors.reports"],
    dataRetention: 30, // 30 dagen (AVG)
    backupIncluded: true,
    slaLevel: "99.9%",
    tags: ["bezoeker", "toegang", "privacy", "receptie"],
  },
  {
    id: "api-integraties",
    name: "API Integraties",
    description: "RESTful API voor integratie met externe systemen en applicaties",
    longDescription:
      "Uitgebreide API suite voor integratie met externe systemen zoals HR systemen, toegangscontrole, brandmeldinstallaties en andere veiligheidssystemen.",
    category: "integration",
    version: "1.5.0",
    status: "active",
    pricing: {
      model: "per-organization",
      perOrganization: 120,
      currency: "EUR",
      billingPeriod: "monthly",
      freeTrialDays: 30,
    },
    features: [
      "RESTful API endpoints",
      "Webhook ondersteuning",
      "Real-time data sync",
      "API documentatie",
      "Rate limiting",
      "Authentication tokens",
      "Error handling",
      "API monitoring",
    ],
    requirements: ["Technische kennis", "Ontwikkelaar toegang", "API keys management"],
    integrations: ["HR Systemen", "Toegangscontrole", "Brandmeldinstallaties", "ERP Systemen"],
    compliance: ["API Security Standards", "OAuth 2.0", "AVG/GDPR"],
    screenshots: [
      "/placeholder.svg?height=400&width=600&text=API+Documentation",
      "/placeholder.svg?height=400&width=600&text=Integration+Dashboard",
      "/placeholder.svg?height=400&width=600&text=API+Monitoring",
    ],
    demoUrl: "/beheer/api-integraties",
    documentationUrl: "/docs/api",
    supportLevel: "premium",
    popularity: 45,
    rating: 4.4,
    reviews: 28,
    lastUpdated: "2024-01-03",
    developer: {
      name: "BHV360 Core Team",
      verified: true,
      support: "Developer Support",
    },
    permissions: ["api.read", "api.write", "api.admin", "webhooks.manage"],
    dataRetention: 365, // 1 jaar
    backupIncluded: false,
    slaLevel: "99.9%",
    tags: ["api", "integratie", "developer", "enterprise"],
  },
  {
    id: "white-label",
    name: "White Label Oplossing",
    description: "Volledig aanpasbare white-label versie voor partners en resellers",
    longDescription:
      "Complete white-label oplossing waarmee partners en resellers het BHV360 platform kunnen aanbieden onder hun eigen merk met volledige customisatie mogelijkheden.",
    category: "integration",
    version: "1.2.0",
    status: "active",
    pricing: {
      model: "per-organization",
      perOrganization: 800,
      currency: "EUR",
      billingPeriod: "monthly",
      freeTrialDays: 60,
    },
    features: [
      "Volledige merk customisatie",
      "Custom domein ondersteuning",
      "Partner dashboard",
      "Klant management",
      "Billing integratie",
      "Support tools",
      "Analytics dashboard",
      "Multi-tenant architectuur",
    ],
    requirements: ["Partner overeenkomst", "Minimum volume commitment", "Technische implementatie"],
    integrations: ["Billing Systemen", "CRM Platforms", "Support Systemen", "Analytics Tools"],
    compliance: ["Partner Agreements", "Data Processing Agreements", "AVG/GDPR"],
    screenshots: [
      "/placeholder.svg?height=400&width=600&text=White+Label+Dashboard",
      "/placeholder.svg?height=400&width=600&text=Brand+Customization",
      "/placeholder.svg?height=400&width=600&text=Partner+Management",
    ],
    demoUrl: "/white-label",
    documentationUrl: "/docs/white-label",
    supportLevel: "premium",
    popularity: 25,
    rating: 4.6,
    reviews: 12,
    lastUpdated: "2023-12-28",
    developer: {
      name: "BHV360 Enterprise Team",
      verified: true,
      support: "Dedicated Account Manager",
    },
    permissions: ["whitelabel.admin", "whitelabel.customize", "whitelabel.billing", "whitelabel.support"],
    dataRetention: 2555, // 7 jaar
    backupIncluded: true,
    slaLevel: "99.99%",
    tags: ["enterprise", "white-label", "partner", "premium"],
  },
]

// Utility functions for module management
export function getModuleById(id: string): ModuleDefinition | undefined {
  return moduleDefinitions.find((module) => module.id === id)
}

export function getModulesByCategory(category: ModuleDefinition["category"]): ModuleDefinition[] {
  return moduleDefinitions.filter((module) => module.category === category)
}

export function getPopularModules(limit = 6): ModuleDefinition[] {
  return moduleDefinitions.sort((a, b) => b.popularity - a.popularity).slice(0, limit)
}

export function getModulesByStatus(status: ModuleDefinition["status"]): ModuleDefinition[] {
  return moduleDefinitions.filter((module) => module.status === status)
}

export function calculateModulePrice(
  module: ModuleDefinition,
  users: number,
  buildings: number,
): {
  model: string
  price: number
  description: string
} {
  const { pricing } = module

  switch (pricing.model) {
    case "per-user":
      return {
        model: "Per Gebruiker",
        price: (pricing.perUser || 0) * users,
        description: `${users} gebruikers × €${pricing.perUser}/maand`,
      }

    case "per-building":
      return {
        model: "Per Gebouw",
        price: (pricing.perBuilding || 0) * buildings,
        description: `${buildings} gebouwen × €${pricing.perBuilding}/maand`,
      }

    case "per-organization":
      return {
        model: "Per Organisatie",
        price: pricing.perOrganization || 0,
        description: `Vaste prijs voor hele organisatie: €${pricing.perOrganization}/maand`,
      }

    case "hybrid":
      const userPrice = (pricing.perUser || 0) * users
      const buildingPrice = (pricing.perBuilding || 0) * buildings
      const orgPrice = pricing.perOrganization || 0

      const cheapest = Math.min(userPrice, buildingPrice, orgPrice)

      if (cheapest === userPrice) {
        return {
          model: "Hybrid (Per Gebruiker)",
          price: userPrice,
          description: `${users} gebruikers × €${pricing.perUser}/maand (goedkoopste optie)`,
        }
      } else if (cheapest === buildingPrice) {
        return {
          model: "Hybrid (Per Gebouw)",
          price: buildingPrice,
          description: `${buildings} gebouwen × €${pricing.perBuilding}/maand (goedkoopste optie)`,
        }
      } else {
        return {
          model: "Hybrid (Per Organisatie)",
          price: orgPrice,
          description: `Vaste prijs: €${pricing.perOrganization}/maand (goedkoopste optie)`,
        }
      }

    default:
      return {
        model: "Onbekend",
        price: 0,
        description: "Prijs op aanvraag",
      }
  }
}

export const moduleCategories = [
  { id: "safety", name: "Veiligheid", icon: "Shield", color: "text-red-600" },
  { id: "management", name: "Management", icon: "Users", color: "text-blue-600" },
  { id: "compliance", name: "Compliance", icon: "FileText", color: "text-green-600" },
  { id: "communication", name: "Communicatie", icon: "MessageSquare", color: "text-purple-600" },
  { id: "analytics", name: "Analytics", icon: "BarChart3", color: "text-orange-600" },
  { id: "integration", name: "Integratie", icon: "Zap", color: "text-yellow-600" },
] as const
