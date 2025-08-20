"use client"

import { useState, useEffect } from "react"
import { useCustomer } from "@/components/customer-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import {
  AlertTriangle,
  Package,
  Plus,
  Search,
  TrendingDown,
  TrendingUp,
  Calendar,
  MapPin,
  DollarSign,
} from "lucide-react"

type StockStatus = "in-stock" | "low-stock" | "out-of-stock" | "expired"

type EHBOItem = {
  id: string
  name: string
  category: string
  description: string
  currentStock: number
  minStock: number
  maxStock: number
  unit: string
  location: string
  supplier: string
  cost: number
  expiryDate?: Date
  batchNumber?: string
  status: StockStatus
  lastRestocked: Date
  lastUsed?: Date
  usageRate: number
  autoReorder: boolean
  reorderPoint: number
  reorderQuantity: number
}

type StockMovement = {
  id: string
  itemId: string
  type: "in" | "out" | "adjustment" | "expired"
  quantity: number
  date: Date
  reason: string
  user: string
  batchNumber?: string
  cost?: number
}

type Order = {
  id: string
  supplier: string
  orderDate: Date
  expectedDelivery: Date
  status: "pending" | "ordered" | "delivered" | "cancelled"
  items: { itemId: string; quantity: number; cost: number }[]
  totalCost: number
}

