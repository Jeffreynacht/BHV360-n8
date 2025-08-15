#!/usr/bin/env node

import { execSync } from "child_process"
import * as fs from "fs"
import * as readline from "readline"
import * as path from "path"

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

interface SetupConfig {
  projectName: string
  githubUsername: string
  supabaseUrl: string
  supabaseAnonKey: string
  supabaseServiceKey: string
  supabasePassword: string
  authPassword: string
  jwtSecret: string
  appUrl: string
}

class GoLiveWizard {
  private config: Partial<SetupConfig> = {}

  async run() {
    console.clear()
    this.printHeader()

    try {
      await this.step1_Welcome()
      await this.step2_Prerequisites()
      await this.step3_CollectInfo()
      await this.step4_SetupSupabase()
      await this.step5_SetupGitHub()
      await this.step6_CreateEnvFiles()
      await this.step7_DeployVercel()
      await this.step8_FinalTest()
      await this.step9_Success()
    } catch (error) {
      console.log("\n❌ Er ging iets mis:", error)
      console.log("💡 Geen zorgen! Je kunt altijd opnieuw beginnen met: npm run go-live")
    } finally {
      rl.close()
    }
  }

  private printHeader() {
    console.log("╔══════════════════════════════════════════════════════════════╗")
    console.log("║                    🚀 BHV360 GO-LIVE WIZARD                  ║")
    console.log("║                                                              ║")
    console.log("║  Ik ga je helpen om BHV360 in 30 minuten live te zetten!    ║")
    console.log("║  Volg gewoon de stappen en ik regel de rest voor je.        ║")
    console.log("╚══════════════════════════════════════════════════════════════╝")
    console.log("")
  }

  private async step1_Welcome() {
    console.log("👋 WELKOM BIJ DE BHV360 GO-LIVE WIZARD!")
    console.log("========================================")
    console.log("")
    console.log("Deze wizard gaat:")
    console.log("✅ Een Supabase database voor je opzetten")
    console.log("✅ Je code naar GitHub pushen")
    console.log("✅ Environment variabelen configureren")
    console.log("✅ Je app naar Vercel deployen")
    console.log("✅ Alles testen en valideren")
    console.log("")
    console.log("⏱️  Geschatte tijd: 20-30 minuten")
    console.log("🔧 Je hoeft alleen maar vragen te beantwoorden!")
    console.log("")

    const ready = await this.ask("Ben je klaar om te beginnen? (y/n): ")
    if (ready.toLowerCase() !== "y") {
      console.log("👋 Geen probleem! Run 'npm run go-live' wanneer je klaar bent.")
      process.exit(0)
    }
  }

  private async step2_Prerequisites() {
    console.log("\n🔍 STAP 1: PREREQUISITES CHECKEN")
    console.log("=================================")
    console.log("")
    console.log("Ik ga checken of je alles hebt wat we nodig hebben...")
    console.log("")

    // Check if we have the required accounts
    console.log("📋 Je hebt de volgende accounts nodig:")
    console.log("   1. GitHub account (gratis)")
    console.log("   2. Supabase account (gratis)")
    console.log("   3. Vercel account (gratis)")
    console.log("")

    const hasAccounts = await this.ask("Heb je deze 3 accounts? (y/n): ")
    if (hasAccounts.toLowerCase() !== "y") {
      console.log("")
      console.log("🔗 Maak eerst deze accounts aan:")
      console.log("   • GitHub: https://github.com/signup")
      console.log("   • Supabase: https://supabase.com")
      console.log("   • Vercel: https://vercel.com/signup")
      console.log("")
      console.log("💡 Kom terug als je ze hebt en run: npm run go-live")
      process.exit(0)
    }

    console.log("✅ Accounts check: OK!")
  }

