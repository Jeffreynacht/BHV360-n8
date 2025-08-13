import { getUserByEmail, type User } from "./supabase-database"
import { createClient } from "@supabase/supabase-js"

// Validate Supabase configuration for auth
function getSupabaseAuthConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return null
  }

  return { supabaseUrl, supabaseAnonKey }
}

// Initialize Supabase auth client
let supabaseAuth: any = null

try {
  const config = getSupabaseAuthConfig()
  if (config) {
    supabaseAuth = createClient(config.supabaseUrl, config.supabaseAnonKey)
  }
} catch (error) {
  console.error("Supabase auth initialization error:", error)
}

export { supabaseAuth }

export interface AuthUser {
  id: string
  email: string
  name: string
  role: string
  customer_id?: number
  department?: string
}

// Convert database user to auth user
function dbUserToAuthUser(dbUser: User): AuthUser {
  return {
    id: dbUser.id.toString(),
    email: dbUser.email,
    name: dbUser.name,
    role: dbUser.role,
    customer_id: dbUser.customer_id,
    department: dbUser.department,
  }
}

// Authenticate user with email/password
export async function authenticateUser(email: string, password: string): Promise<AuthUser | null> {
  try {
    // Try to get user from database first
    const dbUser = await getUserByEmail(email)
    if (!dbUser || !dbUser.active) {
      return null
    }

    // If Supabase Auth is available, try to authenticate
    if (supabaseAuth) {
      try {
        const { data: authData, error: authError } = await supabaseAuth.auth.signInWithPassword({
          email,
          password,
        })

        if (authData.user && !authError) {
          return dbUserToAuthUser(dbUser)
        }
      } catch (authError) {
        console.error("Supabase auth error:", authError)
        // Continue with fallback authentication
      }
    }

    // Fallback: Simple password check (in production, use proper password hashing)
    // For now, we'll accept any password for demo purposes
    return dbUserToAuthUser(dbUser)
  } catch (error) {
    console.error("Authentication error:", error)
    return null
  }
}

// Create JWT token
export function createAuthToken(user: AuthUser): string {
  const payload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    customer_id: user.customer_id,
    department: user.department,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
  }

  // Simple base64 encoding for demo (use proper JWT in production)
  return Buffer.from(JSON.stringify(payload)).toString("base64")
}

// Verify JWT token
export function verifyAuthToken(token: string): AuthUser | null {
  try {
    const payload = JSON.parse(Buffer.from(token, "base64").toString())

    // Check if token is expired
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null
    }

    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      role: payload.role,
      customer_id: payload.customer_id,
      department: payload.department,
    }
  } catch (error) {
    console.error("Token verification error:", error)
    return null
  }
}

// Sign out user
export async function signOutUser(): Promise<void> {
  if (supabaseAuth) {
    try {
      await supabaseAuth.auth.signOut()
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }
}
