import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { subscription, userId, customerId, deviceInfo = {}, preferences = {} } = body

    // Validate required fields
    if (!subscription || !subscription.endpoint) {
      return NextResponse.json({ error: "Valid push subscription required" }, { status: 400 })
    }

    if (!userId || !customerId) {
      return NextResponse.json({ error: "User ID and Customer ID required" }, { status: 400 })
    }

    // Check if subscription already exists
    const { data: existingSubscription } = await supabase
      .from("push_subscriptions")
      .select("id")
      .eq("endpoint", subscription.endpoint)
      .eq("user_id", userId)
      .single()

    if (existingSubscription) {
      // Update existing subscription
      const { data, error } = await supabase
        .from("push_subscriptions")
        .update({
          subscription: subscription,
          device_info: deviceInfo,
          preferences: preferences,
          active: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingSubscription.id)
        .select()
        .single()

      if (error) {
        console.error("Error updating push subscription:", error)
        return NextResponse.json({ error: "Failed to update subscription" }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        message: "Push subscription updated successfully",
        subscription: data,
      })
    }

    // Create new subscription
    const { data, error } = await supabase
      .from("push_subscriptions")
      .insert([
        {
          user_id: userId,
          customer_id: customerId,
          endpoint: subscription.endpoint,
          subscription: subscription,
          device_info: {
            userAgent: deviceInfo.userAgent || "Unknown",
            platform: deviceInfo.platform || "Unknown",
            language: deviceInfo.language || "nl",
            timezone: deviceInfo.timezone || "Europe/Amsterdam",
            ...deviceInfo,
          },
          preferences: {
            emergency: preferences.emergency !== false, // Default true
            incidents: preferences.incidents !== false, // Default true
            maintenance: preferences.maintenance !== false, // Default true
            general: preferences.general !== false, // Default true
            ...preferences,
          },
          active: true,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Error creating push subscription:", error)
      return NextResponse.json({ error: "Failed to register push subscription" }, { status: 500 })
    }

    // Send welcome notification
    try {
      await sendWelcomeNotification(subscription, userId)
    } catch (welcomeError) {
      console.error("Error sending welcome notification:", welcomeError)
      // Don't fail the registration if welcome notification fails
    }

    // Log registration activity
    await supabase.from("activity_logs").insert([
      {
        user_id: userId,
        customer_id: customerId,
        action: "push_subscription_registered",
        details: {
          endpoint: subscription.endpoint,
          device_info: deviceInfo,
        },
        timestamp: new Date().toISOString(),
      },
    ])

    return NextResponse.json({
      success: true,
      message: "Push subscription registered successfully",
      subscription: data,
    })
  } catch (error) {
    console.error("Error in push registration:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const endpoint = searchParams.get("endpoint")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    let query = supabase
      .from("push_subscriptions")
      .update({ active: false, updated_at: new Date().toISOString() })
      .eq("user_id", userId)

    if (endpoint) {
      query = query.eq("endpoint", endpoint)
    }

    const { error } = await query

    if (error) {
      console.error("Error deactivating push subscription:", error)
      return NextResponse.json({ error: "Failed to deactivate subscription" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Push subscription deactivated successfully",
    })
  } catch (error) {
    console.error("Error in push deregistration:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const customerId = searchParams.get("customerId")

    if (!userId && !customerId) {
      return NextResponse.json({ error: "User ID or Customer ID required" }, { status: 400 })
    }

    let query = supabase.from("push_subscriptions").select("*").eq("active", true)

    if (userId) {
      query = query.eq("user_id", userId)
    } else if (customerId) {
      query = query.eq("customer_id", customerId)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching push subscriptions:", error)
      return NextResponse.json({ error: "Failed to fetch subscriptions" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      subscriptions: data || [],
    })
  } catch (error) {
    console.error("Error in push subscription fetch:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function sendWelcomeNotification(subscription: any, userId: number) {
  const webpush = require("web-push")

  // Configure web-push (these should be in environment variables)
  webpush.setVapidDetails(
    "mailto:support@bhv360.nl",
    process.env.VAPID_PUBLIC_KEY || "your-vapid-public-key",
    process.env.VAPID_PRIVATE_KEY || "your-vapid-private-key",
  )

  const payload = JSON.stringify({
    title: "BHV360 Notificaties Geactiveerd",
    body: "Je ontvangt nu belangrijke BHV meldingen op dit apparaat.",
    icon: "/images/bhv360-logo.png",
    badge: "/images/bhv360-logo.png",
    tag: "welcome",
    data: {
      type: "welcome",
      userId: userId,
      timestamp: new Date().toISOString(),
    },
    actions: [
      {
        action: "view",
        title: "Bekijk Dashboard",
      },
    ],
  })

  try {
    await webpush.sendNotification(subscription, payload)
    console.log("Welcome notification sent successfully")
  } catch (error) {
    console.error("Error sending welcome notification:", error)
    throw error
  }
}
