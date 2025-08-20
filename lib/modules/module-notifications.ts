export interface ModuleActivationRequest {
  id: string
  customerId: string
  customerName: string
  moduleId: string
  requestedBy: string
  requestedByEmail: string
  requestedAt: Date
  status: "pending" | "approved" | "rejected"
  approvedBy?: string
  approvedAt?: Date
  rejectedBy?: string
  rejectedAt?: Date
  rejectionReason?: string
}

export class ModuleNotificationService {
  static async requestModuleActivation(
    customerId: string,
    customerName: string,
    moduleId: string,
    requestedBy: string,
    requestedByEmail: string,
  ): Promise<{ success: boolean; error?: string; autoApproved?: boolean; requestId?: string }> {
    try {
      // Get module info
      const { getModuleById } = await import("./module-definitions")
      const module = getModuleById(moduleId)
      if (!module) {
        return { success: false, error: "Module niet gevonden" }
      }

      // Check if auto-approval is enabled for this module/customer
      const autoApprovalRules = await this.getAutoApprovalRules(customerId)
      const shouldAutoApprove = this.shouldAutoApprove(moduleId, autoApprovalRules)

      if (shouldAutoApprove) {
        // Auto-approve and activate
        const { CustomerModuleService } = await import("./customer-modules")
        const result = await CustomerModuleService.enableModule(
          customerId,
          moduleId,
          `approved_by_system_${Date.now()}`,
          true, // bypass approval
        )

        if (result.success) {
          // Log auto-approval
          await this.logModuleRequest({
            id: crypto.randomUUID(),
            customerId,
            customerName,
            moduleId,
            requestedBy,
            requestedByEmail,
            requestedAt: new Date(),
            status: "approved",
            approvedBy: "system",
            approvedAt: new Date(),
          })

          return { success: true, autoApproved: true }
        } else {
          return { success: false, error: result.error }
        }
      }

      // Manual approval required
      const requestId = crypto.randomUUID()
      const request: ModuleActivationRequest = {
        id: requestId,
        customerId,
        customerName,
        moduleId,
        requestedBy,
        requestedByEmail,
        requestedAt: new Date(),
        status: "pending",
      }

      // Store request
      await this.logModuleRequest(request)

      // Send notification email (simulated)
      await this.sendApprovalNotification(request, module)

      return { success: true, requestId }
    } catch (error) {
      console.error("Error requesting module activation:", error)
      return { success: false, error: "Fout bij aanvragen module activatie" }
    }
  }

  private static async getAutoApprovalRules(customerId: string): Promise<string[]> {
    // In productie zou dit uit database komen
    const stored = localStorage.getItem(`auto_approval_rules_${customerId}`)
    if (stored) {
      return JSON.parse(stored)
    }

    // Default auto-approval rules for demo
    return ["basic_reporting", "visitor_management", "skills_assessment", "mobile_app"]
  }

  private static shouldAutoApprove(moduleId: string, autoApprovalRules: string[]): boolean {
    return autoApprovalRules.includes(moduleId)
  }

  private static async logModuleRequest(request: ModuleActivationRequest): Promise<void> {
    const stored = localStorage.getItem("module_activation_requests")
    const requests: ModuleActivationRequest[] = stored ? JSON.parse(stored) : []

    // Update existing or add new
    const existingIndex = requests.findIndex((r) => r.id === request.id)
    if (existingIndex >= 0) {
      requests[existingIndex] = request
    } else {
      requests.push(request)
    }

    // Keep only last 500 requests
    if (requests.length > 500) {
      requests.splice(0, requests.length - 500)
    }

    localStorage.setItem("module_activation_requests", JSON.stringify(requests))
  }

  private static async sendApprovalNotification(request: ModuleActivationRequest, module: any): Promise<void> {
    // Simulate email sending
    console.log(`📧 Email sent to admin:
      Subject: Module Activatie Aanvraag - ${module.name}
      
      Klant: ${request.customerName}
      Module: ${module.name}
      Aangevraagd door: ${request.requestedBy} (${request.requestedByEmail})
      Datum: ${request.requestedAt.toLocaleString()}
      
      Beschrijving: ${module.description}
      
      Klik hier om goed te keuren: [APPROVE_LINK]
      Klik hier om af te wijzen: [REJECT_LINK]
    `)

    // In productie zou hier een echte email service gebruikt worden
    // zoals SendGrid, AWS SES, of een interne mail server
  }

