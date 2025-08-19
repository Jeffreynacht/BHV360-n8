"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ArrowLeft,
  AlertTriangle,
  Users,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  Play,
  Pause,
  RotateCcw,
  Bell,
} from "lucide-react"
import Link from "next/link"

const incidentSteps = [
  {
    id: 1,
    title: "Incident Gedetecteerd",
    description: "Brandmelder geactiveerd in Kantoor A",
    time: "14:32:15",
    status: "completed",
    actions: ["Automatische melding naar BHV team", "Activatie evacuatieprocedure"],
  },
  {
    id: 2,
    title: "BHV Team Gealarmeerd",
    description: "Alle BHV'ers ontvangen push notificatie",
    time: "14:32:18",
    status: "completed",
    actions: ["SMS naar 4 BHV'ers verzonden", "App notificaties verstuurd"],
  },
  {
    id: 3,
    title: "Eerste Respons",
    description: "Jan van der Berg (BHV Coördinator) bevestigt",
    time: "14:32:45",
    status: "completed",
    actions: ["Locatie bevestigd", "Evacuatie gestart"],
  },
  {
    id: 4,
    title: "Team Mobilisatie",
    description: "BHV team verzamelt bij incident locatie",
    time: "14:33:12",
    status: "active",
    actions: ["2 van 4 BHV'ers ter plaatse", "Brandweer gebeld"],
  },
  {
    id: 5,
    title: "Evacuatie Uitvoering",
    description: "Systematische ontruiming van het gebouw",
    time: "14:33:30",
    status: "pending",
    actions: ["Verdieping voor verdieping", "Verzamelplaats controle"],
  },
  {
    id: 6,
    title: "Hulpdiensten Aanwezig",
    description: "Brandweer en ambulance ter plaatse",
    time: "14:38:00",
    status: "pending",
    actions: ["Overdracht aan brandweer", "Incident afhandeling"],
  },
]

const bhvTeam = [
  {
    name: "Jan van der Berg",
    role: "BHV Coördinator",
    status: "Ter plaatse",
    responseTime: "30 sec",
    location: "Kantoor A",
  },
  {
    name: "Maria Jansen",
    role: "EHBO'er",
    status: "Onderweg",
    responseTime: "45 sec",
    location: "Verdieping 1",
  },
  {
    name: "Piet Bakker",
    role: "Ontruimingsassistent",
    status: "Niet beschikbaar",
    responseTime: "-",
    location: "Afwezig",
  },
  {
    name: "Lisa de Vries",
    role: "BHV'er",
    status: "Ter plaatse",
    responseTime: "1 min 15 sec",
    location: "Verzamelplaats",
  },
]

