export function toFixedSafe(value: number | string | null | undefined, decimals = 2): string {
  if (value === null || value === undefined || value === "") {
    return "0.00"
  }

  const num = typeof value === "string" ? Number.parseFloat(value) : value
  if (isNaN(num)) {
    return "0.00"
  }

  return num.toFixed(decimals)
}

export function toNumberSafe(value: string | number | null | undefined): number {
  if (value === null || value === undefined || value === "") {
    return 0
  }

  const num = typeof value === "string" ? Number.parseFloat(value) : value
  return isNaN(num) ? 0 : num
}

export function formatCurrency(value: number | string | null | undefined, currency = "€"): string {
  const num = toNumberSafe(value)
  return `${currency}${toFixedSafe(num, 2)}`
}

export function formatPercentage(value: number | string | null | undefined): string {
  const num = toNumberSafe(value)
  return `${toFixedSafe(num, 1)}%`
}

export function isValidNumber(value: any): boolean {
  return !isNaN(Number.parseFloat(value)) && isFinite(value)
}
