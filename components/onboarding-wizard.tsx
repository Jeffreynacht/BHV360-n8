"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, ArrowRight, ArrowLeft, Users, Shield, Settings, MapPin } from "lucide-react"

interface OnboardingStep {
  id: string
  title: string
  description: string
  icon: React.ComponentType<any>
  content: React.ReactNode
  action?: {
    text: string
    href: string
  }
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: "welcome",
    title: "Welkom bij BHV360",
    description: "Laten we je wegwijs maken in het systeem",
    icon: Shield,
    content: (
      <div className="space-y-4">
        <p>
          BHV360 is jouw complete oplossing voor brandveiligheid en BHV-beheer. In deze korte rondleiding laten we je de
          belangrijkste functies zien.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 border rounded-lg">
            <h4 className="font-medium mb-1">📋 Plotkaarten</h4>
            <p className="text-sm text-muted-foreground">Interactieve brandveiligheidsplattegronden</p>
          </div>
          <div className="p-3 border rounded-lg">
            <h4 className="font-medium mb-1">📱 NFC Tags</h4>
            <p className="text-sm text-muted-foreground">Slimme controle van voorzieningen</p>
          </div>
          <div className="p-3 border rounded-lg">
            <h4 className="font-medium mb-1">👥 Gebruikersbeheer</h4>
            <p className="text-sm text-muted-foreground">BHV'ers en rechten beheren</p>
          </div>
          <div className="p-3 border rounded-lg">
            <h4 className="font-medium mb-1">📊 Rapportages</h4>
            <p className="text-sm text-muted-foreground">Inzicht in veiligheid en compliance</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "customer",
    title: "Klant selecteren",
    description: "Selecteer eerst een klant om te beginnen",
    icon: Users,
    content: (
      <div className="space-y-4">
        <p>
          BHV360 werkt met meerdere klanten. Selecteer eerst een klant in de linker navigatiebalk om alle
          functionaliteiten te kunnen gebruiken.
        </p>
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">💡 Tip</h4>
          <p className="text-sm text-blue-800">
            Alle data in het systeem wordt automatisch gefilterd op de geselecteerde klant. Je ziet alleen informatie
            die relevant is voor die specifieke klant.
          </p>
        </div>
        <div className="space-y-2">
          <h4 className="font-medium">Beschikbare klanten:</h4>
          <ul className="space-y-1 text-sm">
            <li>• Provincie Noord-Brabant</li>
            <li>• Gemeente Eindhoven</li>
            <li>• Ziekenhuis Catharina</li>
          </ul>
        </div>
      </div>
    ),
    action: {
      text: "Ga naar klanten",
      href: "/klanten",
    },
  },
  {
    id: "plotkaart",
    title: "BHV Plotkaart",
    description: "De kern van het systeem",
    icon: Shield,
    content: (
      <div className="space-y-4">
        <p>
          De BHV Plotkaart is het hart van BHV360. Hier zie je alle veiligheidsvoorzieningen, kun je checklists afwerken
          en NFC tags scannen.
        </p>
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-start space-x-3 p-3 border rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <h4 className="font-medium">Interactieve kaart</h4>
              <p className="text-sm text-muted-foreground">Klik op symbolen voor details en acties</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-3 border rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <h4 className="font-medium">Checklist functie</h4>
              <p className="text-sm text-muted-foreground">Houd controles bij met de ingebouwde checklist</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-3 border rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <h4 className="font-medium">NFC scanning</h4>
              <p className="text-sm text-muted-foreground">Scan tags met je telefoon voor snelle controles</p>
            </div>
          </div>
        </div>
      </div>
    ),
    action: {
      text: "Open BHV Plotkaart",
      href: "/bhv",
    },
  },
  {
    id: "editor",
    title: "Plotkaart Editor",
    description: "Pas plotkaarten aan naar jouw wensen",
    icon: MapPin,
    content: (
      <div className="space-y-4">
        <p>
          Met de Plotkaart Editor kun je plotkaarten volledig aanpassen. Voeg symbolen toe, verplaats voorzieningen en
          maak de kaart perfect voor jouw situatie.
        </p>
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-medium text-yellow-900 mb-2">⚠️ Let op</h4>
          <p className="text-sm text-yellow-800">
            Alleen gebruikers met editor-rechten kunnen plotkaarten bewerken. Neem contact op met je beheerder als je
            deze functie nodig hebt.
          </p>
        </div>
        <div className="space-y-2">
          <h4 className="font-medium">Editor functies:</h4>
          <ul className="space-y-1 text-sm">
            <li>• Symbolen slepen en neerzetten</li>
            <li>• Voorzieningen toevoegen/bewerken</li>
            <li>• Verdiepingen beheren</li>
            <li>• PDF export</li>
          </ul>
        </div>
      </div>
    ),
    action: {
      text: "Open Editor",
      href: "/bhv/editor",
    },
  },
  {
    id: "settings",
    title: "Instellingen",
    description: "Configureer het systeem naar jouw wensen",
    icon: Settings,
    content: (
      <div className="space-y-4">
        <p>
          In de instellingen kun je BHV360 volledig aanpassen aan jouw organisatie. Van huisstijl tot e-mail
          configuratie.
        </p>
        <div className="grid grid-cols-1 gap-3">
          <div className="p-3 border rounded-lg">
            <h4 className="font-medium mb-1">🎨 Huisstijl</h4>
            <p className="text-sm text-muted-foreground">Logo's, kleuren en branding aanpassen</p>
          </div>
          <div className="p-3 border rounded-lg">
            <h4 className="font-medium mb-1">📧 E-mail</h4>
            <p className="text-sm text-muted-foreground">SMTP configuratie voor notificaties</p>
          </div>
          <div className="p-3 border rounded-lg">
            <h4 className="font-medium mb-1">🔧 Modules</h4>
            <p className="text-sm text-muted-foreground">Functionaliteiten in- en uitschakelen</p>
          </div>
        </div>
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-medium text-green-900 mb-2">✅ Klaar om te beginnen!</h4>
          <p className="text-sm text-green-800">
            Je hebt nu een goed overzicht van BHV360. Begin met het selecteren van een klant en verken de verschillende
            modules.
          </p>
        </div>
      </div>
    ),
    action: {
      text: "Ga naar instellingen",
      href: "/instellingen",
    },
  },
]

