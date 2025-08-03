import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from "@/contexts/auth-context"
import { DataProvider } from "@/contexts/data-context"
import { CustomerProvider } from "@/components/customer-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BHV360 - Professional Safety Management Platform",
  description:
    "Het meest geavanceerde BHV management platform van Nederland. Real-time monitoring, intelligente rapportages en naadloze integratie.",
  keywords: "BHV, veiligheid, management, plotkaart, incidenten, EHBO, AED, emergency, safety",
  icons: {
    icon: "/images/bhv360-logo.png",
    apple: "/images/bhv360-logo.png",
  },
  openGraph: {
    title: "BHV360 - Professional Safety Management Platform",
    description: "Transformeer uw veiligheidsorganisatie met het meest geavanceerde BHV platform van Nederland.",
    images: ["/images/bhv360-logo.png"],
  },
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <CustomerProvider>
              <DataProvider>
                {children}
                <Toaster />
              </DataProvider>
            </CustomerProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
