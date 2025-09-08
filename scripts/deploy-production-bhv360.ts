#!/usr/bin/env node

import { execSync } from "child_process"

console.log("🚀 Starting BHV360 Production Deployment...")

// Check if all required environment variables are set
const requiredEnvVars = [
  "NEXTAUTH_URL",
  "NEXTAUTH_SECRET",
  "AUTH_URL",
  "AUTH_SECRET",
  "AUTH_TRUST_HOST",
  "AUTH_GOOGLE_ID",
  "AUTH_GOOGLE_SECRET",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "DATABASE_URL",
  "NEXT_PUBLIC_SITE_URL",
]

console.log("✅ Checking environment variables...")
const missingVars = requiredEnvVars.filter((varName) => !process.env[varName])

if (missingVars.length > 0) {
  console.error("❌ Missing required environment variables:")
  missingVars.forEach((varName) => console.error(`   - ${varName}`))
  console.log("\n📝 Set these in Vercel Dashboard → Settings → Environment Variables")
  process.exit(1)
}

console.log("✅ All required environment variables are set")

try {
  // Build the application
  console.log("📦 Building application...")
  execSync("npm run build", { stdio: "inherit" })

  // Deploy to Vercel with skip build cache
  console.log("🌐 Deploying to Vercel with clean cache...")
  execSync("vercel --prod --force", { stdio: "inherit" })

  console.log("✅ BHV360 successfully deployed to production!")
  console.log("🔗 Visit: https://www.bhv360.nl")
  console.log("🔍 Test endpoints:")
  console.log("   - /api/auth/session")
  console.log("   - /api/auth/csrf")
  console.log("   - /api/health")
} catch (error) {
  console.error("❌ Deployment failed:", error)
  process.exit(1)
}
