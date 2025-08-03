import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { isDomainAllowed, getCurrentEnvironment } from "./lib/domain-config"

// Define public routes that don't require authentication
const publicRoutes = [
  "/",
  "/login",
  "/api/auth/login",
  "/api/auth/logout",
  "/api/auth/status",
  "/api/test-db",
  "/api/debug",
  "/api/debug/database",
  "/simple-test",
  "/debug",
  "/debug-auth",
  "/debug-deployment",
  "/database-test",
  "/test-database",
  "/test-database-connection",
  "/database-connection-test",
  "/db-test",
  "/setup-demo",
  "/gratis-bhv-software",
]

export function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl
  const hostname = request.headers.get("host") || ""

  console.log(`🔍 Middleware: ${request.method} ${pathname} on ${hostname}`)

  // Skip middleware for API routes, static files, and Next.js internals
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.includes(".")
  ) {
    return NextResponse.next()
  }

  // In development or preview, allow all domains
  const env = getCurrentEnvironment()
  console.log(`🌍 Environment: ${env}, Hostname: ${hostname}`)

  // Always allow Vercel preview domains and development
  if (
    env === "development" ||
    env === "preview" ||
    hostname.includes("vercel.app") ||
    hostname.includes("vusercontent.net") ||
    hostname.includes("netlify.app") ||
    hostname.includes("localhost")
  ) {
    console.log(`✅ Allowing domain: ${hostname} (${env})`)

    const response = NextResponse.next()

    // Add security headers
    response.headers.set("X-Frame-Options", "DENY")
    response.headers.set("X-Content-Type-Options", "nosniff")
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
    response.headers.set("X-XSS-Protection", "1; mode=block")

    return response
  }

  // Check if domain is allowed in production
  if (!isDomainAllowed(hostname)) {
    console.log(`❌ Blocked request from unauthorized domain: ${hostname}`)

    // Redirect to main domain instead of showing error
    const mainDomain = "https://www.bhv360.nl"
    return NextResponse.redirect(new URL(pathname, mainDomain))
  }

  // Create response with security headers
  const response = NextResponse.next()

  // Security headers
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set("X-XSS-Protection", "1; mode=block")

  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https:",
    "frame-ancestors 'none'",
  ].join("; ")

  response.headers.set("Content-Security-Policy", csp)

  // CORS headers for API requests
  if (pathname.startsWith("/api/")) {
    response.headers.set("Access-Control-Allow-Origin", origin || "*")
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")
  }

  // Allow public routes
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    console.log(`✅ Public route allowed: ${pathname}`)
    return response
  }

  // Basic authentication check for protected routes
  const protectedRoutes = ["/beheer", "/super-admin", "/partner", "/dashboard"]
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  if (isProtectedRoute) {
    // Check for authentication token
    const authToken = request.cookies.get("auth-token")?.value
    const userRole = request.cookies.get("user-role")?.value

    // Redirect to login if not authenticated
    if (!authToken) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Check admin routes
    const adminRoutes = ["/super-admin", "/beheer", "/system-health"]
    if (adminRoutes.some((route) => pathname.startsWith(route))) {
      if (!userRole || !["super-admin", "admin", "customer-admin"].includes(userRole)) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
    }
  }

  // Add environment info to response headers (for debugging)
  response.headers.set("X-Environment", env || "development")
  response.headers.set("X-Hostname", hostname)

  console.log(`✅ Request allowed: ${pathname} on ${hostname}`)
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
