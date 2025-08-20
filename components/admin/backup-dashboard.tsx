"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { format } from "date-fns"
import { nl } from "date-fns/locale"
import {
  Database,
  HardDrive,
  Settings,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  Download,
  RefreshCw,
  Cloud,
  Server,
  FileJson,
} from "lucide-react"

interface BackupHistoryItem {
  id: string
  type: "full" | "database" | "storage" | "config"
  status: "success" | "failed" | "in_progress"
  timestamp: string
  size?: string
  location: "local" | "s3" | "both"
  details?: string
}

export default function BackupDashboard() {
  const [isLoading, setIsLoading] = useState(false)
  const [currentOperation, setCurrentOperation] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [lastBackup, setLastBackup] = useState<string | null>("2023-06-10T14:30:00")
  const [backupHistory, setBackupHistory] = useState<BackupHistoryItem[]>([
    {
      id: "1",
      type: "full",
      status: "success",
      timestamp: "2023-06-10T14:30:00",
      size: "256 MB",
      location: "both",
    },
    {
      id: "2",
      type: "database",
      status: "success",
      timestamp: "2023-06-09T10:15:00",
      size: "120 MB",
      location: "s3",
    },
    {
      id: "3",
      type: "storage",
      status: "failed",
      timestamp: "2023-06-08T22:00:00",
      location: "local",
      details: "Onvoldoende schijfruimte",
    },
  ])

  const handleBackup = async (type: "full" | "database" | "storage" | "config") => {
    setIsLoading(true)
    setCurrentOperation(`${type} backup`)
    setProgress(0)

    // Simuleer voortgang
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
      // Hier zou de echte API call komen
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Simuleer een succesvolle backup
      const newBackup: BackupHistoryItem = {
        id: Date.now().toString(),
        type,
        status: "success",
        timestamp: new Date().toISOString(),
        size: type === "full" ? "260 MB" : type === "database" ? "125 MB" : "135 MB",
        location: "both",
      }

      setBackupHistory((prev) => [newBackup, ...prev])
      setLastBackup(new Date().toISOString())

      clearInterval(interval)
      setProgress(100)

      // Reset na 1 seconde
      setTimeout(() => {
        setProgress(0)
        setCurrentOperation(null)
        setIsLoading(false)
      }, 1000)
    } catch (error) {
      clearInterval(interval)

      // Simuleer een fout
      const newBackup: BackupHistoryItem = {
        id: Date.now().toString(),
        type,
        status: "failed",
        timestamp: new Date().toISOString(),
        location: "local",
        details: "Netwerkfout tijdens backup",
      }

      setBackupHistory((prev) => [newBackup, ...prev])
      setProgress(0)
      setCurrentOperation(null)
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Backup Beheer</h1>
          <p className="text-muted-foreground">Beheer en monitor backups van het BHV360 platform</p>
        </div>

        {lastBackup && (
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Laatste backup: {format(new Date(lastBackup), "dd MMMM yyyy HH:mm", { locale: nl })}
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database Backup
            </CardTitle>
            <CardDescription>PostgreSQL database dump</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">125 MB</div>
            <p className="text-sm text-muted-foreground">Laatste grootte</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => handleBackup("database")} disabled={isLoading} className="w-full">
              <HardDrive className="h-4 w-4 mr-2" />
              Database Backup
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Cloud className="h-5 w-5" />
              Storage Backup
            </CardTitle>
            <CardDescription>Bestanden en media</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">135 MB</div>
            <p className="text-sm text-muted-foreground">Laatste grootte</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => handleBackup("storage")} disabled={isLoading} className="w-full">
              <Cloud className="h-4 w-4 mr-2" />
              Storage Backup
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <FileJson className="h-5 w-5" />
              Configuratie Backup
            </CardTitle>
            <CardDescription>Systeem instellingen</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2 MB</div>
            <p className="text-sm text-muted-foreground">Laatste grootte</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => handleBackup("config")} disabled={isLoading} className="w-full">
              <Settings className="h-4 w-4 mr-2" />
              Config Backup
            </Button>
          </CardFooter>
        </Card>
      </div>

      {currentOperation && (
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`} />
              Backup Voortgang
            </CardTitle>
            <CardDescription>{currentOperation}</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">
              {progress < 100 ? "Bezig met backup..." : "Backup voltooid!"}
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Backup Geschiedenis</CardTitle>
            <Button variant="outline" onClick={() => handleBackup("full")} disabled={isLoading}>
              <Server className="h-4 w-4 mr-2" />
              Volledige Backup
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">Alle</TabsTrigger>
              <TabsTrigger value="success">Succesvol</TabsTrigger>
              <TabsTrigger value="failed">Mislukt</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="space-y-4">
                {backupHistory.map((backup) => (
                  <div key={backup.id} className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center gap-3">
                      {backup.status === "success" ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : backup.status === "failed" ? (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      ) : (
                        <RefreshCw className="h-5 w-5 text-amber-500 animate-spin" />
                      )}

                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {backup.type === "full" && "Volledige Backup"}
                          {backup.type === "database" && "Database Backup"}
                          {backup.type === "storage" && "Storage Backup"}
                          {backup.type === "config" && "Configuratie Backup"}

                          <Badge variant={backup.status === "success" ? "default" : "destructive"}>
                            {backup.status === "success" ? "Succesvol" : "Mislukt"}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(backup.timestamp), "dd MMM yyyy", { locale: nl })}
                          <Clock className="h-3 w-3 ml-2" />
                          {format(new Date(backup.timestamp), "HH:mm", { locale: nl })}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {backup.size && <div className="text-sm font-medium">{backup.size}</div>}

                      <Badge variant="outline">
                        {backup.location === "both" && "Lokaal + S3"}
                        {backup.location === "local" && "Alleen Lokaal"}
                        {backup.location === "s3" && "Alleen S3"}
                      </Badge>

                      {backup.status === "success" && (
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="success">
              <div className="space-y-4">
                {backupHistory
                  .filter((backup) => backup.status === "success")
                  .map((backup) => (
                    <div key={backup.id} className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />

                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {backup.type === "full" && "Volledige Backup"}
                            {backup.type === "database" && "Database Backup"}
                            {backup.type === "storage" && "Storage Backup"}
                            {backup.type === "config" && "Configuratie Backup"}

                            <Badge>Succesvol</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(backup.timestamp), "dd MMM yyyy", { locale: nl })}
                            <Clock className="h-3 w-3 ml-2" />
                            {format(new Date(backup.timestamp), "HH:mm", { locale: nl })}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {backup.size && <div className="text-sm font-medium">{backup.size}</div>}

                        <Badge variant="outline">
                          {backup.location === "both" && "Lokaal + S3"}
                          {backup.location === "local" && "Alleen Lokaal"}
                          {backup.location === "s3" && "Alleen S3"}
                        </Badge>

                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="failed">
              <div className="space-y-4">
                {backupHistory
                  .filter((backup) => backup.status === "failed")
                  .map((backup) => (
                    <div key={backup.id} className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center gap-3">
                        <AlertCircle className="h-5 w-5 text-red-500" />

                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {backup.type === "full" && "Volledige Backup"}
                            {backup.type === "database" && "Database Backup"}
                            {backup.type === "storage" && "Storage Backup"}
                            {backup.type === "config" && "Configuratie Backup"}

                            <Badge variant="destructive">Mislukt</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(backup.timestamp), "dd MMM yyyy", { locale: nl })}
                            <Clock className="h-3 w-3 ml-2" />
                            {format(new Date(backup.timestamp), "HH:mm", { locale: nl })}
                          </div>
                        </div>
                      </div>

                      <div>
                        {backup.details && (
                          <Alert variant="destructive" className="p-2 text-sm">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Fout</AlertTitle>
                            <AlertDescription>{backup.details}</AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
