import { NextResponse } from "next/server"

// In-memory storage for demo purposes - in production this would be a database
const customers: any[] = []
let nextId = 1

export async function GET() {
  try {
    // Return empty array initially - customers will be added through the UI
    return NextResponse.json(customers)
  } catch (error) {
    console.error("Error in customers API:", error)
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const customerData = await request.json()

    // Validate required fields
    if (!customerData.name || !customerData.name.trim()) {
      return NextResponse.json({ error: "Customer name is required" }, { status: 400 })
    }

    const newCustomer = {
      id: nextId++,
      name: customerData.name.trim(),
      contactPerson: customerData.contactPerson?.trim() || "",
      email: customerData.email?.trim() || "",
      phone: customerData.phone?.trim() || "",
      address: customerData.address?.trim() || "",
      active: true,
      buildings: customerData.buildings || 1,
      users: customerData.users || 1,
      status: "active",
      createdAt: new Date().toISOString().split("T")[0], // Format: YYYY-MM-DD
      updatedAt: new Date().toISOString().split("T")[0],
    }

    customers.push(newCustomer)

    console.log("Created new customer:", newCustomer)
    return NextResponse.json(newCustomer)
  } catch (error) {
    console.error("Error creating customer:", error)
    return NextResponse.json({ error: "Failed to create customer" }, { status: 500 })
  }
}
