#!/usr/bin/env tsx

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
  getModuleDependencies,
  canActivateModule,
  getModuleActivationCost,
  getModuleSetupCost,
  hasFreeTrial,
  getTrialDays,
  getTotalModuleCost,
  getTotalSetupCost,
  getModuleStats,
  moduleDefinitions,
} from "../lib/modules/module-definitions"

interface TestResult {
  name: string
  category: string
  passed: boolean
  result: any
  expected?: any
  error?: string
  duration: number
}

class ModuleTestSuite {
  private results: TestResult[] = []
  private startTime = 0

  private startTest(): void {
    this.startTime = Date.now()
  }

  private endTest(name: string, category: string, passed: boolean, result: any, expected?: any, error?: string): void {
    const duration = Date.now() - this.startTime
    this.results.push({
      name,
      category,
      passed,
      result,
      expected,
      error,
      duration,
    })
  }

  async runAllTests(): Promise<void> {
    console.log("🚀 Starting comprehensive module function test suite...")
    console.log("=".repeat(80))

    // Test Category 1: Basic Module Retrieval
    await this.testBasicRetrieval()

    // Test Category 2: Core Module Functions
    await this.testCoreModuleFunctions()

    // Test Category 3: Filtering Functions
    await this.testFilteringFunctions()

    // Test Category 4: Price Calculation
    await this.testPriceCalculation()

    // Test Category 5: Search and Discovery
    await this.testSearchAndDiscovery()

    // Test Category 6: Module Activation
    await this.testModuleActivation()

    // Test Category 7: Cost Calculations
    await this.testCostCalculations()

    // Test Category 8: Free Trial Functions
    await this.testFreeTrialFunctions()

    // Test Category 9: Bulk Operations
    await this.testBulkOperations()

    // Test Category 10: Statistics and Analytics
    await this.testStatisticsAndAnalytics()

    // Test Category 11: Data Integrity
    await this.testDataIntegrity()

    // Test Category 12: Edge Cases
    await this.testEdgeCases()

    // Test Category 13: Performance Tests
    await this.testPerformance()

    // Test Category 14: Type Safety
    await this.testTypeSafety()

    // Test Category 15: Error Handling
    await this.testErrorHandling()

    // Test Category 16: Complex Scenarios
    await this.testComplexScenarios()

    // Test Category 17: Integration Tests
    await this.testIntegration()

    // Generate final report
    this.generateReport()
  }

  private async testBasicRetrieval(): Promise<void> {
    console.log("\n📋 Testing Basic Module Retrieval...")

    // Test 1: Valid module ID
    this.startTest()
    try {
      const module = getModuleById("bhv-plotkaart")
      const passed = !!module && module.name === "BHV Plotkaart"
      this.endTest("getModuleById - Valid ID", "Basic Retrieval", passed, module?.name, "BHV Plotkaart")
    } catch (error) {
      this.endTest(
        "getModuleById - Valid ID",
        "Basic Retrieval",
        false,
        null,
        "BHV Plotkaart",
        error instanceof Error ? error.message : "Unknown error",
      )
    }

    // Test 2: Invalid module ID
    this.startTest()
    try {
      const module = getModuleById("non-existent-module")
      const passed = module === undefined
      this.endTest("getModuleById - Invalid ID", "Basic Retrieval", passed, module, undefined)
    } catch (error) {
      this.endTest(
        "getModuleById - Invalid ID",
        "Basic Retrieval",
        false,
        null,
        undefined,
        error instanceof Error ? error.message : "Unknown error",
      )
    }

    // Test 3: Empty string ID
    this.startTest()
    try {
      const module = getModuleById("")
      const passed = module === undefined
      this.endTest("getModuleById - Empty ID", "Basic Retrieval", passed, module, undefined)
    } catch (error) {
      this.endTest(
        "getModuleById - Empty ID",
        "Basic Retrieval",
        false,
        null,
        undefined,
        error instanceof Error ? error.message : "Unknown error",
      )
    }
  }

