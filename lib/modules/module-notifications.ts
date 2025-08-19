import { getModuleById, calculateModulePrice, type ModuleActivationRequest } from "./module-definitions"

export class ModuleNotificationService {
  static async requestModuleActivation(
    customerId: string,
    customerName: string,
    moduleId: string,
    requestedBy: string,
    requestedByEmail: string,
  ): Promise<{ success: boolean; error?: string; autoApproved?: boolean; requestId?: string }> {
    try {
      const module = getModuleById(moduleId)
      if (!module) {
        return { success: false, error: "Module niet gevonden" }
      }

      // Calculate costs
      const pricing = calculateModulePrice(module, 25, 1) // Default values
      const monthlyCost = pricing.price
      const yearlyCost = monthlyCost * 12

      // Create activation request
      const request: ModuleActivationRequest = {
        id: crypto.randomUUID(),
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

      // Check if auto-approval is possible (for core modules or low-cost modules)
      if (module.core || monthlyCost < 50) {
        request.status = "auto_approved"
        request.approvedBy = "system"
        request.approvedAt = new Date()

        // Store the request
        await this.storeActivationRequest(request)

        return { success: true, autoApproved: true }
      }

      // Store the request for manual approval
      await this.storeActivationRequest(request)

      // Send notification email (mock implementation)
      await this.sendApprovalNotification(request)

      return { success: true, autoApproved: false, requestId: request.id }
    } catch (error) {
      return { success: false, error: "Fout bij aanvragen module activatie" }
    }
  }

  private static async storeActivationRequest(request: ModuleActivationRequest): Promise<void> {
    const stored = localStorage.getItem("module_activation_requests")
    const requests: ModuleActivationRequest[] = stored ? JSON.parse(stored) : []

    requests.push({
      ...request,
      requestedAt: request.requestedAt,
      approvedAt: request.approvedAt,
    })

    localStorage.setItem("module_activation_requests", JSON.stringify(requests))
  }

  private static async sendApprovalNotification(request: ModuleActivationRequest): Promise<void> {
    // Mock email notification
    console.log(`📧 Approval notification sent for module ${request.moduleId} to admin`)

    // In production, this would send an actual email
    const emailData = {
      to: "admin@bhv360.nl",
      subject: `Module Activatie Aanvraag: ${request.moduleId}`,
      body: `
        Nieuwe module activatie aanvraag:
        
        Klant: ${request.customerName}
        Module: ${request.moduleId}
        Aangevraagd door: ${request.requestedBy} (${request.requestedByEmail})
        Maandelijkse kosten: €${request.monthlyCost}
        Jaarlijkse kosten: €${request.yearlyCost}
        
        Klik hier om goed te keuren: [APPROVAL_LINK]
      `,
    }

    // Store notification for demo purposes
    const notifications = JSON.parse(localStorage.getItem("email_notifications") || "[]")
    notifications.push({
      id: crypto.randomUUID(),
      ...emailData,
      sentAt: new Date(),
      status: "sent",
    })
    localStorage.setItem("email_notifications", JSON.stringify(notifications))
  }

  static async getActivationRequests(customerId?: string): Promise<ModuleActivationRequest[]> {
    const stored = localStorage.getItem("module_activation_requests")
    const requests: ModuleActivationRequest[] = stored ? JSON.parse(stored) : []

    return requests
      .filter((req) => !customerId || req.customerId === customerId)
      .map((req) => ({
        ...req,
        requestedAt: new Date(req.requestedAt),
        approvedAt: req.approvedAt ? new Date(req.approvedAt) : undefined,
        rejectedAt: req.rejectedAt ? new Date(req.rejectedAt) : undefined,
      }))
      .sort((a, b) => b.requestedAt.getTime() - a.requestedAt.getTime())
  }

  static async approveRequest(requestId: string, approvedBy: string): Promise<{ success: boolean; error?: string }> {
    try {
      const stored = localStorage.getItem("module_activation_requests")
      const requests: ModuleActivationRequest[] = stored ? JSON.parse(stored) : []

      const requestIndex = requests.findIndex((req) => req.id === requestId)
      if (requestIndex === -1) {
        return { success: false, error: "Aanvraag niet gevonden" }
      }

      const request = requests[requestIndex]
      request.status = "approved"
      request.approvedBy = approvedBy
      request.approvedAt = new Date()

      requests[requestIndex] = request
      localStorage.setItem("module_activation_requests", JSON.stringify(requests))

      // Actually enable the module
      const { CustomerModuleService } = await import("./customer-modules")
      await CustomerModuleService.enableModule(
        request.customerId,
        request.moduleId,
        `approved_by_${approvedBy}`,
        true, // bypass approval since this IS the approval
      )

      return { success: true }
    } catch (error) {
      return { success: false, error: "Fout bij goedkeuren aanvraag" }
    }
  }

  static async rejectRequest(
    requestId: string,
    rejectedBy: string,
    reason: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const stored = localStorage.getItem("module_activation_requests")
      const requests: ModuleActivationRequest[] = stored ? JSON.parse(stored) : []

      const requestIndex = requests.findIndex((req) => req.id === requestId)
      if (requestIndex === -1) {
        return { success: false, error: "Aanvraag niet gevonden" }
      }

      const request = requests[requestIndex]
      request.status = "rejected"
      request.rejectedBy = rejectedBy
      request.rejectedAt = new Date()
      request.rejectionReason = reason

      requests[requestIndex] = request
      localStorage.setItem("module_activation_requests", JSON.stringify(requests))

      return { success: true }
    } catch (error) {
      return { success: false, error: "Fout bij afwijzen aanvraag" }
    }
  }
}
