import { supabase } from "./supabase"
import { toast } from "sonner"

type RealtimeSubscription = {
  table: string
  customerId: number
  callback: (payload: any) => void
}

// Houdt alle actieve subscriptions bij
const activeSubscriptions: Record<string, () => void> = {}

// Functie om te abonneren op real-time updates voor een specifieke tabel en klant
export function subscribeToRealtimeUpdates({ table, customerId, callback }: RealtimeSubscription) {
  // Unieke sleutel voor deze subscription
  const subscriptionKey = `${table}_${customerId}`

  // Als er al een subscription is voor deze combinatie, eerst opruimen
  if (activeSubscriptions[subscriptionKey]) {
    activeSubscriptions[subscriptionKey]()
  }

  // Nieuwe subscription aanmaken
  const subscription = supabase
    .channel(`${table}_changes`)
    .on(
      "postgres_changes",
      {
        event: "*", // luister naar alle events (INSERT, UPDATE, DELETE)
        schema: "public",
        table: table,
        filter: `customer_id=eq.${customerId}`,
      },
      (payload) => {
        console.log("Real-time update ontvangen:", payload)
        callback(payload)

        // Toon een toast notificatie bij updates
        const eventType = payload.eventType
        const resourceName = table.replace(/_/g, " ")

        if (eventType === "INSERT") {
          toast.success(`Nieuwe ${resourceName} toegevoegd`)
        } else if (eventType === "UPDATE") {
          toast.info(`${resourceName.charAt(0).toUpperCase() + resourceName.slice(1)} bijgewerkt`)
        } else if (eventType === "DELETE") {
          toast.warning(`${resourceName.charAt(0).toUpperCase() + resourceName.slice(1)} verwijderd`)
        }
      },
    )
    .subscribe()

  // Opruimfunctie opslaan
  activeSubscriptions[subscriptionKey] = () => {
    supabase.removeChannel(subscription)
    delete activeSubscriptions[subscriptionKey]
  }

  // Geef de opruimfunctie terug
  return activeSubscriptions[subscriptionKey]
}

// Functie om alle subscriptions op te ruimen
export function unsubscribeAll() {
  Object.values(activeSubscriptions).forEach((unsubscribe) => unsubscribe())
}
