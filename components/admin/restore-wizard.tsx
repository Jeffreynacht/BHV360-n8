"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, ArrowRight, Database, FileJson, HardDrive, Server, Upload } from "lucide-react"

export default function RestoreWizard() {
  const [step, setStep] = useState(1)
  const [restoreType, setRestoreType] = useState<"full" | "database" | "storage" | "config">("full")
  const [backupSource, setBackupSource] = useState<"local" | "s3" | "upload">("local")
  const [selectedBackups, setSelectedBackups] = useState<{
    database?: string
    storage?: string
    config?: string
  }>({})
  const [isRestoring, setIsRestoring] = useState(false)
  const [progress, setProgress] = useState(0)
  const [restoreComplete, setRestoreComplete] = useState(false)
  const [restoreError, setRestoreError] = useState<string | null>(null)

  // Gesimuleerde backups
  const availableBackups = {
    database: [
      { id: "db1", name: "bhv360_db_backup_2023-06-10_14-30-00.sql", date: "2023-06-10T14:30:00" },
      { id: "db2", name: "bhv360_db_backup_2023-06-09_14-30-00.sql", date: "2023-06-09T14:30:00" },
      { id: "db3", name: "bhv360_db_backup_2023-06-08_14-30-00.sql", date: "2023-06-08T14:30:00" },
    ],
    storage: [
      { id: "st1", name: "bhv360_storage_backup_2023-06-10_03-00-00", date: "2023-06-10T03:00:00" },
      { id: "st2", name: "bhv360_storage_backup_2023-06-03_03-00-00", date: "2023-06-03T03:00:00" },
    ],
    config: [
      { id: "cf1", name: "bhv360_config_backup_2023-06-10_02-00-00.json", date: "2023-06-10T02:00:00" },
      { id: "cf2", name: "bhv360_config_backup_2023-06-09_02-00-00.json", date: "2023-06-09T02:00:00" },
    ],
    full: [
      { id: "full1", name: "bhv360_full_backup_2023-06-10_04-00-00", date: "2023-06-10T04:00:00" },
      { id: "full2", name: "bhv360_full_backup_2023-06-03_04-00-00", date: "2023-06-03T04:00:00" },
    ],
  }

  const handleNextStep = () => {
    setStep(step + 1)
  }

  const handlePreviousStep = () => {
    setStep(step - 1)
  }

  const handleRestore = async () => {
    setIsRestoring(true)
    setProgress(0)
    setRestoreError(null)

    // Simuleer restore proces
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval)
          return 95
        }
        return prev + 5
      })
    }, 300)

    try {
      // Simuleer een API call
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Simuleer een succesvolle restore
      clearInterval(interval)
      setProgress(100)
      setRestoreComplete(true)
    } catch (error) {
      clearInterval(interval)
      setRestoreError("Er is een fout opgetreden tijdens het herstellen. Controleer de logs voor meer informatie.")
      setProgress(0)
    } finally {
      setIsRestoring(false)
    }
  }

  const handleReset = () => {
    setStep(1)
    setRestoreType("full")
    setBackupSource("local")
    setSelectedBackups({})
    setRestoreComplete(false)
    setRestoreError(null)
    setProgress(0)
  }

  const renderStepOne = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">Stap 1: Selecteer het type herstelactie</h2>
        <p className="text-sm text-muted-foreground">Kies welk type backup je wilt herstellen</p>
      </div>

      <RadioGroup value={restoreType} onValueChange={(value) => setRestoreType(value as any)}>
        <div className="flex items-center space-x-2 mb-4">
          <RadioGroupItem value="full" id="full" />
          <Label htmlFor="full" className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            Volledige backup herstellen
          </Label>
        </div>
        <div className="flex items-center space-x-2 mb-4">
          <RadioGroupItem value="database" id="database" />
          <Label htmlFor="database" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Alleen database herstellen
          </Label>
        </div>
        <div className="flex items-center space-x-2 mb-4">
          <RadioGroupItem value="storage" id="storage" />
          <Label htmlFor="storage" className="flex items-center gap-2">
            <HardDrive className="h-4 w-4" />
            Alleen storage herstellen
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="config" id="config" />
          <Label htmlFor="config" className="flex items-center gap-2">
            <FileJson className="h-4 w-4" />
            Alleen configuratie herstellen
          </Label>
        </div>
      </RadioGroup>

      <div className="pt-4">
        <Button onClick={handleNextStep}>
          Volgende
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )

  const renderStepTwo = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">Stap 2: Selecteer de backup bron</h2>
        <p className="text-sm text-muted-foreground">Kies waar de backup vandaan moet komen</p>
      </div>

      <RadioGroup value={backupSource} onValueChange={(value) => setBackupSource(value as any)}>
        <div className="flex items-center space-x-2 mb-4">
          <RadioGroupItem value="local" id="local" />
          <Label htmlFor="local">Lokale backup</Label>
        </div>
        <div className="flex items-center space-x-2 mb-4">
          <RadioGroupItem value="s3" id="s3" />
          <Label htmlFor="s3">S3 backup</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="upload" id="upload" />
          <Label htmlFor="upload">Upload backup bestand</Label>
        </div>
      </RadioGroup>

      <div className="flex gap-4 pt-4">
        <Button variant="outline" onClick={handlePreviousStep}>
          Terug
        </Button>
        <Button onClick={handleNextStep}>
          Volgende
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )

  const renderStepThree = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">Stap 3: Selecteer de backup bestanden</h2>
        <p className="text-sm text-muted-foreground">Kies de specifieke backup bestanden om te herstellen</p>
      </div>

      {backupSource === "upload" ? (
        <div className="space-y-4">
          {(restoreType === "full" || restoreType === "database") && (
            <div className="space-y-2">
              <Label>Database backup</Label>
              <div className="flex items-center gap-2">
                <Input type="file" accept=".sql,.dump" />
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </div>
            </div>
          )}

          {(restoreType === "full" || restoreType === "storage") && (
            <div className="space-y-2">
              <Label>Storage backup</Label>
              <div className="flex items-center gap-2">
                <Input type="file" accept=".zip,.tar.gz" />
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </div>
            </div>
          )}

          {(restoreType === "full" || restoreType === "config") && (
            <div className="space-y-2">
              <Label>Configuratie backup</Label>
              <div className="flex items-center gap-2">
                <Input type="file" accept=".json" />
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {(restoreType === "full" || restoreType === "database") && (
            <div className="space-y-2">
              <Label htmlFor="database-backup">Database backup</Label>
              <Select
                value={selectedBackups.database}
                onValueChange={(value) => setSelectedBackups({ ...selectedBackups, database: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecteer een database backup" />
                </SelectTrigger>
                <SelectContent>
                  {availableBackups.database.map((backup) => (
                    <SelectItem key={backup.id} value={backup.id}>
                      {backup.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {(restoreType === "full" || restoreType === "storage") && (
            <div className="space-y-2">
              <Label htmlFor="storage-backup">Storage backup</Label>
              <Select
                value={selectedBackups.storage}
                onValueChange={(value) => setSelectedBackups({ ...selectedBackups, storage: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecteer een storage backup" />
                </SelectTrigger>
                <SelectContent>
                  {availableBackups.storage.map((backup) => (
                    <SelectItem key={backup.id} value={backup.id}>
                      {backup.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {(restoreType === "full" || restoreType === "config") && (
            <div className="space-y-2">
              <Label htmlFor="config-backup">Configuratie backup</Label>
              <Select
                value={selectedBackups.config}
                onValueChange={(value) => setSelectedBackups({ ...selectedBackups, config: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecteer een configuratie backup" />
                </SelectTrigger>
                <SelectContent>
                  {availableBackups.config.map((backup) => (
                    <SelectItem key={backup.id} value={backup.id}>
                      {backup.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-4 pt-4">
        <Button variant="outline" onClick={handlePreviousStep}>
          Terug
        </Button>
        <Button onClick={handleRestore}>
          Herstellen
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Herstel Wizard</CardTitle>
        <CardDescription>Selecteer het type herstelactie en de backup bron.</CardDescription>
      </CardHeader>
      <CardContent>
        {step === 1 && renderStepOne()}
        {step === 2 && renderStepTwo()}
        {step === 3 && renderStepThree()}
      </CardContent>
      {restoreComplete && (
        <CardFooter>
          <Alert variant="success">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Herstel voltooid</AlertTitle>
            <AlertDescription>De backup is succesvol hersteld.</AlertDescription>
          </Alert>
        </CardFooter>
      )}
      {restoreError && (
        <CardFooter>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Fout</AlertTitle>
            <AlertDescription>{restoreError}</AlertDescription>
          </Alert>
        </CardFooter>
      )}
      {isRestoring && (
        <CardFooter>
          <Progress value={progress} />
        </CardFooter>
      )}
    </Card>
  )
}
