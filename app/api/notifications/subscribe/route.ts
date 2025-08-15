import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, subscription } = body

    if (!userId || !subscription) {
      return NextResponse.json({ success: false, error: "Missing userId or subscription" }, { status: 400 })
    }

    // Store subscription in localStorage for demo
    // In production, save to database
    if (typeof window !== "undefined") {
      localStorage.setItem(`push_subscription_${userId}`, JSON.stringify(subscription))
    }

    return NextResponse.json({
      success: true,
      message: "Push subscription saved successfully",
    })
  } catch (error) {
    console.error("Error saving push subscription:", error)
    return NextResponse.json({ success: false, error: "Failed to save push subscription" }, { status: 500 })
  }
}
