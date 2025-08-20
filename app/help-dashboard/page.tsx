"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Search, Play, Clock, TrendingUp, Award, CheckCircle, BarChart3 } from "lucide-react"
import { getAvailableGuides, searchGuides } from "@/lib/help/module-guides"
import { InteractiveGuide } from "@/components/help/interactive-guide"
import { UserRole } from "@/lib/rbac/roles"
import { useAuth } from "@/contexts/auth-context"

export default function HelpDashboard() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGuide, setSelectedGuide] = useState<string | null>(null)
  const [completedGuides, setCompletedGuides] = useState<Set<string>>(new Set())

  const userRole = (
    user?.role === "super_admin"
      ? UserRole.SUPER_ADMIN
      : user?.role === "admin"
        ? UserRole.CUSTOMER_ADMIN
        : UserRole.BHV_MEMBER
  ) as UserRole

  const availableGuides = getAvailableGuides(userRole)
  const searchResults = searchQuery ? searchGuides(searchQuery, userRole) : availableGuides

  const handleGuideComplete = (guideId: string) => {
    setCompletedGuides((prev) => new Set([...prev, guideId]))
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const completionRate = (completedGuides.size / availableGuides.length) * 100

  if (selectedGuide) {
    const guide = availableGuides.find((g) => g.moduleId === selectedGuide)
    if (guide) {
      return (
        <div className="container mx-auto p-6">
          <Button variant="outline" onClick={() => setSelectedGuide(null)} className="mb-6">
            ← Terug naar dashboard
          </Button>
          <InteractiveGuide
            guide={guide}
            userRole={userRole}
            onComplete={() => handleGuideComplete(selectedGuide)}
            onClose={() => setSelectedGuide(null)}
          />
        </div>
      )
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Help Dashboard</h1>
        <p className="text-muted-foreground">Leer BHV360 kennen met onze interactieve handleidingen en tutorials</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Beschikbare Handleidingen</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableGuides.length}</div>
            <p className="text-xs text-muted-foreground">Voor uw rol: {userRole}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Voltooid</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedGuides.size}</div>
            <p className="text-xs text-muted-foreground">{completionRate.toFixed(0)}% van alle handleidingen</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Geschatte Tijd</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.5u</div>
            <p className="text-xs text-muted-foreground">Totale leertijd</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Voortgang</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate.toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">Van alle beschikbare content</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Zoek handleidingen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">Alle Handleidingen</TabsTrigger>
          <TabsTrigger value="beginner">Beginner</TabsTrigger>
          <TabsTrigger value="intermediate">Gemiddeld</TabsTrigger>
          <TabsTrigger value="advanced">Gevorderd</TabsTrigger>
          <TabsTrigger value="completed">Voltooid</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((guide) => (
              <Card key={guide.moduleId} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{guide.moduleName}</CardTitle>
                    {completedGuides.has(guide.moduleId) && <CheckCircle className="h-5 w-5 text-green-500" />}
                  </div>
                  <CardDescription className="line-clamp-2">{guide.overview}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge className={getDifficultyColor(guide.difficulty)}>
                      {guide.difficulty === "beginner" && "Beginner"}
                      {guide.difficulty === "intermediate" && "Gemiddeld"}
                      {guide.difficulty === "advanced" && "Gevorderd"}
                    </Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      {guide.estimatedTime}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{guide.steps.length} stappen</span>
                    <Button onClick={() => setSelectedGuide(guide.moduleId)} size="sm">
                      <Play className="h-4 w-4 mr-2" />
                      Start
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="beginner">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults
              .filter((g) => g.difficulty === "beginner")
              .map((guide) => (
                <Card key={guide.moduleId} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{guide.moduleName}</CardTitle>
                    <CardDescription>{guide.overview}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={() => setSelectedGuide(guide.moduleId)} className="w-full">
                      <Play className="h-4 w-4 mr-2" />
                      Start Handleiding
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="intermediate">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults
              .filter((g) => g.difficulty === "intermediate")
              .map((guide) => (
                <Card key={guide.moduleId} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{guide.moduleName}</CardTitle>
                    <CardDescription>{guide.overview}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={() => setSelectedGuide(guide.moduleId)} className="w-full">
                      <Play className="h-4 w-4 mr-2" />
                      Start Handleiding
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="advanced">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults
              .filter((g) => g.difficulty === "advanced")
              .map((guide) => (
                <Card key={guide.moduleId} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{guide.moduleName}</CardTitle>
                    <CardDescription>{guide.overview}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={() => setSelectedGuide(guide.moduleId)} className="w-full">
                      <Play className="h-4 w-4 mr-2" />
                      Start Handleiding
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="completed">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableGuides
              .filter((g) => completedGuides.has(g.moduleId))
              .map((guide) => (
                <Card key={guide.moduleId} className="hover:shadow-md transition-shadow border-green-200">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{guide.moduleName}</CardTitle>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <CardDescription>{guide.overview}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-green-700 border-green-300">
                        Voltooid
                      </Badge>
                      <Button variant="outline" onClick={() => setSelectedGuide(guide.moduleId)} size="sm">
                        Opnieuw bekijken
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
          {completedGuides.size === 0 && (
            <div className="text-center py-12">
              <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Nog geen handleidingen voltooid</h3>
              <p className="text-muted-foreground mb-4">Begin met een handleiding om je voortgang bij te houden</p>
              <Button onClick={() => setSelectedGuide(availableGuides[0]?.moduleId)}>
                <Play className="h-4 w-4 mr-2" />
                Start je eerste handleiding
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Progress Overview */}
      {completedGuides.size > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-500" />
              Jouw Voortgang
            </CardTitle>
            <CardDescription>Overzicht van je leervoortgang in BHV360</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Totale voortgang</span>
                <span className="text-sm text-muted-foreground">
                  {completedGuides.size} van {availableGuides.length} handleidingen
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${completionRate}%` }}
                />
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {
                      availableGuides.filter((g) => g.difficulty === "beginner" && completedGuides.has(g.moduleId))
                        .length
                    }
                  </div>
                  <div className="text-sm text-muted-foreground">Beginner</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {
                      availableGuides.filter((g) => g.difficulty === "intermediate" && completedGuides.has(g.moduleId))
                        .length
                    }
                  </div>
                  <div className="text-sm text-muted-foreground">Gemiddeld</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {
                      availableGuides.filter((g) => g.difficulty === "advanced" && completedGuides.has(g.moduleId))
                        .length
                    }
                  </div>
                  <div className="text-sm text-muted-foreground">Gevorderd</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
