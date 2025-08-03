"use client"

import { useState, useEffect } from "react"
import { useCustomer } from "./customer-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function DebugCustomerSelector() {
  const { customers, selectedCustomer, setSelectedCustomer, loading } = useCustomer()
  const [debugInfo, setDebugInfo] = useState<string>("")

  // Log debug info on mount and when dependencies change
  useEffect(() => {
    const info = `
      Customers loaded: ${customers.length}
      Selected customer: ${selectedCustomer?.name || "none"}
      Loading state: ${loading ? "true" : "false"}
    `
    setDebugInfo(info)
    console.log("Debug Customer Selector:", {
      customersCount: customers.length,
      customerNames: customers.map((c) => c.name),
      selectedCustomer: selectedCustomer?.name || "none",
      loading,
    })
  }, [customers, selectedCustomer, loading])

  if (loading) {
    return <div className="p-4 bg-yellow-100 rounded">Klanten worden geladen...</div>
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Klant Selector Debug</CardTitle>
        <CardDescription>
          Deze component toont alle beschikbare klanten en laat je wisselen tussen klanten.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-2 bg-muted rounded text-xs font-mono whitespace-pre-wrap">{debugInfo}</div>

          <div className="grid gap-2">
            <h3 className="text-lg font-medium">Beschikbare Klanten:</h3>
            <div className="grid gap-2">
              {customers.length === 0 ? (
                <div className="p-4 bg-red-100 rounded">Geen klanten beschikbaar!</div>
              ) : (
                customers.map((customer) => (
                  <div
                    key={customer.id}
                    className={`p-3 border rounded-md flex justify-between items-center ${
                      selectedCustomer?.id === customer.id ? "border-primary bg-primary/5" : ""
                    }`}
                  >
                    <div>
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {customer.type} • {customer.address}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={customer.active ? "default" : "outline"}>
                        {customer.active ? "Actief" : "Inactief"}
                      </Badge>
                      <Button
                        size="sm"
                        variant={selectedCustomer?.id === customer.id ? "default" : "outline"}
                        onClick={() => setSelectedCustomer(customer)}
                      >
                        {selectedCustomer?.id === customer.id ? "Geselecteerd" : "Selecteer"}
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="text-sm text-muted-foreground">
          Huidige klant:{" "}
          {selectedCustomer ? (
            <span className="font-medium">{selectedCustomer.name}</span>
          ) : (
            <span className="italic">Geen klant geselecteerd</span>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
