"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, Database, AlertCircle, CheckCircle } from "lucide-react"

interface DatabaseStatus {
  success: boolean
  database?: {
    connected: boolean
    current_time: string
    customers_table_exists: boolean
    customers_count: number
    customers: any[]
  }
  error?: string
  timestamp: string
}

export function DatabaseStatus() {
  const [status, setStatus] = useState<DatabaseStatus | null>(null)
  const [loading, setLoading] = useState(false)

  const testDatabase = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/test-db")
      const data = await response.json()
      setStatus(data)
    } catch (error) {
      setStatus({
        success: false,
        error: "Failed to connect to API",
        timestamp: new Date().toISOString(),
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    testDatabase()
  }, [])

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Database Status</span>
          </div>
          <Button variant="outline" size="sm" onClick={testDatabase} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Test
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {status ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              {status.success ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500" />
              )}
              <Badge variant={status.success ? "default" : "destructive"}>
                {status.success ? "Connected" : "Failed"}
              </Badge>
              <span className="text-sm text-muted-foreground">{new Date(status.timestamp).toLocaleString()}</span>
            </div>

            {status.success && status.database && (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Database Time:</strong>
                  <br />
                  {new Date(status.database.current_time).toLocaleString()}
                </div>
                <div>
                  <strong>Customers Table:</strong>
                  <br />
                  {status.database.customers_table_exists ? "✅ Exists" : "❌ Missing"}
                </div>
                <div>
                  <strong>Customers Count:</strong>
                  <br />
                  {status.database.customers_count}
                </div>
              </div>
            )}

            {status.error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <strong className="text-red-800">Error:</strong>
                <pre className="text-red-700 text-sm mt-1 whitespace-pre-wrap">{status.error}</pre>
              </div>
            )}

            {status.success && status.database?.customers && status.database.customers.length > 0 && (
              <div>
                <strong>Customers in Database:</strong>
                <ul className="mt-2 space-y-1">
                  {status.database.customers.map((customer, index) => (
                    <li key={index} className="text-sm">
                      • {customer.name} (ID: {customer.id})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Testing database connection...</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
