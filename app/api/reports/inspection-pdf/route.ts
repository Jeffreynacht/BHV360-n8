import { type NextRequest, NextResponse } from "next/server"
import { generateInspectionPDF } from "@/lib/reports/inspection-pdf-generator"

// Force dynamic rendering for this route
export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const reportId = searchParams.get("id")

    if (!reportId) {
      return NextResponse.json({ error: "Report ID is required" }, { status: 400 })
    }

    // Demo data - in real app, fetch from database
    const demoReports = [
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
        status: "goedgekeurd" as const,
        bevindingen:
          "Brandblusser in goede staat. Druk correct, geen beschadigingen zichtbaar. Instructielabel leesbaar.",
        aanbevelingen: "Reguliere controle over 6 maanden. Geen directe actie vereist.",
        volgendeInspectie: "2024-07-15",
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-15T10:30:00Z",
      },
      {
        id: "2",
        voorzieningId: "aed-002",
        voorzieningNaam: "AED Receptie",
        voorzieningType: "AED",
        locatie: "Begane grond - Receptie",
        inspecteur: "Maria van der Berg",
        inspecteurCertificering: "BHV-Diploma, AED Instructeur",
        inspectiedatum: "2024-01-20",
        vervaldatum: "2025-01-20",
        status: "herstel_nodig" as const,
        bevindingen: "AED functioneert correct. Batterij indicator toont 75%. Elektroden vervallen over 3 maanden.",
        aanbevelingen: "Nieuwe elektroden bestellen voor maart 2024. Batterij monitoren.",
        volgendeInspectie: "2024-07-20",
        createdAt: "2024-01-20T14:15:00Z",
        updatedAt: "2024-01-20T14:15:00Z",
      },
    ]

    const report = demoReports.find((r) => r.id === reportId)
    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 })
    }

    const pdfBuffer = await generateInspectionPDF(report)

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="inspectie-rapport-${reportId}.pdf"`,
      },
    })
  } catch (error) {
    console.error("Error generating PDF:", error)
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 })
  }
}
