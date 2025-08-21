"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Shield, MapPin, Users, AlertTriangle, CheckCircle, Phone, Mail, Building, Clock, ArrowRight, Play, Smartphone, Globe, BarChart3, Eye, LogIn, Zap, Map, Server, Lock, Menu, X } from 'lucide-react'

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Form submitted:", formData)
    alert("Bedankt voor uw interesse! We nemen binnen 24 uur contact met u op.")
    setFormData({ name: "", email: "", company: "", phone: "", message: "" })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Image
                src="/images/bhv360-logo-full.png"
                alt="BHV360 Logo"
                width={200}
                height={60}
                className="h-10 w-auto"
                priority
              />
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-gray-600 hover:text-green-600 transition-colors">
                Functionaliteiten
              </Link>
              <Link href="#pricing" className="text-gray-600 hover:text-green-600 transition-colors">
                Prijzen
              </Link>
              <Link href="#contact" className="text-gray-600 hover:text-green-600 transition-colors">
                Contact
              </Link>
              <Link href="/demo" className="text-gray-600 hover:text-green-600 transition-colors">
                Demo
              </Link>
              <Link href="/login">
                <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 bg-transparent">
                  <LogIn className="w-4 h-4 mr-2" />
                  Inloggen
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90 text-white">
                  Gratis Proberen
                </Button>
              </Link>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-gray-900 focus:outline-none focus:text-gray-900"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <Link
                href="#features"
                className="text-gray-600 hover:text-green-600 block px-3 py-2 text-base font-medium"
              >
                Functionaliteiten
              </Link>
              <Link href="#pricing" className="text-gray-600 hover:text-green-600 block px-3 py-2 text-base font-medium">
                Prijzen
              </Link>
              <Link href="#contact" className="text-gray-600 hover:text-green-600 block px-3 py-2 text-base font-medium">
                Contact
              </Link>
              <Link href="/demo" className="text-gray-600 hover:text-green-600 block px-3 py-2 text-base font-medium">
                Demo
              </Link>
              <div className="flex flex-col space-y-2 px-3 pt-2">
                <Link href="/login">
                  <Button variant="outline" size="sm" className="w-full border-green-600 text-green-600 hover:bg-green-50 bg-transparent">
                    <LogIn className="w-4 h-4 mr-2" />
                    Inloggen
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    size="sm"
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90 text-white"
                  >
                    Gratis Proberen
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 via-blue-50 to-blue-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-green-100 text-green-800 border-green-200">
                🚀 Nieuw: Volledig geautomatiseerde compliance rapportage
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                Professioneel
                <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent block">
                  BHV Beheer
                </span>
                voor Moderne Organisaties
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Complete BHV management oplossing met interactieve plattegronden, incident tracking, en compliance
                monitoring. Van papieren chaos naar digitale controle.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90 text-white text-lg px-8 py-3 shadow-lg"
                  >
                    <Play className="mr-2 h-5 w-5" />
                    30 Dagen Gratis
                  </Button>
                </Link>
                <Link href="/demo">
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-8 py-3 border-2 border-green-500 text-green-700 hover:bg-green-50 bg-white"
                  >
                    <Eye className="mr-2 h-5 w-5" />
                    Bekijk Demo
                  </Button>
                </Link>
              </div>
              <div className="mt-8 flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  30 dagen gratis
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Geen setup kosten
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Nederlandse ondersteuning
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <Image
                  src="/placeholder.svg?height=400&width=600&text=BHV360+Dashboard+Preview"
                  alt="BHV360 Dashboard"
                  width={600}
                  height={400}
                  className="rounded-lg"
                />
              </div>
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                Live Demo
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center shadow-lg border-0 bg-gradient-to-br from-green-50 to-blue-50 hover:from-green-100 hover:to-blue-100 transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <Building className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">2024</div>
                <div className="text-sm text-gray-600">Opgericht</div>
              </CardContent>
            </Card>
            <Card className="text-center shadow-lg border-0 bg-gradient-to-br from-green-50 to-blue-50 hover:from-green-100 hover:to-blue-100 transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">100%</div>
                <div className="text-sm text-gray-600">Nederlandse Ontwikkeling</div>
              </CardContent>
            </Card>
            <Card className="text-center shadow-lg border-0 bg-gradient-to-br from-green-50 to-blue-50 hover:from-green-100 hover:to-blue-100 transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <Server className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">99.9%</div>
                <div className="text-sm text-gray-600">Systeem Beschikbaarheid</div>
              </CardContent>
            </Card>
            <Card className="text-center shadow-lg border-0 bg-gradient-to-br from-green-50 to-blue-50 hover:from-green-100 hover:to-blue-100 transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">GDPR</div>
                <div className="text-sm text-gray-600">Compliant</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Alles wat u nodig heeft voor
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                {" "}
                professioneel BHV beheer
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Van interactieve plattegronden tot geavanceerde analytics - BHV360 biedt alle tools die moderne
              organisaties nodig hebben.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Core Features */}
            <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-0 hover:from-green-100 hover:to-blue-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <Map className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-900">Interactieve Plotkaarten</CardTitle>
                <CardDescription className="text-gray-600">
                  Professionele BHV plotkaarten met 50+ veiligheidssymbolen en real-time updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Drag & drop editor</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Real-time updates</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">PDF export</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Mobile responsive</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-0 hover:from-green-100 hover:to-blue-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <AlertTriangle className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-900">Incident Management</CardTitle>
                <CardDescription className="text-gray-600">
                  Complete incident tracking en rapportage in real-time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Automatische notificaties</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Foto's en documenten</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Workflow management</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Compliance rapportages</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-0 hover:from-green-100 hover:to-blue-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-900">Team Coördinatie</CardTitle>
                <CardDescription className="text-gray-600">Beheer je BHV team en hun certificeringen</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Certificaat tracking</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Training planning</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Rol toewijzing</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Aanwezigheid monitoring</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-0 hover:from-green-100 hover:to-blue-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <Smartphone className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-900">Mobile App</CardTitle>
                <CardDescription className="text-gray-600">Native iOS en Android apps voor onderweg</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Offline functionaliteit</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Push notificaties</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">QR code scanning</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">GPS locatie</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-0 hover:from-green-100 hover:to-blue-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-900">Analytics & Rapportage</CardTitle>
                <CardDescription className="text-gray-600">
                  Uitgebreide inzichten in je veiligheidsprestaties
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Custom dashboards</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Geautomatiseerde rapporten</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Trend analyse</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">KPI monitoring</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-0 hover:from-green-100 hover:to-blue-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-900">NFC Integratie</CardTitle>
                <CardDescription className="text-gray-600">Moderne technologie voor equipment tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">NFC tag scanning</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Onderhoudsschema's</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Asset management</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Inspectie workflows</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Transparante
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                {" "}
                prijzen
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Kies het plan dat het beste bij jouw organisatie past. Start vandaag nog met 30 dagen gratis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Starter Plan */}
            <Card className="relative border-2 border-gray-200 hover:border-green-300 transition-colors bg-white hover:shadow-lg">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl text-gray-900">Starter</CardTitle>
                <CardDescription className="text-gray-600">
                  Perfect voor kleine bedrijven tot 50 medewerkers
                </CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">€49</span>
                  <span className="text-gray-600">/maand</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Basis plotkaart editor</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Tot 5 BHV'ers</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Incident registratie</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Email ondersteuning</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Basis rapportages</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Mobile app toegang</span>
                  </li>
                </ul>
                <Link href="/register?plan=starter">
                  <Button
                    className="w-full border-2 border-green-500 text-green-700 hover:bg-green-50 bg-white"
                    variant="outline"
                  >
                    Start Nu
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Professional Plan */}
            <Card className="relative border-2 border-green-500 hover:border-green-600 transition-colors bg-white hover:shadow-xl scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-1">
                  Meest Gekozen
                </Badge>
              </div>
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl text-gray-900">Professional</CardTitle>
                <CardDescription className="text-gray-600">
                  Ideaal voor middelgrote bedrijven tot 200 medewerkers
                </CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">€149</span>
                  <span className="text-gray-600">/maand</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Volledige plotkaart suite</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Onbeperkt BHV'ers</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Geavanceerd incident management</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">NFC tag integratie</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Uitgebreide analytics</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Telefoon ondersteuning (ma-vr 9-17)</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Automatische rapportages</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">API toegang</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Bezoekersregistratie</span>
                  </li>
                </ul>
                <Link href="/register?plan=professional">
                  <Button className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white hover:opacity-90">
                    Meest Gekozen
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="relative border-2 border-gray-200 hover:border-green-300 transition-colors bg-white hover:shadow-lg">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl text-gray-900">Enterprise</CardTitle>
                <CardDescription className="text-gray-600">
                  Voor grote organisaties met complexe behoeften
                </CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">Op maat</span>
                  <span className="text-gray-600">/maand</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Alle Professional features</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">White label oplossing</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Multi-locatie ondersteuning</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Dedicated account manager</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Custom integraties</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">24/7 Priority support</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">On-premise deployment optie</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Advanced security features</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Compliance rapportages</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Training & consultancy</span>
                  </li>
                </ul>
                <Link href="/contact?plan=enterprise">
                  <Button
                    className="w-full border-2 border-green-500 text-green-700 hover:bg-green-50 bg-white"
                    variant="outline"
                  >
                    Offerte Aanvragen
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Alle plannen bevatten:</p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                30 dagen gratis trial
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Geen setup kosten
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Maandelijks opzegbaar
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                GDPR compliant
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-500 to-blue-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-4">Klaar om te starten met modern BHV management?</h2>
          <p className="text-xl text-green-100 mb-8">
            Vervang je papieren administratie door een professioneel digitaal platform. Probeer BHV360 vandaag nog 30
            dagen gratis uit.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-white text-green-600 hover:bg-gray-50 px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Play className="w-5 h-5 mr-2" />
                30 Dagen Gratis Proberen
              </Button>
            </Link>
            <Link href="/demo">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 text-lg transition-all duration-300 bg-transparent"
              >
                <Eye className="w-5 h-5 mr-2" />
                Bekijk Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">Klaar om te starten met BHV360?</h2>
              <p className="text-xl text-gray-600 mb-8">
                Neem contact met ons op voor een persoonlijke demo of start direct met uw gratis trial.
              </p>

              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <Phone className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Telefoon</div>
                    <div className="text-gray-600">033 461 6303</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <Mail className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Email</div>
                    <div className="text-gray-600">info@bhv360.nl</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <MapPin className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Adres</div>
                    <div className="text-gray-600">
                      Fokkerstraat 16
                      <br />
                      3833 LD Leusden
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <Clock className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Openingstijden</div>
                    <div className="text-gray-600">
                      Ma-Vr: 09:00 - 17:00
                      <br />
                      Nederlandse ondersteuning
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900">Vraag een demo aan</CardTitle>
                <CardDescription className="text-gray-600">
                  Vul het formulier in en we nemen binnen 24 uur contact met u op voor een persoonlijke demo.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-gray-700">
                        Naam *
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="bg-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-gray-700">
                        Email *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="company" className="text-gray-700">
                        Bedrijf *
                      </Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        required
                        className="bg-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-gray-700">
                        Telefoon
                      </Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-gray-700">
                      Bericht
                    </Label>
                    <Textarea
                      id="message"
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Vertel ons over uw organisatie en BHV behoeften..."
                      className="bg-white"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90 text-white"
                  >
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Vraag Demo Aan
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Image
                src="/images/bhv360-logo-full.png"
                alt="BHV360 Logo"
                width={160}
                height={40}
                className="h-8 w-auto mb-4 filter brightness-0 invert"
              />
              <p className="text-gray-400 mb-4">Professioneel BHV management platform voor Nederlandse organisaties.</p>
              <div className="flex space-x-4">
                <Badge variant="outline" className="border-gray-600 text-gray-400">
                  <Shield className="w-3 h-3 mr-1" />
                  GDPR
                </Badge>
                <Badge variant="outline" className="border-gray-600 text-gray-400">
                  <Globe className="w-3 h-3 mr-1" />
                  NL Hosting
                </Badge>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#features" className="hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/demo" className="hover:text-white transition-colors">
                    Demo
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-white transition-colors">
                    Prijzen
                  </Link>
                </li>
                <li>
                  <span className="text-gray-500">30 dagen gratis</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/video-tutorials" className="hover:text-white transition-colors">
                    Video Tutorials
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <span className="text-gray-400">Ma-Vr 09:00-17:00</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <div className="space-y-3 text-gray-400">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-3" />
                  <a href="tel:0334616303" className="hover:text-white transition-colors">
                    033 461 6303
                  </a>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-3" />
                  <a href="mailto:info@bhv360.nl" className="hover:text-white transition-colors">
                    info@bhv360.nl
                  </a>
                </div>
                <div className="flex items-start">
                  <MapPin className="w-4 h-4 mr-3 mt-1" />
                  <span>
                    Fokkerstraat 16
                    <br />
                    3833 LD Leusden
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-3" />
                  <span>Ma-Vr 09:00-17:00</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">&copy; 2024 BHV360. Alle rechten voorbehouden.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
