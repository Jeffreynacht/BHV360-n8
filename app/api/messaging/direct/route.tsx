import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

interface DirectMessage {
  fromUserId: string
  toUserId: string
  subject?: string
  content: string
  priority: "low" | "normal" | "high" | "urgent"
  channels: ("push" | "email" | "sms" | "websocket")[]
  category: "personal" | "work" | "emergency" | "system"
  attachments?: {
    name: string
    url: string
    type: string
    size: number
  }[]
}

export async function POST(request: NextRequest) {
  try {
    const messageData: DirectMessage = await request.json()

    // Validate required fields
    if (!messageData.fromUserId || !messageData.toUserId || !messageData.content) {
      return NextResponse.json(
        { success: false, error: "From user, to user, and content are required" },
        { status: 400 },
      )
    }

    // Check if users exist
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("id, name, email, phone, role, customer_id")
      .in("id", [messageData.fromUserId, messageData.toUserId])

    if (usersError || !users || users.length !== 2) {
      return NextResponse.json({ success: false, error: "Invalid user IDs" }, { status: 400 })
    }

    const fromUser = users.find((u) => u.id === messageData.fromUserId)
    const toUser = users.find((u) => u.id === messageData.toUserId)

    if (!fromUser || !toUser) {
      return NextResponse.json({ success: false, error: "Users not found" }, { status: 404 })
    }

    // Generate message ID
    const messageId = `dm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Store message in database
    const { error: dbError } = await supabase.from("direct_messages").insert({
      id: messageId,
      from_user_id: messageData.fromUserId,
      to_user_id: messageData.toUserId,
      subject: messageData.subject,
      content: messageData.content,
      priority: messageData.priority,
      channels: messageData.channels,
      category: messageData.category,
      attachments: messageData.attachments,
      created_at: new Date().toISOString(),
      status: "sending",
    })

    if (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json({ success: false, error: "Failed to store message" }, { status: 500 })
    }

    // Send message through selected channels
    const results = await sendDirectMessage(messageId, messageData, fromUser, toUser)

    // Update message status
    await supabase
      .from("direct_messages")
      .update({
        status: "sent",
        sent_at: new Date().toISOString(),
        delivery_results: results,
      })
      .eq("id", messageId)

    return NextResponse.json({
      success: true,
      messageId,
      message: "Direct message sent successfully",
      results,
    })
  } catch (error) {
    console.error("Direct message error:", error)
    return NextResponse.json({ success: false, error: "Failed to send direct message" }, { status: 500 })
  }
}

async function sendDirectMessage(messageId: string, messageData: DirectMessage, fromUser: any, toUser: any) {
  const results: any = {
    websocket: { sent: false, error: null },
    push: { sent: false, error: null },
    email: { sent: false, error: null },
    sms: { sent: false, error: null },
  }

  // WebSocket notification
  if (messageData.channels.includes("websocket")) {
    try {
      const wsResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/websocket/connect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send_direct_message",
          targetUserId: toUser.id,
          data: {
            type: "direct_message",
            messageId,
            fromUser: {
              id: fromUser.id,
              name: fromUser.name,
              role: fromUser.role,
            },
            subject: messageData.subject,
            content: messageData.content,
            priority: messageData.priority,
            category: messageData.category,
            attachments: messageData.attachments,
            timestamp: new Date().toISOString(),
          },
        }),
      })

      if (wsResponse.ok) {
        results.websocket.sent = true
      } else {
        results.websocket.error = "WebSocket delivery failed"
      }
    } catch (error) {
      results.websocket.error = error instanceof Error ? error.message : "Unknown error"
    }
  }

  // Push notification
  if (messageData.channels.includes("push")) {
    try {
      const pushResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/push-notification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: toUser.id,
          title: messageData.subject || `Bericht van ${fromUser.name}`,
          body: messageData.content.length > 100 ? messageData.content.substring(0, 100) + "..." : messageData.content,
          data: {
            messageId,
            fromUserId: fromUser.id,
            category: messageData.category,
            priority: messageData.priority,
            type: "direct_message",
          },
        }),
      })

      if (pushResponse.ok) {
        results.push.sent = true
      } else {
        results.push.error = "Push notification failed"
      }
    } catch (error) {
      results.push.error = error instanceof Error ? error.message : "Unknown error"
    }
  }

  // Email notification
  if (messageData.channels.includes("email") && toUser.email) {
    try {
      const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/email/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: toUser.email,
          subject: messageData.subject || `Bericht van ${fromUser.name}`,
          html: generateEmailTemplate(messageData, fromUser, toUser),
          priority: messageData.priority,
          attachments: messageData.attachments,
        }),
      })

      if (emailResponse.ok) {
        results.email.sent = true
      } else {
        results.email.error = "Email delivery failed"
      }
    } catch (error) {
      results.email.error = error instanceof Error ? error.message : "Unknown error"
    }
  }

  // SMS notification
  if (messageData.channels.includes("sms") && toUser.phone) {
    try {
      const smsContent = `${getPriorityEmoji(messageData.priority)} Bericht van ${fromUser.name}:\n\n${messageData.content}\n\nTijd: ${new Date().toLocaleString("nl-NL")}`

      const smsResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/sms/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: toUser.phone,
          message: smsContent.length > 160 ? smsContent.substring(0, 157) + "..." : smsContent,
          priority: messageData.priority,
        }),
      })

      if (smsResponse.ok) {
        results.sms.sent = true
      } else {
        results.sms.error = "SMS delivery failed"
      }
    } catch (error) {
      results.sms.error = error instanceof Error ? error.message : "Unknown error"
    }
  }

  return results
}

function generateEmailTemplate(messageData: DirectMessage, fromUser: any, toUser: any): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: ${getPriorityColor(messageData.priority)}; color: white; padding: 20px;">
        <h1>${messageData.subject || "Nieuw Bericht"}</h1>
        <p style="margin: 0; opacity: 0.9;">Van: ${fromUser.name} (${fromUser.role})</p>
      </div>
      
      <div style="padding: 20px;">
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <p><strong>Aan:</strong> ${toUser.name}</p>
          <p><strong>Van:</strong> ${fromUser.name}</p>
          <p><strong>Prioriteit:</strong> ${messageData.priority}</p>
          <p><strong>Categorie:</strong> ${messageData.category}</p>
          <p><strong>Tijd:</strong> ${new Date().toLocaleString("nl-NL")}</p>
        </div>
        
        <div style="line-height: 1.6;">
          ${messageData.content.replace(/\n/g, "<br>")}
        </div>
        
        ${
          messageData.attachments && messageData.attachments.length > 0
            ? `
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <h3>Bijlagen:</h3>
            <ul>
              ${messageData.attachments
                .map(
                  (att) => `
                <li><a href="${att.url}" target="_blank">${att.name}</a> (${formatFileSize(att.size)})</li>
              `,
                )
                .join("")}
            </ul>
          </div>
        `
            : ""
        }
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/messages/${messageData.fromUserId}" 
             style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
            Antwoorden in BHV360
          </a>
        </div>
      </div>
    </div>
  `
}

function getPriorityColor(priority: string): string {
  switch (priority) {
    case "urgent":
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
    case "urgent":
      return "🚨"
    case "high":
      return "⚠️"
    case "normal":
      return "💬"
    case "low":
      return "ℹ️"
    default:
      return "💬"
  }
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const userId = url.searchParams.get("userId")
    const limit = Number.parseInt(url.searchParams.get("limit") || "50")
    const offset = Number.parseInt(url.searchParams.get("offset") || "0")

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("direct_messages")
      .select(`
        *,
        from_user:users!from_user_id(id, name, email, role),
        to_user:users!to_user_id(id, name, email, role)
      `)
      .or(`from_user_id.eq.${userId},to_user_id.eq.${userId}`)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

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
    console.error("Fetch direct messages error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch messages" }, { status: 500 })
  }
}
