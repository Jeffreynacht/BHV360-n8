"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Video,
  FileText,
  Search,
  Play,
  Download,
  Shield,
  Users,
  Settings,
  QrCode,
  MapPin,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Lightbulb,
  CheckCircle,
} from "lucide-react"

const helpCategories = [
  {
    id: "getting-started",
    title: "Aan de slag",
    icon: Lightbulb,
    description: "Eerste stappen met BHV360",
    articles: [
      { title: "Welkom bij BHV360", duration: "5 min", type: "guide" },
      { title: "Klant selecteren", duration: "2 min", type: "guide" },
      { title: "Navigatie door het systeem", duration: "3 min", type: "guide" },
      { title: "Dashboard overzicht", duration: "4 min", type: "guide" },
    ],
  },
  {
    id: "plotkaart",
    title: "BHV Plotkaart",
    icon: Shield,
    description: "Alles over de BHV plotkaart functionaliteit",
    articles: [
      { title: "Plotkaart bekijken", duration: "3 min", type: "guide" },
      { title: "Symbolen en legenda", duration: "5 min", type: "guide" },
      { title: "Checklist gebruiken", duration: "4 min", type: "guide" },
      { title: "MiVa tracking", duration: "6 min", type: "guide" },
      { title: "NFC tags scannen", duration: "3 min", type: "video" },
      { title: "PDF exporteren", duration: "2 min", type: "guide" },
    ],
  },
  {
    id: "editor",
    title: "Plotkaart Editor",
    icon: MapPin,
    description: "Plotkaarten bewerken en aanpassen",
    articles: [
      { title: "Editor openen", duration: "2 min", type: "guide" },
      { title: "Symbolen plaatsen", duration: "5 min", type: "video" },
      { title: "Voorzieningen toevoegen", duration: "4 min", type: "guide" },
      { title: "Verdiepingen beheren", duration: "3 min", type: "guide" },
      { title: "Wijzigingen opslaan", duration: "2 min", type: "guide" },
    ],
  },
  {
    id: "nfc-tags",
    title: "NFC Tags",
    icon: QrCode,
    description: "NFC tags beheren en gebruiken",
    articles: [
      { title: "Wat zijn NFC tags?", duration: "3 min", type: "guide" },
      { title: "Tags toevoegen", duration: "4 min", type: "guide" },
      { title: "Tags koppelen aan voorzieningen", duration: "5 min", type: "video" },
      { title: "Tags scannen met telefoon", duration: "3 min", type: "video" },
      { title: "Overzicht en statistieken", duration: "4 min", type: "guide" },
    ],
  },
  {
    id: "users",
    title: "Gebruikersbeheer",
    icon: Users,
    description: "Gebruikers en rechten beheren",
    articles: [
      { title: "Gebruikers toevoegen", duration: "3 min", type: "guide" },
      { title: "Rollen en rechten", duration: "5 min", type: "guide" },
      { title: "BHV'ers beheren", duration: "4 min", type: "guide" },
      { title: "Aanwezigheid bijhouden", duration: "3 min", type: "guide" },
    ],
  },
  {
    id: "settings",
    title: "Instellingen",
    icon: Settings,
    description: "Systeem configureren en aanpassen",
    articles: [
      { title: "Algemene instellingen", duration: "4 min", type: "guide" },
      { title: "Huisstijl aanpassen", duration: "5 min", type: "guide" },
      { title: "E-mail configuratie", duration: "6 min", type: "guide" },
      { title: "Modules in/uitschakelen", duration: "3 min", type: "guide" },
      { title: "Backup en herstel", duration: "7 min", type: "guide" },
    ],
  },
]

const faqItems = [
  {
    question: "Hoe selecteer ik een andere klant?",
    answer:
      "Gebruik de klantenselector in de linker navigatiebalk. Klik op de dropdown en selecteer de gewenste klant. Alle data wordt automatisch gefilterd op de geselecteerde klant.",
  },
  {
    question: "Waarom kan ik geen NFC tags scannen?",
    answer:
      "NFC scanning werkt alleen op Android apparaten met Chrome browser. Op andere apparaten wordt een simulatiemodus gebruikt. Zorg ervoor dat NFC is ingeschakeld in je telefooninstellingen.",
  },
  {
    question: "Hoe exporteer ik een plotkaart naar PDF?",
    answer:
      "Ga naar de BHV Editor, open de gewenste plotkaart en klik op 'PDF Export' in de toolbar. De PDF wordt automatisch gedownload naar je Downloads folder.",
  },
  {
    question: "Kan ik meerdere verdiepingen tegelijk bekijken?",
    answer:
      "Nee, je kunt één verdieping per keer bekijken. Gebruik de verdiepingsknoppen om tussen verdiepingen te schakelen.",
  },
  {
    question: "Hoe voeg ik een nieuwe voorziening toe?",
    answer:
      "Ga naar Beheer > Voorzieningen, klik op 'Nieuwe voorziening' en vul de benodigde informatie in. Je kunt ook direct vanuit de editor voorzieningen toevoegen.",
  },
  {
    question: "Wat betekenen de verschillende kleuren van de symbolen?",
    answer:
      "Groen = OK/Actief, Rood = Probleem/Inactief, Oranje = Onderhoud nodig, Grijs = Niet gecontroleerd. Zie de legenda voor meer details.",
  },
  {
    question: "Hoe stel ik notificaties in?",
    answer:
      "Ga naar Instellingen > Notificaties om e-mail alerts, push notificaties en andere meldingen te configureren.",
  },
  {
    question: "Kan ik de huisstijl aanpassen?",
    answer:
      "Ja, ga naar Instellingen > Huisstijl om logo's, kleuren en andere visuele elementen aan te passen aan je organisatie.",
  },
]

