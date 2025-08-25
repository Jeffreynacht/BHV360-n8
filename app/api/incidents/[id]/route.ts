import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()
    const { id } = params

    const { data: incident, error } = await supabase
      .from("incidents")
      .select(`
        *,
        reported_by_user:users!incidents_reported_by_fkey(name, email),
        assigned_users:incident_assignments(
          user:users(id, name, email, phone)
        ),
        incident_logs(
          id,
          action,
          description,
          created_at,
          user:users(name)
        )
      `)
      .eq("id", id)
      .single()

    if (error) {
      return NextResponse.json({ error: "Incident niet gevonden" }, { status: 404 })
    }

    return NextResponse.json({ incident })
  } catch (error) {
    console.error("Fout bij ophalen incident:", error)
    return NextResponse.json({ error: "Interne server fout" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()
    const { id } = params
    const body = await request.json()

    const { status, priority, description, resolution, updated_by } = body

    // Incident updaten
    const { data: incident, error } = await supabase
      .from("incidents")
      .update({
        status,
        priority,
        description,
        resolution,
        updated_by,
        updated_at: new Date().toISOString(),
        ...(status === "resolved" && { resolved_at: new Date().toISOString() }),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: "Kon incident niet updaten" }, { status: 500 })
    }

    // Log actie
    await supabase.from("incident_logs").insert({
      incident_id: id,
      user_id: updated_by,
      action: `Status gewijzigd naar ${status}`,
      description: resolution || description,
      created_at: new Date().toISOString(),
    })

    // Real-time update
    await supabase.channel("incidents").send({
      type: "broadcast",
      event: "incident_updated",
      payload: { incident },
    })

    return NextResponse.json({
      success: true,
      incident,
      message: "Incident succesvol bijgewerkt",
    })
  } catch (error) {
    console.error("Fout bij updaten incident:", error)
    return NextResponse.json({ error: "Interne server fout" }, { status: 500 })
  }
}
