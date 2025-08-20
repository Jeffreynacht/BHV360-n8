import { getModuleById, calculateModulePrice } from "./module-definitions"
import type { Module } from "./module-definitions"
import { CustomerModuleService } from "./customer-modules"
import { type ModuleAuditLog, ModuleAuditService } from "./customer-modules"

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

export interface PricingConfiguration {
  moduleIds: string[]
  userCount: number
  buildingCount: number
  billingCycle: "monthly" | "yearly"
  discountCode?: string
}

export interface PricingBreakdown {
  modules: Array<{
    id: string
    name: string
    basePrice: number
    userCost: number
    buildingCost: number
    totalCost: number
    model: string
    explanation: string
  }>
  subtotal: number
  setupFees: number
  discount: number
  discountPercentage: number
  total: number
  yearlyDiscount?: number
  finalTotal: number
}

export interface DiscountCode {
  code: string
  type: "percentage" | "fixed"
  value: number
  validUntil?: Date
  applicableModules?: string[]
  minimumSpend?: number
  maxDiscount?: number
  description: string
}

export interface YearlyOverview {
  customerId: string
  year: number
  monthlyCalculations: PricingCalculation[]
  moduleChanges: ModuleAuditLog[]
  totalCost: number
  generatedAt: Date
}

export class PricingCalculator {
  private discountCodes: Map<string, DiscountCode> = new Map()

  constructor() {
    // Initialize with some default discount codes
    this.addDiscountCode({
      code: "WELCOME10",
      type: "percentage",
      value: 10,
      description: "10% off for new customers",
      validUntil: new Date("2024-12-31"),
    })

    this.addDiscountCode({
      code: "ENTERPRISE50",
      type: "fixed",
      value: 50,
      description: "€50 off enterprise modules",
      applicableModules: ["white-label", "advanced-analytics"],
      minimumSpend: 200,
    })
  }

  // Add discount code
  addDiscountCode(discount: DiscountCode): void {
    this.discountCodes.set(discount.code.toUpperCase(), discount)
  }

  // Validate discount code
  validateDiscountCode(code: string, moduleIds: string[], subtotal: number): DiscountCode | null {
    const discount = this.discountCodes.get(code.toUpperCase())
    if (!discount) return null

    // Check expiry
    if (discount.validUntil && discount.validUntil < new Date()) {
      return null
    }

    // Check minimum spend
    if (discount.minimumSpend && subtotal < discount.minimumSpend) {
      return null
    }

    // Check applicable modules
    if (discount.applicableModules) {
      const hasApplicableModule = moduleIds.some((id) => discount.applicableModules!.includes(id))
      if (!hasApplicableModule) return null
    }

    return discount
  }

  // Calculate pricing breakdown
  calculatePricing(config: PricingConfiguration): PricingBreakdown {
    const modules = config.moduleIds.map((moduleId) => {
      const module = getModuleById(moduleId)
      if (!module) {
        throw new Error(`Module ${moduleId} not found`)
      }

      const pricing = calculateModulePrice(module, config.userCount, config.buildingCount)

      // Break down the costs
      const basePrice = module.pricing.basePrice / 100
      const userCost = ((module.pricing.perUser || 0) * config.userCount) / 100
      const buildingCost = ((module.pricing.perBuilding || 0) * config.buildingCount) / 100

      return {
        id: moduleId,
        name: module.name,
        basePrice,
        userCost,
        buildingCost,
        totalCost: pricing.price,
        model: pricing.model,
        explanation: pricing.explanation,
      }
    })

    const subtotal = modules.reduce((sum, module) => sum + module.totalCost, 0)

    // Calculate setup fees
    const setupFees = config.moduleIds.reduce((sum, moduleId) => {
      const module = getModuleById(moduleId)
      return sum + (module?.pricing.setupFee || 0) / 100
    }, 0)

    // Apply discount
    let discount = 0
    let discountPercentage = 0

    if (config.discountCode) {
      const discountCode = this.validateDiscountCode(config.discountCode, config.moduleIds, subtotal)
      if (discountCode) {
        if (discountCode.type === "percentage") {
          discount = subtotal * (discountCode.value / 100)
          discountPercentage = discountCode.value

          if (discountCode.maxDiscount) {
            discount = Math.min(discount, discountCode.maxDiscount)
          }
        } else {
          discount = discountCode.value
        }
      }
    }

    const total = subtotal - discount + setupFees

    // Apply yearly discount if applicable
    let yearlyDiscount = 0
    let finalTotal = total

    if (config.billingCycle === "yearly") {
      yearlyDiscount = total * 0.1 // 10% yearly discount
      finalTotal = total - yearlyDiscount
    }

    return {
      modules,
      subtotal,
      setupFees,
      discount,
      discountPercentage,
      total,
      yearlyDiscount,
      finalTotal,
    }
  }

