"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Database,
  Shield,
  Zap,
  Monitor,
  Server,
  Eye,
  Rocket,
} from "lucide-react"
import { DeepInspectionService, type DeepInspectionReport } from "@/lib/system-health/deep-inspection"

const statusIcons = {
  healthy: CheckCircle,
  warning: AlertTriangle,
  critical: XCircle,
  unknown: RefreshCw,
}

const statusColors = {
  healthy: "text-green-600",
  warning: "text-yellow-600",
  critical: "text-red-600",
  unknown: "text-gray-600",
}

const componentIcons = {
  database: Database,
  authentication: Shield,
  api: Server,
  frontend: Monitor,
  security: Shield,
  performance: Zap,
  accessibility: Eye,
  deployment: Rocket,
}

export default function SystemHealthPage() {
  const [report, setReport] = useState<DeepInspectionReport | null>(null)
  const [loading, setLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<string>("")

  const inspectionService = new DeepInspectionService()

  const runInspection = async () => {
    setLoading(true)
    try {
      const newReport = await inspectionService.performFullInspection()
      setReport(newReport)
      setLastUpdate(new Date().toLocaleString("nl-NL"))
    } catch (error) {
      console.error("Inspection failed:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    runInspection()
  }, [])

  if (!report) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin" />
          <span className="ml-2">Systeem controle wordt uitgevoerd...</span>
        </div>
      </div>
    )
  }

  const StatusIcon = statusIcons[report.overallHealth]

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Systeem Gezondheid</h1>
          <p className="text-muted-foreground">Laatste controle: {lastUpdate}</p>
        </div>
        <Button onClick={runInspection} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Vernieuwen
        </Button>
      </div>

      {/* Overall Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <StatusIcon className={`h-6 w-6 ${statusColors[report.overallHealth]}`} />
            Algemene Gezondheid
            <Badge
              variant={
                report.overallHealth === "healthy"
                  ? "default"
                  : report.overallHealth === "warning"
                    ? "secondary"
                    : "destructive"
              }
            >
              {report.overallHealth === "healthy"
                ? "Gezond"
                : report.overallHealth === "warning"
                  ? "Waarschuwing"
                  : "Kritiek"}
            </Badge>
          </CardTitle>
          <CardDescription>Systeem score: {report.score}/100</CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={report.score} className="mb-4" />

          {report.criticalIssues.length > 0 && (
            <Alert variant="destructive" className="mb-4">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Kritieke Problemen Gevonden</AlertTitle>
              <AlertDescription>
                <ul className="list-disc list-inside mt-2">
                  {report.criticalIssues.slice(0, 3).map((issue, index) => (
                    <li key={index}>{issue}</li>
                  ))}
                  {report.criticalIssues.length > 3 && <li>... en {report.criticalIssues.length - 3} meer</li>}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {report.recommendations.length > 0 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Aanbevelingen</AlertTitle>
              <AlertDescription>
                <ul className="list-disc list-inside mt-2">
                  {report.recommendations.slice(0, 3).map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                  {report.recommendations.length > 3 && <li>... en {report.recommendations.length - 3} meer</li>}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Component Health */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Overzicht</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(report.components).map(([key, component]) => {
              const Icon = componentIcons[key as keyof typeof componentIcons]
              const StatusIcon = statusIcons[component.status]

              return (
                <Card key={key}>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Icon className="h-4 w-4" />
                      {component.component}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <StatusIcon className={`h-5 w-5 ${statusColors[component.status]}`} />
                      <span className="text-sm font-medium">
                        {component.status === "healthy"
                          ? "Gezond"
                          : component.status === "warning"
                            ? "Waarschuwing"
                            : component.status === "critical"
                              ? "Kritiek"
                              : "Onbekend"}
                      </span>
                    </div>
                    {component.issues.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {component.issues.length} probleem{component.issues.length !== 1 ? "en" : ""}
                      </p>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          {Object.entries(report.components).map(([key, component]) => {
            const Icon = componentIcons[key as keyof typeof componentIcons]
            const StatusIcon = statusIcons[component.status]

            return (
              <Card key={key}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon className="h-5 w-5" />
                    {component.component}
                    <StatusIcon className={`h-5 w-5 ${statusColors[component.status]}`} />
                  </CardTitle>
                  <CardDescription>
                    Laatste controle: {new Date(component.lastChecked).toLocaleString("nl-NL")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {component.issues.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm mb-2 text-red-600">Problemen:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {component.issues.map((issue, index) => (
                          <li key={index} className="text-red-600">
                            {issue}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {component.recommendations.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm mb-2 text-blue-600">Aanbevelingen:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {component.recommendations.map((rec, index) => (
                          <li key={index} className="text-blue-600">
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {component.issues.length === 0 && component.recommendations.length === 0 && (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm">Geen problemen gevonden</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Snelle Acties</CardTitle>
          <CardDescription>Veelgebruikte onderhoudstaken</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="justify-start">
              <Database className="h-4 w-4 mr-2" />
              Database Optimaliseren
            </Button>
            <Button variant="outline" className="justify-start">
              <Shield className="h-4 w-4 mr-2" />
              Security Scan
            </Button>
            <Button variant="outline" className="justify-start">
              <Zap className="h-4 w-4 mr-2" />
              Performance Test
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
