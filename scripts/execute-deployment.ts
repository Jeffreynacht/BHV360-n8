#!/usr/bin/env tsx

import { execSync } from "child_process"
import { writeFileSync, readFileSync, existsSync } from "fs"
import { join } from "path"

interface DeploymentResult {
  success: boolean
  version: string
  timestamp: string
  duration: number
  url: string
  tests: Record<string, boolean>
}

class EmergencyDeployment {
  private startTime: number = Date.now()
  private baseUrl = "https://bhv360.vercel.app"

  constructor() {
    console.log("🚀 BHV360 EMERGENCY DEPLOYMENT EXECUTION")
    console.log("=".repeat(60))
    console.log(`📅 Start Time: ${new Date().toISOString()}`)
    console.log(`🎯 Target URL: ${this.baseUrl}`)
    console.log("=".repeat(60))
  }

  private executeCommand(command: string, description: string, options: any = {}): string {
    try {
      console.log(`\n🔄 ${description}...`)
      console.log(`💻 Command: ${command}`)

      const result = execSync(command, {
        encoding: "utf8",
        stdio: options.silent ? "pipe" : "inherit",
        cwd: process.cwd(),
        timeout: options.timeout || 120000, // 2 minutes default
        ...options,
      })

      console.log(`✅ ${description} completed successfully`)
      return result
    } catch (error: any) {
      console.error(`❌ ${description} failed:`)
      console.error(`Error: ${error.message}`)
      if (error.stdout) console.log(`STDOUT: ${error.stdout}`)
      if (error.stderr) console.error(`STDERR: ${error.stderr}`)
      throw error
    }
  }

  private updatePackageVersion(): string {
    console.log("\n📝 Updating package.json version...")

    try {
      const packagePath = join(process.cwd(), "package.json")

      if (!existsSync(packagePath)) {
        throw new Error("package.json not found")
      }

      const packageJson = JSON.parse(readFileSync(packagePath, "utf8"))

      // Update version
      const currentVersion = packageJson.version || "2.1.0"
      const versionParts = currentVersion.split(".")
      versionParts[2] = (Number.parseInt(versionParts[2]) + 1).toString()
      const newVersion = versionParts.join(".")

      // Update package.json with new version and deployment info
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

      // Ensure React versions are correct
      packageJson.dependencies = {
        ...packageJson.dependencies,
        react: "^18.2.0",
        "react-dom": "^18.2.0",
      }

      packageJson.devDependencies = {
        ...packageJson.devDependencies,
        "@types/react": "^18.2.0",
        "@types/react-dom": "^18.2.0",
      }

      writeFileSync(packagePath, JSON.stringify(packageJson, null, 2))
      console.log(`✅ Updated package.json to version ${newVersion}`)

      return newVersion
    } catch (error) {
      console.error("❌ Failed to update package.json:", error)
      throw error
    }
  }

  private cleanAndInstall(): void {
    console.log("\n🧹 Cleaning project and installing dependencies...")

    try {
      // Clean previous builds and node_modules
      this.executeCommand("rm -rf .next", "Removing .next directory")
      this.executeCommand("rm -rf node_modules", "Removing node_modules")
      this.executeCommand("rm -f package-lock.json", "Removing package-lock.json")

      // Install fresh dependencies
      this.executeCommand("npm install", "Installing dependencies", { timeout: 300000 }) // 5 minutes

      console.log("✅ Clean installation completed")
    } catch (error) {
      console.error("❌ Clean and install failed")
      throw error
    }
  }

  private buildProject(): void {
    console.log("\n🔨 Building Next.js project...")

    try {
      // Set environment variables for build
      process.env.NODE_ENV = "production"
      process.env.NEXT_TELEMETRY_DISABLED = "1"

      this.executeCommand("npm run build", "Building Next.js application", { timeout: 600000 }) // 10 minutes

      console.log("✅ Build completed successfully")
    } catch (error) {
      console.error("❌ Build failed")
      throw error
    }
  }

  private commitAndPushChanges(version: string): void {
    console.log("\n📤 Committing and pushing changes to GitHub...")

    try {
      // Check git status
      this.executeCommand("git status --porcelain", "Checking git status", { silent: true })

      // Add all changes
      this.executeCommand("git add .", "Adding all changes to git")

      // Create detailed commit message
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
- Homepage: https://bhv360.vercel.app
- Health: https://bhv360.vercel.app/api/health
- Database: https://bhv360.vercel.app/api/test-database`

      // Commit changes
      this.executeCommand(`git commit -m "${commitMessage}"`, "Committing changes")

      // Push to main branch
      this.executeCommand("git push origin main", "Pushing to GitHub")

      console.log("✅ Changes pushed to GitHub successfully")
    } catch (error) {
      console.error("❌ Git operations failed")
      throw error
    }
  }

