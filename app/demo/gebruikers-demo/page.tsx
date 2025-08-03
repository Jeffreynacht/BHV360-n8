"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Users, Search, Filter, UserPlus, Shield, Calendar, Phone, Mail, MapPin, Award } from "lucide-react"
import Link from "next/link"

export default function GebruikersDemoPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")

  const users = [
    {
      id: 1,
      name: "Jeffrey Nachtegaal",
      email: "jeffrey@provincie-nb.nl",
      phone: "+31 6 1234 5678",
      role: "super-admin",
      department: "Veiligheid & Beveiliging",
      location: "Gebouw A - Verdieping 2",
      certifications: ["BHV Basis", "BHV Coördinator", "EHBO"],
      certificationExpiry: "2024-12-15",
      lastActive: "2 minuten geleden",
      status: "online",
    },
    {
      id: 2,
      name: "Maria van der Berg",
      email: "maria@demobedrijf.nl",
      phone: "+31 6 2345 6789",
      role: "bhv-coordinator",
      department: "Facilitair",
      location: "Gebouw B - Verdieping 1",
      certifications: ["BHV Basis", "EHBO"],
      certificationExpiry: "2024-11-20",
      lastActive: "5 minuten geleden",
      status: "online",
    },
    {
      id: 3,
      name: "Pieter Janssen",
      email: "pieter@demobedrijf.nl",
      phone: "+31 6 3456 7890",
      role: "bhv-member",
      department: "IT",
      location: "Gebouw A - Verdieping 3",
      certifications: ["BHV Basis"],
      certificationExpiry: "2025-01-10",
      lastActive: "1 uur geleden",
      status: "away",
    },
    {
      id: 4,
      name: "Lisa de Vries",
      email: "lisa@demobedrijf.nl",
      phone: "+31 6 4567 8901",
      role: "ehbo-member",
      department: "HR",
      location: "Gebouw C - Begane grond",
      certifications: ["EHBO", "AED"],
      certificationExpiry: "2024-10-30",
      lastActive: "30 minuten geleden",
      status: "online",
    },
    {
      id: 5,
      name: "Tom Bakker",
      email: "tom@demobedrijf.nl",
      phone: "+31 6 5678 9012",
      role: "employee",
      department: "Marketing",
      location: "Gebouw B - Verdieping 2",
      certifications: [],
      certificationExpiry: null,
      lastActive: "2 uur geleden",
      status: "offline",
    },
  ]

  const roles = [
    { value: "super-admin", label: "Super Admin", color: "bg-purple-100 text-purple-800" },
    { value: "bhv-coordinator", label: "BHV Coördinator", color: "bg-red-100 text-red-800" },
    { value: "bhv-member", label: "BHV-er", color: "bg-orange-100 text-orange-800" },
    { value: "ehbo-member", label: "EHBO-er", color: "bg-green-100 text-green-800" },
    { value: "employee", label: "Medewerker", color: "bg-gray-100 text-gray-800" },
  ]

  const getRoleInfo = (roleValue: string) => {
    return roles.find((role) => role.value === roleValue) || roles[roles.length - 1]
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "away":
        return "bg-yellow-500"
      case "offline":
        return "bg-gray-400"
      default:
        return "bg-gray-400"
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  const stats = {
    total: users.length,
    online: users.filter((u) => u.status === "online").length,
    bhvMembers: users.filter((u) => u.role.includes("bhv")).length,
    certificationExpiring: users.filter(
      (u) => u.certificationExpiry && new Date(u.certificationExpiry) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    ).length,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
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
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                👥 Gebruikersbeheer Demo
              </Badge>
              <h1 className="text-xl font-bold text-gray-900">Gebruikers & Rollen</h1>
            </div>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Nieuwe Gebruiker
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-600">Totaal Gebruikers</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 bg-green-500 rounded-full mx-auto mb-2"></div>
              <div className="text-2xl font-bold text-green-600">{stats.online}</div>
              <div className="text-sm text-gray-600">Online Nu</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Shield className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-600">{stats.bhvMembers}</div>
              <div className="text-sm text-gray-600">BHV Leden</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Calendar className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-600">{stats.certificationExpiring}</div>
              <div className="text-sm text-gray-600">Cert. Verloopt</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Zoek gebruikers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger>
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter op rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle rollen</SelectItem>
                    {roles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle>Gebruikers Overzicht</CardTitle>
            <CardDescription>
              {filteredUsers.length} van {users.length} gebruikers weergegeven
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredUsers.map((user) => {
                const roleInfo = getRoleInfo(user.role)
                return (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="h-6 w-6 text-blue-600" />
                        </div>
                        <div
                          className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(user.status)} rounded-full border-2 border-white`}
                        ></div>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-600 flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {user.email}
                        </div>
                        <div className="text-sm text-gray-600 flex items-center mt-1">
                          <Phone className="h-3 w-3 mr-1" />
                          {user.phone}
                        </div>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <div className="flex items-center justify-end space-x-2">
                        <Badge className={roleInfo.color}>{roleInfo.label}</Badge>
                      </div>
                      <div className="text-xs text-gray-500">
                        <div className="flex items-center justify-end">
                          <MapPin className="h-3 w-3 mr-1" />
                          {user.location}
                        </div>
                        <div className="mt-1">Laatst actief: {user.lastActive}</div>
                      </div>
                      {user.certifications.length > 0 && (
                        <div className="flex flex-wrap gap-1 justify-end">
                          {user.certifications.map((cert, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              <Award className="h-2 w-2 mr-1" />
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      )}
                      {user.certificationExpiry && (
                        <div className="text-xs text-orange-600">
                          Cert. verloopt: {new Date(user.certificationExpiry).toLocaleDateString("nl-NL")}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Demo Actions */}
        <div className="mt-8 text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">🎮 Demo Functies</h3>
            <p className="text-blue-700 mb-4">
              Deze demo toont het gebruikersbeheer systeem van BHV360. In de echte applicatie kunt u gebruikers
              toevoegen, rollen toewijzen, certificeringen beheren en real-time status volgen.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/demo/multi-locatie">
                <Button variant="outline">
                  <MapPin className="mr-2 h-4 w-4" />
                  Multi-locatie Demo
                </Button>
              </Link>
              <Link href="/demo/ehbo-monitoring">
                <Button variant="outline">
                  <Award className="mr-2 h-4 w-4" />
                  EHBO Monitoring
                </Button>
              </Link>
              <Link href="/login">
                <Button>
                  <Users className="mr-2 h-4 w-4" />
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
