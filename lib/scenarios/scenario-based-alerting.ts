export interface EmergencyScenario {
  id: string
  name: string
  type: "fire" | "medical" | "evacuation" | "security" | "lone_worker" | "chemical" | "earthquake" | "custom"
  description: string
  isActive: boolean
  priority: "low" | "normal" | "high" | "critical" | "emergency"

  // Trigger conditions
  triggers: {
    manual: boolean
    automatic: boolean
    hardware: string[] // Hardware trigger IDs
    timeBasedConditions?: {
      startTime: string
      endTime: string
      daysOfWeek: number[]
    }
  }

  // Alert configuration
  alerting: {
    channels: string[] // Which channels to use
    recipients: {
      roles: string[]
      individuals: string[]
      locationBased: boolean
      radiusMeters?: number
    }
    escalation: {
      enabled: boolean
      delaySeconds: number
      escalateTo: string[]
    }
    followUp: {
      enabled: boolean
      intervals: number[] // seconds
      maxFollowUps: number
    }
  }

  // Actions to execute
  actions: {
    notifications: {
      push: boolean
      sms: boolean
      voice: boolean
      email: boolean
      desktop: boolean
    }
    systemActions: {
      lockdown: boolean
      unlockExits: boolean
      activateSprinklers: boolean
      cutPower: boolean
      activatePA: boolean
    }
    documentation: {
      createIncident: boolean
      logActions: boolean
      recordAudio: boolean
      capturePhotos: boolean
    }
  }

  // Instructions and procedures
  procedures: {
    bhvInstructions: string
    publicInstructions: string
    evacuationRoute?: string
    assemblyPoint?: string
    specialInstructions?: string[]
  }

  // Media and documents
  attachments: {
    procedurePDF?: string
    floorPlan?: string
    evacuationMap?: string
    contactList?: string
  }
}

export interface ScenarioExecution {
  id: string
  scenarioId: string
  triggeredBy: string
  triggerType: "manual" | "automatic" | "hardware"
  startTime: string
  endTime?: string
  status: "active" | "completed" | "cancelled" | "failed"

  // Execution tracking
  steps: {
    stepId: string
    name: string
    status: "pending" | "in_progress" | "completed" | "failed"
    startTime?: string
    endTime?: string
    assignedTo?: string
    notes?: string
  }[]

  // Response tracking
  responses: {
    recipientId: string
    acknowledged: boolean
    acknowledgedAt?: string
    location?: { lat: number; lng: number }
    status: "notified" | "acknowledged" | "responding" | "on_site" | "completed"
  }[]

  // Media collected during execution
  media: {
    photos: string[]
    videos: string[]
    audio: string[]
    documents: string[]
  }

  // Metrics
  metrics: {
    responseTime: number // seconds
    acknowledgmentRate: number // percentage
    completionTime?: number // seconds
    participantCount: number
  }
}

export class ScenarioBasedAlertingService {
  private scenarios: Map<string, EmergencyScenario> = new Map()
  private executions: Map<string, ScenarioExecution> = new Map()
  private activeExecutions: Set<string> = new Set()

  constructor() {
    this.initializeDefaultScenarios()
  }

