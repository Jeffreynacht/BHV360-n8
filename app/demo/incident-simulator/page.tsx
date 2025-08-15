"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, AlertTriangle, Phone, Users, MapPin, Clock, CheckCircle, Siren, MessageSquare } from "lucide-react"
import Link from "next/link"

export default function IncidentSimulatorDemoPage() {
  const [simulationActive, setSimulationActive] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)

  const simulationSteps = [
    {
      title: "Incident Gedetecteerd",
      description: "Brandmelder geactiveerd in Gebouw A, Verdieping 2",
      icon: AlertTriangle,
      color: "text-red-600",
      duration: 2000,
    },
    {
      title: "Automatische Melding",
      description: "BHV coördinatoren worden automatisch geïnformeerd",
      icon: Phone,
      color: "text-orange-600",
      duration: 3000,
    },
    {
      title: "Team Mobilisatie",
      description: "BHV team wordt samengesteld en naar locatie gestuurd",
      icon: Users,
      color: "text-blue-600",
      duration: 4000,
    },
    {
      title: "Locatie Bepaling",
      description: "Exacte locatie wordt bepaald via plotkaart systeem",
      icon: MapPin,
      color: "text-purple-600",
      duration: 2000,
    },
    {
      title: "Evacuatie Gestart",
      description: "Evacuatieprocedure wordt geactiveerd voor betreffende zone",
      icon: Siren,
      color: "text-yellow-600",
      duration: 5000,
    },
    {
      title: "Incident Afgehandeld",
      description: "Situatie onder controle, all-clear gegeven",
      icon: CheckCircle,
      color: "text-green-600",
      duration: 2000,
    },
  ]

  const startSimulation = () => {
    setSimulationActive(true)
    setCurrentStep(0)
    setProgress(0)
  }

  const resetSimulation = () => {
    setSimulationActive(false)
    setCurrentStep(0)
    setProgress(0)
  }

  useEffect(() => {
    if (simulationActive && currentStep < simulationSteps.length) {
      const step = simulationSteps[currentStep]
      const timer = setTimeout(() => {
        if (currentStep < simulationSteps.length - 1) {
          setCurrentStep(currentStep + 1)
          setProgress(((currentStep + 1) / simulationSteps.length) * 100)
        } else {
          setSimulationActive(false)
        }
      }, step.duration)

      return () => clearTimeout(timer)
    }
  }, [simulationActive, currentStep])

  const incidentTypes = [
    {
      name: "Brand Alarm",
      description: "Simuleer een brandmelding met volledige evacuatieprocedure",
      icon: "🔥",
      severity: "Hoog",
      estimatedTime: "15-20 minuten",
    },
    {
      name: "Medisch Noodgeval",
      description: "EHBO situatie met AED inzet en ambulance oproep",
      icon: "🏥",
      severity: "Gemiddeld",
      estimatedTime: "10-15 minuten",
    },
    {
      name: "Beveiligingsincident",
      description: "Verdachte situatie met lockdown procedure",
      icon: "🚨",
      severity: "Variabel",
      estimatedTime: "5-30 minuten",
    },
    {
      name: "Gaslekage",
      description: "Gaslek detectie met evacuatie en ventilatie procedures",
      icon: "⚠️",
      severity: "Hoog",
      estimatedTime: "20-30 minuten",
    },
  ]

  const recentIncidents = [
    {
      time: "14:23",
      type: "Brand Alarm",
      location: "Gebouw A - Verdieping 2",
      status: "Opgelost",
      duration: "18 min",
    },
    {
      time: "11:45",
      type: "Medisch Noodgeval",
      location: "Gebouw C - Kantine",
      status: "Opgelost",
      duration: "12 min",
    },
    {
      time: "09:15",
      type: "Beveiligingsincident",
      location: "Hoofdingang",
      status: "Opgelost",
      duration: "8 min",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/demo/overview" className="flex items-center text-blue-600 hover:text-blue-700">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Terug naar demo overzicht
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="bg-red-100 text-red-700">
                🚨 Incident Simulator
              </Badge>
              <h1 className="text-xl font-bold text-gray-900">Incident Management Demo</h1>
            </div>
            <Button onClick={resetSimulation} variant="outline" disabled={!simulationActive}>
              Reset Simulatie
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Simulation Status */}
        {simulationActive && (
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center text-red-800">
                <Siren className="h-5 w-5 mr-2 animate-pulse" />
                Simulatie Actief
              </CardTitle>
              <CardDescription>
                Incident simulatie in uitvoering - Stap {currentStep + 1} van {simulationSteps.length}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress value={progress} className="h-3" />
                <div className="flex items-center space-x-4">
                  {simulationSteps[currentStep] && (
                    <>
                      <div className="p-2 bg-white rounded-lg">
                        {React.createElement(simulationSteps[currentStep].icon, {
                          className: `h-6 w-6 ${simulationSteps[currentStep].color}`,
                        })}
                      </div>
                      <div>
                        <div className="font-semibold text-red-800">{simulationSteps[currentStep].title}</div>
                        <div className="text-sm text-red-600">{simulationSteps[currentStep].description}</div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Incident Types */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
                Incident Simulaties
              </CardTitle>
              <CardDescription>Kies een incident type om de volledige procedure te simuleren</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {incidentTypes.map((incident, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <span className="text-2xl">{incident.icon}</span>
                        <div>
                          <h3 className="font-semibold text-gray-900">{incident.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{incident.description}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <Badge
                              variant="outline"
                              className={
                                incident.severity === "Hoog"
                                  ? "border-red-200 text-red-700"
                                  : incident.severity === "Gemiddeld"
                                    ? "border-yellow-200 text-yellow-700"
                                    : "border-gray-200 text-gray-700"
                              }
                            >
                              {incident.severity}
                            </Badge>
                            <span className="text-xs text-gray-500 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {incident.estimatedTime}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={startSimulation}
                        disabled={simulationActive}
                        size="sm"
                        variant={index === 0 ? "default" : "outline"}
                      >
                        Start Simulatie
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Timeline & Recent Incidents */}
          <div className="space-y-6">
            {/* Simulation Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-blue-600" />
                  Procedure Timeline
                </CardTitle>
                <CardDescription>Stappen die worden doorlopen tijdens een incident</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {simulationSteps.map((step, index) => {
                    const IconComponent = step.icon
                    const isActive = simulationActive && currentStep === index
                    const isCompleted = simulationActive && currentStep > index
                    return (
                      <div
                        key={index}
                        className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                          isActive
                            ? "bg-blue-50 border border-blue-200"
                            : isCompleted
                              ? "bg-green-50 border border-green-200"
                              : "bg-gray-50"
                        }`}
                      >
                        <div
                          className={`p-2 rounded-lg ${
                            isActive ? "bg-blue-100" : isCompleted ? "bg-green-100" : "bg-white"
                          }`}
                        >
                          <IconComponent
                            className={`h-4 w-4 ${
                              isActive ? "text-blue-600" : isCompleted ? "text-green-600" : step.color
                            }`}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{step.title}</div>
                          <div className="text-sm text-gray-600">{step.description}</div>
                        </div>
                        {isCompleted && <CheckCircle className="h-5 w-5 text-green-600" />}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recent Incidents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-gray-600" />
                  Recente Incidenten
                </CardTitle>
                <CardDescription>Overzicht van recent afgehandelde incidenten</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentIncidents.map((incident, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="text-sm font-mono text-gray-500">{incident.time}</div>
                        <div>
                          <div className="font-medium text-gray-900">{incident.type}</div>
                          <div className="text-sm text-gray-600 flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {incident.location}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="border-green-200 text-green-700">
                          {incident.status}
                        </Badge>
                        <div className="text-xs text-gray-500 mt-1">{incident.duration}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Demo Actions */}
        <div className="mt-8 text-center">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-orange-900 mb-2">🎮 Demo Functies</h3>
            <p className="text-orange-700 mb-4">
              Deze simulator toont hoe BHV360 automatisch reageert op incidenten. In de echte applicatie worden
              hulpdiensten gecontacteerd, teams gemobiliseerd en evacuaties gecoördineerd.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/demo/bhv-status">
                <Button variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  BHV Status
                </Button>
              </Link>
              <Link href="/demo/ehbo-monitoring">
                <Button variant="outline">
                  <MapPin className="mr-2 h-4 w-4" />
                  EHBO Monitoring
                </Button>
              </Link>
              <Link href="/login">
                <Button>
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Probeer Volledige Versie
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
