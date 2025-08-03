"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, Upload, Palette, Settings, Shield, CreditCard } from "lucide-react"

export default function ConfigurePartnerPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const partnerId = searchParams.get("id") || "1"
  const partnerName = searchParams.get("name") || "SafetyFirst Consultancy"

  const [config, setConfig] = useState({
    // Basic Info
    companyName: partnerName,
    contactEmail: "info@safetyfirst.nl",
    contactPhone: "+31 20 123 4567",
    domain: "safetyfirst.bhv360.com",

    // Branding
    primaryColor: "#2563eb",
    secondaryColor: "#64748b",
    accentColor: "#10b981",
    logo: "",
    favicon: "",

    // Features
    enabledModules: {
      plotkaart: true,
      incidents: true,
      users: true,
      reporting: true,
      mobile: true,
      api: false,
      whitelabel: true,
    },

    // Limits
    maxCustomers: 50,
    maxUsersPerCustomer: 100,
    storageLimit: 10, // GB

    // Pricing
    pricingModel: "per-user",
    basePrice: 12.5,
    setupFee: 500,
    monthlyMinimum: 150,

    // Support
    supportLevel: "standard",
    dedicatedManager: true,
    customSupport: false,

    // Security
    ssoEnabled: false,
    mfaRequired: false,
    ipWhitelist: "",

    // Legal
    termsAccepted: true,
    dataProcessingAgreement: true,
    privacyPolicy: "https://safetyfirst.nl/privacy",
  })

  const handleSave = () => {
    // Hier zou je de configuratie opslaan
    console.log("Saving partner configuration:", config)
    alert("Partner configuratie opgeslagen!")
  }

  return (
    <div className="container p-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => router.push("/white-label")} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Terug naar Partners
        </Button>
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <span className="mr-2">Configureer {partnerName}</span>
            <Badge>Partner ID: {partnerId}</Badge>
          </h1>
          <p className="text-muted-foreground">Beheer alle instellingen voor deze white-label partner</p>
        </div>
      </div>

      <div className="flex justify-end mb-6">
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Configuratie Opslaan
        </Button>
      </div>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="basic">Basis Info</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Basis Informatie
              </CardTitle>
              <CardDescription>Algemene partner informatie en contactgegevens</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Bedrijfsnaam</Label>
                    <Input
                      id="companyName"
                      value={config.companyName}
                      onChange={(e) => setConfig({ ...config, companyName: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={config.contactEmail}
                      onChange={(e) => setConfig({ ...config, contactEmail: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Telefoonnummer</Label>
                    <Input
                      id="contactPhone"
                      value={config.contactPhone}
                      onChange={(e) => setConfig({ ...config, contactPhone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="domain">Custom Domain</Label>
                    <Input
                      id="domain"
                      value={config.domain}
                      onChange={(e) => setConfig({ ...config, domain: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Badge variant="default" className="block w-fit">
                      Actief
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <Label>Setup Datum</Label>
                    <p className="text-sm text-muted-foreground">15 januari 2024</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="h-5 w-5 mr-2" />
                Branding & Huisstijl
              </CardTitle>
              <CardDescription>Pas de visuele identiteit aan voor deze partner</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Logo Upload</Label>
                    <div className="flex items-center space-x-4">
                      <Button variant="outline">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Logo
                      </Button>
                      <Badge variant="outline">PNG, SVG (max 2MB)</Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Favicon Upload</Label>
                    <div className="flex items-center space-x-4">
                      <Button variant="outline">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Favicon
                      </Button>
                      <Badge variant="outline">ICO, PNG (32x32)</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Kleurenschema</Label>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Input
                          type="color"
                          value={config.primaryColor}
                          onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                          className="w-16 h-10"
                        />
                        <Label>Primaire kleur</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="color"
                          value={config.secondaryColor}
                          onChange={(e) => setConfig({ ...config, secondaryColor: e.target.value })}
                          className="w-16 h-10"
                        />
                        <Label>Secundaire kleur</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="color"
                          value={config.accentColor}
                          onChange={(e) => setConfig({ ...config, accentColor: e.target.value })}
                          className="w-16 h-10"
                        />
                        <Label>Accent kleur</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-gray-50">
                <h3 className="font-medium mb-2">Live Preview</h3>
                <div className="bg-white p-4 rounded border" style={{ borderColor: config.primaryColor }}>
                  <h2 className="text-xl font-bold" style={{ color: config.primaryColor }}>
                    {config.companyName}
                  </h2>
                  <p className="text-sm text-muted-foreground">BHV Management Platform</p>
                  <Button className="mt-2" style={{ backgroundColor: config.primaryColor }}>
                    Voorbeeld Knop
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features">
          <Card>
            <CardHeader>
              <CardTitle>Module Configuratie</CardTitle>
              <CardDescription>Selecteer welke modules beschikbaar zijn voor deze partner</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Core Modules</h3>

                  {Object.entries({
                    plotkaart: "BHV Plotkaart",
                    incidents: "Incident Management",
                    users: "Gebruikersbeheer",
                    reporting: "Rapportages",
                  }).map(([key, label]) => (
                    <div key={key} className="flex items-center justify-between">
                      <Label>{label}</Label>
                      <Switch
                        checked={config.enabledModules[key]}
                        onCheckedChange={(checked) =>
                          setConfig({
                            ...config,
                            enabledModules: { ...config.enabledModules, [key]: checked },
                          })
                        }
                      />
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Advanced Features</h3>

                  {Object.entries({
                    mobile: "Mobile App",
                    api: "API Toegang",
                    whitelabel: "White-label Rechten",
                  }).map(([key, label]) => (
                    <div key={key} className="flex items-center justify-between">
                      <Label>{label}</Label>
                      <Switch
                        checked={config.enabledModules[key]}
                        onCheckedChange={(checked) =>
                          setConfig({
                            ...config,
                            enabledModules: { ...config.enabledModules, [key]: checked },
                          })
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 p-4 border rounded-lg bg-blue-50">
                <h3 className="font-medium mb-2">Limieten</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Max Klanten</Label>
                    <Input
                      type="number"
                      value={config.maxCustomers}
                      onChange={(e) => setConfig({ ...config, maxCustomers: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Max Gebruikers per Klant</Label>
                    <Input
                      type="number"
                      value={config.maxUsersPerCustomer}
                      onChange={(e) => setConfig({ ...config, maxUsersPerCustomer: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Storage Limiet (GB)</Label>
                    <Input
                      type="number"
                      value={config.storageLimit}
                      onChange={(e) => setConfig({ ...config, storageLimit: Number(e.target.value) })}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Pricing Configuratie
              </CardTitle>
              <CardDescription>Stel de pricing structuur in voor deze partner</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Pricing Model</Label>
                    <Select
                      value={config.pricingModel}
                      onValueChange={(value) => setConfig({ ...config, pricingModel: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="per-user">Per Gebruiker</SelectItem>
                        <SelectItem value="flat-rate">Vast Tarief</SelectItem>
                        <SelectItem value="tiered">Gestaffeld</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Basis Prijs (€ per gebruiker/maand)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={config.basePrice}
                      onChange={(e) => setConfig({ ...config, basePrice: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Setup Fee (€)</Label>
                    <Input
                      type="number"
                      value={config.setupFee}
                      onChange={(e) => setConfig({ ...config, setupFee: Number(e.target.value) })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Maandelijks Minimum (€)</Label>
                    <Input
                      type="number"
                      value={config.monthlyMinimum}
                      onChange={(e) => setConfig({ ...config, monthlyMinimum: Number(e.target.value) })}
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-green-50">
                <h3 className="font-medium mb-2">Pricing Overzicht</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Model:</strong> {config.pricingModel}
                  </div>
                  <div>
                    <strong>Basis prijs:</strong> €{config.basePrice}/gebruiker/maand
                  </div>
                  <div>
                    <strong>Setup fee:</strong> €{config.setupFee}
                  </div>
                  <div>
                    <strong>Minimum:</strong> €{config.monthlyMinimum}/maand
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Security Instellingen
              </CardTitle>
              <CardDescription>Configureer beveiligingsinstellingen voor deze partner</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Single Sign-On (SSO)</Label>
                    <p className="text-sm text-muted-foreground">SAML/OAuth integratie</p>
                  </div>
                  <Switch
                    checked={config.ssoEnabled}
                    onCheckedChange={(checked) => setConfig({ ...config, ssoEnabled: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Multi-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Verplichte 2FA voor alle gebruikers</p>
                  </div>
                  <Switch
                    checked={config.mfaRequired}
                    onCheckedChange={(checked) => setConfig({ ...config, mfaRequired: checked })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>IP Whitelist</Label>
                  <Textarea
                    placeholder="Voer IP adressen in, gescheiden door komma's"
                    value={config.ipWhitelist}
                    onChange={(e) => setConfig({ ...config, ipWhitelist: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="support">
          <Card>
            <CardHeader>
              <CardTitle>Support Configuratie</CardTitle>
              <CardDescription>Stel support niveau en opties in</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Support Level</Label>
                  <Select
                    value={config.supportLevel}
                    onValueChange={(value) => setConfig({ ...config, supportLevel: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic (Email)</SelectItem>
                      <SelectItem value="standard">Standard (Email + Chat)</SelectItem>
                      <SelectItem value="premium">Premium (24/7 Phone)</SelectItem>
                      <SelectItem value="enterprise">Enterprise (Dedicated)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Dedicated Account Manager</Label>
                    <p className="text-sm text-muted-foreground">Persoonlijke begeleiding</p>
                  </div>
                  <Switch
                    checked={config.dedicatedManager}
                    onCheckedChange={(checked) => setConfig({ ...config, dedicatedManager: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Custom Support Portal</Label>
                    <p className="text-sm text-muted-foreground">Eigen support omgeving</p>
                  </div>
                  <Switch
                    checked={config.customSupport}
                    onCheckedChange={(checked) => setConfig({ ...config, customSupport: checked })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
