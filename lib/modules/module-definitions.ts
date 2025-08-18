// Compat layer: exports die jouw app verwacht
export type { ModuleDef as Module, ModuleTier, ModuleCategory } from "@/types/shims"

import type { ModuleDef, ModuleTier, ModuleCategory } from "@/types/shims"

export const moduleCategories: ModuleCategory[] = [
  { id: "basis", name: "Basis" },
  { id: "geavanceerd", name: "Geavanceerd" },
  { id: "premium", name: "Premium" },
  { id: "enterprise", name: "Enterprise" },
]

export const tierDefinitions: ModuleTier[] = [
  { id: "starter", name: "Starter" },
  { id: "professional", name: "Professional" },
  { id: "enterprise", name: "Enterprise" },
  { id: "custom", name: "Custom" },
]

export const moduleDefinitions: ModuleDef[] = [
  {
    id: "plotkaart",
    title: "Plotkaart",
    category: "basis",
    tier: "starter",
    pricing: { model: "fixed", basePrice: 29 },
    implemented: true,
    routePath: "/bhv/plotkaart",
    core: true,
    features: ["editor", "pdf-export"],
  },
  {
    id: "incidenten",
    title: "Incidenten",
    category: "basis",
    tier: "starter",
    pricing: { model: "per_user", basePrice: 1.5 },
    implemented: true,
    routePath: "/incidenten",
    core: true,
  },
  {
    id: "bezoeker-registratie",
    title: "Bezoeker Registratie",
    category: "geavanceerd",
    tier: "professional",
    pricing: { model: "per_building", basePrice: 25 },
    implemented: true,
    routePath: "/visitor-registration",
    features: ["check-in", "badges", "notifications"],
  },
  {
    id: "noodprocedures",
    title: "Noodprocedures",
    category: "geavanceerd",
    tier: "professional",
    pricing: { model: "per_user", basePrice: 12 },
    implemented: true,
    routePath: "/bhv/procedures",
    features: ["interactive", "monitoring", "escalation"],
  },
  {
    id: "mobile-app",
    title: "Mobile App",
    category: "premium",
    tier: "enterprise",
    pricing: { model: "per_user", basePrice: 4 },
    implemented: true,
    routePath: "/mobile-app",
    features: ["offline", "push-notifications"],
  },
  {
    id: "api-integration",
    title: "API Integraties",
    category: "enterprise",
    tier: "custom",
    pricing: { model: "fixed", basePrice: 199 },
    implemented: true,
    routePath: "/beheer/api-integraties",
    features: ["rest-api", "webhooks", "custom-integrations"],
  },
]

// alias zoals andere delen verwachten
export const AVAILABLE_MODULES = moduleDefinitions

export function getModuleById(id: string) {
  return moduleDefinitions.find((m) => m.id === id) || null
}

export function getCoreModules() {
  return moduleDefinitions.filter((m) => m.core)
}

export function getVisibleModules() {
  return moduleDefinitions.filter((m) => m.implemented !== false)
}

export function calculateModulePrice(
  tierOrId: ModuleTier | string,
  quantity = 1,
  ctx?: { users?: number; buildings?: number },
) {
  const tierId = typeof tierOrId === "string" ? (tierOrId as any) : tierOrId.id
  return (mod: ModuleDef) => {
    const p = typeof mod.pricing === "number" ? { model: "fixed", basePrice: mod.pricing } : mod.pricing
    const base = p.basePrice
    const mult = (typeof p.tierMultipliers === "object" && p.tierMultipliers?.[tierId as any]) || 1

    switch (p.model) {
      case "per_user": {
        const u = ctx?.users ?? quantity
        return Math.round(base * mult * u * 100) / 100
      }
      case "per_building": {
        const b = ctx?.buildings ?? quantity
        return Math.round(base * mult * b * 100) / 100
      }
      case "per_customer":
        return Math.round(base * mult * quantity * 100) / 100
      default:
        return Math.round(base * mult * 100) / 100
    }
  }
}

export function validateDependencies(defs: ModuleDef[] = moduleDefinitions) {
  const ids = new Set(defs.map((d) => d.id))
  const missing: string[] = []
  return { ok: missing.length === 0, missing }
}
