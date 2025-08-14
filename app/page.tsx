"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  Users,
  MapPin,
  AlertTriangle,
  BarChart3,
  Heart,
  Building2,
  Star,
  Check,
  ArrowRight,
  Sparkles,
  Clock,
  Award,
  Globe,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const features = [
  {
    id: "bhv-management",
    title: "BHV Management",
    description: "Complete BHV organisatie en coördinatie met real-time status updates",
    icon: Shield,
    action: "Bekijk live BHV status dashboard",
    href: "/bhv",
  },
  {
    id: "plotkaarten",
    title: "Interactieve Plotkaarten",
    description: "Digitale veiligheidsplattegronden met drag & drop editor",
    icon: MapPin,
    action: "Probeer de plotkaart editor",
    href: "/plotkaart",
  },
  {
    id: "incident-management",
    title: "Incident Management",
    description: "Snelle registratie en automatische escalatie van incidenten",
    icon: AlertTriangle,
    action: "Simuleer een noodmelding",
    href: "/incidenten",
  },
  {
    id: "gebruikersbeheer",
    title: "Gebruikersbeheer",
    description: "Geavanceerd rollenbeleid en certificering tracking",
    icon: Users,
    action: "Bekijk gebruikersrollen",
    href: "/gebruikers",
  },
  {
    id: "multi-locatie",
    title: "Multi-locatie Support",
    description: "Centraal beheer van meerdere gebouwen en vestigingen",
    icon: Building2,
    action: "Schakel tussen locaties",
    href: "/beheer",
  },
  {
    id: "ehbo-monitoring",
    title: "EHBO & AED Monitoring",
    description: "Automatische tracking van voorraad en onderhoudsschema's",
    icon: Heart,
    action: "Bekijk voorraad status",
    href: "/ehbo-voorraad",
  },
  {
    id: "analytics",
    title: "Analytics",
    description: "Uitgebreide rapportages en inzichten",
    icon: BarChart3,
    action: "Bekijk rapportages",
    href: "/beheer/rapportages",
  },
]

const testimonials = [
  {
    name: "Jeffrey Nachtegaal",
    role: "BHV Coördinator",
    company: "Provincie Noord-Brabant",
    content: "BHV360 heeft onze veiligheidsprocedures volledig getransformeerd. De real-time inzichten zijn onmisbaar.",
    rating: 5,
  },
  {
    name: "Maria van der Berg",
    role: "Facility Manager",
    company: "TechCorp Nederland",
    content: "Eindelijk een platform dat alle aspecten van BHV management integreert. Zeer gebruiksvriendelijk!",
    rating: 5,
  },
  {
    name: "Pieter Janssen",
    role: "Veiligheidsadviseur",
    company: "SafetyFirst B.V.",
    content: "De automatische rapportages besparen ons uren werk per week. Absolute aanrader!",
    rating: 5,
  },
]

const pricingPlans = [
  {
    name: "Starter",
    price: "€49",
    period: "/maand",
    description: "Perfect voor kleine organisaties",
    features: [
      "Tot 50 gebruikers",
      "Basis plotkaarten",
      "Incident registratie",
      "Email ondersteuning",
      "Standaard rapportages",
    ],
    cta: "Start Gratis Trial",
    href: "/login",
    popular: false,
  },
  {
    name: "Professional",
    price: "€149",
    period: "/maand",
    description: "Ideaal voor middelgrote bedrijven",
    features: [
      "Tot 250 gebruikers",
      "Geavanceerde plotkaarten",
      "Real-time monitoring",
      "Telefoon ondersteuning",
      "Custom rapportages",
      "API integraties",
      "Multi-locatie support",
    ],
    cta: "Start Gratis Trial",
    href: "/login",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Op maat",
    period: "",
    description: "Voor grote organisaties",
    features: [
      "Onbeperkt gebruikers",
      "White-label oplossing",
      "Dedicated support",
      "Custom ontwikkeling",
      "SLA garanties",
      "On-premise optie",
      "Training & consultancy",
    ],
    cta: "Contact Opnemen",
    href: "/contact",
    popular: false,
  },
]

