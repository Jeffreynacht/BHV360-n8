import { offlineStorage } from "./offline-storage"

// Synchronisatie manager voor offline/online synchronisatie
export class SyncManager {
  private isSyncing = false
  private syncInterval: number | null = null

  // Start de synchronisatie
  startSync(intervalMs = 30000) {
    if (this.syncInterval) {
      clearInterval(this.syncInterval)
    }

    // Voer direct een synchronisatie uit
    this.syncPendingActions()

    // Start een interval voor periodieke synchronisatie
    this.syncInterval = window.setInterval(() => {
      this.syncPendingActions()
    }, intervalMs)
  }

  // Stop de synchronisatie
  stopSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval)
      this.syncInterval = null
    }
  }

  // Synchroniseer wachtende acties
  async syncPendingActions() {
    // Als we al aan het synchroniseren zijn of offline, doe niets
    if (this.isSyncing || !navigator.onLine) {
      return
    }

    this.isSyncing = true

    try {
      // Haal alle wachtende acties op
      const pendingActions = await offlineStorage.getPendingActions()
      const pendingActionsToProcess = pendingActions.filter((action) => action.status === "pending")

      // Als er geen wachtende acties zijn, stop
      if (pendingActionsToProcess.length === 0) {
        this.isSyncing = false
        return
      }

      console.log(`Synchronizing ${pendingActionsToProcess.length} pending actions...`)

      // Verwerk elke actie
      for (const action of pendingActionsToProcess) {
        try {
          // Markeer de actie als 'processing'
          await offlineStorage.updatePendingActionStatus(action.id, "processing")

          // Voer de actie uit op basis van het type
          switch (action.type) {
            case "create":
              await this.handleCreateAction(action)
              break
            case "update":
              await this.handleUpdateAction(action)
              break
            case "delete":
              await this.handleDeleteAction(action)
              break
          }

          // Als de actie succesvol is uitgevoerd, verwijder deze
          await offlineStorage.deletePendingAction(action.id)
        } catch (error) {
          console.error(`Error processing action ${action.id}:`, error)
          // Markeer de actie als 'failed'
          await offlineStorage.updatePendingActionStatus(action.id, "failed")
        }
      }
    } catch (error) {
      console.error("Error during sync:", error)
    } finally {
      this.isSyncing = false
    }
  }

  // Handle create actions
  private async handleCreateAction(action: any) {
    const response = await fetch(`/api/${action.table}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(action.data),
    })

    if (!response.ok) {
      throw new Error(`Failed to create ${action.table}: ${response.statusText}`)
    }

    return response.json()
  }

  // Handle update actions
  private async handleUpdateAction(action: any) {
    const response = await fetch(`/api/${action.table}/${action.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(action.data),
    })

    if (!response.ok) {
      throw new Error(`Failed to update ${action.table}: ${response.statusText}`)
    }

    return response.json()
  }

  // Handle delete actions
  private async handleDeleteAction(action: any) {
    const response = await fetch(`/api/${action.table}/${action.id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error(`Failed to delete ${action.table}: ${response.statusText}`)
    }

    return response.json()
  }

  // Check if there are pending actions
  async hasPendingActions(): Promise<boolean> {
    const pendingActions = await offlineStorage.getPendingActions()
    return pendingActions.some((action) => action.status === "pending")
  }

  // Get sync status
  getSyncStatus() {
    return {
      isSyncing: this.isSyncing,
      isOnline: navigator.onLine,
      syncInterval: this.syncInterval,
    }
  }
}

// Export singleton instance
export const syncManager = new SyncManager()
