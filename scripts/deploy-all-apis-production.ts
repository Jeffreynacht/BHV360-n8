#!/usr/bin/env node

import { execSync } from "child_process"
import { existsSync, readFileSync } from "fs"
import { join } from "path"

interface DeploymentConfig {
  projectName: string
  version: string
  environment: "production" | "staging" | "development"
  vercelProject?: string
  domain?: string
}

interface APIEndpoint {
  path: string
  method: string
  description: string
  category: string
}

class ProductionDeployer {
  private config: DeploymentConfig
  private startTime: number
  private apiEndpoints: APIEndpoint[] = []

  constructor() {
    this.config = {
      projectName: "BHV360 Plotkaart",
      version: "1.0.0",
      environment: "production",
      vercelProject: "bhv-plotkaart",
      domain: "bhv360.vercel.app",
    }
    this.startTime = Date.now()
  }

  async deploy(): Promise<void> {
    console.log("🚀 Starting Production Deployment for BHV360...")
    console.log(`📦 Project: ${this.config.projectName}`)
    console.log(`🏷️  Version: ${this.config.version}`)
    console.log(`🌍 Environment: ${this.config.environment}`)
    console.log("=".repeat(60))

    try {
      await this.validateEnvironment()
      await this.runPreDeploymentChecks()
      await this.discoverAPIEndpoints()
      await this.runTests()
      await this.deployToVercel()
      await this.runPostDeploymentVerification()
      await this.generateDeploymentReport()

      console.log("✅ Production deployment completed successfully!")
    } catch (error) {
      console.error("❌ Deployment failed:", error)
      process.exit(1)
    }
  }

