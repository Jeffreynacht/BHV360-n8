"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, Loader2, CheckCircle, AlertCircle } from "lucide-react"

export function SetupDemoButton() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const setupDemoData = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/setup-demo-data", {
        method: "POST",
      })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ error: "Failed to setup demo data" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Database className="h-5 w-5" />
          <span>Setup Demo Data</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Klik hier om demo klanten en gebruikers aan te maken in de database.
        </p>

        <Button onClick={setupDemoData} disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Setting up...
            </>
          ) : (
            <>
              <Database className="mr-2 h-4 w-4" />
              Setup Demo Data
            </>
          )}
        </Button>

        {result && (
          <div className="mt-4">
            {result.success ? (
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">
                  Success! {result.data.customers} klanten, {result.data.users} gebruikers aangemaakt.
                </span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-red-600">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">Error: {result.error}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
