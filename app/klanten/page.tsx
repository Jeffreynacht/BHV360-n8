"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Building2, Plus, Edit, Trash2, Crown } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
  country: string
  contactPerson: string
  subscriptionType: "free" | "basic" | "premium" | "enterprise"
  maxUsers: number
  maxBuildings: number
  isWhitelabel: boolean
  whitelabelConfig?: {
    brandName: string
    primaryColor: string
    secondaryColor: string
    logoUrl: string
    customDomain: string
  }
  features: string[]
  createdAt: string
  status: "active" | "inactive" | "suspended"
}

const subscriptionTypes = {
  free: {
    name: "Gratis",
    maxUsers: 5,
    maxBuildings: 1,
    features: ["Basis BHV functionaliteit", "Eenvoudige rapportages"],
    color: "bg-gray-100 text-gray-800",
  },
  basic: {
    name: "Basis",
    maxUsers: 25,
    maxBuildings: 3,
    features: ["Uitgebreide BHV functionaliteit", "Geavanceerde rapportages", "Email notificaties"],
    color: "bg-blue-100 text-blue-800",
  },
  premium: {
    name: "Premium",
    maxUsers: 100,
    maxBuildings: 10,
    features: ["Alle BHV functionaliteit", "Real-time monitoring", "SMS notificaties", "API toegang"],
    color: "bg-purple-100 text-purple-800",
  },
  enterprise: {
    name: "Enterprise",
    maxUsers: 999,
    maxBuildings: 999,
    features: ["Onbeperkte functionaliteit", "Whitelabel opties", "Dedicated support", "Custom integraties"],
    color: "bg-gold-100 text-gold-800",
  },
}

