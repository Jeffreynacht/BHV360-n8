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

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const customer = customers.find((c) => c.id === params.id)

    if (!customer) {
      return NextResponse.json(
        {
          success: false,
          error: "Customer not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json(customer)
  } catch (error) {
    console.error("Error in GET /api/customers/[id]:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch customer",
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const customerIndex = customers.findIndex((c) => c.id === params.id)

    if (customerIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: "Customer not found",
        },
        { status: 404 },
      )
    }

    // Check for duplicate email (excluding current customer)
    if (body.email) {
      const existingCustomer = customers.find(
        (customer) => customer.email.toLowerCase() === body.email.toLowerCase() && customer.id !== params.id,
      )

      if (existingCustomer) {
        return NextResponse.json(
          {
            success: false,
            error: "A customer with this email already exists",
          },
          { status: 409 },
        )
      }
    }

    // Update customer
    const updatedCustomer = {
      ...customers[customerIndex],
      ...body,
      id: params.id, // Ensure ID doesn't change
      createdAt: customers[customerIndex].createdAt, // Preserve creation date
      updatedAt: new Date().toISOString(),
    }

    customers[customerIndex] = updatedCustomer

    return NextResponse.json(updatedCustomer)
  } catch (error) {
    console.error("Error in PUT /api/customers/[id]:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update customer",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const customerIndex = customers.findIndex((c) => c.id === params.id)

    if (customerIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: "Customer not found",
        },
        { status: 404 },
      )
    }

    customers.splice(customerIndex, 1)

    return NextResponse.json({
      success: true,
      message: "Customer deleted successfully",
    })
  } catch (error) {
    console.error("Error in DELETE /api/customers/[id]:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete customer",
      },
      { status: 500 },
    )
  }
}
