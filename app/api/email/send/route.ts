import { type NextRequest, NextResponse } from "next/server"

interface EmailRequest {
  to: string | string[]
  cc?: string[]
  bcc?: string[]
  subject: string
  template?: string
  html?: string
  text?: string
  data?: Record<string, any>
  priority?: "low" | "normal" | "high" | "critical"
  attachments?: Array<{
    filename: string
    content: string
    encoding?: string
  }>
}

export async function POST(request: NextRequest) {
  try {
    const emailData: EmailRequest = await request.json()

    // Validate required fields
    if (!emailData.to || !emailData.subject) {
      return NextResponse.json({ error: "To en subject zijn verplicht" }, { status: 400 })
    }

    let htmlContent = emailData.html || ""
    let textContent = emailData.text || ""

    // Generate content based on template
    if (emailData.template && emailData.data) {
      const templateResult = generateEmailTemplate(emailData.template, emailData.data)
      htmlContent = templateResult.html
      textContent = templateResult.text
    }

    // In production, you would integrate with an email service like SendGrid, Mailgun, etc.
    // For now, we'll simulate the email sending
    const emailResult = await sendEmail({
      ...emailData,
      html: htmlContent,
      text: textContent,
    })

    return NextResponse.json({
      success: true,
      messageId: emailResult.messageId,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Email sending error:", error)
    return NextResponse.json({ error: "Er is een fout opgetreden bij het verzenden van de email" }, { status: 500 })
  }
}

function generateEmailTemplate(template: string, data: Record<string, any>) {
  const templates = {
    sales_notification: {
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Nieuwe Demo Aanvraag - BHV360</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #2563eb 0%, #16a34a 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🎯 Nieuwe Demo Aanvraag</h1>
            <p style="color: #e0f2fe; margin: 10px 0 0 0; font-size: 16px;">BHV360 Veiligheidsmanagement Platform</p>
          </div>
          
          <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e2e8f0;">
            <h2 style="color: #1e40af; margin-top: 0;">Klant Informatie</h2>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #374151; width: 140px;">Naam:</td>
                <td style="padding: 8px 0; color: #1f2937;">${data.customerName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #374151;">Email:</td>
                <td style="padding: 8px 0; color: #1f2937;"><a href="mailto:${data.customerEmail}" style="color: #2563eb;">${data.customerEmail}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #374151;">Telefoon:</td>
                <td style="padding: 8px 0; color: #1f2937;">${data.customerPhone}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #374151;">Bedrijf:</td>
                <td style="padding: 8px 0; color: #1f2937; font-weight: 600;">${data.company}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #374151;">Type:</td>
                <td style="padding: 8px 0; color: #1f2937;">${data.companyType}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #374151;">Grootte:</td>
                <td style="padding: 8px 0; color: #1f2937;">${data.companySize}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #374151;">Interesse:</td>
                <td style="padding: 8px 0; color: #1f2937;">${data.interest}</td>
              </tr>
            </table>

            ${
              data.message !== "Geen aanvullend bericht"
                ? `
              <h3 style="color: #1e40af; margin-bottom: 10px;">Bericht</h3>
              <div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #2563eb; margin-bottom: 20px;">
                <p style="margin: 0; color: #374151;">${data.message}</p>
              </div>
            `
                : ""
            }

            <div style="background: #dbeafe; padding: 15px; border-radius: 8px; margin-top: 20px;">
              <p style="margin: 0; color: #1e40af; font-weight: 600;">📅 Ingediend op: ${data.submittedAt}</p>
            </div>

            <div style="margin-top: 30px; text-align: center;">
              <a href="mailto:${data.customerEmail}" style="background: linear-gradient(135deg, #2563eb 0%, #16a34a 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
                📧 Direct Reageren
              </a>
            </div>
          </div>

          <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px;">
            <p>BHV360 - Professioneel Veiligheidsmanagement Platform</p>
            <p>Powered by innovative blue-green safety technology</p>
          </div>
        </body>
        </html>
      `,
      text: `
        🎯 NIEUWE DEMO AANVRAAG - BHV360

        KLANT INFORMATIE:
        Naam: ${data.customerName}
        Email: ${data.customerEmail}
        Telefoon: ${data.customerPhone}
        Bedrijf: ${data.company}
        Type: ${data.companyType}
        Grootte: ${data.companySize}
        Interesse: ${data.interest}

        ${data.message !== "Geen aanvullend bericht" ? `BERICHT:\n${data.message}\n` : ""}

        Ingediend op: ${data.submittedAt}

        Reageer direct: ${data.customerEmail}

        ---
        BHV360 - Professioneel Veiligheidsmanagement Platform
      `,
    },

    customer_confirmation: {
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Bevestiging Demo Aanvraag - BHV360</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #2563eb 0%, #16a34a 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">✅ Aanvraag Ontvangen</h1>
            <p style="color: #e0f2fe; margin: 10px 0 0 0; font-size: 16px;">BHV360 Veiligheidsmanagement Platform</p>
          </div>
          
          <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e2e8f0;">
            <p style="font-size: 18px; color: #1f2937; margin-top: 0;">Beste ${data.customerName},</p>
            
            <p style="color: #374151; margin-bottom: 20px;">
              Hartelijk dank voor uw interesse in BHV360! We hebben uw aanvraag voor een <strong>${data.interest}</strong> 
              voor <strong>${data.company}</strong> succesvol ontvangen.
            </p>

            <div style="background: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
              <h3 style="color: #1e40af; margin-top: 0;">📞 Wat gebeurt er nu?</h3>
              <ul style="color: #374151; margin: 0; padding-left: 20px;">
                <li>Een van onze specialisten neemt <strong>binnen 24 uur</strong> contact met u op</li>
                <li>We plannen een <strong>persoonlijke demo</strong> op een moment dat u uitkomt</li>
                <li>U krijgt een <strong>op maat gemaakte presentatie</strong> voor uw organisatie</li>
                <li>We bespreken uw specifieke <strong>veiligheidsvereisten</strong></li>
              </ul>
            </div>

            <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #16a34a;">
              <h3 style="color: #15803d; margin-top: 0;">🚀 Waarom BHV360?</h3>
              <ul style="color: #374151; margin: 0; padding-left: 20px;">
                <li><strong>15+ geteste integraties</strong> - Alleen bewezen technologie</li>
                <li><strong>99.9% uptime garantie</strong> - Altijd beschikbaar wanneer u het nodig heeft</li>
                <li><strong>Nederlandse software</strong> - Volledig compliant met lokale wetgeving</li>
                <li><strong>Gratis implementatie</strong> - Geen verborgen kosten</li>
              </ul>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="mailto:info@BHV360.nl" style="background: linear-gradient(135deg, #2563eb 0%, #16a34a 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block; margin-right: 10px;">
                📧 Direct Contact
              </a>
              <a href="tel:+31123456789" style="background: transparent; color: #2563eb; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block; border: 2px solid #2563eb;">
                📞 Bel Direct
              </a>
            </div>

            <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 30px;">
              Heeft u vragen? Reageer direct op deze email of bel ons op +31 (0)20 123 4567
            </p>
          </div>

          <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px;">
            <p>BHV360 - Professioneel Veiligheidsmanagement Platform</p>
            <p>info@BHV360.nl | support@BHV360.nl</p>
            <p>Powered by innovative blue-green safety technology</p>
          </div>
        </body>
        </html>
      `,
      text: `
        ✅ BEVESTIGING DEMO AANVRAAG - BHV360

        Beste ${data.customerName},

        Hartelijk dank voor uw interesse in BHV360! We hebben uw aanvraag voor een ${data.interest} voor ${data.company} succesvol ontvangen.

        WAT GEBEURT ER NU?
        • Een van onze specialisten neemt binnen 24 uur contact met u op
        • We plannen een persoonlijke demo op een moment dat u uitkomt
        • U krijgt een op maat gemaakte presentatie voor uw organisatie
        • We bespreken uw specifieke veiligheidsvereisten

        WAAROM BHV360?
        • 15+ geteste integraties - Alleen bewezen technologie
        • 99.9% uptime garantie - Altijd beschikbaar wanneer u het nodig heeft
        • Nederlandse software - Volledig compliant met lokale wetgeving
        • Gratis implementatie - Geen verborgen kosten

        CONTACT:
        Email: info@BHV360.nl
        Telefoon: +31 (0)20 123 4567

        ---
        BHV360 - Professioneel Veiligheidsmanagement Platform
        Powered by innovative blue-green safety technology
      `,
    },
  }

  return templates[template as keyof typeof templates] || { html: "", text: "" }
}

async function sendEmail(emailData: EmailRequest & { html: string; text: string }) {
  // In production, integrate with your email service provider
  // For now, we'll simulate sending and log the email

  console.log("📧 Email verzonden:", {
    to: emailData.to,
    cc: emailData.cc,
    subject: emailData.subject,
    priority: emailData.priority || "normal",
    timestamp: new Date().toISOString(),
    hasHtml: !!emailData.html,
    hasText: !!emailData.text,
    hasAttachments: !!(emailData.attachments && emailData.attachments.length > 0),
  })

  // Simulate email service response
  return {
    messageId: `bhv360-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    status: "sent",
    timestamp: new Date().toISOString(),
  }
}
