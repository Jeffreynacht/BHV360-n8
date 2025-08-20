"use client"

import { useState } from "react"
import { useCustomer } from "@/components/customer-context"
import { NoCustomerSelected } from "@/components/no-customer-selected"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertTriangle,
  Bell,
  Calendar,
  Clock,
  Info,
  Mail,
  MessageSquare,
  Send,
  Users,
  Megaphone,
  CloudLightning,
  Wrench,
  Building2,
} from "lucide-react"

interface Notification {
  id: string
  title: string
  message: string
  type: "emergency" | "evacuation" | "drill" | "maintenance" | "info" | "weather"
  priority: "low" | "normal" | "high" | "critical"
  channels: string[]
  recipients: string[]
  location: {
    building: string
    floor: string
    zone: string
  }
  sentAt: string
  sentBy: string
  status: "sent" | "scheduled" | "draft" | "failed"
  scheduledFor?: string
}

const notificationTypes = [
  { id: "emergency", name: "Noodmelding", icon: AlertTriangle, color: "text-red-500" },
  { id: "evacuation", name: "Ontruiming", icon: Users, color: "text-orange-500" },
  { id: "drill", name: "Oefening", icon: Calendar, color: "text-blue-500" },
  { id: "maintenance", name: "Onderhoud", icon: Wrench, color: "text-yellow-500" },
  { id: "info", name: "Informatie", icon: Info, color: "text-green-500" },
  { id: "weather", name: "Weersalarm", icon: CloudLightning, color: "text-purple-500" },
]

const priorityLevels = [
  { id: "low", name: "Laag", color: "bg-green-100 text-green-800" },
  { id: "normal", name: "Normaal", color: "bg-blue-100 text-blue-800" },
  { id: "high", name: "Hoog", color: "bg-orange-100 text-orange-800" },
  { id: "critical", name: "Kritiek", color: "bg-red-100 text-red-800" },
]

const channels = [
  { id: "email", name: "E-mail", icon: Mail },
  { id: "sms", name: "SMS", icon: MessageSquare },
  { id: "push", name: "Push notificatie", icon: Bell },
  { id: "speaker", name: "Omroep speakers", icon: Megaphone },
]

const recipientGroups = [
  { id: "all", name: "Alle gebruikers" },
  { id: "bhv", name: "BHV team" },
  { id: "ehbo", name: "EHBO team" },
  { id: "management", name: "Management" },
  { id: "location", name: "Locatie-specifiek" },
]

const buildings = ["Hoofdgebouw", "Bijgebouw A", "Parkeergarage"]
const floors = {
  Hoofdgebouw: ["Begane Grond", "1e Verdieping", "2e Verdieping", "3e Verdieping"],
  "Bijgebouw A": ["Begane Grond", "1e Verdieping"],
  Parkeergarage: ["Niveau -1", "Niveau -2"],
}
const zones = {
  "Begane Grond": ["Noord", "Oost", "Zuid", "West", "Centrale hal", "Receptie"],
  "1e Verdieping": ["Noord", "Oost", "Zuid", "West", "Vergaderzaal A", "Vergaderzaal B"],
  "2e Verdieping": ["Noord", "Oost", "Zuid", "West", "Kantoren", "Kantine"],
  "3e Verdieping": ["Noord", "Oost", "Zuid", "West", "IT Afdeling", "Directie"],
}

const initialNotifications: Notification[] = [
  {
    id: "1",
    title: "Brandoefening",
    message:
      "Morgen om 14:00 uur vindt er een brandoefening plaats. Alle medewerkers worden verzocht het gebouw te verlaten volgens de evacuatieprocedure.",
    type: "drill",
    priority: "normal",
    channels: ["email", "push"],
    recipients: ["all"],
    location: {
      building: "Hoofdgebouw",
      floor: "",
      zone: "",
    },
    sentAt: "2024-01-15 09:30",
    sentBy: "Jan Jansen",
    status: "sent",
  },
  {
    id: "2",
    title: "Nooduitgang geblokkeerd",
    message:
      "De nooduitgang bij de kantine op de 2e verdieping is tijdelijk geblokkeerd vanwege onderhoud. Gebruik de alternatieve route via de centrale trap.",
    type: "maintenance",
    priority: "high",
    channels: ["email", "push", "sms"],
    recipients: ["all"],
    location: {
      building: "Hoofdgebouw",
      floor: "2e Verdieping",
      zone: "Kantine",
    },
    sentAt: "2024-01-10 14:15",
    sentBy: "Maria Janssen",
    status: "sent",
  },
  {
    id: "3",
    title: "EVACUATIE DIRECT",
    message: "EVACUEER HET GEBOUW ONMIDDELLIJK. Volg de instructies van de BHV'ers. Verzamel op het parkeerterrein.",
    type: "emergency",
    priority: "critical",
    channels: ["email", "push", "sms", "speaker"],
    recipients: ["all"],
    location: {
      building: "Hoofdgebouw",
      floor: "",
      zone: "",
    },
    sentAt: "2023-12-05 11:20",
    sentBy: "BHV Centrale",
    status: "sent",
  },
]

