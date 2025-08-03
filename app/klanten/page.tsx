"use client"

import { useCustomer } from "@/components/customer-context"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit, Trash2, Building, Users, Settings } from "lucide-react"
import { toast } from "sonner"

export default function KlantenPage() {
  const { customers, selectedCustomer, setSelectedCustomer, isLoading, addCustomer, updateCustomer, deleteCustomer } =
    useCustomer()

  const [isAddingCustomer, setIsAddingCustomer] = useState(false)
  const [isEditingCustomer, setIsEditingCustomer] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  })

  const resetForm = () => {
    setFormData({
      name: "",
      contactPerson: "",
      email: "",
      phone: "",
      address: "",
      notes: "",
    })
  }

  const handleAddCustomer = async () => {
    if (!formData.name.trim()) {
      toast.error("Bedrijfsnaam is verplicht")
      return
    }

    setIsSubmitting(true)

    try {
      const newCustomer = await addCustomer({
        name: formData.name.trim(),
        contactPerson: formData.contactPerson.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        notes: formData.notes.trim(),
      })

      if (newCustomer) {
        toast.success("Klant succesvol toegevoegd")
        resetForm()
        setIsAddingCustomer(false)

        // Auto-select the new customer
        setSelectedCustomer(newCustomer)
      } else {
        toast.error("Er is een fout opgetreden bij het toevoegen van de klant")
      }
    } catch (error) {
      console.error("Error adding customer:", error)
      toast.error("Er is een onverwachte fout opgetreden")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditCustomer = (customer: any) => {
    setFormData({
      name: customer.name || "",
      contactPerson: customer.contactPerson || "",
      email: customer.email || "",
      phone: customer.phone || "",
      address: customer.address || "",
      notes: customer.notes || "",
    })
    setIsEditingCustomer(true)
  }

  const handleUpdateCustomer = async () => {
    if (!selectedCustomer || !formData.name.trim()) {
      toast.error("Bedrijfsnaam is verplicht")
      return
    }

    setIsSubmitting(true)

    try {
      const updatedCustomer = await updateCustomer(selectedCustomer.id, {
        name: formData.name.trim(),
        contactPerson: formData.contactPerson.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        notes: formData.notes.trim(),
      })

      if (updatedCustomer) {
        toast.success("Klant succesvol bijgewerkt")
        resetForm()
        setIsEditingCustomer(false)
      } else {
        toast.error("Er is een fout opgetreden bij het bijwerken van de klant")
      }
    } catch (error) {
      console.error("Error updating customer:", error)
      toast.error("Er is een onverwachte fout opgetreden")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteCustomer = async (customerId: number) => {
    if (!window.confirm("Weet je zeker dat je deze klant wilt verwijderen?")) {
      return
    }

    const success = await deleteCustomer(customerId)

    if (success) {
      toast.success("Klant succesvol verwijderd")
    } else {
      toast.error("Er is een fout opgetreden bij het verwijderen van de klant")
    }
  }

  return (
    <div className="container p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Klantenbeheer</h1>
          <p className="text-muted-foreground">Beheer al je klanten en hun toegang tot het BHV systeem</p>
        </div>
        <Dialog open={isAddingCustomer} onOpenChange={setIsAddingCustomer}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nieuwe Klant
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Nieuwe Klant Toevoegen</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Bedrijfsnaam</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Bijv. Provincie Noord-Brabant"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPerson">Contactpersoon</Label>
                <Input
                  id="contactPerson"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  placeholder="Bijv. Jan de Vries"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="contact@bedrijf.nl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefoon</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="073-681 2345"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="address">Adres</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Straat 1, 1234 AB Plaats"
                />
              </div>
              {/* <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as "active" | "inactive" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Actief</SelectItem>
                    <SelectItem value="inactive">Inactief</SelectItem>
                  </SelectContent>
                </Select>
              </div> */}
              <div className="space-y-2 col-span-2">
                <Label htmlFor="notes">Opmerkingen</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Aanvullende informatie over de klant..."
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddingCustomer(false)}>
                Annuleren
              </Button>
              <Button onClick={handleAddCustomer} disabled={isSubmitting || !formData.name.trim()}>
                {isSubmitting ? "Toevoegen..." : "Klant Toevoegen"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Klanten Overzicht</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bedrijf</TableHead>
                <TableHead>Contactpersoon</TableHead>
                <TableHead>Contact</TableHead>
                {/* <TableHead>Status</TableHead> */}
                <TableHead>Gebouwen</TableHead>
                <TableHead>Gebruikers</TableHead>
                <TableHead>Aangemaakt</TableHead>
                <TableHead>Acties</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.contactPerson}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{customer.email}</div>
                      <div className="text-muted-foreground">{customer.phone}</div>
                    </div>
                  </TableCell>
                  {/* <TableCell>
                    <Badge variant={customer.status === "active" ? "default" : "secondary"}>
                      {customer.status === "active" ? "Actief" : "Inactief"}
                    </Badge>
                  </TableCell> */}
                  <TableCell>
                    <div className="flex items-center">
                      <Building className="h-4 w-4 mr-1" />
                      {customer.buildings}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {customer.users}
                    </div>
                  </TableCell>
                  <TableCell>{customer.createdAt}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditCustomer(customer)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedCustomer(customer)
                          window.location.href = `/bhv`
                        }}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteCustomer(customer.id)}>
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

      {/* Edit Customer Dialog */}
      <Dialog
        open={isEditingCustomer}
        onOpenChange={(open) => {
          setIsEditingCustomer(open)
          if (!open) resetForm()
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Klant Bewerken</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Bedrijfsnaam</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-contactPerson">Contactpersoon</Label>
              <Input
                id="edit-contactPerson"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">E-mail</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Telefoon</Label>
              <Input
                id="edit-phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="edit-address">Adres</Label>
              <Input
                id="edit-address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            {/* <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as "active" | "inactive" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Actief</SelectItem>
                  <SelectItem value="inactive">Inactief</SelectItem>
                </SelectContent>
              </Select>
            </div> */}
            <div className="space-y-2 col-span-2">
              <Label htmlFor="edit-notes">Opmerkingen</Label>
              <Textarea
                id="edit-notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setSelectedCustomer(null)}>
              Annuleren
            </Button>
            <Button onClick={handleUpdateCustomer} disabled={isSubmitting || !formData.name.trim()}>
              {isSubmitting ? "Opslaan..." : "Wijzigingen Opslaan"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
