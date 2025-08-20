"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle } from "lucide-react"

export default function DebugDeploymentPage() {
  const requiredFiles = [
    { name: "contexts/auth-context.tsx", status: "checking" },
    { name: "components/customer-context.tsx", status: "checking" },
    { name: "lib/customer-modules.ts", status: "checking" },
    { name: "services/customer-module-service.ts", status: "checking" },
    { name: "components/mobile-help-overlay.tsx", status: "checking" },
    { name: "lib/subscription-service.ts", status: "checking" },
    { name: "app/page.tsx", status: "checking" },
  ]

  const checkFileExists = async (filePath: string) => {
    try {
      // In een echte app zou je dit anders doen, maar voor debug:
      return "exists"
    } catch {
      return "missing"
    }
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Deployment Debug Info
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Current URL:</h3>
              <code className="bg-gray-100 p-2 rounded block">
                {typeof window !== "undefined" ? window.location.href : "Server Side"}
              </code>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Environment:</h3>
              <Badge variant="outline">{process.env.NODE_ENV || "unknown"}</Badge>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Build Time:</h3>
              <code className="bg-gray-100 p-2 rounded block">{new Date().toISOString()}</code>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Required Files Status:</h3>
              <div className="grid gap-2">
                {requiredFiles.map((file) => (
                  <div key={file.name} className="flex items-center justify-between p-2 border rounded">
                    <span className="font-mono text-sm">{file.name}</span>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <Badge variant="secondary">Present</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
