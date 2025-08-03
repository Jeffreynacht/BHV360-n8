"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Bell, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { browserAlerts } from "@/lib/monitoring/browser-alerts"

export default function NotificationSetup() {
  const [permission, setPermission] = useState<NotificationPermission>("default")
  const [isSupported, setIsSupported] = useState(false)
  const [isRequesting, setIsRequesting] = useState(false)

  useEffect(() => {
    setIsSupported(browserAlerts.isNotificationSupported())
    setPermission(browserAlerts.getPermissionStatus())
  }, [])

  const requestPermission = async () => {
    setIsRequesting(true)
    try {
      const granted = await browserAlerts.requestPermission()
      setPermission(granted ? "granted" : "denied")
    } catch (error) {
      console.error("Failed to request permission:", error)
    } finally {
      setIsRequesting(false)
    }
  }

  const sendTestNotification = async () => {
    await browserAlerts.sendTestAlert()
  }

  const sendTestWarning = async () => {
    await browserAlerts.sendAlert("Test waarschuwing: CPU gebruik is hoog (85%)", "warning")
  }

  const sendTestCritical = async () => {
    await browserAlerts.sendAlert("Test kritieke alert: Server response tijd > 2 seconden!", "critical")
  }

  const getStatusIcon = () => {
    if (!isSupported) return <XCircle className="h-5 w-5 text-red-500" />
    if (permission === "granted") return <CheckCircle className="h-5 w-5 text-green-500" />
    if (permission === "denied") return <XCircle className="h-5 w-5 text-red-500" />
    return <AlertTriangle className="h-5 w-5 text-yellow-500" />
  }

  const getStatusBadge = () => {
    if (!isSupported) return <Badge variant="destructive">Niet Ondersteund</Badge>
    if (permission === "granted") return <Badge className="bg-green-600">Actief</Badge>
    if (permission === "denied") return <Badge variant="destructive">Geweigerd</Badge>
    return <Badge variant="secondary">Niet Ingesteld</Badge>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Browser Notifications
        </CardTitle>
        <CardDescription>
          Ontvang gratis real-time alerts voor performance problemen direct in je browser
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className="font-medium">Status:</span>
            {getStatusBadge()}
          </div>
        </div>

        {!isSupported && (
          <Alert>
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              Je browser ondersteunt geen notifications. Probeer Chrome, Firefox, Safari of Edge.
            </AlertDescription>
          </Alert>
        )}

        {isSupported && permission === "default" && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Notifications zijn nog niet ingeschakeld. Klik op de knop hieronder om toestemming te geven.
            </AlertDescription>
          </Alert>
        )}

        {isSupported && permission === "denied" && (
          <Alert>
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              Notifications zijn geweigerd. Ga naar je browser instellingen om dit te wijzigen.
            </AlertDescription>
          </Alert>
        )}

        {isSupported && permission === "granted" && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              🎉 Notifications zijn actief! Je ontvangt automatisch alerts bij performance problemen.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex flex-wrap gap-2">
          {isSupported && permission !== "granted" && (
            <Button onClick={requestPermission} disabled={isRequesting}>
              <Bell className="h-4 w-4 mr-2" />
              {isRequesting ? "Requesting..." : "🔔 Notifications Inschakelen"}
            </Button>
          )}

          {permission === "granted" && (
            <>
              <Button variant="outline" onClick={sendTestNotification}>
                ℹ️ Test Info
              </Button>
              <Button variant="outline" onClick={sendTestWarning}>
                ⚠️ Test Warning
              </Button>
              <Button variant="outline" onClick={sendTestCritical}>
                🚨 Test Critical
              </Button>
            </>
          )}
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">💡 Hoe het werkt:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>
              • <strong>Automatische alerts</strong> bij performance problemen
            </li>
            <li>
              • <strong>Kritieke alerts</strong> blijven zichtbaar tot je ze wegklikt
            </li>
            <li>
              • <strong>Normale alerts</strong> verdwijnen automatisch na 10 seconden
            </li>
            <li>
              • <strong>Werkt ook</strong> als BHV360 tab niet actief is
            </li>
            <li>
              • <strong>100% gratis</strong> - geen externe services nodig
            </li>
          </ul>
        </div>

        <div className="text-sm text-muted-foreground space-y-1">
          <p>
            <strong>Alert Types:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <strong>Info:</strong> Load test voltooid, systeem updates
            </li>
            <li>
              <strong>Warning:</strong> CPU &gt; 70%, Memory &gt; 80%, Response time &gt; 1s
            </li>
            <li>
              <strong>Critical:</strong> CPU &gt; 90%, Memory &gt; 95%, Response time &gt; 2s
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
