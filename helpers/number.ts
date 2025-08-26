/**
 * Number utility functions for safe number operations
 * Provides error handling for edge cases like NaN, Infinity, and invalid inputs
 */

/**
 * Safely converts a number to fixed decimal places with error handling
 * @param value - The number to convert
 * @param decimals - Number of decimal places (default: 2)
 * @returns String representation with fixed decimals, "0.00" if invalid
 */
export function toFixedSafe(value: number, decimals = 2): string {
  // Handle invalid inputs
  if (typeof value !== "number" || isNaN(value) || !isFinite(value)) {
    return "0".padEnd(decimals > 0 ? decimals + 2 : 1, "0").replace(/^0/, "0.")
  }

  // Ensure decimals is a valid positive integer
  const safeDecimals = Math.max(0, Math.floor(decimals))

  try {
    return value.toFixed(safeDecimals)
  } catch (error) {
    // Fallback for any unexpected errors
    return "0".padEnd(safeDecimals > 0 ? safeDecimals + 2 : 1, "0").replace(/^0/, "0.")
  }
}

/**
 * Safely converts any value to a number with fallback
 * @param value - The value to convert to number
 * @param fallback - Fallback value if conversion fails (default: 0)
 * @returns Number or fallback value
 */
export function toNumberSafe(value: any, fallback = 0): number {
  // Handle null, undefined, or empty string
  if (value === null || value === undefined || value === "") {
    return fallback
  }

  // If already a number, check if it's valid
  if (typeof value === "number") {
    return isNaN(value) || !isFinite(value) ? fallback : value
  }

  // Convert string to number
  if (typeof value === "string") {
    // Remove common currency symbols and whitespace
    const cleanValue = value.replace(/[€$£¥,\s]/g, "").trim()

    // Try to parse as number
    const parsed = Number.parseFloat(cleanValue)

    // Return parsed number if valid, otherwise fallback
    return isNaN(parsed) || !isFinite(parsed) ? fallback : parsed
  }

  // For other types, try to convert
  try {
    const converted = Number(value)
    return isNaN(converted) || !isFinite(converted) ? fallback : converted
  } catch (error) {
    return fallback
  }
}

/**
 * Formats a number as currency with safe handling
 * @param value - The number to format
 * @param currency - Currency symbol (default: '€')
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted currency string
 */
export function toCurrencySafe(value: number, currency = "€", decimals = 2): string {
  const safeValue = toNumberSafe(value, 0)
  const formatted = toFixedSafe(safeValue, decimals)
  return `${currency}${formatted}`
}

/**
 * Safely calculates percentage with error handling
 * @param value - The value
 * @param total - The total value
 * @param decimals - Number of decimal places (default: 1)
 * @returns Percentage as number, 0 if invalid
 */
export function toPercentageSafe(value: number, total: number, decimals = 1): number {
  const safeValue = toNumberSafe(value, 0)
  const safeTotal = toNumberSafe(total, 0)

  if (safeTotal === 0) {
    return 0
  }

  const percentage = (safeValue / safeTotal) * 100
  return toNumberSafe(toFixedSafe(percentage, decimals), 0)
}

/**
 * Clamps a number between min and max values
 * @param value - The number to clamp
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Clamped number
 */
export function clampSafe(value: number, min: number, max: number): number {
  const safeValue = toNumberSafe(value, 0)
  const safeMin = toNumberSafe(min, 0)
  const safeMax = toNumberSafe(max, 100)

  return Math.min(Math.max(safeValue, safeMin), safeMax)
}