  static async getPendingRequests(): Promise<ModuleActivationRequest[]> {
    const stored = localStorage.getItem("module_activation_requests")
    const requests: ModuleActivationRequest[] = stored ? JSON.parse(stored) : []

    return requests
      .filter((r) => r.status === "pending")
      .map((r) => ({
        ...r,
        requestedAt: new Date(r.requestedAt),
        approvedAt: r.approvedAt ? new Date(r.approvedAt) : undefined,
        rejectedAt: r.rejectedAt ? new Date(r.rejectedAt) : undefined,
      }))
      .sort((a, b) => b.requestedAt.getTime() - a.requestedAt.getTime())
  }

  static async approveRequest(requestId: string, approvedBy: string): Promise<{ success: boolean; error?: string }> {
    try {
      const stored = localStorage.getItem("module_activation_requests")
      const requests: ModuleActivationRequest[] = stored ? JSON.parse(stored) : []

      const request = requests.find((r) => r.id === requestId)
      if (!request) {
        return { success: false, error: "Aanvraag niet gevonden" }
      }

      if (request.status !== "pending") {
        return { success: false, error: "Aanvraag is al verwerkt" }
      }

      // Update request status
      request.status = "approved"
      request.approvedBy = approvedBy
      request.approvedAt = new Date()

      // Save updated requests
      localStorage.setItem("module_activation_requests", JSON.stringify(requests))

      // Activate the module
      const { CustomerModuleService } = await import("./customer-modules")
      const result = await CustomerModuleService.enableModule(
        request.customerId,
        request.moduleId,
        `approved_by_${approvedBy}`,
        true, // bypass approval
      )

      if (!result.success) {
        return { success: false, error: result.error }
      }

      // Send confirmation email (simulated)
      console.log(`📧 Confirmation email sent to ${request.requestedByEmail}:
        Subject: Module Activatie Goedgekeurd
        
        Beste ${request.requestedBy},
        
        Uw aanvraag voor module activatie is goedgekeurd.
        Module: ${request.moduleId}
        Goedgekeurd door: ${approvedBy}
        
        De module is nu actief in uw account.
      `)

      return { success: true }
    } catch (error) {
      console.error("Error approving request:", error)
      return { success: false, error: "Fout bij goedkeuren aanvraag" }
    }
  }

  static async rejectRequest(
    requestId: string,
    rejectedBy: string,
    rejectionReason: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const stored = localStorage.getItem("module_activation_requests")
      const requests: ModuleActivationRequest[] = stored ? JSON.parse(stored) : []

      const request = requests.find((r) => r.id === requestId)
      if (!request) {
        return { success: false, error: "Aanvraag niet gevonden" }
      }

      if (request.status !== "pending") {
        return { success: false, error: "Aanvraag is al verwerkt" }
      }

      // Update request status
      request.status = "rejected"
      request.rejectedBy = rejectedBy
      request.rejectedAt = new Date()
      request.rejectionReason = rejectionReason

      // Save updated requests
      localStorage.setItem("module_activation_requests", JSON.stringify(requests))

      // Send rejection email (simulated)
      console.log(`📧 Rejection email sent to ${request.requestedByEmail}:
        Subject: Module Activatie Afgewezen
        
        Beste ${request.requestedBy},
        
        Uw aanvraag voor module activatie is afgewezen.
        Module: ${request.moduleId}
        Afgewezen door: ${rejectedBy}
        Reden: ${rejectionReason}
        
        Voor vragen kunt u contact opnemen met support.
      `)

      return { success: true }
    } catch (error) {
      console.error("Error rejecting request:", error)
      return { success: false, error: "Fout bij afwijzen aanvraag" }
    }
  }
}
