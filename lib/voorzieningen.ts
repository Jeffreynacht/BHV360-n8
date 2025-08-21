export interface Voorziening {
  id: string
  type: "brandblusser" | "nooduitgang" | "ehbo" | "aed" | "verzamelplaats" | "brandmelder" | "noodtelefoon"
  naam: string
  locatie: { x: number; y: number }
  status: "actief" | "onderhoud" | "defect"
  laatsteControle?: string
  volgendeControle?: string
  opmerkingen?: string
  createdAt: string
  updatedAt: string
}

// Mock data for voorzieningen
const mockVoorzieningen: Voorziening[] = [
  {
    id: "1",
    type: "brandblusser",
    naam: "Brandblusser Hoofdingang",
    locatie: { x: 100, y: 150 },
    status: "actief",
    laatsteControle: "2024-01-15",
    volgendeControle: "2024-07-15",
    opmerkingen: "Goed onderhouden",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    type: "nooduitgang",
    naam: "Nooduitgang Oost",
    locatie: { x: 300, y: 200 },
    status: "actief",
    laatsteControle: "2024-01-10",
    volgendeControle: "2024-04-10",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-10T14:00:00Z",
  },
]

export async function getVoorzieningen(): Promise<Voorziening[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockVoorzieningen
}

export async function createVoorziening(
  data: Omit<Voorziening, "id" | "createdAt" | "updatedAt">,
): Promise<Voorziening> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const newVoorziening: Voorziening = {
    ...data,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  mockVoorzieningen.push(newVoorziening)
  return newVoorziening
}

export async function updateVoorziening(id: string, data: Partial<Voorziening>): Promise<Voorziening> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const index = mockVoorzieningen.findIndex((v) => v.id === id)
  if (index === -1) {
    throw new Error("Voorziening not found")
  }

  mockVoorzieningen[index] = {
    ...mockVoorzieningen[index],
    ...data,
    updatedAt: new Date().toISOString(),
  }

  return mockVoorzieningen[index]
}

export async function deleteVoorziening(id: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const index = mockVoorzieningen.findIndex((v) => v.id === id)
  if (index === -1) {
    throw new Error("Voorziening not found")
  }

  mockVoorzieningen.splice(index, 1)
}

export function getVoorzieningLabel(type: Voorziening["type"]): string {
  const labels = {
    brandblusser: "Brandblusser",
    nooduitgang: "Nooduitgang",
    ehbo: "EHBO Post",
    aed: "AED",
    verzamelplaats: "Verzamelplaats",
    brandmelder: "Brandmelder",
    noodtelefoon: "Noodtelefoon",
  }
  return labels[type]
}

export function getStatusLabel(status: Voorziening["status"]): string {
  const labels = {
    actief: "Actief",
    onderhoud: "Onderhoud",
    defect: "Defect",
  }
  return labels[status]
}

export function getStatusColor(status: Voorziening["status"]): string {
  const colors = {
    actief: "bg-green-100 text-green-800",
    onderhoud: "bg-yellow-100 text-yellow-800",
    defect: "bg-red-100 text-red-800",
  }
  return colors[status]
}
