"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  MessageSquare,
  Building,
  Phone,
  CheckCircle,
  AlertTriangle,
  Link,
  Wifi,
  Shield,
  Cloud,
  Smartphone,
  Camera,
  Thermometer,
  Wind,
  GraduationCap,
  Heart,
  Truck,
  Zap,
  Database,
  BarChart3,
  Radio,
  Watch,
  Lock,
  Eye,
  Activity,
  Gauge,
  FileText,
  Calendar,
  Globe,
  Cpu,
  Speaker,
  Monitor,
} from "lucide-react"

const integrationCategories = [
  {
    id: "communication",
    name: "Communicatie",
    icon: MessageSquare,
    description: "Team communicatie en messaging platforms",
  },
  {
    id: "iot-sensors",
    name: "IoT & Sensoren",
    icon: Wifi,
    description: "Smart building sensoren en IoT devices",
  },
  {
    id: "security",
    name: "Beveiliging & Toegang",
    icon: Shield,
    description: "Toegangscontrole en beveiligingssystemen",
  },
  {
    id: "weather-environment",
    name: "Weer & Omgeving",
    icon: Cloud,
    description: "Weersvoorspellingen en omgevingsmonitoring",
  },
  {
    id: "mobile-wearables",
    name: "Mobile & Wearables",
    icon: Smartphone,
    description: "Mobiele apps en draagbare devices",
  },
  {
    id: "training-certification",
    name: "Training & Certificering",
    icon: GraduationCap,
    description: "Trainingsplatforms en certificeringssystemen",
  },
  {
    id: "healthcare-medical",
    name: "Zorg & Medisch",
    icon: Heart,
    description: "Medische systemen en zorgverlening",
  },
  {
    id: "government-compliance",
    name: "Overheid & Compliance",
    icon: FileText,
    description: "Overheidsinstanties en compliance systemen",
  },
  {
    id: "analytics-bi",
    name: "Analytics & BI",
    icon: BarChart3,
    description: "Business Intelligence en analytics platforms",
  },
  {
    id: "facility-management",
    name: "Facility Management",
    icon: Building,
    description: "Gebouwbeheer en facility management systemen",
  },
]

