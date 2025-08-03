"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { Voorziening } from "@/lib/voorzieningen"
import { Calendar, MapPin, AlertCircle, CheckCircle, Clock } from "lucide-react"

interface VoorzieningModalProps {
  isOpen: boolean
  onClose: () => void
  voorziening?: Voorziening | null
  onSave: (voorziening: Omit<Voorziening, "id" | "createdAt" | "updatedAt">) => void
  mode: "create" | "edit" | "view"
}

export default function VoorzieningModal({ isOpen, onClose, voorziening, onSave, mode }: VoorzieningModalProps) {
  const [formData, setFormData] = useState({
    type: "brandblusser" as Voorziening["type"],
    naam: "",
    locatie: { x: 0, y: 0 },
    status: "actief" as Voorziening["status"],
    laatsteControle: "",
    volgendeControle: "",
    opmerkingen: "",
  })

  useEffect(() => {
    if (voorziening) {
      setFormData({
        type: voorziening.type,
        naam: voorziening.naam,
        locatie: voorziening.locatie,
        status: voorziening.status,
        laatsteControle: voorziening.laatsteControle || "",
        volgendeControle: voorziening.volgendeControle || "",
        opmerkingen: voorziening.opmerkingen || "",
      })
    } else {
      setFormData({
        type: "brandblusser",
        naam: "",
        locatie: { x: 0, y: 0 },
        status: "actief",
        laatsteControle: "",
        volgendeControle: "",
        opmerkingen: "",
      })
    }
  }, [voorziening, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    onClose()
  }

  const isReadOnly = mode === "view"
  const title =
    mode === "create" ? "Nieuwe Voorziening" : mode === "edit" ? "Voorziening Bewerken" : "Voorziening Details"

  const getStatusIcon = (status: Voorziening["status"]) => {
    switch (status) {
      case "actief":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "onderhoud":
        return <Clock className="w-4 h-4 text-yellow-600" />
      case "defect":
        return <AlertCircle className="w-4 h-4 text-red-600" />
      default:
        return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getStatusIcon(formData.status)}
            {title}
          </DialogTitle>
          <DialogDescription>
            {mode === "create" && "Voeg een nieuwe veiligheidsvoorziening toe aan de plattegrond."}
            {mode === "edit" && "Bewerk de details van deze veiligheidsvoorziening."}
            {mode === "view" && "Bekijk de details van deze veiligheidsvoorziening."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type Voorziening</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value as Voorziening["type"] })}
                disabled={isReadOnly}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="brandblusser">Brandblusser</SelectItem>
                  <SelectItem value="nooduitgang">Nooduitgang</SelectItem>
                  <SelectItem value="ehbo">EHBO Post</SelectItem>
                  <SelectItem value="aed">AED</SelectItem>
                  <SelectItem value="verzamelplaats">Verzamelplaats</SelectItem>
                  <SelectItem value="brandmelder">Brandmelder</SelectItem>
                  <SelectItem value="noodtelefoon">Noodtelefoon</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as Voorziening["status"] })}
                disabled={isReadOnly}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="actief">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Actief
                    </div>
                  </SelectItem>
                  <SelectItem value="onderhoud">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-yellow-600" />
                      Onderhoud
                    </div>
                  </SelectItem>
                  <SelectItem value="defect">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      Defect
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="naam">Naam/Beschrijving</Label>
            <Input
              id="naam"
              value={formData.naam}
              onChange={(e) => setFormData({ ...formData, naam: e.target.value })}
              placeholder="Bijv. Brandblusser Hoofdingang"
              required
              readOnly={isReadOnly}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="x">X Positie</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
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
                  className="pl-10"
                  readOnly={isReadOnly}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="y">Y Positie</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
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
                  className="pl-10"
                  readOnly={isReadOnly}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="laatsteControle">Laatste Controle</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="laatsteControle"
                  type="date"
                  value={formData.laatsteControle}
                  onChange={(e) => setFormData({ ...formData, laatsteControle: e.target.value })}
                  className="pl-10"
                  readOnly={isReadOnly}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="volgendeControle">Volgende Controle</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="volgendeControle"
                  type="date"
                  value={formData.volgendeControle}
                  onChange={(e) => setFormData({ ...formData, volgendeControle: e.target.value })}
                  className="pl-10"
                  readOnly={isReadOnly}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="opmerkingen">Opmerkingen</Label>
            <Textarea
              id="opmerkingen"
              value={formData.opmerkingen}
              onChange={(e) => setFormData({ ...formData, opmerkingen: e.target.value })}
              placeholder="Aanvullende informatie..."
              rows={3}
              readOnly={isReadOnly}
            />
          </div>

          {voorziening && (
            <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <strong>Aangemaakt:</strong> {new Date(voorziening.createdAt).toLocaleDateString("nl-NL")}
                </div>
                <div>
                  <strong>Laatst gewijzigd:</strong> {new Date(voorziening.updatedAt).toLocaleDateString("nl-NL")}
                </div>
              </div>
            </div>
          )}
        </form>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            {isReadOnly ? "Sluiten" : "Annuleren"}
          </Button>
          {!isReadOnly && (
            <Button type="submit" onClick={handleSubmit}>
              {mode === "create" ? "Toevoegen" : "Opslaan"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
