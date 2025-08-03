"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Shield,
  Users,
  CheckCircle,
  AlertTriangle,
  Clock,
  ArrowLeft,
  RefreshCw,
  MapPin,
  Phone,
  Calendar,
} from "lucide-react"
import Link from "next/link"

export default function BHVStatusDemoPage() {
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  const bhvMembers = [
    {
      name: "Jeffrey Nachtegaal",
      role: "Hoofdcoördinator BHV",
      status: "available",
      location: "Gebouw A - Verdieping 2",
      phone: "+31 6 1234 5678",
      certificationExpiry: "2024-12-15",
      lastSeen: "2 minuten geleden",
    },
    {
      name: "Maria van der Berg",
      role: "BHV-er",
      status: "available",
      location: "Gebouw B - Verdieping 1",
      phone: "+31 6 2345 6789",
      certificationExpiry: "2024-11-20",
      lastSeen: "5 minuten geleden",
    },
    {
      name: "Pieter Janssen",
      role: "BHV-er",
      status: "busy",
      location: "Gebouw A - Verdieping 3",
      phone: "+31 6 3456 7890",
      certificationExpiry: "2025-01-10",
      lastSeen: "1 minuut geleden",
    },
    {
      name: "Lisa de Vries",
      role: "EHBO-er",
      status: "available",
      location: "Gebouw C - Begane grond",
      phone: "+31 6 4567 8901",
      certificationExpiry: "2024-10-30",
      lastSeen: "3 minuten geleden",
    },
    {
      name: "Tom Bakker",
      role: "BHV-er",
      status: "offline",
      location: "Onbekend",
      phone: "+31 6 5678 9012",
      certificationExpiry: "2025-02-14",
      lastSeen: "2 uur geleden",
    },
  ]

  const stats = {
    totalBHV: 12,
    available: 8,
    busy: 2,
    offline: 2,
    certificationExpiring: 3,
  }

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
      setLastUpdate(new Date())
    }, 1500)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "text-green-600 bg-green-100"
      case "busy":
        return "text-yellow-600 bg-yellow-100"
      case "offline":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "available":
        return "Beschikbaar"
      case "busy":
        return "Bezet"
      case "offline":
        return "Offline"
      default:
        return "Onbekend"
    }
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
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                🟢 Live Demo
              </Badge>
              <h1 className="text-xl font-bold text-gray-900">BHV Status Dashboard</h1>
            </div>
            <Button onClick={handleRefresh} disabled={refreshing} variant="outline">
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
              Ververs
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stats.totalBHV}</div>
              <div className="text-sm text-gray-600">Totaal BHV-ers</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{stats.available}</div>
              <div className="text-sm text-gray-600">Beschikbaar</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-600">{stats.busy}</div>
              <div className="text-sm text-gray-600">Bezet</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-600">{stats.offline}</div>
              <div className="text-sm text-gray-600">Offline</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Calendar className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-600">{stats.certificationExpiring}</div>
              <div className="text-sm text-gray-600">Cert. verloopt</div>
            </CardContent>
          </Card>
        </div>

        {/* Availability Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2 text-blue-600" />
              BHV Beschikbaarheid
            </CardTitle>
            <CardDescription>Real-time overzicht van BHV beschikbaarheid</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Beschikbare BHV-ers</span>
                  <span>
                    {stats.available} van {stats.totalBHV} ({Math.round((stats.available / stats.totalBHV) * 100)}%)
                  </span>
                </div>
                <Progress value={(stats.available / stats.totalBHV) * 100} className="h-3" />
              </div>
              <div className="text-sm text-gray-600">Laatste update: {lastUpdate.toLocaleTimeString("nl-NL")}</div>
            </div>
          </CardContent>
        </Card>

        {/* BHV Members List */}
        <Card>
          <CardHeader>
            <CardTitle>BHV Team Status</CardTitle>
            <CardDescription>Overzicht van alle BHV-ers en hun huidige status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bhvMembers.map((member, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{member.name}</div>
                      <div className="text-sm text-gray-600">{member.role}</div>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {member.location}
                      </div>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <Badge className={getStatusColor(member.status)}>{getStatusText(member.status)}</Badge>
                    <div className="text-xs text-gray-500">
                      <div className="flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        {member.phone}
                      </div>
                      <div className="mt-1">Laatst gezien: {member.lastSeen}</div>
                      <div className="mt-1">
                        Cert. verloopt: {new Date(member.certificationExpiry).toLocaleDateString("nl-NL")}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Demo Actions */}
        <div className="mt-8 text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">🎮 Demo Functies</h3>
            <p className="text-blue-700 mb-4">
              Dit is een interactieve demo. In de echte applicatie worden deze gegevens real-time bijgewerkt via GPS,
              NFC tags en handmatige check-ins.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/demo/plotkaart-editor">
                <Button variant="outline">
                  <MapPin className="mr-2 h-4 w-4" />
                  Bekijk Plotkaart
                </Button>
              </Link>
              <Link href="/demo/incident-simulator">
                <Button variant="outline">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Simuleer Incident
                </Button>
              </Link>
              <Link href="/login">
                <Button>
                  <Shield className="mr-2 h-4 w-4" />
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
