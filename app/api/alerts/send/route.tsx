import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

interface AlertData {
  type: "emergency" | "evacuation" | "fire" | "medical" | "security" | "weather" | "system"
  severity: "info" | "warning" | "critical" | "fatal"
  title: string
  message: string
  location?: {
    building?: string
    floor?: string
    room?: string
    coordinates?: { lat: number; lng: number }
  }
  targetAudience: {
    customerIds?: string[]
    roles?: string[]
    locations?: string[]
    all?: boolean
    bhvOnly?: boolean
  }
  autoActions?: {
    lockDoors?: boolean
    activateAlarms?: boolean
    notifyAuthorities?: boolean
    startEvacuation?: boolean
  }
  expiresAt?: string
  metadata?: Record<string, any>
}

export async function POST(request: NextRequest) {
  try {
    const alertData: AlertData = await request.json()

    // Validate required fields
    if (!alertData.type || !alertData.severity || !alertData.title || !alertData.message) {
      return NextResponse.json(
        { success: false, error: "Type, severity, title, and message are required" },
        { status: 400 },
      )
    }

    // Generate alert ID
    const alertId = `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Determine target users
    const targetUsers = await getAlertTargetUsers(alertData.targetAudience)

    if (targetUsers.length === 0) {
      return NextResponse.json({ success: false, error: "No target users found" }, { status: 400 })
    }

    // Store alert in database
    const { error: dbError } = await supabase.from("alerts").insert({
      id: alertId,
      type: alertData.type,
      severity: alertData.severity,
      title: alertData.title,
      message: alertData.message,
      location: alertData.location,
      target_audience: alertData.targetAudience,
      auto_actions: alertData.autoActions,
      expires_at: alertData.expiresAt,
      metadata: alertData.metadata,
      target_user_count: targetUsers.length,
      created_at: new Date().toISOString(),
      status: "active",
    })

    if (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json({ success: false, error: "Failed to store alert" }, { status: 500 })
    }

    // Execute auto actions if specified
    if (alertData.autoActions) {
      await executeAutoActions(alertId, alertData.autoActions, alertData.location)
    }

    // Send alert through all available channels
    const deliveryResults = await sendAlert(alertId, alertData, targetUsers)

    // Log alert activity
    await logAlertActivity(alertId, "created", {
      targetUserCount: targetUsers.length,
      deliveryResults,
      autoActions: alertData.autoActions,
    })

    // Update alert with delivery results
    await supabase
      .from("alerts")
      .update({
        delivery_results: deliveryResults,
        sent_at: new Date().toISOString(),
      })
      .eq("id", alertId)

    return NextResponse.json({
      success: true,
      alertId,
      message: "Alert sent successfully",
      targetUserCount: targetUsers.length,
      deliveryResults,
      autoActionsExecuted: !!alertData.autoActions,
    })
  } catch (error) {
    console.error("Alert send error:", error)
    return NextResponse.json({ success: false, error: "Failed to send alert" }, { status: 500 })
  }
}

async function getAlertTargetUsers(targetAudience: AlertData["targetAudience"]) {
  let query = supabase.from("users").select("id, name, email, phone, role, customer_id, location, push_subscription")

  // If targeting all users
  if (targetAudience.all) {
    const { data, error } = await query
    if (error) throw error
    return data || []
  }

  // If targeting only BHV members
  if (targetAudience.bhvOnly) {
    query = query.in("role", ["bhv_member", "bhv_coordinator", "ploegleider"])
  }

  // Build filters
  const filters = []

  if (targetAudience.customerIds?.length) {
    filters.push(`customer_id.in.(${targetAudience.customerIds.join(",")})`)
  }

  if (targetAudience.roles?.length) {
    filters.push(`role.in.(${targetAudience.roles.join(",")})`)
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

async function sendAlert(alertId: string, alertData: AlertData, targetUsers: any[]) {
  const results = {
    websocket: { sent: 0, failed: 0 },
    push: { sent: 0, failed: 0 },
    email: { sent: 0, failed: 0 },
    sms: { sent: 0, failed: 0 },
    system: { sent: 0, failed: 0 },
  }

  // WebSocket alerts (real-time)
  try {
    const wsResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/websocket/connect`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "broadcast_to_room",
        roomId: "all_users",
        data: {
          type: "emergency_alert",
          alertId,
          alertType: alertData.type,
          severity: alertData.severity,
          title: alertData.title,
          message: alertData.message,
          location: alertData.location,
          timestamp: new Date().toISOString(),
          expiresAt: alertData.expiresAt,
        },
      }),
    })

    if (wsResponse.ok) {
      results.websocket.sent = targetUsers.length
    } else {
      results.websocket.failed = targetUsers.length
    }
  } catch (error) {
    console.error("WebSocket alert error:", error)
    results.websocket.failed = targetUsers.length
  }

  // Push notifications
  for (const user of targetUsers.filter((u) => u.push_subscription)) {
    try {
      const pushResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/push-notification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          title: `${getSeverityEmoji(alertData.severity)} ${alertData.title}`,
          body: alertData.message,
          icon: "/images/bhv360-logo.png",
          badge: "/images/bhv360-logo.png",
          data: {
            alertId,
            type: alertData.type,
            severity: alertData.severity,
            location: alertData.location,
          },
          actions: getAlertActions(alertData.type),
          requireInteraction: alertData.severity === "critical" || alertData.severity === "fatal",
          vibrate: getVibrationPattern(alertData.severity),
          silent: false,
          tag: `alert_${alertData.type}`,
          renotify: true,
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

  // Email alerts
  for (const user of targetUsers.filter((u) => u.email)) {
    try {
      const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/email/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: user.email,
          subject: `${getSeverityEmoji(alertData.severity)} ALERT: ${alertData.title}`,
          html: generateAlertEmailTemplate(alertData, user),
          priority: alertData.severity === "critical" || alertData.severity === "fatal" ? "high" : "normal",
        }),
      })

      if (emailResponse.ok) {
        results.email.sent++
      } else {
        results.email.failed++
      }
    } catch (error) {
      console.error("Email alert error:", error)
      results.email.failed++
    }
  }

  // SMS alerts (for critical/fatal alerts)
  if (alertData.severity === "critical" || alertData.severity === "fatal") {
    for (const user of targetUsers.filter((u) => u.phone)) {
      try {
        const smsContent = `${getSeverityEmoji(alertData.severity)} BHV360 ALERT\n\n${alertData.title}\n\n${alertData.message}${alertData.location ? `\n\nLocatie: ${formatLocation(alertData.location)}` : ""}\n\nTijd: ${new Date().toLocaleString("nl-NL")}`

        const smsResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/sms/send`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: user.phone,
            message: smsContent,
            priority: "high",
          }),
        })

        if (smsResponse.ok) {
          results.sms.sent++
        } else {
          results.sms.failed++
        }
      } catch (error) {
        console.error("SMS alert error:", error)
        results.sms.failed++
      }
    }
  }

  return results
}

async function executeAutoActions(
  alertId: string,
  autoActions: AlertData["autoActions"],
  location?: AlertData["location"],
) {
  const actionResults = []

  if (autoActions?.lockDoors) {
    try {
      // Simulate door locking system integration
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/building/doors/lock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          alertId,
          location,
          action: "emergency_lock",
        }),
      })
      actionResults.push({ action: "lockDoors", status: "success" })
    } catch (error) {
      actionResults.push({
        action: "lockDoors",
        status: "failed",
        error: error instanceof Error ? error.message : "Unknown error",
      })
    }
  }

  if (autoActions?.activateAlarms) {
    try {
      // Simulate alarm system integration
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/building/alarms/activate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          alertId,
          location,
          alarmType: "emergency",
        }),
      })
      actionResults.push({ action: "activateAlarms", status: "success" })
    } catch (error) {
      actionResults.push({
        action: "activateAlarms",
        status: "failed",
        error: error instanceof Error ? error.message : "Unknown error",
      })
    }
  }

  if (autoActions?.notifyAuthorities) {
    try {
      // Simulate emergency services notification
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/emergency/notify-authorities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          alertId,
          location,
          emergencyType: "general",
        }),
      })
      actionResults.push({ action: "notifyAuthorities", status: "success" })
    } catch (error) {
      actionResults.push({
        action: "notifyAuthorities",
        status: "failed",
        error: error instanceof Error ? error.message : "Unknown error",
      })
    }
  }

  if (autoActions?.startEvacuation) {
    try {
      // Start evacuation procedure
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/evacuation/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          alertId,
          location,
          reason: "automated_alert",
        }),
      })
      actionResults.push({ action: "startEvacuation", status: "success" })
    } catch (error) {
      actionResults.push({
        action: "startEvacuation",
        status: "failed",
        error: error instanceof Error ? error.message : "Unknown error",
      })
    }
  }

  // Log auto actions
  await logAlertActivity(alertId, "auto_actions_executed", { actionResults })

  return actionResults
}

async function logAlertActivity(alertId: string, activity: string, data: any) {
  try {
    await supabase.from("alert_activity_log").insert({
      alert_id: alertId,
      activity,
      data,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Failed to log alert activity:", error)
  }
}

function getSeverityEmoji(severity: string): string {
  switch (severity) {
    case "fatal":
      return "💀"
    case "critical":
      return "🚨"
    case "warning":
      return "⚠️"
    case "info":
      return "ℹ️"
    default:
      return "📢"
  }
}

function getVibrationPattern(severity: string): number[] {
  switch (severity) {
    case "fatal":
      return [300, 100, 300, 100, 300, 100, 300]
    case "critical":
      return [200, 100, 200, 100, 200]
    case "warning":
      return [100, 50, 100]
    case "info":
      return [100]
    default:
      return [100]
  }
}

function getAlertActions(alertType: string): any[] {
  switch (alertType) {
    case "emergency":
      return [
        { action: "acknowledge", title: "✅ Bevestigen" },
        { action: "respond", title: "🚨 Reageren" },
        { action: "evacuate", title: "🏃 Evacueren" },
      ]
    case "fire":
      return [
        { action: "acknowledge", title: "✅ Bevestigen" },
        { action: "fire_response", title: "🔥 Brand Respons" },
        { action: "evacuate", title: "🏃 Evacueren" },
      ]
    case "medical":
      return [
        { action: "acknowledge", title: "✅ Bevestigen" },
        { action: "medical_response", title: "🚑 EHBO Respons" },
      ]
    default:
      return [
        { action: "acknowledge", title: "✅ Bevestigen" },
        { action: "view_details", title: "👁️ Details" },
      ]
  }
}

function formatLocation(location: AlertData["location"]): string {
  if (!location) return "Onbekend"

  const parts = []
  if (location.building) parts.push(location.building)
  if (location.floor) parts.push(`Verdieping ${location.floor}`)
  if (location.room) parts.push(`Ruimte ${location.room}`)

  return parts.join(", ") || "Onbekend"
}

function generateAlertEmailTemplate(alertData: AlertData, user: any): string {
  const severityColor =
    {
      fatal: "#7f1d1d",
      critical: "#dc2626",
      warning: "#ea580c",
      info: "#059669",
    }[alertData.severity] || "#6b7280"

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: ${severityColor}; color: white; padding: 20px; text-align: center;">
        <h1>${getSeverityEmoji(alertData.severity)} ${alertData.title}</h1>
        <p style="margin: 0; font-size: 18px; font-weight: bold;">
          ${alertData.severity.toUpperCase()} ALERT
        </p>
      </div>
      
      <div style="padding: 20px;">
        <div style="background: #fef2f2; border-left: 4px solid ${severityColor}; padding: 15px; margin-bottom: 20px;">
          <p style="margin: 0; font-size: 16px; line-height: 1.5;">
            ${alertData.message}
          </p>
        </div>
        
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <p><strong>Type:</strong> ${alertData.type}</p>
          <p><strong>Ernst:</strong> ${alertData.severity}</p>
          ${alertData.location ? `<p><strong>Locatie:</strong> ${formatLocation(alertData.location)}</p>` : ""}
          <p><strong>Tijd:</strong> ${new Date().toLocaleString("nl-NL")}</p>
          ${alertData.expiresAt ? `<p><strong>Verloopt:</strong> ${new Date(alertData.expiresAt).toLocaleString("nl-NL")}</p>` : ""}
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/alerts/${alertData.type}" 
             style="background: ${severityColor}; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Open BHV360 Dashboard
          </a>
        </div>
        
        <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin-top: 20px;">
          <p style="margin: 0; font-size: 14px;">
            <strong>Belangrijk:</strong> Dit is een geautomatiseerd alert van het BHV360 systeem. 
            Volg de procedures zoals getraind en neem contact op met de BHV-coördinator indien nodig.
          </p>
        </div>
      </div>
    </div>
  `
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const status = url.searchParams.get("status") || "active"
    const type = url.searchParams.get("type")
    const severity = url.searchParams.get("severity")
    const limit = Number.parseInt(url.searchParams.get("limit") || "50")
    const offset = Number.parseInt(url.searchParams.get("offset") || "0")

    let query = supabase
      .from("alerts")
      .select("*")
      .eq("status", status)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (type) {
      query = query.eq("type", type)
    }

    if (severity) {
      query = query.eq("severity", severity)
    }

    const { data, error } = await query

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ success: false, error: "Failed to fetch alerts" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      alerts: data,
      pagination: {
        limit,
        offset,
        hasMore: data.length === limit,
      },
    })
  } catch (error) {
    console.error("Fetch alerts error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch alerts" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { alertId, status, response, userId } = await request.json()

    if (!alertId || !status) {
      return NextResponse.json({ success: false, error: "Alert ID and status are required" }, { status: 400 })
    }

    // Update alert status
    const { error: updateError } = await supabase
      .from("alerts")
      .update({
        status,
        resolved_at: status === "resolved" ? new Date().toISOString() : null,
        resolved_by: status === "resolved" ? userId : null,
      })
      .eq("id", alertId)

    if (updateError) {
      console.error("Database error:", updateError)
      return NextResponse.json({ success: false, error: "Failed to update alert" }, { status: 500 })
    }

    // Log the response
    if (response && userId) {
      await supabase.from("alert_responses").insert({
        alert_id: alertId,
        user_id: userId,
        response,
        timestamp: new Date().toISOString(),
      })
    }

    // Log activity
    await logAlertActivity(alertId, "status_changed", {
      newStatus: status,
      userId,
      response,
    })

    return NextResponse.json({
      success: true,
      message: "Alert updated successfully",
    })
  } catch (error) {
    console.error("Update alert error:", error)
    return NextResponse.json({ success: false, error: "Failed to update alert" }, { status: 500 })
  }
}
