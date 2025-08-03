"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Play, Volume2, Clock, User, Search, CheckCircle, BookOpen, Star, Download, Share2 } from "lucide-react"

const videoCategories = [
  {
    id: "getting-started",
    title: "Aan de slag",
    description: "Eerste stappen met BHV360",
    videos: [
      {
        id: "intro",
        title: "Welkom bij BHV360 - Complete introductie",
        description: "Een complete rondleiding door het BHV360 systeem en alle mogelijkheden",
        duration: "8:45",
        level: "Beginner",
        views: 1247,
        rating: 4.8,
        thumbnail: "/placeholder.svg?height=200&width=350&text=BHV360+Intro",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        transcript: `
0:00 - Welkom bij BHV360
0:30 - Overzicht van het systeem
1:15 - Navigatie door de interface
2:00 - Klanten selecteren
2:45 - Dashboard overzicht
3:30 - Belangrijkste functies
4:15 - BHV Plotkaart introductie
5:00 - NFC Tags uitleg
5:45 - Gebruikersbeheer
6:30 - Instellingen configureren
7:15 - Tips en best practices
8:00 - Volgende stappen
        `,
        chapters: [
          { time: "0:00", title: "Welkom" },
          { time: "0:30", title: "Systeem overzicht" },
          { time: "1:15", title: "Navigatie" },
          { time: "2:00", title: "Klanten" },
          { time: "2:45", title: "Dashboard" },
          { time: "4:15", title: "Plotkaart" },
          { time: "5:00", title: "NFC Tags" },
          { time: "6:30", title: "Instellingen" },
        ],
      },
      {
        id: "navigation",
        title: "Navigatie en klantenselectie",
        description: "Leer hoe je door het systeem navigeert en klanten selecteert",
        duration: "4:20",
        level: "Beginner",
        views: 892,
        rating: 4.6,
        thumbnail: "/placeholder.svg?height=200&width=350&text=Navigatie",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        transcript: "Transcript voor navigatie video...",
        chapters: [
          { time: "0:00", title: "Menu overzicht" },
          { time: "1:00", title: "Klant selecteren" },
          { time: "2:30", title: "Pagina's navigeren" },
          { time: "3:45", title: "Snelkoppelingen" },
        ],
      },
    ],
  },
  {
    id: "plotkaart",
    title: "BHV Plotkaart",
    description: "Alles over de plotkaart functionaliteit",
    videos: [
      {
        id: "plotkaart-basics",
        title: "BHV Plotkaart - Basis gebruik",
        description: "Leer hoe je de BHV plotkaart gebruikt voor dagelijkse taken",
        duration: "6:15",
        level: "Beginner",
        views: 1456,
        rating: 4.9,
        thumbnail: "/placeholder.svg?height=200&width=350&text=Plotkaart+Basis",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        transcript: "Transcript voor plotkaart basics...",
        chapters: [
          { time: "0:00", title: "Plotkaart openen" },
          { time: "1:00", title: "Verdiepingen wisselen" },
          { time: "2:15", title: "Symbolen begrijpen" },
          { time: "3:30", title: "Voorzieningen bekijken" },
          { time: "4:45", title: "Checklist gebruiken" },
        ],
      },
      {
        id: "plotkaart-advanced",
        title: "Geavanceerde plotkaart functies",
        description: "MiVa tracking, NFC scanning en andere geavanceerde functies",
        duration: "9:30",
        level: "Gevorderd",
        views: 743,
        rating: 4.7,
        thumbnail: "/placeholder.svg?height=200&width=350&text=Plotkaart+Gevorderd",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        transcript: "Transcript voor geavanceerde plotkaart...",
        chapters: [
          { time: "0:00", title: "MiVa tracking" },
          { time: "2:00", title: "NFC scanning" },
          { time: "4:30", title: "Checklist beheer" },
          { time: "6:15", title: "Rapportage" },
          { time: "8:00", title: "Tips & tricks" },
        ],
      },
    ],
  },
  {
    id: "editor",
    title: "Plotkaart Editor",
    description: "Plotkaarten bewerken en aanpassen",
    videos: [
      {
        id: "editor-basics",
        title: "Plotkaart Editor - Symbolen plaatsen",
        description: "Leer hoe je symbolen plaatst en voorzieningen toevoegt",
        duration: "7:45",
        level: "Gemiddeld",
        views: 1089,
        rating: 4.8,
        thumbnail: "/placeholder.svg?height=200&width=350&text=Editor+Symbolen",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        transcript: "Transcript voor editor basics...",
        chapters: [
          { time: "0:00", title: "Editor openen" },
          { time: "1:15", title: "Symbolen selecteren" },
          { time: "2:30", title: "Plaatsen en positioneren" },
          { time: "4:00", title: "Eigenschappen instellen" },
          { time: "5:30", title: "Opslaan en publiceren" },
        ],
      },
      {
        id: "pdf-export",
        title: "PDF Export - Professionele plotkaarten",
        description: "Exporteer je plotkaarten naar PDF voor printing en delen",
        duration: "3:45",
        level: "Beginner",
        views: 2156,
        rating: 4.9,
        thumbnail: "/placeholder.svg?height=200&width=350&text=PDF+Export",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        transcript: "Transcript voor PDF export...",
        chapters: [
          { time: "0:00", title: "Export opties" },
          { time: "1:00", title: "PDF genereren" },
          { time: "2:15", title: "Kwaliteit controleren" },
          { time: "3:00", title: "Delen en printen" },
        ],
      },
    ],
  },
  {
    id: "nfc-tags",
    title: "NFC Tags",
    description: "NFC tags beheren en gebruiken",
    videos: [
      {
        id: "nfc-setup",
        title: "NFC Tags - Setup en configuratie",
        description: "Stel NFC tags in en koppel ze aan voorzieningen",
        duration: "5:30",
        level: "Gemiddeld",
        views: 876,
        rating: 4.5,
        thumbnail: "/placeholder.svg?height=200&width=350&text=NFC+Setup",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        transcript: "Transcript voor NFC setup...",
        chapters: [
          { time: "0:00", title: "NFC tags toevoegen" },
          { time: "1:30", title: "Koppelen aan voorzieningen" },
          { time: "3:00", title: "Acties configureren" },
          { time: "4:15", title: "Testen en valideren" },
        ],
      },
      {
        id: "nfc-scanning",
        title: "NFC Scanning met je telefoon",
        description: "Leer hoe je NFC tags scant met Android apparaten",
        duration: "4:15",
        level: "Beginner",
        views: 1234,
        rating: 4.7,
        thumbnail: "/placeholder.svg?height=200&width=350&text=NFC+Scanning",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        transcript: "Transcript voor NFC scanning...",
        chapters: [
          { time: "0:00", title: "Telefoon instellen" },
          { time: "1:00", title: "Tags scannen" },
          { time: "2:30", title: "Acties uitvoeren" },
          { time: "3:45", title: "Troubleshooting" },
        ],
      },
    ],
  },
  {
    id: "management",
    title: "Beheer & Instellingen",
    description: "Gebruikers, instellingen en configuratie",
    videos: [
      {
        id: "user-management",
        title: "Gebruikersbeheer - Rollen en rechten",
        description: "Beheer gebruikers, rollen en toegangsrechten",
        duration: "6:45",
        level: "Gevorderd",
        views: 654,
        rating: 4.6,
        thumbnail: "/placeholder.svg?height=200&width=350&text=Gebruikersbeheer",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        transcript: "Transcript voor gebruikersbeheer...",
        chapters: [
          { time: "0:00", title: "Gebruikers toevoegen" },
          { time: "1:45", title: "Rollen toewijzen" },
          { time: "3:30", title: "Rechten configureren" },
          { time: "5:00", title: "BHV'ers beheren" },
        ],
      },
      {
        id: "settings-config",
        title: "Instellingen en configuratie",
        description: "Configureer het systeem naar je wensen",
        duration: "8:20",
        level: "Gevorderd",
        views: 432,
        rating: 4.4,
        thumbnail: "/placeholder.svg?height=200&width=350&text=Instellingen",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        transcript: "Transcript voor instellingen...",
        chapters: [
          { time: "0:00", title: "Algemene instellingen" },
          { time: "2:00", title: "Huisstijl aanpassen" },
          { time: "4:30", title: "E-mail configuratie" },
          { time: "6:15", title: "Modules beheren" },
        ],
      },
    ],
  },
]

