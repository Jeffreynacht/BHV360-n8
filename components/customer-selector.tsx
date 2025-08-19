"use client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCustomer } from "@/components/customer-context"
import { Building } from "lucide-react"

export default function CustomerSelector() {
  const { customers, selectedCustomer, setSelectedCustomer } = useCustomer()

  return (
    <div className="flex items-center space-x-2">
      <Building className="h-4 w-4 text-gray-500" />
      <Select
        value={selectedCustomer?.id.toString() || ""}
        onValueChange={(value) => {
          const customer = customers.find((c) => c.id.toString() === value)
          if (customer) {
            setSelectedCustomer(customer)
          }
        }}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Selecteer klant" />
        </SelectTrigger>
        <SelectContent>
          {customers.map((customer) => (
            <SelectItem key={customer.id} value={customer.id.toString()}>
              {customer.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export { CustomerSelector }
