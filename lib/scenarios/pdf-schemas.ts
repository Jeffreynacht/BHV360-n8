export interface ScenarioSchema {
  id: string
  scenarioType: string
  title: string
  description: string
  pdfUrl: string
  version: string
  language: "nl" | "en" | "de" | "fr"
  createdAt: string
  updatedAt: string
  isActive: boolean
  sections: SchemaSection[]
}

export interface SchemaSection {
  id: string
  title: string
  order: number
  content: string
  type: "text" | "checklist" | "flowchart" | "image" | "table"
  isRequired: boolean
}

export interface ScenarioWithSchema {
  scenario: {
    id: string
    name: string
    type: string
    priority: string
    description: string
  }
  schema: ScenarioSchema
  customInstructions?: string
}

export class PDFSchemaService {
  private schemas: ScenarioSchema[] = []

  constructor() {
    this.initializeDefaultSchemas()
  }

  // Get schema for scenario type
  getSchemaForScenario(scenarioType: string): ScenarioSchema | null {
    return this.schemas.find((schema) => schema.scenarioType === scenarioType && schema.isActive) || null
  }

  // Generate PDF with scenario instructions
  async generateScenarioPDF(
    scenarioType: string,
    location: { building: string; floor: string; zone?: string },
    customInstructions?: string,
  ): Promise<string> {
    const schema = this.getSchemaForScenario(scenarioType)
    if (!schema) {
      throw new Error(`No schema found for scenario type: ${scenarioType}`)
    }

    const pdfContent = await this.buildPDFContent(schema, location, customInstructions)

    // In real implementation, generate actual PDF
    const pdfBlob = await this.createPDF(pdfContent)
    const pdfUrl = await this.uploadPDF(pdfBlob, `${scenarioType}-${Date.now()}.pdf`)

    return pdfUrl
  }

  // Build PDF content from schema
  private async buildPDFContent(
    schema: ScenarioSchema,
    location: { building: string; floor: string; zone?: string },
    customInstructions?: string,
  ): Promise<any> {
    const content = {
      title: schema.title,
      subtitle: `Locatie: ${location.building} - ${location.floor}${location.zone ? ` - ${location.zone}` : ""}`,
      timestamp: new Date().toLocaleString("nl-NL"),
      sections: [],
    }

    // Add location-specific information
    content.sections.push({
      title: "Locatie Informatie",
      content: [
        `Gebouw: ${location.building}`,
        `Verdieping: ${location.floor}`,
        location.zone ? `Zone: ${location.zone}` : "",
        `Gegenereerd: ${content.timestamp}`,
      ].filter(Boolean),
    })

    // Add schema sections
    schema.sections
      .sort((a, b) => a.order - b.order)
      .forEach((section) => {
        content.sections.push({
          title: section.title,
          content: this.processSchemaContent(section.content, location),
          type: section.type,
          isRequired: section.isRequired,
        })
      })

    // Add custom instructions if provided
    if (customInstructions) {
      content.sections.push({
        title: "Aanvullende Instructies",
        content: customInstructions,
        type: "text",
        isRequired: false,
      })
    }

    return content
  }

  // Process schema content with location variables
  private processSchemaContent(content: string, location: any): string {
    return content
      .replace(/\{building\}/g, location.building)
      .replace(/\{floor\}/g, location.floor)
      .replace(/\{zone\}/g, location.zone || "Alle zones")
      .replace(/\{timestamp\}/g, new Date().toLocaleString("nl-NL"))
  }

  // Create PDF from content (mock implementation)
  private async createPDF(content: any): Promise<Blob> {
    // In real implementation, use jsPDF or similar
    const pdfContent = JSON.stringify(content, null, 2)
    return new Blob([pdfContent], { type: "application/pdf" })
  }

  // Upload PDF to storage
  private async uploadPDF(pdfBlob: Blob, filename: string): Promise<string> {
    const formData = new FormData()
    formData.append("pdf", pdfBlob, filename)

    const response = await fetch("/api/scenarios/upload-pdf", {
      method: "POST",
      body: formData,
    })

    const result = await response.json()
    return result.url
  }

