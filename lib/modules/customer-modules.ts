import type { ModuleDefinition } from "./module-definitions"
import { getModuleById, calculateModulePrice } from "./module-definitions"

// Legacy Module interface for backward compatibility
export interface Module {
  id: string
  name: string
  description: string
  category: string
  tier: string
  enabled: boolean
  visible: boolean
  core: boolean
  implemented: boolean
  pricing: {
    basePrice: number
    model: string
  }
  rating: number
  popularity: number
}

export interface CustomerModule {
  id: string
  customerId: string
  moduleId: string
  activatedAt: Date
  activatedBy: string
  status: "active" | "suspended" | "cancelled"
  billingCycle: "monthly" | "yearly"
  nextBillingDate: Date
  monthlyCost: number
  yearlyCost: number
  userCount: number
  buildingCount: number
  trialEndsAt?: Date
  cancelledAt?: Date
  cancelledBy?: string
  cancellationReason?: string
}

export interface CustomerModuleUsage {
  customerId: string
  moduleId: string
  month: string
  activeUsers: number
  totalBuildings: number
  apiCalls: number
  storageUsed: number
  lastActivity: Date
}

export class CustomerModuleService {
  private customerModules: Map<string, CustomerModule[]> = new Map()
  private moduleUsage: Map<string, CustomerModuleUsage[]> = new Map()

  // Get all modules for a customer
  getCustomerModules(customerId: string): CustomerModule[] {
    return this.customerModules.get(customerId) || []
  }

  // Get active modules for a customer
  getActiveCustomerModules(customerId: string): CustomerModule[] {
    const modules = this.getCustomerModules(customerId)
    return modules.filter((module) => module.status === "active")
  }

  // Check if customer has access to a specific module
  hasModuleAccess(customerId: string, moduleId: string): boolean {
    const modules = this.getActiveCustomerModules(customerId)
    return modules.some((module) => module.moduleId === moduleId)
  }

  // Activate a module for a customer
  activateModule(
    customerId: string,
    moduleId: string,
    activatedBy: string,
    userCount: number,
    buildingCount: number,
    billingCycle: "monthly" | "yearly" = "monthly",
  ): CustomerModule {
    const moduleDefinition = getModuleById(moduleId)
    if (!moduleDefinition) {
      throw new Error(`Module ${moduleId} not found`)
    }

    const pricing = calculateModulePrice(moduleDefinition, userCount, buildingCount)
    const monthlyCost = pricing.price
    const yearlyCost = monthlyCost * 12 * 0.9 // 10% discount for yearly

    const customerModule: CustomerModule = {
      id: `${customerId}-${moduleId}-${Date.now()}`,
      customerId,
      moduleId,
      activatedAt: new Date(),
      activatedBy,
      status: "active",
      billingCycle,
      nextBillingDate: new Date(Date.now() + (billingCycle === "monthly" ? 30 : 365) * 24 * 60 * 60 * 1000),
      monthlyCost,
      yearlyCost,
      userCount,
      buildingCount,
      trialEndsAt: moduleDefinition.pricing.freeTrialDays
        ? new Date(Date.now() + moduleDefinition.pricing.freeTrialDays * 24 * 60 * 60 * 1000)
        : undefined,
    }

    const existingModules = this.customerModules.get(customerId) || []
    existingModules.push(customerModule)
    this.customerModules.set(customerId, existingModules)

    return customerModule
  }

  // Deactivate a module for a customer
  deactivateModule(customerId: string, moduleId: string, deactivatedBy: string, reason?: string): boolean {
    const modules = this.customerModules.get(customerId) || []
    const moduleIndex = modules.findIndex((m) => m.moduleId === moduleId && m.status === "active")

    if (moduleIndex === -1) {
      return false
    }

    modules[moduleIndex].status = "cancelled"
    modules[moduleIndex].cancelledAt = new Date()
    modules[moduleIndex].cancelledBy = deactivatedBy
    modules[moduleIndex].cancellationReason = reason

    this.customerModules.set(customerId, modules)
    return true
  }

