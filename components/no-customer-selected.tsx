"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building, AlertCircle } from "lucide-react"

export function NoCustomerSelected() {
  return (
    <div className="container p-6 flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-muted p-3">
              <Building className="h-8 w-8 text-muted-foreground" />
            </div>
          </div>
          <CardTitle className="flex items-center justify-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            Geen klant geselecteerd
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Selecteer eerst een klant in de navigatie om toegang te krijgen tot de BHV functies.
          </p>
          <p className="text-sm text-muted-foreground">
            Elke klant heeft zijn eigen instellingen, gebruikers en BHV360 plotkaarten.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