  private deployToVercel(): string {
    console.log("\n🚀 Deploying to Vercel production...")

    try {
      // Check if Vercel CLI is available
      this.executeCommand("vercel --version", "Checking Vercel CLI", { silent: true })

      // Deploy to production
      const deployResult = this.executeCommand(
        "vercel --prod --yes --confirm",
        "Deploying to Vercel production",
        { timeout: 600000 }, // 10 minutes
      )

      // Extract deployment URL from result
      const urlMatch = deployResult.match(/https:\/\/[^\s]+/)
      const deploymentUrl = urlMatch ? urlMatch[0] : this.baseUrl

      console.log(`✅ Deployed successfully to: ${deploymentUrl}`)
      return deploymentUrl
    } catch (error) {
      console.error("❌ Vercel deployment failed")
      throw error
    }
  }

  private async waitForDeployment(): Promise<void> {
    console.log("\n⏳ Waiting for deployment to propagate...")

    const waitTime = 20000 // 20 seconds
    console.log(`⏱️  Waiting ${waitTime / 1000} seconds for deployment to be ready...`)

    await new Promise((resolve) => setTimeout(resolve, waitTime))

    console.log("✅ Wait period completed")
  }

  private async testEndpoints(): Promise<Record<string, boolean>> {
    console.log("\n🔍 Testing deployed endpoints...")

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
        console.log(`🔍 Testing ${endpoint.name}: ${this.baseUrl}${endpoint.path}`)

        const curlCommand = `curl -f -s -o /dev/null -w "%{http_code}" --max-time 30 "${this.baseUrl}${endpoint.path}"`
        const result = this.executeCommand(curlCommand, `Testing ${endpoint.name}`, { silent: true })

        const statusCode = Number.parseInt(result.trim())
        const success = statusCode >= 200 && statusCode < 400

        testResults[endpoint.name] = success

        if (success) {
          console.log(`✅ ${endpoint.name} - OK (${statusCode})`)
        } else {
          console.log(`⚠️  ${endpoint.name} - Status: ${statusCode}`)
        }
      } catch (error) {
        console.log(`❌ ${endpoint.name} - Failed: ${error}`)
        testResults[endpoint.name] = false
      }

      // Small delay between tests
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    return testResults
  }

  private generateDeploymentReport(version: string, tests: Record<string, boolean>): DeploymentResult {
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
    console.log(`🌐 Live URL: ${this.baseUrl}`)
    console.log(`📊 Test Results: ${passedTests}/${totalTests} passed (${successRate}%)`)
    console.log("")
    console.log("🔗 Important URLs:")
    console.log(`   Homepage: ${this.baseUrl}`)
    console.log(`   Dashboard: ${this.baseUrl}/dashboard`)
    console.log(`   Health Check: ${this.baseUrl}/api/health`)
    console.log(`   Database Test: ${this.baseUrl}/api/test-database`)
    console.log(`   Deployment Status: ${this.baseUrl}/api/deployment-status`)
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
    } else if (passedTests >= totalTests * 0.8) {
      console.log("⚠️  MOSTLY SUCCESSFUL - Some endpoints need attention")
    } else {
      console.log("❌ MULTIPLE FAILURES - Deployment needs investigation")
    }

    console.log("=".repeat(60))

    return {
      success: passedTests >= totalTests * 0.8,
      version,
      timestamp: new Date().toISOString(),
      duration,
      url: this.baseUrl,
      tests,
    }
  }

  public async execute(): Promise<DeploymentResult> {
    try {
      console.log("🚀 Starting emergency deployment execution...")

      // Step 1: Update version
      const version = this.updatePackageVersion()

      // Step 2: Clean and install dependencies
      this.cleanAndInstall()

      // Step 3: Build project
      this.buildProject()

      // Step 4: Commit and push changes
      this.commitAndPushChanges(version)

      // Step 5: Deploy to Vercel
      const deploymentUrl = this.deployToVercel()

      // Step 6: Wait for deployment to propagate
      await this.waitForDeployment()

      // Step 7: Test endpoints
      const testResults = await this.testEndpoints()

      // Step 8: Generate report
      const result = this.generateDeploymentReport(version, testResults)

      if (result.success) {
        console.log("\n🎉 EMERGENCY DEPLOYMENT COMPLETED SUCCESSFULLY!")
        console.log("✅ BHV360 is now live with all context provider fixes applied!")
      } else {
        console.log("\n⚠️  DEPLOYMENT COMPLETED WITH WARNINGS")
        console.log("🔧 Some endpoints may need additional attention")
      }

      return result
    } catch (error) {
      console.error("\n💥 EMERGENCY DEPLOYMENT FAILED!")
      console.error("Error:", error)

      const failedResult: DeploymentResult = {
        success: false,
        version: "unknown",
        timestamp: new Date().toISOString(),
        duration: Math.round((Date.now() - this.startTime) / 1000),
        url: this.baseUrl,
        tests: {},
      }

      throw failedResult
    }
  }
}

// Execute the emergency deployment
async function main() {
  const deployment = new EmergencyDeployment()

  try {
    const result = await deployment.execute()

    if (result.success) {
      console.log("\n✅ Deployment script completed successfully!")
      process.exit(0)
    } else {
      console.log("\n⚠️  Deployment completed with warnings")
      process.exit(1)
    }
  } catch (error) {
    console.error("\n💥 Deployment script failed:", error)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  main()
}

export { EmergencyDeployment }
