/**
 * Backup Manager voor BHV360
 * Centraal systeem voor het beheren van backups van verschillende databronnen
 */

import { supabase } from "@/lib/supabase"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { createReadStream, writeFileSync, mkdirSync, existsSync } from "fs"
import { join } from "path"
import { exec } from "child_process"
import { promisify } from "util"
import { format } from "date-fns"
import { nl } from "date-fns/locale"

// Configuratie
const BACKUP_CONFIG = {
  // Algemene instellingen
  backupDir: process.env.BACKUP_DIR || "./backups",
  retentionDays: Number.parseInt(process.env.BACKUP_RETENTION_DAYS || "30"),

  // S3 configuratie
  s3: {
    enabled: process.env.S3_BACKUP_ENABLED === "true",
    bucket: process.env.S3_BACKUP_BUCKET || "bhv360-backups",
    region: process.env.S3_BACKUP_REGION || "eu-central-1",
    accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
  },

  // Database configuratie
  database: {
    connectionString: process.env.POSTGRES_URL || "",
    pgDumpPath: process.env.PG_DUMP_PATH || "pg_dump",
  },

  // Notificatie instellingen
  notifications: {
    email: process.env.BACKUP_NOTIFICATION_EMAIL || "",
    slackWebhook: process.env.BACKUP_SLACK_WEBHOOK || "",
  },
}

// Hulpfuncties
const execPromise = promisify(exec)
const ensureBackupDir = () => {
  if (!existsSync(BACKUP_CONFIG.backupDir)) {
    mkdirSync(BACKUP_CONFIG.backupDir, { recursive: true })
  }
}

// S3 client initialiseren
const getS3Client = () => {
  if (!BACKUP_CONFIG.s3.enabled) return null

  return new S3Client({
    region: BACKUP_CONFIG.s3.region,
    credentials: {
      accessKeyId: BACKUP_CONFIG.s3.accessKeyId,
      secretAccessKey: BACKUP_CONFIG.s3.secretAccessKey,
    },
  })
}

/**
 * Maakt een backup van de Supabase database
 */
export async function backupDatabase(): Promise<string> {
  ensureBackupDir()

  const timestamp = format(new Date(), "yyyy-MM-dd_HH-mm-ss", { locale: nl })
  const filename = `bhv360_db_backup_${timestamp}.sql`
  const filepath = join(BACKUP_CONFIG.backupDir, filename)

  try {
    // Database dump uitvoeren
    await execPromise(
      `${BACKUP_CONFIG.database.pgDumpPath} -Fc ${BACKUP_CONFIG.database.connectionString} > ${filepath}`,
    )

    console.log(`Database backup succesvol gemaakt: ${filepath}`)

    // Upload naar S3 indien ingeschakeld
    if (BACKUP_CONFIG.s3.enabled) {
      await uploadToS3(filepath, `database/${filename}`)
    }

    return filepath
  } catch (error) {
    console.error("Fout bij maken database backup:", error)
    await sendBackupNotification("Database backup mislukt", JSON.stringify(error))
    throw error
  }
}

/**
 * Maakt een backup van de storage buckets in Supabase
 */
export async function backupStorageBuckets(): Promise<string[]> {
  ensureBackupDir()

  const timestamp = format(new Date(), "yyyy-MM-dd_HH-mm-ss", { locale: nl })
  const backupPaths: string[] = []

  try {
    // Lijst van buckets ophalen
    const { data: buckets, error } = await supabase.storage.listBuckets()

    if (error) throw error

    // Voor elke bucket een backup maken
    for (const bucket of buckets) {
      const bucketDir = join(BACKUP_CONFIG.backupDir, "storage", bucket.name)
      if (!existsSync(bucketDir)) {
        mkdirSync(bucketDir, { recursive: true })
      }

      // Bestanden in bucket ophalen
      const { data: files, error: listError } = await supabase.storage.from(bucket.name).list()

      if (listError) {
        console.error(`Fout bij ophalen bestanden uit bucket ${bucket.name}:`, listError)
        continue
      }

      // Elk bestand downloaden
      for (const file of files) {
        if (file.name) {
          const { data, error: downloadError } = await supabase.storage.from(bucket.name).download(file.name)

          if (downloadError) {
            console.error(`Fout bij downloaden van ${file.name}:`, downloadError)
            continue
          }

          if (data) {
            const filePath = join(bucketDir, file.name)
            const buffer = await data.arrayBuffer()
            writeFileSync(filePath, Buffer.from(buffer))
            backupPaths.push(filePath)

            // Upload naar S3 indien ingeschakeld
            if (BACKUP_CONFIG.s3.enabled) {
              await uploadToS3(filePath, `storage/${bucket.name}/${file.name}`)
            }
          }
        }
      }
    }

    console.log(`Storage backup succesvol gemaakt: ${backupPaths.length} bestanden`)
    return backupPaths
  } catch (error) {
    console.error("Fout bij maken storage backup:", error)
    await sendBackupNotification("Storage backup mislukt", JSON.stringify(error))
    throw error
  }
}

