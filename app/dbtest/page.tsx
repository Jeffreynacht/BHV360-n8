"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Database, CheckCircle, XCircle, AlertCircle } from "lucide-react"

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

export default function DbTest() {
  const [result, setResult] = useState<DatabaseTestResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const runTest = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("/api/debug/database")

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred")
    } finally {
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
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Database Test</h1>
        <p className="text-muted-foreground">Test your database connection and configuration</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Connection Test
          </CardTitle>
          <CardDescription>Click the button below to test your database connection</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={runTest} disabled={loading} className="w-full sm:w-auto">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing...
              </>
            ) : (
              "Run Database Test"
            )}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Card className="mb-6 border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <XCircle className="h-5 w-5" />
              Test Failed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {result && (
        <div className="space-y-6">
          {/* Overall Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getStatusIcon(result.success)}
                Overall Status
                {getStatusBadge(result.success)}
              </CardTitle>
              <CardDescription>Test completed at {new Date(result.timestamp).toLocaleString()}</CardDescription>
            </CardHeader>
          </Card>

          {/* Connection Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getStatusIcon(result.connection.success)}
                Database Connection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>
                <strong>Status:</strong> {result.connection.message}
              </p>
              <p>
                <strong>Response Time:</strong> {result.connection.responseTime}ms
              </p>
            </CardContent>
          </Card>

          {/* Environment Variables */}
          <Card>
            <CardHeader>
              <CardTitle>Environment Variables</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {Object.entries(result.environment).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="font-mono text-sm">{key}:</span>
                    <Badge variant={value ? "default" : "secondary"}>{value ? "Set" : "Missing"}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* SSL Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getStatusIcon(result.ssl.enabled)}
                SSL Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{result.ssl.details}</p>
            </CardContent>
          </Card>

          {/* Connection Pooling */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getStatusIcon(result.pool.configured)}
                Connection Pooling
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{result.pool.details}</p>
            </CardContent>
          </Card>

          {/* Schema Access */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getStatusIcon(result.schema.accessible)}
                Schema Access
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{result.schema.details}</p>
            </CardContent>
          </Card>

          {/* Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getStatusIcon(result.performance.responseTime < 1000)}
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                <strong>Total Test Time:</strong> {result.totalTestTime}ms
              </p>
              <p>
                <strong>Database Response Time:</strong> {result.performance.responseTime}ms
              </p>
            </CardContent>
          </Card>

          {/* Recommendations */}
          {result.recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-yellow-500 mt-1">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
