import type { NextRequest } from "next/server"
import { SignJWT, jwtVerify } from "jose"

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || "bhv360-super-secret-key-change-in-production",
)

export interface AuthUser {
  username: string
  role: string
}

// Verify authentication from request
export async function verifyAuth(request: NextRequest): Promise<boolean> {
  try {
    const token = request.cookies.get("auth-token")?.value
    console.log("Auth token present:", !!token)

    if (!token) {
      console.log("No auth token found")
      return false
    }

    const { payload } = await jwtVerify(token, JWT_SECRET)
    console.log("JWT payload:", payload)
    const isValid = !!payload.username
    console.log("Token is valid:", isValid)
    return isValid
  } catch (error) {
    console.error("JWT verification failed:", error)
    return false
  }
}

// Get user from request
export async function getUser(request: NextRequest): Promise<AuthUser | null> {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return null
    }

    const { payload } = await jwtVerify(token, JWT_SECRET)
    return {
      username: payload.username as string,
      role: (payload.role as string) || "user",
    }
  } catch (error) {
    console.error("Get user error:", error)
    return null
  }
}

// Create JWT token
export async function createToken(user: AuthUser): Promise<string> {
  return await new SignJWT({
    username: user.username,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(JWT_SECRET)
}

// Verify login credentials
export function verifyCredentials(username: string, password: string): AuthUser | null {
  // Production credentials - change these!
  const defaultPassword = process.env.AUTH_PASSWORD || process.env.NEXT_PUBLIC_DEFAULT_PASSWORD || "bhv360secure"

  const validCredentials = [
    // Super admin
    { username: "jeffrey@bhv360.nl", password: "jeffrey123", role: "super-admin" },
    { username: "admin", password: defaultPassword, role: "admin" },

    // Demo accounts
    { username: "jan@demobedrijf.nl", password: "demo123", role: "admin" },
    { username: "piet@demobedrijf.nl", password: "piet123", role: "bhv-coordinator" },
    { username: "marie@demobedrijf.nl", password: "marie123", role: "employee" },

    // Generic accounts
    { username: "bhv", password: defaultPassword, role: "user" },
    { username: "demo", password: "demo123", role: "user" },
  ]

  console.log("Verifying credentials for username:", username)
  console.log(
    "Available usernames:",
    validCredentials.map((c) => c.username),
  )

  const user = validCredentials.find((cred) => cred.username === username && cred.password === password)

  if (user) {
    console.log("Credentials verified for:", user.username, "with role:", user.role)
    return { username: user.username, role: user.role }
  }

  console.log("Invalid credentials for:", username)
  return null
}
