"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { MessageSquare, Mail, Phone, Users, Building, Send, LayoutTemplateIcon as Template, Clock } from "lucide-react"

interface Recipient {
  id: string
  name: string
  type: "visitor" | "contractor" | "bhv_member" | "ploegleider"
  phone?: string
  email?: string
  company?: string
  location?: string
  host?: string
  purpose?: string
}

interface MessageComposerProps {
  recipients: Recipient[]
  trigger: React.ReactNode
}

const messageTemplates = [
  {
    id: "welcome",
    name: "Welkomstbericht",
    subject: "Welkom bij {company}",
    content: "Welkom bij {company}! U bent succesvol ingecheckt. Bij vragen kunt u contact opnemen met de receptie.",
    category: "welcome",
  },
  {
    id: "checkout_reminder",
    name: "Uitcheck herinnering",
    subject: "Vergeet niet uit te checken",
    content:
      "Dit is een vriendelijke herinnering om uit te checken bij de receptie voordat u vertrekt. Bedankt voor uw bezoek!",
    category: "reminder",
  },
  {
    id: "location_change",
    name: "Locatie wijziging",
    subject: "Werklocatie aangepast",
    content: "Uw werklocatie is gewijzigd naar: {location}. Neem contact op met de receptie voor meer informatie.",
    category: "update",
  },
  {
    id: "emergency_info",
    name: "Noodinformatie",
    subject: "Belangrijke mededeling",
    content: "Belangrijke mededeling: {message}. Volg de instructies van het BHV-personeel.",
    category: "emergency",
  },
  {
    id: "meeting_reminder",
    name: "Afspraak herinnering",
    subject: "Herinnering afspraak",
    content: "Herinnering: Uw afspraak met {host} begint over 15 minuten in {location}.",
    category: "reminder",
  },
  {
    id: "work_completed",
    name: "Werk voltooid",
    subject: "Bedankt voor uw werkzaamheden",
    content: "Bedankt voor het uitvoeren van de werkzaamheden. Vergeet niet uit te checken bij de receptie.",
    category: "completion",
  },
]

