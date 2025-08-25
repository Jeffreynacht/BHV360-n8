#!/usr/bin/env npx tsx

import { toFixedSafe, toNumberSafe } from "../helpers/number"

/**
 * Test script to verify the number helper functions work correctly
 */

function testNumberHelpers() {
  console.log("🧪 Testing Number Helper Functions")
  console.log("=".repeat(40))
  console.log("")

  // Test toFixedSafe
  console.log("🔢 Testing toFixedSafe:")
  console.log("-".repeat(25))

  const toFixedTests = [
    { input: 123.456, decimals: 2, expected: "123.46" },
    { input: 0, decimals: 2, expected: "0.00" },
    { input: Number.NaN, decimals: 2, expected: "0.00" },
    { input: Number.POSITIVE_INFINITY, decimals: 2, expected: "0.00" },
    { input: Number.NEGATIVE_INFINITY, decimals: 2, expected: "0.00" },
    { input: 123.456, decimals: 0, expected: "123" },
    { input: 123.456, decimals: 4, expected: "123.4560" },
  ]

  let toFixedPassed = 0
  for (const test of toFixedTests) {
    const result = toFixedSafe(test.input, test.decimals)
    const passed = result === test.expected
    console.log(
      `  ${passed ? "✅" : "❌"} toFixedSafe(${test.input}, ${test.decimals}) = "${result}" (expected: "${test.expected}")`,
    )
    if (passed) toFixedPassed++
  }

  console.log(`  📊 toFixedSafe: ${toFixedPassed}/${toFixedTests.length} tests passed`)
  console.log("")

  // Test toNumberSafe
  console.log("🔢 Testing toNumberSafe:")
  console.log("-".repeat(25))

  const toNumberTests = [
    { input: "123.45", fallback: 0, expected: 123.45 },
    { input: "123", fallback: 0, expected: 123 },
    { input: "abc", fallback: 0, expected: 0 },
    { input: "", fallback: 0, expected: 0 },
    { input: null, fallback: 0, expected: 0 },
    { input: undefined, fallback: 0, expected: 0 },
    { input: 456.78, fallback: 0, expected: 456.78 },
    { input: "€123.45", fallback: 0, expected: 123.45 },
    { input: "invalid", fallback: 999, expected: 999 },
  ]

  let toNumberPassed = 0
  for (const test of toNumberTests) {
    const result = toNumberSafe(test.input, test.fallback)
    const passed = result === test.expected
    console.log(
      `  ${passed ? "✅" : "❌"} toNumberSafe(${JSON.stringify(test.input)}, ${test.fallback}) = ${result} (expected: ${test.expected})`,
    )
    if (passed) toNumberPassed++
  }

  console.log(`  📊 toNumberSafe: ${toNumberPassed}/${toNumberTests.length} tests passed`)
  console.log("")

  // Summary
  const totalTests = toFixedTests.length + toNumberTests.length
  const totalPassed = toFixedPassed + toNumberPassed

  console.log("📋 Test Summary:")
  console.log("-".repeat(15))
  console.log(`  Total tests: ${totalTests}`)
  console.log(`  Passed: ${totalPassed}`)
  console.log(`  Failed: ${totalTests - totalPassed}`)
  console.log(`  Success rate: ${Math.round((totalPassed / totalTests) * 100)}%`)
  console.log("")

  if (totalPassed === totalTests) {
    console.log("🎉 All tests passed! The number helper functions are working correctly.")
    return true
  } else {
    console.log("❌ Some tests failed. Please check the implementation.")
    return false
  }
}

// Run tests if executed directly
if (require.main === module) {
  const success = testNumberHelpers()
  process.exit(success ? 0 : 1)
}

export { testNumberHelpers }
