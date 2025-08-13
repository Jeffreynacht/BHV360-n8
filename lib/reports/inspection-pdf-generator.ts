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

export async function generateInspectionPDF(report: InspectionReport): Promise<Buffer> {
  // Simple HTML to PDF generation using basic HTML structure
  // In a real application, you would use a library like puppeteer or jsPDF

  const statusLabels = {
    goedgekeurd: "Goedgekeurd",
    herstel_nodig: "Herstel Nodig",
    afgekeurd: "Afgekeurd",
    vervangen: "Vervangen",
  }

  const statusColors = {
    goedgekeurd: "#22c55e",
    herstel_nodig: "#eab308",
    afgekeurd: "#ef4444",
    vervangen: "#3b82f6",
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Inspectie Rapport - ${report.voorzieningNaam}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 40px;
          line-height: 1.6;
          color: #333;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #333;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
          color: #2563eb;
        }
        .title {
          font-size: 20px;
          margin: 10px 0;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 30px;
        }
        .info-item {
          margin-bottom: 15px;
        }
        .label {
          font-weight: bold;
          color: #666;
          font-size: 12px;
          text-transform: uppercase;
        }
        .value {
          font-size: 14px;
          margin-top: 2px;
        }
        .status {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 4px;
          color: white;
          font-weight: bold;
          font-size: 12px;
        }
        .section {
          margin-bottom: 25px;
        }
        .section-title {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 10px;
          color: #333;
          border-bottom: 1px solid #ddd;
          padding-bottom: 5px;
        }
        .content-box {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 4px;
          border-left: 4px solid #2563eb;
        }
        .signature-section {
          margin-top: 50px;
          border-top: 1px solid #ddd;
          padding-top: 30px;
        }
        .signature-box {
          border: 1px solid #ddd;
          height: 80px;
          margin-top: 10px;
          background: #fafafa;
        }
        .footer {
          margin-top: 50px;
          text-align: center;
          font-size: 12px;
          color: #666;
          border-top: 1px solid #ddd;
          padding-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">BHV360</div>
        <div class="title">INSPECTIE RAPPORT</div>
        <div>Rapport ID: ${report.id}</div>
      </div>

      <div class="info-grid">
        <div>
          <div class="info-item">
            <div class="label">Voorziening</div>
            <div class="value">${report.voorzieningNaam}</div>
          </div>
          <div class="info-item">
            <div class="label">Type</div>
            <div class="value">${report.voorzieningType}</div>
          </div>
          <div class="info-item">
            <div class="label">Locatie</div>
            <div class="value">${report.locatie}</div>
          </div>
          <div class="info-item">
            <div class="label">Voorziening ID</div>
            <div class="value">${report.voorzieningId}</div>
          </div>
        </div>
        <div>
          <div class="info-item">
            <div class="label">Inspecteur</div>
            <div class="value">${report.inspecteur}</div>
          </div>
          <div class="info-item">
            <div class="label">Certificering</div>
            <div class="value">${report.inspecteurCertificering}</div>
          </div>
          <div class="info-item">
            <div class="label">Inspectiedatum</div>
            <div class="value">${new Date(report.inspectiedatum).toLocaleDateString("nl-NL")}</div>
          </div>
          <div class="info-item">
            <div class="label">Status</div>
            <div class="value">
              <span class="status" style="background-color: ${statusColors[report.status]}">
                ${statusLabels[report.status]}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Bevindingen</div>
        <div class="content-box">
          ${report.bevindingen}
        </div>
      </div>

      <div class="section">
        <div class="section-title">Aanbevelingen</div>
        <div class="content-box">
          ${report.aanbevelingen}
        </div>
      </div>

      <div class="info-grid">
        <div class="info-item">
          <div class="label">Vervaldatum</div>
          <div class="value">${new Date(report.vervaldatum).toLocaleDateString("nl-NL")}</div>
        </div>
        <div class="info-item">
          <div class="label">Volgende Inspectie</div>
          <div class="value">${new Date(report.volgendeInspectie).toLocaleDateString("nl-NL")}</div>
        </div>
      </div>

      <div class="signature-section">
        <div class="section-title">Handtekening Inspecteur</div>
        <div>
          <div class="label">Naam: ${report.inspecteur}</div>
          <div class="label">Datum: ${new Date(report.inspectiedatum).toLocaleDateString("nl-NL")}</div>
          <div class="signature-box"></div>
        </div>
      </div>

      <div class="footer">
        <div>Dit rapport is gegenereerd op ${new Date().toLocaleDateString("nl-NL")} om ${new Date().toLocaleTimeString("nl-NL")}</div>
        <div>BHV360 - Professionele BHV Software</div>
      </div>
    </body>
    </html>
  `

  // For demo purposes, return a simple buffer with HTML content
  // In production, use puppeteer or similar to generate actual PDF
  return Buffer.from(htmlContent, "utf-8")
}
