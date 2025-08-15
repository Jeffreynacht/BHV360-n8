"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import {
  Globe,
  Building,
  Users,
  Shield,
  Settings,
  Map,
  Bell,
  Wifi,
  Tag,
  Eye,
  Wrench,
  FileText,
  Calendar,
  AlertTriangle,
  Radio,
  LayoutDashboard,
  Edit,
  UserCheck,
  Search,
  ExternalLink,
  Lock,
  Crown,
  User,
  Heart,
  Star,
} from "lucide-react"

interface SiteLink {
  path: string
  title: string
  description: string
  icon: any
  requiresAuth: boolean
  roles: string[]
  features?: string[]
  status: "active" | "beta" | "coming-soon"
}

const siteLinks: SiteLink[] = [
  // Platform Admin Level
  {
    path: "/",
    title: "Dashboard",
    description: "Hoofddashboard met overzicht van alle klanten en statistieken",
    icon: LayoutDashboard,
    requiresAuth: true,
    roles: ["Platform Admin", "White-label Partner", "Customer Admin", "BHV Coordinator"],
    status: "active",
  },
  {
    path: "/white-label",
    title: "White-label Portal",
    description: "Beheer van white-label partners, branding en configuratie",
    icon: Crown,
    requiresAuth: true,
    roles: ["Platform Admin"],
    features: ["Partner Management", "Branding", "Pricing", "Features"],
    status: "active",
  },
  {
    path: "/white-label/partner-customers",
    title: "Partner Klanten",
    description: "Klantenbeheer voor white-label partners",
    icon: Building,
    requiresAuth: true,
    roles: ["Platform Admin", "White-label Partner"],
    status: "active",
  },
  {
    path: "/smart-scheduling",
    title: "Smart Scheduling",
    description: "AI-gestuurde BHV planning en optimalisatie",
    icon: Calendar,
    requiresAuth: true,
    roles: ["Platform Admin", "White-label Partner", "Customer Admin", "BHV Coordinator"],
    features: ["AI Optimization", "Workload Balancing", "Conflict Detection"],
    status: "active",
  },
  {
    path: "/integrations",
    title: "Integraties",
    description: "Teams/Slack, SAP/Oracle, Building Management Systems",
    icon: Settings,
    requiresAuth: true,
    roles: ["Platform Admin", "White-label Partner", "Customer Admin"],
    features: ["Teams/Slack", "SAP/Oracle", "Building Management", "Emergency Services"],
    status: "active",
  },

  // Customer Level
  {
    path: "/klanten",
    title: "Klanten",
    description: "Overzicht van alle klanten in het systeem",
    icon: UserCheck,
    requiresAuth: true,
    roles: ["Platform Admin", "White-label Partner"],
    status: "active",
  },
  {
    path: "/gebruikers",
    title: "Gebruikers",
    description: "Gebruikersbeheer voor geselecteerde klant",
    icon: Users,
    requiresAuth: true,
    roles: ["Platform Admin", "White-label Partner", "Customer Admin", "BHV Coordinator"],
    features: ["BHV Rollen", "Certificaten", "Toegankelijkheid", "Roosters"],
    status: "active",
  },

  // BHV Specific
  {
    path: "/bhv",
    title: "BHV Plotkaart",
    description: "Interactieve BHV plotkaart met alle verdiepingen",
    icon: Map,
    requiresAuth: true,
    roles: ["Platform Admin", "White-label Partner", "Customer Admin", "BHV Coordinator", "BHV'er", "EHBO'er"],
    features: ["6 Verdiepingen", "Voorzieningen", "NFC Tags", "Real-time Updates"],
    status: "active",
  },
  {
    path: "/bhv/plotkaart",
    title: "BHV Plotkaart (View)",
    description: "Alleen-lezen weergave van de plotkaart",
    icon: Eye,
    requiresAuth: true,
    roles: ["All Users"],
    status: "active",
  },
  {
    path: "/bhv/editor",
    title: "BHV Plotkaart Editor",
    description: "Editor voor het bewerken van de plotkaart",
    icon: Edit,
    requiresAuth: true,
    roles: ["Platform Admin", "White-label Partner", "Customer Admin", "BHV Coordinator"],
    status: "active",
  },
  {
    path: "/bhv-aanwezigheid",
    title: "BHV Aanwezigheid",
    description: "Real-time overzicht van aanwezige BHV'ers",
    icon: Radio,
    requiresAuth: true,
    roles: ["Platform Admin", "White-label Partner", "Customer Admin", "BHV Coordinator", "BHV'er"],
    features: ["Live Status", "Locatie Tracking", "Beschikbaarheid"],
    status: "active",
  },

  // Operations
  {
    path: "/oefeningen",
    title: "Oefeningen",
    description: "Planning en uitvoering van BHV oefeningen",
    icon: Calendar,
    requiresAuth: true,
    roles: ["Platform Admin", "White-label Partner", "Customer Admin", "BHV Coordinator"],
    status: "active",
  },
  {
    path: "/incidenten",
    title: "Incidenten",
    description: "Incidentenbeheer en rapportage",
    icon: AlertTriangle,
    requiresAuth: true,
    roles: ["Platform Admin", "White-label Partner", "Customer Admin", "BHV Coordinator", "BHV'er"],
    features: ["Real-time Meldingen", "Status Tracking", "Rapportage"],
    status: "active",
  },

  // Communication
  {
    path: "/notificaties",
    title: "Notificaties",
    description: "Notificatie-instellingen en geschiedenis",
    icon: Bell,
    requiresAuth: true,
    roles: ["All Users"],
    features: ["Push Notifications", "Email", "SMS", "Teams/Slack"],
    status: "active",
  },
  {
    path: "/wifi",
    title: "WiFi",
    description: "WiFi netwerk informatie voor gasten",
    icon: Wifi,
    requiresAuth: false,
    roles: ["Public"],
    status: "active",
  },

  // Management
  {
    path: "/beheer/beheeromgeving",
    title: "Beheeromgeving",
    description: "Algemene beheerinstellingen",
    icon: Settings,
    requiresAuth: true,
    roles: ["Platform Admin", "White-label Partner", "Customer Admin"],
    status: "active",
  },
  {
    path: "/beheer/plotkaart-editor",
    title: "Plotkaart Editor (Beheer)",
    description: "Geavanceerde plotkaart editor",
    icon: Edit,
    requiresAuth: true,
    roles: ["Platform Admin", "White-label Partner", "Customer Admin"],
    status: "active",
  },
  {
    path: "/beheer/nfc-tags",
    title: "NFC Tags",
    description: "Beheer van NFC tags en koppeling aan voorzieningen",
    icon: Tag,
    requiresAuth: true,
    roles: ["Platform Admin", "White-label Partner", "Customer Admin", "BHV Coordinator"],
    features: ["Tag Management", "Locatie Koppeling", "Status Monitoring"],
    status: "active",
  },
  {
    path: "/beheer/nfc-overzicht",
    title: "NFC Overzicht",
    description: "Overzicht van alle NFC tags en hun status",
    icon: Eye,
    requiresAuth: true,
    roles: ["Platform Admin", "White-label Partner", "Customer Admin", "BHV Coordinator"],
    status: "active",
  },
  {
    path: "/beheer/nfc-verdiepingen",
    title: "NFC Verdiepingen",
    description: "NFC tags georganiseerd per verdieping",
    icon: Tag,
    requiresAuth: true,
    roles: ["Platform Admin", "White-label Partner", "Customer Admin", "BHV Coordinator"],
    status: "active",
  },
  {
    path: "/beheer/voorzieningen",
    title: "Voorzieningen",
    description: "Beheer van BHV voorzieningen en apparatuur",
    icon: Wrench,
    requiresAuth: true,
    roles: ["Platform Admin", "White-label Partner", "Customer Admin", "BHV Coordinator"],
    features: ["Onderhoud Planning", "Inspectie Schema's", "Status Tracking"],
    status: "active",
  },
  {
    path: "/beheer/gebruikers",
    title: "Gebruikers (Beheer)",
    description: "Geavanceerd gebruikersbeheer met sync functionaliteit",
    icon: Users,
    requiresAuth: true,
    roles: ["Platform Admin", "White-label Partner", "Customer Admin"],
    status: "active",
  },
  {
    path: "/beheer/autorisaties",
    title: "Autorisaties",
    description: "Beheer van gebruikersrechten en toegangscontrole",
    icon: Shield,
    requiresAuth: true,
    roles: ["Platform Admin", "White-label Partner", "Customer Admin"],
    status: "active",
  },
  {
    path: "/beheer/rapportages",
    title: "Rapportages",
    description: "Uitgebreide rapportages en analytics",
    icon: FileText,
    requiresAuth: true,
    roles: ["Platform Admin", "White-label Partner", "Customer Admin", "BHV Coordinator"],
    features: ["PDF Export", "Compliance Reports", "Analytics Dashboard"],
    status: "active",
  },

  // Settings
  {
    path: "/instellingen",
    title: "Instellingen",
    description: "Algemene systeeminstellingen",
    icon: Settings,
    requiresAuth: true,
    roles: ["All Users"],
    features: ["Profiel", "Notificaties", "Beveiliging", "Integraties"],
    status: "active",
  },

  // Help & Support
  {
    path: "/help",
    title: "Help & Ondersteuning",
    description: "Documentatie en ondersteuning",
    icon: Heart,
    requiresAuth: false,
    roles: ["Public"],
    status: "active",
  },
  {
    path: "/video-tutorials",
    title: "Video Tutorials",
    description: "Instructievideo's voor het platform",
    icon: Star,
    requiresAuth: false,
    roles: ["Public"],
    status: "active",
  },

  // Display Modes
  {
    path: "/display/bhv-status",
    title: "BHV Status Display",
    description: "Publieke display voor BHV status (TV schermen)",
    icon: Eye,
    requiresAuth: false,
    roles: ["Public"],
    features: ["Full Screen", "Auto Refresh", "Real-time"],
    status: "active",
  },

  // API Endpoints (for reference)
  {
    path: "/api/push-notification",
    title: "Push Notification API",
    description: "API endpoint voor push notificaties",
    icon: Bell,
    requiresAuth: true,
    roles: ["System"],
    status: "active",
  },
]

