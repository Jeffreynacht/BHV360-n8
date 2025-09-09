import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)
    const building_id = searchParams.get("building_id")

    if (!building_id) {
      return NextResponse.json({ error: "Building ID is verplicht" }, { status: 400 })
    }

    // Actieve evacuaties ophalen
    const { data: evacuations, error } = await supabase
      .from("evacuations")
      .select(`
        *,
        initiated_by_user:users!evacuations_initiated_by_fkey(name, email),
        evacuation_checkpoints(
          id,
          checkpoint_name,
          status,
          checked_by,
          checked_at,
          user:users(name)
        )
      `)
      .eq("building_id", building_id)
      .eq("status", "active")
      .order("started_at", { ascending: false })

    if (error) {
      console.error("Error fetching evacuation status:", error)
      return NextResponse.json({ error: "Kon evacuatie status niet ophalen" }, { status: 500 })
    }

    // Gebruikers aanwezigheid status
    const { data: presentUsers } = await supabase
      .from("users")
      .select("id, name, floor, evacuation_status, last_seen")
      .eq("building_id", building_id)
      .eq("is_present", true)

    // Evacuatie statistieken
    const stats = {
      total_present: presentUsers?.length || 0,
      evacuated: presentUsers?.filter((u) => u.evacuation_status === "evacuated").length || 0,
      in_progress: presentUsers?.filter((u) => u.evacuation_status === "evacuating").length || 0,
      missing: presentUsers?.filter((u) => !u.evacuation_status || u.evacuation_status === "unknown").length || 0,
    }

    return NextResponse.json({
      evacuations,
      present_users: presentUsers,
      statistics: stats,
      is_active: evacuations && evacuations.length > 0,
    })
  } catch (error) {
    console.error("Fout bij ophalen evacuatie status:", error)
    return NextResponse.json({ error: "Interne server fout" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()

    const {
      evacuation_id,
      user_id,
      evacuation_status, // 'evacuating' | 'evacuated' | 'safe'
      checkpoint_id,
      notes,
    } = body

    // Gebruiker evacuatie status updaten
    if (user_id && evacuation_status) {
      await supabase
        .from("users")
        .update({
          evacuation_status,
          last_seen: new Date().toISOString(),
        })
        .eq("id", user_id)

      // Evacuatie log aanmaken
      await supabase.from("evacuation_logs").insert({
        evacuation_id,
        user_id,
        status: evacuation_status,
        checkpoint_id,
        notes,
        timestamp: new Date().toISOString(),
      })
    }

    // Checkpoint status updaten indien van toepassing
    if (checkpoint_id) {
      await supabase
        .from("evacuation_checkpoints")
        .update({
          status: "checked",
          checked_by: user_id,
          checked_at: new Date().toISOString(),
        })
        .eq("id", checkpoint_id)
    }

    return NextResponse.json({
      success: true,
      message: "Evacuatie status bijgewerkt",
    })
  } catch (error) {
    console.error("Fout bij updaten evacuatie status:", error)
    return NextResponse.json({ error: "Interne server fout" }, { status: 500 })
  }
}
