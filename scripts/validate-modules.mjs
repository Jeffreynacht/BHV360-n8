// scripts/validate-modules.mjs
import { moduleDefinitions, calculateModulePrice, getVisibleModules, validateDependencies } from '../lib/modules/module-definitions.js';

function assertDefined(name, value) {
  if (value === undefined) {
    console.error(`[validate-modules] Missing export: ${name}`);
    process.exit(1);
  }
}

console.log('[validate-modules] Checking required exports...');

assertDefined('moduleDefinitions', moduleDefinitions);
assertDefined('calculateModulePrice', calculateModulePrice);
assertDefined('getVisibleModules', getVisibleModules);

console.log(`[validate-modules] Found ${moduleDefinitions.length} module definitions`);

// Test calculateModulePrice function
try {
  const testModule = moduleDefinitions[0];
  if (testModule) {
    const price = calculateModulePrice(testModule, 10, 1);
    console.log(`[validate-modules] Price calculation test: €${price.price} (${price.model})`);
  }
} catch (error) {
  console.error('[validate-modules] Price calculation failed:', error.message);
  process.exit(1);
}

// Test getVisibleModules function
try {
  const visibleModules = getVisibleModules();
  console.log(`[validate-modules] Found ${visibleModules.length} visible modules`);
} catch (error) {
  console.error('[validate-modules] getVisibleModules failed:', error.message);
  process.exit(1);
}

// Validate dependencies
const validation = validateDependencies(moduleDefinitions);
if (!validation.ok) {
  console.error('[validate-modules] Missing dependencies:', validation.missing.join(', '));
  process.exit(1);
}

console.log('[validate-modules] ✅ All validations passed!');
