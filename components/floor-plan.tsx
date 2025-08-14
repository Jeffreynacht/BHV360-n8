"use client"

import { useState } from "react"
import { AlertCircle, Heart, Info } from "lucide-react"

import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type EmergencyItem = {
  id: string
  type: "fire-extinguisher" | "first-aid" | "aed" | "emergency-exit" | "assembly-point" | "info-point"
  x: number
  y: number
  label: string
  description: string
}

export default function FloorPlan() {
  const [selectedItem, setSelectedItem] = useState<EmergencyItem | null>(null)

  const emergencyItems: EmergencyItem[] = [
    {
      id: "fe-1",
      type: "fire-extinguisher",
      x: 15,
      y: 20,
      label: "Brandblusser 1",
      description: "CO2 brandblusser, geschikt voor elektrische branden",
    },
    {
      id: "fe-2",
      type: "fire-extinguisher",
      x: 85,
      y: 20,
      label: "Brandblusser 2",
      description: "Schuimblusser, geschikt voor vloeistofbranden",
    },
    {
      id: "fe-3",
      type: "fire-extinguisher",
      x: 50,
      y: 80,
      label: "Brandblusser 3",
      description: "Poederblusser, geschikt voor alle soorten branden",
    },
    {
      id: "fa-1",
      type: "first-aid",
      x: 30,
      y: 50,
      label: "EHBO-koffer 1",
      description: "Volledige EHBO-koffer met verbandmiddelen",
    },
    {
      id: "fa-2",
      type: "first-aid",
      x: 70,
      y: 50,
      label: "EHBO-koffer 2",
      description: "Basis EHBO-koffer met pleisters en verbandmiddelen",
    },
    {
      id: "aed-1",
      type: "aed",
      x: 50,
      y: 30,
      label: "AED",
      description: "Automatische Externe Defibrillator",
    },
    {
      id: "exit-1",
      type: "emergency-exit",
      x: 5,
      y: 50,
      label: "Nooduitgang West",
      description: "Nooduitgang aan de westzijde van het gebouw",
    },
    {
      id: "exit-2",
      type: "emergency-exit",
      x: 95,
      y: 50,
      label: "Nooduitgang Oost",
      description: "Nooduitgang aan de oostzijde van het gebouw",
    },
    {
      id: "ap-1",
      type: "assembly-point",
      x: 50,
      y: 5,
      label: "Verzamelplaats",
      description: "Verzamelplaats bij ontruiming",
    },
    {
      id: "info-1",
      type: "info-point",
      x: 50,
      y: 50,
      label: "Informatiepunt",
      description: "Centrale informatiepunt met ontruimingsplan",
    },
  ]

  const getIconForType = (type: EmergencyItem["type"]) => {
    switch (type) {
      case "fire-extinguisher":
        return (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white">
            <span className="text-xs font-bold">F</span>
          </div>
        )
      case "first-aid":
        return (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-white">
            <Heart className="h-4 w-4" />
          </div>
        )
      case "aed":
        return (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-500 text-white">
            <span className="text-xs font-bold">AED</span>
          </div>
        )
      case "emergency-exit":
        return (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white">
            <span className="text-xs font-bold">E</span>
          </div>
        )
      case "assembly-point":
        return (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white">
            <span className="text-xs font-bold">V</span>
          </div>
        )
      case "info-point":
        return (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-600 text-white">
            <Info className="h-4 w-4" />
          </div>
        )
      default:
        return <AlertCircle className="h-6 w-6" />
    }
  }

  return (
    <div className="relative">
      <div className="relative h-[600px] w-full overflow-hidden rounded-lg border bg-gray-50">
        {/* Floor plan outline */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
          className="absolute inset-0"
        >
          {/* Main building outline */}
          <rect x="10" y="10" width="80" height="80" fill="white" stroke="#333" strokeWidth="0.5" />

          {/* Rooms */}
          <rect x="10" y="10" width="25" height="20" fill="#f5f5f5" stroke="#333" strokeWidth="0.3" />
          <rect x="35" y="10" width="30" height="20" fill="#f5f5f5" stroke="#333" strokeWidth="0.3" />
          <rect x="65" y="10" width="25" height="20" fill="#f5f5f5" stroke="#333" strokeWidth="0.3" />

          <rect x="10" y="30" width="25" height="20" fill="#f5f5f5" stroke="#333" strokeWidth="0.3" />
          <rect x="35" y="30" width="30" height="20" fill="#f5f5f5" stroke="#333" strokeWidth="0.3" />
          <rect x="65" y="30" width="25" height="20" fill="#f5f5f5" stroke="#333" strokeWidth="0.3" />

          <rect x="10" y="50" width="25" height="20" fill="#f5f5f5" stroke="#333" strokeWidth="0.3" />
          <rect x="35" y="50" width="30" height="20" fill="#f5f5f5" stroke="#333" strokeWidth="0.3" />
          <rect x="65" y="50" width="25" height="20" fill="#f5f5f5" stroke="#333" strokeWidth="0.3" />

          <rect x="10" y="70" width="25" height="20" fill="#f5f5f5" stroke="#333" strokeWidth="0.3" />
          <rect x="35" y="70" width="30" height="20" fill="#f5f5f5" stroke="#333" strokeWidth="0.3" />
          <rect x="65" y="70" width="25" height="20" fill="#f5f5f5" stroke="#333" strokeWidth="0.3" />

          {/* Hallways */}
          <rect x="10" y="30" width="80" height="5" fill="#e6e6e6" stroke="#333" strokeWidth="0.2" />
          <rect x="10" y="65" width="80" height="5" fill="#e6e6e6" stroke="#333" strokeWidth="0.2" />
          <rect x="47.5" y="10" width="5" height="80" fill="#e6e6e6" stroke="#333" strokeWidth="0.2" />

          {/* Doors */}
          <line x1="22.5" y1="30" x2="27.5" y2="30" stroke="#333" strokeWidth="0.5" />
          <line x1="47.5" y1="30" x2="52.5" y2="30" stroke="#333" strokeWidth="0.5" />
          <line x1="72.5" y1="30" x2="77.5" y2="30" stroke="#333" strokeWidth="0.5" />

          <line x1="22.5" y1="70" x2="27.5" y2="70" stroke="#333" strokeWidth="0.5" />
          <line x1="47.5" y1="70" x2="52.5" y2="70" stroke="#333" strokeWidth="0.5" />
          <line x1="72.5" y1="70" x2="77.5" y2="70" stroke="#333" strokeWidth="0.5" />

          <line x1="47.5" y1="22.5" x2="47.5" y2="27.5" stroke="#333" strokeWidth="0.5" />
          <line x1="47.5" y1="47.5" x2="47.5" y2="52.5" stroke="#333" strokeWidth="0.5" />
          <line x1="47.5" y1="72.5" x2="47.5" y2="77.5" stroke="#333" strokeWidth="0.5" />

          {/* Main entrance */}
          <rect x="47.5" y="90" width="5" height="2" fill="#333" />
          <text x="50" y="95" textAnchor="middle" fontSize="1.5" fill="#333">
            Hoofdingang
          </text>

          {/* Room labels */}
          <text x="22.5" y="20" textAnchor="middle" fontSize="2" fill="#333">
            Kantoor 1
          </text>
          <text x="50" y="20" textAnchor="middle" fontSize="2" fill="#333">
            Vergaderzaal
          </text>
          <text x="77.5" y="20" textAnchor="middle" fontSize="2" fill="#333">
            Kantoor 2
          </text>

          <text x="22.5" y="40" textAnchor="middle" fontSize="2" fill="#333">
            Keuken
          </text>
          <text x="50" y="40" textAnchor="middle" fontSize="2" fill="#333">
            Receptie
          </text>
          <text x="77.5" y="40" textAnchor="middle" fontSize="2" fill="#333">
            Kantoor 3
          </text>

          <text x="22.5" y="60" textAnchor="middle" fontSize="2" fill="#333">
            Opslag
          </text>
          <text x="50" y="60" textAnchor="middle" fontSize="2" fill="#333">
            Kantine
          </text>
          <text x="77.5" y="60" textAnchor="middle" fontSize="2" fill="#333">
            Kantoor 4
          </text>

          <text x="22.5" y="80" textAnchor="middle" fontSize="2" fill="#333">
            Serverruimte
          </text>
          <text x="50" y="80" textAnchor="middle" fontSize="2" fill="#333">
            Archief
          </text>
          <text x="77.5" y="80" textAnchor="middle" fontSize="2" fill="#333">
            Kantoor 5
          </text>
        </svg>

        {/* Emergency items */}
        <TooltipProvider>
          {emergencyItems.map((item) => (
            <Tooltip key={item.id}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "absolute -translate-x-1/2 -translate-y-1/2 transform cursor-pointer transition-all hover:scale-110",
                    selectedItem?.id === item.id && "ring-2 ring-blue-500 ring-offset-2",
                  )}
                  style={{ left: `${item.x}%`, top: `${item.y}%` }}
                  onClick={() => setSelectedItem(selectedItem?.id === item.id ? null : item)}
                >
                  {getIconForType(item.type)}
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>

      {/* Selected item details */}
      {selectedItem && (
        <div className="mt-4 rounded-lg border bg-white p-4 shadow-sm">
          <h3 className="mb-2 text-lg font-semibold">{selectedItem.label}</h3>
          <p className="text-gray-700">{selectedItem.description}</p>
        </div>
      )}
    </div>
  )
}