const integrations = {
  communication: [
    {
      name: "Microsoft Teams",
      description: "Integreer met Microsoft Teams voor real-time communicatie",
      icon: MessageSquare,
      color: "text-blue-600",
      status: "available",
      features: ["Chat integratie", "Video calls", "File sharing", "Bot commands"],
      pricing: "Gratis met Teams account",
    },
    {
      name: "Slack",
      description: "Team communicatie via Slack channels",
      icon: MessageSquare,
      color: "text-green-600",
      status: "available",
      features: ["Channel notifications", "Slash commands", "Workflow automation"],
      pricing: "Gratis met Slack workspace",
    },
    {
      name: "WhatsApp Business",
      description: "WhatsApp Business API voor mobiele communicatie",
      icon: MessageSquare,
      color: "text-green-500",
      status: "beta",
      features: ["Broadcast messages", "Group chats", "Media sharing"],
      pricing: "€0.05 per bericht",
    },
    {
      name: "Telegram Bot",
      description: "Telegram bot voor instant notifications",
      icon: Radio,
      color: "text-blue-500",
      status: "planned",
      features: ["Instant alerts", "Group notifications", "File sharing"],
      pricing: "Gratis",
    },
    {
      name: "Walkie-Talkie Systems",
      description: "Integratie met professionele portofoons",
      icon: Radio,
      color: "text-orange-600",
      status: "enterprise",
      features: ["Push-to-talk", "Group channels", "Emergency override"],
      pricing: "Op aanvraag",
    },
  ],
  "iot-sensors": [
    {
      name: "Smoke Detectors",
      description: "Smart rookmelders met real-time monitoring",
      icon: AlertTriangle,
      color: "text-red-600",
      status: "available",
      features: ["Real-time alerts", "Battery monitoring", "False alarm detection"],
      pricing: "€50-150 per sensor",
    },
    {
      name: "Temperature Sensors",
      description: "Temperatuur en luchtvochtigheid monitoring",
      icon: Thermometer,
      color: "text-orange-500",
      status: "available",
      features: ["Continuous monitoring", "Threshold alerts", "Historical data"],
      pricing: "€25-75 per sensor",
    },
    {
      name: "Air Quality Monitors",
      description: "Luchtkwaliteit en CO2 monitoring",
      icon: Wind,
      color: "text-green-600",
      status: "available",
      features: ["CO2 levels", "Particulate matter", "VOC detection"],
      pricing: "€100-300 per sensor",
    },
    {
      name: "Motion Detectors",
      description: "Bewegingsdetectie voor evacuatiemonitoring",
      icon: Activity,
      color: "text-purple-600",
      status: "beta",
      features: ["Occupancy tracking", "Emergency evacuation", "Zone monitoring"],
      pricing: "€30-80 per sensor",
    },
    {
      name: "Water Leak Sensors",
      description: "Waterlek detectie en monitoring",
      icon: AlertTriangle,
      color: "text-blue-600",
      status: "available",
      features: ["Leak detection", "Flood alerts", "Automatic shutoff"],
      pricing: "€40-120 per sensor",
    },
    {
      name: "Noise Level Monitors",
      description: "Geluidsniveau monitoring voor evacuatie-alarmen",
      icon: Speaker,
      color: "text-yellow-600",
      status: "planned",
      features: ["Decibel monitoring", "Alarm effectiveness", "Ambient noise"],
      pricing: "€80-200 per sensor",
    },
  ],
  security: [
    {
      name: "Badge Access Systems",
      description: "Toegangscontrole via badges en kaarten",
      icon: Lock,
      color: "text-blue-600",
      status: "available",
      features: ["Real-time access logs", "Emergency override", "Visitor management"],
      pricing: "€200-500 per reader",
    },
    {
      name: "Biometric Scanners",
      description: "Vingerafdruk en gezichtsherkenning",
      icon: Eye,
      color: "text-purple-600",
      status: "available",
      features: ["Fingerprint scanning", "Face recognition", "Multi-factor auth"],
      pricing: "€300-800 per scanner",
    },
    {
      name: "CCTV Systems",
      description: "Camera surveillance integratie",
      icon: Camera,
      color: "text-gray-600",
      status: "available",
      features: ["Live monitoring", "Motion detection", "Emergency recording"],
      pricing: "€100-400 per camera",
    },
    {
      name: "Panic Buttons",
      description: "Noodknoppen voor directe hulp",
      icon: AlertTriangle,
      color: "text-red-600",
      status: "available",
      features: ["Silent alarms", "Location tracking", "Immediate response"],
      pricing: "€50-150 per button",
    },
    {
      name: "Perimeter Security",
      description: "Omtrek beveiliging en monitoring",
      icon: Shield,
      color: "text-orange-600",
      status: "enterprise",
      features: ["Fence monitoring", "Intrusion detection", "Automated alerts"],
      pricing: "Op aanvraag",
    },
  ],
  "weather-environment": [
    {
      name: "KNMI Weather API",
      description: "Nederlandse weersvoorspellingen en waarschuwingen",
      icon: Cloud,
      color: "text-blue-500",
      status: "available",
      features: ["Weather alerts", "Storm warnings", "Temperature forecasts"],
      pricing: "Gratis voor basis gebruik",
    },
    {
      name: "OpenWeatherMap",
      description: "Internationale weersdata en voorspellingen",
      icon: Globe,
      color: "text-green-500",
      status: "available",
      features: ["Global weather", "Severe weather alerts", "Historical data"],
      pricing: "€40/maand voor 1000 calls/dag",
    },
    {
      name: "Lightning Detection",
      description: "Bliksem detectie en waarschuwingen",
      icon: Zap,
      color: "text-yellow-500",
      status: "beta",
      features: ["Real-time lightning", "Strike distance", "Safety recommendations"],
      pricing: "€100-300/maand",
    },
    {
      name: "Earthquake Monitoring",
      description: "Aardbevingsmonitoring en waarschuwingen",
      icon: Activity,
      color: "text-red-500",
      status: "planned",
      features: ["Seismic alerts", "Magnitude tracking", "Safety protocols"],
      pricing: "€50-150/maand",
    },
    {
      name: "Flood Warning Systems",
      description: "Overstromingswaarschuwingen en waterstand",
      icon: AlertTriangle,
      color: "text-blue-600",
      status: "available",
      features: ["Water level monitoring", "Flood predictions", "Evacuation triggers"],
      pricing: "€200-500/maand",
    },
  ],
  "mobile-wearables": [
    {
      name: "BHV360 Mobile App",
      description: "Dedicated mobile app voor BHV'ers",
      icon: Smartphone,
      color: "text-blue-600",
      status: "available",
      features: ["Push notifications", "Offline access", "GPS tracking"],
      pricing: "Gratis met account",
    },
    {
      name: "Apple Watch Integration",
      description: "Apple Watch app voor snelle alerts",
      icon: Watch,
      color: "text-gray-800",
      status: "beta",
      features: ["Haptic alerts", "Quick responses", "Heart rate monitoring"],
      pricing: "Gratis met iOS app",
    },
    {
      name: "Android Wear",
      description: "Android smartwatch ondersteuning",
      icon: Watch,
      color: "text-green-600",
      status: "planned",
      features: ["Voice commands", "Quick actions", "Location sharing"],
      pricing: "Gratis met Android app",
    },
    {
      name: "Fitness Trackers",
      description: "Integratie met fitness trackers voor health monitoring",
      icon: Activity,
      color: "text-purple-600",
      status: "beta",
      features: ["Stress monitoring", "Activity tracking", "Emergency detection"],
      pricing: "Afhankelijk van device",
    },
    {
      name: "Lone Worker Devices",
      description: "Speciale devices voor alleenwerkers",
      icon: Shield,
      color: "text-orange-600",
      status: "enterprise",
      features: ["Man-down detection", "Check-in reminders", "Emergency beacon"],
      pricing: "€200-500 per device",
    },
  ],
  "training-certification": [
    {
      name: "Cornerstone OnDemand",
      description: "Learning Management System integratie",
      icon: GraduationCap,
      color: "text-blue-600",
      status: "available",
      features: ["Course tracking", "Certification management", "Progress monitoring"],
      pricing: "€15-25 per gebruiker/maand",
    },
    {
      name: "Moodle LMS",
      description: "Open source learning platform",
      icon: GraduationCap,
      color: "text-green-600",
      status: "available",
      features: ["Custom courses", "Assessment tools", "Progress tracking"],
      pricing: "Gratis (hosting kosten apart)",
    },
    {
      name: "VR Training Platforms",
      description: "Virtual Reality training simulaties",
      icon: Monitor,
      color: "text-purple-600",
      status: "beta",
      features: ["Immersive training", "Emergency simulations", "Performance analytics"],
      pricing: "€500-2000 per licentie",
    },
    {
      name: "Certification Bodies",
      description: "Integratie met officiële certificeringsinstanties",
      icon: FileText,
      color: "text-orange-600",
      status: "planned",
      features: ["Auto certification", "Renewal reminders", "Compliance tracking"],
      pricing: "Variabel per instantie",
    },
    {
      name: "Skills Assessment",
      description: "Vaardigheden assessment en tracking",
      icon: BarChart3,
      color: "text-teal-600",
      status: "available",
      features: ["Skill matrices", "Gap analysis", "Training recommendations"],
      pricing: "€10-20 per assessment",
    },
  ],
  "healthcare-medical": [
    {
      name: "AED Monitoring",
      description: "Automatische Externe Defibrillator monitoring",
      icon: Heart,
      color: "text-red-600",
      status: "available",
      features: ["Device status", "Battery monitoring", "Maintenance alerts"],
      pricing: "€100-300 per AED",
    },
    {
      name: "First Aid Inventory",
      description: "EHBO voorraad management",
      icon: Heart,
      color: "text-green-600",
      status: "available",
      features: ["Stock tracking", "Expiry alerts", "Auto-reordering"],
      pricing: "€50-150/maand",
    },
    {
      name: "Medical Alert Systems",
      description: "Medische noodsystemen",
      icon: AlertTriangle,
      color: "text-red-500",
      status: "beta",
      features: ["Medical emergencies", "Allergy alerts", "Medication tracking"],
      pricing: "€200-500/maand",
    },
    {
      name: "Ambulance Services",
      description: "Directe koppeling met ambulancediensten",
      icon: Truck,
      color: "text-yellow-600",
      status: "enterprise",
      features: ["Auto dispatch", "Location sharing", "Medical history"],
      pricing: "Op aanvraag",
    },
    {
      name: "Hospital Systems",
      description: "Ziekenhuis informatiesystemen",
      icon: Building,
      color: "text-blue-500",
      status: "planned",
      features: ["Patient data", "Emergency protocols", "Resource availability"],
      pricing: "Op aanvraag",
    },
  ],
  "government-compliance": [
    {
      name: "Arbeidsinspectie",
      description: "Nederlandse Arbeidsinspectie rapportage",
      icon: FileText,
      color: "text-orange-600",
      status: "available",
      features: ["Incident reporting", "Compliance checks", "Audit trails"],
      pricing: "Gratis (verplicht)",
    },
    {
      name: "Brandweer Nederland",
      description: "Koppeling met lokale brandweer",
      icon: AlertTriangle,
      color: "text-red-600",
      status: "beta",
      features: ["Emergency dispatch", "Building info sharing", "Response coordination"],
      pricing: "Gratis",
    },
    {
      name: "Gemeente Systemen",
      description: "Lokale gemeente informatiesystemen",
      icon: Building,
      color: "text-blue-600",
      status: "planned",
      features: ["Permit management", "Safety inspections", "Compliance reporting"],
      pricing: "Variabel per gemeente",
    },
    {
      name: "OSHA Compliance",
      description: "Internationale veiligheidsnormen",
      icon: Shield,
      color: "text-green-600",
      status: "available",
      features: ["Standards compliance", "Audit support", "Documentation"],
      pricing: "€100-300/maand",
    },
    {
      name: "ISO Certification",
      description: "ISO 45001 en andere veiligheidscertificaten",
      icon: FileText,
      color: "text-purple-600",
      status: "enterprise",
      features: ["ISO compliance", "Audit preparation", "Documentation management"],
      pricing: "Op aanvraag",
    },
  ],
  "analytics-bi": [
    {
      name: "Power BI",
      description: "Microsoft Power BI dashboards en rapportage",
      icon: BarChart3,
      color: "text-yellow-600",
      status: "available",
      features: ["Custom dashboards", "Real-time data", "Advanced analytics"],
      pricing: "€8-16 per gebruiker/maand",
    },
    {
      name: "Tableau",
      description: "Tableau data visualisatie platform",
      icon: BarChart3,
      color: "text-blue-600",
      status: "available",
      features: ["Interactive visualizations", "Data storytelling", "Predictive analytics"],
      pricing: "€60-140 per gebruiker/maand",
    },
    {
      name: "Google Analytics",
      description: "Web analytics en gebruikersgedrag",
      icon: BarChart3,
      color: "text-orange-600",
      status: "available",
      features: ["Usage tracking", "Performance metrics", "User behavior"],
      pricing: "Gratis voor basis gebruik",
    },
    {
      name: "Elasticsearch",
      description: "Log analysis en search platform",
      icon: Database,
      color: "text-teal-600",
      status: "beta",
      features: ["Log aggregation", "Real-time search", "Anomaly detection"],
      pricing: "€45-95 per node/maand",
    },
    {
      name: "Machine Learning APIs",
      description: "AI/ML voor predictive analytics",
      icon: Cpu,
      color: "text-purple-600",
      status: "planned",
      features: ["Predictive maintenance", "Risk assessment", "Pattern recognition"],
      pricing: "Variabel per API call",
    },
  ],
  "facility-management": [
    {
      name: "CAFM Systems",
      description: "Computer Aided Facility Management",
      icon: Building,
      color: "text-blue-600",
      status: "available",
      features: ["Asset management", "Maintenance scheduling", "Space planning"],
      pricing: "€50-200 per gebruiker/maand",
    },
    {
      name: "HVAC Control",
      description: "Heating, Ventilation & Air Conditioning",
      icon: Wind,
      color: "text-green-600",
      status: "available",
      features: ["Climate control", "Energy optimization", "Emergency ventilation"],
      pricing: "€1000-5000 per systeem",
    },
    {
      name: "Lighting Control",
      description: "Smart lighting en emergency lighting",
      icon: Zap,
      color: "text-yellow-600",
      status: "available",
      features: ["Emergency lighting", "Automated control", "Energy monitoring"],
      pricing: "€100-500 per zone",
    },
    {
      name: "Elevator Monitoring",
      description: "Lift monitoring en noodcommunicatie",
      icon: Building,
      color: "text-gray-600",
      status: "beta",
      features: ["Status monitoring", "Emergency communication", "Maintenance alerts"],
      pricing: "€200-800 per lift",
    },
    {
      name: "Energy Management",
      description: "Energie monitoring en optimalisatie",
      icon: Gauge,
      color: "text-green-500",
      status: "available",
      features: ["Energy tracking", "Cost optimization", "Sustainability reporting"],
      pricing: "€300-1000/maand",
    },
  ],
}

