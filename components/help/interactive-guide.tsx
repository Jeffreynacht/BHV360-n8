"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import {
  ChevronLeft,
  ChevronRight,
  Play,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  Info,
  Search,
  BookOpen,
  Clock,
  Users,
  Lightbulb,
  HelpCircle,
  ExternalLink,
  Download,
} from "lucide-react"
import type { ModuleGuide } from "@/lib/help/module-guides"
import type { UserRole } from "@/lib/rbac/roles"

interface InteractiveGuideProps {
  guide: ModuleGuide
  userRole: UserRole
  onComplete?: () => void
  onClose?: () => void
}

export function InteractiveGuide({ guide, userRole, onComplete, onClose }: InteractiveGuideProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const [isPlaying, setIsPlaying] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const progress = (completedSteps.size / guide.steps.length) * 100

  const markStepComplete = (stepIndex: number) => {
    setCompletedSteps((prev) => new Set([...prev, stepIndex]))
    if (stepIndex === guide.steps.length - 1 && onComplete) {
      onComplete()
    }
  }

  const nextStep = () => {
    if (currentStep < guide.steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const resetGuide = () => {
    setCurrentStep(0)
    setCompletedSteps(new Set())
    setIsPlaying(false)
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

  const filteredFAQs = guide.faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <BookOpen className="h-8 w-8 mr-3 text-blue-500" />
            {guide.moduleName}
          </h1>
          <p className="text-muted-foreground mt-2">{guide.overview}</p>
        </div>
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Sluiten
          </Button>
        )}
      </div>

      {/* Guide Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Info className="h-5 w-5 mr-2 text-blue-500" />
              Handleiding Informatie
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge className={getDifficultyColor(guide.difficulty)}>
                {guide.difficulty === "beginner" && "Beginner"}
                {guide.difficulty === "intermediate" && "Gemiddeld"}
                {guide.difficulty === "advanced" && "Gevorderd"}
              </Badge>
              <Badge variant="outline" className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {guide.estimatedTime}
              </Badge>
              <Badge variant="outline" className="flex items-center">
                <Users className="h-3 w-3 mr-1" />
                {guide.roles.length} rol(len)
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {guide.prerequisites && (
            <div className="mb-4">
              <h4 className="font-medium mb-2">Vereisten:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {guide.prerequisites.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium">Voortgang:</span>
              <Progress value={progress} className="w-32" />
              <span className="text-sm text-muted-foreground">
                {completedSteps.size}/{guide.steps.length} stappen
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={resetGuide}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="steps" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="steps">Stappen</TabsTrigger>
          <TabsTrigger value="troubleshooting">Problemen</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="resources">Bronnen</TabsTrigger>
        </TabsList>

        {/* Steps Tab */}
        <TabsContent value="steps" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  Stap {currentStep + 1}: {guide.steps[currentStep]?.title}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={prevStep} disabled={currentStep === 0}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={nextStep}
                    disabled={currentStep === guide.steps.length - 1}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {guide.steps[currentStep] && (
                <div className="space-y-4">
                  <p className="text-muted-foreground">{guide.steps[currentStep].description}</p>

                  {guide.steps[currentStep].action && (
                    <Alert>
                      <Play className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Actie:</strong> {guide.steps[currentStep].action}
                      </AlertDescription>
                    </Alert>
                  )}

                  {guide.steps[currentStep].tips && (
                    <Alert>
                      <Lightbulb className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Tips:</strong>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          {guide.steps[currentStep].tips!.map((tip, index) => (
                            <li key={index}>{tip}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}

                  {guide.steps[currentStep].warnings && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Waarschuwingen:</strong>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          {guide.steps[currentStep].warnings!.map((warning, index) => (
                            <li key={index}>{warning}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="flex items-center justify-between pt-4">
                    <Button
                      variant={completedSteps.has(currentStep) ? "default" : "outline"}
                      onClick={() => markStepComplete(currentStep)}
                      className="flex items-center"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {completedSteps.has(currentStep) ? "Voltooid" : "Markeer als voltooid"}
                    </Button>

                    {guide.steps[currentStep].videoUrl && (
                      <Button variant="outline" asChild>
                        <a href={guide.steps[currentStep].videoUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Video bekijken
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Steps Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Alle Stappen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {guide.steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                      index === currentStep
                        ? "bg-blue-50 border-blue-200"
                        : completedSteps.has(index)
                          ? "bg-green-50 border-green-200"
                          : "hover:bg-gray-50"
                    }`}
                    onClick={() => setCurrentStep(index)}
                  >
                    <div className="flex items-center space-x-3">
                      {completedSteps.has(index) ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <div
                          className={`w-5 h-5 rounded-full border-2 ${
                            index === currentStep ? "border-blue-500" : "border-gray-300"
                          }`}
                        />
                      )}
                      <div>
                        <p className="font-medium">
                          Stap {index + 1}: {step.title}
                        </p>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Troubleshooting Tab */}
        <TabsContent value="troubleshooting">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
                Probleemoplossing
              </CardTitle>
              <CardDescription>Veelvoorkomende problemen en hun oplossingen</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {guide.troubleshooting.map((item, index) => (
                  <AccordionItem key={index} value={`problem-${index}`}>
                    <AccordionTrigger className="text-left">{item.problem}</AccordionTrigger>
                    <AccordionContent className="space-y-3">
                      <div>
                        <h5 className="font-medium text-green-700 mb-1">Oplossing:</h5>
                        <p className="text-sm">{item.solution}</p>
                      </div>
                      {item.preventive && (
                        <div>
                          <h5 className="font-medium text-blue-700 mb-1">Preventie:</h5>
                          <p className="text-sm">{item.preventive}</p>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <HelpCircle className="h-5 w-5 mr-2 text-blue-500" />
                Veelgestelde Vragen
              </CardTitle>
              <CardDescription>Antwoorden op veelgestelde vragen over {guide.moduleName}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Zoek in FAQ..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Accordion type="single" collapsible className="w-full">
                {filteredFAQs.map((faq, index) => (
                  <AccordionItem key={index} value={`faq-${index}`}>
                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">{faq.answer}</p>
                      {faq.roles && (
                        <div className="mt-2">
                          <span className="text-xs text-muted-foreground">Relevant voor: {faq.roles.join(", ")}</span>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              {filteredFAQs.length === 0 && searchQuery && (
                <div className="text-center py-8 text-muted-foreground">Geen FAQ's gevonden voor "{searchQuery}"</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Download className="h-5 w-5 mr-2 text-green-500" />
                Aanvullende Bronnen
              </CardTitle>
              <CardDescription>Handige documenten en links voor {guide.moduleName}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-auto p-4 flex flex-col items-start space-y-2">
                  <div className="flex items-center">
                    <Download className="h-4 w-4 mr-2" />
                    PDF Handleiding
                  </div>
                  <span className="text-sm text-muted-foreground">Volledige handleiding downloaden</span>
                </Button>

                <Button variant="outline" className="h-auto p-4 flex flex-col items-start space-y-2">
                  <div className="flex items-center">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Video Tutorials
                  </div>
                  <span className="text-sm text-muted-foreground">Bekijk instructievideo's</span>
                </Button>

                <Button variant="outline" className="h-auto p-4 flex flex-col items-start space-y-2">
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Snelstart Gids
                  </div>
                  <span className="text-sm text-muted-foreground">Korte introductie handleiding</span>
                </Button>

                <Button variant="outline" className="h-auto p-4 flex flex-col items-start space-y-2">
                  <div className="flex items-center">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Online Ondersteuning
                  </div>
                  <span className="text-sm text-muted-foreground">Contact opnemen met support</span>
                </Button>
              </div>

              {guide.relatedModules && (
                <div className="mt-6">
                  <h4 className="font-medium mb-3">Gerelateerde Modules:</h4>
                  <div className="flex flex-wrap gap-2">
                    {guide.relatedModules.map((moduleId, index) => (
                      <Badge key={index} variant="outline">
                        {moduleId}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
