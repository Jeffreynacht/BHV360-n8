#!/usr/bin/env tsx
import https from "https"
import { URL } from "url"

interface TestResult {
  name: string
  status: "pass" | "fail" | "warning"
  message: string
  url?: string
  details?: string
}

class DeploymentVerifier {
  private baseUrl: string
  private results: TestResult[] = []

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private async httpGet(url: string): Promise<{ status: number; body: string; headers: any }> {
    return new Promise((resolve, reject) => {
      const parsedUrl = new URL(url)
      const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || 443,
        path: parsedUrl.pathname + parsedUrl.search,
        method: "GET",
        timeout: 15000,
        headers: {
          "User-Agent": "BHV360-Deployment-Verifier/1.0",
        },
      }

      const req = https.request(options, (res) => {
        let body = ""
        res.on("data", (chunk) => {
          body += chunk
        })
        res.on("end", () => {
          resolve({
            status: res.statusCode || 0,
            body,
            headers: res.headers,
          })
        })
      })

      req.on("error", (err) => {
        reject(err)
      })

      req.on("timeout", () => {
        req.destroy()
        reject(new Error("Request timeout"))
      })

      req.end()
    })
  }

  private addResult(
    name: string,
    status: "pass" | "fail" | "warning",
    message: string,
    url?: string,
    details?: string,
  ) {
    this.results.push({ name, status, message, url, details })
  }

  async testHomepage() {
    console.log("🏠 Testing homepage...")
    try {
      const response = await this.httpGet(this.baseUrl)
      if (response.status === 200) {
        const hasTitle = response.body.includes("BHV360") || response.body.includes("Professionele BHV Software")
        const hasLogo = response.body.includes("bhv360-logo") || response.body.includes("logo")
        const hasNavigation = response.body.includes("nav") || response.body.includes("menu")

        if (hasTitle && hasLogo && hasNavigation) {
          this.addResult("Homepage", "pass", "Homepage loads correctly with all essential elements", this.baseUrl)
        } else {
          const missing = []
          if (!hasTitle) missing.push("title/branding")
          if (!hasLogo) missing.push("logo")
          if (!hasNavigation) missing.push("navigation")
          this.addResult("Homepage", "warning", `Homepage loads but missing: ${missing.join(", ")}`, this.baseUrl)
        }
      } else {
        this.addResult("Homepage", "fail", `Homepage returned status ${response.status}`, this.baseUrl)
      }
    } catch (error) {
      this.addResult("Homepage", "fail", `Homepage failed to load: ${error}`, this.baseUrl)
    }
  }

  async testLoginPage() {
    console.log("🔐 Testing login page...")
    try {
      const url = `${this.baseUrl}/login`
      const response = await this.httpGet(url)
      if (response.status === 200) {
        const hasWelcome =
          response.body.includes("Welkom") || response.body.includes("Login") || response.body.includes("Inloggen")
        const hasLogo = response.body.includes("bhv360-logo") || response.body.includes("BHV360")
        const hasForm = response.body.includes("email") && response.body.includes("password")

        if (hasWelcome && hasLogo && hasForm) {
          this.addResult("Login Page", "pass", "Login page loads with correct branding and form", url)
        } else {
          const missing = []
          if (!hasWelcome) missing.push("welcome text")
          if (!hasLogo) missing.push("logo/branding")
          if (!hasForm) missing.push("login form")
          this.addResult("Login Page", "warning", `Login page loads but missing: ${missing.join(", ")}`, url)
        }
      } else {
        this.addResult("Login Page", "fail", `Login page returned status ${response.status}`, url)
      }
    } catch (error) {
      this.addResult("Login Page", "fail", `Login page failed to load: ${error}`)
    }
  }

  async testMobileAppPage() {
    console.log("📱 Testing mobile app page...")
    try {
      const url = `${this.baseUrl}/mobile-app`
      const response = await this.httpGet(url)
      if (response.status === 200) {
        const hasTitle = response.body.includes("Mobiele App") || response.body.includes("Mobile App")
        const hasDownload = response.body.includes("Download") || response.body.includes("download")
        const hasTabs = response.body.includes("tab") || response.body.includes("Overzicht")
        const hasFeatures = response.body.includes("Features") || response.body.includes("Functies")

        if (hasTitle && hasDownload && hasTabs && hasFeatures) {
          this.addResult("Mobile App Page", "pass", "Mobile app page loads with all sections", url)
        } else {
          const missing = []
          if (!hasTitle) missing.push("title")
          if (!hasDownload) missing.push("download options")
          if (!hasTabs) missing.push("navigation tabs")
          if (!hasFeatures) missing.push("features section")
          this.addResult("Mobile App Page", "warning", `Mobile app page loads but missing: ${missing.join(", ")}`, url)
        }
      } else {
        this.addResult("Mobile App Page", "fail", `Mobile app page returned status ${response.status}`, url)
      }
    } catch (error) {
      this.addResult("Mobile App Page", "fail", `Mobile app page failed to load: ${error}`)
    }
  }

  async testWebsiteBuilder() {
    console.log("🛠️ Testing website builder...")
    try {
      const url = `${this.baseUrl}/super-admin/website-builder`
      const response = await this.httpGet(url)
      if (response.status === 200) {
        const hasBuilder = response.body.includes("Website Builder") || response.body.includes("website-builder")
        const hasTabs = response.body.includes("Homepage") && response.body.includes("Design")
        const hasEditor = response.body.includes("editor") || response.body.includes("content")

        if (hasBuilder && hasTabs && hasEditor) {
          this.addResult("Website Builder", "pass", "Website builder loads with all components", url)
        } else {
          this.addResult("Website Builder", "warning", "Website builder loads but some components may be missing", url)
        }
      } else if (response.status === 401 || response.status === 403) {
        this.addResult("Website Builder", "pass", "Website builder is properly protected (auth required)", url)
      } else {
        this.addResult("Website Builder", "fail", `Website builder returned status ${response.status}`, url)
      }
    } catch (error) {
      this.addResult("Website Builder", "fail", `Website builder failed to load: ${error}`)
    }
  }

  async testApiHealth() {
    console.log("🔧 Testing API health...")
    try {
      const url = `${this.baseUrl}/api/test-database`
      const response = await this.httpGet(url)
      if (response.status === 200) {
        try {
          const data = JSON.parse(response.body)
          if (data.status === "success" || data.message) {
            this.addResult("API Health", "pass", "API health check passed with valid response", url)
          } else {
            this.addResult("API Health", "warning", "API responds but format may be unexpected", url)
          }
        } catch {
          this.addResult("API Health", "warning", "API responds but not with JSON", url)
        }
      } else {
        this.addResult("API Health", "warning", `API health check returned status ${response.status}`, url)
      }
    } catch (error) {
      this.addResult("API Health", "fail", `API health check failed: ${error}`)
    }
  }

  async testStaticAssets() {
    console.log("🖼️ Testing static assets...")
    const assets = ["/images/bhv360-logo-full.png", "/images/bhv360-logo.png", "/favicon.ico", "/manifest.json"]

    for (const asset of assets) {
      try {
        const url = `${this.baseUrl}${asset}`
        const response = await this.httpGet(url)
        if (response.status === 200) {
          this.addResult(`Asset: ${asset}`, "pass", "Asset loads correctly", url)
        } else if (response.status === 404) {
          this.addResult(`Asset: ${asset}`, "warning", "Asset not found (may not be critical)", url)
        } else {
          this.addResult(`Asset: ${asset}`, "warning", `Asset returned status ${response.status}`, url)
        }
      } catch (error) {
        this.addResult(`Asset: ${asset}`, "warning", `Asset failed to load: ${error}`)
      }
    }
  }

  async testSecurityHeaders() {
    console.log("🔒 Testing security headers...")
    try {
      const response = await this.httpGet(this.baseUrl)
      const headers = response.headers

      const securityChecks = [
        { name: "X-Frame-Options", present: !!headers["x-frame-options"] },
        { name: "X-Content-Type-Options", present: !!headers["x-content-type-options"] },
        { name: "Referrer-Policy", present: !!headers["referrer-policy"] },
        { name: "Strict-Transport-Security", present: !!headers["strict-transport-security"] },
      ]

      const missingHeaders = securityChecks.filter((check) => !check.present).map((check) => check.name)

      if (missingHeaders.length === 0) {
        this.addResult("Security Headers", "pass", "All important security headers are present")
      } else if (missingHeaders.length <= 2) {
        this.addResult("Security Headers", "warning", `Some security headers missing: ${missingHeaders.join(", ")}`)
      } else {
        this.addResult("Security Headers", "fail", `Many security headers missing: ${missingHeaders.join(", ")}`)
      }
    } catch (error) {
      this.addResult("Security Headers", "fail", `Failed to check security headers: ${error}`)
    }
  }

  async testPerformance() {
    console.log("⚡ Testing performance...")
    try {
      const startTime = Date.now()
      const response = await this.httpGet(this.baseUrl)
      const loadTime = Date.now() - startTime

      if (response.status === 200) {
        if (loadTime < 2000) {
          this.addResult("Performance", "pass", `Page loads quickly (${loadTime}ms)`)
        } else if (loadTime < 5000) {
          this.addResult("Performance", "warning", `Page loads acceptably (${loadTime}ms)`)
        } else {
          this.addResult("Performance", "fail", `Page loads slowly (${loadTime}ms)`)
        }
      }
    } catch (error) {
      this.addResult("Performance", "fail", `Performance test failed: ${error}`)
    }
  }

  async testClientSideSecurity() {
    console.log("🛡️ Testing client-side security...")
    try {
      const response = await this.httpGet(this.baseUrl)
      const body = response.body

      // Check for exposed secrets
      const hasServiceKey = body.includes("service_role") || body.includes("SUPABASE_SERVICE_ROLE_KEY")
      const hasSecrets = body.includes("secret") && body.includes("key")

      if (!hasServiceKey && !hasSecrets) {
        this.addResult("Client Security", "pass", "No sensitive keys exposed in client-side code")
      } else {
        this.addResult("Client Security", "fail", "Potential sensitive data exposed in client-side code")
      }
    } catch (error) {
      this.addResult("Client Security", "warning", `Could not verify client-side security: ${error}`)
    }
  }

  async runAllTests() {
    console.log("🔍 Starting BHV360 deployment verification...")
    console.log(`🌐 Testing URL: ${this.baseUrl}`)
    console.log("=".repeat(80))

    await this.testHomepage()
    await this.testLoginPage()
    await this.testMobileAppPage()
    await this.testWebsiteBuilder()
    await this.testApiHealth()
    await this.testStaticAssets()
    await this.testSecurityHeaders()
    await this.testPerformance()
    await this.testClientSideSecurity()

    this.printResults()
    return this.getOverallStatus()
  }

  private getOverallStatus(): "success" | "warning" | "failure" {
    const failed = this.results.filter((r) => r.status === "fail").length
    const warnings = this.results.filter((r) => r.status === "warning").length

    if (failed > 0) return "failure"
    if (warnings > 3) return "warning"
    return "success"
  }

  private printResults() {
    console.log("\n📊 Test Results:")
    console.log("=".repeat(80))

    const passed = this.results.filter((r) => r.status === "pass").length
    const warnings = this.results.filter((r) => r.status === "warning").length
    const failed = this.results.filter((r) => r.status === "fail").length

    this.results.forEach((result) => {
      const icon = result.status === "pass" ? "✅" : result.status === "warning" ? "⚠️" : "❌"
      console.log(`${icon} ${result.name}: ${result.message}`)
      if (result.url) {
        console.log(`   🔗 ${result.url}`)
      }
      if (result.details) {
        console.log(`   📝 ${result.details}`)
      }
    })

    console.log("\n📈 Summary:")
    console.log(`✅ Passed: ${passed}`)
    console.log(`⚠️  Warnings: ${warnings}`)
    console.log(`❌ Failed: ${failed}`)
    console.log(`📊 Total: ${this.results.length}`)

    const overallStatus = this.getOverallStatus()

    if (overallStatus === "success") {
      console.log("\n🎉 All critical tests passed! Deployment looks excellent.")
    } else if (overallStatus === "warning") {
      console.log("\n⚠️  Deployment is functional but has some issues to address.")
    } else {
      console.log("\n❌ Deployment has critical issues that need immediate attention.")
    }

    console.log("\n🔗 Manual Testing URLs:")
    console.log(`• Homepage: ${this.baseUrl}`)
    console.log(`• Login: ${this.baseUrl}/login`)
    console.log(`• Mobile App: ${this.baseUrl}/mobile-app`)
    console.log(`• Platform: ${this.baseUrl}/platform`)
    console.log(`• Super Admin: ${this.baseUrl}/super-admin`)
    console.log(`• Website Builder: ${this.baseUrl}/super-admin/website-builder`)

    console.log("\n📋 Critical Manual Tests:")
    console.log("□ Test BHV360 logo display on login page")
    console.log("□ Verify no SUPABASE_SERVICE_ROLE_KEY in browser dev tools")
    console.log("□ Test login functionality with demo credentials")
    console.log("□ Test website builder tabs and content editor")
    console.log("□ Test mobile app page tabs and download buttons")
    console.log("□ Test responsive design on mobile device")
    console.log("□ Test image loading and optimization")
    console.log("□ Test database connectivity through platform")
  }
}

// Main execution
async function main() {
  const baseUrl = process.argv[2] || "https://bhv360.vercel.app"

  console.log("🚀 BHV360 Deployment Verification Tool")
  console.log("=====================================")

  const verifier = new DeploymentVerifier(baseUrl)
  const status = await verifier.runAllTests()

  // Exit with appropriate code
  if (status === "failure") {
    process.exit(1)
  } else if (status === "warning") {
    process.exit(2)
  } else {
    process.exit(0)
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error("❌ Verification failed:", error)
    process.exit(1)
  })
}

export { DeploymentVerifier }
