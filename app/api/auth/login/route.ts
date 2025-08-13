import { type NextRequest, NextResponse } from "next/server"

// Demo gebruikers voor productie
const DEMO_USERS = [
  {
    id: "1",
    email: "jeffrey@bhv360.nl",
    name: "Jeffrey Nacht",
    role: "super-admin",
    passwordHash: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // jeffrey123
    avatar: "/placeholder-user.jpg",
  },
  {
    id: "2",
    email: "admin",
    name: "Admin User",
    role: "partner-admin",
    passwordHash: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // bhv360secure
    avatar: "/placeholder-user.jpg",
  },
  {
    id: "3",
    email: "jan@demobedrijf.nl",
    name: "Jan Janssen",
    role: "customer-admin",
    customerId: "demo-bedrijf-bv",
    passwordHash: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // demo123
    avatar: "/placeholder-user.jpg",
  },
  {
    id: "4",
    email: "piet@demobedrijf.nl",
    name: "Piet Pietersen",
    role: "bhv-coordinator",
    customerId: "demo-bedrijf-bv",
    passwordHash: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // piet123
    avatar: "/placeholder-user.jpg",
  },
  {
    id: "5",
    email: "marie@demobedrijf.nl",
    name: "Marie de Vries",
    role: "employee",
    customerId: "demo-bedrijf-bv",
    passwordHash: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // marie123
    avatar: "/placeholder-user.jpg",
  },
  {
    id: "6",
    email: "demo",
    name: "Demo User",
    role: "customer-admin",
    customerId: "demo-bedrijf-bv",
    passwordHash: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // demo123
    avatar: "/placeholder-user.jpg",
  },
]

// Eenvoudige wachtwoord verificatie voor demo
const DEMO_PASSWORDS: Record<string, string> = {
  "jeffrey@bhv360.nl": "jeffrey123",
  admin: "bhv360secure",
  "jan@demobedrijf.nl": "demo123",
  "piet@demobedrijf.nl": "piet123",
  "marie@demobedrijf.nl": "marie123",
  demo: "demo123",
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email en wachtwoord zijn verplicht" }, { status: 400 })
    }

    // Zoek gebruiker
    const user = DEMO_USERS.find((u) => u.email === email)
    if (!user) {
      return NextResponse.json({ error: "Ongeldige inloggegevens" }, { status: 401 })
    }

    // Verificeer wachtwoord (eenvoudig voor demo)
    const expectedPassword = DEMO_PASSWORDS[email]
    if (password !== expectedPassword) {
      return NextResponse.json({ error: "Ongeldige inloggegevens" }, { status: 401 })
    }

    // Verwijder wachtwoord uit response
    const { passwordHash, ...userWithoutPassword } = user

    // Maak JWT token (optioneel voor productie)
    const token = Buffer.from(
      JSON.stringify({
        userId: user.id,
        email: user.email,
        exp: Date.now() + 24 * 60 * 60 * 1000, // 24 uur
      }),
    ).toString("base64")

    const response = NextResponse.json({
      success: true,
      user: userWithoutPassword,
      token,
    })

    // Set HTTP-only cookie voor productie
    response.cookies.set("bhv360-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 24 uur
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Er is een fout opgetreden bij het inloggen" }, { status: 500 })
  }
}
