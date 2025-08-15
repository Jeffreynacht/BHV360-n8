"use client"

import { useState, useEffect, useCallback } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Search,
  User,
  Building,
  Shield,
  Settings,
  QrCode,
  FileText,
  Users,
  MapPin,
  Clock,
  ArrowRight,
  Command,
  Hash,
  Zap,
} from "lucide-react"
import { useCustomer } from "@/components/customer-context"
import { useRouter } from "next/navigation"

interface SearchResult {
  id: string
  title: string
  description: string
  category: string
  url: string
  icon: any
  keywords?: string[]
}

const searchCategories = [
  { id: "pages", name: "Pagina's", icon: FileText, color: "bg-blue-500" },
  { id: "customers", name: "Klanten", icon: Building, color: "bg-green-500" },
  { id: "users", name: "Gebruikers", icon: Users, color: "bg-purple-500" },
  { id: "facilities", name: "Voorzieningen", icon: Shield, color: "bg-red-500" },
  { id: "nfc", name: "NFC Tags", icon: QrCode, color: "bg-orange-500" },
  { id: "actions", name: "Acties", icon: Zap, color: "bg-yellow-500" },
]

const staticSearchResults: SearchResult[] = [
  // Pages
  {
    id: "dashboard",
    title: "Dashboard",
    description: "Overzicht van alle belangrijke informatie",
    category: "pages",
    url: "/dashboard",
    icon: FileText,
    keywords: ["overzicht", "home", "start"],
  },
  {
    id: "bhv-plotkaart",
    title: "BHV Plotkaart",
    description: "Bekijk en beheer de BHV plotkaart",
    category: "pages",
    url: "/bhv",
    icon: Shield,
    keywords: ["plotkaart", "bhv", "veiligheid", "evacuatie"],
  },
  {
    id: "bhv-editor",
    title: "Plotkaart Editor",
    description: "Bewerk en pas de plotkaart aan",
    category: "pages",
    url: "/bhv/editor",
    icon: MapPin,
    keywords: ["editor", "bewerken", "symbolen", "aanpassen"],
  },
  {
    id: "nfc-tags",
    title: "NFC Tags Beheer",
    description: "Beheer alle NFC tags per verdieping",
    category: "pages",
    url: "/beheer/nfc-tags",
    icon: QrCode,
    keywords: ["nfc", "tags", "scannen", "beheer"],
  },
  {
    id: "users",
    title: "Gebruikersbeheer",
    description: "Beheer gebruikers en hun rechten",
    category: "pages",
    url: "/beheer/gebruikers",
    icon: Users,
    keywords: ["gebruikers", "rechten", "beheer", "accounts"],
  },
  {
    id: "customers",
    title: "Klantenbeheer",
    description: "Beheer alle klanten en hun gegevens",
    category: "pages",
    url: "/klanten",
    icon: Building,
    keywords: ["klanten", "bedrijven", "contacten"],
  },
  {
    id: "settings",
    title: "Instellingen",
    description: "Configureer het systeem",
    category: "pages",
    url: "/instellingen",
    icon: Settings,
    keywords: ["instellingen", "configuratie", "setup"],
  },
  {
    id: "help",
    title: "Help & Ondersteuning",
    description: "Vind hulp en documentatie",
    category: "pages",
    url: "/help",
    icon: FileText,
    keywords: ["help", "hulp", "documentatie", "handleiding"],
  },
  {
    id: "video-tutorials",
    title: "Video Tutorials",
    description: "Bekijk instructievideo's",
    category: "pages",
    url: "/video-tutorials",
    icon: FileText,
    keywords: ["video", "tutorials", "instructies", "leren"],
  },

  // Quick Actions
  {
    id: "add-customer",
    title: "Nieuwe klant toevoegen",
    description: "Voeg een nieuwe klant toe aan het systeem",
    category: "actions",
    url: "/klanten?action=add",
    icon: Building,
    keywords: ["nieuwe", "klant", "toevoegen", "aanmaken"],
  },
  {
    id: "add-user",
    title: "Nieuwe gebruiker toevoegen",
    description: "Voeg een nieuwe gebruiker toe",
    category: "actions",
    url: "/beheer/gebruikers?action=add",
    icon: User,
    keywords: ["nieuwe", "gebruiker", "toevoegen", "account"],
  },
  {
    id: "add-nfc",
    title: "NFC tag toevoegen",
    description: "Voeg een nieuwe NFC tag toe",
    category: "actions",
    url: "/beheer/nfc-tags?action=add",
    icon: QrCode,
    keywords: ["nfc", "tag", "toevoegen", "nieuwe"],
  },
  {
    id: "export-pdf",
    title: "PDF exporteren",
    description: "Exporteer plotkaart naar PDF",
    category: "actions",
    url: "/bhv/editor?action=export",
    icon: FileText,
    keywords: ["pdf", "export", "downloaden", "printen"],
  },
]

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const { customers } = useCustomer()
  const router = useRouter()

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("bhv-recent-searches")
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  // Save recent searches to localStorage
  const saveRecentSearch = (search: string) => {
    const updated = [search, ...recentSearches.filter((s) => s !== search)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem("bhv-recent-searches", JSON.stringify(updated))
  }

  // Generate dynamic search results
  const generateSearchResults = useCallback(
    (searchQuery: string): SearchResult[] => {
      const allResults: SearchResult[] = [...staticSearchResults]

      // Add customers to search results
      customers.forEach((customer) => {
        allResults.push({
          id: `customer-${customer.id}`,
          title: customer.name,
          description: `Klant: ${customer.contactPerson || "Geen contactpersoon"}`,
          category: "customers",
          url: `/klanten?customer=${customer.id}`,
          icon: Building,
          keywords: [customer.name, customer.contactPerson, customer.email].filter(Boolean),
        })
      })

      // Filter results based on query
      if (!searchQuery.trim()) {
        return allResults.slice(0, 8) // Show top 8 when no query
      }

      const filtered = allResults.filter((result) => {
        const searchText = searchQuery.toLowerCase()
        return (
          result.title.toLowerCase().includes(searchText) ||
          result.description.toLowerCase().includes(searchText) ||
          result.keywords?.some((keyword) => keyword.toLowerCase().includes(searchText))
        )
      })

      return filtered.slice(0, 10) // Limit to 10 results
    },
    [customers],
  )

  // Update results when query changes
  useEffect(() => {
    const results = generateSearchResults(query)
    setResults(results)
    setSelectedIndex(0)
  }, [query, generateSearchResults])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open search with Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        setIsOpen(true)
        return
      }

      // Close search with Escape
      if (e.key === "Escape") {
        setIsOpen(false)
        return
      }

      // Navigate results with arrow keys
      if (isOpen) {
        if (e.key === "ArrowDown") {
          e.preventDefault()
          setSelectedIndex((prev) => (prev + 1) % results.length)
        } else if (e.key === "ArrowUp") {
          e.preventDefault()
          setSelectedIndex((prev) => (prev - 1 + results.length) % results.length)
        } else if (e.key === "Enter") {
          e.preventDefault()
          if (results[selectedIndex]) {
            handleResultClick(results[selectedIndex])
          }
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, results, selectedIndex])

  const handleResultClick = (result: SearchResult) => {
    saveRecentSearch(result.title)
    setIsOpen(false)
    setQuery("")
    router.push(result.url)
  }

  const getCategoryInfo = (categoryId: string) => {
    return searchCategories.find((cat) => cat.id === categoryId) || searchCategories[0]
  }

  return (
    <>
      {/* Search Trigger Button */}
      <Button
        variant="outline"
        className="relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setIsOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        <span className="hidden lg:inline-flex">Zoeken...</span>
        <span className="inline-flex lg:hidden">Zoek</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      {/* Search Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl p-0">
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Zoek naar pagina's, klanten, gebruikers..."
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              autoFocus
            />
            <div className="flex items-center space-x-1">
              <kbd className="pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 hidden sm:inline-flex">
                ESC
              </kbd>
            </div>
          </div>

          <ScrollArea className="max-h-[400px]">
            {query === "" && recentSearches.length > 0 && (
              <div className="p-4">
                <h4 className="mb-2 text-xs font-medium text-muted-foreground flex items-center">
                  <Clock className="mr-1 h-3 w-3" />
                  Recent gezocht
                </h4>
                <div className="space-y-1">
                  {recentSearches.map((search, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full justify-start h-8 px-2 text-sm"
                      onClick={() => setQuery(search)}
                    >
                      <Hash className="mr-2 h-3 w-3 opacity-50" />
                      {search}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {results.length > 0 && (
              <div className="p-4">
                {query === "" && <h4 className="mb-2 text-xs font-medium text-muted-foreground">Snelle toegang</h4>}
                <div className="space-y-1">
                  {results.map((result, index) => {
                    const categoryInfo = getCategoryInfo(result.category)
                    const isSelected = index === selectedIndex

                    return (
                      <div
                        key={result.id}
                        className={`flex items-center space-x-3 rounded-md p-2 cursor-pointer transition-colors ${
                          isSelected ? "bg-accent" : "hover:bg-accent/50"
                        }`}
                        onClick={() => handleResultClick(result)}
                      >
                        <div className={`p-1.5 rounded-md ${categoryInfo.color} text-white`}>
                          <result.icon className="h-3 w-3" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium truncate">{result.title}</p>
                            <Badge variant="outline" className="text-xs">
                              {categoryInfo.name}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{result.description}</p>
                        </div>
                        <ArrowRight className="h-3 w-3 opacity-50" />
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {query !== "" && results.length === 0 && (
              <div className="p-8 text-center">
                <Search className="mx-auto h-6 w-6 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-medium">Geen resultaten gevonden</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Probeer een andere zoekterm of bekijk de help pagina
                </p>
                <Button variant="outline" size="sm" className="mt-3" onClick={() => router.push("/help")}>
                  Ga naar Help
                </Button>
              </div>
            )}
          </ScrollArea>

          <div className="flex items-center justify-between border-t px-3 py-2 text-xs text-muted-foreground">
            <div className="flex items-center space-x-2">
              <kbd className="h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 hidden sm:inline-flex">
                <Command className="h-2 w-2" />K
              </kbd>
              <span className="hidden sm:inline">om te zoeken</span>
            </div>
            <div className="flex items-center space-x-2">
              <kbd className="h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 hidden sm:inline-flex">
                ↑↓
              </kbd>
              <span className="hidden sm:inline">om te navigeren</span>
              <kbd className="h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 hidden sm:inline-flex">
                ↵
              </kbd>
              <span className="hidden sm:inline">om te selecteren</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
