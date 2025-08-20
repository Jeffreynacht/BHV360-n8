import { type NextRequest, NextResponse } from "next/server"

interface MessageRequest {
  recipient: {
    id: string
    name: string
    email?: string
    phone?: string
    type: "visitor" | "contractor"
    company?: string
    location?: string
    host?: string
  }
  subject: string
  message: string
  channels: ("sms" | "email")[]
  priority: "normal" | "high" | "urgent"
  sender: {
    name: string
    role: string
    department: string
    phone?: string
    email?: string
  }
  location: {
    name: string
    address: string
    phone: string
    email: string
    logo?: string
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: MessageRequest = await request.json()
    const { recipient, subject, message, channels, priority, sender, location } = body

    if (!recipient || !message.trim() || channels.length === 0) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const results: { channel: string; success: boolean; error?: string }[] = []
    const timestamp = new Date()

    // Send via Email
    if (channels.includes("email") && recipient.email) {
      try {
        const priorityIcon = priority === "urgent" ? "🚨" : priority === "high" ? "⚠️" : "📋"
        const priorityText = priority === "urgent" ? "URGENT" : priority === "high" ? "HOOG" : "NORMAAL"

        const emailHtml = `
<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; }
        .header { background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: white; padding: 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: bold; }
        .logos { display: flex; justify-content: space-between; align-items: center; margin-top: 15px; }
        .logo { height: 40px; background: white; padding: 5px; border-radius: 4px; }
        .content { padding: 30px; }
        .message-header { background: #f8fafc; border-left: 4px solid #dc2626; padding: 15px; margin-bottom: 20px; }
        .priority-badge { display: inline-block; background: ${priority === "urgent" ? "#dc2626" : priority === "high" ? "#f59e0b" : "#10b981"}; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold; margin-bottom: 10px; }
        .message-body { line-height: 1.6; color: #374151; white-space: pre-wrap; margin: 20px 0; }
        .sender-info { background: #f9fafb; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .sender-details { display: flex; align-items: center; margin-bottom: 10px; }
        .sender-avatar { width: 40px; height: 40px; background: #dc2626; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px; }
        .contact-info { background: #eff6ff; border-radius: 8px; padding: 15px; margin: 15px 0; }
        .footer { background: #1f2937; color: #d1d5db; padding: 20px; text-align: center; font-size: 12px; }
        .footer-logos { display: flex; justify-content: center; align-items: center; gap: 20px; margin-bottom: 15px; }
        .footer-logo { height: 30px; opacity: 0.8; }
        .divider { height: 1px; background: #e5e7eb; margin: 20px 0; }
        @media (max-width: 600px) {
            .logos { flex-direction: column; gap: 10px; }
            .content { padding: 20px; }
            .sender-details { flex-direction: column; text-align: center; }
            .sender-avatar { margin: 0 0 10px 0; }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header with logos -->
        <div class="header">
            <h1>📢 Bericht van ${location.name}</h1>
            <div class="logos">
                <img src="${location.logo || "/images/placeholder-logo.png"}" alt="${location.name}" class="logo" />
                <img src="/images/bhv360-logo-full.png" alt="BHV360" class="logo" />
            </div>
        </div>

        <!-- Content -->
        <div class="content">
            <!-- Message Header -->
            <div class="message-header">
                <div class="priority-badge">${priorityIcon} ${priorityText}</div>
                <h2 style="margin: 0; color: #1f2937;">${subject}</h2>
                <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">
                    Verzonden op ${timestamp.toLocaleDateString("nl-NL", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })} om ${timestamp.toLocaleTimeString("nl-NL")}
                </p>
            </div>

            <!-- Recipient Info -->
            <p style="color: #6b7280; margin-bottom: 20px;">
                Beste ${recipient.name}${recipient.company ? ` (${recipient.company})` : ""},
            </p>

            <!-- Message Body -->
            <div class="message-body">${message}</div>

            <div class="divider"></div>

            <!-- Sender Information -->
            <div class="sender-info">
                <h3 style="margin: 0 0 15px 0; color: #1f2937;">Verzonden door:</h3>
                <div class="sender-details">
                    <div class="sender-avatar">
                        ${sender.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                    </div>
                    <div>
                        <p style="margin: 0; font-weight: bold; color: #1f2937;">${sender.name}</p>
                        <p style="margin: 0; color: #6b7280; font-size: 14px;">${sender.role}</p>
                        <p style="margin: 0; color: #6b7280; font-size: 14px;">${sender.department}</p>
                    </div>
                </div>
                ${
                  sender.phone || sender.email
                    ? `
                <div class="contact-info">
                    <p style="margin: 0 0 5px 0; font-weight: bold; color: #1e40af;">Direct contact:</p>
                    ${sender.phone ? `<p style="margin: 0; font-size: 14px;">📞 ${sender.phone}</p>` : ""}
                    ${sender.email ? `<p style="margin: 0; font-size: 14px;">✉️ ${sender.email}</p>` : ""}
                </div>
                `
                    : ""
                }
            </div>

            <!-- Location Contact Info -->
            <div class="contact-info">
                <p style="margin: 0 0 10px 0; font-weight: bold; color: #1e40af;">📍 ${location.name}</p>
                <p style="margin: 0; font-size: 14px;">${location.address}</p>
                <p style="margin: 5px 0 0 0; font-size: 14px;">
                    📞 ${location.phone} | ✉️ ${location.email}
                </p>
            </div>

            <!-- Professional Closing -->
            <div style="margin-top: 30px;">
                <p style="margin: 0;">Met vriendelijke groet,</p>
                <p style="margin: 5px 0 0 0; font-weight: bold;">${sender.name}</p>
                <p style="margin: 0; color: #6b7280; font-size: 14px;">${sender.role} | ${location.name}</p>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <div class="footer-logos">
                <img src="/images/bhv360-logo-full.png" alt="BHV360" class="footer-logo" />
                ${location.logo ? `<img src="${location.logo}" alt="${location.name}" class="footer-logo" />` : ""}
            </div>
            <p style="margin: 0;">Dit bericht is verzonden via BHV360 Management System</p>
            <p style="margin: 5px 0 0 0; opacity: 0.7;">
                BHV360 - Professioneel BHV Management | www.bhv360.nl
            </p>
        </div>
    </div>
</body>
</html>
        `

        const emailText = `
${priorityIcon} ${subject} (${priorityText})

Beste ${recipient.name}${recipient.company ? ` (${recipient.company})` : ""},

${message}

---
VERZONDEN DOOR:
${sender.name}
${sender.role} | ${sender.department}
${sender.phone ? `Tel: ${sender.phone}` : ""}
${sender.email ? `Email: ${sender.email}` : ""}

LOCATIE:
${location.name}
${location.address}
Tel: ${location.phone}
Email: ${location.email}

Met vriendelijke groet,
${sender.name}
${sender.role} | ${location.name}

---
Verzonden op: ${timestamp.toLocaleString("nl-NL")}
Via: BHV360 Management System
        `

        const emailResponse = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/email/send`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              to: recipient.email,
              subject: `${priorityIcon} ${subject}${priority === "urgent" ? " [URGENT]" : ""}`,
              html: emailHtml,
              text: emailText,
              priority: priority,
              from: `${sender.name} <${location.email}>`,
              replyTo: sender.email || location.email,
            }),
          },
        )

        const emailResult = await emailResponse.json()
        results.push({
          channel: "email",
          success: emailResult.success || emailResponse.ok,
          error: emailResult.error,
        })
      } catch (error) {
        results.push({
          channel: "email",
          success: false,
          error: error instanceof Error ? error.message : "Email send failed",
        })
      }
    }

    // Send via SMS
    if (channels.includes("sms") && recipient.phone) {
      try {
        const priorityPrefix = priority === "urgent" ? "🚨 URGENT" : priority === "high" ? "⚠️ BELANGRIJK" : "📋"

        const smsMessage = `${priorityPrefix}: ${subject}

Beste ${recipient.name},

${message}

---
${sender.name}
${sender.role}
${location.name}
${sender.phone ? `Tel: ${sender.phone}` : `Tel: ${location.phone}`}

Tijd: ${timestamp.toLocaleString("nl-NL")}
Via: BHV360`

        const smsResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/sms/send`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: recipient.phone,
            message: smsMessage,
            priority: priority,
            from: location.name,
          }),
        })

        const smsResult = await smsResponse.json()
        results.push({
          channel: "sms",
          success: smsResult.success || smsResponse.ok,
          error: smsResult.error,
        })
      } catch (error) {
        results.push({
          channel: "sms",
          success: false,
          error: error instanceof Error ? error.message : "SMS send failed",
        })
      }
    }

    // Enhanced audit logging
    const logEntry = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: timestamp.toISOString(),
      sender: {
        name: sender.name,
        role: sender.role,
        department: sender.department,
      },
      recipient: {
        name: recipient.name,
        type: recipient.type,
        company: recipient.company,
      },
      location: location.name,
      subject,
      message: message.substring(0, 100) + (message.length > 100 ? "..." : ""),
      channels,
      priority,
      results,
      success: results.some((r) => r.success),
    }

    console.log("Professional message sent:", logEntry)

    const success = results.some((r) => r.success)
    const successfulChannels = results.filter((r) => r.success).map((r) => r.channel)

    return NextResponse.json({
      success,
      results,
      messageId: logEntry.id,
      message: success
        ? `Bericht succesvol verzonden via: ${successfulChannels.join(", ")}`
        : "Bericht kon niet worden verzonden",
    })
  } catch (error) {
    console.error("Error sending professional message:", error)
    return NextResponse.json({ success: false, error: "Failed to send message" }, { status: 500 })
  }
}
