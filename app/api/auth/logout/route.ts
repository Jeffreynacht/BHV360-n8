import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({
      success: true,
      message: "Succesvol uitgelogd",
    })

    // Verwijder authentication cookie
    response.cookies.set("bhv360-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0, // Verwijder cookie
    })

    return response
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "Er is een fout opgetreden bij het uitloggen" }, { status: 500 })
  }
}
