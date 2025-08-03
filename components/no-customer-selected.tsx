"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, Plus, Users } from "lucide-react"
import Link from "next/link"

export function NoCustomerSelected() {
  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
            <Building2 className="h-6 w-6" />
          </div>
          <CardTitle>Geen klant geselecteerd</CardTitle>
          <CardDescription>
            Selecteer een klant om toegang te krijgen tot het BHV systeem, of voeg een nieuwe klant toe.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Link href="/klanten">
              <Button className="w-full" size="lg">
                <Plus className="mr-2 h-4 w-4" />
                Nieuwe Klant Toevoegen
              </Button>
            </Link>
            <Link href="/klanten">
              <Button variant="outline" className="w-full bg-transparent" size="lg">
                <Users className="mr-2 h-4 w-4" />
                Klanten Beheren
              </Button>
            </Link>
          </div>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h3 className="font-medium mb-2">Wat kun je doen met klanten?</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Klantgegevens beheren en bijwerken</li>
              <li>• Gebruikers per klant toevoegen en beheren</li>
              <li>• Voorzieningen en NFC tags koppelen</li>
              <li>• Plotkaarten maken en bewerken</li>
              <li>• Incidenten en rapportages bekijken</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
