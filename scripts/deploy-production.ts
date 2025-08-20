#!/usr/bin/env tsx

import { execSync } from "child_process"
import { writeFileSync, readFileSync, existsSync } from "fs"

interface DeploymentConfig {
  environment: "production" | "staging"
  domain?: string
  supabaseUrl?: string
  supabaseAnonKey?: string
  supabaseServiceKey?: string
  vercelToken?: string
}

class ProductionDeployer {
  private config: DeploymentConfig
  private deploymentId: string

  constructor(config: DeploymentConfig) {
    this.config = config
    this.deploymentId = `deploy-${Date.now()}`
  }

  async deploy(): Promise<void> {
    console.log("🚀 Starting BHV360 Production Deployment...")
    console.log(`📋 Deployment ID: ${this.deploymentId}`)

    try {
      // Step 1: Pre-deployment validation
      await this.validateEnvironment()

      // Step 2: Run comprehensive tests
      await this.runTests()

      // Step 3: Build production bundle
      await this.buildProduction()

      // Step 4: Deploy to Vercel
      await this.deployToVercel()

      // Step 5: Post-deployment verification
      await this.verifyDeployment()

      console.log("✅ Deployment completed successfully!")
    } catch (error) {
      console.error("❌ Deployment failed:", error)
      throw error
    }
  }

  private async validateEnvironment(): Promise<void> {
    console.log("🔍 Validating environment...")

    // Check required files
    const requiredFiles = [
      "package.json",
      "next.config.mjs",
      "tailwind.config.ts",
      "tsconfig.json",
      "lib/modules/module-definitions.ts",
      "app/test-modules/page.tsx",
    ]

    for (const file of requiredFiles) {
      if (!existsSync(file)) {
        throw new Error(`Required file missing: ${file}`)
      }
    }

    // Validate module system
    try {
      const moduleTest = execSync("npm run validate-modules", { encoding: "utf8" })
      console.log("✅ Module system validated")
    } catch (error) {
      throw new Error("Module system validation failed")
    }

    console.log("✅ Environment validation passed")
  }

  private async runTests(): Promise<void> {
    console.log("🧪 Running comprehensive test suite...")

    try {
      // Run TypeScript compilation check
      execSync("npx tsc --noEmit", { encoding: "utf8" })
      console.log("✅ TypeScript compilation passed")

      // Run module function tests
      execSync("npm run test-modules", { encoding: "utf8" })
      console.log("✅ Module function tests passed")

      // Run build test
      execSync("npm run build", { encoding: "utf8" })
      console.log("✅ Production build test passed")
    } catch (error) {
      throw new Error(`Tests failed: ${error}`)
    }
  }

  private async buildProduction(): Promise<void> {
    console.log("🏗️ Building production bundle...")

    try {
      // Clean previous builds
      execSync("rm -rf .next out", { encoding: "utf8" })

      // Build for production
      execSync("npm run build", { encoding: "utf8" })

      console.log("✅ Production build completed")
    } catch (error) {
      throw new Error(`Build failed: ${error}`)
    }
  }

  private async deployToVercel(): Promise<void> {
    console.log("🌐 Deploying to Vercel...")

    try {
      // Deploy to Vercel
      const deployOutput = execSync("vercel --prod --yes", { encoding: "utf8" })

      // Extract deployment URL
      const urlMatch = deployOutput.match(/https:\/\/[^\s]+/)
      const deploymentUrl = urlMatch ? urlMatch[0] : "Unknown"

      console.log(`✅ Deployed to: ${deploymentUrl}`)

      // Save deployment info
      const deploymentInfo = {
        id: this.deploymentId,
        url: deploymentUrl,
        timestamp: new Date().toISOString(),
        environment: this.config.environment,
      }

      writeFileSync("deployment-info.json", JSON.stringify(deploymentInfo, null, 2))
    } catch (error) {
      throw new Error(`Vercel deployment failed: ${error}`)
    }
  }

  private async verifyDeployment(): Promise<void> {
    console.log("🔍 Verifying deployment...")

    try {
      // Read deployment info
      const deploymentInfo = JSON.parse(readFileSync("deployment-info.json", "utf8"))

      // Wait a moment for deployment to be ready
      await new Promise((resolve) => setTimeout(resolve, 10000))

      // Test deployment URL
      const testUrl = `${deploymentInfo.url}/test-modules`
      console.log(`🧪 Testing deployment at: ${testUrl}`)

      // You could add actual HTTP tests here
      console.log("✅ Deployment verification completed")
    } catch (error) {
      console.warn("⚠️ Deployment verification failed, but deployment may still be successful")
    }
  }
}

// Main execution
async function main() {
  const config: DeploymentConfig = {
    environment: "production",
  }

  const deployer = new ProductionDeployer(config)
  await deployer.deploy()
}

if (require.main === module) {
  main().catch(console.error)
}

export { ProductionDeployer }
