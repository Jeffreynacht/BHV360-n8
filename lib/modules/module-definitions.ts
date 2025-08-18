// Compatibility layer: exports that your app expects
export type { ModuleDef as Module, ModuleTier, ModuleCategory } from "@/types/shims"

import type { ModuleDef, ModuleTier, ModuleCategory } from "@/types/shims"

export const moduleCategories: ModuleCategory[] = [
  { id: "basis", name: "Basis", description: "Essentiële BHV functionaliteiten" },
  { id: "geavanceerd", name: "Geavanceerd", description: "Uitgebreide BHV tools" },
  { id: "premium", name: "Premium", description: "Premium BHV oplossingen" },
  { id: "enterprise", name: "Enterprise", description: "Enterprise BHV suite" },
]

export const tierDefinitions: ModuleTier[] = [
  {
    id: "starter",
    name: "Starter",
    description: "Voor kleine organisaties",
    priceRange: "€0-50/maand",
    features: ["Basis functionaliteit", "Email support"],
  },
  {
    id: "professional",
    name: "Professional",
    description: "Voor middelgrote organisaties",
    priceRange: "€50-200/maand",
    features: ["Uitgebreide functionaliteit", "Telefoon support", "Integraties"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Voor grote organisaties",
    priceRange: "€200+/maand",
    features: ["Volledige functionaliteit", "24/7 support", "Custom integraties", "SLA"],
  },
  {
    id: "custom",
    name: "Custom",
    description: "Op maat gemaakte oplossing",
    priceRange: "Op aanvraag",
    features: ["Maatwerk", "Dedicated support", "Custom ontwikkeling"],
  },
]

export const moduleDefinitions: ModuleDef[] = [
  {
    id: "plotkaart",
    title: "Plotkaart Editor",
    description: "Interactieve plotkaart editor voor BHV procedures",
    category: "basis",
    tier: "starter",
    pricing: { model: "fixed", basePrice: 29 },
    implemented: true,
    routePath: "/bhv/plotkaart",
    core: true,
    features: ["Drag & drop editor", "PDF export", "Symbolen bibliotheek"],
    rating: 4.8,
    reviews: 156,
    popularity: 95,
    version: "2.1.0",
    status: "ga",
  },
  {
    id: "incidenten",
    title: "Incident Management",
    description: "Realtime incident registratie en afhandeling",
    category: "basis",
    tier: "starter",
    pricing: { model: "per_user", basePrice: 1.5 },
    implemented: true,
    routePath: "/incidenten",
    core: true,
    features: ["Realtime meldingen", "Incident logging", "Rapportage"],
    rating: 4.6,
    reviews: 89,
    popularity: 87,
    version: "1.8.2",
    status: "ga",
  },
  {
    id: "bhv-aanwezigheid",
    title: "BHV Aanwezigheid",
    description: "Overzicht van aanwezige BHV'ers",
    category: "basis",
    tier: "starter",
    pricing: { model: "per_user", basePrice: 2.0 },
    implemented: true,
    routePath: "/bhv-aanwezigheid",
    core: true,
    features: ["Realtime status", "Check-in/out", "Mobiele app"],
    rating: 4.7,
    reviews: 124,
    popularity: 82,
    version: "1.5.1",
    status: "ga",
  },
  {
    id: "voorzieningen",
    title: "Voorzieningen Beheer",
    description: "Beheer van BHV voorzieningen en materiaal",
    category: "geavanceerd",
    tier: "professional",
    pricing: { model: "per_building", basePrice: 15 },
    implemented: true,
    routePath: "/beheer/voorzieningen",
    features: ["Inventaris beheer", "Onderhoudsplanning", "QR codes"],
    rating: 4.5,
    reviews: 67,
    popularity: 74,
    version: "1.3.0",
    status: "ga",
  },
  {
    id: "rapportages",
    title: "Rapportages & Analytics",
    description: "Uitgebreide rapportages en analyses",
    category: "geavanceerd",
    tier: "professional",
    pricing: { model: "fixed", basePrice: 75 },
    implemented: true,
    routePath: "/beheer/rapportages",
    features: ["Dashboard", "Custom rapporten", "Data export"],
    rating: 4.4,
    reviews: 43,
    popularity: 68,
    version: "1.2.3",
    status: "ga",
  },
  {
    id: "nfc-integratie",
    title: "NFC Integratie",
    description: "NFC tags voor snelle check-in en locatie tracking",
    category: "premium",
    tier: "enterprise",
    pricing: { model: "per_user", basePrice: 3.5 },
    implemented: true,
    routePath: "/nfc-scan",
    features: ["NFC scanning", "Locatie tracking", "Automatische check-in"],
    rating: 4.3,
    reviews: 28,
    popularity: 45,
    version: "0.9.1",
    status: "beta",
  },
  {
    id: "api-integraties",
    title: "API Integraties",
    description: "Integraties met externe systemen",
    category: "enterprise",
    tier: "enterprise",
    pricing: { model: "fixed", basePrice: 150 },
    implemented: true,
    routePath: "/beheer/api-integraties",
    features: ["REST API", "Webhooks", "Custom integraties"],
    rating: 4.2,
    reviews: 15,
    popularity: 32,
    version: "1.0.0",
    status: "ga",
  },
  {
    id: "white-label",
    title: "White Label",
    description: "Volledig aangepaste branding voor partners",
    category: "enterprise",
    tier: "custom",
    pricing: { model: "per_customer", basePrice: 500 },
    implemented: true,
    routePath: "/white-label",
    features: ["Custom branding", "Partner portal", "Multi-tenant"],
    rating: 4.9,
    reviews: 8,
    popularity: 18,
    version: "2.0.0",
    status: "ga",
  },
]

// Alias zoals andere delen verwachten
export const AVAILABLE_MODULES = moduleDefinitions

export function getModuleById(id: string): ModuleDef | null {
  return moduleDefinitions.find((m) => m.id === id) || null
}

export function getCoreModules(): ModuleDef[] {
  return moduleDefinitions.filter((m) => m.core)
}

export function getVisibleModules(): ModuleDef[] {
  return moduleDefinitions.filter((m) => m.implemented !== false)
}

export function getModulesByCategory(categoryId: string): ModuleDef[] {
  return moduleDefinitions.filter((m) => {
    const cat = typeof m.category === "string" ? m.category : m.category.id
    return cat === categoryId
  })
}

export function getModulesByTier(tierId: string): ModuleDef[] {
  return moduleDefinitions.filter((m) => {
    const tier = typeof m.tier === "string" ? m.tier : m.tier?.id
    return tier === tierId
  })
}

export function calculateModulePrice(
  tierOrId: ModuleTier | string,
  quantity = 1,
  ctx?: { users?: number; buildings?: number; customers?: number },
) {
  const tierId = typeof tierOrId === "string" ? tierOrId : tierOrId.id

  return (mod: ModuleDef) => {
    const p = typeof mod.pricing === "number" ? { model: "fixed" as const, basePrice: mod.pricing } : mod.pricing

    const base = p.basePrice
    const mult = (typeof p.tierMultipliers === "object" && p.tierMultipliers?.[tierId as any]) || 1

    switch (p.model) {
      case "per_user": {
        const users = ctx?.users ?? quantity
        return Math.round(base * mult * users * 100) / 100
      }
      case "per_building": {
        const buildings = ctx?.buildings ?? quantity
        return Math.round(base * mult * buildings * 100) / 100
      }
      case "per_customer": {
        const customers = ctx?.customers ?? quantity
        return Math.round(base * mult * customers * 100) / 100
      }
      default:
        return Math.round(base * mult * 100) / 100
    }
  }
}

export function getModulePriceForTier(
  moduleId: string,
  tierId: string,
  context?: { users?: number; buildings?: number; customers?: number },
): number {
  const module = getModuleById(moduleId)
  if (!module) return 0

  const calculator = calculateModulePrice(tierId, 1, context)
  return calculator(module)
}

// Export types for compatibility
export type ModuleDefinition = ModuleDef
export type { ModuleDef }
