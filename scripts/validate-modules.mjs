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
  getModulesByCategory,
  getModulesByTier,
  calculateTotalPrice
} from "../lib/modules/module-definitions.js";

function must(name, v) {
  if (v === undefined) {
    console.error(`[validate] Missing export: ${name}`);
    process.exit(1);
  }
}

// Validate all required exports
must('AVAILABLE_MODULES', AVAILABLE_MODULES);
must('moduleDefinitions', moduleDefinitions);
must('moduleCategories', moduleCategories);
must('tierDefinitions', tierDefinitions);
must('calculateModulePrice', calculateModulePrice);
must('getVisibleModules', getVisibleModules);
must('getModuleById', getModuleById);
must('getCoreModules', getCoreModules);
must('validateDependencies', validateDependencies);
must('getModulesByCategory', getModulesByCategory);
must('getModulesByTier', getModulesByTier);
must('calculateTotalPrice', calculateTotalPrice);

// Validate dependencies
const deps = validateDependencies();
if (!deps.ok) {
  console.error("[validate] Missing dependencies:", deps.missing);
  process.exit(1);
}

// Validate data integrity
if (moduleDefinitions.length === 0) {
  console.error("[validate] No modules defined");
  process.exit(1);
}

if (moduleCategories.length === 0) {
  console.error("[validate] No categories defined");
  process.exit(1);
}

if (tierDefinitions.length === 0) {
  console.error("[validate] No tiers defined");
  process.exit(1);
}

// Test function calls
try {
  const visibleModules = getVisibleModules();
  const coreModules = getCoreModules();
  const testModule = getModuleById('plotkaart-core');
  
  if (testModule) {
    const price = calculateModulePrice(testModule, { tier: 'professional', users: 10 });
    console.log(`[validate] Test calculation: ${testModule.name} = €${price}`);
  }
  
  console.log(`[validate] ✅ All exports present and functional`);
  console.log(`[validate] ✅ ${moduleDefinitions.length} modules defined`);
  console.log(`[validate] ✅ ${visibleModules.length} visible modules`);
  console.log(`[validate] ✅ ${coreModules.length} core modules`);
  console.log(`[validate] ✅ Dependencies validated`);
} catch (error) {
  console.error("[validate] Runtime error:", error.message);
  process.exit(1);
}
