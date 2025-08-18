export type ModuleTier = "starter" | "professional" | "enterprise" | "custom"
export type ModuleCategory = "basis" | "geavanceerd" | "premium" | "enterprise"

export interface ModuleDef {
  id: string
  name: string
  category: ModuleCategory
  description?: string
  core?: boolean
  visible?: boolean
  pricing: {
    model: "fixed" | "per_user" | "per_building" | "per_customer"
    basePrice: number
    tierMultipliers?: Partial<Record<ModuleTier, number>>
  }
  dependsOn?: string[]
}

export const moduleCategories: ModuleCategory[] = ["basis", "geavanceerd", "premium", "enterprise"]

export const tierDefinitions: ModuleTier[] = ["starter", "professional", "enterprise", "custom"]

export const moduleDefinitions: ModuleDef[] = [
  {
    id: "plotkaart-core",
    name: "Plotkaart Core",
    category: "basis",
    description: "Kernfunctionaliteit voor BHV-plotkaarten",
    core: true,
    visible: true,
    pricing: {
      model: "fixed",
      basePrice: 49,
      tierMultipliers: {
        professional: 1.2,
        enterprise: 1.5,
      },
    },
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
  },
  {
    id: "export-pdf",
    name: "PDF Export",
    category: "basis",
    description: "Export plotkaarten naar PDF",
    visible: true,
    pricing: {
      model: "fixed",
      basePrice: 15,
    },
  },
  {
    id: "nfc-tags",
    name: "NFC Tags",
    category: "premium",
    description: "NFC tag integratie voor locatiebepaling",
    visible: true,
    pricing: {
      model: "per_building",
      basePrice: 5,
    },
  },
  {
    id: "advanced-reporting",
    name: "Geavanceerde Rapportages",
    category: "premium",
    description: "Uitgebreide rapportage en analytics",
    visible: true,
    pricing: {
      model: "per_user",
      basePrice: 8,
      tierMultipliers: {
        professional: 1.2,
        enterprise: 1.4,
      },
    },
  },
  {
    id: "api-integration",
    name: "API Integraties",
    category: "enterprise",
    description: "Externe systeem integraties via API",
    visible: true,
    pricing: {
      model: "fixed",
      basePrice: 199,
      tierMultipliers: {
        enterprise: 1.0,
        custom: 1.5,
      },
    },
  },
]

// Alias die sommige onderdelen verwachten
export const AVAILABLE_MODULES = moduleDefinitions

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
  const ids = new Set(defs.map((d) => d.id))
  const missing: string[] = []

  for (const d of defs) {
    for (const dep of d.dependsOn ?? []) {
      if (!ids.has(dep)) {
        missing.push(`${d.id} -> ${dep}`)
      }
    }
  }

  return { ok: missing.length === 0, missing }
}

// Additional utility functions that might be expected
export function getModulesByCategory(category: ModuleCategory) {
  return moduleDefinitions.filter((m) => m.category === category)
}

export function getModulesByTier(tier: ModuleTier) {
  return moduleDefinitions.filter(
    (m) => m.pricing.tierMultipliers && Object.keys(m.pricing.tierMultipliers).includes(tier),
  )
}

export function calculateTotalPrice(
  moduleIds: string[],
  opts: { tier?: ModuleTier; users?: number; buildings?: number; customers?: number } = {},
): number {
  return moduleIds.reduce((total, id) => {
    const mod = getModuleById(id)
    if (!mod) return total
    return total + calculateModulePrice(mod, opts)
  }, 0)
}
