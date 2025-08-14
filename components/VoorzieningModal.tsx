"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Trash2 } from "lucide-react"
import type { Voorziening } from "@/lib/voorzieningen"

interface VoorzieningModalProps {
  isOpen: boolean
  onClose: () => void
  voorziening: Voorziening | null
  onSave: (voorziening: Omit<Voorziening, "id" | "createdAt" | "updatedAt">) => void
  onDelete?: (id: string) => void
  mode: "create" | "edit" | "view"
}

const VOORZIENING_TYPES = [
  { value: "brandblusser", label: "Brandblusser" },
  { value: "nooduitgang", label: "Nooduitgang" },
  { value: "ehbo", label: "EHBO Post" },
  { value: "aed", label: "AED" },
  { value: "verzamelplaats", label: "Verzamelplaats" },
  { value: "brandmelder", label: "Brandmelder" },
  { value: "noodtelefoon", label: "Noodtelefoon" },
]

const STATUS_OPTIONS = [
  { value: "actief", label: "Actief" },
  { value: "onderhoud", label: "Onderhoud" },
  { value: "defect", label: "Defect" },
]

export default function VoorzieningModal({
  isOpen,
  onClose,
  voorziening,
  onSave,
  onDelete,
  mode,
}: VoorzieningModalProps) {
  const [formData, setFormData] = useState({
    type: "brandblusser",
    naam: "",
    locatie: { x: 0, y: 0 },
    status: "actief" as const,
    beschrijving: "",
    serienummer: "",
    fabrikant: "",
    installatiedatum: "",
    laatsteInspectie: "",
    volgendeInspectie: "",
    opmerkingen: "",
  })

  useEffect(() => {
    if (voorziening) {
      setFormData({
        type: voorziening.type,
        naam: voorziening.naam,
        locatie: voorziening.locatie,
        status: voorziening.status,
        beschrijving: (voorziening as any).beschrijving || "",
        serienummer: (voorziening as any).serienummer || "",
        fabrikant: (voorziening as any).fabrikant || "",
        installatiedatum: (voorziening as any).installatiedatum || "",
        laatsteInspectie: (voorziening as any).laatsteInspectie || "",
        volgendeInspectie: (voorziening as any).volgendeInspectie || "",
        opmerkingen: (voorziening as any).opmerkingen || "",
      })
    } else {
      setFormData({
        type: "brandblusser",
        naam: "",
        locatie: { x: 0, y: 0 },
        status: "actief",
        beschrijving: "",
        serienummer: "",
        fabrikant: "",
        installatiedatum: "",
        laatsteInspectie: "",
        volgendeInspectie: "",
        opmerkingen: "",
      })
    }
  }, [voorziening])

  const handleSave = () => {
    onSave(formData)
    onClose()
  }

  const handleDelete = () => {
    if (voorziening && onDelete) {
      onDelete(voorziening.id)
    }
  }

  const isReadOnly = mode === "view"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" && "Nieuwe Voorziening Toevoegen"}
            {mode === "edit" && "Voorziening Bewerken"}
            {mode === "view" && "Voorziening Details"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
                disabled={isReadOnly}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VOORZIENING_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as any })}
                disabled={isReadOnly}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="naam">Naam</Label>
            <Input
              id="naam"
              value={formData.naam}
              onChange={(e) => setFormData({ ...formData, naam: e.target.value })}
              placeholder="Bijv. Brandblusser BG-001"
              readOnly={isReadOnly}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="beschrijving">Beschrijving</Label>
            <Textarea
              id="beschrijving"
              value={formData.beschrijving}
              onChange={(e) => setFormData({ ...formData, beschrijving: e.target.value })}
              placeholder="Korte beschrijving van de voorziening"
              readOnly={isReadOnly}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="x">X Positie</Label>
              <Input
                id="x"
                type="number"
                value={formData.locatie.x}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    locatie: { ...formData.locatie, x: Number.parseInt(e.target.value) || 0 },
                  })
                }
                readOnly={isReadOnly}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="y">Y Positie</Label>
              <Input
                id="y"
                type="number"
                value={formData.locatie.y}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    locatie: { ...formData.locatie, y: Number.parseInt(e.target.value) || 0 },
                  })
                }
                readOnly={isReadOnly}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="serienummer">Serienummer</Label>
              <Input
                id="serienummer"
                value={formData.serienummer}
                onChange={(e) => setFormData({ ...formData, serienummer: e.target.value })}
                placeholder="Bijv. FE-2024-001"
                readOnly={isReadOnly}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fabrikant">Fabrikant</Label>
              <Input
                id="fabrikant"
                value={formData.fabrikant}
                onChange={(e) => setFormData({ ...formData, fabrikant: e.target.value })}
                placeholder="Bijv. Gloria"
                readOnly={isReadOnly}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="installatiedatum">Installatiedatum</Label>
              <Input
                id="installatiedatum"
                type="date"
                value={formData.installatiedatum}
                onChange={(e) => setFormData({ ...formData, installatiedatum: e.target.value })}
                readOnly={isReadOnly}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="laatsteInspectie">Laatste Inspectie</Label>
              <Input
                id="laatsteInspectie"
                type="date"
                value={formData.laatsteInspectie}
                onChange={(e) => setFormData({ ...formData, laatsteInspectie: e.target.value })}
                readOnly={isReadOnly}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="volgendeInspectie">Volgende Inspectie</Label>
              <Input
                id="volgendeInspectie"
                type="date"
                value={formData.volgendeInspectie}
                onChange={(e) => setFormData({ ...formData, volgendeInspectie: e.target.value })}
                readOnly={isReadOnly}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="opmerkingen">Opmerkingen</Label>
            <Textarea
              id="opmerkingen"
              value={formData.opmerkingen}
              onChange={(e) => setFormData({ ...formData, opmerkingen: e.target.value })}
              placeholder="Aanvullende opmerkingen"
              readOnly={isReadOnly}
            />
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <div>
            {mode === "edit" && voorziening && onDelete && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Verwijderen
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Voorziening verwijderen</AlertDialogTitle>
                    <AlertDialogDescription>
                      Weet je zeker dat je deze voorziening wilt verwijderen? Deze actie kan niet ongedaan worden
                      gemaakt.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuleren</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Verwijderen</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              {isReadOnly ? "Sluiten" : "Annuleren"}
            </Button>
            {!isReadOnly && <Button onClick={handleSave}>{mode === "create" ? "Toevoegen" : "Opslaan"}</Button>}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
