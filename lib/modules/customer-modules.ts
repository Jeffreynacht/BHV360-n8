import { type Module, AVAILABLE_MODULES, getModuleById, getCoreModules } from "./module-definitions"

export interface CustomerModule {
  customerId: string
  moduleId: string
  isEnabled: boolean
  enabledAt: Date
  enabledBy: string
  disabledAt?: Date
  disabledBy?: string
  settings?: Record<string, any>
}

export interface CustomerModuleConfig {
  customerId: string
  modules: CustomerModule[]
  lastUpdated: Date
  updatedBy: string
}

export class CustomerModuleService {
  // Get all modules for a customer
  static async getCustomerModules(customerId: string): Promise<CustomerModule[]> {
    // In productie zou dit uit database komen
    const stored = localStorage.getItem(`customer_modules_${customerId}`)
    if (stored) {
      return JSON.parse(stored).map((m: any) => ({
        ...m,
        enabledAt: new Date(m.enabledAt),
        disabledAt: m.disabledAt ? new Date(m.disabledAt) : undefined,
      }))
    }

    // Default: alleen core modules enabled
    const coreModules = getCoreModules()
    return coreModules.map((module) => ({
      customerId,
      moduleId: module.id,
      isEnabled: true,
      enabledAt: new Date(),
      enabledBy: "system",
    }))
  }

  // Get enabled modules for a customer
  static async getEnabledModules(customerId: string): Promise<Module[]> {
    const customerModules = await this.getCustomerModules(customerId)
    const enabledModuleIds = customerModules.filter((cm) => cm.isEnabled).map((cm) => cm.moduleId)

    return AVAILABLE_MODULES.filter((m) => enabledModuleIds.includes(m.id))
  }

  // Enable a module for a customer (with approval workflow)
  static async enableModule(
    customerId: string,
    moduleId: string,
    enabledBy: string,
    bypassApproval = false,
  ): Promise<{ success: boolean; error?: string; requiresApproval?: boolean; requestId?: string }> {
    try {
      const module = getModuleById(moduleId)
      if (!module) {
        return { success: false, error: "Module niet gevonden" }
      }

      // Check if approval is needed (skip for system/admin actions)
      if (!bypassApproval && !enabledBy.startsWith("system") && !enabledBy.startsWith("approved_by")) {
        // Get customer name (in productie uit database)
        const customerName = `Klant ${customerId}` // Placeholder
        const requestedByEmail = "user@company.com" // Placeholder - in productie uit user context

        // Request approval instead of direct activation
        const { ModuleNotificationService } = await import("./module-notifications")
        const result = await ModuleNotificationService.requestModuleActivation(
          customerId,
          customerName,
          moduleId,
          enabledBy,
          requestedByEmail,
        )

        if (!result.success) {
          return { success: false, error: result.error }
        }

        if (result.autoApproved) {
          // Module was auto-approved and activated
          return { success: true }
        } else {
          // Approval required
          return {
            success: true,
            requiresApproval: true,
            requestId: result.requestId,
            error: "Module activatie vereist goedkeuring. Een email is verstuurd naar de beheerder.",
          }
        }
      }

      // Direct activation (for system/approved actions)
      const customerModules = await this.getCustomerModules(customerId)
      const existingModule = customerModules.find((cm) => cm.moduleId === moduleId)

      if (existingModule) {
        existingModule.isEnabled = true
        existingModule.enabledAt = new Date()
        existingModule.enabledBy = enabledBy
        existingModule.disabledAt = undefined
        existingModule.disabledBy = undefined
      } else {
        customerModules.push({
          customerId,
          moduleId,
          isEnabled: true,
          enabledAt: new Date(),
          enabledBy,
        })
      }

      // Save to storage
      localStorage.setItem(`customer_modules_${customerId}`, JSON.stringify(customerModules))

      // Log the change
      await ModuleAuditService.logModuleChange({
        customerId,
        moduleId,
        action: "enabled",
        performedBy: enabledBy,
        timestamp: new Date(),
      })

      return { success: true }
    } catch (error) {
      return { success: false, error: "Fout bij inschakelen module" }
    }
  }

  // Disable a module for a customer
  static async disableModule(
    customerId: string,
    moduleId: string,
    disabledBy: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const module = getModuleById(moduleId)
      if (!module) {
        return { success: false, error: "Module niet gevonden" }
      }

      if (module.isCore) {
        return { success: false, error: "Core modules kunnen niet uitgeschakeld worden" }
      }

      const customerModules = await this.getCustomerModules(customerId)
      const existingModule = customerModules.find((cm) => cm.moduleId === moduleId)

      if (existingModule) {
        existingModule.isEnabled = false
        existingModule.disabledAt = new Date()
        existingModule.disabledBy = disabledBy
      }

      // Save to storage
      localStorage.setItem(`customer_modules_${customerId}`, JSON.stringify(customerModules))

      // Log the change
      await ModuleAuditService.logModuleChange({
        customerId,
        moduleId,
        action: "disabled",
        performedBy: disabledBy,
        timestamp: new Date(),
      })

      return { success: true }
    } catch (error) {
      return { success: false, error: "Fout bij uitschakelen module" }
    }
  }

  // Check if customer has module enabled
  static async hasModule(customerId: string, moduleId: string): Promise<boolean> {
    const customerModules = await this.getCustomerModules(customerId)
    const module = customerModules.find((cm) => cm.moduleId === moduleId)
    return module?.isEnabled || false
  }
}

// Audit logging service
export interface ModuleAuditLog {
  id: string
  customerId: string
  moduleId: string
  action: "enabled" | "disabled" | "configured"
  performedBy: string
  timestamp: Date
  details?: Record<string, any>
}

export class ModuleAuditService {
  static async logModuleChange(log: Omit<ModuleAuditLog, "id">): Promise<void> {
    const auditLog: ModuleAuditLog = {
      id: crypto.randomUUID(),
      ...log,
    }

    // Get existing logs
    const stored = localStorage.getItem("module_audit_logs")
    const logs: ModuleAuditLog[] = stored ? JSON.parse(stored) : []

    // Add new log
    logs.push(auditLog)

    // Keep only last 1000 logs
    if (logs.length > 1000) {
      logs.splice(0, logs.length - 1000)
    }

    // Save back
    localStorage.setItem("module_audit_logs", JSON.stringify(logs))
  }

  static async getAuditLogs(customerId?: string): Promise<ModuleAuditLog[]> {
    const stored = localStorage.getItem("module_audit_logs")
    const logs: ModuleAuditLog[] = stored ? JSON.parse(stored) : []

    return logs
      .filter((log) => !customerId || log.customerId === customerId)
      .map((log) => ({
        ...log,
        timestamp: new Date(log.timestamp),
      }))
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }
}
