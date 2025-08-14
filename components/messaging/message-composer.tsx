"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Mail,
  MessageSquare,
  Send,
  Users,
  Building,
  Phone,
  CheckCircle,
  AlertTriangle,
  User,
  MapPin,
} from "lucide-react"

interface Person {
  id: string
  name: string
  type: "visitor" | "contractor"
  phone?: string
  email?: string
  company?: string
  location?: string
  photo?: string
  host?: string
  purpose?: string
}

interface MessageComposerProps {
  recipients?: Person[]
  onSend?: (message: MessageData) => void
  trigger?: React.ReactNode
  currentUser?: {
    name: string
    role: string
    department: string
    phone?: string
    email?: string
  }
  currentLocation?: {
    name: string
    address: string
    phone: string
    email: string
    logo?: string
  }
}

interface MessageData {
  recipients: string[]
  subject: string
  message: string
  channels: ("sms" | "email")[]
  priority: "normal" | "high" | "urgent"
  template?: string
  sender: {
    name: string
    role: string
    department: string
    phone?: string
    email?: string
  }
  location: {
    name: string
    address: string
    phone: string
    email: string
    logo?: string
  }
}

const messageTemplates = [
  {
    id: "welcome",
    name: "Welkomstbericht",
    subject: "Welkom bij {{location}}",
    message:
      "Hartelijk welkom bij {{location}}!\n\nU bent succesvol ingecheckt en kunt nu gebruik maken van onze faciliteiten. Mocht u vragen hebben tijdens uw bezoek, aarzel dan niet om contact op te nemen.\n\nWij wensen u een prettig verblijf toe.",
  },
  {
    id: "checkout_reminder",
    name: "Uitcheck herinnering",
    subject: "Uitchecken niet vergeten",
    message:
      "Geachte {{name}},\n\nWij zien dat u nog niet bent uitgecheckt. Voor de veiligheid en administratie verzoeken wij u vriendelijk om bij vertrek uit te checken bij de receptie.\n\nBedankt voor uw medewerking en uw bezoek aan {{location}}.",
  },
  {
    id: "location_update",
    name: "Locatie wijziging",
    subject: "Wijziging werklocatie",
    message:
      "Geachte {{name}},\n\nHierbij informeren wij u dat uw werklocatie is gewijzigd naar: {{new_location}}.\n\nMocht u deze locatie niet kunnen vinden, neem dan contact op met de receptie voor begeleiding.\n\nBedankt voor uw begrip.",
  },
  {
    id: "emergency_info",
    name: "Veiligheidsinformatie",
    subject: "BELANGRIJK: Veiligheidsinformatie",
    message:
      "Geachte {{name}},\n\nEr is belangrijke veiligheidsinformatie die uw aandacht behoeft. Volg alstublieft de instructies van het BHV-personeel op.\n\nBij vragen of onduidelijkheden kunt u direct contact opnemen met de receptie.\n\nUw veiligheid is onze prioriteit.",
  },
  {
    id: "meeting_reminder",
    name: "Afspraak herinnering",
    subject: "Herinnering: Uw afspraak",
    message:
      "Geachte {{name}},\n\nDit is een vriendelijke herinnering voor uw afspraak vandaag om {{time}}.\n\nLocatie: {{meeting_location}}\nGastheer/Gastvrouw: {{host}}\n\nMocht u vertraging hebben, neem dan contact op met de receptie.",
  },
  {
    id: "work_completion",
    name: "Werkzaamheden voltooid",
    subject: "Bedankt voor uw werkzaamheden",
    message:
      "Geachte {{name}},\n\nHartelijk dank voor het succesvol voltooien van de werkzaamheden bij {{location}}.\n\nVergeet niet om bij vertrek uit te checken bij de receptie voor de administratie.\n\nWij waarderen uw professionele inzet.",
  },
  {
    id: "visitor_info",
    name: "Bezoeker informatie",
    subject: "Informatie voor uw bezoek",
    message:
      "Geachte {{name}},\n\nWelkom bij {{location}}. Hier is enkele belangrijke informatie voor uw bezoek:\n\n• Receptie: {{reception_phone}}\n• Uw gastheer: {{host}}\n• Parkeren: {{parking_info}}\n• WiFi: Vraag de toegangscode bij de receptie\n\nGeniet van uw bezoek!",
  },
]

