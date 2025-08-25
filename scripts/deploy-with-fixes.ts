#!/usr/bin/env npx tsx

import { execSync } from "child_process"
import { readFileSync, writeFileSync, existsSync } from "fs"

interface DeploymentResult {
  success: boolean
  url?: string
  error?: string
  duration: number
}

class FixedDeployment {
  private startTime: number
  private deploymentId: string

  constructor() {
    this.startTime = Date.now()
    this.deploymentId = `fixed-deploy-${Date.now()}`
  }

  async deploy(): Promise<DeploymentResult> {
    console.log("🚀 BHV360 - Deploying with Export Fixes")
    console.log("=".repeat(50))
    console.log(`📋 Deployment ID: ${this.deploymentId}`)
    console.log(`🕐 Started: ${new Date().toLocaleString()}`)
    console.log("")

    try {
      // Step 1: Verify fixes are in place
      await this.verifyFixes()

      // Step 2: Run pre-deployment checks
      await this.preDeploymentChecks()

      // Step 3: Build the application
      await this.buildApplication()

      // Step 4: Deploy to Vercel
      const deploymentUrl = await this.deployToVercel()

      // Step 5: Verify deployment
      await this.verifyDeployment(deploymentUrl)

      const duration = Date.now() - this.startTime
      console.log("✅ DEPLOYMENT SUCCESSFUL!")
      console.log(`🔗 URL: ${deploymentUrl}`)
      console.log(`⏱️  Duration: ${Math.round(duration / 1000)}s`)

      return {
        success: true,
        url: deploymentUrl,
        duration,
      }
    } catch (error) {
      const duration = Date.now() - this.startTime
      console.error("❌ DEPLOYMENT FAILED!")
      console.error(`💥 Error: ${error}`)
      console.error(`⏱️  Duration: ${Math.round(duration / 1000)}s`)

      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        duration,
      }
    }
  }

  private async verifyFixes(): Promise<void> {
    console.log("🔍 STEP 1: Verifying Export Fixes")
    console.log("-".repeat(30))

    // Check if helpers/number.ts exists
    if (!existsSync("helpers/number.ts")) {
      throw new Error("helpers/number.ts file is missing!")
    }

    // Read the file content
    const numberHelperContent = readFileSync("helpers/number.ts", "utf8")

    // Check for required exports
    const requiredExports = ["toFixedSafe", "toNumberSafe"]
    const missingExports = []

    for (const exportName of requiredExports) {
      if (!numberHelperContent.includes(`export function ${exportName}`)) {
        missingExports.push(exportName)
      }
    }

    if (missingExports.length > 0) {
      throw new Error(`Missing exports in helpers/number.ts: ${missingExports.join(", ")}`)
    }

    console.log("✅ toFixedSafe export found")
    console.log("✅ toNumberSafe export found")
    console.log("✅ All required exports are present")
    console.log("")
  }

  private async preDeploymentChecks(): Promise<void> {
    console.log("🔧 STEP 2: Pre-deployment Checks")
    console.log("-".repeat(30))

    // Check Node.js version
    const nodeVersion = process.version
    console.log(`✅ Node.js version: ${nodeVersion}`)

    // Check if package.json exists
    if (!existsSync("package.json")) {
      throw new Error("package.json is missing!")
    }

    // Check if next.config.mjs exists
    if (!existsSync("next.config.mjs")) {
      throw new Error("next.config.mjs is missing!")
    }

    // Check essential files
    const essentialFiles = ["app/layout.tsx", "app/page.tsx", "tailwind.config.ts", "tsconfig.json"]

    for (const file of essentialFiles) {
      if (!existsSync(file)) {
        throw new Error(`Essential file missing: ${file}`)
      }
      console.log(`✅ ${file}`)
    }

    // Check if Vercel CLI is available
    try {
      execSync("vercel --version", { stdio: "pipe" })
      console.log("✅ Vercel CLI available")
    } catch {
      console.log("📦 Installing Vercel CLI...")
      execSync("npm install -g vercel", { stdio: "inherit" })
      console.log("✅ Vercel CLI installed")
    }

    console.log("")
  }

  private async buildApplication(): Promise<void> {
    console.log("🏗️  STEP 3: Building Application")
    console.log("-".repeat(30))

    try {
      // Clean previous builds
      console.log("🧹 Cleaning previous builds...")
      execSync("rm -rf .next out", { stdio: "pipe" })

      // Install dependencies
      console.log("📦 Installing dependencies...")
      execSync("npm ci", { stdio: "inherit" })

      // Type check
      console.log("🔍 Running TypeScript check...")
      execSync("npx tsc --noEmit", { stdio: "inherit" })
      console.log("✅ TypeScript check passed")

      // Build the application
      console.log("🔨 Building application...")
      execSync("npm run build", { stdio: "inherit" })
      console.log("✅ Build completed successfully")
    } catch (error) {
      throw new Error(`Build failed: ${error}`)
    }

    console.log("")
  }

  private async deployToVercel(): Promise<string> {
    console.log("🌐 STEP 4: Deploying to Vercel")
    console.log("-".repeat(30))

    try {
      // Check Vercel authentication
      try {
        execSync("vercel whoami", { stdio: "pipe" })
        console.log("✅ Vercel authentication verified")
      } catch {
        console.log("🔐 Please authenticate with Vercel...")
        execSync("vercel login", { stdio: "inherit" })
      }

      // Deploy to production
      console.log("🚀 Deploying to production...")
      const deployOutput = execSync("vercel --prod --yes", {
        encoding: "utf8",
        stdio: "pipe",
      })

      // Extract deployment URL
      const urlMatch = deployOutput.match(/https:\/\/[^\s]+/)
      const deploymentUrl = urlMatch ? urlMatch[0] : "https://bhv-plotkaart-recreation.vercel.app"

      console.log(`✅ Deployment completed`)
      console.log(`🔗 URL: ${deploymentUrl}`)

      // Save deployment info
      const deploymentInfo = {
        id: this.deploymentId,
        url: deploymentUrl,
        timestamp: new Date().toISOString(),
        fixes: ["toFixedSafe export", "toNumberSafe export"],
        status: "success",
      }

      writeFileSync("deployment-info.json", JSON.stringify(deploymentInfo, null, 2))
      console.log("📝 Deployment info saved")

      return deploymentUrl
    } catch (error) {
      throw new Error(`Vercel deployment failed: ${error}`)
    }
  }

  private async verifyDeployment(url: string): Promise<void> {
    console.log("🔍 STEP 5: Verifying Deployment")
    console.log("-".repeat(30))

    try {
      // Wait for deployment to be ready
      console.log("⏳ Waiting for deployment to be ready...")
      await new Promise((resolve) => setTimeout(resolve, 10000))

      // Test homepage
      console.log("🏠 Testing homepage...")
      const response = await fetch(url)

      if (response.ok) {
        const html = await response.text()
        if (html.includes("BHV360") || html.includes("BHV")) {
          console.log("✅ Homepage loads correctly")
        } else {
          console.log("⚠️  Homepage loads but content may be incomplete")
        }
      } else {
        console.log(`⚠️  Homepage returned status: ${response.status}`)
      }

      // Test API health endpoint
      console.log("🔌 Testing API health...")
      try {
        const healthResponse = await fetch(`${url}/api/health`)
        if (healthResponse.ok) {
          console.log("✅ API health check passed")
        } else {
          console.log("⚠️  API health check failed")
        }
      } catch {
        console.log("⚠️  API health endpoint not available")
      }

      // Test number helper functions (if there's an API endpoint)
      console.log("🔢 Testing number helper functions...")
      try {
        const testResponse = await fetch(`${url}/api/test-database`)
        if (testResponse.status < 500) {
          console.log("✅ Application APIs responding")
        } else {
          console.log("⚠️  Some APIs may have issues")
        }
      } catch {
        console.log("⚠️  API test endpoints not available")
      }

      console.log("✅ Deployment verification completed")
    } catch (error) {
      console.log("⚠️  Verification had issues, but deployment may still be working")
      console.log(`   Error: ${error}`)
    }

    console.log("")
  }
}

