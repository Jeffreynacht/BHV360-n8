export interface Voorziening {
  id: string
  type: "brandblusser" | "nooduitgang" | "ehbo" | "aed" | "verzamelplaats" | "brandmelder" | "noodtelefoon"
  naam: string
  locatie: {
    x: number
    y: number
  }
  status: "actief" | "onderhoud" | "defect"
  beschrijving?: string
  serienummer?: string
  fabrikant?: string
  installatiedatum?: string
  laatsteInspectie?: string
  volgendeInspectie?: string
  opmerkingen?: string
  createdAt: string
  updatedAt: string
}

const mockVoorzieningen: Voorziening[] = [
  {
    id: "1",
    type: "brandblusser",
    naam: "Brandblusser A1",
    locatie: { x: 100, y: 150 },
    status: "actief",
    beschrijving: "Poederblusser 6kg",
    serienummer: "BB001",
    fabrikant: "Gloria",
    installatiedatum: "2023-01-15",
    laatsteInspectie: "2024-01-15",
    volgendeInspectie: "2025-01-15",
    createdAt: "2023-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    type: "nooduitgang",
    naam: "Nooduitgang Noord",
    locatie: { x: 200, y: 50 },
    status: "actief",
    beschrijving: "Hoofdnooduitgang naar parkeerplaats",
    createdAt: "2023-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "3",
    type: "aed",
    naam: "AED Receptie",
    locatie: { x: 150, y: 200 },
    status: "actief",
    beschrijving: "Automatische Externe Defibrillator",
    serienummer: "AED001",
    fabrikant: "Philips",
    installatiedatum: "2023-02-01",
    laatsteInspectie: "2024-02-01",
    volgendeInspectie: "2025-02-01",
    createdAt: "2023-02-01T10:00:00Z",
    updatedAt: "2024-02-01T10:00:00Z",
  },
]

export async function getVoorzieningen(): Promise<Voorziening[]> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockVoorzieningen
}

export async function createVoorziening(
  voorziening: Omit<Voorziening, "id" | "createdAt" | "updatedAt">,
): Promise<Voorziening> {
  const newVoorziening: Voorziening = {
    ...voorziening,
    id: Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  mockVoorzieningen.push(newVoorziening)
  return newVoorziening
}

export async function updateVoorziening(id: string, updates: Partial<Voorziening>): Promise<Voorziening | null> {
  const index = mockVoorzieningen.findIndex((v) => v.id === id)
  if (index === -1) return null

  mockVoorzieningen[index] = {
    ...mockVoorzieningen[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }

  return mockVoorzieningen[index]
}

export async function deleteVoorziening(id: string): Promise<boolean> {
  const index = mockVoorzieningen.findIndex((v) => v.id === id)
  if (index === -1) return false

  mockVoorzieningen.splice(index, 1)
  return true
}

export function getVoorzieningLabel(type: Voorziening["type"]): string {
  const labels = {
    brandblusser: "Brandblusser",
    nooduitgang: "Nooduitgang",
    ehbo: "EHBO",
    aed: "AED",
    verzamelplaats: "Verzamelplaats",
    brandmelder: "Brandmelder",
    noodtelefoon: "Noodtelefoon",
  }
  return labels[type] || type
}

export function getStatusColor(status: Voorziening["status"]): string {
  const colors = {
    actief: "text-green-600 bg-green-100",
    onderhoud: "text-yellow-600 bg-yellow-100",
    defect: "text-red-600 bg-red-100",
  }
  return colors[status] || "text-gray-600 bg-gray-100"
}

export function getStatusLabel(status: Voorziening["status"]): string {
  const labels = {
    actief: "Actief",
    onderhoud: "Onderhoud",
    defect: "Defect",
  }
  return labels[status] || status
}