export function MessageComposer({
  recipients = [],
  onSend,
  trigger,
  currentUser = {
    name: "Receptie Medewerker",
    role: "Receptionist",
    department: "Beveiliging & Receptie",
    phone: "+31 20 123 4567",
    email: "receptie@bhv360.nl",
  },
  currentLocation = {
    name: "BHV360 Hoofdkantoor",
    address: "Voorbeeldstraat 123, 1234 AB Amsterdam",
    phone: "+31 20 123 4567",
    email: "info@bhv360.nl",
    logo: "/images/placeholder-logo.png",
  },
}: MessageComposerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([])
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [channels, setChannels] = useState<("sms" | "email")[]>(["email"])
  const [priority, setPriority] = useState<"normal" | "high" | "urgent">("normal")
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [sendResult, setSendResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleTemplateSelect = (templateId: string) => {
    const template = messageTemplates.find((t) => t.id === templateId)
    if (template) {
      setSelectedTemplate(templateId)
      setSubject(template.subject)
      setMessage(template.message)
    }
  }

  const handleRecipientToggle = (personId: string) => {
    setSelectedRecipients((prev) =>
      prev.includes(personId) ? prev.filter((id) => id !== personId) : [...prev, personId],
    )
  }

  const handleChannelToggle = (channel: "sms" | "email") => {
    setChannels((prev) => (prev.includes(channel) ? prev.filter((c) => c !== channel) : [...prev, channel]))
  }

  const processTemplate = (text: string, person: Person) => {
    return text
      .replace(/\{\{name\}\}/g, person.name)
      .replace(/\{\{company\}\}/g, person.company || "")
      .replace(/\{\{location\}\}/g, currentLocation.name)
      .replace(/\{\{new_location\}\}/g, person.location || "")
      .replace(/\{\{meeting_location\}\}/g, person.location || "")
      .replace(/\{\{host\}\}/g, person.host || "")
      .replace(/\{\{purpose\}\}/g, person.purpose || "")
      .replace(/\{\{time\}\}/g, new Date().toLocaleTimeString("nl-NL"))
      .replace(/\{\{reception_phone\}\}/g, currentLocation.phone)
      .replace(/\{\{parking_info\}\}/g, "Beschikbaar op het terrein")
  }

  const handleSend = async () => {
    if (selectedRecipients.length === 0 || !message.trim() || channels.length === 0) {
      setSendResult({ success: false, message: "Vul alle vereiste velden in" })
      return
    }

    setIsSending(true)
    setSendResult(null)

    try {
      const selectedPeople = recipients.filter((p) => selectedRecipients.includes(p.id))

      // Send messages to each recipient
      const promises = selectedPeople.map(async (person) => {
        const personalizedSubject = processTemplate(subject, person)
        const personalizedMessage = processTemplate(message, person)

        const messageData = {
          recipient: person,
          subject: personalizedSubject,
          message: personalizedMessage,
          channels,
          priority,
          sender: currentUser,
          location: currentLocation,
        }

        // Send via API
        const response = await fetch("/api/messaging/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(messageData),
        })

        return response.json()
      })

      const results = await Promise.all(promises)
      const successCount = results.filter((r) => r.success).length

      setSendResult({
        success: successCount > 0,
        message: `${successCount} van ${selectedPeople.length} berichten succesvol verzonden`,
      })

      if (onSend) {
        onSend({
          recipients: selectedRecipients,
          subject,
          message,
          channels,
          priority,
          template: selectedTemplate,
          sender: currentUser,
          location: currentLocation,
        })
      }

      // Reset form on success
      if (successCount === selectedPeople.length) {
        setTimeout(() => {
          setIsOpen(false)
          setSelectedRecipients([])
          setSubject("")
          setMessage("")
          setChannels(["email"])
          setPriority("normal")
          setSelectedTemplate("")
          setSendResult(null)
        }, 2000)
      }
    } catch (error) {
      setSendResult({ success: false, message: "Fout bij verzenden van berichten" })
    } finally {
      setIsSending(false)
    }
  }

  const selectedPeople = recipients.filter((p) => selectedRecipients.includes(p.id))
  const canSendSMS = selectedPeople.every((p) => p.phone)
  const canSendEmail = selectedPeople.every((p) => p.email)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <MessageSquare className="h-4 w-4 mr-2" />
            Professioneel Bericht
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>Professioneel Bericht Sturen</span>
          </DialogTitle>
          <DialogDescription>
            Stuur een professioneel bericht met uw handtekening en bedrijfslogo's naar bezoekers of monteurs
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Sender Information Display */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-900 mb-2 flex items-center">
              <User className="h-4 w-4 mr-2" />
              Verzender Informatie
            </h3>
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-blue-600 text-white">
                  {currentUser.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-blue-900">{currentUser.name}</p>
                <p className="text-sm text-blue-700">
                  {currentUser.role} | {currentUser.department}
                </p>
                <div className="flex items-center space-x-4 text-xs text-blue-600 mt-1">
                  {currentUser.phone && (
                    <span className="flex items-center">
                      <Phone className="h-3 w-3 mr-1" />
                      {currentUser.phone}
                    </span>
                  )}
                  {currentUser.email && (
                    <span className="flex items-center">
                      <Mail className="h-3 w-3 mr-1" />
                      {currentUser.email}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Location Information Display */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-green-900 mb-2 flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              Locatie Informatie
            </h3>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded border flex items-center justify-center">
                <img
                  src={currentLocation.logo || "/images/placeholder-logo.png"}
                  alt={currentLocation.name}
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div>
                <p className="font-medium text-green-900">{currentLocation.name}</p>
                <p className="text-sm text-green-700">{currentLocation.address}</p>
                <div className="flex items-center space-x-4 text-xs text-green-600 mt-1">
                  <span className="flex items-center">
                    <Phone className="h-3 w-3 mr-1" />
                    {currentLocation.phone}
                  </span>
                  <span className="flex items-center">
                    <Mail className="h-3 w-3 mr-1" />
                    {currentLocation.email}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Recipients Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Ontvangers ({recipients.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto border rounded-lg p-3">
              {recipients.map((person) => (
                <div
                  key={person.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedRecipients.includes(person.id) ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50"
                  }`}
                  onClick={() => handleRecipientToggle(person.id)}
                >
                  <Checkbox
                    checked={selectedRecipients.includes(person.id)}
                    onChange={() => handleRecipientToggle(person.id)}
                  />
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={person.photo || "/placeholder.svg"} alt={person.name} />
                    <AvatarFallback>
                      {person.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{person.name}</p>
                    <p className="text-sm text-gray-600 truncate">{person.company}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      {person.type === "visitor" ? (
                        <Users className="h-3 w-3 text-green-600" />
                      ) : (
                        <Building className="h-3 w-3 text-orange-600" />
                      )}
                      <span className="text-xs text-gray-500">
                        {person.type === "visitor" ? "Bezoeker" : "Monteur"}
                      </span>
                      {person.phone && <Phone className="h-3 w-3 text-blue-600" />}
                      {person.email && <Mail className="h-3 w-3 text-green-600" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {selectedRecipients.length > 0 && (
              <div className="mt-2 flex items-center space-x-2">
                <Badge variant="outline">{selectedRecipients.length} geselecteerd</Badge>
                <Button variant="ghost" size="sm" onClick={() => setSelectedRecipients(recipients.map((p) => p.id))}>
                  Alles selecteren
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setSelectedRecipients([])}>
                  Alles deselecteren
                </Button>
              </div>
            )}
          </div>

          {/* Message Channels */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Verzendmethode</h3>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={channels.includes("email")}
                  onCheckedChange={() => handleChannelToggle("email")}
                  disabled={!canSendEmail && selectedRecipients.length > 0}
                />
                <Mail className="h-4 w-4" />
                <span>Email (met logo's en handtekening)</span>
                {!canSendEmail && selectedRecipients.length > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    Niet alle ontvangers hebben email
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={channels.includes("sms")}
                  onCheckedChange={() => handleChannelToggle("sms")}
                  disabled={!canSendSMS && selectedRecipients.length > 0}
                />
                <MessageSquare className="h-4 w-4" />
                <span>SMS (met handtekening)</span>
                {!canSendSMS && selectedRecipients.length > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    Niet alle ontvangers hebben telefoon
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Priority */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Prioriteit</h3>
            <Select value={priority} onValueChange={(value: "normal" | "high" | "urgent") => setPriority(value)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">📋 Normaal</SelectItem>
                <SelectItem value="high">⚠️ Hoog</SelectItem>
                <SelectItem value="urgent">🚨 Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Templates */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Professionele Sjablonen</h3>
            <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Kies een professioneel sjabloon (optioneel)" />
              </SelectTrigger>
              <SelectContent>
                {messageTemplates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Message Content */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Onderwerp</label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Onderwerp van het bericht"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Bericht</label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Typ uw professionele bericht hier..."
                rows={8}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Gebruik {"{{name}}"}, {"{{company}}"}, {"{{location}}"}, {"{{host}}"} voor personalisatie. Uw
                handtekening en logo's worden automatisch toegevoegd.
              </p>
            </div>
          </div>

          {/* Send Result */}
          {sendResult && (
            <Alert className={sendResult.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
              {sendResult.success ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription className={sendResult.success ? "text-green-800" : "text-red-800"}>
                {sendResult.message}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isSending}>
            Annuleren
          </Button>
          <Button onClick={handleSend} disabled={isSending || selectedRecipients.length === 0 || !message.trim()}>
            {isSending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Verzenden...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Verstuur Professioneel Bericht ({selectedRecipients.length})
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
