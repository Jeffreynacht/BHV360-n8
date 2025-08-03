"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  Users,
  MapPin,
  AlertTriangle,
  Building2,
  Heart,
  Video,
  CheckCircle,
  Star,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function LandingPage() {
  const { user } = useAuth()
  const router = useRouter()

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (user) {
      router.push("/dashboard")
    }
  }, [user, router])

  const features = [
    {
      icon: Shield,
      title: "BHV Management",
      description: "Complete BHV organisatie en coördinatie met real-time status updates",
      color: "text-red-600",
      demo: "Bekijk live BHV status dashboard",
      demoUrl: "/demo/bhv-status",
    },
    {
      icon: MapPin,
      title: "Interactieve Plotkaarten",
      description: "Digitale veiligheidsplattegronden met drag & drop editor",
      color: "text-blue-600",
      demo: "Probeer de plotkaart editor",
      demoUrl: "/demo/plotkaart-editor",
    },
    {
      icon: AlertTriangle,
      title: "Incident Management",
      description: "Snelle registratie en automatische escalatie van incidenten",
      color: "text-orange-600",
      demo: "Simuleer een noodmelding",
      demoUrl: "/demo/incident-simulator",
    },
    {
      icon: Users,
      title: "Gebruikersbeheer",
      description: "Geavanceerd rollenbeleid en certificering tracking",
      color: "text-green-600",
      demo: "Bekijk gebruikersrollen",
      demoUrl: "/demo/gebruikers-demo",
    },
    {
      icon: Building2,
      title: "Multi-locatie Support",
      description: "Centraal beheer van meerdere gebouwen en vestigingen",
      color: "text-purple-600",
      demo: "Schakel tussen locaties",
      demoUrl: "/demo/multi-locatie",
    },
    {
      icon: Heart,
      title: "EHBO & AED Monitoring",
      description: "Automatische tracking van voorraad en onderhoudsschema's",
      color: "text-pink-600",
      demo: "Bekijk voorraad status",
      demoUrl: "/demo/ehbo-monitoring",
    },
  ]

  const testimonials = [
    {
      name: "Jeffrey Nachtegaal",
      role: "BHV Coördinator",
      company: "Provincie Noord-Brabant",
      content:
        "BHV360 heeft onze veiligheidsprocedures volledig getransformeerd. De real-time inzichten zijn onmisbaar.",
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

  const stats = [
    { label: "Actieve Organisaties", value: "500+", description: "Vertrouwen op BHV360" },
    { label: "BHV-ers Beheerd", value: "10,000+", description: "Gecertificeerde professionals" },
    { label: "Incidenten Afgehandeld", value: "25,000+", description: "Succesvol geregistreerd" },
    { label: "Uptime Garantie", value: "99.9%", description: "Betrouwbare service" },
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
      popular: false,
    },
  ]

  if (user) {
    return null // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Image
                src="/images/bhv360-logo.png"
                alt="BHV360 Logo"
                width={48}
                height={48}
                className="rounded-lg shadow-sm"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">BHV360</h1>
                <p className="text-sm text-gray-600">Professional Safety Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/demo/overview">
                <Button variant="outline">Live Demo</Button>
              </Link>
              <Link href="/login">
                <Button>Inloggen</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-4">
              🚀 Nieuw: AI-powered incident detectie
            </Badge>
            <h1 className="text-6xl font-bold text-gray-900 mb-6">
              De toekomst van{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">
                BHV Management
              </span>{" "}
              is hier
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Transformeer uw veiligheidsorganisatie met het meest geavanceerde BHV platform van Nederland. Real-time
              monitoring, intelligente rapportages en naadloze integratie in één krachtige oplossing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/demo/overview">
                <Button size="lg" className="text-lg px-8 py-4">
                  <Video className="mr-2 h-5 w-5" />
                  Bekijk Live Demo
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="text-lg px-8 py-4 bg-transparent">
                  <Shield className="mr-2 h-5 w-5" />
                  Start Gratis Trial
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                ISO 27001 Gecertificeerd
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                AVG Compliant
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                24/7 Nederlandse Support
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-lg font-medium text-gray-700 mb-1">{stat.label}</div>
                <div className="text-sm text-gray-500">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="demo" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">Alles wat u nodig heeft</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Een complete, geïntegreerde oplossing die alle aspecten van BHV management samenbrengt in één intuïtief
              platform.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <Card
                  key={index}
                  className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
                        <IconComponent className={`h-7 w-7 ${feature.color}`} />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-base mb-4 leading-relaxed">{feature.description}</CardDescription>
                    <Link href={feature.demoUrl}>
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 p-0">
                        {feature.demo} <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Wat onze klanten zeggen</h2>
            <p className="text-xl text-blue-100">Ontdek waarom organisaties kiezen voor BHV360</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardHeader>
                  <div className="flex items-center space-x-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardDescription className="text-blue-100 text-base leading-relaxed">
                    "{testimonial.content}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-blue-200">{testimonial.role}</div>
                  <div className="text-sm text-blue-300">{testimonial.company}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Transparante prijzen</h2>
            <p className="text-xl text-gray-600">Kies het plan dat perfect past bij uw organisatie</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`relative ${plan.popular ? "ring-2 ring-blue-500 shadow-xl scale-105" : "shadow-lg"}`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">
                    Meest Populair
                  </Badge>
                )}
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-500">{plan.period}</span>
                  </div>
                  <CardDescription className="mt-2">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={plan.price === "Op maat" ? "/contact" : "/login"}>
                    <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                      {plan.price === "Op maat" ? "Contact Opnemen" : "Start Gratis Trial"}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-orange-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Klaar voor de volgende stap?</h2>
          <p className="text-xl text-red-100 mb-8">
            Sluit u aan bij honderden organisaties die hun veiligheid hebben getransformeerd met BHV360. Start vandaag
            nog met een gratis 30-dagen trial.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                Start Gratis Trial
              </Button>
            </Link>
            <Link href="/demo/overview">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-4 text-white border-white hover:bg-white hover:text-red-600 bg-transparent"
              >
                <Video className="mr-2 h-5 w-5" />
                Bekijk Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <Image src="/images/bhv360-logo.png" alt="BHV360 Logo" width={40} height={40} className="rounded" />
                <span className="text-2xl font-bold">BHV360</span>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Het meest geavanceerde BHV management platform van Nederland. Ontwikkeld door veiligheidsprofessionals,
                voor veiligheidsprofessionals.
              </p>
              <div className="flex space-x-4">
                <Badge variant="secondary">ISO 27001</Badge>
                <Badge variant="secondary">AVG Compliant</Badge>
                <Badge variant="secondary">Made in NL</Badge>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-lg">Platform</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link href="/demo/overview" className="hover:text-white transition-colors">
                    Live Demo
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-white transition-colors">
                    Inloggen
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-white transition-colors">
                    Prijzen
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="hover:text-white transition-colors">
                    API Documentatie
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-lg">Support</h3>
              <ul className="space-y-3 text-gray-400">
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
                  <Link href="/help" className="hover:text-white transition-colors">
                    Training
                  </Link>
                </li>
                <li>
                  <Link href="/debug" className="hover:text-white transition-colors">
                    Status Pagina
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">&copy; 2024 BHV360. Alle rechten voorbehouden.</p>
            <div className="flex space-x-6 text-gray-400">
              <Link href="/help" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/help" className="hover:text-white transition-colors">
                Voorwaarden
              </Link>
              <Link href="/help" className="hover:text-white transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
