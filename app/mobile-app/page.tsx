"use client"

import { ArrowLeft, Activity, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button, Badge } from "@/components/ui"

const MobileAppPage = () => {
  const router = useRouter()

  return (
    <>
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => router.push("/")} className="p-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Mobiele App Demo</h1>
                <p className="text-gray-600">Complete mobiele ervaring voor BHV'ers en medewerkers</p>
              </div>
            </div>
            <Badge className="bg-blue-100 text-blue-800 px-3 py-1">
              <Activity className="h-4 w-4 mr-1" />
              Live Demo
            </Badge>
          </div>
        </div>
      </div>

      {/* Demo Info */}
      <div className="mt-8 bg-green-50 rounded-lg p-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-green-900 mb-2">Demo Functionaliteiten</h3>
          <p className="text-green-700 mb-4">
            Dit is een interactieve demo van de BHV360 Mobiele App. In de volledige versie kunt u:
          </p>
          <div className="grid md:grid-cols-2 gap-4 text-left">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Native iOS & Android apps</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Offline functionaliteit</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Real-time push notificaties</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">QR code scanning</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">GPS locatie tracking</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Biometrische authenticatie</span>
              </div>
            </div>
          </div>
          <div className="mt-6 space-x-4">
            <Button onClick={() => router.push("/")} variant="outline">
              Terug naar Homepage
            </Button>
            <Button onClick={() => router.push("/login")} className="bg-green-600 hover:bg-green-700">
              Start Gratis Trial
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default MobileAppPage
