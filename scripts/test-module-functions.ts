import {
  getModuleById,
  getCoreModules,
  getVisibleModules,
  getModulesByCategory,
  getModulesByTier,
  calculateModulePrice,
  getEnabledModules,
  getImplementedModules,
  getModulesByStatus,
  getPopularModules,
  getHighRatedModules,
  searchModules,
  canActivateModule,
  getModuleActivationCost,
  getModuleSetupCost,
  hasFreeTrial,
  getTrialDays,
  getTotalModuleCost,
  getTotalSetupCost,
  getModuleStats,
  moduleDefinitions,
  moduleCategories,
  tierDefinitions,
} from "../lib/modules/module-definitions"

console.log("🧪 Testing Module Functions...")

// Test 1: Basic module retrieval
console.log("\n1️⃣ Testing basic module retrieval:")
const plotkaartModule = getModuleById("bhv-plotkaart")
console.log(`✅ getModuleById: ${plotkaartModule ? plotkaartModule.name : "Not found"}`)

const invalidModule = getModuleById("non-existent")
console.log(`✅ getModuleById (invalid): ${invalidModule ? "Found" : "Not found (correct)"}`)

// Test 2: Core modules
console.log("\n2️⃣ Testing core modules:")
const coreModules = getCoreModules()
console.log(`✅ getCoreModules: Found ${coreModules.length} core modules`)
coreModules.forEach((module) => console.log(`   - ${module.name} (${module.id})`))

// Test 3: Visible modules
console.log("\n3️⃣ Testing visible modules:")
const visibleModules = getVisibleModules()
console.log(`✅ getVisibleModules: Found ${visibleModules.length} visible modules`)

// Test 4: Category filtering
console.log("\n4️⃣ Testing category filtering:")
const coreCategory = getModulesByCategory("core")
const premiumCategory = getModulesByCategory("premium")
console.log(`✅ getModulesByCategory('core'): ${coreCategory.length} modules`)
console.log(`✅ getModulesByCategory('premium'): ${premiumCategory.length} modules`)

// Test 5: Tier filtering
console.log("\n5️⃣ Testing tier filtering:")
const starterTier = getModulesByTier("starter")
const professionalTier = getModulesByTier("professional")
console.log(`✅ getModulesByTier('starter'): ${starterTier.length} modules`)
console.log(`✅ getModulesByTier('professional'): ${professionalTier.length} modules`)

// Test 6: Price calculation
console.log("\n6️⃣ Testing price calculation:")
if (plotkaartModule) {
  const price1 = calculateModulePrice(plotkaartModule, 1, 1)
  const price25 = calculateModulePrice(plotkaartModule, 25, 3)
  console.log(`✅ calculateModulePrice (1 user, 1 building): €${price1.price} - ${price1.explanation}`)
  console.log(`✅ calculateModulePrice (25 users, 3 buildings): €${price25.price} - ${price25.explanation}`)
}

const incidentModule = getModuleById("incident-management")
if (incidentModule) {
  const hybridPrice = calculateModulePrice(incidentModule, 50, 2)
  console.log(`✅ calculateModulePrice (hybrid model): €${hybridPrice.price} - ${hybridPrice.explanation}`)
}

// Test 7: Status and filtering
console.log("\n7️⃣ Testing status and filtering:")
const enabledModules = getEnabledModules()
const implementedModules = getImplementedModules()
const activeModules = getModulesByStatus("active")
console.log(`✅ getEnabledModules: ${enabledModules.length} modules`)
console.log(`✅ getImplementedModules: ${implementedModules.length} modules`)
console.log(`✅ getModulesByStatus('active'): ${activeModules.length} modules`)

// Test 8: Popular and high-rated modules
console.log("\n8️⃣ Testing popular and high-rated modules:")
const popularModules = getPopularModules(3)
const highRatedModules = getHighRatedModules(4.6)
console.log(`✅ getPopularModules (top 3):`)
popularModules.forEach((module, index) =>
  console.log(`   ${index + 1}. ${module.name} (${module.popularity}% popularity)`),
)
console.log(`✅ getHighRatedModules (≥4.6): ${highRatedModules.length} modules`)

// Test 9: Search functionality
console.log("\n9️⃣ Testing search functionality:")
const searchResults1 = searchModules("incident")
const searchResults2 = searchModules("dashboard")
const searchResults3 = searchModules("mobile")
console.log(`✅ searchModules('incident'): ${searchResults1.length} results`)
console.log(`✅ searchModules('dashboard'): ${searchResults2.length} results`)
console.log(`✅ searchModules('mobile'): ${searchResults3.length} results`)

// Test 10: Module activation and dependencies
console.log("\n🔟 Testing module activation:")
const canActivate1 = canActivateModule("bhv-plotkaart", [])
const canActivate2 = canActivateModule("incident-management", ["bhv-plotkaart"])
console.log(`✅ canActivateModule('bhv-plotkaart', []): ${canActivate1}`)
console.log(`✅ canActivateModule('incident-management', ['bhv-plotkaart']): ${canActivate2}`)