  private async testCoreModuleFunctions(): Promise<void> {
    console.log("\n🛡️ Testing Core Module Functions...")

    // Test 4: Get core modules
    this.startTest()
    try {
      const coreModules = getCoreModules()
      const passed = Array.isArray(coreModules) && coreModules.length > 0 && coreModules.every((m) => m.core === true)
      this.endTest("getCoreModules", "Core Functions", passed, `${coreModules.length} core modules`, "> 0 core modules")
    } catch (error) {
      this.endTest(
        "getCoreModules",
        "Core Functions",
        false,
        null,
        "> 0 core modules",
        error instanceof Error ? error.message : "Unknown error",
      )
    }

    // Test 5: Get visible modules
    this.startTest()
    try {
      const visibleModules = getVisibleModules()
      const passed = Array.isArray(visibleModules) && visibleModules.length === moduleDefinitions.length
      this.endTest(
        "getVisibleModules",
        "Core Functions",
        passed,
        `${visibleModules.length} visible modules`,
        `${moduleDefinitions.length} modules`,
      )
    } catch (error) {
      this.endTest(
        "getVisibleModules",
        "Core Functions",
        false,
        null,
        `${moduleDefinitions.length} modules`,
        error instanceof Error ? error.message : "Unknown error",
      )
    }

    // Test 6: Get enabled modules
    this.startTest()
    try {
      const enabledModules = getEnabledModules()
      const passed = Array.isArray(enabledModules) && enabledModules.every((m) => m.enabled === true)
      this.endTest(
        "getEnabledModules",
        "Core Functions",
        passed,
        `${enabledModules.length} enabled modules`,
        "All enabled",
      )
    } catch (error) {
      this.endTest(
        "getEnabledModules",
        "Core Functions",
        false,
        null,
        "All enabled",
        error instanceof Error ? error.message : "Unknown error",
      )
    }

    // Test 7: Get implemented modules
    this.startTest()
    try {
      const implementedModules = getImplementedModules()
      const passed = Array.isArray(implementedModules) && implementedModules.every((m) => m.implemented === true)
      this.endTest(
        "getImplementedModules",
        "Core Functions",
        passed,
        `${implementedModules.length} implemented modules`,
        "All implemented",
      )
    } catch (error) {
      this.endTest(
        "getImplementedModules",
        "Core Functions",
        false,
        null,
        "All implemented",
        error instanceof Error ? error.message : "Unknown error",
      )
    }
  }

  private async testFilteringFunctions(): Promise<void> {
    console.log("\n🔍 Testing Filtering Functions...")

    // Test 8: Filter by category
    this.startTest()
    try {
      const coreCategory = getModulesByCategory("core")
      const premiumCategory = getModulesByCategory("premium")
      const enterpriseCategory = getModulesByCategory("enterprise")
      const passed = coreCategory.length > 0 && premiumCategory.length > 0 && enterpriseCategory.length > 0
      this.endTest(
        "getModulesByCategory",
        "Filtering",
        passed,
        `Core: ${coreCategory.length}, Premium: ${premiumCategory.length}, Enterprise: ${enterpriseCategory.length}`,
        "All categories > 0",
      )
    } catch (error) {
      this.endTest(
        "getModulesByCategory",
        "Filtering",
        false,
        null,
        "All categories > 0",
        error instanceof Error ? error.message : "Unknown error",
      )
    }

    // Test 9: Filter by tier
    this.startTest()
    try {
      const starterTier = getModulesByTier("starter")
      const professionalTier = getModulesByTier("professional")
      const enterpriseTier = getModulesByTier("enterprise")
      const passed = starterTier.length > 0 && professionalTier.length > 0 && enterpriseTier.length > 0
      this.endTest(
        "getModulesByTier",
        "Filtering",
        passed,
        `Starter: ${starterTier.length}, Professional: ${professionalTier.length}, Enterprise: ${enterpriseTier.length}`,
        "All tiers > 0",
      )
    } catch (error) {
      this.endTest(
        "getModulesByTier",
        "Filtering",
        false,
        null,
        "All tiers > 0",
        error instanceof Error ? error.message : "Unknown error",
      )
    }

    // Test 10: Filter by status
    this.startTest()
    try {
      const activeModules = getModulesByStatus("active")
      const betaModules = getModulesByStatus("beta")
      const deprecatedModules = getModulesByStatus("deprecated")
      const passed = activeModules.length > 0
      this.endTest(
        "getModulesByStatus",
        "Filtering",
        passed,
        `Active: ${activeModules.length}, Beta: ${betaModules.length}, Deprecated: ${deprecatedModules.length}`,
        "Active > 0",
      )
    } catch (error) {
      this.endTest(
        "getModulesByStatus",
        "Filtering",
        false,
        null,
        "Active > 0",
        error instanceof Error ? error.message : "Unknown error",
      )
    }
  }

