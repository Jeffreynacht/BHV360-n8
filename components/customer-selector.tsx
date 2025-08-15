"use client"

import { useState } from "react"
import { useCustomer } from "@/components/customer-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Plus, Users, Calendar, Phone, Mail, MapPin } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"

export function CustomerSelector() {
  const { customers, selectedCustomer, setSelectedCustomer, addCustomer, isLoading } = useCustomer()
  const [isAddingCustomer, setIsAddingCustomer] = useState(false)
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    isActive: true,
    modules: [] as string[],
    userCount: 0,
  })

  const handleAddCustomer = async () => {
    try {
      if (!newCustomer.name || !newCustomer.contactPerson || !newCustomer.email) {
        toast({
          title: "Fout",
          description: "Vul alle verplichte velden in",
          variant: "destructive",
        })
        return
      }

      const customer = await addCustomer(newCustomer)
      setSelectedCustomer(customer)
      setIsAddingCustomer(false)
      setNewCustomer({
        name: "",
        contactPerson: "",
        email: "",
        phone: "",
        address: "",
        isActive: true,
        modules: [],
        userCount: 0,
      })

      toast({
        title: "Succes",
        description: `Klant "${customer.name}" is toegevoegd`,
      })
    } catch (error) {
      toast({
        title: "Fout",
        description: "Er is een fout opgetreden bij het toevoegen van de klant",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <Building2 className="h-4 w-4" />
        <span className="text-sm">Laden...</span>
      </div>
    )
  }

  if (customers.length === 0) {
    return (
      <div className="flex items-center space-x-2">
        <Building2 className="h-4 w-4" />
        <span className="text-sm text-muted-foreground">Geen klanten</span>
        <Link href="/klanten">
          <Button size="sm" variant="outline">
            <Plus className="h-3 w-3 mr-1" />
            Toevoegen
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Customer Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building2 className="h-5 w-5 mr-2" />
            Klant Selectie
          </CardTitle>
          <CardDescription>
            {customers.length === 0
              ? "Geen klanten beschikbaar. Voeg je eerste klant toe om te beginnen."
              : "Selecteer een klant om mee te werken"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {customers.length > 0 ? (
            <div className="flex gap-4">
              <div className="flex-1">
                <Select
                  value={selectedCustomer?.id || ""}
                  onValueChange={(value) => {
                    const customer = customers.find((c) => c.id === value)
                    setSelectedCustomer(customer || null)
                  }}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Selecteer klant" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Dialog open={isAddingCustomer} onOpenChange={setIsAddingCustomer}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nieuwe Klant
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Nieuwe Klant Toevoegen</DialogTitle>
                    <DialogDescription>Vul de gegevens in voor de nieuwe klant</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Bedrijfsnaam *</Label>
                      <Input
                        id="name"
                        value={newCustomer.name}
                        onChange={(e) => setNewCustomer((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Bijv. Acme Corporation"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="contactPerson">Contactpersoon *</Label>
                      <Input
                        id="contactPerson"
                        value={newCustomer.contactPerson}
                        onChange={(e) => setNewCustomer((prev) => ({ ...prev, contactPerson: e.target.value }))}
                        placeholder="Bijv. Jan Janssen"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newCustomer.email}
                        onChange={(e) => setNewCustomer((prev) => ({ ...prev, email: e.target.value }))}
                        placeholder="contact@bedrijf.nl"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Telefoon</Label>
                      <Input
                        id="phone"
                        value={newCustomer.phone}
                        onChange={(e) => setNewCustomer((prev) => ({ ...prev, phone: e.target.value }))}
                        placeholder="06-12345678"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="address">Adres</Label>
                      <Input
                        id="address"
                        value={newCustomer.address}
                        onChange={(e) => setNewCustomer((prev) => ({ ...prev, address: e.target.value }))}
                        placeholder="Straat 1, 1234 AB Plaats"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddingCustomer(false)}>
                      Annuleren
                    </Button>
                    <Button onClick={handleAddCustomer}>Klant Toevoegen</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <Dialog open={isAddingCustomer} onOpenChange={setIsAddingCustomer}>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Voeg je eerste klant toe
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Eerste Klant Toevoegen</DialogTitle>
                  <DialogDescription>Welkom bij BHV360! Voeg je eerste klant toe om te beginnen.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Bedrijfsnaam *</Label>
                    <Input
                      id="name"
                      value={newCustomer.name}
                      onChange={(e) => setNewCustomer((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Bijv. Acme Corporation"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="contactPerson">Contactpersoon *</Label>
                    <Input
                      id="contactPerson"
                      value={newCustomer.contactPerson}
                      onChange={(e) => setNewCustomer((prev) => ({ ...prev, contactPerson: e.target.value }))}
                      placeholder="Bijv. Jan Janssen"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newCustomer.email}
                      onChange={(e) => setNewCustomer((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="contact@bedrijf.nl"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Telefoon</Label>
                    <Input
                      id="phone"
                      value={newCustomer.phone}
                      onChange={(e) => setNewCustomer((prev) => ({ ...prev, phone: e.target.value }))}
                      placeholder="06-12345678"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="address">Adres</Label>
                    <Input
                      id="address"
                      value={newCustomer.address}
                      onChange={(e) => setNewCustomer((prev) => ({ ...prev, address: e.target.value }))}
                      placeholder="Straat 1, 1234 AB Plaats"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddingCustomer(false)}>
                    Annuleren
                  </Button>
                  <Button onClick={handleAddCustomer}>Klant Toevoegen</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </CardContent>
      </Card>

      {/* Selected Customer Info */}
      {selectedCustomer && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Building2 className="h-5 w-5 mr-2" />
                {selectedCustomer.name}
              </span>
              <Badge variant={selectedCustomer.isActive ? "default" : "secondary"}>
                {selectedCustomer.isActive ? "Actief" : "Inactief"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-gray-500" />
                <span>{selectedCustomer.contactPerson}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span>{selectedCustomer.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>{selectedCustomer.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>{selectedCustomer.address}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>Toegevoegd: {new Date(selectedCustomer.createdAt).toLocaleDateString("nl-NL")}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-gray-500" />
                <span>{selectedCustomer.userCount} gebruikers</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
