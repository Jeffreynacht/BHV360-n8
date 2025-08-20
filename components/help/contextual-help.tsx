"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { HelpCircle, BookOpen, Play, ExternalLink } from "lucide-react"
import { getModuleGuide, getAvailableGuides } from "@/lib/help/module-guides"
import { InteractiveGuide } from "./interactive-guide"
import { UserRole } from "@/lib/rbac/roles"
import { useAuth } from "@/contexts/auth-context"

// Map paths to module IDs
const PATH_TO_MODULE: Record<string, string> = {
  "/bhv/plotkaart": "bhv-plotkaart",
  "/beheer/nfc-tags": "nfc-tags",
  "/beheer/plotkaart-editor": "plotkaart-editor",
  "/beheer/gebruikers": "gebruikersbeheer",
  "/beheer/nfc-overzicht": "nfc-overzicht",
  "/beheer/voorzieningen": "voorzieningen",
  "/incidenten": "incidenten",
  "/bhv-aanwezigheid": "bhv-aanwezigheid",
}

interface ContextualHelpProps {
  className?: string
}

export function ContextualHelp({ className }: ContextualHelpProps) {
  const pathname = usePathname()
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedGuide, setSelectedGuide] = useState<string | null>(null)

  // Get current module based on path
  const currentModuleId = PATH_TO_MODULE[pathname]
  const userRole = (
    user?.role === "super_admin"
      ? UserRole.SUPER_ADMIN
      : user?.role === "admin"
        ? UserRole.CUSTOMER_ADMIN
        : UserRole.BHV_MEMBER
  ) as UserRole

  const currentGuide = currentModuleId ? getModuleGuide(currentModuleId, userRole) : null
  const availableGuides = getAvailableGuides(userRole)

  // Quick help tips based on current page
  const getQuickTips = () => {
    switch (pathname) {
      case "/bhv/plotkaart":
        return [
          "Klik op symbolen om details te bekijken",
          "Gebruik verdiepingsknoppen om te navigeren",
          "Scan NFC tags voor verificatie",
        ]
      case "/beheer/nfc-tags":
        return [
          "Test nieuwe tags direct na toevoegen",
          "Gebruik duidelijke namen voor tags",
          "Koppel tags aan voorzieningen",
        ]
      case "/beheer/plotkaart-editor":
        return [
          "Maak backup voordat je wijzigingen maakt",
          "Gebruik snap-to-grid voor uitlijning",
          "Test plotkaart na wijzigingen",
        ]
      default:
        return [
          "Selecteer eerst een klant",
          "Gebruik het zoekicoon voor snelle navigatie",
          "Bekijk de help sectie voor meer informatie",
        ]
    }
  }

  if (!user) return null

  return (
    <>
      {/* Floating Help Button */}
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              size="lg"
              className="rounded-full shadow-lg hover:shadow-xl transition-shadow"
              title="Help & Ondersteuning"
            >
              <HelpCircle className="h-5 w-5 mr-2" />
              Help
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-blue-500" />
                Help & Ondersteuning
              </DialogTitle>
            </DialogHeader>

            {selectedGuide ? (
              <div className="space-y-4">
                <Button variant="outline" onClick={() => setSelectedGuide(null)} className="mb-4">
                  ← Terug naar overzicht
                </Button>
                <InteractiveGuide
                  guide={getModuleGuide(selectedGuide, userRole)!}
                  userRole={userRole}
                  onClose={() => setSelectedGuide(null)}
                />
              </div>
            ) : (
              <div className="space-y-6">
                {/* Current Page Help */}
                {currentGuide && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Help voor huidige pagina</span>
                        <Badge variant="outline">{currentGuide.moduleName}</Badge>
                      </CardTitle>
                      <CardDescription>{currentGuide.overview}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge
                            className={
                              currentGuide.difficulty === "beginner"
                                ? "bg-green-100 text-green-800"
                                : currentGuide.difficulty === "intermediate"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }
                          >
                            {currentGuide.difficulty === "beginner" && "Beginner"}
                            {currentGuide.difficulty === "intermediate" && "Gemiddeld"}
                            {currentGuide.difficulty === "advanced" && "Gevorderd"}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{currentGuide.estimatedTime}</span>
                        </div>
                        <Button onClick={() => setSelectedGuide(currentModuleId!)}>
                          <Play className="h-4 w-4 mr-2" />
                          Start Handleiding
                        </Button>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Snelle Tips:</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                          {getQuickTips().map((tip, index) => (
                            <li key={index}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* All Available Guides */}
                <Card>
                  <CardHeader>
                    <CardTitle>Alle Handleidingen</CardTitle>
                    <CardDescription>Beschikbare handleidingen voor uw rol: {userRole}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {availableGuides.map((guide) => (
                        <div
                          key={guide.moduleId}
                          className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                          onClick={() => setSelectedGuide(guide.moduleId)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{guide.moduleName}</h4>
                            <Badge variant="outline" className="text-xs">
                              {guide.steps.length} stappen
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{guide.overview.substring(0, 100)}...</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">{guide.estimatedTime}</span>
                            <Badge
                              className={
                                guide.difficulty === "beginner"
                                  ? "bg-green-100 text-green-800"
                                  : guide.difficulty === "intermediate"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }
                            >
                              {guide.difficulty === "beginner" && "Beginner"}
                              {guide.difficulty === "intermediate" && "Gemiddeld"}
                              {guide.difficulty === "advanced" && "Gevorderd"}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Snelle Acties</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <Button variant="outline" size="sm" asChild>
                        <a href="/help" target="_blank" rel="noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Volledige Help
                        </a>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <a href="/video-tutorials" target="_blank" rel="noreferrer">
                          <Play className="h-4 w-4 mr-2" />
                          Video's
                        </a>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <a href="mailto:support@bhv360.nl">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          E-mail Support
                        </a>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <a href="tel:+31881234567">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Bel Support
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
