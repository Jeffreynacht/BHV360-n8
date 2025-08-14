"use client"

export function RapportageStatistieken({ data, type }) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center text-muted-foreground">Geen gegevens beschikbaar voor de geselecteerde periode</div>
    )
  }

  if (type === "incidenten") {
    // Calculate incident statistics
    const totalIncidents = data.length
    const evacuationCount = data.filter((incident) => incident.evacuatie).length
    const emergencyServicesCount = data.filter((incident) => incident.hulpdiensten).length
    const totalBHVInzet = data.reduce((sum, incident) => sum + incident.bhvInzet, 0)
    const avgBHVInzet = totalBHVInzet / totalIncidents || 0

    // Count by type
    const typeCount = data.reduce((acc, incident) => {
      acc[incident.type] = (acc[incident.type] || 0) + 1
      return acc
    }, {})

    // Find most common type
    let mostCommonType = ""
    let maxCount = 0
    Object.entries(typeCount).forEach(([type, count]) => {
      if (count > maxCount) {
        mostCommonType = type
        maxCount = count
      }
    })

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-md bg-muted p-2">
            <div className="text-2xl font-bold">{totalIncidents}</div>
            <div className="text-xs text-muted-foreground">Totaal incidenten</div>
          </div>
          <div className="rounded-md bg-muted p-2">
            <div className="text-2xl font-bold">{evacuationCount}</div>
            <div className="text-xs text-muted-foreground">Met evacuatie</div>
          </div>
          <div className="rounded-md bg-muted p-2">
            <div className="text-2xl font-bold">{emergencyServicesCount}</div>
            <div className="text-xs text-muted-foreground">Met hulpdiensten</div>
          </div>
          <div className="rounded-md bg-muted p-2">
            <div className="text-2xl font-bold">{avgBHVInzet.toFixed(1)}</div>
            <div className="text-xs text-muted-foreground">Gem. BHV inzet</div>
          </div>
        </div>
        <div>
          <div className="text-sm font-medium">Meest voorkomend:</div>
          <div className="text-sm">
            {mostCommonType} ({maxCount}x)
          </div>
        </div>
      </div>
    )
  } else if (type === "oefeningen") {
    // Calculate exercise statistics
    const totalOefeningen = data.length
    const totalDeelnemers = data.reduce((sum, oefening) => sum + oefening.deelnemers, 0)
    const avgDeelnemers = totalDeelnemers / totalOefeningen || 0
    const totalDuur = data.reduce((sum, oefening) => sum + oefening.duur, 0)
    const avgDuur = totalDuur / totalOefeningen || 0

    // Count by type
    const typeCount = data.reduce((acc, oefening) => {
      acc[oefening.type] = (acc[oefening.type] || 0) + 1
      return acc
    }, {})

    // Find most common type
    let mostCommonType = ""
    let maxCount = 0
    Object.entries(typeCount).forEach(([type, count]) => {
      if (count > maxCount) {
        mostCommonType = type
        maxCount = count
      }
    })

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-md bg-muted p-2">
            <div className="text-2xl font-bold">{totalOefeningen}</div>
            <div className="text-xs text-muted-foreground">Totaal oefeningen</div>
          </div>
          <div className="rounded-md bg-muted p-2">
            <div className="text-2xl font-bold">{totalDeelnemers}</div>
            <div className="text-xs text-muted-foreground">Totaal deelnemers</div>
          </div>
          <div className="rounded-md bg-muted p-2">
            <div className="text-2xl font-bold">{avgDeelnemers.toFixed(1)}</div>
            <div className="text-xs text-muted-foreground">Gem. deelnemers</div>
          </div>
          <div className="rounded-md bg-muted p-2">
            <div className="text-2xl font-bold">{avgDuur.toFixed(0)} min</div>
            <div className="text-xs text-muted-foreground">Gem. duur</div>
          </div>
        </div>
        <div>
          <div className="text-sm font-medium">Meest voorkomend:</div>
          <div className="text-sm">
            {mostCommonType} ({maxCount}x)
          </div>
        </div>
      </div>
    )
  } else if (type === "inspecties") {
    // Calculate inspection statistics
    const totalInspecties = data.length
    const totalApparatuur = data.reduce((sum, inspectie) => sum + inspectie.aantal, 0)

    // Count by type
    const typeCount = data.reduce((acc, inspectie) => {
      acc[inspectie.type] = (acc[inspectie.type] || 0) + 1
      return acc
    }, {})

    // Count by equipment
    const apparatuurCount = data.reduce((acc, inspectie) => {
      acc[inspectie.apparatuur] = (acc[inspectie.apparatuur] || 0) + 1
      return acc
    }, {})

    // Find most common type and equipment
    let mostCommonType = ""
    let maxTypeCount = 0
    Object.entries(typeCount).forEach(([type, count]) => {
      if (count > maxTypeCount) {
        mostCommonType = type
        maxTypeCount = count
      }
    })

    let mostCommonApparatuur = ""
    let maxApparatuurCount = 0
    Object.entries(apparatuurCount).forEach(([apparatuur, count]) => {
      if (count > maxApparatuurCount) {
        mostCommonApparatuur = apparatuur
        maxApparatuurCount = count
      }
    })

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-md bg-muted p-2">
            <div className="text-2xl font-bold">{totalInspecties}</div>
            <div className="text-xs text-muted-foreground">Totaal inspecties</div>
          </div>
          <div className="rounded-md bg-muted p-2">
            <div className="text-2xl font-bold">{totalApparatuur}</div>
            <div className="text-xs text-muted-foreground">Totaal apparatuur</div>
          </div>
          <div className="rounded-md bg-muted p-2">
            <div className="text-2xl font-bold">{mostCommonType}</div>
            <div className="text-xs text-muted-foreground">Meest voorkomend type</div>
          </div>
          <div className="rounded-md bg-muted p-2">
            <div className="text-2xl font-bold">{mostCommonApparatuur}</div>
            <div className="text-xs text-muted-foreground">Meest geïnspecteerd</div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
