import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()

    const {
      alert_type, // 'fire' | 'medical' | 'security' | 'evacuation' | 'general'
      severity, // 'low' | 'medium' | 'high' | 'critical'
      title,
      message,
      building_id,
      floor,
      location,
      sent_by,
      target_roles = [], // Specifieke rollen targeten
      send_sms = false,
      send_email = false,
      send_push = true,
    } = body

    if (!alert_type || !severity || !title || !message || !sent_by) {
      return NextResponse.json(
        { error: "Alert type, severity, titel, bericht en afzender zijn verplicht" },
        { status: 400 },
      )
    }

    // Emergency alert record aanmaken
    const { data: alert, error: alertError } = await supabase
      .from("emergency_alerts")
      .insert({
        alert_type,
        severity,
        title,
        message,
        building_id,
        floor,
        location,
        sent_by,
        target_roles,
        send_sms,
        send_email,
        send_push,
        status: "sent",
        sent_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (alertError) {
      console.error("Fout bij aanmaken emergency alert:", alertError)
      return NextResponse.json({ error: "Kon emergency alert niet aanmaken" }, { status: 500 })
    }

    // Target gebruikers bepalen
    let userQuery = supabase.from("users").select("id, name, email, phone, role, push_token")

    if (building_id) {
      userQuery = userQuery.eq("building_id", building_id)
    }

    if (target_roles.length > 0) {
      userQuery = userQuery.in("role", target_roles)
    }

    const { data: targetUsers } = await userQuery

    if (!targetUsers || targetUsers.length === 0) {
      return NextResponse.json({ error: "Geen gebruikers gevonden om te notificeren" }, { status: 400 })
    }

    // Notificaties aanmaken
    const notifications = targetUsers.map((user) => ({
      user_id: user.id,
      alert_id: alert.id,
      type: "emergency_alert",
      title: `🚨 ${title}`,
      message,
      priority: severity,
      is_read: false,
      created_at: new Date().toISOString(),
    }))

    await supabase.from("notifications").insert(notifications)

    // Push notificaties versturen
    if (send_push) {
      const pushTokens = targetUsers.filter((user) => user.push_token).map((user) => user.push_token)

      if (pushTokens.length > 0) {
        // Hier zou je de push notification service aanroepen
        console.log("Push notifications zouden verstuurd worden naar:", pushTokens.length, "gebruikers")
      }
    }

    // SMS versturen
    if (send_sms) {
      const phoneNumbers = targetUsers.filter((user) => user.phone).map((user) => user.phone)

      if (phoneNumbers.length > 0) {
        // Hier zou je de SMS service aanroepen
        console.log("SMS berichten zouden verstuurd worden naar:", phoneNumbers.length, "nummers")
      }
    }

    // Email versturen
    if (send_email) {
      const emailAddresses = targetUsers.filter((user) => user.email).map((user) => user.email)

      if (emailAddresses.length > 0) {
        // Hier zou je de email service aanroepen
        console.log("Emails zouden verstuurd worden naar:", emailAddresses.length, "adressen")
      }
    }

    // Real-time broadcast
    await supabase.channel("emergency").send({
      type: "broadcast",
      event: "emergency_alert",
      payload: {
        alert,
        severity,
        building_id,
        target_roles,
      },
    })

    return NextResponse.json({
      success: true,
      alert,
      recipients: targetUsers.length,
      message: `Emergency alert verstuurd naar ${targetUsers.length} gebruikers`,
    })
  } catch (error) {
    console.error("Fout bij versturen emergency alert:", error)
    return NextResponse.json({ error: "Interne server fout" }, { status: 500 })
  }
}
