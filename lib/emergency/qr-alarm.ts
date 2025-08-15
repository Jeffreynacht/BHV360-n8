export interface QRAlarmCode {
  id: string
  code: string
  location: {
    building: string
    floor: string
    zone: string
    coordinates: { x: number; y: number }
  }
  emergencyType: "fire" | "medical" | "evacuation" | "security" | "general"
  isActive: boolean
  createdAt: string
  lastScanned?: string
  scanCount: number
}

export interface QRAlarmScan {
  id: string
  qrCodeId: string
  scannedBy: {
    type: "visitor" | "employee" | "bhv" | "external"
    name: string
    phone?: string
    location?: string
  }
  timestamp: string
  location: {
    building: string
    floor: string
    zone: string
    coordinates: { x: number; y: number }
  }
  emergencyType: string
  description?: string
  photos?: string[]
  status: "pending" | "acknowledged" | "responding" | "resolved"
}

export class QRAlarmService {
  private alarmCodes: QRAlarmCode[] = []
  private alarmScans: QRAlarmScan[] = []

  // Generate QR alarm codes for locations
  generateQRAlarmCode(location: QRAlarmCode["location"], emergencyType: QRAlarmCode["emergencyType"]): QRAlarmCode {
    const code = `ALARM-${emergencyType.toUpperCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`

    const qrCode: QRAlarmCode = {
      id: `qr-${Date.now()}`,
      code,
      location,
      emergencyType,
      isActive: true,
      createdAt: new Date().toISOString(),
      scanCount: 0,
    }

    this.alarmCodes.push(qrCode)
    return qrCode
  }

  // Process QR alarm scan
  async processQRAlarmScan(
    qrCode: string,
    scannerInfo: QRAlarmScan["scannedBy"],
    description?: string,
    photos?: string[],
  ): Promise<QRAlarmScan | null> {
    const alarmCode = this.alarmCodes.find((code) => code.code === qrCode && code.isActive)

    if (!alarmCode) {
      throw new Error("Invalid or inactive QR alarm code")
    }

    const alarmScan: QRAlarmScan = {
      id: `scan-${Date.now()}`,
      qrCodeId: alarmCode.id,
      scannedBy: scannerInfo,
      timestamp: new Date().toISOString(),
      location: alarmCode.location,
      emergencyType: alarmCode.emergencyType,
      description,
      photos,
      status: "pending",
    }

    // Update scan count
    alarmCode.scanCount++
    alarmCode.lastScanned = alarmScan.timestamp

    // Store scan
    this.alarmScans.push(alarmScan)

    // Trigger emergency response
    await this.triggerEmergencyResponse(alarmScan)

    return alarmScan
  }

  private async triggerEmergencyResponse(scan: QRAlarmScan): Promise<void> {
    // Send immediate notifications to BHV team
    await this.notifyBHVTeam(scan)

    // Create incident in system
    await this.createIncident(scan)

    // Send location-specific alerts
    await this.sendLocationAlerts(scan)

    // If visitor scanned, provide immediate guidance
    if (scan.scannedBy.type === "visitor") {
      await this.sendVisitorGuidance(scan)
    }
  }

  private async notifyBHVTeam(scan: QRAlarmScan): Promise<void> {
    const message = {
      title: `🚨 QR ALARM: ${scan.emergencyType.toUpperCase()}`,
      body: `Alarm gescand door ${scan.scannedBy.name} in ${scan.location.building} - ${scan.location.floor} - ${scan.location.zone}`,
      data: {
        scanId: scan.id,
        location: scan.location,
        emergencyType: scan.emergencyType,
        timestamp: scan.timestamp,
      },
    }

    // Send push notifications to all available BHV members
    await fetch("/api/emergency/notify-bhv", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    })
  }

  private async createIncident(scan: QRAlarmScan): Promise<void> {
    const incident = {
      title: `QR Alarm: ${scan.emergencyType}`,
      type: scan.emergencyType,
      priority: "high",
      location: `${scan.location.building} - ${scan.location.floor} - ${scan.location.zone}`,
      reportedBy: scan.scannedBy.name,
      description: scan.description || `QR alarm gescand door ${scan.scannedBy.type}`,
      source: "qr-alarm",
      qrScanId: scan.id,
    }

    await fetch("/api/incidents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(incident),
    })
  }

  private async sendLocationAlerts(scan: QRAlarmScan): Promise<void> {
    // Send targeted alerts to people in the same area
    const locationFilter = {
      building: scan.location.building,
      floor: scan.location.floor,
      radius: 100, // meters
    }

    await fetch("/api/emergency/location-alert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filter: locationFilter,
        message: `Noodsituatie gemeld in uw gebied: ${scan.emergencyType}. Volg instructies van BHV'ers.`,
        emergencyType: scan.emergencyType,
      }),
    })
  }

  private async sendVisitorGuidance(scan: QRAlarmScan): Promise<void> {
    const guidance = this.getEmergencyGuidance(scan.emergencyType)

    // If visitor provided phone number, send SMS
    if (scan.scannedBy.phone) {
      await fetch("/api/emergency/send-sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: scan.scannedBy.phone,
          message: `BHV360: Uw alarm is ontvangen. ${guidance.immediate}. BHV'ers zijn onderweg.`,
        }),
      })
    }
  }

  private getEmergencyGuidance(emergencyType: string): { immediate: string; detailed: string } {
    const guidance = {
      fire: {
        immediate: "Verlaat het gebouw via de dichtstbijzijnde nooduitgang",
        detailed:
          "1. Blijf laag bij rook\n2. Voel deuren voordat u opent\n3. Ga naar verzamelplaats\n4. Wacht op instructies",
      },
      medical: {
        immediate: "Blijf bij de patiënt en wacht op EHBO hulp",
        detailed:
          "1. Verplaats patiënt niet\n2. Houd patiënt warm\n3. Praat geruststellend\n4. Volg instructies EHBO'er",
      },
      evacuation: {
        immediate: "Verlaat onmiddellijk het gebouw",
        detailed:
          "1. Gebruik dichtstbijzijnde uitgang\n2. Help anderen indien mogelijk\n3. Ga naar verzamelplaats\n4. Meld u bij BHV'er",
      },
      security: {
        immediate: "Zoek veilige plek en wacht op instructies",
        detailed: "1. Ga naar veilige ruimte\n2. Vergrendel deuren\n3. Blijf stil\n4. Wacht op beveiliging",
      },
      general: {
        immediate: "Blijf kalm en wacht op instructies",
        detailed:
          "1. Blijf op huidige locatie\n2. Volg instructies BHV'ers\n3. Help anderen indien nodig\n4. Wacht op verdere informatie",
      },
    }

    return guidance[emergencyType as keyof typeof guidance] || guidance.general
  }

  // Generate QR codes for different locations and emergency types
  generateLocationQRCodes(building: string, floor: string): QRAlarmCode[] {
    const zones = ["Noord", "Oost", "Zuid", "West", "Centrum"]
    const emergencyTypes: QRAlarmCode["emergencyType"][] = ["fire", "medical", "evacuation", "security"]
    const codes: QRAlarmCode[] = []

    zones.forEach((zone, zoneIndex) => {
      emergencyTypes.forEach((emergencyType) => {
        const location = {
          building,
          floor,
          zone,
          coordinates: { x: zoneIndex * 20, y: zoneIndex * 20 },
        }

        codes.push(this.generateQRAlarmCode(location, emergencyType))
      })
    })

    return codes
  }
}
