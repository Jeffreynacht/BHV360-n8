import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "Email and password are required",
        },
        { status: 400 },
      )
    }

    // Demo credentials - in a real app, you would validate against your database
    const demoCredentials = [
      { email: "jan@demobedrijf.nl", password: "demo123", name: "Jan de Vries", role: "admin" },
      { email: "marie@demobedrijf.nl", password: "demo123", name: "Marie Janssen", role: "bhv_coordinator" },
      { email: "piet@demobedrijf.nl", password: "demo123", name: "Piet van der Berg", role: "bhv_medewerker" },
      { email: "lisa@demobedrijf.nl", password: "demo123", name: "Lisa de Jong", role: "employee" },
      { email: "tom@demobedrijf.nl", password: "demo123", name: "Tom Bakker", role: "ehbo" },
    ]

    const user = demoCredentials.find((cred) => cred.email === email && cred.password === password)

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email or password",
        },
        { status: 401 },
      )
    }

    // Create session
    const sessionToken = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const response = NextResponse.json({
      success: true,
      user: {
        id: 1,
        customer_id: 1,
        name: user.name,
        email: user.email,
        role: user.role,
        department: "Demo Department",
        bhv_roles: user.role === "bhv_coordinator" ? ["bhv_coordinator"] : [],
        active: true,
      },
    })

    // Set session cookie
    response.cookies.set("bhv360-session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Login failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Login failed due to server error",
      },
      { status: 500 },
    )
  }
}
