"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Send, Users, Clock, CheckCircle, AlertTriangle, Bell, Mail, MessageSquare, Zap } from "lucide-react"

export default function NotificationTestDashboard() {
  const [singleNotification, setSingleNotification] = useState({
    userId: "user-1",
    title: "",
    body: "",
    category: "system",
    priority: "normal",
    channels: ["push", "email"],
  })

  const [bulkNotification, setBulkNotification] = useState({
    userIds: "user-1,user-2,user-3",
    title: "",
    body: "",
    category: "system",
    priority: "normal",
  })

  const [scheduledNotification, setScheduledNotification] = useState({
    userId: "user-1",
    title: "",
    body: "",
    category: "system",
    priority: "normal",
    scheduledFor: "",
  })

  const [sending, setSending] = useState(false)
  const [lastResult, setLastResult] = useState<any>(null)

  const sendSingleNotification = async () => {
    if (!singleNotification.title || !singleNotification.body) {
      alert("Vul titel en bericht in")
      return
    }

    setSending(true)
    try {
      const response = await fetch("/api/notifications/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(singleNotification),
      })

      const result = await response.json()
      setLastResult(result)
    } catch (error) {
      console.error("Error sending notification:", error)
      setLastResult({ success: false, error: "Network error" })
    } finally {
      setSending(false)
    }
  }

  const sendBulkNotification = async () => {
    if (!bulkNotification.title || !bulkNotification.body) {
      alert("Vul titel en bericht in")
      return
    }

    const userIds = bulkNotification.userIds.split(",").map((id) => id.trim())
    const notifications = userIds.map((userId) => ({
      userId,
      title: bulkNotification.title,
      body: bulkNotification.body,
      category: bulkNotification.category,
      priority: bulkNotification.priority,
    }))

    setSending(true)
    try {
      const response = await fetch("/api/notifications/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notifications }),
      })

      const result = await response.json()
      setLastResult(result)
    } catch (error) {
      console.error("Error sending bulk notifications:", error)
      setLastResult({ success: false, error: "Network error" })
    } finally {
      setSending(false)
    }
  }

  const sendScheduledNotification = async () => {
    if (!scheduledNotification.title || !scheduledNotification.body || !scheduledNotification.scheduledFor) {
      alert("Vul alle velden in")
      return
    }

    setSending(true)
    try {
      // For demo, we'll just send immediately
      const response = await fetch("/api/notifications/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...scheduledNotification,
          scheduledFor: undefined, // Remove for immediate sending in demo
        }),
      })

      const result = await response.json()
      setLastResult({ ...result, scheduled: true, scheduledFor: scheduledNotification.scheduledFor })
    } catch (error) {
      console.error("Error scheduling notification:", error)
      setLastResult({ success: false, error: "Network error" })
    } finally {
      setSending(false)
    }
  }

  const sendEmergencyAlert = async () => {
    setSending(true)
    try {
      const response = await fetch("/api/notifications/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "user-1",
          title: "🚨 NOODGEVAL - Evacuatie Vereist",
          body: "Er is een noodsituatie gedetecteerd in het hoofdgebouw. Evacueer onmiddellijk via de dichtstbijzijnde nooduitgang. Verzamel op de parkeerplaats.",
          category: "emergency",
          priority: "critical",
          channels: ["push", "email", "sms"],
        }),
      })

      const result = await response.json()
      setLastResult(result)
    } catch (error) {
      console.error("Error sending emergency alert:", error)
      setLastResult({ success: false, error: "Network error" })
    } finally {
      setSending(false)
    }
  }

  const priorityColors = {
    low: "bg-green-100 text-green-800",
    normal: "bg-blue-100 text-blue-800",
    high: "bg-orange-100 text-orange-800",
    critical: "bg-red-100 text-red-800",
  }

  const categoryColors = {
    emergency: "bg-red-100 text-red-800",
    incident: "bg-orange-100 text-orange-800",
    training: "bg-blue-100 text-blue-800",
    maintenance: "bg-yellow-100 text-yellow-800",
    system: "bg-gray-100 text-gray-800",
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notificatie Test Dashboard
          </CardTitle>
          <CardDescription>Test verschillende soorten notificaties en bekijk de resultaten</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="single" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="single">Enkele</TabsTrigger>
              <TabsTrigger value="bulk">Bulk</TabsTrigger>
              <TabsTrigger value="scheduled">Gepland</TabsTrigger>
              <TabsTrigger value="emergency">Noodgeval</TabsTrigger>
            </TabsList>

            <TabsContent value="single" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="single-title">Titel</Label>
                  <Input
                    id="single-title"
                    value={singleNotification.title}
                    onChange={(e) => setSingleNotification((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Notificatie titel"
                  />
                </div>
                <div>
                  <Label htmlFor="single-user">Gebruiker ID</Label>
                  <Input
                    id="single-user"
                    value={singleNotification.userId}
                    onChange={(e) => setSingleNotification((prev) => ({ ...prev, userId: e.target.value }))}
                    placeholder="user-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="single-body">Bericht</Label>
                <Textarea
                  id="single-body"
                  value={singleNotification.body}
                  onChange={(e) => setSingleNotification((prev) => ({ ...prev, body: e.target.value }))}
                  placeholder="Notificatie bericht"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="single-category">Categorie</Label>
                  <Select
                    value={singleNotification.category}
                    onValueChange={(value) => setSingleNotification((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="emergency">Noodgeval</SelectItem>
                      <SelectItem value="incident">Incident</SelectItem>
                      <SelectItem value="training">Training</SelectItem>
                      <SelectItem value="maintenance">Onderhoud</SelectItem>
                      <SelectItem value="system">Systeem</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="single-priority">Prioriteit</Label>
                  <Select
                    value={singleNotification.priority}
                    onValueChange={(value) => setSingleNotification((prev) => ({ ...prev, priority: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Laag</SelectItem>
                      <SelectItem value="normal">Normaal</SelectItem>
                      <SelectItem value="high">Hoog</SelectItem>
                      <SelectItem value="critical">Kritiek</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={sendSingleNotification} disabled={sending} className="w-full">
                {sending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Verzenden...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Notificatie Verzenden
                  </>
                )}
              </Button>
            </TabsContent>

            <TabsContent value="bulk" className="space-y-4">
              <div>
                <Label htmlFor="bulk-users">Gebruiker IDs (komma gescheiden)</Label>
                <Input
                  id="bulk-users"
                  value={bulkNotification.userIds}
                  onChange={(e) => setBulkNotification((prev) => ({ ...prev, userIds: e.target.value }))}
                  placeholder="user-1,user-2,user-3"
                />
              </div>

              <div>
                <Label htmlFor="bulk-title">Titel</Label>
                <Input
                  id="bulk-title"
                  value={bulkNotification.title}
                  onChange={(e) => setBulkNotification((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Bulk notificatie titel"
                />
              </div>

              <div>
                <Label htmlFor="bulk-body">Bericht</Label>
                <Textarea
                  id="bulk-body"
                  value={bulkNotification.body}
                  onChange={(e) => setBulkNotification((prev) => ({ ...prev, body: e.target.value }))}
                  placeholder="Bulk notificatie bericht"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bulk-category">Categorie</Label>
                  <Select
                    value={bulkNotification.category}
                    onValueChange={(value) => setBulkNotification((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="emergency">Noodgeval</SelectItem>
                      <SelectItem value="incident">Incident</SelectItem>
                      <SelectItem value="training">Training</SelectItem>
                      <SelectItem value="maintenance">Onderhoud</SelectItem>
                      <SelectItem value="system">Systeem</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="bulk-priority">Prioriteit</Label>
                  <Select
                    value={bulkNotification.priority}
                    onValueChange={(value) => setBulkNotification((prev) => ({ ...prev, priority: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Laag</SelectItem>
                      <SelectItem value="normal">Normaal</SelectItem>
                      <SelectItem value="high">Hoog</SelectItem>
                      <SelectItem value="critical">Kritiek</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={sendBulkNotification} disabled={sending} className="w-full">
                {sending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Verzenden...
                  </>
                ) : (
                  <>
                    <Users className="h-4 w-4 mr-2" />
                    Bulk Notificaties Verzenden
                  </>
                )}
              </Button>
            </TabsContent>

            <TabsContent value="scheduled" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="scheduled-title">Titel</Label>
                  <Input
                    id="scheduled-title"
                    value={scheduledNotification.title}
                    onChange={(e) => setScheduledNotification((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Geplande notificatie titel"
                  />
                </div>
                <div>
                  <Label htmlFor="scheduled-time">Geplande tijd</Label>
                  <Input
                    id="scheduled-time"
                    type="datetime-local"
                    value={scheduledNotification.scheduledFor}
                    onChange={(e) => setScheduledNotification((prev) => ({ ...prev, scheduledFor: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="scheduled-body">Bericht</Label>
                <Textarea
                  id="scheduled-body"
                  value={scheduledNotification.body}
                  onChange={(e) => setScheduledNotification((prev) => ({ ...prev, body: e.target.value }))}
                  placeholder="Geplande notificatie bericht"
                  rows={3}
                />
              </div>

              <Button onClick={sendScheduledNotification} disabled={sending} className="w-full">
                {sending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Plannen...
                  </>
                ) : (
                  <>
                    <Clock className="h-4 w-4 mr-2" />
                    Notificatie Plannen
                  </>
                )}
              </Button>
            </TabsContent>

            <TabsContent value="emergency" className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Let op:</strong> Dit verstuurt een kritieke noodmelding naar alle kanalen. Gebruik alleen voor
                  echte noodsituaties of tests.
                </AlertDescription>
              </Alert>

              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h3 className="font-medium text-red-900 mb-2">Noodgeval Alert Preview:</h3>
                <div className="space-y-2">
                  <p>
                    <strong>Titel:</strong> 🚨 NOODGEVAL - Evacuatie Vereist
                  </p>
                  <p>
                    <strong>Bericht:</strong> Er is een noodsituatie gedetecteerd in het hoofdgebouw. Evacueer
                    onmiddellijk via de dichtstbijzijnde nooduitgang. Verzamel op de parkeerplaats.
                  </p>
                  <p>
                    <strong>Kanalen:</strong> Push, Email, SMS
                  </p>
                  <p>
                    <strong>Prioriteit:</strong> Kritiek
                  </p>
                </div>
              </div>

              <Button onClick={sendEmergencyAlert} disabled={sending} className="w-full bg-red-600 hover:bg-red-700">
                {sending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Verzenden...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />🚨 NOODGEVAL ALERT VERZENDEN
                  </>
                )}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Results */}
      {lastResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {lastResult.success ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-500" />
              )}
              Resultaat
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant={lastResult.success ? "default" : "destructive"}>
                  {lastResult.success ? "Succesvol" : "Mislukt"}
                </Badge>
                {lastResult.scheduled && <Badge variant="secondary">Gepland</Badge>}
              </div>

              {lastResult.notificationId && (
                <p>
                  <strong>Notificatie ID:</strong> {lastResult.notificationId}
                </p>
              )}

              {lastResult.count && (
                <p>
                  <strong>Aantal verzonden:</strong> {lastResult.count}
                </p>
              )}

              {lastResult.scheduledFor && (
                <p>
                  <strong>Gepland voor:</strong> {new Date(lastResult.scheduledFor).toLocaleString("nl-NL")}
                </p>
              )}

              {lastResult.results && (
                <div>
                  <strong>Kanaal resultaten:</strong>
                  <div className="mt-2 space-y-1">
                    {lastResult.results.map((result: any, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        {result.channel === "push" && <Bell className="h-4 w-4" />}
                        {result.channel === "email" && <Mail className="h-4 w-4" />}
                        {result.channel === "sms" && <MessageSquare className="h-4 w-4" />}
                        <span className="capitalize">{result.channel}</span>
                        <Badge variant={result.success ? "default" : "destructive"} className="text-xs">
                          {result.success ? "OK" : "Fout"}
                        </Badge>
                        {result.error && <span className="text-xs text-red-600">({result.error})</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {lastResult.error && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Fout:</strong> {lastResult.error}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
