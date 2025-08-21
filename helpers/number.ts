/**
 * Safely converts a value to a fixed decimal string
 * @param value - The value to convert
 * @param decimals - Number of decimal places (default: 2)
 * @returns Fixed decimal string or empty string if invalid
 */
export function toFixedSafe(value: unknown, decimals = 2): string {
  if (value === null || value === undefined || value === "") {
    return ""
  }

  const num = Number(value)
  if (isNaN(num)) {
    return ""
  }

  return num.toFixed(decimals)
}

/**
 * Safely converts a value to a number
 * @param value - The value to convert
 * @param defaultValue - Default value if conversion fails (default: 0)
 * @returns Number or default value
 */
export function toNumberSafe(value: unknown, defaultValue = 0): number {
  if (value === null || value === undefined || value === "") {
    return defaultValue
  }

  const num = Number(value)
  return isNaN(num) ? defaultValue : num
}

/**
 * Formats a number as currency
 * @param value - The value to format
 * @param currency - Currency code (default: 'EUR')
 * @param locale - Locale string (default: 'nl-NL')
 * @returns Formatted currency string
 */
export function formatCurrency(value: number, currency = "EUR", locale = "nl-NL"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value)
}

/**
 * Formats a number as percentage
 * @param value - The value to format (0.1 = 10%)
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number, decimals = 1): string {
  return (value * 100).toFixed(decimals) + "%"
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
 * Checks if a value is a valid number
 * @param value - The value to check
 * @returns True if valid number
 */
export function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && !isNaN(value) && isFinite(value)
}

/**
 * Formats a number with thousand separators
 * @param value - The value to format
 * @param locale - Locale string (default: 'nl-NL')
 * @returns Formatted number string
 */
export function formatNumber(value: number, locale = "nl-NL"): string {
  return new Intl.NumberFormat(locale).format(value)
}