export default function SiteMapPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRole, setSelectedRole] = useState("all")

  const filteredLinks = siteLinks.filter((link) => {
    const matchesSearch =
      link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.path.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRole = selectedRole === "all" || link.roles.includes(selectedRole) || link.roles.includes("All Users")

    return matchesSearch && matchesRole
  })

  const roleColors: { [key: string]: string } = {
    "Platform Admin": "bg-red-100 text-red-800",
    "White-label Partner": "bg-purple-100 text-purple-800",
    "Customer Admin": "bg-blue-100 text-blue-800",
    "BHV Coordinator": "bg-green-100 text-green-800",
    "BHV'er": "bg-orange-100 text-orange-800",
    "EHBO'er": "bg-pink-100 text-pink-800",
    "All Users": "bg-gray-100 text-gray-800",
    Public: "bg-yellow-100 text-yellow-800",
    System: "bg-indigo-100 text-indigo-800",
  }

  const statusColors: { [key: string]: string } = {
    active: "bg-green-100 text-green-800",
    beta: "bg-orange-100 text-orange-800",
    "coming-soon": "bg-gray-100 text-gray-800",
  }

  const allRoles = Array.from(new Set(siteLinks.flatMap((link) => link.roles)))

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">BHV360 Site Map</h1>
        <p className="text-muted-foreground">
          Overzicht van alle website links georganiseerd per gebruikersniveau en functionaliteit
        </p>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Zoek pagina's, functies of paden..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="px-3 py-2 border rounded-md bg-background"
        >
          <option value="all">Alle rollen</option>
          {allRoles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>

      <Tabs defaultValue="hierarchy" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="hierarchy">Per Hiërarchie</TabsTrigger>
          <TabsTrigger value="functionality">Per Functionaliteit</TabsTrigger>
          <TabsTrigger value="all">Alle Links</TabsTrigger>
          <TabsTrigger value="stats">Statistieken</TabsTrigger>
        </TabsList>

        <TabsContent value="hierarchy" className="space-y-6">
          <div className="grid gap-6">
            {/* Platform Admin Level */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-red-500" />
                  Platform Admin Niveau
                </CardTitle>
                <CardDescription>Volledige toegang tot alle functionaliteiten en white-label beheer</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {filteredLinks
                    .filter((link) => link.roles.includes("Platform Admin"))
                    .map((link) => (
                      <div key={link.path} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <link.icon className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{link.title}</span>
                              <Badge className={statusColors[link.status]}>{link.status}</Badge>
                              {link.requiresAuth && <Lock className="h-3 w-3 text-muted-foreground" />}
                            </div>
                            <p className="text-sm text-muted-foreground">{link.description}</p>
                            <code className="text-xs bg-muted px-1 rounded">{link.path}</code>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* White-label Partner Level */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-purple-500" />
                  White-label Partner Niveau
                </CardTitle>
                <CardDescription>Toegang tot eigen klanten en beperkte platform functionaliteiten</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {filteredLinks
                    .filter(
                      (link) => link.roles.includes("White-label Partner") && !link.roles.includes("Platform Admin"),
                    )
                    .map((link) => (
                      <div key={link.path} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <link.icon className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{link.title}</span>
                              <Badge className={statusColors[link.status]}>{link.status}</Badge>
                              {link.requiresAuth && <Lock className="h-3 w-3 text-muted-foreground" />}
                            </div>
                            <p className="text-sm text-muted-foreground">{link.description}</p>
                            <code className="text-xs bg-muted px-1 rounded">{link.path}</code>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Customer Admin Level */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-500" />
                  Customer Admin Niveau
                </CardTitle>
                <CardDescription>Beheer van eigen organisatie en BHV functionaliteiten</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {filteredLinks
                    .filter(
                      (link) =>
                        link.roles.includes("Customer Admin") &&
                        !link.roles.includes("Platform Admin") &&
                        !link.roles.includes("White-label Partner"),
                    )
                    .map((link) => (
                      <div key={link.path} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <link.icon className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{link.title}</span>
                              <Badge className={statusColors[link.status]}>{link.status}</Badge>
                              {link.requiresAuth && <Lock className="h-3 w-3 text-muted-foreground" />}
                            </div>
                            <p className="text-sm text-muted-foreground">{link.description}</p>
                            <code className="text-xs bg-muted px-1 rounded">{link.path}</code>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* BHV User Level */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-green-500" />
                  BHV Gebruiker Niveau
                </CardTitle>
                <CardDescription>Toegang tot BHV specifieke functionaliteiten</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {filteredLinks
                    .filter(
                      (link) =>
                        (link.roles.includes("BHV Coordinator") ||
                          link.roles.includes("BHV'er") ||
                          link.roles.includes("EHBO'er")) &&
                        !link.roles.includes("Platform Admin") &&
                        !link.roles.includes("White-label Partner") &&
                        !link.roles.includes("Customer Admin"),
                    )
                    .map((link) => (
                      <div key={link.path} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <link.icon className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{link.title}</span>
                              <Badge className={statusColors[link.status]}>{link.status}</Badge>
                              {link.requiresAuth && <Lock className="h-3 w-3 text-muted-foreground" />}
                            </div>
                            <p className="text-sm text-muted-foreground">{link.description}</p>
                            <code className="text-xs bg-muted px-1 rounded">{link.path}</code>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Public Level */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-yellow-500" />
                  Publiek Toegankelijk
                </CardTitle>
                <CardDescription>Geen authenticatie vereist</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {filteredLinks
                    .filter((link) => !link.requiresAuth || link.roles.includes("Public"))
                    .map((link) => (
                      <div key={link.path} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <link.icon className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{link.title}</span>
                              <Badge className={statusColors[link.status]}>{link.status}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{link.description}</p>
                            <code className="text-xs bg-muted px-1 rounded">{link.path}</code>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="functionality" className="space-y-6">
          <div className="grid gap-6">
            {/* BHV Core */}
            <Card>
              <CardHeader>
                <CardTitle>🚨 BHV Core Functionaliteiten</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {filteredLinks
                    .filter((link) => link.path.includes("bhv") || link.path.includes("incident"))
                    .map((link) => (
                      <div key={link.path} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <link.icon className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{link.title}</span>
                              <div className="flex gap-1">
                                {link.roles.map((role) => (
                                  <Badge key={role} className={roleColors[role]}>
                                    {role}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">{link.description}</p>
                            <code className="text-xs bg-muted px-1 rounded">{link.path}</code>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Management */}
            <Card>
              <CardHeader>
                <CardTitle>⚙️ Beheer & Administratie</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {filteredLinks
                    .filter((link) => link.path.includes("beheer") || link.path.includes("gebruiker"))
                    .map((link) => (
                      <div key={link.path} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <link.icon className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{link.title}</span>
                              <div className="flex gap-1">
                                {link.roles.map((role) => (
                                  <Badge key={role} className={roleColors[role]}>
                                    {role}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">{link.description}</p>
                            <code className="text-xs bg-muted px-1 rounded">{link.path}</code>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Enterprise Features */}
            <Card>
              <CardHeader>
                <CardTitle>🏢 Enterprise Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {filteredLinks
                    .filter(
                      (link) =>
                        link.path.includes("white-label") ||
                        link.path.includes("smart-scheduling") ||
                        link.path.includes("integration"),
                    )
                    .map((link) => (
                      <div key={link.path} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <link.icon className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{link.title}</span>
                              <div className="flex gap-1">
                                {link.roles.map((role) => (
                                  <Badge key={role} className={roleColors[role]}>
                                    {role}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">{link.description}</p>
                            <code className="text-xs bg-muted px-1 rounded">{link.path}</code>
                            {link.features && (
                              <div className="flex gap-1 mt-1">
                                {link.features.map((feature) => (
                                  <Badge key={feature} variant="outline" className="text-xs">
                                    {feature}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-3">
            {filteredLinks.map((link) => (
              <div key={link.path} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <link.icon className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{link.title}</span>
                      <Badge className={statusColors[link.status]}>{link.status}</Badge>
                      {link.requiresAuth && <Lock className="h-3 w-3 text-muted-foreground" />}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{link.description}</p>
                    <code className="text-xs bg-muted px-2 py-1 rounded">{link.path}</code>
                    <div className="flex gap-1 mt-2">
                      {link.roles.map((role) => (
                        <Badge key={role} className={roleColors[role]}>
                          {role}
                        </Badge>
                      ))}
                    </div>
                    {link.features && (
                      <div className="flex gap-1 mt-1">
                        {link.features.map((feature) => (
                          <Badge key={feature} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Totaal Pagina's</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{siteLinks.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Publiek Toegankelijk</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {siteLinks.filter((link) => !link.requiresAuth || link.roles.includes("Public")).length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Authenticatie Vereist</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{siteLinks.filter((link) => link.requiresAuth).length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Enterprise Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {
                    siteLinks.filter(
                      (link) =>
                        link.path.includes("white-label") ||
                        link.path.includes("smart-scheduling") ||
                        link.path.includes("integration"),
                    ).length
                  }
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Rollen Verdeling</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {allRoles.map((role) => {
                  const count = siteLinks.filter((link) => link.roles.includes(role)).length
                  return (
                    <div key={role} className="flex items-center justify-between">
                      <Badge className={roleColors[role]}>{role}</Badge>
                      <span className="text-sm font-medium">{count} pagina's</span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
