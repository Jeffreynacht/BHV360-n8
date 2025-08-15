"use client"

import { useState, useEffect } from "react"
import { Wifi, WifiOff } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true)
  const [showReconnected, setShowReconnected] = useState(false)

  useEffect(() => {
    // Initiële online status
    setIsOnline(navigator.onLine)

    // Event listeners voor online/offline status
    const handleOnline = () => {
      setIsOnline(true)
      setShowReconnected(true)
      // Verberg het "reconnected" bericht na 5 seconden
      setTimeout(() => setShowReconnected(false), 5000)
    }

    const handleOffline = () => {
      setIsOnline(false)
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  if (!isOnline) {
    return (
      <Alert variant="destructive" className="fixed bottom-4 right-4 w-auto max-w-md z-50 flex items-center">
        <WifiOff className="h-4 w-4 mr-2" />
        <AlertTitle>Offline</AlertTitle>
        <AlertDescription>U bent momenteel offline. Sommige functies zijn beperkt beschikbaar.</AlertDescription>
      </Alert>
    )
  }

  if (showReconnected) {
    return (
      <Alert
        variant="default"
        className="fixed bottom-4 right-4 w-auto max-w-md z-50 flex items-center bg-green-50 text-green-800 border-green-200"
      >
        <Wifi className="h-4 w-4 mr-2" />
        <AlertTitle>Verbinding hersteld</AlertTitle>
        <AlertDescription>U bent weer online. Alle functies zijn beschikbaar.</AlertDescription>
      </Alert>
    )
  }

  return null
}
