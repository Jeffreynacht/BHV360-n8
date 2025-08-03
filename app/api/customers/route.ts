import { type NextRequest, NextResponse } from "next/server"

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  contactPerson: string
  createdAt: string
  isActive: boolean
  buildings: number
  users: number
  notes?: string
  // Whitelabel settings
  isWhitelabel: boolean
  logo?: string
  primaryColor?: string
  secondaryColor?: string
  customDomain?: string
  brandName?: string
  // Subscription settings
  subscriptionType: "free" | "basic" | "premium" | "enterprise"
  maxUsers: number
  maxBuildings: number
  features: string[]
}

// Empty storage - no demo data
const customers: Customer[] = []
let nextId = 1

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      customers: customers,
      count: customers.length,
    })
  } catch (error) {
    console.error("Error in GET /api/customers:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch customers",
        customers: [],
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.email || !body.contactPerson) {
      return NextResponse.json(
        {
          success: false,
          error: "Name, email, and contact person are required",
        },
        { status: 400 },
      )
    }

    // Check for duplicate email
    const existingCustomer = customers.find((customer) => customer.email.toLowerCase() === body.email.toLowerCase())

    if (existingCustomer) {
      return NextResponse.json(
        {
          success: false,
          error: "A customer with this email already exists",
        },
        { status: 409 },
      )
    }

    // Create new customer
    const newCustomer: Customer = {
      id: nextId.toString(),
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      phone: body.phone?.trim() || "",
      address: body.address?.trim() || "",
      contactPerson: body.contactPerson.trim(),
      notes: body.notes?.trim() || "",
      createdAt: new Date().toISOString(),
      isActive: true,
      buildings: body.buildings || 1,
      users: body.users || 1,
      // Whitelabel settings
      isWhitelabel: body.isWhitelabel || false,
      logo: body.logo || "",
      primaryColor: body.primaryColor || "#3b82f6",
      secondaryColor: body.secondaryColor || "#64748b",
      customDomain: body.customDomain || "",
      brandName: body.brandName || body.name,
      // Subscription settings
      subscriptionType: body.subscriptionType || "free",
      maxUsers: body.maxUsers || 5,
      maxBuildings: body.maxBuildings || 1,
      features: body.features || ["basic-dashboard", "incident-reporting"],
    }

    customers.push(newCustomer)
    nextId++

    return NextResponse.json(newCustomer, { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/customers:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create customer",
      },
      { status: 500 },
    )
  }
}
