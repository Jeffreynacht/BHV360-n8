"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SafetyIcon } from "@/components/safety-icons"

interface LegendItem {
  id: string
  name: string
  icon: string
  color: string
  category: string
}

interface LegendProps {
  items?: LegendItem[]
  title?: string
  className?: string
}

const defaultLegendItems: LegendItem[] = [
  {
    id: "fire-extinguisher",
    name: "Brandblusser",
    icon: "fire-extinguisher-symbol",
    color: "#dc2626",
    category: "Brandbestrijding",
  },
  {
    id: "fire-hose",
    name: "Brandslang",
    icon: "fire-hose-symbol",
    color: "#dc2626",
    category: "Brandbestrijding",
  },
  {
    id: "fire-blanket",
    name: "Blusdeken",
    icon: "fire-blanket",
    color: "#dc2626",
    category: "Brandbestrijding",
  },
  {
    id: "emergency-exit",
    name: "Nooduitgang",
    icon: "emergency-exit-green",
    color: "#16a34a",
    category: "Evacuatie",
  },
  {
    id: "assembly-point",
    name: "Verzamelplaats",
    icon: "assembly-point-people",
    color: "#16a34a",
    category: "Evacuatie",
  },
  {
    id: "aed",
    name: "AED",
    icon: "aed-heart",
    color: "#2563eb",
    category: "Eerste Hulp",
  },
  {
    id: "first-aid",
    name: "EHBO Post",
    icon: "medical-cross",
    color: "#2563eb",
    category: "Eerste Hulp",
  },
  {
    id: "emergency-shower",
    name: "Nooddouche",
    icon: "emergency-shower",
    color: "#7c3aed",
    category: "Veiligheid",
  },
  {
    id: "eye-wash",
    name: "Oogdouche",
    icon: "eye-wash-station",
    color: "#7c3aed",
    category: "Veiligheid",
  },
]

export function Legend({ items = defaultLegendItems, title = "Legenda", className }: LegendProps) {
  const categories = Array.from(new Set(items.map((item) => item.category)))

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {categories.map((category) => (
          <div key={category}>
            <Badge variant="outline" className="mb-2">
              {category}
            </Badge>
            <div className="grid grid-cols-1 gap-2">
              {items
                .filter((item) => item.category === category)
                .map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50">
                    <SafetyIcon
                      iconType={item.icon}
                      size={24}
                      className="flex-shrink-0"
                      style={{ color: item.color }}
                    />
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default Legend
