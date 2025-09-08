export interface NotificationAction {
  action: string
  title: string
  icon?: string
  url?: string
}

export interface NotificationData {
  title: string
  body: string
  icon?: string
  badge?: string
  image?: string
  tag?: string
  requireInteraction?: boolean
  silent?: boolean
  timestamp?: number
  actions?: NotificationAction[]
  data?: {
    url?: string
    type?: "emergency" | "evacuation" | "drill" | "info"
    priority?: "low" | "normal" | "high" | "critical"
    incidentId?: string
    locationId?: string
    userId?: string
  }
}

export interface EmergencyNotificationData extends NotificationData {
  data: {
    type: "emergency"
    priority: "critical"
    incidentId: string
    locationId: string
    emergencyType: "fire" | "medical" | "security" | "evacuation" | "other"
    instructions?: string
    contactInfo?: string
  }
}

export interface EvacuationNotificationData extends NotificationData {
  data: {
    type: "evacuation"
    priority: "critical"
    incidentId: string
    locationId: string
    evacuationZone: string
    assemblyPoint: string
    estimatedTime?: number
    instructions: string
  }
}

export interface DrillNotificationData extends NotificationData {
  data: {
    type: "drill"
    priority: "normal"
    drillId: string
    drillType: "fire" | "evacuation" | "lockdown" | "medical"
    scheduledTime: string
    duration?: number
    instructions: string
  }
}

export interface NotificationSettings {
  enabled: boolean
  emergencyAlerts: boolean
  evacuationAlerts: boolean
  drillNotifications: boolean
  maintenanceAlerts: boolean
  systemUpdates: boolean
  sound: boolean
  vibration: boolean
  priority: "all" | "high" | "critical"
}

export interface PushSubscription {
  endpoint: string
  keys: {
    p256dh: string
    auth: string
  }
}

export interface NotificationSubscription {
  id: string
  userId: string
  customerId: number
  subscription: PushSubscription
  deviceType: "desktop" | "mobile" | "tablet"
  userAgent: string
  createdAt: Date
  lastUsed: Date
  active: boolean
}

export interface NotificationResponse {
  success: boolean
  message?: string
  error?: string
  notificationId?: string
}

export interface BulkNotificationRequest {
  notifications: NotificationData[]
  targetUsers?: string[]
  targetRoles?: string[]
  targetLocations?: string[]
  scheduleTime?: string
}

export interface NotificationHistory {
  id: string
  title: string
  body: string
  type: string
  priority: string
  sentAt: string
  deliveredAt?: string
  readAt?: string
  status: "pending" | "sent" | "delivered" | "read" | "failed"
  recipientCount: number
  deliveryRate: number
}