  // Initialize default emergency scenarios
  private initializeDefaultScenarios(): void {
    const defaultScenarios: EmergencyScenario[] = [
      {
        id: "fire-evacuation",
        name: "Brand & Evacuatie",
        type: "fire",
        description: "Volledige evacuatie bij brand",
        isActive: true,
        priority: "emergency",
        triggers: {
          manual: true,
          automatic: true,
          hardware: ["fire-alarm-1", "smoke-detector-1"],
        },
        alerting: {
          channels: ["push", "sms", "voice", "email"],
          recipients: {
            roles: ["BHV_COORDINATOR", "BHV_PLOEGLEIDER", "BHV_MEMBER"],
            individuals: [],
            locationBased: true,
            radiusMeters: 500,
          },
          escalation: {
            enabled: true,
            delaySeconds: 120,
            escalateTo: ["CUSTOMER_ADMIN"],
          },
          followUp: {
            enabled: true,
            intervals: [300, 600, 900], // 5, 10, 15 minutes
            maxFollowUps: 3,
          },
        },
        actions: {
          notifications: {
            push: true,
            sms: true,
            voice: true,
            email: true,
            desktop: true,
          },
          systemActions: {
            lockdown: false,
            unlockExits: true,
            activateSprinklers: false, // Depends on fire system
            cutPower: false,
            activatePA: true,
          },
          documentation: {
            createIncident: true,
            logActions: true,
            recordAudio: true,
            capturePhotos: true,
          },
        },
        procedures: {
          bhvInstructions:
            "1. Controleer brandhaard\n2. Alarmeer brandweer (112)\n3. Start evacuatie\n4. Controleer verzamelplaats",
          publicInstructions: "Verlaat het gebouw via dichtstbijzijnde nooduitgang. Ga naar verzamelplaats.",
          evacuationRoute: "Hoofduitgang + nooduitgangen",
          assemblyPoint: "Parkeerplaats voorzijde",
          specialInstructions: [
            "Controleer alle ruimtes",
            "Sluit deuren achter je",
            "Gebruik GEEN lift",
            "Help personen met beperking",
          ],
        },
        attachments: {
          procedurePDF: "/procedures/brand-evacuatie.pdf",
          floorPlan: "/floorplans/building-1.pdf",
          evacuationMap: "/evacuation/building-1-routes.pdf",
        },
      },
      {
        id: "medical-emergency",
        name: "Medische Noodsituatie",
        type: "medical",
        description: "EHBO hulp vereist",
        isActive: true,
        priority: "high",
        triggers: {
          manual: true,
          automatic: false,
          hardware: ["panic-button-1"],
        },
        alerting: {
          channels: ["push", "sms", "voice"],
          recipients: {
            roles: ["EHBO_MEMBER", "BHV_COORDINATOR"],
            individuals: [],
            locationBased: true,
            radiusMeters: 200,
          },
          escalation: {
            enabled: true,
            delaySeconds: 180,
            escalateTo: ["BHV_COORDINATOR"],
          },
          followUp: {
            enabled: true,
            intervals: [600], // 10 minutes
            maxFollowUps: 1,
          },
        },
        actions: {
          notifications: {
            push: true,
            sms: true,
            voice: true,
            email: false,
            desktop: true,
          },
          systemActions: {
            lockdown: false,
            unlockExits: false,
            activateSprinklers: false,
            cutPower: false,
            activatePA: false,
          },
          documentation: {
            createIncident: true,
            logActions: true,
            recordAudio: false,
            capturePhotos: true,
          },
        },
        procedures: {
          bhvInstructions:
            "1. Beoordeel situatie\n2. Verleen eerste hulp\n3. Bel 112 indien nodig\n4. Begeleid ambulance",
          publicInstructions: "Blijf kalm. EHBO hulp is onderweg.",
          specialInstructions: [
            "Verplaats patiënt NIET",
            "Houd patiënt warm",
            "Controleer ademhaling",
            "Noteer tijdstip",
          ],
        },
        attachments: {
          procedurePDF: "/procedures/ehbo-protocol.pdf",
        },
      },
      {
        id: "lone-worker-check",
        name: "Lone Worker Controle",
        type: "lone_worker",
        description: "Controle van alleen werkende medewerker",
        isActive: true,
        priority: "normal",
        triggers: {
          manual: false,
          automatic: true,
          hardware: [],
          timeBasedConditions: {
            startTime: "18:00",
            endTime: "08:00",
            daysOfWeek: [1, 2, 3, 4, 5], // Weekdays
          },
        },
        alerting: {
          channels: ["push", "sms"],
          recipients: {
            roles: ["BHV_COORDINATOR"],
            individuals: [],
            locationBased: false,
          },
          escalation: {
            enabled: true,
            delaySeconds: 900, // 15 minutes
            escalateTo: ["CUSTOMER_ADMIN"],
          },
          followUp: {
            enabled: false,
            intervals: [],
            maxFollowUps: 0,
          },
        },
        actions: {
          notifications: {
            push: true,
            sms: true,
            voice: false,
            email: false,
            desktop: false,
          },
          systemActions: {
            lockdown: false,
            unlockExits: false,
            activateSprinklers: false,
            cutPower: false,
            activatePA: false,
          },
          documentation: {
            createIncident: true,
            logActions: true,
            recordAudio: false,
            capturePhotos: false,
          },
        },
        procedures: {
          bhvInstructions: "1. Controleer laatste activiteit\n2. Probeer contact\n3. Ga naar locatie indien nodig",
          publicInstructions: "Bevestig dat u veilig bent via de app.",
        },
        attachments: {},
      },
    ]

    defaultScenarios.forEach((scenario) => {
      this.scenarios.set(scenario.id, scenario)
    })
  }

