"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Edit3,
  Save,
  Eye,
  RefreshCw,
  Plus,
  Trash2,
  Upload,
  Globe,
  Smartphone,
  Monitor,
  Settings,
  ImageIcon,
  Type,
  Layout,
  Palette,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ContentSection {
  id: string
  name: string
  type: "hero" | "pricing" | "modules" | "company" | "contact" | "footer"
  content: any
  isActive: boolean
  lastModified: string
}

export default function ContentManagementPage() {
  const { toast } = useToast()
  const [activeSection, setActiveSection] = useState<string>("hero")
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Mock content sections
  const [contentSections, setContentSections] = useState<ContentSection[]>([
    {
      id: "hero",
      name: "Hero Sectie",
      type: "hero",
      content: {
        title: "Professioneel BHV Beheer Gemaakt Eenvoudig",
        subtitle:
          "Van papieren chaos naar digitale controle. BHV360 maakt veiligheidsmanagement eenvoudig, compliant en effectief voor elke organisatie.",
        primaryButton: "Bekijk Demo",
        secondaryButton: "30 Dagen Gratis",
        backgroundImage: "/images/hero-bg.jpg",
        benefits: [
          "100% digitale BHV administratie",
          "Interactieve plotkaarten met real-time status",
          "Automatische compliance rapportage",
          "Mobiele app voor alle BHV'ers",
          "Instant incident management",
        ],
      },
      isActive: true,
      lastModified: "2024-01-15 14:30",
    },
    {
      id: "pricing",
      name: "Prijzen Sectie",
      type: "pricing",
      content: {
        title: "Transparante Prijzen",
        subtitle: "Kies het plan dat perfect past bij uw organisatie",
        plans: [
          {
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
          },
          {
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
          },
        ],
      },
      isActive: true,
      lastModified: "2024-01-15 12:15",
    },
    {
      id: "company",
      name: "Bedrijfsinfo",
      type: "company",
      content: {
        companyName: "BHV360 B.V.",
        kvkNumber: "12345678",
        btwNumber: "NL123456789B01",
        iban: "NL12 ABCD 0123 4567 89",
        phone: "033-4614303",
        email: "info@BHV360.nl",
        supportEmail: "support@BHV360.nl",
        website: "www.bhv360.nl",
        address: {
          street: "Innovatiestraat 123",
          city: "3811 AB Amersfoort",
          country: "Nederland",
        },
        postAddress: {
          street: "Postbus 456",
          city: "3800 AL Amersfoort",
          country: "Nederland",
        },
        openingHours: {
          weekdays: "09:00 - 17:30",
          saturday: "Gesloten",
          sunday: "Gesloten",
        },
      },
      isActive: true,
      lastModified: "2024-01-14 16:45",
    },
  ])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Wijzigingen opgeslagen",
        description: "De content is succesvol bijgewerkt.",
      })
      setIsEditing(false)
    } catch (error) {
      toast({
        title: "Fout bij opslaan",
        description: "Er is een fout opgetreden bij het opslaan.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handlePreview = () => {
    window.open("/", "_blank")
  }

  const currentSection = contentSections.find((section) => section.id === activeSection)

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Content Management</h1>
          <p className="text-muted-foreground">Beheer de inhoud van de homepage en onderliggende pagina's</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button onClick={() => setIsEditing(!isEditing)} variant={isEditing ? "destructive" : "default"}>
            <Edit3 className="mr-2 h-4 w-4" />
            {isEditing ? "Stop Bewerken" : "Bewerken"}
          </Button>
          {isEditing && (
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Opslaan
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Content Sections */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Layout className="h-5 w-5" />
                <span>Content Secties</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {contentSections.map((section) => (
                <div
                  key={section.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    activeSection === section.id ? "bg-blue-100 border-blue-300 border" : "bg-gray-50 hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveSection(section.id)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{section.name}</span>
                    {section.isActive ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Laatst gewijzigd: {section.lastModified}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Snelle Acties</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                <Upload className="mr-2 h-4 w-4" />
                Logo Uploaden
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                <ImageIcon className="mr-2 h-4 w-4" />
                Afbeeldingen Beheren
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                <Palette className="mr-2 h-4 w-4" />
                Kleuren Schema
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                <Type className="mr-2 h-4 w-4" />
                Lettertypen
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Editor */}
        <div className="lg:col-span-3">
          {currentSection && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Edit3 className="h-5 w-5" />
                      <span>{currentSection.name}</span>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Bewerk de inhoud van deze sectie</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="section-active">Actief</Label>
                    <Switch id="section-active" checked={currentSection.isActive} disabled={!isEditing} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="content" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="content">Inhoud</TabsTrigger>
                    <TabsTrigger value="design">Design</TabsTrigger>
                    <TabsTrigger value="seo">SEO</TabsTrigger>
                  </TabsList>

                  <TabsContent value="content" className="space-y-6 mt-6">
                    {/* Hero Section Editor */}
                    {currentSection.type === "hero" && (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="hero-title">Hoofdtitel</Label>
                          <Input
                            id="hero-title"
                            value={currentSection.content.title}
                            disabled={!isEditing}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="hero-subtitle">Ondertitel</Label>
                          <Textarea
                            id="hero-subtitle"
                            value={currentSection.content.subtitle}
                            disabled={!isEditing}
                            rows={3}
                            className="mt-1"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="primary-button">Primaire Knop</Label>
                            <Input
                              id="primary-button"
                              value={currentSection.content.primaryButton}
                              disabled={!isEditing}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="secondary-button">Secundaire Knop</Label>
                            <Input
                              id="secondary-button"
                              value={currentSection.content.secondaryButton}
                              disabled={!isEditing}
                              className="mt-1"
                            />
                          </div>
                        </div>
                        <div>
                          <Label>Voordelen</Label>
                          <div className="space-y-2 mt-2">
                            {currentSection.content.benefits.map((benefit: string, index: number) => (
                              <div key={index} className="flex items-center space-x-2">
                                <Input value={benefit} disabled={!isEditing} className="flex-1" />
                                {isEditing && (
                                  <Button variant="outline" size="sm">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            ))}
                            {isEditing && (
                              <Button variant="outline" size="sm">
                                <Plus className="mr-2 h-4 w-4" />
                                Voordeel Toevoegen
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Pricing Section Editor */}
                    {currentSection.type === "pricing" && (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="pricing-title">Sectie Titel</Label>
                          <Input
                            id="pricing-title"
                            value={currentSection.content.title}
                            disabled={!isEditing}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="pricing-subtitle">Sectie Ondertitel</Label>
                          <Input
                            id="pricing-subtitle"
                            value={currentSection.content.subtitle}
                            disabled={!isEditing}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label>Prijsplannen</Label>
                          <div className="space-y-4 mt-2">
                            {currentSection.content.plans.map((plan: any, index: number) => (
                              <Card key={index} className="p-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>Plan Naam</Label>
                                    <Input value={plan.name} disabled={!isEditing} className="mt-1" />
                                  </div>
                                  <div>
                                    <Label>Prijs</Label>
                                    <Input value={plan.price} disabled={!isEditing} className="mt-1" />
                                  </div>
                                  <div className="col-span-2">
                                    <Label>Beschrijving</Label>
                                    <Input value={plan.description} disabled={!isEditing} className="mt-1" />
                                  </div>
                                </div>
                                {plan.popular && <Badge className="mt-2">Meest Populair</Badge>}
                              </Card>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Company Info Editor */}
                    {currentSection.type === "company" && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="company-name">Bedrijfsnaam</Label>
                            <Input
                              id="company-name"
                              value={currentSection.content.companyName}
                              disabled={!isEditing}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="kvk-number">KvK Nummer</Label>
                            <Input
                              id="kvk-number"
                              value={currentSection.content.kvkNumber}
                              disabled={!isEditing}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="btw-number">BTW Nummer</Label>
                            <Input
                              id="btw-number"
                              value={currentSection.content.btwNumber}
                              disabled={!isEditing}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="iban">IBAN</Label>
                            <Input
                              id="iban"
                              value={currentSection.content.iban}
                              disabled={!isEditing}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="phone">Telefoon</Label>
                            <Input
                              id="phone"
                              value={currentSection.content.phone}
                              disabled={!isEditing}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="email">E-mail</Label>
                            <Input
                              id="email"
                              value={currentSection.content.email}
                              disabled={!isEditing}
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="design" className="space-y-6 mt-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Achtergrondkleur</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="w-8 h-8 bg-blue-600 rounded border"></div>
                          <Input value="#3B82F6" disabled={!isEditing} />
                        </div>
                      </div>
                      <div>
                        <Label>Tekstkleur</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="w-8 h-8 bg-gray-900 rounded border"></div>
                          <Input value="#111827" disabled={!isEditing} />
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label>Lettertype</Label>
                      <Select disabled={!isEditing}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Selecteer lettertype" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="inter">Inter</SelectItem>
                          <SelectItem value="roboto">Roboto</SelectItem>
                          <SelectItem value="opensans">Open Sans</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>

                  <TabsContent value="seo" className="space-y-6 mt-6">
                    <div>
                      <Label htmlFor="meta-title">Meta Titel</Label>
                      <Input
                        id="meta-title"
                        placeholder="BHV360 - Professioneel BHV Beheer Software"
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="meta-description">Meta Beschrijving</Label>
                      <Textarea
                        id="meta-description"
                        placeholder="BHV360 maakt veiligheidsmanagement eenvoudig met digitale plotkaarten, incident management en compliance rapportage."
                        disabled={!isEditing}
                        rows={3}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="keywords">Keywords</Label>
                      <Input
                        id="keywords"
                        placeholder="bhv software, plotkaarten, veiligheidsmanagement, incident management"
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Preview Panel */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Monitor className="h-5 w-5" />
            <span>Live Preview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-4">
            <Button variant="outline" size="sm">
              <Monitor className="mr-2 h-4 w-4" />
              Desktop
            </Button>
            <Button variant="outline" size="sm">
              <Smartphone className="mr-2 h-4 w-4" />
              Mobile
            </Button>
            <Button variant="outline" size="sm">
              <Globe className="mr-2 h-4 w-4" />
              Live Site
            </Button>
          </div>
          <div className="border rounded-lg p-4 bg-gray-50 min-h-[300px] flex items-center justify-center">
            <p className="text-gray-500">Preview wordt hier getoond...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
