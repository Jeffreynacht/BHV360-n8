"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Calendar, CheckCircle, Clock, AlertTriangle } from "lucide-react"

interface InspectionEvent {
  id: string
  title: string
  date: string
  status: "gepland" | "uitgevoerd" | "vervallen"
  type: string
  inspecteur?: string
}

const demoEvents: InspectionEvent[] = [
  {
    id: "1",
    title: "Brandblusser Gang A",
    date: "2024-01-15",
    status: "uitgevoerd",
    type: "Brandblusser",
    inspecteur: "Jan Pietersen",
  },
  {
    id: "2",
    title: "AED Receptie",
    date: "2024-01-20",
    status: "uitgevoerd",
    type: "AED",
    inspecteur: "Maria van der Berg",
  },
  {
    id: "3",
    title: "EHBO-kit Werkplaats",
    date: "2024-02-15",
    status: "gepland",
    type: "EHBO-kit",
  },
  {
    id: "4",
    title: "Nooduitgang West",
    date: "2024-02-20",
    status: "gepland",
    type: "Nooduitgang",
  },
  {
    id: "5",
    title: "Brandmelder Kantoor",
    date: "2024-01-10",
    status: "vervallen",
    type: "Brandmelder",
  },
]

const statusConfig = {
  gepland: { label: "Gepland", color: "bg-blue-500", icon: Clock },
  uitgevoerd: { label: "Uitgevoerd", color: "bg-green-500", icon: CheckCircle },
  vervallen: { label: "Vervallen", color: "bg-red-500", icon: AlertTriangle },
}

export default function InspectionCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay()
    return firstDay === 0 ? 6 : firstDay - 1 // Convert Sunday (0) to 6, Monday (1) to 0, etc.
  }

  const getEventsForDate = (date: Date) => {
    const dateString = date.toISOString().split("T")[0]
    return demoEvents.filter((event) => event.date === dateString)
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
    setSelectedDate(null)
  }

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-gray-200"></div>)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      const events = getEventsForDate(date)
      const isToday = date.toDateString() === new Date().toDateString()
      const isSelected = selectedDate?.toDateString() === date.toDateString()

      days.push(
        <div
          key={day}
          className={`h-24 border border-gray-200 p-1 cursor-pointer hover:bg-gray-50 ${
            isToday ? "bg-blue-50 border-blue-300" : ""
          } ${isSelected ? "bg-blue-100 border-blue-500" : ""}`}
          onClick={() => setSelectedDate(date)}
        >
          <div className={`text-sm font-medium ${isToday ? "text-blue-600" : ""}`}>{day}</div>
          <div className="space-y-1 mt-1">
            {events.slice(0, 2).map((event) => {
              const StatusIcon = statusConfig[event.status].icon
              return (
                <div
                  key={event.id}
                  className={`text-xs px-1 py-0.5 rounded text-white truncate ${statusConfig[event.status].color}`}
                  title={`${event.title} - ${statusConfig[event.status].label}`}
                >
                  <StatusIcon className="h-3 w-3 inline mr-1" />
                  {event.title}
                </div>
              )
            })}
            {events.length > 2 && <div className="text-xs text-gray-500">+{events.length - 2} meer</div>}
          </div>
        </div>,
      )
    }

    return days
  }

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : []

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Inspectie Kalender
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="font-medium min-w-[120px] text-center">
                {currentDate.toLocaleDateString("nl-NL", { month: "long", year: "numeric" })}
              </span>
              <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Calendar Header */}
          <div className="grid grid-cols-7 gap-0 mb-2">
            {["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"].map((day) => (
              <div key={day} className="h-8 flex items-center justify-center font-medium text-gray-600 border-b">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-0">{renderCalendarDays()}</div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t">
            <div className="text-sm font-medium text-gray-600">Legenda:</div>
            {Object.entries(statusConfig).map(([status, config]) => {
              const Icon = config.icon
              return (
                <div key={status} className="flex items-center gap-1">
                  <div className={`w-3 h-3 rounded ${config.color}`}></div>
                  <span className="text-sm">{config.label}</span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Selected Date Details */}
      {selectedDate && (
        <Card>
          <CardHeader>
            <CardTitle>
              Inspecties op{" "}
              {selectedDate.toLocaleDateString("nl-NL", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateEvents.length === 0 ? (
              <p className="text-gray-500">Geen inspecties gepland voor deze datum.</p>
            ) : (
              <div className="space-y-3">
                {selectedDateEvents.map((event) => {
                  const StatusIcon = statusConfig[event.status].icon
                  return (
                    <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <StatusIcon
                          className={`h-5 w-5 ${
                            event.status === "uitgevoerd"
                              ? "text-green-600"
                              : event.status === "gepland"
                                ? "text-blue-600"
                                : "text-red-600"
                          }`}
                        />
                        <div>
                          <div className="font-medium">{event.title}</div>
                          <div className="text-sm text-gray-600">{event.type}</div>
                          {event.inspecteur && (
                            <div className="text-sm text-gray-500">Inspecteur: {event.inspecteur}</div>
                          )}
                        </div>
                      </div>
                      <Badge className={`${statusConfig[event.status].color} text-white`}>
                        {statusConfig[event.status].label}
                      </Badge>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
