import { type NextRequest, NextResponse } from "next/server"

// In-memory storage for testing (replace with database in production)
const customers: any[] = []
let nextId = 1

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      customers: customers,
      count: customers.length,
    })
  } catch (error) {
    console.error("Error fetching customers:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch customers" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const newCustomer = {
      id: nextId.toString(),
      name: body.name,
      contactPerson: body.contactPerson || "",
      email: body.email || "",
      phone: body.phone || "",
      address: body.address || "",
      createdAt: new Date().toISOString(),
      isActive: true,
      modules: body.modules || ["basic"],
      userCount: body.userCount || 1,
      lastActivity: new Date().toISOString(),
    }

    customers.push(newCustomer)
    nextId++

    return NextResponse.json(newCustomer, { status: 201 })
  } catch (error) {
    console.error("Error creating customer:", error)
    return NextResponse.json({ success: false, error: "Failed to create customer" }, { status: 500 })
  }
}