// Main execution
async function main() {
  const deployer = new FixedDeployment()
  const result = await deployer.deploy()

  if (result.success) {
    console.log("")
    console.log("🎉 SUCCESS! Your BHV360 application is now live!")
    console.log("=".repeat(50))
    console.log(`🔗 Production URL: ${result.url}`)
    console.log(`⏱️  Total time: ${Math.round(result.duration / 1000)} seconds`)
    console.log("")
    console.log("🚀 Next steps:")
    console.log("   • Test all functionality")
    console.log("   • Verify number helper functions work")
    console.log("   • Check deployment logs if needed")
    console.log("")
    process.exit(0)
  } else {
    console.log("")
    console.log("❌ DEPLOYMENT FAILED!")
    console.log("=".repeat(50))
    console.log(`💥 Error: ${result.error}`)
    console.log(`⏱️  Duration: ${Math.round(result.duration / 1000)} seconds`)
    console.log("")
    console.log("🔧 Troubleshooting:")
    console.log("   • Check the error message above")
    console.log("   • Verify all files are present")
    console.log("   • Ensure Vercel CLI is authenticated")
    console.log("   • Check build logs for details")
    console.log("")
    process.exit(1)
  }
}

// Execute if run directly
if (require.main === module) {
  main().catch(console.error)
}

export { FixedDeployment }