  private async step3_CollectInfo() {
    console.log("\n📝 STAP 2: PROJECT INFORMATIE")
    console.log("==============================")
    console.log("")

    this.config.projectName = await this.askWithDefault("Project naam", "bhv360")
    this.config.githubUsername = await this.ask("Je GitHub username: ")
    this.config.authPassword = await this.askWithDefault("Admin wachtwoord voor de app", "demo123")
    this.config.jwtSecret = this.generateSecret()

    console.log("")
    console.log("✅ Project info verzameld!")
    console.log(`   📦 Project: ${this.config.projectName}`)
    console.log(`   👤 GitHub: ${this.config.githubUsername}`)
    console.log(`   🔐 Wachtwoord: ${this.config.authPassword}`)
  }

  private async step4_SetupSupabase() {
    console.log("\n🗄️  STAP 3: SUPABASE DATABASE SETUP")
    console.log("====================================")
    console.log("")
    console.log("Nu gaan we je Supabase database opzetten...")
    console.log("")

    console.log("🔗 1. Ga naar: https://supabase.com")
    console.log("➕ 2. Klik op 'New Project'")
    console.log("📝 3. Vul in:")
    console.log(`      • Name: ${this.config.projectName}`)
    console.log("      • Database Password: [Kies een sterk wachtwoord]")
    console.log("      • Region: West Europe (eu-west-1)")
    console.log("⏳ 4. Wacht tot het project klaar is (2-3 minuten)")
    console.log("")

    await this.ask("Druk Enter als je project is aangemaakt...")

    console.log("")
    console.log("🔑 Nu gaan we de API keys ophalen:")
    console.log("   1. Ga naar Settings → API in je Supabase project")
    console.log("   2. Kopieer de volgende waarden:")
    console.log("")

    this.config.supabaseUrl = await this.ask("   📍 Project URL: ")
    this.config.supabaseAnonKey = await this.ask("   🔑 anon public key: ")
    this.config.supabaseServiceKey = await this.ask("   🔐 service_role key: ")
    this.config.supabasePassword = await this.ask("   🔒 Database password: ")

    console.log("")
    console.log("🗄️  Nu installeren we het database schema...")
    console.log("   1. Ga naar SQL Editor in je Supabase dashboard")
    console.log("   2. Klik 'New Query'")
    console.log("   3. Kopieer de inhoud van scripts/supabase-bhv360-schema.sql")
    console.log("   4. Plak in de editor en klik 'Run'")
    console.log("")

    await this.ask("Druk Enter als je het schema hebt uitgevoerd...")

    console.log("✅ Supabase database setup compleet!")
  }

  private async step5_SetupGitHub() {
    console.log("\n📦 STAP 4: GITHUB REPOSITORY SETUP")
    console.log("===================================")
    console.log("")

    console.log("🔗 1. Ga naar: https://github.com/new")
    console.log("📝 2. Vul in:")
    console.log(`      • Repository name: ${this.config.projectName}`)
    console.log("      • Description: Complete BHV Management Platform")
    console.log("      • Public of Private (naar keuze)")
    console.log("      • ❌ NIET 'Add a README file' aanvinken")
    console.log("➕ 3. Klik 'Create repository'")
    console.log("")

    await this.ask("Druk Enter als je de repository hebt aangemaakt...")

    console.log("")
    console.log("📤 Nu push ik je code naar GitHub...")

    try {
      // Git setup
      if (!fs.existsSync(".git")) {
        execSync("git init", { stdio: "inherit" })
      }

      execSync("git add .", { stdio: "inherit" })
      execSync('git commit -m "🚀 BHV360 platform - ready for deployment"', { stdio: "inherit" })

      const repoUrl = `https://github.com/${this.config.githubUsername}/${this.config.projectName}.git`

      try {
        execSync(`git remote add origin ${repoUrl}`, { stdio: "pipe" })
      } catch {
        // Remote might already exist
        execSync(`git remote set-url origin ${repoUrl}`, { stdio: "pipe" })
      }

      execSync("git branch -M main", { stdio: "inherit" })
      execSync("git push -u origin main", { stdio: "inherit" })

      console.log("✅ Code succesvol naar GitHub gepusht!")
    } catch (error) {
      console.log("⚠️  Automatische Git push mislukt. Doe dit handmatig:")
      console.log(
        `   git remote add origin https://github.com/${this.config.githubUsername}/${this.config.projectName}.git`,
      )
      console.log("   git branch -M main")
      console.log("   git push -u origin main")
      await this.ask("Druk Enter als je dit handmatig hebt gedaan...")
    }
  }

