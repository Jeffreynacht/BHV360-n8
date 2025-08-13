import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyAuth } from "@/lib/auth"

// Routes that require authentication
const protectedRoutes = [
  "/dashboard",
  "/beheer",
  "/bhv",
  "/incidenten",
  "/plotkaart",
  "/klanten",
  "/gebruikers",
  "/instellingen",
  "/notificaties",
  "/help-dashboard",
  "/super-admin",
  "/customer-admin",
  "/partner",
]

// Routes that should redirect to dashboard if already authenticated
const authRoutes = ["/login"]

// Public routes that don't require authentication
const publicRoutes = [
  "/",
  "/api/auth/login",
  "/api/auth/logout",
  "/api/auth/status",
  "/gratis-bhv-software",
  "/mobile-app",
  "/geavanceerde-functies",
  "/smart-scheduling",
  "/skills-assessment",
  "/white-label",
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  console.log("Middleware checking path:", pathname)

  // Allow all API routes except auth routes to pass through
  if (pathname.startsWith("/api/") && !pathname.startsWith("/api/auth/")) {
    return NextResponse.next()
  }

  // Allow static files and Next.js internals
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/images/") ||
    pathname.startsWith("/placeholder") ||
    pathname.includes(".")
  ) {
    return NextResponse.next()
  }

  // Check if route is public
  if (publicRoutes.some((route) => pathname === route || pathname.startsWith(route + "/"))) {
    console.log("Public route, allowing access")
    return NextResponse.next()
  }

  // Check authentication for protected routes
  const isProtectedRoute = protectedRoutes.some((route) => pathname === route || pathname.startsWith(route + "/"))

  if (isProtectedRoute) {
    console.log("Protected route, checking authentication")
    const isAuthenticated = await verifyAuth(request)

    if (!isAuthenticated) {
      console.log("Not authenticated, redirecting to login")
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("from", pathname)
      return NextResponse.redirect(loginUrl)
    }

    console.log("Authenticated, allowing access")
    return NextResponse.next()
  }

  // Handle auth routes (redirect to dashboard if already authenticated)
  if (authRoutes.includes(pathname)) {
    console.log("Auth route, checking if already authenticated")
    const isAuthenticated = await verifyAuth(request)

    if (isAuthenticated) {
      console.log("Already authenticated, redirecting to dashboard")
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    console.log("Not authenticated, allowing access to auth route")
    return NextResponse.next()
  }

  // Default: allow access
  console.log("Default: allowing access")
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
