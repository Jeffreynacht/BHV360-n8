/**
 * API route voor het herstellen van backups
 */

import { type NextRequest, NextResponse } from "next/server"
import { restoreDatabase, restoreStorage, restoreConfiguration, runFullRestore } from "@/lib/backup/restore-manager"

// Authenticatie middleware
const authenticateRestoreRequest = (req: NextRequest) => {
  const authHeader = req.headers.get("Authorization")
  const apiKey = process.env.BACKUP_API_KEY

  if (!authHeader || !apiKey || authHeader !== `Bearer ${apiKey}`) {
    return false
  }

  return true
}

export async function POST(req: NextRequest) {
  // Authenticatie controleren
  if (!authenticateRestoreRequest(req)) {
    return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { type = "full", paths } = body

    if (!paths) {
      return NextResponse.json({ error: "Geen paden opgegeven voor restore" }, { status: 400 })
    }

    let result

    switch (type) {
      case "full":
        if (!paths.database || !paths.storage || !paths.config) {
          return NextResponse.json({ error: "Onvolledige paden voor volledige restore" }, { status: 400 })
        }

        await runFullRestore({
          databaseBackup: paths.database,
          storageBackupDir: paths.storage,
          configBackup: paths.config,
        })

        result = { message: "Volledige restore succesvol uitgevoerd" }
        break

      case "database":
        await restoreDatabase(paths.database, body.options)
        result = { message: "Database restore succesvol uitgevoerd" }
        break

      case "storage":
        await restoreStorage(paths.storage)
        result = { message: "Storage restore succesvol uitgevoerd" }
        break

      case "config":
        await restoreConfiguration(paths.config)
        result = { message: "Configuratie restore succesvol uitgevoerd" }
        break

      default:
        return NextResponse.json({ error: "Ongeldig restore type" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      ...result,
    })
  } catch (error) {
    console.error("Fout in restore API:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Fout bij uitvoeren restore",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
