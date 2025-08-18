import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Mock login validation - replace with your actual auth logic
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "Email and password are required",
        },
        { status: 400 },
      )
    }

    // For demo purposes, accept any email/password combination
    const mockUser = {
      id: "1",
      name: "Demo User",
      email: email,
      role: "SUPER_ADMIN",
      customerId: "1",
      partnerId: null,
      permissions: ["read", "write", "admin"],
    }

    // Create response with mock session
    const response = NextResponse.json({
      success: true,
      user: mockUser,
      message: "Login successful",
    })

    // Set a mock session cookie
    response.cookies.set("session", "mock-session-token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    console.error("Login error:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Login failed",
      },
      { status: 500 },
    )
  }
}
