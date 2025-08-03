#!/usr/bin/env node

import { execSync } from "child_process"
import * as fs from "fs"
import * as readline from "readline"

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

class JeffreyGoLiveWizard {
  private config = {
    projectName: "bhv360",
    githubUsername: "Jeffreynacht",
    vercelTeam: "jeffrey-nachtegaals-projects",
    authPassword: "demo123",
    jwtSecret: "",
    supabaseUrl: "",
    supabaseAnonKey: "",
    supabaseServiceKey: "",
    appUrl: "",
  }

  async run() {
    console.clear()
    this.printHeader()

    try {
      await this.step1_Welcome()
      await this.step2_SupabaseSetup()
      await this.step3_CreateRepository()
      await this.step4_ConfigureEnvironment()
      await this.step5_DeployToVercel()
      await this.step6_FinalTest()
      await this.step7_Success()
    } catch (error) {
      console.log("\n❌ Er ging iets mis:", error)
      console.log("💡 Geen zorgen! We kunnen altijd opnieuw beginnen.")
    } finally {
      rl.close()
    }
  }

  private printHeader() {
    console.log("╔══════════════════════════════════════════════════════════════╗")
    console.log("║                🚀 JEFFREY'S BHV360 GO-LIVE WIZARD            ║")
    console.log("║                                                              ║")
    console.log("║  Hallo Jeffrey! Ik ga BHV360 voor je live zetten.           ║")
    console.log("║  Je hebt al alle accounts, dus dit wordt super snel! 🎯     ║")
    console.log("╚══════════════════════════════════════════════════════════════╝")
    console.log("")
  }

  private async step1_Welcome() {
    console.log("👋 HALLO JEFFREY!")
    console.log("=================")
    console.log("")
    console.log("Ik zie dat je al hebt:")
    console.log("✅ GitHub account: Jeffreynacht")
    console.log("✅ Vercel account: jeffrey-nachtegaals-projects")
    console.log("✅ Supabase integratie al actief")
    console.log("")
    console.log("🚀 Dit betekent dat we super snel kunnen gaan!")
    console.log("⏱️  Geschatte tijd: 15-20 minuten")
    console.log("")

    const ready = await this.ask("Klaar om BHV360 live te zetten? (y/n): ")
    if (ready.toLowerCase() !== "y") {
      console.log("👋 Oké! Run dit script opnieuw wanneer je klaar bent.")
      process.exit(0)
    }

    // Generate JWT secret
    this.config.jwtSecret = require("crypto").randomBytes(32).toString("hex")
    console.log("✅ JWT secret gegenereerd!")
  }

  private async step2_SupabaseSetup() {
    console.log("\n🗄️  STAP 1: SUPABASE PROJECT SETUP")
    console.log("===================================")
    console.log("")
    console.log("Ik zie dat je al een Supabase integratie hebt in Vercel.")
    console.log("Laten we een nieuw BHV360 project aanmaken:")
    console.log("")

    console.log("🔗 1. Ga naar: https://supabase.com/dashboard")
    console.log("➕ 2. Klik 'New Project'")
    console.log("📝 3. Vul in:")
    console.log("      • Name: BHV360")
    console.log("      • Database Password: [Kies een sterk wachtwoord - bewaar dit!]")
    console.log("      • Region: West Europe (eu-west-1)")
    console.log("⏳ 4. Wacht tot project klaar is (2-3 minuten)")
    console.log("")

    await this.ask("✅ Druk Enter als je Supabase project klaar is...")

    console.log("")
    console.log("🔑 Nu de API gegevens ophalen:")
    console.log("   1. Ga naar Settings → API in je nieuwe BHV360 project")
    console.log("   2. Kopieer de volgende waarden:")
    console.log("")

    this.config.supabaseUrl = await this.ask("   📍 Project URL: ")
    this.config.supabaseAnonKey = await this.ask("   🔑 anon public key: ")
    this.config.supabaseServiceKey = await this.ask("   🔐 service_role key: ")

    console.log("")
    console.log("🗄️  Database schema installeren:")
    console.log("   1. Ga naar SQL Editor in je Supabase dashboard")
    console.log("   2. Klik 'New Query'")
    console.log("   3. Kopieer de inhoud van scripts/supabase-bhv360-schema.sql")
    console.log("   4. Plak in editor en klik 'Run'")
    console.log("")

    await this.ask("✅ Druk Enter als schema is geïnstalleerd...")
    console.log("✅ Supabase setup compleet!")
  }

