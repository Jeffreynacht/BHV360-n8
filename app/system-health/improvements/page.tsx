"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, CheckCircle, AlertTriangle, TrendingUp, Shield, Zap, Wrench, Users, BarChart3 } from "lucide-react"
import { improvementPlan, calculateTotalEffort } from "@/lib/system-health/improvement-plan"

const priorityColors = {
  high: "bg-red-100 text-red-800 border-red-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  low: "bg-green-100 text-green-800 border-green-200",
}

const categoryIcons = {
  performance: Zap,
  security: Shield,
  reliability: CheckCircle,
  usability: Users,
  maintainability: Wrench,
}

export default function ImprovementsPage() {
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set())
  const [selectedPriority, setSelectedPriority] = useState<string>("all")

  const effort = calculateTotalEffort()
  const completedHours = Array.from(completedItems).reduce((sum, title) => {
    const item = improvementPlan.find((i) => i.title === title)
    return sum + (item?.estimatedHours || 0)
  }, 0)

  const progressPercentage = Math.round((completedHours / effort.totalHours) * 100)

  const filteredPlan =
    selectedPriority === "all" ? improvementPlan : improvementPlan.filter((item) => item.priority === selectedPriority)

  const toggleCompletion = (title: string) => {
    const newCompleted = new Set(completedItems)
    if (newCompleted.has(title)) {
      newCompleted.delete(title)
    } else {
      newCompleted.add(title)
    }
    setCompletedItems(newCompleted)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Systeem Verbeterplan</h1>
        <p className="text-muted-foreground">Roadmap voor systeem optimalisaties en verbeteringen</p>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Totale Voortgang</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progressPercentage}%</div>
            <Progress value={progressPercentage} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {completedHours} van {effort.totalHours} uren
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Hoge Prioriteit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {improvementPlan.filter((i) => i.priority === "high").length}
            </div>
            <p className="text-xs text-muted-foreground">{effort.byPriority.high} uren</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Afgerond</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedItems.size}</div>
            <p className="text-xs text-muted-foreground">van {improvementPlan.length} items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Geschatte Tijd</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(effort.totalHours / 8)} dagen</div>
            <p className="text-xs text-muted-foreground">@ 8 uur per dag</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Content */}
      <Tabs defaultValue="roadmap" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
          <TabsTrigger value="categories">Categorieën</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="roadmap" className="space-y-4">
          {/* Priority Filter */}
          <div className="flex gap-2">
            <Button
              variant={selectedPriority === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPriority("all")}
            >
              Alle
            </Button>
            <Button
              variant={selectedPriority === "high" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPriority("high")}
            >
              Hoog
            </Button>
            <Button
              variant={selectedPriority === "medium" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPriority("medium")}
            >
              Gemiddeld
            </Button>
            <Button
              variant={selectedPriority === "low" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPriority("low")}
            >
              Laag
            </Button>
          </div>

          {/* Improvement Items */}
          <div className="space-y-4">
            {filteredPlan.map((item, index) => {
              const CategoryIcon = categoryIcons[item.category]
              const isCompleted = completedItems.has(item.title)

              return (
                <Card key={index} className={isCompleted ? "opacity-60" : ""}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <CategoryIcon className="h-5 w-5 mt-1 text-muted-foreground" />
                        <div>
                          <CardTitle className={`text-lg ${isCompleted ? "line-through" : ""}`}>{item.title}</CardTitle>
                          <CardDescription className="mt-1">{item.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={priorityColors[item.priority]}>
                          {item.priority === "high" ? "Hoog" : item.priority === "medium" ? "Gemiddeld" : "Laag"}
                        </Badge>
                        <Button
                          variant={isCompleted ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleCompletion(item.title)}
                        >
                          {isCompleted ? <CheckCircle className="h-4 w-4" /> : "Markeer als Klaar"}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{item.estimatedHours} uren</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <span className="capitalize">{item.category}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                        <span>{item.dependencies.length} afhankelijkheden</span>
                      </div>
                    </div>

                    {item.acceptanceCriteria.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium text-sm mb-2">Acceptatiecriteria:</h4>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                          {item.acceptanceCriteria.map((criteria, idx) => (
                            <li key={idx}>{criteria}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {item.dependencies.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium text-sm mb-2">Afhankelijkheden:</h4>
                        <div className="flex flex-wrap gap-1">
                          {item.dependencies.map((dep, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {dep}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(effort.byCategory).map(([category, hours]) => {
              const CategoryIcon = categoryIcons[category as keyof typeof categoryIcons]
              const items = improvementPlan.filter((item) => item.category === category)
              const completedInCategory = items.filter((item) => completedItems.has(item.title)).length

              return (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 capitalize">
                      <CategoryIcon className="h-5 w-5" />
                      {category === "performance"
                        ? "Performance"
                        : category === "security"
                          ? "Beveiliging"
                          : category === "reliability"
                            ? "Betrouwbaarheid"
                            : category === "usability"
                              ? "Gebruiksvriendelijkheid"
                              : "Onderhoudbaarheid"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Voortgang</span>
                        <span>
                          {completedInCategory}/{items.length}
                        </span>
                      </div>
                      <Progress value={(completedInCategory / items.length) * 100} />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{hours} uren totaal</span>
                        <span>{items.length} items</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Prioriteit Verdeling
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(effort.byPriority).map(([priority, hours]) => {
                    const percentage = Math.round((hours / effort.totalHours) * 100)
                    return (
                      <div key={priority}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="capitalize">
                            {priority === "high" ? "Hoog" : priority === "medium" ? "Gemiddeld" : "Laag"}
                          </span>
                          <span>
                            {hours} uren ({percentage}%)
                          </span>
                        </div>
                        <Progress value={percentage} />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Geschatte Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold">{Math.ceil(effort.totalHours / 40)}</div>
                    <p className="text-sm text-muted-foreground">weken @ 40 uur</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">{Math.ceil(effort.totalHours / 8)}</div>
                    <p className="text-sm text-muted-foreground">werkdagen @ 8 uur</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">€{(effort.totalHours * 75).toLocaleString()}</div>
                    <p className="text-sm text-muted-foreground">geschatte kosten @ €75/uur</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
