"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Upload, Eye, Settings, Users } from "lucide-react"

export default function WhiteLabelPage() {
  const router = useRouter()
  const [whiteLabelConfig, setWhiteLabelConfig] = useState({
    // Branding
    companyName: "",
    companyLogo: "",
    primaryColor: "#3b82f6",
    secondaryColor: "#64748b",
    accentColor: "#10b981",
    customDomain: "",

    // Features
    enabledModules: {
      bhvPlotkaart: true,
      incidentManagement: true,
      userManagement: true,
      reporting: true,
      mobileApp: true,
      apiAccess: false,
    },

    // Pricing
    pricingModel: "per-user",
    basePrice: 10,
    setupFee: 500,
    monthlyMinimum: 100,

    // Support
    supportLevel: "standard",
    customSupport: false,
    dedicatedManager: false,

    // Legal
    termsOfService: "",
    privacyPolicy: "",
    dataProcessingAgreement: "",
  })

  const [partners, setPartners] = useState([
    {
      id: 1,
      name: "SafetyFirst Consultancy",
      domain: "safetyfirst.bhv360.com",
      customers: 15,
      revenue: 2500,
      status: "active",
      setupDate: "2024-01-15",
    },
    {
      id: 2,
      name: "VeiligheidsExperts BV",
      domain: "veiligheidsexperts.bhv360.com",
      customers: 8,
      revenue: 1200,
      status: "active",
      setupDate: "2024-02-20",
    },
  ])

  const handleViewPartnerCustomers = (partner) => {
    router.push(`/white-label/partner-customers?id=${partner.id}&name=${encodeURIComponent(partner.name)}`)
  }

  const handleConfigurePartner = (partner) => {
    router.push(`/white-label/configure?id=${partner.id}&name=${encodeURIComponent(partner.name)}`)
  }

  const handleViewPartner = (partner) => {
    // Ga naar de partner's eigen white-label omgeving
    window.open(`https://${partner.domain}`, "_blank")
  }

  return (
    <div className="container p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">White-label Partner Portal</h1>
          <p className="text-muted-foreground">Beheer white-label oplossingen voor consultants en partners</p>
        </div>
        <Button>
          <Users className="h-4 w-4 mr-2" />
          Nieuwe Partner
        </Button>
      </div>

      <Tabs defaultValue="partners" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="partners">Partners</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
        </TabsList>

        <TabsContent value="partners">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partners.map((partner) => (
              <Card key={partner.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{partner.name}</CardTitle>
                      <CardDescription>{partner.domain}</CardDescription>
                    </div>
                    <Badge variant={partner.status === "active" ? "default" : "secondary"}>{partner.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Klanten:</span>
                      <span className="font-medium">{partner.customers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Maandelijkse omzet:</span>
                      <span className="font-medium">€{partner.revenue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Setup datum:</span>
                      <span className="font-medium">{partner.setupDate}</span>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <Button size="sm" variant="outline" onClick={() => handleViewPartnerCustomers(partner)}>
                        <Users className="h-4 w-4 mr-1" />
                        Klanten
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleConfigurePartner(partner)}>
                        <Settings className="h-4 w-4 mr-1" />
                        Configureer
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleViewPartner(partner)}>
                        <Eye className="h-4 w-4 mr-1" />
                        Bekijk
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="branding">
          <Card>
            <CardHeader>
              <CardTitle>Branding Configuratie</CardTitle>
              <CardDescription>Pas de huisstijl aan voor white-label partners</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Bedrijfsnaam</Label>
                    <Input
                      id="companyName"
                      value={whiteLabelConfig.companyName}
                      onChange={(e) => setWhiteLabelConfig({ ...whiteLabelConfig, companyName: e.target.value })}
                      placeholder="Partner Bedrijfsnaam"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customDomain">Custom Domain</Label>
                    <Input
                      id="customDomain"
                      value={whiteLabelConfig.customDomain}
                      onChange={(e) => setWhiteLabelConfig({ ...whiteLabelConfig, customDomain: e.target.value })}
                      placeholder="partner.bhv360.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Logo Upload</Label>
                    <div className="flex items-center space-x-4">
                      <Button variant="outline">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Logo
                      </Button>
                      {whiteLabelConfig.companyLogo && <Badge variant="outline">Logo geüpload</Badge>}
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
                          value={whiteLabelConfig.primaryColor}
                          onChange={(e) => setWhiteLabelConfig({ ...whiteLabelConfig, primaryColor: e.target.value })}
                          className="w-16 h-10"
                        />
                        <Label>Primaire kleur</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="color"
                          value={whiteLabelConfig.secondaryColor}
                          onChange={(e) => setWhiteLabelConfig({ ...whiteLabelConfig, secondaryColor: e.target.value })}
                          className="w-16 h-10"
                        />
                        <Label>Secundaire kleur</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-gray-50">
                <h3 className="font-medium mb-2">Preview</h3>
                <div className="bg-white p-4 rounded border" style={{ color: whiteLabelConfig.primaryColor }}>
                  <h2 className="text-xl font-bold">{whiteLabelConfig.companyName || "Partner Naam"}</h2>
                  <p className="text-sm text-muted-foreground">BHV Management Platform</p>
                  <Button className="mt-2" style={{ backgroundColor: whiteLabelConfig.primaryColor }}>
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
              <CardTitle>Feature Configuratie</CardTitle>
              <CardDescription>Selecteer welke modules beschikbaar zijn voor partners</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Core Modules</h3>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>BHV Plotkaart</Label>
                      <p className="text-sm text-muted-foreground">Interactieve plattegronden</p>
                    </div>
                    <Switch
                      checked={whiteLabelConfig.enabledModules.bhvPlotkaart}
                      onCheckedChange={(checked) =>
                        setWhiteLabelConfig({
                          ...whiteLabelConfig,
                          enabledModules: { ...whiteLabelConfig.enabledModules, bhvPlotkaart: checked },
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Incident Management</Label>
                      <p className="text-sm text-muted-foreground">Real-time incident tracking</p>
                    </div>
                    <Switch
                      checked={whiteLabelConfig.enabledModules.incidentManagement}
                      onCheckedChange={(checked) =>
                        setWhiteLabelConfig({
                          ...whiteLabelConfig,
                          enabledModules: { ...whiteLabelConfig.enabledModules, incidentManagement: checked },
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Gebruikersbeheer</Label>
                      <p className="text-sm text-muted-foreground">User management en rechten</p>
                    </div>
                    <Switch
                      checked={whiteLabelConfig.enabledModules.userManagement}
                      onCheckedChange={(checked) =>
                        setWhiteLabelConfig({
                          ...whiteLabelConfig,
                          enabledModules: { ...whiteLabelConfig.enabledModules, userManagement: checked },
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Advanced Features</h3>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Rapportage & Analytics</Label>
                      <p className="text-sm text-muted-foreground">Geavanceerde rapportages</p>
                    </div>
                    <Switch
                      checked={whiteLabelConfig.enabledModules.reporting}
                      onCheckedChange={(checked) =>
                        setWhiteLabelConfig({
                          ...whiteLabelConfig,
                          enabledModules: { ...whiteLabelConfig.enabledModules, reporting: checked },
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Mobile App</Label>
                      <p className="text-sm text-muted-foreground">iOS en Android apps</p>
                    </div>
                    <Switch
                      checked={whiteLabelConfig.enabledModules.mobileApp}
                      onCheckedChange={(checked) =>
                        setWhiteLabelConfig({
                          ...whiteLabelConfig,
                          enabledModules: { ...whiteLabelConfig.enabledModules, mobileApp: checked },
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>API Toegang</Label>
                      <p className="text-sm text-muted-foreground">REST API voor integraties</p>
                    </div>
                    <Switch
                      checked={whiteLabelConfig.enabledModules.apiAccess}
                      onCheckedChange={(checked) =>
                        setWhiteLabelConfig({
                          ...whiteLabelConfig,
                          enabledModules: { ...whiteLabelConfig.enabledModules, apiAccess: checked },
                        })
                      }
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
              <CardTitle>Pricing Model</CardTitle>
              <CardDescription>Configureer de pricing structuur voor partners</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="pricingModel">Pricing Model</Label>
                    <Select
                      value={whiteLabelConfig.pricingModel}
                      onValueChange={(value) => setWhiteLabelConfig({ ...whiteLabelConfig, pricingModel: value })}
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
                    <Label htmlFor="basePrice">Basis Prijs (€ per gebruiker/maand)</Label>
                    <Input
                      id="basePrice"
                      type="number"
                      value={whiteLabelConfig.basePrice}
                      onChange={(e) => setWhiteLabelConfig({ ...whiteLabelConfig, basePrice: Number(e.target.value) })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="setupFee">Setup Fee (€)</Label>
                    <Input
                      id="setupFee"
                      type="number"
                      value={whiteLabelConfig.setupFee}
                      onChange={(e) => setWhiteLabelConfig({ ...whiteLabelConfig, setupFee: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="monthlyMinimum">Maandelijks Minimum (€)</Label>
                    <Input
                      id="monthlyMinimum"
                      type="number"
                      value={whiteLabelConfig.monthlyMinimum}
                      onChange={(e) =>
                        setWhiteLabelConfig({ ...whiteLabelConfig, monthlyMinimum: Number(e.target.value) })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="supportLevel">Support Level</Label>
                    <Select
                      value={whiteLabelConfig.supportLevel}
                      onValueChange={(value) => setWhiteLabelConfig({ ...whiteLabelConfig, supportLevel: value })}
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
                      checked={whiteLabelConfig.dedicatedManager}
                      onCheckedChange={(checked) =>
                        setWhiteLabelConfig({ ...whiteLabelConfig, dedicatedManager: checked })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-blue-50">
                <h3 className="font-medium mb-2">Pricing Preview</h3>
                <div className="space-y-2">
                  <p>
                    <strong>Model:</strong> {whiteLabelConfig.pricingModel}
                  </p>
                  <p>
                    <strong>Basis prijs:</strong> €{whiteLabelConfig.basePrice} per gebruiker/maand
                  </p>
                  <p>
                    <strong>Setup fee:</strong> €{whiteLabelConfig.setupFee}
                  </p>
                  <p>
                    <strong>Minimum:</strong> €{whiteLabelConfig.monthlyMinimum}/maand
                  </p>
                  <p>
                    <strong>Support:</strong> {whiteLabelConfig.supportLevel}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
