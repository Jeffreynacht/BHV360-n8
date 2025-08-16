import {
  AVAILABLE_MODULES,
  moduleDefinitions,
  moduleCategories,
  tierDefinitions,
  calculateModulePrice,
  getVisibleModules,
  getModuleById,
  getCoreModules,
  validateDependencies
} from '../lib/modules/module-definitions.js';

function assertPresent(name, v) {
  if (v === undefined) { console.error(`[validate] Missing export: ${name}`); process.exit(1); }
}

console.log('[validate-modules] Checking all required exports...');

assertPresent('AVAILABLE_MODULES', AVAILABLE_MODULES);
assertPresent('moduleDefinitions', moduleDefinitions);
assertPresent('moduleCategories', moduleCategories);
assertPresent('tierDefinitions', tierDefinitions);
assertPresent('calculateModulePrice', calculateModulePrice);
assertPresent('getVisibleModules', getVisibleModules);
assertPresent('getModuleById', getModuleById);
assertPresent('getCoreModules', getCoreModules);

console.log('[validate-modules] All exports found ✅');

// Test basic functionality
console.log('[validate-modules] Testing functionality...');

if (!Array.isArray(moduleDefinitions) || moduleDefinitions.length === 0) {
  console.error('[validate] moduleDefinitions should be non-empty array');
  process.exit(1);
}

if (!Array.isArray(moduleCategories) || moduleCategories.length === 0) {
  console.error('[validate] moduleCategories should be non-empty array');
  process.exit(1);
}

if (!Array.isArray(tierDefinitions) || tierDefinitions.length === 0) {
  console.error('[validate] tierDefinitions should be non-empty array');
  process.exit(1);
}

// Test functions
const visibleModules = getVisibleModules();
const coreModules = getCoreModules();
const testModule = getModuleById('plotkaart-core');

if (!testModule) {
  console.error('[validate] getModuleById failed to find test module');
  process.exit(1);
}

const price = calculateModulePrice(testModule, { tier: 'starter', users: 10 });
if (typeof price !== 'number' || price < 0) {
  console.error('[validate] calculateModulePrice should return positive number');
  process.exit(1);
}

// Validate dependencies
const deps = validateDependencies();
if (!deps.ok) { 
  console.error('[validate] Missing deps:', deps.missing); 
  process.exit(1); 
}

console.log(`[validate-modules] Found ${moduleDefinitions.length} modules`);
console.log(`[validate-modules] Found ${visibleModules.length} visible modules`);
console.log(`[validate-modules] Found ${coreModules.length} core modules`);
console.log(`[validate-modules] Price calculation test: €${price.toFixed(2)}`);
console.log('[validate-modules] OK ✅ Modules & deps in order.');
