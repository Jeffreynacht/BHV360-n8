import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, company, message } = body

    // Validate required fields
    if (!name || !email || !company) {
      return NextResponse.json({ success: false, error: "Naam, email en bedrijfsnaam zijn verplicht" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, error: "Ongeldig email adres" }, { status: 400 })
    }

    // Here you would typically:
    // 1. Save to database
    // 2. Send email notification
    // 3. Add to CRM system
    // 4. Send auto-reply email

    console.log("Contact form submission:", {
      name,
      email,
      phone,
      company,
      message,
      timestamp: new Date().toISOString(),
    })

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real application, you would integrate with:
    // - Email service (SendGrid, Mailgun, etc.)
    // - CRM (HubSpot, Salesforce, etc.)
    // - Database (PostgreSQL, MongoDB, etc.)
    // - Notification service (Slack, Teams, etc.)

    return NextResponse.json({
      success: true,
      message: "Bericht succesvol verzonden. We nemen binnen 24 uur contact op.",
    })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json({ success: false, error: "Er is een fout opgetreden bij het verzenden" }, { status: 500 })
  }
}
