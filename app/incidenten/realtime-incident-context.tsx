"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useCustomer } from "@/components/customer-context"
import { subscribeToRealtimeUpdates } from "@/lib/realtime"

// Type definities voor incidenten
export type IncidentPriority = "low" | "medium" | "high" | "critical"
export type IncidentStatus = "active" | "in-progress" | "resolved" | "archived"

export type IncidentAction = {
  timestamp: string
  user: string
  action: string
}

export type IncidentResponder = {
  id: string
  name: string
  role: string
  status: string
  arrivedAt?: string
}

export type IncidentNote = {
  id: string
  user: string
  timestamp: string
  text: string
}

export type Incident = {
  id: string
  title: string
  type: string
  priority: IncidentPriority
  status: IncidentStatus
  location: string
  building: string
  floor: string
  zone: string
  reportedBy: string
  reportedAt: string
  resolvedAt?: string
  description: string
  actions: IncidentAction[]
  responders: IncidentResponder[]
  notes: IncidentNote[]
  customerId: string
}

// Context type definitie
type RealtimeIncidentContextType = {
  incidents: Incident[]
  addIncident: (incident: Omit<Incident, "id">) => void
  updateIncident: (id: string, updates: Partial<Incident>) => void
  addNoteToIncident: (incidentId: string, note: Omit<IncidentNote, "id" | "timestamp">) => void
  updateIncidentStatus: (incidentId: string, status: IncidentStatus) => void
  addResponderToIncident: (incidentId: string, responder: Omit<IncidentResponder, "id">) => void
  updateResponderStatus: (incidentId: string, responderId: string, status: string) => void
}

// Context aanmaken
const RealtimeIncidentContext = createContext<RealtimeIncidentContextType | undefined>(undefined)

// Dummy data voor incidenten
const dummyIncidents: Incident[] = [
  {
    id: "inc-1",
    title: "Brand in serverruimte",
    type: "brand",
    priority: "critical",
    status: "active",
    location: "Serverruimte C2.05",
    building: "Hoofdgebouw",
    floor: "2e Verdieping",
    zone: "IT Afdeling",
    reportedBy: "Jan Jansen",
    reportedAt: "2024-06-10 14:30",
    description: "Rookontwikkeling gedetecteerd in de serverruimte. Automatisch blussysteem geactiveerd.",
    actions: [
      {
        timestamp: "2024-06-10 14:30",
        user: "Systeem",
        action: "Brandmelding geactiveerd",
      },
      {
        timestamp: "2024-06-10 14:31",
        user: "Systeem",
        action: "Automatisch blussysteem geactiveerd",
      },
      {
        timestamp: "2024-06-10 14:32",
        user: "Jan Jansen",
        action: "Incident gemeld",
      },
      {
        timestamp: "2024-06-10 14:35",
        user: "Petra de Vries",
        action: "BHV team gealarmeerd",
      },
    ],
    responders: [
      {
        id: "resp-1",
        name: "Petra de Vries",
        role: "Ploegleider",
        status: "responding",
        arrivedAt: "2024-06-10 14:38",
      },
      {
        id: "resp-2",
        name: "Mohammed El Amrani",
        role: "BHV",
        status: "responding",
        arrivedAt: "2024-06-10 14:40",
      },
    ],
    notes: [
      {
        id: "note-1",
        user: "Petra de Vries",
        timestamp: "2024-06-10 14:45",
        text: "Brandweer is onderweg. Verdieping wordt ontruimd.",
      },
    ],
    customerId: "1",
  },
  // Andere dummy incidenten...
]

