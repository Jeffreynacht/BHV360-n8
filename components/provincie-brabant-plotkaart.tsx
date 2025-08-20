"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Legend } from "@/components/legend"
import { CheckCircle2, ShipWheelIcon as Wheelchair, Building2, CheckSquare, Flame, RefreshCw } from "lucide-react"

function ProvincieBrabantPlotkaart() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    toegankelijkheid: false,
    brandveiligheid: false,
    duurzaamheid: false,
    leefbaarheid: false,
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [description, setDescription] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Placeholder for fetching data from an API or local source
        // Replace this with your actual data fetching logic
        const mockData = [
          {
            id: 1,
            name: "Locatie A",
            description: "Beschrijving van locatie A",
            toegankelijkheid: true,
            brandveiligheid: false,
            duurzaamheid: true,
            leefbaarheid: true,
          },
          {
            id: 2,
            name: "Locatie B",
            description: "Beschrijving van locatie B",
            toegankelijkheid: false,
            brandveiligheid: true,
            duurzaamheid: false,
            leefbaarheid: false,
          },
          {
            id: 3,
            name: "Locatie C",
            description: "Beschrijving van locatie C",
            toegankelijkheid: true,
            brandveiligheid: true,
            duurzaamheid: true,
            leefbaarheid: false,
          },
        ]
        setData(mockData)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleFilterChange = (filterName: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: !prevFilters[filterName],
    }))
  }

  const filteredData = data.filter((item) => {
    const searchTermLower = searchTerm.toLowerCase()
    const matchesSearch =
      item.name.toLowerCase().includes(searchTermLower) || item.description.toLowerCase().includes(searchTermLower)

    const matchesFilters =
      (!filters.toegankelijkheid || item.toegankelijkheid) &&
      (!filters.brandveiligheid || item.brandveiligheid) &&
      (!filters.duurzaamheid || item.duurzaamheid) &&
      (!filters.leefbaarheid || item.leefbaarheid)

    return matchesSearch && matchesFilters
  })

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Provincie Noord-Brabant Plotkaart</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-1">
              <Input
                type="text"
                placeholder="Zoeken..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Textarea
                placeholder="Beschrijving toevoegen..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-2"
              />
              <Button className="mt-2 w-full">
                <CheckCircle2 className="mr-2 h-4 w-4" /> Toevoegen
              </Button>

              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Filters</h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <Checkbox
                      checked={filters.toegankelijkheid}
                      onCheckedChange={() => handleFilterChange("toegankelijkheid")}
                    />
                    <span>Toegankelijkheid</span>
                    <Wheelchair className="h-4 w-4" />
                  </label>
                  <label className="flex items-center space-x-2">
                    <Checkbox
                      checked={filters.brandveiligheid}
                      onCheckedChange={() => handleFilterChange("brandveiligheid")}
                    />
                    <span>Brandveiligheid</span>
                    <Flame className="h-4 w-4" />
                  </label>
                  <label className="flex items-center space-x-2">
                    <Checkbox
                      checked={filters.duurzaamheid}
                      onCheckedChange={() => handleFilterChange("duurzaamheid")}
                    />
                    <span>Duurzaamheid</span>
                    <Building2 className="h-4 w-4" />
                  </label>
                  <label className="flex items-center space-x-2">
                    <Checkbox
                      checked={filters.leefbaarheid}
                      onCheckedChange={() => handleFilterChange("leefbaarheid")}
                    />
                    <span>Leefbaarheid</span>
                    <CheckSquare className="h-4 w-4" />
                  </label>
                </div>
              </div>
              <Button variant="outline" className="mt-4 w-full">
                <RefreshCw className="mr-2 h-4 w-4" /> Reset Filters
              </Button>
            </div>

            <div className="md:col-span-3">
              <h2 className="text-xl font-semibold mb-2">Resultaten</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredData.map((item) => (
                  <Card key={item.id}>
                    <CardHeader>
                      <CardTitle>{item.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{item.description}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {item.toegankelijkheid && <Badge>Toegankelijk</Badge>}
                        {item.brandveiligheid && <Badge>Brandveilig</Badge>}
                        {item.duurzaamheid && <Badge>Duurzaam</Badge>}
                        {item.leefbaarheid && <Badge>Leefbaar</Badge>}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Legend />
    </div>
  )
}

export { ProvincieBrabantPlotkaart }
