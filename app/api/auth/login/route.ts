import { type NextRequest, NextResponse } from "next/server"
import { verifyCredentials, createToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    console.log("Login attempt for:", username)

    if (!username || !password) {
      return NextResponse.json({ error: "Gebruikersnaam en wachtwoord zijn verplicht" }, { status: 400 })
    }

    const user = verifyCredentials(username, password)

    if (!user) {
      console.log("Invalid credentials for:", username)
      return NextResponse.json({ error: "Ongeldige inloggegevens" }, { status: 401 })
    }

    console.log("User authenticated:", user.username)

    const token = await createToken(user)

    const response = NextResponse.json(
      {
        success: true,
        user: {
          username: user.username,
          role: user.role,
          email: user.username,
        },
      },
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
    return NextResponse.json({ error: "Er is een fout opgetreden bij het inloggen" }, { status: 500 })
  }
}
