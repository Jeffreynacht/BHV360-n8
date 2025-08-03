export interface LocationBeacon {
  id: string
  name: string
  macAddress: string
  location: {
    building: string
    floor: string
    zone: string
    coordinates: { x: number; y: number }
  }
  range: number // meters
  isActive: boolean
  batteryLevel?: number
  lastSeen: string
}

export interface WiFiAccessPoint {
  id: string
  ssid: string
  bssid: string
  location: {
    building: string
    floor: string
    zone: string
    coordinates: { x: number; y: number }
  }
  signalStrength: number
  isActive: boolean
}

export interface LocationCheckIn {
  userId: string
  userName: string
  location: {
    building: string
    floor: string
    zone: string
    coordinates: { x: number; y: number }
  }
  detectionMethod: "wifi" | "beacon" | "gps" | "manual"
  timestamp: string
  confidence: number // 0-100%
  deviceInfo: {
    deviceId: string
    deviceType: string
    appVersion: string
  }
}

export class AutoCheckInService {
  private beacons: LocationBeacon[] = []
  private wifiAPs: WiFiAccessPoint[] = []
  private userLocations: Map<string, LocationCheckIn> = new Map()

  // WiFi-based location detection
  async detectLocationByWiFi(
    wifiNetworks: { ssid: string; bssid: string; signalStrength: number }[],
  ): Promise<LocationCheckIn | null> {
    const matchedAPs = wifiNetworks
      .map((network) => {
        const ap = this.wifiAPs.find((ap) => ap.bssid === network.bssid)
        return ap ? { ...ap, detectedSignal: network.signalStrength } : null
      })
      .filter(Boolean)

    if (matchedAPs.length === 0) return null

    // Trilateration based on signal strength
    const location = this.calculateLocationFromSignals(matchedAPs)

    return {
      userId: "current-user", // Would come from auth context
      userName: "Current User",
      location,
      detectionMethod: "wifi",
      timestamp: new Date().toISOString(),
      confidence: this.calculateConfidence(matchedAPs),
      deviceInfo: {
        deviceId: await this.getDeviceId(),
        deviceType: this.getDeviceType(),
        appVersion: "1.0.0",
      },
    }
  }

  // Beacon-based location detection
  async detectLocationByBeacon(
    beaconSignals: { macAddress: string; rssi: number; distance: number }[],
  ): Promise<LocationCheckIn | null> {
    const matchedBeacons = beaconSignals
      .map((signal) => {
        const beacon = this.beacons.find((b) => b.macAddress === signal.macAddress)
        return beacon ? { ...beacon, rssi: signal.rssi, distance: signal.distance } : null
      })
      .filter(Boolean)

    if (matchedBeacons.length === 0) return null

    const location = this.calculateLocationFromBeacons(matchedBeacons)

    return {
      userId: "current-user",
      userName: "Current User",
      location,
      detectionMethod: "beacon",
      timestamp: new Date().toISOString(),
      confidence: this.calculateBeaconConfidence(matchedBeacons),
      deviceInfo: {
        deviceId: await this.getDeviceId(),
        deviceType: this.getDeviceType(),
        appVersion: "1.0.0",
      },
    }
  }

  // Calculate location using trilateration
  private calculateLocationFromSignals(aps: any[]): LocationCheckIn["location"] {
    if (aps.length === 1) {
      return aps[0].location
    }

    // Weighted average based on signal strength
    let totalWeight = 0
    let weightedX = 0
    let weightedY = 0
    const building = aps[0].location.building
    const floor = aps[0].location.floor

    aps.forEach((ap) => {
      const weight = Math.pow(10, ap.detectedSignal / 20) // Convert dBm to linear scale
      totalWeight += weight
      weightedX += ap.location.coordinates.x * weight
      weightedY += ap.location.coordinates.y * weight
    })

    return {
      building,
      floor,
      zone: this.determineZone(building, floor, weightedX / totalWeight, weightedY / totalWeight),
      coordinates: {
        x: Math.round(weightedX / totalWeight),
        y: Math.round(weightedY / totalWeight),
      },
    }
  }

  private calculateLocationFromBeacons(beacons: any[]): LocationCheckIn["location"] {
    // Similar trilateration for beacons
    if (beacons.length === 1) {
      return beacons[0].location
    }

    let totalWeight = 0
    let weightedX = 0
    let weightedY = 0

    beacons.forEach((beacon) => {
      const weight = 1 / Math.max(beacon.distance, 0.1) // Closer beacons have more weight
      totalWeight += weight
      weightedX += beacon.location.coordinates.x * weight
      weightedY += beacon.location.coordinates.y * weight
    })

    return {
      building: beacons[0].location.building,
      floor: beacons[0].location.floor,
      zone: this.determineZone(
        beacons[0].location.building,
        beacons[0].location.floor,
        weightedX / totalWeight,
        weightedY / totalWeight,
      ),
      coordinates: {
        x: Math.round(weightedX / totalWeight),
        y: Math.round(weightedY / totalWeight),
      },
    }
  }

  private calculateConfidence(aps: any[]): number {
    if (aps.length === 0) return 0
    if (aps.length === 1) return 60
    if (aps.length === 2) return 75
    return Math.min(90, 60 + aps.length * 10)
  }

  private calculateBeaconConfidence(beacons: any[]): number {
    if (beacons.length === 0) return 0

    const avgDistance = beacons.reduce((sum, b) => sum + b.distance, 0) / beacons.length
    const baseConfidence = Math.max(50, 100 - avgDistance * 10)

    return Math.min(95, baseConfidence + beacons.length * 5)
  }

  private determineZone(building: string, floor: string, x: number, y: number): string {
    // Zone determination logic based on coordinates
    // This would be customizable per building layout
    if (x < 50 && y < 50) return "Noord-West"
    if (x >= 50 && y < 50) return "Noord-Oost"
    if (x < 50 && y >= 50) return "Zuid-West"
    return "Zuid-Oost"
  }

  private async getDeviceId(): Promise<string> {
    // Generate or retrieve persistent device ID
    let deviceId = localStorage.getItem("bhv360-device-id")
    if (!deviceId) {
      deviceId = "device-" + Math.random().toString(36).substr(2, 9)
      localStorage.setItem("bhv360-device-id", deviceId)
    }
    return deviceId
  }

  private getDeviceType(): string {
    const userAgent = navigator.userAgent
    if (/Android/i.test(userAgent)) return "Android"
    if (/iPhone|iPad|iPod/i.test(userAgent)) return "iOS"
    return "Web"
  }

  // Auto check-in when location is detected
  async performAutoCheckIn(location: LocationCheckIn): Promise<boolean> {
    try {
      // Store location
      this.userLocations.set(location.userId, location)

      // Send to server
      await fetch("/api/location/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(location),
      })

      // Trigger location-based notifications if needed
      await this.checkLocationBasedAlerts(location)

      return true
    } catch (error) {
      console.error("Auto check-in failed:", error)
      return false
    }
  }

  private async checkLocationBasedAlerts(location: LocationCheckIn): Promise<void> {
    // Check if user entered a restricted area
    // Check if user needs safety briefing for this location
    // Check if there are active incidents in this area
    // etc.
  }
}
