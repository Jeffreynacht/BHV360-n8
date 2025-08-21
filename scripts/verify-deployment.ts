#!/usr/bin/env npx tsx

/**
 * BHV360 Production Deployment Verification Script
 * This script verifies that the production deployment is working correctly
 */

import { neon } from "@neondatabase/serverless"

interface VerificationResult {
  test: string
  status: "PASS" | "FAIL" | "WARNING"
  message: string
  details?: any
}

class DeploymentVerifier {
  private baseUrl: string
  private results: VerificationResult[] = []

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, "") // Remove trailing slash
  }

  private addResult(test: string, status: "PASS" | "FAIL" | "WARNING", message: string, details?: any) {
    this.results.push({ test, status, message, details })

    const emoji = status === "PASS" ? "✅" : status === "FAIL" ? "❌" : "⚠️"
    console.log(`${emoji} ${test}: ${message}`)

    if (details && process.env.VERBOSE) {
      console.log("   Details:", details)
    }
  }

  async verifyWebsiteAccessibility(): Promise<void> {
    console.log("\n🌐 Testing Website Accessibility...")

    try {
      const response = await fetch(this.baseUrl)

      if (response.ok) {
        const html = await response.text()

        if (html.includes("BHV360")) {
          this.addResult("Homepage Load", "PASS", "Homepage loads successfully")
        } else {
          this.addResult("Homepage Load", "WARNING", "Homepage loads but content may be incorrect")
        }
      } else {
        this.addResult("Homepage Load", "FAIL", `HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      this.addResult("Homepage Load", "FAIL", `Network error: ${error}`)
    }
  }

  async verifyApiEndpoints(): Promise<void> {
    console.log("\n🔌 Testing API Endpoints...")

    const endpoints = [
      { path: "/api/health", name: "Health Check" },
      { path: "/api/customers/register", name: "Customer Registration", method: "POST" },
    ]

    for (const endpoint of endpoints) {
      try {
        const url = `${this.baseUrl}${endpoint.path}`
        const method = endpoint.method || "GET"

        const response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          ...(method === "POST" && {
            body: JSON.stringify({
              // Test data for POST endpoints
              test: true,
            }),
          }),
        })

        if (response.status < 500) {
          this.addResult(`API ${endpoint.name}`, "PASS", `Endpoint responds (${response.status})`)
        } else {
          this.addResult(`API ${endpoint.name}`, "FAIL", `Server error (${response.status})`)
        }
      } catch (error) {
        this.addResult(`API ${endpoint.name}`, "FAIL", `Network error: ${error}`)
      }
    }
  }

  async verifyDatabaseConnection(): Promise<void> {
    console.log("\n🗄️ Testing Database Connection...")

    try {
      const databaseUrl = process.env.DATABASE_URL

      if (!databaseUrl) {
        this.addResult("Database Connection", "FAIL", "DATABASE_URL environment variable not set")
        return
      }

      const sql = neon(databaseUrl)

      // Test basic connection
      const result = await sql`SELECT 1 as test`

      if (result && result[0]?.test === 1) {
        this.addResult("Database Connection", "PASS", "Database connection successful")
      } else {
        this.addResult("Database Connection", "FAIL", "Database query returned unexpected result")
      }

      // Test if required tables exist
      const tables = await sql`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN ('customers', 'user_profiles', 'subscription_plans')
      `

      const requiredTables = ["customers", "user_profiles", "subscription_plans"]
      const existingTables = tables.map((t) => t.table_name)
      const missingTables = requiredTables.filter((t) => !existingTables.includes(t))

      if (missingTables.length === 0) {
        this.addResult("Database Schema", "PASS", "All required tables exist")
      } else {
        this.addResult("Database Schema", "FAIL", `Missing tables: ${missingTables.join(", ")}`)
      }

      // Test demo customer exists
      const demoCustomer = await sql`
        SELECT id, name FROM customers WHERE email = 'demo@bhv360.nl' LIMIT 1
      `

      if (demoCustomer.length > 0) {
        this.addResult("Demo Data", "PASS", "Demo customer exists")
      } else {
        this.addResult("Demo Data", "WARNING", "Demo customer not found")
      }
    } catch (error) {
      this.addResult("Database Connection", "FAIL", `Database error: ${error}`)
    }
  }

  async verifyRegistrationFlow(): Promise<void> {
    console.log("\n📝 Testing Registration Flow...")

    try {
      const registrationData = {
        companyName: `Test Company ${Date.now()}`,
        contactPerson: "Test User",
        email: `test${Date.now()}@example.com`,
        phone: "+31 20 123 4567",
        address: "Test Street 123",
        city: "Amsterdam",
        postalCode: "1000 AB",
        password: "TestPassword123!",
        planType: "starter",
      }

      const response = await fetch(`${this.baseUrl}/api/customers/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registrationData),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        this.addResult("Customer Registration", "PASS", "Registration flow works correctly")

        // Clean up test customer if possible
        if (result.customer?.id) {
          try {
            const sql = neon(process.env.DATABASE_URL!)
            await sql`DELETE FROM customers WHERE id = ${result.customer.id}`
            console.log("   Test customer cleaned up")
          } catch (cleanupError) {
            console.log("   Warning: Could not clean up test customer")
          }
        }
      } else {
        this.addResult("Customer Registration", "FAIL", `Registration failed: ${result.error || "Unknown error"}`)
      }
    } catch (error) {
      this.addResult("Customer Registration", "FAIL", `Registration test error: ${error}`)
    }
  }

  async verifyEnvironmentVariables(): Promise<void> {
    console.log("\n🔧 Checking Environment Variables...")

    const requiredVars = ["DATABASE_URL", "NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"]

    for (const varName of requiredVars) {
      const value = process.env[varName]

      if (value) {
        this.addResult(`Env Var ${varName}`, "PASS", "Set correctly")
      } else {
        this.addResult(`Env Var ${varName}`, "WARNING", "Not set or empty")
      }
    }
  }

  async verifySSLCertificate(): Promise<void> {
    console.log("\n🔒 Checking SSL Certificate...")

    try {
      const url = new URL(this.baseUrl)

      if (url.protocol === "https:") {
        const response = await fetch(this.baseUrl)

        if (response.ok) {
          this.addResult("SSL Certificate", "PASS", "HTTPS is working correctly")
        } else {
          this.addResult("SSL Certificate", "WARNING", "HTTPS endpoint accessible but returned error")
        }
      } else {
        this.addResult("SSL Certificate", "FAIL", "Site is not using HTTPS")
      }
    } catch (error) {
      this.addResult("SSL Certificate", "FAIL", `SSL verification failed: ${error}`)
    }
  }

  async verifyPerformance(): Promise<void> {
    console.log("\n⚡ Testing Performance...")

    try {
      const startTime = Date.now()
      const response = await fetch(this.baseUrl)
      const endTime = Date.now()

      const loadTime = endTime - startTime

      if (loadTime < 2000) {
        this.addResult("Page Load Time", "PASS", `${loadTime}ms (Good)`)
      } else if (loadTime < 5000) {
        this.addResult("Page Load Time", "WARNING", `${loadTime}ms (Acceptable)`)
      } else {
        this.addResult("Page Load Time", "FAIL", `${loadTime}ms (Too slow)`)
      }
    } catch (error) {
      this.addResult("Page Load Time", "FAIL", `Performance test failed: ${error}`)
    }
  }

  async runAllTests(): Promise<void> {
    console.log(`🧪 BHV360 Production Deployment Verification`)
    console.log(`Testing: ${this.baseUrl}`)
    console.log("=".repeat(60))

    await this.verifyEnvironmentVariables()
    await this.verifyWebsiteAccessibility()
    await this.verifySSLCertificate()
    await this.verifyApiEndpoints()
    await this.verifyDatabaseConnection()
    await this.verifyRegistrationFlow()
    await this.verifyPerformance()

    this.printSummary()
  }

  private printSummary(): void {
    console.log("\n📊 Verification Summary")
    console.log("=".repeat(60))

    const passed = this.results.filter((r) => r.status === "PASS").length
    const failed = this.results.filter((r) => r.status === "FAIL").length
    const warnings = this.results.filter((r) => r.status === "WARNING").length
    const total = this.results.length

    console.log(`✅ Passed: ${passed}/${total}`)
    console.log(`❌ Failed: ${failed}/${total}`)
    console.log(`⚠️  Warnings: ${warnings}/${total}`)

    if (failed === 0) {
      console.log("\n🎉 All critical tests passed! BHV360 is ready for production.")
    } else {
      console.log("\n⚠️  Some tests failed. Please review and fix issues before going live.")
    }

    // Show failed tests
    const failedTests = this.results.filter((r) => r.status === "FAIL")
    if (failedTests.length > 0) {
      console.log("\n❌ Failed Tests:")
      failedTests.forEach((test) => {
        console.log(`   - ${test.test}: ${test.message}`)
      })
    }

    // Show warnings
    const warningTests = this.results.filter((r) => r.status === "WARNING")
    if (warningTests.length > 0) {
      console.log("\n⚠️  Warnings:")
      warningTests.forEach((test) => {
        console.log(`   - ${test.test}: ${test.message}`)
      })
    }

    console.log("\n🔗 Important URLs:")
    console.log(`   Homepage: ${this.baseUrl}`)
    console.log(`   Registration: ${this.baseUrl}/register`)
    console.log(`   Login: ${this.baseUrl}/login`)
    console.log(`   Admin: ${this.baseUrl}/super-admin`)
    console.log(`   Health: ${this.baseUrl}/api/health`)
  }
}

// Main execution
async function main() {
  const baseUrl = process.argv[2] || "https://bhv360.vercel.app"

  const verifier = new DeploymentVerifier(baseUrl)
  await verifier.runAllTests()
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error)
}

export { DeploymentVerifier }