// Provider component
export function RealtimeIncidentProvider({ children }: { children: React.ReactNode }) {
  const { selectedCustomer } = useCustomer()
  const [incidents, setIncidents] = useState<Incident[]>(dummyIncidents)

  // Abonneer op real-time updates wanneer de klant verandert
  useEffect(() => {
    if (!selectedCustomer) return

    // In een echte implementatie zou je hier de incidenten ophalen van de server
    // en dan pas abonneren op updates

    const unsubscribe = subscribeToRealtimeUpdates({
      table: "incidents",
      customerId: selectedCustomer.id,
      callback: (payload) => {
        const { eventType, new: newRecord, old: oldRecord } = payload

        if (eventType === "INSERT") {
          setIncidents((prev) => [...prev, newRecord as Incident])
        } else if (eventType === "UPDATE") {
          setIncidents((prev) =>
            prev.map((incident) => (incident.id === newRecord.id ? { ...incident, ...newRecord } : incident)),
          )
        } else if (eventType === "DELETE") {
          setIncidents((prev) => prev.filter((incident) => incident.id !== oldRecord.id))
        }
      },
    })

    // Opruimen bij unmount of wanneer de klant verandert
    return () => {
      unsubscribe()
    }
  }, [selectedCustomer])

  // Functie om een nieuw incident toe te voegen
  const addIncident = (incident: Omit<Incident, "id">) => {
    const newIncident: Incident = {
      ...incident,
      id: `inc-${Date.now()}`, // In een echte app zou dit door de server worden gegenereerd
    }

    // In een echte app zou je hier een API call doen om het incident op te slaan
    // De real-time subscription zou dan de update afhandelen

    // Voor nu simuleren we het direct
    setIncidents((prev) => [...prev, newIncident])
  }

  // Functie om een incident bij te werken
  const updateIncident = (id: string, updates: Partial<Incident>) => {
    // In een echte app zou je hier een API call doen
    setIncidents((prev) => prev.map((incident) => (incident.id === id ? { ...incident, ...updates } : incident)))
  }

  // Functie om een notitie toe te voegen aan een incident
  const addNoteToIncident = (incidentId: string, note: Omit<IncidentNote, "id" | "timestamp">) => {
    const newNote: IncidentNote = {
      ...note,
      id: `note-${Date.now()}`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
    }

    // In een echte app zou je hier een API call doen
    setIncidents((prev) =>
      prev.map((incident) => {
        if (incident.id === incidentId) {
          return {
            ...incident,
            notes: [...incident.notes, newNote],
          }
        }
        return incident
      }),
    )
  }

  // Functie om de status van een incident bij te werken
  const updateIncidentStatus = (incidentId: string, status: IncidentStatus) => {
    const updates: Partial<Incident> = {
      status,
      // Als het incident is opgelost, voeg de oplossingsdatum toe
      ...(status === "resolved" && { resolvedAt: new Date().toISOString().replace("T", " ").substring(0, 16) }),
    }

    // In een echte app zou je hier een API call doen
    updateIncident(incidentId, updates)

    // Voeg ook een actie toe aan het incident
    const action: IncidentAction = {
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
      user: "Huidige gebruiker", // In een echte app zou je de ingelogde gebruiker gebruiken
      action: `Status gewijzigd naar ${status}`,
    }

    setIncidents((prev) =>
      prev.map((incident) => {
        if (incident.id === incidentId) {
          return {
            ...incident,
            ...updates,
            actions: [...incident.actions, action],
          }
        }
        return incident
      }),
    )
  }

  // Functie om een responder toe te voegen aan een incident
  const addResponderToIncident = (incidentId: string, responder: Omit<IncidentResponder, "id">) => {
    const newResponder: IncidentResponder = {
      ...responder,
      id: `resp-${Date.now()}`,
    }

    // In een echte app zou je hier een API call doen
    setIncidents((prev) =>
      prev.map((incident) => {
        if (incident.id === incidentId) {
          return {
            ...incident,
            responders: [...incident.responders, newResponder],
          }
        }
        return incident
      }),
    )

    // Voeg ook een actie toe aan het incident
    const action: IncidentAction = {
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
      user: "Huidige gebruiker", // In een echte app zou je de ingelogde gebruiker gebruiken
      action: `${responder.name} (${responder.role}) toegevoegd als responder`,
    }

    setIncidents((prev) =>
      prev.map((incident) => {
        if (incident.id === incidentId) {
          return {
            ...incident,
            actions: [...incident.actions, action],
          }
        }
        return incident
      }),
    )
  }

  // Functie om de status van een responder bij te werken
  const updateResponderStatus = (incidentId: string, responderId: string, status: string) => {
    // In een echte app zou je hier een API call doen
    setIncidents((prev) =>
      prev.map((incident) => {
        if (incident.id === incidentId) {
          return {
            ...incident,
            responders: incident.responders.map((responder) => {
              if (responder.id === responderId) {
                return {
                  ...responder,
                  status,
                  ...(status === "on-site" && {
                    arrivedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
                  }),
                }
              }
              return responder
            }),
          }
        }
        return incident
      }),
    )

    // Vind de naam van de responder
    const responderName =
      incidents.find((i) => i.id === incidentId)?.responders.find((r) => r.id === responderId)?.name || "Onbekend"

    // Voeg ook een actie toe aan het incident
    const action: IncidentAction = {
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
      user: "Systeem",
      action: `Status van ${responderName} gewijzigd naar ${status}`,
    }

    setIncidents((prev) =>
      prev.map((incident) => {
        if (incident.id === incidentId) {
          return {
            ...incident,
            actions: [...incident.actions, action],
          }
        }
        return incident
      }),
    )
  }

  const value: RealtimeIncidentContextType = {
    incidents,
    addIncident,
    updateIncident,
    addNoteToIncident,
    updateIncidentStatus,
    addResponderToIncident,
    updateResponderStatus,
  }

  return <RealtimeIncidentContext.Provider value={value}>{children}</RealtimeIncidentContext.Provider>
}

// Hook om de context te gebruiken
export function useRealtimeIncidents() {
  const context = useContext(RealtimeIncidentContext)
  if (context === undefined) {
    throw new Error("useRealtimeIncidents must be used within a RealtimeIncidentProvider")
  }
  return context
}
