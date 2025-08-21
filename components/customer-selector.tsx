"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useCustomer } from "@/components/customer-context"
import { Building, Users, Plus, Check, ChevronDown } from "lucide-react"

export default function CustomerSelector() {
  const { customers, selectedCustomer, setSelectedCustomer, addCustomer, isLoading } = useCustomer()
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showSelector, setShowSelector] = useState(false)
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    contactPerson: "",
  })

  const handleAddCustomer = () => {
    if (newCustomer.name && newCustomer.email) {
      addCustomer(newCustomer)
      setNewCustomer({
        name: "",
        email: "",
        phone: "",
        address: "",
        contactPerson: "",
      })
      setShowAddDialog(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
        <div className="w-32 h-4 bg-gray-300 rounded animate-pulse"></div>
      </div>
    )
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setShowSelector(!showSelector)}
        className="w-full justify-between bg-white/80 backdrop-blur-sm"
      >
        <div className="flex items-center space-x-2">
          <Building className="h-4 w-4" />
          <span>{selectedCustomer?.name || "Selecteer klant"}</span>
        </div>
        <ChevronDown className="h-4 w-4" />
      </Button>

      {showSelector && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-2 bg-white/95 backdrop-blur-sm shadow-lg border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Selecteer Klant</CardTitle>
              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-1" />
                    Nieuwe Klant
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Nieuwe Klant Toevoegen</DialogTitle>
                    <DialogDescription>Voeg een nieuwe klant toe aan het systeem.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Bedrijfsnaam</Label>
                      <Input
                        id="name"
                        value={newCustomer.name}
                        onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                        placeholder="Bijv. Ziekenhuis Sint Anna"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newCustomer.email}
                        onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                        placeholder="info@bedrijf.nl"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Telefoon</Label>
                      <Input
                        id="phone"
                        value={newCustomer.phone}
                        onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                        placeholder="+31 13 123 4567"
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">Adres</Label>
                      <Input
                        id="address"
                        value={newCustomer.address}
                        onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                        placeholder="Hoofdstraat 123, 5000 AB Tilburg"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactPerson">Contactpersoon</Label>
                      <Input
                        id="contactPerson"
                        value={newCustomer.contactPerson}
                        onChange={(e) => setNewCustomer({ ...newCustomer, contactPerson: e.target.value })}
                        placeholder="Dr. Maria van der Berg"
                      />
                    </div>
                    <Button onClick={handleAddCustomer} className="w-full">
                      Klant Toevoegen
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {customers.map((customer) => (
              <div
                key={customer.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedCustomer?.id === customer.id
                    ? "bg-blue-50 border-2 border-blue-200"
                    : "hover:bg-gray-50 border-2 border-transparent"
                }`}
                onClick={() => {
                  setSelectedCustomer(customer)
                  setShowSelector(false)
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">{customer.name}</h4>
                      {selectedCustomer?.id === customer.id && <Check className="h-4 w-4 text-blue-600" />}
                    </div>
                    <p className="text-sm text-gray-600">{customer.contactPerson}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Users className="h-3 w-3" />
                        <span>{customer.users} gebruikers</span>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Building className="h-3 w-3" />
                        <span>{customer.buildings} gebouwen</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant={customer.isActive ? "default" : "secondary"}>
                    {customer.isActive ? "Actief" : "Inactief"}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
