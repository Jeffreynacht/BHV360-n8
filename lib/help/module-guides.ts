import { UserRole } from "@/lib/rbac/roles"

export interface GuideStep {
  id: string
  title: string
  description: string
  action?: string
  screenshot?: string
  videoUrl?: string
  tips?: string[]
  warnings?: string[]
  nextSteps?: string[]
}

export interface ModuleGuide {
  moduleId: string
  moduleName: string
  roles: UserRole[]
  overview: string
  prerequisites?: string[]
  steps: GuideStep[]
  troubleshooting: Array<{
    problem: string
    solution: string
    preventive?: string
  }>
  faqs: Array<{
    question: string
    answer: string
    roles?: UserRole[]
  }>
  relatedModules?: string[]
  estimatedTime: string
  difficulty: "beginner" | "intermediate" | "advanced"
}

export const MODULE_GUIDES: ModuleGuide[] = [
  // === BHV PLOTKAART MODULE ===
  {
    moduleId: "bhv-plotkaart",
    moduleName: "BHV Plotkaart",
    roles: [
      UserRole.BHV_COORDINATOR,
      UserRole.BHV_PLOEGLEIDER,
      UserRole.BHV_MEMBER,
      UserRole.EHBO_MEMBER,
      UserRole.ONTRUIMER,
    ],
    overview:
      "De BHV Plotkaart is het centrale overzicht van alle veiligheidsvoorzieningen in uw gebouw. Hier kunt u de status controleren, checklists afwerken en noodprocedures uitvoeren.",
    prerequisites: [
      "Toegang tot het BHV360 systeem",
      "Geselecteerde klant in het systeem",
      "Basis kennis van BHV procedures",
    ],
    estimatedTime: "15-30 minuten",
    difficulty: "beginner",
    steps: [
      {
        id: "step-1",
        title: "Plotkaart openen",
        description: "Navigeer naar de BHV Plotkaart vanuit het hoofdmenu",
        action: "Klik op 'BHV' in het linkermenu, dan op 'Plotkaart'",
        screenshot: "/help/screenshots/bhv-plotkaart-menu.png",
        tips: ["Zorg dat je eerst een klant hebt geselecteerd", "De plotkaart laadt automatisch de eerste verdieping"],
      },
      {
        id: "step-2",
        title: "Verdieping selecteren",
        description: "Kies de juiste verdieping om te bekijken",
        action: "Gebruik de verdiepingsknoppen bovenaan de plotkaart",
        tips: ["Elke verdieping heeft zijn eigen voorzieningen", "Let op de kleurcodering van de knoppen"],
      },
      {
        id: "step-3",
        title: "Voorzieningen controleren",
        description: "Bekijk de status van alle veiligheidsvoorzieningen",
        action: "Klik op een voorziening (symbool) om details te bekijken",
        tips: [
          "Groene symbolen = OK status",
          "Rode symbolen = Aandacht vereist",
          "Grijze symbolen = Niet gecontroleerd",
        ],
        warnings: ["Rode symbolen vereisen directe actie", "Controleer regelmatig alle voorzieningen"],
      },
      {
        id: "step-4",
        title: "Checklist gebruiken",
        description: "Werk systematisch de BHV checklist af",
        action: "Open de checklist in het rechterpaneel en vink items af",
        tips: ["Voeg opmerkingen toe bij afwijkingen", "Sla regelmatig op tijdens het werken"],
      },
      {
        id: "step-5",
        title: "NFC tags scannen",
        description: "Scan NFC tags bij voorzieningen voor verificatie",
        action: "Klik op 'NFC Scan' bij een voorziening en houd je telefoon erbij",
        tips: ["Werkt alleen op Android met Chrome browser", "Op andere apparaten wordt simulatiemodus gebruikt"],
        warnings: ["Zorg dat NFC is ingeschakeld op je telefoon"],
      },
      {
        id: "step-6",
        title: "MiVa tracking",
        description: "Houd mindervalide personen bij tijdens evacuatie",
        action: "Gebruik het MiVa paneel om personen te registreren en hun status bij te werken",
        tips: ["Registreer alle MiVa personen vooraf", "Update status tijdens evacuatie procedures"],
      },
    ],
    troubleshooting: [
      {
        problem: "Plotkaart laadt niet",
        solution: "Controleer of er een klant is geselecteerd en ververs de pagina",
        preventive: "Selecteer altijd eerst een klant voordat je modules gebruikt",
      },
      {
        problem: "NFC scanning werkt niet",
        solution: "Controleer of je een Android apparaat met Chrome gebruikt en NFC is ingeschakeld",
        preventive: "Test NFC functionaliteit vooraf op je apparaat",
      },
      {
        problem: "Symbolen zijn niet zichtbaar",
        solution: "Zoom uit of gebruik de legenda om symbolen te identificeren",
        preventive: "Gebruik de zoom functionaliteit om het overzicht te behouden",
      },
    ],
    faqs: [
      {
        question: "Hoe vaak moet ik de plotkaart controleren?",
        answer: "Dagelijks voor BHV coördinatoren, wekelijks voor BHV leden, volgens planning voor anderen",
        roles: [UserRole.BHV_COORDINATOR, UserRole.BHV_MEMBER],
      },
      {
        question: "Wat betekenen de verschillende kleuren?",
        answer: "Groen = OK, Rood = Probleem, Oranje = Onderhoud nodig, Grijs = Niet gecontroleerd",
      },
      {
        question: "Kan ik de plotkaart offline gebruiken?",
        answer:
          "Ja, de plotkaart wordt lokaal opgeslagen en is offline beschikbaar. Synchronisatie gebeurt automatisch wanneer verbinding beschikbaar is.",
      },
    ],
    relatedModules: ["nfc-tags", "bhv-editor", "incidenten"],
  },

  // === NFC TAGS MODULE ===
  {
    moduleId: "nfc-tags",
    moduleName: "NFC Tags Beheer",
    roles: [UserRole.CUSTOMER_ADMIN, UserRole.BHV_COORDINATOR],
    overview:
      "Beheer NFC tags die gekoppeld zijn aan veiligheidsvoorzieningen. Voeg nieuwe tags toe, configureer acties en monitor het gebruik.",
    prerequisites: ["Administrator rechten", "Fysieke NFC tags beschikbaar", "Android apparaat voor testen"],
    estimatedTime: "20-45 minuten",
    difficulty: "intermediate",
    steps: [
      {
        id: "nfc-step-1",
        title: "NFC Tags overzicht openen",
        description: "Navigeer naar het NFC tags beheer",
        action: "Ga naar Beheer > NFC Tags",
        screenshot: "/help/screenshots/nfc-tags-menu.png",
      },
      {
        id: "nfc-step-2",
        title: "Nieuwe tag toevoegen",
        description: "Voeg een nieuwe NFC tag toe aan het systeem",
        action: "Klik op 'Nieuwe Tag' en vul de gegevens in",
        tips: [
          "Gebruik duidelijke namen voor tags",
          "Koppel tags direct aan voorzieningen",
          "Test de tag na toevoegen",
        ],
      },
      {
        id: "nfc-step-3",
        title: "Tag configureren",
        description: "Stel acties in die uitgevoerd worden bij scannen",
        action: "Selecteer de tag en configureer de gewenste acties",
        tips: ["Meerdere acties per tag mogelijk", "Test alle acties na configuratie"],
      },
      {
        id: "nfc-step-4",
        title: "Tag koppelen aan voorziening",
        description: "Verbind de NFC tag met een specifieke voorziening",
        action: "Selecteer de voorziening uit de dropdown lijst",
        warnings: ["Elke tag kan maar aan één voorziening gekoppeld zijn"],
      },
      {
        id: "nfc-step-5",
        title: "Tag testen",
        description: "Test de NFC tag functionaliteit",
        action: "Gebruik een Android apparaat om de tag te scannen en functionaliteit te verifiëren",
        tips: ["Test op verschillende Android apparaten", "Controleer alle geconfigureerde acties"],
      },
    ],
    troubleshooting: [
      {
        problem: "Tag wordt niet herkend",
        solution: "Controleer of de tag correct is geprogrammeerd en het apparaat NFC ondersteuning heeft",
        preventive: "Test nieuwe tags altijd direct na programmeren",
      },
      {
        problem: "Acties worden niet uitgevoerd",
        solution: "Controleer de tag configuratie en internetverbinding",
        preventive: "Valideer configuratie voordat tags in productie gaan",
      },
    ],
    faqs: [
      {
        question: "Welke NFC tags zijn compatibel?",
        answer: "NTAG213, NTAG215 en NTAG216 tags worden ondersteund. Minimaal 180 bytes beschikbaar geheugen vereist.",
      },
      {
        question: "Hoeveel tags kan ik toevoegen?",
        answer:
          "Er is geen limiet aan het aantal tags per klant. Wel adviseren we maximaal 50 tags per verdieping voor overzichtelijkheid.",
      },
    ],
    relatedModules: ["bhv-plotkaart", "voorzieningen"],
  },

  // === PLOTKAART EDITOR MODULE ===
  {
    moduleId: "plotkaart-editor",
    moduleName: "Plotkaart Editor",
    roles: [UserRole.CUSTOMER_ADMIN, UserRole.BHV_COORDINATOR],
    overview: "Bewerk en pas plotkaarten aan. Voeg voorzieningen toe, wijzig lay-outs en configureer symbolen.",
    prerequisites: [
      "Administrator of BHV Coördinator rechten",
      "Grondplannen beschikbaar (PDF/afbeelding)",
      "Kennis van gebouwlay-out",
    ],
    estimatedTime: "45-90 minuten",
    difficulty: "advanced",
    steps: [
      {
        id: "editor-step-1",
        title: "Editor openen",
        description: "Start de plotkaart editor",
        action: "Ga naar Beheer > Plotkaart Editor",
        tips: ["Maak eerst een backup van bestaande plotkaarten", "Werk bij voorkeur in bewerkingsmodus"],
      },
      {
        id: "editor-step-2",
        title: "Grondplan uploaden",
        description: "Upload een grondplan als achtergrond",
        action: "Klik op 'Grondplan uploaden' en selecteer een afbeelding of PDF",
        tips: [
          "Gebruik hoge resolutie afbeeldingen",
          "PDF bestanden worden automatisch geconverteerd",
          "Ondersteunde formaten: PNG, JPG, PDF",
        ],
      },
      {
        id: "editor-step-3",
        title: "Voorzieningen plaatsen",
        description: "Plaats veiligheidsvoorzieningen op de plotkaart",
        action: "Sleep symbolen uit de toolbar naar de gewenste locatie",
        tips: [
          "Gebruik de juiste symbolen voor elke voorziening",
          "Plaats symbolen op logische locaties",
          "Gebruik de snap-to-grid functie voor uitlijning",
        ],
      },
      {
        id: "editor-step-4",
        title: "Symbolen configureren",
        description: "Stel eigenschappen in voor elk symbool",
        action: "Dubbelklik op een symbool om eigenschappen te bewerken",
        tips: ["Voeg duidelijke beschrijvingen toe", "Stel juiste statussen in", "Koppel NFC tags indien beschikbaar"],
      },
      {
        id: "editor-step-5",
        title: "Verdiepingen beheren",
        description: "Voeg verdiepingen toe of bewerk bestaande",
        action: "Gebruik het verdiepingen paneel om nieuwe verdiepingen toe te voegen",
        tips: ["Gebruik consistente naamgeving", "Kopieer symbolen tussen verdiepingen waar mogelijk"],
      },
      {
        id: "editor-step-6",
        title: "Wijzigingen opslaan",
        description: "Sla alle wijzigingen op",
        action: "Klik op 'Opslaan' om wijzigingen permanent te maken",
        warnings: ["Niet opgeslagen wijzigingen gaan verloren bij sluiten", "Test de plotkaart na opslaan"],
      },
    ],
    troubleshooting: [
      {
        problem: "Grondplan wordt niet geladen",
        solution: "Controleer bestandsformaat en grootte. Maximaal 10MB per bestand.",
        preventive: "Optimaliseer afbeeldingen vooraf",
      },
      {
        problem: "Symbolen verdwijnen na opslaan",
        solution: "Controleer of symbolen binnen de plotkaart grenzen zijn geplaatst",
        preventive: "Gebruik de grid en zoom functionaliteit",
      },
    ],
    faqs: [
      {
        question: "Kan ik meerdere grondplannen per verdieping gebruiken?",
        answer:
          "Nee, per verdieping is één grondplan mogelijk. Gebruik een gecombineerd grondplan voor complexe lay-outs.",
      },
      {
        question: "Hoe kopieer ik symbolen naar andere verdiepingen?",
        answer: "Selecteer symbolen, gebruik Ctrl+C om te kopiëren en Ctrl+V om te plakken op een andere verdieping.",
      },
    ],
    relatedModules: ["bhv-plotkaart", "voorzieningen", "nfc-tags"],
  },

  // === GEBRUIKERSBEHEER MODULE ===
  {
    moduleId: "gebruikersbeheer",
    moduleName: "Gebruikersbeheer",
    roles: [UserRole.CUSTOMER_OWNER, UserRole.CUSTOMER_ADMIN],
    overview:
      "Beheer gebruikers, rollen en rechten binnen uw organisatie. Voeg nieuwe gebruikers toe en configureer toegangsrechten.",
    prerequisites: [
      "Owner of Administrator rechten",
      "E-mailadressen van nieuwe gebruikers",
      "Kennis van organisatiestructuur",
    ],
    estimatedTime: "30-60 minuten",
    difficulty: "intermediate",
    steps: [
      {
        id: "users-step-1",
        title: "Gebruikersbeheer openen",
        description: "Navigeer naar het gebruikersbeheer",
        action: "Ga naar Beheer > Gebruikers",
        screenshot: "/help/screenshots/users-menu.png",
      },
      {
        id: "users-step-2",
        title: "Nieuwe gebruiker toevoegen",
        description: "Voeg een nieuwe gebruiker toe aan het systeem",
        action: "Klik op 'Nieuwe Gebruiker' en vul de gegevens in",
        tips: [
          "Gebruik zakelijke e-mailadressen",
          "Kies de juiste rol voor de gebruiker",
          "Stuur welkomstmail na toevoegen",
        ],
      },
      {
        id: "users-step-3",
        title: "Rollen toewijzen",
        description: "Wijs de juiste rol toe aan de gebruiker",
        action: "Selecteer de rol uit de dropdown lijst",
        tips: ["Start met minimale rechten", "Verhoog rechten indien nodig", "Documenteer rolwijzigingen"],
      },
      {
        id: "users-step-4",
        title: "Gebruiker activeren",
        description: "Activeer de gebruiker zodat deze kan inloggen",
        action: "Zet de status op 'Actief' en verstuur uitnodiging",
        warnings: ["Gedeactiveerde gebruikers kunnen niet inloggen", "Controleer e-mailadres voor uitnodiging"],
      },
    ],
    troubleshooting: [
      {
        problem: "Gebruiker kan niet inloggen",
        solution: "Controleer of de gebruiker actief is en de juiste rol heeft",
        preventive: "Test inloggegevens na het aanmaken",
      },
      {
        problem: "E-mail uitnodiging komt niet aan",
        solution: "Controleer spam folder en e-mailadres spelling",
        preventive: "Gebruik geverifieerde e-mailadressen",
      },
    ],
    faqs: [
      {
        question: "Hoeveel gebruikers kan ik toevoegen?",
        answer: "Het aantal gebruikers hangt af van uw abonnement. Bekijk uw licentie details voor exacte aantallen.",
      },
      {
        question: "Kan ik gebruikers tijdelijk deactiveren?",
        answer: "Ja, zet de status op 'Inactief'. De gebruiker behoudt alle gegevens maar kan niet inloggen.",
      },
    ],
    relatedModules: ["autorisaties", "instellingen"],
  },
]

