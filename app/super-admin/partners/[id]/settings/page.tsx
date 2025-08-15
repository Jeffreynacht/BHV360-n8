"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save, Trash2, AlertTriangle } from "lucide-react"

export default function PartnerSettingsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // Mock data - in real app this would come from API
  const [settings, setSettings] = useState({
    name: "SafetyFirst Consultancy",
    contactPerson: "Jan de Vries",
    email: "jan@safetyfirst.nl",
    phone: "+31 6 12345678",
    address: "Hoofdstraat 123, 1234 AB Amsterdam",
    website: "https://safetyfirst.nl",
    contractType: "premium",
    commission: 25,
    status: "active",
    whitelabelDomain: "safetyfirst.bhv360.com",
    notes: "Zeer actieve partner met goede klantrelaties.",
    autoApproveCustomers: true,
    sendMonthlyReports: true,
    allowCustomPricing: false,
  })

  const handleSave = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
    // Show success message or redirect
  }

  const handleDelete = async () => {
    if (confirm("Weet je zeker dat je deze partner wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.")) {
      setIsLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      router.push("/super-admin/partners")
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Terug
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Partner Instellingen</h1>
          <p className="text-muted-foreground">{settings.name}</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={isLoading}>
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? "Opslaan..." : "Opslaan"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basis Informatie</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Bedrijfsnaam</Label>
                  <Input
                    id="name"
                    value={settings.name}
                    onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="contactPerson">Contactpersoon</Label>
                  <Input
                    id="contactPerson"
                    value={settings.contactPerson}
                    onChange={(e) => setSettings({ ...settings, contactPerson: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefoon</Label>
                  <Input
                    id="phone"
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="address">Adres</Label>
                <Input
                  id="address"
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={settings.website}
                  onChange={(e) => setSettings({ ...settings, website: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contract Instellingen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contractType">Contract Type</Label>
                  <Select
                    value={settings.contractType}
                    onValueChange={(value) => setSettings({ ...settings, contractType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basis</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="commission">Commissie (%)</Label>
                  <Input
                    id="commission"
                    type="number"
                    min="0"
                    max="100"
                    value={settings.commission}
                    onChange={(e) => setSettings({ ...settings, commission: Number.parseInt(e.target.value) })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={settings.status} onValueChange={(value) => setSettings({ ...settings, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Actief</SelectItem>
                    <SelectItem value="inactive">Inactief</SelectItem>
                    <SelectItem value="suspended">Opgeschort</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>White-label Instellingen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="whitelabelDomain">White-label Domain</Label>
                <Input
                  id="whitelabelDomain"
                  value={settings.whitelabelDomain}
                  onChange={(e) => setSettings({ ...settings, whitelabelDomain: e.target.value })}
                  placeholder="partner.bhv360.com"
                />
              </div>
              <Button variant="outline" onClick={() => router.push(`/white-label?partner=${params.id}`)}>
                White-label Configuratie Openen
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Automatisering</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="autoApprove">Auto-goedkeuring klanten</Label>
                  <p className="text-sm text-muted-foreground">Nieuwe klanten automatisch goedkeuren</p>
                </div>
                <Switch
                  id="autoApprove"
                  checked={settings.autoApproveCustomers}
                  onCheckedChange={(checked) => setSettings({ ...settings, autoApproveCustomers: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="monthlyReports">Maandelijkse rapporten</Label>
                  <p className="text-sm text-muted-foreground">Automatisch rapporten versturen</p>
                </div>
                <Switch
                  id="monthlyReports"
                  checked={settings.sendMonthlyReports}
                  onCheckedChange={(checked) => setSettings({ ...settings, sendMonthlyReports: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="customPricing">Custom pricing</Label>
                  <p className="text-sm text-muted-foreground">Partner mag eigen tarieven instellen</p>
                </div>
                <Switch
                  id="customPricing"
                  checked={settings.allowCustomPricing}
                  onCheckedChange={(checked) => setSettings({ ...settings, allowCustomPricing: checked })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notities</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={settings.notes}
                onChange={(e) => setSettings({ ...settings, notes: e.target.value })}
                placeholder="Partner notities..."
                rows={4}
              />
            </CardContent>
          </Card>

          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Gevaarlijke Zone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Het verwijderen van een partner kan niet ongedaan worden gemaakt.
              </p>
              <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
                <Trash2 className="w-4 h-4 mr-2" />
                Partner Verwijderen
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
