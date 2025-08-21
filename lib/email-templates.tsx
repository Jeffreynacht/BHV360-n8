import type React from "react"

// Email template styles
const emailStyles = {
  container: {
    fontFamily: "Arial, sans-serif",
    maxWidth: "600px",
    margin: "0 auto",
    backgroundColor: "#ffffff",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    overflow: "hidden",
  },
  header: {
    backgroundColor: "#1e40af",
    color: "#ffffff",
    padding: "20px",
    textAlign: "center" as const,
  },
  logo: {
    fontSize: "24px",
    fontWeight: "bold",
    margin: "0",
  },
  content: {
    padding: "30px 20px",
  },
  title: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: "20px",
  },
  text: {
    fontSize: "16px",
    lineHeight: "1.6",
    color: "#4b5563",
    marginBottom: "15px",
  },
  button: {
    display: "inline-block",
    backgroundColor: "#1e40af",
    color: "#ffffff",
    padding: "12px 24px",
    textDecoration: "none",
    borderRadius: "6px",
    fontWeight: "bold",
    margin: "20px 0",
  },
  footer: {
    backgroundColor: "#f9fafb",
    padding: "20px",
    textAlign: "center" as const,
    fontSize: "14px",
    color: "#6b7280",
    borderTop: "1px solid #e5e7eb",
  },
  credentials: {
    backgroundColor: "#f3f4f6",
    padding: "15px",
    borderRadius: "6px",
    margin: "20px 0",
    border: "1px solid #d1d5db",
  },
}

// Welcome email for new customers
export const WelcomeEmailTemplate = ({
  customerName,
  loginUrl,
  tempPassword,
  contactEmail = "support@bhv360.nl",
}: {
  customerName: string
  loginUrl: string
  tempPassword?: string
  contactEmail?: string
}) => (
  <div style={emailStyles.container}>
    <div style={emailStyles.header}>
      <h1 style={emailStyles.logo}>BHV360</h1>
      <p style={{ margin: "5px 0 0 0", fontSize: "14px" }}>Professionele BHV Software</p>
    </div>

    <div style={emailStyles.content}>
      <h2 style={emailStyles.title}>Welkom bij BHV360!</h2>

      <p style={emailStyles.text}>Beste {customerName},</p>

      <p style={emailStyles.text}>
        Hartelijk welkom bij BHV360! Uw account is succesvol aangemaakt en u kunt nu aan de slag met onze professionele
        BHV software.
      </p>

      {tempPassword && (
        <div style={emailStyles.credentials}>
          <h3 style={{ margin: "0 0 10px 0", fontSize: "16px", color: "#1f2937" }}>Uw inloggegevens:</h3>
          <p style={{ margin: "5px 0", fontSize: "14px" }}>
            <strong>Tijdelijk wachtwoord:</strong> {tempPassword}
          </p>
          <p style={{ margin: "5px 0", fontSize: "12px", color: "#ef4444" }}>
            ⚠️ Wijzig dit wachtwoord direct na uw eerste inlog
          </p>
        </div>
      )}

      <div style={{ textAlign: "center", margin: "30px 0" }}>
        <a href={loginUrl} style={emailStyles.button}>
          Inloggen op BHV360
        </a>
      </div>

      <h3 style={{ fontSize: "18px", color: "#1f2937", marginTop: "30px" }}>Wat kunt u nu doen?</h3>

      <ul style={{ ...emailStyles.text, paddingLeft: "20px" }}>
        <li>Uw bedrijfsgegevens completeren</li>
        <li>Medewerkers toevoegen aan het systeem</li>
        <li>Uw eerste plotkaart maken</li>
        <li>Veiligheidsvoorzieningen registreren</li>
        <li>BHV-procedures instellen</li>
      </ul>

      <p style={emailStyles.text}>
        Heeft u vragen of hulp nodig? Neem gerust contact met ons op via{" "}
        <a href={`mailto:${contactEmail}`} style={{ color: "#1e40af" }}>
          {contactEmail}
        </a>
      </p>

      <p style={emailStyles.text}>
        Met vriendelijke groet,
        <br />
        Het BHV360 Team
      </p>
    </div>

    <div style={emailStyles.footer}>
      <p style={{ margin: "0 0 10px 0" }}>BHV360 - Professionele BHV Software</p>
      <p style={{ margin: "0", fontSize: "12px" }}>
        Deze email is automatisch gegenereerd. Reageer niet op dit bericht.
      </p>
    </div>
  </div>
)

