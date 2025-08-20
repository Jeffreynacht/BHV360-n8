"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, FileText, TrendingUp, AlertTriangle } from "lucide-react"
import InspectionCalendar from "@/components/inspection-calendar"

export default function InspectieKalenderPage() {
  // Demo statistics
  const stats = {
    totaalGepland: 12,
    dezeWeek: 3,
    vervallen: 2,
    voltooiingspercentage: 85,
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Inspectie Kalender</h1>
        <p className="text-muted-foreground">Overzicht van alle geplande en uitgevoerde inspecties</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totaal Gepland</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totaalGepland}</div>
            <p className="text-xs text-muted-foreground">Deze maand</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deze Week</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.dezeWeek}</div>
            <p className="text-xs text-muted-foreground">Inspecties gepland</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vervallen</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.vervallen}</div>
            <p className="text-xs text-muted-foreground">Actie vereist</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Voltooiing</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.voltooiingspercentage}%</div>
            <p className="text-xs text-muted-foreground">Deze maand</p>
          </CardContent>
        </Card>
      </div>

      {/* Calendar Component */}
      <InspectionCalendar />

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Snelle Acties</CardTitle>
          <CardDescription>Veelgebruikte functies voor inspectie planning</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
              <Calendar className="h-8 w-8 text-blue-600 mb-2" />
              <h3 className="font-medium">Plan Inspectie</h3>
              <p className="text-sm text-muted-foreground">Nieuwe inspectie inplannen</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
              <FileText className="h-8 w-8 text-green-600 mb-2" />
              <h3 className="font-medium">Rapport Maken</h3>
              <p className="text-sm text-muted-foreground">Inspectie rapport opstellen</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
              <AlertTriangle className="h-8 w-8 text-red-600 mb-2" />
              <h3 className="font-medium">Vervallen Inspecties</h3>
              <p className="text-sm text-muted-foreground">Bekijk vervallen inspecties</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
