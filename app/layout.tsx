import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BHV360 - Professionele BHV Plotkaart Software",
  description:
    "Maak professionele BHV plotkaarten, beheer evacuatieprocedures en zorg voor optimale veiligheid in uw organisatie. Volledig compliant met Nederlandse BHV-wetgeving.",
  keywords: "BHV, plotkaart, evacuatie, veiligheid, software, Nederland, compliance",
  authors: [{ name: "BHV360 Team" }],
  creator: "BHV360",
  publisher: "BHV360",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://bhv360.nl"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "BHV360 - Professionele BHV Plotkaart Software",
    description:
      "Maak professionele BHV plotkaarten, beheer evacuatieprocedures en zorg voor optimale veiligheid in uw organisatie.",
    url: "/",
    siteName: "BHV360",
    locale: "nl_NL",
    type: "website",
    images: [
      {
        url: "/images/bhv360-logo-full.png",
        width: 1200,
        height: 630,
        alt: "BHV360 - Professionele BHV Software",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BHV360 - Professionele BHV Plotkaart Software",
    description:
      "Maak professionele BHV plotkaarten, beheer evacuatieprocedures en zorg voor optimale veiligheid in uw organisatie.",
    images: ["/images/bhv360-logo-full.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#059669" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="BHV360" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#059669" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
