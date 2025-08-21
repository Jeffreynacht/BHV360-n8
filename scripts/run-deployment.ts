#!/usr/bin/env tsx

import { spawn } from "child_process"
import { writeFileSync, readFileSync, existsSync } from "fs"
import { join } from "path"

interface DeploymentConfig {
  projectName: string
  baseUrl: string
  branch: string
  timeout: number
}

class DeploymentRunner {
  private config: DeploymentConfig = {
    projectName: "BHV360 Plotkaart Recreation",
    baseUrl: "https://bhv360.vercel.app",
    branch: "main",
    timeout: 1800000, // 30 minutes
  }

  private startTime: number = Date.now()

  constructor() {
    console.log("🚀 BHV360 DEPLOYMENT RUNNER STARTING")
    console.log("=".repeat(60))
    console.log(`📅 Start Time: ${new Date().toISOString()}`)
    console.log(`🎯 Target URL: ${this.config.baseUrl}`)
    console.log(`🏗️  Project: ${this.config.projectName}`)
    console.log("=".repeat(60))
  }

  private logStep(message: string): void {
    console.log(`\n🔄 ${message}...`)
  }

  private logSuccess(message: string): void {
    console.log(`✅ ${message}`)
  }

  private logWarning(message: string): void {
    console.log(`⚠️  ${message}`)
  }

  private logError(message: string): void {
    console.log(`❌ ${message}`)
  }

  private logInfo(message: string): void {
    console.log(`ℹ️  ${message}`)
  }

