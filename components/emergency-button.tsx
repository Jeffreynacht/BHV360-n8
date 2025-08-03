"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Shield, Heart, Flame, Users, MapPin } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface EmergencyType {
  id: string
  name: string
  icon: React.ReactNode
  color: string
  priority: "critical" | "high" | "medium"
  autoDispatch: boolean
}

export function EmergencyButton() {
  const [isEmergencyActive, setIsEmergencyActive] = useState(false)
  const [selectedEmergency, setSelectedEmergency] = useState<EmergencyType | null>(null)
  const [countdown, setCountdown] = useState(0)
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)

  const emergencyTypes: EmergencyType[] = [
    {
      id: "fire",
      name: "Brand",
      icon: <Flame className="h-6 w-6" />,
      color: "bg-red-500",
      priority: "critical",
      autoDispatch: true,
    },
    {
      id: "medical",
      name: "Medisch",
      icon: <Heart className="h-6 w-6" />,
      color: "bg-pink-500",
      priority: "critical",
      autoDispatch: true,
    },
    {
      id: "security",
      name: "Beveiliging",
      icon: <Shield className="h-6 w-6" />,
      color: "bg-orange-500",
      priority: "high",
      autoDispatch: false,
    },
    {
      id: "evacuation",
      name: "Ontruiming",
      icon: <Users className="h-6 w-6" />,
      color: "bg-purple-500",
      priority: "critical",
      autoDispatch: true,
    },
    {
      id: "general",
      name: "Algemeen",
      icon: <AlertTriangle className="h-6 w-6" />,
      color: "bg-yellow-500",
      priority: "medium",
      autoDispatch: false,
    },
  ]

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.error("Error getting location:", error)
        },
      )
    }
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown(countdown - 1)
      }, 1000)
    } else if (countdown === 0 && selectedEmergency) {
      // Dispatch emergency
      handleEmergencyDispatch()
    }
    return () => clearInterval(interval)
  }, [countdown, selectedEmergency])

  const handleEmergencyClick = (emergency: EmergencyType) => {
    setSelectedEmergency(emergency)
    setIsEmergencyActive(true)

    if (emergency.autoDispatch) {
      setCountdown(10) // 10 second countdown for auto-dispatch
    }
  }

  const handleEmergencyDispatch = async () => {
    if (!selectedEmergency) return

    // Simulate emergency dispatch
    console.log("Dispatching emergency:", selectedEmergency.name)
    console.log("Location:", location)

    // Send to emergency services API
    try {
      const response = await fetch("/api/emergency-dispatch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: selectedEmergency.id,
          location: location,
          timestamp: new Date().toISOString(),
          priority: selectedEmergency.priority,
        }),
      })

      if (response.ok) {
        // Show success message
        alert(`${selectedEmergency.name} noodoproep verzonden!`)
      }
    } catch (error) {
      console.error("Error dispatching emergency:", error)
    }

    // Reset state
    setIsEmergencyActive(false)
    setSelectedEmergency(null)
    setCountdown(0)
  }

  const handleCancel = () => {
    setIsEmergencyActive(false)
    setSelectedEmergency(null)
    setCountdown(0)
  }

  return (
    <>
      {/* Floating Emergency Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="lg"
          className="h-16 w-16 rounded-full bg-red-500 hover:bg-red-600 shadow-lg"
          onClick={() => setIsEmergencyActive(true)}
        >
          <AlertTriangle className="h-8 w-8 text-white" />
        </Button>
      </div>

      {/* Emergency Selection Dialog */}
      <Dialog open={isEmergencyActive} onOpenChange={setIsEmergencyActive}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-600">
              <AlertTriangle className="h-6 w-6 mr-2" />
              Noodsituatie Melden
            </DialogTitle>
            <DialogDescription>
              Selecteer het type noodsituatie. Bij kritieke situaties wordt automatisch 112 gebeld.
            </DialogDescription>
          </DialogHeader>

          {selectedEmergency && countdown > 0 ? (
            <div className="text-center space-y-4">
              <div
                className={`mx-auto w-20 h-20 rounded-full ${selectedEmergency.color} flex items-center justify-center text-white`}
              >
                {selectedEmergency.icon}
              </div>
              <h3 className="text-xl font-bold">{selectedEmergency.name}</h3>
              <div className="text-4xl font-bold text-red-600">{countdown}</div>
              <p className="text-sm text-muted-foreground">
                Hulpdiensten worden automatisch gealarmeerd over {countdown} seconden
              </p>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={handleCancel} className="flex-1">
                  Annuleren
                </Button>
                <Button onClick={handleEmergencyDispatch} className="flex-1 bg-red-500 hover:bg-red-600">
                  Nu Alarmeren
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {emergencyTypes.map((emergency) => (
                <Card
                  key={emergency.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleEmergencyClick(emergency)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-12 h-12 rounded-full ${emergency.color} flex items-center justify-center text-white`}
                      >
                        {emergency.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{emergency.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge
                            variant={
                              emergency.priority === "critical"
                                ? "destructive"
                                : emergency.priority === "high"
                                  ? "default"
                                  : "secondary"
                            }
                          >
                            {emergency.priority}
                          </Badge>
                          {emergency.autoDispatch && (
                            <Badge variant="outline" className="text-xs">
                              Auto 112
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-blue-500 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-800">Locatie gedetecteerd</p>
                    <p className="text-blue-600">
                      {location ? `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}` : "Locatie wordt bepaald..."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
