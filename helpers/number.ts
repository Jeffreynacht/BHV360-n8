/**
 * Safe toFixed function that handles undefined/null values
 */
export function toFixedSafe(value: number | undefined | null, decimals = 2): string {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return "0." + "0".repeat(decimals)
  }
  return value.toFixed(decimals)
}

/**
 * Safe number formatting with fallback
 */
export function formatNumber(value: number | undefined | null, decimals = 2): string {
  return toFixedSafe(value, decimals)
}

/**
 * Safe percentage formatting
 */
export function formatPercentage(value: number | undefined | null, decimals = 1): string {
  return toFixedSafe(value, decimals) + "%"
}
