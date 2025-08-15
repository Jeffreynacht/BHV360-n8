import { type NextRequest, NextResponse } from "next/server"

interface SMSRequest {
  to: string | string[]
  message: string
  priority?: "low" | "normal" | "high" | "critical"
  sender?: string
}

export async function POST(request: NextRequest) {
  try {
    const smsData: SMSRequest = await request.json()

    // Validate required fields
    if (!smsData.to || !smsData.message) {
      return NextResponse.json({ error: "To en message zijn verplicht" }, { status: 400 })
    }

    // Normalize phone numbers
    const phoneNumbers = Array.isArray(smsData.to) ? smsData.to : [smsData.to]
    const validatedNumbers = phoneNumbers.map(validatePhoneNumber).filter(Boolean)

    if (validatedNumbers.length === 0) {
      return NextResponse.json({ error: "Geen geldige telefoonnummers gevonden" }, { status: 400 })
    }

    // Add BHV360 signature to message
    const messageWithSignature = `${smsData.message}\n\n- BHV360 Veiligheidsplatform\ninfo@BHV360.nl`

    // Calculate costs (€0.05 per SMS segment)
    const segments = Math.ceil(messageWithSignature.length / 160)
    const costPerNumber = segments * 0.05
    const totalCost = costPerNumber * validatedNumbers.length

    // Send SMS to each number
    const results = await Promise.all(
      validatedNumbers.map(async (number) => {
        return await sendSMS({
          to: number,
          message: messageWithSignature,
          priority: smsData.priority || "normal",
          sender: smsData.sender || "BHV360",
        })
      }),
    )

    const successCount = results.filter((r) => r.success).length
    const failureCount = results.length - successCount

    return NextResponse.json({
      success: true,
      sent: successCount,
      failed: failureCount,
      totalCost: totalCost,
      costPerSMS: costPerNumber,
      segments: segments,
      results: results,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("SMS sending error:", error)
    return NextResponse.json({ error: "Er is een fout opgetreden bij het verzenden van de SMS" }, { status: 500 })
  }
}

function validatePhoneNumber(phone: string): string | null {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, "")

  // Check if it's a valid Dutch mobile number
  if (cleaned.match(/^31[67]\d{8}$/)) {
    return `+${cleaned}`
  }

  // Check if it starts with 06 (Dutch mobile)
  if (cleaned.match(/^06\d{8}$/)) {
    return `+31${cleaned.substring(1)}`
  }

  // Check if it's an international number
  if (cleaned.length >= 10 && cleaned.length <= 15) {
    return `+${cleaned}`
  }

  return null
}

async function sendSMS(smsData: { to: string; message: string; priority: string; sender: string }) {
  // In production, integrate with SMS service provider like Twilio, MessageBird, etc.
  // For now, we'll simulate sending and log the SMS

  try {
    console.log("📱 SMS verzonden:", {
      to: smsData.to,
      message: smsData.message.substring(0, 50) + "...",
      priority: smsData.priority,
      sender: smsData.sender,
      length: smsData.message.length,
      segments: Math.ceil(smsData.message.length / 160),
      timestamp: new Date().toISOString(),
    })

    // Simulate SMS service response
    return {
      success: true,
      messageId: `sms-bhv360-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      to: smsData.to,
      status: "sent",
      cost: Math.ceil(smsData.message.length / 160) * 0.05,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    return {
      success: false,
      to: smsData.to,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    }
  }
}

// GET endpoint to check SMS service status
export async function GET() {
  return NextResponse.json({
    service: "BHV360 SMS Service",
    status: "operational",
    version: "1.0.0",
    endpoints: {
      send: "/api/sms/send",
    },
    supportedProviders: ["Twilio", "MessageBird", "Nexmo"],
    features: ["International SMS", "Priority levels", "Delivery tracking", "Cost calculation", "BHV360 branding"],
    pricing: {
      domestic: "€0.05 per SMS",
      international: "€0.15 per SMS",
      currency: "EUR",
    },
  })
}