// Password reset email
export const PasswordResetEmailTemplate = ({
  customerName,
  resetUrl,
  expiresIn = "24 uur",
  contactEmail = "support@bhv360.nl",
}: {
  customerName: string
  resetUrl: string
  expiresIn?: string
  contactEmail?: string
}) => (
  <div style={emailStyles.container}>
    <div style={emailStyles.header}>
      <h1 style={emailStyles.logo}>BHV360</h1>
      <p style={{ margin: "5px 0 0 0", fontSize: "14px" }}>Wachtwoord Reset</p>
    </div>

    <div style={emailStyles.content}>
      <h2 style={emailStyles.title}>Wachtwoord Reset Aanvraag</h2>

      <p style={emailStyles.text}>Beste {customerName},</p>

      <p style={emailStyles.text}>
        U heeft een aanvraag gedaan om uw wachtwoord te resetten voor uw BHV360 account. Klik op de onderstaande knop om
        een nieuw wachtwoord in te stellen.
      </p>

      <div style={{ textAlign: "center", margin: "30px 0" }}>
        <a href={resetUrl} style={emailStyles.button}>
          Nieuw Wachtwoord Instellen
        </a>
      </div>

      <div
        style={{
          ...emailStyles.credentials,
          backgroundColor: "#fef3c7",
          borderColor: "#f59e0b",
          color: "#92400e",
        }}
      >
        <p style={{ margin: "0", fontSize: "14px" }}>
          ⚠️ Deze link is geldig voor {expiresIn}. Na deze tijd moet u een nieuwe reset aanvragen.
        </p>
      </div>

      <p style={emailStyles.text}>
        Heeft u deze aanvraag niet gedaan? Dan kunt u deze email negeren. Uw wachtwoord blijft dan ongewijzigd.
      </p>

      <p style={emailStyles.text}>
        Voor vragen kunt u contact opnemen via{" "}
        <a href={`mailto:${contactEmail}`} style={{ color: "#1e40af" }}>
          {contactEmail}
        </a>
      </p>

      <p style={emailStyles.text}>
        Met vriendelijke groet,
        <br />
        Het BHV360 Team
      </p>
    </div>

    <div style={emailStyles.footer}>
      <p style={{ margin: "0 0 10px 0" }}>BHV360 - Professionele BHV Software</p>
      <p style={{ margin: "0", fontSize: "12px" }}>
        Deze email is automatisch gegenereerd. Reageer niet op dit bericht.
      </p>
    </div>
  </div>
)

