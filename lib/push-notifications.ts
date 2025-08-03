// Controleer of push notificaties worden ondersteund
export function isPushNotificationSupported() {
  return "serviceWorker" in navigator && "PushManager" in window
}

// Vraag toestemming voor push notificaties
export async function requestNotificationPermission() {
  if (!isPushNotificationSupported()) {
    return { granted: false, reason: "not-supported" }
  }

  try {
    const permission = await Notification.requestPermission()
    return { granted: permission === "granted", reason: permission }
  } catch (error) {
    console.error("Error requesting notification permission:", error)
    return { granted: false, reason: "error" }
  }
}

// Registreer de service worker voor push notificaties
export async function registerServiceWorker() {
  if (!isPushNotificationSupported()) {
    return null
  }

  try {
    const registration = await navigator.serviceWorker.register("/service-worker.js")
    return registration
  } catch (error) {
    console.error("Error registering service worker:", error)
    return null
  }
}

// Abonneer op push notificaties
export async function subscribeToPushNotifications(publicVapidKey: string) {
  if (!isPushNotificationSupported()) {
    return null
  }

  try {
    const registration = await navigator.serviceWorker.ready

    // Converteer de VAPID key naar een Uint8Array
    const applicationServerKey = urlBase64ToUint8Array(publicVapidKey)

    // Abonneer op push notificaties
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey,
    })

    return subscription
  } catch (error) {
    console.error("Error subscribing to push notifications:", error)
    return null
  }
}

// Stuur een push notificatie (dit zou normaal gesproken op de server gebeuren)
export async function sendPushNotification(subscription: PushSubscription, data: any) {
  try {
    await fetch("/api/push-notification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subscription,
        data,
      }),
    })
    return true
  } catch (error) {
    console.error("Error sending push notification:", error)
    return false
  }
}

// Helper functie om de VAPID key te converteren
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }

  return outputArray
}

// Toon een notificatie
export function showNotification(title: string, options: NotificationOptions = {}) {
  if (!("Notification" in window)) {
    console.log("Notifications not supported")
    return
  }

  if (Notification.permission === "granted") {
    new Notification(title, {
      icon: "/images/bhv360-logo.png",
      badge: "/images/bhv360-logo.png",
      ...options,
    })
  }
}
