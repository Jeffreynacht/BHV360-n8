import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()
    const { id } = params
    const body = await request.json()

    const { role, permissions = [], is_bhv, bhv_level, updated_by } = body

    if (!role) {
      return NextResponse.json({ error: "Rol is verplicht" }, { status: 400 })
    }

    // Gebruiker rol updaten
    const { data: user, error: userError } = await supabase
      .from("users")
      .update({
        role,
        is_bhv,
        bhv_level,
        updated_by,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("id, name, email, role, is_bhv, bhv_level")
      .single()

    if (userError) {
      return NextResponse.json({ error: "Kon gebruiker rol niet updaten" }, { status: 500 })
    }

    // Bestaande permissions verwijderen
    await supabase.from("user_permissions").delete().eq("user_id", id)

    // Nieuwe permissions toevoegen
    if (permissions.length > 0) {
      const userPermissions = permissions.map((permission) => ({
        user_id: id,
        permission,
        granted_by: updated_by,
        granted_at: new Date().toISOString(),
      }))

      await supabase.from("user_permissions").insert(userPermissions)
    }

    // Notificatie naar gebruiker
    await supabase.from("notifications").insert({
      user_id: id,
      type: "role_updated",
      title: "Je rol is bijgewerkt",
      message: `Je rol is gewijzigd naar: ${role}${is_bhv ? ` (BHV niveau ${bhv_level})` : ""}`,
      is_read: false,
      created_at: new Date().toISOString(),
    })

    // Audit log
    await supabase.from("audit_logs").insert({
      user_id: updated_by,
      action: "user_role_updated",
      resource_type: "user",
      resource_id: id,
      details: {
        old_role: "previous_role", // Je zou de oude rol kunnen opslaan
        new_role: role,
        is_bhv,
        bhv_level,
        permissions,
      },
      created_at: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      user,
      message: "Gebruiker rol succesvol bijgewerkt",
    })
  } catch (error) {
    console.error("Fout bij updaten gebruiker rol:", error)
    return NextResponse.json({ error: "Interne server fout" }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()
    const { id } = params

    // Gebruiker met permissions ophalen
    const { data: user, error } = await supabase
      .from("users")
      .select(`
        id,
        name,
        email,
        role,
        is_bhv,
        bhv_level,
        user_permissions(permission, granted_at, granted_by)
      `)
      .eq("id", id)
      .single()

    if (error) {
      return NextResponse.json({ error: "Gebruiker niet gevonden" }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Fout bij ophalen gebruiker rollen:", error)
    return NextResponse.json({ error: "Interne server fout" }, { status: 500 })
  }
}
