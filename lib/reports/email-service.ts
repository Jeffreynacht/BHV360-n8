interface EmailConfig {
  to: string[]
  cc?: string[]
  bcc?: string[]
  subject: string
  body: string
  attachments?: {
    filename: string
    content: Blob
    contentType: string
  }[]
}

export class EmailService {
  private apiEndpoint = "/api/send-email"

  async sendReportEmail(config: EmailConfig): Promise<boolean> {
    try {
      const formData = new FormData()

      // Add email details
      formData.append("to", JSON.stringify(config.to))
      formData.append("subject", config.subject)
      formData.append("body", config.body)

      if (config.cc) {
        formData.append("cc", JSON.stringify(config.cc))
      }

      if (config.bcc) {
        formData.append("bcc", JSON.stringify(config.bcc))
      }

      // Add attachments
      if (config.attachments) {
        config.attachments.forEach((attachment, index) => {
          formData.append(`attachment_${index}`, attachment.content, attachment.filename)
        })
      }

      const response = await fetch(this.apiEndpoint, {
        method: "POST",
        body: formData,
      })

      return response.ok
    } catch (error) {
      console.error("Error sending email:", error)
      return false
    }
  }

  generateReportEmailBody(reportTitle: string, customerName: string, period: string): string {
    return `
Beste collega,

Hierbij ontvangt u het rapport "${reportTitle}" voor ${customerName} over de periode ${period}.

Dit rapport is automatisch gegenereerd door het BHV360 Management System.

Het rapport bevat:
- Actuele statistieken en trends
- Gedetailleerde analyses
- Aanbevelingen voor verbetering

Voor vragen over dit rapport kunt u contact opnemen met de BHV coördinator.

Met vriendelijke groet,
BHV360 Team

---
Dit is een automatisch gegenereerd bericht.
    `.trim()
  }
}

export const emailService = new EmailService()
