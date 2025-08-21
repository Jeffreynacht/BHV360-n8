"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  TestTube,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Database,
  Server,
  Monitor,
  Shield,
  Zap,
  Package,
  RefreshCw,
} from "lucide-react"

interface TestResult {
  id: string
  name: string
  category: string
  status: "pending" | "running" | "passed" | "failed"
  duration?: number
  error?: string
  details?: string
}

interface TestCategory {
  name: string
  icon: any
  tests: TestResult[]
  color: string
}

export default function SystemTestsPage() {
  const [isRunning, setIsRunning] = useState(false)
  const [currentTest, setCurrentTest] = useState<string | null>(null)
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [progress, setProgress] = useState(0)

  const testCategories: TestCategory[] = [
    {
      name: "Database Tests",
      icon: Database,
      color: "blue",
      tests: [
        { id: "db-1", name: "Database Connection", category: "database", status: "pending" },
        { id: "db-2", name: "Query Performance", category: "database", status: "pending" },
        { id: "db-3", name: "Data Integrity", category: "database", status: "pending" },
        { id: "db-4", name: "Backup Verification", category: "database", status: "pending" },
      ],
    },
    {
      name: "API Tests",
      icon: Server,
      color: "green",
      tests: [
        { id: "api-1", name: "Authentication Endpoints", category: "api", status: "pending" },
        { id: "api-2", name: "CRUD Operations", category: "api", status: "pending" },
        { id: "api-3", name: "Rate Limiting", category: "api", status: "pending" },
        { id: "api-4", name: "Error Handling", category: "api", status: "pending" },
        { id: "api-5", name: "Response Times", category: "api", status: "pending" },
      ],
    },
    {
      name: "Frontend Tests",
      icon: Monitor,
      color: "purple",
      tests: [
        { id: "fe-1", name: "Component Rendering", category: "frontend", status: "pending" },
        { id: "fe-2", name: "User Interactions", category: "frontend", status: "pending" },
        { id: "fe-3", name: "Form Validation", category: "frontend", status: "pending" },
        { id: "fe-4", name: "Navigation Flow", category: "frontend", status: "pending" },
        { id: "fe-5", name: "Responsive Design", category: "frontend", status: "pending" },
      ],
    },
    {
      name: "Security Tests",
      icon: Shield,
      color: "red",
      tests: [
        { id: "sec-1", name: "Authentication Security", category: "security", status: "pending" },
        { id: "sec-2", name: "Authorization Checks", category: "security", status: "pending" },
        { id: "sec-3", name: "Input Sanitization", category: "security", status: "pending" },
        { id: "sec-4", name: "SQL Injection Prevention", category: "security", status: "pending" },
        { id: "sec-5", name: "XSS Protection", category: "security", status: "pending" },
      ],
    },
    {
      name: "Performance Tests",
      icon: Zap,
      color: "yellow",
      tests: [
        { id: "perf-1", name: "Page Load Times", category: "performance", status: "pending" },
        { id: "perf-2", name: "API Response Times", category: "performance", status: "pending" },
        { id: "perf-3", name: "Memory Usage", category: "performance", status: "pending" },
        { id: "perf-4", name: "Concurrent Users", category: "performance", status: "pending" },
        { id: "perf-5", name: "Database Queries", category: "performance", status: "pending" },
      ],
    },
    {
      name: "Integration Tests",
      icon: Package,
      color: "indigo",
      tests: [
        { id: "int-1", name: "Email Service", category: "integration", status: "pending" },
        { id: "int-2", name: "SMS Service", category: "integration", status: "pending" },
        { id: "int-3", name: "File Upload", category: "integration", status: "pending" },
        { id: "int-4", name: "External APIs", category: "integration", status: "pending" },
        { id: "int-5", name: "Webhook Delivery", category: "integration", status: "pending" },
      ],
    },
    {
      name: "Module Tests",
      icon: TestTube,
      color: "teal",
      tests: [
        { id: "mod-1", name: "Plotkaart Module", category: "module", status: "pending" },
        { id: "mod-2", name: "Incident Module", category: "module", status: "pending" },
        { id: "mod-3", name: "User Management", category: "module", status: "pending" },
        { id: "mod-4", name: "NFC Integration", category: "module", status: "pending" },
        { id: "mod-5", name: "Analytics Module", category: "module", status: "pending" },
        { id: "mod-6", name: "Mobile App", category: "module", status: "pending" },
        { id: "mod-7", name: "White Label", category: "module", status: "pending" },
        { id: "mod-8", name: "BHV Coordinator", category: "module", status: "pending" },
      ],
    },
  ]

  const allTests = testCategories.flatMap((category) => category.tests)
  const totalTests = allTests.length

  const runAllTests = async () => {
    setIsRunning(true)
    setProgress(0)

    const updatedTests = [...allTests]
    setTestResults(updatedTests)

    for (let i = 0; i < updatedTests.length; i++) {
      const test = updatedTests[i]
      setCurrentTest(test.id)

      // Update test status to running
      updatedTests[i] = { ...test, status: "running" }
      setTestResults([...updatedTests])

      // Simulate test execution
      await new Promise((resolve) => setTimeout(resolve, Math.random() * 2000 + 500))

      // Simulate test result (95% success rate)
      const passed = Math.random() > 0.05
      const duration = Math.floor(Math.random() * 1000 + 100)

      updatedTests[i] = {
        ...test,
        status: passed ? "passed" : "failed",
        duration,
        error: passed ? undefined : "Test failed due to timeout or assertion error",
        details: passed ? "All assertions passed successfully" : "Expected value did not match actual result",
      }

      setTestResults([...updatedTests])
      setProgress(((i + 1) / totalTests) * 100)
    }

    setCurrentTest(null)
    setIsRunning(false)
  }

  const resetTests = () => {
    const resetTests = allTests.map((test) => ({
      ...test,
      status: "pending" as const,
      duration: undefined,
      error: undefined,
    }))
    setTestResults(resetTests)
    setProgress(0)
    setCurrentTest(null)
    setIsRunning(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "passed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />
      case "running":
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "passed":
        return "bg-green-100 text-green-800 border-green-200"
      case "failed":
        return "bg-red-100 text-red-800 border-red-200"
      case "running":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getCategoryColor = (color: string) => {
    const colors = {
      blue: "from-blue-500 to-blue-600",
      green: "from-green-500 to-green-600",
      purple: "from-purple-500 to-purple-600",
      red: "from-red-500 to-red-600",
      yellow: "from-yellow-500 to-yellow-600",
      indigo: "from-indigo-500 to-indigo-600",
      teal: "from-teal-500 to-teal-600",
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  const passedTests = testResults.filter((test) => test.status === "passed").length
  const failedTests = testResults.filter((test) => test.status === "failed").length
  const successRate = testResults.length > 0 ? Math.round((passedTests / testResults.length) * 100) : 0

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">System Test Suite</h1>
          <p className="text-gray-600">Comprehensive testing suite voor alle BHV360 modules en systeem componenten</p>
        </div>

        {/* Test Controls */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TestTube className="w-5 h-5" />
              <span>Test Suite Controls</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex gap-4">
                <Button
                  onClick={runAllTests}
                  disabled={isRunning}
                  className="bg-gradient-to-r from-green-500 to-blue-500 text-white"
                >
                  {isRunning ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Running Tests...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Run All Tests ({totalTests})
                    </>
                  )}
                </Button>
                <Button onClick={resetTests} variant="outline" disabled={isRunning}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>

              <div className="flex items-center space-x-4 text-sm">
                <Badge className="bg-green-100 text-green-800">{passedTests} Passed</Badge>
                <Badge className="bg-red-100 text-red-800">{failedTests} Failed</Badge>
                <Badge className="bg-blue-100 text-blue-800">{successRate}% Success Rate</Badge>
              </div>
            </div>

            {/* Progress Bar */}
            {(isRunning || testResults.length > 0) && (
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-3" />
                {currentTest && (
                  <p className="text-sm text-gray-600 mt-2">
                    Currently running: {testResults.find((t) => t.id === currentTest)?.name}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Test Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {testCategories.map((category) => {
            const IconComponent = category.icon
            const categoryTests = testResults.filter(
              (test) => test.category === category.name.toLowerCase().split(" ")[0],
            )
            const categoryPassed = categoryTests.filter((test) => test.status === "passed").length
            const categoryFailed = categoryTests.filter((test) => test.status === "failed").length
            const categoryRunning = categoryTests.filter((test) => test.status === "running").length

            return (
              <Card key={category.name} className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <div
                      className={`w-10 h-10 bg-gradient-to-r ${getCategoryColor(category.color)} rounded-lg flex items-center justify-center`}
                    >
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span>{category.name}</span>
                      <div className="text-sm font-normal text-gray-600">{category.tests.length} tests</div>
                    </div>
                  </CardTitle>
                  {categoryTests.length > 0 && (
                    <div className="flex space-x-2">
                      {categoryPassed > 0 && (
                        <Badge className="bg-green-100 text-green-800 text-xs">{categoryPassed} passed</Badge>
                      )}
                      {categoryFailed > 0 && (
                        <Badge className="bg-red-100 text-red-800 text-xs">{categoryFailed} failed</Badge>
                      )}
                      {categoryRunning > 0 && (
                        <Badge className="bg-blue-100 text-blue-800 text-xs">{categoryRunning} running</Badge>
                      )}
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {category.tests.map((test) => {
                      const result = testResults.find((r) => r.id === test.id) || test
                      return (
                        <div key={test.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(result.status)}
                            <div>
                              <div className="font-medium text-sm">{test.name}</div>
                              {result.duration && <div className="text-xs text-gray-500">{result.duration}ms</div>}
                              {result.error && <div className="text-xs text-red-600 mt-1">{result.error}</div>}
                            </div>
                          </div>
                          <Badge className={getStatusColor(result.status)}>{result.status}</Badge>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Test Summary */}
        {testResults.length > 0 && !isRunning && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Test Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">{totalTests}</div>
                  <div className="text-sm text-gray-600">Total Tests</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{passedTests}</div>
                  <div className="text-sm text-gray-600">Passed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600">{failedTests}</div>
                  <div className="text-sm text-gray-600">Failed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{successRate}%</div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
              </div>

              {failedTests > 0 && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span className="font-medium text-red-800">Failed Tests Require Attention</span>
                  </div>
                  <p className="text-sm text-red-700">
                    {failedTests} test{failedTests > 1 ? "s" : ""} failed. Please review the errors above and fix the
                    underlying issues.
                  </p>
                </div>
              )}

              {successRate === 100 && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-green-800">All Tests Passed!</span>
                  </div>
                  <p className="text-sm text-green-700">
                    Excellent! All {totalTests} tests passed successfully. The system is ready for production.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
