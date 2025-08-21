#!/usr/bin/env tsx

import { execSync } from "child_process"

interface VerificationTest {
  name: string
  url: string
  expectedStatus: number
  timeout: number
}

class DeploymentVerifier {
  private baseUrl = "https://bhv360.vercel.app"
  private tests: VerificationTest[] = [
    {
      name: "Homepage",
      url: "/",
      expectedStatus: 200,
      timeout: 10000,
    },
    {
      name: "Health Check API",
      url: "/api/health",
      expectedStatus: 200,
      timeout: 5000,
    },
    {
      name: "Database Test API",
      url: "/api/test-database",
      expectedStatus: 200,
      timeout: 10000,
    },
    {
      name: "Login Page",
      url: "/login",
      expectedStatus: 200,
      timeout: 5000,
    },
    {
      name: "Dashboard",
      url: "/dashboard",
      expectedStatus: 200,
      timeout: 5000,
    },
    {
      name: "BHV Module",
      url: "/bhv",
      expectedStatus: 200,
      timeout: 5000,
    },
    {
      name: "Plotkaart Editor",
      url: "/plotkaart",
      expectedStatus: 200,
      timeout: 5000,
    },
  ]

  private async testEndpoint(test: VerificationTest): Promise<boolean> {
    const fullUrl = `${this.baseUrl}${test.url}`

    try {
      console.log(`🔍 Testing ${test.name}: ${fullUrl}`)

      const curlCommand = `curl -f -s -o /dev/null -w "%{http_code}" --max-time ${test.timeout / 1000} "${fullUrl}"`
      const result = execSync(curlCommand, { encoding: "utf8", timeout: test.timeout })
      const statusCode = Number.parseInt(result.trim())

      if (statusCode === test.expectedStatus) {
        console.log(`✅ ${test.name} - OK (${statusCode})`)
        return true
      } else {
        console.log(`⚠️  ${test.name} - Unexpected status: ${statusCode}`)
        return false
      }
    } catch (error: any) {
      console.log(`❌ ${test.name} - Failed: ${error.message}`)
      return false
    }
  }

  private async checkBuildStatus(): Promise<void> {
    console.log("\n🏗️  Checking Vercel build status...")

    try {
      const result = execSync("vercel ls --scope=team_bhv360 2>/dev/null || vercel ls", {
        encoding: "utf8",
        timeout: 10000,
      })

      console.log("📊 Recent deployments:")
      console.log(result)
    } catch (error) {
      console.log("⚠️  Could not fetch deployment status")
    }
  }

  private async checkDomainStatus(): Promise<void> {
    console.log("\n🌐 Checking domain status...")

    try {
      const result = execSync(`dig +short ${this.baseUrl.replace("https://", "")}`, {
        encoding: "utf8",
        timeout: 5000,
      })

      if (result.trim()) {
        console.log(`✅ Domain resolves to: ${result.trim()}`)
      } else {
        console.log("⚠️  Domain resolution issue")
      }
    } catch (error) {
      console.log("⚠️  Could not check domain status")
    }
  }

  private async performanceTest(): Promise<void> {
    console.log("\n⚡ Running performance test...")

    try {
      const startTime = Date.now()
      const curlCommand = `curl -f -s -o /dev/null -w "%{time_total}" "${this.baseUrl}"`
      const result = execSync(curlCommand, { encoding: "utf8", timeout: 15000 })
      const loadTime = Number.parseFloat(result.trim())

      console.log(`📊 Homepage load time: ${loadTime.toFixed(2)}s`)

      if (loadTime < 2.0) {
        console.log("✅ Performance: Excellent")
      } else if (loadTime < 5.0) {
        console.log("⚠️  Performance: Good")
      } else {
        console.log("❌ Performance: Needs improvement")
      }
    } catch (error) {
      console.log("⚠️  Performance test failed")
    }
  }

  public async verify(): Promise<void> {
    console.log("🔍 BHV360 DEPLOYMENT VERIFICATION")
    console.log("=".repeat(50))
    console.log(`📅 ${new Date().toISOString()}`)
    console.log(`🌐 Base URL: ${this.baseUrl}`)
    console.log("=".repeat(50))

    await this.checkBuildStatus()
    await this.checkDomainStatus()
    await this.performanceTest()

    console.log("\n🧪 Running endpoint tests...")

    let passedTests = 0
    const totalTests = this.tests.length

    for (const test of this.tests) {
      const passed = await this.testEndpoint(test)
      if (passed) passedTests++

      // Small delay between tests
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    console.log("\n" + "=".repeat(50))
    console.log("📊 VERIFICATION RESULTS")
    console.log("=".repeat(50))
    console.log(`✅ Passed: ${passedTests}/${totalTests} tests`)
    console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests} tests`)
    console.log(`📈 Success Rate: ${Math.round((passedTests / totalTests) * 100)}%`)

    if (passedTests === totalTests) {
      console.log("\n🎉 ALL TESTS PASSED! Deployment is successful!")
      console.log("🚀 BHV360 is fully operational!")
    } else if (passedTests >= totalTests * 0.8) {
      console.log("\n⚠️  Most tests passed. Deployment is mostly successful.")
      console.log("🔧 Some endpoints may need attention.")
    } else {
      console.log("\n❌ Multiple tests failed. Deployment needs investigation.")
      console.log("🚨 Please check the application status.")
    }

    console.log("\n🔗 Quick Links:")
    console.log(`   Homepage: ${this.baseUrl}`)
    console.log(`   Dashboard: ${this.baseUrl}/dashboard`)
    console.log(`   Health: ${this.baseUrl}/api/health`)
    console.log(`   Database: ${this.baseUrl}/api/test-database`)
    console.log("=".repeat(50))
  }
}

// Execute verification
const verifier = new DeploymentVerifier()
verifier.verify().catch((error) => {
  console.error("Verification failed:", error)
  process.exit(1)
})
