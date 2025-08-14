"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { BHV360BrandHeader } from "@/components/bhv360-brand-header"
import {
  Play,
  Pause,
  Square,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  FileText,
  Download,
  Timer,
  User,
  Building,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface ProcedureStep {
  id: string
  title: string
  description: string
  timeLimit?: number
  assignedRole?: string
  completed: boolean
  required: boolean
}

interface EmergencyProcedure {
  id: string
  name: string
  type: "brand" | "medisch" | "beveiliging" | "evacuatie"
  priority: "laag" | "middel" | "hoog" | "kritiek"
  estimatedTime: number
  steps: ProcedureStep[]
  assignedPersons: string[]
  status: "niet-gestart" | "actief" | "voltooid" | "gepauzeerd"
}

const emergencyProcedures: EmergencyProcedure[] = [
  {
    id: "brand-evacuatie",
    name: "Brand Evacuatie Procedure",
    type: "brand",
    priority: "kritiek",
    estimatedTime: 15,
    assignedPersons: ["BHV-er", "Verdieping Coördinator"],
    status: "niet-gestart",
    steps: [
      {
        id: "alarm-activeren",
        title: "Brandalarm Activeren",
        description: "Activeer het brandalarm en waarschuw alle aanwezigen",
        timeLimit: 2,
        assignedRole: "BHV-er",
        completed: false,
        required: true,
      },
      {
        id: "hulpdiensten-bellen",
        title: "Hulpdiensten Alarmeren",
        description: "Bel 112 en meld de brand met locatie details",
        timeLimit: 3,
        assignedRole: "BHV-er",
        completed: false,
        required: true,
      },
      {
        id: "evacuatie-starten",
        title: "Evacuatie Starten",
        description: "Begin met de evacuatie van alle verdiepingen volgens de evacuatieroutes",
        timeLimit: 5,
        assignedRole: "Verdieping Coördinator",
        completed: false,
        required: true,
      },
      {
        id: "verzamelpunt-controleren",
        title: "Verzamelpunt Controleren",
        description: "Controleer of alle personen aanwezig zijn op het verzamelpunt",
        timeLimit: 5,
        assignedRole: "BHV-er",
        completed: false,
        required: true,
      },
    ],
  },
  {
    id: "medische-noodhulp",
    name: "Medische Noodhulp Procedure",
    type: "medisch",
    priority: "hoog",
    estimatedTime: 10,
    assignedPersons: ["EHBO-er", "BHV-er"],
    status: "niet-gestart",
    steps: [
      {
        id: "situatie-beoordelen",
        title: "Situatie Beoordelen",
        description: "Beoordeel de situatie en veiligheid van de omgeving",
        timeLimit: 1,
        assignedRole: "EHBO-er",
        completed: false,
        required: true,
      },
      {
        id: "eerste-hulp-verlenen",
        title: "Eerste Hulp Verlenen",
        description: "Verleen eerste hulp volgens EHBO protocollen",
        timeLimit: 5,
        assignedRole: "EHBO-er",
        completed: false,
        required: true,
      },
      {
        id: "ambulance-bellen",
        title: "Ambulance Alarmeren",
        description: "Bel 112 voor ambulance indien nodig",
        timeLimit: 2,
        assignedRole: "BHV-er",
        completed: false,
        required: false,
      },
      {
        id: "begeleiding-ambulance",
        title: "Ambulance Begeleiden",
        description: "Begeleid de ambulance naar de locatie",
        timeLimit: 2,
        assignedRole: "BHV-er",
        completed: false,
        required: false,
      },
    ],
  },
  {
    id: "beveiliging-incident",
    name: "Beveiligingsincident Procedure",
    type: "beveiliging",
    priority: "middel",
    estimatedTime: 8,
    assignedPersons: ["Beveiliging", "BHV-er"],
    status: "niet-gestart",
    steps: [
      {
        id: "incident-melden",
        title: "Incident Melden",
        description: "Meld het incident bij de beveiligingsdienst",
        timeLimit: 2,
        assignedRole: "Beveiliging",
        completed: false,
        required: true,
      },
      {
        id: "gebied-afzetten",
        title: "Gebied Afzetten",
        description: "Zet het betrokken gebied af voor veiligheid",
        timeLimit: 3,
        assignedRole: "Beveiliging",
        completed: false,
        required: true,
      },
      {
        id: "politie-informeren",
        title: "Politie Informeren",
        description: "Informeer de politie indien nodig",
        timeLimit: 3,
        assignedRole: "BHV-er",
        completed: false,
        required: false,
      },
    ],
  },
]

export default function NoodproceduresPage() {
  const [procedures, setProcedures] = useState<EmergencyProcedure[]>(emergencyProcedures)
  const [activeProcedure, setActiveProcedure] = useState<EmergencyProcedure | null>(null)
  const [timer, setTimer] = useState<number>(0)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning && activeProcedure) {
      interval = setInterval(() => {
        setTimer((timer) => timer + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning, activeProcedure])

  const startProcedure = (procedureId: string) => {
    const procedure = procedures.find((p) => p.id === procedureId)
    if (procedure) {
      setActiveProcedure(procedure)
      setTimer(0)
      setIsRunning(true)

      const updatedProcedures = procedures.map((p) => (p.id === procedureId ? { ...p, status: "actief" as const } : p))
      setProcedures(updatedProcedures)

      toast({
        title: "Procedure Gestart",
        description: `${procedure.name} is geactiveerd.`,
      })
    }
  }

  const pauseProcedure = () => {
    setIsRunning(false)
    if (activeProcedure) {
      const updatedProcedures = procedures.map((p) =>
        p.id === activeProcedure.id ? { ...p, status: "gepauzeerd" as const } : p,
      )
      setProcedures(updatedProcedures)
    }
  }

  const resumeProcedure = () => {
    setIsRunning(true)
    if (activeProcedure) {
      const updatedProcedures = procedures.map((p) =>
        p.id === activeProcedure.id ? { ...p, status: "actief" as const } : p,
      )
      setProcedures(updatedProcedures)
    }
  }

  const completeProcedure = () => {
    setIsRunning(false)
    if (activeProcedure) {
      const updatedProcedures = procedures.map((p) =>
        p.id === activeProcedure.id ? { ...p, status: "voltooid" as const } : p,
      )
      setProcedures(updatedProcedures)
      setActiveProcedure(null)
      setTimer(0)

      toast({
        title: "Procedure Voltooid",
        description: "De noodprocedure is succesvol afgerond.",
      })
    }
  }

  const toggleStepCompletion = (stepId: string) => {
    if (activeProcedure) {
      const updatedSteps = activeProcedure.steps.map((step) =>
        step.id === stepId ? { ...step, completed: !step.completed } : step,
      )

      const updatedProcedure = { ...activeProcedure, steps: updatedSteps }
      setActiveProcedure(updatedProcedure)

      const updatedProcedures = procedures.map((p) => (p.id === activeProcedure.id ? updatedProcedure : p))
      setProcedures(updatedProcedures)
    }
  }

  const getProgress = (procedure: EmergencyProcedure) => {
    const completedSteps = procedure.steps.filter((step) => step.completed).length
    return (completedSteps / procedure.steps.length) * 100
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "kritiek":
        return "bg-red-100 text-red-800"
      case "hoog":
        return "bg-orange-100 text-orange-800"
      case "middel":
        return "bg-yellow-100 text-yellow-800"
      case "laag":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "brand":
        return <AlertTriangle className="h-4 w-4" />
      case "medisch":
        return <User className="h-4 w-4" />
      case "beveiliging":
        return <Building className="h-4 w-4" />
      case "evacuatie":
        return <Users className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const exportToPDF = () => {
    toast({
      title: "PDF Export",
      description: "Procedure rapport wordt gegenereerd...",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <BHV360BrandHeader customerName="Noodprocedures" userRole="BHV Coördinator" />

      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">BHV360 Noodprocedures</h1>
          <p className="text-gray-600">
            Interactieve noodprocedures met real-time tracking en rol-gebaseerde toewijzing
          </p>
        </div>

        {/* Actieve Procedure Dashboard */}
        {activeProcedure && (
          <Card className="mb-8 border-l-4 border-l-red-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl text-red-700">🚨 ACTIEVE PROCEDURE: {activeProcedure.name}</CardTitle>
                  <CardDescription>
                    Verstreken tijd: {formatTime(timer)} | Status: {activeProcedure.status}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {isRunning ? (
                    <Button onClick={pauseProcedure} variant="outline">
                      <Pause className="h-4 w-4 mr-2" />
                      Pauzeren
                    </Button>
                  ) : (
                    <Button onClick={resumeProcedure}>
                      <Play className="h-4 w-4 mr-2" />
                      Hervatten
                    </Button>
                  )}
                  <Button onClick={completeProcedure} variant="destructive">
                    <Square className="h-4 w-4 mr-2" />
                    Voltooien
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress value={getProgress(activeProcedure)} className="w-full" />

                <div className="grid gap-4">
                  {activeProcedure.steps.map((step) => (
                    <div
                      key={step.id}
                      className={`p-4 border rounded-lg ${step.completed ? "bg-green-50 border-green-200" : "bg-white"}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Checkbox checked={step.completed} onCheckedChange={() => toggleStepCompletion(step.id)} />
                          <div>
                            <h4 className={`font-medium ${step.completed ? "line-through text-gray-500" : ""}`}>
                              {step.title}
                            </h4>
                            <p className="text-sm text-gray-600">{step.description}</p>
                            {step.assignedRole && (
                              <Badge variant="outline" className="mt-1">
                                <User className="h-3 w-3 mr-1" />
                                {step.assignedRole}
                              </Badge>
                            )}
                          </div>
                        </div>
                        {step.timeLimit && (
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Timer className="h-4 w-4" />
                            {step.timeLimit} min
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Procedure Overzicht */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {procedures.map((procedure) => (
            <Card key={procedure.id} className={`${procedure.status === "actief" ? "ring-2 ring-red-500" : ""}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(procedure.type)}
                    <CardTitle className="text-lg">{procedure.name}</CardTitle>
                  </div>
                  <Badge className={getPriorityColor(procedure.priority)}>{procedure.priority}</Badge>
                </div>
                <CardDescription>Geschatte tijd: {procedure.estimatedTime} minuten</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Voortgang */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Voortgang</span>
                      <span>{Math.round(getProgress(procedure))}%</span>
                    </div>
                    <Progress value={getProgress(procedure)} />
                  </div>

                  {/* Toegewezen Personen */}
                  <div>
                    <p className="text-sm font-medium mb-2">Toegewezen aan:</p>
                    <div className="flex flex-wrap gap-1">
                      {procedure.assignedPersons.map((person, index) => (
                        <Badge key={index} variant="secondary">
                          <Users className="h-3 w-3 mr-1" />
                          {person}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={
                        procedure.status === "actief"
                          ? "destructive"
                          : procedure.status === "voltooid"
                            ? "default"
                            : procedure.status === "gepauzeerd"
                              ? "secondary"
                              : "outline"
                      }
                    >
                      {procedure.status === "niet-gestart"
                        ? "Niet Gestart"
                        : procedure.status === "actief"
                          ? "Actief"
                          : procedure.status === "voltooid"
                            ? "Voltooid"
                            : procedure.status === "gepauzeerd"
                              ? "Gepauzeerd"
                              : procedure.status}
                    </Badge>

                    <div className="flex gap-2">
                      {procedure.status === "niet-gestart" && (
                        <Button size="sm" onClick={() => startProcedure(procedure.id)} disabled={!!activeProcedure}>
                          <Play className="h-4 w-4 mr-1" />
                          Start
                        </Button>
                      )}

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4 mr-1" />
                            Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>{procedure.name}</DialogTitle>
                            <DialogDescription>Gedetailleerde procedure stappen en instructies</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            {procedure.steps.map((step, index) => (
                              <div key={step.id} className="border-l-2 border-gray-200 pl-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                                    Stap {index + 1}
                                  </span>
                                  {step.required && (
                                    <Badge variant="destructive" className="text-xs">
                                      Verplicht
                                    </Badge>
                                  )}
                                  {step.timeLimit && (
                                    <Badge variant="outline" className="text-xs">
                                      <Clock className="h-3 w-3 mr-1" />
                                      {step.timeLimit} min
                                    </Badge>
                                  )}
                                </div>
                                <h4 className="font-medium">{step.title}</h4>
                                <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                                {step.assignedRole && (
                                  <Badge variant="secondary" className="text-xs">
                                    <User className="h-3 w-3 mr-1" />
                                    {step.assignedRole}
                                  </Badge>
                                )}
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={exportToPDF}>
                              <Download className="h-4 w-4 mr-2" />
                              Export PDF
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Statistieken */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Totaal Procedures</p>
                  <p className="text-2xl font-bold">{procedures.length}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Actieve Procedures</p>
                  <p className="text-2xl font-bold">{procedures.filter((p) => p.status === "actief").length}</p>
                </div>
                <Play className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Voltooide Procedures</p>
                  <p className="text-2xl font-bold">{procedures.filter((p) => p.status === "voltooid").length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Kritieke Procedures</p>
                  <p className="text-2xl font-bold">{procedures.filter((p) => p.priority === "kritiek").length}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
