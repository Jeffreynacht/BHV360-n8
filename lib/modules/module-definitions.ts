export type ModuleTier = "starter" | "professional" | "enterprise" | "custom"
export type ModuleCategory = "basis" | "geavanceerd" | "premium" | "enterprise"

export interface ModuleDef {
  key: string
  name: string
  category: ModuleCategory
  description?: string
  enabledByDefault?: boolean
  visible?: boolean // standaard true
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
    key: "plotkaart-core",
    name: "Plotkaart Core",
    category: "basis",
    description: "Kernfunctionaliteit voor BHV-plotkaarten",
    enabledByDefault: true,
    visible: true,
    pricing: { model: "fixed", basePrice: 49, tierMultipliers: { professional: 1.2, enterprise: 1.5 } },
  },
  {
    key: "incident-manager",
    name: "Incident Manager",
    category: "geavanceerd",
    description: "Realtime incidentafhandeling en logging",
    visible: true,
    pricing: { model: "per_user", basePrice: 3, tierMultipliers: { professional: 1.1, enterprise: 1.3 } },
    dependsOn: ["plotkaart-core"],
  },
  {
    key: "export-pdf",
    name: "PDF Export",
    category: "basis",
    visible: true,
    pricing: { model: "fixed", basePrice: 15 },
  },
  {
    key: "nfc-tags",
    name: "NFC Tags",
    category: "premium",
    visible: true,
    pricing: { model: "per_building", basePrice: 5 },
  },
  {
    key: "advanced-reporting",
    name: "Advanced Reporting",
    category: "premium",
    visible: true,
    pricing: { model: "per_user", basePrice: 2 },
    dependsOn: ["plotkaart-core"],
  },
  {
    key: "white-label",
    name: "White Label",
    category: "enterprise",
    visible: true,
    pricing: { model: "fixed", basePrice: 199 },
  },
]

export function calculateModulePrice(
  mod: ModuleDef,
  opts: { tier?: ModuleTier; users?: number; buildings?: number; customers?: number } = {},
): number {
  const tier = opts.tier ?? "starter"
  const mult = mod.pricing.tierMultipliers?.[tier] ?? 1
  const base = mod.pricing.basePrice * mult

  switch (mod.pricing.model) {
    case "fixed":
      return base
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

export function getVisibleModules(defs: ModuleDef[] = moduleDefinitions): ModuleDef[] {
  return defs.filter((m) => m.visible !== false)
}

export function validateDependencies(defs: ModuleDef[] = moduleDefinitions): { ok: boolean; missing: string[] } {
  const keys = new Set(defs.map((d) => d.key))
  const missing: string[] = []
  for (const d of defs) {
    for (const dep of d.dependsOn ?? []) {
      if (!keys.has(dep)) {
        missing.push(`${d.key} -> ${dep}`)
      }
    }
  }
  return { ok: missing.length === 0, missing }
}

// Additional helper functions
export function getModulesByCategory(category: ModuleCategory, defs: ModuleDef[] = moduleDefinitions): ModuleDef[] {
  return defs.filter((m) => m.category === category)
}

export function getModuleByKey(key: string, defs: ModuleDef[] = moduleDefinitions): ModuleDef | undefined {
  return defs.find((m) => m.key === key)
}

export function calculateTotalPrice(
  moduleKeys: string[],
  opts: { tier?: ModuleTier; users?: number; buildings?: number; customers?: number } = {},
  defs: ModuleDef[] = moduleDefinitions,
): number {
  return moduleKeys.reduce((total, key) => {
    const mod = getModuleByKey(key, defs)
    return total + (mod ? calculateModulePrice(mod, opts) : 0)
  }, 0)
}
