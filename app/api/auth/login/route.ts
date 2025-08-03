import { type NextRequest, NextResponse } from "next/server"
import { verifyCredentials, createToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: "Gebruikersnaam en wachtwoord zijn verplicht" }, { status: 400 })
    }

    const user = verifyCredentials(username, password)

    if (!user) {
      return NextResponse.json({ error: "Ongeldige inloggegevens" }, { status: 401 })
    }

    const token = await createToken(user)

    const response = NextResponse.json(
      { success: true, user: { username: user.username, role: user.role } },
      { status: 200 },
    )

    // Set HTTP-only cookie
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Er is een fout opgetreden" }, { status: 500 })
  }
}
