import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BHV360 - Professionele BHV Software",
  description:
    "Complete BHV management oplossing met interactieve plattegronden, incident tracking en compliance monitoring voor moderne organisaties.",
  keywords: "BHV, bedrijfshulpverlening, veiligheid, plotkaarten, incident management, compliance",
  authors: [{ name: "BHV360 Team" }],
  creator: "BHV360",
  publisher: "BHV360",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "nl_NL",
    url: "https://bhv360.nl",
    title: "BHV360 - Professionele BHV Software",
    description: "Complete BHV management oplossing voor moderne organisaties",
    siteName: "BHV360",
  },
  twitter: {
    card: "summary_large_image",
    title: "BHV360 - Professionele BHV Software",
    description: "Complete BHV management oplossing voor moderne organisaties",
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#10b981",
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
        <meta name="msapplication-TileColor" content="#10b981" />
        <meta name="theme-color" content="#10b981" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
