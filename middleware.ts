import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Define public routes that don't require authentication
const publicRoutes = [
  "/",
  "/login",
  "/api/auth/login",
  "/api/auth/logout",
  "/api/auth/status",
  "/simple-test",
  "/debug",
  "/debug-auth",
  "/debug-deployment",
  "/database-test",
  "/test-database",
  "/setup-demo",
  "/gratis-bhv-software",
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  console.log(`🔍 Middleware: ${request.method} ${pathname}`)

  // Skip middleware for API routes, static files, and Next.js internals
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.includes(".")
  ) {
    return NextResponse.next()
  }

  // Allow public routes
  if (publicRoutes.some((route) => pathname === route || pathname.startsWith(route))) {
    console.log(`✅ Public route allowed: ${pathname}`)
    return NextResponse.next()
  }

  // For protected routes, check authentication
  const authToken = request.cookies.get("auth-token")?.value

  if (!authToken) {
    console.log(`❌ No auth token, redirecting to login: ${pathname}`)
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  console.log(`✅ Request allowed: ${pathname}`)
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