  private async step6_CreateEnvFiles() {
    console.log("\n🔧 STAP 5: ENVIRONMENT CONFIGURATIE")
    console.log("====================================")
    console.log("")

    const projectId = this.extractProjectId(this.config.supabaseUrl!)
    const databaseUrl = `postgresql://postgres:${this.config.supabasePassword}@db.${projectId}.supabase.co:5432/postgres`

    const envContent = `# BHV360 Environment Configuration
# Generated by Go-Live Wizard on ${new Date().toISOString()}

# Database Configuration (VERPLICHT)
NEXT_PUBLIC_SUPABASE_URL=${this.config.supabaseUrl}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${this.config.supabaseAnonKey}
SUPABASE_SERVICE_ROLE_KEY=${this.config.supabaseServiceKey}
DATABASE_URL=${databaseUrl}

# Authentication (VERPLICHT)
AUTH_PASSWORD=${this.config.authPassword}
JWT_SECRET=${this.config.jwtSecret}

# App Configuration (VERPLICHT)
NEXT_PUBLIC_APP_URL=https://${this.config.projectName}.vercel.app
NEXT_PUBLIC_DOMAIN=${this.config.projectName}.vercel.app

# Features (AANBEVOLEN)
NEXT_PUBLIC_ENABLE_BROWSER_NOTIFICATIONS=true
NEXT_PUBLIC_DEFAULT_PASSWORD=${this.config.authPassword}

# Monitoring (OPTIONEEL - vul later in indien gewenst)
SLACK_WEBHOOK_URL=
NEXT_PUBLIC_DISCORD_WEBHOOK_URL=
SMTP_HOST=
`

    fs.writeFileSync(".env.local", envContent)
    fs.writeFileSync(".env.example", envContent.replace(/=.+$/gm, "="))

    console.log("✅ Environment files aangemaakt!")
    console.log("   📁 .env.local - voor lokale development")
    console.log("   📁 .env.example - voor documentatie")
  }

  private async step7_DeployVercel() {
    console.log("\n🚀 STAP 6: VERCEL DEPLOYMENT")
    console.log("=============================")
    console.log("")

    console.log("🔗 1. Ga naar: https://vercel.com")
    console.log("📦 2. Klik 'Import Project' of 'Add New...' → 'Project'")
    console.log(`🔍 3. Selecteer je GitHub repository: ${this.config.githubUsername}/${this.config.projectName}`)
    console.log("⚙️  4. Voeg deze Environment Variables toe:")
    console.log("")

    // Show environment variables for Vercel
    console.log("   📋 KOPIEER DEZE VARIABELEN NAAR VERCEL:")
    console.log("   ==========================================")
    console.log(`   NEXT_PUBLIC_SUPABASE_URL=${this.config.supabaseUrl}`)
    console.log(`   NEXT_PUBLIC_SUPABASE_ANON_KEY=${this.config.supabaseAnonKey}`)
    console.log(`   SUPABASE_SERVICE_ROLE_KEY=${this.config.supabaseServiceKey}`)
    console.log(`   AUTH_PASSWORD=${this.config.authPassword}`)
    console.log(`   JWT_SECRET=${this.config.jwtSecret}`)
    console.log(`   NEXT_PUBLIC_APP_URL=https://${this.config.projectName}.vercel.app`)
    console.log(`   NEXT_PUBLIC_ENABLE_BROWSER_NOTIFICATIONS=true`)
    console.log("")

    console.log("🚀 5. Klik 'Deploy' en wacht tot deployment klaar is")
    console.log("")

    await this.ask("Druk Enter als de deployment succesvol is...")

    this.config.appUrl = await this.askWithDefault("Wat is je app URL", `https://${this.config.projectName}.vercel.app`)

    console.log("✅ App succesvol gedeployed naar Vercel!")
  }

