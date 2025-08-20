#!/usr/bin/env tsx

import { ModuleTestSuite } from "./test-module-functions"

async function runTests() {
  console.log("🚀 Starting BHV360 Module System Test Suite...")
  console.log("This will test all module functions comprehensively.\n")

  const testSuite = new ModuleTestSuite()

  try {
    await testSuite.runAllTests()
    console.log("\n✅ Test suite completed successfully!")
  } catch (error) {
    console.error("\n❌ Test suite failed with error:", error)
    process.exit(1)
  }
}

// Run the tests
runTests()