  // Initialize default schemas
  private initializeDefaultSchemas(): void {
    this.schemas = [
      {
        id: "fire-schema",
        scenarioType: "fire",
        title: "Brandbestrijding Instructies",
        description: "Volledige instructies voor brandbestrijding",
        pdfUrl: "/schemas/fire-instructions.pdf",
        version: "1.0",
        language: "nl",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true,
        sections: [
          {
            id: "fire-immediate",
            title: "Onmiddellijke Acties",
            order: 1,
            content: `
1. ALARM SLAAN
   - Activeer dichtstbijzijnde handmelder
   - Roep "BRAND!" om anderen te waarschuwen

2. BEOORDEEL DE SITUATIE
   - Grootte van de brand
   - Type brandbaar materiaal
   - Aanwezigheid van personen
   - Vluchtroutes beschikbaar

3. KLEINE BRAND (< 1m²)
   - Gebruik juiste blusser
   - Blus van onderaf naar boven
   - Controleer nablussinggevaar

4. GROTE BRAND
   - NIET BLUSSEN
   - Start ontruiming
   - Wacht op brandweer
            `,
            type: "checklist",
            isRequired: true,
          },
          {
            id: "fire-evacuation",
            title: "Ontruiming Procedure",
            order: 2,
            content: `
1. ONTRUIMINGSALARM
   - Activeer ontruimingsalarm
   - Controleer alle ruimtes in {zone}
   - Sluit deuren achter je

2. BEGELEIDING
   - Help mindervaliden
   - Controleer toiletten/vergaderruimtes
   - Gebruik dichtstbijzijnde nooduitgang

3. VERZAMELPLAATS
   - Ga naar aangewezen verzamelplaats
   - Doe aanwezigheidscontrole
   - Meld vermiste personen aan brandweer

4. COMMUNICATIE
   - Informeer brandweer bij aankomst
   - Geef plattegrond en sleutels
   - Blijf beschikbaar voor vragen
   - Coördineer met hulpdiensten
            `,
            type: "checklist",
            isRequired: true,
          },
          {
            id: "fire-equipment",
            title: "Blusmiddelen Gebruik",
            order: 3,
            content: `
BRANDBLUSSER TYPES:
- Schuimblusser (A/B): Vaste stoffen en vloeistoffen
- Poederblusser (A/B/C): Universeel, ook gas
- CO2 blusser (B/E): Vloeistoffen en elektrische apparaten
- Waterblusser (A): Alleen vaste stoffen

GEBRUIK INSTRUCTIES:
1. Trek veiligheidspin eruit
2. Richt spuit naar basis van vuur
3. Knijp hendel in
4. Beweeg van links naar rechts

BRANDSLANGHASPEL:
1. Trek slang volledig uit
2. Open watertoevoer
3. Richt straal naar basis van brand
4. Werk systematisch van buiten naar binnen
            `,
            type: "text",
            isRequired: true,
          },
        ],
      },
      {
        id: "medical-schema",
        scenarioType: "medical",
        title: "EHBO Instructies",
        description: "Eerste hulp procedures",
        pdfUrl: "/schemas/medical-instructions.pdf",
        version: "1.0",
        language: "nl",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true,
        sections: [
          {
            id: "medical-assessment",
            title: "Primaire Beoordeling",
            order: 1,
            content: `
ABCDE METHODE:

A - AIRWAY (Luchtweg)
   - Controleer bewustzijn
   - Maak luchtweg vrij
   - Hoofdoverstrekt houding

B - BREATHING (Ademhaling)
   - Kijk, luister, voel 10 seconden
   - Normale ademhaling: 12-20/min
   - Bij geen ademhaling: start reanimatie

C - CIRCULATION (Bloedsomloop)
   - Controleer pols
   - Stop bloedingen
   - Behandel shock

D - DISABILITY (Neurologisch)
   - Pupilreactie
   - Bewustzijnsniveau
   - Bewegingsvermogen

E - EXPOSURE (Blootstelling)
   - Onderzoek verwondingen
   - Voorkom onderkoeling
   - Bescherm privacy
            `,
            type: "checklist",
            isRequired: true,
          },
          {
            id: "medical-cpr",
            title: "Reanimatie (CPR)",
            order: 2,
            content: `
REANIMATIE STAPPEN:

1. CONTROLEER BEWUSTZIJN
   - Schud aan schouders
   - Roep luid: "Gaat het?"
   - Geen reactie = bewusteloos

2. ALARMEER 112
   - Vraag AED
   - Geef exacte locatie
   - Blijf aan de lijn

3. START BORSTCOMPRESSIES
   - Plaats handen op onderste helft borstbeen
   - Druk 5-6 cm diep
   - Frequentie: 100-120/min
   - 30 compressies

4. BEADEMING
   - Hoofd overstrekt
   - Knijp neus dicht
   - 2 beademingen van 1 seconde

5. HERHAAL CYCLUS
   - 30 compressies : 2 beademingen
   - Wissel elke 2 minuten
   - Stop pas bij hulpdiensten
            `,
            type: "checklist",
            isRequired: true,
          },
        ],
      },
      {
        id: "evacuation-schema",
        scenarioType: "evacuation",
        title: "Ontruiming Instructies",
        description: "Volledige ontruimingsprocedures",
        pdfUrl: "/schemas/evacuation-instructions.pdf",
        version: "1.0",
        language: "nl",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true,
        sections: [
          {
            id: "evacuation-roles",
            title: "Rollen en Verantwoordelijkheden",
            order: 1,
            content: `
BHV COÖRDINATOR:
- Overzicht bewaren
- Communicatie met hulpdiensten
- Beslissingen nemen
- Eindcontrole gebouw

PLOEGLEIDERS:
- Ontruiming eigen sector
- Controle alle ruimtes
- Begeleiding naar verzamelplaats
- Rapportage aan coördinator

EHBO'ERS:
- Hulp aan gewonden
- Medische zorg verzamelplaats
- Samenwerking ambulancedienst

ONTRUIMINGSASSISTENTEN:
- Hulp mindervaliden
- Controle vluchtroutes
- Begeleiding bezoekers
- Sluiten deuren/ramen
            `,
            type: "text",
            isRequired: true,
          },
          {
            id: "evacuation-procedure",
            title: "Ontruiming Procedure",
            order: 2,
            content: `
FASE 1: ALARMERING
□ Ontruimingsalarm geactiveerd
□ Alle BHV'ers gealarmeerd
□ 112 gebeld indien nodig
□ Liften naar begane grond

FASE 2: ONTRUIMING
□ Systematische controle alle ruimtes
□ Hulp aan mindervaliden
□ Begeleiding via vluchtroutes
□ Deuren sluiten (niet vergrendelen)

FASE 3: VERZAMELING
□ Iedereen naar verzamelplaats
□ Aanwezigheidscontrole
□ Vermiste personen melden
□ Wachten op toestemming terugkeer

FASE 4: NAZORG
□ Debriefing BHV team
□ Rapportage incident
□ Evaluatie procedure
□ Verbeterpunten implementeren
            `,
            type: "checklist",
            isRequired: true,
          },
        ],
      },
    ]
  }

