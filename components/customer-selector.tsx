"use client"

import { useState } from "react"
import { Check, ChevronsUpDown, Building2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useCustomer } from "./customer-context"

export function CustomerSelector() {
  const { customers, selectedCustomer, setSelectedCustomer } = useCustomer()
  const [open, setOpen] = useState(false)

  // Mock data voor demo - GEEN provincie referenties
  const mockCustomersWithStats = customers.map((customer) => ({
    ...customer,
    type: customer.name.includes("BHV360")
      ? "Demo"
      : customer.name.includes("TechCorp")
        ? "Technologie"
        : "Zorginstelling",
    buildings: customer.name.includes("BHV360") ? 3 : customer.name.includes("TechCorp") ? 2 : 5,
    users: customer.name.includes("BHV360") ? 25 : customer.name.includes("TechCorp") ? 15 : 45,
  }))

  if (mockCustomersWithStats.length === 0) {
    return (
      <div className="flex items-center space-x-2 px-3 py-2 text-sm text-red-500">
        <Building2 className="h-4 w-4" />
        <span>Geen klanten beschikbaar</span>
      </div>
    )
  }

  return (
    <div className="w-full max-w-sm">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
            <div className="flex items-center space-x-2">
              <Building2 className="h-4 w-4" />
              <span className="truncate">{selectedCustomer ? selectedCustomer.name : "Selecteer organisatie..."}</span>
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Zoek organisatie..." />
            <CommandList>
              <CommandEmpty>Geen organisaties gevonden.</CommandEmpty>
              <CommandGroup>
                {mockCustomersWithStats.map((customer) => (
                  <CommandItem
                    key={customer.id}
                    value={customer.name}
                    onSelect={() => {
                      setSelectedCustomer(customer.id === selectedCustomer?.id ? null : customer)
                      setOpen(false)
                    }}
                  >
                    <div className="flex flex-col space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{customer.name}</span>
                        <Check
                          className={cn("h-4 w-4", selectedCustomer?.id === customer.id ? "opacity-100" : "opacity-0")}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {customer.type} • {customer.buildings} gebouw(en) • {customer.users} gebruikers
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
