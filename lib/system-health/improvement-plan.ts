export interface ImprovementPlan {
  priority: "high" | "medium" | "low"
  category: "performance" | "security" | "reliability" | "usability" | "maintainability"
  title: string
  description: string
  estimatedHours: number
  dependencies: string[]
  acceptanceCriteria: string[]
}

export const improvementPlan: ImprovementPlan[] = [
  {
    priority: "high",
    category: "performance",
    title: "Database Query Optimalisatie",
    description: "Optimaliseer langzame queries en voeg ontbrekende indexes toe",
    estimatedHours: 16,
    dependencies: [],
    acceptanceCriteria: [
      "Alle queries < 100ms response tijd",
      "Database indexes voor alle foreign keys",
      "Query execution plan analyse",
    ],
  },
  {
    priority: "high",
    category: "security",
    title: "Security Headers Implementatie",
    description: "Implementeer alle vereiste security headers voor productie",
    estimatedHours: 8,
    dependencies: [],
    acceptanceCriteria: [
      "CSP header geconfigureerd",
      "HSTS header actief",
      "X-Frame-Options ingesteld",
      "Security scan 100% groen",
    ],
  },
  {
    priority: "high",
    category: "reliability",
    title: "Error Handling Standaardisatie",
    description: "Implementeer consistente error handling across alle componenten",
    estimatedHours: 24,
    dependencies: [],
    acceptanceCriteria: [
      "Alle API endpoints hebben error handling",
      "Frontend error boundaries geïmplementeerd",
      "Error logging naar monitoring systeem",
      "User-friendly error messages",
    ],
  },
  {
    priority: "medium",
    category: "maintainability",
    title: "API Documentatie",
    description: "Genereer complete OpenAPI/Swagger documentatie",
    estimatedHours: 12,
    dependencies: [],
    acceptanceCriteria: [
      "OpenAPI 3.0 spec gegenereerd",
      "Alle endpoints gedocumenteerd",
      "Request/response schemas gedefinieerd",
      "Interactive API explorer beschikbaar",
    ],
  },
  {
    priority: "medium",
    category: "reliability",
    title: "Monitoring & Alerting Setup",
    description: "Implementeer production monitoring en alerting",
    estimatedHours: 20,
    dependencies: ["Error Handling Standaardisatie"],
    acceptanceCriteria: [
      "Application Performance Monitoring (APM)",
      "Error tracking en alerting",
      "Uptime monitoring",
      "Performance metrics dashboard",
    ],
  },
  {
    priority: "medium",
    category: "performance",
    title: "Caching Strategie",
    description: "Implementeer caching op verschillende niveaus",
    estimatedHours: 16,
    dependencies: ["Database Query Optimalisatie"],
    acceptanceCriteria: [
      "Redis cache voor sessies",
      "API response caching",
      "Static asset caching",
      "Database query result caching",
    ],
  },
  {
    priority: "low",
    category: "usability",
    title: "Progressive Web App Features",
    description: "Voeg PWA functionaliteit toe voor offline gebruik",
    estimatedHours: 32,
    dependencies: ["Caching Strategie"],
    acceptanceCriteria: [
      "Service Worker geïmplementeerd",
      "Offline functionaliteit",
      "App installeerbaar",
      "Background sync voor kritieke data",
    ],
  },
  {
    priority: "low",
    category: "maintainability",
    title: "Automated Testing Suite",
    description: "Uitbreiding van geautomatiseerde test coverage",
    estimatedHours: 40,
    dependencies: ["API Documentatie"],
    acceptanceCriteria: [
      "90%+ code coverage",
      "End-to-end tests voor kritieke flows",
      "Performance regression tests",
      "Automated accessibility testing",
    ],
  },
]

export function calculateTotalEffort(): {
  totalHours: number
  byPriority: Record<string, number>
  byCategory: Record<string, number>
} {
  const totalHours = improvementPlan.reduce((sum, item) => sum + item.estimatedHours, 0)

  const byPriority = improvementPlan.reduce(
    (acc, item) => {
      acc[item.priority] = (acc[item.priority] || 0) + item.estimatedHours
      return acc
    },
    {} as Record<string, number>,
  )

  const byCategory = improvementPlan.reduce(
    (acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.estimatedHours
      return acc
    },
    {} as Record<string, number>,
  )

  return { totalHours, byPriority, byCategory }
}
