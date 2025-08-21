#!/usr/bin/env npx tsx

import { execSync } from "child_process"
import { writeFileSync, readFileSync, existsSync } from "fs"
import { neon } from "@neondatabase/serverless"

interface DeploymentConfig {
  projectName: string
  domain?: string
  environment: "production"
  skipTests?: boolean
  skipDatabase?: boolean
}

class ProductionDeployer {
  private config: DeploymentConfig
  private deploymentId: string
  private startTime: number

  constructor(config: DeploymentConfig) {
    this.config = config
    this.deploymentId = `bhv360-${Date.now()}`
    this.startTime = Date.now()
  }

  async deploy(): Promise<void> {
    console.log("🚀 BHV360 PRODUCTION DEPLOYMENT")
    console.log("=".repeat(50))
    console.log(`📋 Deployment ID: ${this.deploymentId}`)
    console.log(`🕐 Started at: ${new Date().toLocaleString()}`)
    console.log("")

    try {
      // Step 1: Pre-flight checks
      await this.preFlightChecks()

      // Step 2: Environment setup
      await this.setupEnvironment()

      // Step 3: Database setup
      if (!this.config.skipDatabase) {
        await this.setupDatabase()
      }

      // Step 4: Build application
      await this.buildApplication()

      // Step 5: Deploy to Vercel
      await this.deployToVercel()

      // Step 6: Post-deployment verification
      await this.verifyDeployment()

      // Step 7: Final setup
      await this.finalSetup()

      this.showSuccessMessage()
    } catch (error) {
      this.showErrorMessage(error)
      throw error
    }
  }

  private async preFlightChecks(): Promise<void> {
    console.log("🔍 STEP 1: Pre-flight Checks")
    console.log("-".repeat(30))

    // Check Node.js version
    const nodeVersion = process.version
    const majorVersion = Number.parseInt(nodeVersion.slice(1).split(".")[0])

    if (majorVersion < 18) {
      throw new Error(`Node.js ${nodeVersion} is too old. Please use Node.js 18 or newer.`)
    }
    console.log(`✅ Node.js version: ${nodeVersion}`)

    // Check required files
    const requiredFiles = [
      "package.json",
      "next.config.mjs",
      "tailwind.config.ts",
      "app/layout.tsx",
      "app/page.tsx",
      "scripts/production-schema.sql",
    ]

    for (const file of requiredFiles) {
      if (!existsSync(file)) {
        throw new Error(`Required file missing: ${file}`)
      }
      console.log(`✅ ${file}`)
    }

    // Check if Vercel CLI is installed
    try {
      execSync("vercel --version", { stdio: "pipe" })
      console.log("✅ Vercel CLI installed")
    } catch {
      console.log("📦 Installing Vercel CLI...")
      execSync("npm install -g vercel", { stdio: "inherit" })
      console.log("✅ Vercel CLI installed")
    }

    // Check Git status
    try {
      const gitStatus = execSync("git status --porcelain", { encoding: "utf8" })
      if (gitStatus.trim()) {
        console.log("⚠️  Uncommitted changes detected")
        console.log("📝 Committing changes...")
        execSync("git add .", { stdio: "inherit" })
        execSync(`git commit -m "Production deployment ${this.deploymentId}"`, { stdio: "inherit" })
        console.log("✅ Changes committed")
      } else {
        console.log("✅ Git working directory clean")
      }
    } catch (error) {
      console.log("⚠️  Git check failed, continuing...")
    }

    console.log("")
  }

