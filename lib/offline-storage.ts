// Gebruik IndexedDB voor offline opslag
export class OfflineStorage {
  private dbName: string
  private dbVersion: number
  private db: IDBDatabase | null = null

  constructor(dbName = "bhv360-offline", dbVersion = 1) {
    this.dbName = dbName
    this.dbVersion = dbVersion
  }

  // Open de database
  async openDatabase(): Promise<IDBDatabase> {
    if (this.db) return this.db

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion)

      request.onerror = (event) => {
        console.error("Error opening IndexedDB:", event)
        reject("Error opening IndexedDB")
      }

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result
        resolve(this.db)
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Maak object stores aan voor verschillende entiteiten
        if (!db.objectStoreNames.contains("incidents")) {
          db.createObjectStore("incidents", { keyPath: "id" })
        }

        if (!db.objectStoreNames.contains("users")) {
          db.createObjectStore("users", { keyPath: "id" })
        }

        if (!db.objectStoreNames.contains("facilities")) {
          db.createObjectStore("facilities", { keyPath: "id" })
        }

        if (!db.objectStoreNames.contains("nfcTags")) {
          db.createObjectStore("nfcTags", { keyPath: "id" })
        }

        if (!db.objectStoreNames.contains("pendingActions")) {
          const pendingStore = db.createObjectStore("pendingActions", {
            keyPath: "id",
            autoIncrement: true,
          })
          pendingStore.createIndex("status", "status", { unique: false })
          pendingStore.createIndex("timestamp", "timestamp", { unique: false })
        }
      }
    })
  }

  // Sla gegevens op in de offline opslag
  async saveData<T>(storeName: string, data: T): Promise<T> {
    const db = await this.openDatabase()

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, "readwrite")
      const store = transaction.objectStore(storeName)
      const request = store.put(data)

      request.onerror = (event) => {
        console.error(`Error saving data to ${storeName}:`, event)
        reject(`Error saving data to ${storeName}`)
      }

      request.onsuccess = () => {
        resolve(data)
      }
    })
  }

  // Haal gegevens op uit de offline opslag
  async getData<T>(storeName: string, id: string | number): Promise<T | null> {
    const db = await this.openDatabase()

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, "readonly")
      const store = transaction.objectStore(storeName)
      const request = store.get(id)

      request.onerror = (event) => {
        console.error(`Error getting data from ${storeName}:`, event)
        reject(`Error getting data from ${storeName}`)
      }

      request.onsuccess = () => {
        resolve(request.result || null)
      }
    })
  }

  // Haal alle gegevens op uit een store
  async getAllData<T>(storeName: string): Promise<T[]> {
    const db = await this.openDatabase()

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, "readonly")
      const store = transaction.objectStore(storeName)
      const request = store.getAll()

      request.onerror = (event) => {
        console.error(`Error getting all data from ${storeName}:`, event)
        reject(`Error getting all data from ${storeName}`)
      }

      request.onsuccess = () => {
        resolve(request.result || [])
      }
    })
  }

  // Verwijder gegevens uit de offline opslag
  async deleteData(storeName: string, id: string | number): Promise<void> {
    const db = await this.openDatabase()

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, "readwrite")
      const store = transaction.objectStore(storeName)
      const request = store.delete(id)

      request.onerror = (event) => {
        console.error(`Error deleting data from ${storeName}:`, event)
        reject(`Error deleting data from ${storeName}`)
      }

      request.onsuccess = () => {
        resolve()
      }
    })
  }

  // Sla een actie op die later moet worden gesynchroniseerd
  async savePendingAction(action: {
    type: "create" | "update" | "delete"
    entity: string
    data: any
    status: "pending" | "processing" | "failed"
    timestamp: number
  }): Promise<number> {
    const db = await this.openDatabase()

    return new Promise((resolve, reject) => {
      const transaction = db.transaction("pendingActions", "readwrite")
      const store = transaction.objectStore("pendingActions")
      const request = store.add(action)

      request.onerror = (event) => {
        console.error("Error saving pending action:", event)
        reject("Error saving pending action")
      }

      request.onsuccess = () => {
        resolve(request.result as number)
      }
    })
  }

  // Haal alle wachtende acties op
  async getPendingActions(): Promise<any[]> {
    return this.getAllData<any>("pendingActions")
  }

  // Update de status van een wachtende actie
  async updatePendingActionStatus(
    id: number,
    status: "pending" | "processing" | "failed" | "completed",
  ): Promise<void> {
    const db = await this.openDatabase()

    return new Promise((resolve, reject) => {
      const transaction = db.transaction("pendingActions", "readwrite")
      const store = transaction.objectStore("pendingActions")
      const request = store.get(id)

      request.onerror = (event) => {
        console.error("Error getting pending action:", event)
        reject("Error getting pending action")
      }

      request.onsuccess = () => {
        const data = request.result
        if (data) {
          data.status = status
          const updateRequest = store.put(data)

          updateRequest.onerror = (event) => {
            console.error("Error updating pending action:", event)
            reject("Error updating pending action")
          }

          updateRequest.onsuccess = () => {
            resolve()
          }
        } else {
          reject("Pending action not found")
        }
      }
    })
  }

  // Verwijder een wachtende actie
  async deletePendingAction(id: number): Promise<void> {
    return this.deleteData("pendingActions", id)
  }
}

// Singleton instantie
export const offlineStorage = new OfflineStorage()
