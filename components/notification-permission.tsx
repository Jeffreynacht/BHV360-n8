"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Bell, BellOff } from "lucide-react"
import { isPushNotificationSupported, requestNotificationPermission } from "@/lib/push-notifications"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function NotificationPermission() {
  const [permissionState, setPermissionState] = useState<NotificationPermission | "unsupported" | "unknown">("unknown")
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    // Check if notifications are supported
    if (!isPushNotificationSupported()) {
      setPermissionState("unsupported")
      return
    }

    // Check current permission state
    setPermissionState(Notification.permission)
  }, [])

  const handleRequestPermission = async () => {
    const result = await requestNotificationPermission()
    if (result.granted) {
      setPermissionState("granted")
    } else {
      setPermissionState(result.reason as NotificationPermission)
    }
    setDialogOpen(false)
  }

  if (permissionState === "unsupported" || permissionState === "unknown") {
    return null
  }

  if (permissionState === "granted") {
    return (
      <Button variant="ghost" size="sm" className="flex items-center gap-2">
        <Bell className="h-4 w-4" />
        <span className="hidden md:inline">Notificaties aan</span>
      </Button>
    )
  }

  return (
    <>
      <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={() => setDialogOpen(true)}>
        <BellOff className="h-4 w-4" />
        <span className="hidden md:inline">Notificaties uit</span>
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notificaties inschakelen</DialogTitle>
            <DialogDescription>
              Schakel notificaties in om direct op de hoogte te blijven van belangrijke BHV meldingen, incidenten en
              updates.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Door notificaties in te schakelen krijgt u direct melding van:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Nieuwe incidenten en calamiteiten</li>
              <li>BHV oproepen en alarmeringen</li>
              <li>Statusupdates van lopende incidenten</li>
              <li>Belangrijke systeemmeldingen</li>
            </ul>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Later
            </Button>
            <Button onClick={handleRequestPermission}>Notificaties inschakelen</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
