import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import { format } from "date-fns"
import { nl } from "date-fns/locale"

export interface ReportConfig {
  title: string
  subtitle?: string
  customerName: string
  reportType: string
  period: string
  data: any
  charts?: string[]
  includeCharts?: boolean
  includeRawData?: boolean
  includeRecommendations?: boolean
}

export class PDFReportGenerator {
  private pdf: jsPDF
  private pageHeight: number
  private pageWidth: number
  private currentY: number
  private margin: number

  constructor() {
    this.pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    })
    this.pageHeight = this.pdf.internal.pageSize.height
    this.pageWidth = this.pdf.internal.pageSize.width
    this.currentY = 20
    this.margin = 20
  }

  async generateReport(config: ReportConfig): Promise<Blob> {
    // Header
    this.addHeader(config)

    // Executive Summary
    this.addExecutiveSummary(config)

    // Charts
    if (config.includeCharts && config.charts) {
      await this.addCharts(config.charts)
    }

    // Data Tables
    if (config.includeRawData) {
      this.addDataTables(config.data)
    }

    // Recommendations
    if (config.includeRecommendations) {
      this.addRecommendations(config)
    }

    // Footer
    this.addFooter(config)

    return this.pdf.output("blob")
  }

  private addHeader(config: ReportConfig) {
    // Logo placeholder
    this.pdf.setFontSize(20)
    this.pdf.setFont("helvetica", "bold")
    this.pdf.text("BHV360", this.margin, this.currentY)

    // Title
    this.currentY += 15
    this.pdf.setFontSize(16)
    this.pdf.text(config.title, this.margin, this.currentY)

    // Subtitle
    if (config.subtitle) {
      this.currentY += 8
      this.pdf.setFontSize(12)
      this.pdf.setFont("helvetica", "normal")
      this.pdf.text(config.subtitle, this.margin, this.currentY)
    }

    // Customer and date info
    this.currentY += 15
    this.pdf.setFontSize(10)
    this.pdf.text(`Klant: ${config.customerName}`, this.margin, this.currentY)
    this.pdf.text(`Periode: ${config.period}`, this.pageWidth - 60, this.currentY)

    this.currentY += 5
    this.pdf.text(
      `Gegenereerd: ${format(new Date(), "dd MMMM yyyy HH:mm", { locale: nl })}`,
      this.margin,
      this.currentY,
    )

    // Line separator
    this.currentY += 10
    this.pdf.line(this.margin, this.currentY, this.pageWidth - this.margin, this.currentY)
    this.currentY += 10
  }

  private addExecutiveSummary(config: ReportConfig) {
    this.pdf.setFontSize(14)
    this.pdf.setFont("helvetica", "bold")
    this.pdf.text("Samenvatting", this.margin, this.currentY)

    this.currentY += 10
    this.pdf.setFontSize(10)
    this.pdf.setFont("helvetica", "normal")

    const summaryText = this.generateSummaryText(config)
    const lines = this.pdf.splitTextToSize(summaryText, this.pageWidth - 2 * this.margin)

    lines.forEach((line: string) => {
      if (this.currentY > this.pageHeight - 30) {
        this.pdf.addPage()
        this.currentY = this.margin
      }
      this.pdf.text(line, this.margin, this.currentY)
      this.currentY += 5
    })

    this.currentY += 10
  }

  private async addCharts(chartIds: string[]) {
    this.pdf.setFontSize(14)
    this.pdf.setFont("helvetica", "bold")
    this.pdf.text("Grafieken en Analyses", this.margin, this.currentY)
    this.currentY += 15

    for (const chartId of chartIds) {
      const chartElement = document.getElementById(chartId)
      if (chartElement) {
        try {
          const canvas = await html2canvas(chartElement, {
            scale: 2,
            backgroundColor: "#ffffff",
          })

          const imgData = canvas.toDataURL("image/png")
          const imgWidth = this.pageWidth - 2 * this.margin
          const imgHeight = (canvas.height * imgWidth) / canvas.width

          if (this.currentY + imgHeight > this.pageHeight - 30) {
            this.pdf.addPage()
            this.currentY = this.margin
          }

          this.pdf.addImage(imgData, "PNG", this.margin, this.currentY, imgWidth, imgHeight)
          this.currentY += imgHeight + 10
        } catch (error) {
          console.error("Error adding chart to PDF:", error)
        }
      }
    }
  }

  private addDataTables(data: any) {
    this.pdf.setFontSize(14)
    this.pdf.setFont("helvetica", "bold")
    this.pdf.text("Gedetailleerde Data", this.margin, this.currentY)
    this.currentY += 15

    // Add table data here
    this.pdf.setFontSize(10)
    this.pdf.setFont("helvetica", "normal")

    if (data.users) {
      this.pdf.text("Gebruikers Overzicht:", this.margin, this.currentY)
      this.currentY += 8

      data.users.forEach((user: any, index: number) => {
        if (this.currentY > this.pageHeight - 30) {
          this.pdf.addPage()
          this.currentY = this.margin
        }

        this.pdf.text(`${index + 1}. ${user.name} - ${user.role}`, this.margin + 5, this.currentY)
        this.currentY += 5
      })

      this.currentY += 10
    }
  }

  private addRecommendations(config: ReportConfig) {
    this.pdf.setFontSize(14)
    this.pdf.setFont("helvetica", "bold")
    this.pdf.text("Aanbevelingen", this.margin, this.currentY)
    this.currentY += 15

    const recommendations = this.generateRecommendations(config)

    this.pdf.setFontSize(10)
    this.pdf.setFont("helvetica", "normal")

    recommendations.forEach((rec, index) => {
      if (this.currentY > this.pageHeight - 30) {
        this.pdf.addPage()
        this.currentY = this.margin
      }

      this.pdf.text(`${index + 1}. ${rec}`, this.margin, this.currentY)
      this.currentY += 8
    })
  }

  private addFooter(config: ReportConfig) {
    const pageCount = this.pdf.getNumberOfPages()

    for (let i = 1; i <= pageCount; i++) {
      this.pdf.setPage(i)
      this.pdf.setFontSize(8)
      this.pdf.setFont("helvetica", "italic")

      // Footer text
      this.pdf.text("BHV360 Management System - Vertrouwelijk Document", this.margin, this.pageHeight - 10)

      // Page number
      this.pdf.text(`Pagina ${i} van ${pageCount}`, this.pageWidth - 40, this.pageHeight - 10)
    }
  }

  private generateSummaryText(config: ReportConfig): string {
    return `Dit rapport geeft een overzicht van de ${config.reportType.toLowerCase()} status voor ${config.customerName} over de periode ${config.period}. 

De analyse toont belangrijke trends en ontwikkelingen in de BHV organisatie. Alle data is verzameld uit het BHV360 management systeem en gevalideerd volgens de geldende veiligheidsnormen.

Voor vragen over dit rapport kunt u contact opnemen met uw BHV coördinator.`
  }

  private generateRecommendations(config: ReportConfig): string[] {
    return [
      "Zorg voor regelmatige updates van BHV certificeringen",
      "Controleer de status van veiligheidsvoorzieningen maandelijks",
      "Organiseer kwartaal evaluaties van incident procedures",
      "Houd evacuatieroutes altijd vrij van obstakels",
      "Plan jaarlijkse BHV training voor alle medewerkers",
    ]
  }
}

export async function generatePDFReport(config: ReportConfig): Promise<Blob> {
  const generator = new PDFReportGenerator()
  return await generator.generateReport(config)
}
