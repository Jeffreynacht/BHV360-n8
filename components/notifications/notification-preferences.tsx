"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Bell, Mail, MessageSquare, Webhook, Clock, Shield, CheckCircle, AlertTriangle, Settings } from "lucide-react"

interface NotificationPreferences {
  userId: string
  channels: {
    push: boolean
    email: boolean
    sms: boolean
    webhook: boolean
  }
  emergencyBypass: boolean
  quietHours: {
    enabled: boolean
    start: string
    end: string
  }
  categories: {
    emergency: boolean
    incidents: boolean
    training: boolean
    maintenance: boolean
    system: boolean
  }
}

export default function NotificationPreferences({ userId }: { userId: string }) {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    userId,
    channels: {
      push: true,
      email: true,
      sms: false,
      webhook: false,
    },
    emergencyBypass: true,
    quietHours: {
      enabled: true,
      start: "22:00",
      end: "07:00",
    },
    categories: {
      emergency: true,
      incidents: true,
      training: true,
      maintenance: true,
      system: false,
    },
  })

  const [pushSupported, setPushSupported] = useState(false)
  const [pushSubscribed, setPushSubscribed] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    // Check if push notifications are supported
    setPushSupported("serviceWorker" in navigator && "PushManager" in window)

    // Check if already subscribed
    checkPushSubscription()

    // Load saved preferences
    loadPreferences()
  }, [userId])

  const checkPushSubscription = async () => {
    if ("serviceWorker" in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready
        const subscription = await registration.pushManager.getSubscription()
        setPushSubscribed(!!subscription)
      } catch (error) {
        console.error("Error checking push subscription:", error)
      }
    }
  }

  const loadPreferences = () => {
    const stored = localStorage.getItem(`notification_preferences_${userId}`)
    if (stored) {
      setPreferences(JSON.parse(stored))
    }
  }

  const savePreferences = async () => {
    setSaving(true)
    try {
      // Save to localStorage (in production, save to database)
      localStorage.setItem(`notification_preferences_${userId}`, JSON.stringify(preferences))

      // If push notifications are enabled but not subscribed, request permission
      if (preferences.channels.push && !pushSubscribed) {
        await subscribeToPush()
      }

      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call
    } catch (error) {
      console.error("Error saving preferences:", error)
    } finally {
      setSaving(false)
    }
  }

  const subscribeToPush = async () => {
    if (!pushSupported) return

    try {
      const permission = await Notification.requestPermission()
      if (permission !== "granted") {
        throw new Error("Push notification permission denied")
      }

      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: "BLBz-HXFSjHdJyFjKxfFHPGeGgHgJP_zLNYOFQJZMECJQqLxK8RuOLCFxUXiL_LQ-0i8qQXYqKKLEHeAGZ8hDHo",
      })

      // Save subscription to server
      await fetch("/api/notifications/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, subscription }),
      })

      setPushSubscribed(true)
    } catch (error) {
      console.error("Error subscribing to push notifications:", error)
      setPreferences((prev) => ({
        ...prev,
        channels: { ...prev.channels, push: false },
      }))
    }
  }

  const testNotification = async (type: "push" | "email" | "sms") => {
    try {
      await fetch("/api/notifications/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          title: `Test ${type.toUpperCase()} Notificatie`,
          body: `Dit is een test notificatie via ${type}. Als je dit ziet, werkt het systeem correct!`,
          category: "system",
          priority: "normal",
          channels: [type],
        }),
      })
    } catch (error) {
      console.error(`Error sending test ${type} notification:`, error)
    }
  }

  const updateChannel = (channel: keyof typeof preferences.channels, enabled: boolean) => {
    setPreferences((prev) => ({
      ...prev,
      channels: { ...prev.channels, [channel]: enabled },
    }))
  }

  const updateCategory = (category: keyof typeof preferences.categories, enabled: boolean) => {
    setPreferences((prev) => ({
      ...prev,
      categories: { ...prev.categories, [category]: enabled },
    }))
  }

  const channelIcons = {
    push: Bell,
    email: Mail,
    sms: MessageSquare,
    webhook: Webhook,
  }

  const categoryLabels = {
    emergency: { label: "Noodsituaties", color: "bg-red-100 text-red-800" },
    incidents: { label: "Incidenten", color: "bg-orange-100 text-orange-800" },
    training: { label: "Trainingen", color: "bg-blue-100 text-blue-800" },
    maintenance: { label: "Onderhoud", color: "bg-yellow-100 text-yellow-800" },
    system: { label: "Systeem", color: "bg-gray-100 text-gray-800" },
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Notificatie Voorkeuren
          </CardTitle>
          <CardDescription>Configureer hoe en wanneer je notificaties wilt ontvangen</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Notification Channels */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Notificatie Kanalen</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(preferences.channels).map(([channel, enabled]) => {
                const Icon = channelIcons[channel as keyof typeof channelIcons]
                const isSupported = channel !== "push" || pushSupported

                return (
                  <div key={channel} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5" />
                      <div>
                        <Label className="capitalize">{channel === "sms" ? "SMS" : channel}</Label>
                        {channel === "push" && !isSupported && (
                          <p className="text-xs text-muted-foreground">Niet ondersteund</p>
                        )}
                        {channel === "push" && isSupported && pushSubscribed && (
                          <p className="text-xs text-green-600">Geactiveerd</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={enabled && isSupported}
                        onCheckedChange={(checked) =>
                          updateChannel(channel as keyof typeof preferences.channels, checked)
                        }
                        disabled={!isSupported}
                      />
                      {enabled && isSupported && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => testNotification(channel as "push" | "email" | "sms")}
                        >
                          Test
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <Separator />

          {/* Emergency Bypass */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Noodgeval Instellingen</h3>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-red-500" />
                <div>
                  <Label>Noodgeval Bypass</Label>
                  <p className="text-sm text-muted-foreground">Kritieke notificaties negeren stille uren</p>
                </div>
              </div>
              <Switch
                checked={preferences.emergencyBypass}
                onCheckedChange={(checked) => setPreferences((prev) => ({ ...prev, emergencyBypass: checked }))}
              />
            </div>
          </div>

          <Separator />

          {/* Quiet Hours */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Stille Uren</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5" />
                  <Label>Stille uren inschakelen</Label>
                </div>
                <Switch
                  checked={preferences.quietHours.enabled}
                  onCheckedChange={(checked) =>
                    setPreferences((prev) => ({
                      ...prev,
                      quietHours: { ...prev.quietHours, enabled: checked },
                    }))
                  }
                />
              </div>

              {preferences.quietHours.enabled && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="quiet-start">Start tijd</Label>
                    <Input
                      id="quiet-start"
                      type="time"
                      value={preferences.quietHours.start}
                      onChange={(e) =>
                        setPreferences((prev) => ({
                          ...prev,
                          quietHours: { ...prev.quietHours, start: e.target.value },
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="quiet-end">Eind tijd</Label>
                    <Input
                      id="quiet-end"
                      type="time"
                      value={preferences.quietHours.end}
                      onChange={(e) =>
                        setPreferences((prev) => ({
                          ...prev,
                          quietHours: { ...prev.quietHours, end: e.target.value },
                        }))
                      }
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Notification Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Notificatie Categorieën</h3>
            <div className="space-y-3">
              {Object.entries(preferences.categories).map(([category, enabled]) => {
                const config = categoryLabels[category as keyof typeof categoryLabels]

                return (
                  <div key={category} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge className={config.color}>{config.label}</Badge>
                      {category === "emergency" && <AlertTriangle className="h-4 w-4 text-red-500" />}
                    </div>
                    <Switch
                      checked={enabled}
                      onCheckedChange={(checked) =>
                        updateCategory(category as keyof typeof preferences.categories, checked)
                      }
                    />
                  </div>
                )
              })}
            </div>
          </div>

          <Separator />

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={savePreferences} disabled={saving}>
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Opslaan...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Voorkeuren Opslaan
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Status Alert */}
      <Alert>
        <Bell className="h-4 w-4" />
        <AlertDescription>
          <strong>Status:</strong> Notificaties zijn{" "}
          {Object.values(preferences.channels).some(Boolean) ? "ingeschakeld" : "uitgeschakeld"}.
          {preferences.emergencyBypass && " Noodgeval bypass is actief."}
          {preferences.quietHours.enabled &&
            ` Stille uren: ${preferences.quietHours.start} - ${preferences.quietHours.end}.`}
        </AlertDescription>
      </Alert>
    </div>
  )
}
