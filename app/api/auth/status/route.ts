import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get("bhv360-session")

    if (!sessionCookie) {
      return NextResponse.json({
        authenticated: false,
        user: null,
      })
    }

    // In a real app, you would validate the session token
    // For now, we'll return a mock user if session exists
    const mockUser = {
      id: 1,
      customer_id: 1,
      name: "Demo User",
      email: "demo@example.com",
      role: "admin",
      department: "IT",
      bhv_roles: ["bhv_coordinator"],
      active: true,
    }

    return NextResponse.json({
      authenticated: true,
      user: mockUser,
    })
  } catch (error) {
    console.error("Auth status check failed:", error)
    return NextResponse.json(
      {
        authenticated: false,
        user: null,
        error: "Failed to check authentication status",
      },
      { status: 500 },
    )
  }
}
