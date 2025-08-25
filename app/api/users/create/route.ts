import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()

    const {
      email,
      password,
      name,
      role,
      building_id,
      floor,
      department,
      phone,
      emergency_contact,
      certifications = [],
      is_bhv = false,
      bhv_level,
      created_by,
    } = body

    // Validatie
    if (!email || !password || !name || !role) {
      return NextResponse.json({ error: "Email, wachtwoord, naam en rol zijn verplicht" }, { status: 400 })
    }

    // Check of email al bestaat
    const { data: existingUser } = await supabase.from("users").select("id").eq("email", email).single()

    if (existingUser) {
      return NextResponse.json({ error: "Email adres is al in gebruik" }, { status: 400 })
    }

    // Wachtwoord hashen
    const hashedPassword = await bcrypt.hash(password, 12)

    // Gebruiker aanmaken
    const { data: user, error: userError } = await supabase
      .from("users")
      .insert({
        email,
        password: hashedPassword,
        name,
        role,
        building_id,
        floor,
        department,
        phone,
        emergency_contact,
        is_bhv,
        bhv_level,
        is_active: true,
        is_present: false,
        created_by,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select("id, email, name, role, building_id, floor, department, phone, is_bhv, bhv_level")
      .single()

    if (userError) {
      console.error("Fout bij aanmaken gebruiker:", userError)
      return NextResponse.json({ error: "Kon gebruiker niet aanmaken" }, { status: 500 })
    }

    // Certificeringen toevoegen
    if (certifications.length > 0) {
      const userCertifications = certifications.map((cert) => ({
        user_id: user.id,
        certification_type: cert.type,
        certification_name: cert.name,
        issued_date: cert.issued_date,
        expiry_date: cert.expiry_date,
        issuer: cert.issuer,
        certificate_number: cert.certificate_number,
        created_at: new Date().toISOString(),
      }))

      await supabase.from("user_certifications").insert(userCertifications)
    }

    // Welkom notificatie
    await supabase.from("notifications").insert({
      user_id: user.id,
      type: "welcome",
      title: "Welkom bij BHV360",
      message: `Welkom ${name}! Je account is succesvol aangemaakt.`,
      is_read: false,
      created_at: new Date().toISOString(),
    })

    // Audit log
    await supabase.from("audit_logs").insert({
      user_id: created_by,
      action: "user_created",
      resource_type: "user",
      resource_id: user.id,
      details: {
        created_user: user.email,
        role: user.role,
        building_id: user.building_id,
      },
      created_at: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      user,
      message: "Gebruiker succesvol aangemaakt",
    })
  } catch (error) {
    console.error("Fout bij aanmaken gebruiker:", error)
    return NextResponse.json({ error: "Interne server fout" }, { status: 500 })
  }
}
