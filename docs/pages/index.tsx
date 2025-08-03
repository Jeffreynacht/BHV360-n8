import Head from "next/head"
import Link from "next/link"
import { Shield, Users, AlertTriangle, BarChart3, Smartphone, Globe } from "lucide-react"

export default function Home() {
  return (
    <>
      <Head>
        <title>BHV360 Documentation</title>
        <meta
          name="description"
          content="Complete documentatie voor BHV360 - De meest complete BHV software voor Nederlandse bedrijven"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">BHV360</h1>
                  <p className="text-sm text-gray-600">Documentation</p>
                </div>
              </div>
              <nav className="hidden md:flex space-x-8">
                <Link href="/getting-started" className="text-gray-600 hover:text-blue-600">
                  Getting Started
                </Link>
                <Link href="/api" className="text-gray-600 hover:text-blue-600">
                  API Reference
                </Link>
                <Link href="/guides" className="text-gray-600 hover:text-blue-600">
                  Guides
                </Link>
                <a href="https://github.com/jouwusername/bhv360" className="text-gray-600 hover:text-blue-600">
                  GitHub
                </a>
              </nav>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">BHV360 Documentation</h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              De complete gids voor het implementeren, configureren en gebruiken van BHV360 - de meest geavanceerde BHV
              management software voor Nederlandse bedrijven.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/getting-started"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                🚀 Quick Start
              </Link>
              <Link
                href="/demo"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-colors"
              >
                🎮 Live Demo
              </Link>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Ontdek alle mogelijkheden</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <AlertTriangle className="h-8 w-8 text-red-600" />,
                  title: "Emergency Management",
                  description: "Real-time incident tracking, multi-channel alerting en evacuatie planning",
                  link: "/guides/emergency-management",
                },
                {
                  icon: <Users className="h-8 w-8 text-blue-600" />,
                  title: "BHV Beheer",
                  description: "Certificering tracking, training scheduling en competentie management",
                  link: "/guides/bhv-management",
                },
                {
                  icon: <BarChart3 className="h-8 w-8 text-green-600" />,
                  title: "Analytics & Reporting",
                  description: "Performance dashboards, compliance rapportage en custom exports",
                  link: "/guides/analytics",
                },
                {
                  icon: <Smartphone className="h-8 w-8 text-purple-600" />,
                  title: "Mobile App",
                  description: "PWA met offline functionaliteit en push notifications",
                  link: "/guides/mobile-app",
                },
                {
                  icon: <Globe className="h-8 w-8 text-indigo-600" />,
                  title: "Multi-Tenant",
                  description: "White-label oplossing voor partners met klant isolatie",
                  link: "/guides/multi-tenant",
                },
                {
                  icon: <Shield className="h-8 w-8 text-orange-600" />,
                  title: "Security & Compliance",
                  description: "RBAC, data encryption en GDPR compliance",
                  link: "/guides/security",
                },
              ].map((feature, index) => (
                <Link key={index} href={feature.link}>
                  <div className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="flex items-center mb-4">
                      {feature.icon}
                      <h3 className="text-xl font-semibold text-gray-900 ml-3">{feature.title}</h3>
                    </div>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">🚀 Getting Started</h3>
                <p className="text-gray-600 mb-4">Installatie, configuratie en eerste setup van BHV360</p>
                <Link href="/getting-started" className="text-blue-600 hover:text-blue-800 font-medium">
                  Start hier →
                </Link>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">📖 User Guides</h3>
                <p className="text-gray-600 mb-4">Stap-voor-stap handleidingen voor alle functionaliteiten</p>
                <Link href="/guides" className="text-blue-600 hover:text-blue-800 font-medium">
                  Bekijk guides →
                </Link>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">🔧 API Reference</h3>
                <p className="text-gray-600 mb-4">Complete API documentatie voor developers</p>
                <Link href="/api" className="text-blue-600 hover:text-blue-800 font-medium">
                  API docs →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center mb-4">
                  <Shield className="h-6 w-6 text-blue-400 mr-2" />
                  <span className="text-lg font-semibold">BHV360</span>
                </div>
                <p className="text-gray-400">De meest complete BHV software voor Nederlandse bedrijven</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Documentation</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <Link href="/getting-started" className="hover:text-white">
                      Getting Started
                    </Link>
                  </li>
                  <li>
                    <Link href="/guides" className="hover:text-white">
                      User Guides
                    </Link>
                  </li>
                  <li>
                    <Link href="/api" className="hover:text-white">
                      API Reference
                    </Link>
                  </li>
                  <li>
                    <Link href="/examples" className="hover:text-white">
                      Examples
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Resources</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <a href="https://github.com/jouwusername/bhv360" className="hover:text-white">
                      GitHub
                    </a>
                  </li>
                  <li>
                    <a href="https://bhv360.vercel.app" className="hover:text-white">
                      Live Demo
                    </a>
                  </li>
                  <li>
                    <Link href="/changelog" className="hover:text-white">
                      Changelog
                    </Link>
                  </li>
                  <li>
                    <Link href="/roadmap" className="hover:text-white">
                      Roadmap
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <a href="mailto:support@bhv360.nl" className="hover:text-white">
                      Email Support
                    </a>
                  </li>
                  <li>
                    <a href="https://discord.gg/bhv360" className="hover:text-white">
                      Discord
                    </a>
                  </li>
                  <li>
                    <Link href="/faq" className="hover:text-white">
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="hover:text-white">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 BHV360. Made with ❤️ for Dutch BHV professionals.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
