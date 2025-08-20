"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  GraduationCap,
  UserIcon,
  BarChart3,
  AlertTriangle,
  Clock,
  Award,
  BookOpen,
  Users,
  Calendar,
} from "lucide-react"
import { useCustomer } from "@/components/customer-context"

type SkillLevel = "beginner" | "intermediate" | "advanced" | "expert"

type Skill = {
  id: string
  name: string
  category: string
  description: string
  requiredLevel: SkillLevel
  currentLevel: SkillLevel
  lastAssessed: Date
  expiryDate?: Date
  certificationRequired: boolean
  trainingHours: number
}

type Assessment = {
  id: string
  userId: string
  skillId: string
  score: number
  level: SkillLevel
  assessedBy: string
  assessmentDate: Date
  notes: string
  recommendations: string[]
}

type CustomerUser = {
  id: string
  name: string
  role: string
  department: string
  skills: Skill[]
  assessments: Assessment[]
  overallScore: number
}

export default function SkillsAssessmentPage() {
  const { selectedCustomer } = useCustomer()
  const [users, setUsers] = useState<CustomerUser[]>([])
  const [selectedUser, setSelectedUser] = useState<CustomerUser | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

  // Dummy data
  useEffect(() => {
    if (selectedCustomer) {
      setUsers([
        {
          id: "1",
          name: "Jan Jansen",
          role: "BHV Coördinator",
          department: "Facilitair",
          overallScore: 87,
          skills: [
            {
              id: "bhv-basic",
              name: "BHV Basis",
              category: "Brandveiligheid",
              description: "Basis BHV vaardigheden en procedures",
              requiredLevel: "intermediate",
              currentLevel: "advanced",
              lastAssessed: new Date("2024-01-15"),
              expiryDate: new Date("2024-12-15"),
              certificationRequired: true,
              trainingHours: 16,
            },
            {
              id: "ehbo",
              name: "EHBO",
              category: "Medische Hulp",
              description: "Eerste Hulp Bij Ongelukken",
              requiredLevel: "intermediate",
              currentLevel: "expert",
              lastAssessed: new Date("2024-01-10"),
              expiryDate: new Date("2024-10-20"),
              certificationRequired: true,
              trainingHours: 24,
            },
            {
              id: "evacuation",
              name: "Ontruiming",
              category: "Evacuatie",
              description: "Ontruimingsprocedures en crowd control",
              requiredLevel: "advanced",
              currentLevel: "advanced",
              lastAssessed: new Date("2024-01-05"),
              certificationRequired: true,
              trainingHours: 8,
            },
            {
              id: "communication",
              name: "Noodcommunicatie",
              category: "Communicatie",
              description: "Communicatie tijdens noodsituaties",
              requiredLevel: "intermediate",
              currentLevel: "intermediate",
              lastAssessed: new Date("2023-12-20"),
              certificationRequired: false,
              trainingHours: 4,
            },
          ],
          assessments: [],
        },
        {
          id: "2",
          name: "Petra de Vries",
          role: "Ploegleider",
          department: "Operations",
          overallScore: 92,
          skills: [
            {
              id: "bhv-advanced",
              name: "BHV Ploegleider",
              category: "Brandveiligheid",
              description: "Geavanceerde BHV en leidinggevende vaardigheden",
              requiredLevel: "advanced",
              currentLevel: "expert",
              lastAssessed: new Date("2024-01-20"),
              expiryDate: new Date("2025-03-10"),
              certificationRequired: true,
              trainingHours: 32,
            },
            {
              id: "leadership",
              name: "Crisis Leiderschap",
              category: "Leiderschap",
              description: "Leidinggeven tijdens crisissituaties",
              requiredLevel: "advanced",
              currentLevel: "advanced",
              lastAssessed: new Date("2024-01-12"),
              certificationRequired: false,
              trainingHours: 16,
            },
          ],
          assessments: [],
        },
        {
          id: "3",
          name: "Mohammed El Amrani",
          role: "BHV'er",
          department: "IT",
          overallScore: 74,
          skills: [
            {
              id: "bhv-basic",
              name: "BHV Basis",
              category: "Brandveiligheid",
              description: "Basis BHV vaardigheden en procedures",
              requiredLevel: "intermediate",
              currentLevel: "intermediate",
              lastAssessed: new Date("2023-11-15"),
              expiryDate: new Date("2024-08-30"),
              certificationRequired: true,
              trainingHours: 16,
            },
            {
              id: "tech-safety",
              name: "Technische Veiligheid",
              category: "Techniek",
              description: "Veiligheid bij technische installaties",
              requiredLevel: "intermediate",
              currentLevel: "advanced",
              lastAssessed: new Date("2024-01-08"),
              certificationRequired: false,
              trainingHours: 12,
            },
          ],
          assessments: [],
        },
      ])
    }
  }, [selectedCustomer])

  const getSkillLevelColor = (level: SkillLevel) => {
    switch (level) {
      case "beginner":
        return "bg-red-100 text-red-800"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "advanced":
        return "bg-blue-100 text-blue-800"
      case "expert":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSkillLevelText = (level: SkillLevel) => {
    switch (level) {
      case "beginner":
        return "Beginner"
      case "intermediate":
        return "Gevorderd"
      case "advanced":
        return "Expert"
      case "expert":
        return "Specialist"
      default:
        return "Onbekend"
    }
  }

  const getSkillProgress = (current: SkillLevel, required: SkillLevel) => {
    const levels = { beginner: 1, intermediate: 2, advanced: 3, expert: 4 }
    const currentScore = levels[current]
    const requiredScore = levels[required]
    return Math.min((currentScore / requiredScore) * 100, 100)
  }

  const isSkillExpiring = (skill: Skill) => {
    if (!skill.expiryDate) return false
    const daysUntilExpiry = Math.ceil((skill.expiryDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24))
    return daysUntilExpiry <= 90
  }

  const skillCategories = Array.from(new Set(users.flatMap((user) => user.skills.map((skill) => skill.category))))

  if (!selectedCustomer) {
    return (
      <div className="flex h-full items-center justify-center">
        <Card className="w-[450px]">
          <CardHeader>
            <CardTitle>Geen klant geselecteerd</CardTitle>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="container p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Skills Assessment & Tracking</h1>
          <p className="text-muted-foreground">Beheer en volg vaardigheden van BHV medewerkers</p>
        </div>
        <div className="flex space-x-2">
          <Button>
            <GraduationCap className="h-4 w-4 mr-2" />
            Nieuwe Assessment
          </Button>
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Rapport Genereren
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overzicht</TabsTrigger>
          <TabsTrigger value="individuals">Individueel</TabsTrigger>
          <TabsTrigger value="skills-matrix">Skills Matrix</TabsTrigger>
          <TabsTrigger value="training-plan">Training Plan</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Totaal Medewerkers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users.length}</div>
                <p className="text-xs text-muted-foreground">Geregistreerd in systeem</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Gemiddelde Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(users.reduce((acc, user) => acc + user.overallScore, 0) / users.length)}%
                </div>
                <p className="text-xs text-muted-foreground">Alle vaardigheden</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Verlopende Certificaten</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {users.flatMap((user) => user.skills).filter(isSkillExpiring).length}
                </div>
                <p className="text-xs text-muted-foreground">Binnen 90 dagen</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Training Uren</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {users.flatMap((user) => user.skills).reduce((acc, skill) => acc + skill.trainingHours, 0)}
                </div>
                <p className="text-xs text-muted-foreground">Totaal dit jaar</p>
              </CardContent>
            </Card>
          </div>

          {/* Skills Overview by Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Vaardigheden per Categorie</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {skillCategories.map((category) => {
                    const categorySkills = users.flatMap((user) =>
                      user.skills.filter((skill) => skill.category === category),
                    )
                    const avgLevel =
                      categorySkills.reduce((acc, skill) => {
                        const levels = { beginner: 1, intermediate: 2, advanced: 3, expert: 4 }
                        return acc + levels[skill.currentLevel]
                      }, 0) / categorySkills.length

                    return (
                      <div key={category} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{category}</span>
                          <Badge variant="outline">{categorySkills.length} skills</Badge>
                        </div>
                        <Progress value={(avgLevel / 4) * 100} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                          Gemiddeld niveau: {getSkillLevelText(Math.round(avgLevel) as SkillLevel)}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users
                    .sort((a, b) => b.overallScore - a.overallScore)
                    .slice(0, 5)
                    .map((user, index) => (
                      <div key={user.id} className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <Badge variant={index === 0 ? "default" : "outline"}>#{index + 1}</Badge>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.role}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-sm">{user.overallScore}%</p>
                          <div className="flex items-center space-x-1">
                            {index === 0 && <Award className="h-3 w-3 text-yellow-500" />}
                            <span className="text-xs text-muted-foreground">{user.skills.length} skills</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Expiring Certifications */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
                Verlopende Certificaten
              </CardTitle>
            </CardHeader>
            <CardContent>
              {users.flatMap((user) => user.skills.filter(isSkillExpiring)).length === 0 ? (
                <p className="text-center text-muted-foreground py-4">Geen verlopende certificaten</p>
              ) : (
                <div className="space-y-3">
                  {users.map((user) =>
                    user.skills.filter(isSkillExpiring).map((skill) => (
                      <div
                        key={`${user.id}-${skill.id}`}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-sm">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{skill.name}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="text-orange-600">
                            <Clock className="h-3 w-3 mr-1" />
                            {skill.expiryDate &&
                              Math.ceil((skill.expiryDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24))}{" "}
                            dagen
                          </Badge>
                        </div>
                      </div>
                    )),
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="individuals">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* User Selection */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Selecteer Medewerker</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedUser?.id === user.id ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedUser(user)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-sm">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.role}</p>
                          <p className="text-xs text-muted-foreground">{user.department}</p>
                        </div>
                        <div className="text-right">
                          <Badge className="bg-green-100 text-green-800">{user.overallScore}%</Badge>
                          <p className="text-xs text-muted-foreground mt-1">{user.skills.length} skills</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Individual Details */}
            <div className="lg:col-span-2">
              {selectedUser ? (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center">
                            <UserIcon className="h-5 w-5 mr-2" />
                            {selectedUser.name}
                          </CardTitle>
                          <p className="text-muted-foreground">
                            {selectedUser.role} - {selectedUser.department}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{selectedUser.overallScore}%</div>
                          <p className="text-sm text-muted-foreground">Overall Score</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600">
                            {selectedUser.skills.filter((s) => s.currentLevel === "expert").length}
                          </div>
                          <p className="text-sm text-muted-foreground">Expert Level</p>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600">
                            {selectedUser.skills.filter((s) => s.currentLevel === "advanced").length}
                          </div>
                          <p className="text-sm text-muted-foreground">Advanced Level</p>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-orange-600">
                            {selectedUser.skills.filter(isSkillExpiring).length}
                          </div>
                          <p className="text-sm text-muted-foreground">Expiring Soon</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Vaardigheden Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {selectedUser.skills.map((skill) => (
                          <div key={skill.id} className="p-4 border rounded-lg">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h3 className="font-medium">{skill.name}</h3>
                                <p className="text-sm text-muted-foreground">{skill.description}</p>
                                <Badge variant="outline" className="mt-1">
                                  {skill.category}
                                </Badge>
                              </div>
                              <div className="text-right">
                                <Badge className={getSkillLevelColor(skill.currentLevel)}>
                                  {getSkillLevelText(skill.currentLevel)}
                                </Badge>
                                {skill.certificationRequired && (
                                  <div className="flex items-center mt-1">
                                    <Award className="h-3 w-3 mr-1" />
                                    <span className="text-xs">Certificaat vereist</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Vereist niveau: {getSkillLevelText(skill.requiredLevel)}</span>
                                <span>Huidig niveau: {getSkillLevelText(skill.currentLevel)}</span>
                              </div>
                              <Progress value={getSkillProgress(skill.currentLevel, skill.requiredLevel)} />
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                              <div>
                                <span className="text-muted-foreground">Laatste assessment:</span>
                                <p>{skill.lastAssessed.toLocaleDateString()}</p>
                              </div>
                              {skill.expiryDate && (
                                <div>
                                  <span className="text-muted-foreground">Vervaldatum:</span>
                                  <p className={isSkillExpiring(skill) ? "text-orange-600 font-medium" : ""}>
                                    {skill.expiryDate.toLocaleDateString()}
                                  </p>
                                </div>
                              )}
                            </div>

                            <div className="flex space-x-2 mt-3">
                              <Button size="sm" variant="outline">
                                <GraduationCap className="h-3 w-3 mr-1" />
                                Nieuwe Assessment
                              </Button>
                              <Button size="sm" variant="outline">
                                <BookOpen className="h-3 w-3 mr-1" />
                                Training Plannen
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Selecteer een medewerker</h3>
                    <p className="text-muted-foreground">Kies een medewerker uit de lijst om details te bekijken</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="skills-matrix">
          <Card>
            <CardHeader>
              <CardTitle>Skills Matrix Overzicht</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-medium">Medewerker</th>
                      {skillCategories.map((category) => (
                        <th key={category} className="text-center p-2 font-medium min-w-32">
                          {category}
                        </th>
                      ))}
                      <th className="text-center p-2 font-medium">Overall</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="p-2">
                          <div>
                            <p className="font-medium text-sm">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.role}</p>
                          </div>
                        </td>
                        {skillCategories.map((category) => {
                          const categorySkills = user.skills.filter((skill) => skill.category === category)
                          const avgLevel = categorySkills.length
                            ? categorySkills.reduce((acc, skill) => {
                                const levels = { beginner: 1, intermediate: 2, advanced: 3, expert: 4 }
                                return acc + levels[skill.currentLevel]
                              }, 0) / categorySkills.length
                            : 0

                          return (
                            <td key={category} className="p-2 text-center">
                              {categorySkills.length > 0 ? (
                                <Badge className={getSkillLevelColor(Math.round(avgLevel) as SkillLevel)}>
                                  {getSkillLevelText(Math.round(avgLevel) as SkillLevel)}
                                </Badge>
                              ) : (
                                <span className="text-muted-foreground text-sm">-</span>
                              )}
                            </td>
                          )
                        })}
                        <td className="p-2 text-center">
                          <Badge className="bg-blue-100 text-blue-800">{user.overallScore}%</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training-plan">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Training Planning & Aanbevelingen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-3">Prioriteit Training</h3>
                    <div className="space-y-3">
                      {users
                        .flatMap((user) =>
                          user.skills
                            .filter((skill) => skill.currentLevel !== skill.requiredLevel || isSkillExpiring(skill))
                            .map((skill) => ({ user, skill })),
                        )
                        .sort((a, b) => {
                          const aExpiring = isSkillExpiring(a.skill) ? 1 : 0
                          const bExpiring = isSkillExpiring(b.skill) ? 1 : 0
                          return bExpiring - aExpiring
                        })
                        .slice(0, 5)
                        .map(({ user, skill }, index) => (
                          <div key={`${user.id}-${skill.id}`} className="p-3 border rounded-lg">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium text-sm">{user.name}</p>
                                <p className="text-sm text-muted-foreground">{skill.name}</p>
                                <div className="flex items-center space-x-2 mt-1">
                                  <Badge className={getSkillLevelColor(skill.currentLevel)}>
                                    {getSkillLevelText(skill.currentLevel)}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">→</span>
                                  <Badge className={getSkillLevelColor(skill.requiredLevel)}>
                                    {getSkillLevelText(skill.requiredLevel)}
                                  </Badge>
                                </div>
                              </div>
                              <div className="text-right">
                                {isSkillExpiring(skill) && (
                                  <Badge variant="outline" className="text-orange-600">
                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                    Urgent
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-3">Training Statistieken</h3>
                    <div className="space-y-4">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Geplande Trainingen</span>
                          <Badge variant="outline">12</Badge>
                        </div>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Voltooide Trainingen</span>
                          <Badge className="bg-green-100 text-green-800">8</Badge>
                        </div>
                      </div>
                      <div className="p-3 bg-orange-50 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Urgente Trainingen</span>
                          <Badge className="bg-orange-100 text-orange-800">3</Badge>
                        </div>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Totaal Training Uren</span>
                          <Badge className="bg-purple-100 text-purple-800">
                            {users.flatMap((user) => user.skills).reduce((acc, skill) => acc + skill.trainingHours, 0)}h
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Aanbevolen Training Acties</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border-l-4 border-red-500 bg-red-50">
                    <h4 className="font-medium text-red-800">Urgente Acties</h4>
                    <ul className="mt-2 space-y-1 text-sm text-red-700">
                      <li>• 3 BHV certificaten verlopen binnen 30 dagen</li>
                      <li>• EHBO training vereist voor 2 nieuwe medewerkers</li>
                      <li>• Ploegleider training voor Petra de Vries</li>
                    </ul>
                  </div>

                  <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50">
                    <h4 className="font-medium text-yellow-800">Aanbevelingen</h4>
                    <ul className="mt-2 space-y-1 text-sm text-yellow-700">
                      <li>• Opfriscursus communicatie voor 5 medewerkers</li>
                      <li>• Geavanceerde EHBO training voor coördinatoren</li>
                      <li>• Nieuwe technische veiligheid module beschikbaar</li>
                    </ul>
                  </div>

                  <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
                    <h4 className="font-medium text-blue-800">Toekomstige Planning</h4>
                    <ul className="mt-2 space-y-1 text-sm text-blue-700">
                      <li>• Jaarlijkse BHV dag plannen voor Q2</li>
                      <li>• VR training pilot opstarten</li>
                      <li>• Skills assessment herhalen in Q3</li>
                    </ul>
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