const quickActions = [
  { title: "Nieuwe plotkaart maken", icon: MapPin, link: "/bhv/editor" },
  { title: "NFC tag toevoegen", icon: QrCode, link: "/beheer/nfc-tags" },
  { title: "Gebruiker toevoegen", icon: Users, link: "/beheer/gebruikers" },
  { title: "Instellingen wijzigen", icon: Settings, link: "/instellingen" },
]

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("getting-started")

  const filteredCategories = helpCategories.filter(
    (category) =>
      category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.articles.some((article) => article.title.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const filteredFAQ = faqItems.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Help & Ondersteuning</h1>
        <p className="text-muted-foreground">
          Vind antwoorden op je vragen en leer hoe je BHV360 optimaal kunt gebruiken
        </p>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Zoek in de handleiding..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
          <TabsTrigger value="getting-started">Aan de slag</TabsTrigger>
          <TabsTrigger value="plotkaart">Plotkaart</TabsTrigger>
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="nfc-tags">NFC Tags</TabsTrigger>
          <TabsTrigger value="users">Gebruikers</TabsTrigger>
          <TabsTrigger value="settings">Instellingen</TabsTrigger>
        </TabsList>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
              Snelle acties
            </CardTitle>
            <CardDescription>Veelgebruikte functies om snel mee aan de slag te gaan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                  asChild
                >
                  <a href={action.link}>
                    <action.icon className="h-6 w-6" />
                    <span className="text-sm text-center">{action.title}</span>
                  </a>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Help Categories */}
        {filteredCategories.map((category) => (
          <TabsContent key={category.id} value={category.id}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <category.icon className="h-6 w-6 text-blue-500" />
                      <CardTitle>{category.title}</CardTitle>
                    </div>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {category.articles.map((article, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                        >
                          <div className="flex items-center space-x-3">
                            {article.type === "video" ? (
                              <Video className="h-5 w-5 text-red-500" />
                            ) : (
                              <FileText className="h-5 w-5 text-blue-500" />
                            )}
                            <div>
                              <h4 className="font-medium">{article.title}</h4>
                              <p className="text-sm text-muted-foreground">{article.duration}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">{article.type === "video" ? "Video" : "Handleiding"}</Badge>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                {/* Tips & Tricks */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
                      Tips & Tricks
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <p className="text-sm">Gebruik Ctrl+S om snel op te slaan in de editor</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <p className="text-sm">Dubbelklik op symbolen voor snelle bewerking</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <p className="text-sm">Gebruik de zoekfunctie om snel items te vinden</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Support */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <HelpCircle className="h-5 w-5 mr-2 text-blue-500" />
                      Hulp nodig?
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      E-mail ondersteuning
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Video className="h-4 w-4 mr-2" />
                      Live chat
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Ticket aanmaken
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* FAQ Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <HelpCircle className="h-5 w-5 mr-2 text-blue-500" />
            Veelgestelde vragen
          </CardTitle>
          <CardDescription>Antwoorden op de meest gestelde vragen</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {filteredFAQ.map((item, index) => (
              <AccordionItem key={index} value={`faq-${index}`}>
                <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">{item.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Video Tutorials */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Video className="h-5 w-5 mr-2 text-red-500" />
            Video tutorials
          </CardTitle>
          <CardDescription>Stap-voor-stap video uitleg van alle functionaliteiten</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "BHV360 Introductie", duration: "5:30", thumbnail: "intro" },
              { title: "Plotkaart Editor", duration: "8:45", thumbnail: "editor" },
              { title: "NFC Tags Beheren", duration: "6:20", thumbnail: "nfc" },
              { title: "PDF Export", duration: "3:15", thumbnail: "pdf" },
              { title: "Gebruikersbeheer", duration: "7:10", thumbnail: "users" },
              { title: "Instellingen Configureren", duration: "9:30", thumbnail: "settings" },
            ].map((video, index) => (
              <div
                key={index}
                className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <Play className="h-12 w-12 text-muted-foreground" />
                </div>
                <div className="p-4">
                  <h4 className="font-medium mb-1">{video.title}</h4>
                  <p className="text-sm text-muted-foreground">{video.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Downloads */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Download className="h-5 w-5 mr-2 text-green-500" />
            Downloads
          </CardTitle>
          <CardDescription>Handige documenten en sjablonen</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: "Volledige gebruikershandleiding", type: "PDF", size: "2.3 MB" },
              { title: "Snelstart gids", type: "PDF", size: "850 KB" },
              { title: "NFC Tags sjabloon", type: "Excel", size: "45 KB" },
              { title: "Plotkaart symbolen overzicht", type: "PDF", size: "1.2 MB" },
            ].map((download, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <div>
                    <h4 className="font-medium">{download.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {download.type} • {download.size}
                    </p>
                  </div>
                </div>
                <Download className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
