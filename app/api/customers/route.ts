import { NextResponse } from "next/server"

// Always return reliable mock data
const mockCustomers = [
  {
    id: 1,
    name: "Demo Bedrijf BV",
    active: true,
    buildings: 3,
    users: 25,
    status: "active",
    contact_person: "Jan de Vries",
    email: "jan@demobedrijf.nl",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Test Organisatie",
    active: true,
    buildings: 1,
    users: 10,
    status: "active",
    contact_person: "Marie van den Berg",
    email: "marie@testorg.nl",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Provincie Noord-Brabant",
    active: true,
    buildings: 5,
    users: 50,
    status: "active",
    contact_person: "Piet Janssen",
    email: "piet@brabant.nl",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export async function GET() {
  try {
    // For now, always return mock data to ensure reliability
    console.log("Returning reliable mock customer data")
    return NextResponse.json(mockCustomers)
  } catch (error) {
    console.error("Error in customers API:", error)
    // Even if there's an error, return the mock data
    return NextResponse.json(mockCustomers)
  }
}

export async function POST(request: Request) {
  try {
    const customerData = await request.json()

    const newCustomer = {
      ...customerData,
      id: Date.now(),
      active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    return NextResponse.json(newCustomer)
  } catch (error) {
    console.error("Error creating customer:", error)
    return NextResponse.json({ error: "Failed to create customer" }, { status: 500 })
  }
}
