"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, AlertCircle, Play, Clock, Zap, Target } from "lucide-react"

// Import all module functions
import {
  getModuleById,
  getCoreModules,
  getVisibleModules,
  getModulesByCategory,
  getModulesByTier,
  calculateModulePrice,
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
  getEnabledModules,
  getImplementedModules,
  getModulesByStatus,
  getModuleDependencies,
} from "@/lib/modules/module-definitions"

interface TestResult {
  name: string
  category: string
  passed: boolean
  result: any
  expected?: any
  error?: string
  duration: number
}

interface TestSummary {
  total: number
  passed: number
  failed: number
  categories: Record<string, { passed: number; total: number }>
  avgDuration: number
  maxDuration: number
  minDuration: number
}

export default function TestModulesPage() {
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [currentTest, setCurrentTest] = useState<string>("")
  const [progress, setProgress] = useState(0)
  const [summary, setSummary] = useState<TestSummary | null>(null)

  const runTests = async () => {
    setIsRunning(true)
    setTestResults([])
    setProgress(0)
    const results: TestResult[] = []

    const tests = [
      // Basic Retrieval Tests
      { name: "getModuleById - Valid ID", category: "Basic Retrieval", test: testGetModuleByIdValid },
      { name: "getModuleById - Invalid ID", category: "Basic Retrieval", test: testGetModuleByIdInvalid },
      { name: "getModuleById - Empty ID", category: "Basic Retrieval", test: testGetModuleByIdEmpty },

      // Core Function Tests
      { name: "getCoreModules", category: "Core Functions", test: testGetCoreModules },
      { name: "getVisibleModules", category: "Core Functions", test: testGetVisibleModules },
      { name: "getEnabledModules", category: "Core Functions", test: testGetEnabledModules },
      { name: "getImplementedModules", category: "Core Functions", test: testGetImplementedModules },

      // Filtering Tests
      { name: "getModulesByCategory", category: "Filtering", test: testGetModulesByCategory },
      { name: "getModulesByTier", category: "Filtering", test: testGetModulesByTier },
      { name: "getModulesByStatus", category: "Filtering", test: testGetModulesByStatus },

      // Price Calculation Tests
      { name: "calculateModulePrice - Fixed", category: "Price Calculation", test: testCalculateModulePriceFixed },
      { name: "calculateModulePrice - Hybrid", category: "Price Calculation", test: testCalculateModulePriceHybrid },
      { name: "Price Scaling - Users", category: "Price Calculation", test: testPriceScalingUsers },

      // Search and Discovery Tests
      { name: "searchModules - Text", category: "Search", test: testSearchModulesText },
      { name: "searchModules - Features", category: "Search", test: testSearchModulesFeatures },
      { name: "getPopularModules", category: "Search", test: testGetPopularModules },
      { name: "getHighRatedModules", category: "Search", test: testGetHighRatedModules },

      // Activation Tests
      { name: "canActivateModule", category: "Activation", test: testCanActivateModule },
      { name: "getModuleDependencies", category: "Activation", test: testGetModuleDependencies },

      // Cost Calculation Tests
      { name: "getModuleActivationCost", category: "Cost Calculations", test: testGetModuleActivationCost },
      { name: "getModuleSetupCost", category: "Cost Calculations", test: testGetModuleSetupCost },
      { name: "getTotalModuleCost", category: "Cost Calculations", test: testGetTotalModuleCost },
      { name: "getTotalSetupCost", category: "Cost Calculations", test: testGetTotalSetupCost },

      // Free Trial Tests
      { name: "hasFreeTrial", category: "Free Trial", test: testHasFreeTrial },
      { name: "getTrialDays", category: "Free Trial", test: testGetTrialDays },

      // Statistics Tests
      { name: "getModuleStats", category: "Statistics", test: testGetModuleStats },
      { name: "Statistics Completeness", category: "Statistics", test: testStatisticsCompleteness },

      // Data Integrity Tests
      { name: "Module Data Consistency", category: "Data Integrity", test: testModuleDataConsistency },
      { name: "Unique Module IDs", category: "Data Integrity", test: testUniqueModuleIds },

      // Edge Cases
      { name: "Zero Users/Buildings", category: "Edge Cases", test: testZeroUsersBuildings },
      { name: "Large Numbers", category: "Edge Cases", test: testLargeNumbers },
      { name: "Empty Search", category: "Edge Cases", test: testEmptySearch },

      // Performance Tests
      { name: "Search Performance", category: "Performance", test: testSearchPerformance },
      { name: "Bulk Calculation Performance", category: "Performance", test: testBulkCalculationPerformance },
    ]

    for (let i = 0; i < tests.length; i++) {
      const { name, category, test } = tests[i]
      setCurrentTest(name)
      setProgress((i / tests.length) * 100)

      const startTime = Date.now()
      try {
        const result = await test()
        const duration = Date.now() - startTime
        results.push({
          name,
          category,
          passed: result.passed,
          result: result.result,
          expected: result.expected,
          error: result.error,
          duration,
        })
      } catch (error) {
        const duration = Date.now() - startTime
        results.push({
          name,
          category,
          passed: false,
          result: null,
          expected: "No error",
          error: error instanceof Error ? error.message : "Unknown error",
          duration,
        })
      }

      // Small delay to show progress
      await new Promise((resolve) => setTimeout(resolve, 50))
    }

    // Calculate summary
    const passed = results.filter((r) => r.passed).length
    const failed = results.filter((r) => !r.passed).length
    const categories: Record<string, { passed: number; total: number }> = {}

    results.forEach((result) => {
      if (!categories[result.category]) {
        categories[result.category] = { passed: 0, total: 0 }
      }
      categories[result.category].total++
      if (result.passed) {
        categories[result.category].passed++
      }
    })

    const durations = results.map((r) => r.duration)
    const avgDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length
    const maxDuration = Math.max(...durations)
    const minDuration = Math.min(...durations)

    setSummary({
      total: results.length,
      passed,
      failed,
      categories,
      avgDuration,
      maxDuration,
      minDuration,
    })

    setTestResults(results)
    setProgress(100)
    setCurrentTest("")
    setIsRunning(false)
  }

  // Test functions
  const testGetModuleByIdValid = async () => {
    const module = getModuleById("bhv-plotkaart")
    return {
      passed: !!module && module.name === "BHV Plotkaart",
      result: module?.name || "Not found",
      expected: "BHV Plotkaart",
    }
  }

  const testGetModuleByIdInvalid = async () => {
    const module = getModuleById("non-existent-module")
    return {
      passed: module === undefined,
      result: module ? "Found (incorrect)" : "Not found (correct)",
      expected: "Not found (correct)",
    }
  }

  const testGetModuleByIdEmpty = async () => {
    const module = getModuleById("")
    return {
      passed: module === undefined,
      result: module ? "Found (incorrect)" : "Not found (correct)",
      expected: "Not found (correct)",
    }
  }

  const testGetCoreModules = async () => {
    const coreModules = getCoreModules()
    return {
      passed: Array.isArray(coreModules) && coreModules.length > 0 && coreModules.every((m) => m.core === true),
      result: `${coreModules.length} core modules found`,
      expected: "> 0 core modules",
    }
  }

  const testGetVisibleModules = async () => {
    const visibleModules = getVisibleModules()
    return {
      passed: Array.isArray(visibleModules) && visibleModules.length === moduleDefinitions.length,
      result: `${visibleModules.length} visible modules`,
      expected: `${moduleDefinitions.length} modules`,
    }
  }

  const testGetEnabledModules = async () => {
    const enabledModules = getEnabledModules()
    return {
      passed: Array.isArray(enabledModules) && enabledModules.every((m) => m.enabled === true),
      result: `${enabledModules.length} enabled modules`,
      expected: "All enabled",
    }
  }

  const testGetImplementedModules = async () => {
    const implementedModules = getImplementedModules()
    return {
      passed: Array.isArray(implementedModules) && implementedModules.every((m) => m.implemented === true),
      result: `${implementedModules.length} implemented modules`,
      expected: "All implemented",
    }
  }

  const testGetModulesByCategory = async () => {
    const coreCategory = getModulesByCategory("core")
    const premiumCategory = getModulesByCategory("premium")
    const enterpriseCategory = getModulesByCategory("enterprise")
    return {
      passed: coreCategory.length > 0 && premiumCategory.length > 0 && enterpriseCategory.length > 0,
      result: `Core: ${coreCategory.length}, Premium: ${premiumCategory.length}, Enterprise: ${enterpriseCategory.length}`,
      expected: "All categories > 0",
    }
  }

  const testGetModulesByTier = async () => {
    const starterTier = getModulesByTier("starter")
    const professionalTier = getModulesByTier("professional")
    const enterpriseTier = getModulesByTier("enterprise")
    return {
      passed: starterTier.length > 0 && professionalTier.length > 0 && enterpriseTier.length > 0,
      result: `Starter: ${starterTier.length}, Professional: ${professionalTier.length}, Enterprise: ${enterpriseTier.length}`,
      expected: "All tiers > 0",
    }
  }

  const testGetModulesByStatus = async () => {
    const activeModules = getModulesByStatus("active")
    const betaModules = getModulesByStatus("beta")
    const deprecatedModules = getModulesByStatus("deprecated")
    return {
      passed: activeModules.length > 0,
      result: `Active: ${activeModules.length}, Beta: ${betaModules.length}, Deprecated: ${deprecatedModules.length}`,
      expected: "Active > 0",
    }
  }

  const testCalculateModulePriceFixed = async () => {
    const module = getModuleById("bhv-plotkaart")
    if (!module) {
      return { passed: false, result: "Module not found", expected: "€19 - Vast tarief" }
    }
    const pricing = calculateModulePrice(module, 1, 1)
    return {
      passed: pricing.price === 19 && pricing.model === "Vast tarief",
      result: `€${pricing.price} - ${pricing.model}`,
      expected: "€19 - Vast tarief",
    }
  }

  const testCalculateModulePriceHybrid = async () => {
    const module = getModuleById("incident-management")
    if (!module) {
      return { passed: false, result: "Module not found", expected: "> €49 - Hybride" }
    }
    const pricing = calculateModulePrice(module, 10, 2)
    return {
      passed: pricing.price > 49 && pricing.model === "Hybride",
      result: `€${pricing.price} - ${pricing.model}`,
      expected: "> €49 - Hybride",
    }
  }

  const testPriceScalingUsers = async () => {
    const module = getModuleById("user-management")
    if (!module) {
      return { passed: false, result: "Module not found", expected: "10 users > 1 user" }
    }
    const price1 = calculateModulePrice(module, 1, 1).price
    const price10 = calculateModulePrice(module, 10, 1).price
    return {
      passed: price10 > price1,
      result: `1 user: €${price1}, 10 users: €${price10}`,
      expected: "10 users > 1 user",
    }
  }

  const testSearchModulesText = async () => {
    const searchResults = searchModules("incident")
    return {
      passed: searchResults.length > 0 && searchResults.some((m) => m.name.toLowerCase().includes("incident")),
      result: `${searchResults.length} results for 'incident'`,
      expected: "> 0 results",
    }
  }

  const testSearchModulesFeatures = async () => {
    const searchResults = searchModules("analytics")
    return {
      passed: searchResults.length > 0,
      result: `${searchResults.length} results for 'analytics'`,
      expected: "> 0 results",
    }
  }

  const testGetPopularModules = async () => {
    const popularModules = getPopularModules(5)
    return {
      passed: popularModules.length === 5 && popularModules[0].popularity >= popularModules[4].popularity,
      result: `Top 5: ${popularModules.map((m) => m.name).join(", ")}`,
      expected: "5 modules, sorted by popularity",
    }
  }

  const testGetHighRatedModules = async () => {
    const highRatedModules = getHighRatedModules(4.5)
    return {
      passed: highRatedModules.length > 0 && highRatedModules.every((m) => m.rating >= 4.5),
      result: `${highRatedModules.length} modules with rating ≥4.5`,
      expected: "All modules ≥4.5 rating",
    }
  }

  const testCanActivateModule = async () => {
    const canActivate = canActivateModule("bhv-plotkaart", [])
    return {
      passed: canActivate === true,
      result: canActivate ? "Can activate" : "Cannot activate",
      expected: "Can activate",
    }
  }

  const testGetModuleDependencies = async () => {
    const dependencies = getModuleDependencies("bhv-plotkaart")
    return {
      passed: Array.isArray(dependencies),
      result: `${dependencies.length} dependencies`,
      expected: "Array of dependencies",
    }
  }

  const testGetModuleActivationCost = async () => {
    const cost = getModuleActivationCost("incident-management", 25, 2)
    return {
      passed: cost > 0,
      result: `€${cost}`,
      expected: "> €0",
    }
  }

  const testGetModuleSetupCost = async () => {
    const setupCost = getModuleSetupCost("incident-management")
    return {
      passed: setupCost >= 0,
      result: `€${setupCost}`,
      expected: "≥ €0",
    }
  }

  const testGetTotalModuleCost = async () => {
    const totalCost = getTotalModuleCost(["bhv-plotkaart", "incident-management"], 10, 2)
    return {
      passed: totalCost > 0,
      result: `€${totalCost}`,
      expected: "> €0",
    }
  }

  const testGetTotalSetupCost = async () => {
    const totalSetupCost = getTotalSetupCost(["bhv-plotkaart", "incident-management"])
    return {
      passed: totalSetupCost >= 0,
      result: `€${totalSetupCost}`,
      expected: "≥ €0",
    }
  }

  const testHasFreeTrial = async () => {
    const hasTrial = hasFreeTrial("bhv-plotkaart")
    return {
      passed: hasTrial === true,
      result: hasTrial ? "Has trial" : "No trial",
      expected: "Has trial",
    }
  }

  const testGetTrialDays = async () => {
    const trialDays = getTrialDays("bhv-plotkaart")
    return {
      passed: trialDays > 0,
      result: `${trialDays} days`,
      expected: "> 0 days",
    }
  }

  const testGetModuleStats = async () => {
    const stats = getModuleStats()
    return {
      passed: stats.total > 0 && stats.averageRating > 0 && stats.core > 0,
      result: `Total: ${stats.total}, Avg Rating: ${stats.averageRating.toFixed(2)}, Core: ${stats.core}`,
      expected: "All stats > 0",
    }
  }

  const testStatisticsCompleteness = async () => {
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
    return {
      passed: requiredFields.every((field) => field in stats && typeof stats[field as keyof typeof stats] === "number"),
      result: `All ${requiredFields.length} fields present`,
      expected: "All required fields",
    }
  }

  const testModuleDataConsistency = async () => {
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
    return {
      passed: validModules.length === allModules.length,
      result: `${validModules.length}/${allModules.length} valid modules`,
      expected: "All modules valid",
    }
  }

  const testUniqueModuleIds = async () => {
    const moduleIds = moduleDefinitions.map((m) => m.id)
    const uniqueIds = new Set(moduleIds)
    return {
      passed: moduleIds.length === uniqueIds.size,
      result: `${uniqueIds.size} unique IDs out of ${moduleIds.length}`,
      expected: "All IDs unique",
    }
  }

  const testZeroUsersBuildings = async () => {
    const module = getModuleById("bhv-plotkaart")
    if (!module) {
      return { passed: false, result: "Module not found", expected: "≥ €0" }
    }
    const pricing = calculateModulePrice(module, 0, 0)
    return {
      passed: pricing.price >= 0,
      result: `€${pricing.price}`,
      expected: "≥ €0",
    }
  }

  const testLargeNumbers = async () => {
    const module = getModuleById("user-management")
    if (!module) {
      return { passed: false, result: "Module not found", expected: "Finite positive number" }
    }
    const pricing = calculateModulePrice(module, 10000, 100)
    return {
      passed: pricing.price > 0 && isFinite(pricing.price),
      result: `€${pricing.price}`,
      expected: "Finite positive number",
    }
  }

  const testEmptySearch = async () => {
    const results = searchModules("")
    return {
      passed: Array.isArray(results),
      result: `${results.length} results`,
      expected: "Array returned",
    }
  }

  const testSearchPerformance = async () => {
    const searchStart = Date.now()
    const results = searchModules("management")
    const searchTime = Date.now() - searchStart
    return {
      passed: searchTime < 100 && results.length > 0,
      result: `${results.length} results in ${searchTime}ms`,
      expected: "< 100ms",
    }
  }

  const testBulkCalculationPerformance = async () => {
    const bulkStart = Date.now()
    const moduleIds = moduleDefinitions.map((m) => m.id)
    const totalCost = getTotalModuleCost(moduleIds, 50, 5)
    const bulkTime = Date.now() - bulkStart
    return {
      passed: bulkTime < 200 && totalCost > 0,
      result: `€${totalCost} in ${bulkTime}ms`,
      expected: "< 200ms",
    }
  }

  const getStatusIcon = (passed: boolean) => {
    return passed ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />
  }

  const getStatusBadge = (passed: boolean) => {
    return <Badge variant={passed ? "default" : "destructive"}>{passed ? "PASS" : "FAIL"}</Badge>
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Basic Retrieval": "bg-blue-100 text-blue-800",
      "Core Functions": "bg-green-100 text-green-800",
      Filtering: "bg-purple-100 text-purple-800",
      "Price Calculation": "bg-yellow-100 text-yellow-800",
      Search: "bg-indigo-100 text-indigo-800",
      Activation: "bg-pink-100 text-pink-800",
      "Cost Calculations": "bg-orange-100 text-orange-800",
      "Free Trial": "bg-teal-100 text-teal-800",
      Statistics: "bg-red-100 text-red-800",
      "Data Integrity": "bg-gray-100 text-gray-800",
      "Edge Cases": "bg-amber-100 text-amber-800",
      Performance: "bg-emerald-100 text-emerald-800",
    }
    return colors[category] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Module Function Tests</h1>
          <p className="text-muted-foreground">Comprehensive testing of all module system functions</p>
        </div>
        <Button onClick={runTests} disabled={isRunning} className="flex items-center gap-2">
          <Play className="h-4 w-4" />
          {isRunning ? "Running Tests..." : "Run All Tests"}
        </Button>
      </div>

      {/* Progress Bar */}
      {isRunning && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Running Tests...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
              {currentTest && <p className="text-sm text-muted-foreground">Current: {currentTest}</p>}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Target className="h-4 w-4" />
                Total Tests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-600 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Passed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{summary.passed}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-600 flex items-center gap-2">
                <XCircle className="h-4 w-4" />
                Failed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{summary.failed}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Success Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{((summary.passed / summary.total) * 100).toFixed(1)}%</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Overall Status */}
      {summary && (
        <Alert className={summary.failed === 0 ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
          <AlertCircle className={`h-4 w-4 ${summary.failed === 0 ? "text-green-600" : "text-red-600"}`} />
          <AlertDescription className={summary.failed === 0 ? "text-green-800" : "text-red-800"}>
            {summary.failed === 0
              ? "🎉 All tests passed! The module system is fully functional."
              : `❌ ${summary.failed} test(s) failed. Please check the results below.`}
          </AlertDescription>
        </Alert>
      )}

      {/* Test Results */}
      <Tabs defaultValue="results" className="space-y-4">
        <TabsList>
          <TabsTrigger value="results">Test Results</TabsTrigger>
          <TabsTrigger value="categories">By Category</TabsTrigger>
          <TabsTrigger value="data">Module Data</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="results" className="space-y-4">
          {testResults.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No tests run yet. Click "Run All Tests" to start.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {testResults.map((test, index) => (
                <Card key={index}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        {getStatusIcon(test.passed)}
                        {test.name}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge className={getCategoryColor(test.category)}>{test.category}</Badge>
                        {getStatusBadge(test.passed)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium">Result:</span> {test.result}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Expected:</span> {test.expected}
                      </p>
                      {test.error && (
                        <p className="text-sm text-red-600">
                          <span className="font-medium">Error:</span> {test.error}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {test.duration}ms
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          {summary && (
            <div className="grid gap-4">
              {Object.entries(summary.categories).map(([category, stats]) => (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{category}</span>
                      <Badge className={getCategoryColor(category)}>
                        {stats.passed}/{stats.total}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Progress value={(stats.passed / stats.total) * 100} />
                      <p className="text-sm text-muted-foreground">
                        {stats.passed} passed, {stats.total - stats.passed} failed (
                        {((stats.passed / stats.total) * 100).toFixed(1)}% success rate)
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Module Definitions</CardTitle>
                <CardDescription>{moduleDefinitions.length} modules loaded</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  {moduleDefinitions.map((module) => (
                    <div key={module.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <span className="font-medium">{module.name}</span>
                        <span className="text-sm text-muted-foreground ml-2">({module.id})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={module.core ? "default" : "secondary"}>
                          {module.core ? "Core" : module.category}
                        </Badge>
                        <Badge variant="outline">{module.tier}</Badge>
                        <span className="text-sm">⭐ {module.rating}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
                <CardDescription>{moduleCategories.length} categories defined</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  {moduleCategories.map((category) => (
                    <div key={category.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <span className="font-medium">{category.name}</span>
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                      </div>
                      <Badge className={getCategoryColor(category.name)}>
                        {getModulesByCategory(category.id).length} modules
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tiers</CardTitle>
                <CardDescription>{tierDefinitions.length} pricing tiers available</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  {tierDefinitions.map((tier) => (
                    <div key={tier.id} className="p-2 border rounded">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{tier.name}</span>
                        <Badge variant="outline">{tier.priceRange}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{tier.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {tier.features.map((feature, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          {summary && (
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Performance Metrics
                  </CardTitle>
                  <CardDescription>Test execution performance statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{summary.avgDuration.toFixed(2)}ms</div>
                      <div className="text-sm text-muted-foreground">Average Duration</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{summary.maxDuration}ms</div>
                      <div className="text-sm text-muted-foreground">Max Duration</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{summary.minDuration}ms</div>
                      <div className="text-sm text-muted-foreground">Min Duration</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Function Coverage</CardTitle>
                  <CardDescription>All module system functions tested</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    {[
                      "getModuleById",
                      "getCoreModules",
                      "getVisibleModules",
                      "getModulesByCategory",
                      "getModulesByTier",
                      "calculateModulePrice",
                      "getEnabledModules",
                      "getImplementedModules",
                      "getModulesByStatus",
                      "getPopularModules",
                      "getHighRatedModules",
                      "searchModules",
                      "getModuleDependencies",
                      "canActivateModule",
                      "getModuleActivationCost",
                      "getModuleSetupCost",
                      "hasFreeTrial",
                      "getTrialDays",
                      "getTotalModuleCost",
                      "getTotalSetupCost",
                      "getModuleStats",
                    ].map((funcName) => (
                      <div key={funcName} className="flex items-center justify-between p-2 border rounded">
                        <code className="text-sm font-mono">{funcName}()</code>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
