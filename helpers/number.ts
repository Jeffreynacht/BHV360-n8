/**
 * Safe number formatting helper to prevent .toFixed() errors during prerender
 */
export function toFixedSafe(value: unknown, digits = 2): string {
  const n = Number(value)
  return Number.isFinite(n) ? n.toFixed(digits) : "—"
}

/**
 * Format currency safely
 */
export function formatCurrency(value: unknown, currency = "EUR"): string {
  const n = Number(value)
  if (!Number.isFinite(n)) return "—"

  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency,
  }).format(n)
}

/**
 * Format percentage safely
 */
export function formatPercentage(value: unknown, digits = 1): string {
  const n = Number(value)
  if (!Number.isFinite(n)) return "—"

  return `${n.toFixed(digits)}%`
}

/**
 * Safe number coercion with fallback
 */
export function safeNumber(value: unknown, fallback = 0): number {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}
