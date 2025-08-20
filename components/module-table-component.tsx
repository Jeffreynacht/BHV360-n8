"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { MoreHorizontal, Settings, Trash2, Eye } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Module {
  id: string
  name: string
  description: string
  category: string
  status: "active" | "inactive" | "deprecated"
  version: string
  customers: number
  lastUpdated: string
  pricing: {
    monthly: number
    yearly: number
  }
}

interface ModuleTableComponentProps {
  modules?: Module[]
  onEdit?: (module: Module) => void
  onDelete?: (moduleId: string) => void
  onToggleStatus?: (moduleId: string, status: boolean) => void
  onViewDetails?: (module: Module) => void
}

const defaultModules: Module[] = [
  {
    id: "1",
    name: "BHV Aanwezigheid",
    description: "Real-time tracking van BHV leden",
    category: "Core",
    status: "active",
    version: "2.1.0",
    customers: 45,
    lastUpdated: "2024-01-15",
    pricing: { monthly: 29, yearly: 290 },
  },
  {
    id: "2",
    name: "Incident Management",
    description: "Uitgebreid incident beheer systeem",
    category: "Safety",
    status: "active",
    version: "1.8.2",
    customers: 32,
    lastUpdated: "2024-01-12",
    pricing: { monthly: 49, yearly: 490 },
  },
  {
    id: "3",
    name: "Plotkaart Editor",
    description: "Interactieve plotkaart editor",
    category: "Core",
    status: "active",
    version: "3.0.1",
    customers: 67,
    lastUpdated: "2024-01-18",
    pricing: { monthly: 19, yearly: 190 },
  },
  {
    id: "4",
    name: "Legacy Module",
    description: "Oude module die wordt uitgefaseerd",
    category: "Legacy",
    status: "deprecated",
    version: "0.9.5",
    customers: 3,
    lastUpdated: "2023-08-15",
    pricing: { monthly: 0, yearly: 0 },
  },
]

export function ModuleTableComponent({
  modules = defaultModules,
  onEdit,
  onDelete,
  onToggleStatus,
  onViewDetails,
}: ModuleTableComponentProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "deprecated":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Core":
        return "bg-blue-100 text-blue-800"
      case "Safety":
        return "bg-orange-100 text-orange-800"
      case "Premium":
        return "bg-purple-100 text-purple-800"
      case "Legacy":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Module Beheer</CardTitle>
        <CardDescription>Beheer alle beschikbare modules en hun instellingen</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Module</TableHead>
              <TableHead>Categorie</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Versie</TableHead>
              <TableHead>Klanten</TableHead>
              <TableHead>Prijzen</TableHead>
              <TableHead>Laatst bijgewerkt</TableHead>
              <TableHead className="text-right">Acties</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {modules.map((module) => (
              <TableRow key={module.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{module.name}</div>
                    <div className="text-sm text-muted-foreground">{module.description}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getCategoryColor(module.category)}>{module.category}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(module.status)}>{module.status}</Badge>
                    {module.status !== "deprecated" && (
                      <Switch
                        checked={module.status === "active"}
                        onCheckedChange={(checked) => onToggleStatus?.(module.id, checked)}
                        size="sm"
                      />
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm">{module.version}</TableCell>
                <TableCell>
                  <div className="text-center">
                    <span className="font-medium">{module.customers}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>€{module.pricing.monthly}/maand</div>
                    <div className="text-muted-foreground">€{module.pricing.yearly}/jaar</div>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(module.lastUpdated).toLocaleDateString("nl-NL")}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onViewDetails?.(module)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Details bekijken
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit?.(module)}>
                        <Settings className="mr-2 h-4 w-4" />
                        Bewerken
                      </DropdownMenuItem>
                      {module.status === "deprecated" && (
                        <DropdownMenuItem onClick={() => onDelete?.(module.id)} className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Verwijderen
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default ModuleTableComponent
