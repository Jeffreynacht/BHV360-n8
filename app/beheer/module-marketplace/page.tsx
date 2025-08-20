"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BHV360BrandHeader } from "@/components/bhv360-brand-header"
import {
  ShoppingCart,
  TestTube,
  Calculator,
  Building,
  CheckCircle,
  Clock,
  Star,
  Shield,
  Zap,
  Crown,
  TrendingUp,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import {
  moduleDefinitions,
  moduleCategories,
  tierDefinitions,
  calculateModulePrice,
  getVisibleModules,
  type ModuleDefinition,
} from "@/lib/modules/module-definitions"

export default function ModuleMarketplacePage() {
  const [selectedModules, setSelectedModules] = useState<string[]>([])
  const [userCount, setUserCount] = useState(25)
  const [buildingCount, setBuildingCount] = useState(2)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedTier, setSelectedTier] = useState<string>("all")

  const visibleModules = getVisibleModules()

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

  const calculateSetupFees = () => {
    return selectedModules.reduce((total, moduleId) => {
      const module = moduleDefinitions.find((m) => m.id === moduleId)
      if (module && module.pricing.setupFee) {
        return total + module.pricing.setupFee / 100
      }
      return total
    }, 0)
  }

  const filteredModules = visibleModules.filter((module) => {
    const matchesCategory = selectedCategory === "all" || module.category === selectedCategory
    const matchesTier = selectedTier === "all" || module.tier === selectedTier
    return matchesCategory && matchesTier
  })

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "basis":
        return <Shield className="h-5 w-5" />
      case "geavanceerd":
        return <Zap className="h-5 w-5" />
      case "premium":
        return <Crown className="h-5 w-5" />
      case "enterprise":
        return <Building className="h-5 w-5" />
      default:
        return <Shield className="h-5 w-5" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "basis":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "geavanceerd":
        return "bg-green-100 text-green-800 border-green-200"
      case "premium":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "enterprise":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <BHV360BrandHeader customerName="Module Marketplace" userRole="Beheerder" />

      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">BHV360 Module Marketplace</h1>
          <p className="text-gray-600">Ontdek en installeer modules om uw BHV360 platform uit te breiden</p>
        </div>

        {/* Tier Overzicht */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {tierDefinitions.map((tier) => (
            <Card key={tier.id} className="border-2 hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  {tier.id === "starter" && <Shield className="h-5 w-5 text-blue-600" />}
                  {tier.id === "professional" && <Zap className="h-5 w-5 text-green-600" />}
                  {tier.id === "enterprise" && <Crown className="h-5 w-5 text-purple-600" />}
                  {tier.id === "custom" && <Building className="h-5 w-5 text-orange-600" />}
                  {tier.name}
                </CardTitle>
                <CardDescription>{tier.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="font-semibold text-lg text-green-600">{tier.priceRange}</div>
                  <ul className="text-sm space-y-1">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                  <p className="text-sm text-gray-600">Maandelijkse Kosten</p>
                  <p className="text-2xl font-bold text-blue-600">€{calculateTotalPrice().toFixed(2)}</p>
                  <p className="text-xs text-gray-500">{selectedModules.length} module(s)</p>
                </div>
              </div>
              <div className="flex items-end">
                <div className="bg-white p-4 rounded-lg border w-full">
                  <p className="text-sm text-gray-600">Jaarlijkse Kosten</p>
                  <p className="text-2xl font-bold text-green-600">€{(calculateTotalPrice() * 12).toFixed(2)}</p>
                  {calculateSetupFees() > 0 && (
                    <p className="text-xs text-orange-600">+€{calculateSetupFees().toFixed(2)} setup</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Categorie Filter</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Alle categorieën" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle categorieën</SelectItem>
                    {moduleCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="tier">Tier Filter</Label>
                <Select value={selectedTier} onValueChange={setSelectedTier}>
                  <SelectTrigger>
                    <SelectValue placeholder="Alle tiers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle tiers</SelectItem>
                    {tierDefinitions.map((tier) => (
                      <SelectItem key={tier.id} value={tier.id}>
                        {tier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Module Grid */}
        <Tabs defaultValue="grid" className="space-y-6">
          <TabsList>
            <TabsTrigger value="grid">Grid Weergave</TabsTrigger>
            <TabsTrigger value="categories">Per Categorie</TabsTrigger>
          </TabsList>

          <TabsContent value="grid">
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
                          <CardTitle className="text-lg mb-2 flex items-center gap-2">
                            {getCategoryIcon(module.category)}
                            {module.name}
                          </CardTitle>
                          <div className="flex gap-2 mb-2">
                            <Badge className={getCategoryColor(module.category)}>{module.category}</Badge>
                            <Badge variant="outline">{module.tier}</Badge>
                            {module.status === "beta" && <Badge variant="secondary">Beta</Badge>}
                          </div>
                          <CardDescription className="text-sm">{module.description}</CardDescription>
                        </div>
                        <div className="flex items-center gap-1">
                          {module.implemented && <CheckCircle className="h-5 w-5 text-green-600" />}
                          {!module.implemented && <Clock className="h-5 w-5 text-orange-600" />}
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      {/* Prijsinformatie */}
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-lg text-blue-600">
                            €{priceInfo.price.toFixed(2)}/maand
                          </span>
                          <Badge variant="outline">{priceInfo.model}</Badge>
                        </div>
                        <p className="text-xs text-gray-600">{priceInfo.explanation}</p>

                        {module.pricing.setupFee && (
                          <p className="text-xs text-orange-600 mt-1">
                            + €{(module.pricing.setupFee / 100).toFixed(2)} eenmalige setup fee
                          </p>
                        )}

                        {module.pricing.freeTrialDays && (
                          <p className="text-xs text-green-600 mt-1">
                            🎁 {module.pricing.freeTrialDays} dagen gratis proberen
                          </p>
                        )}
                      </div>

                      {/* Features */}
                      <div className="mb-4">
                        <h4 className="font-semibold text-sm mb-2">Belangrijkste features:</h4>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {module.features.slice(0, 4).map((feature, index) => (
                            <li key={index} className="flex items-center gap-1">
                              <CheckCircle className="h-3 w-3 text-green-600" />
                              {feature}
                            </li>
                          ))}
                          {module.features.length > 4 && (
                            <li className="text-gray-500">+{module.features.length - 4} meer...</li>
                          )}
                        </ul>
                      </div>

                      {/* Stats */}
                      <div className="mb-4 flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          {module.rating} ({module.reviews})
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          {module.popularity}%
                        </span>
                        <span>v{module.version}</span>
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
          </TabsContent>

          <TabsContent value="categories">
            <div className="space-y-8">
              {moduleCategories.map((category) => {
                const categoryModules = filteredModules.filter((m) => m.category === category.id)
                if (categoryModules.length === 0) return null

                return (
                  <Card key={category.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        {getCategoryIcon(category.id)}
                        {category.name}
                        <Badge variant="outline">{categoryModules.length}</Badge>
                      </CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categoryModules.map((module) => {
                          const isSelected = selectedModules.includes(module.id)
                          const priceInfo = calculateModulePrice(module, userCount, buildingCount)

                          return (
                            <Card
                              key={module.id}
                              className={`transition-all duration-200 ${
                                isSelected ? "ring-2 ring-blue-500" : "hover:shadow-sm"
                              }`}
                            >
                              <CardHeader className="pb-3">
                                <CardTitle className="text-base">{module.name}</CardTitle>
                                <div className="flex gap-1">
                                  <Badge variant="outline" className="text-xs">
                                    {module.tier}
                                  </Badge>
                                  {!module.implemented && (
                                    <Badge variant="outline" className="text-xs">
                                      Dev
                                    </Badge>
                                  )}
                                </div>
                              </CardHeader>
                              <CardContent className="pt-0">
                                <div className="mb-3 p-2 bg-gray-50 rounded text-center">
                                  <div className="font-semibold text-blue-600">€{priceInfo.price.toFixed(2)}/maand</div>
                                  <div className="text-xs text-gray-500">{priceInfo.model}</div>
                                </div>
                                <Button
                                  onClick={() => handleModuleToggle(module.id)}
                                  className="w-full"
                                  variant={isSelected ? "default" : "outline"}
                                  size="sm"
                                >
                                  {isSelected ? "Geselecteerd" : "Selecteren"}
                                </Button>
                              </CardContent>
                            </Card>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>

        {/* Geselecteerde Modules Samenvatting */}
        {selectedModules.length > 0 && (
          <Card className="mt-8 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-800">Geselecteerde Modules ({selectedModules.length})</CardTitle>
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
                        <div className="flex gap-2 mt-1">
                          <Badge className={getCategoryColor(module.category)} variant="outline">
                            {module.category}
                          </Badge>
                          <Badge variant="outline">{module.tier}</Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">€{priceInfo.price.toFixed(2)}/maand</p>
                        <p className="text-xs text-gray-500">{priceInfo.model}</p>
                        {module.pricing.setupFee && (
                          <p className="text-xs text-orange-600">
                            +€{(module.pricing.setupFee / 100).toFixed(2)} setup
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}

                <div className="border-t pt-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold">Maandelijkse kosten:</h3>
                    <p className="text-2xl font-bold text-green-600">€{calculateTotalPrice().toFixed(2)}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Jaarlijkse kosten:</span>
                    <span className="font-semibold">€{(calculateTotalPrice() * 12).toFixed(2)}</span>
                  </div>
                  {calculateSetupFees() > 0 && (
                    <div className="flex items-center justify-between text-orange-600">
                      <span>Eenmalige setup kosten:</span>
                      <span className="font-semibold">€{calculateSetupFees().toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-lg font-bold text-green-800 pt-2 border-t">
                    <span>Totaal eerste jaar:</span>
                    <span>€{(calculateTotalPrice() * 12 + calculateSetupFees()).toFixed(2)}</span>
                  </div>
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
