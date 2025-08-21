/**
 * Safe toFixed implementation that handles null/undefined values
 */
export function toFixedSafe(value: number | string | null | undefined, decimals = 2): string {
  if (value === null || value === undefined) {
    return Number(0).toFixed(decimals)
  }

  const numValue = typeof value === "string" ? Number.parseFloat(value) : Number(value)

  if (Number.isNaN(numValue)) {
    return Number(0).toFixed(decimals)
  }

  return numValue.toFixed(decimals)
}

/**
 * Safe number conversion that handles null/undefined values
 */
export function toNumberSafe(value: number | string | null | undefined): number {
  if (value === null || value === undefined) {
    return 0
  }

  const numValue = typeof value === "string" ? Number.parseFloat(value) : Number(value)

  return Number.isNaN(numValue) ? 0 : numValue
}
