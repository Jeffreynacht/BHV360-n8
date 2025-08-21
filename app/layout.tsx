import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BHV360 - Professionele BHV Software",
  description: "Complete BHV software oplossing voor bedrijven. Plotkaarten, incidentenbeheer, training en meer.",
  keywords: "BHV, software, plotkaart, incident, training, bedrijfshulpverlening",
  authors: [{ name: "BHV360" }],
  creator: "BHV360",
  publisher: "BHV360",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://bhv360.nl"),
  openGraph: {
    title: "BHV360 - Professionele BHV Software",
    description: "Complete BHV software oplossing voor bedrijven",
    url: "https://bhv360.nl",
    siteName: "BHV360",
    locale: "nl_NL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BHV360 - Professionele BHV Software",
    description: "Complete BHV software oplossing voor bedrijven",
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
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
