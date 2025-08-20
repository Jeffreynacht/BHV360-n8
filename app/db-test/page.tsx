"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Database, CheckCircle, XCircle, Loader2, Play } from "lucide-react"

export default function DbTestPage() {
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<any>(null)

  const runTest = async () => {
    setIsRunning(true)
    setProgress(0)
    setResults(null)

    try {
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i)
        await new Promise((resolve) => setTimeout(resolve, 200))
      }

      const response = await fetch("/api/debug/database")
      const data = await response.json()
      setResults(data)
    } catch (error) {
      setResults({ success: false, error: "Test failed" })
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Database className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold">Database Test</h1>
          <p className="text-gray-600">Simple database connectivity test</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Database Connection Test</CardTitle>
          <CardDescription>Test your database connection and configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!results && !isRunning && (
            <Button onClick={runTest} size="lg" className="w-full">
              <Play className="mr-2 h-4 w-4" />
              Start Test
            </Button>
          )}

          {isRunning && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Testing database connection...</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {results && (
            <div className="space-y-4">
              <Alert className={results.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                {results.success ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                <AlertDescription>
                  {results.success ? "Database connection successful!" : `Test failed: ${results.error}`}
                </AlertDescription>
              </Alert>

              <Button onClick={runTest} variant="outline" className="w-full bg-transparent">
                Run Test Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
