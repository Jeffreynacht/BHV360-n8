import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/contexts/auth-context"
import { CustomerProvider } from "@/components/customer-context"
import { DataProvider } from "@/contexts/data-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BHV360 - Professional Safety Management",
  description: "Complete BHV and safety management solution for organizations",
  keywords: "BHV, safety, emergency, management, plotkaart, evacuation",
  authors: [{ name: "BHV360 Team" }],
    generator: 'v0.dev'
}

export function generateViewport() {
  return {
    width: "device-width",
    initialScale: 1,
  }
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
