"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Users, Brain, CheckCircle, Settings } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface BHVMember {
  id: number
  name: string
  skills: string[]
  availability: string[]
  workload: number
  location: string
  certifications: string[]
  lastShift: string
}

interface Shift {
  id: number
  date: string
  time: string
  duration: number
  requiredSkills: string[]
  assignedMembers: number[]
  priority: "low" | "medium" | "high"
  status: "scheduled" | "confirmed" | "completed"
}

export default function SmartSchedulingPage() {
  const [bhvMembers] = useState<BHVMember[]>([
    {
      id: 1,
      name: "Jan Jansen",
      skills: ["EHBO", "BHV", "Ontruiming"],
      availability: ["monday", "tuesday", "wednesday"],
      workload: 60,
      location: "Verdieping 2",
      certifications: ["BHV-Basis", "EHBO-Diploma"],
      lastShift: "2024-01-15",
    },
    {
      id: 2,
      name: "Petra de Vries",
      skills: ["BHV", "Ploegleider", "Ontruiming"],
      availability: ["monday", "wednesday", "friday"],
      workload: 80,
      location: "Verdieping 1",
      certifications: ["BHV-Ploegleider", "EHBO-Diploma"],
      lastShift: "2024-01-12",
    },
    {
      id: 3,
      name: "Mohammed El Amrani",
      skills: ["BHV", "EHBO"],
      availability: ["tuesday", "thursday", "friday"],
      workload: 40,
      location: "Verdieping 3",
      certifications: ["BHV-Basis"],
      lastShift: "2024-01-10",
    },
  ])

  const [shifts, setShifts] = useState<Shift[]>([
    {
      id: 1,
      date: "2024-01-22",
      time: "09:00",
      duration: 8,
      requiredSkills: ["BHV", "EHBO"],
      assignedMembers: [1],
      priority: "high",
      status: "scheduled",
    },
    {
      id: 2,
      date: "2024-01-23",
      time: "09:00",
      duration: 8,
      requiredSkills: ["BHV", "Ploegleider"],
      assignedMembers: [2],
      priority: "medium",
      status: "confirmed",
    },
  ])

  const [aiSettings, setAiSettings] = useState({
    enableAutoScheduling: true,
    considerWorkload: true,
    balanceShifts: true,
    respectPreferences: true,
    minimumCoverage: 2,
    maxConsecutiveShifts: 3,
    restPeriodHours: 16,
  })

  const [optimizationResults, setOptimizationResults] = useState({
    coverageScore: 85,
    workloadBalance: 92,
    memberSatisfaction: 78,
    suggestions: [
      "Voeg extra BHV'er toe op vrijdag voor betere dekking",
      "Mohammed heeft lage workload - kan meer shifts krijgen",
      "Petra heeft veel opeenvolgende shifts - overweeg spreiding",
    ],
  })

  const generateOptimalSchedule = () => {
    // AI scheduling algorithm simulation
    const newShifts = [...shifts]

    // Simulate AI optimization
    setTimeout(() => {
      setOptimizationResults({
        coverageScore: Math.floor(Math.random() * 20) + 80,
        workloadBalance: Math.floor(Math.random() * 20) + 80,
        memberSatisfaction: Math.floor(Math.random() * 20) + 75,
        suggestions: [
          "Schema geoptimaliseerd voor betere workload verdeling",
          "Alle kritieke tijdslots hebben nu adequate dekking",
          "Rustperiodes tussen shifts zijn gerespecteerd",
        ],
      })
    }, 2000)
  }

  const getWorkloadColor = (workload: number) => {
    if (workload < 50) return "text-green-600"
    if (workload < 80) return "text-yellow-600"
    return "text-red-600"
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="container p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Smart BHV Scheduling</h1>
          <p className="text-muted-foreground">AI-gestuurde optimale planning van BHV diensten</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            AI Instellingen
          </Button>
          <Button onClick={generateOptimalSchedule}>
            <Brain className="h-4 w-4 mr-2" />
            Optimaliseer Schema
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
              Dekking Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{optimizationResults.coverageScore}%</div>
            <p className="text-sm text-muted-foreground">Alle shifts adequaat bezet</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Users className="h-5 w-5 mr-2 text-blue-500" />
              Workload Balans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{optimizationResults.workloadBalance}%</div>
            <p className="text-sm text-muted-foreground">Eerlijke verdeling van shifts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Clock className="h-5 w-5 mr-2 text-purple-500" />
              Tevredenheid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{optimizationResults.memberSatisfaction}%</div>
            <p className="text-sm text-muted-foreground">Voorkeuren gerespecteerd</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>BHV Team Overzicht</CardTitle>
            <CardDescription>Beschikbaarheid en workload van team members</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bhvMembers.map((member) => (
                <div key={member.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">{member.name}</h3>
                      <p className="text-sm text-muted-foreground">{member.location}</p>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${getWorkloadColor(member.workload)}`}>{member.workload}%</div>
                      <p className="text-xs text-muted-foreground">Workload</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <p className="text-xs font-medium text-gray-600">Skills:</p>
                      <div className="flex flex-wrap gap-1">
                        {member.skills.map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-gray-600">Beschikbaarheid:</p>
                      <div className="flex flex-wrap gap-1">
                        {member.availability.map((day, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {day}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground">Laatste shift: {member.lastShift}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Geplande Shifts</CardTitle>
            <CardDescription>Komende BHV diensten en toewijzingen</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {shifts.map((shift) => (
                <div key={shift.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span className="font-medium">{shift.date}</span>
                        <Clock className="h-4 w-4" />
                        <span>{shift.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{shift.duration} uur dienst</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${getPriorityColor(shift.priority)}`} />
                      <Badge
                        variant={
                          shift.status === "completed"
                            ? "default"
                            : shift.status === "confirmed"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {shift.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <p className="text-xs font-medium text-gray-600">Vereiste skills:</p>
                      <div className="flex flex-wrap gap-1">
                        {shift.requiredSkills.map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-gray-600">Toegewezen:</p>
                      <div className="flex flex-wrap gap-1">
                        {shift.assignedMembers.map((memberId) => {
                          const member = bhvMembers.find((m) => m.id === memberId)
                          return member ? (
                            <Badge key={memberId} variant="secondary" className="text-xs">
                              {member.name}
                            </Badge>
                          ) : null
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>AI Optimalisatie Suggesties</CardTitle>
          <CardDescription>Aanbevelingen voor verbetering van het schema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {optimizationResults.suggestions.map((suggestion, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                <Brain className="h-5 w-5 text-blue-500 mt-0.5" />
                <p className="text-sm">{suggestion}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>AI Instellingen</CardTitle>
          <CardDescription>Configureer de smart scheduling parameters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Automatische planning</Label>
                  <p className="text-sm text-muted-foreground">AI genereert automatisch schema's</p>
                </div>
                <Switch
                  checked={aiSettings.enableAutoScheduling}
                  onCheckedChange={(checked) => setAiSettings({ ...aiSettings, enableAutoScheduling: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Workload balancering</Label>
                  <p className="text-sm text-muted-foreground">Verdeel shifts eerlijk</p>
                </div>
                <Switch
                  checked={aiSettings.balanceShifts}
                  onCheckedChange={(checked) => setAiSettings({ ...aiSettings, balanceShifts: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Voorkeuren respecteren</Label>
                  <p className="text-sm text-muted-foreground">Houd rekening met beschikbaarheid</p>
                </div>
                <Switch
                  checked={aiSettings.respectPreferences}
                  onCheckedChange={(checked) => setAiSettings({ ...aiSettings, respectPreferences: checked })}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Minimum dekking</Label>
                <Select
                  value={aiSettings.minimumCoverage.toString()}
                  onValueChange={(value) => setAiSettings({ ...aiSettings, minimumCoverage: Number(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 BHV'er</SelectItem>
                    <SelectItem value="2">2 BHV'ers</SelectItem>
                    <SelectItem value="3">3 BHV'ers</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Max opeenvolgende shifts</Label>
                <Select
                  value={aiSettings.maxConsecutiveShifts.toString()}
                  onValueChange={(value) => setAiSettings({ ...aiSettings, maxConsecutiveShifts: Number(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 shifts</SelectItem>
                    <SelectItem value="3">3 shifts</SelectItem>
                    <SelectItem value="4">4 shifts</SelectItem>
                    <SelectItem value="5">5 shifts</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Rustperiode (uren)</Label>
                <Select
                  value={aiSettings.restPeriodHours.toString()}
                  onValueChange={(value) => setAiSettings({ ...aiSettings, restPeriodHours: Number(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="8">8 uur</SelectItem>
                    <SelectItem value="12">12 uur</SelectItem>
                    <SelectItem value="16">16 uur</SelectItem>
                    <SelectItem value="24">24 uur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