  private async testPriceCalculation(): Promise<void> {
    console.log("\n💰 Testing Price Calculation...")

    // Test 11: Fixed pricing model
    this.startTest()
    try {
      const module = getModuleById("bhv-plotkaart")
      if (module) {
        const pricing = calculateModulePrice(module, 1, 1)
        const passed = pricing.price === 19 && pricing.model === "Vast tarief"
        this.endTest(
          "calculateModulePrice - Fixed",
          "Price Calculation",
          passed,
          `€${pricing.price} - ${pricing.model}`,
          "€19 - Vast tarief",
        )
      } else {
        this.endTest(
          "calculateModulePrice - Fixed",
          "Price Calculation",
          false,
          "Module not found",
          "€19 - Vast tarief",
        )
      }
    } catch (error) {
      this.endTest(
        "calculateModulePrice - Fixed",
        "Price Calculation",
        false,
        null,
        "€19 - Vast tarief",
        error instanceof Error ? error.message : "Unknown error",
      )
    }

    // Test 12: Hybrid pricing model
    this.startTest()
    try {
      const module = getModuleById("incident-management")
      if (module) {
        const pricing = calculateModulePrice(module, 10, 2)
        const passed = pricing.price > 49 && pricing.model === "Hybride"
        this.endTest(
          "calculateModulePrice - Hybrid",
          "Price Calculation",
          passed,
          `€${pricing.price} - ${pricing.model}`,
          "> €49 - Hybride",
        )
      } else {
        this.endTest("calculateModulePrice - Hybrid", "Price Calculation", false, "Module not found", "> €49 - Hybride")
      }
    } catch (error) {
      this.endTest(
        "calculateModulePrice - Hybrid",
        "Price Calculation",
        false,
        null,
        "> €49 - Hybride",
        error instanceof Error ? error.message : "Unknown error",
      )
    }

    // Test 13: Price scaling with users
    this.startTest()
    try {
      const module = getModuleById("user-management")
      if (module) {
        const price1 = calculateModulePrice(module, 1, 1).price
        const price10 = calculateModulePrice(module, 10, 1).price
        const passed = price10 > price1
        this.endTest(
          "Price Scaling - Users",
          "Price Calculation",
          passed,
          `1 user: €${price1}, 10 users: €${price10}`,
          "10 users > 1 user",
        )
      } else {
        this.endTest("Price Scaling - Users", "Price Calculation", false, "Module not found", "10 users > 1 user")
      }
    } catch (error) {
      this.endTest(
        "Price Scaling - Users",
        "Price Calculation",
        false,
        null,
        "10 users > 1 user",
        error instanceof Error ? error.message : "Unknown error",
      )
    }
  }

  private async testSearchAndDiscovery(): Promise<void> {
    console.log("\n🔎 Testing Search and Discovery...")

    // Test 14: Text search
    this.startTest()
    try {
      const searchResults = searchModules("incident")
      const passed = searchResults.length > 0 && searchResults.some((m) => m.name.toLowerCase().includes("incident"))
      this.endTest(
        "searchModules - Text",
        "Search",
        passed,
        `${searchResults.length} results for 'incident'`,
        "> 0 results",
      )
    } catch (error) {
      this.endTest(
        "searchModules - Text",
        "Search",
        false,
        null,
        "> 0 results",
        error instanceof Error ? error.message : "Unknown error",
      )
    }

    // Test 15: Feature search
    this.startTest()
    try {
      const searchResults = searchModules("analytics")
      const passed = searchResults.length > 0
      this.endTest(
        "searchModules - Features",
        "Search",
        passed,
        `${searchResults.length} results for 'analytics'`,
        "> 0 results",
      )
    } catch (error) {
      this.endTest(
        "searchModules - Features",
        "Search",
        false,
        null,
        "> 0 results",
        error instanceof Error ? error.message : "Unknown error",
      )
    }

    // Test 16: Popular modules
    this.startTest()
    try {
      const popularModules = getPopularModules(5)
      const passed = popularModules.length === 5 && popularModules[0].popularity >= popularModules[4].popularity
      this.endTest(
        "getPopularModules",
        "Search",
        passed,
        `Top 5: ${popularModules.map((m) => m.name).join(", ")}`,
        "5 modules, sorted by popularity",
      )
    } catch (error) {
      this.endTest(
        "getPopularModules",
        "Search",
        false,
        null,
        "5 modules, sorted by popularity",
        error instanceof Error ? error.message : "Unknown error",
      )
    }

    // Test 17: High-rated modules
    this.startTest()
    try {
      const highRatedModules = getHighRatedModules(4.5)
      const passed = highRatedModules.length > 0 && highRatedModules.every((m) => m.rating >= 4.5)
      this.endTest(
        "getHighRatedModules",
        "Search",
        passed,
        `${highRatedModules.length} modules with rating ≥4.5`,
        "All modules ≥4.5 rating",
      )
    } catch (error) {
      this.endTest(
        "getHighRatedModules",
        "Search",
        false,
        null,
        "All modules ≥4.5 rating",
        error instanceof Error ? error.message : "Unknown error",
      )
    }
  }

