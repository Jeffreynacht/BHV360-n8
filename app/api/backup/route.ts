/**
 * API route voor het beheren van backups
 */

import { type NextRequest, NextResponse } from "next/server"
import { runFullBackup, backupDatabase, backupStorageBuckets, backupConfiguration } from "@/lib/backup/backup-manager"

// Authenticatie middleware
const authenticateBackupRequest = (req: NextRequest) => {
  const authHeader = req.headers.get("Authorization")
  const apiKey = process.env.BACKUP_API_KEY

  if (!authHeader || !apiKey || authHeader !== `Bearer ${apiKey}`) {
    return false
  }

  return true
}

export async function POST(req: NextRequest) {
  // Authenticatie controleren
  if (!authenticateBackupRequest(req)) {
    return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { type = "full" } = body

    let result

    switch (type) {
      case "full":
        result = await runFullBackup()
        break
      case "database":
        result = { database: await backupDatabase() }
        break
      case "storage":
        result = { storage: await backupStorageBuckets() }
        break
      case "config":
        result = { config: await backupConfiguration() }
        break
      default:
        return NextResponse.json({ error: "Ongeldig backup type" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: `Backup van type '${type}' succesvol uitgevoerd`,
      data: result,
    })
  } catch (error) {
    console.error("Fout in backup API:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Fout bij uitvoeren backup",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export async function GET(req: NextRequest) {
  // Authenticatie controleren
  if (!authenticateBackupRequest(req)) {
    return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 })
  }

  // Eenvoudige status check
  return NextResponse.json({
    status: "online",
    message: "Backup API is beschikbaar. Gebruik POST om backups uit te voeren.",
  })
}
