"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, MapPin, AlertTriangle, CheckCircle } from "lucide-react"

interface Voorziening {
  id: string
  name: string
  type: string
  location: string
  status: "active" | "maintenance" | "inactive"
  lastInspection: string
}

export default function VoorzieningenContent() {
  const [voorzieningen, setVoorzieningen] = useState<Voorziening[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading voorzieningen data
    const loadVoorzieningen = async () => {
      try {
        // Mock data for now
        const mockData: Voorziening[] = [
          {
            id: "1",
            name: "Brandblusser A1",
            type: "Fire Extinguisher",
            location: "Gang 1, Verdieping 1",
            status: "active",
            lastInspection: "2024-01-15",
          },
          {
            id: "2",
            name: "AED Unit B2",
            type: "AED",
            location: "Receptie",
            status: "active",
            lastInspection: "2024-01-10",
          },
          {
            id: "3",
            name: "Nooduitgang C1",
            type: "Emergency Exit",
            location: "Zuidkant gebouw",
            status: "maintenance",
            lastInspection: "2024-01-05",
          },
        ]

        setVoorzieningen(mockData)
      } catch (error) {
        console.error("Error loading voorzieningen:", error)
      } finally {
        setLoading(false)
      }
    }

    loadVoorzieningen()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800"
      case "inactive":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4" />
      case "maintenance":
        return <AlertTriangle className="h-4 w-4" />
      case "inactive":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading voorzieningen...</span>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Voorzieningen Beheer</h1>
          <p className="text-gray-600 mt-2">Beheer alle veiligheidsvoorzieningen in het gebouw</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nieuwe Voorziening
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {voorzieningen.map((voorziening) => (
          <Card key={voorziening.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{voorziening.name}</CardTitle>
                <Badge className={getStatusColor(voorziening.status)}>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(voorziening.status)}
                    {voorziening.status}
                  </div>
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {voorziening.location}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Type:</span> {voorziening.type}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Laatste inspectie:</span> {voorziening.lastInspection}
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm">
                  Bewerken
                </Button>
                <Button variant="outline" size="sm">
                  Inspectie
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {voorzieningen.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Geen voorzieningen gevonden</h3>
          <p className="text-gray-600 mb-4">Begin met het toevoegen van je eerste veiligheidsvoorziening.</p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Eerste Voorziening Toevoegen
          </Button>
        </div>
      )}
    </div>
  )
}