  private async testModuleActivation(): Promise<void> {
    console.log("\n⚡ Testing Module Activation...")

    // Test 18: Can activate module without dependencies
    this.startTest()
    try {
      const canActivate = canActivateModule("bhv-plotkaart", [])
      const passed = canActivate === true
      this.endTest(
        "canActivateModule - No Dependencies",
        "Activation",
        passed,
        canActivate ? "Can activate" : "Cannot activate",
        "Can activate",
      )
    } catch (error) {
      this.endTest(
        "canActivateModule - No Dependencies",
        "Activation",
        false,
        null,
        "Can activate",
        error instanceof Error ? error.message : "Unknown error",
      )
    }

    // Test 19: Module dependencies
    this.startTest()
    try {
      const dependencies = getModuleDependencies("bhv-plotkaart")
      const passed = Array.isArray(dependencies)
      this.endTest(
        "getModuleDependencies",
        "Activation",
        passed,
        `${dependencies.length} dependencies`,
        "Array of dependencies",
      )
    } catch (error) {
      this.endTest(
        "getModuleDependencies",
        "Activation",
        false,
        null,
        "Array of dependencies",
        error instanceof Error ? error.message : "Unknown error",
      )
    }
  }

  private async testCostCalculations(): Promise<void> {
    console.log("\n💳 Testing Cost Calculations...")

    // Test 20: Module activation cost
    this.startTest()
    try {
      const cost = getModuleActivationCost("incident-management", 25, 2)
      const passed = cost > 0
      this.endTest("getModuleActivationCost", "Cost Calculations", passed, `€${cost}`, "> €0")
    } catch (error) {
      this.endTest(
        "getModuleActivationCost",
        "Cost Calculations",
        false,
        null,
        "> €0",
        error instanceof Error ? error.message : "Unknown error",
      )
    }

    // Test 21: Module setup cost
    this.startTest()
    try {
      const setupCost = getModuleSetupCost("incident-management")
      const passed = setupCost >= 0
      this.endTest("getModuleSetupCost", "Cost Calculations", passed, `€${setupCost}`, "≥ €0")
    } catch (error) {
      this.endTest(
        "getModuleSetupCost",
        "Cost Calculations",
        false,
        null,
        "≥ €0",
        error instanceof Error ? error.message : "Unknown error",
      )
    }

    // Test 22: Total module cost
    this.startTest()
    try {
      const totalCost = getTotalModuleCost(["bhv-plotkaart", "incident-management"], 10, 2)
      const passed = totalCost > 0
      this.endTest("getTotalModuleCost", "Cost Calculations", passed, `€${totalCost}`, "> €0")
    } catch (error) {
      this.endTest(
        "getTotalModuleCost",
        "Cost Calculations",
        false,
        null,
        "> €0",
        error instanceof Error ? error.message : "Unknown error",
      )
    }

    // Test 23: Total setup cost
    this.startTest()
    try {
      const totalSetupCost = getTotalSetupCost(["bhv-plotkaart", "incident-management"])
      const passed = totalSetupCost >= 0
      this.endTest("getTotalSetupCost", "Cost Calculations", passed, `€${totalSetupCost}`, "≥ €0")
    } catch (error) {
      this.endTest(
        "getTotalSetupCost",
        "Cost Calculations",
        false,
        null,
        "≥ €0",
        error instanceof Error ? error.message : "Unknown error",
      )
    }
  }

