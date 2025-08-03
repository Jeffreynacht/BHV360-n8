import { emailService } from "../reports/email-service"
import { type Module, getModuleById } from "./module-definitions"
import { PricingCalculator } from "./pricing-calculator"

export interface ModuleActivationRequest {
  id: string
  customerId: string
  customerName: string
  moduleId: string
  requestedBy: string
  requestedByEmail: string
  requestedAt: Date
  status: "pending" | "approved" | "rejected" | "auto_approved"
  approvedBy?: string
  approvedAt?: Date
  rejectedBy?: string
  rejectedAt?: Date
  rejectionReason?: string
  monthlyCost: number
  yearlyCost: number
  impactDescription: string
}

export interface NotificationHierarchy {
  customerId: string
  levels: {
    level: number
    role: string
    emails: string[]
    autoApproveLimit?: number // Bedrag tot waar automatisch goedgekeurd wordt
  }[]
}

export class ModuleNotificationService {
  private static getNotificationHierarchy(customerId: string): NotificationHierarchy {
    // In productie zou dit uit database komen
    const stored = localStorage.getItem(`notification_hierarchy_${customerId}`)
    if (stored) {
      return JSON.parse(stored)
    }

    // Default hiërarchie
    return {
      customerId,
      levels: [
        {
          level: 1,
          role: "BHV Coördinator",
          emails: ["bhv.coordinator@company.com"],
          autoApproveLimit: 50, // Tot €50 per maand automatisch goedkeuren
        },
        {
          level: 2,
          role: "Facility Manager",
          emails: ["facility.manager@company.com"],
          autoApproveLimit: 200, // Tot €200 per maand
        },
        {
          level: 3,
          role: "Operations Director",
          emails: ["operations.director@company.com"],
          autoApproveLimit: 500, // Tot €500 per maand
        },
        {
          level: 4,
          role: "CFO",
          emails: ["cfo@company.com"],
          // Geen limiet - alles moet goedgekeurd worden
        },
      ],
    }
  }

  static async requestModuleActivation(
    customerId: string,
    customerName: string,
    moduleId: string,
    requestedBy: string,
    requestedByEmail: string,
  ): Promise<{ success: boolean; requestId?: string; autoApproved?: boolean; error?: string }> {
    try {
      const module = getModuleById(moduleId)
      if (!module) {
        return { success: false, error: "Module niet gevonden" }
      }

      // Bereken kosten
      const pricing = await PricingCalculator.calculateModuleCost(customerId, moduleId)
      const monthlyCost = pricing.monthlyTotal
      const yearlyCost = pricing.yearlyTotal

      // Maak request aan
      const request: ModuleActivationRequest = {
        id: crypto.randomUUID(),
        customerId,
        customerName,
        moduleId,
        requestedBy,
        requestedByEmail,
        requestedAt: new Date(),
        status: "pending",
        monthlyCost,
        yearlyCost,
        impactDescription: this.generateImpactDescription(module, monthlyCost, yearlyCost),
      }

      // Check of automatische goedkeuring mogelijk is
      const hierarchy = this.getNotificationHierarchy(customerId)
      const autoApproveLevel = hierarchy.levels.find(
        (level) => level.autoApproveLimit && monthlyCost <= level.autoApproveLimit,
      )

      if (autoApproveLevel) {
        // Automatisch goedkeuren
        request.status = "auto_approved"
        request.approvedBy = "system"
        request.approvedAt = new Date()

        // Verstuur notificatie email (informatief)
        await this.sendAutoApprovalNotification(request, module, autoApproveLevel)

        // Activeer module direct
        const { CustomerModuleService } = await import("./customer-modules")
        await CustomerModuleService.enableModule(customerId, moduleId, "system_auto_approved")

        // Sla request op voor audit trail
        await this.saveActivationRequest(request)

        return { success: true, requestId: request.id, autoApproved: true }
      } else {
        // Verstuur approval request naar juiste niveau
        const approvalLevel = this.getRequiredApprovalLevel(hierarchy, monthlyCost)
        await this.sendApprovalRequest(request, module, approvalLevel)

        // Sla request op
        await this.saveActivationRequest(request)

        return { success: true, requestId: request.id, autoApproved: false }
      }
    } catch (error) {
      console.error("Error requesting module activation:", error)
      return { success: false, error: "Fout bij aanvragen module activatie" }
    }
  }

  private static generateImpactDescription(module: Module, monthlyCost: number, yearlyCost: number): string {
    return `
De activatie van module "${module.name}" heeft de volgende financiële impact:

💰 Kosten:
- Maandelijks: €${monthlyCost.toFixed(2)}
- Jaarlijks: €${yearlyCost.toFixed(2)}

📋 Functionaliteit:
${module.description}

🎯 Voordelen:
${module.features.map((f) => `- ${f}`).join("\n")}

⚠️ Let op: Deze kosten worden automatisch doorberekend vanaf activatie.
    `.trim()
  }

