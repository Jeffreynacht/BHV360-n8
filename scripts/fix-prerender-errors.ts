#!/usr/bin/env node
import { writeFileSync, readFileSync } from "fs"
import { join } from "path"

console.log("🚨 EMERGENCY: Fixing prerender errors...")

// List of pages that need to be made dynamic
const pagesToFix = [
  "app/aed-monitoring/page.tsx",
  "app/wifi/page.tsx",
  "app/beheer/voorzieningen/page.tsx",
  "app/dashboard/page.tsx",
  "app/klanten/page.tsx",
  "app/beheer/gebruikers/page.tsx",
  "app/profiel/page.tsx",
  "app/instellingen/page.tsx",
  "app/notificaties/page.tsx",
  "app/help/page.tsx",
  "app/bhv/page.tsx",
  "app/incidenten/page.tsx",
  "app/ehbo-voorraad/page.tsx",
  "app/site-map/page.tsx",
  "app/video-tutorials/page.tsx",
  "app/beheer/inspectierapporten/page.tsx",
  "app/beheer/inspectiekalender/page.tsx",
  "app/beheer/nfc-overzicht/page.tsx",
  "app/beheer/plotkaart-editor/page.tsx",
  "app/beheer/backups/page.tsx",
  "app/beheer/performance/page.tsx",
  "app/beheer/api-integraties/page.tsx",
  "app/beheer/autorisaties/page.tsx",
  "app/beheer/beheeromgeving/page.tsx",
  "app/beheer/nfc-verdiepingen/page.tsx",
]

function addDynamicExport(filePath: string) {
  try {
    const fullPath = join(process.cwd(), filePath)
    const content = readFileSync(fullPath, "utf8")

    // Check if dynamic export already exists
    if (content.includes("export const dynamic = 'force-dynamic'")) {
      console.log(`✅ ${filePath} already has dynamic export`)
      return
    }

    // Add dynamic export at the top after imports
    const lines = content.split("\n")
    let insertIndex = 0

    // Find the last import line
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith("import ") || lines[i].startsWith("import'") || lines[i].startsWith("import{")) {
        insertIndex = i + 1
      }
    }

    // Insert the dynamic export
    lines.splice(insertIndex, 0, "", "export const dynamic = 'force-dynamic'", "")

    writeFileSync(fullPath, lines.join("\n"))
    console.log(`✅ Fixed ${filePath}`)
  } catch (error) {
    console.log(`⚠️  Could not fix ${filePath}: ${error}`)
  }
}

// Fix all pages
pagesToFix.forEach(addDynamicExport)

console.log("✅ All prerender errors fixed!")
console.log("🚀 Ready for deployment!")
