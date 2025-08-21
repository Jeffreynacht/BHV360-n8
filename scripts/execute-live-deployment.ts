#!/usr/bin/env npx tsx

import { execSync } from "child_process"
import { writeFileSync, existsSync, readFileSync } from "fs"
import { neon } from "@neondatabase/serverless"

console.log("🚀 BHV360 LIVE DEPLOYMENT STARTING NOW!")
console.log("=".repeat(50))
console.log(`🕐 Started at: ${new Date().toLocaleString()}`)
console.log("")

const deploymentId = `bhv360-live-${Date.now()}`
const startTime = Date.now()

async function executeLiveDeployment() {
  try {
    // STEP 1: Pre-flight checks
    console.log("🔍 STEP 1: Pre-flight Checks")
    console.log("-".repeat(30))

    const nodeVersion = process.version
    const majorVersion = Number.parseInt(nodeVersion.slice(1).split(".")[0])

    if (majorVersion < 18) {
      throw new Error(`Node.js ${nodeVersion} is too old. Need 18+`)
    }
    console.log(`✅ Node.js ${nodeVersion} OK`)

    // Check required files
    const requiredFiles = [
      "package.json",
      "next.config.mjs",
      "app/layout.tsx",
      "app/page.tsx",
      "tailwind.config.ts",
      "tsconfig.json",
    ]

    for (const file of requiredFiles) {
      if (!existsSync(file)) {
        throw new Error(`Missing required file: ${file}`)
      }
      console.log(`✅ ${file}`)
    }

    // Check package.json
    const packageJson = JSON.parse(readFileSync("package.json", "utf8"))
    if (!packageJson.dependencies.next) {
      throw new Error("Next.js not found in dependencies")
    }
    console.log(`✅ Next.js ${packageJson.dependencies.next}`)

    // Install Vercel CLI if needed
    try {
      const vercelVersion = execSync("vercel --version", { encoding: "utf8", stdio: "pipe" })
      console.log(`✅ Vercel CLI ${vercelVersion.trim()}`)
    } catch {
      console.log("📦 Installing Vercel CLI...")
      execSync("npm install -g vercel@latest", { stdio: "inherit" })
      console.log("✅ Vercel CLI installed")
    }

    console.log("")

    // STEP 2: Environment check
    console.log("🔧 STEP 2: Environment Setup")
    console.log("-".repeat(30))

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
      throw new Error("Set all required environment variables")
    }

    console.log("✅ All environment variables configured")

    // Validate DATABASE_URL format
    const dbUrl = process.env.DATABASE_URL!
    if (!dbUrl.includes("postgresql://") && !dbUrl.includes("postgres://")) {
      throw new Error("DATABASE_URL must be a PostgreSQL connection string")
    }
    console.log("✅ Database URL format valid")
    console.log("")

    // STEP 3: Database setup and verification
    console.log("🗄️  STEP 3: Database Setup & Verification")
    console.log("-".repeat(30))

    const sql = neon(process.env.DATABASE_URL!)

    // Test basic connection
    console.log("🔌 Testing database connection...")
    const connectionTest = await sql`SELECT NOW() as current_time, version() as db_version`
    console.log(`✅ Connected to: ${connectionTest[0].db_version.split(" ")[0]}`)
    console.log(`✅ Server time: ${connectionTest[0].current_time}`)

    // Check if core tables exist
    const existingTables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('customers', 'user_profiles', 'subscription_plans')
    `

    console.log(`📊 Found ${existingTables.length} existing tables`)

    if (existingTables.length === 0) {
      console.log("📝 Creating production database schema...")

      // Create extensions
      await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`
      console.log("✅ UUID extension enabled")

      // Create subscription_plans table
      await sql`
        CREATE TABLE IF NOT EXISTS subscription_plans (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name VARCHAR(100) NOT NULL,
          plan_type VARCHAR(50) NOT NULL UNIQUE,
          price_monthly DECIMAL(10,2) DEFAULT 0.00,
          price_yearly DECIMAL(10,2) DEFAULT 0.00,
          max_users INTEGER DEFAULT 10,
          max_locations INTEGER DEFAULT 1,
          features JSONB DEFAULT '{}',
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `
      console.log("✅ subscription_plans table created")

      // Create customers table
      await sql`
        CREATE TABLE IF NOT EXISTS customers (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          contact_person VARCHAR(255),
          phone VARCHAR(50),
          address TEXT,
          city VARCHAR(100),
          postal_code VARCHAR(20),
          country VARCHAR(100) DEFAULT 'Netherlands',
          subscription_plan_id UUID REFERENCES subscription_plans(id),
          subscription_status VARCHAR(50) DEFAULT 'active',
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `
      console.log("✅ customers table created")

      // Create user_profiles table
      await sql`
        CREATE TABLE IF NOT EXISTS user_profiles (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
          email VARCHAR(255) UNIQUE NOT NULL,
          first_name VARCHAR(100) NOT NULL,
          last_name VARCHAR(100) NOT NULL,
          phone VARCHAR(50),
          role VARCHAR(50) DEFAULT 'user',
          permissions JSONB DEFAULT '{}',
          last_login TIMESTAMP WITH TIME ZONE,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `
      console.log("✅ user_profiles table created")

      // Create indexes for performance
      await sql`CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email)`
      await sql`CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(subscription_status)`
      await sql`CREATE INDEX IF NOT EXISTS idx_user_profiles_customer ON user_profiles(customer_id)`
      await sql`CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email)`
      console.log("✅ Database indexes created")
    } else {
      console.log("✅ Database schema already exists")
    }

    // Insert/update demo data
    console.log("📋 Setting up demo data...")

    // Insert subscription plans
    await sql`
      INSERT INTO subscription_plans (name, plan_type, price_monthly, price_yearly, max_users, max_locations, features) 
      VALUES 
        ('Starter Plan', 'starter', 29.99, 299.99, 5, 1, '{"plotkaart": true, "basic_reporting": true}'),
        ('Professional Plan', 'professional', 79.99, 799.99, 25, 3, '{"plotkaart": true, "reporting": true, "incidents": true, "nfc": true}'),
        ('Enterprise Plan', 'enterprise', 199.99, 1999.99, 100, 10, '{"plotkaart": true, "reporting": true, "incidents": true, "nfc": true, "api": true, "white_label": true}')
      ON CONFLICT (plan_type) DO UPDATE SET
        name = EXCLUDED.name,
        price_monthly = EXCLUDED.price_monthly,
        price_yearly = EXCLUDED.price_yearly,
        max_users = EXCLUDED.max_users,
        max_locations = EXCLUDED.max_locations,
        features = EXCLUDED.features,
        updated_at = NOW()
    `
    console.log("✅ Subscription plans configured")

    // Insert demo customer
    await sql`
      INSERT INTO customers (name, email, contact_person, phone, city, subscription_status, subscription_plan_id)
      SELECT 
        'Demo Bedrijf BV', 
        'demo@bhv360.nl', 
        'Demo Administrator', 
        '+31 20 123 4567',
        'Amsterdam', 
        'active', 
        id
      FROM subscription_plans 
      WHERE plan_type = 'professional' 
      LIMIT 1
      ON CONFLICT (email) DO UPDATE SET
        name = EXCLUDED.name,
        contact_person = EXCLUDED.contact_person,
        phone = EXCLUDED.phone,
        city = EXCLUDED.city,
        updated_at = NOW()
    `

    // Insert demo user profile
    await sql`
      INSERT INTO user_profiles (customer_id, email, first_name, last_name, role, permissions)
      SELECT 
        c.id,
        'demo@bhv360.nl',
        'Demo',
        'Administrator',
        'admin',
        '{"dashboard": true, "users": true, "reports": true, "settings": true}'
      FROM customers c
      WHERE c.email = 'demo@bhv360.nl'
      ON CONFLICT (email) DO UPDATE SET
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        role = EXCLUDED.role,
        permissions = EXCLUDED.permissions,
        updated_at = NOW()
    `
    console.log("✅ Demo customer and user created")

    // Verify data
    const customerCount = await sql`SELECT COUNT(*) as count FROM customers WHERE is_active = true`
    const planCount = await sql`SELECT COUNT(*) as count FROM subscription_plans WHERE is_active = true`
    const userCount = await sql`SELECT COUNT(*) as count FROM user_profiles WHERE is_active = true`

    console.log(
      `📊 Database ready: ${customerCount[0].count} customers, ${planCount[0].count} plans, ${userCount[0].count} users`,
    )
    console.log("")

    // STEP 4: Build application
    console.log("🏗️  STEP 4: Build Application")
    console.log("-".repeat(30))

    console.log("🧹 Cleaning previous builds...")
    try {
      execSync("rm -rf .next out dist", { stdio: "pipe" })
      console.log("✅ Clean completed")
    } catch (error) {
      console.log("⚠️  Clean skipped (no previous build)")
    }

    console.log("📦 Installing dependencies...")
    execSync("npm ci --production=false", { stdio: "inherit" })
    console.log("✅ Dependencies installed")

    console.log("🔍 Running type check...")
    try {
      execSync("npx tsc --noEmit", { stdio: "inherit" })
      console.log("✅ Type check passed")
    } catch (error) {
      console.log("❌ Type check failed")
      throw new Error("Fix TypeScript errors before deployment")
    }

    console.log("🔨 Building for production...")
    try {
      execSync("npm run build", { stdio: "inherit" })
      console.log("✅ Build completed successfully")
    } catch (error) {
      console.log("❌ Build failed")
      throw new Error("Fix build errors before deployment")
    }

    // Verify build output
    if (!existsSync(".next")) {
      throw new Error("Build output not found (.next directory missing)")
    }
    console.log("✅ Build output verified")
    console.log("")

    // STEP 5: Deploy to Vercel
    console.log("🌐 STEP 5: Deploy to Vercel")
    console.log("-".repeat(30))

    // Check Vercel authentication
    try {
      const whoami = execSync("vercel whoami", { encoding: "utf8", stdio: "pipe" })
      console.log(`✅ Authenticated as: ${whoami.trim()}`)
    } catch {
      console.log("🔐 Please login to Vercel...")
      execSync("vercel login", { stdio: "inherit" })
      const whoami = execSync("vercel whoami", { encoding: "utf8" })
      console.log(`✅ Authenticated as: ${whoami.trim()}`)
    }

    // Commit any uncommitted changes
    try {
      const gitStatus = execSync("git status --porcelain", { encoding: "utf8", stdio: "pipe" })
      if (gitStatus.trim()) {
        console.log("📝 Committing changes...")
        execSync("git add .", { stdio: "inherit" })
        execSync(`git commit -m "Live deployment ${deploymentId} - ${new Date().toISOString()}"`, { stdio: "inherit" })
        console.log("✅ Changes committed to Git")
      } else {
        console.log("✅ No uncommitted changes")
      }
    } catch (error) {
      console.log("⚠️  Git operations skipped (not a git repository or no changes)")
    }

    // Deploy to production
    console.log("🚀 Deploying to Vercel production...")
    console.log("   This may take a few minutes...")

    const deployOutput = execSync("vercel --prod --yes --confirm", {
      encoding: "utf8",
      stdio: "pipe",
    })

    // Extract deployment URL
    const urlMatch = deployOutput.match(/https:\/\/[^\s]+/)
    const deploymentUrl = urlMatch ? urlMatch[0] : "https://bhv360.vercel.app"

    console.log(`✅ Deployment completed!`)
    console.log(`🔗 Live URL: ${deploymentUrl}`)
    console.log("")

    // STEP 6: Post-deployment verification
    console.log("🔍 STEP 6: Post-Deployment Verification")
    console.log("-".repeat(30))

    console.log("⏳ Waiting for deployment to be ready...")
    await new Promise((resolve) => setTimeout(resolve, 15000)) // Wait 15 seconds

    const verificationResults = {
      homepage: false,
      health: false,
      database: false,
      api: false,
    }

    // Test homepage
    try {
      console.log("🏠 Testing homepage...")
      const response = await fetch(deploymentUrl, {
        headers: { "User-Agent": "BHV360-Deployment-Verification" },
      })

      if (response.ok) {
        const html = await response.text()
        if (html.includes("BHV360") || html.includes("bhv")) {
          console.log("✅ Homepage loads correctly")
          verificationResults.homepage = true
        } else {
          console.log("⚠️  Homepage loads but content may be incorrect")
        }
      } else {
        console.log(`⚠️  Homepage returned status ${response.status}`)
      }
    } catch (error) {
      console.log(`❌ Homepage test failed: ${error.message}`)
    }

    // Test health API
    try {
      console.log("💓 Testing health API...")
      const healthResponse = await fetch(`${deploymentUrl}/api/health`, {
        headers: { "User-Agent": "BHV360-Deployment-Verification" },
      })

      if (healthResponse.ok) {
        const healthData = await healthResponse.json()
        if (healthData.status === "healthy") {
          console.log("✅ Health API working correctly")
          verificationResults.health = true
        } else {
          console.log("⚠️  Health API returned unhealthy status")
        }
      } else {
        console.log(`⚠️  Health API returned status ${healthResponse.status}`)
      }
    } catch (error) {
      console.log(`❌ Health API test failed: ${error.message}`)
    }

    // Test database API
    try {
      console.log("🗄️  Testing database API...")
      const dbResponse = await fetch(`${deploymentUrl}/api/test-database`, {
        headers: { "User-Agent": "BHV360-Deployment-Verification" },
      })

      if (dbResponse.ok) {
        const dbData = await dbResponse.json()
        if (dbData.success) {
          console.log("✅ Database API working correctly")
          verificationResults.database = true
        } else {
          console.log("⚠️  Database API returned error")
        }
      } else {
        console.log(`⚠️  Database API returned status ${dbResponse.status}`)
      }
    } catch (error) {
      console.log(`❌ Database API test failed: ${error.message}`)
    }

    // Overall API test
    verificationResults.api = verificationResults.health && verificationResults.database

    console.log("")

    // STEP 7: Success summary
    const duration = Math.round((Date.now() - startTime) / 1000)
    const successCount = Object.values(verificationResults).filter(Boolean).length
    const totalTests = Object.keys(verificationResults).length

    console.log("🎉 LIVE DEPLOYMENT COMPLETED!")
    console.log("=".repeat(50))
    console.log("")
    console.log("📊 Deployment Summary:")
    console.log(`   • Duration: ${duration} seconds`)
    console.log(`   • Deployment ID: ${deploymentId}`)
    console.log(`   • Status: LIVE ✅`)
    console.log(`   • Verification: ${successCount}/${totalTests} tests passed`)
    console.log("")
    console.log("🔗 Your BHV360 Application is LIVE at:")
    console.log(`   ${deploymentUrl}`)
    console.log("")
    console.log("🎯 Quick Access Links:")
    console.log(`   • Homepage: ${deploymentUrl}`)
    console.log(`   • Health Check: ${deploymentUrl}/api/health`)
    console.log(`   • Database Test: ${deploymentUrl}/api/test-database`)
    console.log(`   • Login Page: ${deploymentUrl}/login`)
    console.log("")
    console.log("👤 Demo Account:")
    console.log("   • Email: demo@bhv360.nl")
    console.log("   • Role: Administrator")
    console.log("   • Features: Full access to all modules")
    console.log("")
    console.log("📋 Next Steps:")
    console.log("   1. ✅ Test all functionality")
    console.log("   2. ⚙️  Configure custom domain (optional)")
    console.log("   3. 📊 Set up monitoring and alerts")
    console.log("   4. 👥 Add real customers and users")
    console.log("   5. 🔒 Review security settings")
    console.log("")

    if (successCount === totalTests) {
      console.log("🚀 ALL SYSTEMS GO! BHV360 IS FULLY OPERATIONAL! 🎉")
    } else {
      console.log("⚠️  Some verification tests failed. Check the application manually.")
    }

    // Save deployment information
    const deploymentInfo = {
      id: deploymentId,
      url: deploymentUrl,
      timestamp: new Date().toISOString(),
      status: "LIVE",
      duration: duration,
      verification: verificationResults,
      environment: {
        node_version: process.version,
        npm_version: execSync("npm --version", { encoding: "utf8" }).trim(),
        vercel_version: execSync("vercel --version", { encoding: "utf8" }).trim(),
      },
    }

    writeFileSync("deployment-live.json", JSON.stringify(deploymentInfo, null, 2))
    console.log("💾 Deployment info saved to deployment-live.json")
  } catch (error) {
    console.log("")
    console.log("❌ DEPLOYMENT FAILED!")
    console.log("=".repeat(50))
    console.log(`💥 Error: ${error.message || error}`)
    console.log("")
    console.log("🔧 Troubleshooting Checklist:")
    console.log("   1. ✅ Environment variables are set correctly")
    console.log("   2. ✅ Database is accessible and configured")
    console.log("   3. ✅ Vercel CLI is authenticated")
    console.log("   4. ✅ Build errors are resolved")
    console.log("   5. ✅ Network connection is stable")
    console.log("")
    console.log("📞 Need help? Check the deployment logs above for specific error details.")

    // Save error information
    const errorInfo = {
      id: deploymentId,
      timestamp: new Date().toISOString(),
      status: "FAILED",
      error: error.message || error.toString(),
      duration: Math.round((Date.now() - startTime) / 1000),
    }

    writeFileSync("deployment-error.json", JSON.stringify(errorInfo, null, 2))

    throw error
  }
}

// Execute the deployment
if (require.main === module) {
  executeLiveDeployment().catch((error) => {
    console.error("Live deployment failed:", error)
    process.exit(1)
  })
}

export { executeLiveDeployment }
