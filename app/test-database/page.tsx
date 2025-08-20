"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Database, Users, Building, AlertTriangle, Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function TestDatabasePage() {
  const [status, setStatus] = useState<{
    connection: boolean | null
    customers: any[]
    users: any[]
    facilities: any[]
    error?: string
    timestamp?: string
    database_url_configured?: boolean
    tables_status?: any
    debug_info?: any
  }>({
    connection: null,
    customers: [],
    users: [],
    facilities: [],
  })

  const [isLoading, setIsLoading] = useState(false)

  const testDatabase = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/test-database")

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      setStatus(data)
    } catch (error) {
      console.error("Database test failed:", error)
      setStatus({
        connection: false,
        customers: [],
        users: [],
        facilities: [],
        error: error instanceof Error ? error.message : "Failed to connect to API",
        timestamp: new Date().toISOString(),
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    testDatabase()
  }, [])

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Database Test</h1>
        <Button onClick={testDatabase} disabled={isLoading}>
          {isLoading ? "Testing..." : "Refresh"}
        </Button>
      </div>

      {/* Configuration Status */}
      {status.database_url_configured === false && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Database URL not configured. Please set DATABASE_URL or POSTGRES_URL environment variable.
          </AlertDescription>
        </Alert>
      )}

      {/* Connection Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {status.connection === true ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : status.connection === false ? (
                <XCircle className="h-5 w-5 text-red-500" />
              ) : (
                <div className="h-5 w-5 bg-gray-300 rounded-full animate-pulse" />
              )}
              <span className="text-sm">
                {status.connection === true ? "Connected" : status.connection === false ? "Failed" : "Testing..."}
              </span>
            </div>
            {status.timestamp && (
              <p className="text-xs text-muted-foreground mt-1">{new Date(status.timestamp).toLocaleString()}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{status.customers.length}</div>
            <p className="text-xs text-muted-foreground">
              {status.tables_status?.customers === "demo_data" ? "Demo data" : "Active customers"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{status.users.length}</div>
            <p className="text-xs text-muted-foreground">
              {status.tables_status?.users === "demo_data" ? "Demo data" : "Total users"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Facilities</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{status.facilities.length}</div>
            <p className="text-xs text-muted-foreground">
              {status.tables_status?.facilities === "demo_data" ? "Demo data" : "Safety equipment"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Error Display */}
      {status.error && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Error:</strong> {status.error}
            {status.debug_info && (
              <details className="mt-2">
                <summary className="cursor-pointer">Debug Info</summary>
                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded">{JSON.stringify(status.debug_info, null, 2)}</pre>
              </details>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Tables Status */}
      {status.tables_status && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Tables Status:</strong>
            <ul className="mt-1 ml-4 list-disc">
              <li>Customers: {status.tables_status.customers}</li>
              <li>Users: {status.tables_status.users}</li>
              <li>Facilities: {status.tables_status.facilities}</li>
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Data Display */}
      {status.customers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{status.tables_status?.customers === "demo_data" ? "Demo Customers" : "Customers"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {status.customers.map((customer: any, index: number) => (
                <div key={customer.id || index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <div>
                    <div className="font-medium">{customer.name}</div>
                    <div className="text-sm text-gray-500">{customer.contact_person}</div>
                  </div>
                  <div className="text-sm">
                    {customer.buildings} buildings, {customer.users} users
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
