#!/usr/bin/env node

import { existsSync, readFileSync } from "fs"
import { execSync } from "child_process"

class SetupValidator {
  private errors: string[] = []
  private warnings: string[] = []

  async validate() {
    console.log("🔍 BHV360 Setup Validatie")
    console.log("==========================\n")

    this.checkFiles()
    this.checkEnvironmentVariables()
    await this.checkDatabaseConnection()
    this.checkDependencies()
    await this.checkBuild()

    this.showResults()
  }

  private checkFiles() {
    console.log("📁 Bestanden controleren...")

    const requiredFiles = [".env.local", "package.json", "next.config.mjs", "scripts/database-schema.sql"]

    for (const file of requiredFiles) {
      if (existsSync(file)) {
        console.log(`✅ ${file}`)
      } else {
        this.errors.push(`❌ Ontbrekend bestand: ${file}`)
      }
    }

    // Check optional files
    const optionalFiles = ["vercel-env.json", "deploy.sh"]

    for (const file of optionalFiles) {
      if (existsSync(file)) {
        console.log(`✅ ${file} (optioneel)`)
      } else {
        this.warnings.push(`⚠️  Ontbrekend optioneel bestand: ${file}`)
      }
    }

    console.log()
  }

  private checkEnvironmentVariables() {
    console.log("🔧 Environment variabelen controleren...")

    if (!existsSync(".env.local")) {
      this.errors.push("❌ .env.local bestand niet gevonden")
      return
    }

    const envContent = readFileSync(".env.local", "utf8")
    const requiredVars = [
      "NEXT_PUBLIC_SUPABASE_URL",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      "SUPABASE_SERVICE_ROLE_KEY",
      "NEXT_PUBLIC_APP_URL",
    ]

    for (const varName of requiredVars) {
      if (envContent.includes(`${varName}=`) && !envContent.includes(`${varName}=your-value-here`)) {
        console.log(`✅ ${varName}`)
      } else {
        this.errors.push(`❌ Ontbrekende of ongeldige env var: ${varName}`)
      }
    }

    // Check optional vars
    const optionalVars = ["SLACK_WEBHOOK_URL", "NEXTAUTH_SECRET"]

    for (const varName of optionalVars) {
      if (envContent.includes(`${varName}=`) && !envContent.includes(`${varName}=your-value-here`)) {
        console.log(`✅ ${varName} (optioneel)`)
      } else {
        this.warnings.push(`⚠️  Optionele env var niet ingesteld: ${varName}`)
      }
    }

    console.log()
  }

  private async checkDatabaseConnection() {
    console.log("🗄️  Database connectie controleren...")

    try {
      // Load environment variables
      require("dotenv").config({ path: ".env.local" })

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseKey) {
        this.errors.push("❌ Supabase credentials niet gevonden")
        return
      }

      // Test connection
      const response = await fetch(`${supabaseUrl}/rest/v1/customers?select=count`, {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      })

      if (response.ok) {
        console.log("✅ Database connectie succesvol")

        // Check if tables exist
        const data = await response.json()
        if (Array.isArray(data)) {
          console.log("✅ Database tabellen bestaan")
        } else {
          this.warnings.push("⚠️  Database schema mogelijk niet uitgevoerd")
        }
      } else {
        this.errors.push(`❌ Database connectie mislukt: ${response.status}`)
      }
    } catch (error) {
      this.errors.push(`❌ Database connectie fout: ${error}`)
    }

    console.log()
  }

  private checkDependencies() {
    console.log("📦 Dependencies controleren...")

    try {
      if (!existsSync("node_modules")) {
        this.errors.push('❌ node_modules niet gevonden. Voer "npm install" uit.')
        return
      }

      const packageJson = JSON.parse(readFileSync("package.json", "utf8"))
      const requiredDeps = ["@supabase/supabase-js", "next", "react", "tailwindcss"]

      for (const dep of requiredDeps) {
        if (packageJson.dependencies?.[dep] || packageJson.devDependencies?.[dep]) {
          console.log(`✅ ${dep}`)
        } else {
          this.errors.push(`❌ Ontbrekende dependency: ${dep}`)
        }
      }
    } catch (error) {
      this.errors.push(`❌ Fout bij controleren dependencies: ${error}`)
    }

    console.log()
  }

  private async checkBuild() {
    console.log("🔨 Build test...")

    try {
      execSync("npm run build", { stdio: "pipe" })
      console.log("✅ Build succesvol")
    } catch (error) {
      this.errors.push("❌ Build mislukt. Controleer de console voor details.")
    }

    console.log()
  }

  private showResults() {
    console.log("📊 Validatie Resultaten")
    console.log("=======================\n")

    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log("🎉 Perfecte setup! Je bent klaar om te deployen.")
      console.log("\nVolgende stappen:")
      console.log('1. Voer "npm run deploy" uit om te deployen naar Vercel')
      console.log("2. Configureer je domain in Vercel (optioneel)")
      console.log("3. Test je live applicatie")
      return
    }

    if (this.errors.length > 0) {
      console.log("❌ FOUTEN (moeten worden opgelost):")
      for (const error of this.errors) {
        console.log(`   ${error}`)
      }
      console.log()
    }

    if (this.warnings.length > 0) {
      console.log("⚠️  WAARSCHUWINGEN (optioneel):")
      for (const warning of this.warnings) {
        console.log(`   ${warning}`)
      }
      console.log()
    }

    if (this.errors.length > 0) {
      console.log("🔧 Los eerst alle fouten op voordat je deploy.")
      process.exit(1)
    } else {
      console.log("✅ Setup is klaar! Waarschuwingen zijn optioneel.")
      console.log("\nJe kunt nu deployen met: npm run deploy")
    }
  }
}

// Run validator
if (require.main === module) {
  const validator = new SetupValidator()
  validator.validate().catch(console.error)
}

export { SetupValidator }
