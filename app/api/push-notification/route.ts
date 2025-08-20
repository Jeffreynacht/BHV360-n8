import { NextResponse } from "next/server"
import webpush from "web-push"

// In een echte applicatie zouden deze keys veilig worden opgeslagen in environment variables
const publicVapidKey = "BLBz-HXFSjHdJyFjKxfFHPGeGgHgJP_zLNYOFQJZMECJQqLxK8RuOLCFxUXiL_LQ-0i8qQXYqKKLEHeAGZ8hDHo"
const privateVapidKey = "3KzvKasA2SoCxsp0iIG_o_0q1WzVX4vUvCQsRjfEZqc"

// Configureer web-push
webpush.setVapidDetails("mailto:info@bhv360.nl", publicVapidKey, privateVapidKey)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { subscription, data } = body

    // Valideer de input
    if (!subscription || !data) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    // Stuur de push notificatie
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: data.title || "BHV360 Notificatie",
        body: data.body || "Er is een nieuwe melding",
        icon: data.icon || "/images/bhv360-logo.png",
        data: {
          url: data.url || "/",
          ...data.additionalData,
        },
      }),
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error sending push notification:", error)
    return NextResponse.json({ success: false, message: "Failed to send push notification" }, { status: 500 })
  }
}