const notificationTemplates = {
  emergency: {
    title: "NOODSITUATIE - Onmiddellijke actie vereist",
    message: "Er is een noodsituatie in [LOCATIE]. Volg de instructies van de BHV'ers. [ACTIE]",
  },
  evacuation: {
    title: "EVACUATIE - Verlaat het gebouw",
    message: "Evacueer het gebouw onmiddellijk. Volg de evacuatieroutes. Verzamel op [VERZAMELPUNT].",
  },
  drill: {
    title: "Aankondiging Oefening",
    message: "Op [DATUM] om [TIJD] vindt er een [TYPE] oefening plaats. [INSTRUCTIES]",
  },
  maintenance: {
    title: "Onderhoud - [SYSTEEM]",
    message: "Er vindt onderhoud plaats aan [SYSTEEM] in [LOCATIE] op [DATUM]. [IMPACT]",
  },
  info: {
    title: "Informatie - [ONDERWERP]",
    message: "Belangrijke informatie: [BERICHT]",
  },
  weather: {
    title: "Weersalarm - [TYPE]",
    message: "Er is een weersalarm afgegeven voor [TYPE]. Neem de volgende maatregelen: [MAATREGELEN]",
  },
}

export default function NotificationsPage() {
  const { selectedCustomer } = useCustomer()
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
    type: "info",
    priority: "normal",
    channels: ["email"],
    recipients: ["all"],
    location: {
      building: "",
      floor: "",
      zone: "",
    },
    scheduledFor: "",
  })
  const [selectedTemplate, setSelectedTemplate] = useState("info")

  if (!selectedCustomer) {
    return <NoCustomerSelected />
  }

  const handleSendNotification = () => {
    if (!newNotification.title || !newNotification.message) {
      alert("Vul een titel en bericht in")
      return
    }

    if (newNotification.channels.length === 0) {
      alert("Selecteer minimaal één kanaal")
      return
    }

    if (newNotification.recipients.length === 0) {
      alert("Selecteer minimaal één ontvangersgroep")
      return
    }

    const notification: Notification = {
      id: Date.now().toString(),
      ...newNotification,
      sentAt: new Date().toLocaleString(),
      sentBy: "Huidige Gebruiker",
      status: newNotification.scheduledFor ? "scheduled" : "sent",
    }

    setNotifications([notification, ...notifications])
    setNewNotification({
      title: "",
      message: "",
      type: "info",
      priority: "normal",
      channels: ["email"],
      recipients: ["all"],
      location: {
        building: "",
        floor: "",
        zone: "",
      },
      scheduledFor: "",
    })

    alert("Notificatie " + (newNotification.scheduledFor ? "ingepland" : "verzonden") + "!")
  }

  const handleTemplateSelect = (templateType: string) => {
    setSelectedTemplate(templateType)
    const template = notificationTemplates[templateType as keyof typeof notificationTemplates]

    setNewNotification({
      ...newNotification,
      type: templateType,
      title: template.title,
      message: template.message,
      priority:
        templateType === "emergency" || templateType === "evacuation"
          ? "critical"
          : templateType === "weather"
            ? "high"
            : "normal",
      channels:
        templateType === "emergency" || templateType === "evacuation"
          ? ["email", "push", "sms", "speaker"]
          : ["email", "push"],
    })
  }

  const toggleChannel = (channelId: string) => {
    setNewNotification({
      ...newNotification,
      channels: newNotification.channels.includes(channelId)
        ? newNotification.channels.filter((id) => id !== channelId)
        : [...newNotification.channels, channelId],
    })
  }

  const toggleRecipient = (recipientId: string) => {
    setNewNotification({
      ...newNotification,
      recipients: newNotification.recipients.includes(recipientId)
        ? newNotification.recipients.filter((id) => id !== recipientId)
        : [...newNotification.recipients, recipientId],
    })
  }

  const getTypeIcon = (type: string) => {
    const notificationType = notificationTypes.find((t) => t.id === type)
    return notificationType ? notificationType.icon : Info
  }

  const getTypeColor = (type: string) => {
    const notificationType = notificationTypes.find((t) => t.id === type)
    return notificationType ? notificationType.color : "text-gray-500"
  }

  const getPriorityColor = (priority: string) => {
    const priorityLevel = priorityLevels.find((p) => p.id === priority)
    return priorityLevel ? priorityLevel.color : "bg-gray-100 text-gray-800"
  }

  return (
    <div className="container p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Notificaties</h1>
        <p className="text-muted-foreground">Beheer en verstuur notificaties voor {selectedCustomer.name}</p>
      </div>

      <Tabs defaultValue="send" className="space-y-6">
        <TabsList>
          <TabsTrigger value="send">Versturen</TabsTrigger>
          <TabsTrigger value="history">Geschiedenis</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="send" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Nieuwe Notificatie</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Templates */}
              <div className="space-y-2">
                <Label>Selecteer een template (optioneel)</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {notificationTypes.map((type) => (
                    <Button
                      key={type.id}
                      variant={selectedTemplate === type.id ? "default" : "outline"}
                      className="justify-start"
                      onClick={() => handleTemplateSelect(type.id)}
                    >
                      <type.icon className={`h-4 w-4 mr-2 ${type.color}`} />
                      {type.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Type & Priority */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="notification-type">Type</Label>
                  <Select
                    value={newNotification.type}
                    onValueChange={(value) => setNewNotification({ ...newNotification, type: value })}
                  >
                    <SelectTrigger id="notification-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {notificationTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          <div className="flex items-center">
                            <type.icon className={`h-4 w-4 mr-2 ${type.color}`} />
                            <span>{type.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notification-priority">Prioriteit</Label>
                  <Select
                    value={newNotification.priority}
                    onValueChange={(value) => setNewNotification({ ...newNotification, priority: value })}
                  >
                    <SelectTrigger id="notification-priority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priorityLevels.map((priority) => (
                        <SelectItem key={priority.id} value={priority.id}>
                          <div className="flex items-center">
                            <span
                              className={`h-2 w-2 rounded-full mr-2 ${priority.color.replace("text-", "bg-").replace("-800", "-500")}`}
                            />
                            <span>{priority.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Title & Message */}
              <div className="space-y-2">
                <Label htmlFor="notification-title">Titel</Label>
                <Input
                  id="notification-title"
                  value={newNotification.title}
                  onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
                  placeholder="Bijv. Brandoefening aankondiging"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notification-message">Bericht</Label>
                <Textarea
                  id="notification-message"
                  value={newNotification.message}
                  onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
                  placeholder="Typ hier je bericht..."
                  rows={5}
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label>Locatie (optioneel)</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="notification-building">Gebouw</Label>
                    <Select
                      value={newNotification.location.building}
                      onValueChange={(value) =>
                        setNewNotification({
                          ...newNotification,
                          location: {
                            ...newNotification.location,
                            building: value,
                            floor: "",
                            zone: "",
                          },
                        })
                      }
                    >
                      <SelectTrigger id="notification-building">
                        <SelectValue placeholder="Selecteer gebouw" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Hoofdgebouw">Hoofdgebouw</SelectItem>
                        <SelectItem value="Bijgebouw A">Bijgebouw A</SelectItem>
                        <SelectItem value="Parkeergarage">Parkeergarage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="notification-floor">Verdieping</Label>
                    <Select
                      value={newNotification.location.floor}
                      onValueChange={(value) =>
                        setNewNotification({
                          ...newNotification,
                          location: {
                            ...newNotification.location,
                            floor: value === "all-floors" ? "" : value,
                            zone: "",
                          },
                        })
                      }
                      disabled={!newNotification.location.building}
                    >
                      <SelectTrigger id="notification-floor">
                        <SelectValue placeholder="Selecteer verdieping" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-floors">Alle verdiepingen</SelectItem>
                        {newNotification.location.building &&
                          floors[newNotification.location.building as keyof typeof floors]?.map((floor) => (
                            <SelectItem key={floor} value={floor}>
                              {floor}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="notification-zone">Zone</Label>
                    <Select
                      value={newNotification.location.zone}
                      onValueChange={(value) =>
                        setNewNotification({
                          ...newNotification,
                          location: {
                            ...newNotification.location,
                            zone: value === "all-zones" ? "" : value,
                          },
                        })
                      }
                      disabled={!newNotification.location.floor}
                    >
                      <SelectTrigger id="notification-zone">
                        <SelectValue placeholder="Selecteer zone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-zones">Alle zones</SelectItem>
                        {newNotification.location.floor &&
                          zones[newNotification.location.floor as keyof typeof zones]?.map((zone) => (
                            <SelectItem key={zone} value={zone}>
                              {zone}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Channels */}
              <div className="space-y-2">
                <Label>Kanalen</Label>
                <div className="flex flex-wrap gap-4">
                  {channels.map((channel) => (
                    <div key={channel.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`channel-${channel.id}`}
                        checked={newNotification.channels.includes(channel.id)}
                        onCheckedChange={() => toggleChannel(channel.id)}
                      />
                      <Label htmlFor={`channel-${channel.id}`} className="flex items-center space-x-1 cursor-pointer">
                        <channel.icon className="h-4 w-4" />
                        <span>{channel.name}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recipients */}
              <div className="space-y-2">
                <Label>Ontvangers</Label>
                <div className="flex flex-wrap gap-4">
                  {recipientGroups.map((group) => (
                    <div key={group.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`recipient-${group.id}`}
                        checked={newNotification.recipients.includes(group.id)}
                        onCheckedChange={() => toggleRecipient(group.id)}
                      />
                      <Label htmlFor={`recipient-${group.id}`} className="cursor-pointer">
                        {group.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Schedule */}
              <div className="space-y-2">
                <Label htmlFor="notification-schedule">Inplannen (optioneel)</Label>
                <Input
                  id="notification-schedule"
                  type="datetime-local"
                  value={newNotification.scheduledFor}
                  onChange={(e) => setNewNotification({ ...newNotification, scheduledFor: e.target.value })}
                />
              </div>

              {/* Send Button */}
              <div className="flex justify-end">
                <Button onClick={handleSendNotification} className="w-full md:w-auto">
                  <Send className="h-4 w-4 mr-2" />
                  {newNotification.scheduledFor ? "Inplannen" : "Versturen"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Notificatie Geschiedenis</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Titel</TableHead>
                    <TableHead>Prioriteit</TableHead>
                    <TableHead>Locatie</TableHead>
                    <TableHead>Kanalen</TableHead>
                    <TableHead>Verzonden</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notifications.map((notification) => {
                    const TypeIcon = getTypeIcon(notification.type)
                    return (
                      <TableRow key={notification.id}>
                        <TableCell>
                          <div className="flex items-center">
                            <TypeIcon className={`h-4 w-4 mr-2 ${getTypeColor(notification.type)}`} />
                            <span>{notificationTypes.find((t) => t.id === notification.type)?.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{notification.title}</TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(notification.priority)}>
                            {priorityLevels.find((p) => p.id === notification.priority)?.name}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {notification.location.building ? (
                            <div className="flex items-center">
                              <Building2 className="h-4 w-4 mr-1" />
                              <div>
                                <div className="font-medium">{notification.location.building}</div>
                                {notification.location.floor && (
                                  <div className="text-xs text-muted-foreground">
                                    {notification.location.floor}
                                    {notification.location.zone && ` - ${notification.location.zone}`}
                                  </div>
                                )}
                              </div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">Alle locaties</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            {notification.channels.map((channelId) => {
                              const channel = channels.find((c) => c.id === channelId)
                              if (!channel) return null
                              const Icon = channel.icon
                              return <Icon key={channelId} className="h-4 w-4" />
                            })}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{notification.sentAt}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              notification.status === "sent"
                                ? "default"
                                : notification.status === "scheduled"
                                  ? "secondary"
                                  : notification.status === "draft"
                                    ? "outline"
                                    : "destructive"
                            }
                          >
                            {notification.status === "sent"
                              ? "Verzonden"
                              : notification.status === "scheduled"
                                ? "Ingepland"
                                : notification.status === "draft"
                                  ? "Concept"
                                  : "Mislukt"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Notificatie Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(notificationTemplates).map(([type, template]) => {
                  const notificationType = notificationTypes.find((t) => t.id === type)
                  const TypeIcon = notificationType?.icon || Info
                  return (
                    <Card key={type} className="overflow-hidden">
                      <div className={`h-2 ${notificationType?.color.replace("text-", "bg-")}`} />
                      <CardContent className="p-4 pt-6">
                        <div className="flex items-center space-x-2 mb-2">
                          <TypeIcon className={`h-5 w-5 ${notificationType?.color}`} />
                          <h3 className="font-medium">{notificationType?.name}</h3>
                        </div>
                        <div className="space-y-2">
                          <p className="font-medium text-sm">{template.title}</p>
                          <p className="text-sm text-muted-foreground">{template.message}</p>
                        </div>
                        <div className="mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => handleTemplateSelect(type)}
                          >
                            Template gebruiken
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
