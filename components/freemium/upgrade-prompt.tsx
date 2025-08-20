"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Zap, Crown, Building2, Users } from "lucide-react"
import { SUBSCRIPTION_PLANS, SubscriptionTier } from "@/lib/freemium/free-tier-definitions"
import { SubscriptionService } from "@/lib/freemium/usage-tracker"

interface UpgradePromptProps {
  isOpen: boolean
  onClose: () => void
  currentTier: SubscriptionTier
  limitType?: string
  customerId: string
}

export function UpgradePrompt({ isOpen, onClose, currentTier, limitType, customerId }: UpgradePromptProps) {
  const [loading, setLoading] = useState<string | null>(null)

  const handleStartTrial = async (tier: SubscriptionTier) => {
    setLoading(tier)
    try {
      await SubscriptionService.startFreeTrial(customerId, tier)
      onClose()
      window.location.reload() // Refresh to show new features
    } catch (error) {
      console.error("Error starting trial:", error)
    } finally {
      setLoading(null)
    }
  }

  const handleUpgrade = async (tier: SubscriptionTier) => {
    setLoading(tier)
    try {
      await SubscriptionService.upgradeSubscription(customerId, tier)
      onClose()
      window.location.reload()
    } catch (error) {
      console.error("Error upgrading:", error)
    } finally {
      setLoading(null)
    }
  }

  const getLimitMessage = () => {
    switch (limitType) {
      case "users":
        return "Je hebt het maximum aantal gebruikers bereikt voor je huidige plan."
      case "buildings":
        return "Je hebt het maximum aantal gebouwen bereikt voor je huidige plan."
      case "incidents":
        return "Je hebt het maximum aantal incidenten voor deze maand bereikt."
      case "nfcTags":
        return "Je hebt het maximum aantal NFC tags bereikt voor je huidige plan."
      case "storage":
        return "Je hebt je opslaglimiet bereikt voor je huidige plan."
      default:
        return "Upgrade je plan om toegang te krijgen tot meer functies."
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Upgrade je BHV360 Plan
          </DialogTitle>
          <DialogDescription>{getLimitMessage()}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {SUBSCRIPTION_PLANS.filter((plan) => plan.tier !== SubscriptionTier.FREE).map((plan) => {
            const isCurrentTier = plan.tier === currentTier
            const isTrial = plan.tier === SubscriptionTier.STARTER || plan.tier === SubscriptionTier.PROFESSIONAL

            return (
              <Card key={plan.tier} className={`relative ${plan.popular ? "border-primary shadow-lg" : ""}`}>
                {plan.popular && (
                  <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary">
                    Meest Populair
                  </Badge>
                )}

                <CardHeader className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    {plan.tier === SubscriptionTier.ENTERPRISE ? (
                      <Crown className="h-8 w-8 text-purple-500" />
                    ) : plan.tier === SubscriptionTier.PROFESSIONAL ? (
                      <Building2 className="h-8 w-8 text-blue-500" />
                    ) : (
                      <Users className="h-8 w-8 text-green-500" />
                    )}
                  </div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="text-3xl font-bold mt-2">
                    {plan.tier === SubscriptionTier.ENTERPRISE ? (
                      "Op maat"
                    ) : (
                      <>
                        €{(plan.pricePerUser / 100).toFixed(2)}
                        <span className="text-sm font-normal text-muted-foreground">/gebruiker/maand</span>
                      </>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-2 mb-6">
                    {plan.features.slice(0, 6).map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                    {plan.features.length > 6 && (
                      <div className="text-sm text-muted-foreground">+{plan.features.length - 6} meer functies...</div>
                    )}
                  </div>

                  {isCurrentTier ? (
                    <Button disabled className="w-full">
                      Huidige Plan
                    </Button>
                  ) : plan.tier === SubscriptionTier.ENTERPRISE ? (
                    <Button variant="outline" className="w-full">
                      Contact Opnemen
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      {isTrial && currentTier === SubscriptionTier.FREE && (
                        <Button
                          onClick={() => handleStartTrial(plan.tier)}
                          disabled={loading === plan.tier}
                          className="w-full"
                          variant="outline"
                        >
                          {loading === plan.tier ? "Bezig..." : "14 Dagen Gratis Proberen"}
                        </Button>
                      )}
                      <Button
                        onClick={() => handleUpgrade(plan.tier)}
                        disabled={loading === plan.tier}
                        className="w-full"
                        variant={plan.popular ? "default" : "outline"}
                      >
                        {loading === plan.tier ? "Bezig..." : "Upgrade Nu"}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="font-semibold mb-2">Waarom upgraden?</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>Onbeperkte gebruikers & gebouwen</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>Real-time monitoring & alerts</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>Geavanceerde analytics & rapportages</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>Priority support & training</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
