"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Database, CheckCircle, XCircle, AlertCircle, Loader2, Play, RefreshCw } from "lucide-react"

interface TestResult {
  name: string
  status: "success" | "error" | "warning" | "pending"
  message: string
  details?: string
  duration?: number
}

interface TestResults {
  environment: TestResult[]
  database: TestResult[]
  additional: TestResult[]
  recommendations: string[]
}

export default function TestDatabaseConnectionPage() {
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<TestResults | null>(null)
  const [error, setError] = useState<string | null>(null)

  const runDatabaseTest = async () => {
    setIsRunning(true)
    setProgress(0)
    setResults(null)
    setError(null)

    try {
      const steps = [
        "Checking environment variables...",
        "Testing database connection...",
        "Validating SSL configuration...",
        "Testing connection pooling...",
        "Running performance tests...",
        "Generating recommendations...",
      ]

      for (let i = 0; i < steps.length; i++) {
        setProgress(((i + 1) / steps.length) * 100)
        await new Promise((resolve) => setTimeout(resolve, 800))
      }

      const response = await fetch("/api/debug/database")

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      if (!data.success && data.error) {
        throw new Error(data.error)
      }

      const testResults: TestResults = {
        environment: [
          {
            name: "DATABASE_URL",
            status: data.environment?.DATABASE_URL ? "success" : "error",
            message: data.environment?.DATABASE_URL ? "Present and configured" : "Missing or not configured",
            details: data.environment?.DATABASE_URL
              ? "Database connection string found"
              : "Required for database connectivity",
          },
          {
            name: "POSTGRES_URL",
            status: data.environment?.POSTGRES_URL ? "success" : "warning",
            message: data.environment?.POSTGRES_URL ? "Present" : "Not configured",
            details: data.environment?.POSTGRES_URL ? "Backup connection available" : "Optional but recommended",
          },
          {
            name: "Environment Setup",
            status: Object.values(data.environment || {}).some(Boolean) ? "success" : "error",
            message: `${Object.values(data.environment || {}).filter(Boolean).length} variables configured`,
            details: `Environment: ${data.environment?.NODE_ENV || "unknown"}, Vercel: ${data.environment?.VERCEL_ENV || "unknown"}`,
          },
        ],
        database: [
          {
            name: "Connection Test",
            status: data.connection?.success ? "success" : "error",
            message: data.connection?.success ? "Connection successful" : "Connection failed",
            details: data.connection?.message || "Database connectivity test",
            duration: data.connection?.responseTime,
          },
          {
            name: "SSL Configuration",
            status: data.ssl?.enabled ? "success" : "warning",
            message: data.ssl?.enabled ? "SSL enabled" : "SSL not configured",
            details: data.ssl?.details || "Security configuration check",
          },
          {
            name: "Connection Pool",
            status: data.pool?.configured ? "success" : "warning",
            message: data.pool?.configured ? "Pool configured" : "No pooling detected",
            details: data.pool?.details || "Connection pooling optimization",
          },
        ],
        additional: [
          {
            name: "Performance",
            status:
              (data.performance?.responseTime || 0) < 100
                ? "success"
                : (data.performance?.responseTime || 0) < 500
                  ? "warning"
                  : "error",
            message: `${data.performance?.responseTime || 0}ms response time`,
            details: "Database query performance metrics",
            duration: data.performance?.responseTime,
          },
          {
            name: "Schema Access",
            status: data.schema?.accessible ? "success" : "error",
            message: data.schema?.accessible ? "Schema accessible" : "Schema access limited",
            details: data.schema?.details || "Database schema permissions",
          },
          {
            name: "Test Duration",
            status: (data.totalTestTime || 0) < 5000 ? "success" : "warning",
            message: `Total test time: ${data.totalTestTime || 0}ms`,
            details: "Overall test execution performance",
          },
        ],
        recommendations: data.recommendations || [
          "Consider enabling connection pooling for better performance",
          "Ensure SSL is enabled for production environments",
          "Monitor database response times regularly",
          "Set up database backup strategies",
        ],
      }

      setResults(testResults)
    } catch (error) {
      console.error("Test failed:", error)
      setError(error instanceof Error ? error.message : "Unknown error occurred")

      setResults({
        environment: [
          {
            name: "Test Error",
            status: "error",
            message: "Failed to run database tests",
            details: error instanceof Error ? error.message : "Unknown error occurred",
          },
        ],
        database: [],
        additional: [],
        recommendations: [
          "Check network connectivity",
          "Verify API endpoints are accessible",
          "Review error logs for more details",
          "Ensure environment variables are properly set",
        ],
      })
    } finally {
      setIsRunning(false)
    }
  }

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      default:
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
    }
  }

  const getStatusColor = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800 border-green-200"
      case "error":
        return "bg-red-100 text-red-800 border-red-200"
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-blue-100 text-blue-800 border-blue-200"
    }
  }

  const getTotalStats = () => {
    if (!results) return { total: 0, success: 0, warning: 0, error: 0 }

    const allTests = [...results.environment, ...results.database, ...results.additional]
    return {
      total: allTests.length,
      success: allTests.filter((t) => t.status === "success").length,
      warning: allTests.filter((t) => t.status === "warning").length,
      error: allTests.filter((t) => t.status === "error").length,
    }
  }

  const stats = getTotalStats()

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Database className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold">Database Connection Test</h1>
          <p className="text-gray-600">Comprehensive database connectivity and performance testing</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Test Database Connection
          </CardTitle>
          <CardDescription>
            Run comprehensive tests to validate your database configuration, connectivity, and performance.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!results && !isRunning && (
            <Button onClick={runDatabaseTest} size="lg" className="w-full">
              <Play className="mr-2 h-4 w-4" />
              Start Database Connection Test
            </Button>
          )}

          {isRunning && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Running comprehensive database tests...</span>
              </div>
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-gray-600">{Math.round(progress)}% complete</p>
            </div>
          )}

          {error && (
            <Alert className="border-red-200 bg-red-50">
              <XCircle className="h-4 w-4 text-red-500" />
              <AlertDescription className="text-red-700">
                <strong>Test Failed:</strong> {error}
              </AlertDescription>
            </Alert>
          )}

          {results && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Test Results</h3>
                <Button onClick={runDatabaseTest} variant="outline" size="sm">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Run Again
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                    <p className="text-xs text-muted-foreground">Total Tests</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-green-600">{stats.success}</div>
                    <p className="text-xs text-muted-foreground">Passed</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-yellow-600">{stats.warning}</div>
                    <p className="text-xs text-muted-foreground">Warnings</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-red-600">{stats.error}</div>
                    <p className="text-xs text-muted-foreground">Errors</p>
                  </CardContent>
                </Card>
              </div>

              <Tabs defaultValue="environment" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="environment">Environment</TabsTrigger>
                  <TabsTrigger value="database">Database</TabsTrigger>
                  <TabsTrigger value="additional">Additional</TabsTrigger>
                  <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                </TabsList>

                <TabsContent value="environment" className="space-y-4">
                  <h4 className="font-medium text-lg">Environment Variables</h4>
                  {results.environment.map((test, index) => (
                    <Card key={index}>
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(test.status)}
                            <div className="flex-1">
                              <h5 className="font-medium">{test.name}</h5>
                              <p className="text-sm text-gray-600">{test.message}</p>
                              {test.details && <p className="text-xs text-gray-500 mt-1">{test.details}</p>}
                              {test.duration && (
                                <p className="text-xs text-blue-600 mt-1">Duration: {test.duration}ms</p>
                              )}
                            </div>
                          </div>
                          <Badge className={getStatusColor(test.status)}>{test.status}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="database" className="space-y-4">
                  <h4 className="font-medium text-lg">Database Connectivity</h4>
                  {results.database.map((test, index) => (
                    <Card key={index}>
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(test.status)}
                            <div className="flex-1">
                              <h5 className="font-medium">{test.name}</h5>
                              <p className="text-sm text-gray-600">{test.message}</p>
                              {test.details && <p className="text-xs text-gray-500 mt-1">{test.details}</p>}
                              {test.duration && (
                                <p className="text-xs text-blue-600 mt-1">Response time: {test.duration}ms</p>
                              )}
                            </div>
                          </div>
                          <Badge className={getStatusColor(test.status)}>{test.status}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="additional" className="space-y-4">
                  <h4 className="font-medium text-lg">Additional Tests</h4>
                  {results.additional.map((test, index) => (
                    <Card key={index}>
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(test.status)}
                            <div className="flex-1">
                              <h5 className="font-medium">{test.name}</h5>
                              <p className="text-sm text-gray-600">{test.message}</p>
                              {test.details && <p className="text-xs text-gray-500 mt-1">{test.details}</p>}
                              {test.duration && (
                                <p className="text-xs text-blue-600 mt-1">Duration: {test.duration}ms</p>
                              )}
                            </div>
                          </div>
                          <Badge className={getStatusColor(test.status)}>{test.status}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="recommendations" className="space-y-4">
                  <h4 className="font-medium text-lg">Recommendations</h4>
                  {results.recommendations.map((recommendation, index) => (
                    <Alert key={index}>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{recommendation}</AlertDescription>
                    </Alert>
                  ))}
                </TabsContent>
              </Tabs>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