export function getModuleGuide(moduleId: string, userRole: UserRole): ModuleGuide | null {
  const guide = MODULE_GUIDES.find((g) => g.moduleId === moduleId)
  if (!guide || !guide.roles.includes(userRole)) {
    return null
  }

  // Filter FAQs based on user role
  const filteredGuide = {
    ...guide,
    faqs: guide.faqs.filter((faq) => !faq.roles || faq.roles.includes(userRole)),
  }

  return filteredGuide
}

export function getAvailableGuides(userRole: UserRole): ModuleGuide[] {
  return MODULE_GUIDES.filter((guide) => guide.roles.includes(userRole))
}

export function searchGuides(query: string, userRole: UserRole): ModuleGuide[] {
  const availableGuides = getAvailableGuides(userRole)
  const searchTerm = query.toLowerCase()

  return availableGuides.filter(
    (guide) =>
      guide.moduleName.toLowerCase().includes(searchTerm) ||
      guide.overview.toLowerCase().includes(searchTerm) ||
      guide.steps.some(
        (step) => step.title.toLowerCase().includes(searchTerm) || step.description.toLowerCase().includes(searchTerm),
      ) ||
      guide.faqs.some(
        (faq) => faq.question.toLowerCase().includes(searchTerm) || faq.answer.toLowerCase().includes(searchTerm),
      ),
  )
}
