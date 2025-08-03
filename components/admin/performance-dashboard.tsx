"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Cpu,
  HardDrive,
  MemoryStick,
  Network,
  Users,
  Clock,
  CheckCircle,
  Play,
  BarChart3,
  RefreshCw,
} from "lucide-react"
import NotificationSetup from "./notification-setup"

interface SystemMetrics {
  cpu: { usage: number }
  memory: { percentage: number; used: number; total: number }
  disk: { percentage: number; used: number; total: number }
  network: { bytesIn: number; bytesOut: number }
  responseTime: { average: number; p95: number; p99: number }
  activeUsers: number
  requestsPerMinute: number
  timestamp: string
}

interface LoadTestResult {
  success: boolean
  totalRequests: number
  successfulRequests: number
  failedRequests: number
  averageResponseTime: number
  maxResponseTime: number
  minResponseTime: number
  requestsPerSecond: number
  scenarios: Array<{
    name: string
    requests: number
    avgResponseTime: number
    successRate: number
  }>
}

export default function PerformanceDashboard() {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null)
  const [loadTestResult, setLoadTestResult] = useState<LoadTestResult | null>(null)
  const [isLoadTesting, setIsLoadTesting] = useState(false)
  const [loadTestConfig, setLoadTestConfig] = useState({
    concurrentUsers: 25,
    testDuration: 60,
    rampUpTime: 10,
  })
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  // Fetch current metrics
  const fetchMetrics = async () => {
    try {
      const response = await fetch("/api/monitoring/metrics?action=current")
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setMetrics(data.data)
          setLastUpdated(new Date())
        }
      }
    } catch (error) {
      console.error("Failed to fetch metrics:", error)
    }
  }

  // Auto-refresh metrics
  useEffect(() => {
    fetchMetrics()
    const interval = setInterval(fetchMetrics, 10000) // Every 10 seconds
    return () => clearInterval(interval)
  }, [])

  const runLoadTest = async () => {
    setIsLoadTesting(true)
    setLoadTestResult(null)

    try {
      const response = await fetch("/api/performance/load-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loadTestConfig),
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setLoadTestResult(result.data)
        }
      }
    } catch (error) {
      console.error("Load test failed:", error)
    } finally {
      setIsLoadTesting(false)
    }
  }

  const formatBytes = (bytes: number) => {
    const sizes = ["Bytes", "KB", "MB", "GB"]
    if (bytes === 0) return "0 Bytes"
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i]
  }

  const getStatusColor = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return "text-red-600"
    if (value >= thresholds.warning) return "text-yellow-600"
    return "text-green-600"
  }

  const getStatusBadge = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return <Badge variant="destructive">Critical</Badge>
    if (value >= thresholds.warning) return <Badge variant="secondary">Warning</Badge>
    return <Badge className="bg-green-600">Healthy</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Performance Dashboard</h1>
          <p className="text-muted-foreground">Monitor system performance and run load tests</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchMetrics}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          {lastUpdated && (
            <span className="text-sm text-muted-foreground">Last updated: {lastUpdated.toLocaleTimeString()}</span>
          )}
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="load-test">Load Testing</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {metrics ? (
            <>
              {/* System Status Alert */}
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  System is running normally. CPU: {metrics.cpu.usage.toFixed(1)}%, Memory:{" "}
                  {metrics.memory.percentage.toFixed(1)}%, Response Time: {metrics.responseTime.average.toFixed(0)}ms
                </AlertDescription>
              </Alert>

              {/* System Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* CPU Usage */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
                    <Cpu className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className={`text-2xl font-bold ${getStatusColor(metrics.cpu.usage, { warning: 70, critical: 90 })}`}
                      >
                        {metrics.cpu.usage.toFixed(1)}%
                      </div>
                      {getStatusBadge(metrics.cpu.usage, { warning: 70, critical: 90 })}
                    </div>
                    <Progress value={metrics.cpu.usage} className="h-2" />
                  </CardContent>
                </Card>

                {/* Memory Usage */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
                    <MemoryStick className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className={`text-2xl font-bold ${getStatusColor(metrics.memory.percentage, { warning: 80, critical: 95 })}`}
                      >
                        {metrics.memory.percentage.toFixed(1)}%
                      </div>
                      {getStatusBadge(metrics.memory.percentage, { warning: 80, critical: 95 })}
                    </div>
                    <Progress value={metrics.memory.percentage} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-2">
                      {formatBytes(metrics.memory.used)} / {formatBytes(metrics.memory.total)}
                    </p>
                  </CardContent>
                </Card>

                {/* Disk Usage */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Disk Usage</CardTitle>
                    <HardDrive className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className={`text-2xl font-bold ${getStatusColor(metrics.disk.percentage, { warning: 85, critical: 95 })}`}
                      >
                        {metrics.disk.percentage.toFixed(1)}%
                      </div>
                      {getStatusBadge(metrics.disk.percentage, { warning: 85, critical: 95 })}
                    </div>
                    <Progress value={metrics.disk.percentage} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-2">
                      {formatBytes(metrics.disk.used)} / {formatBytes(metrics.disk.total)}
                    </p>
                  </CardContent>
                </Card>

                {/* Response Time */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Response Time</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className={`text-2xl font-bold ${getStatusColor(metrics.responseTime.average, { warning: 1000, critical: 2000 })}`}
                      >
                        {metrics.responseTime.average.toFixed(0)}ms
                      </div>
                      {getStatusBadge(metrics.responseTime.average, { warning: 1000, critical: 2000 })}
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>P95:</span>
                        <span>{metrics.responseTime.p95.toFixed(0)}ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span>P99:</span>
                        <span>{metrics.responseTime.p99.toFixed(0)}ms</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Active Users */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">{metrics.activeUsers}</div>
                    <p className="text-xs text-muted-foreground">Currently online</p>
                  </CardContent>
                </Card>

                {/* Network Traffic */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Network Traffic</CardTitle>
                    <Network className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>In:</span>
                        <span>{formatBytes(metrics.network.bytesIn)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Out:</span>
                        <span>{formatBytes(metrics.network.bytesOut)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p>Loading performance metrics...</p>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="load-test" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Load Testing
              </CardTitle>
              <CardDescription>Test your application performance under load</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="users">Concurrent Users</Label>
                  <Input
                    id="users"
                    type="number"
                    min="1"
                    max="100"
                    value={loadTestConfig.concurrentUsers}
                    onChange={(e) =>
                      setLoadTestConfig((prev) => ({
                        ...prev,
                        concurrentUsers: Number.parseInt(e.target.value) || 1,
                      }))
                    }
                    disabled={isLoadTesting}
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Test Duration (seconds)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="10"
                    max="600"
                    value={loadTestConfig.testDuration}
                    onChange={(e) =>
                      setLoadTestConfig((prev) => ({
                        ...prev,
                        testDuration: Number.parseInt(e.target.value) || 10,
                      }))
                    }
                    disabled={isLoadTesting}
                  />
                </div>
                <div>
                  <Label htmlFor="rampup">Ramp-up Time (seconds)</Label>
                  <Input
                    id="rampup"
                    type="number"
                    min="1"
                    max="60"
                    value={loadTestConfig.rampUpTime}
                    onChange={(e) =>
                      setLoadTestConfig((prev) => ({
                        ...prev,
                        rampUpTime: Number.parseInt(e.target.value) || 1,
                      }))
                    }
                    disabled={isLoadTesting}
                  />
                </div>
              </div>

              <Button onClick={runLoadTest} disabled={isLoadTesting} className="w-full md:w-auto">
                <Play className="h-4 w-4 mr-2" />
                {isLoadTesting ? "Running Load Test..." : "Start Load Test"}
              </Button>

              {loadTestResult && (
                <div className="mt-6 space-y-4">
                  <h3 className="font-semibold">Load Test Results</h3>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold">{loadTestResult.totalRequests}</div>
                        <p className="text-xs text-muted-foreground">Total Requests</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-green-600">
                          {((loadTestResult.successfulRequests / loadTestResult.totalRequests) * 100).toFixed(1)}%
                        </div>
                        <p className="text-xs text-muted-foreground">Success Rate</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold">{loadTestResult.averageResponseTime.toFixed(0)}ms</div>
                        <p className="text-xs text-muted-foreground">Avg Response Time</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold">{loadTestResult.requestsPerSecond.toFixed(1)}</div>
                        <p className="text-xs text-muted-foreground">Requests/sec</p>
                      </CardContent>
                    </Card>
                  </div>

                  {loadTestResult.scenarios.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Scenario Results</h4>
                      <div className="space-y-2">
                        {loadTestResult.scenarios.map((scenario, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded">
                            <span className="font-medium">{scenario.name}</span>
                            <div className="flex gap-4 text-sm">
                              <span>{scenario.requests} requests</span>
                              <span>{scenario.avgResponseTime.toFixed(0)}ms avg</span>
                              <span className="text-green-600">{scenario.successRate.toFixed(1)}% success</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSetup />
        </TabsContent>
      </Tabs>
    </div>
  )
}