  // Update module configuration
  updateModuleConfig(customerId: string, moduleId: string, userCount: number, buildingCount: number): boolean {
    const modules = this.customerModules.get(customerId) || []
    const moduleIndex = modules.findIndex((m) => m.moduleId === moduleId && m.status === "active")

    if (moduleIndex === -1) {
      return false
    }

    const moduleDefinition = getModuleById(moduleId)
    if (!moduleDefinition) {
      return false
    }

    const pricing = calculateModulePrice(moduleDefinition, userCount, buildingCount)

    modules[moduleIndex].userCount = userCount
    modules[moduleIndex].buildingCount = buildingCount
    modules[moduleIndex].monthlyCost = pricing.price
    modules[moduleIndex].yearlyCost = pricing.price * 12 * 0.9

    this.customerModules.set(customerId, modules)
    return true
  }

  // Get customer's total monthly cost
  getCustomerMonthlyCost(customerId: string): number {
    const activeModules = this.getActiveCustomerModules(customerId)
    return activeModules.reduce((total, module) => total + module.monthlyCost, 0)
  }

  // Get customer's total yearly cost
  getCustomerYearlyCost(customerId: string): number {
    const activeModules = this.getActiveCustomerModules(customerId)
    return activeModules.reduce((total, module) => total + module.yearlyCost, 0)
  }

  // Track module usage
  trackModuleUsage(
    customerId: string,
    moduleId: string,
    activeUsers: number,
    totalBuildings: number,
    apiCalls: number,
    storageUsed: number,
  ): void {
    const month = new Date().toISOString().slice(0, 7) // YYYY-MM format
    const usageKey = `${customerId}-${month}`

    const existingUsage = this.moduleUsage.get(usageKey) || []
    const usageIndex = existingUsage.findIndex((u) => u.moduleId === moduleId)

    const usage: CustomerModuleUsage = {
      customerId,
      moduleId,
      month,
      activeUsers,
      totalBuildings,
      apiCalls,
      storageUsed,
      lastActivity: new Date(),
    }

    if (usageIndex >= 0) {
      existingUsage[usageIndex] = usage
    } else {
      existingUsage.push(usage)
    }

    this.moduleUsage.set(usageKey, existingUsage)
  }

  // Get module usage for a customer
  getModuleUsage(customerId: string, month?: string): CustomerModuleUsage[] {
    const targetMonth = month || new Date().toISOString().slice(0, 7)
    const usageKey = `${customerId}-${targetMonth}`
    return this.moduleUsage.get(usageKey) || []
  }

  // Get all customers using a specific module
  getModuleCustomers(moduleId: string): string[] {
    const customers: Set<string> = new Set()

    for (const [customerId, modules] of this.customerModules.entries()) {
      if (modules.some((m) => m.moduleId === moduleId && m.status === "active")) {
        customers.add(customerId)
      }
    }

    return Array.from(customers)
  }

  // Get module statistics
  getModuleStatistics(moduleId: string) {
    const customers = this.getModuleCustomers(moduleId)
    const totalRevenue = Array.from(this.customerModules.values())
      .flat()
      .filter((m) => m.moduleId === moduleId && m.status === "active")
      .reduce((sum, m) => sum + m.monthlyCost, 0)

    return {
      activeCustomers: customers.length,
      monthlyRevenue: totalRevenue,
      yearlyRevenue: totalRevenue * 12,
    }
  }

  // Convert ModuleDefinition to legacy Module interface
  static toLegacyModule(moduleDefinition: ModuleDefinition): Module {
    return {
      id: moduleDefinition.id,
      name: moduleDefinition.name,
      description: moduleDefinition.description,
      category: moduleDefinition.category,
      tier: moduleDefinition.tier,
      enabled: moduleDefinition.enabled,
      visible: moduleDefinition.visible,
      core: moduleDefinition.core,
      implemented: moduleDefinition.implemented,
      pricing: {
        basePrice: moduleDefinition.pricing.basePrice,
        model: moduleDefinition.pricing.model,
      },
      rating: moduleDefinition.rating,
      popularity: moduleDefinition.popularity,
    }
  }
}

// Export singleton instance
export const customerModuleService = new CustomerModuleService()
