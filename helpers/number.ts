/**
 * Nederlandse number formatting utilities voor BHV360
 */

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

  if (isNaN(num)) {
    return 0
  }

  return num
}

export function isValidNumber(value: any): boolean {
  return typeof value === "number" && !isNaN(value) && isFinite(value)
}

export function roundToDecimals(value: number, decimals = 2): number {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals)
}

export function formatCurrency(value: number | string, currency = "EUR"): string {
  const num = toNumberSafe(value)
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: currency,
  }).format(num)
}

export function formatPercentage(value: number | string, decimals = 1): string {
  const num = toNumberSafe(value)
  return new Intl.NumberFormat("nl-NL", {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num / 100)
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export function formatPhoneNumber(phone: string): string {
  // Nederlandse telefoon nummer formatting
  const cleaned = phone.replace(/\D/g, "")

  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{3})(\d{2})(\d{3})/, "$1 $2 $3 $4")
  }

  if (cleaned.length === 11 && cleaned.startsWith("31")) {
    return "+" + cleaned.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, "$1 $2 $3 $4")
  }

  return phone
}
