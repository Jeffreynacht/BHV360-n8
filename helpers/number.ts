/**
 * Safely converts a value to a fixed decimal string
 * @param value - The value to convert
 * @param decimals - Number of decimal places (default: 2)
 * @returns Fixed decimal string or '0.00' if invalid
 */
export function toFixedSafe(value: any, decimals = 2): string {
  if (value === null || value === undefined || isNaN(Number(value))) {
    return "0." + "0".repeat(decimals)
  }
  return Number(value).toFixed(decimals)
}

/**
 * Safely converts a value to a number
 * @param value - The value to convert
 * @param defaultValue - Default value if conversion fails (default: 0)
 * @returns Number or default value
 */
export function toNumberSafe(value: any, defaultValue = 0): number {
  if (value === null || value === undefined || isNaN(Number(value))) {
    return defaultValue
  }
  return Number(value)
}

/**
 * Formats a number as currency
 * @param value - The value to format
 * @param currency - Currency code (default: 'EUR')
 * @param locale - Locale for formatting (default: 'nl-NL')
 * @returns Formatted currency string
 */
export function formatCurrency(value: any, currency = "EUR", locale = "nl-NL"): string {
  const numValue = toNumberSafe(value)
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(numValue)
}

/**
 * Formats a number as percentage
 * @param value - The value to format (0.1 = 10%)
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted percentage string
 */
export function formatPercentage(value: any, decimals = 1): string {
  const numValue = toNumberSafe(value)
  return (numValue * 100).toFixed(decimals) + "%"
}

/**
 * Clamps a number between min and max values
 * @param value - The value to clamp
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Clamped value
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * Rounds a number to specified decimal places
 * @param value - The value to round
 * @param decimals - Number of decimal places (default: 2)
 * @returns Rounded number
 */
export function roundToDecimals(value: number, decimals = 2): number {
  const factor = Math.pow(10, decimals)
  return Math.round(value * factor) / factor
}
