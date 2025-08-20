export interface HardwareTrigger {
  id: string
  type: "panic_button" | "nfc_tag" | "bmc_espa" | "fire_alarm" | "smoke_detector" | "manual_call_point"
  name: string
  location: {
    building: string
    floor: string
    zone: string
    coordinates: { x: number; y: number }
  }
  deviceId: string
  isActive: boolean
  batteryLevel?: number
  lastSeen: string
  triggerAction: {
    scenario: string
    priority: "low" | "normal" | "high" | "critical" | "emergency"
    autoEscalate: boolean
    recipients: string[]
  }
}

export interface TriggerEvent {
  id: string
  triggerId: string
  timestamp: string
  triggerType: string
  location: HardwareTrigger["location"]
  metadata: Record<string, any>
  processed: boolean
  responseTime?: number
}

export class HardwareTriggerService {
  private triggers: Map<string, HardwareTrigger> = new Map()
  private events: TriggerEvent[] = []

  // Register hardware trigger
  registerTrigger(trigger: HardwareTrigger): void {
    this.triggers.set(trigger.id, trigger)
    console.log(`Hardware trigger registered: ${trigger.name} (${trigger.type})`)
  }

  // Process incoming trigger signal
  async processTriggerSignal(deviceId: string, signalData: any): Promise<TriggerEvent | null> {
    const trigger = Array.from(this.triggers.values()).find((t) => t.deviceId === deviceId)

    if (!trigger || !trigger.isActive) {
      console.warn(`Unknown or inactive trigger device: ${deviceId}`)
      return null
    }

    const event: TriggerEvent = {
      id: `trigger-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      triggerId: trigger.id,
      timestamp: new Date().toISOString(),
      triggerType: trigger.type,
      location: trigger.location,
      metadata: signalData,
      processed: false,
    }

    this.events.push(event)

    // Process the trigger action
    await this.executeTriggerAction(trigger, event)

    event.processed = true
    return event
  }

  // Execute trigger action
  private async executeTriggerAction(trigger: HardwareTrigger, event: TriggerEvent): Promise<void> {
    const alertMessage = {
      id: `alert-${event.id}`,
      title: this.getTriggerAlertTitle(trigger),
      body: this.getTriggerAlertBody(trigger, event),
      priority: trigger.triggerAction.priority,
      scenario: trigger.triggerAction.scenario,
      location: trigger.location,
      timestamp: event.timestamp,
      metadata: {
        triggerId: trigger.id,
        triggerType: trigger.type,
        deviceId: trigger.deviceId,
        eventId: event.id,
      },
    }

    // Send alert via multi-channel system
    await fetch("/api/alerts/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: alertMessage,
        recipients: trigger.triggerAction.recipients,
      }),
    })

    // Log trigger event
    await this.logTriggerEvent(trigger, event)
  }

  // Get alert title based on trigger type
  private getTriggerAlertTitle(trigger: HardwareTrigger): string {
    switch (trigger.type) {
      case "panic_button":
        return "🚨 NOODKNOP GEACTIVEERD"
      case "nfc_tag":
        return "📱 NFC ALARM GESCAND"
      case "bmc_espa":
        return "🔥 BRANDMELDCENTRALE ALARM"
      case "fire_alarm":
        return "🔥 BRANDALARM GEACTIVEERD"
      case "smoke_detector":
        return "💨 ROOKDETECTIE ALARM"
      case "manual_call_point":
        return "🚨 HANDMELDER GEACTIVEERD"
      default:
        return "⚠️ HARDWARE ALARM"
    }
  }

  // Get alert body with location details
  private getTriggerAlertBody(trigger: HardwareTrigger, event: TriggerEvent): string {
    const location = `${trigger.location.building} - ${trigger.location.floor} - ${trigger.location.zone}`
    const time = new Date(event.timestamp).toLocaleString("nl-NL")

    return `Hardware trigger geactiveerd op ${location} om ${time}. Onmiddellijke respons vereist.`
  }

  // NFC tag scanning
  async processNFCTrigger(nfcTagId: string, scannedBy: string): Promise<TriggerEvent | null> {
    const trigger = Array.from(this.triggers.values()).find((t) => t.type === "nfc_tag" && t.deviceId === nfcTagId)

    if (!trigger) {
      console.warn(`Unknown NFC tag: ${nfcTagId}`)
      return null
    }

    return await this.processTriggerSignal(nfcTagId, {
      scannedBy,
      scanMethod: "nfc",
      userAgent: navigator.userAgent,
    })
  }

  // BMC/ESPA integration
  async processBMCTrigger(bmcData: {
    alarmType: string
    zone: string
    priority: number
    deviceId: string
  }): Promise<TriggerEvent | null> {
    const trigger = Array.from(this.triggers.values()).find(
      (t) => t.type === "bmc_espa" && t.deviceId === bmcData.deviceId,
    )

    if (!trigger) {
      console.warn(`Unknown BMC device: ${bmcData.deviceId}`)
      return null
    }

    return await this.processTriggerSignal(bmcData.deviceId, {
      alarmType: bmcData.alarmType,
      zone: bmcData.zone,
      priority: bmcData.priority,
      source: "bmc",
    })
  }

  // Panic button press
  async processPanicButton(buttonId: string, pressedBy?: string): Promise<TriggerEvent | null> {
    const trigger = Array.from(this.triggers.values()).find((t) => t.type === "panic_button" && t.deviceId === buttonId)

    if (!trigger) {
      console.warn(`Unknown panic button: ${buttonId}`)
      return null
    }

    return await this.processTriggerSignal(buttonId, {
      pressedBy,
      pressType: "emergency",
      source: "panic_button",
    })
  }

  // Log trigger event
  private async logTriggerEvent(trigger: HardwareTrigger, event: TriggerEvent): Promise<void> {
    await fetch("/api/triggers/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        triggerId: trigger.id,
        eventId: event.id,
        triggerType: trigger.type,
        location: trigger.location,
        timestamp: event.timestamp,
        metadata: event.metadata,
      }),
    })
  }

  // Get trigger statistics
  getTriggerStats(timeframe: "day" | "week" | "month" = "day"): {
    totalTriggers: number
    byType: Record<string, number>
    byLocation: Record<string, number>
    averageResponseTime: number
  } {
    const now = new Date()
    const cutoff = new Date()

    switch (timeframe) {
      case "day":
        cutoff.setDate(now.getDate() - 1)
        break
      case "week":
        cutoff.setDate(now.getDate() - 7)
        break
      case "month":
        cutoff.setMonth(now.getMonth() - 1)
        break
    }

    const recentEvents = this.events.filter((e) => new Date(e.timestamp) >= cutoff)

    const byType: Record<string, number> = {}
    const byLocation: Record<string, number> = {}
    let totalResponseTime = 0
    let responseCount = 0

    recentEvents.forEach((event) => {
      byType[event.triggerType] = (byType[event.triggerType] || 0) + 1

      const locationKey = `${event.location.building}-${event.location.floor}`
      byLocation[locationKey] = (byLocation[locationKey] || 0) + 1

      if (event.responseTime) {
        totalResponseTime += event.responseTime
        responseCount++
      }
    })

    return {
      totalTriggers: recentEvents.length,
      byType,
      byLocation,
      averageResponseTime: responseCount > 0 ? totalResponseTime / responseCount : 0,
    }
  }

  // Test trigger (for maintenance)
  async testTrigger(triggerId: string): Promise<boolean> {
    const trigger = this.triggers.get(triggerId)
    if (!trigger) return false

    const testEvent: TriggerEvent = {
      id: `test-${Date.now()}`,
      triggerId,
      timestamp: new Date().toISOString(),
      triggerType: trigger.type,
      location: trigger.location,
      metadata: { test: true },
      processed: false,
    }

    // Send test alert with lower priority
    const testAlert = {
      id: `test-alert-${testEvent.id}`,
      title: `🧪 TEST: ${this.getTriggerAlertTitle(trigger)}`,
      body: `Dit is een test van de hardware trigger: ${trigger.name}`,
      priority: "low" as const,
      scenario: "test",
      location: trigger.location,
      timestamp: testEvent.timestamp,
      metadata: { ...testEvent.metadata, test: true },
    }

    await fetch("/api/alerts/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: testAlert,
        recipients: trigger.triggerAction.recipients,
      }),
    })

    testEvent.processed = true
    this.events.push(testEvent)

    return true
  }
}