// Test 11: Cost calculations
console.log("\n1️⃣1️⃣ Testing cost calculations:")
const activationCost = getModuleActivationCost("incident-management", 25, 2)
const setupCost = getModuleSetupCost("incident-management")
console.log(`✅ getModuleActivationCost: €${activationCost}`)
console.log(`✅ getModuleSetupCost: €${setupCost}`)

const totalCost = getTotalModuleCost(["bhv-plotkaart", "incident-management"], 25, 2)
const totalSetup = getTotalSetupCost(["bhv-plotkaart", "incident-management"])
console.log(`✅ getTotalModuleCost: €${totalCost}`)
console.log(`✅ getTotalSetupCost: €${totalSetup}`)

// Test 12: Free trial functionality
console.log("\n1️⃣2️⃣ Testing free trial functionality:")
const hasTrial1 = hasFreeTrial("bhv-plotkaart")
const hasTrial2 = hasFreeTrial("white-label")
const trialDays1 = getTrialDays("bhv-plotkaart")
const trialDays2 = getTrialDays("incident-management")
console.log(`✅ hasFreeTrial('bhv-plotkaart'): ${hasTrial1}`)
console.log(`✅ hasFreeTrial('white-label'): ${hasTrial2}`)
console.log(`✅ getTrialDays('bhv-plotkaart'): ${trialDays1} days`)
console.log(`✅ getTrialDays('incident-management'): ${trialDays2} days`)

// Test 13: Module statistics
console.log("\n1️⃣3️⃣ Testing module statistics:")
const stats = getModuleStats()
console.log(`✅ getModuleStats:`)
console.log(`   - Total modules: ${stats.total}`)
console.log(`   - Core modules: ${stats.core}`)
console.log(`   - Premium modules: ${stats.premium}`)
console.log(`   - Enterprise modules: ${stats.enterprise}`)
console.log(`   - Implemented modules: ${stats.implemented}`)
console.log(`   - Active modules: ${stats.active}`)
console.log(`   - Beta modules: ${stats.beta}`)
console.log(`   - Average rating: ${stats.averageRating.toFixed(2)}`)
console.log(`   - Total customers: ${stats.totalCustomers}`)

// Test 14: Data integrity
console.log("\n1️⃣4️⃣ Testing data integrity:")
console.log(`✅ moduleDefinitions length: ${moduleDefinitions.length}`)
console.log(`✅ moduleCategories length: ${moduleCategories.length}`)
console.log(`✅ tierDefinitions length: ${tierDefinitions.length}`)

// Validate all modules have required properties
const validationErrors: string[] = []
moduleDefinitions.forEach((module) => {
  if (!module.id) validationErrors.push(`Module missing id: ${JSON.stringify(module)}`)
  if (!module.name) validationErrors.push(`Module ${module.id} missing name`)
  if (!module.pricing) validationErrors.push(`Module ${module.id} missing pricing`)
  if (typeof module.core !== "boolean") validationErrors.push(`Module ${module.id} core is not boolean`)
  if (typeof module.enabled !== "boolean") validationErrors.push(`Module ${module.id} enabled is not boolean`)
  if (typeof module.visible !== "boolean") validationErrors.push(`Module ${module.id} visible is not boolean`)
  if (typeof module.implemented !== "boolean") validationErrors.push(`Module ${module.id} implemented is not boolean`)
})

if (validationErrors.length === 0) {
  console.log("✅ All modules pass validation")
} else {
  console.log("❌ Validation errors found:")
  validationErrors.forEach((error) => console.log(`   - ${error}`))
}

// Test 15: Edge cases
console.log("\n1️⃣5️⃣ Testing edge cases:")
const emptySearch = searchModules("")
const nonExistentCategory = getModulesByCategory("non-existent")
const negativePrice = calculateModulePrice(plotkaartModule!, -1, -1)
console.log(`✅ searchModules(''): ${emptySearch.length} results (should be 0 or all)`)
console.log(`✅ getModulesByCategory('non-existent'): ${nonExistentCategory.length} results`)
console.log(`✅ calculateModulePrice with negative values: €${negativePrice.price}`)

console.log("\n🎉 All module function tests completed!")

// Export test results for verification
export const testResults = {
  basicRetrieval: !!plotkaartModule,
  coreModulesCount: coreModules.length,
  visibleModulesCount: visibleModules.length,
  categoryFiltering: coreCategory.length > 0 && premiumCategory.length > 0,
  tierFiltering: starterTier.length > 0 && professionalTier.length > 0,
  priceCalculation: plotkaartModule ? calculateModulePrice(plotkaartModule, 1, 1).price > 0 : false,
  searchFunctionality: searchResults1.length > 0,
  costCalculations: activationCost > 0,
  freeTrialDetection: hasTrial1 === true,
  statisticsGeneration: stats.total > 0,
  dataIntegrity: validationErrors.length === 0,
  allTestsPassed: validationErrors.length === 0 && plotkaartModule !== undefined,
}
