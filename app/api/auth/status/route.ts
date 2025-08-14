import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get("session")

    if (!sessionCookie) {
      console.log("❌ No session cookie found")
      return NextResponse.json({
        authenticated: false,
        user: null,
      })
    }

    const sessionData = JSON.parse(sessionCookie.value)
    console.log("✅ Session found for:", sessionData.name, "with role:", sessionData.role)

    return NextResponse.json({
      authenticated: true,
      user: sessionData,
    })
  } catch (error) {
    console.error("❌ Session check error:", error)
    return NextResponse.json({
      authenticated: false,
      user: null,
    })
  }
}
