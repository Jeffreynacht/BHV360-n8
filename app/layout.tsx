import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Providers from "@/components/providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BHV360 - Professionele BHV Software",
  description: "Complete BHV software voor bedrijven. Plotkaarten, incidentenbeheer, evacuatieprocedures en meer.",
  keywords: "BHV, software, plotkaart, evacuatie, incident, bedrijfshulpverlening",
  authors: [{ name: "BHV360 Team" }],
  creator: "BHV360",
  publisher: "BHV360",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.bhv360.nl"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "BHV360 - Professionele BHV Software",
    description: "Complete BHV software voor bedrijven. Plotkaarten, incidentenbeheer, evacuatieprocedures en meer.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.bhv360.nl",
    siteName: "BHV360",
    locale: "nl_NL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BHV360 - Professionele BHV Software",
    description: "Complete BHV software voor bedrijven. Plotkaarten, incidentenbeheer, evacuatieprocedures en meer.",
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
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
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
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1f2937" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="BHV360" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#1f2937" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
