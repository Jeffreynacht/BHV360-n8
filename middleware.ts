import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Routes die geen authenticatie vereisen
const publicRoutes = ["/", "/login", "/api/auth/login", "/api/auth/logout", "/api/auth/status"]

// Routes die altijd toegankelijk zijn (ook voor debugging)
const alwaysAccessibleRoutes = ["/debug", "/debug-auth", "/debug-deployment", "/simple-test", "/api/debug"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  console.log(`🔍 Middleware checking: ${pathname}`)

  // Sta publieke routes altijd toe
  if (publicRoutes.some((route) => pathname === route || pathname.startsWith(route))) {
    console.log(`✅ Public route allowed: ${pathname}`)
    return NextResponse.next()
  }

  // Sta debug routes altijd toe
  if (alwaysAccessibleRoutes.some((route) => pathname.startsWith(route))) {
    console.log(`🔧 Debug route allowed: ${pathname}`)
    return NextResponse.next()
  }

  // Sta static assets toe
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/images") ||
    pathname.includes(".")
  ) {
    return NextResponse.next()
  }

  // Check voor authentication token
  const token =
    request.cookies.get("bhv360-token")?.value || request.headers.get("authorization")?.replace("Bearer ", "")

  if (!token) {
    console.log(`❌ No token found, redirecting to login: ${pathname}`)
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("from", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Verificeer token (basis verificatie)
  try {
    const decoded = JSON.parse(Buffer.from(token, "base64").toString())
    if (decoded.exp && decoded.exp < Date.now()) {
      console.log(`❌ Token expired, redirecting to login: ${pathname}`)
      const loginUrl = new URL("/login", request.url)
      return NextResponse.redirect(loginUrl)
    }
    console.log(`✅ Valid token, allowing access: ${pathname}`)
  } catch (error) {
    console.log(`❌ Invalid token, redirecting to login: ${pathname}`)
    const loginUrl = new URL("/login", request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
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