  // Execute scenario
  async executeScenario(
    scenarioId: string,
    triggeredBy: string,
    triggerType: "manual" | "automatic" | "hardware",
    location?: { building: string; floor: string; zone: string },
  ): Promise<ScenarioExecution | null> {
    const scenario = this.scenarios.get(scenarioId)
    if (!scenario || !scenario.isActive) {
      console.warn(`Scenario not found or inactive: ${scenarioId}`)
      return null
    }

    const executionId = `exec-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`

    const execution: ScenarioExecution = {
      id: executionId,
      scenarioId,
      triggeredBy,
      triggerType,
      startTime: new Date().toISOString(),
      status: "active",
      steps: this.generateExecutionSteps(scenario),
      responses: [],
      media: {
        photos: [],
        videos: [],
        audio: [],
        documents: [],
      },
      metrics: {
        responseTime: 0,
        acknowledgmentRate: 0,
        participantCount: 0,
      },
    }

    this.executions.set(executionId, execution)
    this.activeExecutions.add(executionId)

    // Execute scenario actions
    await this.performScenarioActions(scenario, execution, location)

    return execution
  }

  // Generate execution steps based on scenario
  private generateExecutionSteps(scenario: EmergencyScenario): ScenarioExecution["steps"] {
    const steps: ScenarioExecution["steps"] = []

    // Standard steps based on scenario type
    switch (scenario.type) {
      case "fire":
        steps.push(
          { stepId: "assess", name: "Situatie beoordelen", status: "pending" },
          { stepId: "alarm", name: "Brandweer alarmeren", status: "pending" },
          { stepId: "evacuate", name: "Evacuatie starten", status: "pending" },
          { stepId: "assembly", name: "Verzamelplaats controleren", status: "pending" },
          { stepId: "report", name: "Rapportage afronden", status: "pending" },
        )
        break
      case "medical":
        steps.push(
          { stepId: "assess", name: "Patiënt beoordelen", status: "pending" },
          { stepId: "firstaid", name: "Eerste hulp verlenen", status: "pending" },
          { stepId: "emergency", name: "112 bellen indien nodig", status: "pending" },
          { stepId: "monitor", name: "Patiënt monitoren", status: "pending" },
          { stepId: "handover", name: "Overdracht ambulance", status: "pending" },
        )
        break
      case "lone_worker":
        steps.push(
          { stepId: "check", name: "Laatste activiteit controleren", status: "pending" },
          { stepId: "contact", name: "Contact proberen", status: "pending" },
          { stepId: "locate", name: "Locatie bezoeken", status: "pending" },
          { stepId: "report", name: "Status rapporteren", status: "pending" },
        )
        break
      default:
        steps.push(
          { stepId: "assess", name: "Situatie beoordelen", status: "pending" },
          { stepId: "respond", name: "Actie ondernemen", status: "pending" },
          { stepId: "report", name: "Rapportage", status: "pending" },
        )
    }

    return steps
  }

