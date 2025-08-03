"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, Plus, Users } from "lucide-react"
import Link from "next/link"

export function NoCustomerSelected() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Building2 className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle>Geen klant geselecteerd</CardTitle>
          <CardDescription>Selecteer een klant om verder te gaan, of voeg een nieuwe klant toe.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Link href="/klanten">
            <Button className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Nieuwe klant toevoegen
            </Button>
          </Link>
          <Link href="/klanten">
            <Button variant="outline" className="w-full bg-transparent">
              <Users className="h-4 w-4 mr-2" />
              Klanten beheren
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
