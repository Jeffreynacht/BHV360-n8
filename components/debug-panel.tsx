"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, RefreshCw, Database, Server, Settings } from "lucide-react"

interface DebugResult {
  success: boolean
  timestamp: string
  database?: {
    success: boolean
    error?: string
    message?: string
    details?: any
    step?: string
  }
  environment?: {
    hasDatabase: boolean
    nodeEnv: string
    appUrl?: string
    details?: any
  }
  error?: string
  stack?: string
}

export function DebugPanel() {
  const [debugResult, setDebugResult] = useState<DebugResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const runDebugCheck = async () => {
    setIsLoading(true)
    try {
      console.log("🚀 Starting debug check from client...")
      const response = await fetch("/api/debug")

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text()
        throw new Error(`Expected JSON response, got: ${text.substring(0, 100)}...`)
      }

      const result = await response.json()
      console.log("✅ Debug result received:", result)
      setDebugResult(result)
    } catch (error) {
      console.error("❌ Debug check failed:", error)
      setDebugResult({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (success: boolean) => {
    return success ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : (
      <AlertCircle className="h-5 w-5 text-red-500" />
    )
  }

  const getStatusBadge = (success: boolean) => {
    return <Badge variant={success ? "default" : "destructive"}>{success ? "Success" : "Error"}</Badge>
  }

  return (
    <div className="space-y-6">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            BHV360 System Debug Panel
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={runDebugCheck} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Running System Check...
              </>
            ) : (
              <>
                <Settings className="h-4 w-4 mr-2" />
                Run System Check
              </>
            )}
          </Button>

          {debugResult && (
            <div className="space-y-4">
              {/* Overall Status */}
              <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                {getStatusIcon(debugResult.success)}
                {getStatusBadge(debugResult.success)}
                <span className="text-sm text-muted-foreground">{debugResult.timestamp}</span>
              </div>

              {/* Database Status */}
              {debugResult.database && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Database className="h-4 w-4" />
                      Database Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(debugResult.database.success)}
                        <span className="font-medium">
                          {debugResult.database.success ? "Connected" : "Connection Failed"}
                        </span>
                      </div>

                      {debugResult.database.message && (
                        <p className="text-sm text-muted-foreground">{debugResult.database.message}</p>
                      )}

                      {debugResult.database.error && (
                        <div className="bg-red-50 border border-red-200 p-3 rounded-md">
                          <p className="text-sm text-red-700 font-medium">Error:</p>
                          <p className="text-sm text-red-600">{debugResult.database.error}</p>
                          {debugResult.database.step && (
                            <p className="text-xs text-red-500 mt-1">Failed at step: {debugResult.database.step}</p>
                          )}
                        </div>
                      )}

                      {debugResult.database.details && (
                        <details className="bg-muted p-3 rounded-md">
                          <summary className="cursor-pointer text-sm font-medium">Database Details</summary>
                          <pre className="text-xs mt-2 overflow-auto">
                            {JSON.stringify(debugResult.database.details, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Environment Status */}
              {debugResult.environment && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Server className="h-4 w-4" />
                      Environment Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Database URL:</span>
                        {getStatusBadge(debugResult.environment.hasDatabase)}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Node Environment:</span>
                        <Badge variant="outline">{debugResult.environment.nodeEnv}</Badge>
                      </div>
                      {debugResult.environment.appUrl && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm">App URL:</span>
                          <span className="text-xs text-muted-foreground">{debugResult.environment.appUrl}</span>
                        </div>
                      )}

                      {debugResult.environment.details && (
                        <details className="bg-muted p-3 rounded-md mt-3">
                          <summary className="cursor-pointer text-sm font-medium">Environment Details</summary>
                          <pre className="text-xs mt-2 overflow-auto">
                            {JSON.stringify(debugResult.environment.details, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Error Details */}
              {debugResult.error && (
                <Card className="border-red-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-red-700 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      Error Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-red-600">{debugResult.error}</p>
                      {debugResult.stack && (
                        <details className="bg-red-50 p-3 rounded-md">
                          <summary className="cursor-pointer text-sm font-medium text-red-700">Stack Trace</summary>
                          <pre className="text-xs mt-2 overflow-auto text-red-600">{debugResult.stack}</pre>
                        </details>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
