export interface ESPAMessage {
  id: string
  timestamp: string
  priority: 1 | 2 | 3 | 4 // ESPA priority levels
  address: string // Receiver address
  message: string
  messageType: "alarm" | "test" | "status" | "acknowledge"
  source: string
  acknowledged: boolean
  acknowledgedBy?: string
  acknowledgedAt?: string
}

export interface ESPADevice {
  id: string
  name: string
  address: string
  type: "pager" | "display" | "printer" | "mobile"
  isActive: boolean
  batteryLevel?: number
  signalStrength?: number
  lastSeen: string
}

export interface ESPAIntegration {
  isConnected: boolean
  serverAddress: string
  port: number
  protocol: "tcp" | "udp"
  lastHeartbeat: string
  messageQueue: ESPAMessage[]
  devices: ESPADevice[]
}

export class ESPA444Service {
  private integration: ESPAIntegration
  private messageQueue: ESPAMessage[] = []
  private devices: ESPADevice[] = []
  private isConnected = false

  constructor() {
    this.integration = {
      isConnected: false,
      serverAddress: process.env.ESPA_SERVER_ADDRESS || "192.168.1.100",
      port: Number.parseInt(process.env.ESPA_SERVER_PORT || "8080"),
      protocol: "tcp",
      lastHeartbeat: "",
      messageQueue: [],
      devices: [],
    }
  }

  // Connect to ESPA 4.4.4 server
  async connect(): Promise<boolean> {
    try {
      // In real implementation, establish TCP/UDP connection
      console.log(`Connecting to ESPA server at ${this.integration.serverAddress}:${this.integration.port}`)

      // Mock connection
      this.isConnected = true
      this.integration.isConnected = true
      this.integration.lastHeartbeat = new Date().toISOString()

      // Start heartbeat
      this.startHeartbeat()

      // Load devices
      await this.loadDevices()

      return true
    } catch (error) {
      console.error("ESPA connection failed:", error)
      return false
    }
  }