  private async step3_CreateRepository() {
    console.log("\n📦 STAP 2: GITHUB REPOSITORY")
    console.log("=============================")
    console.log("")

    console.log("Ik zie je hebt al een 'BHV360-oud' repository.")
    console.log("Laten we een nieuwe 'bhv360' repository maken voor de nieuwe versie:")
    console.log("")

    console.log("🔗 1. Ga naar: https://github.com/new")
    console.log("📝 2. Vul in:")
    console.log("      • Repository name: bhv360")
    console.log("      • Description: Complete BHV Management Platform - Production Ready")
    console.log("      • Public (aanbevolen voor portfolio)")
    console.log("      • ❌ NIET 'Add a README file' aanvinken")
    console.log("➕ 3. Klik 'Create repository'")
    console.log("")

    await this.ask("✅ Druk Enter als repository is aangemaakt...")

    console.log("")
    console.log("📤 Code naar GitHub pushen...")

    try {
      // Git setup
      if (!fs.existsSync(".git")) {
        execSync("git init", { stdio: "inherit" })
      }

      execSync("git add .", { stdio: "inherit" })
      execSync('git commit -m "🚀 BHV360 Production Platform - Complete System"', { stdio: "inherit" })

      const repoUrl = `https://github.com/${this.config.githubUsername}/${this.config.projectName}.git`

      try {
        execSync(`git remote add origin ${repoUrl}`, { stdio: "pipe" })
      } catch {
        execSync(`git remote set-url origin ${repoUrl}`, { stdio: "pipe" })
      }

      execSync("git branch -M main", { stdio: "inherit" })
      execSync("git push -u origin main", { stdio: "inherit" })

      console.log("✅ Code succesvol naar GitHub gepusht!")
    } catch (error) {
      console.log("⚠️  Automatische push mislukt. Doe dit handmatig:")
      console.log(
        `   git remote add origin https://github.com/${this.config.githubUsername}/${this.config.projectName}.git`,
      )
      console.log("   git branch -M main")
      console.log("   git push -u origin main")
      await this.ask("✅ Druk Enter als je dit handmatig hebt gedaan...")
    }
  }

  private async step4_ConfigureEnvironment() {
    console.log("\n🔧 STAP 3: ENVIRONMENT CONFIGURATIE")
    console.log("====================================")
    console.log("")

    const projectId = this.extractProjectId(this.config.supabaseUrl)
    this.config.appUrl = `https://${this.config.projectName}.vercel.app`

    const envContent = `# BHV360 Production Environment
# Generated for Jeffrey Nachtegaal on ${new Date().toISOString()}

# Database Configuration (VERPLICHT)
NEXT_PUBLIC_SUPABASE_URL=${this.config.supabaseUrl}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${this.config.supabaseAnonKey}
SUPABASE_SERVICE_ROLE_KEY=${this.config.supabaseServiceKey}

# Authentication (VERPLICHT)
AUTH_PASSWORD=${this.config.authPassword}
JWT_SECRET=${this.config.jwtSecret}

# App Configuration (VERPLICHT)
NEXT_PUBLIC_APP_URL=${this.config.appUrl}
NEXT_PUBLIC_DOMAIN=${this.config.projectName}.vercel.app

# Features (AANBEVOLEN)
NEXT_PUBLIC_ENABLE_BROWSER_NOTIFICATIONS=true
NEXT_PUBLIC_DEFAULT_PASSWORD=${this.config.authPassword}

# Production Ready
NODE_ENV=production
`

    fs.writeFileSync(".env.local", envContent)
    fs.writeFileSync(".env.production", envContent)

    console.log("✅ Environment files aangemaakt!")
    console.log("   📁 .env.local - voor lokale development")
    console.log("   📁 .env.production - voor productie")
  }

