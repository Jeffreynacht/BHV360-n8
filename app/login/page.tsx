"use client"

import type React from "react"
import Link from "next/link"
import { Play } from "lucide-react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Shield, Users, UserCheck, Building, AlertTriangle, Eye, EyeOff, ArrowLeft, Home } from "lucide-react"

const demoAccounts = [
  {
    email: "ploegleider@demobedrijf.nl",
    password: "demo123",
    name: "Petra de Vries",
    role: "Ploegleider",
    description: "BHV team leiding, evacuatie coördinatie, incident response",
    icon: Shield,
    color: "bg-blue-500",
  },
  {
    email: "security@demobedrijf.nl",
    password: "demo123",
    name: "Sandra Beveiliging",
    role: "Security/Receptionist",
    description: "Bezoeker registratie, incident melding, toegangscontrole",
    icon: UserCheck,
    color: "bg-green-500",
  },
  {
    email: "coordinator@demobedrijf.nl",
    password: "demo123",
    name: "Jan Pietersen",
    role: "BHV Coördinator (Admin)",
    description: "Volledige BHV beheer, configuratie, rapportages",
    icon: Shield,
    color: "bg-purple-500",
  },
  {
    email: "medewerker@demobedrijf.nl",
    password: "demo123",
    name: "Lisa van der Berg",
    role: "Medewerker",
    description: "Basis toegang, eigen gegevens, noodprocedures",
    icon: Users,
    color: "bg-gray-500",
  },
  {
    email: "admin@demobedrijf.nl",
    password: "demo123",
    name: "Marie Janssen",
    role: "Customer Admin",
    description: "Klant beheer, gebruikers, instellingen",
    icon: Building,
    color: "bg-orange-500",
  },
]

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await login(email, password)
      if (!result.success) {
        setError(result.error || "Login failed")
      }
    } catch (err) {
      setError("Er is een fout opgetreden bij het inloggen")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = async (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail)
    setPassword(demoPassword)
    setIsLoading(true)
    setError("")

    try {
      const result = await login(demoEmail, demoPassword)
      if (!result.success) {
        setError(result.error || "Demo login failed")
      }
    } catch (err) {
      setError("Er is een fout opgetreden bij het demo inloggen")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToHome = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Full-width header with BHV360 logo */}
      <div className="w-full bg-gradient-to-r from-blue-600 to-green-600 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Back to Home Button */}
          <div className="flex justify-between items-center mb-4">
            <Button
              onClick={handleBackToHome}
              variant="ghost"
              className="text-white hover:bg-white/20 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <Home className="h-4 w-4" />
              Terug naar Home
            </Button>
            <Link href="/demo/overview">
              <Button variant="ghost" className="text-white hover:bg-white/20 flex items-center gap-2">
                <Play className="h-4 w-4" />
                Demo's Bekijken
              </Button>
            </Link>
          </div>

          <div className="flex justify-center">
            <div className="flex items-center space-x-2">
              <Shield className="h-12 w-12 text-white" />
              <span className="text-4xl font-bold text-white">BHV360</span>
            </div>
          </div>
          <div className="text-center mt-4">
            <h1 className="text-3xl font-bold text-white mb-2">Professioneel Veiligheidsmanagement Platform</h1>
            <p className="text-blue-100 text-lg">Complete BHV oplossing voor moderne organisaties</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Login Form */}
          <div className="flex items-center justify-center">
            <Card className="w-full max-w-md shadow-xl">
              <CardHeader className="text-center space-y-4">
                <div>
                  <CardTitle className="text-2xl">Welkom terug</CardTitle>
                  <CardDescription>Log in op uw BHV360 account</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mailadres</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="naam@bedrijf.nl"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Wachtwoord</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Uw wachtwoord"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Inloggen..." : "Inloggen"}
                  </Button>
                </form>

                <div className="text-center">
                  <Button variant="link" className="text-sm">
                    Wachtwoord vergeten?
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Demo Accounts */}
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Demo Accounts</h2>
              <p className="text-muted-foreground">Probeer BHV360 met verschillende gebruikersrollen</p>
            </div>

            <div className="space-y-4">
              {demoAccounts.map((account, index) => (
                <Card
                  key={index}
                  className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-blue-500"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${account.color} text-white`}>
                        <account.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold">{account.name}</h3>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {account.role}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{account.description}</p>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <span>📧 {account.email}</span>
                          <span>•</span>
                          <span>🔑 {account.password}</span>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleDemoLogin(account.email, account.password)}
                        disabled={isLoading}
                        size="sm"
                        className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                      >
                        {isLoading ? "..." : "Login"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center text-sm text-muted-foreground bg-blue-50 p-4 rounded-lg">
              <p className="font-medium text-blue-800 mb-2">💡 BHV360 Platform Features</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>✅ Real-time monitoring</div>
                <div>✅ Incident management</div>
                <div>✅ NFC integratie</div>
                <div>✅ Compliance rapportage</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-8 text-sm text-muted-foreground border-t">
        <p>© 2025 BHV360 - Professioneel Veiligheidsmanagement Platform</p>
        <p className="mt-1">Powered by innovative blue-green safety technology</p>
        <div className="mt-3 space-y-1">
          <p>
            📧{" "}
            <a href="mailto:info@BHV360.nl" className="text-blue-600 hover:underline">
              info@BHV360.nl
            </a>{" "}
            | 🛠️{" "}
            <a href="mailto:support@BHV360.nl" className="text-blue-600 hover:underline">
              support@BHV360.nl
            </a>
          </p>
          <p className="text-xs">Voor vragen, ondersteuning of meer informatie over BHV360</p>
        </div>
      </div>
    </div>
  )
}