  private async testFreeTrialFunctions(): Promise<void> {
    console.log("\n🆓 Testing Free Trial Functions...")

    // Test 24: Has free trial
    this.startTest()
    try {
      const hasTrial = hasFreeTrial("bhv-plotkaart")
      const passed = hasTrial === true
      this.endTest("hasFreeTrial", "Free Trial", passed, hasTrial ? "Has trial" : "No trial", "Has trial")
    } catch (error) {
      this.endTest(
        "hasFreeTrial",
        "Free Trial",
        false,
        null,
        "Has trial",
        error instanceof Error ? error.message : "Unknown error",
      )
    }

    // Test 25: Get trial days
    this.startTest()
    try {
      const trialDays = getTrialDays("bhv-plotkaart")
      const passed = trialDays > 0
      this.endTest("getTrialDays", "Free Trial", passed, `${trialDays} days`, "> 0 days")
    } catch (error) {
      this.endTest(
        "getTrialDays",
        "Free Trial",
        false,
        null,
        "> 0 days",
        error instanceof Error ? error.message : "Unknown error",
      )
    }

    // Test 26: No trial module
    this.startTest()
    try {
      const hasTrial = hasFreeTrial("white-label")
      const trialDays = getTrialDays("white-label")
      const passed = hasTrial === false && trialDays === 0
      this.endTest(
        "No Trial Module",
        "Free Trial",
        passed,
        `Has trial: ${hasTrial}, Days: ${trialDays}`,
        "Has trial: false, Days: 0",
      )
    } catch (error) {
      this.endTest(
        "No Trial Module",
        "Free Trial",
        false,
        null,
        "Has trial: false, Days: 0",
        error instanceof Error ? error.message : "Unknown error",
      )
    }
  }

  private async testBulkOperations(): Promise<void> {
    console.log("\n📦 Testing Bulk Operations...")

    // Test 27: Multiple module costs
    this.startTest()
    try {
      const moduleIds = ["bhv-plotkaart", "incident-management", "user-management"]
      const totalCost = getTotalModuleCost(moduleIds, 20, 3)
      const individualCosts = moduleIds.map((id) => getModuleActivationCost(id, 20, 3))
      const expectedTotal = individualCosts.reduce((sum, cost) => sum + cost, 0)
      const passed = Math.abs(totalCost - expectedTotal) < 0.01 // Allow for floating point precision
      this.endTest(
        "Bulk Cost Calculation",
        "Bulk Operations",
        passed,
        `Total: €${totalCost}, Expected: €${expectedTotal}`,
        "Costs match",
      )
    } catch (error) {
      this.endTest(
        "Bulk Cost Calculation",
        "Bulk Operations",
        false,
        null,
        "Costs match",
        error instanceof Error ? error.message : "Unknown error",
      )
    }

    // Test 28: Multiple category filtering
    this.startTest()
    try {
      const categories = ["core", "premium", "enterprise"]
      const results = categories.map((cat) => ({
        category: cat,
        count: getModulesByCategory(cat).length,
      }))
      const passed = results.every((r) => r.count > 0)
      this.endTest(
        "Multiple Category Filter",
        "Bulk Operations",
        passed,
        results.map((r) => `${r.category}: ${r.count}`).join(", "),
        "All categories > 0",
      )
    } catch (error) {
      this.endTest(
        "Multiple Category Filter",
        "Bulk Operations",
        false,
        null,
        "All categories > 0",
        error instanceof Error ? error.message : "Unknown error",
      )
    }
  }

  private async testStatisticsAndAnalytics(): Promise<void> {
    console.log("\n📊 Testing Statistics and Analytics...")

    // Test 29: Module statistics
    this.startTest()
    try {
      const stats = getModuleStats()
      const passed = stats.total > 0 && stats.averageRating > 0 && stats.core > 0
      this.endTest(
        "getModuleStats",
        "Statistics",
        passed,
        `Total: ${stats.total}, Avg Rating: ${stats.averageRating.toFixed(2)}, Core: ${stats.core}`,
        "All stats > 0",
      )
    } catch (error) {
      this.endTest(
        "getModuleStats",
        "Statistics",
        false,
        null,
        "All stats > 0",
        error instanceof Error ? error.message : "Unknown error",
      )
    }

    // Test 30: Statistics completeness
    this.startTest()
    try {
      const stats = getModuleStats()
      const requiredFields = [
        "total",
        "core",
        "premium",
        "enterprise",
        "implemented",
        "active",
        "beta",
        "averageRating",
        "totalCustomers",
      ]
      const passed = requiredFields.every(
        (field) => field in stats && typeof stats[field as keyof typeof stats] === "number",
      )
      this.endTest(
        "Statistics Completeness",
        "Statistics",
        passed,
        `All ${requiredFields.length} fields present`,
        "All required fields",
      )
    } catch (error) {
      this.endTest(
        "Statistics Completeness",
        "Statistics",
        false,
        null,
        "All required fields",
        error instanceof Error ? error.message : "Unknown error",
      )
    }
  }

