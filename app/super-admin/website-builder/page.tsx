"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Save,
  Eye,
  ImageIcon,
  Type,
  Layout,
  Smartphone,
  Monitor,
  Tablet,
  Globe,
  Settings,
  Palette,
  Code,
  FileText,
} from "lucide-react"
import { BHV360BrandHeader } from "@/components/bhv360-brand-header"
import { toast } from "@/hooks/use-toast"

interface PageContent {
  id: string
  title: string
  description: string
  content: string
  images: string[]
  lastModified: Date
  status: "draft" | "published"
}

interface WebsiteSettings {
  siteName: string
  tagline: string
  primaryColor: string
  secondaryColor: string
  logoUrl: string
  faviconUrl: string
  contactEmail: string
  contactPhone: string
  address: string
}

export default function WebsiteBuilderPage() {
  const [activeTab, setActiveTab] = useState("pages")
  const [selectedPage, setSelectedPage] = useState<string>("homepage")
  const [pages, setPages] = useState<PageContent[]>([
    {
      id: "homepage",
      title: "Homepage",
      description: "Hoofdpagina van BHV360",
      content: `# Welkom bij BHV360
      
Het meest complete BHV platform van Nederland. Beheer uw veiligheid professioneel en efficiënt.

## Onze Diensten
- BHV Plotkaarten
- Incident Management  
- Gebruikersbeheer
- Mobiele App
- Real-time Monitoring

## Waarom BHV360?
✅ Gebruiksvriendelijk
✅ Volledig compliant
✅ 24/7 Support
✅ Nederlandse kwaliteit`,
      images: ["/images/bhv360-logo-full.png"],
      lastModified: new Date(),
      status: "published",
    },
    {
      id: "features",
      title: "Functionaliteiten",
      description: "Overzicht van alle BHV360 features",
      content: `# BHV360 Functionaliteiten

## Core Modules
### BHV Plotkaart
Interactieve plattegronden met veiligheidsvoorzieningen

### Incident Management
Complete incident registratie en opvolging

### Gebruikersbeheer
Geavanceerd rollen- en rechtenbeheer

## Premium Modules
### Mobiele App
Native iOS en Android applicaties

### Real-time Monitoring
Live status van alle veiligheidsvoorzieningen

### Advanced Analytics
Uitgebreide rapportages en dashboards`,
      images: [],
      lastModified: new Date(),
      status: "published",
    },
    {
      id: "pricing",
      title: "Prijzen",
      description: "Transparante prijsstructuur",
      content: `# BHV360 Prijzen

## Starter Pakket - €49/maand
- Tot 25 gebruikers
- Basis plotkaart
- Incident registratie
- Email support

## Professional Pakket - €149/maand  
- Tot 100 gebruikers
- Alle core modules
- Mobiele app
- Priority support
- Advanced analytics

## Enterprise Pakket - Op maat
- Onbeperkt gebruikers
- White-label opties
- Custom integraties
- Dedicated support
- SLA garantie`,
      images: [],
      lastModified: new Date(),
      status: "published",
    },
  ])

  const [websiteSettings, setWebsiteSettings] = useState<WebsiteSettings>({
    siteName: "BHV360",
    tagline: "Het Complete BHV Platform",
    primaryColor: "#2563eb",
    secondaryColor: "#1e40af",
    logoUrl: "/images/bhv360-logo-full.png",
    faviconUrl: "/favicon.ico",
    contactEmail: "info@bhv360.nl",
    contactPhone: "+31 85 130 5000",
    address: "Technologiepark 1, 2628 XJ Delft",
  })

  const [currentContent, setCurrentContent] = useState("")
  const [previewMode, setPreviewMode] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const page = pages.find((p) => p.id === selectedPage)
    if (page) {
      setCurrentContent(page.content)
    }
  }, [selectedPage, pages])

  const handleSavePage = async () => {
    setSaving(true)
    try {
      setPages((prev) =>
        prev.map((page) =>
          page.id === selectedPage ? { ...page, content: currentContent, lastModified: new Date() } : page,
        ),
      )

      toast({
        title: "Pagina Opgeslagen",
        description: "De wijzigingen zijn succesvol opgeslagen.",
      })
    } catch (error) {
      toast({
        title: "Fout bij Opslaan",
        description: "Er is een fout opgetreden bij het opslaan.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handlePublishPage = async () => {
    setSaving(true)
    try {
      setPages((prev) =>
        prev.map((page) =>
          page.id === selectedPage ? { ...page, status: "published", lastModified: new Date() } : page,
        ),
      )

      toast({
        title: "Pagina Gepubliceerd",
        description: "De pagina is live gezet op de website.",
      })
    } catch (error) {
      toast({
        title: "Fout bij Publiceren",
        description: "Er is een fout opgetreden bij het publiceren.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // In een echte implementatie zou je de afbeelding uploaden naar een server
      const imageUrl = URL.createObjectURL(file)
      setCurrentContent((prev) => prev + `\n\n![Afbeelding](${imageUrl})`)
    }
  }

  const currentPage = pages.find((p) => p.id === selectedPage)

  const previewSizeClasses = {
    desktop: "w-full max-w-6xl",
    tablet: "w-full max-w-2xl",
    mobile: "w-full max-w-sm",
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <BHV360BrandHeader customerName="Super Admin" userRole="Website Beheerder" />

      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Website Builder</h1>
          <p className="text-gray-600">Beheer alle content van de BHV360 website en app pagina's</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pages" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Pagina's
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Instellingen
            </TabsTrigger>
            <TabsTrigger value="design" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Design
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pages" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Pagina Selector */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="text-lg">Pagina's</CardTitle>
                  <CardDescription>Selecteer een pagina om te bewerken</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {pages.map((page) => (
                    <Button
                      key={page.id}
                      variant={selectedPage === page.id ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setSelectedPage(page.id)}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span>{page.title}</span>
                        <Badge variant={page.status === "published" ? "default" : "secondary"}>{page.status}</Badge>
                      </div>
                    </Button>
                  ))}
                </CardContent>
              </Card>

              {/* Content Editor */}
              <Card className="lg:col-span-3">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{currentPage?.title}</CardTitle>
                      <CardDescription>{currentPage?.description}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={handleSavePage} disabled={saving}>
                        <Save className="h-4 w-4 mr-2" />
                        Opslaan
                      </Button>
                      <Button onClick={handlePublishPage} disabled={saving}>
                        <Globe className="h-4 w-4 mr-2" />
                        Publiceren
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Editor Toolbar */}
                  <div className="flex items-center gap-2 p-2 border rounded-lg bg-gray-50">
                    <Button variant="ghost" size="sm">
                      <Type className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Layout className="h-4 w-4" />
                    </Button>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <Button variant="ghost" size="sm">
                        <ImageIcon className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Code className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Content Editor */}
                  <Textarea
                    value={currentContent}
                    onChange={(e) => setCurrentContent(e.target.value)}
                    placeholder="Voer hier uw content in (Markdown ondersteund)..."
                    className="min-h-[400px] font-mono"
                  />

                  <Alert>
                    <AlertDescription>
                      Tip: Gebruik Markdown syntax voor opmaak. Bijvoorbeeld **vet**, *cursief*, # Koptekst, - Lijst
                      item
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Website Instellingen</CardTitle>
                <CardDescription>Algemene instellingen voor de BHV360 website</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">Site Naam</Label>
                    <Input
                      id="siteName"
                      value={websiteSettings.siteName}
                      onChange={(e) => setWebsiteSettings((prev) => ({ ...prev, siteName: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tagline">Tagline</Label>
                    <Input
                      id="tagline"
                      value={websiteSettings.tagline}
                      onChange={(e) => setWebsiteSettings((prev) => ({ ...prev, tagline: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={websiteSettings.contactEmail}
                      onChange={(e) => setWebsiteSettings((prev) => ({ ...prev, contactEmail: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Contact Telefoon</Label>
                    <Input
                      id="contactPhone"
                      value={websiteSettings.contactPhone}
                      onChange={(e) => setWebsiteSettings((prev) => ({ ...prev, contactPhone: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Adres</Label>
                  <Textarea
                    id="address"
                    value={websiteSettings.address}
                    onChange={(e) => setWebsiteSettings((prev) => ({ ...prev, address: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="design" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Design & Branding</CardTitle>
                <CardDescription>Pas het uiterlijk van de website aan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Primaire Kleur</Label>
                    <div className="flex gap-2">
                      <Input
                        id="primaryColor"
                        type="color"
                        value={websiteSettings.primaryColor}
                        onChange={(e) => setWebsiteSettings((prev) => ({ ...prev, primaryColor: e.target.value }))}
                        className="w-16 h-10"
                      />
                      <Input
                        value={websiteSettings.primaryColor}
                        onChange={(e) => setWebsiteSettings((prev) => ({ ...prev, primaryColor: e.target.value }))}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondaryColor">Secundaire Kleur</Label>
                    <div className="flex gap-2">
                      <Input
                        id="secondaryColor"
                        type="color"
                        value={websiteSettings.secondaryColor}
                        onChange={(e) => setWebsiteSettings((prev) => ({ ...prev, secondaryColor: e.target.value }))}
                        className="w-16 h-10"
                      />
                      <Input
                        value={websiteSettings.secondaryColor}
                        onChange={(e) => setWebsiteSettings((prev) => ({ ...prev, secondaryColor: e.target.value }))}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logoUrl">Logo URL</Label>
                  <Input
                    id="logoUrl"
                    value={websiteSettings.logoUrl}
                    onChange={(e) => setWebsiteSettings((prev) => ({ ...prev, logoUrl: e.target.value }))}
                  />
                </div>

                <div className="p-4 border rounded-lg bg-gray-50">
                  <h4 className="font-medium mb-2">Logo Preview</h4>
                  <img
                    src={websiteSettings.logoUrl || "/placeholder.svg"}
                    alt="Logo Preview"
                    className="h-12 w-auto object-contain"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Live Preview</CardTitle>
                    <CardDescription>Bekijk hoe de pagina eruit ziet</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={previewMode === "desktop" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPreviewMode("desktop")}
                    >
                      <Monitor className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={previewMode === "tablet" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPreviewMode("tablet")}
                    >
                      <Tablet className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={previewMode === "mobile" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPreviewMode("mobile")}
                    >
                      <Smartphone className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <div className={`${previewSizeClasses[previewMode]} border rounded-lg bg-white p-6 shadow-sm`}>
                    <div className="prose max-w-none">
                      {currentContent.split("\n").map((line, index) => {
                        if (line.startsWith("# ")) {
                          return (
                            <h1 key={index} className="text-3xl font-bold mb-4">
                              {line.substring(2)}
                            </h1>
                          )
                        }
                        if (line.startsWith("## ")) {
                          return (
                            <h2 key={index} className="text-2xl font-semibold mb-3">
                              {line.substring(3)}
                            </h2>
                          )
                        }
                        if (line.startsWith("### ")) {
                          return (
                            <h3 key={index} className="text-xl font-medium mb-2">
                              {line.substring(4)}
                            </h3>
                          )
                        }
                        if (line.startsWith("- ")) {
                          return (
                            <li key={index} className="ml-4">
                              {line.substring(2)}
                            </li>
                          )
                        }
                        if (line.startsWith("✅ ")) {
                          return (
                            <div key={index} className="flex items-center gap-2 mb-1">
                              <span className="text-green-600">✅</span>
                              <span>{line.substring(3)}</span>
                            </div>
                          )
                        }
                        if (line.trim() === "") {
                          return <br key={index} />
                        }
                        return (
                          <p key={index} className="mb-2">
                            {line}
                          </p>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
