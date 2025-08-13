import type { NextRequest } from "next/server"

export interface User {
  id: string
  email: string
  name: string
  role: "super-admin" | "partner-admin" | "customer-admin" | "bhv-coordinator" | "employee"
  customerId?: string
  avatar?: string
}

export function getTokenFromRequest(request: NextRequest): string | null {
  // Probeer cookie eerst
  const cookieToken = request.cookies.get("bhv360-token")?.value
  if (cookieToken) {
    return cookieToken
  }

  // Probeer Authorization header
  const authHeader = request.headers.get("authorization")
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7)
  }

  return null
}

export function verifyToken(token: string): User | null {
  try {
    const decoded = JSON.parse(Buffer.from(token, "base64").toString())

    // Check expiration
    if (decoded.exp && decoded.exp < Date.now()) {
      return null
    }

    // Return basic user info (in productie zou je dit uit database halen)
    return {
      id: decoded.userId,
      email: decoded.email,
      name: decoded.name || "User",
      role: decoded.role || "employee",
    }
  } catch (error) {
    console.error("Token verification failed:", error)
    return null
  }
}

export function isAuthenticated(request: NextRequest): boolean {
  const token = getTokenFromRequest(request)
  if (!token) return false

  const user = verifyToken(token)
  return user !== null
}

export function hasRole(request: NextRequest, requiredRoles: string[]): boolean {
  const token = getTokenFromRequest(request)
  if (!token) return false

  const user = verifyToken(token)
  if (!user) return false

  return requiredRoles.includes(user.role)
}