  // Send emergency message via ESPA
  async sendEmergencyMessage(
    message: string,
    priority: ESPAMessage["priority"],
    targetDevices: string[] = [],
    emergencyType = "general",
  ): Promise<ESPAMessage[]> {
    if (!this.isConnected) {
      throw new Error("ESPA server not connected")
    }

    const devices =
      targetDevices.length > 0
        ? this.devices.filter((d) => targetDevices.includes(d.id))
        : this.devices.filter((d) => d.isActive)

    const messages: ESPAMessage[] = []

    for (const device of devices) {
      const espaMessage: ESPAMessage = {
        id: `espa-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        timestamp: new Date().toISOString(),
        priority,
        address: device.address,
        message: this.formatESPAMessage(message, emergencyType, priority),
        messageType: "alarm",
        source: "BHV360",
        acknowledged: false,
      }

      // Send to ESPA server
      await this.transmitMessage(espaMessage)
      messages.push(espaMessage)
    }

    return messages
  }

  // Format message according to ESPA 4.4.4 standard
  private formatESPAMessage(message: string, emergencyType: string, priority: number): string {
    const timestamp = new Date().toLocaleString("nl-NL")
    const priorityText = this.getPriorityText(priority)

    return `${priorityText} ${timestamp}\n${emergencyType.toUpperCase()}\n${message}\nBHV360`
  }

  private getPriorityText(priority: number): string {
    switch (priority) {
      case 1:
        return "🔴 KRITIEK"
      case 2:
        return "🟠 HOOG"
      case 3:
        return "🟡 NORMAAL"
      case 4:
        return "🔵 LAAG"
      default:
        return "⚪ INFO"
    }
  }

  // Transmit message to ESPA server
  private async transmitMessage(message: ESPAMessage): Promise<void> {
    try {
      // In real implementation, send via TCP/UDP to ESPA server
      console.log("Transmitting ESPA message:", message)

      // Add to queue for tracking
      this.messageQueue.push(message)

      // Mock transmission delay
      await new Promise((resolve) => setTimeout(resolve, 100))

      // Log transmission
      await this.logESPATransmission(message)
    } catch (error) {
      console.error("ESPA transmission failed:", error)
      throw error
    }
  }

  // Handle ESPA acknowledgments
  async handleAcknowledgment(messageId: string, acknowledgedBy: string): Promise<void> {
    const message = this.messageQueue.find((m) => m.id === messageId)
    if (message) {
      message.acknowledged = true
      message.acknowledgedBy = acknowledgedBy
      message.acknowledgedAt = new Date().toISOString()

      // Notify BHV system of acknowledgment
      await this.notifyAcknowledgment(message)
    }
  }

  // Send scenario-based alerts with filtered recipients
  async sendScenarioAlert(scenario: {
    type: string
    location: { building: string; floor: string; zone?: string }
    priority: ESPAMessage["priority"]
    message: string
    targetRoles: string[]
    targetLocations: string[]
  }): Promise<ESPAMessage[]> {
    // Filter devices based on scenario criteria
    const targetDevices = this.devices.filter((device) => {
      // Filter by role (would need device-role mapping)
      // Filter by location (would need device-location mapping)
      // For now, simplified filtering
      return device.isActive
    })

    const deviceIds = targetDevices.map((d) => d.id)

    return await this.sendEmergencyMessage(scenario.message, scenario.priority, deviceIds, scenario.type)
  }

  // Load and manage ESPA devices
  private async loadDevices(): Promise<void> {
    // In real implementation, query ESPA server for connected devices
    this.devices = [
      {
        id: "pager-001",
        name: "BHV Coördinator",
        address: "001",
        type: "pager",
        isActive: true,
        batteryLevel: 85,
        signalStrength: 95,
        lastSeen: new Date().toISOString(),
      },
      {
        id: "pager-002",
        name: "Ploegleider Noord",
        address: "002",
        type: "pager",
        isActive: true,
        batteryLevel: 72,
        signalStrength: 88,
        lastSeen: new Date().toISOString(),
      },
      {
        id: "display-001",
        name: "Centrale Display",
        address: "100",
        type: "display",
        isActive: true,
        lastSeen: new Date().toISOString(),
      },
    ]
  }

  private startHeartbeat(): void {
    setInterval(() => {
      if (this.isConnected) {
        this.integration.lastHeartbeat = new Date().toISOString()
        // Send heartbeat to ESPA server
        this.sendHeartbeat()
      }
    }, 30000) // Every 30 seconds
  }

  private async sendHeartbeat(): Promise<void> {
    try {
      // Send heartbeat message to ESPA server
      console.log("Sending ESPA heartbeat")
    } catch (error) {
      console.error("ESPA heartbeat failed:", error)
      this.isConnected = false
      this.integration.isConnected = false
    }
  }

  private async logESPATransmission(message: ESPAMessage): Promise<void> {
    await fetch("/api/espa/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messageId: message.id,
        timestamp: message.timestamp,
        address: message.address,
        message: message.message,
        priority: message.priority,
        status: "transmitted",
      }),
    })
  }

  private async notifyAcknowledgment(message: ESPAMessage): Promise<void> {
    await fetch("/api/espa/acknowledgment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messageId: message.id,
        acknowledgedBy: message.acknowledgedBy,
        acknowledgedAt: message.acknowledgedAt,
      }),
    })
  }

  // Get ESPA status and statistics
  getStatus(): ESPAIntegration {
    return {
      ...this.integration,
      messageQueue: this.messageQueue,
      devices: this.devices,
    }
  }

  // Test ESPA connection
  async testConnection(): Promise<boolean> {
    try {
      await this.sendEmergencyMessage(
        "Test bericht van BHV360 systeem",
        4, // Low priority
        [],
        "test",
      )
      return true
    } catch (error) {
      console.error("ESPA test failed:", error)
      return false
    }
  }
}
