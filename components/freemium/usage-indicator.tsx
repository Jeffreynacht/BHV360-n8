"use client"

import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Users, Building2, AlertCircle, Database, Zap } from "lucide-react"
import { UsageTracker, SubscriptionService } from "@/lib/freemium/usage-tracker"
import { SUBSCRIPTION_PLANS, SubscriptionTier } from "@/lib/freemium/free-tier-definitions"
import { UpgradePrompt } from "./upgrade-prompt"

interface UsageIndicatorProps {
  customerId: string
}

export function UsageIndicator({ customerId }: UsageIndicatorProps) {
  const [usage, setUsage] = useState<any>(null)
  const [subscription, setSubscription] = useState<any>(null)
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [upgradeContext, setUpgradeContext] = useState<string>("")

  useEffect(() => {
    loadUsageData()
  }, [customerId])

  const loadUsageData = async () => {
    try {
      const [usageData, subData] = await Promise.all([
        UsageTracker.getCurrentUsage(customerId),
        SubscriptionService.getCustomerSubscription(customerId),
      ])
      setUsage(usageData)
      setSubscription(subData)
    } catch (error) {
      console.error("Error loading usage data:", error)
    }
  }

  const handleUpgradeClick = (context: string) => {
    setUpgradeContext(context)
    setShowUpgrade(true)
  }

  if (!usage || !subscription) {
    return <div>Laden...</div>
  }

  const plan = SUBSCRIPTION_PLANS.find((p) => p.tier === subscription.tier)
  if (!plan) return null

  const getUsagePercentage = (current: number, limit: number | null) => {
    if (limit === null) return 0 // Unlimited
    return Math.min((current / limit) * 100, 100)
  }

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return "text-red-500"
    if (percentage >= 75) return "text-yellow-500"
    return "text-green-500"
  }

  const usageItems = [
    {
      icon: Users,
      label: "Gebruikers",
      current: usage.users,
      limit: plan.limits.maxUsers,
      key: "users",
    },
    {
      icon: Building2,
      label: "Gebouwen",
      current: usage.buildings,
      limit: plan.limits.maxBuildings,
      key: "buildings",
    },
    {
      icon: AlertCircle,
      label: "Incidenten (deze maand)",
      current: usage.incidents,
      limit: plan.limits.maxIncidentsPerMonth,
      key: "incidents",
    },
    {
      icon: Database,
      label: "Opslag (GB)",
      current: usage.storageUsedGB,
      limit: plan.limits.maxStorageGB,
      key: "storage",
    },
  ]

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Plan Gebruik - {plan.name}
            {subscription.tier === SubscriptionTier.FREE && (
              <Badge variant="secondary" className="ml-2">
                Gratis
              </Badge>
            )}
          </CardTitle>
          <CardDescription>Overzicht van je huidige gebruik en limieten</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {usageItems.map((item) => {
              const percentage = getUsagePercentage(item.current, item.limit)
              const isNearLimit = percentage >= 75
              const isAtLimit = percentage >= 90

              return (
                <div key={item.key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${getUsageColor(percentage)}`}>
                        {item.current}
                        {item.limit !== null && ` / ${item.limit}`}
                        {item.limit === null && " (onbeperkt)"}
                      </span>
                      {isAtLimit && <AlertTriangle className="h-4 w-4 text-red-500" />}
                    </div>
                  </div>
                  {item.limit !== null && (
                    <div className="space-y-1">
                      <Progress value={percentage} className="h-2" />
                      {isNearLimit && (
                        <div className="flex items-center justify-between text-xs">
                          <span className={getUsageColor(percentage)}>{percentage.toFixed(0)}% gebruikt</span>
                          {subscription.tier === SubscriptionTier.FREE && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpgradeClick(item.key)}
                              className="h-6 px-2 text-xs"
                            >
                              Upgrade
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {subscription.tier === SubscriptionTier.FREE && (
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-blue-500" />
                <span className="font-semibold">Upgrade voor meer mogelijkheden!</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Krijg toegang tot onbeperkte gebruikers, geavanceerde functies en priority support.
              </p>
              <Button onClick={() => handleUpgradeClick("general")} size="sm">
                Bekijk Upgrade Opties
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <UpgradePrompt
        isOpen={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        currentTier={subscription.tier}
        limitType={upgradeContext}
        customerId={customerId}
      />
    </>
  )
}
