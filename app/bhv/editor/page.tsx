"use client"

import { useState, useEffect } from "react"
import { useCustomer } from "@/components/customer-context"
import { useData, type DataContextType } from "@/contexts/data-context"
import { NoCustomerSelected } from "@/components/no-customer-selected"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ProvincieBrabantPlotkaart } from "@/components/provincie-brabant-plotkaart"
import SimplifiedPlotkaartEditor from "@/components/simplified-plotkaart-editor"
import { Eye, Edit, Save, RefreshCw } from "lucide-react"

export default function BHVEditorPage() {
  const { selectedCustomer } = useCustomer()
  const { getPlotkaartByCustomer, updatePlotkaartForCustomer } = useData() as DataContextType
  const [activeTab, setActiveTab] = useState("plotkaart")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [plotkaartData, setPlotkaartData] = useState<any>(null)

  useEffect(() => {
    async function loadPlotkaartData() {
      if (selectedCustomer) {
        const data = await getPlotkaartByCustomer(selectedCustomer.id)
        setPlotkaartData(data)
      }
    }
    loadPlotkaartData()
  }, [selectedCustomer, getPlotkaartByCustomer])

  if (!selectedCustomer) {
    return <NoCustomerSelected />
  }

  const handleSaveChanges = () => {
    // In a real implementation, you would get the current floor data from the editor
    const currentFloors = plotkaartData?.floors || []
    updatePlotkaartForCustomer(selectedCustomer.id, currentFloors)
    setHasUnsavedChanges(false)
    alert("Wijzigingen opgeslagen!")
  }

  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <div className="container p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">BHV Plotkaart Editor</h1>
          <p className="text-muted-foreground">Bewerk de BHV plotkaart voor {selectedCustomer.name}</p>
        </div>
        <div className="flex items-center space-x-2">
          {hasUnsavedChanges && (
            <Badge variant="outline" className="bg-orange-50 text-orange-700">
              Niet opgeslagen wijzigingen
            </Badge>
          )}
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Vernieuwen
          </Button>
          <Button onClick={handleSaveChanges} disabled={!hasUnsavedChanges}>
            <Save className="h-4 w-4 mr-2" />
            Opslaan
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>BHV Plotkaart - {selectedCustomer.name}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="px-6 pt-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="plotkaart" className="flex items-center">
                  <Eye className="h-4 w-4 mr-2" />
                  Plotkaart Weergave
                </TabsTrigger>
                <TabsTrigger value="editor" className="flex items-center">
                  <Edit className="h-4 w-4 mr-2" />
                  Editor Modus
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="plotkaart" className="mt-0">
              <div className="p-6">
                <ProvincieBrabantPlotkaart />
              </div>
            </TabsContent>

            <TabsContent value="editor" className="mt-0">
              <div className="p-6">
                <SimplifiedPlotkaartEditor />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Laatste update</p>
                <p className="text-lg font-semibold">
                  {plotkaartData?.lastUpdated ? new Date(plotkaartData.lastUpdated).toLocaleString() : "Nooit"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Bijgewerkt door</p>
                <p className="text-lg font-semibold">{plotkaartData?.updatedBy || "Onbekend"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Verdiepingen</p>
                <p className="text-lg font-semibold">{plotkaartData?.floors?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
