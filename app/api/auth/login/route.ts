import { type NextRequest, NextResponse } from "next/server"

// Demo users with their credentials and roles
const demoUsers = [
  {
    id: "1",
    email: "security@demobedrijf.nl",
    password: "demo123",
    name: "Security Medewerker",
    role: "security-receptionist",
    customerId: "demo-company",
    customerName: "Demo Bedrijf BV",
    department: "Beveiliging",
    active: true,
  },
  {
    id: "2",
    email: "jan@demobedrijf.nl",
    password: "demo123",
    name: "Jan Pietersen",
    role: "admin", // Changed from bhv-coordinator to admin
    customerId: "demo-company",
    customerName: "Demo Bedrijf BV",
    department: "BHV",
    active: true,
  },
  {
    id: "3",
    email: "marie@demobedrijf.nl",
    password: "demo123",
    name: "Marie Janssen",
    role: "employee",
    customerId: "demo-company",
    customerName: "Demo Bedrijf BV",
    department: "HR",
    active: true,
  },
  {
    id: "4",
    email: "admin@demobedrijf.nl",
    password: "demo123",
    name: "Admin Gebruiker",
    role: "customer-admin",
    customerId: "demo-company",
    customerName: "Demo Bedrijf BV",
    department: "IT",
    active: true,
  },
]

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    console.log("🔐 Login attempt for:", email)

    // Find user in demo data
    const user = demoUsers.find((u) => u.email === email && u.password === password)

    if (!user) {
      console.log("❌ Invalid credentials for:", email)
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email or password",
        },
        { status: 401 },
      )
    }

    console.log("✅ User found:", user.name, "with role:", user.role)

    // Create session data
    const sessionData = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      customerId: user.customerId,
      customerName: user.customerName,
      loginTime: new Date().toISOString(),
    }

    // Create response with session cookie
    const response = NextResponse.json({
      success: true,
      user: sessionData,
      message: `Welcome ${user.name}!`,
    })

    // Set session cookie
    response.cookies.set("session", JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    console.log("🍪 Session cookie set for:", user.name)
    return response
  } catch (error) {
    console.error("❌ Login error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Server error",
      },
      { status: 500 },
    )
  }
}
