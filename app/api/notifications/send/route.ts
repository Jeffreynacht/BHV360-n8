import { type NextRequest, NextResponse } from "next/server"
import { notificationService } from "@/lib/notifications/notification-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, title, body: messageBody, category, priority, data, channels } = body

    if (!userId || !title || !messageBody) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const payload = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      userId,
      title,
      body: messageBody,
      category: category || "system",
      priority: priority || "normal",
      data: data || {},
      channels: channels || undefined,
    }

    const result = await notificationService.sendNotification(payload)

    return NextResponse.json({
      success: result.success,
      notificationId: payload.id,
      results: result.results,
    })
  } catch (error) {
    console.error("Error sending notification:", error)
    return NextResponse.json({ success: false, error: "Failed to send notification" }, { status: 500 })
  }
}
