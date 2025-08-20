"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Save, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

export default function ContentManagementPage() {
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [heroContent, setHeroContent] = useState({
    title: "Professionele BHV Plotkaarten",
    subtitle:
      "Creëer, beheer en deel interactieve evacuatieplattegronden voor optimale bedrijfshulpverlening. Voldoet aan alle Nederlandse veiligheidsnormen.",
    ctaPrimary: "Start Gratis Trial",
    ctaSecondary: "Live Demo Bekijken",
  })

  const [pricingPlans, setPricingPlans] = useState([
    {
      id: "starter",
      name: "Starter",
      price: "€49",
      period: "/maand",
      description: "Perfect voor kleine organisaties",
      features: [
        "Tot 50 gebruikers",
        "Basis plotkaarten",
        "Incident registratie",
        "Email ondersteuning",
        "Standaard rapportages",
      ],
      popular: false,
    },
    {
      id: "professional",
      name: "Professional",
      price: "€149",
      period: "/maand",
      description: "Ideaal voor middelgrote bedrijven",
      features: [
        "Tot 250 gebruikers",
        "Geavanceerde plotkaarten",
        "Real-time monitoring",
        "Telefoon ondersteuning",
        "Custom rapportages",
        "API integraties",
        "Multi-locatie support",
      ],
      popular: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "Op maat",
      period: "",
      description: "Voor grote organisaties",
      features: [
        "Onbeperkt gebruikers",
        "White-label oplossing",
        "Dedicated support",
        "Custom ontwikkeling",
        "SLA garanties",
        "On-premise optie",
        "Training & consultancy",
      ],
      popular: false,
    },
  ])

  const [companyInfo, setCompanyInfo] = useState({
    phone: "+31 (0)20 123 4567",
    email: "info@bhv360.nl",
    address: "Amsterdam, Nederland",
    description: "Professionele BHV plotkaarten voor een veiligere werkomgeving.",
  })

  const handleSaveContent = () => {
    // Hier zou je de content opslaan naar de database
    toast.success("Content succesvol opgeslagen!")
  }

  const handleAddFeature = (planId: string) => {
    setPricingPlans((plans) =>
      plans.map((plan) => (plan.id === planId ? { ...plan, features: [...plan.features, "Nieuwe feature"] } : plan)),
    )
  }

  const handleRemoveFeature = (planId: string, featureIndex: number) => {
    setPricingPlans((plans) =>
      plans.map((plan) =>
        plan.id === planId ? { ...plan, features: plan.features.filter((_, index) => index !== featureIndex) } : plan,
      ),
    )
  }

  const handleFeatureChange = (planId: string, featureIndex: number, newValue: string) => {
    setPricingPlans((plans) =>
      plans.map((plan) =>
        plan.id === planId
          ? {
              ...plan,
              features: plan.features.map((feature, index) => (index === featureIndex ? newValue : feature)),
            }
          : plan,
      ),
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
            <p className="text-gray-600 mt-2">Beheer de inhoud van de homepage en onderliggende pagina's</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="preview-mode">Preview Mode</Label>
              <Switch id="preview-mode" checked={isPreviewMode} onCheckedChange={setIsPreviewMode} />
            </div>
            <Button onClick={handleSaveContent}>
              <Save className="h-4 w-4 mr-2" />
              Opslaan
            </Button>
          </div>
        </div>

        <Tabs defaultValue="hero" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="hero">Hero Sectie</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="pricing">Prijzen</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>

          {/* Hero Section */}
          <TabsContent value="hero">
            <Card>
              <CardHeader>
                <CardTitle>Hero Sectie</CardTitle>
                <CardDescription>Bewerk de hoofdtekst en call-to-action buttons van de homepage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="hero-title">Hoofdtitel</Label>
                      <Input
                        id="hero-title"
                        value={heroContent.title}
                        onChange={(e) => setHeroContent((prev) => ({ ...prev, title: e.target.value }))}
                        placeholder="Hoofdtitel van de hero sectie"
                      />
                    </div>
                    <div>
                      <Label htmlFor="hero-subtitle">Ondertitel</Label>
                      <Textarea
                        id="hero-subtitle"
                        value={heroContent.subtitle}
                        onChange={(e) => setHeroContent((prev) => ({ ...prev, subtitle: e.target.value }))}
                        placeholder="Beschrijving onder de hoofdtitel"
                        rows={4}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="cta-primary">Primaire CTA</Label>
                        <Input
                          id="cta-primary"
                          value={heroContent.ctaPrimary}
                          onChange={(e) => setHeroContent((prev) => ({ ...prev, ctaPrimary: e.target.value }))}
                          placeholder="Tekst primaire button"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cta-secondary">Secundaire CTA</Label>
                        <Input
                          id="cta-secondary"
                          value={heroContent.ctaSecondary}
                          onChange={(e) => setHeroContent((prev) => ({ ...prev, ctaSecondary: e.target.value }))}
                          placeholder="Tekst secundaire button"
                        />
                      </div>
                    </div>
                  </div>

                  {isPreviewMode && (
                    <div className="bg-gradient-to-br from-blue-50 via-white to-green-50 p-8 rounded-lg">
                      <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">{heroContent.title}</h1>
                        <p className="text-gray-600 mb-6">{heroContent.subtitle}</p>
                        <div className="flex gap-4 justify-center">
                          <Button size="sm">{heroContent.ctaPrimary}</Button>
                          <Button size="sm" variant="outline">
                            {heroContent.ctaSecondary}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pricing Section */}
          <TabsContent value="pricing">
            <Card>
              <CardHeader>
                <CardTitle>Prijzen Sectie</CardTitle>
                <CardDescription>Beheer de prijsplannen en features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  {pricingPlans.map((plan) => (
                    <Card key={plan.id} className={`relative ${plan.popular ? "border-blue-500" : ""}`}>
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <Badge className="bg-blue-500 text-white">Meest Populair</Badge>
                        </div>
                      )}
                      <CardHeader className="text-center">
                        <div className="space-y-2">
                          <Input
                            value={plan.name}
                            onChange={(e) =>
                              setPricingPlans((plans) =>
                                plans.map((p) => (p.id === plan.id ? { ...p, name: e.target.value } : p)),
                              )
                            }
                            className="text-center font-semibold"
                          />
                          <div className="flex items-center justify-center space-x-2">
                            <Input
                              value={plan.price}
                              onChange={(e) =>
                                setPricingPlans((plans) =>
                                  plans.map((p) => (p.id === plan.id ? { ...p, price: e.target.value } : p)),
                                )
                              }
                              className="text-center text-2xl font-bold w-24"
                            />
                            <Input
                              value={plan.period}
                              onChange={(e) =>
                                setPricingPlans((plans) =>
                                  plans.map((p) => (p.id === plan.id ? { ...p, period: e.target.value } : p)),
                                )
                              }
                              className="text-center w-20"
                              placeholder="/maand"
                            />
                          </div>
                          <Input
                            value={plan.description}
                            onChange={(e) =>
                              setPricingPlans((plans) =>
                                plans.map((p) => (p.id === plan.id ? { ...p, description: e.target.value } : p)),
                              )
                            }
                            className="text-center text-sm"
                          />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 mb-4">
                          {plan.features.map((feature, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <Input
                                value={feature}
                                onChange={(e) => handleFeatureChange(plan.id, index, e.target.value)}
                                className="text-sm"
                              />
                              <Button size="sm" variant="ghost" onClick={() => handleRemoveFeature(plan.id, index)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAddFeature(plan.id)}
                            className="w-full"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Feature Toevoegen
                          </Button>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={plan.popular}
                            onCheckedChange={(checked) =>
                              setPricingPlans((plans) =>
                                plans.map((p) => (p.id === plan.id ? { ...p, popular: checked } : p)),
                              )
                            }
                          />
                          <Label className="text-sm">Markeer als populair</Label>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Section */}
          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Contact Informatie</CardTitle>
                <CardDescription>Beheer de contactgegevens en bedrijfsinformatie</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="company-phone">Telefoonnummer</Label>
                      <Input
                        id="company-phone"
                        value={companyInfo.phone}
                        onChange={(e) => setCompanyInfo((prev) => ({ ...prev, phone: e.target.value }))}
                        placeholder="+31 (0)20 123 4567"
                      />
                    </div>
                    <div>
                      <Label htmlFor="company-email">Email</Label>
                      <Input
                        id="company-email"
                        type="email"
                        value={companyInfo.email}
                        onChange={(e) => setCompanyInfo((prev) => ({ ...prev, email: e.target.value }))}
                        placeholder="info@bhv360.nl"
                      />
                    </div>
                    <div>
                      <Label htmlFor="company-address">Adres</Label>
                      <Input
                        id="company-address"
                        value={companyInfo.address}
                        onChange={(e) => setCompanyInfo((prev) => ({ ...prev, address: e.target.value }))}
                        placeholder="Amsterdam, Nederland"
                      />
                    </div>
                    <div>
                      <Label htmlFor="company-description">Bedrijfsomschrijving</Label>
                      <Textarea
                        id="company-description"
                        value={companyInfo.description}
                        onChange={(e) => setCompanyInfo((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="Korte beschrijving van het bedrijf"
                        rows={3}
                      />
                    </div>
                  </div>

                  {isPreviewMode && (
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="font-semibold mb-4">Preview Contact Sectie</h3>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">📞</div>
                          <div>
                            <p className="font-medium">Telefoon</p>
                            <p className="text-sm text-gray-600">{companyInfo.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">✉️</div>
                          <div>
                            <p className="font-medium">Email</p>
                            <p className="text-sm text-gray-600">{companyInfo.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">📍</div>
                          <div>
                            <p className="font-medium">Adres</p>
                            <p className="text-sm text-gray-600">{companyInfo.address}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Features Section */}
          <TabsContent value="features">
            <Card>
              <CardHeader>
                <CardTitle>Features Sectie</CardTitle>
                <CardDescription>Beheer de feature cards op de homepage</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Feature management komt binnenkort beschikbaar...</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SEO Section */}
          <TabsContent value="seo">
            <Card>
              <CardHeader>
                <CardTitle>SEO Instellingen</CardTitle>
                <CardDescription>Beheer meta tags, beschrijvingen en SEO instellingen</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">SEO management komt binnenkort beschikbaar...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
