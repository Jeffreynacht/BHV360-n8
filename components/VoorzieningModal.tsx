"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { type Voorziening, createVoorziening, updateVoorziening } from "@/lib/voorzieningen"

interface VoorzieningModalProps {
  isOpen: boolean
  onClose: () => void
  voorziening?: Voorziening | null
  onSave: (voorziening: Voorziening) => void
}

export default function VoorzieningModal({ isOpen, onClose, voorziening, onSave }: VoorzieningModalProps) {
  const [formData, setFormData] = useState({
    type: voorziening?.type || "brandblusser",
    naam: voorziening?.naam || "",
    locatie: voorziening?.locatie || { x: 0, y: 0 },
    status: voorziening?.status || "actief",
    beschrijving: voorziening?.beschrijving || "",
    serienummer: voorziening?.serienummer || "",
    fabrikant: voorziening?.fabrikant || "",
    installatiedatum: voorziening?.installatiedatum || "",
    laatsteInspectie: voorziening?.laatsteInspectie || "",
    volgendeInspectie: voorziening?.volgendeInspectie || "",
    opmerkingen: voorziening?.opmerkingen || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      let savedVoorziening: Voorziening

      if (voorziening) {
        // Update existing
        const updated = await updateVoorziening(voorziening.id, formData)
        if (!updated) throw new Error("Failed to update voorziening")
        savedVoorziening = updated
      } else {
        // Create new
        savedVoorziening = await createVoorziening({
          ...formData,
          type: formData.type as Voorziening["type"],
          status: formData.status as Voorziening["status"],
        })
      }

      onSave(savedVoorziening)
      onClose()
    } catch (error) {
      console.error("Error saving voorziening:", error)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{voorziening ? "Voorziening Bewerken" : "Nieuwe Voorziening"}</DialogTitle>
          <DialogDescription>Vul de gegevens van de voorziening in.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Type</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="brandblusser">Brandblusser</SelectItem>
                  <SelectItem value="nooduitgang">Nooduitgang</SelectItem>
                  <SelectItem value="ehbo">EHBO</SelectItem>
                  <SelectItem value="aed">AED</SelectItem>
                  <SelectItem value="verzamelplaats">Verzamelplaats</SelectItem>
                  <SelectItem value="brandmelder">Brandmelder</SelectItem>
                  <SelectItem value="noodtelefoon">Noodtelefoon</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="actief">Actief</SelectItem>
                  <SelectItem value="onderhoud">Onderhoud</SelectItem>
                  <SelectItem value="defect">Defect</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="naam">Naam</Label>
            <Input
              id="naam"
              value={formData.naam}
              onChange={(e) => handleInputChange("naam", e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="beschrijving">Beschrijving</Label>
            <Textarea
              id="beschrijving"
              value={formData.beschrijving}
              onChange={(e) => handleInputChange("beschrijving", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="serienummer">Serienummer</Label>
              <Input
                id="serienummer"
                value={formData.serienummer}
                onChange={(e) => handleInputChange("serienummer", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="fabrikant">Fabrikant</Label>
              <Input
                id="fabrikant"
                value={formData.fabrikant}
                onChange={(e) => handleInputChange("fabrikant", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="installatiedatum">Installatie</Label>
              <Input
                id="installatiedatum"
                type="date"
                value={formData.installatiedatum}
                onChange={(e) => handleInputChange("installatiedatum", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="laatsteInspectie">Laatste Inspectie</Label>
              <Input
                id="laatsteInspectie"
                type="date"
                value={formData.laatsteInspectie}
                onChange={(e) => handleInputChange("laatsteInspectie", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="volgendeInspectie">Volgende Inspectie</Label>
              <Input
                id="volgendeInspectie"
                type="date"
                value={formData.volgendeInspectie}
                onChange={(e) => handleInputChange("volgendeInspectie", e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="opmerkingen">Opmerkingen</Label>
            <Textarea
              id="opmerkingen"
              value={formData.opmerkingen}
              onChange={(e) => handleInputChange("opmerkingen", e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuleren
            </Button>
            <Button type="submit">{voorziening ? "Bijwerken" : "Toevoegen"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
