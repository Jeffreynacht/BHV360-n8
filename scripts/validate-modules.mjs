import {
  AVAILABLE_MODULES,
  moduleDefinitions,
  moduleCategories,
  tierDefinitions,
  calculateModulePrice,
  getVisibleModules,
  getModuleById,
  getCoreModules,
  validateDependencies,
} from "../lib/modules/module-definitions.js"

function must(name, v) {
  if (v === undefined) {
    console.error("[validate] Missing export:", name)
    process.exit(1)
  }
}

must("AVAILABLE_MODULES", AVAILABLE_MODULES)
must("moduleDefinitions", moduleDefinitions)
must("moduleCategories", moduleCategories)
must("tierDefinitions", tierDefinitions)
must("calculateModulePrice", calculateModulePrice)
must("getVisibleModules", getVisibleModules)
must("getModuleById", getModuleById)
must("getCoreModules", getCoreModules)

const deps = validateDependencies()
if (!deps.ok) {
  console.error("[validate] Missing deps:", deps.missing)
  process.exit(1)
}

console.log("[validate] OK ✅ Modules & deps in order.")
