"use client"

import { CardDescription } from "@/components/ui/card"

import { DialogDescription } from "@/components/ui/dialog"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Building2, Users, Mail, Phone, MapPin, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { useCustomer, type Customer } from "@/components/customer-context"
import { cn } from "@/lib/utils"

export default function DebugCustomerSelector() {
  const { user } = useAuth()
  const { customers, setSelectedCustomer, addCustomer, isLoading } = useCustomer()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newCustomerName, setNewCustomerName] = useState("")
  const [newCustomerContactPerson, setNewCustomerContactPerson] = useState("")
  const [newCustomerEmail, setNewCustomerEmail] = useState("")
  const [newCustomerPhone, setNewCustomerPhone] = useState("")
  const [newCustomerAddress, setNewCustomerAddress] = useState("")
  const { toast } = useToast()

  const handleAddCustomer = async () => {
    if (!newCustomerName) {
      toast({
        title: "Error",
        description: "Please enter a customer name.",
        variant: "destructive",
      })
      return
    }

    const newCustomer = {
      name: newCustomerName,
      contactPerson: newCustomerContactPerson,
      email: newCustomerEmail,
      phone: newCustomerPhone,
      address: newCustomerAddress,
    }

    addCustomer(newCustomer)
    setNewCustomerName("")
    setNewCustomerContactPerson("")
    setNewCustomerEmail("")
    setNewCustomerPhone("")
    setNewCustomerAddress("")
    setIsDialogOpen(false)
  }

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer)
    toast({
      title: "Klant geselecteerd",
      description: `${customer.name} is geselecteerd.`,
    })
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Debug Klanten Overzicht</h1>
          <p className="text-muted-foreground">Beheer uw klanten en hun instellingen</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nieuwe Klant
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Nieuwe Klant Toevoegen</DialogTitle>
              <DialogDescription>Vul de gegevens van de nieuwe klant in</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Naam</Label>
                  <Input
                    id="name"
                    placeholder="Naam van de klant"
                    value={newCustomerName}
                    onChange={(e) => setNewCustomerName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPerson">Contactpersoon</Label>
                  <Input
                    id="contactPerson"
                    placeholder="Naam van de contactpersoon"
                    value={newCustomerContactPerson}
                    onChange={(e) => setNewCustomerContactPerson(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="E-mailadres van de klant"
                  value={newCustomerEmail}
                  onChange={(e) => setNewCustomerEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefoon</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Telefoonnummer van de klant"
                  value={newCustomerPhone}
                  onChange={(e) => setNewCustomerPhone(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Adres</Label>
                <Input
                  id="address"
                  placeholder="Adres van de klant"
                  value={newCustomerAddress}
                  onChange={(e) => setNewCustomerAddress(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuleren
              </Button>
              <Button onClick={handleAddCustomer}>Klant Toevoegen</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customers.map((customer) => (
            <Card
              key={customer.id}
              className={cn(
                "cursor-pointer transition-all hover:shadow-md",
                customer.id === user?.customerId ? "ring-2 ring-blue-500" : "",
              )}
              onClick={() => handleSelectCustomer(customer)}
            >
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="h-4 w-4 mr-2" />
                  {customer.name}
                </CardTitle>
                <CardDescription>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                    Actief
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                  <span>{customer.address}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-gray-500" />
                  <span>Contact: {customer.contactPerson}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{customer.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{customer.phone}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Aangemaakt op {new Date(customer.createdAt).toLocaleDateString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  {customer.users} gebruikers - {customer.buildings} gebouwen
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