  // Get pricing tiers for a module
  getPricingTiers(moduleId: string): Array<{
    userCount: number
    buildingCount: number
    monthlyPrice: number
    yearlyPrice: number
    savings: number
  }> {
    const module = getModuleById(moduleId)
    if (!module) return []

    const tiers = [
      { users: 1, buildings: 1 },
      { users: 5, buildings: 1 },
      { users: 10, buildings: 2 },
      { users: 25, buildings: 3 },
      { users: 50, buildings: 5 },
      { users: 100, buildings: 10 },
    ]

    return tiers.map((tier) => {
      const monthlyPrice = calculateModulePrice(module, tier.users, tier.buildings).price
      const yearlyPrice = monthlyPrice * 12 * 0.9 // 10% discount
      const savings = monthlyPrice * 12 - yearlyPrice

      return {
        userCount: tier.users,
        buildingCount: tier.buildings,
        monthlyPrice,
        yearlyPrice,
        savings,
      }
    })
  }

  // Calculate ROI for a module
  calculateROI(
    moduleId: string,
    userCount: number,
    buildingCount: number,
    expectedSavings: number,
  ): {
    monthlyCost: number
    yearlyCost: number
    monthsToBreakEven: number
    yearlyROI: number
  } {
    const module = getModuleById(moduleId)
    if (!module) {
      throw new Error(`Module ${moduleId} not found`)
    }

    const monthlyCost = calculateModulePrice(module, userCount, buildingCount).price
    const yearlyCost = monthlyCost * 12 * 0.9 // 10% yearly discount

    const monthsToBreakEven = (yearlyCost / expectedSavings) * 12
    const yearlyROI = ((expectedSavings - yearlyCost) / yearlyCost) * 100

    return {
      monthlyCost,
      yearlyCost,
      monthsToBreakEven,
      yearlyROI,
    }
  }

  // Get volume discounts
  getVolumeDiscounts(userCount: number): {
    discountPercentage: number
    description: string
  } {
    if (userCount >= 100) {
      return { discountPercentage: 15, description: "Enterprise volume discount" }
    } else if (userCount >= 50) {
      return { discountPercentage: 10, description: "Large team discount" }
    } else if (userCount >= 25) {
      return { discountPercentage: 5, description: "Team discount" }
    }

    return { discountPercentage: 0, description: "No volume discount" }
  }

  // Generate pricing quote
  generateQuote(config: PricingConfiguration): {
    quoteId: string
    validUntil: Date
    pricing: PricingBreakdown
    terms: string[]
    contactInfo: string
  } {
    const pricing = this.calculatePricing(config)
    const quoteId = `QUOTE-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    const validUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days

    const terms = [
      "Prices are in EUR and exclude VAT",
      "Setup fees are one-time charges",
      "Monthly subscriptions can be cancelled anytime",
      "Yearly subscriptions include 10% discount",
      "Free trial available for eligible modules",
      "Support included in all plans",
    ]

    return {
      quoteId,
      validUntil,
      pricing,
      terms,
      contactInfo: "Contact sales@bhv360.nl for questions",
    }
  }

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

// Export singleton instance
export const pricingCalculator = new PricingCalculator()
