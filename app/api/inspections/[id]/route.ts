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

// Demo data - in real app this would be in a database
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

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const inspection = inspections.find((i) => i.id === params.id)

    if (!inspection) {
      return NextResponse.json({ error: "Inspection not found" }, { status: 404 })
    }

    return NextResponse.json(inspection)
  } catch (error) {
    console.error("Error fetching inspection:", error)
    return NextResponse.json({ error: "Failed to fetch inspection" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const inspectionIndex = inspections.findIndex((i) => i.id === params.id)

    if (inspectionIndex === -1) {
      return NextResponse.json({ error: "Inspection not found" }, { status: 404 })
    }

    inspections[inspectionIndex] = {
      ...inspections[inspectionIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(inspections[inspectionIndex])
  } catch (error) {
    console.error("Error updating inspection:", error)
    return NextResponse.json({ error: "Failed to update inspection" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const inspectionIndex = inspections.findIndex((i) => i.id === params.id)

    if (inspectionIndex === -1) {
      return NextResponse.json({ error: "Inspection not found" }, { status: 404 })
    }

    inspections.splice(inspectionIndex, 1)

    return NextResponse.json({ message: "Inspection deleted successfully" })
  } catch (error) {
    console.error("Error deleting inspection:", error)
    return NextResponse.json({ error: "Failed to delete inspection" }, { status: 500 })
  }
}