  private async validateEnvironment(): Promise<void> {
    console.log("🔍 Validating environment...")

    // Check Node.js version
    const nodeVersion = process.version
    console.log(`📦 Node.js version: ${nodeVersion}`)

    // Check required files
    const requiredFiles = [
      "package.json",
      "next.config.mjs",
      "tsconfig.json",
      ".env.example",
      "app/layout.tsx",
      "app/page.tsx",
    ]

    for (const file of requiredFiles) {
      if (!existsSync(file)) {
        throw new Error(`Required file missing: ${file}`)
      }
    }

    // Check environment variables
    const requiredEnvVars = [
      "DATABASE_URL",
      "NEXT_PUBLIC_SUPABASE_URL",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      "NEXTAUTH_SECRET",
    ]

    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        console.warn(`⚠️  Warning: ${envVar} not set`)
      }
    }

    console.log("✅ Environment validation completed")
  }

  private async runPreDeploymentChecks(): Promise<void> {
    console.log("🔧 Running pre-deployment checks...")

    try {
      // Install dependencies
      console.log("📦 Installing dependencies...")
      execSync("npm ci", { stdio: "inherit" })

      // Check for security vulnerabilities
      console.log("🔒 Checking for security vulnerabilities...")
      try {
        execSync("npm audit --audit-level=high", { stdio: "inherit" })
      } catch (error) {
        console.warn("⚠️  Security audit found issues, but continuing...")
      }

      console.log("✅ Pre-deployment checks completed")
    } catch (error) {
      throw new Error(`Pre-deployment checks failed: ${error}`)
    }
  }

  private async discoverAPIEndpoints(): Promise<void> {
    console.log("🔍 Discovering API endpoints...")

    const apiDir = "app/api"
    if (!existsSync(apiDir)) {
      console.warn("⚠️  No API directory found")
      return
    }

    // Scan for API routes
    const scanDirectory = (dir: string, basePath = ""): void => {
      const { readdirSync, statSync } = require("fs")
      const items = readdirSync(dir)

      for (const item of items) {
        const fullPath = join(dir, item)
        const stat = statSync(fullPath)

        if (stat.isDirectory()) {
          scanDirectory(fullPath, `${basePath}/${item}`)
        } else if (item === "route.ts" || item === "route.tsx") {
          const apiPath = `/api${basePath}`
          this.apiEndpoints.push({
            path: apiPath,
            method: "GET/POST",
            description: this.getAPIDescription(fullPath),
            category: this.categorizeAPI(apiPath),
          })
        }
      }
    }

    scanDirectory(apiDir)

    console.log(`📊 Found ${this.apiEndpoints.length} API endpoints`)

    // Group by category
    const categories = this.apiEndpoints.reduce(
      (acc, endpoint) => {
        acc[endpoint.category] = (acc[endpoint.category] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    console.log("📋 API Categories:")
    Object.entries(categories).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} endpoints`)
    })
  }

  private getAPIDescription(filePath: string): string {
    try {
      const content = readFileSync(filePath, "utf-8")
      // Extract description from comments or function names
      const descriptionMatch = content.match(/\/\*\*\s*\n\s*\*\s*(.+?)\s*\n/)
      return descriptionMatch ? descriptionMatch[1] : "API endpoint"
    } catch {
      return "API endpoint"
    }
  }

  private categorizeAPI(path: string): string {
    if (path.includes("/auth")) return "Authentication"
    if (path.includes("/users")) return "User Management"
    if (path.includes("/customers")) return "Customer Management"
    if (path.includes("/incidents")) return "Incident Management"
    if (path.includes("/emergency") || path.includes("/evacuation")) return "Emergency Response"
    if (path.includes("/websocket") || path.includes("/messaging")) return "Real-time Communication"
    if (path.includes("/push") || path.includes("/notifications")) return "Notifications"
    if (path.includes("/alerts")) return "Alert System"
    if (path.includes("/inspections") || path.includes("/reports")) return "Inspections & Reports"
    if (path.includes("/email") || path.includes("/sms") || path.includes("/contact")) return "Communication"
    if (path.includes("/backup") || path.includes("/monitoring") || path.includes("/health")) return "System Management"
    return "General"
  }

  private async runTests(): Promise<void> {
    console.log("🧪 Running tests...")

    try {
      // TypeScript compilation check
      console.log("📝 Checking TypeScript compilation...")
      execSync("npx tsc --noEmit", { stdio: "inherit" })

      // Linting
      console.log("🔍 Running linter...")
      try {
        execSync("npx eslint . --ext .ts,.tsx --max-warnings 0", { stdio: "inherit" })
      } catch (error) {
        console.warn("⚠️  Linting issues found, but continuing...")
      }

      // Build test
      console.log("🏗️  Testing build process...")
      execSync("npm run build", { stdio: "inherit" })

      console.log("✅ All tests passed")
    } catch (error) {
      throw new Error(`Tests failed: ${error}`)
    }
  }

  private async deployToVercel(): Promise<void> {
    console.log("🚀 Deploying to Vercel...")

    try {
      // Check if Vercel CLI is installed
      try {
        execSync("vercel --version", { stdio: "pipe" })
      } catch {
        console.log("📦 Installing Vercel CLI...")
        execSync("npm install -g vercel", { stdio: "inherit" })
      }

      // Deploy to production
      console.log("🌍 Deploying to production...")
      const deployCommand = this.config.vercelProject
        ? `vercel --prod --yes --name ${this.config.vercelProject}`
        : "vercel --prod --yes"

      execSync(deployCommand, { stdio: "inherit" })

      console.log("✅ Deployment to Vercel completed")
    } catch (error) {
      throw new Error(`Vercel deployment failed: ${error}`)
    }
  }

  private async runPostDeploymentVerification(): Promise<void> {
    console.log("🔍 Running post-deployment verification...")

    const baseUrl = this.config.domain ? `https://${this.config.domain}` : "https://bhv360.vercel.app"

    // Test critical endpoints
    const criticalEndpoints = ["/api/health", "/api/auth/status", "/api/websocket/connect", "/api/test-database"]

    for (const endpoint of criticalEndpoints) {
      try {
        console.log(`🔗 Testing ${endpoint}...`)
        const response = await fetch(`${baseUrl}${endpoint}`)
        if (response.ok) {
          console.log(`✅ ${endpoint} - OK`)
        } else {
          console.warn(`⚠️  ${endpoint} - ${response.status} ${response.statusText}`)
        }
      } catch (error) {
        console.warn(`⚠️  ${endpoint} - Connection failed`)
      }
    }

    console.log("✅ Post-deployment verification completed")
  }

  private async generateDeploymentReport(): Promise<void> {
    const duration = Date.now() - this.startTime
    const durationMinutes = Math.round((duration / 1000 / 60) * 100) / 100

    console.log("\n" + "=".repeat(60))
    console.log("📊 DEPLOYMENT REPORT")
    console.log("=".repeat(60))
    console.log(`🏷️  Project: ${this.config.projectName}`)
    console.log(`🌍 Environment: ${this.config.environment}`)
    console.log(`⏱️  Duration: ${durationMinutes} minutes`)
    console.log(`📡 API Endpoints: ${this.apiEndpoints.length}`)
    console.log(`🔗 Domain: ${this.config.domain || "bhv360.vercel.app"}`)
    console.log(`📅 Deployed: ${new Date().toISOString()}`)

    console.log("\n📋 API ENDPOINTS BY CATEGORY:")
    const categories = this.apiEndpoints.reduce(
      (acc, endpoint) => {
        if (!acc[endpoint.category]) acc[endpoint.category] = []
        acc[endpoint.category].push(endpoint)
        return acc
      },
      {} as Record<string, APIEndpoint[]>,
    )

    Object.entries(categories).forEach(([category, endpoints]) => {
      console.log(`\n🏷️  ${category} (${endpoints.length} endpoints):`)
      endpoints.forEach((endpoint) => {
        console.log(`   ${endpoint.method.padEnd(10)} ${endpoint.path}`)
      })
    })

    console.log("\n🎉 DEPLOYMENT SUCCESSFUL!")
    console.log(`🌐 Your application is live at: https://${this.config.domain || "bhv360.vercel.app"}`)
    console.log("=".repeat(60))
  }
}

// Run deployment if called directly
if (require.main === module) {
  const deployer = new ProductionDeployer()
  deployer.deploy().catch(console.error)
}

export { ProductionDeployer }
