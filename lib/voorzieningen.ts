export interface Voorziening {
  id: string
  type: "brandblusser" | "nooduitgang" | "ehbo" | "aed" | "verzamelplaats" | "brandmelder" | "noodtelefoon"
  naam: string
  locatie: {
    x: number
    y: number
  }
  status: "actief" | "onderhoud" | "defect"
  laatsteControle?: string
  volgendeControle?: string
  opmerkingen?: string
  createdAt: string
  updatedAt: string
}

// Mock data voor demonstratie
const voorzieningen: Voorziening[] = [
  {
    id: "1",
    type: "brandblusser",
    naam: "Brandblusser Ingang",
    locatie: { x: 100, y: 150 },
    status: "actief",
    laatsteControle: "2024-01-15",
    volgendeControle: "2024-07-15",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "2",
    type: "brandblusser",
    naam: "Brandblusser Keuken",
    locatie: { x: 300, y: 200 },
    status: "actief",
    laatsteControle: "2024-01-15",
    volgendeControle: "2024-07-15",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "3",
    type: "nooduitgang",
    naam: "Nooduitgang Hoofdingang",
    locatie: { x: 50, y: 100 },
    status: "actief",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "4",
    type: "nooduitgang",
    naam: "Nooduitgang Achterkant",
    locatie: { x: 450, y: 250 },
    status: "actief",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "5",
    type: "ehbo",
    naam: "EHBO Post Receptie",
    locatie: { x: 200, y: 100 },
    status: "actief",
    laatsteControle: "2024-01-10",
    volgendeControle: "2024-04-10",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-10T00:00:00Z",
  },
  {
    id: "6",
    type: "aed",
    naam: "AED Centrale Hal",
    locatie: { x: 250, y: 150 },
    status: "actief",
    laatsteControle: "2024-01-20",
    volgendeControle: "2024-02-20",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-20T00:00:00Z",
  },
  {
    id: "7",
    type: "verzamelplaats",
    naam: "Verzamelplaats Parkeerplaats",
    locatie: { x: 400, y: 50 },
    status: "actief",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "8",
    type: "brandmelder",
    naam: "Brandmelder Gang",
    locatie: { x: 150, y: 200 },
    status: "actief",
    laatsteControle: "2024-01-05",
    volgendeControle: "2024-07-05",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-05T00:00:00Z",
  },
  {
    id: "9",
    type: "noodtelefoon",
    naam: "Noodtelefoon Receptie",
    locatie: { x: 180, y: 120 },
    status: "actief",
    laatsteControle: "2024-01-12",
    volgendeControle: "2024-04-12",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-12T00:00:00Z",
  },
]

export async function getVoorzieningen(): Promise<Voorziening[]> {
  // In een echte applicatie zou dit een database query zijn
  return Promise.resolve([...voorzieningen])
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

  voorzieningen.push(newVoorziening)
  return Promise.resolve(newVoorziening)
}

export async function updateVoorziening(
  id: string,
  updates: Partial<Omit<Voorziening, "id" | "createdAt">>,
): Promise<Voorziening | null> {
  const index = voorzieningen.findIndex((v) => v.id === id)

  if (index === -1) {
    return Promise.resolve(null)
  }

  voorzieningen[index] = {
    ...voorzieningen[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }

  return Promise.resolve(voorzieningen[index])
}

export async function deleteVoorziening(id: string): Promise<boolean> {
  const index = voorzieningen.findIndex((v) => v.id === id)

  if (index === -1) {
    return Promise.resolve(false)
  }

  voorzieningen.splice(index, 1)
  return Promise.resolve(true)
}

export function getVoorzieningIcon(type: Voorziening["type"]): string {
  const iconMap = {
    brandblusser: "/images/fire-extinguisher-symbol.png",
    nooduitgang: "/images/emergency-exit-green.png",
    ehbo: "/images/medical-cross.png",
    aed: "/images/aed-heart.png",
    verzamelplaats: "/images/assembly-point-people.png",
    brandmelder: "/images/fire-alarm-symbol.png",
    noodtelefoon: "/images/emergency-phone.png",
  }

  return iconMap[type] || "/images/fire-extinguisher-symbol.png"
}

export function getVoorzieningLabel(type: Voorziening["type"]): string {
  const labelMap = {
    brandblusser: "Brandblusser",
    nooduitgang: "Nooduitgang",
    ehbo: "EHBO Post",
    aed: "AED",
    verzamelplaats: "Verzamelplaats",
    brandmelder: "Brandmelder",
    noodtelefoon: "Noodtelefoon",
  }

  return labelMap[type] || "Onbekend"
}

export function getStatusColor(status: Voorziening["status"]): string {
  const colorMap = {
    actief: "text-green-600",
    onderhoud: "text-yellow-600",
    defect: "text-red-600",
  }

  return colorMap[status] || "text-gray-600"
}

export function getStatusLabel(status: Voorziening["status"]): string {
  const labelMap = {
    actief: "Actief",
    onderhoud: "Onderhoud",
    defect: "Defect",
  }

  return labelMap[status] || "Onbekend"
}
