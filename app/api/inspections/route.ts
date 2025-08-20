import { type NextRequest, NextResponse } from "next/server"

interface InspectionReport {
  id: string
  voorzieningId: string
  voorzieningNaam: string
  voorzieningType: string
  locatie: string
  inspecteur: string
  inspecteurCertificering: string
  inspectiedatum: string
  vervaldatum: string
  status: "goedgekeurd" | "herstel_nodig" | "afgekeurd" | "vervangen"
  bevindingen: string
  aanbevelingen: string
  volgendeInspectie: string
  createdAt: string
  updatedAt: string
}

// Demo data
const inspections: InspectionReport[] = [
  {
    id: "1",
    voorzieningId: "ext-001",
    voorzieningNaam: "Brandblusser Gang A",
    voorzieningType: "Brandblusser",
    locatie: "Begane grond - Gang A",
    inspecteur: "Jan Pietersen",
    inspecteurCertificering: "VCA-VOL, Brandveiligheid Niveau 3",
    inspectiedatum: "2024-01-15",
    vervaldatum: "2025-01-15",
    status: "goedgekeurd",
    bevindingen: "Brandblusser in goede staat. Druk correct, geen beschadigingen zichtbaar. Instructielabel leesbaar.",
    aanbevelingen: "Reguliere controle over 6 maanden. Geen directe actie vereist.",
    volgendeInspectie: "2024-07-15",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
]

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")
    const type = searchParams.get("type")

    let filteredInspections = inspections

    if (status && status !== "all") {
      filteredInspections = filteredInspections.filter((i) => i.status === status)
    }

    if (type && type !== "all") {
      filteredInspections = filteredInspections.filter((i) => i.voorzieningType === type)
    }

    return NextResponse.json({
      inspections: filteredInspections,
      total: filteredInspections.length,
    })
  } catch (error) {
    console.error("Error fetching inspections:", error)
    return NextResponse.json({ error: "Failed to fetch inspections" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const newInspection: InspectionReport = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    inspections.push(newInspection)

    return NextResponse.json(newInspection, { status: 201 })
  } catch (error) {
    console.error("Error creating inspection:", error)
    return NextResponse.json({ error: "Failed to create inspection" }, { status: 500 })
  }
}
