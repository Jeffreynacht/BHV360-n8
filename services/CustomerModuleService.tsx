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
    return [
      {
        customerId,
        moduleId: "core-bhv",
        isEnabled: true,
        enabledAt: new Date(),
        enabledBy: "system",
      },
      {
        customerId,
        moduleId: "plotkaart",
        isEnabled: true,
        enabledAt: new Date(),
        enabledBy: "system",
      },
    ]
  }

  // Get enabled modules for a customer
  static async getEnabledModules(customerId: string): Promise<string[]> {
    const customerModules = await this.getCustomerModules(customerId)
    return customerModules.filter((cm) => cm.isEnabled).map((cm) => cm.moduleId)
  }

  // Enable a module for a customer
  static async enableModule(
    customerId: string,
    moduleId: string,
    enabledBy: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
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
      const customerModules = await this.getCustomerModules(customerId)
      const existingModule = customerModules.find((cm) => cm.moduleId === moduleId)

      if (existingModule) {
        existingModule.isEnabled = false
        existingModule.disabledAt = new Date()
        existingModule.disabledBy = disabledBy
      }

      // Save to storage
      localStorage.setItem(`customer_modules_${customerId}`, JSON.stringify(customerModules))

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

// Default export
export default CustomerModuleService