export default function IntegrationsPage() {
  const [selectedCategory, setSelectedCategory] = useState("communication")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredIntegrations =
    integrations[selectedCategory as keyof typeof integrations]?.filter((integration) => {
      const matchesSearch =
        integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        integration.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || integration.status === statusFilter
      return matchesSearch && matchesStatus
    }) || []

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-100 text-green-800">Beschikbaar</Badge>
      case "beta":
        return <Badge className="bg-blue-100 text-blue-800">Beta</Badge>
      case "planned":
        return <Badge className="bg-yellow-100 text-yellow-800">Gepland</Badge>
      case "enterprise":
        return <Badge className="bg-purple-100 text-purple-800">Enterprise</Badge>
      default:
        return <Badge variant="secondary">Onbekend</Badge>
    }
  }

  return (
    <div className="container p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Systeem Integraties</h1>
          <p className="text-muted-foreground">
            Verbind BHV360 met 50+ externe systemen en platforms voor een complete safety management oplossing
          </p>
        </div>
        <Button>
          <Link className="h-4 w-4 mr-2" />
          Custom Integratie Aanvragen
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input placeholder="Zoek integraties..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle statussen</SelectItem>
            <SelectItem value="available">Beschikbaar</SelectItem>
            <SelectItem value="beta">Beta</SelectItem>
            <SelectItem value="planned">Gepland</SelectItem>
            <SelectItem value="enterprise">Enterprise</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Categorieën</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {integrationCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedCategory === category.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <category.icon className="h-5 w-5" />
                      <div>
                        <div className="font-medium">{category.name}</div>
                        <div className="text-xs opacity-70">{category.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Integrations Grid */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredIntegrations.map((integration, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <integration.icon className={`h-6 w-6 ${integration.color}`} />
                      <div>
                        <CardTitle className="text-lg">{integration.name}</CardTitle>
                        <CardDescription className="mt-1">{integration.description}</CardDescription>
                      </div>
                    </div>
                    {getStatusBadge(integration.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Features */}
                    <div>
                      <Label className="text-sm font-medium">Features:</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {integration.features.map((feature, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Pricing */}
                    <div>
                      <Label className="text-sm font-medium">Prijzen:</Label>
                      <p className="text-sm text-muted-foreground mt-1">{integration.pricing}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2 pt-2">
                      {integration.status === "available" && (
                        <Button size="sm" className="flex-1">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Configureren
                        </Button>
                      )}
                      {integration.status === "beta" && (
                        <Button size="sm" variant="outline" className="flex-1">
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          Beta Aanvragen
                        </Button>
                      )}
                      {integration.status === "planned" && (
                        <Button size="sm" variant="outline" className="flex-1">
                          <Calendar className="h-4 w-4 mr-1" />
                          Interesse Tonen
                        </Button>
                      )}
                      {integration.status === "enterprise" && (
                        <Button size="sm" variant="outline" className="flex-1">
                          <Phone className="h-4 w-4 mr-1" />
                          Contact Sales
                        </Button>
                      )}
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredIntegrations.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Geen integraties gevonden</h3>
                <p className="text-muted-foreground mb-4">Probeer een andere zoekopdracht of filter.</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    setStatusFilter("all")
                  }}
                >
                  Filters wissen
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Integration Stats */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Integratie Overzicht</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {
                  Object.values(integrations)
                    .flat()
                    .filter((i) => i.status === "available").length
                }
              </div>
              <div className="text-sm text-muted-foreground">Beschikbaar</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {
                  Object.values(integrations)
                    .flat()
                    .filter((i) => i.status === "beta").length
                }
              </div>
              <div className="text-sm text-muted-foreground">Beta</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {
                  Object.values(integrations)
                    .flat()
                    .filter((i) => i.status === "planned").length
                }
              </div>
              <div className="text-sm text-muted-foreground">Gepland</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {
                  Object.values(integrations)
                    .flat()
                    .filter((i) => i.status === "enterprise").length
                }
              </div>
              <div className="text-sm text-muted-foreground">Enterprise</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