// Incident notification email
export const IncidentNotificationEmailTemplate = ({
  customerName,
  incidentTitle,
  incidentType,
  severity,
  location,
  reportedBy,
  reportedAt,
  dashboardUrl,
  contactEmail = "support@bhv360.nl",
}: {
  customerName: string
  incidentTitle: string
  incidentType: string
  severity: "low" | "medium" | "high" | "critical"
  location: string
  reportedBy: string
  reportedAt: string
  dashboardUrl: string
  contactEmail?: string
}) => {
  const severityColors = {
    low: "#10b981",
    medium: "#f59e0b",
    high: "#ef4444",
    critical: "#dc2626",
  }

  const severityLabels = {
    low: "Laag",
    medium: "Gemiddeld",
    high: "Hoog",
    critical: "Kritiek",
  }

  return (
    <div style={emailStyles.container}>
      <div style={emailStyles.header}>
        <h1 style={emailStyles.logo}>BHV360</h1>
        <p style={{ margin: "5px 0 0 0", fontSize: "14px" }}>Incident Melding</p>
      </div>

      <div style={emailStyles.content}>
        <h2 style={emailStyles.title}>Nieuw Incident Gemeld</h2>

        <p style={emailStyles.text}>Beste {customerName},</p>

        <p style={emailStyles.text}>Er is een nieuw incident gemeld in uw BHV360 systeem:</p>

        <div style={emailStyles.credentials}>
          <h3 style={{ margin: "0 0 15px 0", fontSize: "16px", color: "#1f2937" }}>Incident Details:</h3>

          <p style={{ margin: "8px 0", fontSize: "14px" }}>
            <strong>Titel:</strong> {incidentTitle}
          </p>

          <p style={{ margin: "8px 0", fontSize: "14px" }}>
            <strong>Type:</strong> {incidentType}
          </p>

          <p style={{ margin: "8px 0", fontSize: "14px" }}>
            <strong>Ernst:</strong>{" "}
            <span
              style={{
                color: severityColors[severity],
                fontWeight: "bold",
              }}
            >
              {severityLabels[severity]}
            </span>
          </p>

          <p style={{ margin: "8px 0", fontSize: "14px" }}>
            <strong>Locatie:</strong> {location}
          </p>

          <p style={{ margin: "8px 0", fontSize: "14px" }}>
            <strong>Gemeld door:</strong> {reportedBy}
          </p>

          <p style={{ margin: "8px 0", fontSize: "14px" }}>
            <strong>Gemeld op:</strong> {reportedAt}
          </p>
        </div>

        <div style={{ textAlign: "center", margin: "30px 0" }}>
          <a href={dashboardUrl} style={emailStyles.button}>
            Bekijk in Dashboard
          </a>
        </div>

        <p style={emailStyles.text}>
          Log in op uw BHV360 dashboard om meer details te bekijken en vervolgacties te ondernemen.
        </p>

        <p style={emailStyles.text}>
          Voor vragen kunt u contact opnemen via{" "}
          <a href={`mailto:${contactEmail}`} style={{ color: "#1e40af" }}>
            {contactEmail}
          </a>
        </p>

        <p style={emailStyles.text}>
          Met vriendelijke groet,
          <br />
          Het BHV360 Team
        </p>
      </div>

      <div style={emailStyles.footer}>
        <p style={{ margin: "0 0 10px 0" }}>BHV360 - Professionele BHV Software</p>
        <p style={{ margin: "0", fontSize: "12px" }}>
          Deze email is automatisch gegenereerd. Reageer niet op dit bericht.
        </p>
      </div>
    </div>
  )
}

// Inspection reminder email
export const InspectionReminderEmailTemplate = ({
  customerName,
  equipmentName,
  equipmentType,
  location,
  dueDate,
  dashboardUrl,
  contactEmail = "support@bhv360.nl",
}: {
  customerName: string
  equipmentName: string
  equipmentType: string
  location: string
  dueDate: string
  dashboardUrl: string
  contactEmail?: string
}) => (
  <div style={emailStyles.container}>
    <div style={emailStyles.header}>
      <h1 style={emailStyles.logo}>BHV360</h1>
      <p style={{ margin: "5px 0 0 0", fontSize: "14px" }}>Inspectie Herinnering</p>
    </div>

    <div style={emailStyles.content}>
      <h2 style={emailStyles.title}>Inspectie Vereist</h2>

      <p style={emailStyles.text}>Beste {customerName},</p>

      <p style={emailStyles.text}>
        Dit is een herinnering dat de volgende veiligheidsvoorziening binnenkort geïnspecteerd moet worden:
      </p>

      <div style={emailStyles.credentials}>
        <h3 style={{ margin: "0 0 15px 0", fontSize: "16px", color: "#1f2937" }}>Inspectie Details:</h3>

        <p style={{ margin: "8px 0", fontSize: "14px" }}>
          <strong>Voorziening:</strong> {equipmentName}
        </p>

        <p style={{ margin: "8px 0", fontSize: "14px" }}>
          <strong>Type:</strong> {equipmentType}
        </p>

        <p style={{ margin: "8px 0", fontSize: "14px" }}>
          <strong>Locatie:</strong> {location}
        </p>

        <p style={{ margin: "8px 0", fontSize: "14px" }}>
          <strong>Vervaldatum:</strong> <span style={{ color: "#ef4444", fontWeight: "bold" }}>{dueDate}</span>
        </p>
      </div>

      <div style={{ textAlign: "center", margin: "30px 0" }}>
        <a href={dashboardUrl} style={emailStyles.button}>
          Plan Inspectie
        </a>
      </div>

      <p style={emailStyles.text}>
        Zorg ervoor dat alle veiligheidsvoorzieningen op tijd worden geïnspecteerd om te voldoen aan de wettelijke
        eisen.
      </p>

      <p style={emailStyles.text}>
        Voor vragen kunt u contact opnemen via{" "}
        <a href={`mailto:${contactEmail}`} style={{ color: "#1e40af" }}>
          {contactEmail}
        </a>
      </p>

      <p style={emailStyles.text}>
        Met vriendelijke groet,
        <br />
        Het BHV360 Team
      </p>
    </div>

    <div style={emailStyles.footer}>
      <p style={{ margin: "0 0 10px 0" }}>BHV360 - Professionele BHV Software</p>
      <p style={{ margin: "0", fontSize: "12px" }}>
        Deze email is automatisch gegenereerd. Reageer niet op dit bericht.
      </p>
    </div>
  </div>
)

