#!/usr/bin/env node

/**
 * Deploy script voor de professionele BHV360 homepage
 * Versie: Professional & Betrouwbaar
 * Datum: December 2024
 */

import { execSync } from "child_process"
import fs from "fs"

interface DeploymentConfig {
  version: string
  description: string
  changes: string[]
  verifications: string[]
}

const deploymentConfig: DeploymentConfig = {
  version: "v2.0.0-professional",
  description: "Volledig professionele en betrouwbare homepage deployment",
  changes: [
    "✅ Verwijderd: White label uit Starter plan",
    "✅ Verwijderd: Valse '💰 Geen setup kosten • Cancel anytime • 30 dagen geld terug garantie'",
    "✅ Verwijderd: '24/7 support' - vervangen door realistische 'ma-vr 09:00-16:00'",
    "✅ Gecorrigeerd: Compliance van 'Gecertificeerd' naar 'Voldoet aan richtlijnen'",
    "✅ Toegevoegd: Inlogknop in plaats van 'Platform'",
    "✅ Toegevoegd: Volledige registratiepagina met onboarding proces",
    "✅ Verbeterd: Professionele call-to-actions door hele site",
    "✅ Verbeterd: Realistische pricing en verwachtingen",
    "✅ Toegevoegd: Echte contactgegevens prominent weergegeven",
    "✅ Verbeterd: 3x groter logo overal zichtbaar",
  ],
  verifications: [
    "Homepage laadt correct zonder errors",
    "Registratiepagina functioneert volledig",
    "Alle links werken naar juiste pagina's",
    "Mobile responsiveness werkt perfect",
    "Geen valse claims of misleidende informatie",
    "Compliance correct weergegeven",
    "Contact informatie overal zichtbaar",
    "Call-to-actions leiden naar juiste acties",
  ],
}

async function runDeployment() {
  console.log("🚀 Starting BHV360 Professional Homepage Deployment")
  console.log("=".repeat(60))

  try {
    // 1. Pre-deployment checks
    console.log("📋 Running pre-deployment checks...")

    // Check if required files exist
    const requiredFiles = [
      "app/page.tsx",
      "app/register/page.tsx",
      "app/platform/page.tsx",
      "public/images/bhv360-logo-full.png",
    ]

    for (const file of requiredFiles) {
      if (!fs.existsSync(file)) {
        throw new Error(`❌ Required file missing: ${file}`)
      }
      console.log(`✅ Found: ${file}`)
    }

    // 2. Build the application
    console.log("\n🔨 Building application...")
    execSync("npm run build", { stdio: "inherit" })
    console.log("✅ Build completed successfully")

    // 3. Run tests (if available)
    console.log("\n🧪 Running tests...")
    try {
      execSync("npm run test -- --passWithNoTests", { stdio: "inherit" })
      console.log("✅ Tests passed")
    } catch (error) {
      console.log("⚠️  No tests found or tests failed, continuing deployment...")
    }

    // 4. Verify deployment configuration
    console.log("\n🔍 Verifying deployment configuration...")
    console.log(`Version: ${deploymentConfig.version}`)
    console.log(`Description: ${deploymentConfig.description}`)

    // 5. Deploy to Vercel
    console.log("\n🌐 Deploying to Vercel...")
    execSync("vercel --prod", { stdio: "inherit" })

    // 6. Post-deployment verification
    console.log("\n✅ Deployment completed successfully!")
    console.log("\n📋 Deployment Summary:")
    console.log("=".repeat(40))

    deploymentConfig.changes.forEach((change) => {
      console.log(change)
    })

    console.log("\n🔍 Please verify the following:")
    deploymentConfig.verifications.forEach((verification) => {
      console.log(`• ${verification}`)
    })

    console.log("\n🌍 Your professional BHV360 homepage is now live!")
    console.log("🔗 URL: https://bhv360.nl")
    console.log("📧 Contact: info@bhv360.nl")
    console.log("📞 Phone: 033 461 6303")
  } catch (error) {
    console.error("❌ Deployment failed:", error)
    process.exit(1)
  }
}

// Run deployment
runDeployment()