  private static getRequiredApprovalLevel(hierarchy: NotificationHierarchy, monthlyCost: number) {
    // Zoek het juiste niveau op basis van kosten
    for (let i = hierarchy.levels.length - 1; i >= 0; i--) {
      const level = hierarchy.levels[i]
      if (!level.autoApproveLimit || monthlyCost > level.autoApproveLimit) {
        return level
      }
    }
    return hierarchy.levels[0] // Fallback naar eerste niveau
  }

  private static async sendAutoApprovalNotification(
    request: ModuleActivationRequest,
    module: Module,
    approvalLevel: NotificationHierarchy["levels"][0],
  ) {
    const subject = `✅ Module Automatisch Geactiveerd - ${module.name} voor ${request.customerName}`

    const body = `
Beste ${approvalLevel.role},

Een nieuwe module is automatisch geactiveerd omdat de kosten binnen uw goedkeuringslimiet vallen.

📊 Details:
- Klant: ${request.customerName}
- Module: ${module.name}
- Aangevraagd door: ${request.requestedBy} (${request.requestedByEmail})
- Datum: ${request.requestedAt.toLocaleDateString("nl-NL")}

💰 Kosten Impact:
- Maandelijks: €${request.monthlyCost.toFixed(2)}
- Jaarlijks: €${request.yearlyCost.toFixed(2)}

${request.impactDescription}

✅ Status: Automatisch goedgekeurd (onder limiet van €${approvalLevel.autoApproveLimit})

De module is direct geactiveerd en de kosten worden vanaf nu doorberekend.

Voor vragen kunt u contact opnemen via het BHV360 platform.

Met vriendelijke groet,
BHV360 Systeem
    `.trim()

    await emailService.sendReportEmail({
      to: approvalLevel.emails,
      cc: [request.requestedByEmail],
      subject,
      body,
    })
  }

  private static async sendApprovalRequest(
    request: ModuleActivationRequest,
    module: Module,
    approvalLevel: NotificationHierarchy["levels"][0],
  ) {
    const subject = `🔔 Goedkeuring Vereist - Module Activatie: ${module.name} voor ${request.customerName}`

    const approvalUrl = `${window.location.origin}/beheer/module-approvals/${request.id}`

    const body = `
Beste ${approvalLevel.role},

Er is een verzoek ingediend voor het activeren van een nieuwe module die uw goedkeuring vereist.

📊 Verzoek Details:
- Klant: ${request.customerName}
- Module: ${module.name}
- Aangevraagd door: ${request.requestedBy} (${request.requestedByEmail})
- Datum: ${request.requestedAt.toLocaleDateString("nl-NL")}

💰 Kosten Impact:
- Maandelijks: €${request.monthlyCost.toFixed(2)}
- Jaarlijks: €${request.yearlyCost.toFixed(2)}

${request.impactDescription}

⚠️ ACTIE VEREIST:
Deze module vereist uw goedkeuring vanwege de kosten (boven €${approvalLevel.autoApproveLimit || 0} per maand).

🔗 Goedkeuren/Afwijzen:
Klik hier om het verzoek te behandelen: ${approvalUrl}

Of log in op het BHV360 platform en ga naar Beheer > Module Goedkeuringen.

⏰ Let op: Zolang dit verzoek niet is behandeld, blijft de module uitgeschakeld.

Voor vragen kunt u contact opnemen met ${request.requestedBy} (${request.requestedByEmail}).

Met vriendelijke groet,
BHV360 Systeem
    `.trim()

    await emailService.sendReportEmail({
      to: approvalLevel.emails,
      cc: [request.requestedByEmail],
      subject,
      body,
    })
  }

