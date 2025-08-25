import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()

    const { incident_id, user_ids, assigned_by, notes } = body

    if (!incident_id || !user_ids || !Array.isArray(user_ids)) {
      return NextResponse.json({ error: "Incident ID en gebruiker IDs zijn verplicht" }, { status: 400 })
    }

    // Bestaande toewijzingen verwijderen
    await supabase.from("incident_assignments").delete().eq("incident_id", incident_id)

    // Nieuwe toewijzingen aanmaken
    const assignments = user_ids.map((user_id) => ({
      incident_id,
      user_id,
      assigned_by,
      assigned_at: new Date().toISOString(),
      notes,
    }))

    const { data: newAssignments, error: assignError } = await supabase
      .from("incident_assignments")
      .insert(assignments)
      .select(`
        *,
        user:users(id, name, email, phone)
      `)

    if (assignError) {
      return NextResponse.json({ error: "Kon gebruikers niet toewijzen" }, { status: 500 })
    }

    // Incident status updaten
    await supabase
      .from("incidents")
      .update({
        status: "assigned",
        updated_at: new Date().toISOString(),
      })
      .eq("id", incident_id)

    // Notificaties versturen naar toegewezen gebruikers
    const notifications = user_ids.map((user_id) => ({
      user_id,
      incident_id,
      type: "incident_assignment",
      title: "Je bent toegewezen aan een incident",
      message: notes || "Je bent toegewezen aan een nieuw incident",
      is_read: false,
      created_at: new Date().toISOString(),
    }))

    await supabase.from("notifications").insert(notifications)

    // Log actie
    await supabase.from("incident_logs").insert({
      incident_id,
      user_id: assigned_by,
      action: `${user_ids.length} BHV'er(s) toegewezen`,
      description: `Toegewezen gebruikers: ${user_ids.join(", ")}`,
      created_at: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      assignments: newAssignments,
      message: "BHV'ers succesvol toegewezen",
    })
  } catch (error) {
    console.error("Fout bij toewijzen BHV'ers:", error)
    return NextResponse.json({ error: "Interne server fout" }, { status: 500 })
  }
}
