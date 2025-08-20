"use client"

/**
 * v0 by Vercel.
 * @see https://v0.dev/t/p948u349G
 */
import * as React from "react"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface CalendarProps {
  date?: Date
  onChange?: (date: Date | undefined) => void
}

const Calendar = React.forwardRef<HTMLInputElement, CalendarProps>(({ className, date, onChange, ...props }, ref) => {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(date)

  const handleDateChange = (newDate: Date | undefined) => {
    setSelectedDate(newDate)
    onChange?.(newDate)
  }

  return (
    <div className={cn("relative", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn("w-[280px] justify-start text-left font-normal", !selectedDate && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? selectedDate?.toLocaleDateString() : <span>Kies een datum</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <input
            type="date"
            className="w-full border-none p-4 focus:outline-none"
            value={selectedDate?.toISOString().split("T")[0] || ""}
            onChange={(e) => {
              const newDate = e.target.value ? new Date(e.target.value) : undefined
              handleDateChange(newDate)
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
})
Calendar.displayName = "Calendar"

export { Calendar }