// Monthly report email
export const MonthlyReportEmailTemplate = ({
  customerName,
  reportMonth,
  stats,
  reportUrl,
  contactEmail = "support@bhv360.nl",
}: {
  customerName: string
  reportMonth: string
  stats: {
    totalIncidents: number
    resolvedIncidents: number
    pendingInspections: number
    completedInspections: number
    activeUsers: number
  }
  reportUrl: string
  contactEmail?: string
}) => (
  <div style={emailStyles.container}>
    <div style={emailStyles.header}>
      <h1 style={emailStyles.logo}>BHV360</h1>
      <p style={{ margin: "5px 0 0 0", fontSize: "14px" }}>Maandrapport</p>
    </div>

    <div style={emailStyles.content}>
      <h2 style={emailStyles.title}>Maandrapport {reportMonth}</h2>

      <p style={emailStyles.text}>Beste {customerName},</p>

      <p style={emailStyles.text}>
        Hierbij ontvangt u uw maandelijkse BHV360 rapport met een overzicht van alle activiteiten in {reportMonth}.
      </p>

      <div style={emailStyles.credentials}>
        <h3 style={{ margin: "0 0 15px 0", fontSize: "16px", color: "#1f2937" }}>Statistieken {reportMonth}:</h3>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <div>
            <p style={{ margin: "5px 0", fontSize: "14px" }}>
              <strong>Incidenten:</strong> {stats.totalIncidents}
            </p>
            <p style={{ margin: "5px 0", fontSize: "14px" }}>
              <strong>Opgelost:</strong> {stats.resolvedIncidents}
            </p>
          </div>
          <div>
            <p style={{ margin: "5px 0", fontSize: "14px" }}>
              <strong>Inspecties:</strong> {stats.completedInspections}
            </p>
            <p style={{ margin: "5px 0", fontSize: "14px" }}>
              <strong>Openstaand:</strong> {stats.pendingInspections}
            </p>
          </div>
        </div>

        <p style={{ margin: "15px 0 5px 0", fontSize: "14px" }}>
          <strong>Actieve gebruikers:</strong> {stats.activeUsers}
        </p>
      </div>

      <div style={{ textAlign: "center", margin: "30px 0" }}>
        <a href={reportUrl} style={emailStyles.button}>
          Volledig Rapport Bekijken
        </a>
      </div>

      <p style={emailStyles.text}>
        Het volledige rapport bevat gedetailleerde analyses, trends en aanbevelingen voor uw BHV-organisatie.
      </p>

      <p style={emailStyles.text}>
        Voor vragen over dit rapport kunt u contact opnemen via{" "}
        <a href={`mailto:${contactEmail}`} style={{ color: "#1e40af" }}>
          {contactEmail}
        </a>
      </p>

      <p style={emailStyles.text}>
        Met vriendelijke groet,
        <br />
        Het BHV360 Team
      </p>
    </div>

    <div style={emailStyles.footer}>
      <p style={{ margin: "0 0 10px 0" }}>BHV360 - Professionele BHV Software</p>
      <p style={{ margin: "0", fontSize: "12px" }}>
        Deze email is automatisch gegenereerd. Reageer niet op dit bericht.
      </p>
    </div>
  </div>
)

// Helper function to render email templates to HTML string
export const renderEmailTemplate = (template: React.ReactElement): string => {
  // This would typically use a server-side React renderer
  // For now, we'll return a placeholder
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>BHV360 Email</title>
    </head>
    <body style="margin: 0; padding: 20px; background-color: #f3f4f6;">
      ${template}
    </body>
    </html>
  `
}

// Email service configuration
export const emailConfig = {
  from: "BHV360 <noreply@bhv360.nl>",
  replyTo: "support@bhv360.nl",
  supportEmail: "support@bhv360.nl",
  baseUrl: process.env.NEXT_PUBLIC_APP_URL || "https://bhv360.vercel.app",
}
