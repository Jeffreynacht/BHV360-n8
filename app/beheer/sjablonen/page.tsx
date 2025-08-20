"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Plus,
  Edit,
  Trash2,
  Copy,
  Search,
  Filter,
  Mail,
  MessageSquare,
  Bell,
  FileText,
  Settings,
  Eye,
  Save,
  X,
  CheckCircle,
  AlertTriangle,
} from "lucide-react"

interface Template {
  id: string
  name: string
  category: "messaging" | "email" | "notification" | "report" | "form"
  type: "sms" | "email" | "push" | "system" | "pdf" | "html"
  subject?: string
  content: string
  variables: string[]
  priority: "low" | "normal" | "high" | "urgent"
  active: boolean
  isSystem: boolean
  createdAt: string
  updatedAt: string
  usageCount: number
  description?: string
}

const templateCategories = [
  { value: "messaging", label: "Berichten", icon: MessageSquare, color: "bg-blue-500" },
  { value: "email", label: "E-mail", icon: Mail, color: "bg-green-500" },
  { value: "notification", label: "Notificaties", icon: Bell, color: "bg-yellow-500" },
  { value: "report", label: "Rapporten", icon: FileText, color: "bg-purple-500" },
  { value: "form", label: "Formulieren", icon: Settings, color: "bg-gray-500" },
]

const templateTypes = [
  { value: "sms", label: "SMS" },
  { value: "email", label: "E-mail" },
  { value: "push", label: "Push Notificatie" },
  { value: "system", label: "Systeem" },
  { value: "pdf", label: "PDF" },
  { value: "html", label: "HTML" },
]

const availableVariables = [
  { key: "{{name}}", description: "Naam van de ontvanger" },
  { key: "{{email}}", description: "E-mailadres van de ontvanger" },
  { key: "{{phone}}", description: "Telefoonnummer van de ontvanger" },
  { key: "{{company}}", description: "Bedrijfsnaam van de ontvanger" },
  { key: "{{location}}", description: "Locatienaam" },
  { key: "{{address}}", description: "Adres van de locatie" },
  { key: "{{date}}", description: "Huidige datum" },
  { key: "{{time}}", description: "Huidige tijd" },
  { key: "{{datetime}}", description: "Datum en tijd" },
  { key: "{{sender_name}}", description: "Naam van de verzender" },
  { key: "{{sender_role}}", description: "Rol van de verzender" },
  { key: "{{sender_department}}", description: "Afdeling van de verzender" },
  { key: "{{sender_phone}}", description: "Telefoon van de verzender" },
  { key: "{{sender_email}}", description: "E-mail van de verzender" },
  { key: "{{location_phone}}", description: "Telefoon van de locatie" },
  { key: "{{location_email}}", description: "E-mail van de locatie" },
  { key: "{{host}}", description: "Gastheer/gastvrouw" },
  { key: "{{purpose}}", description: "Doel van het bezoek" },
  { key: "{{bhv_coordinator}}", description: "BHV Coördinator" },
  { key: "{{emergency_type}}", description: "Type noodsituatie" },
  { key: "{{incident_id}}", description: "Incident nummer" },
]

