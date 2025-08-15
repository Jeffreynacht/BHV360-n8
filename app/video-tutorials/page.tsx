"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Play,
  Search,
  Clock,
  Users,
  Star,
  BookOpen,
  Shield,
  AlertTriangle,
  Settings,
  FileText,
  Smartphone,
  CheckCircle,
  Download,
  Share2,
  Volume2,
  Pause,
  SkipBack,
  SkipForward,
} from "lucide-react"

interface VideoChapter {
  time: string
  title: string
  description: string
}

interface VideoTutorial {
  id: string
  title: string
  description: string
  duration: string
  category: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  thumbnail: string
  videoUrl: string
  views: number
  rating: number
  transcript: string
  chapters: VideoChapter[]
  learningObjectives: string[]
  prerequisites: string[]
  relatedVideos: string[]
}

const VideoPlayer = ({ video, onClose }: { video: VideoTutorial; onClose: () => void }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [showTranscript, setShowTranscript] = useState(false)
  const [showChapters, setShowChapters] = useState(true)

  const togglePlay = () => setIsPlaying(!isPlaying)

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-7xl w-full max-h-[95vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="text-xl font-bold">{video.title}</h2>
            <p className="text-sm text-muted-foreground">{video.description}</p>
          </div>
          <Button variant="ghost" onClick={onClose} className="text-2xl">
            ×
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6 max-h-[calc(95vh-80px)] overflow-auto">
          <div className="lg:col-span-3 space-y-4">
            {/* Video Player */}
            <div className="aspect-video bg-gradient-to-br from-blue-900 to-blue-600 rounded-lg relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="mb-4">
                    <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      {isPlaying ? <Pause className="h-12 w-12" /> : <Play className="h-12 w-12" />}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{video.title}</h3>
                    <p className="text-blue-100 mb-4">Duur: {video.duration}</p>
                  </div>

                  <div className="space-y-4">
                    <p className="text-sm text-blue-100 max-w-md mx-auto">
                      Dit is een demo video player. In de productie versie zou hier de echte video worden afgespeeld.
                    </p>

                    {/* Simulated Video Controls */}
                    <div className="bg-black/30 rounded-lg p-4 max-w-md mx-auto">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">0:00</span>
                        <span className="text-sm">{video.duration}</span>
                      </div>
                      <Progress value={25} className="mb-3" />
                      <div className="flex items-center justify-center space-x-4">
                        <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                          <SkipBack className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-white hover:bg-white/20" onClick={togglePlay}>
                          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                        </Button>
                        <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                          <SkipForward className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                          <Volume2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => setShowTranscript(!showTranscript)}>
                  <BookOpen className="h-4 w-4 mr-1" />
                  {showTranscript ? "Verberg" : "Toon"} Transcript
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-1" />
                  Delen
                </Button>
              </div>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {video.views.toLocaleString()} weergaven
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                  {video.rating}
                </div>
              </div>
            </div>

            {/* Transcript */}
            {showTranscript && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Video Transcript</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap text-sm text-muted-foreground font-sans">
                      {video.transcript}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Video Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Video Informatie</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Duur:</span>
                  <Badge variant="outline">{video.duration}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Niveau:</span>
                  <Badge variant="outline">{video.difficulty}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Categorie:</span>
                  <Badge variant="outline">{video.category}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Weergaven:</span>
                  <span className="text-sm">{video.views.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            {/* Learning Objectives */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Leerdoelen</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {video.learningObjectives.map((objective, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Chapters */}
            {showChapters && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Hoofdstukken</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {video.chapters.map((chapter, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-3 p-2 rounded hover:bg-muted cursor-pointer transition-colors"
                      >
                        <Play className="h-3 w-3 text-muted-foreground mt-1 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium truncate">{chapter.title}</span>
                            <span className="text-xs text-muted-foreground ml-2">{chapter.time}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{chapter.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Prerequisites */}
            {video.prerequisites.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Vereisten</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {video.prerequisites.map((prereq, index) => (
                      <li key={index} className="text-sm text-muted-foreground">
                        • {prereq}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function VideoTutorialsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedVideo, setSelectedVideo] = useState<VideoTutorial | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("alle")
  const [completedVideos, setCompletedVideos] = useState<string[]>([])

  const videoTutorials: VideoTutorial[] = [
    {
      id: "intro-bhv360",
      title: "Welkom bij BHV360 - Complete Introductie",
      description:
        "Een uitgebreide rondleiding door het BHV360 platform. Leer alle basisfuncties kennen en ontdek hoe je het systeem optimaal kunt gebruiken voor je organisatie.",
      duration: "15:42",
      category: "Introductie",
      difficulty: "Beginner",
      thumbnail: "/placeholder.svg?height=200&width=350&text=BHV360+Introductie",
      videoUrl: "https://example.com/videos/intro-bhv360",
      views: 2847,
      rating: 4.9,
      transcript: `0:00 - Welkom bij BHV360
Hallo en welkom bij deze uitgebreide introductie van BHV360. Mijn naam is Sarah en ik ga je vandaag door alle belangrijke functies van het platform leiden.

0:30 - Wat is BHV360?
BHV360 is een complete software oplossing voor bedrijfshulpverlening en veiligheidsbeheer. Het platform helpt organisaties bij het beheren van evacuatieplannen, het trainen van BHV'ers, en het naleven van veiligheidswetgeving.

1:15 - Dashboard Overzicht
Laten we beginnen met het dashboard. Hier zie je direct de belangrijkste informatie: aantal actieve BHV'ers, recente incidenten, en de status van je veiligheidsvoorzieningen.

2:00 - Navigatie door het Systeem
De navigatie is intuïtief opgezet. In de linker sidebar vind je alle hoofdfuncties: Dashboard, Plotkaart, Incidenten, Gebruikers, en Instellingen.

3:30 - Klanten Selecteren
Als je meerdere locaties beheert, kun je eenvoudig wisselen tussen verschillende klanten via de dropdown in de header.

4:15 - BHV Plotkaart - Het Hart van het Systeem
De plotkaart is waar de magie gebeurt. Hier zie je een visuele weergave van je gebouw met alle veiligheidsvoorzieningen, evacuatieroutes, en BHV'er posities.

6:00 - Voorzieningen Beheren
Klik op een voorziening om details te bekijken, onderhoud te plannen, of de status bij te werken. Alles wordt automatisch gelogd voor compliance doeleinden.

7:30 - Incidenten Registreren
Het incident management systeem helpt je bij het registreren, opvolgen, en analyseren van veiligheidsincidenten.

9:00 - Gebruikersbeheer
Voeg nieuwe BHV'ers toe, wijs rollen toe, en beheer toegangsrechten. Het systeem ondersteunt verschillende gebruikersrollen van medewerker tot super admin.

10:30 - Rapportages en Compliance
Genereer automatisch rapporten voor de Arbeidsinspectie, verzekeraars, of interne doeleinden. Alle data wordt veilig opgeslagen en is altijd toegankelijk.

12:00 - Mobiele App
De BHV360 mobiele app stelt je in staat om onderweg incidenten te melden, voorzieningen te controleren, en evacuatieprocedures te raadplegen.

13:30 - Instellingen en Configuratie
Pas het systeem aan naar je specifieke behoeften. Stel meldingen in, configureer workflows, en personaliseer de interface.

14:45 - Volgende Stappen
Nu je de basis kent, raden we aan om de specifieke tutorials te bekijken voor de functies die je het meest gaat gebruiken.

15:30 - Bedankt voor het Kijken
Bedankt voor het bekijken van deze introductie. Veel succes met BHV360!`,
      chapters: [
        { time: "0:00", title: "Welkom", description: "Introductie en overzicht van de tutorial" },
        { time: "0:30", title: "Wat is BHV360?", description: "Uitleg over het platform en zijn doelstellingen" },
        { time: "1:15", title: "Dashboard", description: "Overzicht van het hoofddashboard" },
        { time: "2:00", title: "Navigatie", description: "Hoe je door het systeem navigeert" },
        { time: "3:30", title: "Klanten", description: "Wisselen tussen verschillende locaties" },
        { time: "4:15", title: "Plotkaart", description: "Het hart van het BHV360 systeem" },
        { time: "6:00", title: "Voorzieningen", description: "Beheren van veiligheidsvoorzieningen" },
        { time: "7:30", title: "Incidenten", description: "Registreren en opvolgen van incidenten" },
        { time: "9:00", title: "Gebruikers", description: "Beheren van BHV'ers en toegangsrechten" },
        { time: "10:30", title: "Rapportages", description: "Compliance en rapportage functies" },
        { time: "12:00", title: "Mobiele App", description: "BHV360 onderweg gebruiken" },
        { time: "13:30", title: "Instellingen", description: "Systeem configuratie en personalisatie" },
        { time: "14:45", title: "Volgende Stappen", description: "Aanbevelingen voor verdere tutorials" },
      ],
      learningObjectives: [
        "Begrijpen wat BHV360 is en waarvoor het gebruikt wordt",
        "Navigeren door de hoofdfuncties van het platform",
        "Het dashboard interpreteren en gebruiken",
        "Basis plotkaart functionaliteit begrijpen",
        "Weten hoe je incidenten registreert",
        "Overzicht hebben van alle beschikbare modules",
      ],
      prerequisites: [],
      relatedVideos: ["plotkaart-basis", "incident-management", "gebruikers-beheer"],
    },
    {
      id: "plotkaart-basis",
      title: "BHV Plotkaart - Basis Gebruik",
      description:
        "Leer hoe je de BHV plotkaart gebruikt voor dagelijkse taken. Van het bekijken van voorzieningen tot het uitvoeren van controles en het bijwerken van statussen.",
      duration: "12:28",
      category: "Plotkaart",
      difficulty: "Beginner",
      thumbnail: "/placeholder.svg?height=200&width=350&text=Plotkaart+Basis",
      videoUrl: "https://example.com/videos/plotkaart-basis",
      views: 1923,
      rating: 4.8,
      transcript: `0:00 - Introductie Plotkaart
Welkom bij deze tutorial over het basis gebruik van de BHV plotkaart. De plotkaart is het centrale onderdeel van BHV360 waar je alle veiligheidsvoorzieningen van je gebouw kunt bekijken en beheren.

0:45 - Plotkaart Openen
Om de plotkaart te openen, klik je op 'Plotkaart' in het hoofdmenu. Je ziet nu een visuele weergave van je gebouw met alle geregistreerde voorzieningen.

1:30 - Verdiepingen Navigeren
Als je gebouw meerdere verdiepingen heeft, kun je wisselen tussen verdiepingen met de knoppen aan de linkerkant. Elke verdieping toont zijn eigen voorzieningen en evacuatieroutes.

2:15 - Symbolen Begrijpen
Elk symbool op de plotkaart heeft een betekenis. Rode kruizen zijn EHBO-posten, blauwe vierkanten zijn brandblussers, groene pijlen zijn evacuatieroutes, enzovoort.

3:00 - Voorziening Details Bekijken
Klik op een voorziening om gedetailleerde informatie te zien: type, locatie, laatste controle, onderhoudsstatus, en eventuele opmerkingen.

4:30 - Status Bijwerken
Je kunt de status van voorzieningen direct bijwerken. Klik op 'Status Wijzigen' en selecteer de nieuwe status: OK, Defect, Onderhoud Nodig, of Vervangen.

5:45 - Controles Uitvoeren
Voor periodieke controles kun je de checklist functie gebruiken. Klik op 'Controle Starten' en doorloop alle controlepunten systematisch.

7:00 - Opmerkingen Toevoegen
Bij elke controle kun je opmerkingen toevoegen. Dit is handig voor het documenteren van kleine gebreken of bijzonderheden die aandacht behoeven.

8:30 - Foto's Toevoegen
Je kunt foto's toevoegen aan voorzieningen, bijvoorbeeld van schade of na onderhoud. Dit helpt bij het bijhouden van de geschiedenis van elke voorziening.

9:45 - Zoeken en Filteren
Gebruik de zoekfunctie om snel specifieke voorzieningen te vinden. Je kunt ook filteren op type, status, of laatste controledatum.

10:30 - Legenda Gebruiken
De legenda rechts op het scherm toont alle symbolen en hun betekenis. Je kunt symbolen aan- en uitzetten om de plotkaart overzichtelijker te maken.

11:15 - Tips voor Efficiënt Gebruik
Enkele tips: gebruik sneltoetsen, werk systematisch per verdieping, en update statussen direct na controles voor de meest actuele informatie.

12:00 - Samenvatting
Je hebt nu geleerd hoe je de plotkaart gebruikt voor dagelijkse BHV taken. In de volgende tutorial gaan we dieper in op geavanceerde functies.`,
      chapters: [
        { time: "0:00", title: "Introductie", description: "Overzicht van de plotkaart functionaliteit" },
        { time: "0:45", title: "Plotkaart Openen", description: "Navigeren naar de plotkaart" },
        { time: "1:30", title: "Verdiepingen", description: "Wisselen tussen verschillende verdiepingen" },
        { time: "2:15", title: "Symbolen", description: "Betekenis van verschillende symbolen" },
        { time: "3:00", title: "Details Bekijken", description: "Gedetailleerde informatie van voorzieningen" },
        { time: "4:30", title: "Status Bijwerken", description: "Wijzigen van voorziening statussen" },
        { time: "5:45", title: "Controles", description: "Uitvoeren van periodieke controles" },
        { time: "7:00", title: "Opmerkingen", description: "Toevoegen van notities en opmerkingen" },
        { time: "8:30", title: "Foto's", description: "Foto's toevoegen aan voorzieningen" },
        { time: "9:45", title: "Zoeken", description: "Zoeken en filteren van voorzieningen" },
        { time: "10:30", title: "Legenda", description: "Gebruik van de symbolen legenda" },
        { time: "11:15", title: "Tips", description: "Efficiënt werken met de plotkaart" },
      ],
      learningObjectives: [
        "De plotkaart interface begrijpen en navigeren",
        "Verschillende symbolen en hun betekenis kennen",
        "Voorziening details bekijken en interpreteren",
        "Statussen van voorzieningen bijwerken",
        "Controles uitvoeren met de checklist functie",
        "Opmerkingen en foto's toevoegen aan voorzieningen",
        "Efficiënt zoeken en filteren van voorzieningen",
      ],
      prerequisites: ["Basis kennis van BHV360 platform"],
      relatedVideos: ["intro-bhv360", "plotkaart-editor", "controles-uitvoeren"],
    },
    {
      id: "plotkaart-editor",
      title: "Plotkaart Editor - Symbolen Plaatsen en Bewerken",
      description:
        "Leer hoe je de plotkaart editor gebruikt om nieuwe voorzieningen toe te voegen, symbolen te verplaatsen, en evacuatieroutes aan te passen. Perfect voor facility managers en BHV coördinatoren.",
      duration: "18:35",
      category: "Editor",
      difficulty: "Intermediate",
      thumbnail: "/placeholder.svg?height=200&width=350&text=Plotkaart+Editor",
      videoUrl: "https://example.com/videos/plotkaart-editor",
      views: 1456,
      rating: 4.7,
      transcript: `0:00 - Introductie Editor
Welkom bij de tutorial over de plotkaart editor. In deze video leer je hoe je plotkaarten kunt bewerken, symbolen kunt plaatsen, en evacuatieroutes kunt aanpassen.

1:00 - Editor Openen
Om de editor te openen, ga je naar de plotkaart en klik je op 'Bewerken' rechtsboven. Je ziet nu extra tools en opties voor het bewerken van de plotkaart.

2:00 - Interface Overzicht
De editor interface bestaat uit de werkbalk links met alle beschikbare symbolen, de plotkaart in het midden, en het eigenschappen paneel rechts.

3:15 - Symbolen Bibliotheek
In de linker werkbalk vind je alle beschikbare symbolen georganiseerd per categorie: EHBO, Brand, Evacuatie, Algemeen, en Custom symbolen.

4:30 - Symbool Plaatsen
Om een symbool te plaatsen, selecteer je het in de werkbalk en klik je op de gewenste locatie op de plotkaart. Het symbool wordt automatisch geplaatst.

5:45 - Symbool Verplaatsen
Bestaande symbolen kun je verplaatsen door ze te selecteren en te slepen naar een nieuwe positie. De positie wordt automatisch opgeslagen.

7:00 - Symbool Eigenschappen
Klik op een symbool om het eigenschappen paneel te openen. Hier kun je de naam, beschrijving, en specifieke instellingen aanpassen.

8:30 - Evacuatieroutes Tekenen
Voor evacuatieroutes gebruik je de lijn tool. Klik op het startpunt en sleep naar het eindpunt. Je kunt meerdere punten toevoegen voor complexe routes.

10:00 - Tekst Toevoegen
Je kunt tekst labels toevoegen voor ruimte namen, instructies, of andere belangrijke informatie. Gebruik de tekst tool en klik waar je de tekst wilt plaatsen.

11:30 - Lagen Beheren
De editor werkt met lagen. Je kunt verschillende lagen aan- en uitzetten, bijvoorbeeld om alleen brandvoorzieningen of alleen EHBO voorzieningen te tonen.

13:00 - Groeperen en Uitlijnen
Selecteer meerdere symbolen om ze te groeperen, uit te lijnen, of gelijkmatig te verdelen. Dit helpt bij het maken van nette, professionele plotkaarten.

14:30 - Opslaan en Publiceren
Vergeet niet regelmatig op te slaan tijdens het bewerken. Als je klaar bent, klik je op 'Publiceren' om de wijzigingen beschikbaar te maken voor alle gebruikers.

16:00 - Versie Beheer
De editor houdt automatisch versies bij. Je kunt altijd teruggaan naar een eerdere versie als dat nodig is.

17:15 - Best Practices
Enkele tips voor het maken van goede plotkaarten: houd het overzichtelijk, gebruik consistente symbolen, en test de leesbaarheid op verschillende schermformaten.

18:00 - Samenvatting
Je hebt nu geleerd hoe je de plotkaart editor gebruikt. Oefen met deze functies om vertrouwd te raken met alle mogelijkheden.`,
      chapters: [
        { time: "0:00", title: "Introductie", description: "Overzicht van de editor functionaliteit" },
        { time: "1:00", title: "Editor Openen", description: "Toegang krijgen tot de bewerkingsmodus" },
        { time: "2:00", title: "Interface", description: "Overzicht van de editor interface" },
        { time: "3:15", title: "Symbolen Bibliotheek", description: "Beschikbare symbolen en categorieën" },
        { time: "4:30", title: "Plaatsen", description: "Nieuwe symbolen plaatsen" },
        { time: "5:45", title: "Verplaatsen", description: "Bestaande symbolen verplaatsen" },
        { time: "7:00", title: "Eigenschappen", description: "Symbool eigenschappen aanpassen" },
        { time: "8:30", title: "Evacuatieroutes", description: "Routes tekenen en bewerken" },
        { time: "10:00", title: "Tekst", description: "Tekst labels toevoegen" },
        { time: "11:30", title: "Lagen", description: "Werken met verschillende lagen" },
        { time: "13:00", title: "Uitlijnen", description: "Symbolen groeperen en uitlijnen" },
        { time: "14:30", title: "Opslaan", description: "Wijzigingen opslaan en publiceren" },
        { time: "16:00", title: "Versies", description: "Versie beheer en geschiedenis" },
        { time: "17:15", title: "Best Practices", description: "Tips voor professionele plotkaarten" },
      ],
      learningObjectives: [
        "De plotkaart editor interface beheersen",
        "Symbolen plaatsen, verplaatsen en bewerken",
        "Evacuatieroutes tekenen en aanpassen",
        "Tekst en labels toevoegen aan plotkaarten",
        "Werken met lagen voor overzichtelijke plotkaarten",
        "Symbolen groeperen en professioneel uitlijnen",
        "Wijzigingen opslaan en publiceren",
        "Versie beheer gebruiken voor backup en herstel",
      ],
      prerequisites: ["Basis plotkaart kennis", "Ervaring met BHV360 interface"],
      relatedVideos: ["plotkaart-basis", "symbolen-beheer", "pdf-export"],
    },
    {
      id: "incident-management",
      title: "Incident Management - Van Melding tot Rapportage",
      description:
        "Een complete gids voor het beheren van veiligheidsincidenten in BHV360. Leer hoe je incidenten registreert, opvolgt, analyseert en rapporteert voor compliance doeleinden.",
      duration: "16:22",
      category: "Incidenten",
      difficulty: "Intermediate",
      thumbnail: "/placeholder.svg?height=200&width=350&text=Incident+Management",
      videoUrl: "https://example.com/videos/incident-management",
      views: 1678,
      rating: 4.8,
      transcript: `0:00 - Introductie Incident Management
Welkom bij deze uitgebreide tutorial over incident management in BHV360. We behandelen het complete proces van melding tot rapportage.

1:00 - Wat is een Incident?
Een incident is elke gebeurtenis die de veiligheid, gezondheid of het welzijn van personen in gevaar brengt of heeft gebracht. Dit kunnen ongevallen, bijna-ongevallen, of gevaarlijke situaties zijn.

2:30 - Incident Registreren
Om een nieuw incident te registreren, ga je naar het Incidenten menu en klik je op 'Nieuw Incident'. Vul alle relevante informatie in: datum, tijd, locatie, betrokkenen, en beschrijving.

4:00 - Incident Categorieën
BHV360 gebruikt verschillende categorieën: Ongeval, Bijna-ongeval, Brand, Evacuatie, EHBO, en Eigendomsschade. Kies de juiste categorie voor accurate rapportage.

5:30 - Betrokkenen Toevoegen
Voeg alle betrokkenen toe aan het incident: slachtoffers, getuigen, BHV'ers, en leidinggevenden. Dit is belangrijk voor opvolging en communicatie.

7:00 - Foto's en Documenten
Voeg foto's van de situatie toe, evenals relevante documenten zoals medische rapporten of politierapporten. Dit ondersteunt de documentatie.

8:30 - Eerste Acties Registreren
Documenteer welke eerste acties zijn ondernomen: EHBO verlening, evacuatie, hulpdiensten gebeld, etc. Dit toont de respons van de organisatie.

10:00 - Incident Opvolging
Na registratie begint de opvolging. Wijs het incident toe aan een verantwoordelijke persoon en stel een deadline in voor afhandeling.

11:30 - Onderzoek Uitvoeren
Voor ernstige incidenten is een onderzoek nodig. Documenteer de oorzaken, contributerende factoren, en aanbevelingen voor preventie.

13:00 - Correctieve Maatregelen
Bepaal welke maatregelen nodig zijn om herhaling te voorkomen. Wijs verantwoordelijken toe en stel deadlines in voor implementatie.

14:30 - Incident Afsluiten
Een incident kan worden afgesloten als alle acties zijn voltooid en alle betrokkenen akkoord zijn met de afhandeling.

15:30 - Rapportage en Analyse
Gebruik de rapportage functie om trends te identificeren, hotspots te vinden, en de effectiviteit van preventieve maatregelen te meten.

16:00 - Compliance en Meldplicht
Sommige incidenten moeten gemeld worden aan de Arbeidsinspectie. BHV360 helpt bij het identificeren van meldplichtige incidenten.`,
      chapters: [
        { time: "0:00", title: "Introductie", description: "Overzicht van incident management proces" },
        { time: "1:00", title: "Definitie", description: "Wat is een veiligheidsincident?" },
        { time: "2:30", title: "Registreren", description: "Nieuw incident aanmaken" },
        { time: "4:00", title: "Categorieën", description: "Verschillende incident types" },
        { time: "5:30", title: "Betrokkenen", description: "Personen toevoegen aan incident" },
        { time: "7:00", title: "Documentatie", description: "Foto's en documenten toevoegen" },
        { time: "8:30", title: "Eerste Acties", description: "Directe respons documenteren" },
        { time: "10:00", title: "Opvolging", description: "Incident toewijzen en opvolgen" },
        { time: "11:30", title: "Onderzoek", description: "Oorzaken analyseren" },
        { time: "13:00", title: "Maatregelen", description: "Preventieve acties bepalen" },
        { time: "14:30", title: "Afsluiten", description: "Incident definitief afsluiten" },
        { time: "15:30", title: "Rapportage", description: "Trends en analyses" },
      ],
      learningObjectives: [
        "Verschillende soorten incidenten herkennen",
        "Incidenten correct registreren in het systeem",
        "Betrokkenen en documentatie toevoegen",
        "Opvolgingsproces beheren en monitoren",
        "Onderzoek uitvoeren naar oorzaken",
        "Correctieve maatregelen implementeren",
        "Rapportages genereren voor management",
        "Compliance eisen begrijpen en naleven",
      ],
      prerequisites: ["Basis BHV360 kennis", "BHV certificering aanbevolen"],
      relatedVideos: ["intro-bhv360", "rapportages", "compliance"],
    },
    {
      id: "gebruikers-beheer",
      title: "Gebruikers en Rollen Beheren",
      description:
        "Leer hoe je gebruikers toevoegt, rollen toewijst, en toegangsrechten beheert in BHV360. Essentieel voor administrators en BHV coördinatoren.",
      duration: "14:18",
      category: "Beheer",
      difficulty: "Advanced",
      thumbnail: "/placeholder.svg?height=200&width=350&text=Gebruikers+Beheer",
      videoUrl: "https://example.com/videos/gebruikers-beheer",
      views: 987,
      rating: 4.6,
      transcript: `0:00 - Introductie Gebruikersbeheer
In deze tutorial leren we hoe je gebruikers beheert in BHV360. We behandelen het toevoegen van gebruikers, toewijzen van rollen, en beheren van toegangsrechten.

1:00 - Gebruikersrollen Overzicht
BHV360 heeft verschillende rollen: Super Admin, Customer Admin, BHV Coördinator, BHV'er, en Medewerker. Elke rol heeft specifieke rechten en toegang.

2:30 - Nieuwe Gebruiker Toevoegen
Ga naar Gebruikers > Nieuwe Gebruiker. Vul de basisgegevens in: naam, email, telefoon, en functie. Kies de juiste rol voor de gebruiker.

4:00 - Rol Toewijzen
Bij het toewijzen van een rol, let op de rechten die daarbij horen. Een BHV'er kan bijvoorbeeld incidenten registreren maar geen gebruikers beheren.

5:30 - BHV Certificering
Voor BHV'ers kun je certificeringsinformatie toevoegen: certificaatnummer, uitgiftedatum, vervaldatum, en certificerende instantie.

7:00 - Toegangsrechten per Module
Naast de hoofdrol kun je specifieke rechten per module instellen. Bijvoorbeeld: alleen lezen, bewerken, of volledig beheer van bepaalde functies.

8:30 - Groepen en Teams
Organiseer gebruikers in groepen of teams voor eenvoudiger beheer. Dit is handig bij grote organisaties met meerdere afdelingen.

10:00 - Gebruiker Deactiveren
In plaats van gebruikers te verwijderen, kun je ze deactiveren. Dit behoudt de historische data maar blokkeert toegang tot het systeem.

11:30 - Wachtwoord Beleid
Stel een sterk wachtwoord beleid in: minimale lengte, complexiteit eisen, en verplichte wijziging na bepaalde tijd.

12:30 - Audit Trail
Alle gebruikersacties worden gelogd in de audit trail. Dit is belangrijk voor compliance en het traceren van wijzigingen.

13:30 - Best Practices
Enkele tips: gebruik het principe van minimale rechten, controleer regelmatig gebruikerslijsten, en zorg voor goede documentatie van roltoewijzingen.

14:00 - Samenvatting
Effectief gebruikersbeheer is cruciaal voor de veiligheid en functionaliteit van BHV360. Volg de best practices voor optimale resultaten.`,
      chapters: [
        { time: "0:00", title: "Introductie", description: "Overzicht van gebruikersbeheer" },
        { time: "1:00", title: "Rollen", description: "Verschillende gebruikersrollen" },
        { time: "2:30", title: "Toevoegen", description: "Nieuwe gebruikers aanmaken" },
        { time: "4:00", title: "Rol Toewijzen", description: "Juiste rol selecteren" },
        { time: "5:30", title: "BHV Certificering", description: "Certificaat informatie beheren" },
        { time: "7:00", title: "Toegangsrechten", description: "Specifieke module rechten" },
        { time: "8:30", title: "Groepen", description: "Gebruikers organiseren in teams" },
        { time: "10:00", title: "Deactiveren", description: "Gebruikers uitschakelen" },
        { time: "11:30", title: "Wachtwoorden", description: "Beveiligingsbeleid instellen" },
        { time: "12:30", title: "Audit Trail", description: "Gebruikersacties traceren" },
        { time: "13:30", title: "Best Practices", description: "Tips voor effectief beheer" },
      ],
      learningObjectives: [
        "Verschillende gebruikersrollen begrijpen",
        "Nieuwe gebruikers correct toevoegen",
        "Rollen en rechten toewijzen",
        "BHV certificering beheren",
        "Toegangsrechten per module instellen",
        "Gebruikers organiseren in groepen",
        "Beveiligingsbeleid implementeren",
        "Audit trail gebruiken voor compliance",
      ],
      prerequisites: ["Administrator rechten", "Ervaring met BHV360"],
      relatedVideos: ["intro-bhv360", "compliance", "rapportages"],
    },
    {
      id: "rapportages",
      title: "Rapportages Genereren en Exporteren",
      description:
        "Ontdek hoe je verschillende rapportages genereert in BHV360 voor management, compliance, en analyse doeleinden. Van incident rapporten tot compliance overzichten.",
      duration: "13:45",
      category: "Rapportages",
      difficulty: "Intermediate",
      thumbnail: "/placeholder.svg?height=200&width=350&text=Rapportages",
      videoUrl: "https://example.com/videos/rapportages",
      views: 1234,
      rating: 4.7,
      transcript: `0:00 - Introductie Rapportages
Welkom bij deze tutorial over rapportages in BHV360. We leren hoe je verschillende rapporten genereert, aanpast, en exporteert.

1:00 - Rapportage Types
BHV360 biedt verschillende rapportage types: Incident rapporten, Compliance overzichten, Voorzieningen status, BHV'er overzichten, en Custom rapporten.

2:30 - Incident Rapportage
Voor incident rapportages ga je naar Rapportages > Incidenten. Selecteer de periode, locatie, en incident types die je wilt includeren.

4:00 - Filters Instellen
Gebruik filters om specifieke data te selecteren: datum bereik, locatie, incident categorie, ernst niveau, en status. Dit verfijnt je rapport.

5:30 - Compliance Rapport
Het compliance rapport toont de status van alle verplichte controles, certificeringen, en onderhoud. Ideaal voor audits en inspections.

7:00 - Voorzieningen Status
Dit rapport geeft een overzicht van alle veiligheidsvoorzieningen: locatie, type, laatste controle, status, en vervaldatums van certificaten.

8:30 - Export Opties
Rapporten kunnen geëxporteerd worden naar PDF, Excel, of CSV formaat. PDF is ideaal voor presentaties, Excel voor verdere analyse.

10:00 - Automatische Rapporten
Stel automatische rapporten in die periodiek gegenereerd en verstuurd worden. Handig voor maandelijkse management rapportages.

11:30 - Custom Rapporten
Voor specifieke behoeften kun je custom rapporten maken. Selecteer de gewenste data velden en stel de layout naar wens in.

12:30 - Rapport Delen
Rapporten kunnen direct gedeeld worden via email of opgeslagen in een gedeelde map voor toegang door meerdere gebruikers.

13:15 - Tips voor Effectieve Rapportage
Enkele tips: gebruik duidelijke titels, voeg context toe met grafieken, en zorg voor consistente rapportage periodes voor trend analyse.`,
      chapters: [
        { time: "0:00", title: "Introductie", description: "Overzicht van rapportage mogelijkheden" },
        { time: "1:00", title: "Types", description: "Verschillende rapportage categorieën" },
        { time: "2:30", title: "Incident Rapporten", description: "Incident data analyseren" },
        { time: "4:00", title: "Filters", description: "Data selectie verfijnen" },
        { time: "5:30", title: "Compliance", description: "Compliance status rapporteren" },
        { time: "7:00", title: "Voorzieningen", description: "Status van veiligheidsvoorzieningen" },
        { time: "8:30", title: "Export", description: "Rapporten exporteren naar verschillende formaten" },
        { time: "10:00", title: "Automatisch", description: "Periodieke rapporten instellen" },
        { time: "11:30", title: "Custom", description: "Aangepaste rapporten maken" },
        { time: "12:30", title: "Delen", description: "Rapporten delen met stakeholders" },
      ],
      learningObjectives: [
        "Verschillende rapportage types begrijpen",
        "Filters effectief gebruiken voor data selectie",
        "Incident rapporten genereren en interpreteren",
        "Compliance overzichten maken voor audits",
        "Rapporten exporteren naar verschillende formaten",
        "Automatische rapportage instellen",
        "Custom rapporten maken voor specifieke behoeften",
        "Rapporten professioneel delen met stakeholders",
      ],
      prerequisites: ["Basis BHV360 kennis", "Data analyse ervaring aanbevolen"],
      relatedVideos: ["incident-management", "compliance", "dashboard-gebruik"],
    },
    {
      id: "mobiele-app",
      title: "BHV360 Mobiele App - Onderweg Veiligheid Beheren",
      description:
        "Leer hoe je de BHV360 mobiele app gebruikt voor incident meldingen, voorziening controles, en evacuatie procedures. Perfect voor BHV'ers die veel onderweg zijn.",
      duration: "11:52",
      category: "Mobiel",
      difficulty: "Beginner",
      thumbnail: "/placeholder.svg?height=200&width=350&text=Mobiele+App",
      videoUrl: "https://example.com/videos/mobiele-app",
      views: 1567,
      rating: 4.5,
      transcript: `0:00 - Introductie Mobiele App
Welkom bij de tutorial over de BHV360 mobiele app. Deze app stelt je in staat om onderweg incidenten te melden, controles uit te voeren, en evacuatie procedures te raadplegen.

1:00 - App Installeren
Download de BHV360 app uit de App Store of Google Play Store. Log in met dezelfde gegevens als je web account.

2:00 - Dashboard Overzicht
Het mobiele dashboard toont de belangrijkste informatie: openstaande taken, recente incidenten, en snelkoppelingen naar veelgebruikte functies.

3:00 - Incident Melden
Om een incident te melden, tik op 'Nieuw Incident'. Vul de details in, voeg foto's toe, en verstuur direct. De melding wordt real-time gesynchroniseerd.

4:30 - Foto's en Locatie
De app gebruikt automatisch je locatie en stelt je in staat om direct foto's te maken. Dit versnelt het meldingsproces aanzienlijk.

5:30 - Voorziening Controles
Voor controles onderweg, scan de QR code op een voorziening of zoek deze op in de app. Doorloop de checklist en update de status.

7:00 - Offline Functionaliteit
De app werkt ook offline. Data wordt lokaal opgeslagen en gesynchroniseerd zodra er weer internetverbinding is.

8:00 - Evacuatie Procedures
Raadpleeg evacuatie procedures en plotkaarten direct op je telefoon. Handig tijdens oefeningen of echte noodsituaties.

9:00 - Push Notificaties
Ontvang belangrijke meldingen via push notificaties: nieuwe incidenten, urgente taken, of systeem updates.

10:00 - Synchronisatie
Alle data wordt automatisch gesynchroniseerd tussen de mobiele app en het web platform. Wijzigingen zijn direct zichtbaar voor alle gebruikers.

11:00 - Tips voor Mobiel Gebruik
Enkele tips: houd de app up-to-date, gebruik WiFi voor grote uploads, en zorg voor voldoende batterij tijdens lange controle rondes.

11:30 - Samenvatting
De mobiele app maakt BHV360 nog toegankelijker en efficiënter. Gebruik het voor snelle meldingen en controles onderweg.`,
      chapters: [
        { time: "0:00", title: "Introductie", description: "Overzicht van mobiele app functies" },
        { time: "1:00", title: "Installeren", description: "App downloaden en inloggen" },
        { time: "2:00", title: "Dashboard", description: "Mobiele interface overzicht" },
        { time: "3:00", title: "Incident Melden", description: "Onderweg incidenten rapporteren" },
        { time: "4:30", title: "Foto's", description: "Camera en locatie functies" },
        { time: "5:30", title: "Controles", description: "Voorzieningen controleren met QR codes" },
        { time: "7:00", title: "Offline", description: "Werken zonder internetverbinding" },
        { time: "8:00", title: "Evacuatie", description: "Procedures raadplegen op mobiel" },
        { time: "9:00", title: "Notificaties", description: "Push berichten ontvangen" },
        { time: "10:00", title: "Synchronisatie", description: "Data sync tussen apparaten" },
      ],
      learningObjectives: [
        "Mobiele app installeren en configureren",
        "Incidenten melden met foto's en locatie",
        "Voorziening controles uitvoeren met QR codes",
        "Offline functionaliteit effectief gebruiken",
        "Evacuatie procedures raadplegen op mobiel",
        "Push notificaties beheren",
        "Data synchronisatie begrijpen",
        "Mobiele workflow optimaliseren",
      ],
      prerequisites: ["Smartphone met iOS of Android", "BHV360 account"],
      relatedVideos: ["incident-management", "controles-uitvoeren", "qr-codes"],
    },
  ]

  const categories = ["alle", "Introductie", "Plotkaart", "Editor", "Incidenten", "Beheer", "Rapportages", "Mobiel"]

  const filteredVideos = videoTutorials.filter((video) => {
    const matchesSearch =
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.category.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = selectedCategory === "alle" || video.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800 border-green-200"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Advanced":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Introductie":
        return <BookOpen className="h-4 w-4" />
      case "Plotkaart":
        return <Shield className="h-4 w-4" />
      case "Editor":
        return <Settings className="h-4 w-4" />
      case "Incidenten":
        return <AlertTriangle className="h-4 w-4" />
      case "Beheer":
        return <Users className="h-4 w-4" />
      case "Rapportages":
        return <FileText className="h-4 w-4" />
      case "Mobiel":
        return <Smartphone className="h-4 w-4" />
      default:
        return <Play className="h-4 w-4" />
    }
  }

  const totalVideos = videoTutorials.length
  const completionPercentage = (completedVideos.length / totalVideos) * 100

  const markAsCompleted = (videoId: string) => {
    if (!completedVideos.includes(videoId)) {
      setCompletedVideos([...completedVideos, videoId])
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">BHV360 Video Tutorials</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Leer BHV360 kennen met onze uitgebreide video tutorials. Van basis functionaliteit tot geavanceerde features -
          alles wat je nodig hebt om een expert te worden.
        </p>
      </div>

      {/* Progress Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-900">
            <CheckCircle className="h-5 w-5 mr-2 text-blue-600" />
            Je Leervoortgang
          </CardTitle>
          <CardDescription className="text-blue-700">
            {completedVideos.length} van {totalVideos} video's voltooid
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={completionPercentage} className="mb-2" />
          <p className="text-sm text-blue-600">
            {Math.round(completionPercentage)}% voltooid - {totalVideos - completedVideos.length} video's te gaan
          </p>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Zoek tutorials op titel, beschrijving of categorie..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category} className="text-xs capitalize">
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category} value={category} className="mt-6">
            {/* Video Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map((video) => (
                <Card key={video.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="relative">
                    <img
                      src={video.thumbnail || "/placeholder.svg"}
                      alt={video.title}
                      className="w-full h-48 object-cover"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                      <Button
                        size="lg"
                        className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100"
                        onClick={() => setSelectedVideo(video)}
                      >
                        <Play className="h-5 w-5 mr-2" />
                        Afspelen
                      </Button>
                    </div>

                    {/* Duration Badge */}
                    <div className="absolute bottom-2 right-2 bg-black/75 text-white px-2 py-1 rounded text-sm font-medium">
                      {video.duration}
                    </div>

                    {/* Completed Badge */}
                    {completedVideos.includes(video.id) && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
                        <CheckCircle className="h-4 w-4" />
                      </div>
                    )}

                    {/* Category Icon */}
                    <div className="absolute top-2 left-2 bg-white/90 p-2 rounded-full">
                      {getCategoryIcon(video.category)}
                    </div>
                  </div>

                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {video.title}
                      </CardTitle>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0 space-y-4">
                    <CardDescription className="line-clamp-3">{video.description}</CardDescription>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {video.category}
                      </Badge>
                      <Badge className={`text-xs ${getDifficultyColor(video.difficulty)}`}>{video.difficulty}</Badge>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {video.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {video.views.toLocaleString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {video.rating}
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button className="w-full bg-transparent" variant="outline" onClick={() => setSelectedVideo(video)}>
                      <Play className="h-4 w-4 mr-2" />
                      Video Bekijken
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* No Results */}
            {filteredVideos.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Geen tutorials gevonden</h3>
                <p className="text-muted-foreground mb-4">
                  Probeer een andere zoekterm of selecteer een andere categorie.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedCategory("alle")
                  }}
                >
                  Filters Wissen
                </Button>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Learning Path Recommendation */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center text-green-900">
            <BookOpen className="h-5 w-5 mr-2 text-green-600" />
            Aanbevolen Leerpad
          </CardTitle>
          <CardDescription className="text-green-700">
            Volg deze volgorde voor de beste leerervaring met BHV360
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { step: 1, videoId: "intro-bhv360", title: "Start met de introductie" },
              { step: 2, videoId: "plotkaart-basis", title: "Leer de plotkaart kennen" },
              { step: 3, videoId: "incident-management", title: "Beheer incidenten" },
              { step: 4, videoId: "plotkaart-editor", title: "Bewerk plotkaarten" },
              { step: 5, videoId: "gebruikers-beheer", title: "Beheer gebruikers" },
              { step: 6, videoId: "rapportages", title: "Genereer rapportages" },
            ].map((item) => {
              const video = videoTutorials.find((v) => v.id === item.videoId)
              const isCompleted = completedVideos.includes(item.videoId)

              return (
                <div
                  key={item.step}
                  className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-green-200"
                >
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      isCompleted ? "bg-green-500 text-white" : "bg-green-100 text-green-700"
                    }`}
                  >
                    {isCompleted ? <CheckCircle className="h-4 w-4" /> : item.step}
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-medium text-green-900">{item.title}</h4>
                    <p className="text-sm text-green-600">
                      {video?.duration} • {video?.difficulty}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-green-300 text-green-700 hover:bg-green-100 bg-transparent"
                    onClick={() => {
                      if (video) setSelectedVideo(video)
                    }}
                  >
                    {isCompleted ? "Herbekijk" : "Start"}
                  </Button>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Video Player Modal */}
      {selectedVideo && (
        <VideoPlayer
          video={selectedVideo}
          onClose={() => {
            setSelectedVideo(null)
            markAsCompleted(selectedVideo.id)
          }}
        />
      )}
    </div>
  )
}
