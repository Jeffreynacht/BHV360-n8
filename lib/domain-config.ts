export interface DomainConfig {
  production: string[]
  staging: string[]
  development: string[]
  preview: string[]
}

export const ALLOWED_DOMAINS: DomainConfig = {
  production: ["bhv360.nl", "www.bhv360.nl", "app.bhv360.nl", "dashboard.bhv360.nl"],
  staging: ["staging.bhv360.nl", "test.bhv360.nl", "dev.bhv360.nl"],
  development: ["localhost", "127.0.0.1", "0.0.0.0"],
  preview: [
    "vercel.app",
    "vercel-preview.app",
    "netlify.app",
    "vusercontent.net", // Add this for Vercel preview domains
    "bhv360.vercel.app",
    "preview-bhv360",
  ],
}

export const appName = "BHV360"
export const appDescription = "BHV360 - Uw partner in veiligheid"
export const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

export function getCurrentEnvironment(): keyof DomainConfig {
  if (typeof window === "undefined") {
    // Server-side environment detection
    const nodeEnv = process.env.NODE_ENV
    const vercelEnv = process.env.VERCEL_ENV

    if (nodeEnv === "production" && vercelEnv === "production") {
      return "production"
    }

    if (vercelEnv === "preview" || nodeEnv === "development") {
      return "preview" // Changed from development to preview for Vercel previews
    }

    if (vercelEnv === "staging") {
      return "staging"
    }

    return "development"
  } else {
    // Client-side environment detection
    const hostname = window.location.hostname

    if (hostname.includes("localhost") || hostname.includes("127.0.0.1")) {
      return "development"
    }

    if (hostname.includes("vercel.app") || hostname.includes("netlify.app") || hostname.includes("vusercontent.net")) {
      return "preview"
    }

    if (hostname.includes("staging") || hostname.includes("test") || hostname.includes("dev")) {
      return "staging"
    }

    return "production"
  }
}

export function getAllowedDomains(): string[] {
  const env = getCurrentEnvironment()
  return [
    ...ALLOWED_DOMAINS[env],
    ...ALLOWED_DOMAINS.development, // Always allow development domains
    ...ALLOWED_DOMAINS.preview, // Always allow preview domains
  ]
}

export function isDomainAllowed(domain: string): boolean {
  const allowedDomains = getAllowedDomains()

  // Always allow Vercel preview domains
  if (domain.includes("vercel.app") || domain.includes("vusercontent.net") || domain.includes("netlify.app")) {
    return true
  }

  // Always allow localhost and development
  if (domain.includes("localhost") || domain.includes("127.0.0.1") || domain.includes("0.0.0.0")) {
    return true
  }

  // Check exact match
  if (allowedDomains.includes(domain)) {
    return true
  }

  // Check if domain ends with any allowed domain (for subdomains)
  return allowedDomains.some((allowedDomain) => {
    if (allowedDomain.startsWith(".")) {
      return domain.endsWith(allowedDomain)
    }
    return domain.endsWith(`.${allowedDomain}`) || domain.includes(allowedDomain)
  })
}

export function getAppUrl(): string {
  if (typeof window !== "undefined") {
    return window.location.origin
  }

  // Server-side URL detection
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  const env = getCurrentEnvironment()

  switch (env) {
    case "production":
      return "https://www.bhv360.nl"
    case "staging":
      return "https://staging.bhv360.nl"
    case "development":
      return "http://localhost:3000"
    case "preview":
      return process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"
    default:
      return "http://localhost:3000"
  }
}

export function isProduction(): boolean {
  return getCurrentEnvironment() === "production"
}

export function isDevelopment(): boolean {
  const env = getCurrentEnvironment()
  return env === "development" || env === "preview"
}

export function getApiUrl(): string {
  const baseUrl = getAppUrl()
  return `${baseUrl}/api`
}

export function getCorsOrigins(): string[] {
  const allowedDomains = getAllowedDomains()

  return [
    ...allowedDomains.map((domain) => `https://${domain}`),
    ...allowedDomains.map((domain) => `http://${domain}`),
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "https://*.vercel.app",
    "https://*.vusercontent.net",
    "https://*.netlify.app",
  ]
}