const VideoPlayer = ({ video, onClose }: { video: any; onClose: () => void }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [showTranscript, setShowTranscript] = useState(false)

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="text-xl font-bold">{video.title}</h2>
            <p className="text-muted-foreground">{video.description}</p>
          </div>
          <Button variant="ghost" onClick={onClose}>
            ×
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
          <div className="lg:col-span-3">
            {/* Video Player */}
            <div className="aspect-video bg-black rounded-lg mb-4 relative">
              <iframe src={video.videoUrl} className="w-full h-full rounded-lg" allowFullScreen title={video.title} />
            </div>

            {/* Video Controls */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <Button size="sm" variant="outline">
                  <Play className="h-4 w-4 mr-1" />
                  {isPlaying ? "Pause" : "Play"}
                </Button>
                <Button size="sm" variant="outline">
                  <Volume2 className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground">
                  {Math.floor(currentTime / 60)}:{(currentTime % 60).toString().padStart(2, "0")} / {video.duration}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline" onClick={() => setShowTranscript(!showTranscript)}>
                  <BookOpen className="h-4 w-4 mr-1" />
                  Transcript
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
                <Button size="sm" variant="outline">
                  <Share2 className="h-4 w-4 mr-1" />
                  Delen
                </Button>
              </div>
            </div>

            {/* Progress Bar */}
            <Progress value={(currentTime / 525) * 100} className="mb-4" />

            {/* Transcript */}
            {showTranscript && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Transcript</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-sm whitespace-pre-wrap text-muted-foreground">{video.transcript}</pre>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            {/* Video Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Video informatie</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Duur:</span>
                  <Badge variant="outline">{video.duration}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Niveau:</span>
                  <Badge variant="outline">{video.level}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Weergaven:</span>
                  <span className="text-sm">{video.views.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Beoordeling:</span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm ml-1">{video.rating}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Chapters */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Hoofdstukken</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {video.chapters.map((chapter: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 rounded hover:bg-muted cursor-pointer"
                    >
                      <div className="flex items-center space-x-2">
                        <Play className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{chapter.title}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{chapter.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function VideoTutorialsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("getting-started")
  const [selectedVideo, setSelectedVideo] = useState<any>(null)
  const [completedVideos, setCompletedVideos] = useState<string[]>([])

  const filteredCategories = videoCategories.filter(
    (category) =>
      category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.videos.some((video) => video.title.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const markVideoCompleted = (videoId: string) => {
    if (!completedVideos.includes(videoId)) {
      setCompletedVideos([...completedVideos, videoId])
    }
  }

  const totalVideos = videoCategories.reduce((acc, category) => acc + category.videos.length, 0)
  const completionPercentage = (completedVideos.length / totalVideos) * 100

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Video Tutorials</h1>
        <p className="text-muted-foreground">
          Leer BHV360 kennen met onze uitgebreide video tutorials en stap-voor-stap instructies
        </p>
      </div>

      {/* Progress Overview */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
            Je voortgang
          </CardTitle>
          <CardDescription>
            {completedVideos.length} van {totalVideos} video's voltooid
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={completionPercentage} className="mb-2" />
          <p className="text-sm text-muted-foreground">{Math.round(completionPercentage)}% voltooid</p>
        </CardContent>
      </Card>

      {/* Search */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Zoek video tutorials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
          <TabsTrigger value="getting-started">Aan de slag</TabsTrigger>
          <TabsTrigger value="plotkaart">Plotkaart</TabsTrigger>
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="nfc-tags">NFC Tags</TabsTrigger>
          <TabsTrigger value="management">Beheer</TabsTrigger>
        </TabsList>

        {filteredCategories.map((category) => (
          <TabsContent key={category.id} value={category.id}>
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">{category.title}</h2>
              <p className="text-muted-foreground">{category.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.videos.map((video) => (
                <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={video.thumbnail || "/placeholder.svg"}
                      alt={video.title}
                      className="w-full aspect-video object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Button size="lg" className="rounded-full" onClick={() => setSelectedVideo(video)}>
                        <Play className="h-6 w-6" />
                      </Button>
                    </div>
                    <div className="absolute top-2 right-2">
                      {completedVideos.includes(video.id) && (
                        <CheckCircle className="h-6 w-6 text-green-500 bg-white rounded-full" />
                      )}
                    </div>
                    <div className="absolute bottom-2 right-2">
                      <Badge variant="secondary" className="bg-black/70 text-white">
                        {video.duration}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-2">{video.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{video.description}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {video.duration}
                        </span>
                        <span className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          {video.views.toLocaleString()}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {video.level}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm ml-1">{video.rating}</span>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => setSelectedVideo(video)}>
                        Bekijken
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Video Player Modal */}
      {selectedVideo && (
        <VideoPlayer
          video={selectedVideo}
          onClose={() => {
            setSelectedVideo(null)
            markVideoCompleted(selectedVideo.id)
          }}
        />
      )}

      {/* Learning Path */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2 text-blue-500" />
            Aanbevolen leerpad
          </CardTitle>
          <CardDescription>Volg deze volgorde voor de beste leerervaring</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { title: "1. Welkom bij BHV360", category: "Aan de slag", duration: "8:45" },
              { title: "2. Navigatie en klantenselectie", category: "Aan de slag", duration: "4:20" },
              { title: "3. BHV Plotkaart - Basis gebruik", category: "Plotkaart", duration: "6:15" },
              { title: "4. Plotkaart Editor - Symbolen plaatsen", category: "Editor", duration: "7:45" },
              { title: "5. NFC Tags - Setup en configuratie", category: "NFC Tags", duration: "5:30" },
              { title: "6. PDF Export - Professionele plotkaarten", category: "Editor", duration: "3:45" },
            ].map((step, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 border rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </div>
                <div className="flex-grow">
                  <h4 className="font-medium">{step.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {step.category} • {step.duration}
                  </p>
                </div>
                <Button size="sm" variant="outline">
                  Start
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