const defaultTemplates: Template[] = [
  {
    id: "welcome_visitor",
    name: "Welkomstbericht Bezoeker",
    category: "messaging",
    type: "email",
    subject: "Welkom bij {{location}}",
    content:
      "Geachte {{name}},\n\nHartelijk welkom bij {{location}}!\n\nU bent succesvol ingecheckt en kunt nu gebruik maken van onze faciliteiten. Mocht u vragen hebben tijdens uw bezoek, aarzel dan niet om contact op te nemen met de receptie.\n\nUw gastheer: {{host}}\nReceptie: {{location_phone}}\n\nWij wensen u een prettig verblijf toe.\n\nMet vriendelijke groet,\n{{sender_name}}\n{{sender_role}} | {{location}}",
    variables: ["{{name}}", "{{location}}", "{{host}}", "{{location_phone}}", "{{sender_name}}", "{{sender_role}}"],
    priority: "normal",
    active: true,
    isSystem: false,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    usageCount: 45,
    description: "Standaard welkomstbericht voor bezoekers",
  },
  {
    id: "checkout_reminder",
    name: "Uitcheck Herinnering",
    category: "messaging",
    type: "sms",
    content:
      "Beste {{name}}, vergeet niet uit te checken bij de receptie voordat u {{location}} verlaat. Bedankt voor uw bezoek!\n\n{{sender_name}}\n{{location_phone}}",
    variables: ["{{name}}", "{{location}}", "{{sender_name}}", "{{location_phone}}"],
    priority: "normal",
    active: true,
    isSystem: false,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    usageCount: 23,
    description: "Herinnering voor bezoekers om uit te checken",
  },
  {
    id: "emergency_notification",
    name: "Noodmelding",
    category: "notification",
    type: "push",
    subject: "🚨 NOODMELDING: {{emergency_type}}",
    content:
      "NOODMELDING bij {{location}}\n\nType: {{emergency_type}}\nTijd: {{datetime}}\n\nVolg de instructies van het BHV-personeel.\nBel bij vragen: {{location_phone}}\n\nBHV Coördinator: {{bhv_coordinator}}",
    variables: ["{{location}}", "{{emergency_type}}", "{{datetime}}", "{{location_phone}}", "{{bhv_coordinator}}"],
    priority: "urgent",
    active: true,
    isSystem: true,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    usageCount: 3,
    description: "Kritieke noodmelding voor alle aanwezigen",
  },
]

