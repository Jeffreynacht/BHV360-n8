"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  LinkIcon,
  ImageIcon,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  AlertTriangle,
  ExternalLink,
  FileImage,
  Globe,
  Zap,
} from "lucide-react"

interface LinkCheckResult {
  url: string
  status: "success" | "error" | "timeout"
  statusCode?: number
  responseTime?: number
  error?: string
  lastChecked: string
}

interface AssetCheckResult {
  path: string
  exists: boolean
  size?: number
  type?: string
  error?: string
  lastChecked: string
}

interface MonitoringReport {
  assets: AssetCheckResult[]
  externalLinks: LinkCheckResult[]
  summary: {
    totalAssets: number
    workingAssets: number
    brokenAssets: number
    totalLinks: number
    workingLinks: number
    brokenLinks: number
    timeoutLinks: number
  }
}

export default function LinkMonitoringPage() {
  const [report, setReport] = useState<MonitoringReport | null>(null)
  const [loading, setLoading] = useState(false)
  const [customUrl, setCustomUrl] = useState("")
  const [customResult, setCustomResult] = useState<LinkCheckResult | null>(null)
  const [lastUpdate, setLastUpdate] = useState<string | null>(null)

  const runFullCheck = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/monitoring/link-check?type=all")
      const data = await response.json()

      if (data.success) {
        setReport(data.report)
        setLastUpdate(new Date().toLocaleString("nl-NL"))
      }
    } catch (error) {
      console.error("Failed to run link check:", error)
    } finally {
      setLoading(false)
    }
  }

  const checkCustomUrl = async () => {
    if (!customUrl) return

    setLoading(true)
    try {
      const response = await fetch(`/api/monitoring/link-check?url=${encodeURIComponent(customUrl)}`)
      const data = await response.json()

      if (data.success) {
        setCustomResult(data.result)
      }
    } catch (error) {
      console.error("Failed to check custom URL:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    runFullCheck()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "timeout":
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800 border-green-200"
      case "error":
        return "bg-red-100 text-red-800 border-red-200"
      case "timeout":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "Unknown"
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i]
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <LinkIcon className="mr-3 h-8 w-8 text-blue-600" />
            Link & Asset Monitoring
          </h1>
          <p className="text-muted-foreground mt-1">Monitor de status van externe links en interne assets</p>
          {lastUpdate && <p className="text-sm text-gray-500 mt-1">Laatste update: {lastUpdate}</p>}
        </div>
        <Button onClick={runFullCheck} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Controleren..." : "Vernieuwen"}
        </Button>
      </div>

      {/* Summary Cards */}
      {report && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Assets Status</p>
                  <p className="text-2xl font-bold text-green-600">
                    {report.summary.workingAssets}/{report.summary.totalAssets}
                  </p>
                </div>
                <FileImage className="h-8 w-8 text-blue-500" />
              </div>
              <Progress value={(report.summary.workingAssets / report.summary.totalAssets) * 100} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">External Links</p>
                  <p className="text-2xl font-bold text-green-600">
                    {report.summary.workingLinks}/{report.summary.totalLinks}
                  </p>
                </div>
                <Globe className="h-8 w-8 text-green-500" />
              </div>
              <Progress value={(report.summary.workingLinks / report.summary.totalLinks) * 100} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Broken Assets</p>
                  <p className="text-2xl font-bold text-red-600">{report.summary.brokenAssets}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Timeouts</p>
                  <p className="text-2xl font-bold text-yellow-600">{report.summary.timeoutLinks}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Custom URL Checker */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="mr-2 h-5 w-5 text-blue-600" />
            Custom URL Checker
          </CardTitle>
          <CardDescription>Test een specifieke URL of asset</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Input
              placeholder="https://example.com of /images/logo.png"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              className="flex-1"
            />
            <Button onClick={checkCustomUrl} disabled={loading || !customUrl}>
              <LinkIcon className="mr-2 h-4 w-4" />
              Check
            </Button>
          </div>

          {customResult && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{customResult.url}</span>
                <Badge className={getStatusColor(customResult.status)}>
                  {getStatusIcon(customResult.status)}
                  <span className="ml-1 capitalize">{customResult.status}</span>
                </Badge>
              </div>
              {customResult.statusCode && (
                <p className="text-sm text-gray-600">Status Code: {customResult.statusCode}</p>
              )}
              {customResult.responseTime && (
                <p className="text-sm text-gray-600">Response Time: {customResult.responseTime}ms</p>
              )}
              {customResult.error && <p className="text-sm text-red-600">Error: {customResult.error}</p>}
            </div>
          )}
        </CardContent>
      </Card>

      {report && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Assets Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ImageIcon className="mr-2 h-5 w-5 text-blue-600" />
                Internal Assets ({report.assets.length})
              </CardTitle>
              <CardDescription>Status van interne afbeeldingen en bestanden</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {report.assets.map((asset, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{asset.path}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                        {asset.size && <span>Size: {formatFileSize(asset.size)}</span>}
                        {asset.type && <span>Type: {asset.type}</span>}
                      </div>
                      {asset.error && <p className="text-xs text-red-600 mt-1">{asset.error}</p>}
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {asset.exists ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      <Badge variant={asset.exists ? "default" : "destructive"} className="text-xs">
                        {asset.exists ? "OK" : "Missing"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* External Links Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ExternalLink className="mr-2 h-5 w-5 text-green-600" />
                External Links ({report.externalLinks.length})
              </CardTitle>
              <CardDescription>Status van externe website links</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {report.externalLinks.map((link, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{link.url}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                        {link.statusCode && <span>Status: {link.statusCode}</span>}
                        {link.responseTime && <span>Time: {link.responseTime}ms</span>}
                      </div>
                      {link.error && <p className="text-xs text-red-600 mt-1">{link.error}</p>}
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {getStatusIcon(link.status)}
                      <Badge className={getStatusColor(link.status)}>
                        {link.status === "success" && "OK"}
                        {link.status === "error" && "Error"}
                        {link.status === "timeout" && "Timeout"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {!report && !loading && (
        <Card>
          <CardContent className="p-12 text-center">
            <LinkIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Geen data beschikbaar</h3>
            <p className="text-gray-600 mb-4">Klik op "Vernieuwen" om een link en asset check uit te voeren</p>
            <Button onClick={runFullCheck}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Start Check
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