export function MessageComposer({ recipients, trigger }: MessageComposerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>(recipients.map((r) => r.id))
  const [messageType, setMessageType] = useState<"sms" | "email" | "both">("both")
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [customMessage, setCustomMessage] = useState("")
  const [customSubject, setCustomSubject] = useState("")
  const [isSending, setIsSending] = useState(false)
  const { toast } = useToast()

  const handleTemplateSelect = (templateId: string) => {
    const template = messageTemplates.find((t) => t.id === templateId)
    if (template) {
      setSelectedTemplate(templateId)
      setCustomMessage(template.content)
      setCustomSubject(template.subject)
    }
  }

  const handleRecipientToggle = (recipientId: string) => {
    setSelectedRecipients((prev) =>
      prev.includes(recipientId) ? prev.filter((id) => id !== recipientId) : [...prev, recipientId],
    )
  }

  const handleSendMessage = async () => {
    if (selectedRecipients.length === 0) {
      toast({
        title: "Geen ontvangers geselecteerd",
        description: "Selecteer minimaal één ontvanger om een bericht te versturen.",
        variant: "destructive",
      })
      return
    }

    if (!customMessage.trim()) {
      toast({
        title: "Geen bericht ingevoerd",
        description: "Voer een bericht in om te versturen.",
        variant: "destructive",
      })
      return
    }

    setIsSending(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const selectedRecipientsData = recipients.filter((r) => selectedRecipients.includes(r.id))

      // Simulate sending logic
      const emailCount =
        messageType === "email" || messageType === "both" ? selectedRecipientsData.filter((r) => r.email).length : 0
      const smsCount =
        messageType === "sms" || messageType === "both" ? selectedRecipientsData.filter((r) => r.phone).length : 0

      toast({
        title: "Bericht verzonden!",
        description: `Bericht verzonden naar ${selectedRecipientsData.length} ontvangers${emailCount > 0 ? ` (${emailCount} emails` : ""}${smsCount > 0 ? `${emailCount > 0 ? ", " : " ("}${smsCount} SMS'en` : ""}${emailCount > 0 || smsCount > 0 ? ")" : ""}.`,
      })

      // Reset form
      setCustomMessage("")
      setCustomSubject("")
      setSelectedTemplate("")
      setIsOpen(false)
    } catch (error) {
      toast({
        title: "Fout bij verzenden",
        description: "Er is een fout opgetreden bij het verzenden van het bericht.",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  const selectedRecipientsData = recipients.filter((r) => selectedRecipients.includes(r.id))
  const emailRecipients = selectedRecipientsData.filter((r) => r.email)
  const smsRecipients = selectedRecipientsData.filter((r) => r.phone)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>Bericht Versturen</span>
          </DialogTitle>
          <DialogDescription>
            Verstuur berichten naar geselecteerde bezoekers en monteurs via SMS en/of email
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Recipients Selection */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Ontvangers ({recipients.length})</CardTitle>
              <CardDescription>Selecteer wie het bericht moet ontvangen</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="select-all"
                    checked={selectedRecipients.length === recipients.length}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedRecipients(recipients.map((r) => r.id))
                      } else {
                        setSelectedRecipients([])
                      }
                    }}
                  />
                  <label htmlFor="select-all" className="text-sm font-medium">
                    Selecteer alle ontvangers
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto">
                  {recipients.map((recipient) => (
                    <div key={recipient.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <Checkbox
                        id={recipient.id}
                        checked={selectedRecipients.includes(recipient.id)}
                        onCheckedChange={() => handleRecipientToggle(recipient.id)}
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          {recipient.type === "visitor" ? (
                            <Users className="h-4 w-4 text-green-600" />
                          ) : (
                            <Building className="h-4 w-4 text-blue-600" />
                          )}
                          <span className="font-medium text-sm">{recipient.name}</span>
                        </div>
                        <div className="text-xs text-gray-600">
                          {recipient.company}
                          {recipient.type === "visitor" && recipient.host && ` • Host: ${recipient.host}`}
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          {recipient.phone && <Phone className="h-3 w-3 text-gray-400" />}
                          {recipient.email && <Mail className="h-3 w-3 text-blue-400" />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary */}
                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="text-sm text-gray-600">
                    {selectedRecipients.length} van {recipients.length} ontvangers geselecteerd
                  </div>
                  <div className="flex space-x-2">
                    <Badge variant="outline" className="text-xs">
                      <Mail className="h-3 w-3 mr-1" />
                      {emailRecipients.length} emails
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <Phone className="h-3 w-3 mr-1" />
                      {smsRecipients.length} SMS
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Message Type Selection */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Verzendmethode</CardTitle>
              <CardDescription>Kies hoe het bericht verzonden moet worden</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={messageType} onValueChange={(value: "sms" | "email" | "both") => setMessageType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="both">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-4 w-4" />
                      <span>Email + SMS (aanbevolen)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="email">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4" />
                      <span>Alleen Email</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="sms">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4" />
                      <span>Alleen SMS</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Message Content */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Bericht</CardTitle>
              <CardDescription>Kies een sjabloon of schrijf een aangepast bericht</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="templates" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="templates">
                    <Template className="h-4 w-4 mr-2" />
                    Sjablonen
                  </TabsTrigger>
                  <TabsTrigger value="custom">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Aangepast
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="templates" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {messageTemplates.map((template) => (
                      <div
                        key={template.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedTemplate === template.id ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
                        }`}
                        onClick={() => handleTemplateSelect(template.id)}
                      >
                        <h4 className="font-medium text-sm">{template.name}</h4>
                        <p className="text-xs text-gray-600 mt-1">{template.content.substring(0, 100)}...</p>
                        <Badge variant="outline" className="text-xs mt-2">
                          {template.category}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="custom" className="space-y-4">
                  <div className="space-y-3">
                    {(messageType === "email" || messageType === "both") && (
                      <div>
                        <label className="text-sm font-medium">Email Onderwerp</label>
                        <input
                          type="text"
                          value={customSubject}
                          onChange={(e) => setCustomSubject(e.target.value)}
                          placeholder="Voer email onderwerp in..."
                          className="w-full mt-1 px-3 py-2 border rounded-md"
                        />
                      </div>
                    )}
                    <div>
                      <label className="text-sm font-medium">Bericht</label>
                      <Textarea
                        value={customMessage}
                        onChange={(e) => setCustomMessage(e.target.value)}
                        placeholder="Voer uw bericht in..."
                        rows={6}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Preview */}
          {customMessage && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Voorbeeld</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(messageType === "email" || messageType === "both") && customSubject && (
                    <div>
                      <label className="text-xs font-medium text-gray-600">EMAIL ONDERWERP:</label>
                      <p className="text-sm font-medium">{customSubject}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-xs font-medium text-gray-600">BERICHT:</label>
                    <p className="text-sm whitespace-pre-wrap">{customMessage}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Send Button */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-gray-600">
              Bericht wordt verzonden naar {selectedRecipients.length} ontvangers
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Annuleren
              </Button>
              <Button
                onClick={handleSendMessage}
                disabled={isSending || selectedRecipients.length === 0 || !customMessage.trim()}
              >
                {isSending ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Verzenden...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Bericht Versturen
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
