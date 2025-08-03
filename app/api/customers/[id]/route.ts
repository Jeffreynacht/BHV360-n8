import { NextResponse } from "next/server"

// In-memory storage - same as in route.ts
const customers: any[] = []

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const customerId = Number.parseInt(params.id)
    const customerData = await request.json()

    const customerIndex = customers.findIndex((c) => c.id === customerId)

    if (customerIndex === -1) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }

    // Update customer
    const updatedCustomer = {
      ...customers[customerIndex],
      ...customerData,
      id: customerId, // Ensure ID doesn't change
      updatedAt: new Date().toISOString().split("T")[0],
    }

    customers[customerIndex] = updatedCustomer

    console.log("Updated customer:", updatedCustomer)
    return NextResponse.json(updatedCustomer)
  } catch (error) {
    console.error("Error updating customer:", error)
    return NextResponse.json({ error: "Failed to update customer" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const customerId = Number.parseInt(params.id)

    const customerIndex = customers.findIndex((c) => c.id === customerId)

    if (customerIndex === -1) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }

    // Remove customer
    const deletedCustomer = customers.splice(customerIndex, 1)[0]

    console.log("Deleted customer:", deletedCustomer)
    return NextResponse.json({ success: true, deletedCustomer })
  } catch (error) {
    console.error("Error deleting customer:", error)
    return NextResponse.json({ error: "Failed to delete customer" }, { status: 500 })
  }
}