export default function HomePage() {
  const [currentFeature, setCurrentFeature] = useState(0)
  const [countdown, setCountdown] = useState(10)
  const router = useRouter()

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          router.push("/dashboard")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  const feature = features[currentFeature]
  const FeatureIcon = feature.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">BHV360</h1>
              <p className="text-xs text-gray-500">Professional BHV Management</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
              <Clock className="h-3 w-3 mr-1" />
              Auto-redirect in {countdown}s
            </Badge>
            <Button asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-6 bg-gradient-to-r from-blue-600 to-green-600 text-white">
            <Sparkles className="h-4 w-4 mr-2" />
            Nieuw: AI-powered incident detectie
          </Badge>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            De toekomst van <br />
            <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              BHV Management
            </span>{" "}
            is hier
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Transformeer uw veiligheidsorganisatie met het meest geavanceerde BHV platform van Nederland. Real-time
            monitoring, intelligente rapportages en naadloze integratie in één krachtige oplossing.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
              asChild
            >
              <Link href="/demo">
                <Zap className="h-5 w-5 mr-2" />
                Bekijk Live Demo
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">
                Start Gratis Trial
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center">
              <Award className="h-4 w-4 mr-2 text-green-600" />
              ISO 27001 Compliant
            </div>
            <div className="flex items-center">
              <Shield className="h-4 w-4 mr-2 text-blue-600" />
              AVG Compliant
            </div>
            <div className="flex items-center">
              <Globe className="h-4 w-4 mr-2 text-orange-600" />
              Nederlandse Support
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Actieve Organisaties</div>
              <div className="text-sm text-gray-500">Vertrouwen op BHV360</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">10,000+</div>
              <div className="text-gray-600">BHV-ers Beheerd</div>
              <div className="text-sm text-gray-500">Gecertificeerde professionals</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">25,000+</div>
              <div className="text-gray-600">Incidenten Afgehandeld</div>
              <div className="text-sm text-gray-500">Succesvol geregistreerd</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">99.9%</div>
              <div className="text-gray-600">Uptime Garantie</div>
              <div className="text-sm text-gray-500">Betrouwbare service</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Alles wat u nodig heeft</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Een complete, geïntegreerde oplossing die alle aspecten van BHV management samenbrengt in één intuïtief
              platform.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Feature Display */}
            <div className="order-2 lg:order-1">
              <Card className="p-8 border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-green-50">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                      <FeatureIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl text-gray-900">{feature.title}</CardTitle>
                    </div>
                  </div>
                  <CardDescription className="text-lg text-gray-600">{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                    asChild
                  >
                    <Link href={feature.href}>
                      {feature.action}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Feature List */}
            <div className="order-1 lg:order-2 space-y-4">
              {features.map((feat, index) => {
                const Icon = feat.icon
                return (
                  <div
                    key={feat.id}
                    className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                      index === currentFeature
                        ? "bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-lg"
                        : "bg-white hover:bg-gray-50 border border-gray-200"
                    }`}
                    onClick={() => setCurrentFeature(index)}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`h-5 w-5 ${index === currentFeature ? "text-white" : "text-gray-600"}`} />
                      <div>
                        <h3 className={`font-semibold ${index === currentFeature ? "text-white" : "text-gray-900"}`}>
                          {feat.title}
                        </h3>
                        <p className={`text-sm ${index === currentFeature ? "text-blue-100" : "text-gray-600"}`}>
                          {feat.description}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Wat onze klanten zeggen</h2>
            <p className="text-xl text-gray-600">Ontdek waarom organisaties kiezen voor BHV360</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 bg-white">
                <CardContent className="pt-0">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-gray-700 mb-4">"{testimonial.content}"</blockquote>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                    <div className="text-sm text-blue-600">{testimonial.company}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Transparante prijzen</h2>
            <p className="text-xl text-gray-600">Kies het plan dat perfect past bij uw organisatie</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? "border-2 border-blue-500 shadow-lg" : ""}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-green-600 text-white">
                    Meest Populair
                  </Badge>
                )}
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="text-3xl font-bold text-gray-900">
                    {plan.price}
                    <span className="text-lg font-normal text-gray-600">{plan.period}</span>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <Check className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${plan.popular ? "bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700" : ""}`}
                    variant={plan.popular ? "default" : "outline"}
                    asChild
                  >
                    <Link href={plan.href}>{plan.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Klaar voor de volgende stap?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Sluit u aan bij honderden organisaties die hun veiligheid hebben getransformeerd met BHV360. Start vandaag
            nog met een gratis 30-dagen trial.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" asChild>
              <Link href="/login">
                Start Gratis Trial
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
              asChild
            >
              <Link href="/demo">Bekijk Demo</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">BHV360</span>
              </div>
              <p className="text-gray-400 mb-4">
                Het meest geavanceerde BHV management platform van Nederland. Ontwikkeld door veiligheidsprofessionals,
                voor veiligheidsprofessionals.
              </p>
              <div className="flex space-x-4 text-sm">
                <Badge variant="outline" className="border-green-600 text-green-400">
                  <Award className="h-3 w-3 mr-1" />
                  ISO 27001 Compliant
                </Badge>
                <Badge variant="outline" className="border-blue-600 text-blue-400">
                  <Shield className="h-3 w-3 mr-1" />
                  AVG Compliant
                </Badge>
                <Badge variant="outline" className="border-orange-600 text-orange-400">
                  <Globe className="h-3 w-3 mr-1" />
                  Made in NL
                </Badge>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/demo" className="hover:text-white transition-colors">
                    Live Demo
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-white transition-colors">
                    Inloggen
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-white transition-colors">
                    Prijzen
                  </Link>
                </li>
                <li>
                  <Link href="/api" className="hover:text-white transition-colors">
                    API Documentatie
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white transition-colors">
                    Helpcentrum
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/training" className="hover:text-white transition-colors">
                    Training
                  </Link>
                </li>
                <li>
                  <Link href="/status" className="hover:text-white transition-colors">
                    Status Pagina
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <div className="space-y-2 text-gray-400">
                <p>Email: info@bhv360.nl</p>
                <p>Telefoon: +31 (0)85 130 5000</p>
                <p>
                  Adres: Wilhelminalaan 1<br />
                  5611 HB Eindhoven
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© 2024 BHV360. Alle rechten voorbehouden.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                Voorwaarden
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
