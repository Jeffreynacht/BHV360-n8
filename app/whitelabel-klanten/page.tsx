"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Crown, Palette, Globe, Building2, Users, Settings } from "lucide-react"
import Link from "next/link"

interface WhitelabelCustomer {
  id: string
  name: string
  contactPerson: string
  email: string
  subscriptionType: string
  whitelabelConfig: {
    brandName: string
    primaryColor: string
    secondaryColor: string
    logoUrl: string
    customDomain: string
  }
  status: "active" | "inactive"
  createdAt: string
}

export default function WhitelabelKlantenPage() {
  const [whitelabelCustomers, setWhitelabelCustomers] = useState<WhitelabelCustomer[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadWhitelabelCustomers()
  }, [])

  const loadWhitelabelCustomers = async () => {
    try {
      setIsLoading(true)
      // Since we removed demo data, start with empty array
      setWhitelabelCustomers([])
    } catch (error) {
      console.error("Error loading whitelabel customers:", error)
    } finally {
      setIsLoading(false)
    }
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
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Crown className="h-8 w-8 text-yellow-600" />
            Whitelabel Klanten
          </h1>
          <p className="text-muted-foreground">Overzicht van alle whitelabel klanten en hun branding configuraties</p>
        </div>
        <Link href="/klanten">
          <Button>Nieuwe Whitelabel Klant</Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totaal Whitelabel</CardTitle>
            <Crown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{whitelabelCustomers.length}</div>
            <p className="text-xs text-muted-foreground">Actieve whitelabel klanten</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Custom Domeinen</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {whitelabelCustomers.filter((c) => c.whitelabelConfig.customDomain).length}
            </div>
            <p className="text-xs text-muted-foreground">Klanten met eigen domein</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Custom Branding</CardTitle>
            <Palette className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {whitelabelCustomers.filter((c) => c.whitelabelConfig.logoUrl).length}
            </div>
            <p className="text-xs text-muted-foreground">Klanten met eigen logo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actieve Status</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{whitelabelCustomers.filter((c) => c.status === "active").length}</div>
            <p className="text-xs text-muted-foreground">Actieve whitelabel accounts</p>
          </CardContent>
        </Card>
      </div>

      {whitelabelCustomers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Crown className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Geen whitelabel klanten gevonden</h3>
            <p className="text-muted-foreground text-center mb-4">
              Je hebt nog geen whitelabel klanten. Voeg een klant toe en schakel whitelabel functionaliteit in.
            </p>
            <Link href="/klanten">
              <Button>Whitelabel Klant Toevoegen</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Whitelabel Klanten Overzicht</CardTitle>
            <CardDescription>Beheer alle whitelabel configuraties en branding instellingen</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Klant</TableHead>
                  <TableHead>Branding</TableHead>
                  <TableHead>Domein</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Acties</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {whitelabelCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {customer.name}
                            <Crown className="h-4 w-4 text-yellow-600" />
                          </div>
                          <div className="text-sm text-muted-foreground">{customer.contactPerson}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded border"
                          style={{ backgroundColor: customer.whitelabelConfig.primaryColor }}
                        />
                        <div>
                          <div className="font-medium">{customer.whitelabelConfig.brandName || "Geen brand naam"}</div>
                          <div className="text-sm text-muted-foreground">
                            {customer.whitelabelConfig.logoUrl ? "Custom logo" : "Geen logo"}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {customer.whitelabelConfig.customDomain ? (
                        <div className="flex items-center gap-1">
                          <Globe className="h-4 w-4 text-green-600" />
                          <span className="text-sm">{customer.whitelabelConfig.customDomain}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">Geen custom domein</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={customer.status === "active" ? "default" : "secondary"}>
                        {customer.status === "active" ? "Actief" : "Inactief"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Link href={`/klanten`}>
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </Link>
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
