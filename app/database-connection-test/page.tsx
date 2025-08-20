"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Loader2,
  Database,
  CheckCircle,
  XCircle,
  AlertCircle,
  Server,
  Shield,
  Zap,
  Settings,
  Clock,
} from "lucide-react"

interface DatabaseTestResult {
  success: boolean
  timestamp: string
  environment: Record<string, any>
  connection: {
    success: boolean
    message: string
    responseTime: number
  }
  ssl: {
    enabled: boolean
    details: string
  }
  pool: {
    configured: boolean
    details: string
  }
  performance: {
    responseTime: number
  }
  schema: {
    accessible: boolean
    details: string
  }
  totalTestTime: number
  recommendations: string[]
}

export default function DatabaseConnectionTest() {
  const [result, setResult] = useState<DatabaseTestResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  const runTest = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    setProgress(0)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 200)

    try {
      const response = await fetch("/api/debug/database")

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      setResult(data)
      setProgress(100)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred")
      setProgress(100)
    } finally {
      clearInterval(progressInterval)
      setLoading(false)
    }
  }

  const getStatusIcon = (success: boolean) => {
    return success ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />
  }

  const getStatusBadge = (success: boolean) => {
    return <Badge variant={success ? "default" : "destructive"}>{success ? "Success" : "Failed"}</Badge>
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Database Connection Test</h1>
        <p className="text-muted-foreground">Comprehensive database connectivity and configuration testing</p>
      </div>

      {/* Test Control */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Test Control
          </CardTitle>
          <CardDescription>Run a comprehensive test of your database connection and configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={runTest} disabled={loading} className="w-full sm:w-auto" size="lg">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing Database...
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                Run Database Test
              </>
            )}
          </Button>

          {loading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Testing progress...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <XCircle className="h-5 w-5" />
              Test Failed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600 font-mono text-sm bg-red-100 p-3 rounded">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Overall Status */}
          <Card className={result.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getStatusIcon(result.success)}
                Overall Test Result
                {getStatusBadge(result.success)}
              </CardTitle>
              <CardDescription>
                Test completed at {new Date(result.timestamp).toLocaleString()}
                (Total time: {result.totalTestTime}ms)
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Detailed Results in Tabs */}
          <Tabs defaultValue="connection" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="connection" className="flex items-center gap-1">
                <Server className="h-4 w-4" />
                Connection
              </TabsTrigger>
              <TabsTrigger value="environment" className="flex items-center gap-1">
                <Settings className="h-4 w-4" />
                Environment
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-1">
                <Shield className="h-4 w-4" />
                Security
              </TabsTrigger>
              <TabsTrigger value="performance" className="flex items-center gap-1">
                <Zap className="h-4 w-4" />
                Performance
              </TabsTrigger>
              <TabsTrigger value="recommendations" className="flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                Tips
              </TabsTrigger>
            </TabsList>

            <TabsContent value="connection" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getStatusIcon(result.connection.success)}
                    Database Connection
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Connection Status</h4>
                      <p className="text-sm">{result.connection.message}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Response Time</h4>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">{result.connection.responseTime}ms</span>
                        <Badge variant={result.connection.responseTime < 500 ? "default" : "secondary"}>
                          {result.connection.responseTime < 500 ? "Fast" : "Slow"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Schema Access</h4>
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(result.schema.accessible)}
                      <span className="text-sm font-medium">
                        {result.schema.accessible ? "Schema Accessible" : "Schema Access Limited"}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{result.schema.details}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="environment" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Environment Variables</CardTitle>
                  <CardDescription>Database-related environment variables and their status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(result.environment).map(([key, value]) => (
                      <div key={key} className="flex flex-col space-y-1 p-3 border rounded-lg">
                        <span className="font-mono text-xs text-muted-foreground">{key}</span>
                        <div className="flex items-center gap-2">
                          {value ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                          <Badge variant={value ? "default" : "secondary"}>{value ? "Set" : "Missing"}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      {getStatusIcon(result.ssl.enabled)}
                      SSL/TLS Encryption
                    </h4>
                    <p className="text-sm text-muted-foreground">{result.ssl.details}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      {getStatusIcon(result.pool.configured)}
                      Connection Pooling
                    </h4>
                    <p className="text-sm text-muted-foreground">{result.pool.details}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Database Response Time</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Response Time</span>
                          <span className="text-sm font-mono">{result.performance.responseTime}ms</span>
                        </div>
                        <Progress
                          value={Math.min((result.performance.responseTime / 1000) * 100, 100)}
                          className="w-full"
                        />
                        <p className="text-xs text-muted-foreground">
                          {result.performance.responseTime < 100
                            ? "Excellent"
                            : result.performance.responseTime < 500
                              ? "Good"
                              : result.performance.responseTime < 1000
                                ? "Fair"
                                : "Needs Improvement"}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Total Test Duration</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Total Time</span>
                          <span className="text-sm font-mono">{result.totalTestTime}ms</span>
                        </div>
                        <Progress value={Math.min((result.totalTestTime / 2000) * 100, 100)} className="w-full" />
                        <p className="text-xs text-muted-foreground">Complete test execution time</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                    Recommendations & Tips
                  </CardTitle>
                  <CardDescription>Suggestions to improve your database configuration</CardDescription>
                </CardHeader>
                <CardContent>
                  {result.recommendations.length > 0 ? (
                    <ul className="space-y-3">
                      {result.recommendations.map((rec, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
                        >
                          <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-sm">
                        Great! Your database configuration looks optimal. No recommendations at this time.
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}
