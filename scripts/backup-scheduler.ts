/**
 * Backup Scheduler Script
 *
 * Dit script kan worden uitgevoerd als een cron job om automatische backups te plannen
 * Gebruik bijvoorbeeld: node backup-scheduler.js --type=full
 */

import { runFullBackup, backupDatabase, backupStorageBuckets, backupConfiguration } from "../lib/backup/backup-manager"
import { format } from "date-fns"
import { nl } from "date-fns/locale"

// Parse command line arguments
const args = process.argv.slice(2)
const typeArg = args.find((arg) => arg.startsWith("--type="))
const type = typeArg ? typeArg.split("=")[1] : "full"

async function runScheduledBackup() {
  const startTime = new Date()
  console.log(`[${format(startTime, "dd-MM-yyyy HH:mm:ss", { locale: nl })}] Start geplande backup: ${type}`)

  try {
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
        throw new Error(`Ongeldig backup type: ${type}`)
    }

    const endTime = new Date()
    const duration = (endTime.getTime() - startTime.getTime()) / 1000

    console.log(
      `[${format(endTime, "dd-MM-yyyy HH:mm:ss", { locale: nl })}] Backup voltooid in ${duration.toFixed(2)} seconden`,
    )
    console.log("Resultaat:", JSON.stringify(result, null, 2))

    process.exit(0)
  } catch (error) {
    console.error(`[${format(new Date(), "dd-MM-yyyy HH:mm:ss", { locale: nl })}] Fout bij uitvoeren backup:`, error)
    process.exit(1)
  }
}

// Start de backup
runScheduledBackup()