export default function KlantenPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Nederland",
    contactPerson: "",
    subscriptionType: "free" as const,
    isWhitelabel: false,
    whitelabelConfig: {
      brandName: "",
      primaryColor: "#3b82f6",
      secondaryColor: "#1e40af",
      logoUrl: "",
      customDomain: "",
    },
  })

  useEffect(() => {
    loadCustomers()
  }, [])

  const loadCustomers = async () => {
    try {
      setIsLoading(true)
      // Since we removed demo data, start with empty array
      setCustomers([])
    } catch (error) {
      console.error("Error loading customers:", error)
      toast({
        title: "Fout",
        description: "Kon klanten niet laden",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const subscription = subscriptionTypes[formData.subscriptionType]

      const customerData: Customer = {
        id: editingCustomer?.id || Date.now().toString(),
        ...formData,
        maxUsers: subscription.maxUsers,
        maxBuildings: subscription.maxBuildings,
        features: subscription.features,
        createdAt: editingCustomer?.createdAt || new Date().toISOString(),
        status: "active",
      }

      if (editingCustomer) {
        setCustomers((prev) => prev.map((c) => (c.id === editingCustomer.id ? customerData : c)))
        toast({
          title: "Succes",
          description: "Klant succesvol bijgewerkt",
        })
      } else {
        setCustomers((prev) => [...prev, customerData])
        toast({
          title: "Succes",
          description: "Klant succesvol toegevoegd",
        })
      }

      setIsDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error("Error saving customer:", error)
      toast({
        title: "Fout",
        description: "Kon klant niet opslaan",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer)
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      city: customer.city,
      postalCode: customer.postalCode,
      country: customer.country,
      contactPerson: customer.contactPerson,
      subscriptionType: customer.subscriptionType,
      isWhitelabel: customer.isWhitelabel,
      whitelabelConfig: customer.whitelabelConfig || {
        brandName: "",
        primaryColor: "#3b82f6",
        secondaryColor: "#1e40af",
        logoUrl: "",
        customDomain: "",
      },
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (customerId: string) => {
    if (confirm("Weet je zeker dat je deze klant wilt verwijderen?")) {
      try {
        setCustomers((prev) => prev.filter((c) => c.id !== customerId))
        toast({
          title: "Succes",
          description: "Klant succesvol verwijderd",
        })
      } catch (error) {
        console.error("Error deleting customer:", error)
        toast({
          title: "Fout",
          description: "Kon klant niet verwijderen",
          variant: "destructive",
        })
      }
    }
  }

  const resetForm = () => {
    setEditingCustomer(null)
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
      country: "Nederland",
      contactPerson: "",
      subscriptionType: "free",
      isWhitelabel: false,
      whitelabelConfig: {
        brandName: "",
        primaryColor: "#3b82f6",
        secondaryColor: "#1e40af",
        logoUrl: "",
        customDomain: "",
      },
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Klanten Beheer</h1>
          <p className="text-muted-foreground">Beheer alle klanten en hun configuraties</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Nieuwe Klant
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingCustomer ? "Klant Bewerken" : "Nieuwe Klant Toevoegen"}</DialogTitle>
              <DialogDescription>
                Vul alle benodigde informatie in om een klant toe te voegen of te bewerken.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit}>
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">Basis Info</TabsTrigger>
                  <TabsTrigger value="subscription">Abonnement</TabsTrigger>
                  <TabsTrigger value="whitelabel">Whitelabel</TabsTrigger>
                  <TabsTrigger value="advanced">Geavanceerd</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Bedrijfsnaam *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactPerson">Contactpersoon *</Label>
                      <Input
                        id="contactPerson"
                        value={formData.contactPerson}
                        onChange={(e) => setFormData((prev) => ({ ...prev, contactPerson: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefoon</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Adres</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">Stad</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Postcode</Label>
                      <Input
                        id="postalCode"
                        value={formData.postalCode}
                        onChange={(e) => setFormData((prev) => ({ ...prev, postalCode: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Land</Label>
                      <Select
                        value={formData.country}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, country: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Nederland">Nederland</SelectItem>
                          <SelectItem value="België">België</SelectItem>
                          <SelectItem value="Duitsland">Duitsland</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="subscription" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Abonnement Type</Label>
                    <Select
                      value={formData.subscriptionType}
                      onValueChange={(value: any) => setFormData((prev) => ({ ...prev, subscriptionType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(subscriptionTypes).map(([key, sub]) => (
                          <SelectItem key={key} value={key}>
                            {sub.name} - Max {sub.maxUsers} gebruikers, {sub.maxBuildings} gebouwen
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.subscriptionType && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          {subscriptionTypes[formData.subscriptionType].name} Abonnement
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <p>
                            <strong>Max Gebruikers:</strong> {subscriptionTypes[formData.subscriptionType].maxUsers}
                          </p>
                          <p>
                            <strong>Max Gebouwen:</strong> {subscriptionTypes[formData.subscriptionType].maxBuildings}
                          </p>
                          <div>
                            <strong>Inbegrepen Features:</strong>
                            <ul className="list-disc list-inside mt-1">
                              {subscriptionTypes[formData.subscriptionType].features.map((feature, index) => (
                                <li key={index} className="text-sm text-muted-foreground">
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="whitelabel" className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isWhitelabel"
                      checked={formData.isWhitelabel}
                      onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isWhitelabel: checked }))}
                    />
                    <Label htmlFor="isWhitelabel">Whitelabel Klant</Label>
                  </div>

                  {formData.isWhitelabel && (
                    <div className="space-y-4 p-4 border rounded-lg">
                      <div className="space-y-2">
                        <Label htmlFor="brandName">Merk Naam</Label>
                        <Input
                          id="brandName"
                          value={formData.whitelabelConfig.brandName}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              whitelabelConfig: { ...prev.whitelabelConfig, brandName: e.target.value },
                            }))
                          }
                          placeholder="Bijv. Jouw Bedrijf BHV"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="primaryColor">Primaire Kleur</Label>
                          <div className="flex gap-2">
                            <Input
                              id="primaryColor"
                              type="color"
                              value={formData.whitelabelConfig.primaryColor}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  whitelabelConfig: { ...prev.whitelabelConfig, primaryColor: e.target.value },
                                }))
                              }
                              className="w-16 h-10"
                            />
                            <Input
                              value={formData.whitelabelConfig.primaryColor}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  whitelabelConfig: { ...prev.whitelabelConfig, primaryColor: e.target.value },
                                }))
                              }
                              placeholder="#3b82f6"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="secondaryColor">Secundaire Kleur</Label>
                          <div className="flex gap-2">
                            <Input
                              id="secondaryColor"
                              type="color"
                              value={formData.whitelabelConfig.secondaryColor}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  whitelabelConfig: { ...prev.whitelabelConfig, secondaryColor: e.target.value },
                                }))
                              }
                              className="w-16 h-10"
                            />
                            <Input
                              value={formData.whitelabelConfig.secondaryColor}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  whitelabelConfig: { ...prev.whitelabelConfig, secondaryColor: e.target.value },
                                }))
                              }
                              placeholder="#1e40af"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="logoUrl">Logo URL</Label>
                        <Input
                          id="logoUrl"
                          value={formData.whitelabelConfig.logoUrl}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              whitelabelConfig: { ...prev.whitelabelConfig, logoUrl: e.target.value },
                            }))
                          }
                          placeholder="https://example.com/logo.png"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="customDomain">Custom Domein</Label>
                        <Input
                          id="customDomain"
                          value={formData.whitelabelConfig.customDomain}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              whitelabelConfig: { ...prev.whitelabelConfig, customDomain: e.target.value },
                            }))
                          }
                          placeholder="bhv.jouwbedrijf.nl"
                        />
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="advanced" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Geavanceerde Instellingen</CardTitle>
                      <CardDescription>Extra configuratie opties voor deze klant</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-sm text-muted-foreground">
                        Geavanceerde instellingen worden automatisch geconfigureerd op basis van het gekozen abonnement.
                        Voor custom configuraties, neem contact op met support.
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annuleren
                </Button>
                <Button type="submit">{editingCustomer ? "Bijwerken" : "Toevoegen"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {customers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Building2 className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Geen klanten gevonden</h3>
            <p className="text-muted-foreground text-center mb-4">
              Je hebt nog geen klanten toegevoegd. Klik op "Nieuwe Klant" om te beginnen.
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Eerste Klant Toevoegen
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Klanten Overzicht</CardTitle>
            <CardDescription>
              {customers.length} klant{customers.length !== 1 ? "en" : ""} geregistreerd
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bedrijf</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Abonnement</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Acties</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {customer.name}
                            {customer.isWhitelabel && <Crown className="h-4 w-4 text-yellow-600" />}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {customer.city}, {customer.country}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{customer.contactPerson}</div>
                        <div className="text-sm text-muted-foreground">{customer.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={subscriptionTypes[customer.subscriptionType].color}>
                        {subscriptionTypes[customer.subscriptionType].name}
                      </Badge>
                      <div className="text-xs text-muted-foreground mt-1">
                        {customer.maxUsers} gebruikers, {customer.maxBuildings} gebouwen
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={customer.status === "active" ? "default" : "secondary"}>
                        {customer.status === "active" ? "Actief" : "Inactief"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(customer)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(customer.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
