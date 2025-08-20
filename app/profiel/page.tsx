"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  User,
  Camera,
  Upload,
  Save,
  Award,
  Calendar,
  Settings,
  Bell,
  Shield,
  Heart,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Plus,
  Trash2,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface Certificate {
  id: string
  name: string
  type: string
  level: string
  issueDate: string
  expiryDate: string
  status: "valid" | "expiring" | "expired"
  file?: string
}

export default function ProfielPage() {
  const { user } = useAuth()
  const [profileImage, setProfileImage] = useState("/placeholder-user.jpg")
  const [isPresent, setIsPresent] = useState(true)
  const [certificates, setCertificates] = useState<Certificate[]>([
    {
      id: "1",
      name: "BHV Basis Certificaat",
      type: "BHV",
      level: "Basis",
      issueDate: "2023-01-15",
      expiryDate: "2025-01-15",
      status: "valid",
    },
    {
      id: "2",
      name: "EHBO Diploma",
      type: "EHBO",
      level: "Diploma",
      issueDate: "2022-06-10",
      expiryDate: "2024-06-10",
      status: "expiring",
    },
  ])

  const [formData, setFormData] = useState({
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ").slice(1).join(" ") || "",
    email: user?.email || "",
    phone: "",
    department: "",
    position: "",
    bio: "",
    emergencyContact: "",
    emergencyPhone: "",
  })

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveProfile = () => {
    // In real app, this would save to database
    alert("Profiel opgeslagen!")
  }

  const addCertificate = () => {
    const newCert: Certificate = {
      id: Date.now().toString(),
      name: "Nieuw Certificaat",
      type: "BHV",
      level: "Basis",
      issueDate: new Date().toISOString().split("T")[0],
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      status: "valid",
    }
    setCertificates([...certificates, newCert])
  }

  const removeCertificate = (id: string) => {
    setCertificates(certificates.filter((cert) => cert.id !== id))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "valid":
        return "bg-green-100 text-green-800"
      case "expiring":
        return "bg-yellow-100 text-yellow-800"
      case "expired":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "valid":
        return <CheckCircle className="h-4 w-4" />
      case "expiring":
        return <Clock className="h-4 w-4" />
      case "expired":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <User className="h-8 w-8 text-blue-600" />
            Mijn Profiel
          </h1>
          <p className="text-muted-foreground">Beheer je persoonlijke gegevens en instellingen</p>
        </div>
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          {user?.role || "Medewerker"}
        </Badge>
      </div>

      <Tabs defaultValue="profiel" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profiel">Profiel</TabsTrigger>
          <TabsTrigger value="certificaten">Certificaten</TabsTrigger>
          <TabsTrigger value="rooster">Rooster</TabsTrigger>
          <TabsTrigger value="instellingen">Instellingen</TabsTrigger>
        </TabsList>

        {/* Profiel Tab */}
        <TabsContent value="profiel" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Persoonlijke Gegevens
              </CardTitle>
              <CardDescription>Update je profiel informatie</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Image */}
              <div className="flex items-center space-x-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profileImage || "/placeholder.svg"} alt="Profiel foto" />
                  <AvatarFallback>
                    {formData.firstName.charAt(0)}
                    {formData.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Label htmlFor="photo-upload" className="cursor-pointer">
                    <Button variant="outline" className="flex items-center gap-2 bg-transparent" asChild>
                      <span>
                        <Camera className="h-4 w-4" />
                        Foto Wijzigen
                      </span>
                    </Button>
                  </Label>
                  <Input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <p className="text-xs text-muted-foreground">JPG, PNG max 2MB</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Voornaam</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Achternaam</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefoon</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Afdeling</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Functie</Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Vertel iets over jezelf..."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                />
              </div>

              {/* Emergency Contact */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Noodcontact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContact">Naam noodcontact</Label>
                    <Input
                      id="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyPhone">Telefoon noodcontact</Label>
                    <Input
                      id="emergencyPhone"
                      value={formData.emergencyPhone}
                      onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleSaveProfile} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Profiel Opslaan
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Certificaten Tab */}
        <TabsContent value="certificaten" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Mijn Certificaten
                  </CardTitle>
                  <CardDescription>Beheer je BHV en EHBO certificaten</CardDescription>
                </div>
                <Button onClick={addCertificate} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Certificaat Toevoegen
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {certificates.map((cert) => (
                  <div key={cert.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          {cert.type === "BHV" ? (
                            <Shield className="h-5 w-5 text-blue-600" />
                          ) : (
                            <Heart className="h-5 w-5 text-red-600" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold">{cert.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {cert.type} - {cert.level}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(cert.status)}>
                          {getStatusIcon(cert.status)}
                          <span className="ml-1">
                            {cert.status === "valid"
                              ? "Geldig"
                              : cert.status === "expiring"
                                ? "Verloopt binnenkort"
                                : "Verlopen"}
                          </span>
                        </Badge>
                        <Button variant="ghost" size="sm" onClick={() => removeCertificate(cert.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <Label>Type</Label>
                        <Select defaultValue={cert.type}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="BHV">BHV</SelectItem>
                            <SelectItem value="EHBO">EHBO</SelectItem>
                            <SelectItem value="Ontruiming">Ontruiming</SelectItem>
                            <SelectItem value="Ploegleider">Ploegleider</SelectItem>
                            <SelectItem value="Coordinator">Coordinator</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Niveau</Label>
                        <Select defaultValue={cert.level}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Basis">Basis</SelectItem>
                            <SelectItem value="Diploma">Diploma</SelectItem>
                            <SelectItem value="Gevorderd">Gevorderd</SelectItem>
                            <SelectItem value="Instructeur">Instructeur</SelectItem>
                            <SelectItem value="Herhalingscursus">Herhalingscursus</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Uitgegeven</Label>
                        <Input type="date" defaultValue={cert.issueDate} />
                      </div>
                      <div>
                        <Label>Verloopt</Label>
                        <Input type="date" defaultValue={cert.expiryDate} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Certificaat Bestand</Label>
                      <div className="flex items-center gap-2">
                        <Input type="file" accept=".pdf,.jpg,.png" />
                        <Button variant="outline" size="sm">
                          <Upload className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rooster Tab */}
        <TabsContent value="rooster" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Aanwezigheid & Rooster
              </CardTitle>
              <CardDescription>Beheer je aanwezigheid en werkrooster</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Switch id="presence" checked={isPresent} onCheckedChange={setIsPresent} />
                  <Label htmlFor="presence" className="flex items-center">
                    Ik ben vandaag aanwezig
                  </Label>
                </div>
                <Badge variant={isPresent ? "default" : "secondary"}>{isPresent ? "Aanwezig" : "Afwezig"}</Badge>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Werkrooster</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Standaard werktijden</Label>
                    <div className="flex items-center gap-2">
                      <Input type="time" defaultValue="09:00" />
                      <span>tot</span>
                      <Input type="time" defaultValue="17:00" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Werkdagen</Label>
                    <div className="flex flex-wrap gap-2">
                      {["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"].map((day) => (
                        <Badge key={day} variant="outline" className="cursor-pointer">
                          {day}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Instellingen Tab */}
        <TabsContent value="instellingen" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Instellingen
              </CardTitle>
              <CardDescription>Beheer je account en notificatie instellingen</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notificaties
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>E-mail notificaties</Label>
                      <p className="text-sm text-muted-foreground">Ontvang updates via e-mail</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Push notificaties</Label>
                      <p className="text-sm text-muted-foreground">Ontvang meldingen op je apparaat</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>SMS notificaties</Label>
                      <p className="text-sm text-muted-foreground">Ontvang belangrijke meldingen via SMS</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Privacy</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Profiel zichtbaar voor collega's</Label>
                      <p className="text-sm text-muted-foreground">Anderen kunnen je profiel bekijken</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Aanwezigheid delen</Label>
                      <p className="text-sm text-muted-foreground">Toon je aanwezigheid aan anderen</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <Button className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Instellingen Opslaan
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
