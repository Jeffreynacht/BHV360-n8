import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

interface BroadcastMessage {
  title: string
  content: string
  priority: "low" | "normal" | "high" | "critical"
  channels: ("push" | "email" | "sms" | "websocket")[]
  targetAudience: {
    customerIds?: string[]
    roles?: string[]
    userIds?: string[]
    locations?: string[]
    all?: boolean
  }
  scheduledFor?: string
  expiresAt?: string
  category: "emergency" | "incident" | "maintenance" | "training" | "general"
}

export async function POST(request: NextRequest) {
  try {
    const messageData: BroadcastMessage = await request.json()

    // Validate required fields
    if (!messageData.title || !messageData.content) {
      return NextResponse.json({ success: false, error: "Title and content are required" }, { status: 400 })
    }

    // Generate message ID
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Determine target users
    const targetUsers = await getTargetUsers(messageData.targetAudience)

    if (targetUsers.length === 0) {
      return NextResponse.json({ success: false, error: "No target users found" }, { status: 400 })
    }

    // Store message in database
    const { error: dbError } = await supabase.from("broadcast_messages").insert({
      id: messageId,
      title: messageData.title,
      content: messageData.content,
      priority: messageData.priority,
      channels: messageData.channels,
      target_audience: messageData.targetAudience,
      category: messageData.category,
      scheduled_for: messageData.scheduledFor,
      expires_at: messageData.expiresAt,
      target_user_count: targetUsers.length,
      created_at: new Date().toISOString(),
      status: messageData.scheduledFor ? "scheduled" : "sending",
    })

    if (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json({ success: false, error: "Failed to store message" }, { status: 500 })
    }

    // If scheduled, don't send immediately
    if (messageData.scheduledFor) {
      return NextResponse.json({
        success: true,
        messageId,
        message: "Message scheduled successfully",
        targetUserCount: targetUsers.length,
        scheduledFor: messageData.scheduledFor,
      })
    }

    // Send message through selected channels
    const results = await sendThroughChannels(messageId, messageData, targetUsers)

    // Update message status
    await supabase
      .from("broadcast_messages")
      .update({
        status: "sent",
        sent_at: new Date().toISOString(),
        delivery_results: results,
      })
      .eq("id", messageId)

    return NextResponse.json({
      success: true,
      messageId,
      message: "Broadcast sent successfully",
      targetUserCount: targetUsers.length,
      results,
    })
  } catch (error) {
    console.error("Broadcast error:", error)
    return NextResponse.json({ success: false, error: "Failed to send broadcast" }, { status: 500 })
  }
}

async function getTargetUsers(targetAudience: BroadcastMessage["targetAudience"]) {
  let query = supabase.from("users").select("id, email, phone, role, customer_id, location")

  // If targeting all users
  if (targetAudience.all) {
    const { data, error } = await query
    if (error) throw error
    return data || []
  }

  // Build filters
  const filters = []

  if (targetAudience.customerIds?.length) {
    filters.push(`customer_id.in.(${targetAudience.customerIds.join(",")})`)
  }

  if (targetAudience.roles?.length) {
    filters.push(`role.in.(${targetAudience.roles.join(",")})`)
  }

  if (targetAudience.userIds?.length) {
    filters.push(`id.in.(${targetAudience.userIds.join(",")})`)
  }

  if (targetAudience.locations?.length) {
    filters.push(`location.in.(${targetAudience.locations.join(",")})`)
  }

  // Apply filters with OR logic
  if (filters.length > 0) {
    query = query.or(filters.join(","))
  }

  const { data, error } = await query
  if (error) throw error
  return data || []
}

