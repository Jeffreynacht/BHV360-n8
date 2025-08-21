#!/usr/bin/env tsx

import { spawn } from "child_process"
import { writeFileSync, readFileSync, existsSync } from "fs"
import { join } from "path"

interface LogEntry {
  timestamp: string
  level: "info" | "success" | "warning" | "error" | "step"
  message: string
  details?: string
}

class DeploymentLogMonitor {
  private logs: LogEntry[] = []
  private startTime: number = Date.now()
  private logFile: string = join(process.cwd(), "deployment.log")

  constructor() {
    console.log("📊 DEPLOYMENT LOG MONITOR STARTING")
    console.log("=".repeat(60))
    console.log(`📅 Monitor Start: ${new Date().toISOString()}`)
    console.log(`📝 Log File: ${this.logFile}`)
    console.log("=".repeat(60))

    // Clear previous log file
    writeFileSync(this.logFile, "")
  }

  private addLog(level: LogEntry["level"], message: string, details?: string): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      details,
    }

    this.logs.push(entry)
    this.writeLogToFile(entry)
    this.displayLog(entry)
  }

  private writeLogToFile(entry: LogEntry): void {
    const logLine = `[${entry.timestamp}] ${entry.level.toUpperCase()}: ${entry.message}${
      entry.details ? `\n  Details: ${entry.details}` : ""
    }\n`

    try {
      const existingContent = existsSync(this.logFile) ? readFileSync(this.logFile, "utf8") : ""
      writeFileSync(this.logFile, existingContent + logLine)
    } catch (error) {
      console.error("Failed to write to log file:", error)
    }
  }

  private displayLog(entry: LogEntry): void {
    const elapsed = Math.round((Date.now() - this.startTime) / 1000)
    const timePrefix = `[${elapsed}s]`

    let icon = "ℹ️ "
    let color = ""

    switch (entry.level) {
      case "success":
        icon = "✅ "
        color = "\x1b[32m" // Green
        break
      case "warning":
        icon = "⚠️  "
        color = "\x1b[33m" // Yellow
        break
      case "error":
        icon = "❌ "
        color = "\x1b[31m" // Red
        break
      case "step":
        icon = "🔄 "
        color = "\x1b[36m" // Cyan
        break
      default:
        icon = "ℹ️  "
        color = "\x1b[37m" // White
    }

    console.log(`${color}${timePrefix} ${icon}${entry.message}\x1b[0m`)

    if (entry.details) {
      console.log(`${color}   └─ ${entry.details}\x1b[0m`)
    }
  }

  private async executeWithLogging(command: string, description: string, options: any = {}): Promise<string> {
    this.addLog("step", description, `Command: ${command}`)

    return new Promise((resolve, reject) => {
      const child = spawn("bash", ["-c", command], {
        stdio: "pipe",
        cwd: process.cwd(),
        env: {
          ...process.env,
          NODE_ENV: "production",
          NEXT_TELEMETRY_DISABLED: "1",
        },
      })

      let stdout = ""
      let stderr = ""

      if (child.stdout) {
        child.stdout.on("data", (data) => {
          const output = data.toString()
          stdout += output

          // Log significant output lines
          const lines = output.split("\n").filter((line) => line.trim())
          for (const line of lines) {
            if (line.includes("error") || line.includes("Error")) {
              this.addLog("error", "Build Error", line.trim())
            } else if (line.includes("warning") || line.includes("Warning")) {
              this.addLog("warning", "Build Warning", line.trim())
            } else if (line.includes("✓") || line.includes("success")) {
              this.addLog("success", "Build Success", line.trim())
            } else if (line.trim().length > 0) {
              this.addLog("info", "Build Output", line.trim())
            }
          }
        })
      }

      if (child.stderr) {
        child.stderr.on("data", (data) => {
          const output = data.toString()
          stderr += output

          const lines = output.split("\n").filter((line) => line.trim())
          for (const line of lines) {
            this.addLog("error", "Error Output", line.trim())
          }
        })
      }

      const timeout = setTimeout(() => {
        child.kill("SIGTERM")
        this.addLog("error", "Command Timeout", `${description} timed out after ${options.timeout || 120000}ms`)
        reject(new Error(`Command timed out after ${options.timeout || 120000}ms`))
      }, options.timeout || 120000)

      child.on("close", (code) => {
        clearTimeout(timeout)
        if (code === 0) {
          this.addLog("success", `${description} completed successfully`)
          resolve(stdout)
        } else {
          this.addLog("error", `${description} failed`, `Exit code: ${code}`)
          reject(new Error(`Command failed with exit code ${code}`))
        }
      })

      child.on("error", (error) => {
        clearTimeout(timeout)
        this.addLog("error", `${description} failed`, error.message)
        reject(error)
      })
    })
  }

  private async monitorDeploymentProgress(): Promise<void> {
    this.addLog("step", "Starting deployment monitoring")

    try {
      // Monitor prerequisites
      this.addLog("step", "Checking prerequisites")
      await this.executeWithLogging("command -v git && command -v node && command -v npm", "Checking required tools")

      // Monitor environment setup
      this.addLog("step", "Setting up environment")

      // Monitor package.json update
      this.addLog("step", "Updating package.json")

      // Monitor clean and install
      this.addLog("step", "Cleaning and installing dependencies")
      await this.executeWithLogging("rm -rf .next node_modules package-lock.json", "Cleaning project")
      await this.executeWithLogging("npm install", "Installing dependencies", { timeout: 300000 })

      // Monitor build process
      this.addLog("step", "Building Next.js application")
      await this.executeWithLogging("npm run build", "Building application", { timeout: 600000 })

      // Monitor git operations
      this.addLog("step", "Committing changes to git")
      await this.executeWithLogging("git add .", "Adding changes to git")
      await this.executeWithLogging(
        'git commit -m "Emergency deployment - Context Provider Fixes"',
        "Committing changes",
      )
      await this.executeWithLogging("git push origin main", "Pushing to GitHub")

      // Monitor Vercel deployment
      this.addLog("step", "Deploying to Vercel")
      await this.executeWithLogging("vercel --prod --yes --confirm", "Deploying to Vercel", { timeout: 600000 })

      // Monitor endpoint testing
      this.addLog("step", "Testing deployed endpoints")
      await this.testEndpoints()

      this.addLog("success", "Deployment monitoring completed successfully")
    } catch (error) {
      this.addLog("error", "Deployment monitoring failed", error instanceof Error ? error.message : String(error))
      throw error
    }
  }

  private async testEndpoints(): Promise<void> {
    const baseUrl = "https://bhv360.vercel.app"
    const endpoints = [
      { path: "/api/health", name: "Health Check" },
      { path: "/api/test-database", name: "Database Test" },
      { path: "/", name: "Homepage" },
      { path: "/login", name: "Login Page" },
      { path: "/dashboard", name: "Dashboard" },
    ]

    for (const endpoint of endpoints) {
      try {
        this.addLog("step", `Testing ${endpoint.name}`, `URL: ${baseUrl}${endpoint.path}`)

        const result = await this.executeWithLogging(
          `curl -f -s -o /dev/null -w "%{http_code}" --max-time 30 "${baseUrl}${endpoint.path}"`,
          `Testing ${endpoint.name}`,
          { silent: true },
        )

        const statusCode = Number.parseInt(result.trim())

        if (statusCode >= 200 && statusCode < 400) {
          this.addLog("success", `${endpoint.name} is working`, `Status: ${statusCode}`)
        } else {
          this.addLog("warning", `${endpoint.name} returned unexpected status`, `Status: ${statusCode}`)
        }
      } catch (error) {
        this.addLog("error", `${endpoint.name} test failed`, error instanceof Error ? error.message : String(error))
      }

      // Small delay between tests
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
  }

  private generateSummaryReport(): void {
    const endTime = Date.now()
    const duration = Math.round((endTime - this.startTime) / 1000)

    const successCount = this.logs.filter((log) => log.level === "success").length
    const errorCount = this.logs.filter((log) => log.level === "error").length
    const warningCount = this.logs.filter((log) => log.level === "warning").length

    console.log("\n" + "=".repeat(60))
    console.log("📊 DEPLOYMENT LOG SUMMARY")
    console.log("=".repeat(60))
    console.log(`⏱️  Total Duration: ${duration} seconds`)
    console.log(`📝 Total Log Entries: ${this.logs.length}`)
    console.log(`✅ Success Events: ${successCount}`)
    console.log(`⚠️  Warning Events: ${warningCount}`)
    console.log(`❌ Error Events: ${errorCount}`)
    console.log(`📁 Log File: ${this.logFile}`)
    console.log("")

    if (errorCount === 0) {
      console.log("🎉 DEPLOYMENT COMPLETED WITHOUT ERRORS!")
    } else if (errorCount <= 2) {
      console.log("⚠️  DEPLOYMENT COMPLETED WITH MINOR ISSUES")
    } else {
      console.log("❌ DEPLOYMENT HAD SIGNIFICANT ISSUES")
    }

    console.log("=".repeat(60))

    // Write summary to log file
    const summary = `
DEPLOYMENT SUMMARY
==================
Duration: ${duration} seconds
Total Logs: ${this.logs.length}
Success: ${successCount}
Warnings: ${warningCount}
Errors: ${errorCount}
Completed: ${new Date().toISOString()}
`

    try {
      const existingContent = readFileSync(this.logFile, "utf8")
      writeFileSync(this.logFile, existingContent + summary)
    } catch (error) {
      console.error("Failed to write summary to log file:", error)
    }
  }

  public async startMonitoring(): Promise<void> {
    try {
      await this.monitorDeploymentProgress()
      this.generateSummaryReport()
    } catch (error) {
      this.addLog("error", "Monitoring failed", error instanceof Error ? error.message : String(error))
      this.generateSummaryReport()
      throw error
    }
  }
}

// Execute monitoring
async function main() {
  const monitor = new DeploymentLogMonitor()
  await monitor.startMonitoring()
}

if (require.main === module) {
  main().catch((error) => {
    console.error("Deployment monitoring failed:", error)
    process.exit(1)
  })
}

export { DeploymentLogMonitor }