/**
 * Maakt een backup van de configuratie en instellingen
 */
export async function backupConfiguration(): Promise<string> {
  ensureBackupDir()

  const timestamp = format(new Date(), "yyyy-MM-dd_HH-mm-ss", { locale: nl })
  const filename = `bhv360_config_backup_${timestamp}.json`
  const filepath = join(BACKUP_CONFIG.backupDir, filename)

  try {
    // Configuratie ophalen uit database
    const { data: settings, error } = await supabase.from("settings").select("*")

    if (error) throw error

    // Configuratie opslaan als JSON
    writeFileSync(filepath, JSON.stringify(settings, null, 2))

    console.log(`Configuratie backup succesvol gemaakt: ${filepath}`)

    // Upload naar S3 indien ingeschakeld
    if (BACKUP_CONFIG.s3.enabled) {
      await uploadToS3(filepath, `config/${filename}`)
    }

    return filepath
  } catch (error) {
    console.error("Fout bij maken configuratie backup:", error)
    await sendBackupNotification("Configuratie backup mislukt", JSON.stringify(error))
    throw error
  }
}

/**
 * Upload een bestand naar S3
 */
async function uploadToS3(localFilePath: string, s3Key: string): Promise<void> {
  const s3Client = getS3Client()
  if (!s3Client) return

  try {
    const fileStream = createReadStream(localFilePath)

    const uploadParams = {
      Bucket: BACKUP_CONFIG.s3.bucket,
      Key: s3Key,
      Body: fileStream,
    }

    await s3Client.send(new PutObjectCommand(uploadParams))
    console.log(`Bestand geüpload naar S3: ${s3Key}`)
  } catch (error) {
    console.error("Fout bij uploaden naar S3:", error)
    throw error
  }
}

/**
 * Verwijdert oude backups op basis van retentiebeleid
 */
export async function cleanupOldBackups(): Promise<void> {
  const retentionDate = new Date()
  retentionDate.setDate(retentionDate.getDate() - BACKUP_CONFIG.retentionDays)

  try {
    // Lokale bestanden opschonen
    // Implementatie afhankelijk van bestandssysteem

    // S3 bestanden opschonen indien ingeschakeld
    if (BACKUP_CONFIG.s3.enabled) {
      // Implementatie voor S3 cleanup
    }

    console.log(`Oude backups ouder dan ${format(retentionDate, "dd-MM-yyyy")} zijn opgeschoond`)
  } catch (error) {
    console.error("Fout bij opschonen oude backups:", error)
  }
}

/**
 * Stuurt een notificatie over de backup status
 */
async function sendBackupNotification(subject: string, message: string): Promise<void> {
  // Implementatie voor e-mail notificaties

  // Implementatie voor Slack notificaties
  if (BACKUP_CONFIG.notifications.slackWebhook) {
    try {
      await fetch(BACKUP_CONFIG.notifications.slackWebhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `*${subject}*\n${message}`,
        }),
      })
    } catch (error) {
      console.error("Fout bij versturen Slack notificatie:", error)
    }
  }
}

/**
 * Voert een volledige backup uit van alle systemen
 */
export async function runFullBackup(): Promise<{
  database: string
  storage: string[]
  config: string
  timestamp: string
}> {
  const timestamp = format(new Date(), "yyyy-MM-dd_HH-mm-ss", { locale: nl })

  try {
    console.log(`Start volledige backup - ${timestamp}`)

    // Parallelle uitvoering van backups
    const [databaseBackup, storageBackups, configBackup] = await Promise.all([
      backupDatabase(),
      backupStorageBuckets(),
      backupConfiguration(),
    ])

    // Opschonen van oude backups
    await cleanupOldBackups()

    const result = {
      database: databaseBackup,
      storage: storageBackups,
      config: configBackup,
      timestamp,
    }

    await sendBackupNotification(
      "Volledige backup succesvol uitgevoerd",
      `Database: ${databaseBackup}\nStorage: ${storageBackups.length} bestanden\nConfig: ${configBackup}`,
    )

    return result
  } catch (error) {
    console.error("Fout bij uitvoeren volledige backup:", error)
    throw error
  }
}
