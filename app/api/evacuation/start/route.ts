import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()

    const {
      building_id,
      initiated_by,
      reason,
      evacuation_type = "full", // 'full' | 'partial'
      affected_floors = [],
      emergency_contacts = true,
    } = body

    if (!building_id || !initiated_by || !reason) {
      return NextResponse.json({ error: "Building ID, initiator en reden zijn verplicht" }, { status: 400 })
    }

    // Evacuatie record aanmaken
    const { data: evacuation, error: evacuationError } = await supabase
      .from("evacuations")
      .insert({
        building_id,
        initiated_by,
        reason,
        evacuation_type,
        affected_floors,
        status: "active",
        started_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (evacuationError) {
      console.error("Fout bij starten evacuatie:", evacuationError)
      return NextResponse.json({ error: "Kon evacuatie niet starten" }, { status: 500 })
    }

    // Alle gebruikers in het gebouw ophalen
    const { data: buildingUsers } = await supabase
      .from("users")
      .select("id, name, email, phone, floor")
      .eq("building_id", building_id)
      .eq("is_present", true)

    // Evacuatie notificaties versturen
    if (buildingUsers && buildingUsers.length > 0) {
      const notifications = buildingUsers
        .filter((user) => evacuation_type === "full" || affected_floors.includes(user.floor))
        .map((user) => ({
          user_id: user.id,
          evacuation_id: evacuation.id,
          type: "evacuation_alert",
          title: "🚨 EVACUATIE ALARM",
          message: `Verlaat onmiddellijk het gebouw. Reden: ${reason}`,
          is_read: false,
          priority: "critical",
          created_at: new Date().toISOString(),
        }))

      await supabase.from("notifications").insert(notifications)
    }

    // BHV coördinatoren extra notificatie
    const { data: bhvCoordinators } = await supabase
      .from("users")
      .select("id, name, email, phone")
      .eq("role", "bhv_coordinator")
      .eq("building_id", building_id)

    if (bhvCoordinators && bhvCoordinators.length > 0) {
      const coordinatorNotifications = bhvCoordinators.map((coordinator) => ({
        user_id: coordinator.id,
        evacuation_id: evacuation.id,
        type: "evacuation_coordinator",
        title: "Evacuatie Coördinatie Vereist",
        message: `Evacuatie gestart in gebouw. Coördineer de evacuatie procedure.`,
        is_read: false,
        priority: "critical",
        created_at: new Date().toISOString(),
      }))

      await supabase.from("notifications").insert(coordinatorNotifications)
    }

    // Real-time broadcast naar alle gebruikers
    await supabase.channel("emergency").send({
      type: "broadcast",
      event: "evacuation_started",
      payload: {
        evacuation,
        building_id,
        evacuation_type,
        affected_floors,
        message: `EVACUATIE ALARM: ${reason}`,
      },
    })

    // Emergency contacts notificeren indien gewenst
    if (emergency_contacts) {
      // Hier zou je externe emergency services kunnen notificeren
      // Voor nu loggen we het
      console.log("Emergency contacts zouden genotificeerd worden:", {
        building_id,
        evacuation_id: evacuation.id,
        reason,
      })
    }

    return NextResponse.json({
      success: true,
      evacuation,
      notified_users: buildingUsers?.length || 0,
      message: "Evacuatie succesvol gestart en alle gebruikers genotificeerd",
    })
  } catch (error) {
    console.error("Fout bij starten evacuatie:", error)
    return NextResponse.json({ error: "Interne server fout" }, { status: 500 })
  }
}