  private async step8_FinalTest() {
    console.log("\n🧪 STAP 7: FINALE TESTS")
    console.log("========================")
    console.log("")

    console.log(`🌐 Test je app: ${this.config.appUrl}`)
    console.log("")
    console.log("👤 Login gegevens:")
    console.log("   📧 Email: jan@demobedrijf.nl")
    console.log(`   🔐 Password: ${this.config.authPassword}`)
    console.log("")
    console.log("🧪 Test deze features:")
    console.log("   ✅ Dashboard laadt zonder errors")
    console.log("   ✅ Plotkaart editor opent")
    console.log("   ✅ Gebruikers pagina werkt")
    console.log("   ✅ Notifications setup pagina")
    console.log("   ✅ Mobile responsive (test op telefoon)")
    console.log("")

    const allWorking = await this.ask("Werken alle features correct? (y/n): ")

    if (allWorking.toLowerCase() !== "y") {
      console.log("")
      console.log("🔧 TROUBLESHOOTING:")
      console.log("   1. Check Vercel deployment logs voor errors")
      console.log("   2. Check browser console (F12) voor JavaScript errors")
      console.log("   3. Controleer of alle environment variables correct zijn")
      console.log("   4. Test Supabase connectie in de app")
      console.log("")
      console.log("💡 Vraag hulp in de chat als je er niet uitkomt!")
      return
    }

    console.log("✅ Alle tests geslaagd!")
  }

  private async step9_Success() {
    console.log("\n🎉 GEFELICITEERD! BHV360 IS NU LIVE!")
    console.log("====================================")
    console.log("")
    console.log("🌐 Je app is live op:")
    console.log(`   ${this.config.appUrl}`)
    console.log("")
    console.log("👤 Login gegevens:")
    console.log("   📧 Email: jan@demobedrijf.nl")
    console.log(`   🔐 Password: ${this.config.authPassword}`)
    console.log("")
    console.log("📋 Wat je nu kunt doen:")
    console.log("   🎨 Branding aanpassen (logo, kleuren)")
    console.log("   👥 Echte gebruikers toevoegen")
    console.log("   📧 SMTP configureren voor echte emails")
    console.log("   📱 SMS provider toevoegen")
    console.log("   🌍 Custom domain koppelen")
    console.log("")
    console.log("📚 Documentatie:")
    console.log("   📖 README.md - Algemene informatie")
    console.log("   🚀 DEPLOYMENT-GUIDE.md - Deployment details")
    console.log("   🔧 SETUP-CHECKLIST.md - Post-deployment taken")
    console.log("")
    console.log("🎊 Je BHV360 platform is klaar voor gebruik!")
    console.log("")

    // Save config for future reference
    const configPath = path.join(process.cwd(), ".bhv360-config.json")
    fs.writeFileSync(configPath, JSON.stringify(this.config, null, 2))
    console.log(`💾 Configuratie opgeslagen in: ${configPath}`)
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

  private generateSecret(): string {
    return require("crypto").randomBytes(32).toString("hex")
  }

  private extractProjectId(url: string): string {
    try {
      return url.split("//")[1].split(".")[0]
    } catch {
      return "your-project-id"
    }
  }
}

// Run the wizard
if (require.main === module) {
  const wizard = new GoLiveWizard()
  wizard.run().catch((error) => {
    console.error("❌ Wizard error:", error)
    process.exit(1)
  })
}

export default GoLiveWizard
