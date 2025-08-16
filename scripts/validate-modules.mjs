// scripts/validate-modules.mjs
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

async function validateModules() {
  try {
    // Import the module definitions
    const { 
      moduleDefinitions, 
      calculateModulePrice, 
      getVisibleModules, 
      validateDependencies,
      moduleCategories,
      tierDefinitions
    } = await import('../lib/modules/module-definitions.js');

    function assertDefined(name, value) {
      if (value === undefined) {
        console.error(`[validate-modules] Missing export: ${name}`);
        process.exit(1);
      }
    }

    // Check all required exports
    assertDefined('moduleDefinitions', moduleDefinitions);
    assertDefined('calculateModulePrice', calculateModulePrice);
    assertDefined('getVisibleModules', getVisibleModules);
    assertDefined('validateDependencies', validateDependencies);
    assertDefined('moduleCategories', moduleCategories);
    assertDefined('tierDefinitions', tierDefinitions);

    // Validate dependencies
    const validation = validateDependencies(moduleDefinitions);
    if (!validation.ok) {
      console.error('[validate-modules] Missing dependencies:', validation.missing.join(', '));
      process.exit(1);
    }

    // Test basic functionality
    const visibleModules = getVisibleModules(moduleDefinitions);
    if (visibleModules.length === 0) {
      console.error('[validate-modules] No visible modules found');
      process.exit(1);
    }

    // Test price calculation
    const testModule = moduleDefinitions[0];
    if (testModule) {
      const price = calculateModulePrice(testModule, { tier: 'starter', users: 10 });
      if (typeof price !== 'number' || price < 0) {
        console.error('[validate-modules] Price calculation failed');
        process.exit(1);
      }
    }

    console.log('[validate-modules] ✅ All validations passed');
    console.log(`[validate-modules] Found ${moduleDefinitions.length} modules, ${visibleModules.length} visible`);
    
  } catch (error) {
    console.error('[validate-modules] Import error:', error.message);
    process.exit(1);
  }
}

validateModules();
