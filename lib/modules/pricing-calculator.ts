import type { Module } from "./module-definitions"
import { CustomerModuleService } from "./customer-modules"

export interface PricingCalculation {
  customerId: string
  period: "monthly" | "yearly"
  modules: ModulePricing[]
  totalUsers: number
  totalBuildings: number
  subtotal: number // In euro cents
  discount: number // In euro cents
  total: number // In euro cents
  calculatedAt: Date
}

export interface ModulePricing {
  moduleId: string
  moduleName: string
  quantity: number
  unitPrice: number // In euro cents
  totalPrice: number // In euro cents
  pricingType: string
}

export class PricingCalculator {
  static async calculateCustomerPricing(
    customerId: string,
    userCount: number,
    buildingCount = 1,
    period: "monthly" | "yearly" = "monthly",
  ): Promise<PricingCalculation> {
    const enabledModules = await CustomerModuleService.getEnabledModules(customerId)
    const modulePricings: ModulePricing[] = []
    let subtotal = 0

    for (const module of enabledModules) {
      const pricing = this.calculateModulePricing(module, userCount, buildingCount)
      modulePricings.push(pricing)
      subtotal += pricing.totalPrice
    }

    // Apply yearly discount (10%)
    const yearlyMultiplier = period === "yearly" ? 12 : 1
    const discount = period === "yearly" ? Math.round(subtotal * yearlyMultiplier * 0.1) : 0
    const total = subtotal * yearlyMultiplier - discount

    return {
      customerId,
      period,
      modules: modulePricings,
      totalUsers: userCount,
      totalBuildings: buildingCount,
      subtotal: subtotal * yearlyMultiplier,
      discount,
      total,
      calculatedAt: new Date(),
    }
  }

  private static calculateModulePricing(module: Module, userCount: number, buildingCount: number): ModulePricing {
    let quantity = 0
    let unitPrice = module.pricing.basePrice
    let totalPrice = 0

    switch (module.pricing.type) {
      case "per_user":
        quantity = userCount

        // Check for tier pricing
        if (module.pricing.tierPricing) {
          const tier = module.pricing.tierPricing.find(
            (t) => userCount >= t.minUsers && (!t.maxUsers || userCount <= t.maxUsers),
          )
          if (tier) {
            unitPrice = tier.pricePerUser
          }
        }

        totalPrice = quantity * unitPrice
        break

      case "per_building":
        quantity = buildingCount
        totalPrice = quantity * unitPrice
        break

      case "per_customer":
        quantity = 1
        totalPrice = unitPrice
        break

      case "fixed":
        quantity = 1
        totalPrice = unitPrice
        break
    }

    return {
      moduleId: module.id,
      moduleName: module.name,
      quantity,
      unitPrice,
      totalPrice,
      pricingType: module.pricing.type,
    }
  }

  // Generate yearly overview for a customer
  static async generateYearlyOverview(customerId: string, year: number): Promise<YearlyOverview> {
    const startDate = new Date(year, 0, 1)
    const endDate = new Date(year, 11, 31)

    // Get module changes during the year
    const auditLogs = await ModuleAuditService.getAuditLogs(customerId)
    const yearLogs = auditLogs.filter((log) => log.timestamp >= startDate && log.timestamp <= endDate)

    // Calculate monthly costs
    const monthlyCalculations: PricingCalculation[] = []

    for (let month = 0; month < 12; month++) {
      const monthDate = new Date(year, month, 1)
      // Hier zou je de module status voor die maand moeten bepalen
      // Voor nu gebruiken we de huidige status
      const calculation = await this.calculateCustomerPricing(customerId, 25, 1, "monthly")
      monthlyCalculations.push(calculation)
    }

    const totalCost = monthlyCalculations.reduce((sum, calc) => sum + calc.total, 0)

    return {
      customerId,
      year,
      monthlyCalculations,
      moduleChanges: yearLogs,
      totalCost,
      generatedAt: new Date(),
    }
  }
}

export interface YearlyOverview {
  customerId: string
  year: number
  monthlyCalculations: PricingCalculation[]
  moduleChanges: ModuleAuditLog[]
  totalCost: number
  generatedAt: Date
}

// Import the audit log interface
import { type ModuleAuditLog, ModuleAuditService } from "./customer-modules"
