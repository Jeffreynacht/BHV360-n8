#!/usr/bin/env npx tsx

import { toFixedSafe, toNumberSafe, toCurrencySafe, toPercentageSafe, clampSafe } from "../helpers/number"

/**
 * Comprehensive test script for number helper functions
 */

function runAllTests() {
  console.log("🧪 BHV360 - Number Helper Function Tests")
  console.log("=".repeat(50))
  console.log("")

  let totalTests = 0
  let totalPassed = 0

  // Test toFixedSafe
  console.log("🔢 Testing toFixedSafe:")
  console.log("-".repeat(30))

  const toFixedTests = [
    { input: 123.456, decimals: 2, expected: "123.46" },
    { input: 0, decimals: 2, expected: "0.00" },
    { input: Number.NaN, decimals: 2, expected: "0.00" },
    { input: Number.POSITIVE_INFINITY, decimals: 2, expected: "0.00" },
    { input: Number.NEGATIVE_INFINITY, decimals: 2, expected: "0.00" },
    { input: 123.456, decimals: 0, expected: "123" },
    { input: 123.456, decimals: 4, expected: "123.4560" },
    { input: -45.67, decimals: 1, expected: "-45.7" },
  ]

  let toFixedPassed = 0
  for (const test of toFixedTests) {
    const result = toFixedSafe(test.input, test.decimals)
    const passed = result === test.expected
    console.log(
      `  ${passed ? "✅" : "❌"} toFixedSafe(${test.input}, ${test.decimals}) = "${result}" (expected: "${test.expected}")`,
    )
    if (passed) toFixedPassed++
    totalTests++
  }
  totalPassed += toFixedPassed

  console.log(`  📊 Result: ${toFixedPassed}/${toFixedTests.length} tests passed`)
  console.log("")

  // Test toNumberSafe
  console.log("🔢 Testing toNumberSafe:")
  console.log("-".repeat(30))

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
    { input: Number.NaN, fallback: 100, expected: 100 },
  ]

  let toNumberPassed = 0
  for (const test of toNumberTests) {
    const result = toNumberSafe(test.input, test.fallback)
    const passed = result === test.expected
    console.log(
      `  ${passed ? "✅" : "❌"} toNumberSafe(${JSON.stringify(test.input)}, ${test.fallback}) = ${result} (expected: ${test.expected})`,
    )
    if (passed) toNumberPassed++
    totalTests++
  }
  totalPassed += toNumberPassed

  console.log(`  📊 Result: ${toNumberPassed}/${toNumberTests.length} tests passed`)
  console.log("")

  // Test toCurrencySafe
  console.log("💰 Testing toCurrencySafe:")
  console.log("-".repeat(30))

  const currencyTests = [
    { input: 123.456, currency: "€", decimals: 2, expected: "€123.46" },
    { input: 0, currency: "$", decimals: 2, expected: "$0.00" },
    { input: Number.NaN, currency: "€", decimals: 2, expected: "€0.00" },
    { input: 1000, currency: "£", decimals: 0, expected: "£1000" },
  ]

  let currencyPassed = 0
  for (const test of currencyTests) {
    const result = toCurrencySafe(test.input, test.currency, test.decimals)
    const passed = result === test.expected
    console.log(
      `  ${passed ? "✅" : "❌"} toCurrencySafe(${test.input}, "${test.currency}", ${test.decimals}) = "${result}" (expected: "${test.expected}")`,
    )
    if (passed) currencyPassed++
    totalTests++
  }
  totalPassed += currencyPassed

  console.log(`  📊 Result: ${currencyPassed}/${currencyTests.length} tests passed`)
  console.log("")

  // Test toPercentageSafe
  console.log("📊 Testing toPercentageSafe:")
  console.log("-".repeat(30))

  const percentageTests = [
    { value: 25, total: 100, decimals: 1, expected: 25.0 },
    { value: 1, total: 3, decimals: 2, expected: 33.33 },
    { value: 0, total: 100, decimals: 1, expected: 0.0 },
    { value: 50, total: 0, decimals: 1, expected: 0.0 }, // Division by zero
  ]

  let percentagePassed = 0
  for (const test of percentageTests) {
    const result = toPercentageSafe(test.value, test.total, test.decimals)
    const passed = result === test.expected
    console.log(
      `  ${passed ? "✅" : "❌"} toPercentageSafe(${test.value}, ${test.total}, ${test.decimals}) = ${result} (expected: ${test.expected})`,
    )
    if (passed) percentagePassed++
    totalTests++
  }
  totalPassed += percentagePassed

  console.log(`  📊 Result: ${percentagePassed}/${percentageTests.length} tests passed`)
  console.log("")

  // Test clampSafe
  console.log("🔒 Testing clampSafe:")
  console.log("-".repeat(30))

  const clampTests = [
    { value: 50, min: 0, max: 100, expected: 50 },
    { value: -10, min: 0, max: 100, expected: 0 },
    { value: 150, min: 0, max: 100, expected: 100 },
    { value: Number.NaN, min: 0, max: 100, expected: 0 },
  ]

  let clampPassed = 0
  for (const test of clampTests) {
    const result = clampSafe(test.value, test.min, test.max)
    const passed = result === test.expected
    console.log(
      `  ${passed ? "✅" : "❌"} clampSafe(${test.value}, ${test.min}, ${test.max}) = ${result} (expected: ${test.expected})`,
    )
    if (passed) clampPassed++
    totalTests++
  }
  totalPassed += clampPassed

  console.log(`  📊 Result: ${clampPassed}/${clampTests.length} tests passed`)
  console.log("")

  // Final Summary
  console.log("📋 FINAL TEST SUMMARY:")
  console.log("=".repeat(30))
  console.log(`  Total tests run: ${totalTests}`)
  console.log(`  Tests passed: ${totalPassed}`)
  console.log(`  Tests failed: ${totalTests - totalPassed}`)
  console.log(`  Success rate: ${Math.round((totalPassed / totalTests) * 100)}%`)
  console.log("")

  if (totalPassed === totalTests) {
    console.log("🎉 ALL TESTS PASSED! Number helper functions are working correctly.")
    console.log("✅ Ready for deployment!")
    return true
  } else {
    console.log("❌ Some tests failed. Please check the implementation.")
    return false
  }
}

// Run tests if executed directly
if (require.main === module) {
  const success = runAllTests()
  process.exit(success ? 0 : 1)
}

export { runAllTests }
