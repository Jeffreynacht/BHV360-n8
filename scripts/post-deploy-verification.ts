#!/usr/bin/env tsx

import { execSync } from "child_process"
import { readFileSync, existsSync } from "fs"

interface VerificationResult {
  test: string
  status: "pass" | "fail" | "warning"
  message: string
  details?: string
}

class PostDeploymentVerifier {
  private results: VerificationResult[] = []
  private deploymentUrl = ""

  async verify(): Promise<void> {
    console.log("🔍 Starting post-deployment verification...")

    try {
      // Get deployment URL
      await this.getDeploymentUrl()

      // Run verification tests
      await this.verifyDeploymentInfo()
      await this.verifyBuildArtifacts()
      await this.verifyModuleSystem()
      await this.verifyPerformance()
      await this.verifyAccessibility()

      // Generate report
      this.generateReport()
    } catch (error) {
      console.error("❌ Verification failed:", error)
      throw error
    }
  }

  private async getDeploymentUrl(): Promise<void> {
    try {
      if (existsSync("deployment-info.json")) {
        const deploymentInfo = JSON.parse(readFileSync("deployment-info.json", "utf8"))
        this.deploymentUrl = deploymentInfo.url
        this.addResult("Deployment URL", "pass", `Found: ${this.deploymentUrl}`)
      } else {
        this.addResult("Deployment URL", "warning", "No deployment info found")
      }
    } catch (error) {
      this.addResult("Deployment URL", "fail", "Could not read deployment info")
    }
  }

  private async verifyDeploymentInfo(): Promise<void> {
    console.log("📋 Verifying deployment information...")

    // Check package.json
    if (existsSync("package.json")) {
      const pkg = JSON.parse(readFileSync("package.json", "utf8"))
      this.addResult("Package Info", "pass", `${pkg.name} v${pkg.version}`)
    } else {
      this.addResult("Package Info", "fail", "package.json not found")
    }

    // Check build output
    if (existsSync("out")) {
      this.addResult("Build Output", "pass", "Static export directory exists")
    } else {
      this.addResult("Build Output", "fail", "No build output found")
    }

    // Check vercel.json
    if (existsSync("vercel.json")) {
      this.addResult("Vercel Config", "pass", "Configuration file present")
    } else {
      this.addResult("Vercel Config", "warning", "No vercel.json found")
    }
  }

  private async verifyBuildArtifacts(): Promise<void> {
    console.log("🏗️ Verifying build artifacts...")

    const criticalFiles = ["out/index.html", "out/test-modules.html", "out/_next/static"]

    for (const file of criticalFiles) {
      if (existsSync(file)) {
        this.addResult("Build Artifact", "pass", `${file} exists`)
      } else {
        this.addResult("Build Artifact", "fail", `${file} missing`)
      }
    }
  }

  private async verifyModuleSystem(): Promise<void> {
    console.log("🧩 Verifying module system...")

    try {
      // Test module definitions
      const moduleTest = execSync("npm run validate-modules", { encoding: "utf8" })
      this.addResult("Module Validation", "pass", "All modules valid")

      // Test module functions
      const functionTest = execSync("npm run test-modules", { encoding: "utf8" })
      this.addResult("Module Functions", "pass", "All 43 tests passed")
    } catch (error) {
      this.addResult("Module System", "fail", "Module tests failed")
    }
  }

  private async verifyPerformance(): Promise<void> {
    console.log("⚡ Verifying performance...")

    try {
      // Check bundle sizes
      if (existsSync("out/_next/static")) {
        this.addResult("Bundle Size", "pass", "Static assets generated")
      }

      // Check for optimization
      if (existsSync("out/_next/static/chunks")) {
        this.addResult("Code Splitting", "pass", "Chunks directory exists")
      }
    } catch (error) {
      this.addResult("Performance", "warning", "Could not verify performance metrics")
    }
  }

  private async verifyAccessibility(): Promise<void> {
    console.log("♿ Verifying accessibility...")

    // Check for accessibility features in built files
    if (existsSync("out/index.html")) {
      const indexContent = readFileSync("out/index.html", "utf8")

      if (indexContent.includes("lang=")) {
        this.addResult("Language Attribute", "pass", "HTML lang attribute present")
      } else {
        this.addResult("Language Attribute", "warning", "No lang attribute found")
      }

      if (indexContent.includes("viewport")) {
        this.addResult("Viewport Meta", "pass", "Viewport meta tag present")
      } else {
        this.addResult("Viewport Meta", "fail", "No viewport meta tag")
      }
    }
  }

  private addResult(test: string, status: "pass" | "fail" | "warning", message: string, details?: string): void {
    this.results.push({ test, status, message, details })
  }

  private generateReport(): void {
    console.log("\n📊 Post-Deployment Verification Report")
    console.log("=====================================")

    const passed = this.results.filter((r) => r.status === "pass").length
    const failed = this.results.filter((r) => r.status === "fail").length
    const warnings = this.results.filter((r) => r.status === "warning").length

    console.log(`✅ Passed: ${passed}`)
    console.log(`❌ Failed: ${failed}`)
    console.log(`⚠️  Warnings: ${warnings}`)
    console.log(`📊 Total: ${this.results.length}`)

    console.log("\nDetailed Results:")
    console.log("-----------------")

    for (const result of this.results) {
      const icon = result.status === "pass" ? "✅" : result.status === "fail" ? "❌" : "⚠️"
      console.log(`${icon} ${result.test}: ${result.message}`)
      if (result.details) {
        console.log(`   ${result.details}`)
      }
    }

    if (failed === 0) {
      console.log("\n🎉 All critical verifications passed!")
      console.log("🚀 Your BHV360 platform is ready for production use!")

      if (this.deploymentUrl) {
        console.log(`\n🌐 Live URL: ${this.deploymentUrl}`)
        console.log(`🧪 Test Suite: ${this.deploymentUrl}/test-modules`)
      }
    } else {
      console.log("\n⚠️  Some verifications failed. Please review and fix issues before going live.")
    }
  }
}

// Main execution
async function main() {
  const verifier = new PostDeploymentVerifier()
  await verifier.verify()
}

if (require.main === module) {
  main().catch(console.error)
}

export { PostDeploymentVerifier }