  static async approveRequest(
    requestId: string,
    approvedBy: string,
    approverEmail: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const request = await this.getActivationRequest(requestId)
      if (!request) {
        return { success: false, error: "Verzoek niet gevonden" }
      }

      if (request.status !== "pending") {
        return { success: false, error: "Verzoek is al behandeld" }
      }

      // Update request status
      request.status = "approved"
      request.approvedBy = approvedBy
      request.approvedAt = new Date()

      // Activeer module
      const { CustomerModuleService } = await import("./customer-modules")
      const result = await CustomerModuleService.enableModule(
        request.customerId,
        request.moduleId,
        `approved_by_${approvedBy}`,
      )

      if (!result.success) {
        return { success: false, error: result.error }
      }

      // Update request
      await this.saveActivationRequest(request)

      // Verstuur bevestiging emails
      await this.sendApprovalConfirmation(request, approvedBy, approverEmail)

      return { success: true }
    } catch (error) {
      console.error("Error approving request:", error)
      return { success: false, error: "Fout bij goedkeuren verzoek" }
    }
  }

  static async rejectRequest(
    requestId: string,
    rejectedBy: string,
    rejectorEmail: string,
    reason: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const request = await this.getActivationRequest(requestId)
      if (!request) {
        return { success: false, error: "Verzoek niet gevonden" }
      }

      if (request.status !== "pending") {
        return { success: false, error: "Verzoek is al behandeld" }
      }

      // Update request status
      request.status = "rejected"
      request.rejectedBy = rejectedBy
      request.rejectedAt = new Date()
      request.rejectionReason = reason

      // Update request
      await this.saveActivationRequest(request)

      // Verstuur afwijzing emails
      await this.sendRejectionNotification(request, rejectedBy, rejectorEmail, reason)

      return { success: true }
    } catch (error) {
      console.error("Error rejecting request:", error)
      return { success: false, error: "Fout bij afwijzen verzoek" }
    }
  }

  private static async sendApprovalConfirmation(
    request: ModuleActivationRequest,
    approvedBy: string,
    approverEmail: string,
  ) {
    const module = getModuleById(request.moduleId)
    const subject = `✅ Module Geactiveerd - ${module?.name} voor ${request.customerName}`

    const body = `
Beste collega's,

De module activatie is goedgekeurd en de module is nu actief.

📊 Details:
- Klant: ${request.customerName}
- Module: ${module?.name}
- Oorspronkelijk aangevraagd door: ${request.requestedBy}
- Goedgekeurd door: ${approvedBy}
- Goedgekeurd op: ${request.approvedAt?.toLocaleDateString("nl-NL")}

💰 Kosten Impact (vanaf nu actief):
- Maandelijks: €${request.monthlyCost.toFixed(2)}
- Jaarlijks: €${request.yearlyCost.toFixed(2)}

De module is nu beschikbaar voor gebruik en de kosten worden doorberekend.

Met vriendelijke groet,
BHV360 Systeem
    `.trim()

    await emailService.sendReportEmail({
      to: [request.requestedByEmail],
      cc: [approverEmail],
      subject,
      body,
    })
  }

  private static async sendRejectionNotification(
    request: ModuleActivationRequest,
    rejectedBy: string,
    rejectorEmail: string,
    reason: string,
  ) {
    const module = getModuleById(request.moduleId)
    const subject = `❌ Module Verzoek Afgewezen - ${module?.name} voor ${request.customerName}`

    const body = `
Beste ${request.requestedBy},

Uw verzoek voor module activatie is afgewezen.

📊 Details:
- Klant: ${request.customerName}
- Module: ${module?.name}
- Aangevraagd op: ${request.requestedAt.toLocaleDateString("nl-NL")}
- Afgewezen door: ${rejectedBy}
- Afgewezen op: ${request.rejectedAt?.toLocaleDateString("nl-NL")}

❌ Reden voor afwijzing:
${reason}

💰 Kosten die zouden zijn:
- Maandelijks: €${request.monthlyCost.toFixed(2)}
- Jaarlijks: €${request.yearlyCost.toFixed(2)}

Voor vragen over deze beslissing kunt u contact opnemen met ${rejectedBy} (${rejectorEmail}).

U kunt eventueel een nieuw verzoek indienen met aanvullende motivatie.

Met vriendelijke groet,
BHV360 Systeem
    `.trim()

    await emailService.sendReportEmail({
      to: [request.requestedByEmail],
      cc: [rejectorEmail],
      subject,
      body,
    })
  }

  private static async saveActivationRequest(request: ModuleActivationRequest) {
    const stored = localStorage.getItem("module_activation_requests")
    const requests: ModuleActivationRequest[] = stored ? JSON.parse(stored) : []

    const existingIndex = requests.findIndex((r) => r.id === request.id)
    if (existingIndex >= 0) {
      requests[existingIndex] = request
    } else {
      requests.push(request)
    }

    localStorage.setItem("module_activation_requests", JSON.stringify(requests))
  }

  static async getActivationRequest(requestId: string): Promise<ModuleActivationRequest | null> {
    const stored = localStorage.getItem("module_activation_requests")
    const requests: ModuleActivationRequest[] = stored ? JSON.parse(stored) : []

    const request = requests.find((r) => r.id === requestId)
    if (!request) return null

    return {
      ...request,
      requestedAt: new Date(request.requestedAt),
      approvedAt: request.approvedAt ? new Date(request.approvedAt) : undefined,
      rejectedAt: request.rejectedAt ? new Date(request.rejectedAt) : undefined,
    }
  }

  static async getPendingRequests(customerId?: string): Promise<ModuleActivationRequest[]> {
    const stored = localStorage.getItem("module_activation_requests")
    const requests: ModuleActivationRequest[] = stored ? JSON.parse(stored) : []

    return requests
      .filter((r) => r.status === "pending" && (!customerId || r.customerId === customerId))
      .map((r) => ({
        ...r,
        requestedAt: new Date(r.requestedAt),
        approvedAt: r.approvedAt ? new Date(r.approvedAt) : undefined,
        rejectedAt: r.rejectedAt ? new Date(r.rejectedAt) : undefined,
      }))
      .sort((a, b) => b.requestedAt.getTime() - a.requestedAt.getTime())
  }
}