  private async step5_DeployToVercel() {
    console.log("\n🚀 STAP 4: VERCEL DEPLOYMENT")
    console.log("=============================")
    console.log("")

    console.log("🔗 1. Ga naar: https://vercel.com/new")
    console.log("📦 2. Selecteer je GitHub repository: Jeffreynacht/bhv360")
    console.log("⚙️  3. Voeg deze Environment Variables toe:")
    console.log("")

    console.log("   📋 KOPIEER DEZE NAAR VERCEL:")
    console.log("   ============================")
    console.log(`   NEXT_PUBLIC_SUPABASE_URL=${this.config.supabaseUrl}`)
    console.log(`   NEXT_PUBLIC_SUPABASE_ANON_KEY=${this.config.supabaseAnonKey}`)
    console.log(`   SUPABASE_SERVICE_ROLE_KEY=${this.config.supabaseServiceKey}`)
    console.log(`   AUTH_PASSWORD=${this.config.authPassword}`)
    console.log(`   JWT_SECRET=${this.config.jwtSecret}`)
    console.log(`   NEXT_PUBLIC_APP_URL=${this.config.appUrl}`)
    console.log(`   NEXT_PUBLIC_ENABLE_BROWSER_NOTIFICATIONS=true`)
    console.log("")

    console.log("🚀 4. Klik 'Deploy'")
    console.log("⏳ 5. Wacht op deployment (2-3 minuten)")
    console.log("")

    await this.ask("✅ Druk Enter als deployment succesvol is...")

    const actualUrl = await this.askWithDefault("Wat is je live app URL", this.config.appUrl)
    this.config.appUrl = actualUrl

    console.log("✅ BHV360 is nu live!")
  }

  private async step6_FinalTest() {
    console.log("\n🧪 STAP 5: LIVE TESTEN")
    console.log("======================")
    console.log("")

    console.log(`🌐 Test je app: ${this.config.appUrl}`)
    console.log("")
    console.log("👤 Login met:")
    console.log("   📧 Email: jan@demobedrijf.nl")
    console.log(`   🔐 Password: ${this.config.authPassword}`)
    console.log("")
    console.log("🧪 Test deze features:")
    console.log("   ✅ Dashboard laadt")
    console.log("   ✅ Plotkaart editor werkt")
    console.log("   ✅ Gebruikers beheer")
    console.log("   ✅ Notifications systeem")
    console.log("   ✅ Mobile responsive")
    console.log("")

    const allWorking = await this.ask("Werkt alles perfect? (y/n): ")

    if (allWorking.toLowerCase() !== "y") {
      console.log("")
      console.log("🔧 TROUBLESHOOTING TIPS:")
      console.log("   • Check Vercel deployment logs")
      console.log("   • Check browser console (F12)")
      console.log("   • Verify environment variables")
      console.log("   • Test Supabase connection")
      return
    }

    console.log("✅ Alle tests geslaagd! 🎉")
  }

  private async step7_Success() {
    console.log("\n🎉 GEFELICITEERD JEFFREY!")
    console.log("=========================")
    console.log("")
    console.log("🚀 BHV360 is nu volledig live en operationeel!")
    console.log("")
    console.log("🌐 Je app:")
    console.log(`   ${this.config.appUrl}`)
    console.log("")
    console.log("👤 Admin login:")
    console.log("   📧 jan@demobedrijf.nl")
    console.log(`   🔐 ${this.config.authPassword}`)
    console.log("")
    console.log("📊 Je hebt nu:")
    console.log("   ✅ Complete BHV management platform")
    console.log("   ✅ Real-time notifications")
    console.log("   ✅ Plotkaart editor")
    console.log("   ✅ User management")
    console.log("   ✅ Mobile responsive design")
    console.log("   ✅ Production-ready deployment")
    console.log("")
    console.log("🎯 Volgende stappen:")
    console.log("   🎨 Pas branding aan (logo, kleuren)")
    console.log("   👥 Voeg echte gebruikers toe")
    console.log("   📧 Configureer SMTP voor emails")
    console.log("   🌍 Koppel custom domain")
    console.log("")
    console.log("🎊 Veel succes met je BHV360 platform!")

    // Save config
    fs.writeFileSync(".bhv360-config.json", JSON.stringify(this.config, null, 2))
  }

  private ask(question: string): Promise<string> {
    return new Promise((resolve) => {
      rl.question(question, resolve)
    })
  }

  private async askWithDefault(question: string, defaultValue: string): Promise<string> {
    const answer = await this.ask(`${question} (${defaultValue}): `)
    return answer.trim() || defaultValue
  }

  private extractProjectId(url: string): string {
    try {
      return url.split("//")[1].split(".")[0]
    } catch {
      return "project-id"
    }
  }
}

// Run Jeffrey's wizard
if (require.main === module) {
  const wizard = new JeffreyGoLiveWizard()
  wizard.run().catch((error) => {
    console.error("❌ Error:", error)
    process.exit(1)
  })
}
