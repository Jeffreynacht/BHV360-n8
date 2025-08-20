import { type NextRequest, NextResponse } from "next/server"

// Force dynamic rendering for this route
export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    // Mock authentication check - replace with your actual auth logic
    const authHeader = request.headers.get("authorization")
    const sessionCookie = request.cookies.get("session")

    // For demo purposes, return a mock user if any auth token exists
    if (authHeader || sessionCookie) {
      return NextResponse.json({
        success: true,
        authenticated: true,
        user: {
          id: "1",
          name: "Demo User",
          email: "demo@bhv360.nl",
          role: "SUPER_ADMIN",
          customerId: "1",
          partnerId: null,
          permissions: ["read", "write", "admin"],
        },
      })
    }

    // No authentication found
    return NextResponse.json({
      success: true,
      authenticated: false,
      user: null,
    })
  } catch (error) {
    console.error("Auth status check error:", error)

    return NextResponse.json(
      {
        success: false,
        authenticated: false,
        user: null,
        error: "Authentication check failed",
      },
      { status: 500 },
    )
  }
}