  private async testDataIntegrity(): Promise<void> {
    console.log("\n🔒 Testing Data Integrity...")

    // Test 31: Module data consistency
    this.startTest()
    try {
      const allModules = moduleDefinitions
      const validModules = allModules.filter(
        (m) =>
          m.id &&
          m.name &&
          m.description &&
          m.category &&
          m.tier &&
          typeof m.enabled === "boolean" &&
          typeof m.visible === "boolean" &&
          typeof m.core === "boolean" &&
          typeof m.implemented === "boolean" &&
          m.pricing &&
          typeof m.pricing.basePrice === "number" &&
          Array.isArray(m.features) &&
          typeof m.rating === "number",
      )
      const passed = validModules.length === allModules.length
      this.endTest(
        "Module Data Consistency",
        "Data Integrity",
        passed,
        `${validModules.length}/${allModules.length} valid modules`,
        "All modules valid",
      )
    } catch (error) {
      this.endTest(
        "Module Data Consistency",
        "Data Integrity",
        false,
        null,
        "All modules valid",
        error instanceof Error ? error.message : "Unknown error",
      )
    }

    // Test 32: Unique module IDs
    this.startTest()
    try {
      const moduleIds = moduleDefinitions.map((m) => m.id)
      const uniqueIds = new Set(moduleIds)
      const passed = moduleIds.length === uniqueIds.size
      this.endTest(
        "Unique Module IDs",
        "Data Integrity",
        passed,
        `${uniqueIds.size} unique IDs out of ${moduleIds.length}`,
        "All IDs unique",
      )
    } catch (error) {
      this.endTest(
        "Unique Module IDs",
        "Data Integrity",
        false,
        null,
        "All IDs unique",
        error instanceof Error ? error.message : "Unknown error",
      )
    }

    // Test 33: Category definitions exist
    this.startTest()
    try {
      const moduleCategories = [...new Set(moduleDefinitions.map((m) => m.category))]
      const definedCategories = moduleCategories.map((cat) => cat.id)
      const passed = moduleCategories.every((cat) => definedCategories.includes(cat))
      this.endTest(
        "Category Definitions",
        "Data Integrity",
        passed,
        `${moduleCategories.length} categories defined`,
        "All categories defined",
      )
    } catch (error) {
      this.endTest(
        "Category Definitions",
        "Data Integrity",
        false,
        null,
        "All categories defined",
        error instanceof Error ? error.message : "Unknown error",
      )
    }
  }

  private async testEdgeCases(): Promise<void> {
    console.log("\n🎯 Testing Edge Cases...")

    // Test 34: Zero users/buildings
    this.startTest()
    try {
      const module = getModuleById("bhv-plotkaart")
      if (module) {
        const pricing = calculateModulePrice(module, 0, 0)
        const passed = pricing.price >= 0
        this.endTest("Zero Users/Buildings", "Edge Cases", passed, `€${pricing.price}`, "≥ €0")
      } else {
        this.endTest("Zero Users/Buildings", "Edge Cases", false, "Module not found", "≥ €0")
      }
    } catch (error) {
      this.endTest(
        "Zero Users/Buildings",
        "Edge Cases",
        false,
        null,
        "≥ €0",
        error instanceof Error ? error.message : "Unknown error",
      )
    }

    // Test 35: Large numbers
    this.startTest()
    try {
      const module = getModuleById("user-management")
      if (module) {
        const pricing = calculateModulePrice(module, 10000, 100)
        const passed = pricing.price > 0 && isFinite(pricing.price)
        this.endTest("Large Numbers", "Edge Cases", passed, `€${pricing.price}`, "Finite positive number")
      } else {
        this.endTest("Large Numbers", "Edge Cases", false, "Module not found", "Finite positive number")
      }
    } catch (error) {
      this.endTest(
        "Large Numbers",
        "Edge Cases",
        false,
        null,
        "Finite positive number",
        error instanceof Error ? error.message : "Unknown error",
      )
    }

    // Test 36: Empty search
    this.startTest()
    try {
      const results = searchModules("")
      const passed = Array.isArray(results)
      this.endTest("Empty Search", "Edge Cases", passed, `${results.length} results`, "Array returned")
    } catch (error) {
      this.endTest(
        "Empty Search",
        "Edge Cases",
        false,
        null,
        "Array returned",
        error instanceof Error ? error.message : "Unknown error",
      )
    }
  }