export default function EHBOVoorraadPage() {
  const { selectedCustomer } = useCustomer()
  const [ehboItems, setEhboItems] = useState<EHBOItem[]>([])
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  // Demo data
  useEffect(() => {
    if (selectedCustomer) {
      setEhboItems([
        {
          id: "item-001",
          name: "Steriele Gaasjes 5x5cm",
          category: "Verbandmiddelen",
          description: "Steriele gaasjes voor wondverzorging",
          currentStock: 45,
          minStock: 20,
          maxStock: 100,
          unit: "stuks",
          location: "EHBO Kast A - Plank 1",
          supplier: "MediSupply BV",
          cost: 0.25,
          expiryDate: new Date("2025-06-15"),
          batchNumber: "GS2024001",
          status: "in-stock",
          lastRestocked: new Date("2024-01-10"),
          lastUsed: new Date("2024-01-18"),
          usageRate: 8,
          autoReorder: true,
          reorderPoint: 25,
          reorderQuantity: 50,
        },
        {
          id: "item-002",
          name: "Elastische Zwachtels 6cm",
          category: "Verbandmiddelen",
          description: "Elastische zwachtels voor ondersteuning",
          currentStock: 8,
          minStock: 15,
          maxStock: 50,
          unit: "rollen",
          location: "EHBO Kast A - Plank 2",
          supplier: "MediSupply BV",
          cost: 2.5,
          expiryDate: new Date("2026-03-20"),
          batchNumber: "EZ2024002",
          status: "low-stock",
          lastRestocked: new Date("2023-12-15"),
          lastUsed: new Date("2024-01-12"),
          usageRate: 3,
          autoReorder: true,
          reorderPoint: 15,
          reorderQuantity: 25,
        },
        {
          id: "item-003",
          name: "Paracetamol 500mg",
          category: "Medicijnen",
          description: "Pijnstiller en koortswerend middel",
          currentStock: 0,
          minStock: 10,
          maxStock: 50,
          unit: "strips",
          location: "EHBO Kast B - Medicijnlade",
          supplier: "Pharma Direct",
          cost: 1.8,
          expiryDate: new Date("2024-08-30"),
          batchNumber: "PC2023045",
          status: "out-of-stock",
          lastRestocked: new Date("2023-11-20"),
          lastUsed: new Date("2024-01-05"),
          usageRate: 2,
          autoReorder: true,
          reorderPoint: 10,
          reorderQuantity: 20,
        },
        {
          id: "item-004",
          name: "Instant Coldpack",
          category: "Koeling",
          description: "Instant koelcompres voor verwondingen",
          currentStock: 12,
          minStock: 8,
          maxStock: 30,
          unit: "stuks",
          location: "EHBO Kast C - Koelvak",
          supplier: "CoolMed Solutions",
          cost: 3.75,
          status: "in-stock",
          lastRestocked: new Date("2024-01-08"),
          usageRate: 1,
          autoReorder: false,
          reorderPoint: 8,
          reorderQuantity: 15,
        },
        {
          id: "item-005",
          name: "Desinfecterende Doekjes",
          category: "Hygiëne",
          description: "Alcoholdoekjes voor desinfectie",
          currentStock: 25,
          minStock: 20,
          maxStock: 100,
          unit: "verpakkingen",
          location: "EHBO Kast A - Plank 3",
          supplier: "HygienePlus",
          cost: 4.2,
          expiryDate: new Date("2024-04-15"),
          batchNumber: "DD2023078",
          status: "expired",
          lastRestocked: new Date("2023-10-15"),
          lastUsed: new Date("2024-01-10"),
          usageRate: 5,
          autoReorder: true,
          reorderPoint: 20,
          reorderQuantity: 40,
        },
      ])

      setStockMovements([
        {
          id: "mov-001",
          itemId: "item-001",
          type: "out",
          quantity: 5,
          date: new Date("2024-01-18"),
          reason: "Gebruikt bij incident kantoor",
          user: "Jan de Vries",
          batchNumber: "GS2024001",
        },
        {
          id: "mov-002",
          itemId: "item-002",
          type: "out",
          quantity: 2,
          date: new Date("2024-01-12"),
          reason: "Training EHBO cursus",
          user: "Marie Janssen",
          batchNumber: "EZ2024002",
        },
      ])

      setOrders([
        {
          id: "order-001",
          supplier: "MediSupply BV",
          orderDate: new Date("2024-01-15"),
          expectedDelivery: new Date("2024-01-22"),
          status: "ordered",
          items: [
            { itemId: "item-002", quantity: 25, cost: 62.5 },
            { itemId: "item-003", quantity: 20, cost: 36.0 },
          ],
          totalCost: 98.5,
        },
      ])
    }
  }, [selectedCustomer])

  const getStatusColor = (status: StockStatus) => {
    switch (status) {
      case "in-stock":
        return "bg-green-100 text-green-800"
      case "low-stock":
        return "bg-yellow-100 text-yellow-800"
      case "out-of-stock":
        return "bg-red-100 text-red-800"
      case "expired":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: StockStatus) => {
    switch (status) {
      case "in-stock":
        return <Package className="h-4 w-4" />
      case "low-stock":
        return <TrendingDown className="h-4 w-4" />
      case "out-of-stock":
        return <AlertTriangle className="h-4 w-4" />
      case "expired":
        return <Calendar className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const filteredItems = ehboItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
    const matchesStatus = statusFilter === "all" || item.status === statusFilter

    return matchesSearch && matchesCategory && matchesStatus
  })

  const categories = [...new Set(ehboItems.map((item) => item.category))]
  const totalValue = ehboItems.reduce((sum, item) => sum + item.currentStock * item.cost, 0)
  const lowStockItems = ehboItems.filter((item) => item.status === "low-stock" || item.status === "out-of-stock").length
  const expiredItems = ehboItems.filter((item) => item.status === "expired").length

  if (!selectedCustomer) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Geen klant geselecteerd</CardTitle>
            <CardDescription>Selecteer eerst een klant om de EHBO voorraad te bekijken.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">EHBO Voorraad</h1>
          <p className="text-muted-foreground">Beheer en monitor uw EHBO voorraad voor {selectedCustomer.name}</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nieuw Item
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totale Waarde</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{totalValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Huidige voorraadwaarde</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totaal Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ehboItems.length}</div>
            <p className="text-xs text-muted-foreground">Verschillende producten</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lage Voorraad</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{lowStockItems}</div>
            <p className="text-xs text-muted-foreground">Items onder minimum</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verlopen</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{expiredItems}</div>
            <p className="text-xs text-muted-foreground">Verlopen items</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Zoek items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Categorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle categorieën</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle statussen</SelectItem>
                <SelectItem value="in-stock">Op voorraad</SelectItem>
                <SelectItem value="low-stock">Lage voorraad</SelectItem>
                <SelectItem value="out-of-stock">Uitverkocht</SelectItem>
                <SelectItem value="expired">Verlopen</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inventory">Voorraad</TabsTrigger>
          <TabsTrigger value="movements">Mutaties</TabsTrigger>
          <TabsTrigger value="orders">Bestellingen</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle>Voorraad Overzicht</CardTitle>
              <CardDescription>
                {filteredItems.length} van {ehboItems.length} items
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Categorie</TableHead>
                    <TableHead>Voorraad</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Locatie</TableHead>
                    <TableHead>Vervaldatum</TableHead>
                    <TableHead>Waarde</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">{item.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{item.currentStock}</span>
                            <span className="text-sm text-muted-foreground">{item.unit}</span>
                          </div>
                          <Progress value={(item.currentStock / item.maxStock) * 100} className="h-2" />
                          <div className="text-xs text-muted-foreground">
                            Min: {item.minStock} | Max: {item.maxStock}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(item.status)}>
                          {getStatusIcon(item.status)}
                          <span className="ml-1 capitalize">{item.status.replace("-", " ")}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span className="text-sm">{item.location}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {item.expiryDate ? (
                          <div
                            className={`text-sm ${
                              item.expiryDate < new Date() ? "text-red-600 font-medium" : "text-muted-foreground"
                            }`}
                          >
                            {item.expiryDate.toLocaleDateString("nl-NL")}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">€{(item.currentStock * item.cost).toFixed(2)}</div>
                        <div className="text-xs text-muted-foreground">
                          €{item.cost.toFixed(2)} per {item.unit}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="movements">
          <Card>
            <CardHeader>
              <CardTitle>Voorraad Mutaties</CardTitle>
              <CardDescription>Recente in- en uitgaande bewegingen</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Datum</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Aantal</TableHead>
                    <TableHead>Reden</TableHead>
                    <TableHead>Gebruiker</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockMovements.map((movement) => {
                    const item = ehboItems.find((i) => i.id === movement.itemId)
                    return (
                      <TableRow key={movement.id}>
                        <TableCell>{movement.date.toLocaleDateString("nl-NL")}</TableCell>
                        <TableCell>{item?.name || "Onbekend item"}</TableCell>
                        <TableCell>
                          <Badge variant={movement.type === "in" ? "default" : "secondary"}>
                            {movement.type === "in" ? (
                              <TrendingUp className="h-3 w-3 mr-1" />
                            ) : (
                              <TrendingDown className="h-3 w-3 mr-1" />
                            )}
                            {movement.type === "in" ? "Inkomend" : "Uitgaand"}
                          </Badge>
                        </TableCell>
                        <TableCell>{movement.quantity}</TableCell>
                        <TableCell>{movement.reason}</TableCell>
                        <TableCell>{movement.user}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Bestellingen</CardTitle>
              <CardDescription>Lopende en geplande bestellingen</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Besteldatum</TableHead>
                    <TableHead>Leverancier</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Verwachte levering</TableHead>
                    <TableHead>Totaal</TableHead>
                    <TableHead>Items</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.orderDate.toLocaleDateString("nl-NL")}</TableCell>
                      <TableCell>{order.supplier}</TableCell>
                      <TableCell>
                        <Badge variant={order.status === "delivered" ? "default" : "secondary"}>
                          {order.status === "pending" && "In behandeling"}
                          {order.status === "ordered" && "Besteld"}
                          {order.status === "delivered" && "Geleverd"}
                          {order.status === "cancelled" && "Geannuleerd"}
                        </Badge>
                      </TableCell>
                      <TableCell>{order.expectedDelivery.toLocaleDateString("nl-NL")}</TableCell>
                      <TableCell>€{order.totalCost.toFixed(2)}</TableCell>
                      <TableCell>{order.items.length} items</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