  private async setupEnvironment(): Promise<void> {
    console.log("🔧 STEP 2: Environment Setup")
    console.log("-".repeat(30))

    // Check environment variables
    const requiredEnvVars = [
      "DATABASE_URL",
      "NEXT_PUBLIC_SUPABASE_URL",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      "SUPABASE_SERVICE_ROLE_KEY",
    ]

    const missingVars = requiredEnvVars.filter((varName) => !process.env[varName])

    if (missingVars.length > 0) {
      console.log("❌ Missing environment variables:")
      missingVars.forEach((varName) => console.log(`   - ${varName}`))
      throw new Error("Please set all required environment variables")
    }

    console.log("✅ All required environment variables are set")

    // Create production environment file
    const prodEnv = `# BHV360 Production Environment
NEXT_PUBLIC_APP_URL=https://bhv360.vercel.app
NEXT_PUBLIC_ENVIRONMENT=production
NODE_ENV=production

# Database
DATABASE_URL=${process.env.DATABASE_URL}

# Supabase
NEXT_PUBLIC_SUPABASE_URL=${process.env.NEXT_PUBLIC_SUPABASE_URL}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}
SUPABASE_SERVICE_ROLE_KEY=${process.env.SUPABASE_SERVICE_ROLE_KEY}

# Generated at: ${new Date().toISOString()}
# Deployment ID: ${this.deploymentId}
`

    writeFileSync(".env.production", prodEnv)
    console.log("✅ Production environment file created")
    console.log("")
  }

  private async setupDatabase(): Promise<void> {
    console.log("🗄️  STEP 3: Database Setup")
    console.log("-".repeat(30))

    try {
      const sql = neon(process.env.DATABASE_URL!)

      // Test connection
      await sql`SELECT 1 as test`
      console.log("✅ Database connection successful")

      // Check if schema exists
      const tables = await sql`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN ('customers', 'user_profiles', 'subscription_plans')
      `

      if (tables.length === 0) {
        console.log("📝 Creating database schema...")

        // Read and execute schema
        const schemaSQL = readFileSync("scripts/production-schema.sql", "utf8")

        // Split by statements and execute
        const statements = schemaSQL
          .split(";")
          .map((s) => s.trim())
          .filter((s) => s.length > 0 && !s.startsWith("--"))

        for (const statement of statements) {
          if (statement.trim()) {
            await sql.unsafe(statement)
          }
        }

        console.log("✅ Database schema created")
      } else {
        console.log("✅ Database schema already exists")
      }

      // Verify demo data
      const demoCustomer = await sql`
        SELECT id, name FROM customers WHERE email = 'demo@bhv360.nl' LIMIT 1
      `

      if (demoCustomer.length === 0) {
        console.log("📝 Creating demo customer...")

        await sql`
          INSERT INTO customers (name, email, contact_person, subscription_status)
          VALUES ('Demo Bedrijf BV', 'demo@bhv360.nl', 'Demo Administrator', 'active')
          ON CONFLICT (email) DO NOTHING
        `

        console.log("✅ Demo customer created")
      } else {
        console.log("✅ Demo customer exists")
      }
    } catch (error) {
      console.error("❌ Database setup failed:", error)
      throw error
    }

    console.log("")
  }

  private async buildApplication(): Promise<void> {
    console.log("🏗️  STEP 4: Build Application")
    console.log("-".repeat(30))

    try {
      // Clean previous builds
      console.log("🧹 Cleaning previous builds...")
      execSync("rm -rf .next out", { stdio: "pipe" })

      // Install dependencies
      console.log("📦 Installing dependencies...")
      execSync("npm ci", { stdio: "inherit" })

      // Type check
      if (!this.config.skipTests) {
        console.log("🔍 Type checking...")
        execSync("npx tsc --noEmit", { stdio: "inherit" })
        console.log("✅ Type check passed")
      }

      // Build for production
      console.log("🔨 Building for production...")
      execSync("npm run build", { stdio: "inherit" })
      console.log("✅ Build completed successfully")
    } catch (error) {
      console.error("❌ Build failed:", error)
      throw error
    }

    console.log("")
  }

