#!/usr/bin/env node

import * as fs from "fs"
import { execSync } from "child_process"

class PreFlightCheck {
  private errors: string[] = []
  private warnings: string[] = []

  async run() {
    console.log("🔍 BHV360 PRE-FLIGHT CHECK")
    console.log("==========================")
    console.log("")

    this.checkNodeVersion()
    this.checkPackageJson()
    this.checkRequiredFiles()
    this.checkGitStatus()
    this.checkDependencies()

    this.showResults()
  }

  private checkNodeVersion() {
    try {
      const nodeVersion = process.version
      const majorVersion = Number.parseInt(nodeVersion.slice(1).split(".")[0])

      if (majorVersion >= 18) {
        console.log("✅ Node.js version:", nodeVersion)
      } else {
        this.errors.push(`Node.js version ${nodeVersion} is te oud. Minimaal Node.js 18 vereist.`)
      }
    } catch (error) {
      this.errors.push("Kan Node.js versie niet bepalen")
    }
  }

  private checkPackageJson() {
    if (fs.existsSync("package.json")) {
      console.log("✅ package.json gevonden")

      try {
        const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"))
        if (pkg.name === "bhv360") {
          console.log("✅ BHV360 project gedetecteerd")
        } else {
          this.warnings.push("Project naam is niet 'bhv360'")
        }
      } catch {
        this.errors.push("package.json is niet geldig JSON")
      }
    } else {
      this.errors.push("package.json niet gevonden")
    }
  }

  private checkRequiredFiles() {
    const requiredFiles = [
      "next.config.mjs",
      "tailwind.config.ts",
      "app/layout.tsx",
      "app/page.tsx",
      "scripts/supabase-bhv360-schema.sql",
    ]

    requiredFiles.forEach((file) => {
      if (fs.existsSync(file)) {
        console.log(`✅ ${file}`)
      } else {
        this.errors.push(`Vereist bestand ontbreekt: ${file}`)
      }
    })
  }

  private checkGitStatus() {
    try {
      if (fs.existsSync(".git")) {
        console.log("✅ Git repository geïnitialiseerd")

        try {
          const status = execSync("git status --porcelain", { encoding: "utf8" })
          if (status.trim()) {
            this.warnings.push("Er zijn uncommitted wijzigingen")
          } else {
            console.log("✅ Alle wijzigingen gecommit")
          }
        } catch {
          this.warnings.push("Kan Git status niet bepalen")
        }
      } else {
        this.warnings.push("Git repository niet geïnitialiseerd (wordt automatisch gedaan)")
      }
    } catch (error) {
      this.warnings.push("Git check mislukt")
    }
  }

  private checkDependencies() {
    if (fs.existsSync("node_modules")) {
      console.log("✅ Dependencies geïnstalleerd")
    } else {
      this.errors.push("Dependencies niet geïnstalleerd. Run: npm install")
    }
  }

  private showResults() {
    console.log("")
    console.log("📊 RESULTATEN")
    console.log("=============")

    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log("🎉 Alles ziet er goed uit! Je bent klaar voor deployment.")
      console.log("")
      console.log("🚀 Start de wizard met: npm run go-live")
    } else {
      if (this.errors.length > 0) {
        console.log("")
        console.log("❌ ERRORS (moeten opgelost worden):")
        this.errors.forEach((error) => console.log(`   • ${error}`))
      }

      if (this.warnings.length > 0) {
        console.log("")
        console.log("⚠️  WARNINGS (optioneel):")
        this.warnings.forEach((warning) => console.log(`   • ${warning}`))
      }

      if (this.errors.length > 0) {
        console.log("")
        console.log("🔧 Los eerst de errors op voordat je de wizard start.")
      } else {
        console.log("")
        console.log("✅ Geen kritieke errors. Je kunt de wizard starten met: npm run go-live")
      }
    }
  }
}

if (require.main === module) {
  const check = new PreFlightCheck()
  check.run().catch(console.error)
}
