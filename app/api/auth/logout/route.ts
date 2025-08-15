import { NextResponse } from "next/server"

export async function POST() {
  try {
    const response = NextResponse.json({ success: true })

    // Clear session cookie
    response.cookies.set("session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0, // Expire immediately
    })

    console.log("🚪 User logged out, session cleared")
    return response
  } catch (error) {
    console.error("❌ Logout error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Server error",
      },
      { status: 500 },
    )
  }
}
