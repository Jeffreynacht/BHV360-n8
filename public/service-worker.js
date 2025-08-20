const CACHE_NAME = "bhv360-notifications-v1"
const urlsToCache = ["/", "/offline", "/images/bhv360-logo.png", "/manifest.json"]

// Install event
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)))
})

// Fetch event
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response
      }
      return fetch(event.request)
    }),
  )
})

// Push event
self.addEventListener("push", (event) => {
  console.log("Push notification received:", event)

  let notificationData = {}

  if (event.data) {
    try {
      notificationData = event.data.json()
    } catch (e) {
      notificationData = {
        title: "BHV360 Notificatie",
        body: event.data.text() || "Nieuwe notificatie ontvangen",
        icon: "/images/bhv360-logo.png",
        badge: "/images/bhv360-logo.png",
      }
    }
  }

  const options = {
    body: notificationData.body || "Nieuwe BHV360 notificatie",
    icon: notificationData.icon || "/images/bhv360-logo.png",
    badge: notificationData.badge || "/images/bhv360-logo.png",
    data: notificationData.data || {},
    actions: notificationData.actions || [],
    requireInteraction: notificationData.requireInteraction || false,
    silent: notificationData.silent || false,
    tag: notificationData.tag || "bhv360-notification",
    renotify: notificationData.renotify || false,
    vibrate: notificationData.vibrate || [100, 50, 100],
    timestamp: Date.now(),
    // Critical notifications
    ...(notificationData.data?.priority === "critical" && {
      requireInteraction: true,
      silent: false,
      renotify: true,
      vibrate: [200, 100, 200, 100, 200],
    }),
  }

  event.waitUntil(self.registration.showNotification(notificationData.title || "BHV360 Notificatie", options))
})

// Notification click event
self.addEventListener("notificationclick", (event) => {
  console.log("Notification clicked:", event)

  event.notification.close()

  const data = event.notification.data || {}
  const action = event.action

  let url = "/"

  if (data.url) {
    url = data.url
  } else if (data.category) {
    switch (data.category) {
      case "emergency":
        url = "/incidents/emergency"
        break
      case "incident":
        url = `/incidents/${data.incidentId || ""}`
        break
      case "training":
        url = `/training/${data.trainingId || ""}`
        break
      default:
        url = "/notifications"
    }
  }

  // Handle action buttons
  if (action) {
    switch (action) {
      case "acknowledge":
        url += "?action=acknowledge"
        // Send acknowledgment to server
        fetch("/api/notifications/acknowledge", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            notificationId: data.id,
            action: "acknowledge",
            timestamp: new Date().toISOString(),
          }),
        }).catch(console.error)
        break
      case "respond":
        url += "?action=respond"
        break
      case "view":
        // Default URL is fine
        break
    }
  }

  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      // Check if app is already open
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          client.focus()
          client.postMessage({
            type: "NOTIFICATION_CLICKED",
            data: data,
            action: action,
            url: url,
          })
          return
        }
      }

      // Open new window if app is not open
      if (clients.openWindow) {
        return clients.openWindow(url)
      }
    }),
  )
})

// Background sync for offline notifications
self.addEventListener("sync", (event) => {
  if (event.tag === "notification-sync") {
    event.waitUntil(syncNotifications())
  }
})

async function syncNotifications() {
  try {
    // Get pending notifications from IndexedDB
    const pendingNotifications = await getPendingNotifications()

    for (const notification of pendingNotifications) {
      try {
        await fetch("/api/notifications/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(notification),
        })

        // Remove from pending after successful send
        await removePendingNotification(notification.id)
      } catch (error) {
        console.error("Failed to sync notification:", error)
      }
    }
  } catch (error) {
    console.error("Background sync failed:", error)
  }
}

// IndexedDB helpers for offline storage
async function getPendingNotifications() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("BHV360Notifications", 1)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      const db = request.result
      const transaction = db.transaction(["pending"], "readonly")
      const store = transaction.objectStore("pending")
      const getAllRequest = store.getAll()

      getAllRequest.onsuccess = () => resolve(getAllRequest.result)
      getAllRequest.onerror = () => reject(getAllRequest.error)
    }

    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains("pending")) {
        db.createObjectStore("pending", { keyPath: "id" })
      }
    }
  })
}

async function removePendingNotification(id) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("BHV360Notifications", 1)

    request.onsuccess = () => {
      const db = request.result
      const transaction = db.transaction(["pending"], "readwrite")
      const store = transaction.objectStore("pending")
      const deleteRequest = store.delete(id)

      deleteRequest.onsuccess = () => resolve()
      deleteRequest.onerror = () => reject(deleteRequest.error)
    }
  })
}
