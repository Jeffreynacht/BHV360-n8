import { type NextRequest, NextResponse } from "next/server"

interface ContactFormData {
  name: string
  email: string
  phone: string
  company: string
  companyType: string
  companySize: string
  interest: string
  message: string
}

export async function POST(request: NextRequest) {
  try {
    const data: ContactFormData = await request.json()

    // Validate required fields
    if (!data.name || !data.email || !data.company) {
      return NextResponse.json({ error: "Naam, email en bedrijfsnaam zijn verplicht" }, { status: 400 })
    }

    // Send notification email to sales team
    const salesEmailResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/email/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: "info@BHV360.nl",
        cc: ["sales@BHV360.nl"],
        subject: `🎯 Nieuwe Demo Aanvraag - ${data.company}`,
        template: "sales_notification",
        data: {
          customerName: data.name,
          customerEmail: data.email,
          customerPhone: data.phone || "Niet opgegeven",
          company: data.company,
          companyType: data.companyType || "Niet opgegeven",
          companySize: data.companySize || "Niet opgegeven",
          interest: data.interest || "Algemene interesse",
          message: data.message || "Geen aanvullend bericht",
          submittedAt: new Date().toLocaleString("nl-NL"),
        },
        priority: "high",
      }),
    })

    // Send confirmation email to customer
    const customerEmailResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/email/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: data.email,
        subject: "✅ Bevestiging Demo Aanvraag - BHV360",
        template: "customer_confirmation",
        data: {
          customerName: data.name,
          company: data.company,
          interest: data.interest || "Demo",
        },
        priority: "normal",
      }),
    })

    // Log the contact form submission
    console.log("Contact form submission:", {
      timestamp: new Date().toISOString(),
      customer: data.name,
      company: data.company,
      email: data.email,
      interest: data.interest,
      salesEmailSent: salesEmailResponse.ok,
      customerEmailSent: customerEmailResponse.ok,
    })

    return NextResponse.json({
      success: true,
      message: "Demo aanvraag succesvol verzonden",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json({ error: "Er is een fout opgetreden bij het verzenden van uw aanvraag" }, { status: 500 })
  }
}