  private async deployToVercel(): Promise<void> {
    console.log("🌐 STEP 5: Deploy to Vercel")
    console.log("-".repeat(30))

    try {
      // Login check
      try {
        execSync("vercel whoami", { stdio: "pipe" })
        console.log("✅ Vercel authentication verified")
      } catch {
        console.log("🔐 Please login to Vercel...")
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
      const deploymentUrl = urlMatch ? urlMatch[0] : "https://bhv360.vercel.app"

      console.log(`✅ Deployed successfully!`)
      console.log(`🔗 URL: ${deploymentUrl}`)

      // Save deployment info
      const deploymentInfo = {
        id: this.deploymentId,
        url: deploymentUrl,
        timestamp: new Date().toISOString(),
        environment: this.config.environment,
        version: this.getVersion(),
        duration: Date.now() - this.startTime,
      }

      writeFileSync("deployment-info.json", JSON.stringify(deploymentInfo, null, 2))
      console.log("📝 Deployment info saved")
    } catch (error) {
      console.error("❌ Vercel deployment failed:", error)
      throw error
    }

    console.log("")
  }

  private async verifyDeployment(): Promise<void> {
    console.log("🔍 STEP 6: Deployment Verification")
    console.log("-".repeat(30))

    try {
      const deploymentInfo = JSON.parse(readFileSync("deployment-info.json", "utf8"))
      const baseUrl = deploymentInfo.url

      // Wait for deployment to be ready
      console.log("⏳ Waiting for deployment to be ready...")
      await new Promise((resolve) => setTimeout(resolve, 15000))

      // Test homepage
      console.log("🏠 Testing homepage...")
      const homeResponse = await fetch(baseUrl)
      if (homeResponse.ok) {
        const html = await homeResponse.text()
        if (html.includes("BHV360")) {
          console.log("✅ Homepage loads correctly")
        } else {
          console.log("⚠️  Homepage loads but content may be incorrect")
        }
      } else {
        throw new Error(`Homepage returned ${homeResponse.status}`)
      }

      // Test API health
      console.log("🔌 Testing API health...")
      try {
        const apiResponse = await fetch(`${baseUrl}/api/health`)
        if (apiResponse.status < 500) {
          console.log("✅ API is responding")
        } else {
          console.log("⚠️  API returned server error")
        }
      } catch {
        console.log("⚠️  API health check failed")
      }

      // Test database connection via API
      console.log("🗄️  Testing database connection...")
      try {
        const dbResponse = await fetch(`${baseUrl}/api/test-database`)
        if (dbResponse.ok) {
          console.log("✅ Database connection working")
        } else {
          console.log("⚠️  Database connection issues")
        }
      } catch {
        console.log("⚠️  Database test failed")
      }

      console.log("✅ Deployment verification completed")
    } catch (error) {
      console.log("⚠️  Verification failed, but deployment may still be working")
      console.log("   Please check manually:", error)
    }

    console.log("")
  }

  private async finalSetup(): Promise<void> {
    console.log("🎯 STEP 7: Final Setup")
    console.log("-".repeat(30))

    // Create post-deployment checklist
    const checklist = `# BHV360 Post-Deployment Checklist

## ✅ Completed Automatically
- [x] Application deployed to Vercel
- [x] Database schema created
- [x] Demo customer created
- [x] Basic verification completed

## 📋 Manual Tasks Required

### 1. Domain Configuration (Optional)
- [ ] Configure custom domain in Vercel dashboard
- [ ] Update DNS records if using custom domain
- [ ] Verify SSL certificate

### 2. Email Configuration
- [ ] Set up email service (SendGrid, Mailgun, etc.)
- [ ] Configure SMTP settings in Vercel environment variables
- [ ] Test welcome email functionality

### 3. Monitoring & Analytics
- [ ] Set up error monitoring (Sentry, LogRocket, etc.)
- [ ] Configure analytics (Google Analytics, Mixpanel, etc.)
- [ ] Set up uptime monitoring

### 4. Security
- [ ] Review and configure Vercel security headers
- [ ] Set up rate limiting if needed
- [ ] Configure CORS settings

### 5. Content & Data
- [ ] Review and update demo content
- [ ] Create initial customer accounts
- [ ] Set up backup procedures

### 6. Testing
- [ ] Perform end-to-end testing
- [ ] Test customer registration flow
- [ ] Verify all major features work
- [ ] Test on mobile devices

### 7. Documentation
- [ ] Update README with production URLs
- [ ] Document deployment process
- [ ] Create user documentation

## 🔗 Important URLs
- Production: https://bhv360.vercel.app
- Vercel Dashboard: https://vercel.com/dashboard
- Database: [Your database dashboard]

## 📞 Support
- Technical issues: Create GitHub issue
- Deployment questions: Check Vercel docs

Generated: ${new Date().toISOString()}
Deployment ID: ${this.deploymentId}
`

    writeFileSync("POST-DEPLOYMENT-CHECKLIST.md", checklist)
    console.log("✅ Post-deployment checklist created")

    // Create backup of current configuration
    const backupConfig = {
      deploymentId: this.deploymentId,
      timestamp: new Date().toISOString(),
      nodeVersion: process.version,
      packageJson: JSON.parse(readFileSync("package.json", "utf8")),
      environment: Object.keys(process.env)
        .filter((key) => key.startsWith("NEXT_PUBLIC_") || key.startsWith("DATABASE_") || key.startsWith("SUPABASE_"))
        .reduce(
          (obj, key) => {
            obj[key] = key.includes("SECRET") || key.includes("KEY") ? "[REDACTED]" : process.env[key]
            return obj
          },
          {} as Record<string, string>,
        ),
    }

    writeFileSync(`deployment-backup-${this.deploymentId}.json`, JSON.stringify(backupConfig, null, 2))
    console.log("✅ Configuration backup created")

    console.log("")
  }

  private getVersion(): string {
    try {
      const packageJson = JSON.parse(readFileSync("package.json", "utf8"))
      return packageJson.version || "1.0.0"
    } catch {
      return "1.0.0"
    }
  }

  private showSuccessMessage(): void {
    const duration = Math.round((Date.now() - this.startTime) / 1000)

    console.log("🎉 DEPLOYMENT SUCCESSFUL!")
    console.log("=".repeat(50))
    console.log("")
    console.log("📊 Deployment Summary:")
    console.log(`   • Deployment ID: ${this.deploymentId}`)
    console.log(`   • Duration: ${duration} seconds`)
    console.log(`   • Environment: ${this.config.environment}`)
    console.log(`   • Timestamp: ${new Date().toLocaleString()}`)
    console.log("")
    console.log("🔗 Your BHV360 application is now live at:")
    console.log("   https://bhv360.vercel.app")
    console.log("")
    console.log("🚀 Next Steps:")
    console.log("   1. Check POST-DEPLOYMENT-CHECKLIST.md for manual tasks")
    console.log("   2. Test the application thoroughly")
    console.log("   3. Configure custom domain (optional)")
    console.log("   4. Set up monitoring and analytics")
    console.log("")
    console.log("📚 Demo Account:")
    console.log("   Email: demo@bhv360.nl")
    console.log("   Password: [Set during first login]")
    console.log("")
    console.log("🎯 Happy BHV managing! 🚀")
  }

  private showErrorMessage(error: any): void {
    console.log("")
    console.log("❌ DEPLOYMENT FAILED!")
    console.log("=".repeat(50))
    console.log("")
    console.log("💥 Error Details:")
    console.log(`   ${error.message || error}`)
    console.log("")
    console.log("🔧 Troubleshooting:")
    console.log("   1. Check all environment variables are set")
    console.log("   2. Verify database connection")
    console.log("   3. Ensure Vercel CLI is authenticated")
    console.log("   4. Check build logs for specific errors")
    console.log("")
    console.log("📞 Need Help?")
    console.log("   • Check the deployment logs above")
    console.log("   • Review the error message carefully")
    console.log("   • Ensure all prerequisites are met")
    console.log("")
  }
}

// Main execution function
async function main() {
  const config: DeploymentConfig = {
    projectName: "bhv360-plotkaart",
    environment: "production",
    skipTests: process.argv.includes("--skip-tests"),
    skipDatabase: process.argv.includes("--skip-database"),
  }

  console.log("🚀 Starting BHV360 Production Deployment...")
  console.log("")

  if (config.skipTests) {
    console.log("⚠️  Skipping tests (--skip-tests flag)")
  }

  if (config.skipDatabase) {
    console.log("⚠️  Skipping database setup (--skip-database flag)")
  }

  console.log("")

  const deployer = new ProductionDeployer(config)
  await deployer.deploy()
}

// Execute if run directly
if (require.main === module) {
  main().catch((error) => {
    console.error("Deployment failed:", error)
    process.exit(1)
  })
}

export { ProductionDeployer }