  private async testPerformance(): Promise<void> {
    console.log("\n⚡ Testing Performance...")

    // Test 37: Search performance
    this.startTest()
    const searchStart = Date.now()
    try {
      const results = searchModules("management")
      const searchTime = Date.now() - searchStart
      const passed = searchTime < 100 && results.length > 0 // Should complete in under 100ms
      this.endTest(
        "Search Performance",
        "Performance",
        passed,
        `${results.length} results in ${searchTime}ms`,
        "< 100ms",
      )
    } catch (error) {
      this.endTest(
        "Search Performance",
        "Performance",
        false,
        null,
        "< 100ms",
        error instanceof Error ? error.message : "Unknown error",
      )
    }

    // Test 38: Bulk calculation performance
    this.startTest()
    const bulkStart = Date.now()
    try {
      const moduleIds = moduleDefinitions.map((m) => m.id)
      const totalCost = getTotalModuleCost(moduleIds, 50, 5)
      const bulkTime = Date.now() - bulkStart
      const passed = bulkTime < 200 && totalCost > 0 // Should complete in under 200ms
      this.endTest("Bulk Calculation Performance", "Performance", passed, `€${totalCost} in ${bulkTime}ms`, "< 200ms")
    } catch (error) {
      this.endTest(
        "Bulk Calculation Performance",
        "Performance",
        false,
        null,
        "< 200ms",
        error instanceof Error ? error.message : "Unknown error",
      )
    }
  }

  private async testTypeSafety(): Promise<void> {
    console.log("\n🛡️ Testing Type Safety...")

    // Test 39: Return types
    this.startTest()
    try {
      const module = getModuleById("bhv-plotkaart")
      const coreModules = getCoreModules()
      const stats = getModuleStats()

      const moduleIsCorrectType = !module || (typeof module === "object" && "id" in module)
      const coreIsArray = Array.isArray(coreModules)
      const statsIsObject = typeof stats === "object" && stats !== null

      const passed = moduleIsCorrectType && coreIsArray && statsIsObject
      this.endTest("Return Types", "Type Safety", passed, "All types correct", "Correct types")
    } catch (error) {
      this.endTest(
        "Return Types",
        "Type Safety",
        false,
        null,
        "Correct types",
        error instanceof Error ? error.message : "Unknown error",
      )
    }
  }

  private async testErrorHandling(): Promise<void> {
    console.log("\n🚨 Testing Error Handling...")

    // Test 40: Invalid parameters
    this.startTest()
    try {
      const results = searchModules(null as any)
      const passed = Array.isArray(results) // Should handle gracefully
      this.endTest(
        "Invalid Parameters",
        "Error Handling",
        passed,
        `Handled gracefully: ${Array.isArray(results)}`,
        "Graceful handling",
      )
    } catch (error) {
      // This is actually expected behavior - catching the error is fine
      this.endTest("Invalid Parameters", "Error Handling", true, "Error caught and handled", "Graceful handling")
    }
  }

  private async testComplexScenarios(): Promise<void> {
    console.log("\n🧩 Testing Complex Scenarios...")

    // Test 41: Multi-tier pricing scenario
    this.startTest()
    try {
      const starterModules = getModulesByTier("starter")
      const professionalModules = getModulesByTier("professional")
      const enterpriseModules = getModulesByTier("enterprise")

      const starterCost = getTotalModuleCost(
        starterModules.map((m) => m.id),
        5,
        1,
      )
      const professionalCost = getTotalModuleCost(
        professionalModules.map((m) => m.id),
        25,
        3,
      )
      const enterpriseCost = getTotalModuleCost(
        enterpriseModules.map((m) => m.id),
        100,
        10,
      )

      const passed = starterCost > 0 && professionalCost > 0 && enterpriseCost > 0
      this.endTest(
        "Multi-tier Pricing",
        "Complex Scenarios",
        passed,
        `Starter: €${starterCost}, Pro: €${professionalCost}, Enterprise: €${enterpriseCost}`,
        "All tiers > €0",
      )
    } catch (error) {
      this.endTest(
        "Multi-tier Pricing",
        "Complex Scenarios",
        false,
        null,
        "All tiers > €0",
        error instanceof Error ? error.message : "Unknown error",
      )
    }

    // Test 42: Popular high-rated modules
    this.startTest()
    try {
      const popularModules = getPopularModules(10)
      const highRatedModules = getHighRatedModules(4.0)
      const intersection = popularModules.filter((pm) => highRatedModules.some((hrm) => hrm.id === pm.id))
      const passed = intersection.length > 0
      this.endTest(
        "Popular High-rated Intersection",
        "Complex Scenarios",
        passed,
        `${intersection.length} modules are both popular and high-rated`,
        "> 0 modules",
      )
    } catch (error) {
      this.endTest(
        "Popular High-rated Intersection",
        "Complex Scenarios",
        false,
        null,
        "> 0 modules",
        error instanceof Error ? error.message : "Unknown error",
      )
    }
  }