interface OnboardingWizardProps {
  onComplete: () => void
}

export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<string[]>([])

  const handleNext = () => {
    const step = onboardingSteps[currentStep]
    if (!completedSteps.includes(step.id)) {
      setCompletedSteps([...completedSteps, step.id])
    }

    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    onComplete()
  }

  const step = onboardingSteps[currentStep]
  const progress = ((currentStep + 1) / onboardingSteps.length) * 100

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <step.icon className="h-6 w-6 text-blue-500" />
              <CardTitle>{step.title}</CardTitle>
            </div>
            <Badge variant="outline">
              {currentStep + 1} van {onboardingSteps.length}
            </Badge>
          </div>
          <CardDescription>{step.description}</CardDescription>
          <Progress value={progress} className="w-full" />
        </CardHeader>

        <CardContent>{step.content}</CardContent>

        <CardFooter className="flex justify-between">
          <div className="flex space-x-2">
            <Button variant="ghost" onClick={handleSkip}>
              Overslaan
            </Button>
            {currentStep > 0 && (
              <Button variant="outline" onClick={handlePrevious}>
                <ArrowLeft className="h-4 w-4 mr-1" />
                Vorige
              </Button>
            )}
          </div>

          <div className="flex space-x-2">
            {step.action && (
              <Button variant="outline" asChild>
                <a href={step.action.href} target="_blank" rel="noopener noreferrer">
                  {step.action.text}
                </a>
              </Button>
            )}
            <Button onClick={handleNext}>
              {currentStep === onboardingSteps.length - 1 ? "Voltooien" : "Volgende"}
              {currentStep < onboardingSteps.length - 1 && <ArrowRight className="h-4 w-4 ml-1" />}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
