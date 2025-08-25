import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()

    const { title, description, severity, location, building_id, floor, reported_by, incident_type, coordinates } = body

    // Validatie
    if (!title || !severity || !location || !reported_by) {
      return NextResponse.json({ error: "Verplichte velden ontbreken" }, { status: 400 })
    }

    // Incident aanmaken
    const { data: incident, error: incidentError } = await supabase
      .from("incidents")
      .insert({
        title,
        description,
        severity,
        location,
        building_id,
        floor,
        reported_by,
        incident_type,
        coordinates,
        status: "open",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (incidentError) {
      console.error("Fout bij aanmaken incident:", incidentError)
      return NextResponse.json({ error: "Kon incident niet aanmaken" }, { status: 500 })
    }

    // Automatisch BHV'ers notificeren op basis van locatie
    const { data: bhvUsers } = await supabase
      .from("users")
      .select("id, name, email, phone")
      .eq("role", "bhv")
      .eq("building_id", building_id)
      .eq("is_available", true)

    // Notificaties versturen
    if (bhvUsers && bhvUsers.length > 0) {
      const notifications = bhvUsers.map((user) => ({
        user_id: user.id,
        incident_id: incident.id,
        type: "incident_alert",
        title: `Nieuw incident: ${title}`,
        message: `Locatie: ${location}. Prioriteit: ${severity}`,
        is_read: false,
        created_at: new Date().toISOString(),
      }))

      await supabase.from("notifications").insert(notifications)
    }

    // Real-time broadcast naar alle gebruikers in het gebouw
    await supabase.channel("incidents").send({
      type: "broadcast",
      event: "incident_created",
      payload: {
        incident,
        building_id,
        severity,
      },
    })

    return NextResponse.json({
      success: true,
      incident,
      message: "Incident succesvol aangemaakt en BHV'ers genotificeerd",
    })
  } catch (error) {
    console.error("Fout in incident create API:", error)
    return NextResponse.json({ error: "Interne server fout" }, { status: 500 })
  }
}