export default function IncidentSimulatorDemo() {
  const [isRunning, setIsRunning] = useState(false)
  const [currentStep, setCurrentStep] = useState(3)
  const [elapsedTime, setElapsedTime] = useState(180) // 3 minutes in seconds

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning) {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1)

        // Auto-advance steps
        if (elapsedTime > 0 && elapsedTime % 30 === 0 && currentStep < incidentSteps.length) {
          setCurrentStep((prev) => Math.min(prev + 1, incidentSteps.length))
        }
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning, elapsedTime, currentStep])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "active":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTeamStatusColor = (status: string) => {
    switch (status) {
      case "Ter plaatse":
        return "bg-green-100 text-green-800"
      case "Onderweg":
        return "bg-yellow-100 text-yellow-800"
      case "Niet beschikbaar":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const resetSimulation = () => {
    setIsRunning(false)
    setCurrentStep(3)
    setElapsedTime(180)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Terug naar Home
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Incident Management Demo</h1>
                <p className="text-sm text-gray-500">Real-time incident simulatie en respons</p>
              </div>
            </div>
            <Badge className="bg-red-100 text-red-800">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Live Simulatie
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Control Panel */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                  Incident Simulatie Controle
                </CardTitle>
                <CardDescription>Simuleer een brand incident en zie hoe BHV360 automatisch reageert</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <div className="text-2xl font-bold text-red-600">{formatTime(elapsedTime)}</div>
                  <div className="text-xs text-gray-500">Incident tijd</div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  onClick={() => setIsRunning(!isRunning)}
                  className={isRunning ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
                >
                  {isRunning ? (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      Pauzeer Simulatie
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Start Simulatie
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={resetSimulation}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">
                  Stap {currentStep} van {incidentSteps.length}
                </div>
                <Progress value={(currentStep / incidentSteps.length) * 100} className="w-32" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Incident Timeline */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Incident Timeline</CardTitle>
                <CardDescription>Real-time overzicht van alle incident stappen</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {incidentSteps.map((step, index) => {
                    const isActive = index + 1 === currentStep
                    const isCompleted = index + 1 < currentStep
                    const isPending = index + 1 > currentStep

                    return (
                      <div
                        key={step.id}
                        className={`relative p-4 rounded-lg border-2 transition-all ${
                          isActive
                            ? "border-blue-500 bg-blue-50"
                            : isCompleted
                              ? "border-green-500 bg-green-50"
                              : "border-gray-200 bg-gray-50"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                isCompleted
                                  ? "bg-green-500 text-white"
                                  : isActive
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-300 text-gray-600"
                              }`}
                            >
                              {isCompleted ? (
                                <CheckCircle className="h-4 w-4" />
                              ) : isActive ? (
                                <Bell className="h-4 w-4" />
                              ) : (
                                <Clock className="h-4 w-4" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">{step.title}</h3>
                              <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                              <div className="mt-2 space-y-1">
                                {step.actions.map((action, actionIndex) => (
                                  <div key={actionIndex} className="flex items-center text-xs text-gray-500">
                                    <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                                    {action}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge
                              className={getStatusColor(isCompleted ? "completed" : isActive ? "active" : "pending")}
                            >
                              {isCompleted ? "Voltooid" : isActive ? "Actief" : "Wachtend"}
                            </Badge>
                            <div className="text-xs text-gray-500 mt-1">{step.time}</div>
                          </div>
                        </div>

                        {isActive && (
                          <div className="mt-3 p-2 bg-blue-100 rounded border-l-4 border-blue-500">
                            <div className="flex items-center">
                              <div className="animate-pulse w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                              <span className="text-sm font-medium text-blue-800">In uitvoering...</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Team Status */}
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>BHV Team Status</CardTitle>
                <CardDescription>Real-time team respons</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bhvTeam.map((member, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{member.name}</h4>
                        <Badge className={getTeamStatusColor(member.status)}>{member.status}</Badge>
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {member.role}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {member.location}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          Respons: {member.responseTime}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contacts */}
            <Card>
              <CardHeader>
                <CardTitle>Noodcontacten</CardTitle>
                <CardDescription>Automatisch geactiveerd</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-red-50 rounded border">
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-red-600 mr-2" />
                      <span className="text-sm font-medium">Brandweer</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Gebeld</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-blue-50 rounded border">
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-blue-600 mr-2" />
                      <span className="text-sm font-medium">Ambulance</span>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">Standby</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-gray-600 mr-2" />
                      <span className="text-sm font-medium">Politie</span>
                    </div>
                    <Badge className="bg-gray-100 text-gray-800">Niet nodig</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Live Updates */}
        {isRunning && (
          <Alert className="mt-6 border-blue-200 bg-blue-50">
            <Bell className="h-4 w-4" />
            <AlertDescription>
              <strong>Live Update:</strong> Incident simulatie is actief. Alle BHV procedures worden automatisch
              uitgevoerd volgens protocol.
            </AlertDescription>
          </Alert>
        )}

        {/* Demo CTA */}
        <Card className="mt-8 bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Indrukwekkende automatisering, toch?</h3>
              <p className="text-gray-600 mb-4">
                BHV360 automatiseert uw complete incident respons. Van detectie tot afhandeling, alles verloopt volgens
                protocol.
              </p>
              <div className="flex justify-center space-x-4">
                <Link href="/login">
                  <Button size="lg" className="bg-red-600 hover:bg-red-700">
                    Start Gratis Trial
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" size="lg">
                    Meer Demo's
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
