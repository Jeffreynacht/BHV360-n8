import { type NextRequest, NextResponse } from "next/server"
import { notificationService } from "@/lib/notifications/notification-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { notifications } = body

    if (!Array.isArray(notifications) || notifications.length === 0) {
      return NextResponse.json({ success: false, error: "Invalid notifications array" }, { status: 400 })
    }

    const payloads = notifications.map((notif: any) => ({
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      userId: notif.userId,
      title: notif.title,
      body: notif.body,
      category: notif.category || "system",
      priority: notif.priority || "normal",
      data: notif.data || {},
      channels: notif.channels || undefined,
    }))

    await notificationService.sendBulkNotifications(payloads)

    return NextResponse.json({
      success: true,
      count: payloads.length,
      notificationIds: payloads.map((p) => p.id),
    })
  } catch (error) {
    console.error("Error sending bulk notifications:", error)
    return NextResponse.json({ success: false, error: "Failed to send bulk notifications" }, { status: 500 })
  }
}
