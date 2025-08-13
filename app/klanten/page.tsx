"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageHeader } from "@/components/page-header"
import { useToast } from "@/hooks/use-toast"
import {
  Building2,
  Users,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Plus,
  Edit,
  Trash2,
  Search,
  MoreHorizontal,
  Eye,
  Settings,
  X,
  Loader2,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Customer {
  id: string
  name: string
  contactPerson: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
  buildings: number
  users: number
  status: "active" | "inactive" | "trial"
  createdAt: string
  lastActivity: string
  modules: string[]
  notes?: string
}

const statusColors = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-red-100 text-red-800",
  trial: "bg-yellow-100 text-yellow-800",
}

const statusLabels = {
  active: "Actief",
  inactive: "Inactief",
  trial: "Proefperiode",
}

export default function KlantenPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [activeTab, setActiveTab] = useState("basic")
  const { toast } = useToast()

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    notes: "",
    modules: [] as string[],
  })

  // Load customers on component mount
  useEffect(() => {
    loadCustomers()
  }, [])

  const loadCustomers = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/customers")
      const data = await response.json()

      if (data.success) {
        // Transform API data to match our interface
        const transformedCustomers = data.customers.map((customer: any) => ({
          id: customer.id,
          name: customer.name,
          contactPerson: customer.contactPerson || customer.contact_person || "",
          email: customer.email,
          phone: customer.phone || "",
          address: customer.address || "",
          city: customer.city || "",
          postalCode: customer.postalCode || customer.postal_code || "",
          buildings: customer.buildings || 1,
          users: customer.users || 1,
          status: customer.status || "trial",
          createdAt: customer.createdAt || customer.created_at || new Date().toISOString().split("T")[0],
          lastActivity: customer.lastActivity || customer.last_activity || new Date().toISOString().split("T")[0],
          modules: customer.modules || [],
          notes: customer.notes || "",
        }))
        setCustomers(transformedCustomers)
      } else {
        console.error("Failed to load customers:", data.error)
        setCustomers([])
      }
    } catch (error) {
      console.error("Error loading customers:", error)
      toast({
        title: "Fout",
        description: "Kon klanten niet laden",
        variant: "destructive",
      })
      setCustomers([])
    } finally {
      setIsLoading(false)
    }
  }

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || customer.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleNewCustomer = () => {
    setEditingCustomer(null)
    setFormData({
      name: "",
      contactPerson: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
      notes: "",
      modules: [],
    })
    setActiveTab("basic")
    setIsDialogOpen(true)
  }

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer)
    setFormData({
      name: customer.name,
      contactPerson: customer.contactPerson,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      city: customer.city,
      postalCode: customer.postalCode,
      notes: customer.notes || "",
      modules: customer.modules,
    })
    setActiveTab("basic")
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingCustomer(null)
    setFormData({
      name: "",
      contactPerson: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
      notes: "",
      modules: [],
    })
    setActiveTab("basic")
  }

  const handleSaveCustomer = async () => {
    if (!formData.name || !formData.contactPerson || !formData.email) {
      toast({
        title: "Fout",
        description: "Vul alle verplichte velden in",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      if (editingCustomer) {
        // Update existing customer
        const response = await fetch(`/api/customers/${editingCustomer.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            contact_person: formData.contactPerson,
            postal_code: formData.postalCode,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to update customer")
        }

        const updatedCustomer = await response.json()

        // Transform the response to match our interface
        const transformedCustomer = {
          id: updatedCustomer.id,
          name: updatedCustomer.name,
          contactPerson: updatedCustomer.contactPerson || updatedCustomer.contact_person,
          email: updatedCustomer.email,
          phone: updatedCustomer.phone || "",
          address: updatedCustomer.address || "",
          city: updatedCustomer.city || "",
          postalCode: updatedCustomer.postalCode || updatedCustomer.postal_code || "",
          buildings: updatedCustomer.buildings || 1,
          users: updatedCustomer.users || 1,
          status: updatedCustomer.status || "trial",
          createdAt: updatedCustomer.createdAt || updatedCustomer.created_at || editingCustomer.createdAt,
          lastActivity: new Date().toISOString().split("T")[0],
          modules: updatedCustomer.modules || formData.modules,
          notes: updatedCustomer.notes || "",
        }

        setCustomers(customers.map((customer) => (customer.id === editingCustomer.id ? transformedCustomer : customer)))

        toast({
          title: "Klant bijgewerkt",
          description: `${formData.name} is succesvol bijgewerkt`,
        })
      } else {
        // Add new customer
        const response = await fetch("/api/customers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            contactPerson: formData.contactPerson,
            postalCode: formData.postalCode,
            buildings: 1,
            users: 1,
            status: "trial",
            isActive: true,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to create customer")
        }

        const newCustomerData = await response.json()

        // Transform the response to match our interface
        const newCustomer = {
          id: newCustomerData.id,
          name: newCustomerData.name,
          contactPerson: newCustomerData.contactPerson || newCustomerData.contact_person,
          email: newCustomerData.email,
          phone: newCustomerData.phone || "",
          address: newCustomerData.address || "",
          city: newCustomerData.city || "",
          postalCode: newCustomerData.postalCode || newCustomerData.postal_code || "",
          buildings: newCustomerData.buildings || 1,
          users: newCustomerData.users || 1,
          status: newCustomerData.status || "trial",
          createdAt: newCustomerData.createdAt || new Date().toISOString().split("T")[0],
          lastActivity: new Date().toISOString().split("T")[0],
          modules: newCustomerData.modules || formData.modules,
          notes: newCustomerData.notes || "",
        }

        setCustomers([...customers, newCustomer])

        toast({
          title: "Klant toegevoegd",
          description: `${formData.name} is succesvol toegevoegd`,
        })
      }

      handleCloseDialog()
    } catch (error) {
      console.error("Error saving customer:", error)
      toast({
        title: "Fout",
        description: error instanceof Error ? error.message : "Kon klant niet opslaan",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteCustomer = async (customerId: string) => {
    if (!window.confirm("Weet je zeker dat je deze klant wilt verwijderen?")) {
      return
    }

    try {
      const response = await fetch(`/api/customers/${customerId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete customer")
      }

      setCustomers(customers.filter((customer) => customer.id !== customerId))
      toast({
        title: "Klant verwijderd",
        description: "De klant is succesvol verwijderd",
      })
    } catch (error) {
      console.error("Error deleting customer:", error)
      toast({
        title: "Fout",
        description: error instanceof Error ? error.message : "Kon klant niet verwijderen",
        variant: "destructive",
      })
    }
  }

  const availableModules = [
    "BHV Management",
    "Plotkaart",
    "Incidenten",
    "Rapportages",
    "EHBO",
    "AED Monitoring",
    "NFC Tags",
    "Notificaties",
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Klanten laden...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Klanten Beheer"
        description="Beheer alle klanten en hun configuraties"
        showBackButton={true}
        backUrl="/dashboard"
      >
        <Button onClick={handleNewCustomer} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nieuwe Klant
        </Button>
      </PageHeader>

      {/* Toon filters alleen als er klanten zijn */}
      {customers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Zoeken</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Zoek op naam, contactpersoon of email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full sm:w-48">
                <Label htmlFor="status">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Alle statussen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle statussen</SelectItem>
                    <SelectItem value="active">Actief</SelectItem>
                    <SelectItem value="trial">Proefperiode</SelectItem>
                    <SelectItem value="inactive">Inactief</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Customer Grid - toon alleen als er klanten zijn */}
      {customers.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCustomers.map((customer) => (
            <Card key={customer.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{customer.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {customer.contactPerson}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={statusColors[customer.status]}>{statusLabels[customer.status]}</Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditCustomer(customer)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Bewerken
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          Bekijken
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Settings className="mr-2 h-4 w-4" />
                          Instellingen
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDeleteCustomer(customer.id)} className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Verwijderen
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    {customer.email}
                  </div>
                  {customer.phone && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      {customer.phone}
                    </div>
                  )}
                  {customer.city && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {customer.city}
                    </div>
                  )}
                </div>

                <div className="flex justify-between text-sm">
                  <div className="text-center">
                    <div className="font-semibold text-lg">{customer.buildings}</div>
                    <div className="text-muted-foreground">Gebouwen</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-lg">{customer.users}</div>
                    <div className="text-muted-foreground">Gebruikers</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-lg">{customer.modules.length}</div>
                    <div className="text-muted-foreground">Modules</div>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  Aangemaakt: {new Date(customer.createdAt).toLocaleDateString("nl-NL")}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State - toon als er geen klanten zijn */}
      {customers.length === 0 && (
        <Card>
          <CardContent className="text-center py-16">
            <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
            <h3 className="text-2xl font-semibold mb-3">Welkom bij BHV360!</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Je hebt nog geen klanten toegevoegd. Begin door je eerste klant toe te voegen om het systeem te gaan
              gebruiken.
            </p>
            <Button onClick={handleNewCustomer} size="lg" className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Voeg je eerste klant toe
            </Button>
          </CardContent>
        </Card>
      )}

      {/* No results state - toon als er wel klanten zijn maar geen resultaten */}
      {customers.length > 0 && filteredCustomers.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Geen klanten gevonden</h3>
            <p className="text-muted-foreground mb-4">
              Probeer je zoekfilters aan te passen of voeg een nieuwe klant toe.
            </p>
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setStatusFilter("all")
                }}
              >
                Filters wissen
              </Button>
              <Button onClick={handleNewCustomer}>
                <Plus className="mr-2 h-4 w-4" />
                Nieuwe Klant
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Customer Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>{editingCustomer ? "Klant Bewerken" : "Nieuwe Klant Toevoegen"}</DialogTitle>
                <DialogDescription>
                  {editingCustomer
                    ? "Wijzig de klantgegevens en instellingen"
                    : "Voer de gegevens in voor de nieuwe klant"}
                </DialogDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={handleCloseDialog}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basis Gegevens</TabsTrigger>
              <TabsTrigger value="contact">Contact Info</TabsTrigger>
              <TabsTrigger value="modules">Modules</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Organisatie Naam *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Bijv. Gemeente Amsterdam"
                    disabled={isSaving}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPerson">Contactpersoon *</Label>
                  <Input
                    id="contactPerson"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    placeholder="Bijv. Jan de Vries"
                    disabled={isSaving}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notities</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Aanvullende informatie over deze klant..."
                  rows={3}
                  disabled={isSaving}
                />
              </div>
            </TabsContent>

            <TabsContent value="contact" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Adres *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="contact@organisatie.nl"
                    disabled={isSaving}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefoonnummer</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+31 20 123 4567"
                    disabled={isSaving}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Adres</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Straatnaam 123"
                  disabled={isSaving}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postcode</Label>
                  <Input
                    id="postalCode"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    placeholder="1234 AB"
                    disabled={isSaving}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Plaats</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Amsterdam"
                    disabled={isSaving}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="modules" className="space-y-4">
              <div>
                <Label>Beschikbare Modules</Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Selecteer welke modules beschikbaar zijn voor deze klant
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {availableModules.map((module) => (
                    <div key={module} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={module}
                        checked={formData.modules.includes(module)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              modules: [...formData.modules, module],
                            })
                          } else {
                            setFormData({
                              ...formData,
                              modules: formData.modules.filter((m) => m !== module),
                            })
                          }
                        }}
                        className="rounded border-gray-300"
                        disabled={isSaving}
                      />
                      <Label htmlFor={module} className="text-sm font-normal">
                        {module}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={handleCloseDialog} disabled={isSaving}>
              Annuleren
            </Button>
            <Button onClick={handleSaveCustomer} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {editingCustomer ? "Bijwerken..." : "Toevoegen..."}
                </>
              ) : (
                <>{editingCustomer ? "Bijwerken" : "Toevoegen"}</>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
