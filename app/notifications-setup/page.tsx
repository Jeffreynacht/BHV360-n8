"use client"

import { useState } from "react"
import { useCustomer } from "@/components/customer-context"
import { NoCustomerSelected } from "@/components/no-customer-selected"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import NotificationPreferences from "@/components/notifications/notification-preferences"
import NotificationTestDashboard from "@/components/notifications/notification-test-dashboard"
import { Bell, CheckCircle, Smartphone, Mail, MessageSquare, Webhook } from "lucide-react"

export default function NotificationsSetupPage() {
  const { selectedCustomer } = useCustomer()
  const [activeTab, setActiveTab] = useState("overview")

  if (!selectedCustomer) {
    return <NoCustomerSelected />
  }

  const notificationFeatures = [
    {
      icon: Smartphone,
      title: "Push Notifications",
      description: "Real-time browser en mobiele push notificaties",
      status: "active",
      features: ["Instant delivery", "Offline queueing", "Rich notifications", "Action buttons", "Silent mode bypass"],
    },
    {
      icon: Mail,
      title: "Email Alerts",
      description: "HTML email notificaties met templates",
      status: "active",
      features: ["HTML templates", "Attachment support", "Priority routing", "Delivery tracking", "Auto-retry logic"],
    },
    {
      icon: MessageSquare,
      title: "SMS Notifications",
      description: "Kritieke alerts via SMS",
      status: "configured",
      features: [
        "Emergency bypass",
        "International support",
        "Delivery receipts",
        "Cost optimization",
        "Fallback routing",
      ],
    },
    {
      icon: Webhook,
      title: "Webhook Integration",
      description: "Integratie met externe systemen",
      status: "available",
      features: ["Custom endpoints", "Secure signatures", "Retry mechanisms", "Rate limiting", "Event filtering"],
    },
  ]

  const statusColors = {
    active: "bg-green-100 text-green-800",
    configured: "bg-blue-100 text-blue-800",
    available: "bg-gray-100 text-gray-800",
  }

  const statusLabels = {
    active: "Actief",
    configured: "Geconfigureerd",
    available: "Beschikbaar",
  }

  return (
    <div className="container p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Push Notifications & Email Alerts</h1>
        <p className="text-muted-foreground">
          Configureer en test het complete notificatie systeem voor {selectedCustomer.name}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overzicht</TabsTrigger>
          <TabsTrigger value="preferences">Voorkeuren</TabsTrigger>
          <TabsTrigger value="testing">Testen</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notificatie Systeem Status
              </CardTitle>
              <CardDescription>Overzicht van alle beschikbare notificatie kanalen en hun status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {notificationFeatures.map((feature, index) => (
                  <Card key={index} className="relative overflow-hidden">
                    <div
                      className={`h-1 ${feature.status === "active" ? "bg-green-500" : feature.status === "configured" ? "bg-blue-500" : "bg-gray-300"}`}
                    />
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <feature.icon className="h-6 w-6" />
                          <div>
                            <h3 className="font-medium">{feature.title}</h3>
                            <p className="text-sm text-muted-foreground">{feature.description}</p>
                          </div>
                        </div>
                        <Badge className={statusColors[feature.status as keyof typeof statusColors]}>
                          {statusLabels[feature.status as keyof typeof statusLabels]}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Features:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {feature.features.map((feat, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              {feat}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Systeem Status:</strong> Alle notificatie kanalen zijn operationeel. Push notifications zijn
              ingeschakeld voor {selectedCustomer.name}. Email delivery rate: 99.8%. SMS fallback is geconfigureerd voor
              kritieke alerts.
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="preferences">
          <NotificationPreferences userId="current-user" />
        </TabsContent>

        <TabsContent value="testing">
          <NotificationTestDashboard />
        </TabsContent>
      </Tabs>
    </div>
  )
}