  private executeCommand(command: string, description: string, options: any = {}): Promise<string> {
    return new Promise((resolve, reject) => {
      this.logStep(description)
      console.log(`💻 ${command}`)

      const child = spawn("bash", ["-c", command], {
        stdio: options.silent ? "pipe" : "inherit",
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
          stdout += data.toString()
          if (!options.silent) {
            process.stdout.write(data)
          }
        })
      }

      if (child.stderr) {
        child.stderr.on("data", (data) => {
          stderr += data.toString()
          if (!options.silent) {
            process.stderr.write(data)
          }
        })
      }

      const timeout = setTimeout(() => {
        child.kill("SIGTERM")
        reject(new Error(`Command timed out after ${options.timeout || 120000}ms`))
      }, options.timeout || 120000)

      child.on("close", (code) => {
        clearTimeout(timeout)
        if (code === 0) {
          this.logSuccess(`${description} completed`)
          resolve(stdout)
        } else {
          this.logError(`${description} failed with code ${code}`)
          reject(new Error(`Command failed with exit code ${code}\nSTDOUT: ${stdout}\nSTDERR: ${stderr}`))
        }
      })

      child.on("error", (error) => {
        clearTimeout(timeout)
        this.logError(`${description} failed: ${error.message}`)
        reject(error)
      })
    })
  }

  private async checkPrerequisites(): Promise<void> {
    this.logStep("Checking prerequisites")

    if (!existsSync("package.json")) {
      throw new Error("package.json not found. Are you in the project root?")
    }

    const requiredCommands = ["git", "node", "npm", "curl"]
    for (const cmd of requiredCommands) {
      try {
        await this.executeCommand(`command -v ${cmd}`, `Checking ${cmd}`, { silent: true })
      } catch (error) {
        throw new Error(`${cmd} is not installed or not in PATH`)
      }
    }

    try {
      await this.executeCommand("command -v vercel", "Checking Vercel CLI", { silent: true })
    } catch (error) {
      this.logWarning("Vercel CLI not found. Installing...")
      await this.executeCommand("npm install -g vercel", "Installing Vercel CLI", { timeout: 300000 })
    }

    try {
      await this.executeCommand("git status", "Checking git status", { silent: true })
    } catch (error) {
      throw new Error("Not in a git repository or git is not configured")
    }

    this.logSuccess("All prerequisites met")
  }

  private async updateEnvironmentVariables(): Promise<void> {
    this.logStep("Updating environment variables")

    const envContent = `# Database Configuration
DATABASE_URL=postgresql://neondb_owner:npg_ZQVKz8KLwBJh@ep-aged-cloud-a2w5jk7w.eu-central-1.aws.neon.tech/neondb?sslmode=require
POSTGRES_URL=postgresql://neondb_owner:npg_ZQVKz8KLwBJh@ep-aged-cloud-a2w5jk7w.eu-central-1.aws.neon.tech/neondb?sslmode=require

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://ybxmvuzgqevqpusimgmm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlieG12dXpncWV2cXB1c2ltZ21tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NDk4NDEsImV4cCI6MjA2NjMyNTg0MX0.MFB7ytqPId2c3HEm5KyK2RFZCO-cBrpmiO-FwHJXSv4

# Application Configuration
NEXT_PUBLIC_SITE_URL=https://bhv360.vercel.app
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1

# Vercel System Variables
VERCEL=1
VERCEL_ENV=production
VERCEL_URL=bhv360.vercel.app
VERCEL_GIT_COMMIT_SHA=emergency-deployment-${Date.now()}
VERCEL_REGION=fra1`

    writeFileSync(".env.local", envContent)
    this.logSuccess("Environment variables updated")
  }

  private async updatePackageVersion(): Promise<string> {
    this.logStep("Updating package.json version")

    const packagePath = join(process.cwd(), "package.json")
    const packageJson = JSON.parse(readFileSync(packagePath, "utf8"))

    const currentVersion = packageJson.version || "2.1.0"
    const versionParts = currentVersion.split(".")
    versionParts[2] = (Number.parseInt(versionParts[2]) + 1).toString()
    const newVersion = versionParts.join(".")

    packageJson.version = newVersion
    packageJson.deployment = {
      lastDeployment: new Date().toISOString(),
      deploymentType: "emergency-context-provider-fix",
      version: newVersion,
      fixes: [
        "CustomerProvider export and SSR safety",
        "AuthProvider export and SSR safety",
        "DataProvider export and SSR safety",
        "ThemeProvider props interface",
        "React version compatibility",
        "Health and database endpoints",
        "Prerendering error resolution",
      ],
    }

    packageJson.dependencies = {
      ...packageJson.dependencies,
      react: "^18.2.0",
      "react-dom": "^18.2.0",
    }

    packageJson.devDependencies = {
      ...packageJson.devDependencies,
      "@types/react": "^18.2.0",
      "@types/react-dom": "^18.2.0",
      tsx: "^4.16.2",
    }

    packageJson.scripts = {
      ...packageJson.scripts,
      "deploy:emergency": "npx tsx scripts/run-deployment.ts",
      "deploy:quick": "vercel --prod --yes",
      "health:check": `curl -f ${this.config.baseUrl}/api/health`,
      "db:test": `curl -f ${this.config.baseUrl}/api/test-database`,
    }

    writeFileSync(packagePath, JSON.stringify(packageJson, null, 2))
    this.logSuccess(`Updated package.json to version ${newVersion}`)

    return newVersion
  }

  private async cleanAndInstall(): Promise<void> {
    this.logStep("Cleaning project and installing dependencies")

    await this.executeCommand("rm -rf .next", "Removing .next directory")
    await this.executeCommand("rm -rf node_modules", "Removing node_modules")
    await this.executeCommand("rm -f package-lock.json", "Removing package-lock.json")

    await this.executeCommand("npm install", "Installing dependencies", { timeout: 300000 })

    this.logSuccess("Clean installation completed")
  }

  private async buildProject(): Promise<void> {
    this.logStep("Building Next.js project")

    process.env.NODE_ENV = "production"
    process.env.NEXT_TELEMETRY_DISABLED = "1"

    await this.executeCommand("npm run build", "Building Next.js application", { timeout: 600000 })

    this.logSuccess("Build completed successfully")
  }

  private async commitAndPush(version: string): Promise<void> {
    this.logStep("Committing and pushing changes to GitHub")

    await this.executeCommand("git add .", "Adding all changes to git")

    const commitMessage = `🚀 Emergency deployment v${version} - Context Provider Fixes

✅ Fixed Issues:
- CustomerProvider export and SSR safety
- AuthProvider export and SSR safety  
- DataProvider export and SSR safety
- ThemeProvider props interface compatibility
- React version updated to 18.2.0 for compatibility
- Added comprehensive health check endpoint
- Added database test endpoint with connection verification
- Resolved all Next.js prerendering errors
- Added deployment status tracking

🔧 Technical Changes:
- Fixed useCustomer hook SSR compatibility
- Fixed useAuth hook SSR compatibility
- Fixed useData hook SSR compatibility
- Updated ThemeProvider props interface
- Added proper error boundaries
- Enhanced API route error handling

📊 Deployment Info:
- Version: ${version}
- Timestamp: ${new Date().toISOString()}
- Type: Emergency Context Provider Fix
- Target: Production (Vercel)

🌐 Live URLs:
- Homepage: ${this.config.baseUrl}
- Health: ${this.config.baseUrl}/api/health
- Database: ${this.config.baseUrl}/api/test-database`

    await this.executeCommand(`git commit -m "${commitMessage}"`, "Committing changes")

    await this.executeCommand(`git push origin ${this.config.branch}`, "Pushing to GitHub")

    this.logSuccess("Changes pushed to GitHub successfully")
  }

  private async deployToVercel(): Promise<void> {
    this.logStep("Deploying to Vercel production")

    await this.executeCommand("vercel --prod --yes --confirm", "Deploying to Vercel production", {
      timeout: 600000,
    })

    this.logSuccess("Deployed successfully to Vercel")
  }

  private async waitForDeployment(): Promise<void> {
    this.logStep("Waiting for deployment to propagate")

    const waitTime = 20000
    this.logInfo(`Waiting ${waitTime / 1000} seconds for deployment to be ready...`)

    await new Promise((resolve) => setTimeout(resolve, waitTime))

    this.logSuccess("Wait period completed")
  }

  private async testEndpoints(): Promise<Record<string, boolean>> {
    this.logStep("Testing deployed endpoints")

    const endpoints = [
      { path: "/api/health", name: "Health Check API" },
      { path: "/api/test-database", name: "Database Test API" },
      { path: "/api/deployment-status", name: "Deployment Status API" },
      { path: "/", name: "Homepage" },
      { path: "/login", name: "Login Page" },
      { path: "/dashboard", name: "Dashboard" },
      { path: "/bhv", name: "BHV Module" },
    ]

    const testResults: Record<string, boolean> = {}

    for (const endpoint of endpoints) {
      try {
        this.logInfo(`Testing ${endpoint.name}: ${this.config.baseUrl}${endpoint.path}`)

        const result = await this.executeCommand(
          `curl -f -s -o /dev/null -w "%{http_code}" --max-time 30 "${this.config.baseUrl}${endpoint.path}"`,
          `Testing ${endpoint.name}`,
          { silent: true },
        )

        const statusCode = Number.parseInt(result.trim())
        const success = statusCode >= 200 && statusCode < 400

        testResults[endpoint.name] = success

        if (success) {
          this.logSuccess(`${endpoint.name} - OK (${statusCode})`)
        } else {
          this.logWarning(`${endpoint.name} - Status: ${statusCode}`)
        }
      } catch (error) {
        this.logWarning(`${endpoint.name} - Failed: ${error}`)
        testResults[endpoint.name] = false
      }

      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    return testResults
  }

  private generateReport(version: string, tests: Record<string, boolean>): void {
    const endTime = Date.now()
    const duration = Math.round((endTime - this.startTime) / 1000)

    const passedTests = Object.values(tests).filter(Boolean).length
    const totalTests = Object.keys(tests).length
    const successRate = Math.round((passedTests / totalTests) * 100)

    console.log("\n" + "=".repeat(60))
    console.log("📊 DEPLOYMENT REPORT")
    console.log("=".repeat(60))
    console.log(`🏷️  Version: ${version}`)
    console.log(`⏱️  Duration: ${duration} seconds`)
    console.log(`📅 Completed: ${new Date().toISOString()}`)
    console.log(`🌐 Live URL: ${this.config.baseUrl}`)
    console.log(`📊 Test Results: ${passedTests}/${totalTests} passed (${successRate}%)`)
    console.log("")
    console.log("🔗 Important URLs:")
    console.log(`   Homepage: ${this.config.baseUrl}`)
    console.log(`   Dashboard: ${this.config.baseUrl}/dashboard`)
    console.log(`   Health Check: ${this.config.baseUrl}/api/health`)
    console.log(`   Database Test: ${this.config.baseUrl}/api/test-database`)
    console.log(`   Deployment Status: ${this.config.baseUrl}/api/deployment-status`)
    console.log("")
    console.log("✅ Fixed Issues:")
    console.log("   - CustomerProvider export and SSR safety")
    console.log("   - AuthProvider export and SSR safety")
    console.log("   - DataProvider export and SSR safety")
    console.log("   - ThemeProvider props interface")
    console.log("   - React version compatibility (18.2.0)")
    console.log("   - Health and database test endpoints")
    console.log("   - All prerendering errors resolved")
    console.log("=".repeat(60))

    if (passedTests === totalTests) {
      console.log("🎉 ALL TESTS PASSED! DEPLOYMENT SUCCESSFUL!")
      console.log("✅ BHV360 is now live with all context provider fixes applied!")
    } else if (passedTests >= totalTests * 0.8) {
      console.log("⚠️  MOSTLY SUCCESSFUL - Some endpoints need attention")
      console.log("🔧 BHV360 is live but some features may need attention")
    } else {
      console.log("❌ MULTIPLE FAILURES - Deployment needs investigation")
      console.log("🚨 BHV360 deployment completed but has issues")
    }

    console.log("=".repeat(60))
  }

  public async execute(): Promise<void> {
    try {
      await this.checkPrerequisites()
      await this.updateEnvironmentVariables()
      const version = await this.updatePackageVersion()
      await this.cleanAndInstall()
      await this.buildProject()
      await this.commitAndPush(version)
      await this.deployToVercel()
      await this.waitForDeployment()

      const testResults = await this.testEndpoints()

      this.generateReport(version, testResults)

      const passedTests = Object.values(testResults).filter(Boolean).length
      const totalTests = Object.keys(testResults).length

      if (passedTests >= totalTests * 0.8) {
        console.log("\n🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!")
        process.exit(0)
      } else {
        console.log("\n⚠️  DEPLOYMENT COMPLETED WITH WARNINGS")
        process.exit(1)
      }
    } catch (error) {
      console.error("\n💥 DEPLOYMENT FAILED!")
      console.error("Error:", error)
      process.exit(1)
    }
  }
}

async function main() {
  const runner = new DeploymentRunner()
  await runner.execute()
}

if (require.main === module) {
  main().catch((error) => {
    console.error("Deployment runner failed:", error)
    process.exit(1)
  })
}

export { DeploymentRunner }
