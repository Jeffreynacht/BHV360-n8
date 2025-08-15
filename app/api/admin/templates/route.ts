import { type NextRequest, NextResponse } from "next/server"

interface Template {
  id: string
  name: string
  category: "messaging" | "email" | "notification" | "report" | "form"
  type: "sms" | "email" | "push" | "system" | "pdf" | "html"
  subject?: string
  content: string
  variables: string[]
  isActive: boolean
  isSystem: boolean
  createdAt: string
  updatedAt: string
  usageCount: number
  description?: string
  priority?: "low" | "normal" | "high" | "urgent"
}

// Mock data - in production this would come from your database
const mockTemplates: Template[] = [
  {
    id: "1",
    name: "Welkomstbericht Bezoeker",
    category: "messaging",
    type: "sms",
    content:
      "Welkom {{name}} bij {{company}}! U bent succesvol ingecheckt. Bij vragen kunt u contact opnemen met de receptie.",
    variables: ["{{name}}", "{{company}}"],
    isActive: true,
    isSystem: false,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    usageCount: 45,
    description: "Standaard welkomstbericht voor bezoekers",
    priority: "normal",
  },
  {
    id: "2",
    name: "Noodmelding E-mail",
    category: "email",
    type: "email",
    subject: "🚨 NOODMELDING: {{emergency_type}}",
    content:
      "Er is een noodmelding binnengekomen:\n\nType: {{emergency_type}}\nLocatie: {{location}}\nTijd: {{datetime}}\nBHV'er: {{bhv_name}}\n\nVolg de noodprocedures en meld u bij de verzamelplaats.",
    variables: ["{{emergency_type}}", "{{location}}", "{{datetime}}", "{{bhv_name}}"],
    isActive: true,
    isSystem: true,
    createdAt: "2024-01-10T09:00:00Z",
    updatedAt: "2024-01-20T14:30:00Z",
    usageCount: 12,
    description: "Automatische e-mail bij noodmeldingen",
    priority: "urgent",
  },
  {
    id: "3",
    name: "Uitcheck Herinnering",
    category: "messaging",
    type: "sms",
    content:
      "Beste {{name}}, vergeet niet uit te checken bij de receptie voordat u vertrekt. Bedankt voor uw bezoek bij {{company}}!",
    variables: ["{{name}}", "{{company}}"],
    isActive: true,
    isSystem: false,
    createdAt: "2024-01-12T11:00:00Z",
    updatedAt: "2024-01-18T16:45:00Z",
    usageCount: 78,
    description: "Herinnering voor bezoekers om uit te checken",
    priority: "normal",
  },
  {
    id: "4",
    name: "Incident Rapport PDF",
    category: "report",
    type: "pdf",
    content: `# Incident Rapport

**Incident ID:** {{incident_id}}
**Datum/Tijd:** {{datetime}}
**Locatie:** {{location}}
**Type:** {{emergency_type}}

## Betrokkenen
**BHV Coördinator:** {{coordinator_name}}
**BHV'er:** {{bhv_name}}

## Beschrijving
{{description}}

## Acties Ondernomen
{{actions_taken}}

## Status
{{status}}`,
    variables: [
      "{{incident_id}}",
      "{{datetime}}",
      "{{location}}",
      "{{emergency_type}}",
      "{{coordinator_name}}",
      "{{bhv_name}}",
      "{{description}}",
      "{{actions_taken}}",
      "{{status}}",
    ],
    isActive: true,
    isSystem: true,
    createdAt: "2024-01-08T08:00:00Z",
    updatedAt: "2024-01-22T12:15:00Z",
    usageCount: 23,
    description: "Standaard template voor incident rapporten",
    priority: "high",
  },
  {
    id: "5",
    name: "Push Notificatie Training",
    category: "notification",
    type: "push",
    content:
      "📚 Nieuwe BHV training beschikbaar: {{training_name}}. Inschrijven kan via de app. Deadline: {{deadline}}",
    variables: ["{{training_name}}", "{{deadline}}"],
    isActive: true,
    isSystem: false,
    createdAt: "2024-01-14T13:00:00Z",
    updatedAt: "2024-01-19T09:20:00Z",
    usageCount: 156,
    description: "Notificatie voor nieuwe trainingen",
    priority: "normal",
  },
]

export async function GET(request: NextRequest) {
  try {
    // In production, fetch from database
    // const templates = await db.templates.findMany()

    return NextResponse.json({
      success: true,
      templates: mockTemplates,
    })
  } catch (error) {
    console.error("Error fetching templates:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch templates" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.content || !body.category || !body.type) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Create new template
    const newTemplate: Template = {
      id: Date.now().toString(), // In production, use proper ID generation
      name: body.name,
      category: body.category,
      type: body.type,
      subject: body.subject,
      content: body.content,
      variables: body.variables || [],
      isActive: body.isActive ?? true,
      isSystem: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      usageCount: 0,
      description: body.description,
      priority: body.priority || "normal",
    }

    // In production, save to database
    // await db.templates.create({ data: newTemplate })

    mockTemplates.push(newTemplate)

    return NextResponse.json({
      success: true,
      template: newTemplate,
    })
  } catch (error) {
    console.error("Error creating template:", error)
    return NextResponse.json({ success: false, error: "Failed to create template" }, { status: 500 })
  }
}