export default function TemplateManagementPage() {
  const [templates, setTemplates] = useState<Template[]>(defaultTemplates)
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>(defaultTemplates)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null)
  const [saveResult, setSaveResult] = useState<{ success: boolean; message: string } | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    category: "messaging" as Template["category"],
    type: "email" as Template["type"],
    subject: "",
    content: "",
    priority: "normal" as Template["priority"],
    description: "",
    active: true,
  })

  useEffect(() => {
    filterTemplates()
  }, [templates, selectedCategory, searchQuery])

  const filterTemplates = () => {
    let filtered = templates

    if (selectedCategory !== "all") {
      filtered = filtered.filter((t) => t.category === selectedCategory)
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    setFilteredTemplates(filtered)
  }

  const extractVariables = (content: string, subject?: string): string[] => {
    const text = `${content} ${subject || ""}`
    const matches = text.match(/\{\{[^}]+\}\}/g) || []
    return [...new Set(matches)]
  }

  const resetForm = () => {
    setFormData({
      name: "",
      category: "messaging",
      type: "email",
      subject: "",
      content: "",
      priority: "normal",
      description: "",
      active: true,
    })
  }

  const handleCreate = () => {
    setEditingTemplate(null)
    resetForm()
    setIsCreateDialogOpen(true)
  }

  const handleEdit = (template: Template) => {
    setEditingTemplate(template)
    setFormData({
      name: template.name,
      category: template.category,
      type: template.type,
      subject: template.subject || "",
      content: template.content,
      priority: template.priority,
      description: template.description || "",
      active: template.active,
    })
    setIsCreateDialogOpen(true)
  }

  const handleDuplicate = (template: Template) => {
    setEditingTemplate(null)
    setFormData({
      name: `${template.name} (Kopie)`,
      category: template.category,
      type: template.type,
      subject: template.subject || "",
      content: template.content,
      priority: template.priority,
      description: template.description || "",
      active: true,
    })
    setIsCreateDialogOpen(true)
  }

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.content.trim()) {
      setSaveResult({ success: false, message: "Naam en inhoud zijn verplicht" })
      return
    }

    const variables = extractVariables(formData.content, formData.subject)

    const templateData: Template = {
      id: editingTemplate?.id || `template_${Date.now()}`,
      name: formData.name,
      category: formData.category,
      type: formData.type,
      subject: formData.subject || undefined,
      content: formData.content,
      variables,
      priority: formData.priority,
      active: formData.active,
      isSystem: editingTemplate?.isSystem || false,
      createdAt: editingTemplate?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      usageCount: editingTemplate?.usageCount || 0,
      description: formData.description,
    }

    try {
      if (editingTemplate) {
        // Update existing template
        setTemplates((prev) => prev.map((t) => (t.id === editingTemplate.id ? templateData : t)))
        setSaveResult({ success: true, message: "Sjabloon succesvol bijgewerkt" })
      } else {
        // Create new template
        setTemplates((prev) => [...prev, templateData])
        setSaveResult({ success: true, message: "Sjabloon succesvol aangemaakt" })
      }

      setTimeout(() => {
        setIsCreateDialogOpen(false)
        setSaveResult(null)
        resetForm()
      }, 1500)
    } catch (error) {
      setSaveResult({ success: false, message: "Fout bij opslaan van sjabloon" })
    }
  }

  const handleDelete = async (template: Template) => {
    if (template.isSystem) {
      alert("Systeem sjablonen kunnen niet worden verwijderd")
      return
    }

    if (confirm(`Weet u zeker dat u "${template.name}" wilt verwijderen?`)) {
      setTemplates((prev) => prev.filter((t) => t.id !== template.id))
    }
  }

  const insertVariable = (variable: string) => {
    const textarea = document.querySelector('textarea[name="content"]') as HTMLTextAreaElement
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newContent = formData.content.substring(0, start) + variable + formData.content.substring(end)
      setFormData((prev) => ({ ...prev, content: newContent }))

      // Reset cursor position
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(start + variable.length, start + variable.length)
      }, 0)
    }
  }

  const getCategoryStats = () => {
    return templateCategories.map((cat) => ({
      ...cat,
      count: templates.filter((t) => t.category === cat.value).length,
      active: templates.filter((t) => t.category === cat.value && t.active).length,
    }))
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Sjablonen Beheer</h1>
          <p className="text-gray-600 mt-1">Beheer alle berichten, e-mail en notificatie sjablonen</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nieuw Sjabloon
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {getCategoryStats().map((stat) => {
          const IconComponent = stat.icon
          return (
            <Card
              key={stat.value}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedCategory(selectedCategory === stat.value ? "all" : stat.value)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${stat.color} text-white`}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.count}</p>
                    <p className="text-xs text-gray-500">{stat.active} actief</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Search and Filter */}
      <div className="flex space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Zoek sjablonen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Alle categorieën" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle categorieën</SelectItem>
            {templateCategories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Templates Table */}
      <Card>
        <CardHeader>
          <CardTitle>Sjablonen ({filteredTemplates.length})</CardTitle>
          <CardDescription>Overzicht van alle beschikbare sjablonen</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Naam</TableHead>
                <TableHead>Categorie</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Prioriteit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Gebruik</TableHead>
                <TableHead>Laatst gewijzigd</TableHead>
                <TableHead>Acties</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTemplates.map((template) => {
                const category = templateCategories.find((c) => c.value === template.category)
                const IconComponent = category?.icon || FileText

                return (
                  <TableRow key={template.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <IconComponent className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="font-medium">{template.name}</p>
                          {template.description && <p className="text-xs text-gray-500">{template.description}</p>}
                        </div>
                        {template.isSystem && (
                          <Badge variant="secondary" className="text-xs">
                            Systeem
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{category?.label || template.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {templateTypes.find((t) => t.value === template.type)?.label || template.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          template.priority === "urgent"
                            ? "destructive"
                            : template.priority === "high"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {template.priority === "urgent"
                          ? "🚨 Urgent"
                          : template.priority === "high"
                            ? "⚠️ Hoog"
                            : template.priority === "normal"
                              ? "📋 Normaal"
                              : "📝 Laag"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={template.active ? "default" : "secondary"}>
                        {template.active ? "Actief" : "Inactief"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">{template.usageCount}x</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {new Date(template.updatedAt).toLocaleDateString("nl-NL")}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm" onClick={() => setPreviewTemplate(template)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(template)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDuplicate(template)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                        {!template.isSystem && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(template)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingTemplate ? "Sjabloon Bewerken" : "Nieuw Sjabloon"}</DialogTitle>
            <DialogDescription>
              {editingTemplate ? "Wijzig de sjabloon instellingen" : "Maak een nieuw sjabloon aan"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form */}
            <div className="lg:col-span-2 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Naam *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Sjabloon naam"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Beschrijving</label>
                  <Input
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Korte beschrijving"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Categorie</label>
                  <Select
                    value={formData.category}
                    onValueChange={(value: Template["category"]) =>
                      setFormData((prev) => ({ ...prev, category: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {templateCategories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Type</label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: Template["type"]) => setFormData((prev) => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {templateTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Prioriteit</label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value: Template["priority"]) =>
                      setFormData((prev) => ({ ...prev, priority: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">📝 Laag</SelectItem>
                      <SelectItem value="normal">📋 Normaal</SelectItem>
                      <SelectItem value="high">⚠️ Hoog</SelectItem>
                      <SelectItem value="urgent">🚨 Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {(formData.type === "email" || formData.category === "email") && (
                <div>
                  <label className="text-sm font-medium">Onderwerp</label>
                  <Input
                    value={formData.subject}
                    onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
                    placeholder="E-mail onderwerp"
                  />
                </div>
              )}

              <div>
                <label className="text-sm font-medium">Inhoud *</label>
                <Textarea
                  name="content"
                  value={formData.content}
                  onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                  placeholder="Sjabloon inhoud..."
                  rows={12}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Gebruik variabelen zoals {"{{name}}"}, {"{{location}}"}, etc. voor personalisatie
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) => setFormData((prev) => ({ ...prev, active: e.target.checked }))}
                  className="rounded"
                />
                <label htmlFor="active" className="text-sm font-medium">
                  Sjabloon actief
                </label>
              </div>

              {/* Variables detected */}
              {extractVariables(formData.content, formData.subject).length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">Gevonden variabelen:</h4>
                  <div className="flex flex-wrap gap-1">
                    {extractVariables(formData.content, formData.subject).map((variable) => (
                      <Badge key={variable} variant="secondary" className="text-xs">
                        {variable}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Save Result */}
              {saveResult && (
                <Alert className={saveResult.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                  {saveResult.success ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  )}
                  <AlertDescription className={saveResult.success ? "text-green-800" : "text-red-800"}>
                    {saveResult.message}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Variables Panel */}
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-3">Beschikbare Variabelen</h4>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {availableVariables.map((variable) => (
                    <div
                      key={variable.key}
                      className="flex items-start justify-between p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
                      onClick={() => insertVariable(variable.key)}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-mono text-blue-600">{variable.key}</p>
                        <p className="text-xs text-gray-600">{variable.description}</p>
                      </div>
                      <Plus className="h-3 w-3 text-gray-400 ml-2 flex-shrink-0" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <h4 className="text-sm font-medium text-yellow-900 mb-2">💡 Tips</h4>
                <ul className="text-xs text-yellow-800 space-y-1">
                  <li>• Klik op variabelen om ze in te voegen</li>
                  <li>• E-mail sjablonen ondersteunen HTML</li>
                  <li>• SMS berichten worden automatisch ingekort</li>
                  <li>• Handtekeningen worden automatisch toegevoegd</li>
                  <li>• Logo's worden automatisch ingevoegd in e-mails</li>
                </ul>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              <X className="h-4 w-4 mr-2" />
              Annuleren
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              {editingTemplate ? "Bijwerken" : "Aanmaken"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Sjabloon Voorbeeld: {previewTemplate?.name}</DialogTitle>
            <DialogDescription>Voorbeeld van hoe het sjabloon eruit ziet voor ontvangers</DialogDescription>
          </DialogHeader>

          {previewTemplate && (
            <div className="space-y-4">
              {previewTemplate.subject && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Onderwerp:</label>
                  <div className="bg-gray-50 p-3 rounded border font-medium">{previewTemplate.subject}</div>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-600">Inhoud:</label>
                <div className="bg-gray-50 p-4 rounded border">
                  <pre className="whitespace-pre-wrap text-sm font-sans">{previewTemplate.content}</pre>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="font-medium text-gray-600">Categorie:</label>
                  <p>{templateCategories.find((c) => c.value === previewTemplate.category)?.label}</p>
                </div>
                <div>
                  <label className="font-medium text-gray-600">Type:</label>
                  <p>{templateTypes.find((t) => t.value === previewTemplate.type)?.label}</p>
                </div>
                <div>
                  <label className="font-medium text-gray-600">Prioriteit:</label>
                  <p>{previewTemplate.priority}</p>
                </div>
                <div>
                  <label className="font-medium text-gray-600">Gebruikt:</label>
                  <p>{previewTemplate.usageCount} keer</p>
                </div>
              </div>

              {previewTemplate.variables.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Variabelen:</label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {previewTemplate.variables.map((variable) => (
                      <Badge key={variable} variant="secondary" className="text-xs">
                        {variable}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewTemplate(null)}>
              Sluiten
            </Button>
            {previewTemplate && (
              <Button
                onClick={() => {
                  setPreviewTemplate(null)
                  handleEdit(previewTemplate)
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Bewerken
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
