// Usage tracking voor free tier limieten
export interface UsageStats {
  customerId: string
  period: string // YYYY-MM format
  users: number
  buildings: number
  incidents: number
  nfcTags: number
  storageUsedGB: number
  apiCalls: number
  lastUpdated: Date
}

export class UsageTracker {
  static async getCurrentUsage(customerId: string): Promise<UsageStats> {
    const currentPeriod = new Date().toISOString().slice(0, 7) // YYYY-MM

    // In productie zou dit uit database komen
    const stored = localStorage.getItem(`usage_${customerId}_${currentPeriod}`)
    if (stored) {
      const usage = JSON.parse(stored)
      return {
        ...usage,
        lastUpdated: new Date(usage.lastUpdated),
      }
    }

    // Default usage stats
    return {
      customerId,
      period: currentPeriod,
      users: 1,
      buildings: 1,
      incidents: 0,
      nfcTags: 0,
      storageUsedGB: 0.1,
      apiCalls: 0,
      lastUpdated: new Date(),
    }
  }

  static async updateUsage(customerId: string, updates: Partial<UsageStats>): Promise<void> {
    const currentUsage = await this.getCurrentUsage(customerId)
    const updatedUsage = {
      ...currentUsage,
      ...updates,
      lastUpdated: new Date(),
    }

    const currentPeriod = new Date().toISOString().slice(0, 7)
    localStorage.setItem(`usage_${customerId}_${currentPeriod}`, JSON.stringify(updatedUsage))
  }

  static async checkLimit(
    customerId: string,
    limitType: keyof UsageStats,
    increment = 1,
  ): Promise<{ allowed: boolean; current: number; limit: number | null; percentage: number }> {
    const usage = await this.getCurrentUsage(customerId)
    const subscription = await SubscriptionService.getCustomerSubscription(customerId)
    const plan = SUBSCRIPTION_PLANS.find((p) => p.tier === subscription.tier)

    if (!plan) {
      return { allowed: false, current: 0, limit: 0, percentage: 100 }
    }

    const limit = plan.limits[limitType as keyof typeof plan.limits] as number | null
    const current = usage[limitType] as number

    if (limit === null) {
      // Unlimited
      return { allowed: true, current, limit: null, percentage: 0 }
    }

    const newValue = current + increment
    const allowed = newValue <= limit
    const percentage = Math.round((current / limit) * 100)

    return { allowed, current, limit, percentage }
  }

  static async incrementUsage(customerId: string, limitType: keyof UsageStats, amount = 1): Promise<boolean> {
    const check = await this.checkLimit(customerId, limitType, amount)

    if (check.allowed) {
      const updates = { [limitType]: check.current + amount }
      await this.updateUsage(customerId, updates)
      return true
    }

    return false
  }
}

// Subscription service
export interface CustomerSubscription {
  customerId: string
  tier: SubscriptionTier
  startDate: Date
  endDate?: Date
  isActive: boolean
  trialEndDate?: Date
  paymentStatus: "active" | "past_due" | "canceled" | "trial"
}

export class SubscriptionService {
  static async getCustomerSubscription(customerId: string): Promise<CustomerSubscription> {
    // In productie uit database
    const stored = localStorage.getItem(`subscription_${customerId}`)
    if (stored) {
      const sub = JSON.parse(stored)
      return {
        ...sub,
        startDate: new Date(sub.startDate),
        endDate: sub.endDate ? new Date(sub.endDate) : undefined,
        trialEndDate: sub.trialEndDate ? new Date(sub.trialEndDate) : undefined,
      }
    }

    // Default: free tier
    return {
      customerId,
      tier: SubscriptionTier.FREE,
      startDate: new Date(),
      isActive: true,
      paymentStatus: "active",
    }
  }

  static async startFreeTrial(customerId: string, tier: SubscriptionTier): Promise<boolean> {
    const trialDays = 14
    const trialEndDate = new Date()
    trialEndDate.setDate(trialEndDate.getDate() + trialDays)

    const subscription: CustomerSubscription = {
      customerId,
      tier,
      startDate: new Date(),
      isActive: true,
      trialEndDate,
      paymentStatus: "trial",
    }

    localStorage.setItem(`subscription_${customerId}`, JSON.stringify(subscription))
    return true
  }

  static async upgradeSubscription(customerId: string, newTier: SubscriptionTier): Promise<boolean> {
    const currentSub = await this.getCustomerSubscription(customerId)

    const upgradedSub: CustomerSubscription = {
      ...currentSub,
      tier: newTier,
      paymentStatus: "active",
      trialEndDate: undefined, // Remove trial when upgrading
    }

    localStorage.setItem(`subscription_${customerId}`, JSON.stringify(upgradedSub))
    return true
  }
}

// Declare SUBSCRIPTION_PLANS and SubscriptionTier
const SUBSCRIPTION_PLANS = [
  {
    tier: "FREE",
    limits: {
      users: 10,
      buildings: 5,
      incidents: 100,
      nfcTags: 50,
      storageUsedGB: 1,
      apiCalls: 1000,
    },
  },
  {
    tier: "PRO",
    limits: {
      users: 100,
      buildings: 50,
      incidents: 1000,
      nfcTags: 500,
      storageUsedGB: 10,
      apiCalls: 10000,
    },
  },
]

enum SubscriptionTier {
  FREE = "FREE",
  PRO = "PRO",
}
