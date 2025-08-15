"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Mail, MessageSquare, Monitor } from "lucide-react"

export default function AlertSetup() {
  const [discordWebhook, setDiscordWebhook] = useState("")
  const [emailConfig, setEmailConfig] = useState({
    host: "smtp.gmail.com",
    port: "587",
    user: "",
    pass: "",
    alertEmail: "",
  })

  const testBrowserNotification = async () => {
    if (!("Notification" in window)) {
      alert("Browser notifications not supported")
      return
    }

    if (Notification.permission === "default") {
      const permission = await Notification.requestPermission()
      if (permission !== "granted") return
    }

    new Notification("BHV360 Test Alert", {
      body: "Browser notifications are working!",
      icon: "/favicon.ico",
    })
  }

  const testDiscordWebhook = async () => {
    if (!discordWebhook) {
      alert("Please enter Discord webhook URL first")
      return
    }

    try {
      await fetch(discordWebhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          embeds: [
            {
              title: "🧪 BHV360 Test Alert",
              description: "Discord webhook is working correctly!",
              color: 3447003,
              timestamp: new Date().toISOString(),
            },
          ],
        }),
      })
      alert("Discord test sent! Check your Discord channel.")
    } catch (error) {
      alert("Discord test failed. Check your webhook URL.")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Alert Configuration</h2>
        <p className="text-muted-foreground">Setup gratis alerting voor je BHV360 monitoring</p>
      </div>

      <Tabs defaultValue="browser" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="browser">Browser</TabsTrigger>
          <TabsTrigger value="discord">Discord</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="console">Console</TabsTrigger>
        </TabsList>

        <TabsContent value="browser">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Browser Notifications
              </CardTitle>
              <CardDescription>Gratis real-time notifications direct in je browser</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Status</p>
                  <p className="text-sm text-muted-foreground">
                    {Notification?.permission === "granted" ? "Enabled" : "Not enabled"}
                  </p>
                </div>
                <Badge variant={Notification?.permission === "granted" ? "default" : "secondary"}>
                  {Notification?.permission === "granted" ? "Active" : "Inactive"}
                </Badge>
              </div>

              <Button onClick={testBrowserNotification} className="w-full">
                Test Browser Notification
              </Button>

              <div className="text-sm text-muted-foreground">
                <p>
                  <strong>Voordelen:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Volledig gratis</li>
                  <li>Real-time alerts</li>
                  <li>Geen externe service nodig</li>
                  <li>Werkt ook als tab niet actief is</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="discord">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Discord Webhooks
              </CardTitle>
              <CardDescription>Gratis alerts naar je Discord server</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="discord-webhook">Discord Webhook URL</Label>
                <Input
                  id="discord-webhook"
                  placeholder="https://discord.com/api/webhooks/..."
                  value={discordWebhook}
                  onChange={(e) => setDiscordWebhook(e.target.value)}
                />
              </div>

              <Button onClick={testDiscordWebhook} className="w-full">
                Test Discord Webhook
              </Button>

              <div className="text-sm text-muted-foreground">
                <p>
                  <strong>Setup:</strong>
                </p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Ga naar je Discord server</li>
                  <li>Server Settings → Integrations → Webhooks</li>
                  <li>Create Webhook → Copy URL</li>
                  <li>Plak URL hierboven en test</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Alerts
              </CardTitle>
              <CardDescription>Gratis email notifications via Gmail</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email-user">Gmail Address</Label>
                  <Input
                    id="email-user"
                    placeholder="your-email@gmail.com"
                    value={emailConfig.user}
                    onChange={(e) => setEmailConfig((prev) => ({ ...prev, user: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="email-pass">App Password</Label>
                  <Input
                    id="email-pass"
                    type="password"
                    placeholder="Gmail app password"
                    value={emailConfig.pass}
                    onChange={(e) => setEmailConfig((prev) => ({ ...prev, pass: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="alert-email">Alert Email</Label>
                <Input
                  id="alert-email"
                  placeholder="alerts@yourdomain.com"
                  value={emailConfig.alertEmail}
                  onChange={(e) => setEmailConfig((prev) => ({ ...prev, alertEmail: e.target.value }))}
                />
              </div>

              <div className="text-sm text-muted-foreground">
                <p>
                  <strong>Gmail App Password Setup:</strong>
                </p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Google Account → Security → 2-Step Verification</li>
                  <li>App passwords → Generate password</li>
                  <li>Use generated password (not your regular password)</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="console">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                Console Logging
              </CardTitle>
              <CardDescription>Simpele logging naar browser console (altijd gratis)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm">
                  Console logging is altijd actief. Open Developer Tools (F12) om alerts te zien.
                </p>
              </div>

              <div className="text-sm text-muted-foreground">
                <p>
                  <strong>Voordelen:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Geen setup nodig</li>
                  <li>Altijd beschikbaar</li>
                  <li>Perfect voor development</li>
                  <li>Geen externe dependencies</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