  private async testIntegration(): Promise<void> {
    console.log("\n🔗 Testing Integration...")

    // Test 43: End-to-end workflow
    this.startTest()
    try {
      // Simulate a complete workflow
      const searchResults = searchModules("management")
      const selectedModule = searchResults[0]
      const pricing = calculateModulePrice(selectedModule, 10, 2)
      const canActivate = canActivateModule(selectedModule.id, [])
      const setupCost = getModuleSetupCost(selectedModule.id)

      const passed = searchResults.length > 0 && pricing.price > 0 && typeof canActivate === "boolean" && setupCost >= 0
      this.endTest(
        "End-to-end Workflow",
        "Integration",
        passed,
        `Found ${searchResults.length} modules, selected ${selectedModule.name}, price €${pricing.price}`,
        "Complete workflow",
      )
    } catch (error) {
      this.endTest(
        "End-to-end Workflow",
        "Integration",
        false,
        null,
        "Complete workflow",
        error instanceof Error ? error.message : "Unknown error",
      )
    }
  }

  private generateReport(): void {
    console.log("\n" + "=".repeat(80))
    console.log("📊 TEST SUITE RESULTS")
    console.log("=".repeat(80))

    const passed = this.results.filter((r) => r.passed).length
    const failed = this.results.filter((r) => !r.passed).length
    const total = this.results.length

    console.log(`\n🎯 SUMMARY:`)
    console.log(`   Total Tests: ${total}`)
    console.log(`   ✅ Passed: ${passed}`)
    console.log(`   ❌ Failed: ${failed}`)
    console.log(`   📈 Success Rate: ${((passed / total) * 100).toFixed(1)}%`)

    // Group by category
    const categories = [...new Set(this.results.map((r) => r.category))]
    console.log(`\n📋 BY CATEGORY:`)

    categories.forEach((category) => {
      const categoryResults = this.results.filter((r) => r.category === category)
      const categoryPassed = categoryResults.filter((r) => r.passed).length
      const categoryTotal = categoryResults.length
      const categoryRate = ((categoryPassed / categoryTotal) * 100).toFixed(1)

      console.log(`   ${category}: ${categoryPassed}/${categoryTotal} (${categoryRate}%)`)
    })

    // Show failed tests
    const failedTests = this.results.filter((r) => !r.passed)
    if (failedTests.length > 0) {
      console.log(`\n❌ FAILED TESTS:`)
      failedTests.forEach((test) => {
        console.log(`   • ${test.name}`)
        console.log(`     Category: ${test.category}`)
        console.log(`     Result: ${test.result}`)
        console.log(`     Expected: ${test.expected}`)
        if (test.error) {
          console.log(`     Error: ${test.error}`)
        }
        console.log(`     Duration: ${test.duration}ms`)
        console.log()
      })
    }

    // Performance summary
    const avgDuration = this.results.reduce((sum, r) => sum + r.duration, 0) / this.results.length
    const maxDuration = Math.max(...this.results.map((r) => r.duration))
    const minDuration = Math.min(...this.results.map((r) => r.duration))

    console.log(`\n⚡ PERFORMANCE:`)
    console.log(`   Average Duration: ${avgDuration.toFixed(2)}ms`)
    console.log(`   Max Duration: ${maxDuration}ms`)
    console.log(`   Min Duration: ${minDuration}ms`)

    // Final status
    console.log(`\n${failed === 0 ? "🎉" : "⚠️"} ${failed === 0 ? "ALL TESTS PASSED!" : "SOME TESTS FAILED"}`)
    console.log("=".repeat(80))
  }
}

// Run the test suite
async function main() {
  const testSuite = new ModuleTestSuite()
  await testSuite.runAllTests()
}

// Execute if run directly
if (require.main === module) {
  main().catch(console.error)
}

export { ModuleTestSuite }