  // Perform scenario actions
  private async performScenarioActions(
    scenario: EmergencyScenario,
    execution: ScenarioExecution,
    location?: { building: string; floor: string; zone: string },
  ): Promise<void> {
    // Create incident if configured
    if (scenario.actions.documentation.createIncident) {
      await this.createIncident(scenario, execution, location)
    }

    // Send notifications
    await this.sendScenarioNotifications(scenario, execution, location)

    // Execute system actions
    await this.executeSystemActions(scenario, execution)

    // Set up follow-up alerts
    if (scenario.alerting.followUp.enabled) {
      this.scheduleFollowUpAlerts(scenario, execution)
    }

    // Set up escalation
    if (scenario.alerting.escalation.enabled) {
      this.scheduleEscalation(scenario, execution)
    }
  }

  // Create incident for scenario
  private async createIncident(
    scenario: EmergencyScenario,
    execution: ScenarioExecution,
    location?: { building: string; floor: string; zone: string },
  ): Promise<void> {
    const incident = {
      title: `${scenario.name} - ${execution.id}`,
      type: scenario.type,
      priority: scenario.priority,
      location: location ? `${location.building} - ${location.floor} - ${location.zone}` : "Onbekend",
      reportedBy: execution.triggeredBy,
      description: `Automatisch incident aangemaakt voor scenario: ${scenario.name}`,
      scenarioId: scenario.id,
      executionId: execution.id,
    }

    await fetch("/api/incidents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(incident),
    })
  }

  // Send scenario notifications
  private async sendScenarioNotifications(
    scenario: EmergencyScenario,
    execution: ScenarioExecution,
    location?: { building: string; floor: string; zone: string },
  ): Promise<void> {
    const message = {
      id: `scenario-alert-${execution.id}`,
      title: `🚨 ${scenario.name.toUpperCase()}`,
      body: scenario.procedures.bhvInstructions,
      priority: scenario.priority,
      scenario: scenario.id,
      location: location,
      timestamp: execution.startTime,
      metadata: {
        scenarioId: scenario.id,
        executionId: execution.id,
        procedures: scenario.procedures,
        attachments: scenario.attachments,
      },
    }

    // Get recipients based on scenario configuration
    const recipients = await this.getScenarioRecipients(scenario, location)

    await fetch("/api/alerts/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        recipients: recipients.map((r) => r.id),
        channels: scenario.alerting.channels,
      }),
    })
  }

  // Get recipients for scenario
  private async getScenarioRecipients(
    scenario: EmergencyScenario,
    location?: { building: string; floor: string; zone: string },
  ): Promise<any[]> {
    // This would query the user database based on roles and location
    // For now, return mock data
    return [
      { id: "user-1", name: "BHV Coördinator", role: "BHV_COORDINATOR" },
      { id: "user-2", name: "BHV Lid 1", role: "BHV_MEMBER" },
      { id: "user-3", name: "EHBO'er", role: "EHBO_MEMBER" },
    ]
  }

  // Execute system actions
  private async executeSystemActions(scenario: EmergencyScenario, execution: ScenarioExecution): Promise<void> {
    const actions = scenario.actions.systemActions

    if (actions.unlockExits) {
      await this.unlockEmergencyExits()
    }

    if (actions.activatePA) {
      await this.activatePublicAddress(scenario.procedures.publicInstructions)
    }

    if (actions.lockdown) {
      await this.activateLockdown()
    }

    // Log system actions
    console.log(`System actions executed for scenario ${scenario.id}:`, actions)
  }

  // System action implementations
  private async unlockEmergencyExits(): Promise<void> {
    console.log("Unlocking emergency exits...")
    // Implementation for door control system
  }

  private async activatePublicAddress(message: string): Promise<void> {
    console.log("Activating public address system:", message)
    // Implementation for PA system
  }

  private async activateLockdown(): Promise<void> {
    console.log("Activating security lockdown...")
    // Implementation for security system
  }

  // Schedule follow-up alerts
  private scheduleFollowUpAlerts(scenario: EmergencyScenario, execution: ScenarioExecution): void {
    scenario.alerting.followUp.intervals.forEach((interval, index) => {
      if (index < scenario.alerting.followUp.maxFollowUps) {
        setTimeout(async () => {
          if (this.activeExecutions.has(execution.id)) {
            await this.sendFollowUpAlert(scenario, execution, index + 1)
          }
        }, interval * 1000)
      }
    })
  }

  // Send follow-up alert
  private async sendFollowUpAlert(
    scenario: EmergencyScenario,
    execution: ScenarioExecution,
    followUpNumber: number,
  ): Promise<void> {
    const message = {
      id: `followup-${execution.id}-${followUpNumber}`,
      title: `📢 FOLLOW-UP ${followUpNumber}: ${scenario.name}`,
      body: `Status update vereist voor ${scenario.name}. Bevestig uw status via de app.`,
      priority: scenario.priority,
      scenario: scenario.id,
      timestamp: new Date().toISOString(),
      metadata: {
        isFollowUp: true,
        followUpNumber,
        originalExecutionId: execution.id,
      },
    }

    await fetch("/api/alerts/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        recipients: scenario.alerting.recipients.individuals,
        channels: ["push", "sms"],
      }),
    })
  }

  // Schedule escalation
  private scheduleEscalation(scenario: EmergencyScenario, execution: ScenarioExecution): void {
    setTimeout(async () => {
      if (this.activeExecutions.has(execution.id)) {
        await this.escalateScenario(scenario, execution)
      }
    }, scenario.alerting.escalation.delaySeconds * 1000)
  }

  // Escalate scenario
  private async escalateScenario(scenario: EmergencyScenario, execution: ScenarioExecution): Promise<void> {
    const message = {
      id: `escalation-${execution.id}`,
      title: `🔺 ESCALATION: ${scenario.name}`,
      body: `Scenario ${scenario.name} vereist escalatie. Geen adequate respons ontvangen.`,
      priority: "critical" as const,
      scenario: scenario.id,
      timestamp: new Date().toISOString(),
      metadata: {
        isEscalation: true,
        originalExecutionId: execution.id,
        escalatedTo: scenario.alerting.escalation.escalateTo,
      },
    }

    await fetch("/api/alerts/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        recipients: scenario.alerting.escalation.escalateTo,
        channels: ["push", "sms", "voice", "email"],
      }),
    })
  }

  // Complete scenario execution
  async completeScenario(executionId: string, completedBy: string): Promise<void> {
    const execution = this.executions.get(executionId)
    if (!execution) return

    execution.status = "completed"
    execution.endTime = new Date().toISOString()

    // Calculate metrics
    const startTime = new Date(execution.startTime).getTime()
    const endTime = new Date().getTime()
    execution.metrics.completionTime = Math.round((endTime - startTime) / 1000)

    this.activeExecutions.delete(executionId)

    // Log completion
    console.log(`Scenario execution completed: ${executionId} by ${completedBy}`)
  }

  // Get scenario by ID
  getScenario(scenarioId: string): EmergencyScenario | undefined {
    return this.scenarios.get(scenarioId)
  }

  // Get all scenarios
  getAllScenarios(): EmergencyScenario[] {
    return Array.from(this.scenarios.values())
  }

  // Get active executions
  getActiveExecutions(): ScenarioExecution[] {
    return Array.from(this.activeExecutions)
      .map((id) => this.executions.get(id)!)
      .filter(Boolean)
  }

  // Get execution by ID
  getExecution(executionId: string): ScenarioExecution | undefined {
    return this.executions.get(executionId)
  }
}
