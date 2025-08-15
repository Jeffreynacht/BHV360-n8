"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { CustomerModuleService } from "@/services/CustomerModuleService"
import type { ICustomer } from "@/interfaces/Customer"
import type { ICustomerModule } from "@/interfaces/CustomerModule"

const CustomerModulesPage = () => {
  const { id } = useParams<{ id: string }>()
  const [selectedCustomer, setSelectedCustomer] = useState<ICustomer | null>(null)
  const [customerModules, setCustomerModules] = useState<ICustomerModule[]>([])
  const [loadingModule, setLoadingModule] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      loadCustomer(id)
      loadCustomerModules()
    }
  }, [id])

  const loadCustomer = async (customerId: string) => {
    try {
      const customer = await CustomerModuleService.getCustomer(customerId)
      setSelectedCustomer(customer)
    } catch (error) {
      console.error("Error loading customer:", error)
    }
  }

  const loadCustomerModules = async () => {
    if (!selectedCustomer) return

    try {
      const modules = await CustomerModuleService.getCustomerModules(selectedCustomer.id)
      setCustomerModules(modules)
    } catch (error) {
      console.error("Error loading customer modules:", error)
    }
  }

  const handleToggleModule = async (moduleId: string, enabled: boolean) => {
    if (!selectedCustomer) return

    setLoadingModule(moduleId)

    try {
      if (enabled) {
        const result = await CustomerModuleService.enableModule(
          selectedCustomer.id,
          moduleId,
          "current_user", // In productie: echte gebruiker
        )

        if (result.success) {
          if (result.requiresApproval) {
            // Show approval required message
            alert(
              `Module activatie vereist goedkeuring.\n\nEen email is verstuurd naar de beheerder voor goedkeuring van deze module.\n\nDe module wordt geactiveerd zodra de goedkeuring is verleend.`,
            )
          } else {
            // Module was activated (auto-approved or direct)
            await loadCustomerModules()
          }
        } else {
          alert(result.error || "Fout bij inschakelen module")
        }
      } else {
        const result = await CustomerModuleService.disableModule(selectedCustomer.id, moduleId, "current_user")

        if (result.success) {
          await loadCustomerModules()
        } else {
          alert(result.error || "Fout bij uitschakelen module")
        }
      }
    } catch (error) {
      console.error("Error toggling module:", error)
      alert("Er is een fout opgetreden")
    } finally {
      setLoadingModule(null)
    }
  }

  return (
    <div>
      <h1>Klant Modules</h1>
      {selectedCustomer ? (
        <>
          <h2>Klant: {selectedCustomer.name}</h2>
          <ul>
            {customerModules.map((module) => (
              <li key={module.moduleId}>
                {module.name} -{" "}
                <button
                  onClick={() => handleToggleModule(module.moduleId, !module.enabled)}
                  disabled={loadingModule === module.moduleId}
                >
                  {loadingModule === module.moduleId ? "Bezig..." : module.enabled ? "Uitschakelen" : "Inschakelen"}
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>Klant laden...</p>
      )}
    </div>
  )
}

export default CustomerModulesPage
