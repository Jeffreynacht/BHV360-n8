"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Filter, X } from "lucide-react"
import { format } from "date-fns"
import { nl } from "date-fns/locale"

export interface ReportFilters {
  dateRange: {
    from: Date | null
    to: Date | null
  }
  reportTypes: string[]
  departments: string[]
  bhvRoles: string[]
  certificationStatus: string[]
  incidentTypes: string[]
  facilityTypes: string[]
  customFields: Record<string, string>
}

interface AdvancedFiltersProps {
  filters: ReportFilters
  onFiltersChange: (filters: ReportFilters) => void
  onApplyFilters: () => void
  onResetFilters: () => void
}

export function AdvancedFilters({ filters, onFiltersChange, onApplyFilters, onResetFilters }: AdvancedFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const reportTypeOptions = [
    { value: "bhv", label: "BHV Certificering" },
    { value: "incidents", label: "Incidenten" },
    { value: "facilities", label: "Voorzieningen" },
    { value: "users", label: "Gebruikers" },
    { value: "compliance", label: "Compliance" },
    { value: "training", label: "Training" },
  ]

  const departmentOptions = [
    { value: "hr", label: "HR" },
    { value: "it", label: "IT" },
    { value: "facilities", label: "Facilitair" },
    { value: "security", label: "Beveiliging" },
    { value: "management", label: "Management" },
  ]

  const bhvRoleOptions = [
    { value: "basis", label: "Basis BHV" },
    { value: "ehbo", label: "EHBO" },
    { value: "ploegleider", label: "Ploegleider" },
    { value: "coordinator", label: "Coördinator" },
  ]

  const certificationStatusOptions = [
    { value: "valid", label: "Geldig" },
    { value: "expiring", label: "Verloopt binnenkort" },
    { value: "expired", label: "Verlopen" },
    { value: "pending", label: "In behandeling" },
  ]

  const incidentTypeOptions = [
    { value: "fire", label: "Brand" },
    { value: "evacuation", label: "Evacuatie" },
    { value: "medical", label: "Medisch" },
    { value: "technical", label: "Technisch" },
    { value: "security", label: "Beveiliging" },
  ]

  const facilityTypeOptions = [
    { value: "extinguisher", label: "Brandblusser" },
    { value: "hose", label: "Brandslanghaspel" },
    { value: "exit", label: "Nooduitgang" },
    { value: "aed", label: "AED" },
    { value: "firstaid", label: "EHBO" },
  ]

  const updateFilters = (key: keyof ReportFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    })
  }

  const toggleArrayFilter = (key: keyof ReportFilters, value: string) => {
    const currentArray = filters[key] as string[]
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value]

    updateFilters(key, newArray)
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.dateRange.from || filters.dateRange.to) count++
    if (filters.reportTypes.length > 0) count++
    if (filters.departments.length > 0) count++
    if (filters.bhvRoles.length > 0) count++
    if (filters.certificationStatus.length > 0) count++
    if (filters.incidentTypes.length > 0) count++
    if (filters.facilityTypes.length > 0) count++
    if (Object.keys(filters.customFields).length > 0) count++
    return count
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Geavanceerde Filters
            {getActiveFiltersCount() > 0 && <Badge variant="secondary">{getActiveFiltersCount()}</Badge>}
          </CardTitle>
          <Button variant="outline" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? "Inklappen" : "Uitklappen"}
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-6">
          {/* Date Range */}
          <div className="space-y-2">
            <Label>Datumbereik</Label>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex-1">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {filters.dateRange.from
                      ? format(filters.dateRange.from, "dd MMM yyyy", { locale: nl })
                      : "Van datum"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters.dateRange.from || undefined}
                    onSelect={(date) => updateFilters("dateRange", { ...filters.dateRange, from: date || null })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex-1">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {filters.dateRange.to ? format(filters.dateRange.to, "dd MMM yyyy", { locale: nl }) : "Tot datum"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters.dateRange.to || undefined}
                    onSelect={(date) => updateFilters("dateRange", { ...filters.dateRange, to: date || null })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Report Types */}
          <div className="space-y-2">
            <Label>Rapport Types</Label>
            <div className="flex flex-wrap gap-2">
              {reportTypeOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`reportType-${option.value}`}
                    checked={filters.reportTypes.includes(option.value)}
                    onCheckedChange={() => toggleArrayFilter("reportTypes", option.value)}
                  />
                  <Label htmlFor={`reportType-${option.value}`} className="text-sm">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Departments */}
          <div className="space-y-2">
            <Label>Afdelingen</Label>
            <div className="flex flex-wrap gap-2">
              {departmentOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`department-${option.value}`}
                    checked={filters.departments.includes(option.value)}
                    onCheckedChange={() => toggleArrayFilter("departments", option.value)}
                  />
                  <Label htmlFor={`department-${option.value}`} className="text-sm">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* BHV Roles */}
          <div className="space-y-2">
            <Label>BHV Rollen</Label>
            <div className="flex flex-wrap gap-2">
              {bhvRoleOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`bhvRole-${option.value}`}
                    checked={filters.bhvRoles.includes(option.value)}
                    onCheckedChange={() => toggleArrayFilter("bhvRoles", option.value)}
                  />
                  <Label htmlFor={`bhvRole-${option.value}`} className="text-sm">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Certification Status */}
          <div className="space-y-2">
            <Label>Certificering Status</Label>
            <div className="flex flex-wrap gap-2">
              {certificationStatusOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`certStatus-${option.value}`}
                    checked={filters.certificationStatus.includes(option.value)}
                    onCheckedChange={() => toggleArrayFilter("certificationStatus", option.value)}
                  />
                  <Label htmlFor={`certStatus-${option.value}`} className="text-sm">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Fields */}
          <div className="space-y-2">
            <Label>Aangepaste Velden</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customField1" className="text-sm">
                  Locatie
                </Label>
                <Input
                  id="customField1"
                  placeholder="Bijv. Gebouw A"
                  value={filters.customFields.location || ""}
                  onChange={(e) =>
                    updateFilters("customFields", {
                      ...filters.customFields,
                      location: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="customField2" className="text-sm">
                  Verantwoordelijke
                </Label>
                <Input
                  id="customField2"
                  placeholder="Naam verantwoordelijke"
                  value={filters.customFields.responsible || ""}
                  onChange={(e) =>
                    updateFilters("customFields", {
                      ...filters.customFields,
                      responsible: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t">
            <Button onClick={onApplyFilters} className="flex-1">
              Filters Toepassen
            </Button>
            <Button variant="outline" onClick={onResetFilters}>
              <X className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>

          {/* Active Filters Display */}
          {getActiveFiltersCount() > 0 && (
            <div className="space-y-2 pt-4 border-t">
              <Label className="text-sm font-medium">Actieve Filters:</Label>
              <div className="flex flex-wrap gap-2">
                {filters.reportTypes.map((type) => (
                  <Badge key={type} variant="secondary" className="text-xs">
                    {reportTypeOptions.find((opt) => opt.value === type)?.label}
                    <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => toggleArrayFilter("reportTypes", type)} />
                  </Badge>
                ))}
                {filters.departments.map((dept) => (
                  <Badge key={dept} variant="secondary" className="text-xs">
                    {departmentOptions.find((opt) => opt.value === dept)?.label}
                    <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => toggleArrayFilter("departments", dept)} />
                  </Badge>
                ))}
                {/* Add more active filter badges as needed */}
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}
