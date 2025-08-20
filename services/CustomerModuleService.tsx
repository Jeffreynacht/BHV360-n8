"use client"

import { toast } from "@/hooks/use-toast"

export interface InstalledModule {
  id: string
  module_id: string
  customer_id: string
  installed_at: string
  status: "active" | "inactive" | "pending"
  configuration?: any
}

export interface ModuleInstallRequest {
  module_id: string
  customer_id?: string
  configuration?: any
}

export class CustomerModuleService {
  private static baseUrl = "/api/modules"

  static async getInstalledModules(customerId?: string): Promise<InstalledModule[]> {
    try {
      const url = customerId ? `${this.baseUrl}/installed?customer_id=${customerId}` : `${this.baseUrl}/installed`

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error("Fout bij ophalen geïnstalleerde modules")
      }

      return await response.json()
    } catch (error) {
      console.error("Fout bij laden modules:", error)
      return []
    }
  }

  static async installModule(moduleId: string, customerId?: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/install`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          module_id: moduleId,
          customer_id: customerId,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Fout bij installeren module")
      }

      return true
    } catch (error) {
      console.error("Installatie fout:", error)
      throw error
    }
  }

  static async uninstallModule(moduleId: string, customerId?: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/uninstall`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          module_id: moduleId,
          customer_id: customerId,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Fout bij deïnstalleren module")
      }

      return true
    } catch (error) {
      console.error("Deïnstallatie fout:", error)
      throw error
    }
  }

  static async updateModuleConfiguration(moduleId: string, configuration: any, customerId?: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/configure`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          module_id: moduleId,
          customer_id: customerId,
          configuration,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Fout bij bijwerken configuratie")
      }

      return true
    } catch (error) {
      console.error("Configuratie fout:", error)
      throw error
    }
  }

  static async getModuleUsageStats(moduleId: string, customerId?: string): Promise<any> {
    try {
      const url = customerId
        ? `${this.baseUrl}/${moduleId}/stats?customer_id=${customerId}`
        : `${this.baseUrl}/${moduleId}/stats`

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error("Fout bij ophalen module statistieken")
      }

      return await response.json()
    } catch (error) {
      console.error("Statistieken fout:", error)
      return null
    }
  }

  static async calculateModulePricing(moduleId: string, userCount: number, buildingCount: number): Promise<number> {
    try {
      const response = await fetch(`${this.baseUrl}/${moduleId}/pricing`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_count: userCount,
          building_count: buildingCount,
        }),
      })

      if (!response.ok) {
        throw new Error("Fout bij berekenen prijzen")
      }

      const result = await response.json()
      return result.total_price || 0
    } catch (error) {
      console.error("Prijsberekening fout:", error)
      return 0
    }
  }

  static async requestModuleApproval(moduleId: string, customerId?: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/request-approval`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          module_id: moduleId,
          customer_id: customerId,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Fout bij aanvragen goedkeuring")
      }

      toast({
        title: "Goedkeuring Aangevraagd",
        description: "Uw aanvraag voor module goedkeuring is verzonden.",
      })

      return true
    } catch (error) {
      console.error("Goedkeuring fout:", error)
      throw error
    }
  }
}
