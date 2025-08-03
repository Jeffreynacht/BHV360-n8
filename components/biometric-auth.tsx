"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Fingerprint, Eye, Smartphone, CheckCircle, AlertTriangle, Settings, Shield } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface BiometricCapability {
  type: string
  available: boolean
  enrolled: boolean
  name: string
  icon: React.ReactNode
}

export function BiometricAuth() {
  const [isSupported, setIsSupported] = useState(false)
  const [capabilities, setCapabilities] = useState<BiometricCapability[]>([])
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [authResult, setAuthResult] = useState<{ success: boolean; method: string } | null>(null)
  const [settings, setSettings] = useState({
    enableFingerprint: true,
    enableFaceID: true,
    enableVoice: false,
    requireBiometric: false,
    fallbackToPassword: true,
    timeoutSeconds: 30,
  })

  useEffect(() => {
    checkBiometricSupport()
  }, [])

  const checkBiometricSupport = async () => {
    if (!window.PublicKeyCredential) {
      setIsSupported(false)
      return
    }

    try {
      const available = await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
      setIsSupported(available)

      if (available) {
        // Check specific capabilities
        const caps: BiometricCapability[] = [
          {
            type: "fingerprint",
            available: true, // Assume available for demo
            enrolled: true,
            name: "Vingerafdruk",
            icon: <Fingerprint className="h-5 w-5" />,
          },
          {
            type: "face",
            available: true,
            enrolled: false,
            name: "Gezichtsherkenning",
            icon: <Eye className="h-5 w-5" />,
          },
          {
            type: "voice",
            available: false,
            enrolled: false,
            name: "Spraakherkenning",
            icon: <Smartphone className="h-5 w-5" />,
          },
        ]
        setCapabilities(caps)
      }
    } catch (error) {
      console.error("Error checking biometric support:", error)
      setIsSupported(false)
    }
  }

  const authenticateWithBiometric = async (method: string) => {
    setIsAuthenticating(true)
    setAuthResult(null)

    try {
      // Simulate biometric authentication
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate success/failure (90% success rate)
      const success = Math.random() > 0.1

      setAuthResult({
        success,
        method,
      })

      if (success) {
        // Redirect to main app or perform login action
        console.log(`Authenticated with ${method}`)
      }
    } catch (error) {
      console.error("Biometric authentication failed:", error)
      setAuthResult({
        success: false,
        method,
      })
    } finally {
      setIsAuthenticating(false)
    }
  }

  const enrollBiometric = async (type: string) => {
    try {
      // Simulate enrollment process
      await new Promise((resolve) => setTimeout(resolve, 3000))

      setCapabilities((caps) => caps.map((cap) => (cap.type === type ? { ...cap, enrolled: true } : cap)))

      alert(`${type} succesvol ingeschreven!`)
    } catch (error) {
      console.error("Enrollment failed:", error)
      alert("Inschrijving mislukt. Probeer opnieuw.")
    }
  }

  if (!isSupported) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center text-orange-600">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Biometrische authenticatie niet ondersteund
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Uw apparaat of browser ondersteunt geen biometrische authenticatie. Gebruik een wachtwoord om in te loggen.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2 text-green-600" />
            Biometrische Authenticatie
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {capabilities
            .filter((cap) => cap.available && cap.enrolled)
            .map((capability) => (
              <Button
                key={capability.type}
                variant="outline"
                className="w-full h-16 flex items-center justify-center space-x-3"
                onClick={() => authenticateWithBiometric(capability.type)}
                disabled={isAuthenticating}
              >
                {capability.icon}
                <span>Inloggen met {capability.name}</span>
              </Button>
            ))}

          {isAuthenticating && (
            <div className="text-center py-4">
              <div className="animate-pulse">
                <Fingerprint className="h-12 w-12 mx-auto text-blue-500 mb-2" />
                <p className="text-sm text-muted-foreground">Authenticatie in uitvoering...</p>
              </div>
            </div>
          )}

          {authResult && (
            <div
              className={`flex items-center space-x-2 p-3 rounded-lg ${
                authResult.success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
              }`}
            >
              {authResult.success ? <CheckCircle className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
              <span className="text-sm">
                {authResult.success
                  ? `Succesvol ingelogd met ${authResult.method}`
                  : `Authenticatie mislukt met ${authResult.method}`}
              </span>
            </div>
          )}

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" className="w-full">
                <Settings className="h-4 w-4 mr-2" />
                Biometrische instellingen
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Biometrische Instellingen</DialogTitle>
                <DialogDescription>Beheer uw biometrische authenticatie opties</DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Beschikbare Methoden</h3>
                  {capabilities.map((capability) => (
                    <div key={capability.type} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {capability.icon}
                        <div>
                          <p className="font-medium">{capability.name}</p>
                          <div className="flex items-center space-x-2">
                            <Badge variant={capability.available ? "default" : "secondary"}>
                              {capability.available ? "Beschikbaar" : "Niet beschikbaar"}
                            </Badge>
                            {capability.enrolled && <Badge variant="outline">Ingeschreven</Badge>}
                          </div>
                        </div>
                      </div>
                      {capability.available && !capability.enrolled && (
                        <Button size="sm" onClick={() => enrollBiometric(capability.type)}>
                          Inschrijven
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Instellingen</h3>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Biometrische authenticatie verplicht</Label>
                      <p className="text-sm text-muted-foreground">Sta geen wachtwoord login toe</p>
                    </div>
                    <Switch
                      checked={settings.requireBiometric}
                      onCheckedChange={(checked) => setSettings({ ...settings, requireBiometric: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Fallback naar wachtwoord</Label>
                      <p className="text-sm text-muted-foreground">Sta wachtwoord toe als biometrie faalt</p>
                    </div>
                    <Switch
                      checked={settings.fallbackToPassword}
                      onCheckedChange={(checked) => setSettings({ ...settings, fallbackToPassword: checked })}
                    />
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  )
}
