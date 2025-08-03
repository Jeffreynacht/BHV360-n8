import { type NextRequest, NextResponse } from "next/server"

// This would be replaced with actual database operations
const customers: any[] = []

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const customer = customers.find((c) => c.id === params.id)

    if (!customer) {
      return NextResponse.json({ success: false, error: "Customer not found" }, { status: 404 })
    }

    return NextResponse.json(customer)
  } catch (error) {
    console.error("Error fetching customer:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch customer" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const customerIndex = customers.findIndex((c) => c.id === params.id)

    if (customerIndex === -1) {
      return NextResponse.json({ success: false, error: "Customer not found" }, { status: 404 })
    }

    customers[customerIndex] = {
      ...customers[customerIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(customers[customerIndex])
  } catch (error) {
    console.error("Error updating customer:", error)
    return NextResponse.json({ success: false, error: "Failed to update customer" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const customerIndex = customers.findIndex((c) => c.id === params.id)

    if (customerIndex === -1) {
      return NextResponse.json({ success: false, error: "Customer not found" }, { status: 404 })
    }

    customers.splice(customerIndex, 1)

    return NextResponse.json({ success: true, message: "Customer deleted" })
  } catch (error) {
    console.error("Error deleting customer:", error)
    return NextResponse.json({ success: false, error: "Failed to delete customer" }, { status: 500 })
  }
}
