"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { BHV360BrandHeader } from "@/components/bhv360-brand-header"
import {
  ShoppingCart,
  TestTube,
  Calculator,
  Users,
  Building,
  Briefcase,
  Info,
  CheckCircle,
  Clock,
  Star,
  Sparkles,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { moduleDefinitions, calculateModulePrice, type ModuleDefinition } from "@/lib/modules/module-definitions"

export default function ModuleMarketplacePage() {
  const [selectedModules, setSelectedModules] = useState<string[]>([])
  const [userCount, setUserCount] = useState(10)
  const [buildingCount, setBuildingCount] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const visibleModules = moduleDefinitions.filter((module) => module.visible && module.enabled)

  const handleModuleToggle = (moduleId: string) => {
    setSelectedModules((prev) => (prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]))
  }

  const handleTestModule = (module: ModuleDefinition) => {
    if (module.routePath) {
      window.open(module.routePath, "_blank")
      toast({
        title: "Module Test Gestart",
        description: `${module.name} wordt geopend in een nieuw tabblad voor testing.`,
      })
    } else {
      toast({
        title: "Test Niet Beschikbaar",
        description: "Deze module heeft nog geen test omgeving.",
        variant: "destructive",
      })
    }
  }

  const calculateTotalPrice = () => {
    return selectedModules.reduce((total, moduleId) => {
      const module = moduleDefinitions.find((m) => m.id === moduleId)
      if (module) {
        const { price } = calculateModulePrice(module, userCount, buildingCount)
        return total + price
      }
      return total
    }, 0)
  }

  const filteredModules =
    selectedCategory === "all"
      ? visibleModules
      : visibleModules.filter((module) => module.category === selectedCategory)

  return (
    <div className="min-h-screen bg-gray-50">
      <BHV360BrandHeader customerName="Module Marketplace" userRole="Beheerder" />

      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">BHV360 Module Marketplace</h1>
          <p className="text-gray-600">Ontdek en installeer modules om uw BHV360 platform uit te breiden</p>
        </div>

        {/* Prijscalculator */}
        <Card className="mb-8 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-blue-600" />
              Prijscalculator
            </CardTitle>
            <CardDescription>Stel uw organisatie gegevens in om accurate prijzen te zien</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="users">Aantal Gebruikers</Label>
                <Input
                  id="users"
                  type="number"
                  value={userCount}
                  onChange={(e) => setUserCount(Number(e.target.value) || 1)}
                  min="1"
                />
              </div>
              <div>
                <Label htmlFor="buildings">Aantal Gebouwen</Label>
                <Input
                  id="buildings"
                  type="number"
                  value={buildingCount}
                  onChange={(e) => setBuildingCount(Number(e.target.value) || 1)}
                  min="1"
                />
              </div>
              <div className="flex items-end">
                <div className="bg-white p-4 rounded-lg border w-full">
                  <p className="text-sm text-gray-600">Totale Maandelijkse Kosten</p>
                  <p className="text-2xl font-bold text-blue-600">€{calculateTotalPrice().toFixed(2)}</p>
                  <p className="text-xs text-gray-500">{selectedModules.length} module(s) geselecteerd</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Prijsmodel Uitleg */}
        <Card className="mb-8 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-green-600" />
              Prijsmodellen Uitleg
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-semibold">Per Gebruiker</h4>
                  <p className="text-sm text-gray-600">
                    Betaal per persoon die de module gebruikt. Ideaal voor modules die door specifieke rollen gebruikt
                    worden.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Building className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <h4 className="font-semibold">Per Gebouw</h4>
                  <p className="text-sm text-gray-600">
                    Betaal per locatie/gebouw. Alle gebruikers in dat gebouw kunnen de module gebruiken.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Briefcase className="h-5 w-5 text-purple-600 mt-1" />
                <div>
                  <h4 className="font-semibold">Per Organisatie</h4>
                  <p className="text-sm text-gray-600">
                    Vaste prijs voor uw hele organisatie, ongeacht aantal gebruikers of gebouwen.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Categorie Filter */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-6">
          <TabsList>
            <TabsTrigger value="all">Alle Modules</TabsTrigger>
            <TabsTrigger value="basis">Basis</TabsTrigger>
            <TabsTrigger value="geavanceerd">Geavanceerd</TabsTrigger>
            <TabsTrigger value="premium">Premium</TabsTrigger>
            <TabsTrigger value="enterprise">Enterprise</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Module Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((module) => {
            const isSelected = selectedModules.includes(module.id)
            const priceInfo = calculateModulePrice(module, userCount, buildingCount)

            return (
              <Card
                key={module.id}
                className={`relative transition-all duration-200 ${
                  isSelected ? "ring-2 ring-blue-500 shadow-lg" : "hover:shadow-md"
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2 flex items-center gap-2">{module.name}</CardTitle>
                      {module.status === "nieuw" && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Nieuw
                        </Badge>
                      )}
                      {module.status === "populair" && (
                        <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                          <Star className="h-3 w-3 mr-1" />
                          Populair
                        </Badge>
                      )}
                      <Badge
                        variant={
                          module.category === "basis"
                            ? "default"
                            : module.category === "geavanceerd"
                              ? "secondary"
                              : module.category === "premium"
                                ? "destructive"
                                : "outline"
                        }
                      >
                        {module.category}
                      </Badge>
                    </div>
                    {module.implemented && <CheckCircle className="h-5 w-5 text-green-600" />}
                    {!module.implemented && <Clock className="h-5 w-5 text-orange-600" />}
                  </div>
                  <CardDescription className="text-sm">{module.description}</CardDescription>
                </CardHeader>

                <CardContent>
                  {/* Prijsinformatie */}
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-lg text-blue-600">€{priceInfo.price.toFixed(2)}/maand</span>
                      <Badge variant="outline">{priceInfo.model}</Badge>
                    </div>
                    <p className="text-xs text-gray-600">{priceInfo.explanation}</p>

                    {/* Prijsmodel uitleg */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="mt-2 p-0 h-auto text-xs">
                          <Info className="h-3 w-3 mr-1" />
                          Prijsmodel uitleg
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Prijsmodel - {module.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <p className="text-sm text-gray-600">{module.pricingExplanation}</p>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div className="text-center p-3 bg-blue-50 rounded">
                              <Users className="h-4 w-4 mx-auto mb-1 text-blue-600" />
                              <p className="font-semibold">Per Gebruiker</p>
                              <p>€{module.pricing.perUser}/maand</p>
                            </div>
                            <div className="text-center p-3 bg-green-50 rounded">
                              <Building className="h-4 w-4 mx-auto mb-1 text-green-600" />
                              <p className="font-semibold">Per Gebouw</p>
                              <p>€{module.pricing.perBuilding}/maand</p>
                            </div>
                            <div className="text-center p-3 bg-purple-50 rounded">
                              <Briefcase className="h-4 w-4 mx-auto mb-1 text-purple-600" />
                              <p className="font-semibold">Per Organisatie</p>
                              <p>€{module.pricing.perCustomer}/maand</p>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {/* Features */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-sm mb-2">Functionaliteiten:</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {module.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          {feature}
                        </li>
                      ))}
                      {module.features.length > 3 && (
                        <li className="text-gray-500">+{module.features.length - 3} meer...</li>
                      )}
                    </ul>
                  </div>

                  {/* Acties */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleModuleToggle(module.id)}
                      className={`flex-1 ${isSelected ? "bg-green-600 hover:bg-green-700" : ""}`}
                      variant={isSelected ? "default" : "outline"}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {isSelected ? "Geselecteerd" : "Selecteren"}
                    </Button>

                    {module.implemented && module.routePath && (
                      <Button onClick={() => handleTestModule(module)} variant="outline" size="sm">
                        <TestTube className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Geselecteerde Modules Samenvatting */}
        {selectedModules.length > 0 && (
          <Card className="mt-8 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-800">Geselecteerde Modules</CardTitle>
              <CardDescription>Overzicht van uw module selectie en totale kosten</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedModules.map((moduleId) => {
                  const module = moduleDefinitions.find((m) => m.id === moduleId)
                  if (!module) return null

                  const priceInfo = calculateModulePrice(module, userCount, buildingCount)

                  return (
                    <div key={moduleId} className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div>
                        <h4 className="font-semibold">{module.name}</h4>
                        <p className="text-sm text-gray-600">{priceInfo.explanation}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">€{priceInfo.price.toFixed(2)}/maand</p>
                        <p className="text-xs text-gray-500">{priceInfo.model}</p>
                      </div>
                    </div>
                  )
                })}

                <div className="border-t pt-3 flex items-center justify-between">
                  <h3 className="text-lg font-bold">Totaal per maand:</h3>
                  <p className="text-2xl font-bold text-green-600">€{calculateTotalPrice().toFixed(2)}</p>
                </div>

                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Modules Installeren ({selectedModules.length})
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
