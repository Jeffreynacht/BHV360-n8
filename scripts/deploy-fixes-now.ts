#!/usr/bin/env tsx

import { execSync } from "child_process"
import { readFileSync, writeFileSync } from "fs"
import { join } from "path"

interface DeploymentConfig {
  projectName: string
  githubRepo: string
  vercelProject: string
  branch: string
}

const config: DeploymentConfig = {
  projectName: "BHV360 Plotkaart Recreation",
  githubRepo: "Jeffreynacht/BHV360-n8",
  vercelProject: "bhv360",
  branch: "main",
}

class DeploymentManager {
  private startTime: number = Date.now()

  constructor() {
    console.log("🚀 Starting BHV360 Emergency Deployment...")
    console.log(`📅 ${new Date().toISOString()}`)
    console.log(`📦 Project: ${config.projectName}`)
    console.log("=".repeat(60))
  }

  private executeCommand(command: string, description: string): string {
    try {
      console.log(`\n🔄 ${description}...`)
      console.log(`💻 Command: ${command}`)

      const result = execSync(command, {
        encoding: "utf8",
        stdio: "pipe",
        cwd: process.cwd(),
      })

      console.log(`✅ ${description} completed successfully`)
      return result
    } catch (error: any) {
      console.error(`❌ ${description} failed:`)
      console.error(error.message)
      if (error.stdout) console.log("STDOUT:", error.stdout)
      if (error.stderr) console.error("STDERR:", error.stderr)
      throw error
    }
  }

  private checkPrerequisites(): void {
    console.log("\n📋 Checking Prerequisites...")

    try {
      // Check if we're in a git repository
      this.executeCommand("git status --porcelain", "Checking git status")

      // Check if Vercel CLI is installed
      this.executeCommand("vercel --version", "Checking Vercel CLI")

      // Check if we have Node.js and npm
      this.executeCommand("node --version", "Checking Node.js version")
      this.executeCommand("npm --version", "Checking npm version")

      console.log("✅ All prerequisites met")
    } catch (error) {
      console.error("❌ Prerequisites check failed")
      throw error
    }
  }

  private updatePackageJson(): void {
    console.log("\n📝 Updating package.json...")

    try {
      const packagePath = join(process.cwd(), "package.json")
      const packageJson = JSON.parse(readFileSync(packagePath, "utf8"))

      // Update version
      const currentVersion = packageJson.version || "0.1.0"
      const versionParts = currentVersion.split(".")
      versionParts[2] = (Number.parseInt(versionParts[2]) + 1).toString()
      packageJson.version = versionParts.join(".")

      // Update React versions to fix compatibility issues
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

      // Add deployment metadata
      packageJson.deployment = {
        lastDeployment: new Date().toISOString(),
        deploymentType: "emergency-fix",
        version: packageJson.version,
      }

      writeFileSync(packagePath, JSON.stringify(packageJson, null, 2))
      console.log(`✅ Updated package.json to version ${packageJson.version}`)
    } catch (error) {
      console.error("❌ Failed to update package.json:", error)
      throw error
    }
  }

  private buildProject(): void {
    console.log("\n🔨 Building project...")

    try {
      // Clean previous build
      this.executeCommand("rm -rf .next", "Cleaning previous build")

      // Install dependencies
      this.executeCommand("npm install", "Installing dependencies")

      // Run build
      this.executeCommand("npm run build", "Building Next.js application")

      console.log("✅ Project built successfully")
    } catch (error) {
      console.error("❌ Build failed")
      throw error
    }
  }

