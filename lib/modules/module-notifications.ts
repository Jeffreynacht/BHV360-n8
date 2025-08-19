export interface ModuleActivationRequest {
  id: string
  moduleId: string
  customerId: string
  customerName: string
  requestedBy: string
  requestedByEmail: string
  requestedAt: Date
  status: "pending" | "approved" | "rejected"
  approvedBy?: string
  approvedAt?: Date
  rejectedBy?: string
  rejectedAt?: Date
  rejectionReason?: string
  monthlyCost: number
  yearlyCost: number
}

export class ModuleNotificationService {
  static async getPendingRequests(): Promise<ModuleActivationRequest[]> {
    const stored = localStorage.getItem("module_activation_requests")
    const requests: ModuleActivationRequest[] = stored ? JSON.parse(stored) : []

    return requests
      .filter((r) => r.status === "pending")
      .map((r) => ({
        ...r,
        requestedAt: new Date(r.requestedAt),
        approvedAt: r.approvedAt ? new Date(r.approvedAt) : undefined,
        rejectedAt: r.rejectedAt ? new Date(r.rejectedAt) : undefined,
      }))
  }

  static async approveRequest(requestId: string, approvedBy: string) {
    try {
      const stored = localStorage.getItem("module_activation_requests")
      const requests: ModuleActivationRequest[] = stored ? JSON.parse(stored) : []

      const updatedRequests = requests.map((r) =>
        r.id === requestId ? { ...r, status: "approved" as const, approvedBy, approvedAt: new Date() } : r,
      )

      localStorage.setItem("module_activation_requests", JSON.stringify(updatedRequests))
      return { success: true }
    } catch (error) {
      return { success: false, error }
    }
  }

  static async rejectRequest(requestId: string, rejectedBy: string, reason: string) {
    try {
      const stored = localStorage.getItem("module_activation_requests")
      const requests: ModuleActivationRequest[] = stored ? JSON.parse(stored) : []

      const updatedRequests = requests.map((r) =>
        r.id === requestId
          ? { ...r, status: "rejected" as const, rejectedBy, rejectedAt: new Date(), rejectionReason: reason }
          : r,
      )

      localStorage.setItem("module_activation_requests", JSON.stringify(updatedRequests))
      return { success: true }
    } catch (error) {
      return { success: false, error }
    }
  }
}
