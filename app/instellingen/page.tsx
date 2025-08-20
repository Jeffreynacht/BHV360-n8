"use client"

import type React from "react"

import { useState } from "react"
import { useCustomer } from "@/components/customer-context"
import { NoCustomerSelected } from "@/components/no-customer-selected"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Save, Building, Bell, Shield, Palette, Mail, Upload, Eye, Settings, Smartphone, Zap } from "lucide-react"

export default function InstellingenPage() {
  const { selectedCustomer, setSelectedCustomer, customers, setCustomers } = useCustomer()

  const [settings, setSettings] = useState({
    // Bedrijfsgegevens
    companyName: selectedCustomer?.name || "",
    contactPerson: selectedCustomer?.contactPerson || "",
    email: selectedCustomer?.email || "",
    phone: selectedCustomer?.phone || "",
    address: selectedCustomer?.address || "",
    website: "",
    kvkNumber: "",

    // Huisstijl
    logo: "",
    primaryColor: "#3b82f6",
    secondaryColor: "#64748b",
    accentColor: "#10b981",
    fontFamily: "Inter",

    // E-mail instellingen
    emailSettings: {
      smtpHost: "smtp.gmail.com",
      smtpPort: "587",
      smtpUser: "",
      smtpPassword: "",
      fromName: selectedCustomer?.name || "",
      fromEmail: "",
      replyTo: "",
      useSSL: true,
    },

    // Noodcontacten
    emergencyNumber: "112",
    backupNumber: "",
    evacuationTime: "5",
    assemblyPoint: "",

    // Notificaties
    notifications: {
      email: true,
      sms: false,
      push: true,
      webhook: false,
    },

    // BHV instellingen
    bhvSettings: {
      autoSave: true,
      realTimeUpdates: true,
      showLegend: false,
      defaultView: "plotkaart",
      maxFloors: "24",
      enableNFC: true,
      enableQR: false,
    },

    // Beveiliging
    security: {
      twoFactorAuth: false,
      sessionTimeout: "60",
      passwordPolicy: "medium",
      ipWhitelist: "",
    },

    // Modules instellingen
    modules: {
      bhvPlotkaart: true,
      nfcTags: true,
      userManagement: true,
      notifications: true,
      reports: true,
      wifi: true,
      emergencyContacts: true,
      accessControl: true,
      evacuationPlans: true,
      incidentReporting: true,
      trainingManagement: true,
      certificateTracking: true,
    },

    // Mobile App instellingen
    mobileApp: {
      enableOfflineMode: true,
      syncInterval: "5", // minuten
      enableGPS: true,
      enableCamera: true,
      enablePushNotifications: true,
      autoSync: true,
      maxOfflineStorage: "100", // MB
    },

    // Real-time instellingen
    realtime: {
      enableRealTimeUpdates: true,
      connectionTimeout: "30", // seconden
      reconnectAttempts: "5",
      heartbeatInterval: "10", // seconden
      enableLiveChat: true,
      enableLiveIncidentTracking: true,
      enableLiveUserStatus: true,
    },

    // Push Notificaties (uitgebreid)
    pushNotifications: {
      enableBrowserNotifications: true,
      enableIncidentAlerts: true,
      enableSystemAlerts: true,
      enableMaintenanceAlerts: false,
      enableTrainingReminders: true,
      enableCertificateExpiry: true,
      quietHoursStart: "22:00",
      quietHoursEnd: "07:00",
      enableQuietHours: false,
      soundEnabled: true,
      vibrationEnabled: true,
    },

    // Offline functionaliteit
    offline: {
      enableOfflineMode: true,
      maxOfflineData: "500", // MB
      syncOnConnection: true,
      enableOfflineIncidents: true,
      enableOfflineReports: false,
      enableOfflinePlotkaart: true,
      offlineRetentionDays: "30",
      enableConflictResolution: true,
    },

    // Audit Trail
    auditTrail: {
      enableAuditLogging: true,
      logUserActions: true,
      logSystemEvents: true,
      logDataChanges: true,
      logLoginAttempts: true,
      retentionPeriod: "365", // dagen
      enableExport: true,
      enableRealTimeMonitoring: true,
      alertOnSuspiciousActivity: true,
      enableComplianceReports: true,
    },
  })

  if (!selectedCustomer) {
    return <NoCustomerSelected />
  }

  const handleSave = () => {
    // Update customer in context
    const updatedCustomer = {
      ...selectedCustomer,
      name: settings.companyName,
      contactPerson: settings.contactPerson,
      email: settings.email,
      phone: settings.phone,
      address: settings.address,
    }

    const updatedCustomers = customers.map((customer) =>
      customer.id === selectedCustomer.id ? updatedCustomer : customer,
    )

    setCustomers(updatedCustomers)
    setSelectedCustomer(updatedCustomer)

    alert("Instellingen opgeslagen!")
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setSettings({ ...settings, logo: event.target.result as string })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveSettings = () => {
    alert("Module instellingen opgeslagen!")
  }

  return (
    <div className="container p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Instellingen</h1>
          <p className="text-muted-foreground">Beheer instellingen voor {selectedCustomer.name}</p>
        </div>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Opslaan
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-9">
          <TabsTrigger value="general">
            <Building className="h-4 w-4 mr-2" />
            Algemeen
          </TabsTrigger>
          <TabsTrigger value="branding">
            <Palette className="h-4 w-4 mr-2" />
            Huisstijl
          </TabsTrigger>
          <TabsTrigger value="email">
            <Mail className="h-4 w-4 mr-2" />
            E-mail
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notificaties
          </TabsTrigger>
          <TabsTrigger value="bhv">
            <Shield className="h-4 w-4 mr-2" />
            BHV
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Beveiliging
          </TabsTrigger>
          <TabsTrigger value="mobile">
            <Smartphone className="h-4 w-4 mr-2" />
            Mobile
          </TabsTrigger>
          <TabsTrigger value="realtime">
            <Zap className="h-4 w-4 mr-2" />
            Real-time
          </TabsTrigger>
          <TabsTrigger value="modules">
            <Settings className="h-4 w-4 mr-2" />
            Modules
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Bedrijfsgegevens</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Bedrijfsnaam</Label>
                  <Input
                    id="companyName"
                    value={settings.companyName}
                    onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPerson">Contactpersoon</Label>
                  <Input
                    id="contactPerson"
                    value={settings.contactPerson}
                    onChange={(e) => setSettings({ ...settings, contactPerson: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefoon</Label>
                  <Input
                    id="phone"
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={settings.website}
                    onChange={(e) => setSettings({ ...settings, website: e.target.value })}
                    placeholder="https://www.example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kvkNumber">KvK Nummer</Label>
                  <Input
                    id="kvkNumber"
                    value={settings.kvkNumber}
                    onChange={(e) => setSettings({ ...settings, kvkNumber: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Adres</Label>
                  <Textarea
                    id="address"
                    value={settings.address}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Noodcontacten</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencyNumber">Primair alarmnummer</Label>
                  <Input
                    id="emergencyNumber"
                    value={settings.emergencyNumber}
                    onChange={(e) => setSettings({ ...settings, emergencyNumber: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="backupNumber">Backup alarmnummer</Label>
                  <Input
                    id="backupNumber"
                    value={settings.backupNumber}
                    onChange={(e) => setSettings({ ...settings, backupNumber: e.target.value })}
                    placeholder="Optioneel"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="evacuationTime">Ontruimingstijd (minuten)</Label>
                  <Input
                    id="evacuationTime"
                    type="number"
                    value={settings.evacuationTime}
                    onChange={(e) => setSettings({ ...settings, evacuationTime: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assemblyPoint">Verzamelpunt</Label>
                  <Input
                    id="assemblyPoint"
                    value={settings.assemblyPoint}
                    onChange={(e) => setSettings({ ...settings, assemblyPoint: e.target.value })}
                    placeholder="Bijv. Parkeerplaats voorzijde"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="branding">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Logo en Kleuren</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="logo">Logo uploaden</Label>
                  <div className="flex items-center space-x-4">
                    <Input id="logo" type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                    <Button variant="outline" onClick={() => document.getElementById("logo")?.click()}>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Logo
                    </Button>
                    {settings.logo && (
                      <div className="flex items-center space-x-2">
                        <img src={settings.logo || "/placeholder.svg"} alt="Logo" className="h-8 w-8 object-contain" />
                        <Badge variant="outline">Geüpload</Badge>
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primaire kleur</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={settings.primaryColor}
                      onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                      className="w-16 h-10"
                    />
                    <Input
                      value={settings.primaryColor}
                      onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                      placeholder="#3b82f6"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Secundaire kleur</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={settings.secondaryColor}
                      onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                      className="w-16 h-10"
                    />
                    <Input
                      value={settings.secondaryColor}
                      onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                      placeholder="#64748b"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accentColor">Accent kleur</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="accentColor"
                      type="color"
                      value={settings.accentColor}
                      onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
                      className="w-16 h-10"
                    />
                    <Input
                      value={settings.accentColor}
                      onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
                      placeholder="#10b981"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Typografie</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fontFamily">Lettertype</Label>
                  <Select
                    value={settings.fontFamily}
                    onValueChange={(value) => setSettings({ ...settings, fontFamily: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">Inter</SelectItem>
                      <SelectItem value="Roboto">Roboto</SelectItem>
                      <SelectItem value="Open Sans">Open Sans</SelectItem>
                      <SelectItem value="Lato">Lato</SelectItem>
                      <SelectItem value="Montserrat">Montserrat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Voorbeeld</h3>
                  <div
                    className="space-y-2"
                    style={{
                      fontFamily: settings.fontFamily,
                      color: settings.primaryColor,
                    }}
                  >
                    <h1 className="text-2xl font-bold">BHV360</h1>
                    <p className="text-base">Dit is een voorbeeld van hoe uw huisstijl eruit ziet.</p>
                    <Button
                      style={{
                        backgroundColor: settings.primaryColor,
                        borderColor: settings.primaryColor,
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Voorbeeld knop
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>E-mail Server Instellingen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input
                    id="smtpHost"
                    value={settings.emailSettings.smtpHost}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        emailSettings: { ...settings.emailSettings, smtpHost: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP Poort</Label>
                  <Input
                    id="smtpPort"
                    value={settings.emailSettings.smtpPort}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        emailSettings: { ...settings.emailSettings, smtpPort: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpUser">Gebruikersnaam</Label>
                  <Input
                    id="smtpUser"
                    value={settings.emailSettings.smtpUser}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        emailSettings: { ...settings.emailSettings, smtpUser: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPassword">Wachtwoord</Label>
                  <Input
                    id="smtpPassword"
                    type="password"
                    value={settings.emailSettings.smtpPassword}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        emailSettings: { ...settings.emailSettings, smtpPassword: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fromName">Afzender naam</Label>
                  <Input
                    id="fromName"
                    value={settings.emailSettings.fromName}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        emailSettings: { ...settings.emailSettings, fromName: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fromEmail">Afzender e-mail</Label>
                  <Input
                    id="fromEmail"
                    type="email"
                    value={settings.emailSettings.fromEmail}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        emailSettings: { ...settings.emailSettings, fromEmail: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="replyTo">Antwoord naar</Label>
                  <Input
                    id="replyTo"
                    type="email"
                    value={settings.emailSettings.replyTo}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        emailSettings: { ...settings.emailSettings, replyTo: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="useSSL">SSL gebruiken</Label>
                  <Switch
                    id="useSSL"
                    checked={settings.emailSettings.useSSL}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        emailSettings: { ...settings.emailSettings, useSSL: checked },
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notificatie-instellingen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>E-mail notificaties</Label>
                  <p className="text-sm text-muted-foreground">Ontvang updates via e-mail</p>
                </div>
                <Switch
                  checked={settings.notifications.email}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, email: checked },
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>SMS notificaties</Label>
                  <p className="text-sm text-muted-foreground">Ontvang updates via SMS</p>
                </div>
                <Switch
                  checked={settings.notifications.sms}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, sms: checked },
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Push notificaties</Label>
                  <p className="text-sm text-muted-foreground">Ontvang updates via browser</p>
                </div>
                <Switch
                  checked={settings.notifications.push}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, push: checked },
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Webhook notificaties</Label>
                  <p className="text-sm text-muted-foreground">Verstuur naar externe systemen</p>
                </div>
                <Switch
                  checked={settings.notifications.webhook}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, webhook: checked },
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bhv">
          <Card>
            <CardHeader>
              <CardTitle>BHV Plotkaart Instellingen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Automatisch opslaan</Label>
                  <p className="text-sm text-muted-foreground">Sla wijzigingen automatisch op</p>
                </div>
                <Switch
                  checked={settings.bhvSettings.autoSave}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      bhvSettings: { ...settings.bhvSettings, autoSave: checked },
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Real-time updates</Label>
                  <p className="text-sm text-muted-foreground">Toon wijzigingen direct</p>
                </div>
                <Switch
                  checked={settings.bhvSettings.realTimeUpdates}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      bhvSettings: { ...settings.bhvSettings, realTimeUpdates: checked },
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>NFC ondersteuning</Label>
                  <p className="text-sm text-muted-foreground">Schakel NFC tags in</p>
                </div>
                <Switch
                  checked={settings.bhvSettings.enableNFC}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      bhvSettings: { ...settings.bhvSettings, enableNFC: checked },
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>QR code ondersteuning</Label>
                  <p className="text-sm text-muted-foreground">Schakel QR codes in</p>
                </div>
                <Switch
                  checked={settings.bhvSettings.enableQR}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      bhvSettings: { ...settings.bhvSettings, enableQR: checked },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxFloors">Maximum aantal verdiepingen</Label>
                <Input
                  id="maxFloors"
                  type="number"
                  value={settings.bhvSettings.maxFloors}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      bhvSettings: { ...settings.bhvSettings, maxFloors: e.target.value },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="defaultView">Standaard weergave</Label>
                <Select
                  value={settings.bhvSettings.defaultView}
                  onValueChange={(value) =>
                    setSettings({
                      ...settings,
                      bhvSettings: { ...settings.bhvSettings, defaultView: value },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plotkaart">Plotkaart</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Beveiligingsinstellingen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Twee-factor authenticatie</Label>
                  <p className="text-sm text-muted-foreground">Extra beveiliging voor inloggen</p>
                </div>
                <Switch
                  checked={settings.security.twoFactorAuth}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      security: { ...settings.security, twoFactorAuth: checked },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Sessie timeout (minuten)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={settings.security.sessionTimeout}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      security: { ...settings.security, sessionTimeout: e.target.value },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="passwordPolicy">Wachtwoordbeleid</Label>
                <Select
                  value={settings.security.passwordPolicy}
                  onValueChange={(value) =>
                    setSettings({
                      ...settings,
                      security: { ...settings.security, passwordPolicy: value },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Laag (6+ karakters)</SelectItem>
                    <SelectItem value="medium">Gemiddeld (8+ karakters, cijfers)</SelectItem>
                    <SelectItem value="high">Hoog (12+ karakters, cijfers, symbolen)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ipWhitelist">IP Whitelist</Label>
                <Textarea
                  id="ipWhitelist"
                  value={settings.security.ipWhitelist}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      security: { ...settings.security, ipWhitelist: e.target.value },
                    })
                  }
                  placeholder="192.168.1.0/24&#10;10.0.0.1"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">Voer IP-adressen of ranges in, één per regel</p>
              </div>

              <div className="border-t pt-6 mt-6">
                <h3 className="font-medium mb-4">Audit Trail</h3>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Audit logging</Label>
                      <p className="text-sm text-muted-foreground">
                        Log alle gebruikersacties en systeemgebeurtenissen
                      </p>
                    </div>
                    <Switch
                      checked={settings.auditTrail.enableAuditLogging}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          auditTrail: { ...settings.auditTrail, enableAuditLogging: checked },
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Verdachte activiteit alerts</Label>
                      <p className="text-sm text-muted-foreground">Waarschuw bij ongebruikelijke activiteiten</p>
                    </div>
                    <Switch
                      checked={settings.auditTrail.alertOnSuspiciousActivity}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          auditTrail: { ...settings.auditTrail, alertOnSuspiciousActivity: checked },
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="retentionPeriod">Bewaarperiode logs (dagen)</Label>
                    <Input
                      id="retentionPeriod"
                      type="number"
                      value={settings.auditTrail.retentionPeriod}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          auditTrail: { ...settings.auditTrail, retentionPeriod: e.target.value },
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Compliance rapporten</Label>
                      <p className="text-sm text-muted-foreground">Automatische compliance rapportage</p>
                    </div>
                    <Switch
                      checked={settings.auditTrail.enableComplianceReports}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          auditTrail: { ...settings.auditTrail, enableComplianceReports: checked },
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="mobile">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Mobile App Instellingen</CardTitle>
                <CardDescription>Configureer de mobiele applicatie functionaliteiten</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Offline modus</Label>
                    <p className="text-sm text-muted-foreground">Schakel offline functionaliteit in</p>
                  </div>
                  <Switch
                    checked={settings.mobileApp.enableOfflineMode}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        mobileApp: { ...settings.mobileApp, enableOfflineMode: checked },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>GPS tracking</Label>
                    <p className="text-sm text-muted-foreground">Locatie tracking voor BHV'ers</p>
                  </div>
                  <Switch
                    checked={settings.mobileApp.enableGPS}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        mobileApp: { ...settings.mobileApp, enableGPS: checked },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Camera integratie</Label>
                    <p className="text-sm text-muted-foreground">Foto's maken voor incident rapportage</p>
                  </div>
                  <Switch
                    checked={settings.mobileApp.enableCamera}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        mobileApp: { ...settings.mobileApp, enableCamera: checked },
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="syncInterval">Synchronisatie interval (minuten)</Label>
                  <Input
                    id="syncInterval"
                    type="number"
                    value={settings.mobileApp.syncInterval}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        mobileApp: { ...settings.mobileApp, syncInterval: e.target.value },
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxOfflineStorage">Max offline opslag (MB)</Label>
                  <Input
                    id="maxOfflineStorage"
                    type="number"
                    value={settings.mobileApp.maxOfflineStorage}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        mobileApp: { ...settings.mobileApp, maxOfflineStorage: e.target.value },
                      })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Offline Functionaliteit</CardTitle>
                <CardDescription>Beheer offline opslag en synchronisatie</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Offline incidenten</Label>
                    <p className="text-sm text-muted-foreground">Incidenten offline kunnen aanmaken</p>
                  </div>
                  <Switch
                    checked={settings.offline.enableOfflineIncidents}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        offline: { ...settings.offline, enableOfflineIncidents: checked },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Offline plotkaart</Label>
                    <p className="text-sm text-muted-foreground">Plotkaart offline beschikbaar</p>
                  </div>
                  <Switch
                    checked={settings.offline.enableOfflinePlotkaart}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        offline: { ...settings.offline, enableOfflinePlotkaart: checked },
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxOfflineData">Max offline data (MB)</Label>
                  <Input
                    id="maxOfflineData"
                    type="number"
                    value={settings.offline.maxOfflineData}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        offline: { ...settings.offline, maxOfflineData: e.target.value },
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="offlineRetentionDays">Offline bewaarperiode (dagen)</Label>
                  <Input
                    id="offlineRetentionDays"
                    type="number"
                    value={settings.offline.offlineRetentionDays}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        offline: { ...settings.offline, offlineRetentionDays: e.target.value },
                      })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="realtime">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Real-time Updates</CardTitle>
                <CardDescription>Configureer live synchronisatie en updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Live incident tracking</Label>
                    <p className="text-sm text-muted-foreground">Real-time incident status updates</p>
                  </div>
                  <Switch
                    checked={settings.realtime.enableLiveIncidentTracking}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        realtime: { ...settings.realtime, enableLiveIncidentTracking: checked },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Live chat</Label>
                    <p className="text-sm text-muted-foreground">Real-time messaging tussen gebruikers</p>
                  </div>
                  <Switch
                    checked={settings.realtime.enableLiveChat}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        realtime: { ...settings.realtime, enableLiveChat: checked },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Live gebruikersstatus</Label>
                    <p className="text-sm text-muted-foreground">Toon online/offline status van gebruikers</p>
                  </div>
                  <Switch
                    checked={settings.realtime.enableLiveUserStatus}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        realtime: { ...settings.realtime, enableLiveUserStatus: checked },
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="connectionTimeout">Verbinding timeout (seconden)</Label>
                  <Input
                    id="connectionTimeout"
                    type="number"
                    value={settings.realtime.connectionTimeout}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        realtime: { ...settings.realtime, connectionTimeout: e.target.value },
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reconnectAttempts">Herverbinding pogingen</Label>
                  <Input
                    id="reconnectAttempts"
                    type="number"
                    value={settings.realtime.reconnectAttempts}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        realtime: { ...settings.realtime, reconnectAttempts: e.target.value },
                      })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Push Notificaties (Uitgebreid)</CardTitle>
                <CardDescription>Geavanceerde notificatie instellingen</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Incident alerts</Label>
                    <p className="text-sm text-muted-foreground">Directe meldingen bij incidenten</p>
                  </div>
                  <Switch
                    checked={settings.pushNotifications.enableIncidentAlerts}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        pushNotifications: { ...settings.pushNotifications, enableIncidentAlerts: checked },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Certificaat vervaldatum</Label>
                    <p className="text-sm text-muted-foreground">Waarschuwingen voor verlopende certificaten</p>
                  </div>
                  <Switch
                    checked={settings.pushNotifications.enableCertificateExpiry}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        pushNotifications: { ...settings.pushNotifications, enableCertificateExpiry: checked },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Stille uren</Label>
                    <p className="text-sm text-muted-foreground">Geen notificaties tijdens stille uren</p>
                  </div>
                  <Switch
                    checked={settings.pushNotifications.enableQuietHours}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        pushNotifications: { ...settings.pushNotifications, enableQuietHours: checked },
                      })
                    }
                  />
                </div>

                {settings.pushNotifications.enableQuietHours && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quietHoursStart">Start stille uren</Label>
                      <Input
                        id="quietHoursStart"
                        type="time"
                        value={settings.pushNotifications.quietHoursStart}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            pushNotifications: { ...settings.pushNotifications, quietHoursStart: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quietHoursEnd">Einde stille uren</Label>
                      <Input
                        id="quietHoursEnd"
                        type="time"
                        value={settings.pushNotifications.quietHoursEnd}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            pushNotifications: { ...settings.pushNotifications, quietHoursEnd: e.target.value },
                          })
                        }
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="modules">
          <Card>
            <CardHeader>
              <CardTitle>Module Instellingen</CardTitle>
              <CardDescription>Beheer welke modules beschikbaar zijn voor deze klant</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">BHV & Veiligheid</h3>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>BHV Plotkaart</Label>
                      <p className="text-sm text-muted-foreground">Interactieve plattegronden en ontruimingsplannen</p>
                    </div>
                    <Switch
                      checked={settings.modules.bhvPlotkaart}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          modules: { ...settings.modules, bhvPlotkaart: checked },
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>NFC Tags</Label>
                      <p className="text-sm text-muted-foreground">Scanbare tags voor rondes en controles</p>
                    </div>
                    <Switch
                      checked={settings.modules.nfcTags}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          modules: { ...settings.modules, nfcTags: checked },
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Evacuatieplannen</Label>
                      <p className="text-sm text-muted-foreground">Gedetailleerde evacuatieroutes en -procedures</p>
                    </div>
                    <Switch
                      checked={settings.modules.evacuationPlans}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          modules: { ...settings.modules, evacuationPlans: checked },
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Incidentmeldingen</Label>
                      <p className="text-sm text-muted-foreground">Registratie en afhandeling van incidenten</p>
                    </div>
                    <Switch
                      checked={settings.modules.incidentReporting}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          modules: { ...settings.modules, incidentReporting: checked },
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Beheer & Administratie</h3>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Gebruikersbeheer</Label>
                      <p className="text-sm text-muted-foreground">Beheer van gebruikers en hun rechten</p>
                    </div>
                    <Switch
                      checked={settings.modules.userManagement}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          modules: { ...settings.modules, userManagement: checked },
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notificaties</Label>
                      <p className="text-sm text-muted-foreground">E-mail, SMS en push notificaties</p>
                    </div>
                    <Switch
                      checked={settings.modules.notifications}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          modules: { ...settings.modules, notifications: checked },
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Rapportages</Label>
                      <p className="text-sm text-muted-foreground">Statistieken en rapportages</p>
                    </div>
                    <Switch
                      checked={settings.modules.reports}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          modules: { ...settings.modules, reports: checked },
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>WiFi Beheer</Label>
                      <p className="text-sm text-muted-foreground">Beheer van WiFi netwerken en toegang</p>
                    </div>
                    <Switch
                      checked={settings.modules.wifi}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          modules: { ...settings.modules, wifi: checked },
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Training & Certificering</h3>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Trainingsbeheer</Label>
                      <p className="text-sm text-muted-foreground">Planning en registratie van BHV trainingen</p>
                    </div>
                    <Switch
                      checked={settings.modules.trainingManagement}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          modules: { ...settings.modules, trainingManagement: checked },
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Certificaatbeheer</Label>
                      <p className="text-sm text-muted-foreground">Bijhouden van certificaten en vervaldatums</p>
                    </div>
                    <Switch
                      checked={settings.modules.certificateTracking}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          modules: { ...settings.modules, certificateTracking: checked },
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Overige Modules</h3>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Noodcontacten</Label>
                      <p className="text-sm text-muted-foreground">Beheer van noodcontacten en alarmering</p>
                    </div>
                    <Switch
                      checked={settings.modules.emergencyContacts}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          modules: { ...settings.modules, emergencyContacts: checked },
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Toegangscontrole</Label>
                      <p className="text-sm text-muted-foreground">Beheer van toegangsrechten en -zones</p>
                    </div>
                    <Switch
                      checked={settings.modules.accessControl}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          modules: { ...settings.modules, accessControl: checked },
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button onClick={handleSaveSettings}>Instellingen Opslaan</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
