"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle, Clock, Euro, User, Calendar, AlertTriangle } from "lucide-react"
import { ModuleNotificationService, type ModuleActivationRequest } from "@/lib/modules/module-notifications"
import { getModuleById } from "@/lib/modules/module-definitions"

export default function ModuleApprovalsPage() {
  const [pendingRequests, setPendingRequests] = useState<ModuleActivationRequest[]>([])
  const [allRequests, setAllRequests] = useState<ModuleActivationRequest[]>([])
  const [selectedRequest, setSelectedRequest] = useState<ModuleActivationRequest | null>(null)
  const [showApprovalDialog, setShowApprovalDialog] = useState(false)
  const [showRejectionDialog, setShowRejectionDialog] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadRequests()
  }, [])

  const loadRequests = async () => {
    const pending = await ModuleNotificationService.getPendingRequests()
    setPendingRequests(pending)

    // Load all requests for history
    const stored = localStorage.getItem("module_activation_requests")
    const all: ModuleActivationRequest[] = stored ? JSON.parse(stored) : []
    setAllRequests(
      all
        .map((r) => ({
          ...r,
          requestedAt: new Date(r.requestedAt),
          approvedAt: r.approvedAt ? new Date(r.approvedAt) : undefined,
          rejectedAt: r.rejectedAt ? new Date(r.rejectedAt) : undefined,
        }))
        .sort((a, b) => b.requestedAt.getTime() - a.requestedAt.getTime()),
    )
  }

  const handleApprove = async () => {
    if (!selectedRequest) return

    setLoading(true)
    const result = await ModuleNotificationService.approveRequest(
      selectedRequest.id,
      "Current User", // In productie: echte gebruiker
    )

    if (result.success) {
      await loadRequests()
      setShowApprovalDialog(false)
      setSelectedRequest(null)
    }
    setLoading(false)
  }

  const handleReject = async () => {
    if (!selectedRequest || !rejectionReason.trim()) return

    setLoading(true)
    const result = await ModuleNotificationService.rejectRequest(
      selectedRequest.id,
      "Current User", // In productie: echte gebruiker
      rejectionReason,
    )

    if (result.success) {
      await loadRequests()
      setShowRejectionDialog(false)
      setSelectedRequest(null)
      setRejectionReason("")
    }
    setLoading(false)
  }

  const getStatusBadge = (status: ModuleActivationRequest["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="text-yellow-600">
            <Clock className="w-3 h-3 mr-1" />
            Wachtend
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="text-green-600">
            <CheckCircle className="w-3 h-3 mr-1" />
            Goedgekeurd
          </Badge>
        )
      case "auto_approved":
        return (
          <Badge variant="outline" className="text-blue-600">
            <CheckCircle className="w-3 h-3 mr-1" />
            Auto Goedgekeurd
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="text-red-600">
            <XCircle className="w-3 h-3 mr-1" />
            Afgewezen
          </Badge>
        )
    }
  }

  const RequestCard = ({ request }: { request: ModuleActivationRequest }) => {
    const module = getModuleById(request.moduleId)

    return (
      <Card className="mb-4">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">{module?.name}</CardTitle>
              <CardDescription>
                {request.customerName} • Aangevraagd door {request.requestedBy}
              </CardDescription>
            </div>
            {getStatusBadge(request.status)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm">{request.requestedAt.toLocaleDateString("nl-NL")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Euro className="w-4 h-4 text-gray-500" />
              <span className="text-sm">€{Number(request.monthlyCost).toFixed(2)}/maand</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" />
              <span className="text-sm">{request.requestedByEmail}</span>
            </div>
          </div>

          {request.status === "pending" && (
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setSelectedRequest(request)
                  setShowApprovalDialog(true)
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Goedkeuren
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedRequest(request)
                  setShowRejectionDialog(true)
                }}
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Afwijzen
              </Button>
            </div>
          )}

          {request.status === "approved" && request.approvedBy && (
            <div className="text-sm text-green-600">
              ✅ Goedgekeurd door {request.approvedBy} op {request.approvedAt?.toLocaleDateString("nl-NL")}
            </div>
          )}

          {request.status === "rejected" && request.rejectedBy && (
            <div className="text-sm text-red-600">
              ❌ Afgewezen door {request.rejectedBy} op {request.rejectedAt?.toLocaleDateString("nl-NL")}
              {request.rejectionReason && <div className="mt-1 text-gray-600">Reden: {request.rejectionReason}</div>}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Module Goedkeuringen</h1>
        <p className="text-gray-600">Beheer verzoeken voor module activaties</p>
      </div>

      {pendingRequests.length > 0 && (
        <Alert className="mb-6 border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            Er zijn {pendingRequests.length} verzoeken die uw goedkeuring vereisen.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="pending" className="w-full">
        <TabsList>
          <TabsTrigger value="pending">Wachtend ({pendingRequests.length})</TabsTrigger>
          <TabsTrigger value="all">Alle Verzoeken ({allRequests.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          {pendingRequests.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Geen wachtende verzoeken</h3>
                <p className="text-gray-600">Alle module verzoeken zijn behandeld.</p>
              </CardContent>
            </Card>
          ) : (
            <div>
              {pendingRequests.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="all" className="mt-6">
          <div>
            {allRequests.map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Approval Dialog */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Module Goedkeuren</DialogTitle>
            <DialogDescription>Weet u zeker dat u deze module wilt goedkeuren?</DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="py-4">
              <div className="space-y-2">
                <p>
                  <strong>Module:</strong> {getModuleById(selectedRequest.moduleId)?.name}
                </p>
                <p>
                  <strong>Klant:</strong> {selectedRequest.customerName}
                </p>
                <p>
                  <strong>Maandelijkse kosten:</strong> €{Number(selectedRequest.monthlyCost).toFixed(2)}
                </p>
                <p>
                  <strong>Jaarlijkse kosten:</strong> €{Number(selectedRequest.yearlyCost).toFixed(2)}
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApprovalDialog(false)}>
              Annuleren
            </Button>
            <Button onClick={handleApprove} disabled={loading} className="bg-green-600 hover:bg-green-700">
              {loading ? "Goedkeuren..." : "Goedkeuren"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rejection Dialog */}
      <Dialog open={showRejectionDialog} onOpenChange={setShowRejectionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Module Afwijzen</DialogTitle>
            <DialogDescription>Geef een reden op waarom u deze module afwijst.</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Textarea
              placeholder="Reden voor afwijzing..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectionDialog(false)}>
              Annuleren
            </Button>
            <Button
              onClick={handleReject}
              disabled={loading || !rejectionReason.trim()}
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
            >
              {loading ? "Afwijzen..." : "Afwijzen"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
