import jsPDF from "jspdf"
import html2canvas from "html2canvas"

interface ExportOptions {
  filename?: string
  title?: string
  building?: string
  floor?: string
  customerName?: string
  date?: string
  quality?: number
}

export async function exportPlotkaartToPDF(elementId: string, options: ExportOptions = {}): Promise<void> {
  try {
    const {
      filename = "bhv-plotkaart.pdf",
      title = "BHV Plotkaart",
      building = "",
      floor = "",
      customerName = "",
      date = new Date().toLocaleDateString("nl-NL"),
      quality = 2,
    } = options

    // Get the plotkaart element
    const element = document.getElementById(elementId)
    if (!element) {
      throw new Error("Plotkaart element not found")
    }

    // Show loading state
    const loadingElement = document.createElement("div")
    loadingElement.innerHTML = `
      <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px;">
        <div style="background: white; color: black; padding: 20px; border-radius: 8px; text-align: center;">
          <div style="margin-bottom: 10px;">📄 PDF wordt gegenereerd...</div>
          <div style="font-size: 14px; color: #666;">Dit kan even duren</div>
        </div>
      </div>
    `
    document.body.appendChild(loadingElement)

    // Capture the element as canvas with high quality
    const canvas = await html2canvas(element, {
      scale: quality,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
      width: element.scrollWidth,
      height: element.scrollHeight,
      scrollX: 0,
      scrollY: 0,
    })

    // Calculate dimensions for PDF (A4 landscape)
    const imgWidth = 297 // A4 landscape width in mm
    const imgHeight = 210 // A4 landscape height in mm

    // Calculate scaling to fit the image on the page
    const canvasAspectRatio = canvas.width / canvas.height
    const pageAspectRatio = imgWidth / imgHeight

    let finalWidth = imgWidth
    let finalHeight = imgHeight

    if (canvasAspectRatio > pageAspectRatio) {
      // Image is wider than page ratio
      finalHeight = imgWidth / canvasAspectRatio
    } else {
      // Image is taller than page ratio
      finalWidth = imgHeight * canvasAspectRatio
    }

    // Create PDF in landscape orientation
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    })

    // Add metadata
    pdf.setProperties({
      title: `${title} - ${building} ${floor}`,
      subject: "BHV Plotkaart",
      author: customerName,
      creator: "BHV360 Management System",
      keywords: "BHV, Plotkaart, Brandveiligheid, Evacuatie",
    })

    // Add header
    pdf.setFontSize(16)
    pdf.setFont("helvetica", "bold")
    pdf.text(title, 15, 20)

    if (building || floor) {
      pdf.setFontSize(12)
      pdf.setFont("helvetica", "normal")
      pdf.text(`${building} - ${floor}`, 15, 28)
    }

    if (customerName) {
      pdf.setFontSize(10)
      pdf.text(customerName, 15, 35)
    }

    // Add date
    pdf.setFontSize(10)
    pdf.text(`Gegenereerd op: ${date}`, imgWidth - 50, 20)

    // Add the plotkaart image
    const imgData = canvas.toDataURL("image/png", 1.0)
    const yOffset = 45 // Space for header
    const availableHeight = imgHeight - yOffset - 15 // Space for footer

    // Recalculate dimensions considering header space
    if (finalHeight > availableHeight) {
      const scale = availableHeight / finalHeight
      finalWidth *= scale
      finalHeight = availableHeight
    }

    // Center the image horizontally
    const xOffset = (imgWidth - finalWidth) / 2

    pdf.addImage(imgData, "PNG", xOffset, yOffset, finalWidth, finalHeight)

    // Add footer
    pdf.setFontSize(8)
    pdf.setFont("helvetica", "italic")
    pdf.text("BHV360 Management System - Professionele BHV Plotkaarten", 15, imgHeight - 10)

    // Add page number
    pdf.text("Pagina 1 van 1", imgWidth - 30, imgHeight - 10)

    // Add legend if there are items
    const legendItems = [
      "🧯 Brandblusser",
      "🚿 Brandslanghaspel",
      "🚪 Nooduitgang",
      "🏥 EHBO",
      "⚡ AED",
      "📞 Noodtelefoon",
    ]

    // Add a second page with legend
    pdf.addPage()
    pdf.setFontSize(16)
    pdf.setFont("helvetica", "bold")
    pdf.text("Legenda Veiligheidssymbolen", 15, 20)

    pdf.setFontSize(10)
    pdf.setFont("helvetica", "normal")
    let yPos = 35

    const categories = [
      { name: "Blusmiddelen", items: ["Brandblusser", "Brandslanghaspel", "Sprinklerinstallatie", "Brandkraan"] },
      { name: "Evacuatie", items: ["Nooduitgang", "Verzamelpunt", "Evacuatiestoel", "Vluchtroute"] },
      { name: "EHBO", items: ["EHBO-koffer", "AED", "Brancard", "Oogdouche"] },
      { name: "Alarm", items: ["Handmelder", "Brandalarmsirene", "BMC", "Noodknop"] },
    ]

    categories.forEach((category) => {
      pdf.setFont("helvetica", "bold")
      pdf.text(category.name, 15, yPos)
      yPos += 7

      pdf.setFont("helvetica", "normal")
      category.items.forEach((item) => {
        pdf.text(`• ${item}`, 20, yPos)
        yPos += 5
      })
      yPos += 5
    })

    // Add instructions
    yPos += 10
    pdf.setFont("helvetica", "bold")
    pdf.text("Instructies voor gebruik:", 15, yPos)
    yPos += 7

    pdf.setFont("helvetica", "normal")
    const instructions = [
      "1. Controleer regelmatig de locatie van alle veiligheidsvoorzieningen",
      "2. Zorg ervoor dat alle uitgangen vrij toegankelijk zijn",
      "3. Voer periodieke controles uit op brandblussers en EHBO-materiaal",
      "4. Houd evacuatieroutes altijd vrij van obstakels",
      "5. Zorg voor adequate verlichting van alle veiligheidssymbolen",
    ]

    instructions.forEach((instruction) => {
      pdf.text(instruction, 15, yPos)
      yPos += 6
    })

    // Remove loading state
    document.body.removeChild(loadingElement)

    // Save the PDF
    pdf.save(filename)

    // Show success message
    const successElement = document.createElement("div")
    successElement.innerHTML = `
      <div style="position: fixed; top: 20px; right: 20px; background: #10b981; color: white; padding: 15px 20px; border-radius: 8px; z-index: 9999; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
        ✅ PDF succesvol geëxporteerd!
      </div>
    `
    document.body.appendChild(successElement)

    setTimeout(() => {
      document.body.removeChild(successElement)
    }, 3000)
  } catch (error) {
    console.error("Error exporting PDF:", error)

    // Remove loading state if it exists
    const loadingElement = document.querySelector('[style*="position: fixed"]')
    if (loadingElement) {
      document.body.removeChild(loadingElement)
    }

    // Show error message
    const errorElement = document.createElement("div")
    errorElement.innerHTML = `
      <div style="position: fixed; top: 20px; right: 20px; background: #ef4444; color: white; padding: 15px 20px; border-radius: 8px; z-index: 9999; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
        ❌ Fout bij exporteren van PDF
      </div>
    `
    document.body.appendChild(errorElement)

    setTimeout(() => {
      document.body.removeChild(errorElement)
    }, 3000)
  }
}

export function exportPlotkaartAsImage(elementId: string, filename = "bhv-plotkaart.png"): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const element = document.getElementById(elementId)
      if (!element) {
        throw new Error("Plotkaart element not found")
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
      })

      // Create download link
      const link = document.createElement("a")
      link.download = filename
      link.href = canvas.toDataURL("image/png")
      link.click()

      resolve()
    } catch (error) {
      reject(error)
    }
  })
}
