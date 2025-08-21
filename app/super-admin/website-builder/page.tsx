"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"
import {
  Save,
  Eye,
  Monitor,
  Tablet,
  Smartphone,
  Upload,
  Palette,
  Settings,
  FileText,
  Code,
  RefreshCw,
} from "lucide-react"

interface WebsiteContent {
  homepage: {
    hero: {
      title: string
      subtitle: string
      ctaText: string
      ctaLink: string
      backgroundImage: string
    }
    features: Array<{
      title: string
      description: string
      icon: string
    }>
    testimonials: Array<{
      name: string
      company: string
      text: string
      rating: number
    }>
    contact: {
      email: string
      phone: string
      address: string
    }
  }
  pages: Array<{
    id: string
    title: string
    slug: string
    content: string
    published: boolean
  }>
  settings: {
    siteName: string
    siteDescription: string
    logo: string
    favicon: string
    primaryColor: string
    secondaryColor: string
    font: string
  }
}

export default function WebsiteBuilderPage() {
  const [content, setContent] = useState<WebsiteContent>({
    homepage: {
      hero: {
        title: "Professionele BHV Software voor Moderne Bedrijven",
        subtitle:
          "Beheer uw BHV organisatie efficiënt met onze geavanceerde software. Van plotkaarten tot incidentenbeheer.",
        ctaText: "Start Gratis Trial",
        ctaLink: "/register",
        backgroundImage: "/images/hero-bg.jpg",
      },
      features: [
        {
          title: "Digitale Plotkaarten",
          description: "Interactieve plattegronden met real-time updates",
          icon: "map",
        },
        {
          title: "Incident Management",
          description: "Snelle registratie en opvolging van incidenten",
          icon: "alert",
        },
        {
          title: "BHV Beheer",
          description: "Complete administratie van BHV-ers en certificaten",
          icon: "users",
        },
      ],
      testimonials: [
        {
          name: "Jan Janssen",
          company: "TechCorp BV",
          text: "BHV360 heeft onze veiligheidsprocedures gerevolutioneerd.",
          rating: 5,
        },
      ],
      contact: {
        email: "info@bhv360.nl",
        phone: "+31 20 123 4567",
        address: "Businesspark 123, 1234 AB Amsterdam",
      },
    },
    pages: [
      {
        id: "1",
        title: "Over Ons",
        slug: "over-ons",
        content: "# Over BHV360\n\nWij zijn specialist in BHV software...",
        published: true,
      },
      {
        id: "2",
        title: "Prijzen",
        slug: "prijzen",
        content: "# Prijzen\n\nOnze transparante prijsstructuur...",
        published: true,
      },
    ],
    settings: {
      siteName: "BHV360",
      siteDescription: "Professionele BHV Software",
      logo: "/images/bhv360-logo-full.png",
      favicon: "/favicon.ico",
      primaryColor: "#ea580c",
      secondaryColor: "#dc2626",
      font: "Inter",
    },
  })

  const [activeTab, setActiveTab] = useState("homepage")
  const [previewMode, setPreviewMode] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPage, setSelectedPage] = useState<string>("1")

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Hier zou je de content opslaan naar de database
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call
      toast({
        title: "Wijzigingen opgeslagen",
        description: "De website content is succesvol bijgewerkt.",
      })
    } catch (error) {
      toast({
        title: "Fout bij opslaan",
        description: "Er is een fout opgetreden bij het opslaan.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePreview = () => {
    window.open("/", "_blank")
  }

  const updateHomepageContent = (section: string, field: string, value: any) => {
    setContent((prev) => ({
      ...prev,
      homepage: {
        ...prev.homepage,
        [section]: {
          ...prev.homepage[section as keyof typeof prev.homepage],
          [field]: value,
        },
      },
    }))
  }

  const updateSettings = (field: string, value: string) => {
    setContent((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        [field]: value,
      },
    }))
  }

  const addFeature = () => {
    setContent((prev) => ({
      ...prev,
      homepage: {
        ...prev.homepage,
        features: [
          ...prev.homepage.features,
          { title: "Nieuwe Feature", description: "Beschrijving...", icon: "star" },
        ],
      },
    }))
  }

  const removeFeature = (index: number) => {
    setContent((prev) => ({
      ...prev,
      homepage: {
        ...prev.homepage,
        features: prev.homepage.features.filter((_, i) => i !== index),
      },
    }))
  }

  const addPage = () => {
    const newPage = {
      id: Date.now().toString(),
      title: "Nieuwe Pagina",
      slug: "nieuwe-pagina",
      content: "# Nieuwe Pagina\n\nContent hier...",
      published: false,
    }
    setContent((prev) => ({
      ...prev,
      pages: [...prev.pages, newPage],
    }))
    setSelectedPage(newPage.id)
  }

  const updatePage = (pageId: string, field: string, value: any) => {
    setContent((prev) => ({
      ...prev,
      pages: prev.pages.map((page) => (page.id === pageId ? { ...page, [field]: value } : page)),
    }))
  }

  const deletePage = (pageId: string) => {
    setContent((prev) => ({
      ...prev,
      pages: prev.pages.filter((page) => page.id !== pageId),
    }))
    if (selectedPage === pageId) {
      setSelectedPage(content.pages[0]?.id || "")
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Website Builder</h1>
          <p className="text-gray-600 mt-1">Beheer alle content, design en instellingen van uw website</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <Button
              variant={previewMode === "desktop" ? "default" : "ghost"}
              size="sm"
              onClick={() => setPreviewMode("desktop")}
            >
              <Monitor className="h-4 w-4" />
            </Button>
            <Button
              variant={previewMode === "tablet" ? "default" : "ghost"}
              size="sm"
              onClick={() => setPreviewMode("tablet")}
            >
              <Tablet className="h-4 w-4" />
            </Button>
            <Button
              variant={previewMode === "mobile" ? "default" : "ghost"}
              size="sm"
              onClick={() => setPreviewMode("mobile")}
            >
              <Smartphone className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Opslaan
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor Panel */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Content Editor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="homepage">Homepage</TabsTrigger>
                  <TabsTrigger value="pages">Pagina's</TabsTrigger>
                  <TabsTrigger value="design">Design</TabsTrigger>
                  <TabsTrigger value="settings">Instellingen</TabsTrigger>
                </TabsList>

                <TabsContent value="homepage" className="space-y-6 mt-6">
                  {/* Hero Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Hero Sectie</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="hero-title">Hoofdtitel</Label>
                        <Input
                          id="hero-title"
                          value={content.homepage.hero.title}
                          onChange={(e) => updateHomepageContent("hero", "title", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="hero-subtitle">Ondertitel</Label>
                        <Textarea
                          id="hero-subtitle"
                          value={content.homepage.hero.subtitle}
                          onChange={(e) => updateHomepageContent("hero", "subtitle", e.target.value)}
                          rows={3}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="cta-text">CTA Tekst</Label>
                          <Input
                            id="cta-text"
                            value={content.homepage.hero.ctaText}
                            onChange={(e) => updateHomepageContent("hero", "ctaText", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="cta-link">CTA Link</Label>
                          <Input
                            id="cta-link"
                            value={content.homepage.hero.ctaLink}
                            onChange={(e) => updateHomepageContent("hero", "ctaLink", e.target.value)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Features Section */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Features</CardTitle>
                        <Button onClick={addFeature} size="sm">
                          Toevoegen
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {content.homepage.features.map((feature, index) => (
                        <div key={index} className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline">Feature {index + 1}</Badge>
                            <Button variant="destructive" size="sm" onClick={() => removeFeature(index)}>
                              Verwijderen
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label>Titel</Label>
                              <Input
                                value={feature.title}
                                onChange={(e) => {
                                  const newFeatures = [...content.homepage.features]
                                  newFeatures[index].title = e.target.value
                                  setContent((prev) => ({
                                    ...prev,
                                    homepage: { ...prev.homepage, features: newFeatures },
                                  }))
                                }}
                              />
                            </div>
                            <div>
                              <Label>Icon</Label>
                              <Select
                                value={feature.icon}
                                onValueChange={(value) => {
                                  const newFeatures = [...content.homepage.features]
                                  newFeatures[index].icon = value
                                  setContent((prev) => ({
                                    ...prev,
                                    homepage: { ...prev.homepage, features: newFeatures },
                                  }))
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="map">Map</SelectItem>
                                  <SelectItem value="alert">Alert</SelectItem>
                                  <SelectItem value="users">Users</SelectItem>
                                  <SelectItem value="star">Star</SelectItem>
                                  <SelectItem value="shield">Shield</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div>
                            <Label>Beschrijving</Label>
                            <Textarea
                              value={feature.description}
                              onChange={(e) => {
                                const newFeatures = [...content.homepage.features]
                                newFeatures[index].description = e.target.value
                                setContent((prev) => ({
                                  ...prev,
                                  homepage: { ...prev.homepage, features: newFeatures },
                                }))
                              }}
                              rows={2}
                            />
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="pages" className="space-y-6 mt-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Pagina Beheer</h3>
                    <Button onClick={addPage}>
                      <FileText className="h-4 w-4 mr-2" />
                      Nieuwe Pagina
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Pagina's</Label>
                      <div className="space-y-1">
                        {content.pages.map((page) => (
                          <div
                            key={page.id}
                            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                              selectedPage === page.id ? "bg-orange-50 border-orange-200" : "hover:bg-gray-50"
                            }`}
                            onClick={() => setSelectedPage(page.id)}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{page.title}</span>
                              <div className="flex items-center gap-2">
                                <Badge variant={page.published ? "default" : "secondary"}>
                                  {page.published ? "Live" : "Concept"}
                                </Badge>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    deletePage(page.id)
                                  }}
                                >
                                  ×
                                </Button>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600">/{page.slug}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      {selectedPage && content.pages.find((p) => p.id === selectedPage) && (
                        <Card>
                          <CardHeader>
                            <CardTitle>Pagina Editor</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {(() => {
                              const page = content.pages.find((p) => p.id === selectedPage)!
                              return (
                                <>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label>Titel</Label>
                                      <Input
                                        value={page.title}
                                        onChange={(e) => updatePage(page.id, "title", e.target.value)}
                                      />
                                    </div>
                                    <div>
                                      <Label>URL Slug</Label>
                                      <Input
                                        value={page.slug}
                                        onChange={(e) => updatePage(page.id, "slug", e.target.value)}
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <Label>Content (Markdown)</Label>
                                    <Textarea
                                      value={page.content}
                                      onChange={(e) => updatePage(page.id, "content", e.target.value)}
                                      rows={12}
                                      className="font-mono"
                                    />
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Switch
                                      checked={page.published}
                                      onCheckedChange={(checked) => updatePage(page.id, "published", checked)}
                                    />
                                    <Label>Pagina publiceren</Label>
                                  </div>
                                </>
                              )
                            })()}
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="design" className="space-y-6 mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Palette className="h-5 w-5" />
                        Design Instellingen
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Primaire Kleur</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              type="color"
                              value={content.settings.primaryColor}
                              onChange={(e) => updateSettings("primaryColor", e.target.value)}
                              className="w-16 h-10"
                            />
                            <Input
                              value={content.settings.primaryColor}
                              onChange={(e) => updateSettings("primaryColor", e.target.value)}
                            />
                          </div>
                        </div>
                        <div>
                          <Label>Secundaire Kleur</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              type="color"
                              value={content.settings.secondaryColor}
                              onChange={(e) => updateSettings("secondaryColor", e.target.value)}
                              className="w-16 h-10"
                            />
                            <Input
                              value={content.settings.secondaryColor}
                              onChange={(e) => updateSettings("secondaryColor", e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label>Lettertype</Label>
                        <Select value={content.settings.font} onValueChange={(value) => updateSettings("font", value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Inter">Inter</SelectItem>
                            <SelectItem value="Roboto">Roboto</SelectItem>
                            <SelectItem value="Open Sans">Open Sans</SelectItem>
                            <SelectItem value="Lato">Lato</SelectItem>
                            <SelectItem value="Poppins">Poppins</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h4 className="font-semibold">Logo & Branding</h4>
                        <div>
                          <Label>Logo URL</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              value={content.settings.logo}
                              onChange={(e) => updateSettings("logo", e.target.value)}
                            />
                            <Button variant="outline" size="sm">
                              <Upload className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div>
                          <Label>Favicon URL</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              value={content.settings.favicon}
                              onChange={(e) => updateSettings("favicon", e.target.value)}
                            />
                            <Button variant="outline" size="sm">
                              <Upload className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="settings" className="space-y-6 mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Website Instellingen
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Site Naam</Label>
                        <Input
                          value={content.settings.siteName}
                          onChange={(e) => updateSettings("siteName", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Site Beschrijving</Label>
                        <Textarea
                          value={content.settings.siteDescription}
                          onChange={(e) => updateSettings("siteDescription", e.target.value)}
                          rows={3}
                        />
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h4 className="font-semibold">Contact Informatie</h4>
                        <div>
                          <Label>E-mail</Label>
                          <Input
                            value={content.homepage.contact.email}
                            onChange={(e) => updateHomepageContent("contact", "email", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Telefoon</Label>
                          <Input
                            value={content.homepage.contact.phone}
                            onChange={(e) => updateHomepageContent("contact", "phone", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Adres</Label>
                          <Textarea
                            value={content.homepage.contact.address}
                            onChange={(e) => updateHomepageContent("contact", "address", e.target.value)}
                            rows={2}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Live Preview
              </CardTitle>
              <CardDescription>Preview van uw wijzigingen in {previewMode} modus</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`border rounded-lg overflow-hidden ${
                  previewMode === "desktop"
                    ? "aspect-video"
                    : previewMode === "tablet"
                      ? "aspect-[4/5]"
                      : "aspect-[9/16]"
                }`}
              >
                <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 h-full overflow-y-auto">
                  <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
                    {/* Mini Hero Preview */}
                    <div className="text-center space-y-2">
                      <h3 className="font-bold text-sm">{content.homepage.hero.title}</h3>
                      <p className="text-xs text-gray-600 line-clamp-2">{content.homepage.hero.subtitle}</p>
                      <div
                        className="inline-block px-3 py-1 rounded text-xs text-white"
                        style={{ backgroundColor: content.settings.primaryColor }}
                      >
                        {content.homepage.hero.ctaText}
                      </div>
                    </div>

                    {/* Mini Features Preview */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-xs">Features</h4>
                      {content.homepage.features.slice(0, 3).map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: content.settings.primaryColor }}
                          />
                          <span className="text-xs">{feature.title}</span>
                        </div>
                      ))}
                    </div>

                    {/* Mini Pages Preview */}
                    <div className="space-y-1">
                      <h4 className="font-semibold text-xs">Pagina's</h4>
                      {content.pages
                        .filter((p) => p.published)
                        .map((page) => (
                          <div key={page.id} className="text-xs text-gray-600">
                            • {page.title}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Pagina's:</span>
                  <Badge variant="outline">{content.pages.length}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Gepubliceerd:</span>
                  <Badge variant="outline">{content.pages.filter((p) => p.published).length}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Features:</span>
                  <Badge variant="outline">{content.homepage.features.length}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
