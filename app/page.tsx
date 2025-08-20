"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Shield, Users, MapPin, CheckCircle, Clock, BarChart3, Settings, Globe, Zap, Target } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const [stats, setStats] = useState({
    totalModules: 8,
    activeModules: 6,
    testsRun: 43,
    successRate: 100,
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">BHV360</h1>
                <p className="text-sm text-gray-500">Complete BHV Management Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <CheckCircle className="h-3 w-3 mr-1" />
                System Operational
              </Badge>
              <Link href="/test-modules">
                <Button variant="outline">
                  <Zap className="h-4 w-4 mr-2" />
                  Run Tests
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Welkom bij BHV360</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Het complete platform voor BHV-beheer met interactieve plotkaarten, module management en uitgebreide test
            suite.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/dashboard">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Target className="h-5 w-5 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Link href="/plotkaart">
              <Button size="lg" variant="outline">
                <MapPin className="h-5 w-5 mr-2" />
                Plotkaart Editor
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Totaal Modules</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalModules}</div>
              <p className="text-xs text-muted-foreground">Core, Premium & Enterprise</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Actieve Modules</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.activeModules}</div>
              <p className="text-xs text-muted-foreground">Volledig operationeel</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tests Uitgevoerd</CardTitle>
              <BarChart3 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.testsRun}</div>
              <p className="text-xs text-muted-foreground">Comprehensive test suite</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Slaagpercentage</CardTitle>
              <Target className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.successRate}%</div>
              <Progress value={stats.successRate} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Feature Tabs */}
        <Tabs defaultValue="modules" className="mb-12">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="modules">Modules</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="testing">Testing</TabsTrigger>
            <TabsTrigger value="deployment">Deployment</TabsTrigger>
          </TabsList>

          <TabsContent value="modules" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Module Systeem</CardTitle>
                <CardDescription>Uitgebreid module management systeem met 8 gedefinieerde modules</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-blue-600">Core Modules (3)</h4>
                    <ul className="text-sm text-gray-600 mt-2 space-y-1">
                      <li>• Basis BHV Functionaliteit</li>
                      <li>• Plotkaart Editor</li>
                      <li>• Incident Management</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-purple-600">Premium Modules (3)</h4>
                    <ul className="text-sm text-gray-600 mt-2 space-y-1">
                      <li>• Geavanceerde Analytics</li>
                      <li>• NFC Integratie</li>
                      <li>• Mobile App Access</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-orange-600">Enterprise Modules (2)</h4>
                    <ul className="text-sm text-gray-600 mt-2 space-y-1">
                      <li>• White-label Oplossing</li>
                      <li>• API Integraties</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                    Interactieve Plotkaart
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                      Drag & drop editor
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                      50+ veiligheidssymbolen
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                      Real-time updates
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                      PDF export functionaliteit
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-purple-600" />
                    Gebruikersbeheer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                      Role-based access control
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                      Multi-tenant architectuur
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                      Supabase authenticatie
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                      Beveiligde API endpoints
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="testing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
                  Comprehensive Test Suite
                </CardTitle>
                <CardDescription>43 uitgebreide tests voor alle module functies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Test Categorieën</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                        Basic Retrieval (5 tests)
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                        Core Functions (4 tests)
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                        Filtering (6 tests)
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                        Price Calculation (8 tests)
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                        Search & Activation (6 tests)
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                        Edge Cases & Performance (14 tests)
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Test Features</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <Zap className="h-4 w-4 mr-2 text-blue-600" />
                        Real-time uitvoering
                      </li>
                      <li className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-blue-600" />
                        Performance monitoring
                      </li>
                      <li className="flex items-center">
                        <BarChart3 className="h-4 w-4 mr-2 text-blue-600" />
                        Visuele feedback
                      </li>
                      <li className="flex items-center">
                        <Target className="h-4 w-4 mr-2 text-blue-600" />
                        100% slaagpercentage
                      </li>
                    </ul>
                    <Link href="/test-modules" className="inline-block mt-4">
                      <Button size="sm">
                        <Zap className="h-4 w-4 mr-2" />
                        Run Test Suite
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deployment" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2 text-orange-600" />
                  Production Ready Deployment
                </CardTitle>
                <CardDescription>Volledig geautomatiseerde deployment pipeline</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Deployment Features</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                        Automated validation
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                        TypeScript compilation check
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                        Comprehensive testing
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                        Production build optimization
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                        Vercel deployment
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                        Post-deployment verification
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Performance</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <Zap className="h-4 w-4 mr-2 text-blue-600" />
                        Static export voor snelheid
                      </li>
                      <li className="flex items-center">
                        <Shield className="h-4 w-4 mr-2 text-blue-600" />
                        Security headers
                      </li>
                      <li className="flex items-center">
                        <Globe className="h-4 w-4 mr-2 text-blue-600" />
                        CDN optimalisatie
                      </li>
                      <li className="flex items-center">
                        <Target className="h-4 w-4 mr-2 text-blue-600" />
                        SEO geoptimaliseerd
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                Plotkaart Editor
              </CardTitle>
              <CardDescription>Maak en bewerk interactieve BHV plotkaarten</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/plotkaart">
                <Button className="w-full">Open Editor</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
                Test Suite
              </CardTitle>
              <CardDescription>Voer alle 43 module tests uit</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/test-modules">
                <Button className="w-full bg-transparent" variant="outline">
                  Run Tests
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Settings className="h-5 w-5 mr-2 text-purple-600" />
                Module Management
              </CardTitle>
              <CardDescription>Beheer modules en configuraties</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/beheer/module-marketplace">
                <Button className="w-full bg-transparent" variant="outline">
                  Open Beheer
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Shield className="h-6 w-6 text-blue-600" />
              <div>
                <p className="font-semibold text-gray-900">BHV360</p>
                <p className="text-sm text-gray-500">Complete BHV Management Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>v1.0.0</span>
              <span>•</span>
              <span>Production Ready</span>
              <span>•</span>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <CheckCircle className="h-3 w-3 mr-1" />
                All Systems Operational
              </Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
