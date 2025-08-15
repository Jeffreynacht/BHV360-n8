"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function DebugAuthPage() {
  const [authStatus, setAuthStatus] = useState<any>(null)
  const [cookies, setCookies] = useState<string>("")
  const [environment, setEnvironment] = useState<any>({})

  useEffect(() => {
    // Check cookies
    setCookies(document.cookie)

    // Check environment (only client-side accessible vars)
    setEnvironment({
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_DEFAULT_PASSWORD: process.env.NEXT_PUBLIC_DEFAULT_PASSWORD,
    })

    // Test auth endpoint
    fetch("/api/auth/status")
      .then((res) => res.json())
      .then((data) => setAuthStatus(data))
      .catch((err) => setAuthStatus({ error: err.message }))
  }, [])

  const testLogin = async () => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "admin", password: "bhv360secure" }),
      })
      const result = await response.json()
      console.log("Login test result:", result)
      alert(`Login test: ${response.ok ? "Success" : "Failed"} - ${JSON.stringify(result)}`)
    } catch (error) {
      console.error("Login test error:", error)
      alert(`Login test error: ${error}`)
    }
  }

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Authentication Debug</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold">Auth Status:</h3>
            <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">{JSON.stringify(authStatus, null, 2)}</pre>
          </div>

          <div>
            <h3 className="font-semibold">Cookies:</h3>
            <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">{cookies || "No cookies found"}</pre>
          </div>

          <div>
            <h3 className="font-semibold">Environment:</h3>
            <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">{JSON.stringify(environment, null, 2)}</pre>
          </div>

          <div className="flex space-x-2">
            <Button onClick={testLogin}>Test Login</Button>
            <Button onClick={() => (window.location.href = "/login")}>Go to Login</Button>
            <Button onClick={() => (window.location.href = "/dashboard")}>Go to Dashboard</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
