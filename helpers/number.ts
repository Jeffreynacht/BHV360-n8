/**
 * Safely converts a value to a fixed decimal string
 * @param value - The value to convert
 * @param decimals - Number of decimal places (default: 2)
 * @returns Fixed decimal string or "0.00" if invalid
 */
export function toFixedSafe(value: unknown, decimals = 2): string {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value.toFixed(decimals)
  }
  return "0." + "0".repeat(decimals)
}

/**
 * Safely converts a value to a number
 * @param value - The value to convert
 * @param fallback - Fallback value if conversion fails (default: 0)
 * @returns Number or fallback
 */
export function toNumberSafe(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value
  }
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value)
    if (Number.isFinite(parsed)) {
      return parsed
    }
  }
  return fallback
}