  // Send scenario with PDF schema
  async sendScenarioWithSchema(
    scenarioType: string,
    location: { building: string; floor: string; zone?: string },
    recipients: string[],
    customInstructions?: string,
  ): Promise<{ scenarioId: string; pdfUrl: string }> {
    // Generate PDF schema
    const pdfUrl = await this.generateScenarioPDF(scenarioType, location, customInstructions)

    // Create scenario
    const scenario = {
      id: `scenario-${Date.now()}`,
      type: scenarioType,
      location,
      pdfUrl,
      recipients,
      customInstructions,
      timestamp: new Date().toISOString(),
    }

    // Send notifications with PDF attachment
    await this.sendScenarioNotifications(scenario)

    return {
      scenarioId: scenario.id,
      pdfUrl: pdfUrl,
    }
  }

  private async sendScenarioNotifications(scenario: any): Promise<void> {
    const schema = this.getSchemaForScenario(scenario.type)

    const emailContent = {
      subject: `🚨 ${schema?.title || "Noodprocedure"} - ${scenario.location.building}`,
      body: `
Er is een ${scenario.type} scenario geactiveerd voor:

Locatie: ${scenario.location.building} - ${scenario.location.floor}${scenario.location.zone ? ` - ${scenario.location.zone}` : ""}
Tijd: ${new Date(scenario.timestamp).toLocaleString("nl-NL")}

${scenario.customInstructions ? `\nAanvullende instructies:\n${scenario.customInstructions}` : ""}

De volledige instructies zijn bijgevoegd als PDF.

BHV360 Management System
      `,
      attachments: [
        {
          filename: `${scenario.type}-instructies.pdf`,
          url: scenario.pdfUrl,
        },
      ],
    }

    // Send emails to recipients
    await Promise.all(
      scenario.recipients.map((recipient: string) =>
        fetch("/api/scenarios/send-notification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            recipient,
            ...emailContent,
          }),
        }),
      ),
    )
  }

  // Get all available schemas
  getAllSchemas(): ScenarioSchema[] {
    return this.schemas.filter((schema) => schema.isActive)
  }

  // Update schema
  async updateSchema(schemaId: string, updates: Partial<ScenarioSchema>): Promise<ScenarioSchema | null> {
    const schemaIndex = this.schemas.findIndex((s) => s.id === schemaId)
    if (schemaIndex === -1) return null

    this.schemas[schemaIndex] = {
      ...this.schemas[schemaIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    return this.schemas[schemaIndex]
  }
}