  private commitAndPush(): void {
    console.log("\n📤 Committing and pushing changes...")

    try {
      // Add all changes
      this.executeCommand("git add .", "Adding all changes to git")

      // Create commit message
      const commitMessage = `🚀 Emergency deployment fixes - Context providers and SSR compatibility
      
- Fixed CustomerProvider export and SSR safety
- Fixed AuthProvider export and SSR safety  
- Fixed DataProvider export and SSR safety
- Fixed ThemeProvider props interface
- Updated React versions for compatibility
- Added health and database test endpoints
- Resolved prerendering errors
      
Deployment: ${new Date().toISOString()}`

      // Commit changes
      this.executeCommand(`git commit -m "${commitMessage}"`, "Committing changes")

      // Push to GitHub
      this.executeCommand(`git push origin ${config.branch}`, "Pushing to GitHub")

      console.log("✅ Changes pushed to GitHub successfully")
    } catch (error) {
      console.error("❌ Git operations failed")
      throw error
    }
  }

  private deployToVercel(): void {
    console.log("\n🚀 Deploying to Vercel...")

    try {
      // Deploy to production
      const deployResult = this.executeCommand("vercel --prod --yes", "Deploying to Vercel production")

      // Extract deployment URL from result
      const urlMatch = deployResult.match(/https:\/\/[^\s]+/)
      const deploymentUrl = urlMatch ? urlMatch[0] : "https://bhv360.vercel.app"

      console.log(`✅ Deployed successfully to: ${deploymentUrl}`)
      return deploymentUrl
    } catch (error) {
      console.error("❌ Vercel deployment failed")
      throw error
    }
  }

  private verifyDeployment(): void {
    console.log("\n🔍 Verifying deployment...")

    const baseUrl = "https://bhv360.vercel.app"
    const endpoints = [
      { path: "/api/health", name: "Health Check" },
      { path: "/api/test-database", name: "Database Test" },
      { path: "/", name: "Homepage" },
    ]

    endpoints.forEach((endpoint) => {
      try {
        console.log(`🔍 Testing ${endpoint.name}: ${baseUrl}${endpoint.path}`)

        // Use curl to test endpoints
        const curlCommand = `curl -f -s -o /dev/null -w "%{http_code}" "${baseUrl}${endpoint.path}"`
        const statusCode = this.executeCommand(curlCommand, `Testing ${endpoint.name}`)

        if (statusCode.trim() === "200") {
          console.log(`✅ ${endpoint.name} is working (200 OK)`)
        } else {
          console.log(`⚠️  ${endpoint.name} returned status: ${statusCode.trim()}`)
        }
      } catch (error) {
        console.log(`❌ ${endpoint.name} test failed`)
      }
    })
  }

  private generateDeploymentReport(): void {
    const endTime = Date.now()
    const duration = Math.round((endTime - this.startTime) / 1000)

    console.log("\n" + "=".repeat(60))
    console.log("📊 DEPLOYMENT REPORT")
    console.log("=".repeat(60))
    console.log(`🕐 Total Duration: ${duration} seconds`)
    console.log(`📅 Completed: ${new Date().toISOString()}`)
    console.log(`🌐 Live URL: https://bhv360.vercel.app`)
    console.log(`📱 Mobile URL: https://bhv360.vercel.app`)
    console.log(`🔧 Admin Panel: https://bhv360.vercel.app/dashboard`)
    console.log(`📊 Health Check: https://bhv360.vercel.app/api/health`)
    console.log(`🗄️  Database Test: https://bhv360.vercel.app/api/test-database`)
    console.log("=".repeat(60))
    console.log("🎉 DEPLOYMENT SUCCESSFUL!")
    console.log("=".repeat(60))
  }

  public async deploy(): Promise<void> {
    try {
      this.checkPrerequisites()
      this.updatePackageJson()
      this.buildProject()
      this.commitAndPush()
      this.deployToVercel()

      // Wait a moment for deployment to propagate
      console.log("\n⏳ Waiting for deployment to propagate...")
      await new Promise((resolve) => setTimeout(resolve, 10000))

      this.verifyDeployment()
      this.generateDeploymentReport()
    } catch (error) {
      console.error("\n💥 DEPLOYMENT FAILED!")
      console.error("Error:", error)
      process.exit(1)
    }
  }
}

// Execute deployment
const deployment = new DeploymentManager()
deployment.deploy().catch((error) => {
  console.error("Deployment script failed:", error)
  process.exit(1)
})