async function sendThroughChannels(messageId: string, messageData: BroadcastMessage, targetUsers: any[]) {
  const results: any = {
    websocket: { sent: 0, failed: 0 },
    push: { sent: 0, failed: 0 },
    email: { sent: 0, failed: 0 },
    sms: { sent: 0, failed: 0 },
  }

  // WebSocket notifications
  if (messageData.channels.includes("websocket")) {
    try {
      const wsResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/websocket/connect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "broadcast_to_room",
          roomId: "all_users",
          data: {
            type: "broadcast_message",
            messageId,
            title: messageData.title,
            content: messageData.content,
            priority: messageData.priority,
            category: messageData.category,
          },
        }),
      })

      if (wsResponse.ok) {
        results.websocket.sent = targetUsers.length
      } else {
        results.websocket.failed = targetUsers.length
      }
    } catch (error) {
      console.error("WebSocket broadcast error:", error)
      results.websocket.failed = targetUsers.length
    }
  }

  // Push notifications
  if (messageData.channels.includes("push")) {
    for (const user of targetUsers) {
      try {
        const pushResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/push-notification`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            title: messageData.title,
            body: messageData.content,
            data: {
              messageId,
              category: messageData.category,
              priority: messageData.priority,
            },
          }),
        })

        if (pushResponse.ok) {
          results.push.sent++
        } else {
          results.push.failed++
        }
      } catch (error) {
        console.error("Push notification error:", error)
        results.push.failed++
      }
    }
  }

  // Email notifications
  if (messageData.channels.includes("email")) {
    for (const user of targetUsers.filter((u) => u.email)) {
      try {
        const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/email/send`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: user.email,
            subject: messageData.title,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: ${getPriorityColor(messageData.priority)}; color: white; padding: 20px; text-align: center;">
                  <h1>${messageData.title}</h1>
                </div>
                <div style="padding: 20px;">
                  <p>${messageData.content.replace(/\n/g, "<br>")}</p>
                  <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0;">
                    <p><strong>Prioriteit:</strong> ${messageData.priority}</p>
                    <p><strong>Categorie:</strong> ${messageData.category}</p>
                    <p><strong>Tijd:</strong> ${new Date().toLocaleString("nl-NL")}</p>
                  </div>
                </div>
              </div>
            `,
            priority: messageData.priority,
          }),
        })

        if (emailResponse.ok) {
          results.email.sent++
        } else {
          results.email.failed++
        }
      } catch (error) {
        console.error("Email send error:", error)
        results.email.failed++
      }
    }
  }

  // SMS notifications
  if (messageData.channels.includes("sms")) {
    for (const user of targetUsers.filter((u) => u.phone)) {
      try {
        const smsResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/sms/send`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: user.phone,
            message: `${getPriorityEmoji(messageData.priority)} BHV360: ${messageData.title}\n\n${messageData.content}\n\nTijd: ${new Date().toLocaleString("nl-NL")}`,
            priority: messageData.priority,
          }),
        })

        if (smsResponse.ok) {
          results.sms.sent++
        } else {
          results.sms.failed++
        }
      } catch (error) {
        console.error("SMS send error:", error)
        results.sms.failed++
      }
    }
  }

  return results
}

function getPriorityColor(priority: string): string {
  switch (priority) {
    case "critical":
      return "#dc2626"
    case "high":
      return "#ea580c"
    case "normal":
      return "#059669"
    case "low":
      return "#0891b2"
    default:
      return "#6b7280"
  }
}

function getPriorityEmoji(priority: string): string {
  switch (priority) {
    case "critical":
      return "🚨"
    case "high":
      return "⚠️"
    case "normal":
      return "📢"
    case "low":
      return "ℹ️"
    default:
      return "📢"
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const limit = Number.parseInt(url.searchParams.get("limit") || "50")
    const offset = Number.parseInt(url.searchParams.get("offset") || "0")
    const status = url.searchParams.get("status")

    let query = supabase
      .from("broadcast_messages")
      .select("*")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (status) {
      query = query.eq("status", status)
    }

    const { data, error } = await query

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ success: false, error: "Failed to fetch messages" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      messages: data,
      pagination: {
        limit,
        offset,
        hasMore: data.length === limit,
      },
    })
  } catch (error) {
    console.error("Fetch messages error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch messages" }, { status: 500 })
  }
}
