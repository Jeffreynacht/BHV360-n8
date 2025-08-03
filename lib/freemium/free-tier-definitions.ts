// Free Tier definities en beperkingen
export interface FreeTierLimits {
  maxUsers: number
  maxBuildings: number
  maxIncidentsPerMonth: number
  maxNfcTags: number
  maxStorageGB: number
  features: string[]
  restrictions: string[]
}

export const FREE_TIER_LIMITS: FreeTierLimits = {
  maxUsers: 5, // Maximaal 5 gebruikers
  maxBuildings: 1, // 1 gebouw
  maxIncidentsPerMonth: 10, // 10 incidenten per maand
  maxNfcTags: 10, // 10 NFC tags
  maxStorageGB: 1, // 1GB opslag
  features: [
    "Basis plotkaart weergave",
    "Gebruikersbeheer (max 5)",
    "Basis incident registratie",
    "Email notificaties",
    "Basis rapportages",
    "Mobiele app toegang",
    "Community support",
  ],
  restrictions: [
    "Geen real-time tracking",
    "Geen geavanceerde analytics",
    "Geen API toegang",
    "Geen white-label branding",
    "Geen priority support",
    "Geen backup/restore",
    "Geen integraties",
    "Beperkte opslag",
  ],
}

export const PREMIUM_FEATURES = [
  "Onbeperkt aantal gebruikers",
  "Meerdere gebouwen",
  "Real-time tracking & monitoring",
  "Geavanceerde analytics & dashboards",
  "API toegang & integraties",
  "White-label branding",
  "Priority support (24/7)",
  "Automatische backups",
  "ESPA 4.4.4 integratie",
  "Indoor positioning",
  "Hands-free Push-to-Talk",
  "Onbeperkte opslag",
  "Custom PDF schemas",
  "Advanced reporting",
  "SSO integratie",
]

export enum SubscriptionTier {
  FREE = "free",
  STARTER = "starter", // €9.99/gebruiker/maand
  PROFESSIONAL = "professional", // €19.99/gebruiker/maand
  ENTERPRISE = "enterprise", // Custom pricing
}

export interface SubscriptionPlan {
  tier: SubscriptionTier
  name: string
  description: string
  pricePerUser: number // In euro cents
  features: string[]
  limits: {
    maxUsers: number | null // null = unlimited
    maxBuildings: number | null
    maxIncidentsPerMonth: number | null
    maxNfcTags: number | null
    maxStorageGB: number | null
  }
  popular?: boolean
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    tier: SubscriptionTier.FREE,
    name: "Gratis",
    description: "Perfect om te starten met BHV management",
    pricePerUser: 0,
    features: FREE_TIER_LIMITS.features,
    limits: {
      maxUsers: 5,
      maxBuildings: 1,
      maxIncidentsPerMonth: 10,
      maxNfcTags: 10,
      maxStorageGB: 1,
    },
  },
  {
    tier: SubscriptionTier.STARTER,
    name: "Starter",
    description: "Voor kleine teams die meer functionaliteit nodig hebben",
    pricePerUser: 999, // €9.99
    features: [
      ...FREE_TIER_LIMITS.features,
      "Tot 25 gebruikers",
      "3 gebouwen",
      "Real-time notificaties",
      "Basis analytics",
      "Email support",
      "Automatische backups",
    ],
    limits: {
      maxUsers: 25,
      maxBuildings: 3,
      maxIncidentsPerMonth: 100,
      maxNfcTags: 50,
      maxStorageGB: 10,
    },
    popular: true,
  },
  {
    tier: SubscriptionTier.PROFESSIONAL,
    name: "Professional",
    description: "Voor professionele organisaties met geavanceerde behoeften",
    pricePerUser: 1999, // €19.99
    features: [
      "Onbeperkt aantal gebruikers",
      "Onbeperkt aantal gebouwen",
      "Alle geavanceerde functies",
      "API toegang",
      "Priority support",
      "White-label branding",
      "Geavanceerde analytics",
      "Custom integraties",
    ],
    limits: {
      maxUsers: null,
      maxBuildings: null,
      maxIncidentsPerMonth: null,
      maxNfcTags: null,
      maxStorageGB: 100,
    },
  },
  {
    tier: SubscriptionTier.ENTERPRISE,
    name: "Enterprise",
    description: "Voor grote organisaties met specifieke eisen",
    pricePerUser: 0, // Custom pricing
    features: [
      "Alle Professional functies",
      "Dedicated support manager",
      "On-premise deployment optie",
      "Custom ontwikkeling",
      "SLA garanties",
      "Compliance certificering",
      "Onbeperkte opslag",
    ],
    limits: {
      maxUsers: null,
      maxBuildings: null,
      maxIncidentsPerMonth: null,
      maxNfcTags: null,
      maxStorageGB: null,
    },
  },
]
