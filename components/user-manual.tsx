import { HelpCircle, BookOpen, FileText, Video, ExternalLink } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function UserManual({ module }: { module: string }) {
  const manuals = {
    "bhv-plotkaart": {
      title: "BHV Plotkaart Handleiding",
      description: "Leer hoe je de BHV Plotkaart effectief kunt gebruiken",
      sections: [
        {
          title: "Navigatie",
          content:
            "Gebruik de verdiepingsknoppen om tussen verdiepingen te schakelen. Klik op voorzieningen om details te bekijken en acties uit te voeren.",
        },
        {
          title: "Checklist",
          content:
            "Vink items af in de checklist om de voortgang bij te houden. Voeg opmerkingen toe waar nodig. In de bewerkingsmodus kun je nieuwe items toevoegen of bestaande items verwijderen.",
        },
        {
          title: "MiVa Tracking",
          content:
            "Gebruik de MiVa tracking om bij te houden welke mindervalide personen aanwezig zijn en of ze geëvacueerd zijn in geval van nood.",
        },
        {
          title: "NFC Tags",
          content:
            "Scan NFC tags door op de scan-knop te klikken bij een voorziening. Dit werkt op Android-apparaten met Chrome. Op andere apparaten wordt een simulatiemodus gebruikt.",
        },
      ],
      resources: [
        { title: "Volledige handleiding", icon: FileText, link: "#" },
        { title: "Instructievideo", icon: Video, link: "#" },
        { title: "Online training", icon: ExternalLink, link: "#" },
      ],
    },
    "nfc-tags": {
      title: "NFC Tags Handleiding",
      description: "Leer hoe je NFC tags kunt beheren en gebruiken",
      sections: [
        {
          title: "Tags toevoegen",
          content:
            "Klik op 'Nieuwe tag' om een nieuwe NFC tag toe te voegen. Vul de vereiste informatie in en koppel de tag aan een voorziening.",
        },
        {
          title: "Tags scannen",
          content:
            "Gebruik een Android-apparaat met Chrome om NFC tags te scannen. Houd je telefoon dicht bij de tag om deze te lezen.",
        },
        {
          title: "Acties configureren",
          content:
            "Configureer verschillende acties voor elke tag, zoals het openen van een website, het tonen van informatie of het activeren van een noodprocedure.",
        },
        {
          title: "Tags beheren",
          content: "Bewerk of verwijder tags via het overzicht. Gebruik filters om specifieke tags te vinden.",
        },
      ],
      resources: [
        { title: "Volledige handleiding", icon: FileText, link: "#" },
        { title: "Instructievideo", icon: Video, link: "#" },
        { title: "Online training", icon: ExternalLink, link: "#" },
      ],
    },
    "nfc-overzicht": {
      title: "NFC Overzicht Handleiding",
      description: "Leer hoe je het NFC overzicht effectief kunt gebruiken",
      sections: [
        {
          title: "Dashboard",
          content:
            "Het dashboard toont een overzicht van alle alerts en meldingen. Gebruik de filters om specifieke informatie te vinden.",
        },
        {
          title: "Filters gebruiken",
          content: "Gebruik de zoekbalk en filters om specifieke tags te vinden op basis van status, type of locatie.",
        },
        {
          title: "Meldingen afhandelen",
          content:
            "Klik op een melding om deze te bekijken en af te handelen. Wijs een prioriteit en verantwoordelijke toe.",
        },
        {
          title: "Rapporten genereren",
          content: "Genereer rapporten over de status van voorzieningen, vervaldatums en keuringen.",
        },
      ],
      resources: [
        { title: "Volledige handleiding", icon: FileText, link: "#" },
        { title: "Instructievideo", icon: Video, link: "#" },
        { title: "Online training", icon: ExternalLink, link: "#" },
      ],
    },
    default: {
      title: "Gebruikershandleiding",
      description: "Leer hoe je het BHV systeem effectief kunt gebruiken",
      sections: [
        {
          title: "Navigatie",
          content:
            "Gebruik het menu aan de linkerkant om tussen verschillende modules te navigeren. Selecteer eerst een klant om alle functionaliteiten te kunnen gebruiken.",
        },
        {
          title: "Klanten beheren",
          content:
            "Ga naar 'Klanten' om klanten toe te voegen, te bewerken of te verwijderen. Selecteer een klant om deze actief te maken.",
        },
        {
          title: "Instellingen",
          content:
            "Pas de instellingen aan via het instellingenmenu. Hier kun je modules in- en uitschakelen, huisstijl aanpassen en meer.",
        },
        {
          title: "Ondersteuning",
          content: "Heb je hulp nodig? Neem contact op met de helpdesk via support@bhvsysteem.nl of bel 088-1234567.",
        },
      ],
      resources: [
        { title: "Volledige handleiding", icon: FileText, link: "#" },
        { title: "Instructievideo's", icon: Video, link: "#" },
        { title: "Online training", icon: ExternalLink, link: "#" },
      ],
    },
  }

  const manual = manuals[module as keyof typeof manuals] || manuals.default

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <BookOpen className="h-5 w-5 text-blue-500" />
          <CardTitle>{manual.title}</CardTitle>
        </div>
        <CardDescription>{manual.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {manual.sections.map((section, index) => (
            <AccordionItem key={index} value={`section-${index}`}>
              <AccordionTrigger className="text-sm font-medium">{section.title}</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground">{section.content}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-4 pt-4 border-t">
          <h4 className="text-sm font-medium mb-2 flex items-center">
            <HelpCircle className="h-4 w-4 mr-1 text-blue-500" />
            Hulpbronnen
          </h4>
          <div className="flex flex-wrap gap-2">
            {manual.resources.map((resource, index) => (
              <Button key={index} variant="outline" size="sm" className="flex items-center" asChild>
                <a href={resource.link} target="_blank" rel="noopener noreferrer">
                  <resource.icon className="h-3.5 w-3.5 mr-1" />
                  {resource.title}
                </a>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
