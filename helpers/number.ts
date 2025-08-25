/**
 * Number utility functions for BHV360 application
 */

/**
 * Format a number as currency (EUR)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  }).format(amount)
}

/**
 * Format a number with thousand separators
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("nl-NL").format(num)
}

/**
 * Round a number to specified decimal places
 */
export function roundToDecimals(num: number, decimals = 2): number {
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals)
}

/**
 * Convert percentage to decimal
 */
export function percentageToDecimal(percentage: number): number {
  return percentage / 100
}

/**
 * Convert decimal to percentage
 */
export function decimalToPercentage(decimal: number): number {
  return decimal * 100
}

/**
 * Calculate percentage of a value
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0
  return (value / total) * 100
}

/**
 * Clamp a number between min and max values
 */
export function clamp(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max)
}

/**
 * Generate a random number between min and max (inclusive)
 */
export function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Check if a number is even
 */
export function isEven(num: number): boolean {
  return num % 2 === 0
}

/**
 * Check if a number is odd
 */
export function isOdd(num: number): boolean {
  return num % 2 !== 0
}

/**
 * Sum an array of numbers
 */
export function sum(numbers: number[]): number {
  return numbers.reduce((acc, num) => acc + num, 0)
}

/**
 * Calculate average of an array of numbers
 */
export function average(numbers: number[]): number {
  if (numbers.length === 0) return 0
  return sum(numbers) / numbers.length
}

/**
 * Find the maximum value in an array of numbers
 */
export function max(numbers: number[]): number {
  return Math.max(...numbers)
}

/**
 * Find the minimum value in an array of numbers
 */
export function min(numbers: number[]): number {
  return Math.min(...numbers)
}

/**
 * Format file size in bytes to human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

/**
 * Format duration in milliseconds to human readable format
 */
export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}d ${hours % 24}h`
  if (hours > 0) return `${hours}h ${minutes % 60}m`
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`
  return `${seconds}s`
}

/**
 * Parse a string to number with fallback
 */
export function parseNumber(value: string | number, fallback = 0): number {
  if (typeof value === "number") return value
  const parsed = Number.parseFloat(value)
  return isNaN(parsed) ? fallback : parsed
}

/**
 * Format number as ordinal (1st, 2nd, 3rd, etc.)
 */
export function formatOrdinal(num: number): string {
  const suffixes = ["th", "st", "nd", "rd"]
  const v = num % 100
  return num + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0])
}

/**
 * Convert number to Roman numerals
 */
export function toRoman(num: number): string {
  const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1]
  const numerals = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"]

  let result = ""
  for (let i = 0; i < values.length; i++) {
    while (num >= values[i]) {
      result += numerals[i]
      num -= values[i]
    }
  }
  return result
}

/**
 * Check if a number is within a range (inclusive)
 */
export function isInRange(num: number, min: number, max: number): boolean {
  return num >= min && num <= max
}

/**
 * Linear interpolation between two numbers
 */
export function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor
}

/**
 * Map a number from one range to another
 */
export function mapRange(value: number, fromMin: number, fromMax: number, toMin: number, toMax: number): number {
  return ((value - fromMin) * (toMax - toMin)) / (fromMax - fromMin) + toMin
}
