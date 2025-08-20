import type { ModuleActivationRequest } from "./module-definitions"
import { getModuleById, calculateModulePrice } from "./module-definitions"

export interface ModuleNotification {
  id: string
  type: "activation_request" | "activation_approved" | "activation_rejected" | "module_update" | "billing_alert"
  title: string
  message: string
  customerId: string
  moduleId?: string
  createdAt: Date
  readAt?: Date
  actionRequired: boolean
  metadata?: Record<string, any>
}

export class ModuleNotificationService {
  private notifications: Map<string, ModuleNotification[]> = new Map()
  private activationRequests: Map<string, ModuleActivationRequest> = new Map()

  // Create activation request
  createActivationRequest(
    moduleId: string,
    customerId: string,
    customerName: string,
    requestedBy: string,
    requestedByEmail: string,
    userCount: number,
    buildingCount: number,
  ): ModuleActivationRequest {
    const module = getModuleById(moduleId)
    if (!module) {
      throw new Error(`Module ${moduleId} not found`)
    }

    const pricing = calculateModulePrice(module, userCount, buildingCount)
    const monthlyCost = pricing.price
    const yearlyCost = monthlyCost * 12 * 0.9 // 10% discount

    const request: ModuleActivationRequest = {
      id: `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      moduleId,
      customerId,
      customerName,
      requestedBy,
      requestedByEmail,
      requestedAt: new Date(),
      status: "pending",
      monthlyCost,
      yearlyCost,
    }

    this.activationRequests.set(request.id, request)

    // Create notification for admins
    this.createNotification({
      type: "activation_request",
      title: "New Module Activation Request",
      message: `${customerName} has requested activation of ${module.name}`,
      customerId: "admin",
      moduleId,
      actionRequired: true,
      metadata: {
        requestId: request.id,
        monthlyCost,
        yearlyCost,
        userCount,
        buildingCount,
      },
    })

    return request
  }

  // Approve activation request
  approveActivationRequest(requestId: string, approvedBy: string): boolean {
    const request = this.activationRequests.get(requestId)
    if (!request || request.status !== "pending") {
      return false
    }

    request.status = "approved"
    request.approvedBy = approvedBy
    request.approvedAt = new Date()

    this.activationRequests.set(requestId, request)

    // Notify customer
    this.createNotification({
      type: "activation_approved",
      title: "Module Activation Approved",
      message: `Your request for ${getModuleById(request.moduleId)?.name} has been approved`,
      customerId: request.customerId,
      moduleId: request.moduleId,
      actionRequired: false,
      metadata: {
        requestId,
        approvedBy,
        monthlyCost: request.monthlyCost,
      },
    })

    return true
  }

  // Reject activation request
  rejectActivationRequest(requestId: string, rejectedBy: string, reason: string): boolean {
    const request = this.activationRequests.get(requestId)
    if (!request || request.status !== "pending") {
      return false
    }

    request.status = "rejected"
    request.rejectedBy = rejectedBy
    request.rejectedAt = new Date()
    request.rejectionReason = reason

    this.activationRequests.set(requestId, request)

    // Notify customer
    this.createNotification({
      type: "activation_rejected",
      title: "Module Activation Rejected",
      message: `Your request for ${getModuleById(request.moduleId)?.name} has been rejected: ${reason}`,
      customerId: request.customerId,
      moduleId: request.moduleId,
      actionRequired: false,
      metadata: {
        requestId,
        rejectedBy,
        reason,
      },
    })

    return true
  }

  // Create notification
  createNotification(notification: Omit<ModuleNotification, "id" | "createdAt">): ModuleNotification {
    const newNotification: ModuleNotification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
    }

    const existing = this.notifications.get(notification.customerId) || []
    existing.push(newNotification)
    this.notifications.set(notification.customerId, existing)

    return newNotification
  }

  // Get notifications for customer
  getNotifications(customerId: string, unreadOnly = false): ModuleNotification[] {
    const notifications = this.notifications.get(customerId) || []

    if (unreadOnly) {
      return notifications.filter((n) => !n.readAt)
    }

    return notifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  // Mark notification as read
  markAsRead(customerId: string, notificationId: string): boolean {
    const notifications = this.notifications.get(customerId) || []
    const notification = notifications.find((n) => n.id === notificationId)

    if (!notification) {
      return false
    }

    notification.readAt = new Date()
    this.notifications.set(customerId, notifications)
    return true
  }

  // Get pending activation requests
  getPendingRequests(): ModuleActivationRequest[] {
    return Array.from(this.activationRequests.values())
      .filter((req) => req.status === "pending")
      .sort((a, b) => b.requestedAt.getTime() - a.requestedAt.getTime())
  }

  // Get activation request by ID
  getActivationRequest(requestId: string): ModuleActivationRequest | undefined {
    return this.activationRequests.get(requestId)
  }

  // Get all activation requests for a customer
  getCustomerRequests(customerId: string): ModuleActivationRequest[] {
    return Array.from(this.activationRequests.values())
      .filter((req) => req.customerId === customerId)
      .sort((a, b) => b.requestedAt.getTime() - a.requestedAt.getTime())
  }

  // Send module update notification
  notifyModuleUpdate(moduleId: string, version: string, changes: string[]): void {
    const module = getModuleById(moduleId)
    if (!module) return

    // This would typically get customers from the customer service
    // For now, we'll create a placeholder notification
    this.createNotification({
      type: "module_update",
      title: `${module.name} Updated`,
      message: `${module.name} has been updated to version ${version}`,
      customerId: "all", // Special case for broadcast
      moduleId,
      actionRequired: false,
      metadata: {
        version,
        changes,
      },
    })
  }

  // Send billing alert
  sendBillingAlert(customerId: string, moduleId: string, message: string): void {
    const module = getModuleById(moduleId)

    this.createNotification({
      type: "billing_alert",
      title: "Billing Alert",
      message,
      customerId,
      moduleId,
      actionRequired: true,
      metadata: {
        moduleName: module?.name,
      },
    })
  }

  // Get notification statistics
  getNotificationStats(customerId?: string) {
    if (customerId) {
      const notifications = this.getNotifications(customerId)
      return {
        total: notifications.length,
        unread: notifications.filter((n) => !n.readAt).length,
        actionRequired: notifications.filter((n) => n.actionRequired && !n.readAt).length,
      }
    }

    // Global stats
    let total = 0
    let unread = 0
    let actionRequired = 0

    for (const notifications of this.notifications.values()) {
      total += notifications.length
      unread += notifications.filter((n) => !n.readAt).length
      actionRequired += notifications.filter((n) => n.actionRequired && !n.readAt).length
    }

    return { total, unread, actionRequired }
  }
}

// Export singleton instance
export const moduleNotificationService = new ModuleNotificationService()
